import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FileList } from "#/app/home/file-list/file-list";
import { Header } from "#/app/home/header";
import { Stats } from "#/app/home/stats/stats";
import { listFilesFn } from "#/server/list-files";

const ITEMS_PER_PAGE = 10;

function Home() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["files", currentPage],
    queryFn: () =>
      listFilesFn({
        data: {
          offset: (currentPage - 1) * ITEMS_PER_PAGE,
          limit: ITEMS_PER_PAGE,
        },
      }),
  });

  const files = data?.files || [];
  const totalItems = data?.total || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen pb-32">
      <Header />
      {isLoading ? (
        <p>Carregando</p>
      ) : (
        <main className="container mx-auto p-4 space-y-4">
          <Stats files={files} />
          <FileList
            files={files}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={totalItems}
          />
        </main>
      )}
    </div>
  );
}
export { Home };
