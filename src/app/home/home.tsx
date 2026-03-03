import { useQuery } from "@tanstack/react-query";
import { FileList } from "#/app/home/file-list/file-list";
import { Header } from "#/app/home/header";
import { Stats } from "#/app/home/stats/stats";
import { listFilesFn } from "#/server/list-files";

function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ["all-files"],
    queryFn: listFilesFn,
  });

  const files = data?.files || [];

  return (
    <div className="min-h-screen pb-32">
      <Header />
      {isLoading ? (
        <p>Carregando</p>
      ) : (
        <main className="container mx-auto p-4 space-y-4">
          <Stats files={files} />
          <FileList files={files} />
        </main>
      )}
    </div>
  );
}
export { Home };
