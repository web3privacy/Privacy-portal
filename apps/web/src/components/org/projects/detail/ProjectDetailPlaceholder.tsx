"use client";

import { ACCENT } from "./ProjectDetailLayout";

const sectionStyle: React.CSSProperties = {
  borderTop: "1px solid rgba(255,255,255,0.1)",
  padding: "40px 0 56px",
  boxSizing: "border-box",
};

export function ProjectDetailPlaceholder({ sectionTitle, message = "Content will be added soon." }: { sectionTitle: string; message?: string }) {
  return (
    <section style={sectionStyle}>
      <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.05em", color: ACCENT, margin: 0, textTransform: "uppercase" }}>{sectionTitle}</h2>
      <p style={{ marginTop: 16, fontSize: 14, color: "rgba(255,255,255,0.6)" }}>{message}</p>
    </section>
  );
}
