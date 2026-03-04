"use client";

import Image from "next/image";
import type { EventDetailContributors } from "@/types/event-detail";

type Props = { section: EventDetailContributors };

export function DetailContributors({ section }: Props) {
  if (!section.enabled || !section.items?.length) return null;

  return (
    <section id="contributors" className="py-10 md:py-14">
      <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.15em] text-[#121212] dark:text-white">
        Contributors
      </h2>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
        {section.items.map((c, i) => (
          <div
            key={i}
            className="flex flex-col items-center text-center"
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-[#e0e0e0] dark:border-[#303640]">
              {c.avatar ? (
                <Image src={c.avatar} alt="" fill className="object-cover" sizes="64px" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#e0e0e0] text-[#616161] dark:bg-[#303640] dark:text-[#a7b0bd]">
                  {c.name.charAt(0)}
                </div>
              )}
            </div>
            <p className="mt-2 font-medium text-[#121212] dark:text-white">{c.name}</p>
            <p className="text-sm text-[#616161] dark:text-[#a7b0bd]">{c.role}</p>
          </div>
        ))}
      </div>
      <a
        href="#contributors"
        className="mt-6 inline-flex h-10 items-center justify-center rounded-lg border border-[#70FF88] bg-transparent px-5 text-[12px] font-bold uppercase tracking-[0.08em] text-[#70FF88] transition hover:bg-[#70FF88]/10 dark:text-[#70FF88] dark:hover:bg-[#70FF88]/10"
      >
        View all contributors
      </a>
    </section>
  );
}
