import fs from "node:fs";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

type Cache = {
  mtimeMs: number;
  data: unknown;
};

declare global {
  var __w3pExplorerDataCache: Cache | undefined;
}

const ROOT_DIR = (() => {
  const cwd = process.cwd();
  if (cwd.endsWith("apps/web")) return path.resolve(cwd, "..", "..");
  if (cwd.endsWith("apps/explorer")) return path.resolve(cwd, "..", "..");
  let current = cwd;
  for (let i = 0; i < 5; i++) {
    if (fs.existsSync(path.join(current, "data", "explorer-data", "index.json"))) return current;
    current = path.resolve(current, "..");
  }
  return cwd;
})();

const FILE_PATH = path.join(ROOT_DIR, "data", "explorer-data", "index.json");

export async function loadExplorerDataFromDisk(): Promise<unknown> {
  const st = await stat(FILE_PATH);
  const cached = globalThis.__w3pExplorerDataCache;
  if (cached && cached.mtimeMs === st.mtimeMs) return cached.data;

  const raw = await readFile(FILE_PATH, "utf8");
  const data = JSON.parse(raw) as unknown;
  globalThis.__w3pExplorerDataCache = { mtimeMs: st.mtimeMs, data };
  return data;
}
