"use client";

import Link from "next/link";
import { getCountryName, getEventTypeLabel, getEventTitle } from "@/lib/org/events-constants";

function stripMarkdownLink(text: string): string {
  if (!text || typeof text !== "string") return text;
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").trim();
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function getEventImageUrl(event: {
  id: string;
  design?: { image?: string };
}): string {
  const img = event.design?.image;
  if (!img) return `/org/events/${event.id}.jpg`;
  if (img.startsWith("http") || img.startsWith("/")) return img;
  const name = img.includes(".") ? img : `${img}.jpg`;
  return `/org/events/${name}`;
}

type Event = {
  id: string;
  title?: string;
  type?: string;
  city?: string;
  country?: string;
  date?: string;
  place?: string;
  premium?: boolean;
  design?: { image?: string };
  links?: { web?: string };
};

export function EventCardOrg({
  event,
  override = {},
  isPast = false,
}: {
  event: Event;
  override?: Record<string, string>;
  isPast?: boolean;
}) {
  const title = getEventTitle(event, override);
  const dateStr = formatDate(event.date);
  const countryName = getCountryName(event.country);
  const placeDisplay = event.place ? stripMarkdownLink(event.place) : null;
  const typeLabel = getEventTypeLabel(event.type);
  const webUrl = event.links?.web;
  const profileHref = `/org/events/${event.id}`;
  const imageUrl = getEventImageUrl(event);
  const isPremium = event.premium === true || event.type === "premium";

  return (
    <Link
      href={profileHref}
      className={`event-card-org${isPremium ? " is-premium" : ""}`}
      style={{ display: "block", textDecoration: "none", color: "inherit" }}
    >
      <div className="event-card-org-inner">
        <div className="event-card-org-media">
          {imageUrl ? (
            <img src={imageUrl} alt="" loading="lazy" />
          ) : (
            <div className="event-card-org-media-placeholder" aria-hidden />
          )}
        </div>
        <div className="event-card-org-body">
          <h3 className="event-card-org-title">{title}</h3>
          {dateStr && <p className="event-card-org-date">{dateStr}</p>}
          {(placeDisplay || event.city || event.country) && (
            <div className="event-card-org-meta-row">
              {placeDisplay && <span>Venue: {placeDisplay}</span>}
              {placeDisplay && (event.city || event.country) && " · "}
              <span className="event-card-org-location">
                {event.city}
                {event.city && countryName ? `, ${countryName}` : countryName}
              </span>
            </div>
          )}
        </div>
        <div className="event-card-org-actions">
          <span className="event-card-org-type-pill">{typeLabel}</span>
          {webUrl && (
            <a
              href={webUrl}
              target="_blank"
              rel="noreferrer"
              className="event-card-org-link"
              onClick={(e) => e.stopPropagation()}
            >
              Website
            </a>
          )}
        </div>
      </div>
    </Link>
  );
}
