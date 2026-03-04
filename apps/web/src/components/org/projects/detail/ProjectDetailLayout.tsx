const ACCENT = "#70ff88";
const ORG_BASE = "/org";

/**
 * Resolve asset URLs for org project detail pages only.
 * Used exclusively by org components under components/org/projects/detail/.
 *
 * SEPARATION FROM EXPLORER:
 * - Explorer uses /project-assets/projects/{explorerId}/{file} (from
 *   public/project-assets/). Never use that path here.
 * - Org data (details.json) may contain paths like "/projects/foo.png"; these
 *   are an org-internal convention and are rewritten to /org/assets/projects/
 *   (public/org/assets/projects/), which is a different folder and dataset.
 */
export function orgAsset(src: string | undefined | null): string {
  if (!src || typeof src !== "string") return "";
  if (src.startsWith("http") || src.startsWith("//") || src.startsWith(ORG_BASE)) return src;
  // Org details.json convention: "/projects/<name>.png" → /org/assets/projects/<name>-logo.svg (org-only assets)
  const projectsMatch = src.match(/^\/projects\/(.+)\.(png|jpg|jpeg|webp)$/i);
  if (projectsMatch) {
    const name = projectsMatch[1];
    return `${ORG_BASE}/assets/projects/${name}-logo.svg`;
  }
  return ORG_BASE + (src.startsWith("/") ? src : `/${src}`);
}

export function ProjectDetailLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0e12",
        color: "#fff",
        colorScheme: "dark",
      }}
    >
      {children}
    </div>
  );
}

export { ACCENT, ORG_BASE };
