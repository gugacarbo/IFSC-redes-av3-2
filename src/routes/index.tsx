import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { FileList } from "#/app/home/file-list/file-list";
import { Header } from "#/app/home/header";
import { Stats } from "#/app/home/stats/stats";
import { UploadFile } from "#/app/home/upload-file/upload-file";
import { listFilesFn } from "#/server/list-files";

// const mockFiles: FileType[] = [
//   {
//     id: 1,
//     fileName: "relatorio-final.pdf",
//     hash: "abc123",
//     size: 2048000,
//     path: "/files/relatorio-final.pdf",
//     createdAt: new Date(Date.now() - 86400000),
//   },
//   {
//     id: 2,
//     fileName: "foto-viagem.jpg",
//     hash: "def456",
//     size: 4500000,
//     path: "/files/foto-viagem.jpg",
//     createdAt: new Date(Date.now() - 172800000),
//   },
//   {
//     id: 3,
//     fileName: "aula-programacao.mp4",
//     hash: "ghi789",
//     size: 25000000,
//     path: "/files/aula-programacao.mp4",
//     createdAt: new Date(Date.now() - 259200000),
//   },
//   {
//     id: 4,
//     fileName: "projeto-react.zip",
//     hash: "jkl012",
//     size: 15000000,
//     path: "/files/projeto-react.zip",
//     createdAt: new Date(Date.now() - 604800000),
//   },
// ];

export const Route = createFileRoute("/")({ component: App });

function App() {
  const { data, isLoading } = useQuery({
    queryKey: ["all-files"],
    queryFn: listFilesFn,
  });

  const files = data?.files || [];

  return (
    <div className="min-h-screen">
      <Header />
      {isLoading ? (
        <p>Carregando</p>
      ) : (
        <main className="container mx-auto p-4 space-y-4">
          <Stats files={files} />
          <FileList files={files} />
          <UploadFile />
        </main>
      )}
    </div>
  );
}
