"use client";

import Image from "next/image";
import Link from "next/link";
import type { EventDetailVideos } from "@/types/event-detail";
import type { Talk } from "@/types/academy";

type Props = {
  section: EventDetailVideos;
  talks: Talk[];
  youtubeIds?: string[];
};

function getYouTubeThumbnail(id: string) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

export function DetailVideos({ section, talks, youtubeIds }: Props) {
  if (!section.enabled) return null;

  const items: { id: string; title: string; youtubeId: string; speaker?: string }[] = [];

  if (section.source === "academy" && section.talkIds?.length) {
    section.talkIds.forEach((talkId) => {
      const talk = talks.find((t) => t.id === talkId);
      if (talk) {
        items.push({
          id: talk.id,
          title: talk.title,
          youtubeId: talk.youtubeId,
          speaker: talk.speaker,
        });
      }
    });
  }

  if (section.source === "manual" && section.youtubeIds?.length) {
    section.youtubeIds.forEach((ytId, i) => {
      const talk = talks.find((t) => t.youtubeId === ytId);
      items.push({
        id: ytId,
        title: talk?.title ?? `Video ${i + 1}`,
        youtubeId: ytId,
        speaker: talk?.speaker,
      });
    });
  }

  // Fallback: use youtubeIds from props (e.g. page passed raw IDs)
  if (items.length === 0 && youtubeIds?.length) {
    youtubeIds.forEach((ytId, i) => {
      items.push({ id: ytId, title: `Video ${i + 1}`, youtubeId: ytId });
    });
  }

  if (items.length === 0) return null;

  return (
    <section id="talks" className="py-10 md:py-14">
      <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.15em] text-[#121212] dark:text-white">
        Talks
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`https://www.youtube.com/watch?v=${item.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group block overflow-hidden rounded-xl border border-[#e0e0e0] bg-white transition hover:border-[#c0c0c0] dark:border-[#303640] dark:bg-[#181d25] dark:hover:border-[#404850]"
          >
            <div className="relative aspect-video w-full">
              <Image
                src={getYouTubeThumbnail(item.youtubeId)}
                alt={item.title}
                fill
                className="object-cover transition group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition group-hover:opacity-100">
                <span className="rounded-full bg-red-600 p-3 text-white">▶</span>
              </div>
            </div>
            <div className="p-4">
              <p className="font-medium text-[#121212] group-hover:underline dark:text-[#f2f4f6]">
                {item.title}
              </p>
              {item.speaker && (
                <p className="mt-1 text-sm text-[#616161] dark:text-[#a7b0bd]">
                  {item.speaker}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
      <a
        href="#talks"
        className="mt-6 inline-flex h-10 items-center justify-center rounded-lg border border-[#70FF88] bg-transparent px-5 text-[12px] font-bold uppercase tracking-[0.08em] text-[#70FF88] transition hover:bg-[#70FF88]/10 dark:text-[#70FF88] dark:hover:bg-[#70FF88]/10"
      >
        View all talks
      </a>
    </section>
  );
}
