import { EventsPageContent } from "@/components/events/events-page-content";
import { loadEventsData } from "@/lib/events";

export const metadata = {
  title: "Events | Privacy Portal",
  description: "Privacy events: congresses, summits, meetups, hackathons.",
};

export default function EventsPage() {
  const data = loadEventsData();
  return <EventsPageContent events={data.events} />;
}
