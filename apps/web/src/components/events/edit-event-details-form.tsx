"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { EventDetail } from "@/types/event-detail";

type Props = {
  eventId: string;
  initialDetail: EventDetail | null;
};

export function EditEventDetailsForm({ eventId, initialDetail }: Props) {
  const router = useRouter();
  const [headerImageUrl, setHeaderImageUrl] = useState(initialDetail?.headerImageUrl ?? "");
  const [timeRange, setTimeRange] = useState(initialDetail?.timeRange ?? "");
  const [addToCalendarUrl, setAddToCalendarUrl] = useState(initialDetail?.addToCalendarUrl ?? "");
  const [agendaUrl, setAgendaUrl] = useState(initialDetail?.agendaUrl ?? "");
  const [topicsEnabled, setTopicsEnabled] = useState(!!initialDetail?.topics?.enabled);
  const [topicsContent, setTopicsContent] = useState(initialDetail?.topics?.content ?? "");
  const [expEnabled, setExpEnabled] = useState(!!initialDetail?.experience?.enabled);
  const [expTitle, setExpTitle] = useState(initialDetail?.experience?.title ?? "");
  const [expContent, setExpContent] = useState(initialDetail?.experience?.content ?? "");
  const [mapUrl, setMapUrl] = useState(initialDetail?.location?.mapUrl ?? "");
  const [directions, setDirections] = useState(initialDetail?.location?.directions ?? "");
  const [eventMapEnabled, setEventMapEnabled] = useState(!!initialDetail?.eventMap?.enabled);
  const [eventMapImageUrl, setEventMapImageUrl] = useState(initialDetail?.eventMap?.imageUrl ?? "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setHeaderImageUrl(initialDetail?.headerImageUrl ?? "");
    setTimeRange(initialDetail?.timeRange ?? "");
    setAddToCalendarUrl(initialDetail?.addToCalendarUrl ?? "");
    setAgendaUrl(initialDetail?.agendaUrl ?? "");
    setTopicsEnabled(!!initialDetail?.topics?.enabled);
    setTopicsContent(initialDetail?.topics?.content ?? "");
    setExpEnabled(!!initialDetail?.experience?.enabled);
    setExpTitle(initialDetail?.experience?.title ?? "");
    setExpContent(initialDetail?.experience?.content ?? "");
    setMapUrl(initialDetail?.location?.mapUrl ?? "");
    setDirections(initialDetail?.location?.directions ?? "");
    setEventMapEnabled(!!initialDetail?.eventMap?.enabled);
    setEventMapImageUrl(initialDetail?.eventMap?.imageUrl ?? "");
  }, [initialDetail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${eventId}/details`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          headerImageUrl: headerImageUrl || undefined,
          timeRange: timeRange || undefined,
          addToCalendarUrl: addToCalendarUrl || undefined,
          agendaUrl: agendaUrl || undefined,
          topics: topicsEnabled ? { enabled: true, content: topicsContent } : undefined,
          experience: {
            enabled: expEnabled,
            title: expTitle || undefined,
            content: expContent,
          },
          location: {
            mapUrl: mapUrl || undefined,
            directions: directions || undefined,
          },
          eventMap: eventMapEnabled && eventMapImageUrl ? { enabled: true, imageUrl: eventMapImageUrl } : undefined,
          links: initialDetail?.links,
          schedule: initialDetail?.schedule,
          gallery: initialDetail?.gallery,
          tickets: initialDetail?.tickets,
          videos: initialDetail?.videos,
          articles: initialDetail?.articles,
          faq: initialDetail?.faq,
          sponsors: initialDetail?.sponsors,
          contributors: initialDetail?.contributors,
          speakers: initialDetail?.speakers,
        }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to update event details");
      }
    } catch {
      alert("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-[#616161] dark:text-[#a7b0bd]">
        These fields appear on the event detail page at{" "}
        <Link href={`/events/${eventId}`} className="underline">
          /events/{eventId}
        </Link>
        .
      </p>

      <div className="space-y-3 rounded-[8px] border border-[#e0e0e0] bg-[#f8f8f8] p-4 dark:border-[#303640] dark:bg-[#1a1f27]">
        <h4 className="text-sm font-medium">Hero</h4>
        <div>
          <label className="mb-1 block text-sm">Header image URL</label>
          <input
            type="url"
            value={headerImageUrl}
            onChange={(e) => setHeaderImageUrl(e.target.value)}
            placeholder="https://..."
            className="w-full rounded-[8px] border border-[#d6d6d6] bg-white px-3 py-2 text-sm dark:border-[#3b4048] dark:bg-[#12161d] dark:text-[#f2f4f6]"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm">Time range (e.g. 14:00 - 22:00)</label>
          <input
            type="text"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            placeholder="09:00 - 17:00"
            className="w-full rounded-[8px] border border-[#d6d6d6] bg-white px-3 py-2 text-sm dark:border-[#3b4048] dark:bg-[#12161d] dark:text-[#f2f4f6]"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm">Add to calendar URL</label>
          <input
            type="url"
            value={addToCalendarUrl}
            onChange={(e) => setAddToCalendarUrl(e.target.value)}
            placeholder="https://..."
            className="w-full rounded-[8px] border border-[#d6d6d6] bg-white px-3 py-2 text-sm dark:border-[#3b4048] dark:bg-[#12161d] dark:text-[#f2f4f6]"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm">Agenda URL (or #schedule for anchor)</label>
          <input
            type="text"
            value={agendaUrl}
            onChange={(e) => setAgendaUrl(e.target.value)}
            placeholder="#schedule or https://..."
            className="w-full rounded-[8px] border border-[#d6d6d6] bg-white px-3 py-2 text-sm dark:border-[#3b4048] dark:bg-[#12161d] dark:text-[#f2f4f6]"
          />
        </div>
      </div>

      <div className="space-y-3 rounded-[8px] border border-[#e0e0e0] bg-[#f8f8f8] p-4 dark:border-[#303640] dark:bg-[#1a1f27]">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="topics-enabled"
            checked={topicsEnabled}
            onChange={(e) => setTopicsEnabled(e.target.checked)}
            className="rounded border-[#d6d6d6] dark:border-[#3b4048]"
          />
          <label htmlFor="topics-enabled" className="text-sm font-medium">
            Topics section (editable description, not categories)
          </label>
        </div>
        {topicsEnabled && (
          <div>
            <label className="mb-1 block text-sm font-medium">Content (markdown)</label>
            <textarea
              value={topicsContent}
              onChange={(e) => setTopicsContent(e.target.value)}
              rows={4}
              placeholder="Lorem ipsum..."
              className="w-full rounded-[8px] border border-[#d6d6d6] bg-white px-3 py-2 text-sm dark:border-[#3b4048] dark:bg-[#12161d] dark:text-[#f2f4f6]"
            />
          </div>
        )}
      </div>

      <div className="space-y-3 rounded-[8px] border border-[#e0e0e0] bg-[#f8f8f8] p-4 dark:border-[#303640] dark:bg-[#1a1f27]">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="exp-enabled"
            checked={expEnabled}
            onChange={(e) => setExpEnabled(e.target.checked)}
            className="rounded border-[#d6d6d6] dark:border-[#3b4048]"
          />
          <label htmlFor="exp-enabled" className="text-sm font-medium">
            Experience section (markdown content)
          </label>
        </div>
        {expEnabled && (
          <>
            <div>
              <label className="mb-1 block text-sm font-medium">Section title</label>
              <input
                type="text"
                value={expTitle}
                onChange={(e) => setExpTitle(e.target.value)}
                placeholder="About the event"
                className="w-full rounded-[8px] border border-[#d6d6d6] bg-white px-3 py-2 text-sm dark:border-[#3b4048] dark:bg-[#12161d] dark:text-[#f2f4f6]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Content (markdown)</label>
              <textarea
                value={expContent}
                onChange={(e) => setExpContent(e.target.value)}
                rows={6}
                placeholder="Write your event description in markdown..."
                className="w-full rounded-[8px] border border-[#d6d6d6] bg-white px-3 py-2 text-sm dark:border-[#3b4048] dark:bg-[#12161d] dark:text-[#f2f4f6]"
              />
            </div>
          </>
        )}
      </div>

      <div className="space-y-3 rounded-[8px] border border-[#e0e0e0] bg-[#f8f8f8] p-4 dark:border-[#303640] dark:bg-[#1a1f27]">
        <h4 className="text-sm font-medium">Location extras</h4>
        <div>
          <label className="mb-1 block text-sm">Map URL</label>
          <input
            type="url"
            value={mapUrl}
            onChange={(e) => setMapUrl(e.target.value)}
            placeholder="https://maps.google.com/..."
            className="w-full rounded-[8px] border border-[#d6d6d6] bg-white px-3 py-2 text-sm dark:border-[#3b4048] dark:bg-[#12161d] dark:text-[#f2f4f6]"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm">Directions URL</label>
          <input
            type="url"
            value={directions}
            onChange={(e) => setDirections(e.target.value)}
            placeholder="https://maps.google.com/directions/..."
            className="w-full rounded-[8px] border border-[#d6d6d6] bg-white px-3 py-2 text-sm dark:border-[#3b4048] dark:bg-[#12161d] dark:text-[#f2f4f6]"
          />
        </div>
      </div>

      <div className="space-y-3 rounded-[8px] border border-[#e0e0e0] bg-[#f8f8f8] p-4 dark:border-[#303640] dark:bg-[#1a1f27]">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="eventmap-enabled"
            checked={eventMapEnabled}
            onChange={(e) => setEventMapEnabled(e.target.checked)}
            className="rounded border-[#d6d6d6] dark:border-[#3b4048]"
          />
          <label htmlFor="eventmap-enabled" className="text-sm font-medium">
            Event map (floor plan)
          </label>
        </div>
        {eventMapEnabled && (
          <div>
            <label className="mb-1 block text-sm">Floor plan image URL</label>
            <input
              type="url"
              value={eventMapImageUrl}
              onChange={(e) => setEventMapImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-[8px] border border-[#d6d6d6] bg-white px-3 py-2 text-sm dark:border-[#3b4048] dark:bg-[#12161d] dark:text-[#f2f4f6]"
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-10 items-center rounded-lg border border-[#70FF88] bg-[#70FF88] px-4 text-[12px] font-bold uppercase tracking-[0.08em] text-black transition-all hover:-translate-y-0.5 hover:bg-[#5bee72] disabled:opacity-60"
      >
        {loading ? "Saving..." : "Save event details"}
      </button>
    </form>
  );
}
