/**
 * Placeholder event (Brno) for testing /org/events/placeholder detail page.
 * Merged by events-data so it's always available.
 */

import type { EventItem, EventDetail } from "./events-types";

export const PLACEHOLDER_EVENT_ID = "placeholder";

export function getPlaceholderEvent(): EventItem {
  return {
    id: PLACEHOLDER_EVENT_ID,
    type: "congress",
    date: "2026-04-24",
    city: "Brno",
    country: "cz",
    title: "Future of the City – Brno",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    place: "Brno Exhibition Centre",
    "place-address": "Výstaviště 405/1, 603 00 Brno-střed, Czech Republic",
    confirmed: true,
    lead: "Organizer",
    links: {
      rsvp: "https://example.com/tickets",
      web: "https://example.com/event",
    },
    speakers: [],
  };
}

export function getPlaceholderDetail(): EventDetail {
  return {
    eventId: PLACEHOLDER_EVENT_ID,
    headerImageUrl: "https://picsum.photos/1200/600?random=event-hero",
    timeRange: "09:00 - 20:00",
    addToCalendarUrl: "https://calendar.example.com/add",
    agendaUrl: "#schedule",
    topics: {
      enabled: true,
      content:
        "Web3, Blockchain & Decentralized Future\n\nData Science & AI\n\nCloud Native & DevOps\n\nDesign & UX\n\nCyber Security",
    },
    links: {
      custom: [
        { label: "Conference Website", url: "https://example.com" },
        { label: "Twitter", url: "https://twitter.com/event" },
        { label: "GitHub", url: "https://github.com/event" },
      ],
    },
    speakers: [
      { id: "1", name: "Filip H.", role: "Lead Developer", avatar: "https://i.pravatar.cc/120?img=1", bio: "Privacy & Web3 advocate.", twitter: "https://twitter.com/filip" },
      { id: "2", name: "Anna M.", role: "UX Designer", avatar: "https://i.pravatar.cc/120?img=2", bio: "Design systems and accessibility.", twitter: "https://twitter.com/anna" },
      { id: "3", name: "Jakub K.", role: "Researcher", avatar: "https://i.pravatar.cc/120?img=3", bio: "ZK and cryptography.", twitter: "https://twitter.com/jakub" },
    ],
    experience: {
      enabled: true,
      title: "Experience",
      content: "Join us for two days of keynotes, workshops, and networking.",
      cards: [
        { icon: "users", title: "25+ Experts", description: "Explore the latest trends with leading practitioners from Web3, AI, and DevOps." },
        { icon: "calendar", title: "2 Days", description: "Meet the best speakers and community members in a single venue." },
        { icon: "party", title: "Afterparty", description: "Networking opportunities and informal discussions after the main program." },
      ],
    },
    location: {
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Brno+Exhibition+Centre",
      directions: "Výstaviště 405/1, 603 00 Brno-střed. Public transport: tram 1, 2, 3 to Výstaviště. Parking available on site.",
    },
    schedule: {
      enabled: true,
      items: [
        { time: "09:00 - 10:00", title: "Registrace & Welcome Coffee", speaker: "Organizing team" },
        { time: "10:00 - 10:30", title: "Opening Ceremony", speaker: "Jan Novák" },
        { time: "10:30 - 11:30", title: "Keynote: The Future of Web3", speaker: "Filip H." },
        { time: "12:00 - 13:30", title: "Lunch & Networking", speaker: undefined },
      ],
    },
    eventMap: {
      enabled: true,
      imageUrl: "https://picsum.photos/800/400?random=map",
    },
    gallery: {
      enabled: true,
      images: [
        { url: "https://picsum.photos/400/300?random=g1", caption: "Main stage" },
        { url: "https://picsum.photos/400/300?random=g2", caption: "Workshop" },
      ],
    },
    tickets: {
      enabled: true,
      buyUrl: "https://example.com/tickets",
      tiers: [
        { name: "Early Bird", price: "4 490 CZK", soldOut: false },
        { name: "Standard", price: "5 990 CZK", soldOut: false },
      ],
    },
    faq: {
      enabled: true,
      items: [
        { question: "Jak se dostanu na akci?", answer: "Místo konání je Brno Exhibition Centre, Výstaviště 405/1. Doprava: tramvaj 1, 2, 3 do stanice Výstaviště." },
        { question: "Kde se můžu ubytovat?", answer: "Doporučujeme hotely v okolí výstaviště. Seznam partnerů se slevou bude zveřejněn po registraci." },
      ],
    },
    sponsors: {
      enabled: true,
      items: [
        { name: "Partner A", logo: "https://picsum.photos/120/60?random=logo1", url: "https://example.com/a", tier: "gold" },
        { name: "Partner B", logo: "https://picsum.photos/120/60?random=logo2", url: "https://example.com/b", tier: "silver" },
      ],
    },
    contributors: {
      enabled: true,
      items: [
        { name: "Alex", role: "Organizer", avatar: "https://i.pravatar.cc/80?img=11" },
        { name: "Blanka", role: "Program", avatar: "https://i.pravatar.cc/80?img=12" },
      ],
    },
  };
}
