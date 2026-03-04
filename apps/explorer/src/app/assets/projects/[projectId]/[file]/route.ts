import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const CONTENT_TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  svg: "image/svg+xml",
  gif: "image/gif",
};

function isSafeSegment(value: string): boolean {
  if (!value) return false;
  if (value.includes("\0")) return false;
  if (value.includes("/") || value.includes("\\")) return false;
  if (value.includes("..")) return false;
  return true;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ projectId: string; file: string }> }
) {
  const { projectId, file } = await params;

  if (!isSafeSegment(projectId) || !isSafeSegment(file)) {
    return NextResponse.json({ error: "Invalid asset path" }, { status: 400 });
  }

  const safeFile = path.basename(file);
  if (safeFile !== file) {
    return NextResponse.json({ error: "Invalid file name" }, { status: 400 });
  }

  const filePath = path.join(
    process.cwd(),
    "data",
    "explorer-data",
    "src",
    "projects",
    projectId,
    safeFile
  );

  try {
    const buf = await readFile(filePath);
    const ext = (path.extname(safeFile).slice(1) || "").toLowerCase();
    const contentType = CONTENT_TYPES[ext] ?? "application/octet-stream";

    return new NextResponse(buf, {
      headers: {
        "content-type": contentType,
        // Cache aggressively; these are versioned by git and referenced by stable paths.
        "cache-control": "public, max-age=86400, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

