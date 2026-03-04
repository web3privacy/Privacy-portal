import { loadAllEventsForAdmin } from "@/lib/events";
import { loadEventDetail } from "@/lib/event-details";
import { EditEventForm } from "@/components/events/edit-event-form";
import { EditEventDetailsForm } from "@/components/events/edit-event-details-form";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata = {
  title: "Edit Event | Privacy Portal",
};

export default async function EditEventPage({ params }: Props) {
  const { id } = await params;
  const events = loadAllEventsForAdmin();
  const event = events.find((e) => e.id === id);
  if (!event) notFound();

  const detail = loadEventDetail(id);

  return (
    <div className="viewport-range-shell mx-auto w-full px-4 py-10 md:px-6 lg:max-w-[75vw]">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-black dark:text-[#f2f4f6]">
          Edit Event
        </h1>
        <Link
          href="/events/admin"
          className="text-[12px] font-bold uppercase tracking-[0.08em] text-black/55 underline hover:text-black dark:text-white/55 dark:hover:text-white"
        >
          ← Back to Admin
        </Link>
      </div>
      <div className="flex max-w-2xl flex-col gap-8">
        <div className="rounded-[12px] border border-[#e0e0e0] bg-white p-6 dark:border-[#303640] dark:bg-[#181d25]">
          <EditEventForm event={event} />
        </div>
        <div className="rounded-[12px] border border-[#e0e0e0] bg-white p-6 dark:border-[#303640] dark:bg-[#181d25]">
          <h2 className="mb-4 font-serif text-lg font-bold text-black dark:text-[#f2f4f6]">
            Event detail page
          </h2>
          <EditEventDetailsForm eventId={id} initialDetail={detail} />
        </div>
      </div>
    </div>
  );
}
