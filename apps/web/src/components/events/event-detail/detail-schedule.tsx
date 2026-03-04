"use client";

import { useState } from "react";
import type { EventDetailSchedule } from "@/types/event-detail";

type Props = { section: EventDetailSchedule };

function groupByDay(
  items: Array<{ date?: string; time: string; title: string; stage?: string; speaker?: string; description?: string }>
) {
  const map = new Map<string, typeof items>();
  items.forEach((item) => {
    const day = item.date ?? "Day 1";
    if (!map.has(day)) map.set(day, []);
    map.get(day)!.push(item);
  });
  return Array.from(map.entries());
}

export function DetailSchedule({ section }: Props) {
  const [activeDay, setActiveDay] = useState(0);

  if (!section.enabled) return null;

  const stages = section.stages ?? [];
  const items = section.items ?? [];

  const hasContent = stages.length > 0 || items.length > 0;
  if (!hasContent) return null;

  if (stages.length > 0) {
    const dayGroups = stages.map((s) => [
      s.name,
      s.slots.map((slot) => ({
        time: slot.time,
        title: slot.title,
        speaker: slot.speaker,
        description: slot.description,
      })),
    ]) as [string, Array<{ time: string; title: string; speaker?: string; description?: string }>][];
    const days = dayGroups.map(([label]) => label);
    const currentSlots = dayGroups[activeDay]?.[1] ?? [];

    return (
      <section id="schedule" className="py-10 md:py-14">
        <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.15em] text-[#121212] dark:text-white">
          Schedule
        </h2>

        {days.length > 1 && (
          <div className="mb-6 flex gap-2 border-b border-[#e0e0e0] dark:border-[#303640]">
            {days.map((day, i) => (
              <button
                key={day}
                type="button"
                onClick={() => setActiveDay(i)}
                className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition ${
                  i === activeDay
                    ? "border-[#70FF88] text-[#70FF88]"
                    : "border-transparent text-[#616161] hover:text-[#121212] dark:text-[#a7b0bd] dark:hover:text-white"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        )}

        <ul className="relative space-y-0">
          {currentSlots.map((slot, i) => (
            <li
              key={i}
              className="relative flex gap-4 border-l-2 border-[#e0e0e0] pl-6 pb-6 last:pb-0 dark:border-[#303640]"
            >
              <span className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-[#70FF88]" aria-hidden />
              <span className="mt-0.5 shrink-0 text-sm font-medium text-[#616161] dark:text-[#a7b0bd]">
                {slot.time}
              </span>
              <div>
                <p className="font-medium text-[#121212] dark:text-white">
                  {slot.title}
                </p>
                {slot.speaker && (
                  <p className="text-sm text-[#616161] dark:text-[#a7b0bd]">
                    {slot.speaker}
                  </p>
                )}
                {slot.description && (
                  <p className="mt-1 text-sm text-[#616161] dark:text-[#a7b0bd]">
                    {slot.description}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  const dayGroups = groupByDay(items);
  if (dayGroups.length === 0) return null;

  const days = dayGroups.map(([label]) => label);
  const currentSlots = dayGroups[activeDay]?.[1] ?? [];

  return (
    <section id="schedule" className="py-10 md:py-14">
      <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.15em] text-[#121212] dark:text-white">
        Schedule
      </h2>

      {days.length > 1 && (
        <div className="mb-6 flex gap-2 border-b border-[#e0e0e0] dark:border-[#303640]">
          {days.map((day, i) => (
            <button
              key={day}
              type="button"
              onClick={() => setActiveDay(i)}
              className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition ${
                i === activeDay
                  ? "border-[#70FF88] text-[#70FF88]"
                  : "border-transparent text-[#616161] hover:text-[#121212] dark:text-[#a7b0bd] dark:hover:text-white"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      )}

      <ul className="relative space-y-0">
        {currentSlots.map((item, i) => (
          <li
            key={i}
            className="relative flex gap-4 border-l-2 border-[#e0e0e0] pl-6 pb-6 last:pb-0 dark:border-[#303640]"
          >
            <span className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-[#70FF88]" aria-hidden />
            <span className="mt-0.5 shrink-0 text-sm font-medium text-[#616161] dark:text-[#a7b0bd]">
              {item.time}
            </span>
            <div>
              <p className="font-medium text-[#121212] dark:text-white">
                {item.title}
              </p>
              {(item.stage || item.speaker) && (
                <p className="text-sm text-[#616161] dark:text-[#a7b0bd]">
                  {[item.stage, item.speaker].filter(Boolean).join(" · ")}
                </p>
              )}
              {item.description && (
                <p className="mt-1 text-sm text-[#616161] dark:text-[#a7b0bd]">
                  {item.description}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
