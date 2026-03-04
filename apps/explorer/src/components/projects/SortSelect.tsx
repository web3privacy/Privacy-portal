"use client";

import { useQueryState } from "nuqs";
import { projectsSearchParams } from "@/types/projectFilters";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

type SortOption = "relevance" | "name_asc" | "name_desc";

const options: Array<{ value: SortOption; label: string }> = [
  { value: "relevance", label: "By relevance" },
  { value: "name_asc", label: "Name (A-Z)" },
  { value: "name_desc", label: "Name (Z-A)" },
];

export function SortSelect() {
  const [sortBy, setSortBy] = useQueryState(
    "sortBy",
    projectsSearchParams.sortBy.withOptions({ shallow: false })
  );
  const [sortOrder, setSortOrder] = useQueryState(
    "sortOrder",
    projectsSearchParams.sortOrder.withOptions({ shallow: false })
  );

  const current: SortOption =
    sortBy === "percentage" && sortOrder === "desc"
      ? "relevance"
      : sortBy === "name" && sortOrder === "asc"
        ? "name_asc"
        : sortBy === "name" && sortOrder === "desc"
          ? "name_desc"
          : "relevance";

  return (
    <div className="inline-flex items-center gap-2">
      <span className="hidden text-[12px] font-bold uppercase tracking-[0.08em] text-black/55 dark:text-white/55 md:inline">
        Sort
      </span>
      <div className="relative">
        <select
          value={current}
          onChange={(e) => {
            const next = e.target.value as SortOption;
            if (next === "relevance") {
              void setSortBy("percentage");
              void setSortOrder("desc");
              return;
            }
            if (next === "name_asc") {
              void setSortBy("name");
              void setSortOrder("asc");
              return;
            }
            void setSortBy("name");
            void setSortOrder("desc");
          }}
          className={cn(
            "h-10 appearance-none rounded-[10px] border border-black/15 bg-white px-3 pr-9 text-[12px] font-bold uppercase tracking-[0.08em] text-black outline-none",
            "hover:bg-black/[0.02] focus:border-black/35",
            "dark:border-white/15 dark:bg-[#151a21] dark:text-[#f2f4f6] dark:hover:bg-white/[0.04] dark:focus:border-white/35"
          )}
          aria-label="Sort projects"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <Icon
          name="expand_more"
          size={18}
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-black/55 dark:text-white/60"
        />
      </div>
    </div>
  );
}
