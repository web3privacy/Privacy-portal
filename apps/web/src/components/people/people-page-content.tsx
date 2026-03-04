"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Person } from "@/types/people";
import { PeopleHero } from "./people-hero";
import { PersonCard } from "./person-card";

type PeoplePageContentProps = {
  people: Person[];
};

const INITIAL_VISIBLE = 12;

const FILTER_TAGS = ["ALL PEOPLE", "ACADEMIC", "W3PN", "ADVOCATE", "CRYPTOGRAPHY", "SPEAKER"];

export function PeoplePageContent({ people }: PeoplePageContentProps) {
  const [selectedFilter, setSelectedFilter] = useState("ALL PEOPLE");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let result = people;

    // Apply search filter
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(person =>
        person.name.toLowerCase().includes(query) ||
        person.displayName?.toLowerCase().includes(query) ||
        person.title?.toLowerCase().includes(query) ||
        person.description?.toLowerCase().includes(query) ||
        person.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply tag filter
    if (selectedFilter !== "ALL PEOPLE") {
      const filterTag = selectedFilter.toUpperCase();
      result = result.filter(person =>
        person.tags?.some(tag => tag.toUpperCase() === filterTag)
      );
    }

    return result;
  }, [people, selectedFilter, search]);

  const display = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visibleCount;
  const count = filtered.length;

  return (
    <main className="min-h-screen bg-white text-[#121212] dark:bg-[#0f1318] dark:text-[#f2f4f6]">
      <PeopleHero />

      {/* Submenu with filters */}
      <div className="viewport-range-shell mx-auto w-full px-4 py-6 md:px-6 lg:max-w-[75vw]">
        <div className="sticky top-0 z-40 rounded-[12px] bg-[#f0f0f0] p-3 dark:bg-[#1a1f27]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
            {FILTER_TAGS.map((filter) => {
              const countForFilter = filter === "ALL PEOPLE" 
                ? people.length 
                : people.filter(p => p.tags?.some(tag => tag.toUpperCase() === filter.toUpperCase())).length;
              
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => {
                    setSelectedFilter(filter);
                    setVisibleCount(INITIAL_VISIBLE);
                  }}
                  className={`rounded-[8px] px-4 py-2 text-[14px] font-bold transition-all ${
                    selectedFilter === filter
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "bg-white text-black hover:bg-[#e0e0e0] dark:bg-[#12161d] dark:text-[#f2f4f6] dark:hover:bg-[#2a3039]"
                  }`}
                >
                  {filter} ({countForFilter})
                </button>
              );
            })}
            </div>
            <Link
              href="/people/add"
              className="ml-auto shrink-0 inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[#70ff88] bg-[#70ff88] px-5 text-[13px] font-bold uppercase tracking-[0.08em] text-black transition-all hover:-translate-y-0.5 hover:bg-[#5eef70] dark:border-[#70ff88] dark:bg-[#70ff88] dark:text-black dark:hover:bg-[#5eef70]"
            >
              ADD PERSON
            </Link>
          </div>
        </div>
      </div>

      <div className="viewport-range-shell mx-auto w-full max-w-[1140px] px-4 py-10 md:px-6 lg:max-w-[75vw]">
        {/* Search */}
        <div className="mb-6">
          <label className="relative block">
            <input
              type="text"
              placeholder="Search people..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisibleCount(INITIAL_VISIBLE);
              }}
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

        {/* Results count */}
        {search && (
          <p className="mb-6 text-[14px] text-black/70 dark:text-[#a8b0bd]">
            Found {count} {count === 1 ? 'person' : 'people'}
          </p>
        )}

        {/* People grid */}
        {display.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {display.map((person) => (
                <PersonCard key={person.id} person={person} />
              ))}
            </div>
            {hasMore && (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + INITIAL_VISIBLE)}
                  className="h-10 rounded-[8px] border-2 border-black px-5 text-[14px] font-bold tracking-[0.05em] text-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-black hover:text-white hover:shadow-[0_10px_24px_rgba(0,0,0,0.18)] dark:border-[#e8edf5] dark:text-[#e8edf5] dark:hover:bg-[#e8edf5] dark:hover:text-[#0f1318]"
                >
                  SHOW MORE
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center py-20">
            <p className="text-[16px] text-[#616161] dark:text-[#a7b0bd]">
              No people found
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
