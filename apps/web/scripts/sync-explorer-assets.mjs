import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// This script is intentionally resilient:
// - In local monorepo dev/build, it copies logos from `data/explorer-data/src/projects/*`
//   into `apps/explorer/public/project-assets/projects/*` for fast loading.
// - In Vercel builds when deploying only `apps/explorer`, the source data directory isn't
//   present; the script will no-op and exit successfully.

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, "..", "..", ".."); // monorepo root
const INDEX_FILE = path.join(ROOT, "data", "explorer-data", "index.json");
const SRC_PROJECTS_DIR = path.join(
  ROOT,
  "data",
  "explorer-data",
  "src",
  "projects"
);
const DEST_DIR = path.join(
  ROOT,
  "apps",
  "explorer",
  "public",
  "project-assets",
  "projects"
);

async function readIndex() {
  const raw = await fs.readFile(INDEX_FILE, "utf8");
  return JSON.parse(raw);
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function copyIfChanged(src, dest) {
  try {
    const [srcStat, destStat] = await Promise.all([
      fs.stat(src),
      fs.stat(dest).catch(() => null),
    ]);
    if (
      destStat &&
      destStat.mtimeMs === srcStat.mtimeMs &&
      destStat.size === srcStat.size
    ) {
      return false;
    }
    await fs.copyFile(src, dest);
    await fs.utimes(dest, srcStat.atime, srcStat.mtime);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  if (!existsSync(INDEX_FILE) || !existsSync(SRC_PROJECTS_DIR)) {
    // eslint-disable-next-line no-console
    console.log("Synced explorer assets: skipped (source data not available)");
    return;
  }

  const data = await readIndex();
  const projects = Array.isArray(data?.projects) ? data.projects : [];

  await ensureDir(DEST_DIR);

  let copied = 0;
  let missing = 0;

  for (const p of projects) {
    if (!p || typeof p !== "object") continue;
    const id = p.id;
    if (typeof id !== "string" || !id) continue;

    const logos = Array.isArray(p.logos) ? p.logos : [];
    const file = logos?.[0]?.file;
    if (typeof file !== "string" || !file) continue;

    const src = path.join(SRC_PROJECTS_DIR, id, file);
    if (!existsSync(src)) {
      missing++;
      continue;
    }

    const destProjectDir = path.join(DEST_DIR, id);
    await ensureDir(destProjectDir);
    const dest = path.join(destProjectDir, file);

    // eslint-disable-next-line no-await-in-loop
    const did = await copyIfChanged(src, dest);
    if (did) copied++;
  }

  // eslint-disable-next-line no-console
  console.log(`Synced explorer assets: copied=${copied}, missing=${missing}`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

