"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Event } from "@/types/events";
import { getCountryName, getEventTypeLabel } from "@/lib/events-constants";
import { format, parseISO } from "date-fns";

const PREMIUM_PLACEHOLDER = "/events/premium-placeholder.svg";

/** Resolve event image for display: design.image (URL or /events/name) or fallback /events/{id}.jpg */
function getEventImageUrl(event: Event): string {
  const img = event.design?.image;
  if (!img) return `/events/${event.id}.jpg`;
  if (img.startsWith("http") || img.startsWith("/")) return img;
  const name = img.includes(".") ? img : `${img}.jpg`;
  return `/events/${name}`;
}

type Props = { event: Event };

function EventLocation({ event }: { event: Event }) {
  const name = getCountryName(event.country);
  return (
    <span className="inline-flex items-center gap-1.5 text-sm">
      <span
        className="inline-block h-4 w-6 flex-shrink-0 rounded-sm border border-black/20 bg-cover bg-center"
        style={{
          backgroundImage: `url(https://flagcdn.com/w40/${event.country.toLowerCase()}.png)`,
        }}
        aria-hidden
      />
      <span>
        {event.city}, {name}
      </span>
    </span>
  );
}

function stripMarkdownLink(text: string): string {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").trim();
}

function EventTitleDisplay({
  title,
  isPremium,
}: {
  title: string;
  isPremium: boolean;
}) {
  const baseClass =
    "font-[Inter] text-lg font-semibold text-[#121212] dark:text-[#f2f4f6] md:text-xl";
  const premiumClass = "font-[Inter] text-xl font-bold md:text-2xl";
  return (
    <span className={isPremium ? premiumClass : baseClass}>{title}</span>
  );
}

