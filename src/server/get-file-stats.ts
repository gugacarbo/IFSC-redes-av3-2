import { createServerFn } from "@tanstack/react-start";

import { filesStats } from "#/services/file-service";

export const getFileStatsFn = createServerFn({
	method: "GET",
}).handler(async () => {
	try {
		const stats = await filesStats();

		return {
			cmd: "stats_resp",
			...stats,
		};
	} catch (error) {
		console.error("Error getting file stats:\n", error);

		return {
			cmd: "stats_resp",
			count: 0,
			totalSize: 0,
			uploadsToday: 0,
		};
	}
});
