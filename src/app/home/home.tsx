import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { FileList } from "#/app/home/file-list/file-list";
import { Header } from "#/app/home/header";
import { Stats } from "#/app/home/stats/stats";
import { listFilesFn } from "#/server/list-files";
import { Route } from "#/routes";

const ITEMS_PER_PAGE = 10;

function Home() {
  const { limit = ITEMS_PER_PAGE, offset = 0, search } = Route.useSearch();
  const navigate = Route.useNavigate();

  const currentPage = Math.floor(offset / limit) + 1;

  const handleSetSearchQuery = (query: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        search: query || undefined,
        offset: 0,
      }),
    });
  };

  const handlePageChange = (page: number) => {
    navigate({
      search: (prev) => ({
        ...prev,
        offset: (page - 1) * limit,
      }),
    });
  };

  const { data, isLoading, isFetching, isPlaceholderData } = useQuery({
    queryKey: ["files", offset, limit, search],
    queryFn: () =>
      listFilesFn({
        data: {
          offset,
          limit,
          search,
        },
      }),
    placeholderData: (previousData) => previousData,
  });

  const totalPages = Math.ceil((data?.total || 0) / limit);

  // Redirect to last valid page if offset is beyond total results
  useEffect(() => {
    if (data && data.total > 0 && offset >= data.total) {
      const lastValidOffset = Math.max(0, (totalPages - 1) * limit);
      navigate({
        search: (prev) => ({
          ...prev,
          offset: lastValidOffset,
        }),
      });
    }
  }, [data, offset, limit, totalPages, navigate]);

  const files = data?.files || [];
  const totalItems = data?.total || 0;

  return (
    <div className="min-h-screen pb-32">
      <Header />

      <main className="container mx-auto p-4 space-y-4">
        <Stats
          files={files}
          totalItems={totalItems}
          totalSize={data?.totalSize || 0}
          isLoading={isLoading}
          isFetching={isFetching && isPlaceholderData}
        />
        <FileList
          files={files}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={totalItems}
          searchQuery={search}
          onSearchChange={handleSetSearchQuery}
          isLoading={isLoading}
          isFetching={isFetching &&isPlaceholderData}
        />
      </main>
    </div>
  );
}
export { Home };
