"use client";

import { useMemo, useState } from "react";
import { useQueryState } from "nuqs";
import { ARTICLE_TAGS } from "@/types/news";
import type { Article } from "@/types/news";
import { cn } from "@web3privacy/portal-ui";

const POPULAR_COUNT = 5;

type Props = {
  articles: Article[];
};

function getPopularTags(articles: Article[]): string[] {
  const counts = new Map<string, number>();
  for (const a of articles) {
    for (const tag of a.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, ARTICLE_TAGS.length)
    .map(([tag]) => tag);
}

export function NewsSubmenu({ articles }: Props) {
  const [tagFilter, setTagFilter] = useQueryState("tag", { defaultValue: "all" });
  const [pageStr, setPageStr] = useQueryState("page", { defaultValue: "1" });
  const [searchQuery, setSearchQuery] = useQueryState("q", { defaultValue: "" });
  const [moreOpen, setMoreOpen] = useState(false);

  const popularTags = useMemo(() => getPopularTags(articles), [articles]);
  const topTags = popularTags.slice(0, POPULAR_COUNT);
  const restTags = popularTags.slice(POPULAR_COUNT);

  const applyTag = (tag: string) => {
    setTagFilter(tag === tagFilter ? "all" : tag);
    setPageStr("1");
    setMoreOpen(false);
  };

  return (
    <div className="rounded-[12px] p-0">
      <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => applyTag("all")}
          className={cn(
            "rounded-[8px] px-3 py-2 text-sm font-medium transition-colors",
            tagFilter === "all"
              ? "bg-[#70FF88] text-black"
              : "bg-white text-black/75 hover:bg-white/90 dark:bg-[#12161d] dark:text-white/75 dark:hover:bg-[#1a1f27]"
          )}
        >
          All
        </button>
        {topTags.map((tag) => (
          <button
            key={tag}
            onClick={() => applyTag(tag)}
            className={cn(
              "rounded-[8px] px-3 py-2 text-sm font-medium transition-colors",
              tagFilter === tag
                ? "bg-[#70FF88] text-black"
                : "bg-white text-black/75 hover:bg-white/90 dark:bg-[#12161d] dark:text-white/75 dark:hover:bg-[#1a1f27]"
            )}
          >
            {tag.replace(/-/g, " ")}
          </button>
        ))}
        {restTags.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className={cn(
                "rounded-[8px] px-3 py-2 text-sm font-medium transition-colors",
                restTags.includes(tagFilter)
                  ? "bg-[#70FF88] text-black"
                  : "bg-white text-black/75 hover:bg-black/10 dark:bg-[#12161d] dark:text-white/75 dark:hover:bg-[#1a1f27]"
              )}
            >
              More
            </button>
            {moreOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMoreOpen(false)}
                  aria-hidden
                />
                <div className="absolute left-0 top-full z-20 mt-1 flex flex-col gap-0.5 rounded-lg border border-black/10 bg-white py-1 shadow-lg dark:border-white/10 dark:bg-[#151a21]">
                  {restTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => applyTag(tag)}
                      className={cn(
                        "px-4 py-2 text-left text-sm",
                        tagFilter === tag
                          ? "bg-[#70ff88]/20 font-medium text-black dark:text-white"
                          : "text-black/80 hover:bg-black/5 dark:text-white/80 dark:hover:bg-white/5"
                      )}
                    >
                      {tag.replace(/-/g, " ")}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
        </div>
        <label className="relative w-full lg:w-[340px] lg:ml-auto lg:shrink-0">
          <input
            type="search"
            placeholder="Search articles…"
            value={searchQuery ?? ""}
            onChange={(e) => {
              setSearchQuery(e.target.value || null);
              setPageStr("1");
            }}
            className="h-10 w-full rounded-[8px] border border-transparent bg-white px-4 pr-10 text-[14px] text-black outline-none transition-[border-color,box-shadow] placeholder:text-[#606060] focus:border-black/25 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.08)] dark:border-[#3b4048] dark:bg-[#12161d] dark:text-[#f2f4f6] dark:placeholder:text-[#95a0ae] dark:focus:border-white/20 dark:focus:shadow-[0_0_0_3px_rgba(255,255,255,0.08)]"
          />
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-black/70 dark:text-[#c6ccd6]">
            <span className="material-symbols-rounded block text-[18px] leading-none">search</span>
          </span>
        </label>
      </div>
    </div>
  );
}
