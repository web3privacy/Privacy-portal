"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { EventsFilters } from "./events-filters";
import { EventCard } from "./event-card";
import type { Event } from "@/types/events";
import {
  EVENT_TYPE_FILTERS,
  type EventType,
} from "@/types/events";
import { isUpcoming, sortEventsByDate } from "@/lib/events-utils";
import { getCountryName, getEventTypeLabel } from "@/lib/events-constants";

const PAGE_SIZE = 10;
const UPCOMING_PAGE_SIZE = 20;

type Props = {
  events: Event[];
};

function filterByType(events: Event[], typeKey: string): Event[] {
  if (typeKey === "all") return events;
  if (typeKey === "other") {
    const allowed = new Set<EventType>([
      "congress",
      "summit",
      "meetup",
      "hackathon",
      "collab",
      "rave",
      "privacycorner",
    ]);
    return events.filter((e) => !allowed.has(e.type));
  }
  const types = EVENT_TYPE_FILTERS[typeKey];
  if (!types || types.length === 0) return events;
  return events.filter((e) => types.includes(e.type));
}

function filterByCountry(events: Event[], countryCodes: string[]): Event[] {
  if (countryCodes.length === 0) return events;
  const set = new Set(countryCodes.map((c) => c.toLowerCase()));
  return events.filter((e) => set.has(e.country.toLowerCase()));
}

function filterBySearch(events: Event[], q: string): Event[] {
  if (!q.trim()) return events;
  const lower = q.toLowerCase();
  return events.filter((e) => {
    const title = (e.title ?? `${getEventTypeLabel(e.type)} ${e.city}`).toLowerCase();
    const city = e.city.toLowerCase();
    const country = getCountryName(e.country).toLowerCase();
    const coincidence = (e.coincidence ?? "").toLowerCase();
    return (
      title.includes(lower) ||
      city.includes(lower) ||
      country.includes(lower) ||
      coincidence.includes(lower)
    );
  });
}

export function EventsPageContent({ events }: Props) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState<string[]>([]);
  const [pastPage, setPastPage] = useState(1);
  const [showOlderCount, setShowOlderCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    let result = events;
    result = filterByType(result, typeFilter);
    result = filterByCountry(result, countryFilter);
    result = filterBySearch(result, search);
    return result;
  }, [events, typeFilter, countryFilter, search]);

  const { upcoming, past } = useMemo(() => {
    const up = sortEventsByDate(
      filtered.filter(isUpcoming),
      true
    );
    const pa = sortEventsByDate(
      filtered.filter((e) => !isUpcoming(e)),
      false
    );
    return { upcoming: up, past: pa };
  }, [filtered]);

  const countryCount = useMemo(() => {
    const set = new Set(events.map((e) => e.country.toLowerCase()));
    return set.size;
  }, [events]);

  const pastDisplay = past.slice(0, showOlderCount);
  const hasMorePast = past.length > showOlderCount;
  const totalPages = Math.max(1, Math.ceil(past.length / PAGE_SIZE));

  return (
    <div className="viewport-range-shell mx-auto w-full max-w-[1140px] px-4 pt-6 pb-10 md:px-6 md:pt-6 lg:max-w-[75vw]">
      <div className="mb-6 -mt-6">
        <EventsFilters
          search={search}
          onSearchChange={setSearch}
          typeFilter={typeFilter}
          onTypeFilterChange={setTypeFilter}
          countryFilter={countryFilter}
          onCountryFilterChange={setCountryFilter}
          events={events}
          countryCount={countryCount}
        />
      </div>

      <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4">
        <h1 className="text-center font-serif text-[26px] font-bold text-black dark:text-[#f2f4f6] md:text-[30px]">
          {filtered.length} Privacy Events
        </h1>
        <Link
          href="/events/admin"
          className="text-[12px] font-bold uppercase tracking-[0.08em] text-black/55 underline hover:text-black dark:text-white/55 dark:hover:text-white"
        >
          Admin
        </Link>
      </div>

      {/* Upcoming events */}
      {upcoming.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-center text-xl font-semibold text-black dark:text-[#f2f4f6] md:text-2xl">
            Upcoming Events
          </h2>
          <div className="flex flex-col gap-3">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* Past events */}
      {past.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-center text-xl font-semibold text-black dark:text-[#f2f4f6] md:text-2xl">
            Past Events
          </h2>
          <div className="flex flex-col gap-3">
            {pastDisplay.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {hasMorePast && (
            <div className="mt-10 flex flex-col items-center justify-center gap-5">
              <div className="flex flex-wrap items-center justify-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((p) => {
                  const isActive =
                    showOlderCount > (p - 1) * PAGE_SIZE &&
                    showOlderCount <= Math.min(p * PAGE_SIZE, past.length);
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() =>
                        setShowOlderCount(Math.min(past.length, p * PAGE_SIZE))
                      }
                      className={
                        isActive
                          ? "flex h-9 min-w-[36px] items-center justify-center rounded-[8px] bg-black px-3.5 text-xs font-bold text-white dark:bg-white dark:text-black"
                          : "flex h-9 min-w-[36px] items-center justify-center rounded-[8px] border border-[#e0e0e0] bg-white px-3.5 text-xs font-bold text-black transition-colors hover:border-black/30 hover:bg-black/5 dark:border-[#303640] dark:bg-[#181d25] dark:text-[#f2f4f6] dark:hover:bg-white/5"
                      }
                    >
                      {p}
                    </button>
                  );
                })}
                {totalPages > 5 && (
                  <span className="flex h-9 items-center px-2 text-xs font-medium text-black/60 dark:text-white/60">
                    – {totalPages}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() =>
                  setShowOlderCount((n) => Math.min(past.length, n + PAGE_SIZE))
                }
                className="rounded-[8px] border border-[#d8d8d8] bg-white px-6 py-2.5 text-[12px] font-bold uppercase tracking-[0.10em] text-black transition-colors hover:bg-[#f5f5f5] dark:border-[#2c3139] dark:bg-[#151a21] dark:text-[#f2f4f6] dark:hover:bg-[#1f252d]"
              >
                Load Older Events
              </button>
            </div>
          )}
        </section>
      )}

      {filtered.length === 0 && (
        <p className="mt-8 text-[#616161] dark:text-[#a7b0bd]">
          No events match your filters.
        </p>
      )}
    </div>
  );
}
