import { NextResponse } from "next/server";
import { z } from "zod";
import path from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

export const runtime = "nodejs";

const execFileAsync = promisify(execFile);

const BodySchema = z.object({
  projectId: z.string().min(2).max(64),
  yaml: z.string().min(1),
  sourcePath: z.string().optional(),
});

function normalizeProjectId(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export async function POST(req: Request) {
  const parsed = BodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const projectId = normalizeProjectId(parsed.data.projectId);
  const projectsDir = path.join(process.cwd(), "data", "explorer-data", "src", "projects");

  const resolvedProvided =
    parsed.data.sourcePath && parsed.data.sourcePath.trim()
      ? path.join(process.cwd(), parsed.data.sourcePath)
      : null;

  const filePath =
    resolvedProvided &&
    resolvedProvided.startsWith(projectsDir + path.sep) &&
    resolvedProvided.endsWith(path.sep + "index.yaml")
      ? resolvedProvided
      : path.join(projectsDir, projectId, "index.yaml");

  try {
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, parsed.data.yaml, "utf8");

    // Refresh local snapshot so the UI reflects changes immediately.
    await execFileAsync("node", [path.join(process.cwd(), "scripts", "build-explorer-data-json.mjs")], {
      cwd: process.cwd(),
    });

    return NextResponse.json({
      ok: true,
      path: path.relative(process.cwd(), filePath),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to write YAML";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
