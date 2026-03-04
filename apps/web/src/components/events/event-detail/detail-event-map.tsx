"use client";

import Image from "next/image";
import type { EventDetailEventMap } from "@/types/event-detail";

type Props = { section: EventDetailEventMap };

export function DetailEventMap({ section }: Props) {
  if (!section.enabled || !section.imageUrl) return null;

  return (
    <section id="event-map" className="py-10 md:py-14">
      <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.15em] text-[#121212] dark:text-white">
        Event map
      </h2>
      <div className="overflow-hidden rounded-xl border border-[#e0e0e0] bg-[#f8f8f8] dark:border-[#303640] dark:bg-[#1a1f27]">
        <div className="relative aspect-[4/3] w-full md:aspect-[2/1]">
          <Image
            src={section.imageUrl}
            alt="Event floor plan"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 80vw"
          />
        </div>
      </div>
    </section>
  );
}
