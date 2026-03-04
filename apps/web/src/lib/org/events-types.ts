/**
 * Shared types for org events (list + detail).
 * No Node/server deps – safe for client components.
 */

export interface EventItem {
  id: string;
  type?: string;
  date?: string;
  city?: string;
  country?: string;
  title?: string;
  description?: string;
  place?: string;
  "place-address"?: string;
  confirmed?: boolean;
  coincidence?: string;
  lead?: string;
  links?: { rsvp?: string; web?: string };
  speakers?: string[];
  premium?: boolean;
  design?: { image?: string };
}

export type { EventDetail } from "@/types/event-detail";
