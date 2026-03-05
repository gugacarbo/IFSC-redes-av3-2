import { createServerFn } from "@tanstack/react-start";

import { type PUT_RESP, putReqSchema } from "#/@types/command";
import { putFile, validateFileInput } from "#/services/file-service";

export const createFile = createServerFn({
	method: "POST",
})
	.inputValidator(putReqSchema)
	.handler(async ({ data }): Promise<PUT_RESP> => {
		try {
			const validatedInput = await validateFileInput(data);

			await putFile(validatedInput);

			return {
				cmd: "put_resp",
				file: validatedInput.fileName,
				status: "ok",
			};
		} catch (error) {
			console.error("Error saving file:\n", error);

			return {
				cmd: "put_resp",
				file: data.file,
				status: "fail",
			};
		}
	});
