import { NextResponse } from "next/server";
import { z } from "zod";
import { Octokit } from "octokit";

export const runtime = "nodejs";

const BodySchema = z.object({
  token: z.string().min(1),
  projectId: z.string().min(2).max(64),
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
    return NextResponse.json(
      { ok: false, error: "Invalid request" },
      { status: 400 }
    );
  }

  const token = parsed.data.token;
  const projectId = normalizeProjectId(parsed.data.projectId);

  const octokit = new Octokit({ auth: token });

  const upstreamOwner = "web3privacy";
  const upstreamRepo = "explorer-data";

  // Try GitHub code search to find the correct path (case-sensitive).
  const searchQuery = `repo:${upstreamOwner}/${upstreamRepo} path:src/projects filename:index.yaml "id: ${projectId}"`;

  try {
    const upstreamInfo = await octokit.rest.repos.get({
      owner: upstreamOwner,
      repo: upstreamRepo,
    });
    const baseBranch = upstreamInfo.data.default_branch || "main";

    const search = await octokit.rest.search.code({
      q: searchQuery,
      per_page: 5,
    });

    const item = search.data.items[0];
    const path = item?.path ?? `src/projects/${projectId}/index.yaml`;

    const contentRes = await octokit.rest.repos.getContent({
      owner: upstreamOwner,
      repo: upstreamRepo,
      path,
      ref: baseBranch,
    });

    if (Array.isArray(contentRes.data) || contentRes.data.type !== "file") {
      return NextResponse.json(
        { ok: false, error: "Project YAML not found at resolved path." },
        { status: 404 }
      );
    }

    const file = contentRes.data;
    const decoded = Buffer.from(file.content, "base64").toString("utf8");

    return NextResponse.json({ ok: true, path, yaml: decoded });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load YAML";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
