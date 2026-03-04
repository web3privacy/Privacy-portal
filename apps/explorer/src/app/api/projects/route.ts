import { API_RESPONSE_KEYS, API_URLS } from "@/lib/constants";
import { processProjects } from "@/lib/processProjects";
import { computeProjectRatings, isRankArray } from "@/lib/scoring";
import { Project } from "@/types";
import {
  ProjectFiltersSchema,
  projectsSearchParams,
} from "@/types/projectFilters";
import { loadExplorerDataFromDisk } from "@/lib/load-explorer-data";

import { NextRequest, NextResponse } from "next/server";
import { createLoader } from "nuqs/server";

const loadSearchParams = createLoader(projectsSearchParams);
export const runtime = "nodejs";

type ProjectsResponse = {
  [API_RESPONSE_KEYS.PROJECTS]?: Project[];
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
  };
  error?: string;
};

export type GETProjectsResponse = ProjectsResponse;

export async function GET(
  req: NextRequest
): Promise<NextResponse<GETProjectsResponse>> {
  const { searchParams } = req.nextUrl;

  const params = await loadSearchParams(searchParams);

  const filtersResult = ProjectFiltersSchema.safeParse(params);

  if (!filtersResult.success) {
    return NextResponse.json(
      {
        error: "Invalid query parameters",
        details: filtersResult.error.flatten(),
      },
      { status: 400 }
    );
  }

  const filters = filtersResult.data;

  try {
    // Prefer local disk snapshot for speed (short-term local dev workflow).
    // Fallback to remote if the disk file is unavailable.
    const allProjects =
      (await loadExplorerDataFromDisk().catch(() => null)) ??
      (await fetch(process.env.EXPLORER_DATA_URL ?? API_URLS.EXPLORER_DATA).then(
        (r) => r.json()
      ));

    const ranksRaw = allProjects?.[API_RESPONSE_KEYS.RANKS];
    const ranks = isRankArray(ranksRaw) ? ranksRaw : [];

    const rawProjects = allProjects?.[API_RESPONSE_KEYS.PROJECTS];
    const baseProjects = (Array.isArray(rawProjects) ? rawProjects : []).filter(
      (p): p is Project =>
        !!p &&
        typeof (p as Project).id === "string" &&
        (p as Project).id.trim().length > 0 &&
        typeof (p as Project).name === "string" &&
        (p as Project).name.trim().length > 0
    );

    const enrichedProjects = baseProjects.map((project) => {
      if (!ranks.length) return project;
      const { ratings, percentage } = computeProjectRatings(project, ranks);
      return { ...project, ratings, percentage };
    });

    const { total, paginated } = processProjects(
      enrichedProjects,
      filters
    );

    return NextResponse.json({
      [API_RESPONSE_KEYS.PROJECTS]: paginated,
      pagination: {
        page: filters.page!,
        pageSize: filters.pageSize!,
        total: total,
      },
    });
  } catch (error) {
    console.error("Error fetching projects:", error);

    return NextResponse.json(
      { error: "Failed to fetch or process projects" },
      { status: 500 }
    );
  }
}
