"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { getOrgDefaultContent } from "@/lib/org/default-content";
import { isUpcoming, sortEventsByDate } from "@/lib/org/events-constants";
import { EventsHero } from "./events/EventsHero";
import { EventsFilters } from "./events/EventsFilters";
import { EventsUpcoming } from "./events/EventsUpcoming";
import { EventsFeaturedBlock } from "./events/EventsFeaturedBlock";
import { EventsPast } from "./events/EventsPast";

type EventItem = {
  id: string;
  type?: string;
  date?: string;
  city?: string;
  country?: string;
  title?: string;
  place?: string;
  premium?: boolean;
  design?: { image?: string };
  links?: { web?: string };
};

export function OrgEventsContent() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countryFilter, setCountryFilter] = useState<string[]>([]);

  const content = getOrgDefaultContent();
  const eventsPageConfig = (content?.eventsPage ?? {}) as {
    hero?: Record<string, unknown>;
    featured?: Record<string, unknown>;
    eventsFeaturedIds?: string[];
    eventsOverrides?: Record<string, string>;
  };
  const featuredIds = eventsPageConfig.eventsFeaturedIds ?? [];
  const overrides = eventsPageConfig.eventsOverrides ?? {};

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch("/org/events.json")
      .then((res) => res.json())
      .then((data: { events?: EventItem[] }) => {
        if (cancelled) return;
        let list = data.events ?? [];
        if (Array.isArray(featuredIds) && featuredIds.length > 0) {
          const set = new Set(featuredIds);
          list = list.filter((e) => set.has(e.id));
        }
        setEvents(list);
      })
      .catch((err) => {
        if (!cancelled) setError((err as Error)?.message ?? "Failed to load events");
        setEvents([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [featuredIds.length]);

  const filtered = useMemo(() => {
    let list = events;
    if (countryFilter.length > 0) {
      const set = new Set(countryFilter.map((c) => c.toLowerCase()));
      list = list.filter((e) => set.has((e.country ?? "").toLowerCase()));
    }
    return list;
  }, [events, countryFilter]);

  const { upcoming, past } = useMemo(() => {
    const up = sortEventsByDate(
      filtered.filter((e) => isUpcoming(e)),
      true
    ) as EventItem[];
    const pa = sortEventsByDate(
      filtered.filter((e) => !isUpcoming(e)),
      false
    ) as EventItem[];
    return { upcoming: up, past: pa };
  }, [filtered]);

  return (
    <main className="landing-root events-page">
      <div className="events-page-inner">
        <EventsHero hero={eventsPageConfig.hero as any} />

        <div className="events-content-wrap">
          {error && (
            <p className="events-error" role="alert">
              {error}
            </p>
          )}

          <div className="events-toolbar">
            <EventsFilters
              countryFilter={countryFilter}
              onCountryFilterChange={setCountryFilter}
              events={events}
            />
            <Link href="/org/events/admin" className="event-admin-link">
              Admin
            </Link>
          </div>

          {loading ? (
            <p className="events-loading">Loading events…</p>
          ) : (
            <>
              <EventsUpcoming events={upcoming} overrides={overrides} />
              <EventsFeaturedBlock featured={eventsPageConfig.featured} />
              <EventsPast events={past} overrides={overrides} />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
