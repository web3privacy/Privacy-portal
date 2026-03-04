"use client";

import { FormEvent, useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/icon";
import {
  autoScrollWithFrame,
  scrollToProjectsSection,
} from "@/lib/scroll-utils";
import { projectsSearchParams } from "@/types/projectFilters";
import { useQueryState } from "nuqs";

export default function SearchInput() {
  const [query, setQuery] = useQueryState(
    "q",
    projectsSearchParams.q.withOptions({ shallow: false })
  );
  const [, setPage] = useQueryState(
    "page",
    projectsSearchParams.page.withOptions({ shallow: false })
  );
  const [searchValue, setSearchValue] = useState(query ?? "");

  useEffect(() => {
    setSearchValue(query ?? "");
  }, [query]);

  // If user clears the input, reset the search immediately (and go back to page 1).
  useEffect(() => {
    if ((searchValue ?? "").trim().length !== 0) return;
    if ((query ?? "").trim().length === 0) return;
    void setPage(1);
    // nuqs supports `null` to remove the param, but the parser defaults it to "".
    void (setQuery as unknown as (v: string | null) => void)(null);
  }, [query, searchValue, setPage, setQuery]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const normalized = (searchValue ?? "").trim();
    void setPage(1);
    void (setQuery as unknown as (v: string | null) => void)(
      normalized ? normalized : null
    );

    // Only scroll when searching for something (not when clearing).
    if (normalized) {
      // Auto-scroll to projects section after search
      autoScrollWithFrame(() => scrollToProjectsSection());
    }
  };

  return (
    <div className="*:not-first:mt-2">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Input
            name="q"
            className="peer ps-9 pe-9 bg-white/70 border-black/15 placeholder:text-black/40 text-black dark:bg-[#151a21] dark:border-white/15 dark:placeholder:text-white/35 dark:text-[#f2f4f6]"
            placeholder="Search project"
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
            <Icon name="search" size={18} />
          </div>
          <button
            className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Submit search"
            type="submit"
          >
            <Icon name="arrow_right_alt" size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
