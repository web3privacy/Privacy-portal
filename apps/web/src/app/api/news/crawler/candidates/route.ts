import { NextRequest, NextResponse } from "next/server";
import {
  getCandidates,
  getCandidatesData,
  getApprovedIds,
} from "@/lib/news-feeds";

const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 200;

export async function GET(req: NextRequest) {
  const candidates = getCandidates();
  const { lastCrawledAt } = getCandidatesData();
  const approvedIds = getApprovedIds();

  const page = Math.max(1, parseInt(req.nextUrl.searchParams.get("page") ?? "1", 10) || 1);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(req.nextUrl.searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT)
  );
  const total = candidates.length;
  const start = (page - 1) * limit;
  const paginated = candidates.slice(start, start + limit);

  return NextResponse.json({
    candidates: paginated,
    total,
    page,
    limit,
    lastCrawledAt,
    approvedIds,
  });
}
