"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FilterDropdown } from "@/components/ui/filter-dropdown";
import { AddJobForm } from "./add-job-form";
import Link from "next/link";

type Props = {
  search: string;
  onSearchChange: (v: string) => void;
  category: string[];
  onCategoryChange: (v: string[]) => void;
  tagFilter: string[];
  onTagFilterChange: (v: string[]) => void;
  categories: string[];
  tagOptions: string[];
};

export function JobsFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  tagFilter,
  onTagFilterChange,
  categories,
  tagOptions,
}: Props) {
  const [addOpen, setAddOpen] = useState(false);

  const categoryOptions = categories.map((c) => ({ value: c, label: c }));
  const tagSelectOptions = tagOptions.map((t) => ({ value: t, label: t }));

  const filterContent = (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="grid w-full grid-cols-2 gap-2 md:flex md:flex-1 md:items-center md:gap-3 md:max-w-[calc(100%-140px)]">
        <label className="relative w-full md:max-w-[240px]">
          <input
            type="text"
            placeholder="Search job"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 w-full rounded-[8px] border border-transparent bg-white px-4 pr-10 text-[14px] text-black outline-none transition-[border-color,box-shadow] placeholder:text-[#606060] focus:border-black/25 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.08)] dark:border-[#3b4048] dark:bg-[#12161d] dark:text-[#f2f4f6] dark:placeholder:text-[#95a0ae] dark:focus:border-white/20 dark:focus:shadow-[0_0_0_3px_rgba(255,255,255,0.08)]"
          />
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-black/70 dark:text-[#c6ccd6]">
            <span className="material-symbols-rounded block text-[18px] leading-none">
              search
            </span>
          </span>
        </label>
        <FilterDropdown
          value={category}
          onChange={onCategoryChange}
          options={categoryOptions}
          placeholder="All categories"
          aria-label="Category"
        />
        <FilterDropdown
          value={tagFilter}
          onChange={onTagFilterChange}
          options={tagSelectOptions}
          placeholder="Fulltime / Remote"
          aria-label="Job type"
        />
      </div>
      <div className="flex shrink-0 items-center gap-3 md:ml-auto">
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-[#70FF88] bg-[#70FF88] px-4 text-[12px] font-bold uppercase tracking-[0.08em] text-black transition-all hover:-translate-y-0.5 hover:bg-[#5bee72]"
            >
              ADD JOB
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add job listing</DialogTitle>
            </DialogHeader>
            <AddJobForm onSuccess={() => setAddOpen(false)} />
          </DialogContent>
        </Dialog>
        <Link
          href="/jobs/admin"
          className="text-[12px] font-bold uppercase tracking-[0.08em] text-black/55 underline hover:text-black dark:text-white/55 dark:hover:text-white"
        >
          Admin
        </Link>
      </div>
    </div>
  );

  return (
    <div className="sticky top-0 z-40 rounded-[12px] bg-[#f0f0f0] p-3 dark:bg-[#1a1f27]">
      {filterContent}
    </div>
  );
}
