"use client";

import { ACCENT, orgAsset } from "./ProjectDetailLayout";

const sectionStyle: React.CSSProperties = {
  borderTop: "1px solid rgba(255,255,255,0.1)",
  padding: "32px 0",
  boxSizing: "border-box",
};

type Hero = {
  logo?: string;
  graphic?: string;
  title?: string;
  tagline?: string;
  ctaLabel?: string;
  ctaHref?: string;
  metrics?: Array<{ value?: string; label?: string; sublabel?: string }>;
  pagination?: string[];
};

export function ProjectDetailHero({ hero }: { hero: Hero | undefined }) {
  if (!hero) return null;
  const metrics = hero.metrics ?? [];
  const metricsDesktop = metrics.slice(0, 4);
  const metricsMobile = metrics.slice(0, 2);
  const hasPagination = Array.isArray(hero.pagination) && hero.pagination.length > 0;
  const graphicSrc = orgAsset(hero.graphic || hero.logo);

  return (
    <header style={{ ...sectionStyle, paddingTop: 48, paddingBottom: 64 }}>
      <div className="project-detail-hero-inner">
        {graphicSrc && (
          <div className="project-detail-hero-graphic">
            <img
              src={graphicSrc}
              alt=""
              style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "contain" }}
            />
          </div>
        )}
        <div className="project-detail-hero-content">
          <h1
            style={{
              fontFamily: "Domine, serif",
              fontSize: "clamp(24px, 4vw, 48px)",
              fontWeight: 700,
              margin: 0,
              color: "#fff",
            }}
          >
            {hero.title}
          </h1>
          <p
            style={{
              marginTop: 8,
              maxWidth: 672,
              fontSize: 16,
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.9)",
            }}
          >
            {hero.tagline}
          </p>
          {hero.ctaHref && hero.ctaLabel && (
            <a
              href={hero.ctaHref}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-block",
                marginTop: 24,
                padding: "12px 24px",
                borderRadius: 8,
                backgroundColor: ACCENT,
                color: "#000",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              {hero.ctaLabel}
            </a>
          )}
          {metrics.length > 0 && (
            <>
              <div
                className="project-detail-metrics project-detail-metrics-mobile-only"
                style={{ marginTop: 32 }}
              >
                {metricsMobile.map((m, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <span style={{ display: "block", fontSize: 24, fontWeight: 700, color: ACCENT }}>
                      {m.value}
                    </span>
                    <span style={{ display: "block", fontSize: 14, color: "rgba(255,255,255,0.8)" }}>
                      {m.label}
                    </span>
                    {m.sublabel && (
                      <span style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                        {m.sublabel}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div
                className="project-detail-metrics project-detail-metrics-desktop-only"
                style={{ marginTop: 32 }}
              >
                {metricsDesktop.map((m, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <span style={{ display: "block", fontSize: 24, fontWeight: 700, color: ACCENT }}>
                      {m.value}
                    </span>
                    <span style={{ display: "block", fontSize: 14, color: "rgba(255,255,255,0.8)" }}>
                      {m.label}
                    </span>
                    {m.sublabel && (
                      <span style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                        {m.sublabel}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              {hasPagination && (
                <div style={{ marginTop: 24, display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                  {hero.pagination!.map((p, i) => (
                    <span key={i} style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>{p}</span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
