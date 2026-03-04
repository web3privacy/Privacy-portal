"use client";

import * as React from "react";
import type { Project } from "@/types/project";
import type { ProjectFilters } from "@/types/projectFilters";
import { createParams } from "@/queries/projects.queries";
import { ProjectCard } from "./ProjectCard";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  initialProjects: Project[];
  initialPage: number;
  pageSize: number;
  total: number;
  filters: ProjectFilters;
  ecosystemIconsById: Record<string, string | undefined>;
};

function CardSkeleton() {
  return (
    <div className="h-full rounded-[18px] border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-[#151a21]">
      <div className="flex items-start justify-between">
        <Skeleton className="h-9 w-9 rounded-[12px]" />
        <div className="flex items-center gap-1">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-5 w-5 rounded-full" />
        </div>
      </div>
      <div className="mt-0 flex flex-col items-center text-center">
        <Skeleton className="h-[104px] w-[104px] rounded-full sm:h-[148px] sm:w-[148px]" />
        <Skeleton className="mt-4 h-7 w-2/3" />
        <Skeleton className="mt-3 h-3 w-[130px] rounded-full" />
        <div className="mt-4 w-full max-w-[34ch] space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        <div className="mt-6 w-full">
          <div className="flex items-center justify-center gap-1">
            <Skeleton className="h-9 w-9 rounded-[12px]" />
            <Skeleton className="h-9 w-9 rounded-[12px]" />
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProjectsCardsClient({
  initialProjects,
  initialPage,
  pageSize,
  total,
  filters,
  ecosystemIconsById,
}: Props) {
  const [projects, setProjects] = React.useState<Project[]>(initialProjects);
  const [page, setPage] = React.useState(initialPage);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Reset list when filters (except page) change server-side and a new instance is rendered.
  React.useEffect(() => {
    setProjects(initialProjects);
    setPage(initialPage);
    setError(null);
    setLoading(false);
  }, [initialProjects, initialPage]);

  const totalPages = pageSize > 0 ? Math.ceil(total / pageSize) : 1;
  const hasMore = page < totalPages && projects.length < total;

  async function onLoadMore() {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);
    try {
      const nextPage = page + 1;
      const query = createParams({ ...filters, page: nextPage, pageSize });
      const res = await fetch(`/api/projects?${query}`, { cache: "no-store" });
      const json = (await res.json()) as { projects?: Project[]; error?: string };
      if (!res.ok || json.error) {
        throw new Error(json.error || `Failed to load projects (HTTP ${res.status})`);
      }
      const next = json.projects ?? [];
      setProjects((prev) => prev.concat(next));
      setPage(nextPage);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load more projects");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {projects.map((project) => (
          <li key={project.id}>
            <ProjectCard project={project} ecosystemIconsById={ecosystemIconsById} />
          </li>
        ))}
        {loading ? (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <li key={`more-skel-${i}`}>
                <CardSkeleton />
              </li>
            ))}
          </>
        ) : null}
      </ul>

      {error ? (
        <div className="mt-6 text-center text-[12px] font-bold uppercase tracking-[0.08em] text-red-600 dark:text-red-400">
          {error}
        </div>
      ) : null}

      {hasMore ? (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loading}
            className="inline-flex h-11 items-center justify-center rounded-[12px] border border-black/15 bg-white px-6 text-[12px] font-bold uppercase tracking-[0.10em] text-black transition-colors hover:bg-black/5 disabled:opacity-60 dark:border-white/15 dark:bg-[#151a21] dark:text-[#f2f4f6] dark:hover:bg-white/10"
          >
            More projects
          </button>
        </div>
      ) : null}
    </div>
  );
}

