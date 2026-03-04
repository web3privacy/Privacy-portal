/**
 * Event types – 1:1 schema from web3privacy/data events.
 * Optional "premium" for highlighted card with custom background.
 */

export type EventType =
  | "congress"
  | "summit"
  | "meetup"
  | "collab"
  | "rave"
  | "hackathon"
  | "privacycorner";

export interface EventLinks {
  rsvp?: string;
  web?: string;
}

export interface EventDesign {
  /** Custom image URL for premium card (or placeholder path) */
  image?: string;
  /** Custom background for premium card (CSS color or image URL) */
  background?: string;
}

/** Attendee – future: populated via Lu.ma API (requires Luma Plus + API key) */
export interface EventAttendee {
  avatar?: string;
  name?: string;
  id?: string;
}

export interface Event {
  id: string;
  type: EventType;
  date: string;
  city: string;
  country: string;
  /** Optional display title (e.g. for premium card); falls back to type + city */
  title?: string;
  /** Optional short description (e.g. for premium card) */
  description?: string;
  place?: string;
  "place-address"?: string;
  confirmed?: boolean;
  coincidence?: string;
  lead: string;
  links?: EventLinks;
  speakers?: string[];
  helpers?: string[];
  optional?: boolean;
  days?: number;
  design?: EventDesign;
  /** Highlight as premium card with own background */
  premium?: boolean;
  /** Attendees – future: Lu.ma API (Luma Plus) or manual */
  attendees?: EventAttendee[];
}

export interface EventsData {
  events: Event[];
}

/** Event type to filter label (for UI pills) */
export const EVENT_TYPE_FILTERS: Record<string, EventType[]> = {
  all: [],
  conferences: ["congress", "summit"],
  meetups: ["meetup"],
  hackathons: ["hackathon"],
  "w3pn-only": ["collab", "privacycorner", "rave"],
  other: [],
};

export const EVENT_TYPE_LABELS: Record<string, string> = {
  all: "ALL EVENTS",
  conferences: "CONFERENCES",
  meetups: "MEETUPS",
  hackathons: "HACKATHONS",
  "w3pn-only": "W3PN ONLY",
  other: "OTHER",
};
