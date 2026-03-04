"use client";

import type { Podcast } from "@/types/academy";

type Props = {
  podcasts: Podcast[];
};

export function PodcastsSection({ podcasts }: Props) {
  if (podcasts.length === 0) {
    return (
      <section className="mb-12">
        <h2 className="mb-4 font-serif text-[22px] font-bold text-black dark:text-[#f2f4f6]">
          Podcasts
        </h2>
        <div className="rounded-[12px] border border-[#e0e0e0] bg-[#f0f0f0] p-6 dark:border-[#303640] dark:bg-[#1a1f27]">
          <p className="text-center text-[14px] text-[#616161] dark:text-[#a7b0bd]">
            No podcasts available
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <h2 className="mb-4 font-serif text-[22px] font-bold text-black dark:text-[#f2f4f6]">
        Podcasts
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {podcasts.map((podcast) => (
          <a
            key={podcast.id}
            href={podcast.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-[12px] border border-[#e0e0e0] bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.14)] dark:border-[#303640] dark:bg-[#181d25] dark:hover:shadow-[0_14px_30px_rgba(0,0,0,0.55)]"
          >
            <div className="relative aspect-video w-full overflow-hidden rounded-t-[12px] bg-[#f5f5f5] dark:bg-[#252b35]">
              {podcast.thumbnailUrl ? (
                <img
                  src={podcast.thumbnailUrl}
                  alt={podcast.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span 
                    className="material-symbols-rounded text-[48px] text-[#616161] dark:text-[#a7b0bd]"
                    style={{
                      fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24'
                    }}
                  >
                    podcast
                  </span>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                <span 
                  className="material-symbols-rounded text-[48px] text-white"
                  style={{
                    fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24'
                  }}
                >
                  play_circle
                </span>
              </div>
              {podcast.duration && (
                <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                  {podcast.duration}
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="line-clamp-2 font-sans text-[15px] font-semibold leading-tight text-black dark:text-[#f2f4f6]">
                {podcast.title}
              </h3>
              {podcast.description && (
                <p className="mt-1 line-clamp-2 text-[12px] text-[#616161] dark:text-[#a7b0bd]">
                  {podcast.description}
                </p>
              )}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
