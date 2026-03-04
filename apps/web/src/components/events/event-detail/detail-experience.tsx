"use client";

import ReactMarkdown from "react-markdown";
import {
  Zap,
  Mic2,
  Globe,
  Users,
  Settings,
  type LucideIcon,
} from "lucide-react";
import type { EventDetailExperience } from "@/types/event-detail";

const ICON_MAP: Record<string, LucideIcon> = {
  zap: Zap,
  mic: Mic2,
  globe: Globe,
  users: Users,
  settings: Settings,
  networking: Users,
  workshops: Settings,
  talks: Mic2,
  keynotes: Mic2,
  community: Users,
};

function getIcon(name: string): LucideIcon {
  const key = name.toLowerCase().replace(/\s+/g, "");
  return ICON_MAP[key] ?? Zap;
}

type Props = { section: EventDetailExperience };

export function DetailExperience({ section }: Props) {
  if (!section.enabled) return null;

  const cards = section.cards;
  const content = section.content;

  if (cards?.length) {
    return (
      <section id="experience" className="py-10 md:py-14">
        <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.15em] text-[#121212] dark:text-white">
          Experience
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, i) => {
            const Icon = getIcon(card.icon);
            return (
              <div
                key={i}
                className="flex flex-col rounded-xl border border-[#e0e0e0] bg-[#f8f8f8] p-6 dark:border-[#303640] dark:bg-[#1a1f27]"
              >
                <Icon className="mb-4 h-8 w-8 text-[#70FF88]" aria-hidden />
                <h3 className="font-semibold text-[#121212] dark:text-white">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm text-[#616161] dark:text-[#a7b0bd]">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  if (content) {
    return (
      <section id="experience" className="py-10 md:py-14">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-[#121212] dark:text-white">
          {section.title ?? "Experience"}
        </h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none text-[#3a3a3a] dark:text-[#a7b0bd]">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </section>
    );
  }

  return null;
}
