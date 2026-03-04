"use client";

import Image from "next/image";
import type { EventDetailGallery } from "@/types/event-detail";

type Props = { section: EventDetailGallery };

export function DetailGallery({ section }: Props) {
  if (!section.enabled || !section.images?.length) return null;

  return (
    <section id="gallery" className="py-10 md:py-14">
      <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.15em] text-[#121212] dark:text-white">
        Gallery
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {section.images.map((img, i) => (
          <figure key={i} className="overflow-hidden rounded-lg border border-[#e0e0e0] dark:border-[#303640]">
            <div className="relative aspect-video w-full">
              <Image
                src={img.url}
                alt={img.caption ?? ""}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            {img.caption && (
              <figcaption className="p-3 text-sm text-[#616161] dark:text-[#a7b0bd]">
                {img.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
      <a
        href="#gallery"
        className="mt-6 inline-flex h-10 items-center justify-center rounded-lg border border-[#70FF88] bg-transparent px-5 text-[12px] font-bold uppercase tracking-[0.08em] text-[#70FF88] transition hover:bg-[#70FF88]/10 dark:text-[#70FF88] dark:hover:bg-[#70FF88]/10"
      >
        View all photos
      </a>
    </section>
  );
}
