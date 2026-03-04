"use client";

import { ACCENT, ORG_BASE, orgAsset } from "./ProjectDetailLayout";

const sectionStyle: React.CSSProperties = {
  borderTop: "1px solid rgba(255,255,255,0.1)",
  padding: "40px 0 56px",
  boxSizing: "border-box",
};

function IconImage({ name }: { name: string }) {
  const src = `${ORG_BASE}/assets/project-detail/${name}.svg`;
  return <img src={src} alt="" style={{ width: 40, height: 40 }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />;
}

type FeatureItem = { title?: string; subtitle?: string; description?: string; image?: string; link?: string; linkLabel?: string; text?: string; icon?: string };
type Features = FeatureItem[] | { cards?: FeatureItem[]; items?: FeatureItem[] };

export function ProjectDetailFeatures({ features }: { features: Features | undefined }) {
  const isLegacyArray = features && Array.isArray(features) && features.length > 0;
  const isNewFormat = features && typeof features === "object" && !Array.isArray(features) && ((features as { cards?: unknown[] }).cards || (features as { items?: unknown[] }).items);
  const cards = (isNewFormat && Array.isArray((features as { cards?: FeatureItem[] }).cards) ? (features as { cards: FeatureItem[] }).cards : []) as FeatureItem[];
  const items = (isNewFormat && Array.isArray((features as { items?: FeatureItem[] }).items) ? (features as { items: FeatureItem[] }).items : []) as FeatureItem[];
  const hasCards = cards.length > 0;
  const hasItems = items.length > 0;
  const legacyFeatures = isLegacyArray ? (features as FeatureItem[]) : null;

  if (!legacyFeatures && !hasCards && !hasItems) return null;

  return (
    <section style={sectionStyle}>
      <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.05em", color: ACCENT, margin: 0, textTransform: "uppercase" }}>FEATURES</h2>
      {legacyFeatures ? (
        <div style={{ marginTop: 24, display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
          {legacyFeatures.map((f, i) => (
            <div key={i} style={{ borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", padding: 16 }}>
              {f.image && (
                <div style={{ position: "relative", aspectRatio: "16/10", width: "100%", overflow: "hidden", borderRadius: 8 }}>
                  <img src={orgAsset(f.image)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1)" }} />
                </div>
              )}
              <h3 style={{ marginTop: 12, fontWeight: 600, color: "#fff" }}>{f.title}</h3>
              {f.subtitle && <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>{f.subtitle}</p>}
              {f.description && <p style={{ marginTop: 8, fontSize: 14, color: "rgba(255,255,255,0.8)" }}>{f.description}</p>}
              {f.link && (
                <a href={f.link} target="_blank" rel="noreferrer" style={{ marginTop: 12, display: "inline-block", fontSize: 14, fontWeight: 500, color: ACCENT }}>{f.linkLabel ?? "Learn more"} →</a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <>
          {hasCards && (
            <div className="project-detail-features-cards" style={{ marginTop: 24 }}>
              {cards.map((f, i) => (
                <div key={i} style={{ borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", padding: 16 }}>
                  {f.image && (
                    <div style={{ aspectRatio: "16/10", width: "100%", overflow: "hidden", borderRadius: 8 }}>
                      <img src={orgAsset(f.image)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1)" }} />
                    </div>
                  )}
                  <h3 style={{ marginTop: 12, fontWeight: 600, color: "#fff" }}>{f.title}</h3>
                  {f.subtitle && <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>{f.subtitle}</p>}
                  {f.link && (
                    <a href={f.link} target="_blank" rel="noreferrer" style={{ marginTop: 12, display: "inline-block", fontSize: 14, fontWeight: 500, color: ACCENT }}>{f.linkLabel ?? "Learn more"} →</a>
                  )}
                </div>
              ))}
            </div>
          )}
          {hasItems && (
            <div className="project-detail-features-icons" style={{ marginTop: hasCards ? 24 : 24 }}>
              {items.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: ACCENT, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {(f.icon && <IconImage name={f.icon} />) || <span style={{ color: "#000", fontSize: 20 }}>•</span>}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 15, color: "rgba(255,255,255,0.9)" }}>{f.text || f.title}</p>
                    {f.link && (
                      <a href={f.link} target="_blank" rel="noreferrer" style={{ marginTop: 4, display: "inline-block", fontSize: 14, fontWeight: 500, color: ACCENT }}>{f.linkLabel ?? "Learn more"}</a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
