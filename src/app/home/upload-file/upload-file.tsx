/** biome-ignore-all lint/a11y/useKeyWithClickEvents: porque sim */

import { useQueryClient } from "@tanstack/react-query";
import { FileUp } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Card } from "#/app/components/ui/card";
import { Input } from "#/app/components/ui/input";
import { Progress } from "#/app/components/ui/progress";
import { createFile } from "#/server/create-file";

function UploadFile() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        // Remove data URL prefix (e.g., "data:image/png;base64,")
        const base64Content = base64String.split(",")[1];
        resolve(base64Content);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const calculateHash = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setIsUploading(true);
    setUploadProgress(30);

    try {
      // Calculate hash and convert to base64 in parallel
      const [hash, base64Value] = await Promise.all([
        calculateHash(uploadedFile),
        fileToBase64(uploadedFile),
      ]);

      setUploadProgress(60);

      // Call the server function to save the file
      const response = await createFile({
        data: {
          cmd: "put_req",
          file: uploadedFile.name,
          hash: hash,
          value: base64Value,
        },
      });

      setUploadProgress(100);

      if (response.status !== "ok") {
        toast.error("Erro ao enviar arquivo.");
        console.error("Failed to upload file");
      }
    } catch (error) {
      toast.error(
        "Erro ao enviar arquivo:" +
          (error instanceof Error ? error?.message : "")
      );
      console.error("Error uploading file:", error);
    } finally {
      queryClient.invalidateQueries({ queryKey: ["all-files"] });
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  const handleSelectFile = () => {
    fileInputRef.current?.click();
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

        <button
          type="button"
          onClick={handleSelectFile}
          className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-accent transition-colors"
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
        </button>

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
