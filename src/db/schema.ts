import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const files = sqliteTable("files", {
  id: integer({ mode: "number" }).primaryKey({
    autoIncrement: true,
  }),
  fileName: text("file_name").notNull(),
  hash: text("hash").notNull(),
  size: integer("size").notNull(),
  path: text("path").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(unixepoch())`
  ),
});

export const fileSchema = createSelectSchema(files);
export const insertFileSchema = createInsertSchema(files);
