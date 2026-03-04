"use client";

import Link from "next/link";
import Image from "next/image";
import { RadioPlayer } from "@/components/academy/radio-player";
import { NewsGetInvolvedCard } from "./NewsGetInvolvedCard";
import { GlossaryBannerWidget } from "./GlossaryBannerWidget";
import { getAvatarSrc, getStackToolEntries, getToolImageSrc } from "@/lib/stacks-view";
import type { RadioTrack, RadioPlaylist, Guide } from "@/types/academy";
import type { Stack, Tools } from "@/types";

type FeaturedProject = {
  id: string;
  name: string;
  logos?: Array<{ file?: string; url?: string }>;
  ratings?: Array<{ percentagePoints: number }>;
};

type RandomStack = Stack | {
  id: string;
  name: string;
  avatar?: string;
  org?: string;
  tools?: Record<string, string | string[]>;
};

type AwardsWinner = {
  winner: string;
  category: string;
  icon?: string;
  percentage?: number;
};

type Props = {
  radioTracks: RadioTrack[];
  radioPlaylists?: RadioPlaylist[];
  randomStack?: RandomStack;
  tools?: Tools;
  awardsWinners?: AwardsWinner[];
  featuredProjects?: FeaturedProject[];
  guides?: Guide[];
};

export function NewsSidebar({
  radioTracks,
  radioPlaylists = [],
  randomStack,
  tools = {},
  awardsWinners = [],
  featuredProjects = [],
  guides = [],
}: Props) {
  const stackToolEntries = randomStack && "tools" in randomStack && randomStack.tools && Object.keys(randomStack.tools).length > 0
    ? getStackToolEntries(randomStack as Stack, tools)
    : [];

  return (
    <aside className="flex flex-col gap-6">
      <NewsGetInvolvedCard />

      {/* Featured Projects from Explorer */}
      {featuredProjects.length > 0 && (
        <section className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-[#151a21]">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-black/65 dark:text-white/65">
            Featured Projects
          </h3>
          <div className="space-y-2">
            {featuredProjects.slice(0, 5).map((p) => (
              <Link
                key={p.id}
                href={`/project/${p.id}`}
                className="flex items-center gap-3 rounded-lg pl-4 py-2 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              >
                {p.logos?.[0] && (
                  <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded">
                    <Image
                      src={p.logos[0].url ?? p.logos[0].file ?? ""}
                      alt=""
                      width={32}
                      height={32}
                      className="h-8 w-8 object-contain"
                      unoptimized
                    />
                  </div>
                )}
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-black dark:text-white">
                  {p.name}
                </span>
              </Link>
            ))}
          </div>
          <Link
            href="/explorer"
            className="mt-3 inline-block text-sm font-semibold text-black hover:underline dark:text-white"
          >
            Explore all projects
          </Link>
        </section>
      )}

      {/* Privacy Radio */}
      {radioTracks.length > 0 && (
        <section className="rounded-xl bg-[#f0f0f0] p-4 dark:bg-[#1a1f27]">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-black/65 dark:text-white/65">
            Privacy Radio
          </h3>
          <RadioPlayer tracks={radioTracks.slice(0, 1)} playlists={[]} compact minimal />
          <Link
            href="/academy/radio"
            className="mt-3 block text-sm font-semibold text-black hover:underline dark:text-white"
          >
            Go to Radio in Academy →
          </Link>
        </section>
      )}

      {/* Personal Stack of the Day */}
      {randomStack && (
        <section className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-[#151a21]">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-black/65 dark:text-white/65">
            Personal Stack of the Day
          </h3>
          <Link
            href={`/stacks/${randomStack.id}`}
            className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
          >
            {randomStack.avatar ? (
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={getAvatarSrc(randomStack.avatar)}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized={randomStack.avatar.startsWith("http")}
                />
              </div>
            ) : (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-black/10 dark:bg-white/10">
                <span className="text-lg font-bold text-black/50 dark:text-white/50">
                  {randomStack.name.slice(0, 1)}
                </span>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <span className="block font-semibold text-black dark:text-white">
                {randomStack.name}
              </span>
              <span className="block text-xs text-black/65 dark:text-white/65">
                {randomStack.org || "Privacy Builder"}
              </span>
            </div>
          </Link>
          {stackToolEntries.length > 0 && (
            <div className="mt-3 divide-y divide-black/10 dark:divide-white/10">
              {stackToolEntries.flatMap((entry) =>
                entry.tools.map((tool) => (
                  <div
                    key={`${entry.categoryKey}-${tool.name}`}
                    className="flex items-center gap-2 px-2 py-1.5 first:pt-0"
                  >
                    <span className="w-16 shrink-0 truncate text-[10px] font-medium text-black/75 dark:text-white/75">
                      {entry.categoryLabel}
                    </span>
                    <div className="relative h-5 w-5 shrink-0 overflow-hidden rounded">
                      <Image
                        src={getToolImageSrc(tool.image)}
                        alt=""
                        width={20}
                        height={20}
                        className="h-5 w-5 object-contain"
                        unoptimized={getToolImageSrc(tool.image).startsWith("http")}
                      />
                    </div>
                    <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-black/80 dark:text-white/80">
                      {tool.name}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      )}

      {/* Privacy Awards – with rating bar */}
      {awardsWinners.length > 0 && (
        <section className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-[#151a21]">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-black/65 dark:text-white/65">
            Winners {new Date().getFullYear()}
          </h3>
          <div className="space-y-3">
            {awardsWinners.slice(0, 5).map((w, i) => (
              <Link
                key={`${w.category}-${i}`}
                href="/awards"
                className="block rounded-lg py-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              >
                <div className="flex items-center gap-3">
                  {w.icon && (
                    <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
                      <Image
                        src={w.icon}
                        alt=""
                        width={32}
                        height={32}
                        className="h-8 w-8 object-contain"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-black dark:text-white">
                      {w.winner}
                    </span>
                    {w.percentage != null && (
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                        <div
                          className="h-full rounded-full bg-[#70ff88]"
                          style={{ width: `${Math.min(100, w.percentage)}%` }}
                        />
                      </div>
                    )}
                    {w.percentage != null && (
                      <span className="mt-0.5 block text-[11px] text-black/55 dark:text-white/55">
                        {w.percentage.toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <Link
            href="/awards"
            className="mt-3 inline-block text-sm font-semibold text-[#70ff88] hover:underline"
          >
            View all Winners
          </Link>
        </section>
      )}

      <GlossaryBannerWidget />

      {/* Privacy Guides – Top Guides */}
      {guides.length > 0 && (
        <section className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-[#151a21]">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-black/65 dark:text-white/65">
            Top Guides
          </h3>
          <div className="space-y-3">
            {guides.slice(0, 4).map((g) => (
              <a
                key={g.id}
                href={g.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg py-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              >
                <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded bg-black/5 dark:bg-black/30">
                  <span className="material-symbols-rounded text-[20px] text-black/30 dark:text-white/30">
                    menu_book
                  </span>
                </div>
                <span className="min-w-0 flex-1 text-sm font-medium text-black line-clamp-2 dark:text-white">
                  {g.title}
                </span>
              </a>
            ))}
          </div>
          <Link
            href="/academy/guides"
            className="mt-3 inline-block text-sm font-semibold text-[#70ff88] hover:underline"
          >
            View all Guides
          </Link>
        </section>
      )}
    </aside>
  );
}
