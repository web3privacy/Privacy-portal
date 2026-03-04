"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { AwardsData, AwardYear } from "@/types/awards";

type Props = {
  data: AwardsData;
};

export function AwardsAdmin({ data: initialData }: Props) {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const refresh = async () => {
    const res = await fetch("/api/awards");
    const newData = await res.json();
    setData(newData);
  };

  const handleDeleteYear = async (year: number) => {
    if (!confirm(`Delete Awards year ${year}? This action cannot be undone.`)) return;
    await fetch(`/api/awards?year=${year}`, { method: "DELETE" });
    refresh();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-white text-[#121212] dark:bg-[#0f1318] dark:text-[#f2f4f6]">
      <div className="viewport-range-shell mx-auto w-full max-w-[1280px] px-4 py-10 md:px-6">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-[32px] font-bold text-black dark:text-[#f2f4f6]">
            Awards Admin
          </h1>
          <Link
            href="/awards/admin/add-year"
            className="rounded-[8px] bg-[#70ff88] px-4 py-2 text-[14px] font-bold uppercase tracking-[0.08em] text-black transition-all hover:bg-[#5eef70]"
          >
            + Add Year
          </Link>
        </div>

        {/* Years List */}
        {data.years.length > 0 ? (
          <div className="space-y-4">
            {data.years.map((year) => (
              <div
                key={year.year}
                className="rounded-[12px] border border-[#e0e0e0] bg-white p-6 transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:border-[#303640] dark:bg-[#181d25] dark:hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <h2 className="text-[24px] font-bold text-black dark:text-[#f2f4f6]">
                        {year.title || `Privacy Awards ${year.year}`}
                      </h2>
                      <span className="rounded-[100px] bg-[#d9d9d9] px-3 py-1 text-[12px] font-bold text-black dark:bg-[#2a3039] dark:text-[#f2f4f6]">
                        {year.year}
                      </span>
                    </div>
                    {year.description && (
                      <p className="mb-3 text-[14px] text-black/70 dark:text-[#a8b0bd]">
                        {year.description}
                      </p>
                    )}
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                      <div className="text-[13px]">
                        <span className="font-bold text-black dark:text-[#f2f4f6]">Winners: </span>
                        <span className="text-black/70 dark:text-[#a8b0bd]">
                          {year.winners?.length || 0}
                        </span>
                      </div>
                      <div className="text-[13px]">
                        <span className="font-bold text-black dark:text-[#f2f4f6]">Nominators: </span>
                        <span className="text-black/70 dark:text-[#a8b0bd]">
                          {year.nominations.length}
                        </span>
                      </div>
                      <div className="text-[13px]">
                        <span className="font-bold text-black dark:text-[#f2f4f6]">Announcement: </span>
                        <span className="text-black/70 dark:text-[#a8b0bd]">
                          {formatDate(year.dates.announcement)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Link
                      href={`/awards/admin/edit-year/${year.year}`}
                      className="rounded-[8px] border border-black bg-white px-4 py-2 text-[14px] font-bold text-black transition-all hover:bg-black hover:text-white dark:border-[#e0e0e0] dark:bg-[#181d25] dark:text-[#f2f4f6] dark:hover:bg-[#e0e0e0] dark:hover:text-[#0f1318]"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteYear(year.year)}
                      className="rounded-[8px] border border-red-600 bg-white px-4 py-2 text-[14px] font-bold text-red-600 transition-all hover:bg-red-600 hover:text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[12px] border border-[#e0e0e0] bg-white p-8 text-center dark:border-[#303640] dark:bg-[#181d25]">
            <p className="mb-4 text-[16px] text-black/70 dark:text-[#a8b0bd]">
              No awards years available yet.
            </p>
            <Link
              href="/awards/admin/add-year"
              className="inline-block rounded-[8px] bg-[#70ff88] px-4 py-2 text-[14px] font-bold uppercase tracking-[0.08em] text-black transition-all hover:bg-[#5eef70]"
            >
              + Add First Year
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
