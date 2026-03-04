import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { getNewsUserIndex, saveNewsUserIndex } from "@/lib/news";

const ROOT_DIR = (() => {
  const cwd = process.cwd();
  if (cwd.endsWith("apps/web")) return path.resolve(cwd, "..", "..");
  if (fs.existsSync(path.join(cwd, "data", "news"))) return cwd;
  let current = cwd;
  for (let i = 0; i < 5; i++) {
    if (fs.existsSync(path.join(current, "data", "news"))) return current;
    current = path.resolve(current, "..");
  }
  return cwd;
})();

const NEWS_DIR = path.join(ROOT_DIR, "data", "news");
const CRAWLER_DIR = path.join(NEWS_DIR, "crawler");
const FEEDS_FILE = path.join(NEWS_DIR, "feeds.yaml");
const USER_INDEX_FILE = path.join(NEWS_DIR, "news-user.yaml");
const CANDIDATES_FILE = path.join(CRAWLER_DIR, "candidates.json");
const REJECTED_FILE = path.join(CRAWLER_DIR, "rejected.json");
const APPROVED_FILE = path.join(CRAWLER_DIR, "approved.json");
const ARTICLES_DIR = path.join(NEWS_DIR, "articles");
const CRAWLER_IMAGES_DIR = path.join(CRAWLER_DIR, "images");

export type FeedSourceType = "rss" | "url";

export interface FeedSource {
  id: string;
  type: FeedSourceType;
  url: string;
  enabled?: boolean;
}

export interface FeedCandidate {
  id: string;
  title: string;
  perex: string;
  link: string;
  imageUrl: string;
  author: string;
  date: string;
  sourceId: string;
  sourceType: FeedSourceType;
  content?: string;
  fetchedAt: string;
}

export interface CandidatesData {
  candidates: FeedCandidate[];
  lastCrawledAt?: string;
}

export interface RejectedData {
  ids: string[];
}

export interface ApprovedData {
  ids: string[];
}

function loadYaml<T>(filePath: string, fallback: T): T {
  if (!fs.existsSync(filePath)) return fallback;
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const parsed = yaml.load(content) as T | null;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function loadJson<T>(filePath: string, fallback: T): T {
  if (!fs.existsSync(filePath)) return fallback;
  try {
    const content = fs.readFileSync(filePath, "utf8");
    return JSON.parse(content) as T;
  } catch {
    return fallback;
  }
}

type FeedsFileSchema = { sources?: FeedSource[] };
type UserIndexSchema = { feedSources?: FeedSource[] };

export function getFeedSources(): FeedSource[] {
  const list = getFeedSourcesAll();
  return list.filter((s) => s.enabled !== false);
}

/** All sources (including disabled) for admin UI */
export function getFeedSourcesAll(): FeedSource[] {
  const feeds = loadYaml<FeedsFileSchema>(FEEDS_FILE, {});
  const userIndex = loadYaml<UserIndexSchema>(USER_INDEX_FILE, {});
  return userIndex.feedSources ?? feeds.sources ?? [];
}

export function saveFeedSources(sources: FeedSource[]): void {
  const userIndex = getNewsUserIndex() as Record<string, unknown>;
  userIndex.feedSources = sources;
  saveNewsUserIndex(userIndex);
}

export function getCandidates(): FeedCandidate[] {
  const data = loadJson<CandidatesData>(CANDIDATES_FILE, { candidates: [] });
  const rejected = loadJson<RejectedData>(REJECTED_FILE, { ids: [] });
  const rejectedSet = new Set(rejected.ids);
  return data.candidates.filter((c) => !rejectedSet.has(c.id));
}

export function getCandidatesData(): CandidatesData {
  return loadJson<CandidatesData>(CANDIDATES_FILE, { candidates: [] });
}

export function saveCandidatesData(data: CandidatesData): void {
  fs.mkdirSync(path.dirname(CANDIDATES_FILE), { recursive: true });
  fs.writeFileSync(CANDIDATES_FILE, JSON.stringify(data, null, 2), "utf8");
}

export function rejectCandidate(id: string): void {
  const data = loadJson<RejectedData>(REJECTED_FILE, { ids: [] });
  if (!data.ids.includes(id)) {
    data.ids.push(id);
    fs.mkdirSync(path.dirname(REJECTED_FILE), { recursive: true });
    fs.writeFileSync(REJECTED_FILE, JSON.stringify({ ids: data.ids }, null, 2), "utf8");
  }
}

export function removeCandidate(id: string): void {
  const data = loadJson<CandidatesData>(CANDIDATES_FILE, { candidates: [] });
  data.candidates = data.candidates.filter((c) => c.id !== id);
  fs.mkdirSync(path.dirname(CANDIDATES_FILE), { recursive: true });
  fs.writeFileSync(CANDIDATES_FILE, JSON.stringify(data, null, 2), "utf8");
}

export function getApprovedIds(): string[] {
  const data = loadJson<ApprovedData>(APPROVED_FILE, { ids: [] });
  return data.ids ?? [];
}

export function addApprovedId(id: string): void {
  const data = loadJson<ApprovedData>(APPROVED_FILE, { ids: [] });
  if (!data.ids.includes(id)) {
    data.ids.push(id);
    fs.mkdirSync(path.dirname(APPROVED_FILE), { recursive: true });
    fs.writeFileSync(APPROVED_FILE, JSON.stringify({ ids: data.ids }, null, 2), "utf8");
  }
}

export function getCrawlerImagesDir(): string {
  return CRAWLER_IMAGES_DIR;
}

export function getArticlesDir(): string {
  return ARTICLES_DIR;
}

/** Create a simple hash from string (for deterministic IDs) */
function hashString(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    h = (h << 5) - h + c;
    h = h & h;
  }
  return Math.abs(h).toString(36).slice(0, 8);
}

/** Approve candidate and create article .md file. Returns new article id or null. */
export function approveCandidateToArticle(candidate: FeedCandidate): string | null {
  const date = candidate.date ? new Date(candidate.date) : new Date();
  const dateStr = date.toISOString().slice(0, 10);
  const shortHash = hashString(candidate.link);
  const id = `crawler-${dateStr}-${shortHash}`;

  const frontmatter = [
    "---",
    `id: ${id}`,
    `title: "${(candidate.title || "Untitled").replace(/"/g, '\\"')}"`,
    `perex: "${(candidate.perex || "").slice(0, 300).replace(/"/g, '\\"')}"`,
    `imageUrl: "${candidate.imageUrl || ""}"`,
    `link: "${candidate.link.replace(/"/g, '\\"')}"`,
    `date: "${dateStr}"`,
    `author: "${(candidate.author || "Unknown").replace(/"/g, '\\"')}"`,
    `tags: []`,
    "isHighlighted: false",
    "type: article",
    "source: rss",
    "hasDetail: false",
    "published: true",
    "---",
    "",
    candidate.content || "",
  ].join("\n");

  const outPath = path.join(ARTICLES_DIR, `${id}.md`);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, frontmatter.trim() + "\n", "utf8");
  return id;
}
