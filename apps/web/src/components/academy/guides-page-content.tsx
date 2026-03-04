"use client";

import { useMemo, useState } from "react";
import type { Guide } from "@/types/academy";
import { GuidesSection } from "./guides-section";

type Props = {
  guides: Guide[];
};

export function GuidesPageContent({ guides }: Props) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return guides;
    const q = search.toLowerCase();
    return guides.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q)
    );
  }, [guides, search]);

  return (
    <main className="min-h-screen bg-white text-[#121212] dark:bg-[#0f1318] dark:text-[#f2f4f6]">
      <div className="viewport-range-shell mx-auto w-full max-w-[1140px] px-4 py-10 md:px-6 lg:max-w-[75vw]">
        <h1 className="font-serif text-[26px] md:text-[30px] font-bold text-black dark:text-[#f2f4f6] mb-4">
          All Guides
        </h1>
        
        {/* Search */}
        <div className="mb-6">
          <label className="relative block w-full md:max-w-[320px]">
            <input
              type="text"
              placeholder="Search guides"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-[8px] border border-transparent bg-white px-4 pr-10 text-[14px] text-black outline-none transition-[border-color,box-shadow] placeholder:text-[#606060] focus:border-black/25 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.08)] dark:border-[#3b4048] dark:bg-[#12161d] dark:text-[#f2f4f6] dark:placeholder:text-[#95a0ae] dark:focus:border-white/20 dark:focus:shadow-[0_0_0_3px_rgba(255,255,255,0.08)]"
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-black/70 dark:text-[#c6ccd6]">
              <span className="material-symbols-rounded block text-[18px] leading-none">
                search
              </span>
            </span>
          </label>
        </div>

        <GuidesSection guides={filtered} />
      </div>
    </main>
  );
}
