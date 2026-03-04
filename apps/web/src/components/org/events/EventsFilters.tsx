"use client";

import { useMemo } from "react";
import { getCountryName } from "@/lib/org/events-constants";

type Event = { country?: string };

export function EventsFilters({
  countryFilter,
  onCountryFilterChange,
  events,
}: {
  countryFilter: string[];
  onCountryFilterChange: (next: string[]) => void;
  events: Event[];
}) {
  const countries = useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => {
      if (e.country) set.add(e.country.toLowerCase());
    });
    return Array.from(set).sort();
  }, [events]);

  return (
    <div className="events-filters">
      <div className="events-filters-row">
        <button
          type="button"
          className={`events-filter-pill ${countryFilter.length === 0 ? "is-active" : ""}`}
          onClick={() => onCountryFilterChange([])}
        >
          ALL LOCATIONS
        </button>
        {countries.map((code) => (
          <button
            key={code}
            type="button"
            className={`events-filter-pill events-filter-pill-flag ${countryFilter.includes(code) ? "is-active" : ""}`}
            onClick={() => {
              const next = countryFilter.includes(code)
                ? countryFilter.filter((c) => c !== code)
                : [...countryFilter, code];
              onCountryFilterChange(next);
            }}
          >
            <span
              className="events-flag"
              style={{ backgroundImage: `url(https://flagcdn.com/w40/${code}.png)` }}
              aria-hidden
            />
            {getCountryName(code)}
          </button>
        ))}
      </div>
    </div>
  );
}
