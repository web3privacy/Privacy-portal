import Image from "next/image";
import Link from "next/link";
import { getProjects } from "@/queries/projects.queries";
import type { Project } from "@/types/project";
import { HeroMetrics } from "@/components/home/HeroMetrics";

function Pill({ children }: { children: string }) {
  return (
    <span className="rounded-full bg-black/5 px-2 py-1 text-[11px] font-semibold text-black/70 dark:bg-white/10 dark:text-white/70">
      {children}
    </span>
  );
}

function ProjectBubble({ project }: { project: Project }) {
  const logo = project.logos?.[0]?.url;
  return (
    <Link
      href={`/project/${project.id}`}
      className="group flex w-[140px] shrink-0 flex-col items-center text-center"
    >
      <div className="flex h-[70px] w-[70px] items-center justify-center overflow-hidden rounded-full border border-black/10 bg-white dark:border-white/10 dark:bg-[#0f1318]">
        {logo ? (
          <Image
            src={logo}
            alt={project.name}
            width={70}
            height={70}
            className="h-full w-full object-cover"
            unoptimized
          />
        ) : (
          <span className="font-serif text-[18px] text-black/70 dark:text-white/70">
            {project.name?.[0]?.toUpperCase() ?? "?"}
          </span>
        )}
      </div>
      <div className="mt-3 line-clamp-1 font-serif text-[14px] text-black group-hover:underline dark:text-[#f2f4f6]">
        {project.name}
      </div>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
        {project.usecases?.slice(0, 1).map((u) => <Pill key={u}>{u}</Pill>)}
        {project.categories?.slice(0, 1).map((c) => <Pill key={c}>{c}</Pill>)}
      </div>
    </Link>
  );
}

export async function StateOfPrivacy({
  variant = "cards",
}: {
  variant?: "cards" | "rows";
}) {
  type LlamaProtocol = {
    category?: string | null;
    slug?: string | null;
    name?: string | null;
    tvl?: number | null;
    gecko_id?: string | null;
  };

  const topPrivacy = await fetch("https://api.llama.fi/protocols", {
    next: { revalidate: 60 * 60 },
  })
    .then((r) => r.json())
    .then((arr: unknown) => (Array.isArray(arr) ? (arr as LlamaProtocol[]) : []))
    .then((arr) =>
      arr
        .filter(
          (p) =>
            !!p &&
            String(p.category || "")
              .toLowerCase()
              .includes("privacy") &&
            typeof p.slug === "string" &&
            p.slug.length > 0 &&
            typeof p.name === "string" &&
            p.name.length > 0
        )
        .sort((a, b) => (b.tvl ?? 0) - (a.tvl ?? 0))
        .slice(0, 10)
        .map((p) => ({
          id: `llama:${p.slug}`,
          name: p.name as string,
          slug: p.slug as string,
          geckoId: typeof p.gecko_id === "string" ? p.gecko_id : null,
        }))
    )
    .catch(() => []);

  const heroProjects = [
    { id: "cg:monero", name: "Monero", geckoId: "monero" as const },
    { id: "cg:zcash", name: "Zcash", geckoId: "zcash" as const },
    ...topPrivacy,
  ];

  const data = await getProjects({
    page: 1,
    pageSize: 6,
    sortBy: "percentage",
    sortOrder: "desc",
  });
  const projects = data.projects ?? [];

  return (
    <section>
      <h2 className="font-serif text-[44px] leading-[1] tracking-[-0.02em] text-black md:text-[58px] dark:text-[#f2f4f6]">
        State of Privacy
      </h2>

      <div className="mt-6 overflow-hidden rounded-[16px] border border-black/10 bg-white dark:border-white/10 dark:bg-[#151a21]">
        {variant === "rows" ? (
          <HeroMetrics projects={heroProjects} initialId={heroProjects[0]?.id} />
        ) : (
          <div className="px-4 py-6 md:px-5">
            <div className="flex justify-center gap-6 overflow-x-auto pb-2">
              {projects.map((p) => (
                <ProjectBubble key={p.id} project={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
