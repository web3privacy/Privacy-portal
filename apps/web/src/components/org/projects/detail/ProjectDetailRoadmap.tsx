"use client";

import { ACCENT } from "./ProjectDetailLayout";

const sectionStyle: React.CSSProperties = {
  borderTop: "1px solid rgba(255,255,255,0.1)",
  padding: "40px 0 56px",
  boxSizing: "border-box",
};

type RoadmapItem = {
  phase?: string;
  quarter?: string;
  title?: string;
  description?: string;
  release?: string;
  items?: string[];
  readMoreHref?: string;
};

export function ProjectDetailRoadmap({
  roadmap: roadmapItems,
  roadmapPagination,
}: {
  roadmap: RoadmapItem[] | undefined;
  roadmapPagination?: { current?: number; total?: number };
}) {
  if (!roadmapItems?.length) return null;

  return (
    <section style={sectionStyle} role="region" aria-label="Roadmap">
      <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.05em", color: ACCENT, margin: 0, textTransform: "uppercase" }}>ROADMAP</h2>
      <ul className="project-detail-roadmap-list" style={{ marginTop: 32, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 24 }}>
        {roadmapItems.map((item, i) => (
          <li key={i} style={{ display: "flex", gap: 16 }}>
            <span className="project-detail-roadmap-bullet" style={{ marginTop: 6, width: 12, height: 12, borderRadius: "50%", backgroundColor: ACCENT, flexShrink: 0 }} />
            <div>
              {(item.phase || item.quarter) && (
                <span style={{ fontWeight: 600, color: ACCENT }}>
                  {item.phase ?? item.quarter}{item.title ? ` – ${item.title}` : ""}
                </span>
              )}
              {item.description && <p style={{ marginTop: 4, color: "rgba(255,255,255,0.8)", fontSize: 15 }}>{item.description}</p>}
              {item.release && <p style={{ marginTop: 4, fontSize: 14, color: "rgba(255,255,255,0.7)" }}>{item.release}</p>}
              {item.items?.length ? (
                <ul style={{ marginTop: 8, paddingLeft: 20, fontSize: 14, color: "rgba(255,255,255,0.7)" }}>
                  {item.items.map((bullet, j) => (
                    <li key={j}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
              {item.readMoreHref && (
                <a href={item.readMoreHref} target="_blank" rel="noreferrer" style={{ marginTop: 8, display: "inline-block", fontSize: 14, fontWeight: 500, color: ACCENT }}>READ MORE</a>
              )}
            </div>
          </li>
        ))}
      </ul>
      {roadmapPagination && roadmapPagination.total && roadmapPagination.total > 1 && (
        <p style={{ marginTop: 24, fontSize: 14, color: "rgba(255,255,255,0.6)" }}>
          {roadmapPagination.current} of {roadmapPagination.total}
        </p>
      )}
    </section>
  );
}
