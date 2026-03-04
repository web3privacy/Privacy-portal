import { notFound } from "next/navigation";
import { getEventById } from "@/lib/events";
import { loadEventDetail } from "@/lib/event-details";
import { loadPeopleData, getPersonById } from "@/lib/people";
import { loadAcademyData } from "@/lib/academy";
import { loadNewsData } from "@/lib/news";
import { EventDetailPage } from "@/components/events/event-detail/event-detail-page";
import type { EventDetailSpeaker } from "@/types/event-detail";
import type { PeopleData } from "@/types/people";

type Props = {
  params: Promise<{ id: string }>;
};

function resolveSpeakers(
  event: { speakers?: string[] },
  detail: { speakers?: EventDetailSpeaker[] } | null,
  people: PeopleData
): EventDetailSpeaker[] {
  if (detail?.speakers?.length) return detail.speakers;
  const ids = event.speakers ?? [];
  return ids.map((id) => {
    const p = getPersonById(people, id);
    const twitterLink = p?.links?.find((l) => l.type === "twitter");
    return {
      id,
      name: p?.name ?? id,
      role: p?.title,
      avatar: p?.avatar,
      bio: p?.description,
      twitter: twitterLink?.url,
    };
  });
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const event = getEventById(id);
  if (!event) return { title: "Event not found" };
  const title = event.title ?? `${event.type} ${event.city}`;
  return {
    title: `${title} | Events`,
    description: event.description ?? `Event details for ${title}`,
  };
}

export default async function EventDetailRoute({ params }: Props) {
  const { id } = await params;
  const event = getEventById(id);
  if (!event) notFound();

  const [detail, people, academy, news] = await Promise.all([
    Promise.resolve(loadEventDetail(id)),
    Promise.resolve(loadPeopleData()),
    Promise.resolve(loadAcademyData()),
    Promise.resolve(loadNewsData()),
  ]);

  const speakers = resolveSpeakers(event, detail, people);

  return (
    <EventDetailPage
      event={event}
      detail={detail}
      speakers={speakers}
      talks={academy.talks ?? []}
      articles={news.articles ?? []}
    />
  );
}
