"use client";

import React, { useState } from "react";
import Link from "next/link";
import { getCountryName, getEventTypeLabel, getEventTitle } from "@/lib/org/events-constants";
import type { EventItem, EventDetail } from "@/lib/org/events-types";

function stripMarkdownLink(text: string): string {
  if (!text || typeof text !== "string") return text;
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").trim();
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
}

const linkIcons: Record<string, () => React.ReactNode> = {
  link: () => <span className="event-detail-link-icon" aria-hidden />,
  doc: () => <span className="event-detail-link-icon" aria-hidden />,
  github: () => <span className="event-detail-link-icon" aria-hidden />,
  twitter: () => <span className="event-detail-link-icon" aria-hidden />,
  discord: () => <span className="event-detail-link-icon" aria-hidden />,
  telegram: () => <span className="event-detail-link-icon" aria-hidden />,
};

function getLinkIcon(label: string): string {
  const l = (label || "").toLowerCase();
  if (l.includes("github")) return "github";
  if (l.includes("twitter") || l.includes("x.com")) return "twitter";
  if (l.includes("discord")) return "discord";
  if (l.includes("telegram")) return "telegram";
  if (l.includes("doc") || l.includes("documentation")) return "doc";
  return "link";
}

function orgAsset(src: string | undefined): string {
  if (!src) return "";
  if (src.startsWith("http") || src.startsWith("//") || src.startsWith("/org")) return src;
  return "/org" + (src.startsWith("/") ? src : `/${src}`);
}

type OrgEventDetailContentProps = {
  event: EventItem;
  detail: EventDetail | null;
  titleOverride?: string;
};

type FaqExpandedState = Record<number, boolean>;

