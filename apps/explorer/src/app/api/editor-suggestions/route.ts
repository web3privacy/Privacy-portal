import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

type Counts = Map<string, number>;

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function add(counts: Counts, value: unknown) {
  if (typeof value !== "string") return;
  const v = value.trim();
  if (!v) return;
  counts.set(v, (counts.get(v) ?? 0) + 1);
}

function toTopList(counts: Counts, limit = 120): string[] {
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([k]) => k);
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "explorer-data", "index.json");
    const raw = await readFile(filePath, "utf8");
    const data = JSON.parse(raw) as unknown;
    const root = asRecord(data);
    const projects = root.projects;
    if (!Array.isArray(projects)) {
      return NextResponse.json({ error: "No projects found" }, { status: 500 });
    }

    const roleCounts: Counts = new Map();
    const fundingTypeCounts: Counts = new Map();
    const historyTypeCounts: Counts = new Map();
    const auditCompanyCounts: Counts = new Map();
    const auditNameCounts: Counts = new Map();

    for (const pRaw of projects) {
      const p = asRecord(pRaw);
      const team = asRecord(p.team);
      const teamMembers = team.teammembers;
      if (Array.isArray(teamMembers)) {
        for (const mRaw of teamMembers) {
          const m = asRecord(mRaw);
          add(roleCounts, m.role);
        }
      }

      const funding = p.funding;
      if (Array.isArray(funding)) {
        for (const fRaw of funding) {
          const f = asRecord(fRaw);
          add(fundingTypeCounts, f.type);
        }
      }

      const history = p.history;
      if (Array.isArray(history)) {
        for (const hRaw of history) {
          const h = asRecord(hRaw);
          add(historyTypeCounts, h.event_type);
        }
      }

      const audits = p.audits;
      if (Array.isArray(audits)) {
        for (const aRaw of audits) {
          const a = asRecord(aRaw);
          add(auditCompanyCounts, a.company);
          add(auditNameCounts, a.name);
        }
      }
    }

    return NextResponse.json({
      roles: toTopList(roleCounts, 120),
      fundingTypes: toTopList(fundingTypeCounts, 80),
      historyEventTypes: toTopList(historyTypeCounts, 80),
      auditCompanies: toTopList(auditCompanyCounts, 80),
      auditNames: toTopList(auditNameCounts, 120),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to build suggestions";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
