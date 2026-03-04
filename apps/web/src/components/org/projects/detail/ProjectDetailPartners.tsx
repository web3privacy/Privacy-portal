"use client";

import { ACCENT, orgAsset } from "./ProjectDetailLayout";

const sectionStyle: React.CSSProperties = {
  borderTop: "1px solid rgba(255,255,255,0.1)",
  padding: "40px 0 56px",
  boxSizing: "border-box",
};

type Partner = { name?: string; logo?: string; href?: string; description?: string };

export function ProjectDetailPartners({ partners }: { partners: Partner[] | undefined }) {
  if (!partners?.length) return null;

  return (
    <section style={sectionStyle}>
      <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.05em", color: ACCENT, margin: 0, textTransform: "uppercase" }}>PARTNERS</h2>
      <div className="project-detail-partners-grid" style={{ marginTop: 24 }}>
        {partners.map((p, i) => (
          <a
            key={i}
            href={p.href ?? "#"}
            target={p.href ? "_blank" : undefined}
            rel="noreferrer"
            style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 16, borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", textAlign: "center", textDecoration: "none", color: "inherit" }}
          >
            <div style={{ width: 64, height: 64, overflow: "hidden", borderRadius: 8 }}>
              <img src={orgAsset(p.logo)} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", filter: "grayscale(1)" }} />
            </div>
            <p style={{ marginTop: 8, fontSize: 14, fontWeight: 500, color: "#fff" }}>{p.name}</p>
            {p.description && <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{p.description}</p>}
          </a>
        ))}
      </div>
    </section>
  );
}
