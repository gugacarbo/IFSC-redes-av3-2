import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { createFile } from "#/server/create-file";
import { calculateHash, fileToBase64 } from "../lib/file-utils";
import { useDropzone } from "react-dropzone";

export function useUploadFile() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const queryClient = useQueryClient();

  const handleFileUpload = async (uploadedFile: File) => {
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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    handleFileUpload(acceptedFiles[0]);
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    open,
    isFileDialogActive,
  } = useDropzone({
    onDrop,
    noClick: true,
  });

  return {
    isUploading,
    uploadProgress,
    getRootProps,
    getInputProps,
    isDragActive,
    open,
    isFileDialogActive,
  };
}
