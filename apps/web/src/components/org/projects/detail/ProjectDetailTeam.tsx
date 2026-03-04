"use client";

import { ACCENT, orgAsset } from "./ProjectDetailLayout";

const sectionStyle: React.CSSProperties = {
  borderTop: "1px solid rgba(255,255,255,0.1)",
  padding: "40px 0 56px",
  boxSizing: "border-box",
};

type Member = { avatar?: string; name?: string; role?: string };

export function ProjectDetailTeam({ team }: { team: Member[] | undefined }) {
  if (!team?.length) return null;

  return (
    <section style={sectionStyle}>
      <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.05em", color: ACCENT, margin: 0, textTransform: "uppercase" }}>TEAM</h2>
      <div className="project-detail-team-grid" style={{ marginTop: 24 }}>
        {team.map((m, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <div style={{ width: 96, height: 96, overflow: "hidden", borderRadius: "50%" }}>
              <img src={orgAsset(m.avatar)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1)" }} />
            </div>
            <p style={{ marginTop: 8, fontWeight: 500, color: "#fff" }}>{m.name}</p>
            <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.7)" }}>{m.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
