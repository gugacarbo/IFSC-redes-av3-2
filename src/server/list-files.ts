import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { LIST_RESP } from "#/@types/command";
import { countFiles, listFiles } from "#/services/file-service";

const listFilesParamsSchema = z.object({
  offset: z.number().optional().default(0),
  limit: z.number().optional().default(10),
});

export const listFilesFn = createServerFn({
  method: "GET",
})
  .inputValidator(listFilesParamsSchema)
  .handler(async ({ data }): Promise<LIST_RESP> => {
    const offset = data?.offset ?? 0;
    const limit = data?.limit ?? 10;

    try {
      const [filesList, total] = await Promise.all([
        listFiles(offset, limit),
        countFiles(),
      ]);

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
