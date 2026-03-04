"use client";

import { getOrgDefaultContent } from "@/lib/org/default-content";
import {
  getProjectsByCategory,
  getCategoryOrder,
  getCategoryLabel,
} from "@/lib/org/w3pn-projects";
import { ProjectCard } from "./ProjectCard";

type Project = { id: string; name?: string; description?: string; icon?: string; category?: string; [k: string]: unknown };

function ProjectsOtherLinks() {
  const content = getOrgDefaultContent();
  const links = ((content?.projectsPage as Record<string, unknown>)?.otherLinks ?? []) as Array<{
    label: string;
    href: string;
  }>;
  if (links.length === 0) return null;
  const ACCENT = "#70ff88";

  return (
    <section style={{ marginTop: 48 }}>
      <h2
        style={{
          marginBottom: 16,
          fontFamily: "Archivo, sans-serif",
          fontSize: 22,
          fontWeight: 700,
          color: "#f2f4f6",
          textTransform: "uppercase",
        }}
      >
        OTHER
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {links.map((item) => {
          let displayUrl = item.href;
          try {
            displayUrl = new URL(item.href).hostname;
          } catch {
            // keep href
          }
          return (
            <div
              key={item.href}
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
                padding: "12px 0",
                borderBottom: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <span style={{ color: "#f2f4f6", fontSize: 14 }}>{item.label}</span>
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                style={{ color: ACCENT, fontSize: 14, fontWeight: 500 }}
              >
                {displayUrl}
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function ProjectsByCategory() {
  const byCategory = getProjectsByCategory();
  const categoryOrder = getCategoryOrder();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
      {categoryOrder.map((cat) => {
        const projects = (byCategory.get(cat) ?? []) as Project[];
        if (projects.length === 0) return null;

        const isInfrastructure = cat === "infrastructure";
        const isEducation = cat === "education";
        const isMedia = cat === "media";
        const isResearch = cat === "research";
        const isTools = cat === "tools";

        let gridStyle: React.CSSProperties = {
          display: "grid",
          gap: 24,
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        };
        if (isInfrastructure && projects.length >= 3) {
          gridStyle = {
            display: "grid",
            gap: 24,
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "auto auto",
          };
        } else if ((isEducation || isMedia) && projects.length >= 2) {
          gridStyle = {
            display: "grid",
            gap: 24,
            gridTemplateColumns: "repeat(3, 1fr)",
          };
        } else if (isTools && projects.length >= 2) {
          gridStyle = {
            display: "grid",
            gap: 24,
            gridTemplateColumns: "repeat(2, 1fr)",
          };
        }

        return (
          <section key={cat}>
            <h2
              style={{
                marginBottom: 20,
                fontFamily: "Archivo, sans-serif",
                fontSize: 22,
                fontWeight: 700,
                color: "#f2f4f6",
                textTransform: "uppercase",
                letterSpacing: "0.02em",
              }}
            >
              {getCategoryLabel(cat)}
            </h2>
            <div style={gridStyle}>
              {isInfrastructure && projects.length >= 3 ? (
                <>
                  <ProjectCard project={projects[0]} />
                  <ProjectCard project={projects[1]} />
                  <div style={{ gridColumn: "1 / -1" }}>
                    <ProjectCard project={projects[2]} />
                  </div>
                  {projects.slice(3).map((p) => (
                    <ProjectCard key={p.id} project={p} />
                  ))}
                </>
              ) : (
                projects.map((p) => <ProjectCard key={p.id} project={p} />)
              )}
            </div>
          </section>
        );
      })}
      <ProjectsOtherLinks />
    </div>
  );
}
