"use client";

import type { Talk } from "@/types/academy";
import Link from "next/link";

type Props = {
  talks: Talk[];
  headerAction?: React.ReactNode;
};

export function LatestTalks({ talks, headerAction }: Props) {
  if (!talks || talks.length === 0) {
    return (
      <section className="mb-12">
        <div className="rounded-[12px] border border-[#e0e0e0] bg-[#f0f0f0] p-6 dark:border-[#303640] dark:bg-[#1a1f27]">
          <p className="text-center text-[14px] text-[#616161] dark:text-[#a7b0bd]">
            No talks available
          </p>
        </div>
      </section>
    );
  }

  // Show all talks (no limit)
  const displayTalks = talks;

  return (
    <section className="mb-12">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-serif text-[22px] font-bold text-black dark:text-[#f2f4f6]">
          {displayTalks.length > 0 ? "All Talks" : "Latest Talks"}
        </h2>
        {headerAction}
      </div>
      {displayTalks.length === 0 ? (
        <div className="rounded-[12px] border border-[#e0e0e0] bg-[#f0f0f0] p-6 dark:border-[#303640] dark:bg-[#1a1f27]">
          <p className="text-center text-[14px] text-[#616161] dark:text-[#a7b0bd]">
            No more videos on channel
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {displayTalks.map((talk) => (
          <a
            key={talk.id}
            href={`https://www.youtube.com/watch?v=${talk.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-[12px] border border-[#e0e0e0] bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.14)] dark:border-[#303640] dark:bg-[#181d25] dark:hover:shadow-[0_14px_30px_rgba(0,0,0,0.55)]"
          >
            <div className="relative aspect-video w-full overflow-hidden rounded-t-[12px] bg-[#f5f5f5] dark:bg-[#252b35]">
              {talk.thumbnailUrl ? (
                <img
                  src={talk.thumbnailUrl}
                  alt={talk.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <img
                  src={`https://img.youtube.com/vi/${talk.youtubeId}/maxresdefault.jpg`}
                  alt={talk.title}
                  className="h-full w-full object-cover"
                />
              )}
              {/* Logo overlay - top left */}
              <div className="absolute left-2 top-2 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5">
                <span className="text-[10px] font-bold text-white">web3privacy</span>
                <span className="text-[10px] font-bold text-[#70FF88]">Academy</span>
              </div>
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
              {talk.duration && (
                <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                  {talk.duration}
                </div>
              )}
            </div>
            <div className="p-4">
              {talk.speaker && (
                <p className="mb-1 text-[12px] font-bold uppercase tracking-[0.05em] text-[#616161] dark:text-[#a7b0bd]">
                  {talk.speaker}
                </p>
              )}
              <h3 className="line-clamp-2 font-sans text-[15px] font-semibold leading-tight text-black dark:text-[#f2f4f6]">
                {talk.title}
              </h3>
            </div>
          </a>
          ))}
        </div>
      )}
    </section>
  );
}
