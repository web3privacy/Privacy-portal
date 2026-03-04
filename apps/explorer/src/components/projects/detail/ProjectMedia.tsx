import { DetailCard, DetailSection, ValuePill } from "./detail-ui";
import type { Project } from "@/types/project";

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

type MediaItem = {
  title: string;
  href: string;
  meta?: string;
};

function collectMedia(project: Project): MediaItem[] {
  const linksAny = (project.links ?? {}) as Record<string, unknown>;
  const youtube =
    asString(linksAny.youtube) ?? asString((project as unknown as Record<string, unknown>).youtube);

  const items: MediaItem[] = [];
  if (youtube) {
    items.push({
      title: "YouTube",
      href: youtube,
      meta: "Channel / Playlist",
    });
  }

  // Some projects store videos as history items with links; keep it lightweight.
  for (const h of project.history ?? []) {
    const url = asString(h.link);
    if (!url) continue;
    if (!/youtube\.com|youtu\.be/i.test(url)) continue;
    items.push({
      title: h.title ?? "Video",
      href: url,
      meta: h.time ? String(h.time) : undefined,
    });
    if (items.length >= 6) break;
  }

  return items;
}

function VideoCard({
  item,
  tone = "neutral",
}: {
  item: MediaItem;
  tone?: "neutral" | "accent";
}) {
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noreferrer"
      className="group relative overflow-hidden rounded-[18px] border border-black/10 bg-black/[0.02] transition-shadow hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-white/[0.04] dark:hover:shadow-[0_18px_40px_rgba(0,0,0,0.32)]"
    >
      <div
        className={[
          "absolute inset-0",
          tone === "accent"
            ? "bg-[radial-gradient(circle_at_25%_20%,rgba(89,242,109,0.16),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(0,0,0,0.10),transparent_55%)] dark:bg-[radial-gradient(circle_at_25%_20%,rgba(89,242,109,0.10),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.06),transparent_55%)]"
            : "bg-[radial-gradient(circle_at_25%_20%,rgba(0,0,0,0.10),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(0,0,0,0.05),transparent_55%)] dark:bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.06),transparent_50%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.04),transparent_55%)]",
        ].join(" ")}
      />
      <div className="relative aspect-[16/10] p-5">
        <div className="flex h-full flex-col justify-between">
          <div className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.08em] text-black/55 dark:text-white/55">
            Media
            <span className="opacity-40">/</span>
            <span className="truncate">{item.meta ?? "Video"}</span>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <div className="line-clamp-2 font-serif text-[18px] leading-[1.15] text-black dark:text-[#f2f4f6]">
                {item.title}
              </div>
              <div className="mt-2 text-[12px] text-black/45 dark:text-white/45">
                Opens in a new tab
              </div>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/10 text-black/70 transition-colors group-hover:bg-black/15 dark:bg-white/10 dark:text-white/80 dark:group-hover:bg-white/15">
              <svg
                viewBox="0 0 24 24"
                width={22}
                height={22}
                fill="currentColor"
                role="presentation"
              >
                <path d="M9 7.5v9l8-4.5z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}

export function ProjectMedia({ project }: { project: Project }) {
  const items = collectMedia(project);

  return (
    <DetailSection id="media" title="Media">
      <DetailCard className="p-0">
        {items.length ? (
          <div className="grid gap-4 p-5 md:grid-cols-2 lg:grid-cols-4">
            {items.slice(0, 4).map((item, i) => (
              <VideoCard
                key={`${item.href}-${i}`}
                item={item}
                tone={i === 0 ? "accent" : "neutral"}
              />
            ))}
          </div>
        ) : (
          <div className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="text-[13px] text-black/55 dark:text-white/55">
                No media links available for this project.
              </div>
              <ValuePill>Coming soon</ValuePill>
            </div>
          </div>
        )}
      </DetailCard>
    </DetailSection>
  );
}

