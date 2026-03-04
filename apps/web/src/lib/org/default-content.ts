/**
 * Org default content with /org base path for internal links and assets.
 * Data from data/org/defaultContent.json; paths are rewritten at runtime.
 */

import defaultContentJson from "@/data/org/defaultContent.json";

const ORG_BASE = "/org";

type Content = Record<string, unknown>;

function isInternalPath(s: string): boolean {
  if (typeof s !== "string" || s.startsWith("http") || s.startsWith("//") || s.startsWith("#")) return false;
  return s.startsWith("/");
}

function rewritePath(s: string): string {
  if (!isInternalPath(s)) return s;
  if (s.startsWith(ORG_BASE)) return s;
  return ORG_BASE + (s === "/" ? "" : s);
}

function rewriteContent(obj: unknown): unknown {
  if (obj === null || typeof obj !== "object") {
    if (typeof obj === "string" && isInternalPath(obj)) return rewritePath(obj);
    return obj;
  }
  if (Array.isArray(obj)) return obj.map(rewriteContent);
  const out: Content = {};
  for (const [k, v] of Object.entries(obj as Content)) {
    if (typeof v === "string" && (k === "href" || k === "ctaLink" || k === "linkHref" || k === "ctaHref" || k === "downloadUrl" || k === "thumbnailUrl" || k === "image" || k === "logo" || k === "backgroundImage" || k === "headerLogo" || k === "videoThumbnail" || k === "sectionImage" || k === "imageUrl" || k === "mediaUrl" || k === "logoUrl" || k === "eyeImage" || k === "roundLogoImage" || k === "marqueeImage" || k === "diagramImage" || k.endsWith("Url") || k.endsWith("Image") || k === "backgroundImageUrl")) {
      out[k] = isInternalPath(v) ? rewritePath(v) : v;
    } else {
      out[k] = rewriteContent(v);
    }
  }
  return out;
}

const raw = defaultContentJson as { defaultContent: Content; sectionOrder: string[] };

export const sectionOrder = raw.sectionOrder;

export function getOrgDefaultContent(): Content {
  return rewriteContent(raw.defaultContent) as Content;
}
