"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import type { AcademyContentType, Talk, Course, Guide, FeaturedDocument, Podcast } from "@/types/academy";
import { AcademyHero } from "./academy-hero";
import { AcademyTabs } from "./academy-tabs";
import { LatestTalks } from "./latest-talks";
import { Lectures } from "./lectures";
import { RadioSection } from "./radio-section";
import { AcceleratorSection } from "./accelerator-section";
import type { AcceleratorItem } from "@/types/academy";
import { GuidesSection } from "./guides-section";
import { GlossaryBanner } from "./glossary-banner";
import { LibraryBanner } from "./library-banner";
import { FeaturedDocuments } from "./featured-documents";
import { PodcastsSection } from "./podcasts-section";

import type { RadioPlaylist } from "@/types/academy";

type Props = {
  talks: Talk[];
  courses: Course[];
  guides: Guide[];
  featuredDocuments: FeaturedDocument[];
  popularTalks: Talk[];
  radioTracks: any[];
  radioPlaylists?: RadioPlaylist[];
  acceleratorItems?: AcceleratorItem[];
  podcasts?: Podcast[];
};

export function AcademyPageContent({
  talks,
  courses,
  guides,
  featuredDocuments,
  popularTalks,
  radioTracks,
  radioPlaylists = [],
  acceleratorItems = [],
  podcasts = [],
}: Props) {
  const [activeTab, setActiveTab] = useState<AcademyContentType>("all");
  const [search, setSearch] = useState("");

  // Debug logging
  useEffect(() => {
    console.log('[AcademyPageContent] Props received:', {
      talks: talks.length,
      courses: courses.length,
      guides: guides.length,
      featuredDocuments: featuredDocuments.length,
      popularTalks: popularTalks.length,
      radioTracks: radioTracks.length,
      acceleratorItems: acceleratorItems.length,
    });
  }, [talks, courses, guides, featuredDocuments, popularTalks, radioTracks, acceleratorItems]);

  // Filter function for search
  const filterBySearch = <T extends { title: string; speaker?: string; description?: string }>(
    items: T[],
    query: string
  ): T[] => {
    if (!query.trim()) return items;
    const lowerQuery = query.toLowerCase();
    return items.filter((item) => {
      const titleMatch = item.title.toLowerCase().includes(lowerQuery);
      const speakerMatch = item.speaker?.toLowerCase().includes(lowerQuery);
      const descriptionMatch = item.description?.toLowerCase().includes(lowerQuery);
      return titleMatch || speakerMatch || descriptionMatch;
    });
  };

  // Filter content based on search query
  const filteredTalks = useMemo(() => filterBySearch(popularTalks, search), [popularTalks, search]);
  const filteredCourses = useMemo(() => filterBySearch(courses, search), [courses, search]);
  const filteredGuides = useMemo(() => filterBySearch(guides, search), [guides, search]);
  const filteredPodcasts = useMemo(() => filterBySearch(podcasts, search), [podcasts, search]);
  const filteredRadioTracks = useMemo(() => filterBySearch(radioTracks, search), [radioTracks, search]);
  const filteredFeaturedDocuments = useMemo(() => filterBySearch(featuredDocuments, search), [featuredDocuments, search]);

  // Check if we have search results for each category
  const hasSearchResults = useMemo(() => {
    if (!search.trim()) return { talks: true, courses: true, guides: true, podcasts: true, radio: true, featured: true };
    return {
      talks: filteredTalks.length > 0,
      courses: filteredCourses.length > 0,
      guides: filteredGuides.length > 0,
      podcasts: filteredPodcasts.length > 0,
      radio: filteredRadioTracks.length > 0,
      featured: filteredFeaturedDocuments.length > 0,
    };
  }, [search, filteredTalks, filteredCourses, filteredGuides, filteredPodcasts, filteredRadioTracks, filteredFeaturedDocuments]);

  const filteredContent = useMemo(() => {
    // Filter based on active tab and search
    // When searching, only show categories with results
    if (search.trim()) {
      return {
        showTalks: (activeTab === "all" || activeTab === "talks") && hasSearchResults.talks,
        showCourses: (activeTab === "all" || activeTab === "courses") && hasSearchResults.courses,
        showQuizes: (activeTab === "all" || activeTab === "quizes") && false, // Quizes not implemented yet
        showGuides: (activeTab === "all" || activeTab === "guides") && hasSearchResults.guides,
        showPodcast: (activeTab === "all" || activeTab === "podcast") && hasSearchResults.podcasts,
        showRadio: (activeTab === "all" || activeTab === "radio") && hasSearchResults.radio,
      };
    }
    // Normal behavior when not searching
    return {
      showTalks: activeTab === "all" || activeTab === "talks",
      showCourses: activeTab === "all" || activeTab === "courses",
      showQuizes: activeTab === "all" || activeTab === "quizes",
      showGuides: activeTab === "all" || activeTab === "guides",
      showPodcast: activeTab === "all" || activeTab === "podcast",
      showRadio: activeTab === "all" || activeTab === "radio",
    };
  }, [activeTab, search, hasSearchResults]);

  return (
    <main className="min-h-screen bg-white text-[#121212] dark:bg-[#0f1318] dark:text-[#f2f4f6]">
      <AcademyHero />
      
      {/* Submenu with tabs and search */}
      <div className="viewport-range-shell mx-auto w-full px-4 pt-6 pb-3 md:px-6 lg:max-w-[75vw]">
        <div className="sticky top-0 z-40 rounded-[12px] bg-[#f0f0f0] p-3 dark:bg-[#1a1f27]">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <AcademyTabs activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="flex items-center gap-3">
              <label className="relative w-full md:max-w-[320px]">
                <input
                  type="text"
                  placeholder="Search Academy"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-10 w-full rounded-[8px] border border-transparent bg-white px-4 pr-10 text-[14px] text-black outline-none transition-[border-color,box-shadow] placeholder:text-[#606060] focus:border-black/25 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.08)] dark:border-[#3b4048] dark:bg-[#12161d] dark:text-[#f2f4f6] dark:placeholder:text-[#95a0ae] dark:focus:border-white/20 dark:focus:shadow-[0_0_0_3px_rgba(255,255,255,0.08)]"
                />
                {search ? (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute inset-y-0 right-3 flex items-center text-black/70 hover:text-black dark:text-[#c6ccd6] dark:hover:text-white transition-colors"
                  >
                    <span className="material-symbols-rounded block text-[18px] leading-none">
                      close
                    </span>
                  </button>
                ) : (
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-black/70 dark:text-[#c6ccd6]">
                    <span className="material-symbols-rounded block text-[18px] leading-none">
                      search
                    </span>
                  </span>
                )}
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="viewport-range-shell mx-auto w-full max-w-[1140px] px-4 pt-5 pb-10 md:px-6 lg:max-w-[75vw]">
        {/* When searching, use single column layout aligned left */}
        {search.trim() ? (
          <>
            {/* Check if we have any results */}
            {Object.values(hasSearchResults).some(result => result) ? (
              <>
                {/* Latest Talks */}
                {filteredContent.showTalks && (
                  <LatestTalks
                    talks={filteredTalks}
                    headerAction={
                      <Link
                        href="/academy/admin"
                        className="text-[12px] font-bold uppercase tracking-[0.08em] text-black hover:text-[#616161] dark:text-white dark:hover:text-[#a7b0bd] underline shrink-0"
                      >
                        ADMIN
                      </Link>
                    }
                  />
                )}

                {/* Courses */}
                {filteredContent.showCourses && (
                  <Lectures courses={filteredCourses} />
                )}

                {/* Radio - only show if there are matching tracks */}
                {filteredContent.showRadio && filteredRadioTracks.length > 0 && (
                  <RadioSection tracks={filteredRadioTracks} playlists={radioPlaylists} />
                )}

                {/* Guides */}
                {filteredContent.showGuides && (
                  <GuidesSection guides={filteredGuides} />
                )}

                {/* Podcasts */}
                {filteredContent.showPodcast && (
                  <div className="mt-8">
                    <PodcastsSection podcasts={filteredPodcasts} />
                  </div>
                )}

                {/* Featured Documents */}
                {hasSearchResults.featured && (
                  <FeaturedDocuments documents={filteredFeaturedDocuments} />
                )}
              </>
            ) : (
              <div className="flex items-center justify-center py-20">
                <p className="text-[16px] text-[#616161] dark:text-[#a7b0bd]">
                  No results found
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Latest Talks - only show on "all" or "talks" tab */}
            {filteredContent.showTalks && popularTalks.length > 0 && (
              <LatestTalks
                talks={popularTalks}
                headerAction={
                  <Link
                    href="/academy/admin"
                    className="text-[12px] font-bold uppercase tracking-[0.08em] text-black hover:text-[#616161] dark:text-white dark:hover:text-[#a7b0bd] underline shrink-0"
                  >
                    ADMIN
                  </Link>
                }
              />
            )}

            {/* Two-column layout: Lectures (left) + Radio & Accelerator (right) */}
            {activeTab === "all" && (
              <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Left column: Lectures */}
                <div>
                  {filteredContent.showCourses && courses.length > 0 && (
                    <Lectures courses={courses} />
                  )}
                </div>

                {/* Right column: Radio & Accelerator */}
                <div>
                  {filteredContent.showRadio && (
                    <RadioSection tracks={radioTracks} playlists={radioPlaylists} />
                  )}
                  <AcceleratorSection items={acceleratorItems} />
                </div>
              </div>
            )}

            {/* Single column layout for other tabs */}
            {activeTab !== "all" && (
              <>
                {filteredContent.showCourses && courses.length > 0 && (
                  <Lectures courses={courses} />
                )}
                {filteredContent.showRadio && (
                  <RadioSection tracks={radioTracks} playlists={radioPlaylists} />
                )}
                {filteredContent.showGuides && guides.length > 0 && (
                  <GuidesSection guides={guides} />
                )}
                {filteredContent.showPodcast && podcasts.length > 0 && (
                  <PodcastsSection podcasts={podcasts} />
                )}
              </>
            )}

            {/* Guides - only show on "all" or "guides" tab */}
            {activeTab === "all" && filteredContent.showGuides && guides.length > 0 && (
              <GuidesSection guides={guides} />
            )}

            {/* Podcasts - only show on "all" or "podcast" tab */}
            {activeTab === "all" && filteredContent.showPodcast && podcasts.length > 0 && (
              <PodcastsSection podcasts={podcasts} />
            )}

            {/* Glossary and Library Banners - two column layout */}
            {activeTab === "all" && (
              <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
                <GlossaryBanner />
                <LibraryBanner />
              </div>
            )}

            {/* Featured Documents - show on "all" tab */}
            {activeTab === "all" && featuredDocuments.length > 0 && (
              <FeaturedDocuments documents={featuredDocuments} />
            )}
          </>
        )}
        
      </div>
    </main>
  );
}
