import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Paginated } from "#/@types";
import type { LIST_RESP } from "#/@types/command";
import { countFiles, listFiles } from "#/services/file-service";

const listFilesParamsSchema = z.object({
  offset: z.number().optional().default(0),
  limit: z.number().optional().default(10),
  search: z.string().optional().default(""),
});

export const listFilesFn = createServerFn({
  method: "GET",
})
  .inputValidator(listFilesParamsSchema)
  .handler(async ({ data }): Promise<Paginated<LIST_RESP>> => {
    const offset = data?.offset ?? 0;
    const limit = data?.limit ?? 10;
    const search = data?.search ?? "";

    try {
      const [filesList, total] = await Promise.all([
        listFiles({ offset, limit, search }),
        countFiles(),
      ]);

      await new Promise((res) => setTimeout(() => res(true), 600));

      return {
        cmd: "list_resp",
        files: filesList,
        total,
        offset,
        limit,
      };
    } catch (error) {
      console.error("Error listing files:\n", error);

      return {
        cmd: "list_resp",
        files: [],
        total: 0,
        offset,
        limit,
      };
    }
  });
