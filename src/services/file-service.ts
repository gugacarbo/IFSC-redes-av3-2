import type { PUT_REQ } from "#/@types/command";
import { db } from "#/db";
import { files } from "#/db/schema";
import { env } from "#/env";
import { createHash } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { dirname, join } from "path";

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
  const storagePath = env.STORAGE_PATH;

  const filePath = join(storagePath, fileName);

  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, content);

  await db
    .insert(files)
    .values({
      fileName: fileName,
      hash: hash,
      size: content.length,
      path: filePath,
    })
    .returning();
}
