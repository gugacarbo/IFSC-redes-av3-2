import { DownloadIcon, FileTextIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import type { FileType } from "#/db/schema";
import { Button } from "#/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "#/app/components/ui/card";
import { Skeleton } from "#/app/components/ui/skeleton";

import {
  formatDate,
  formatFileSize,
  getFileIcon,
  getFileType,
} from "#/app/lib/utils";
import { UploadProgress } from "./components/upload-progress";
import { useUploadFile } from "./hooks/use-upload-file";
import { EmptyFiles } from "./components/empty-files";
import { PreviewFile } from "./components/preview-file";
import { SearchFile } from "./components/search-file";
import { DragHere } from "./components/drag-here";
import { OffsetPagination } from "#/app/components/offset-pagination";

interface FileListProps {
  files: FileType[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  searchQuery?: string;
  onSearchChange: (value: string) => void;
  isLoading: boolean;
  isFetching: boolean;
}

function FileList({
  files,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  searchQuery,
  onSearchChange,
  isLoading,
  isFetching,
}: FileListProps) {
  const showSkeleton = isLoading && files.length === 0;
  const isStale = isFetching && files.length > 0;

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
      <SearchFile value={searchQuery} onChange={onSearchChange} />

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
              onPageChange={onPageChange}
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
