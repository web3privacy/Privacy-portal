#!/usr/bin/env node
/**
 * Crawl RSS feeds and URL sources, save candidates to data/news/crawler/candidates.json
 * Usage: node scripts/crawl-news-feeds.mjs
 * Run via: npm run crawl:news
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import Parser from "rss-parser";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const NEWS_DIR = path.join(ROOT, "data", "news");
const CRAWLER_DIR = path.join(NEWS_DIR, "crawler");
const FEEDS_FILE = path.join(NEWS_DIR, "feeds.yaml");
const USER_INDEX_FILE = path.join(NEWS_DIR, "news-user.yaml");
const CANDIDATES_FILE = path.join(CRAWLER_DIR, "candidates.json");
const REJECTED_FILE = path.join(CRAWLER_DIR, "rejected.json");
const IMAGES_DIR = path.join(CRAWLER_DIR, "images");

const USER_AGENT = "Privacy-Portal-Crawler/1.0 (+https://github.com/web3privacy/portal)";

function loadYaml(filePath, fallback = {}) {
  if (!fs.existsSync(filePath)) return fallback;
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const parsed = yaml.load(content);
    return parsed || fallback;
  } catch {
    return fallback;
  }
}

function loadJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    h = (h << 5) - h + c;
    h = h & h;
  }
  return Math.abs(h).toString(36).slice(0, 8);
}

function genId(link, sourceId, dateStr) {
  const d = dateStr || new Date().toISOString().slice(0, 10);
  const h = hashString(link);
  return `crawler-${d}-${sourceId}-${h}`;
}

function parseDate(s) {
  if (!s) return new Date().toISOString().slice(0, 10);
  const d = new Date(s);
  return isNaN(d.getTime()) ? new Date().toISOString().slice(0, 10) : d.toISOString().slice(0, 10);
}

function resolveUrl(url, base) {
  if (!url || url.startsWith("http://") || url.startsWith("https://")) return url || "";
  try {
    return new URL(url, base).href;
  } catch {
    return url || "";
  }
}

async function crawlRss(url, sourceId) {
  const parser = new Parser({
    headers: { "User-Agent": USER_AGENT },
    customFields: {
      item: [
        ["media:content", "media:content"],
        ["media:thumbnail", "media:thumbnail"],
      ],
    },
  });
  const feed = await parser.parseURL(url);
  const feedBase = feed.link || url;
  const items = [];
  for (const item of feed.items || []) {
    const link = item.link || item.guid;
    if (!link) continue;
    const itemBase = link || feedBase;
    const title = (item.title || "").trim() || "Untitled";
    const content = item.contentSnippet || item.content || item.summary || "";
    const perex = (content || title).replace(/\s+/g, " ").trim().slice(0, 300);
    const pubDate = item.pubDate || item.isoDate;
    const author = item.creator || item["dc:creator"] || feed.title || "";
    let imageUrl = item.enclosure?.url || "";
    if (!imageUrl && item["media:content"]) {
      const m = item["media:content"];
      const u = (m && m.$ && (m.$.url || m.$["media:url"])) || (typeof m === "string" ? m : null);
      if (u) imageUrl = u;
    }
    if (!imageUrl && item["media:thumbnail"]) {
      const m = item["media:thumbnail"];
      const u = (m && m.$ && m.$.url) || (typeof m === "string" ? m : null);
      if (u) imageUrl = u;
    }
    if (!imageUrl && item.content) {
      const imgMatch = item.content.match(/<img[^>]+src=["']([^"']+)["']/i);
      if (imgMatch) imageUrl = imgMatch[1];
    }
    if (!imageUrl && item.content) {
      const ogMatch = item.content.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
        || item.content.match(/content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
      if (ogMatch) imageUrl = ogMatch[1];
    }
    if (!imageUrl && feed.image?.url) imageUrl = feed.image.url;
    if (!imageUrl && feed.itunes?.image) imageUrl = feed.itunes.image;
    imageUrl = resolveUrl((imageUrl || "").trim(), itemBase);
    items.push({
      id: genId(link, sourceId, parseDate(pubDate)),
      title,
      perex,
      link,
      imageUrl,
      author: (author || "").trim() || "Unknown",
      date: parseDate(pubDate),
      sourceId,
      sourceType: "rss",
      content: content ? content.slice(0, 5000) : undefined,
      fetchedAt: new Date().toISOString(),
    });
  }
  return items;
}

async function scrapeUrl(pageUrl, sourceId) {
  const res = await fetch(pageUrl, {
    headers: { "User-Agent": USER_AGENT },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const dom = new JSDOM(html, { url: pageUrl });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();
  const title = article?.title || "Untitled";
  const text = article?.textContent || "";
  const perex = text.replace(/\s+/g, " ").trim().slice(0, 300);
  const ogImage = dom.window.document.querySelector('meta[property="og:image"]');
  const imageUrl = ogImage?.getAttribute("content") || "";
  const date = parseDate(article?.publishedTime);
  const author = article?.byline || "";
  return {
    id: genId(pageUrl, sourceId, date),
    title,
    perex,
    link: pageUrl,
    imageUrl: (imageUrl || "").trim(),
    author: (author || "").trim() || "Unknown",
    date,
    sourceId,
    sourceType: "url",
    content: text ? text.slice(0, 10000) : undefined,
    fetchedAt: new Date().toISOString(),
  };
}

function getFeedSources() {
  const feeds = loadYaml(FEEDS_FILE, { sources: [] });
  const user = loadYaml(USER_INDEX_FILE, {});
  const list = user.feedSources ?? feeds.sources ?? [];
  return list.filter((s) => s.enabled !== false);
}

async function main() {
  console.log("Crawling news feeds...");
  const sources = getFeedSources();
  if (sources.length === 0) {
    console.log("No feed sources configured in data/news/feeds.yaml or news-user.yaml");
    return;
  }

  const existing = loadJson(CANDIDATES_FILE, { candidates: [], lastCrawledAt: null });
  const rejected = loadJson(REJECTED_FILE, { ids: [] });
  const rejectedSet = new Set(rejected.ids || []);
  const seenLinks = new Set(
    existing.candidates.map((c) => c.link).concat(
      // Avoid re-adding links we already have as articles
      []
    )
  );

  const allCandidates = [...(existing.candidates || [])];
  let added = 0;

  for (const src of sources) {
    try {
      if (src.type === "rss") {
        const items = await crawlRss(src.url, src.id);
        for (const c of items) {
          if (rejectedSet.has(c.id)) continue;
          if (seenLinks.has(c.link)) continue;
          seenLinks.add(c.link);
          allCandidates.push(c);
          added++;
        }
        console.log(`RSS ${src.id}: +${items.length} items`);
      } else if (src.type === "url") {
        const c = await scrapeUrl(src.url, src.id);
        if (!rejectedSet.has(c.id) && !seenLinks.has(c.link)) {
          seenLinks.add(c.link);
          allCandidates.push(c);
          added++;
        }
        console.log(`URL ${src.id}: scraped`);
      }
    } catch (err) {
      console.error(`Error crawling ${src.id} (${src.type}):`, err.message);
    }
  }

  // Sort by date desc
  allCandidates.sort((a, b) => new Date(b.date) - new Date(a.date));

  fs.mkdirSync(path.dirname(CANDIDATES_FILE), { recursive: true });
  fs.writeFileSync(
    CANDIDATES_FILE,
    JSON.stringify(
      {
        candidates: allCandidates,
        lastCrawledAt: new Date().toISOString(),
      },
      null,
      2
    ),
    "utf8"
  );

  console.log(`Done. Total candidates: ${allCandidates.length}, added: ${added}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
