import { notFound } from "next/navigation";
import { getEventById, getEventDetailById } from "@/lib/org/events-data";
import { getOrgDefaultContent } from "@/lib/org/default-content";
import { OrgEventDetailContent } from "@/components/org/events/OrgEventDetailContent";

export async function generateMetadata({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  const name = event?.title ?? event?.id ?? eventId;
  return { title: `${name} | Web3Privacy Now` };
}

export default async function OrgEventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const event = getEventById(eventId);
  const detail = getEventDetailById(eventId);

  if (!event) notFound();

  const content = getOrgDefaultContent();
  const eventsOverrides = (content?.eventsPage as { eventsOverrides?: Record<string, string> })?.eventsOverrides ?? {};
  const titleOverride = eventsOverrides[eventId];

  return (
    <OrgEventDetailContent
      event={event}
      detail={detail}
      titleOverride={titleOverride}
    />
  );
}
