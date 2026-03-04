"use client";

import { ACCENT, orgAsset } from "./ProjectDetailLayout";

const sectionStyle: React.CSSProperties = {
  borderTop: "1px solid rgba(255,255,255,0.1)",
  padding: "40px 0 56px",
  boxSizing: "border-box",
};

type Article = { href: string; thumbnail?: string; date?: string; title?: string; excerpt?: string };

export function ProjectDetailArticles({ articles, hrefAll }: { articles: Article[] | undefined; hrefAll?: string }) {
  if (!articles?.length) return null;

  return (
    <section style={sectionStyle}>
      <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.05em", color: ACCENT, margin: 0, textTransform: "uppercase" }}>ARTICLES</h2>
      <div className="project-detail-articles-list" style={{ marginTop: 24 }}>
        {articles.map((a, i) => (
          <a
            key={i}
            href={a.href}
            target="_blank"
            rel="noreferrer"
            className="project-detail-article-card"
            style={{ textDecoration: "none", color: "inherit", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", padding: 16, background: "rgba(255,255,255,0.03)" }}
          >
            {a.thumbnail && (
              <div style={{ aspectRatio: "16/10", overflow: "hidden", borderRadius: 8 }}>
                <img src={orgAsset(a.thumbnail)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1)" }} />
              </div>
            )}
            <div style={{ minWidth: 0 }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{a.date}</span>
              <h3 style={{ margin: "4px 0 8px", fontSize: 18, fontWeight: 600, color: "#fff" }}>{a.title}</h3>
              {a.excerpt && <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.8)" }}>{a.excerpt}</p>}
            </div>
          </a>
        ))}
      </div>
      {hrefAll && (
        <a href={hrefAll} target="_blank" rel="noreferrer" style={{ marginTop: 24, display: "inline-block", padding: "12px 24px", borderRadius: 8, backgroundColor: ACCENT, color: "#000", fontWeight: 600, textDecoration: "none" }}>VIEW ALL</a>
      )}
    </section>
  );
}
