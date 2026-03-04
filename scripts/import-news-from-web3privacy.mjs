#!/usr/bin/env node
/**
 * Import newsletters from web3privacy/news repo into data/news/articles
 * Usage: node scripts/import-news-from-web3privacy.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const NEWS_DIR = path.join(ROOT, "data", "news");
const ARTICLES_DIR = path.join(NEWS_DIR, "articles");
const BASE_URL = "https://raw.githubusercontent.com/web3privacy/news/main";

const YEARS = ["2024", "2025", "2026"];
const WEEKS = Array.from({ length: 53 }, (_, i) => String(i + 1).padStart(2, "0"));

function extractImageUrl(text) {
  const imgMatch = text.match(/!\[.*?\]\((https?:\/\/[^)\s]+)\)/);
  if (imgMatch) return imgMatch[1].replace("?raw=true", "");
  const htmlMatch = text.match(/src="(https?:\/\/[^"]+)"/);
  if (htmlMatch) return htmlMatch[1];
  return "";
}

function extractPerex(text, maxLen = 200) {
  const afterHr = text.split(/\n---\n/);
  let block = afterHr[0] || text;
  block = block.replace(/!\[.*?\]\([^)]*\)/g, "").trim();
  const lines = block.split("\n").filter((l) => l.trim() && !l.startsWith("#"));
  let perex = lines.join(" ").replace(/\s+/g, " ").trim();
  if (perex.length > maxLen) perex = perex.slice(0, maxLen).trim() + "...";
  return perex;
}

function inferTags(text) {
  const tags = [];
  if (/###\s*Insights/i.test(text)) tags.push("insights");
  if (/###\s*Knowledge/i.test(text)) tags.push("knowledge");
  if (/###\s*Inspiration:?\s*Going\s*On\(Line\)/i.test(text)) tags.push("inspiration-online");
  if (/###\s*Inspiration:?\s*Going\s*Off\(Line\)/i.test(text)) tags.push("inspiration-offline");
  if (/###\s*(Tool|New tool)\s+of\s+the\s+week/i.test(text)) tags.push("tool-of-week");
  return tags;
}

function slugToId(year, week) {
  return `${year}-${week}`;
}

async function fetchMarkdown(year, week) {
  const url = `${BASE_URL}/data/${year}/week${week}.md`;
  const res = await fetch(url, { headers: { "User-Agent": "Privacy-Portal-Import/1.0" } });
  if (!res.ok) return null;
  return res.text();
}

async function main() {
  if (!fs.existsSync(ARTICLES_DIR)) fs.mkdirSync(ARTICLES_DIR, { recursive: true });

  let imported = 0;
  let skipped = 0;

  for (const year of YEARS) {
    for (const week of WEEKS) {
      const md = await fetchMarkdown(year, week);
      if (!md) {
        skipped++;
        continue;
      }

      const id = slugToId(year, week);
      const imgUrl = extractImageUrl(md);
      const perex = extractPerex(md);
      const tags = inferTags(md);

      const fmMatch = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      let curator = "";
      let exactDate = "";
      let linkParagraph = "";

      if (fmMatch) {
        const fm = fmMatch[1];
        const curatorM = fm.match(/curator:\s*(.+)/);
        const dateM = fm.match(/exactDate:\s*(.+)/);
        const linksM = fm.match(/paragraph:\s*(\S+)/);
        curator = curatorM ? curatorM[1].trim() : "";
        exactDate = dateM ? dateM[1].trim() : "";
        linkParagraph = linksM ? linksM[1].trim() : "";
      }

      const date = exactDate || `${year}-01-01`;
      const link = linkParagraph || `https://news.web3privacy.info/${id}`;
      const imageUrl = imgUrl || `https://raw.githubusercontent.com/web3privacy/news/main/web/public/img/${id}.png`;

      const title = perex.slice(0, 60) || `Week in the Privacy News ${id}`;

      const contentMatch = md.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n([\s\S]*)$/);
      const body = contentMatch ? contentMatch[1] : md;

      const frontmatter = [
        "---",
        `id: ${id}`,
        `title: "${title.replace(/"/g, '\\"')}"`,
        `perex: "${perex.replace(/"/g, '\\"').slice(0, 200)}"`,
        `imageUrl: "${imageUrl}"`,
        `link: "${link}"`,
        `date: "${date}"`,
        `author: "${curator || "web3privacy"}"`,
        `tags: [${tags.map((t) => `"${t}"`).join(", ")}]`,
        "isHighlighted: false",
        "type: article",
        "source: newsletter",
        "hasDetail: true",
        "---",
        "",
        body,
      ].join("\n");

      const outPath = path.join(ARTICLES_DIR, `${id}.md`);
      fs.writeFileSync(outPath, frontmatter, "utf8");
      imported++;
      console.log(`Imported ${id}`);
    }
  }

  console.log(`Done. Imported ${imported}, skipped ${skipped}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
