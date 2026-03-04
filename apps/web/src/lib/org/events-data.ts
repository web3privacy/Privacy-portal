/**
 * Server-side: read events and details from public/org/events.json
 * Injects placeholder event (Brno) so /org/events/placeholder always exists.
 */

import fs from "fs";
import path from "path";
import type { EventItem, EventDetail } from "./events-types";
import { getPlaceholderEvent, getPlaceholderDetail, PLACEHOLDER_EVENT_ID } from "./placeholder-event";

export type { EventItem, EventDetail } from "./events-types";

let cached: { events: EventItem[]; details: Record<string, EventDetail> } | null = null;

function load(): { events: EventItem[]; details: Record<string, EventDetail> } {
  if (cached) return cached;
  try {
    const p = path.join(process.cwd(), "public", "org", "events.json");
    if (!fs.existsSync(p)) {
      cached = { events: [], details: {} };
    } else {
      const data = JSON.parse(fs.readFileSync(p, "utf8"));
      cached = {
        events: data.events ?? [],
        details: data.details ?? {},
      };
    }
    // Inject placeholder event (Brno) if not already present
    if (!cached.events.some((e) => e.id === PLACEHOLDER_EVENT_ID)) {
      cached = {
        events: [...cached.events, getPlaceholderEvent()],
        details: { ...cached.details, [PLACEHOLDER_EVENT_ID]: getPlaceholderDetail() },
      };
    }
    return cached;
  } catch {
    cached = {
      events: [getPlaceholderEvent()],
      details: { [PLACEHOLDER_EVENT_ID]: getPlaceholderDetail() },
    };
    return cached;
  }
}

export function getEventsList(): EventItem[] {
  return load().events;
}

export function getEventById(eventId: string): EventItem | null {
  return load().events.find((e) => e.id === eventId) ?? null;
}

export function getEventDetailById(eventId: string): EventDetail | null {
  return load().details[eventId] ?? null;
}
