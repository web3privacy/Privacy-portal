import { DetailCard, DetailSection, ValuePill } from "./detail-ui";
import type { Project } from "@/types/project";

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

type ArticleItem = {
  title: string;
  href: string;
  meta?: string;
  description?: string;
};

function collectArticles(project: Project): ArticleItem[] {
  const items: ArticleItem[] = [];
  const links = (project.links ?? {}) as Record<string, unknown>;

  const blog = asString(links.blog);
  const docs = asString(links.docs);
  const whitepaper = asString(links.whitepaper);
  const forum = asString(links.forum);

  if (blog) {
    items.push({
      title: "Blog / Articles",
      href: blog,
      meta: "Blog",
      description: "Updates, research, and announcements.",
    });
  }
  if (whitepaper) {
    items.push({
      title: "Whitepaper",
      href: whitepaper,
      meta: "Research",
      description: "Protocol design and technical details.",
    });
  }
  if (docs) {
    items.push({
      title: "Documentation",
      href: docs,
      meta: "Docs",
      description: "Developer docs and guides.",
    });
  }
  if (forum) {
    items.push({
      title: "Forum",
      href: forum,
      meta: "Community",
      description: "Discussions and governance threads.",
    });
  }

  return items.slice(0, 4);
}

function ArticleCard({ item }: { item: ArticleItem }) {
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noreferrer"
      className="group flex items-start gap-4 rounded-[18px] border border-black/10 bg-white p-5 transition-shadow hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-[#151a21] dark:hover:shadow-[0_18px_40px_rgba(0,0,0,0.32)]"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[14px] border border-black/10 bg-black/[0.03] dark:border-white/10 dark:bg-white/[0.04]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(89,242,109,0.14),transparent_55%),radial-gradient(circle_at_70%_70%,rgba(0,0,0,0.10),transparent_55%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(89,242,109,0.10),transparent_55%),radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.06),transparent_55%)]" />
        <div className="relative flex h-full w-full items-center justify-center text-black/45 dark:text-white/55">
          <svg viewBox="0 0 24 24" width={22} height={22} fill="currentColor" role="presentation">
            <path d="M6 2h9l3 3v17H6z" opacity="0.35" />
            <path d="M15 2v5h5" />
            <path d="M8 11h8" />
            <path d="M8 15h8" />
            <path d="M8 19h6" />
          </svg>
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="truncate font-serif text-[18px] leading-none text-black dark:text-[#f2f4f6]">
              {item.title}
            </div>
            {item.description ? (
              <div className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-black/60 dark:text-white/60">
                {item.description}
              </div>
            ) : null}
          </div>
          <ValuePill>{item.meta ?? "Article"}</ValuePill>
        </div>
      </div>
    </a>
  );
}

export function ProjectArticles({ project }: { project: Project }) {
  const items = collectArticles(project);

  return (
    <DetailSection id="articles" title="Articles">
      {items.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <ArticleCard key={item.href} item={item} />
          ))}
        </div>
      ) : (
        <DetailCard>
          <div className="flex items-center justify-between gap-4">
            <div className="text-[13px] text-black/55 dark:text-white/55">
              No articles available for this project.
            </div>
            <ValuePill>Coming soon</ValuePill>
          </div>
        </DetailCard>
      )}
    </DetailSection>
  );
}

