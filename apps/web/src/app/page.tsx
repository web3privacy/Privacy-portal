export const dynamic = "force-dynamic";
/**
 * Home route ("/"): news-style landing with latest news, academy, awards, explorer data.
 * Rendered as NewsPageContent + sidebar. Do not confuse with org web landing (w3pn-org-web).
 */
import { loadNewsData } from "@/lib/news";
import { loadAcademyData, fetchYouTubeVideos } from "@/lib/academy";
import { fetchRadioTracks } from "@/lib/academy";
import { loadAwardsData } from "@/lib/awards";
import { loadAppData } from "@/lib/data";
import { loadExplorerDataFromDisk } from "@/lib/load-explorer-data";
import { Suspense } from "react";
import { NewsPageContent } from "@/components/news/NewsPageContent";
import { NewsSubmenu } from "@/components/news/NewsSubmenu";
import { NewsSidebar } from "@/components/news/NewsSidebar";
import { NewsFooterSections } from "@/components/news/NewsFooterSections";
import { computeProjectRatings, isRankArray } from "@/lib/scoring";
import { API_RESPONSE_KEYS, API_URLS } from "@/lib/constants";
import type { Project } from "@/types";

function getRandomStack<T>(stacks: T[]): T | undefined {
  if (stacks.length === 0) return undefined;
  const idx = Math.floor(Math.random() * stacks.length);
  return stacks[idx];
}

export default async function NewsPage() {
  const [newsData, academyData, youtubeTalks, radioTracks, awardsData, appData, explorerData] =
    await Promise.all([
      Promise.resolve(loadNewsData()),
      Promise.resolve(loadAcademyData()),
      fetchYouTubeVideos("@Web3PrivacyNow"),
      fetchRadioTracks(),
      Promise.resolve(loadAwardsData()),
      Promise.resolve(loadAppData()),
      loadExplorerDataFromDisk()
        .catch(() => null)
        .then((local) =>
          local ?? fetch(process.env.EXPLORER_DATA_URL ?? API_URLS.EXPLORER_DATA).then((r) => r.json()).catch(() => null)
        ),
    ]);

  const stacksList = Object.values(appData.stacks);
  const randomStack = getRandomStack(stacksList);

  const latestYear = awardsData.years[0];
  let awardsWinners: Array<{
    winner: string;
    category: string;
    icon?: string;
    percentage?: number;
  }> = latestYear?.winners?.map((w) => ({
    winner: w.winner,
    category: w.category,
    icon: w.icon,
    percentage: 75,
  })) ?? [];

  if (explorerData && awardsWinners.length > 0) {
    const data = explorerData as Record<string, unknown>;
    const rawProjects = (data[API_RESPONSE_KEYS.PROJECTS] ?? []) as Project[];
    const ranksRaw = data[API_RESPONSE_KEYS.RANKS];
    const ranks = isRankArray(ranksRaw) ? ranksRaw : [];
    const projectMap = new Map(
      rawProjects.map((p) => [
        p.name.toLowerCase(),
        computeProjectRatings(p, ranks).percentage,
      ])
    );
    awardsWinners = awardsWinners.map((w) => {
      const pct = projectMap.get(w.winner.toLowerCase());
      return { ...w, percentage: pct ?? w.percentage };
    });
  }

  const allRadioTracks = [
    ...radioTracks,
    ...academyData.radioTracks,
  ].sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));

  const allTalks = [...youtubeTalks, ...academyData.talks].filter((t) => t.youtubeId);
  const watchListenItems = allTalks
    .slice(0, 10)
    .map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      thumbnailUrl: `https://img.youtube.com/vi/${t.youtubeId}/mqdefault.jpg`,
      type: "video" as const,
      link: t.youtubeId
        ? `https://www.youtube.com/watch?v=${t.youtubeId}`
        : "/academy",
    }));

  let featuredProjects: Array<{
    id: string;
    name: string;
    logos?: Array<{ file?: string; url?: string }>;
  }> = [];

  if (explorerData) {
    const data = explorerData as Record<string, unknown>;
    const rawProjects = (data[API_RESPONSE_KEYS.PROJECTS] ?? []) as Project[];
    const ids = new Set(newsData.featuredProjectIds);
    let fromFeatured = rawProjects
      .filter((p) => ids.has(p.id))
      .map((p) => ({ id: p.id, name: p.name, logos: p.logos }));
    if (fromFeatured.length < 5) {
      const extra = rawProjects
        .filter((p) => !ids.has(p.id))
        .slice(0, Math.max(0, 5 - fromFeatured.length))
        .map((p) => ({ id: p.id, name: p.name, logos: p.logos }));
      fromFeatured = [...fromFeatured, ...extra];
    }
    featuredProjects = fromFeatured.slice(0, 24);
  }

  const donationTiers = newsData.donationTiers ?? [];

  return (
    <main className="w-full">
      <div className="viewport-range-shell mx-auto w-full px-4 pt-6 pb-10 md:px-6">
        {/* Submenu – match stacks style */}
        <div className="mb-6 rounded-[12px] bg-[#f0f0f0] p-3 dark:bg-[#1a1f27]">
          <NewsSubmenu articles={newsData.articles} />
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-serif text-[26px] leading-none text-black md:text-[30px] dark:text-[#f2f4f6]">
            Latest News
          </h1>
          <a
            href="/news/admin"
            className="hidden text-sm font-medium text-black/55 hover:text-black dark:text-white/55 dark:hover:text-white sm:inline"
          >
            Admin
          </a>
        </div>

        <div className="flex flex-col gap-12 lg:flex-row lg:gap-12">
        <div className="min-w-0 flex-1">
          <Suspense
            fallback={
              <div className="min-h-[400px] animate-pulse rounded-xl bg-black/5 dark:bg-black/20" />
            }
          >
            <NewsPageContent
              articles={newsData.articles}
              watchListenItems={watchListenItems}
              showSubmenu={false}
            />
          </Suspense>
        </div>

        <div className="w-full shrink-0 lg:w-[340px]">
          <NewsSidebar
            radioTracks={allRadioTracks}
            radioPlaylists={academyData.radioPlaylists}
            randomStack={randomStack}
            tools={appData.tools}
            awardsWinners={awardsWinners}
            guides={academyData.guides}
            featuredProjects={featuredProjects.slice(0, 5)}
          />
        </div>
        </div>
      </div>

      <NewsFooterSections
        featuredProjects={featuredProjects}
        donationTiers={donationTiers}
      />
    </main>
  );
}
