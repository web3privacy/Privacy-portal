"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { AwardYear, Article, BannerAd } from "@/types/awards";
import { AwardsHero } from "./awards-hero";
import { WinnersSection } from "./winner-card";
import { NominationCard } from "./nomination-card";

type AwardsPageContentProps = {
  year: AwardYear;
  availableYears: number[];
};

const INITIAL_NOMINATIONS_VISIBLE = 8;

export function AwardsPageContent({ year, availableYears }: AwardsPageContentProps) {
  const router = useRouter();
  const [visibleNominations, setVisibleNominations] = useState(INITIAL_NOMINATIONS_VISIBLE);

  const handleYearChange = (newYear: number) => {
    router.push(`/awards/${newYear}`);
  };

  const visibleNominators = useMemo(() => {
    return year.nominations.slice(0, visibleNominations);
  }, [year.nominations, visibleNominations]);

  const hasMoreNominations = year.nominations.length > visibleNominations;

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-white text-[#121212] dark:bg-[#0f1318] dark:text-[#f2f4f6]">
      <AwardsHero
        title={year.title || `Privacy Awards ${year.year}`}
        description={year.description}
        backgroundImage={year.heroBackgroundImage}
      />

      {/* Submenu with year selection - centered and narrower */}
      <div className="viewport-range-shell mx-auto w-full px-4 py-6 md:px-6 lg:max-w-[75vw]">
        <div className="sticky top-0 z-40 flex items-center justify-center gap-4">
          <div className="inline-flex items-center gap-3 rounded-[12px] bg-[#f0f0f0] p-3 dark:bg-[#1a1f27]">
            <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-black dark:text-white">
              Year:
            </span>
            {availableYears.map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => handleYearChange(y)}
                className={`rounded-[8px] px-4 py-2 text-[14px] font-bold transition-all ${
                  year.year === y
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "bg-white text-black hover:bg-[#e0e0e0] dark:bg-[#12161d] dark:text-[#f2f4f6] dark:hover:bg-[#2a3039]"
                }`}
              >
                {y}
              </button>
            ))}
          </div>
          <Link
            href="/awards/admin"
            className="text-[12px] font-bold uppercase tracking-[0.08em] text-black hover:text-[#616161] dark:text-white dark:hover:text-[#a7b0bd] underline shrink-0"
          >
            ADMIN
          </Link>
        </div>
      </div>

      <div className="viewport-range-shell mx-auto w-full max-w-[1140px] px-4 py-10 md:px-6 lg:max-w-[75vw]">
        {/* Important Dates */}
        <section className="mb-12">
          <h2 className="mb-6 text-[24px] font-bold text-black dark:text-[#f2f4f6] md:text-[32px]">
            Important Dates
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-[12px] border border-[#e0e0e0] bg-white p-6 dark:border-[#303640] dark:bg-[#181d25]">
              <h3 className="mb-2 text-[14px] font-bold uppercase tracking-[0.08em] text-black/70 dark:text-[#a8b0bd]">
                Nominations open
              </h3>
              <p className="text-[18px] font-bold text-black dark:text-[#f2f4f6]">
                {formatDate(year.dates.nominationsOpen)}
              </p>
            </div>
            <div className="rounded-[12px] border border-[#e0e0e0] bg-white p-6 dark:border-[#303640] dark:bg-[#181d25]">
              <h3 className="mb-2 text-[14px] font-bold uppercase tracking-[0.08em] text-black/70 dark:text-[#a8b0bd]">
                Nominations close
              </h3>
              <p className="text-[18px] font-bold text-black dark:text-[#f2f4f6]">
                {formatDate(year.dates.nominationsClose)}
              </p>
            </div>
            <div className="rounded-[12px] border border-[#e0e0e0] bg-white p-6 dark:border-[#303640] dark:bg-[#181d25]">
              <h3 className="mb-2 text-[14px] font-bold uppercase tracking-[0.08em] text-black/70 dark:text-[#a8b0bd]">
                Announcement of winners
              </h3>
              <p className="text-[18px] font-bold text-black dark:text-[#f2f4f6]">
                {formatDate(year.dates.announcement)}
              </p>
            </div>
          </div>
        </section>

        {/* What is Awards / Award Process */}
        <section className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-[24px] font-bold text-black dark:text-[#f2f4f6] md:text-[32px]">
              What is Awards?
            </h2>
            <div className="space-y-4 text-[15px] leading-relaxed text-black/80 dark:text-[#a8b0bd]">
              <p>
                The state of privacy within web3 changes every year. New research papers, projects, demos, and events are delivered. We want to give the privacy community a voice & celebrate annual privacy contributions worldwide.
              </p>
              <p>
                We ask leaders behind privacy protocols, enthusiasts, developers, researchers, and community builders to share their opinions on the year's crucial privacy projects, people, and events.
              </p>
              <p>
                Our goals help privacy projects get a new audience facilitate community contribution to privacy knowledge sharing create a discussion around the annual privacy footprint.
              </p>
            </div>
          </div>
          <div>
            <h2 className="mb-4 text-[24px] font-bold text-black dark:text-[#f2f4f6] md:text-[32px]">
              Award Process
            </h2>
            <div className="space-y-4 text-[15px] leading-relaxed text-black/80 dark:text-[#a8b0bd]">
              <p>
                Any person can Nominate a candidate for any of the {year.categories.length} categories of Awards this year, by answering the following questions:
              </p>
              <ol className="list-decimal list-inside space-y-2">
                {year.categories.map((category, index) => (
                  <li key={category.id}>
                    {category.name}
                    {category.maxNominations && ` (${category.maxNominations} ${category.maxNominations === 1 ? 'name' : 'names'} / each)`}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Winners Section */}
        <WinnersSection winners={year.winners} categories={year.categories} year={year.year - 1} />

        {/* Nominations Section */}
        {year.nominations.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-6 text-[24px] font-bold text-black dark:text-[#f2f4f6] md:text-[32px]">
              Nominations
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {visibleNominators.map((nominator) => (
                <NominationCard key={nominator.id} nominator={nominator} />
              ))}
            </div>
            {hasMoreNominations && (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleNominations((prev) => prev + INITIAL_NOMINATIONS_VISIBLE)}
                  className="h-10 rounded-[8px] border-2 border-black px-5 text-[14px] font-bold tracking-[0.05em] text-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-black hover:text-white hover:shadow-[0_10px_24px_rgba(0,0,0,0.18)] dark:border-[#e8edf5] dark:text-[#e8edf5] dark:hover:bg-[#e8edf5] dark:hover:text-[#0f1318]"
                >
                  SHOW MORE
                </button>
              </div>
            )}
          </section>
        )}

        {/* Articles Section with Sidebar Banners */}
        {(year.articles && year.articles.length > 0) || (year.bannerAds && year.bannerAds.length > 0) ? (
          <section className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Articles - Left column (2/3 width) */}
            {year.articles && year.articles.length > 0 && (
              <div className="lg:col-span-2">
                <h2 className="mb-6 text-[24px] font-bold text-black dark:text-[#f2f4f6] md:text-[32px]">
                  Articles
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {year.articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
            )}
            
            {/* Banner Ads - Right sidebar (1/3 width) */}
            {year.bannerAds && year.bannerAds.length > 0 && (
              <div className="space-y-6">
                {year.bannerAds.map((banner) => (
                  <BannerAdCard key={banner.id} banner={banner} />
                ))}
              </div>
            )}
          </section>
        ) : null}

        {/* How to Nominate Section */}
        {year.howToNominate && (
          <section className="mb-12">
            <h2 className="mb-6 text-[24px] font-bold text-black dark:text-[#f2f4f6] md:text-[32px]">
              How to nominate
            </h2>
            <div className="rounded-[12px] border border-[#e0e0e0] bg-white p-6 dark:border-[#303640] dark:bg-[#181d25]">
              <div className="prose prose-sm max-w-none text-[15px] leading-relaxed text-black/80 dark:prose-invert dark:text-[#a8b0bd]">
                {year.howToNominate.split('\n').map((line, index) => (
                  <p key={index} className={line.startsWith('+') ? 'ml-4' : ''}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function ArticleCard({ article }: { article: Article }) {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }) + " - " + date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <article className="group flex gap-4 rounded-[12px] border border-[#e0e0e0] bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.14)] dark:border-[#303640] dark:bg-[#181d25] dark:hover:shadow-[0_14px_30px_rgba(0,0,0,0.55)]">
      {article.thumbnailUrl && (
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[8px] md:h-32 md:w-32">
          <img
            src={article.thumbnailUrl}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col p-4 md:p-6">
        <h3 className="mb-2 text-[16px] font-bold leading-5 text-black dark:text-[#f2f4f6] md:text-[18px]">
          <a
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            {article.title}
          </a>
        </h3>
        {article.description && (
          <p className="mb-3 line-clamp-2 text-[13px] leading-5 text-black/70 dark:text-[#a8b0bd] md:text-[14px]">
            {article.description}
          </p>
        )}
        {article.publishedAt && (
          <p className="mt-auto text-[11px] text-black/50 dark:text-[#9ea7b5] md:text-[12px]">
            {formatDate(article.publishedAt)}
          </p>
        )}
      </div>
    </article>
  );
}

function BannerAdCard({ banner }: { banner: BannerAd }) {
  return (
    <div className="rounded-[12px] border border-[#e0e0e0] bg-white p-6 dark:border-[#303640] dark:bg-[#181d25]">
      {banner.title && (
        <h3 className="mb-3 text-[14px] font-bold uppercase tracking-[0.08em] text-black dark:text-[#f2f4f6]">
          {banner.title}
        </h3>
      )}
      {banner.description && (
        <p className="mb-4 text-[13px] leading-5 text-black/70 dark:text-[#a8b0bd]">
          {banner.description}
        </p>
      )}
      {banner.url && (
        <a
          href={banner.url}
          target="_blank"
          rel="noreferrer"
          className="inline-block w-full rounded-[8px] bg-[#70ff88] px-4 py-2 text-center text-[13px] font-bold uppercase tracking-[0.08em] text-black transition-all hover:-translate-y-0.5 hover:bg-[#5eef70]"
        >
          {banner.title?.includes('DONATE') ? 'DONATE' : banner.title?.includes('CAMPAIGNS') ? 'GITCOIN PROFILE' : 'LEARN MORE'}
        </a>
      )}
    </div>
  );
}
