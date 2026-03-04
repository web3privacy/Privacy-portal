import { API_RESPONSE_KEYS, API_URLS } from "@/lib/constants";
import { computeProjectRatings, isRankArray } from "@/lib/scoring";
import { Project } from "@/types";
import { loadExplorerDataFromDisk } from "@/lib/load-explorer-data";
import { NextRequest, NextResponse } from "next/server";

type ProjectResponse = {
  project?: Project;
  error?: string;
};

export type GETProjectResponse = ProjectResponse;
export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<GETProjectResponse>> {
  try {
    const data =
      (await loadExplorerDataFromDisk().catch(() => null)) ??
      (await fetch(process.env.EXPLORER_DATA_URL ?? API_URLS.EXPLORER_DATA).then(
        (r) => r.json()
      ));
    const projects = data[API_RESPONSE_KEYS.PROJECTS] as Project[];
    const ranksRaw = data?.[API_RESPONSE_KEYS.RANKS];
    const ranks = isRankArray(ranksRaw) ? ranksRaw : [];
    const id = (await params).id;

    const project = projects.find((p) => p.id === id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project && ranks.length) {
      const { ratings, percentage } = computeProjectRatings(project, ranks);
      return NextResponse.json({ project: { ...project, ratings, percentage } });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}
