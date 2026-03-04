import { Skeleton } from "@/components/ui/skeleton";
import { getEcosystems } from "@/queries/ecosystems.queries";
import { getProjects } from "@/queries/projects.queries";
import {
  ProjectFiltersSchema,
  projectsSearchParams,
} from "@/types/projectFilters";
import Link from "next/link";
import { createLoader, SearchParams } from "nuqs/server";
import { ProjectRow } from "./ProjectRow";
import { ProjectsCardsClient } from "./ProjectsCardsClient";

const loadSearchParams = createLoader(projectsSearchParams);

export async function ProjectsList({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await loadSearchParams(searchParams);

  const filtersResult = ProjectFiltersSchema.safeParse(params);

  if (!filtersResult.success) {
    return (
      <div className="min-h-screen p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-red-500">
          Invalid query parameters: {filtersResult.error.message}
        </p>
      </div>
    );
  }

  let data: Awaited<ReturnType<typeof getProjects>>;
  try {
    data = await getProjects(params);
  } catch (err) {
    return (
      <div className="min-h-screen p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Error loading projects</h1>
        <p className="text-red-500">
          {err instanceof Error ? err.message : "Failed to load projects. Please try again."}
        </p>
      </div>
    );
  }

  if (data?.error) {
    return (
      <div className="min-h-screen p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-red-500">{data.error}</p>
      </div>
    );
  }

  const pageSize = data.pagination?.pageSize || 50;
  const totalPages =
    pageSize > 0
      ? Math.ceil((data.pagination?.total || 0) / pageSize)
      : 1;
  const currentPage = data.pagination?.page || 1;
  const view = params.view ?? "cards";

  const ecosystems = await getEcosystems();
  const ecosystemIconsById: Record<string, string | undefined> = Object.fromEntries(
    ecosystems.map((e) => [e.id, e.icon])
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function buildPageUrl(currentParams: Record<string, any>, newPage: number) {
    const params = new URLSearchParams(currentParams as Record<string, string>);
    params.set("page", newPage.toString());
    return `?${params.toString()}`;
  }

  function PageLink({
    href,
    children,
    active,
    disabled,
    ariaLabel,
  }: {
    href: string;
    children: React.ReactNode;
    active?: boolean;
    disabled?: boolean;
    ariaLabel?: string;
  }) {
    const base =
      "inline-flex h-9 min-w-9 items-center justify-center rounded-[10px] border px-3 text-[12px] font-bold uppercase tracking-[0.08em] transition-colors";
    const cls = active
      ? "border-black bg-black text-white hover:bg-black/85 dark:border-white dark:bg-white dark:text-black dark:hover:bg-white/85"
      : "border-black/15 bg-white text-black/70 hover:bg-black/5 hover:text-black dark:border-white/15 dark:bg-[#151a21] dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white";

    if (disabled) {
      return (
        <span className={`${base} ${cls} opacity-40`} aria-hidden="true">
          {children}
        </span>
      );
    }
    return (
      <Link
        href={href}
        className={`${base} ${cls}`}
        aria-label={ariaLabel}
        aria-current={active ? "page" : undefined}
      >
        {children}
      </Link>
    );
  }

  function pageItems(): Array<number | "ellipsis"> {
    const pages: Array<number | "ellipsis"> = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    pages.push(1);
    const left = Math.max(2, currentPage - 1);
    const right = Math.min(totalPages - 1, currentPage + 1);
    if (left > 2) pages.push("ellipsis");
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push("ellipsis");
    pages.push(totalPages);
    return pages;
  }

  return (
    <div>
      <div className="font-serif text-[14px] text-black/60 dark:text-white/60">
        {data?.pagination?.total} projects
      </div>

      {view === "rows" ? (
        <div className="mt-4 space-y-3">
          <div className="hidden md:grid grid-cols-[1fr_96px_110px_120px] items-center px-4 text-[12px] font-bold uppercase tracking-[0.08em] text-black/55 dark:text-white/55">
            <div>Project name</div>
            <div className="text-center">Scoring</div>
            <div className="text-left">Ecosystem</div>
            <div className="text-right">Links</div>
          </div>
          {data?.projects?.map((project) => (
            <ProjectRow
              key={project.id}
              project={project}
              ecosystemIconsById={ecosystemIconsById}
            />
          ))}
        </div>
      ) : (
        <ProjectsCardsClient
          initialProjects={data?.projects ?? []}
          initialPage={currentPage}
          pageSize={pageSize}
          total={data.pagination?.total ?? 0}
          filters={params}
          ecosystemIconsById={ecosystemIconsById}
        />
      )}
      {view === "rows" && totalPages > 1 ? (
        <div className="my-10 space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <PageLink
              href={buildPageUrl(params, Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              ariaLabel="Previous page"
            >
              Prev
            </PageLink>

            {pageItems().map((item, idx) =>
              item === "ellipsis" ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 text-[12px] font-bold uppercase tracking-[0.08em] text-black/45 dark:text-white/45"
                  aria-hidden="true"
                >
                  ...
                </span>
              ) : (
                <PageLink
                  key={item}
                  href={buildPageUrl(params, item)}
                  active={item === currentPage}
                  ariaLabel={`Go to page ${item}`}
                >
                  {item}
                </PageLink>
              )
            )}

            <PageLink
              href={buildPageUrl(params, Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              ariaLabel="Next page"
            >
              Next
            </PageLink>
          </div>

          {currentPage < totalPages ? (
            <div className="flex justify-center">
              <Link
                href={buildPageUrl(params, currentPage + 1)}
                className="inline-flex h-11 items-center justify-center rounded-[12px] border border-black/15 bg-white px-6 text-[12px] font-bold uppercase tracking-[0.10em] text-black transition-colors hover:bg-black/5 dark:border-white/15 dark:bg-[#151a21] dark:text-[#f2f4f6] dark:hover:bg-white/10"
              >
                More projects
              </Link>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

const PROJECTS_PER_PAGE = 6;

ProjectsList.fallback = function (view: "cards" | "rows" = "cards") {
  return (
    <div>
      {" "}
      <div className="font-serif text-[14px] text-black/60 dark:text-white/60">
        <Skeleton className="h-5 w-28" />
      </div>
      {view === "rows" ? (
        <div className="mt-4 space-y-3">
          <div className="hidden md:grid grid-cols-[1fr_96px_110px_120px] items-center px-4 text-[12px] font-bold uppercase tracking-[0.08em] text-black/55 dark:text-white/55">
            <div>Project name</div>
            <div className="text-center">Scoring</div>
            <div className="text-center">Ecosystem</div>
            <div className="text-right">Links</div>
          </div>
          {[...Array(PROJECTS_PER_PAGE)].map((_, index) => (
            <div
              key={`row-skel-${index}`}
              className="grid gap-4 rounded-[14px] border border-black/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-[#151a21] md:grid-cols-[1fr_96px_110px_120px] md:items-center"
            >
              <div className="flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
              <div className="hidden md:flex items-center justify-center">
                <Skeleton className="h-9 w-9 rounded-full" />
              </div>
              <div className="hidden md:flex items-center justify-center">
                <div className="flex -space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={`eco-${index}-${i}`} className="h-7 w-7 rounded-full" />
                  ))}
                </div>
              </div>
              <div className="hidden md:flex items-center justify-end gap-1">
                <Skeleton className="h-8 w-8 rounded-[10px]" />
                <Skeleton className="h-8 w-8 rounded-[10px]" />
                <Skeleton className="h-8 w-8 rounded-[10px]" />
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 md:hidden">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="flex items-center gap-1">
                  <Skeleton className="h-8 w-8 rounded-[10px]" />
                  <Skeleton className="h-8 w-8 rounded-[10px]" />
                  <Skeleton className="h-8 w-8 rounded-[10px]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, index) => (
            <li
              key={`card-skel-${index}`}
              className="h-full rounded-[18px] border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-[#151a21]"
            >
              <div className="flex items-start justify-between">
                <Skeleton className="h-9 w-9 rounded-[12px]" />
                <div className="flex items-center gap-1">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-5 w-5 rounded-full" />
                </div>
              </div>
              <div className="flex flex-col items-center text-center">
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
