"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Event } from "@/types/events";
import { getEventTypeLabel } from "@/lib/events-constants";
import { format, parseISO } from "date-fns";

type EventWithHidden = Event & { hidden?: boolean };

type Props = {
  initialEvents: EventWithHidden[];
  initialHidden: string[];
};

export function EventsAdminList({
  initialEvents,
  initialHidden,
}: Props) {
  const [events, setEvents] = useState(initialEvents);
  const [hidden, setHidden] = useState(new Set(initialHidden));

  const refresh = async () => {
    const [evRes, visRes] = await Promise.all([
      fetch("/api/events?admin=1"),
      fetch("/api/events/visibility"),
    ]);
    const evData = await evRes.json();
    const visData = await visRes.json();
    setEvents(evData.events ?? []);
    setHidden(new Set(visData.hidden ?? []));
  };

  const toggleHidden = async (id: string) => {
    const next = new Set(hidden);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    const res = await fetch("/api/events/visibility", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hidden: Array.from(next) }),
    });
    if (res.ok) {
      setHidden(next);
      refresh();
    } else {
      alert("Failed to update visibility");
    }
  };

  return (
    <ul className="space-y-2">
      {events.map((event) => {
        const isHidden = hidden.has(event.id);
        const dateStr = format(parseISO(event.date), "MMM d, yyyy");
        const title =
          event.title ?? `${getEventTypeLabel(event.type)} ${event.city}`;
        return (
          <li
            key={event.id}
            className={`flex items-center justify-between rounded-[8px] border py-3 px-4 ${
              isHidden
                ? "border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/30"
                : "border-[#e0e0e0] bg-white dark:border-[#303640] dark:bg-[#181d25]"
            }`}
          >
            <div className="min-w-0 flex-1">
              <span className="font-medium text-[#121212] dark:text-[#f2f4f6]">
                {title}
              </span>
              <span className="ml-2 text-sm text-[#616161] dark:text-[#a7b0bd]">
                {dateStr} · {event.city}
              </span>
              {isHidden && (
                <span className="ml-2 rounded bg-amber-200 px-1.5 py-0.5 text-xs dark:bg-amber-900">
                  Hidden
                </span>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <button
                type="button"
                onClick={() => toggleHidden(event.id)}
                className={`text-sm underline ${
                  isHidden
                    ? "text-amber-700 dark:text-amber-400"
                    : "text-black/55 hover:text-black dark:text-white/55 dark:hover:text-white"
                }`}
              >
                {isHidden ? "Show" : "Hide"}
              </button>
              <Link
                href={`/events/admin/edit/${event.id}`}
                className="text-sm underline text-black/55 hover:text-black dark:text-white/55 dark:hover:text-white"
              >
                Edit
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
