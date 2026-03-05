import { createServerFn } from "@tanstack/react-start";
import { type FileStats, filesStats } from "#/services/file-service";

export const filesStatsFn = createServerFn({
  method: "GET",
}).handler(async (): Promise<FileStats> => {
  return await filesStats();
});
