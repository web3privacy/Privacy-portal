"use client";

import { ACCENT, orgAsset } from "./ProjectDetailLayout";

const sectionStyle: React.CSSProperties = {
  borderTop: "1px solid rgba(255,255,255,0.1)",
  padding: "40px 0 56px",
  boxSizing: "border-box",
};

type Testimonial = { avatar?: string; name?: string; role?: string; quote?: string };

export function ProjectDetailTestimonials({ testimonials, readMoreHref }: { testimonials: Testimonial[] | undefined; readMoreHref?: string }) {
  if (!testimonials?.length) return null;

  return (
    <section style={sectionStyle}>
      <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.05em", color: ACCENT, margin: 0, textTransform: "uppercase" }}>TESTIMONIALS</h2>
      <div style={{ marginTop: 24, display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
        {testimonials.map((t, i) => (
          <blockquote
            key={i}
            style={{ margin: 0, padding: 24, borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 56, height: 56, flexShrink: 0, overflow: "hidden", borderRadius: "50%" }}>
                <img src={orgAsset(t.avatar)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1)" }} />
              </div>
              <div>
                <cite style={{ fontStyle: "normal", fontWeight: 500, color: "#fff" }}>{t.name}</cite>
                <p style={{ margin: "4px 0 0", fontSize: 14, color: "rgba(255,255,255,0.7)" }}>{t.role}</p>
              </div>
            </div>
            <p style={{ marginTop: 16, color: "rgba(255,255,255,0.9)" }}>&ldquo;{t.quote}&rdquo;</p>
          </blockquote>
        ))}
      </div>
      {readMoreHref && (
        <a href={readMoreHref} target="_blank" rel="noreferrer" style={{ marginTop: 24, display: "inline-block", padding: "12px 24px", borderRadius: 8, backgroundColor: ACCENT, color: "#000", fontWeight: 600, textDecoration: "none" }}>READ MORE</a>
      )}
    </section>
  );
}
