"use client";

import { useState, useEffect } from "react";
import DocsNav from "./DocsNav";
import DocContent from "./DocContent";
import OnThisPage from "./OnThisPage";

const BASE_PATH = "/org/docs";
const DATA_DOCS = "/org/data/docs";

type SidebarBlock = { label: string; link?: string; items?: { label: string; link: string }[] };

function getSlugFromParam(slugParam: string[] | undefined): string {
  if (!slugParam || slugParam.length === 0) return "";
  return slugParam.join("/").replace(/\/$/, "");
}

function resolveFilePath(
  slug: string,
  manifest: Record<string, unknown> | null
): string | null {
  if (!slug) return (manifest as { files?: { index?: string } })?.files?.index ?? "index.mdx";
  const normalized = slug.toLowerCase();
  const files = (manifest as { files?: Record<string, string> })?.files;
  if (files?.[normalized]) return files[normalized];
  if (slug.startsWith("portal-and-org-web")) return `${slug}.md`;
  return null;
}

export default function OrgDocsViewer({ slugParam }: { slugParam: string[] | undefined }) {
  const slug = getSlugFromParam(slugParam);
  const [sidebar, setSidebar] = useState<SidebarBlock[] | null>(null);
  const [manifest, setManifest] = useState<Record<string, unknown> | null>(null);
  const [rawMarkdown, setRawMarkdown] = useState("");
  const [filePath, setFilePath] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [headings, setHeadings] = useState<{ level: number; text: string; id: string }[]>([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setRawMarkdown("");
    setFilePath(null);
    setLastUpdated(null);

    (async () => {
      try {
        if (!sidebar) {
          const res = await fetch(`${DATA_DOCS}/sidebar.json`);
          if (!res.ok) throw new Error("Sidebar not found");
          const data = await res.json();
          if (!cancelled) setSidebar(data);
        }
      } catch (e) {
        if (!cancelled) setError((e as Error)?.message ?? "Failed to load");
        setLoading(false);
        return;
      }

      let manifestData = manifest;
      try {
        if (!manifestData) {
          const res = await fetch(`${DATA_DOCS}/manifest.json`);
          if (res.ok) {
            manifestData = await res.json();
            if (!cancelled) setManifest(manifestData);
          }
        }
      } catch {
        // ignore
      }

      const resolved = resolveFilePath(slug, manifestData);
      const pathToFetch = resolved || (slug ? `${slug}.md` : "index.mdx");
      const url = `${DATA_DOCS}/${pathToFetch}`;
      try {
        const res = await fetch(url);
        if (!res.ok) {
          if (!cancelled)
            setError(res.status === 404 ? "Page not found" : `Failed to load (${res.status})`);
          setLoading(false);
          return;
        }
        const text = await res.text();
        if (cancelled) return;
        setRawMarkdown(text);
        setFilePath(resolved || pathToFetch);
        const fmMatch = text.match(/^---\s*\n([\s\S]*?)\n---/);
        if (fmMatch) {
          const lastUpdatedMatch = fmMatch[1].match(/lastUpdated:\s*["']?([^"'\n]+)/);
          if (lastUpdatedMatch) setLastUpdated(lastUpdatedMatch[1].trim());
        }
      } catch (e) {
        if (!cancelled) setError((e as Error)?.message ?? "Failed to load");
      }
      if (!cancelled) setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [slug, sidebar, manifest]);

  if (error && !rawMarkdown) {
    return (
      <main className="landing-root docs-root" style={{ padding: "120px 24px", textAlign: "center" }}>
        <p>{error}</p>
        <a href={BASE_PATH} className="primary-btn" style={{ marginTop: 16 }}>Back to Docs</a>
      </main>
    );
  }

  if (loading && !rawMarkdown) {
    return (
      <main className="landing-root docs-root" style={{ padding: "120px 24px", textAlign: "center", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p>Loading…</p>
      </main>
    );
  }

  return (
    <main className="landing-root docs-root" id="top">
      <div className="page-content-wrap page-content-wrap--with-padding">
        <div className="docs-container">
          <aside className="docs-sidebar">
            <DocsNav sidebar={sidebar} basePath={BASE_PATH} currentSlug={slug} />
          </aside>
          <div className="docs-main">
            <DocContent
              slug={slug}
              filePath={filePath}
              rawMarkdown={rawMarkdown}
              lastUpdated={lastUpdated}
              onHeadings={setHeadings}
            />
          </div>
          <aside className="docs-aside">
            <OnThisPage headings={headings} />
          </aside>
        </div>
      </div>
    </main>
  );
}
