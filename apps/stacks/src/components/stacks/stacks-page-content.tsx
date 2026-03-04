"use client";

import { useMemo, useState } from "react";
import type { LikeCounts, PopularTool, Stack, Tools } from "@/types";
import { StacksExplorer } from "@/components/stacks/stacks-explorer";
import { PopularCategories } from "@/components/categories/popular-categories";
import { MostPopularTools } from "@/components/tools/most-popular-tools";

type StacksPageContentProps = {
  stacks: Stack[];
  tools: Tools;
  popularTools: PopularTool[];
  likeCounts: LikeCounts;
};

export function StacksPageContent({
  stacks: initialStacks,
  tools: initialTools,
  popularTools: initialPopularTools,
  likeCounts: initialLikeCounts,
}: StacksPageContentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [tools, setTools] = useState<Tools>(initialTools);
  const [stacks, setStacks] = useState<Stack[]>(initialStacks);
  const [popularTools, setPopularTools] = useState<PopularTool[]>(initialPopularTools);
  const [likeCounts, setLikeCounts] = useState<LikeCounts>(initialLikeCounts);
  const showPopularSections = searchQuery.trim().length === 0 && selectedCategories.length === 0;

  const orderedStacks = useMemo(() => stacks, [stacks]);

  return (
    <section className="w-full">
      <div className="viewport-range-shell mx-auto w-full max-w-[1140px] px-4 md:px-6 lg:max-w-[75vw]">
        <StacksExplorer
          stacks={orderedStacks}
          tools={tools}
          initialVisible={8}
          query={searchQuery}
          onQueryChange={setSearchQuery}
          selectedCategories={selectedCategories}
        onSelectedCategoriesChange={setSelectedCategories}
        likeCounts={likeCounts}
        onLikeCountsChange={setLikeCounts}
        onAddStack={async ({ stack, toolsPatch }) => {
            try {
              const response = await fetch("/api/profiles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ stack, toolsPatch }),
              });

              if (!response.ok) {
                const payload = (await response.json().catch(() => ({}))) as { error?: string };
                return {
                  ok: false,
                  error:
                    payload.error ??
                    "Save failed. Please run the app via Next.js server (`npm run dev` or `npm run start`).",
                };
              }

              const payload = (await response.json()) as {
                tools: Tools;
                stacks: Stack[];
                popularTools: PopularTool[];
                likeCounts: LikeCounts;
              };

              setTools(payload.tools);
              setStacks(payload.stacks);
              setPopularTools(payload.popularTools);
              setLikeCounts(payload.likeCounts);
              return { ok: true };
            } catch {
              return {
                ok: false,
                error:
                  "Unable to reach save API. Make sure the app runs with Next.js server mode, not static export.",
              };
            }
          }}
        />
      </div>

      {showPopularSections && (
        <div className="mt-10 border-y border-[#d8d8d8] bg-[#f8f8f8] pb-10 dark:border-[#2f353f] dark:bg-[#161b23]">
          <div className="viewport-range-shell mx-auto w-full max-w-[1140px] px-4 py-8 md:px-6 lg:max-w-[75vw]">
            <PopularCategories tools={tools} stacks={orderedStacks} />
            <MostPopularTools tools={popularTools} />
          </div>
        </div>
      )}
    </section>
  );
}
