import { NextResponse } from "next/server";
import { loadEventDetail, saveEventDetail } from "@/lib/event-details";
import type { EventDetail } from "@/types/event-detail";

type Params = Promise<{ id: string }>;

export async function GET(_request: Request, { params }: { params: Params }) {
  const { id } = await params;
  const detail = loadEventDetail(id);
  const res = NextResponse.json(detail ?? null);
  res.headers.set("Access-Control-Allow-Origin", "*");
  return res;
}

export async function PUT(request: Request, { params }: { params: Params }) {
  const { id } = await params;
  const body = (await request.json()) as Partial<EventDetail>;
  const detail: EventDetail = {
    eventId: id,
    headerImageUrl: body.headerImageUrl,
    timeRange: body.timeRange,
    addToCalendarUrl: body.addToCalendarUrl,
    agendaUrl: body.agendaUrl,
    topics: body.topics,
    links: body.links,
    experience: body.experience,
    location: body.location,
    eventMap: body.eventMap,
    schedule: body.schedule,
    gallery: body.gallery,
    tickets: body.tickets,
    videos: body.videos,
    articles: body.articles,
    faq: body.faq,
    sponsors: body.sponsors,
    contributors: body.contributors,
    speakers: body.speakers,
  };
  saveEventDetail(detail);
  return NextResponse.json({ ok: true });
}