export function OrgEventDetailContent({ event, detail, titleOverride }: OrgEventDetailContentProps) {
  const overrides = titleOverride != null ? { [event.id]: titleOverride } : {};
  const title = getEventTitle(event, overrides);
  const dateStr = formatDate(event.date);
  const countryName = getCountryName(event.country);
  const location = event.city ? `${event.city}${countryName ? `, ${countryName}` : ""}` : countryName;
  const headerImageUrl = detail?.headerImageUrl;
  const buyUrl = detail?.tickets?.buyUrl ?? event.links?.rsvp ?? event.links?.web;

  const faqItems = detail?.faq?.items ?? [];
  const [faqExpanded, setFaqExpanded] = useState<FaqExpandedState>({});
  const faqCount = faqItems.length;
  const allFaqExpanded = faqCount >= 1 && faqItems.every((_, i) => faqExpanded[i]);
  const toggleFaq = (i: number) => setFaqExpanded((prev) => ({ ...prev, [i]: !prev[i] }));
  const expandAllFaq = () => setFaqExpanded(faqCount >= 1 ? Object.fromEntries(faqItems.map((_, i) => [i, true])) : {});
  const collapseAllFaq = () => setFaqExpanded({});
  const onExpandAllClick = allFaqExpanded ? collapseAllFaq : expandAllFaq;

  const hasTopicsOrLinks = (detail?.topics?.enabled && detail.topics?.content) || (() => {
    const ll = detail?.links;
    if (Array.isArray(ll)) return ll.length >= 1;
    return ((ll as { custom?: unknown[] })?.custom?.length ?? 0) >= 1;
  })();
  const detailLinks: { label: string; url: string }[] = (() => {
    const ll = detail?.links;
    if (Array.isArray(ll)) return ll as { label: string; url: string }[];
    return ((ll as { custom?: { label: string; url: string }[] })?.custom ?? []) as { label: string; url: string }[];
  })();
  const hasDetailLinks = detailLinks.length >= 1;
  const speakers = detail?.speakers as { id?: string; name?: string; role?: string; bio?: string; avatar?: string; twitter?: string }[] | undefined;
  const hasSpeakers = speakers && speakers.length >= 1;
  const exp = detail?.experience;
  const expContent = exp && (exp as { content?: string }).content;
  const expCards = exp && (exp as { cards?: unknown[] }).cards;
  const hasExpCards = expCards && expCards.length >= 1;
  const hasExperience = detail?.experience?.enabled && (!!expContent || !!hasExpCards);
  const loc = detail?.location as { mapUrl?: string; directions?: string } | undefined;
  const hasLocation = loc && (!!loc.mapUrl || !!loc.directions);
  const hasEventMap = detail?.eventMap?.enabled && !!detail.eventMap?.imageUrl;
  const scheduleItems = (detail?.schedule as { items?: Array<{ time?: string; title?: string; speaker?: string }> })?.items;
  const hasSchedule = detail?.schedule?.enabled && scheduleItems && scheduleItems.length >= 1;
  const galleryImages = (detail?.gallery as { images?: Array<{ url: string; caption?: string }> })?.images;
  const hasGallery = detail?.gallery?.enabled && galleryImages && galleryImages.length >= 1;
  const hasTickets = detail?.tickets?.enabled && !!(detail.tickets as { buyUrl?: string }).buyUrl;
  const hasFaq = faqCount >= 1;
  const sponsorItems = (detail?.sponsors as { items?: Array<{ name: string; logo?: string; url?: string }> })?.items;
  const hasSponsors = detail?.sponsors?.enabled && sponsorItems && sponsorItems.length >= 1;
  const contributorItems = (detail?.contributors as { items?: Array<{ name: string; role?: string; avatar?: string }> })?.items;
  const hasContributors = detail?.contributors?.enabled && contributorItems && contributorItems.length >= 1;

  return (
    <div role="main" className="landing-root events-page event-detail-page">
      <div className="events-page-inner">
        <header className="event-detail-hero">
          <div className="event-detail-hero-bar">
            <Link href="/org/events" className="event-detail-back">← Back to Events</Link>
          </div>
          <div className="event-detail-hero-media">
            {headerImageUrl ? (
              <img src={orgAsset(headerImageUrl)} alt="" />
            ) : (
              <div className="event-detail-hero-placeholder" aria-hidden />
            )}
          </div>
          <div className="event-detail-hero-content">
            <span className="event-detail-hero-type">{getEventTypeLabel(event.type)}</span>
            <h1>{title}</h1>
            <p className="event-detail-hero-date">{dateStr}</p>
            {detail?.timeRange && <p className="event-detail-hero-time">{String(detail.timeRange)}</p>}
            {(location || event.place) && (
              <p className="event-detail-hero-location">
                {location}
                {event.place && ` · ${stripMarkdownLink(event.place)}`}
              </p>
            )}
            {event.description && <p className="event-detail-hero-desc">{event.description}</p>}
            <div className="event-detail-hero-ctas">
              {buyUrl && (
                <a href={buyUrl} className="primary-btn" target="_blank" rel="noreferrer">
                  {event.links?.web ? "VISIT WEBSITE" : "RSVP / GET TICKETS"}
                </a>
              )}
              {detail?.addToCalendarUrl && (
                <a href={String(detail.addToCalendarUrl)} className="event-detail-hero-btn-secondary" target="_blank" rel="noreferrer">Add to calendar</a>
              )}
              {loc?.mapUrl && (
                <a href={String(loc.mapUrl)} className="event-detail-hero-btn-secondary" target="_blank" rel="noreferrer">Get directions</a>
              )}
            </div>
          </div>
        </header>

        <div className="events-content-wrap event-detail-body">
          {hasTopicsOrLinks && (
            <section className="event-detail-section event-detail-topics-links">
              <div className="event-detail-topics-links-grid">
                {detail?.topics?.enabled && detail.topics?.content && (
                  <div className="event-detail-topics-col">
                    <h2 className="event-detail-section-title">Topics</h2>
                    <div className="event-detail-prose" dangerouslySetInnerHTML={{ __html: String(detail.topics.content).replace(/\n/g, "<br/>") }} />
                  </div>
                )}
                {hasDetailLinks && (
                  <div className="event-detail-links-col">
                    <h2 className="event-detail-section-title">Links</h2>
                    <ul className="event-detail-links">
                      {detailLinks.map((link, i) => {
                        const iconKey = getLinkIcon(link.label);
                        const Icon = linkIcons[iconKey] || linkIcons.link;
                        return (
                          <li key={i} className="event-detail-link-item">
                            <span className="event-detail-link-icon"><Icon /></span>
                            <a href={link.url} target="_blank" rel="noreferrer">{link.label}</a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}
          {hasSpeakers && (
            <section className="event-detail-section">
              <h2 className="event-detail-section-title">Speakers</h2>
              <div className="event-detail-speakers">
                {speakers!.map((s) => (
                  <div key={s.id || s.name} className="event-detail-speaker">
                    {s.avatar && <img src={orgAsset(s.avatar)} alt="" />}
                    <div>
                      <strong>{s.name}</strong>
                      {s.role && <span> · {s.role}</span>}
                      {s.bio && <p>{s.bio}</p>}
                      {s.twitter && <a href={s.twitter} target="_blank" rel="noreferrer">Twitter</a>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          {hasExperience && (
            <section className="event-detail-section">
              <h2 className="event-detail-section-title">{(detail!.experience as { title?: string }).title || "Experience"}</h2>
              {expContent && (
                <div className="event-detail-prose" dangerouslySetInnerHTML={{ __html: String(expContent).replace(/\n/g, "<br/>") }} />
              )}
              {hasExpCards && (
                <div className="event-detail-cards">
                  {(expCards as Array<{ title?: string; description?: string }>).map((card, i) => (
                    <div key={i} className="event-detail-card">
                      <h4>{card.title}</h4>
                      <p>{card.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
          {hasLocation && (
            <section className="event-detail-section">
              <h2 className="event-detail-section-title">Location</h2>
              {loc!.mapUrl && (
                <a href={loc!.mapUrl!} target="_blank" rel="noreferrer" className="primary-btn">View on map</a>
              )}
              {loc!.directions && (
                <p className="event-detail-location-directions">{loc!.directions}</p>
              )}
            </section>
          )}
          {hasEventMap && detail?.eventMap?.imageUrl && (
            <section className="event-detail-section">
              <h2 className="event-detail-section-title">Event map</h2>
              <div className="event-detail-event-map">
                <a href={loc?.mapUrl || "#"} target="_blank" rel="noreferrer" className="event-detail-event-map-link">
                  <img src={orgAsset(detail.eventMap!.imageUrl)} alt="Event venue map" loading="lazy" />
                </a>
              </div>
            </section>
          )}
          {hasSchedule && scheduleItems && (
            <section className="event-detail-section">
              <h2 className="event-detail-section-title">Schedule</h2>
              <ul className="event-detail-schedule">
                {scheduleItems.map((item, i) => (
                  <li key={i}>
                    <span className="event-detail-schedule-time">{item.time}</span>
                    <span className="event-detail-schedule-title">{item.title}</span>
                    {item.speaker && <span className="event-detail-schedule-speaker">{item.speaker}</span>}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {hasGallery && galleryImages && (
            <section className="event-detail-section">
              <h2 className="event-detail-section-title">Gallery</h2>
              <div className="event-detail-gallery">
                {galleryImages.map((img, i) => (
                  <a key={i} href={img.url} target="_blank" rel="noreferrer">
                    <img src={orgAsset(img.url)} alt={img.caption || ""} loading="lazy" />
                  </a>
                ))}
              </div>
            </section>
          )}
          {hasTickets && (detail?.tickets as { buyUrl: string }).buyUrl && (
            <section className="event-detail-section">
              <h2 className="event-detail-section-title">Tickets</h2>
              <a href={(detail!.tickets as { buyUrl: string }).buyUrl} className="primary-btn event-detail-tickets-cta" target="_blank" rel="noreferrer">Get tickets</a>
            </section>
          )}
          {hasFaq && (
            <section className="event-detail-section">
              <div className="event-detail-faq-header">
                <h2 className="event-detail-section-title">FAQ</h2>
                <button type="button" className="event-detail-expand-all-btn" onClick={onExpandAllClick} aria-expanded={allFaqExpanded}>
                  {allFaqExpanded ? "Collapse all" : "Expand all"}
                </button>
              </div>
              <div className="event-detail-faq-accordion">
                {faqItems.map((item, i) => (
                  <div key={i} className={`event-detail-faq-item ${faqExpanded[i] ? "is-open" : ""}`}>
                    <button type="button" className="event-detail-faq-trigger" onClick={() => toggleFaq(i)} aria-expanded={!!faqExpanded[i]}>
                      <span className="event-detail-faq-question">{item.question}</span>
                      <span className="event-detail-faq-icon" aria-hidden>+</span>
                    </button>
                    <div className="event-detail-faq-panel" hidden={!faqExpanded[i]}>
                      <div className="event-detail-faq-answer">{item.answer}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          {hasSponsors && sponsorItems && (
            <section className="event-detail-section">
              <h2 className="event-detail-section-title">Sponsors</h2>
              <div className="event-detail-sponsors">
                {sponsorItems.map((s, i) => (
                  <a key={i} href={s.url || "#"} target="_blank" rel="noreferrer" className="event-detail-sponsor">
                    {s.logo ? <img src={orgAsset(s.logo)} alt={s.name} loading="lazy" /> : <span>{s.name}</span>}
                  </a>
                ))}
              </div>
            </section>
          )}
          {hasContributors && contributorItems && (
            <section className="event-detail-section">
              <h2 className="event-detail-section-title">Contributors</h2>
              <div className="event-detail-contributors">
                {contributorItems.map((c, i) => (
                  <div key={i} className="event-detail-contributor">
                    {c.avatar && <img src={orgAsset(c.avatar)} alt="" loading="lazy" />}
                    <div>
                      <strong>{c.name}</strong>
                      {c.role && <span>{c.role}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
