import type { Event } from "@/types/events";

const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);

export function isUpcoming(event: Event): boolean {
  const d = new Date(event.date);
  d.setHours(0, 0, 0, 0);
  return d >= TODAY;
}

export function sortEventsByDate(events: Event[], ascending: boolean): Event[] {
  return [...events].sort((a, b) => {
    const da = new Date(a.date).getTime();
    const db = new Date(b.date).getTime();
    return ascending ? da - db : db - da;
  });
}
