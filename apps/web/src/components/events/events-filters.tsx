"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { EVENT_TYPE_LABELS } from "@/types/events";
import { getCountryName } from "@/lib/events-constants";
import { AddEventForm } from "./add-event-form";
import type { Event } from "@/types/events";

const TYPE_KEYS = ["all", "conferences", "meetups", "hackathons", "w3pn-only", "other"] as const;

type Props = {
  search: string;
  onSearchChange: (v: string) => void;
  typeFilter: string;
  onTypeFilterChange: (v: string) => void;
  countryFilter: string[];
  onCountryFilterChange: (v: string[]) => void;
  events: Event[];
  countryCount: number;
};

export function EventsFilters({
  search,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  countryFilter,
  onCountryFilterChange,
  events,
  countryCount,
}: Props) {
  const [addOpen, setAddOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const countryCodes = useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => set.add(e.country.toLowerCase()));
    return Array.from(set).sort();
  }, [events]);

  const toggleCountry = (code: string) => {
    const next = countryFilter.includes(code)
      ? countryFilter.filter((c) => c !== code)
      : [...countryFilter, code];
    onCountryFilterChange(next);
  };

  return (
    <>
      {/* Submenu: Type pills left, Search + Add Event right; mobile: search icon opens sheet */}
      <div className="sticky top-0 z-40 rounded-[12px] bg-[#f0f0f0] p-3 dark:bg-[#1a1f27]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
          {TYPE_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => onTypeFilterChange(key)}
              className={
                typeFilter === key
                  ? "rounded-full bg-black px-4 py-2 text-xs font-bold uppercase tracking-wider text-white dark:bg-white dark:text-black"
                  : "rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-black transition-colors hover:bg-black/10 dark:bg-[#252b35] dark:text-[#f2f4f6] dark:hover:bg-white/10"
              }
            >
              {EVENT_TYPE_LABELS[key]}
            </button>
          ))}
          </div>
          <div className="flex items-center gap-2">
          <label className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search events"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-10 w-[160px] rounded-[8px] border border-transparent bg-white px-3 pr-9 text-[14px] text-black outline-none transition-[border-color,box-shadow] placeholder:text-[#606060] focus:border-black/25 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.08)] dark:border-[#3b4048] dark:bg-[#12161d] dark:text-[#f2f4f6] dark:placeholder:text-[#95a0ae] dark:focus:border-white/20 dark:focus:shadow-[0_0_0_3px_rgba(255,255,255,0.08)]"
            />
            <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-black/70 dark:text-[#c6ccd6]">
              <span className="material-symbols-rounded block text-[18px] leading-none">
                search
              </span>
            </span>
          </label>
          <Sheet open={searchOpen} onOpenChange={setSearchOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-white text-black md:hidden dark:bg-[#12161d] dark:text-[#f2f4f6]"
                aria-label="Search events"
              >
                <span className="material-symbols-rounded text-[20px]">search</span>
              </button>
            </SheetTrigger>
            <SheetContent side="top" className="pt-12">
              <label className="relative block">
                <input
                  type="text"
                  placeholder="Search events"
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                  autoFocus
                  className="h-12 w-full rounded-[8px] border border-[#d6d6d6] bg-white px-4 pr-12 text-[16px] text-black dark:border-[#3b4048] dark:bg-[#12161d] dark:text-[#f2f4f6]"
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-black/70 dark:text-[#c6ccd6]">
                  <span className="material-symbols-rounded text-[20px]">search</span>
                </span>
              </label>
            </SheetContent>
          </Sheet>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="inline-flex h-10 shrink-0 items-center rounded-lg border border-[#70FF88] bg-[#70FF88] px-4 text-[12px] font-bold uppercase tracking-[0.08em] text-black transition-all hover:-translate-y-0.5 hover:bg-[#5bee72]"
              >
                ADD EVENT
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add event</DialogTitle>
              </DialogHeader>
              <AddEventForm onSuccess={() => setAddOpen(false)} />
            </DialogContent>
          </Dialog>
          </div>
        </div>
      </div>

      {/* Country filter – below submenu, centered */}
      <div className="flex flex-wrap items-center justify-center gap-2 py-4">
        <button
          type="button"
          onClick={() => onCountryFilterChange([])}
          className={
            countryFilter.length === 0
              ? "inline-flex items-center gap-1.5 rounded-full bg-black px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white dark:bg-white dark:text-black"
              : "inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-black transition-colors hover:bg-black/10 dark:bg-[#252b35] dark:text-[#f2f4f6] dark:hover:bg-white/10"
          }
        >
          ALL COUNTRIES ({countryCount})
        </button>
        {countryCodes.map((code) => {
          const active = countryFilter.includes(code);
          return (
            <button
              key={code}
              type="button"
              onClick={() => toggleCountry(code)}
              className={
                active
                  ? "inline-flex items-center gap-1.5 rounded-full bg-black px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white dark:bg-white dark:text-black"
                  : "inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-black transition-colors hover:bg-black/10 dark:bg-[#252b35] dark:text-[#f2f4f6] dark:hover:bg-white/10"
              }
            >
              <span
                className="inline-block h-3.5 w-5 flex-shrink-0 rounded-sm border border-black/20 bg-cover bg-center"
                style={{
                  backgroundImage: `url(https://flagcdn.com/w40/${code}.png)`,
                }}
                aria-hidden
              />
              {getCountryName(code)}
            </button>
          );
        })}
      </div>
    </>
  );
}
