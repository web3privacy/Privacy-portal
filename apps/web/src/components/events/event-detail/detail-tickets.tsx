"use client";

import { useEffect, useState } from "react";
import type { EventDetailTickets } from "@/types/event-detail";

type Props = { section: EventDetailTickets };

function useCountdown(saleEndsAt: string | undefined) {
  const [diff, setDiff] = useState<{ days: number; hours: number; minutes: number } | null>(null);
  useEffect(() => {
    if (!saleEndsAt) return;
    const end = new Date(saleEndsAt).getTime();
    const tick = () => {
      const now = Date.now();
      if (now >= end) {
        setDiff({ days: 0, hours: 0, minutes: 0 });
        return;
      }
      const d = Math.floor((end - now) / 86400000);
      const h = Math.floor(((end - now) % 86400000) / 3600000);
      const m = Math.floor(((end - now) % 3600000) / 60000);
      setDiff({ days: d, hours: h, minutes: m });
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, [saleEndsAt]);
  return diff;
}

export function DetailTickets({ section }: Props) {
  if (!section.enabled) return null;

  const tiers = section.tiers ?? [];
  const buyUrl = section.buyUrl;
  const saleEndsAt = section.saleEndsAt;
  const total = section.totalTickets ?? 0;
  const sold = section.ticketsSold ?? 0;
  const progress = total > 0 ? Math.min(100, (sold / total) * 100) : 0;

  const hasContent = tiers.length > 0 || buyUrl;
  if (!hasContent) return null;

  const countdown = useCountdown(saleEndsAt);

  return (
    <section id="tickets" className="py-10 md:py-14">
      <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.15em] text-[#121212] dark:text-white">
        Tickets
      </h2>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h3 className="text-lg font-semibold text-[#121212] dark:text-white">
            Get your tickets today
          </h3>
          {tiers.length > 0 && (
            <ul className="mt-4 space-y-2">
              {tiers.map((tier, i) => (
                <li key={i} className="flex items-center justify-between text-[#3a3a3a] dark:text-[#a7b0bd]">
                  <span>{tier.name}</span>
                  {tier.price && <span>{tier.price}</span>}
                  {tier.soldOut && (
                    <span className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-700 dark:bg-red-900/30 dark:text-red-400">
                      Sold out
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
          {buyUrl && (
            <a
              href={buyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#70FF88] px-6 text-[12px] font-bold uppercase tracking-[0.08em] text-black transition hover:bg-[#5ee756] dark:bg-[#70FF88] dark:text-black dark:hover:bg-[#5ee756]"
            >
              Buy tickets now
            </a>
          )}
          {countdown && (countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0) && (
            <p className="mt-6 text-sm text-[#616161] dark:text-[#a7b0bd]">
              Tickets available for {countdown.days} days {countdown.hours} hrs {countdown.minutes} mins
            </p>
          )}
          {total > 0 && sold > 0 && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-[#616161] dark:text-[#a7b0bd]">
                <span>{sold} / {total} sold</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e0e0e0] dark:bg-[#303640]">
                <div
                  className="h-full rounded-full bg-[#70FF88] transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
