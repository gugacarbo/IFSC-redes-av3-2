import type { FileType } from "#/@types/file";
import { Button } from "#/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "#/app/components/ui/card";
import { formatDate, formatFileSize, getFileIcon } from "#/app/lib/utils";
import { DownloadIcon, FileTextIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { SearchFile } from "./search-file";
import { PreviewFile } from "./preview-file";
import { EmptyFiles } from "./empty-files";

function FileList({
  deleteFile,
  files,
}: {
  deleteFile: (id: number) => void;
  files: FileType[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);

  const filteredFiles = files.filter((file) =>
    file.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <SearchFile value={searchQuery} onChange={setSearchQuery} />

      <Card>
        <CardHeader className="flex items-center justify-between border-b ">
          <CardTitle>Arquivos</CardTitle>
          <p className="text-sm text-muted-foreground">
            {filteredFiles.length} arquivos
          </p>
        </CardHeader>
        <CardContent>
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
                      {getFileIcon(file.type)}
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
