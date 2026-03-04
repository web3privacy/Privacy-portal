/**
 * Fetches latest docs content and assets from web3privacy/docs and saves to org web's data/docs.
 * Run from repo root: node scripts/fetch-docs-from-github.mjs
 *
 * Output: apps/web/public/org/data/docs/ (content + assets, served at /org/data/docs)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
/** Output for Next.js portal (org under /org) */
const DOCS_OUT = path.join(REPO_ROOT, 'apps', 'web', 'public', 'org', 'data', 'docs');
const BASE_URL = 'https://raw.githubusercontent.com/web3privacy/docs/main/src/content/docs';
const GITHUB_API_TREE = 'https://api.github.com/repos/web3privacy/docs/git/trees/main?recursive=1';
const ASSETS_PREFIX = 'src/content/docs/assets/';

const CONTENT_FILES = [
  'index.mdx',
  'about-us/Culture.md',
  'about-us/brand.md',
  'about-us/contact-us.md',
  'about-us/follow-us.md',
  'about-us/history.md',
  'about-us/manifesto.md',
  'about-us/roadmap.md',
  'contributors/add-entry-to-docs.md',
  'contributors/add-event-to-website.md',
  'contributors/add-speaker-to-data.md',
  'contributors/deploy-event-website.md',
  'contributors/gen-img-front-end.md',
  'contributors/git.md',
  'contributors/index.md',
  'contributors/workgroups.md',
  'events/cfp.md',
  'events/formats.md',
  'events/index.mdx',
  'events/production.md',
  'events/recording.md',
  'events/seasons.md',
  'events/types.md',
  'get-involved/code-of-conduct.md',
  'get-involved/donate.md',
  'get-involved/index.md',
  'get-involved/org-benefits.md',
  'get-involved/partnership.md',
  'get-involved/personal-benefits.md',
  'governance/communication.md',
  'governance/core-contributors.md',
  'governance/core-team.md',
  'governance/governance.mdx',
  'governance/treasury.md',
  'news/week-in-the-privacy.md',
  'projects/privacy-academy.md',
  'projects/privacy-cases.md',
  'projects/privacy-explorer.md',
  'projects/privacy-idea-generator.md',
  'projects/privacy-tech-awards.md',
  'projects/web3-privacy-now-news.md',
  'projects/women-in-privacy.md',
  'research/annual-report.md',
  'research/ethereum-privacy-ecosystem.md',
  'research/grants.md',
  'research/hackathon-pack.md',
  'research/hiring.md',
  'research/index.md',
  'research/pagency.md',
  'research/personal-stack.md',
  'research/privacy-guides.md',
  'research/privacy-proof24.md',
  'research/privacy-services-db.md',
  'research/usecase-db.md',
  'research/zk-solutions.md',
  'research/Privacy-use-cases-UA-RU-war.md',
  'research/research-understanding-ethereum-users.md',
  'research/scoring-model.md',
  'resources/design.md',
  'resources/developers.mdx',
  'resources/funding.md',
  'resources/it-infrastructure.md',
  'resources/legal-assistance.md',
  'resources/outreach.md',
  'resources/partners.md',
  'resources/training-education.mdx',
];

/** Slug for URL: path without extension, lowercase */
function pathToSlug(filePath) {
  const withoutExt = filePath.replace(/\.(mdx?|md)$/i, '');
  return withoutExt.split('/').map(s => s.toLowerCase()).join('/');
}

const FETCH_HEADERS = { 'User-Agent': 'Web3Privacy-Portal-Fetch' };

async function fetchText(url) {
  const res = await fetch(url, { headers: FETCH_HEADERS });
  if (!res.ok) throw new Error(`${url} ${res.status}`);
  return res.text();
}

async function fetchBinary(url) {
  const res = await fetch(url, { headers: FETCH_HEADERS });
  if (!res.ok) throw new Error(`${url} ${res.status}`);
  return res.arrayBuffer();
}

/** Get list of asset file paths from GitHub tree */
async function getAssetsList() {
  const res = await fetch(GITHUB_API_TREE, { headers: FETCH_HEADERS });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  const data = await res.json();
  return (data.tree || [])
    .filter((e) => e.path.startsWith(ASSETS_PREFIX) && e.type === 'blob')
    .map((e) => e.path.slice(ASSETS_PREFIX.length));
}

async function main() {
  console.log('Fetching docs from web3privacy/docs main...');
  fs.mkdirSync(DOCS_OUT, { recursive: true });

  const manifest = { fetchedAt: new Date().toISOString(), baseUrl: BASE_URL, files: {} };

  for (const rel of CONTENT_FILES) {
    const url = `${BASE_URL}/${rel}`;
    const outPath = path.join(DOCS_OUT, rel);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    try {
      const text = await fetchText(url);
      fs.writeFileSync(outPath, text, 'utf8');
      const slug = pathToSlug(rel);
      manifest.files[slug] = rel;
      console.log('  ', rel);
    } catch (e) {
      console.warn('  FAIL', rel, e.message);
    }
  }

  fs.writeFileSync(
    path.join(DOCS_OUT, 'manifest.json'),
    JSON.stringify(manifest, null, 2),
    'utf8'
  );

  console.log('Fetching docs assets (images) from GitHub...');
  const assetsDir = path.join(DOCS_OUT, 'assets');
  fs.mkdirSync(assetsDir, { recursive: true });
  let assetList = [];
  try {
    assetList = await getAssetsList();
  } catch (e) {
    console.warn('  Could not list assets:', e.message);
  }
  for (const rel of assetList) {
    const url = `${BASE_URL}/assets/${rel}`;
    const outPath = path.join(assetsDir, rel);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    try {
      const buf = await fetchBinary(url);
      fs.writeFileSync(outPath, Buffer.from(buf));
      console.log('  assets/', rel);
    } catch (e) {
      console.warn('  FAIL assets/', rel, e.message);
    }
  }

  console.log('Done:', DOCS_OUT, '(content + assets)');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
