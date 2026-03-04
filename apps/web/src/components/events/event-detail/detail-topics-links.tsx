"use client";

import ReactMarkdown from "react-markdown";
import { ArrowUpRight } from "lucide-react";
import type { EventDetailTopics } from "@/types/event-detail";
import type { EventDetailLinks } from "@/types/event-detail";
import type { EventLinks } from "@/types/events";

type Props = {
  topics?: EventDetailTopics;
  baseLinks?: EventLinks;
  detailLinks?: EventDetailLinks;
};

function buildLinkItems(baseLinks?: EventLinks, detailLinks?: EventDetailLinks) {
  const items: { label: string; url: string }[] = [];
  if (baseLinks?.web) items.push({ label: "Official Website", url: baseLinks.web });
  if (baseLinks?.rsvp) items.push({ label: "RSVP", url: baseLinks.rsvp });
  if (detailLinks?.twitter) items.push({ label: "Twitter", url: detailLinks.twitter });
  if (detailLinks?.discord) items.push({ label: "Discord", url: detailLinks.discord });
  if (detailLinks?.telegram) items.push({ label: "Telegram", url: detailLinks.telegram });
  if (detailLinks?.youtube) items.push({ label: "YouTube", url: detailLinks.youtube });
  detailLinks?.custom?.forEach((c) => items.push({ label: c.label, url: c.url }));
  return items;
}

export function DetailTopicsLinks({ topics, baseLinks, detailLinks }: Props) {
  const topicsContent = topics?.enabled && topics?.content;
  const linkItems = buildLinkItems(baseLinks, detailLinks);
  const hasLinks = linkItems.length > 0;
  const showSection = topicsContent || hasLinks;

  if (!showSection) return null;

  return (
    <section id="topics-links" className="py-10 md:py-14">
      <div className="grid gap-10 md:grid-cols-2 md:gap-12">
        {/* Topics column */}
        <div>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-[#121212] dark:text-white">
            Topics
          </h2>
          {topicsContent ? (
            <div className="prose prose-neutral dark:prose-invert max-w-none text-[#3a3a3a] dark:text-[#a7b0bd]">
              <ReactMarkdown>{topics.content}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-[#616161] dark:text-[#a7b0bd]">—</p>
          )}
        </div>

        {/* Links column */}
        <div>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-[#121212] dark:text-white">
            Links
          </h2>
          {hasLinks ? (
            <ul className="space-y-3">
              {linkItems.map((item) => (
                <li key={item.url}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-[#121212] hover:text-[#70FF88] dark:text-white dark:hover:text-[#70FF88]"
                  >
                    {item.label}
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-[#70FF88]" />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[#616161] dark:text-[#a7b0bd]">—</p>
          )}
        </div>
      </div>
    </section>
  );
}
