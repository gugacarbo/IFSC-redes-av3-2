import { createHash, randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { count, like, sql, sum } from "drizzle-orm";
import type { PUT_REQ } from "#/@types/command";
import { db } from "#/db";
import { files } from "#/db/schema";
import { env } from "#/env";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function resolvePath(path: string) {
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

export async function countFiles(search = "") {
  const query = db.select({ count: count() }).from(files);

  if (search) {
    query.where(
      like(sql`lower(${files.fileName})`, `%${search.toLowerCase()}%`)
    );
  }

  const [result] = await query;
  return result?.count ?? 0;
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
