import Link from "next/link";
import Image from "next/image";

import { siteConfig } from "@/lib/config";
import { loadAppData } from "@/lib/data";
import {
  getCategoryLabel,
  getCategoryToolUsage,
  getToolImageSrc,
  toCategoryRoute,
} from "@/lib/stacks-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Categories - ${siteConfig.name}`,
};

export const dynamic = "force-dynamic";

export default function CategoriesPage() {
  const data = loadAppData();
  const stacks = Object.values(data.stacks);

  const categories = Object.keys(data.tools)
    .map((key) => {
      const rows = getCategoryToolUsage(key, data.tools, stacks);
      const totalVotes = rows.reduce((acc, item) => acc + item.count, 0);

      return {
        key,
        label: getCategoryLabel(key),
        rows: rows.slice(0, 5),
        totalVotes,
      };
    })
    .sort((a, b) => b.totalVotes - a.totalVotes);

  return (
    <main className="min-h-screen bg-[#f0f0f0] text-[#121212] dark:bg-[#0f1318] dark:text-[#f2f4f6]">

      <section className="viewport-range-shell mx-auto flex w-full max-w-[1140px] flex-col gap-6 px-4 py-6 md:px-6 md:py-8 lg:max-w-[75vw]">
        <div className="animate-fade-up rounded-[12px] border border-[#dadada] bg-[#ececec] p-4 dark:border-[#303640] dark:bg-[#181d25] md:p-6">
          <h1 className="text-center text-[36px] leading-tight dark:text-[#f2f4f6] md:text-[56px]">All categories</h1>
          <p className="mt-2 text-center text-[22px] text-[#666] dark:text-[#a8b0bc] md:text-[30px]">
            Explore what tools experts use in each category
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category, index) => (
            <article
              key={category.key}
              className="animate-fade-up flex min-h-[280px] flex-col rounded-[12px] border border-[#d2d2d2] bg-[#f5f5f5] p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.14)] dark:border-[#303640] dark:bg-[#181d25] dark:hover:shadow-[0_14px_30px_rgba(0,0,0,0.55)]"
              style={{ animationDelay: `${Math.min(index * 45, 280)}ms` }}
            >
              <h2 className="mb-5 px-1 pt-1 font-sans text-[30px] font-bold text-[#171717] dark:text-[#f2f4f6] md:text-[40px]">
                <Link
                  href={toCategoryRoute(category.key)}
                  className="transition-colors duration-150 hover:text-black/70 hover:underline dark:hover:text-white/85"
                >
                  {category.label}
                </Link>
              </h2>
              <div className="space-y-2">
                {category.rows.map((row) => (
                  <div key={`${category.key}-${row.name}`} className="flex items-center gap-2">
                    <Image
                      src={getToolImageSrc(row.detail.image)}
                      alt={row.name}
                      width={24}
                      height={24}
                      className="h-6 w-6 rounded-full"
                    />
                    <span className="flex-1 truncate text-[18px] text-[#141414] dark:text-[#f2f4f6]">{row.name}</span>
                    <span className="rounded-full bg-[#dcdcdc] px-2 py-0.5 text-[11px] font-semibold text-[#4b4b4b] dark:bg-[#2a3039] dark:text-[#d3dae5]">
                      {row.count}x
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-auto flex items-center justify-between pt-4">
                <p className="text-[11px] text-[#666] dark:text-[#9fa8b7]">{category.totalVotes} Votes</p>
                <Link
                  href={toCategoryRoute(category.key)}
                  className="rounded-[8px] border border-black bg-white px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] transition-all duration-200 hover:-translate-y-0.5 hover:bg-black hover:text-white hover:shadow-[0_10px_24px_rgba(0,0,0,0.18)] dark:border-[#e8edf5] dark:bg-[#11161e] dark:text-[#e8edf5] dark:hover:bg-[#e8edf5] dark:hover:text-[#0f1318]"
                >
                  Explore
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
