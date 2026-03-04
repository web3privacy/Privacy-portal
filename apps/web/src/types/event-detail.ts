/**
 * Event detail – extended data for /events/[id] page.
 * Stored in data/events/details/[eventId].yaml
 */

export interface EventDetailTopics {
  enabled: boolean;
  /** Editable description content (markdown) – not categories/filtering */
  content: string;
}

export interface EventDetailSpeaker {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
  bio?: string;
  twitter?: string;
}

export interface EventDetailLink {
  label: string;
  url: string;
}

export interface EventDetailExperienceCard {
  icon: string; // lucide icon name or emoji
  title: string;
  description: string;
}

export interface EventDetailExperience {
  enabled: boolean;
  title?: string;
  /** Markdown content – used when cards not set */
  content?: string;
  /** Card grid – used when set, overrides content */
  cards?: EventDetailExperienceCard[];
}

export interface EventDetailLocation {
  mapUrl?: string;
  directions?: string;
}

export interface EventDetailEventMap {
  enabled: boolean;
  imageUrl: string;
}

export interface ScheduleSlot {
  time: string;
  title: string;
  speaker?: string;
  description?: string;
}

export interface EventDetailStage {
  id: string;
  name: string;
  slots: ScheduleSlot[];
}

export interface EventDetailSchedule {
  enabled: boolean;
  stages?: EventDetailStage[];
  items?: Array<{
    date?: string;
    time: string;
    title: string;
    stage?: string;
    speaker?: string;
    description?: string;
  }>;
}

export interface EventDetailGalleryImage {
  url: string;
  caption?: string;
}

export interface EventDetailGallery {
  enabled: boolean;
  images: EventDetailGalleryImage[];
}

export interface EventDetailTicketTier {
  name: string;
  price?: string;
  soldOut?: boolean;
}

export interface EventDetailTickets {
  enabled: boolean;
  buyUrl?: string;
  tiers?: EventDetailTicketTier[];
  saleEndsAt?: string; // ISO date for countdown
  totalTickets?: number;
  ticketsSold?: number;
}

export interface EventDetailVideos {
  enabled: boolean;
  source: "academy" | "manual";
  talkIds?: string[];
  youtubeIds?: string[];
}

export interface EventDetailArticles {
  enabled: boolean;
  articleIds: string[];
}

export interface EventDetailFaqItem {
  question: string;
  answer: string;
}

export interface EventDetailFaq {
  enabled: boolean;
  items: EventDetailFaqItem[];
}

export interface EventDetailSponsor {
  name: string;
  logo?: string;
  url?: string;
  tier?: "gold" | "silver" | "bronze";
}

export interface EventDetailSponsors {
  enabled: boolean;
  items: EventDetailSponsor[];
}

export interface EventDetailContributor {
  name: string;
  avatar?: string;
  role: string;
}

export interface EventDetailContributors {
  enabled: boolean;
  items: EventDetailContributor[];
}

export interface EventDetailLinks {
  twitter?: string;
  discord?: string;
  telegram?: string;
  youtube?: string;
  custom?: EventDetailLink[];
}

export interface EventDetail {
  eventId: string;
  headerImageUrl?: string;
  /** Time range e.g. "14:00 - 22:00" */
  timeRange?: string;
  addToCalendarUrl?: string;
  agendaUrl?: string; // VIEW AGENDA – anchor or URL
  topics?: EventDetailTopics;
  links?: EventDetailLinks;
  experience?: EventDetailExperience;
  location?: EventDetailLocation;
  eventMap?: EventDetailEventMap;
  schedule?: EventDetailSchedule;
  gallery?: EventDetailGallery;
  tickets?: EventDetailTickets;
  videos?: EventDetailVideos;
  articles?: EventDetailArticles;
  faq?: EventDetailFaq;
  sponsors?: EventDetailSponsors;
  contributors?: EventDetailContributors;
  speakers?: EventDetailSpeaker[];
}
