import { createServerFn } from "@tanstack/react-start";

import type { LIST_RESP } from "#/@types/command";
import { listFiles } from "#/services/file-service";

export const listFilesFn = createServerFn({
  method: "GET",
}).handler(async (): Promise<LIST_RESP> => {
  try {
    const filesList = await listFiles();

    return {
      cmd: "list_resp",
      files: filesList,
    };
  } catch (error) {
    console.error("Error saving file:\n", error);

    return {
      cmd: "list_resp",
      files: [],
    };
  }
});
