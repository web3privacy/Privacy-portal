/**
 * Stáhne obrázky událostí z webu (og:image z links.web nebo links.rsvp)
 * a uloží je do apps/web/public/events/{eventId}.jpg (nebo .png).
 *
 * Použití: z adresáře apps/web spusťte:
 *   node scripts/download-event-images.mjs
 *
 * Vyžaduje: js-yaml (v apps/web), node bez dalších závislostí pro fetch.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const yaml = require("js-yaml");

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(SCRIPT_DIR, "..");
const EVENTS_YAML = path.join(APP_ROOT, "data", "events", "index.yaml");
const OUT_DIR = path.join(APP_ROOT, "public", "events");

function extractOgImage(html) {
  if (!html || typeof html !== "string") return null;
  // <meta property="og:image" content="https://..." />
  const m1 = html.match(/property=["']og:image["']\s+content=["']([^"']+)["']/i);
  if (m1) return m1[1].trim();
  const m2 = html.match(/content=["']([^"']+)["']\s+property=["']og:image["']/i);
  if (m2) return m2[1].trim();
  return null;
}

function resolveUrl(base, href) {
  if (href.startsWith("http")) return href;
  try {
    return new URL(href, base).href;
  } catch {
    return null;
  }
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    redirect: "follow",
    headers: { "User-Agent": "Mozilla/5.0 (compatible; EventImageBot/1.0)" },
  });
  if (!res.ok) return null;
  return res.text();
}

async function downloadImage(imageUrl, destPath) {
  const res = await fetch(imageUrl, {
    redirect: "follow",
    headers: { "User-Agent": "Mozilla/5.0 (compatible; EventImageBot/1.0)" },
  });
  if (!res.ok) return false;
  const buf = Buffer.from(await res.arrayBuffer());
  // Ukládáme vždy jako .jpg, aby aplikace mohla načítat /events/{id}.jpg
  const finalPath = destPath.endsWith(".jpg") ? destPath : destPath + ".jpg";
  await fs.writeFile(finalPath, buf);
  return true;
}

async function main() {
  const yamlRaw = await fs.readFile(EVENTS_YAML, "utf8");
  const events = yaml.load(yamlRaw);
  if (!Array.isArray(events)) {
    console.error("index.yaml neobsahuje pole událostí.");
    process.exit(1);
  }

  await fs.mkdir(OUT_DIR, { recursive: true });

  let done = 0;
  let skipped = 0;
  let failed = 0;

  for (const event of events) {
    const id = event.id;
    if (!id) continue;

    const pageUrl = event.links?.web || event.links?.rsvp;

    // 1) Pokud má event design.image (short name), zajistit soubor v public/events
    const designName = event.design?.image;
    if (designName && !designName.startsWith("http") && !designName.startsWith("/")) {
      const designPath = path.join(OUT_DIR, designName + ".jpg");
      let designExists = false;
      try {
        await fs.access(designPath);
        designExists = true;
      } catch {
        try {
          await fs.access(path.join(OUT_DIR, designName));
          designExists = true;
        } catch {
          // continue
        }
      }
      if (!designExists && pageUrl) {
        try {
          const html = await fetchHtml(pageUrl);
          const og = extractOgImage(html);
          const imageUrl = og ? resolveUrl(pageUrl, og) : null;
          if (imageUrl) {
            const ok = await downloadImage(imageUrl, path.join(OUT_DIR, designName));
            if (ok) {
              console.log(`[ok] ${designName}.jpg – staženo (pro ${id})`);
              done++;
            }
          }
        } catch (e) {
          // ignore
        }
      }
    }

    if (!pageUrl) {
      console.log(`[skip] ${id} – nemá links.web ani links.rsvp`);
      skipped++;
      continue;
    }

    const existing = [path.join(OUT_DIR, `${id}.jpg`), path.join(OUT_DIR, `${id}.png`)];
    let exists = false;
    for (const p of existing) {
      try {
        await fs.access(p);
        exists = true;
        break;
      } catch {
        // continue
      }
    }
    if (exists) {
      console.log(`[ok] ${id} – soubor již existuje`);
      done++;
      continue;
    }

    let html = null;
    try {
      html = await fetchHtml(pageUrl);
    } catch (e) {
      console.warn(`[fail] ${id} – nelze načíst stránku: ${e.message}`);
      failed++;
      continue;
    }

    let imageUrl = extractOgImage(html);
    if (!imageUrl) {
      console.log(`[skip] ${id} – na stránce není og:image`);
      skipped++;
      continue;
    }

    imageUrl = resolveUrl(pageUrl, imageUrl);
    if (!imageUrl) {
      console.warn(`[fail] ${id} – neplatná URL obrázku`);
      failed++;
      continue;
    }

    const destPath = path.join(OUT_DIR, id);
    try {
      const ok = await downloadImage(imageUrl, destPath);
      if (ok) {
        console.log(`[ok] ${id} – staženo`);
        done++;
      } else {
        console.warn(`[fail] ${id} – nepodařilo se stáhnout obrázek`);
        failed++;
      }
    } catch (e) {
      console.warn(`[fail] ${id} – ${e.message}`);
      failed++;
    }
  }

  console.log("\nHotovo: %d staženo, %d přeskočeno, %d chyb.", done, skipped, failed);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
