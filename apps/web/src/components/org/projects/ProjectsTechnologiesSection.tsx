"use client";

import { getOrgDefaultContent } from "@/lib/org/default-content";

const ACCENT = "#70ff88";

export function ProjectsTechnologiesSection() {
  const content = getOrgDefaultContent();
  const config = (content?.projectsPage as Record<string, unknown>)?.technologies as
    | {
        title?: string;
        ctaLabel?: string;
        ctaHref?: string;
        items?: Array<{ id: string; title?: string; subtitle?: string; icon?: string }>;
      }
    | undefined;
  const items = config?.items ?? [];

  return (
    <section
      className="projects-technologies"
      style={{
        background: "#000",
        color: "#fff",
        padding: "64px 24px",
      }}
    >
      <div
        className="content-shell content-shell--with-padding"
        style={{ maxWidth: 1280, margin: "0 auto" }}
      >
        <h2
          style={{
            fontFamily: "Archivo, sans-serif",
            fontSize: 28,
            fontWeight: 700,
            margin: 0,
            color: "#fff",
            textAlign: "center",
          }}
        >
          {config?.title ?? "How We Make It Happen"}
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
            marginTop: 40,
          }}
          className="projects-technologies__grid"
        >
          {items.map((item) => {
            const iconSrc =
              typeof item.icon === "string" && item.icon
                ? item.icon.startsWith("/")
                  ? item.icon
                  : "/org/assets/projects/explorer-logo.svg"
                : "/org/assets/projects/explorer-logo.svg";
            return (
              <div
                key={item.id}
                style={{
                  padding: 24,
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 12,
                  background: "#181d25",
                  textAlign: "center",
                }}
              >
                <div style={{ width: 48, height: 48, margin: "0 auto 12px" }}>
                  <img
                    src={iconSrc}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      filter: "brightness(0) invert(1)",
                    }}
                  />
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>{item.title ?? ""}</div>
                <div style={{ fontSize: 12, color: "#a7b0bd", marginTop: 4 }}>{item.subtitle ?? ""}</div>
              </div>
            );
          })}
        </div>
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <a
            href={config?.ctaHref ?? "https://docs.web3privacy.info"}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-block",
              padding: "14px 28px",
              background: ACCENT,
              color: "#172118",
              fontWeight: 700,
              fontSize: 14,
              textDecoration: "none",
              borderRadius: 6,
            }}
          >
            {config?.ctaLabel ?? "VIEW OUR TECHNOLOGIES"}
          </a>
        </div>
      </div>
    </section>
  );
}
