import { useQuery } from "@tanstack/react-query";
import { DownloadIcon, FileTextIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { OffsetPagination } from "#/app/components/offset-pagination";
import { Button } from "#/app/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "#/app/components/ui/card";
import { Skeleton } from "#/app/components/ui/skeleton";
import type { FileType } from "#/db/schema";
import {
	formatDate,
	formatFileSize,
	getFileIcon,
	getFileType,
} from "#/lib/utils";
import { Route } from "#/routes";
import { listFilesFn } from "#/server/list-files";
import { DragHere } from "./components/drag-here";
import { EmptyFiles } from "./components/empty-files";
import { PreviewFile } from "./components/preview-file";
import { SearchFile } from "./components/search-file";
import { UploadProgress } from "./components/upload-progress";
import { useUploadFile } from "./hooks/use-upload-file";

const ITEMS_PER_PAGE = 10;

function FileList() {
	const { limit = ITEMS_PER_PAGE, offset = 0, search } = Route.useSearch();
	const navigate = Route.useNavigate();

	const currentPage = Math.floor(offset / limit) + 1;

	const handleSetSearchQuery = (query: string) => {
		navigate({
			search: (prev) => ({
				...prev,
				search: query || undefined,
				offset: 0,
			}),
		});
	};

	const handlePageChange = (page: number) => {
		navigate({
			search: (prev) => ({
				...prev,
				offset: (page - 1) * limit,
			}),
		});
	};

	const { data, isLoading, isFetching, isPlaceholderData } = useQuery({
		queryKey: ["files", offset, limit, search],
		queryFn: () =>
			listFilesFn({
				data: {
					offset,
					limit,
					search,
				},
			}),
		placeholderData: (previousData) => previousData,
	});

	const totalPages = Math.ceil((data?.total || 0) / limit);

	// Redirect to last valid page if offset is beyond total results
	useEffect(() => {
		if (data && data.total > 0 && offset >= data.total) {
			const lastValidOffset = Math.max(0, (totalPages - 1) * limit);
			navigate({
				search: (prev) => ({
					...prev,
					offset: lastValidOffset,
				}),
			});
		}
	}, [data, offset, limit, totalPages, navigate]);

	const files = data?.files || [];
	const totalItems = data?.total || 0;

	const showSkeleton = isLoading && files.length === 0;
	const isStale = isFetching && isPlaceholderData && files.length > 0;

	const [selectedFile, setSelectedFile] = useState<FileType | null>(null);

	const {
		isUploading,
		uploadProgress,
		getRootProps,
		getInputProps,
		isDragActive,
		open,
		isFileDialogActive,
	} = useUploadFile();

	const deleteFile = (_: number) => {};

	return (
		<>
			<SearchFile value={search} onChange={handleSetSearchQuery} />

			<Card {...getRootProps()} className="relative">
				<DragHere isDragActive={isDragActive} />
				<CardHeader className="flex items-center justify-between border-b ">
					<div>
						<CardTitle>Arquivos</CardTitle>
						<p className="text-sm text-muted-foreground">
							{totalItems} arquivos no total
						</p>
					</div>
					<Button
						onClick={open}
						variant="default"
						disabled={isFileDialogActive}
					>
						Adicionar Arquivo
					</Button>
				</CardHeader>
				<input {...getInputProps()} />
				<CardContent>
					{showSkeleton &&
						Array.from({ length: 5 }).map((_, i) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: pq sim
								key={i}
								className="flex items-center justify-between mb-4  rounded-lg"
							>
								<div className="flex items-center gap-2 w-1/2 min-w-32">
									<Skeleton className="size-12" />
									<Skeleton className="h-10 w-full" />
								</div>
								<div className="flex gap-2">
									<Skeleton className="h-8 w-24" />
									<Skeleton className="h-8 w-20" />
									<Skeleton className="h-8 w-20" />
								</div>
							</div>
						))}
					{isUploading && <UploadProgress progress={uploadProgress} />}

					<div
						className={`transition-opacity ${
							isStale ? "opacity-50 pointer-events-none" : ""
						}`}
					>
						{!showSkeleton && files.length === 0 ? (
							<EmptyFiles />
						) : (
							<div className="space-y-3">
								{files.map((file) => (
									<div
										key={file.id}
										className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors"
									>
										<div className="flex items-center gap-3">
											<div className="p-2 bg-muted rounded-md">
												{getFileIcon(getFileType(file.path))}
											</div>
											<div>
												<p className="font-medium">{file.fileName}</p>
												<p className="text-sm text-muted-foreground">
													{formatFileSize(file.size)} •{" "}
													{formatDate(file.createdAt)}
												</p>
											</div>
										</div>
										<div className="flex items-center gap-2">
											<Button
												variant="ghost"
												size="sm"
												onClick={() => setSelectedFile(file)}
											>
												<FileTextIcon className="h-4 w-4 mr-1" />
												Preview
											</Button>
											<Button variant="ghost" size="sm">
												<DownloadIcon className="h-4 w-4 mr-1" />
												Download
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => deleteFile(file.id)}
											>
												<Trash2Icon className="h-4 w-4 mr-1" />
												Excluir
											</Button>
										</div>
									</div>
								))}
							</div>
						)}

						<OffsetPagination
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={handlePageChange}
						/>
					</div>
				</CardContent>
			</Card>
			{selectedFile && (
				<PreviewFile file={selectedFile} close={() => setSelectedFile(null)} />
			)}
		</>
	);
}
export { FileList };
