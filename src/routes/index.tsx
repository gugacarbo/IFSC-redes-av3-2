import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Header } from "#/app/home/components/header";
import { Stats } from "#/app/home/components/stats/stats";
import type { FileType } from "#/db/schema";
import { FileList } from "#/app/home/components/file-list/file-list";
import { UploadFile } from "#/app/home/components/upload-file";

const mockFiles: FileType[] = [
  {
    id: 1,
    fileName: "relatorio-final.pdf",
    hash: "abc123",
    size: 2048000,
    path: "/files/relatorio-final.pdf",
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: 2,
    fileName: "foto-viagem.jpg",
    hash: "def456",
    size: 4500000,
    path: "/files/foto-viagem.jpg",
    createdAt: new Date(Date.now() - 172800000),
  },
  {
    id: 3,
    fileName: "aula-programacao.mp4",
    hash: "ghi789",
    size: 25000000,
    path: "/files/aula-programacao.mp4",
    createdAt: new Date(Date.now() - 259200000),
  },
  {
    id: 4,
    fileName: "projeto-react.zip",
    hash: "jkl012",
    size: 15000000,
    path: "/files/projeto-react.zip",
    createdAt: new Date(Date.now() - 604800000),
  },
];

export const Route = createFileRoute("/")({ component: App });

function App() {
  const [files, setFiles] = useState<FileType[]>(mockFiles);

  const handleFileDelete = (id: number) => {
    setFiles(files.filter((file) => file.id !== id));
  };

  const handleAddFile = (newFile: FileType) => {
    setFiles([newFile, ...files]);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto p-4 space-y-4">
        <Stats files={files} />
        <FileList files={files} deleteFile={handleFileDelete} />
        <UploadFile addFile={handleAddFile} />
      </main>
    </div>
  );
}
