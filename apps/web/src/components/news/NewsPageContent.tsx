"use client";

import { useMemo } from "react";
import { useQueryState } from "nuqs";
import { ArticleCard } from "./ArticleCard";
import { NewsPagination } from "./NewsPagination";
import { NewsSubmenu } from "./NewsSubmenu";
import { WatchListenCarousel } from "./WatchListenCarousel";
import type { Article } from "@/types/news";
import type { MediaCarouselItem } from "./WatchListenCarousel";

const PAGE_SIZE = 10;

type Props = {
  articles: Article[];
  watchListenItems?: MediaCarouselItem[];
  showSubmenu?: boolean;
};

export function NewsPageContent({ articles, watchListenItems = [], showSubmenu = true }: Props) {
  const [tagFilter] = useQueryState("tag", { defaultValue: "all" });
  const [pageStr] = useQueryState("page", { defaultValue: "1" });
  const [searchQuery] = useQueryState("q", { defaultValue: "" });

  const filtered = useMemo(() => {
    let list = articles;
    if (tagFilter && tagFilter !== "all") {
      list = list.filter((a) => a.tags.includes(tagFilter));
    }
    const q = (searchQuery ?? "").trim().toLowerCase();
    if (q) {
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          (a.perex && a.perex.toLowerCase().includes(q))
      );
    }
    return list;
  }, [articles, tagFilter, searchQuery]);

  const highlights = useMemo(
    () => filtered.filter((a) => a.isHighlighted).slice(0, 2),
    [filtered]
  );
  const subHighlights = useMemo(
    () => filtered.filter((a) => !a.isHighlighted).slice(0, 2),
    [filtered]
  );
  const latest = useMemo(
    () => filtered.filter((a) => !a.isHighlighted).slice(2),
    [filtered]
  );

  const page = Math.max(1, parseInt(pageStr || "1", 10) || 1);
  const totalPages = Math.max(1, Math.ceil(latest.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const latestPage = latest.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="space-y-12">
      {showSubmenu && (
        <div className="mb-6">
          <NewsSubmenu articles={articles} />
        </div>
      )}

      {/* Highlights – 2 vertikálně, obrázek vlevo */}
      {highlights.length > 0 && (
        <section>
          <div className="flex flex-col gap-6">
            {highlights.map((a) => (
              <ArticleCard key={a.id} article={a} variant="highlight-horizontal" />
            ))}
          </div>
          {subHighlights.length > 0 && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {subHighlights.map((a) => (
                <ArticleCard key={a.id} article={a} variant="sub-highlight" />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Watch / Listen */}
      {watchListenItems.length > 0 && (
        <section>
          <WatchListenCarousel items={watchListenItems} />
        </section>
      )}

      {/* Privacy News – list layout */}
      <section id="latest">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold text-black dark:text-white">
            Privacy News
          </h2>
          <a
            href="#latest"
            className="text-sm font-semibold text-[#70ff88] hover:underline"
          >
            View all
          </a>
        </div>
        <div className="space-y-4">
          {latestPage.map((a) => (
            <ArticleCard key={a.id} article={a} variant="list" />
          ))}
        </div>
        <NewsPagination total={latest.length} pageSize={PAGE_SIZE} />
      </section>
    </div>
  );
}
