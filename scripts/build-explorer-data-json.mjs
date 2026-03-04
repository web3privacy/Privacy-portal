import fs from "node:fs/promises";
import path from "node:path";
import yaml from "js-yaml";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data", "explorer-data", "src");
const OUT_FILE = path.join(ROOT, "data", "explorer-data", "index.json");

async function readYaml(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return yaml.load(raw);
}

async function listProjectIndexFiles() {
  const projectsDir = path.join(DATA_DIR, "projects");
  const entries = await fs.readdir(projectsDir, { withFileTypes: true });
  const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);
  dirs.sort((a, b) => a.localeCompare(b));
  return dirs.map((dir) => path.join(projectsDir, dir, "index.yaml"));
}

async function main() {
  const categories = await readYaml(path.join(DATA_DIR, "categories.yaml"));
  const ecosystems = await readYaml(path.join(DATA_DIR, "ecosystems.yaml"));
  const usecases = await readYaml(path.join(DATA_DIR, "usecases.yaml"));
  const ranks = await readYaml(path.join(DATA_DIR, "ranks.yaml"));
  const assets = await readYaml(path.join(DATA_DIR, "assets.yaml"));
  const features = await readYaml(path.join(DATA_DIR, "features.yaml"));
  const phases = await readYaml(path.join(DATA_DIR, "phases.yaml"));
  const custodys = await readYaml(path.join(DATA_DIR, "custodys.yaml"));
  const requirements = await readYaml(path.join(DATA_DIR, "requirements.yaml"));

  const projectFiles = await listProjectIndexFiles();
  const projects = [];
  for (const file of projectFiles) {
    try {
      const doc = await readYaml(file);
      if (doc && typeof doc === "object") {
        projects.push(doc);
      }
    } catch {
      // ignore invalid project files for local dev
    }
  }

  const out = {
    projects,
    categories,
    ecosystems,
    usecases,
    ranks,
    assets,
    features,
    phases,
    custodys,
    requirements,
  };

  await fs.writeFile(OUT_FILE, JSON.stringify(out, null, 2) + "\n", "utf8");
  // eslint-disable-next-line no-console
  console.log(`Wrote ${OUT_FILE} (${projects.length} projects)`);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
