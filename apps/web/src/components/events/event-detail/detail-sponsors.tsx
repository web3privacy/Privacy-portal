"use client";

import Image from "next/image";
import type { EventDetailSponsors } from "@/types/event-detail";

type Props = { section: EventDetailSponsors };

export function DetailSponsors({ section }: Props) {
  if (!section.enabled || !section.items?.length) return null;

  return (
    <section id="sponsors" className="py-10 md:py-14">
      <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.15em] text-[#121212] dark:text-white">
        Sponsors
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {section.items.map((sponsor, i) => (
          <a
            key={i}
            href={sponsor.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center rounded-xl border border-[#e0e0e0] bg-[#f8f8f8] p-4 transition hover:border-[#70FF88]/50 dark:border-[#303640] dark:bg-[#1a1f27] dark:hover:border-[#70FF88]/50"
          >
            {sponsor.logo ? (
              <div className="relative h-16 w-full">
                <Image
                  src={sponsor.logo}
                  alt={sponsor.name}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <span className="font-medium text-[#121212] dark:text-[#f2f4f6]">
                {sponsor.name}
              </span>
            )}
            {sponsor.tier && (
              <span className="mt-2 text-xs text-[#616161] dark:text-[#a7b0bd]">
                {sponsor.tier}
              </span>
            )}
          </a>
        ))}
      </div>
      <a
        href="#sponsors"
        className="mt-6 inline-flex h-10 items-center justify-center rounded-lg border border-[#70FF88] bg-transparent px-5 text-[12px] font-bold uppercase tracking-[0.08em] text-[#70FF88] transition hover:bg-[#70FF88]/10 dark:text-[#70FF88] dark:hover:bg-[#70FF88]/10"
      >
        View all sponsors
      </a>
    </section>
  );
}
