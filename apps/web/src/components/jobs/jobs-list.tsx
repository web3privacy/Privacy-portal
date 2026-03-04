"use client";

import { useMemo, useState } from "react";
import { JobCard } from "./job-card";
import { JobsFilters } from "./jobs-filters";
import type { Job } from "@/types/jobs";

const PAGE_SIZE = 8;

type Props = {
  jobs: Job[];
  categories: string[];
};

export function JobsList({ jobs, categories }: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string[]>([]);
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const tagOptions = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => j.tags.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [jobs]);

  const filtered = useMemo(() => {
    let result = jobs;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q)
      );
    }
    if (category.length > 0) {
      result = result.filter((j) => category.includes(j.category));
    }
    if (tagFilter.length > 0) {
      result = result.filter((j) =>
        tagFilter.some((t) => j.tags.includes(t))
      );
    }
    return result;
  }, [jobs, search, category, tagFilter]);

  const display = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visibleCount;

  return (
    <div className="viewport-range-shell mx-auto w-full max-w-[1140px] px-4 pt-6 pb-10 md:px-6 md:pt-6 lg:max-w-[75vw]">
      <div className="mb-6 -mt-6">
        <JobsFilters
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          tagFilter={tagFilter}
          onTagFilterChange={setTagFilter}
          categories={categories}
          tagOptions={tagOptions}
        />
      </div>

      <h1 className="font-serif text-[26px] md:text-[30px] font-bold text-black dark:text-[#f2f4f6] mt-6">
        {filtered.length} Privacy Jobs
      </h1>
      <p className="text-sm text-[#616161] dark:text-[#a7b0bd] mt-1">
        {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {display.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
            className="rounded-[10px] border border-[#d8d8d8] bg-white px-6 py-2.5 text-[13px] font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-[#f5f5f5] dark:border-[#2c3139] dark:bg-[#151a21] dark:text-[#f2f4f6] dark:hover:bg-[#1f252d]"
          >
            Show more
          </button>
        </div>
      )}
    </div>
  );
}
