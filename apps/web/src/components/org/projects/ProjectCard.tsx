"use client";

import Link from "next/link";

const ACCENT = "#70ff88";

type Project = {
  id: string;
  name?: string;
  description?: string;
  icon?: string;
  links?: { url?: string; github?: string; docs?: string };
};

function getDisplayUrl(project: Project): string {
  if (project.links?.url) {
    try {
      return new URL(project.links.url).hostname;
    } catch {
      return project.links.url;
    }
  }
  if (project.links?.github) return project.links.github.replace("https://", "");
  if (project.links?.docs) return project.links.docs.replace("https://", "");
  return "";
}

function getPrimaryHref(project: Project): { href: string; external: boolean } {
  const url = project.links?.url ?? project.links?.docs ?? project.links?.github;
  if (url?.startsWith("http")) return { href: url, external: true };
  return { href: `/org/projects/${project.id}`, external: false };
}

/** Internal link to org project detail (always available). */
function getDetailHref(project: Project): string {
  return `/org/projects/${project.id}`;
}

export function ProjectCard({ project }: { project: Project }) {
  const displayUrl = getDisplayUrl(project);
  const { href: externalUrl, external } = getPrimaryHref(project);
  const detailHref = getDetailHref(project);
  const icon = project.icon ?? "/org/assets/projects/explorer-logo.svg";

  const content = (
    <article
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.2)",
        background: "#181d25",
        padding: 24,
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "";
      }}
    >
      <div style={{ width: 48, height: 48, marginBottom: 16, flexShrink: 0 }}>
        <img src={icon} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
      </div>
      <h3
        style={{
          fontFamily: "Archivo, sans-serif",
          fontSize: 16,
          fontWeight: 700,
          margin: 0,
          color: "#fff",
          textTransform: "uppercase",
          letterSpacing: "0.02em",
        }}
      >
        {String(project.name ?? project.id)}
      </h3>
      <p
        style={{
          margin: "12px 0 0",
          fontSize: 14,
          lineHeight: 1.5,
          color: "#a7b0bd",
          flex: 1,
          display: "-webkit-box",
          WebkitLineClamp: 4,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {project.description ?? ""}
      </p>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        <Link
          href={detailHref}
          style={{ fontSize: 14, color: ACCENT, fontWeight: 600, textDecoration: "none" }}
        >
          View project details →
        </Link>
        {external && (
          <a
            href={externalUrl}
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", textDecoration: "none" }}
            onClick={(e) => e.stopPropagation()}
          >
            {displayUrl || "Visit website"} ↗
          </a>
        )}
        {!external && displayUrl && (
          <span style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>{displayUrl}</span>
        )}
      </div>
    </article>
  );

  return (
    <Link href={detailHref} style={{ display: "block", height: "100%", textDecoration: "none", color: "inherit" }}>
      {content}
    </Link>
  );
}
