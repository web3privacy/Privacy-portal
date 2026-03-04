"use client";

import Image from "next/image";
import { useRef } from "react";

export type MediaCarouselItem = {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl: string;
  type: "video" | "podcast";
  link: string;
};

type Props = {
  items: MediaCarouselItem[];
};

export function WatchListenCarousel({ items }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const w = scrollRef.current.offsetWidth;
    scrollRef.current.scrollBy({ left: dir === "left" ? -w : w, behavior: "smooth" });
  };

  if (items.length === 0) return null;

  return (
    <section>
      <div className="rounded-[12px] bg-[#f0f0f0] p-6 dark:bg-[#1a1f27]">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-black dark:text-white">
            Watch & Listen
          </h2>
          <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-black/65 transition-colors hover:bg-black/5 dark:border-white/10 dark:bg-[#151a21] dark:text-white/65 dark:hover:bg-white/10"
            aria-label="Scroll left"
          >
            <span className="material-symbols-rounded text-[20px]">chevron_left</span>
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-black/65 transition-colors hover:bg-black/5 dark:border-white/10 dark:bg-[#151a21] dark:text-white/65 dark:hover:bg-white/10"
            aria-label="Scroll right"
          >
            <span className="material-symbols-rounded text-[20px]">chevron_right</span>
          </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto py-2 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ scrollSnapType: "x mandatory" }}
        >
        {items.map((item) => (
          <a
            key={item.id}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex w-[calc((100%-2rem)/3)] min-w-[160px] shrink-0 flex-col overflow-hidden rounded-xl border border-black/10 bg-white transition-shadow hover:shadow-lg dark:border-white/10 dark:bg-[#151a21] dark:hover:shadow-xl md:min-w-[200px]"
            style={{ scrollSnapAlign: "start" }}
          >
            <div className="relative aspect-video w-full overflow-hidden bg-black/5 dark:bg-black/30">
              <Image
                src={item.thumbnailUrl}
                alt=""
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="280px"
                unoptimized={item.thumbnailUrl.startsWith("http")}
              />
            </div>
            <div className="flex flex-1 flex-col p-3">
              <h3 className="font-semibold leading-tight text-black dark:text-white line-clamp-2">
                {item.title}
              </h3>
              {item.description && (
                <p className="mt-1 line-clamp-2 text-sm text-black/65 dark:text-white/65">
                  {item.description}
                </p>
              )}
            </div>
          </a>
        ))}
        </div>

        <a
          href="/academy/talks"
          className="mt-4 block text-sm font-semibold text-black hover:underline dark:text-white"
        >
          View all videos in Academy →
        </a>
      </div>
    </section>
  );
}
