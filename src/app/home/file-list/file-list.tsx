import { DownloadIcon, FileTextIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { Button } from "#/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "#/app/components/ui/card";
import {
  formatDate,
  formatFileSize,
  getFileIcon,
  getFileType,
} from "#/app/lib/utils";
import type { FileType } from "#/db/schema";
import { UploadProgress } from "./upload-progress";
import { useUploadFile } from "./hooks/use-upload-file";
import { EmptyFiles } from "./empty-files";
import { PreviewFile } from "./preview-file";
import { SearchFile } from "./search-file";
import { DragHere } from "./drag-here";

function FileList({ files }: { files: FileType[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);

  const filteredFiles = files.filter((file) =>
    file.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const {
    isUploading,
    uploadProgress,
    getRootProps,
    getInputProps,
    isDragActive,
    open,
    isFileDialogActive
  } = useUploadFile();

  const deleteFile = (_: number) => {};

  return (
    <>
      <SearchFile value={searchQuery} onChange={setSearchQuery} />

      <Card {...getRootProps()} className="relative ">
        <DragHere isDragActive={isDragActive} />
        <CardHeader className="flex items-center justify-between border-b ">
          <div>
            <CardTitle>Arquivos</CardTitle>
            <p className="text-sm text-muted-foreground">
              {filteredFiles.length} arquivos
            </p>
          </div>
          <Button onClick={open} variant="default" disabled={isFileDialogActive}>
            Adicionar Arquivo
          </Button>
        </CardHeader>
        <input {...getInputProps()} />
        <CardContent>
          {isUploading && <UploadProgress progress={uploadProgress} />}

          {/* File Items */}
          {filteredFiles.length === 0 ? (
            <EmptyFiles />
          ) : (
            <div className="space-y-3">
              {filteredFiles.map((file) => (
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
        </CardContent>
      </Card>
      {selectedFile && (
        <PreviewFile file={selectedFile} close={() => setSelectedFile(null)} />
      )}
    </>
  );
}
export { FileList };
