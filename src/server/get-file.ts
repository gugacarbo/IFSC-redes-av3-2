import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { GET_RESP } from "#/@types/command";
import { getFileById } from "#/services/file-service";

const getFileParamsSchema = z.object({
	id: z.number(),
});

export const getFileFn = createServerFn({
	method: "GET",
})
	.inputValidator(getFileParamsSchema)
	.handler(async ({ data }): Promise<GET_RESP | null> => {
		try {
			const result = await getFileById(data.id);
			return result;
		} catch (error) {
			console.error("Error getting file:\n", error);
			return null;
		}
	});
