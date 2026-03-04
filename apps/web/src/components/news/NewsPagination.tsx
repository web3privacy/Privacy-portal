"use client";

import { useQueryState } from "nuqs";
import { cn } from "@web3privacy/portal-ui";

type Props = {
  total: number;
  pageSize: number;
};

export function NewsPagination({ total, pageSize }: Props) {
  const [page, setPage] = useQueryState("page", {
    defaultValue: "1",
    parse: (v) => v,
  });
  const currentPage = Math.max(1, parseInt(page, 10) || 1);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  const end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
      <button
        type="button"
        onClick={() => setPage(String(Math.max(1, currentPage - 1)))}
        disabled={currentPage <= 1}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 bg-white text-black/75 transition-colors hover:bg-black/5 disabled:opacity-50 disabled:hover:bg-white dark:border-white/10 dark:bg-[#151a21] dark:text-white/75 dark:hover:bg-white/10 dark:disabled:hover:bg-[#151a21]"
        aria-label="Previous page"
      >
        <span className="material-symbols-rounded text-[20px]">chevron_left</span>
      </button>

      <div className="flex items-center gap-1">
        {start > 1 && (
          <>
            <button
              type="button"
              onClick={() => setPage("1")}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium text-black/75 hover:bg-black/5 dark:text-white/75 dark:hover:bg-white/10"
            >
              1
            </button>
            {start > 2 && <span className="px-1 text-black/40">…</span>}
          </>
        )}
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPage(String(p))}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors",
              p === currentPage
                ? "bg-[#70ff88] text-black"
                : "text-black/75 hover:bg-black/5 dark:text-white/75 dark:hover:bg-white/10"
            )}
          >
            {p}
          </button>
        ))}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="px-1 text-black/40">…</span>}
            <button
              type="button"
              onClick={() => setPage(String(totalPages))}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium text-black/75 hover:bg-black/5 dark:text-white/75 dark:hover:bg-white/10"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        type="button"
        onClick={() => setPage(String(Math.min(totalPages, currentPage + 1)))}
        disabled={currentPage >= totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 bg-white text-black/75 transition-colors hover:bg-black/5 disabled:opacity-50 disabled:hover:bg-white dark:border-white/10 dark:bg-[#151a21] dark:text-white/75 dark:hover:bg-white/10 dark:disabled:hover:bg-[#151a21]"
        aria-label="Next page"
      >
        <span className="material-symbols-rounded text-[20px]">chevron_right</span>
      </button>

      <span className="ml-4 text-sm text-black/55 dark:text-white/55">
        Page {currentPage} of {totalPages}
      </span>
    </nav>
  );
}
