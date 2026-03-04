"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Share2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import type { Event } from "@/types/events";
import type { EventDetail } from "@/types/event-detail";
import { getEventTypeLabel } from "@/lib/events-constants";
import { getCountryName } from "@/lib/events-constants";

function stripMarkdownLink(text: string): string {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").trim();
}

type Props = { event: Event; detail: EventDetail | null };

export function DetailHero({ event, detail }: Props) {
  const title = event.title ?? `${getEventTypeLabel(event.type)} ${event.city}`;
  const dateStr = format(parseISO(event.date), "dd. MMMM yyyy").toUpperCase();
  const timeRange = detail?.timeRange;
  const city = event.city;
  const country = getCountryName(event.country);
  const placeDisplay = event.place ? stripMarkdownLink(event.place) : null;
  const description = event.description;
  const headerImageUrl = detail?.headerImageUrl;
  const buyUrl = detail?.tickets?.buyUrl ?? event.links?.rsvp ?? event.links?.web;
  const addToCalendarUrl = detail?.addToCalendarUrl;
  const agendaUrl = detail?.agendaUrl;

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title,
          url: typeof window !== "undefined" ? window.location.href : "",
        });
      } catch {
        if (typeof navigator !== "undefined" && navigator.clipboard) {
          navigator.clipboard.writeText(typeof window !== "undefined" ? window.location.href : "");
        }
      }
    }
  };

  return (
    <header className="relative">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-4 md:px-6">
        <Link
          href="/events"
          className="flex items-center gap-1 text-sm text-[#616161] transition hover:text-[#121212] dark:text-[#a7b0bd] dark:hover:text-white"
        >
          <ChevronLeft className="h-5 w-5" />
          Back
        </Link>
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center gap-1 text-sm text-[#616161] transition hover:text-[#121212] dark:text-[#a7b0bd] dark:hover:text-white"
          aria-label="Share"
        >
          <Share2 className="h-5 w-5" />
        </button>
      </div>

      {/* Hero with optional background */}
      <div
        className={`relative overflow-hidden ${headerImageUrl ? "min-h-[320px] md:min-h-[400px]" : ""}`}
      >
        {headerImageUrl && (
          <div className="absolute inset-0">
            <Image
              src={headerImageUrl}
              alt=""
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>
        )}
        <div
          className={`relative flex flex-col items-center justify-center px-4 py-12 text-center md:py-16 ${
            headerImageUrl ? "min-h-[320px] md:min-h-[400px]" : ""
          }`}
        >
          <h1
            className={`max-w-3xl font-[Inter] text-3xl font-bold md:text-4xl lg:text-5xl ${
              headerImageUrl
                ? "text-white"
                : "text-[#121212] dark:text-white"
            }`}
          >
            {title}
          </h1>
          <div
            className={`mt-4 flex flex-wrap items-center justify-center gap-2 text-sm md:gap-4 ${
              headerImageUrl ? "text-white/90" : "text-[#616161] dark:text-[#a7b0bd]"
            }`}
          >
            <span>{dateStr}</span>
            {timeRange && (
              <>
                <span aria-hidden>//</span>
                <span>{timeRange}</span>
              </>
            )}
            {(city || country) && (
              <>
                <span aria-hidden>//</span>
                <span>
                  {[city, country].filter(Boolean).join(" / ")}
                </span>
              </>
            )}
          </div>
          {description && (
            <p
              className={`mx-auto mt-4 max-w-2xl text-base ${
                headerImageUrl ? "text-white/90" : "text-[#3a3a3a] dark:text-[#a7b0bd]"
              }`}
            >
              {description}
            </p>
          )}

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {agendaUrl && (
              <a
                href={agendaUrl}
                {...(agendaUrl.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="inline-flex h-11 items-center justify-center rounded-lg border border-[#70FF88] bg-[#70FF88] px-6 text-[12px] font-bold uppercase tracking-[0.08em] text-black transition hover:bg-[#5ee756] dark:border-[#70FF88] dark:bg-[#70FF88] dark:text-black dark:hover:bg-[#5ee756]"
              >
                View agenda
              </a>
            )}
            {buyUrl && (
              <a
                href={buyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-lg border border-[#70FF88] bg-[#70FF88] px-6 text-[12px] font-bold uppercase tracking-[0.08em] text-black transition hover:bg-[#5ee756] dark:border-[#70FF88] dark:bg-[#70FF88] dark:text-black dark:hover:bg-[#5ee756]"
              >
                Get tickets
              </a>
            )}
            {addToCalendarUrl && (
              <a
                href={addToCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-[#e0e0e0] bg-white px-6 text-[12px] font-bold uppercase tracking-[0.08em] text-[#121212] transition hover:bg-[#f5f5f5] dark:border-[#404850] dark:bg-[#252b35] dark:text-white dark:hover:bg-[#303640]"
              >
                Add to calendar
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Green separator */}
      <div className="flex items-center justify-center px-4 py-2">
        <div className="h-px flex-1 max-w-[120px] bg-[#70FF88] dark:bg-[#70FF88]" />
        <div className="mx-2 h-2 w-2 rotate-45 border-r-2 border-b-2 border-[#70FF88] dark:border-[#70FF88]" />
        <div className="h-px flex-1 max-w-[120px] bg-[#70FF88] dark:bg-[#70FF88]" />
      </div>
    </header>
  );
}
