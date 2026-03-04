"use client";

import { useState } from "react";
import type { Guide } from "@/types/academy";
import Link from "next/link";

type Props = {
  guides: Guide[];
};

export function GuidesSection({ guides }: Props) {
  const [showMore, setShowMore] = useState(false);
  const displayGuides = showMore ? guides : guides.slice(0, 4);

  // Always show section, even if empty
  return (
    <section className="mb-12">
      <h2 className="mb-4 font-serif text-[22px] font-bold text-black dark:text-[#f2f4f6]">
        Guides
      </h2>
      {guides.length === 0 ? (
        <div className="rounded-[12px] border border-[#e0e0e0] bg-[#f0f0f0] p-6 dark:border-[#303640] dark:bg-[#1a1f27]">
          <p className="text-center text-[14px] text-[#616161] dark:text-[#a7b0bd]">
            No guides available
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            {displayGuides.map((guide) => (
              <div
                key={guide.id}
                className="relative rounded-[12px] border border-[#e0e0e0] bg-white p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.14)] dark:border-[#303640] dark:bg-[#181d25] dark:hover:shadow-[0_14px_30px_rgba(0,0,0,0.55)]"
              >
                {guide.isNew && (
                  <span className="absolute -top-2 -right-2 rounded-full bg-black px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.05em] text-white shrink-0 z-10">
                    NEW
                  </span>
                )}
                <div className="mb-2">
                  <h3 className="font-sans text-[15px] font-semibold text-black dark:text-[#f2f4f6] pr-12">
                    {guide.title}
                  </h3>
                </div>
                {guide.duration && (
                  <p className="mb-2 text-[12px] text-[#616161] dark:text-[#a7b0bd]">
                    {guide.duration}
                  </p>
                )}
                <p className="mb-4 line-clamp-3 text-[13px] leading-relaxed text-[#616161] dark:text-[#a7b0bd]">
                  {guide.description}
                </p>
                <a
                  href={guide.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-black px-4 py-2 text-[12px] font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#1a1a1a] dark:bg-black dark:hover:bg-[#2a2a2a]"
                >
                  SHOW GUIDE →
                </a>
              </div>
            ))}
          </div>
          {guides.length > 4 && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setShowMore(!showMore)}
                className="rounded-[10px] border border-[#d8d8d8] bg-white px-6 py-2.5 text-[13px] font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-[#f5f5f5] dark:border-[#2c3139] dark:bg-[#151a21] dark:text-[#f2f4f6] dark:hover:bg-[#1f252d]"
              >
                {showMore ? "Show less" : "SHOW MORE GUIDES"}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
