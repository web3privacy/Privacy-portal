import { NextResponse } from "next/server";
import { z } from "zod";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { existsSync } from "node:fs";

export const runtime = "nodejs";

const BodySchema = z.object({
  projectId: z.string().min(2).max(64),
});

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export async function POST(req: Request) {
  const parsed = BodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const projectId = normalize(parsed.data.projectId);
  const projectsDir = path.join(process.cwd(), "data", "explorer-data", "src", "projects");

  // Fast path: exact normalized folder.
  let folder = parsed.data.projectId;
  let filePath = path.join(projectsDir, folder, "index.yaml");
  if (!existsSync(filePath)) {
    // Case-insensitive match folder name.
    const entries = await (await import("node:fs/promises")).readdir(projectsDir, {
      withFileTypes: true,
    });
    const match = entries.find(
      (e) => e.isDirectory() && normalize(e.name) === projectId
    );
    if (!match) {
      return NextResponse.json({ ok: false, error: "Project not found" }, { status: 404 });
    }
    folder = match.name;
    filePath = path.join(projectsDir, folder, "index.yaml");
  }

  try {
    const yaml = await readFile(filePath, "utf8");
    const rel = path.relative(process.cwd(), filePath);
    return NextResponse.json({ ok: true, path: rel, yaml });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to read YAML";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

