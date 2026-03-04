import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

const VISIBILITY_FILE = path.join(process.cwd(), "data", "events", "events-visibility.yaml");

function loadVisibility(): string[] {
  if (!fs.existsSync(VISIBILITY_FILE)) return [];
  const content = fs.readFileSync(VISIBILITY_FILE, "utf8");
  const parsed = yaml.load(content) as { hidden?: string[] } | null;
  return parsed?.hidden ?? [];
}

function saveVisibility(hidden: string[]) {
  const dir = path.dirname(VISIBILITY_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(VISIBILITY_FILE, yaml.dump({ hidden }), "utf8");
}

export async function GET() {
  const hidden = loadVisibility();
  return NextResponse.json({ hidden });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const hidden = Array.isArray(body.hidden) ? body.hidden : [];
  saveVisibility(hidden);
  return NextResponse.json({ ok: true });
}
