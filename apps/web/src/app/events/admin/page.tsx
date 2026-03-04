import { loadAllEventsForAdmin } from "@/lib/events";
import { EventsAdminList } from "@/components/events/events-admin-list";
import Link from "next/link";
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

function loadVisibility(): string[] {
  const file = path.join(process.cwd(), "data", "events", "events-visibility.yaml");
  if (!fs.existsSync(file)) return [];
  const content = fs.readFileSync(file, "utf8");
  const parsed = yaml.load(content) as { hidden?: string[] } | null;
  return parsed?.hidden ?? [];
}

export const metadata = {
  title: "Events Admin | Privacy Portal",
  description: "Manage event visibility and edit event data.",
};

export default function EventsAdminPage() {
  const allMerged = loadAllEventsForAdmin();
  const hidden = loadVisibility();
  const adminEvents = allMerged.map((e) => ({
    ...e,
    hidden: hidden.includes(e.id),
  }));

  return (
    <div className="viewport-range-shell mx-auto w-full px-4 py-10 md:px-6 lg:max-w-[75vw]">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-black dark:text-[#f2f4f6]">
          Events Admin
        </h1>
        <Link
          href="/events"
          className="text-[12px] font-bold uppercase tracking-[0.08em] text-black/55 underline hover:text-black dark:text-white/55 dark:hover:text-white"
        >
          ← Back to Events
        </Link>
      </div>
      <EventsAdminList
        initialEvents={adminEvents}
        initialHidden={hidden}
      />
    </div>
  );
}
