/**
 * One-time export: W3PN projects YAML → JSON for w3pn-org-web.
 * Source of truth for projects is now w3pn-org-web (src/data/w3pn-projects/*.json).
 * This script is kept for reference; re-run only if you restore YAML in apps/web/data/w3pn-projects.
 */
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const DATA_DIR = path.join(__dirname, '..', 'data', 'w3pn-projects');
const OUT_DIR = path.join(__dirname, '..', '..', '..', 'w3pn-org-web', 'src', 'data', 'w3pn-projects');

const projectsPath = path.join(DATA_DIR, 'projects.yaml');
const detailsDir = path.join(DATA_DIR, 'details');

const projectsRaw = fs.readFileSync(projectsPath, 'utf-8');
const projectsData = yaml.load(projectsRaw);
const projects = (projectsData?.projects ?? []).sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

const detailFiles = fs.readdirSync(detailsDir).filter((f) => f.endsWith('.yaml'));
const details = {};
for (const file of detailFiles) {
  const id = path.basename(file, '.yaml');
  const raw = fs.readFileSync(path.join(detailsDir, file), 'utf-8');
  details[id] = yaml.load(raw);
}

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, 'projects.json'), JSON.stringify(projects, null, 2), 'utf-8');
fs.writeFileSync(path.join(OUT_DIR, 'details.json'), JSON.stringify(details, null, 2), 'utf-8');
console.log('Exported', projects.length, 'projects and', Object.keys(details).length, 'details to', OUT_DIR);
