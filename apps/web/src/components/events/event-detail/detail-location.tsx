"use client";

import Image from "next/image";
import type { Event } from "@/types/events";
import type { EventDetailLocation } from "@/types/event-detail";
import { getCountryName } from "@/lib/events-constants";

function stripMarkdownLink(text: string): string {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").trim();
}

function isImageUrl(url: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i.test(url) || url.includes("staticmap") || url.includes("maps.googleapis.com/maps/api/staticmap");
}

type Props = { event: Event; location?: EventDetailLocation };

export function DetailLocation({ event, location }: Props) {
  const place = event.place ? stripMarkdownLink(event.place) : null;
  const address = event["place-address"];
  const city = event.city;
  const country = getCountryName(event.country);
  const mapUrl = location?.mapUrl;
  const directions = location?.directions;

  const hasContent = place || address || city || country || mapUrl || directions;
  if (!hasContent) return null;

  const addressStr = [address, city, country].filter(Boolean).join(", ");
  const showMapImage = mapUrl && isImageUrl(mapUrl);
  const showMapLink = mapUrl && !isImageUrl(mapUrl);

  return (
    <section id="location" className="py-10 md:py-14">
      <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.15em] text-[#121212] dark:text-white">
        Location
      </h2>
      <div className={`grid gap-6 ${showMapImage || showMapLink ? "md:grid-cols-[1fr_1fr]" : ""}`}>
        {showMapImage ? (
          <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-xl border border-[#e0e0e0] dark:border-[#303640]">
            <div className="relative aspect-video w-full">
              <Image src={mapUrl} alt="Map" fill className="object-cover" sizes="50vw" />
            </div>
          </a>
        ) : showMapLink ? (
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex aspect-video items-center justify-center rounded-xl border border-[#e0e0e0] bg-[#f8f8f8] dark:border-[#303640] dark:bg-[#1a1f27]"
          >
            <span className="text-[#70FF88]">View on map →</span>
          </a>
        ) : null}
        <div className="flex flex-col justify-center">
          {place && (
            <p className="text-lg font-semibold text-[#70FF88] dark:text-[#70FF88]">
              {place}
            </p>
          )}
          {addressStr && <p className="mt-2 text-[#3a3a3a] dark:text-[#a7b0bd]">{addressStr}</p>}
          {directions && (
            <a
              href={directions}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex h-10 w-fit items-center justify-center rounded-lg border border-[#70FF88] bg-transparent px-5 text-[12px] font-bold uppercase tracking-[0.08em] text-[#70FF88] transition hover:bg-[#70FF88]/10 dark:text-[#70FF88] dark:hover:bg-[#70FF88]/10"
            >
              Get directions
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