export function EventCard({ event }: Props) {
  const router = useRouter();
  const isPremium = event.premium === true;
  const title =
    event.title ?? `${getEventTypeLabel(event.type)} ${event.city}`;
  const description = event.description;
  const dateStr = format(parseISO(event.date), "MMM d, yyyy");
  const placeDisplay = event.place ? stripMarkdownLink(event.place) : null;
  const webUrl = event.links?.web;
  const typeLabel = getEventTypeLabel(event.type);

  if (isPremium) {
    const bgStyle = event.design?.background
      ? { background: event.design.background }
      : undefined;
    const imageUrl =
      event.design?.image?.startsWith("http") || event.design?.image?.startsWith("/")
        ? event.design.image
        : event.design?.image
          ? `/events/${event.design.image.includes(".") ? event.design.image : event.design.image + ".jpg"}`
          : PREMIUM_PLACEHOLDER;

    const eventHref = `/events/${event.id}`;
    return (
      <article
        role="button"
        tabIndex={0}
        onClick={() => router.push(eventHref)}
        onKeyDown={(e) => e.key === "Enter" && router.push(eventHref)}
        className="group relative flex cursor-pointer overflow-hidden rounded-[12px] bg-black text-white transition-all duration-200 hover:shadow-[0_14px_30px_rgba(0,0,0,0.4)]"
        style={bgStyle}
      >
        <div className="flex min-h-[180px] w-full flex-col md:flex-row">
          <div className="relative flex flex-shrink-0 items-center justify-center bg-black/40 md:w-48 lg:w-56">
            <div
              className="h-full min-h-[140px] w-full bg-cover bg-center bg-no-repeat opacity-90 md:min-h-[180px]"
              style={{
                backgroundImage: `url(${imageUrl})`,
              }}
            />
            {!event.design?.image && (
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={PREMIUM_PLACEHOLDER}
                  alt=""
                  className="h-24 w-24 opacity-40 [filter:invert(1)]"
                  aria-hidden
                />
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col justify-center p-5 md:flex-row md:items-center md:justify-between md:gap-4 md:p-6">
            <div className="min-w-0 flex-1">
              <span className="mb-2 block inline-flex w-fit items-center rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                {typeLabel}
              </span>
              <EventTitleDisplay title={title} isPremium={true} />
              {description && (
                <p className="mt-2 line-clamp-1 text-sm text-white/90">
                  {description}
                </p>
              )}
              <div className="mt-2 flex flex-wrap items-center justify-between gap-x-2 gap-y-0.5 text-sm text-white/90">
                <span className="flex flex-wrap items-center gap-x-2">
                  {placeDisplay && <span>Venue: {placeDisplay}</span>}
                  {placeDisplay && (event.city || event.country) && <span aria-hidden>·</span>}
                  <EventLocation event={event} />
                </span>
                {webUrl && (
                  <a
                    href={webUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="shrink-0 text-xs font-medium uppercase tracking-[0.08em] text-white/80 hover:text-white hover:underline"
                  >
                    WEBSITE →
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <NonPremiumCard event={event} title={title} dateStr={dateStr} placeDisplay={placeDisplay} typeLabel={typeLabel} webUrl={webUrl} />
  );
}

function NonPremiumCard({
  event,
  title,
  dateStr,
  placeDisplay,
  typeLabel,
  webUrl,
}: {
  event: Event;
  title: string;
  dateStr: string;
  placeDisplay: string | null;
  typeLabel: string;
  webUrl: string | undefined;
}) {
  const [imageError, setImageError] = useState(false);
  const nonPremiumImageUrl = getEventImageUrl(event);

  const router = useRouter();
  const eventHref = `/events/${event.id}`;
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => router.push(eventHref)}
      onKeyDown={(e) => e.key === "Enter" && router.push(eventHref)}
      className="group relative flex cursor-pointer flex-col rounded-[12px] border border-[#e0e0e0] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] dark:border-[#303640] dark:bg-[#181d25] dark:hover:shadow-[0_8px_20px_rgba(0,0,0,0.25)] sm:flex-row sm:items-stretch sm:justify-between sm:gap-0 sm:p-0"
    >
      <div className="flex h-28 w-full flex-shrink-0 overflow-hidden rounded-t-[12px] bg-[#e8e8e8] dark:bg-[#252d38] sm:h-auto sm:w-36 sm:rounded-l-[12px] sm:rounded-tr-none">
        {!imageError ? (
          <img
            src={nonPremiumImageUrl}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : null}
      </div>
      <div className="min-w-0 flex-1 p-4 sm:py-3 sm:pl-4 sm:pr-2">
        <h3 className="font-[Inter] font-semibold text-[#121212] dark:text-[#f2f4f6]">
          <EventTitleDisplay title={title} isPremium={false} />
        </h3>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-base text-[#616161] dark:text-[#a7b0bd]">
          <span>{dateStr}</span>
          {event.coincidence && (
            <>
              <span aria-hidden>·</span>
              <span>{stripMarkdownLink(event.coincidence)}</span>
            </>
          )}
        </div>
        <div className="mt-1.5 flex flex-col gap-0.5 text-sm text-[#616161] dark:text-[#a7b0bd] sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3">
          {placeDisplay && <span>Venue: {placeDisplay}</span>}
          <EventLocation event={event} />
        </div>
      </div>
      <div className="flex flex-shrink-0 items-center border-t border-[#e0e0e0] p-4 dark:border-[#303640] sm:flex-row sm:justify-end sm:border-t-0 sm:py-4 sm:pl-4">
        <span className="inline-flex h-9 shrink-0 items-center rounded-lg border border-black/20 bg-black px-3 text-xs font-bold uppercase tracking-wider text-white dark:bg-white dark:text-black">
          {typeLabel}
        </span>
        {webUrl && (
          <a
            href={webUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="ml-6 text-[13px] font-medium uppercase tracking-[0.08em] text-black hover:underline dark:text-[#f2f4f6]"
          >
            WEBSITE →
          </a>
        )}
      </div>
    </article>
  );
}
