import { DismissableBanner } from "@/components/home/DismissableBanner";
import { StateOfPrivacy } from "@/components/home/StateOfPrivacy";
import { SortSelect } from "@/components/projects/SortSelect";
import { ViewToggle } from "@/components/projects/ViewToggle";
import ProjectsFilters from "@/components/projects/filters/ProjectsFilters";
import { ProjectsList } from "@/components/projects/list/ProjectsList";
import { SearchParams } from "nuqs/server";
import { createLoader } from "nuqs/server";
import { Suspense } from "react";
import { projectsSearchParams } from "@/types/projectFilters";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

const loadSearchParams = createLoader(projectsSearchParams);

export default async function ExplorerPage({ searchParams }: PageProps) {
  const resolved = await searchParams;
  const resolvedPromise = Promise.resolve(resolved);
  const parsed = await loadSearchParams(resolvedPromise);
  const view = parsed.view ?? "cards";
  const searchParamsKey = JSON.stringify(resolved);

  return (
    <main className="viewport-range-shell mx-auto w-full px-4 py-10 md:px-6">
      <DismissableBanner />
      <StateOfPrivacy variant={view === "rows" ? "rows" : "cards"} />

      <section className="mt-14">
        <h1 className="font-serif text-[26px] leading-none text-black md:text-[30px] dark:text-[#f2f4f6]">
          List of Privacy Projects
        </h1>

        <div className="mt-6">
          <ProjectsFilters />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="text-[12px] font-bold uppercase tracking-[0.08em] text-black/55 dark:text-white/55">
            Projects
          </div>
          <div className="flex items-center gap-3">
            <ViewToggle />
            <SortSelect />
          </div>
        </div>

        <div className="mt-4">
          <Suspense
            key={searchParamsKey}
            fallback={ProjectsList.fallback(view === "rows" ? "rows" : "cards")}
          >
            <ProjectsList searchParams={resolvedPromise} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
