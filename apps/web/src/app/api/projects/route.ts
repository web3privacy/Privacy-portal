import { API_RESPONSE_KEYS, API_URLS } from "@/lib/constants";
import { processProjects } from "@/lib/processProjects";
import { computeProjectRatings, isRankArray } from "@/lib/scoring";
import { Project } from "@/types";
import {
  ProjectFiltersSchema,
  SORT_BY_OPTIONS,
  SORT_ORDER_OPTIONS,
} from "@/types/projectFilters";
import { loadExplorerDataFromDisk } from "@/lib/load-explorer-data";

import { NextRequest, NextResponse } from "next/server";
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

function parseFiltersFromUrl(searchParams: URLSearchParams): Record<string, unknown> {
  const categories = searchParams.getAll("categories").filter(Boolean);
  const ecosystems = searchParams.getAll("ecosystems").filter(Boolean);
  const usecases = searchParams.getAll("usecases").filter(Boolean);
  const sortBy = searchParams.get("sortBy") ?? "percentage";
  const sortOrder = searchParams.get("sortOrder") ?? "desc";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") ?? "50", 10) || 50));
  const q = searchParams.get("q") ?? "";

  return {
    categories: categories.length ? categories : undefined,
    ecosystems: ecosystems.length ? ecosystems : undefined,
    usecases: usecases.length ? usecases : undefined,
    sortBy: SORT_BY_OPTIONS.includes(sortBy as never) ? sortBy : "percentage",
    sortOrder: SORT_ORDER_OPTIONS.includes(sortOrder as never) ? sortOrder : "desc",
    page,
    pageSize,
    q: q.trim() || undefined,
  };
}

export async function GET(
  req: NextRequest
): Promise<NextResponse<GETProjectsResponse>> {
  const params = parseFiltersFromUrl(req.nextUrl.searchParams);
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
