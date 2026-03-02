import type { FileType } from "#/@types/file";
import { Card } from "#/app/components/ui/card";
import { Input } from "#/app/components/ui/input";

import { Progress } from "#/app/components/ui/progress";
import { FileUp } from "lucide-react";
import { useState, useRef } from "react";

function UploadFile({ addFile }: { addFile: (file: FileType) => void }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            // Add new file to the list
            const newFile = {
              id: new Date().getMilliseconds(),
              fileName: uploadedFile.name,
              hash: Math.random().toString(36).substring(2, 15),
              size: uploadedFile.size,
              path: `/files/${uploadedFile.name}`,
              createdAt: new Date(),
              type: uploadedFile.type.includes("image")
                ? "image"
                : uploadedFile.type.includes("video")
                  ? "video"
                  : uploadedFile.type.includes("audio")
                    ? "audio"
                    : uploadedFile.name.includes(".pdf")
                      ? "pdf"
                      : "unknown",
            };
            addFile(newFile);
            return 0;
          }
          return prev + Math.random() * 10;
        });
      }, 200);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Upload Arquivos</h2>
          <p className="text-sm text-muted-foreground">
            Arraste e solte arquivos ou clique para selecionar
          </p>
        </div>

        <div
          className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-accent transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <FileUp className="h-12 w-12 text-muted-foreground" />
          <div className="text-center">
            <p className="font-medium">Clique para enviar</p>
            <p className="text-sm text-muted-foreground">
              ou arraste e solte aqui
            </p>
          </div>
          <Input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
            multiple
          />
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Enviando arquivo...</span>
              <span className="text-sm text-muted-foreground">
                {Math.round(uploadProgress)}%
              </span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}
      </div>
    </Card>
  );
}
export { UploadFile };
