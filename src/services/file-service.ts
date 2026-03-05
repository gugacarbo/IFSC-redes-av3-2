import { createHash, randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { count, eq, like, sql, sum } from "drizzle-orm";
import type { GET_RESP, PUT_REQ } from "#/@types/command";
import { db } from "#/db";
import { files } from "#/db/schema";
import { env } from "#/env";

export function resolvePath(path: string) {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = dirname(__filename);

	const storagePath = env.STORAGE_PATH;

	const appRoot = join(__dirname, "..", "..");

	const rootPath = join(appRoot, storagePath);
	const filePath = join(rootPath, path);
	return filePath;
}

export async function listFiles({
	offset = 0,
	limit = 10,
	search,
}: {
	offset?: number;
	limit?: number;
	search?: string;
}) {
	const whereClause = search
		? like(sql`lower(${files.fileName})`, `%${search.toLowerCase()}%`)
		: undefined;

	const filesList = await db.query.files.findMany({
		orderBy: (fields, { desc }) => desc(fields.createdAt),
		limit,
		offset,
		where: whereClause,
	});

	return filesList;
}

export async function getTotalSize() {
	const [result] = await db.select({ total: sum(files.size) }).from(files);
	return Number(result?.total ?? "0") ?? 0;
}

export async function validateFileInput({
	file,
	hash,
	value,
}: Omit<PUT_REQ, "cmd">) {
	const fileBuffer = Buffer.from(value, "base64");

	const calculatedHash = createHash("sha256").update(fileBuffer).digest("hex");

	if (calculatedHash !== hash) {
		throw new Error("Invalid Hash");
	}

	return {
		fileName: file,
		hash: calculatedHash,
		content: fileBuffer,
	};
}

export async function putFile({
	fileName,
	hash,
	content,
}: {
	fileName: string;
	hash: string;
	content: Buffer<ArrayBuffer>;
}) {
	const randomId = randomBytes(4).toString("hex");
	const extension = extname(fileName);
	const nameWithoutExt = fileName.slice(0, fileName.length - extension.length);
	const newFilePath = `${nameWithoutExt}_${randomId}${extension}`;

	const filePath = resolvePath(newFilePath);

	await mkdir(dirname(filePath), { recursive: true });
	await writeFile(filePath, content);

	return await db
		.insert(files)
		.values({
			size: content.length,
			fileName: fileName,
			path: filePath,
			hash: hash,
		})
		.returning();
}

export async function countFiles(search = "") {
	const query = db.select({ count: count() }).from(files);

	if (search) {
		query.where(
			like(sql`lower(${files.fileName})`, `%${search.toLowerCase()}%`),
		);
	}

	const [result] = await query;
	return result?.count ?? 0;
}

export interface FileStats {
	count: number;
	totalSize: number;
	uploadsToday: number;
}

export async function filesStats(): Promise<FileStats> {
	const now = new Date();

	const startOfToday = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate(),
	);
	const startOfTodayUnix = Math.floor(startOfToday.getTime() / 1000);

	const countQuery = db.select({ count: count() }).from(files);

	const [countResult] = await countQuery;

	const sizeQuery = db.select({ total: sum(files.size) }).from(files);

	const [sizeResult] = await sizeQuery;

	const todayQuery = db
		.select({ count: count() })
		.from(files)
		.where(sql`${files.createdAt} >= ${startOfTodayUnix}`);

	const [todayResult] = await todayQuery;

	return {
		count: countResult?.count ?? 0,
		totalSize: Number(sizeResult?.total ?? "0") ?? 0,
		uploadsToday: todayResult?.count ?? 0,
	};
}

export async function getFileById(id: number): Promise<GET_RESP | null> {
	const fileRecord = await db.query.files.findFirst({
		where: eq(files.id, id),
	});

	if (!fileRecord) {
		return null;
	}

	const fileBuffer = await readFile(fileRecord.path);
	const base64Content = fileBuffer.toString("base64");

	return {
		cmd: "get_resp",
		file: fileRecord.fileName,
		hash: fileRecord.hash,
		value: base64Content,
	};
}
