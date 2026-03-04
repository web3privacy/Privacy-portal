"use client";

import { ACCENT, ORG_BASE, orgAsset } from "./ProjectDetailLayout";

const LINK_LABELS: Record<string, string> = {
  url: "URL", website: "Website", docs: "Documentation", github: "GitHub",
  twitter: "Twitter", discord: "Discord", telegram: "Telegram",
};
const LINK_ICONS: Record<string, string> = {
  url: "icon-website", website: "icon-website", docs: "icon-docs", github: "icon-github",
  twitter: "icon-twitter", discord: "icon-discord", telegram: "icon-telegram",
};

const sectionStyle: React.CSSProperties = {
  borderTop: "1px solid rgba(255,255,255,0.1)",
  padding: "40px 0 56px",
  boxSizing: "border-box",
};

function LinkIcon({ name }: { name: string }) {
  const src = `${ORG_BASE}/assets/project-detail/${name}.svg`;
  return (
    <img
      src={src}
      alt=""
      style={{ width: 20, height: 20, flexShrink: 0 }}
      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
    />
  );
}

type Mission = { text?: string; readMoreHref?: string; highlights?: Array<{ src?: string; alt?: string; caption?: string }> };
type Links = Record<string, string>;

export function ProjectDetailMissionLinks({ mission, links }: { mission: Mission | undefined; links: Links | undefined }) {
  const linkEntries = Object.entries(links || {}).filter(([, v]) => v && String(v).startsWith("http"));
  const highlights = mission?.highlights ?? [];

  return (
    <section style={sectionStyle}>
      <div className="project-detail-mission-links">
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.05em", color: ACCENT, margin: 0, textTransform: "uppercase" }}>MISSION</h2>
          <p style={{ marginTop: 12, whiteSpace: "pre-line", fontSize: 15, color: "rgba(255,255,255,0.9)" }}>{mission?.text}</p>
          {mission?.readMoreHref && (
            <a href={mission.readMoreHref} target="_blank" rel="noreferrer" style={{ marginTop: 16, display: "inline-block", fontWeight: 500, color: ACCENT, fontSize: 14 }}>Read more</a>
          )}
          {highlights.length > 0 && (
            <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {highlights.slice(0, 3).map((h, i) => (
                <div key={i} style={{ borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", overflow: "hidden", background: "rgba(255,255,255,0.05)" }}>
                  {h.src && (
                    <div style={{ aspectRatio: "4/3", overflow: "hidden" }}>
                      <img src={orgAsset(h.src)} alt={h.alt ?? ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  )}
                  {h.caption && <p style={{ padding: 8, fontSize: 12, color: "rgba(255,255,255,0.8)", margin: 0 }}>{h.caption}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.05em", color: ACCENT, margin: 0, textTransform: "uppercase" }}>LINKS</h2>
          <ul style={{ marginTop: 16, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
            {linkEntries.map(([key, href]) => (
              <li key={key} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <LinkIcon name={LINK_ICONS[key] ?? "icon-website"} />
                <a href={href} target="_blank" rel="noreferrer" style={{ fontWeight: 500, color: ACCENT }}>{LINK_LABELS[key] ?? key}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
