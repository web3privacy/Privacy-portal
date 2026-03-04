import { NextResponse } from "next/server";
import { Octokit } from "octokit";
import { z } from "zod";

export const runtime = "nodejs";

const BodySchema = z.object({
  token: z.string().min(1),
  mode: z.enum(["create", "update"]).default("create"),
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

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

async function ensureFork(opts: {
  octokit: Octokit;
  forkOwner: string;
  upstreamOwner: string;
  upstreamRepo: string;
}) {
  const { octokit, forkOwner, upstreamOwner, upstreamRepo } = opts;

  try {
    await octokit.rest.repos.get({ owner: forkOwner, repo: upstreamRepo });
    return;
  } catch {
    // Continue to fork
  }

  await octokit.rest.repos.createFork({
    owner: upstreamOwner,
    repo: upstreamRepo,
  });

  // Fork creation is async on GitHub. Poll until it exists.
  for (let i = 0; i < 12; i++) {
    try {
      await octokit.rest.repos.get({ owner: forkOwner, repo: upstreamRepo });
      return;
    } catch {
      await sleep(1500);
    }
  }

  throw new Error("Fork not ready yet. Please try again in ~30 seconds.");
}

async function resolveUpstreamPath(opts: {
  octokit: Octokit;
  upstreamOwner: string;
  upstreamRepo: string;
  projectId: string;
}) {
  const { octokit, upstreamOwner, upstreamRepo, projectId } = opts;

  const searchQuery = `repo:${upstreamOwner}/${upstreamRepo} path:src/projects filename:index.yaml "id: ${projectId}"`;
  try {
    const search = await octokit.rest.search.code({ q: searchQuery, per_page: 5 });
    const item = search.data.items[0];
    if (item?.path) return item.path;
  } catch {
    // ignore; fallback below
  }
  return `src/projects/${projectId}/index.yaml`;
}

export async function POST(req: Request) {
  const parsed = BodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const token = parsed.data.token;
  const projectId = normalizeProjectId(parsed.data.projectId);
  const yamlText = parsed.data.yaml;

  const upstreamOwner = "web3privacy";
  const upstreamRepo = "explorer-data";

  const octokit = new Octokit({ auth: token });

  try {
    const me = await octokit.rest.users.getAuthenticated();
    const forkOwner = me.data.login;

    await ensureFork({ octokit, forkOwner, upstreamOwner, upstreamRepo });

    const upstreamRepoInfo = await octokit.rest.repos.get({
      owner: upstreamOwner,
      repo: upstreamRepo,
    });
    const baseBranch = upstreamRepoInfo.data.default_branch || "main";

    const forkBaseRef = await octokit.rest.git.getRef({
      owner: forkOwner,
      repo: upstreamRepo,
      ref: `heads/${baseBranch}`,
    });

    const branch = `portal/${projectId}-${Date.now()}`;
    await octokit.rest.git.createRef({
      owner: forkOwner,
      repo: upstreamRepo,
      ref: `refs/heads/${branch}`,
      sha: forkBaseRef.data.object.sha,
    });

    const path =
      parsed.data.sourcePath ??
      (await resolveUpstreamPath({
        octokit,
        upstreamOwner,
        upstreamRepo,
        projectId,
      }));

    // If the file exists in the fork branch already, include sha so it updates.
    let existingSha: string | undefined = undefined;
    try {
      const existing = await octokit.rest.repos.getContent({
        owner: forkOwner,
        repo: upstreamRepo,
        path,
        ref: branch,
      });
      if (!Array.isArray(existing.data) && existing.data.type === "file") {
        existingSha = existing.data.sha;
      }
    } catch {
      // ignore
    }

    const content = Buffer.from(yamlText, "utf8").toString("base64");
    const message =
      parsed.data.mode === "update"
        ? `Update project: ${projectId}`
        : `Add project: ${projectId}`;

    await octokit.rest.repos.createOrUpdateFileContents({
      owner: forkOwner,
      repo: upstreamRepo,
      path,
      message,
      content,
      branch,
      sha: existingSha,
    });

    const prTitle =
      parsed.data.mode === "update"
        ? `Update: ${projectId}`
        : `Add: ${projectId}`;
    const prBody =
      "Created via Privacy Portal Explorer editor.\n\n" +
      `Project id: \`${projectId}\`\n` +
      `Path: \`${path}\`\n`;

    const pr = await octokit.rest.pulls.create({
      owner: upstreamOwner,
      repo: upstreamRepo,
      title: prTitle,
      head: `${forkOwner}:${branch}`,
      base: baseBranch,
      body: prBody,
    });

    return NextResponse.json({
      ok: true,
      prUrl: pr.data.html_url,
      prNumber: pr.data.number,
      branch,
      path,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Commit failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
