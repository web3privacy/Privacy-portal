"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { EventType } from "@/types/events";
import { COUNTRY_NAMES } from "@/lib/events-constants";

const EVENT_TYPES: EventType[] = [
  "congress",
  "summit",
  "meetup",
  "collab",
  "rave",
  "hackathon",
  "privacycorner",
];
const COUNTRY_CODES = Object.keys(COUNTRY_NAMES).sort();

const inputClass =
  "w-full rounded-[8px] border border-[#d6d6d6] bg-white px-3 py-2 text-sm dark:border-[#3b4048] dark:bg-[#12161d] dark:text-[#f2f4f6]";

type Props = {
  onSuccess?: () => void;
};

export function AddEventForm({ onSuccess }: Props) {
  const router = useRouter();
  const [type, setType] = useState<EventType>("meetup");
  const [date, setDate] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("de");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [place, setPlace] = useState("");
  const [placeAddress, setPlaceAddress] = useState("");
  const [coincidence, setCoincidence] = useState("");
  const [lead, setLead] = useState("");
  const [rsvp, setRsvp] = useState("");
  const [web, setWeb] = useState("");
  const [speakersRaw, setSpeakersRaw] = useState("");
  const [premium, setPremium] = useState(false);
  const [designBackground, setDesignBackground] = useState("");
  const [designImage, setDesignImage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const speakers = speakersRaw
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter(Boolean);
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          date: date || new Date().toISOString().split("T")[0],
          city,
          country,
          title: title || undefined,
          description: description || undefined,
          place: place || undefined,
          "place-address": placeAddress || undefined,
          coincidence: coincidence || undefined,
          lead,
          links: { rsvp: rsvp || undefined, web: web || undefined },
          speakers: speakers.length ? speakers : undefined,
          premium: premium || undefined,
          design:
            premium && (designBackground || designImage)
              ? {
                  background: designBackground || undefined,
                  image: designImage || undefined,
                }
              : undefined,
        }),
      });
      if (res.ok) {
        onSuccess?.();
        router.refresh();
      } else {
        alert("Failed to add event");
      }
    } catch {
      alert("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Tabs defaultValue="basics" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="location">Location & Links</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>
        <TabsContent value="basics" className="space-y-4 pt-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as EventType)}
              className={inputClass}
            >
              {EVENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Date (YYYY-MM-DD)</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">City</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className={inputClass}
            >
              {COUNTRY_CODES.map((c) => (
                <option key={c} value={c}>
                  {COUNTRY_NAMES[c]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Title (optional)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Fallback: Type + City"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={inputClass}
            />
          </div>
        </TabsContent>
        <TabsContent value="location" className="space-y-4 pt-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Place (optional)</label>
            <input
              type="text"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder="e.g. [Venue Name](url)"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Place address</label>
            <input
              type="text"
              value={placeAddress}
              onChange={(e) => setPlaceAddress(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Coincidence (e.g. Devcon, ETHPrague)</label>
            <input
              type="text"
              value={coincidence}
              onChange={(e) => setCoincidence(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Lead</label>
            <input
              type="text"
              required
              value={lead}
              onChange={(e) => setLead(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">RSVP URL (Lu.ma)</label>
            <input
              type="url"
              value={rsvp}
              onChange={(e) => setRsvp(e.target.value)}
              placeholder="https://lu.ma/..."
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Website URL</label>
            <input
              type="url"
              value={web}
              onChange={(e) => setWeb(e.target.value)}
              placeholder="https://..."
              className={inputClass}
            />
          </div>
        </TabsContent>
        <TabsContent value="details" className="space-y-4 pt-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Speakers (comma-separated)</label>
            <textarea
              value={speakersRaw}
              onChange={(e) => setSpeakersRaw(e.target.value)}
              rows={2}
              placeholder="speaker-id-1, speaker-id-2"
              className={inputClass}
            />
          </div>
          <div className="space-y-3 rounded-[8px] border border-[#e0e0e0] bg-[#f8f8f8] p-4 dark:border-[#303640] dark:bg-[#1a1f27]">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="premium"
                checked={premium}
                onChange={(e) => setPremium(e.target.checked)}
                className="rounded border-[#d6d6d6] dark:border-[#3b4048]"
              />
              <label htmlFor="premium" className="text-sm font-medium">
                Premium card (highlighted)
              </label>
            </div>
            {premium && (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium">Background (URL or color)</label>
                  <input
                    type="text"
                    value={designBackground}
                    onChange={(e) => setDesignBackground(e.target.value)}
                    placeholder="https://... or #000000"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Custom image URL</label>
                  <input
                    type="text"
                    value={designImage}
                    onChange={(e) => setDesignImage(e.target.value)}
                    placeholder="https://... or /events/placeholder.svg"
                    className={inputClass}
                  />
                  <p className="mt-1 text-xs text-[#616161] dark:text-[#a7b0bd]">
                    Leave empty for default placeholder
                  </p>
                </div>
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-10 items-center rounded-lg border border-[#70FF88] bg-[#70FF88] px-4 text-[12px] font-bold uppercase tracking-[0.08em] text-black transition-all hover:-translate-y-0.5 hover:bg-[#5bee72] disabled:opacity-60"
      >
        {loading ? "Saving..." : "Add Event"}
      </button>
    </form>
  );
}
