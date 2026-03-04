"use client";

import { getOrgDefaultContent } from "@/lib/org/default-content";

const ACCENT = "#70ff88";

export function ProjectsHero() {
  const content = getOrgDefaultContent();
  const hero = (content?.projectsPage as Record<string, unknown>)?.hero as Record<string, string> | undefined;
  const fallback = {
    title: "We are building privacy data, social and education essentials for community",
    description:
      "Web3Privacy Now is a community of people dedicated to building privacy, data, social, and education essentials for web3 and decentralization.",
    ctaLabel: "JOIN US TODAY",
    ctaHref: "https://t.me/web3privacy",
  };
  const h = hero ?? fallback;

  return (
    <section
      className="projects-hero"
      style={{
        paddingTop: 80,
        paddingBottom: 64,
        textAlign: "center",
        maxWidth: 800,
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <h1
        style={{
          fontFamily: "Archivo, sans-serif",
          fontSize: "clamp(28px, 4vw, 42px)",
          fontWeight: 700,
          lineHeight: 1.2,
          margin: 0,
          color: "#fff",
        }}
      >
        {h.title ?? fallback.title}
      </h1>
      <p style={{ marginTop: 24, fontSize: 16, lineHeight: 1.6, color: "#a7b0bd" }}>
        {h.description ?? fallback.description}
      </p>
      <a
        href={h.ctaHref ?? fallback.ctaHref}
        target="_blank"
        rel="noreferrer"
        style={{
          display: "inline-block",
          marginTop: 32,
          padding: "14px 32px",
          background: ACCENT,
          color: "#172118",
          fontWeight: 700,
          fontSize: 14,
          letterSpacing: "0.05em",
          textDecoration: "none",
          borderRadius: 6,
        }}
      >
        {h.ctaLabel ?? fallback.ctaLabel}
      </a>
    </section>
  );
}
