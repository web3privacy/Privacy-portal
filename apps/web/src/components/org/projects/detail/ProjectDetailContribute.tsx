"use client";

import { ACCENT, ORG_BASE } from "./ProjectDetailLayout";

const sectionStyle: React.CSSProperties = {
  borderTop: "1px solid rgba(255,255,255,0.1)",
  padding: "40px 0 56px",
  boxSizing: "border-box",
};

const DEFAULT_CONTRIBUTE = {
  text: "Want to shape the future of privacy? Join us as a developer, researcher, designer, or community builder.",
  links: [
    { label: "Code", href: "https://github.com/web3privacy" },
    { label: "Documentation", href: "https://docs.web3privacy.info" },
    { label: "Design", href: "https://web3privacy.info" },
    { label: "Feedback", href: "https://web3privacy.info" },
  ],
  ctaLabel: "LEARN MORE",
  ctaHref: "https://web3privacy.info",
};

function ContributeLinkIcon({ icon }: { icon?: string }) {
  if (!icon) return null;
  const src = `${ORG_BASE}/assets/project-detail/${icon}.svg`;
  return <img src={src} alt="" style={{ width: 20, height: 20, flexShrink: 0 }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />;
}

type ContributeData = {
  text?: string;
  links?: Array<{ label: string; href: string; icon?: string }>;
  ctaLabel?: string;
  ctaHref?: string;
};

export function ProjectDetailContribute({ contribute: contributeData }: { contribute: ContributeData | undefined }) {
  const contribute = { ...DEFAULT_CONTRIBUTE, ...contributeData };
  const links: Array<{ label: string; href: string; icon?: string }> = (contribute.links ?? DEFAULT_CONTRIBUTE.links) as Array<{ label: string; href: string; icon?: string }>;

  return (
    <section style={sectionStyle}>
      <div className="project-detail-contribute-inner">
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.05em", color: ACCENT, margin: 0, textTransform: "uppercase" }}>CONTRIBUTE</h2>
          <p style={{ marginTop: 16, maxWidth: 672, color: "rgba(255,255,255,0.9)" }}>{contribute.text}</p>
          {contribute.ctaLabel && contribute.ctaHref && (
            <a href={contribute.ctaHref} target="_blank" rel="noreferrer" style={{ marginTop: 24, display: "inline-block", padding: "12px 24px", borderRadius: 8, backgroundColor: ACCENT, color: "#000", fontWeight: 600, textDecoration: "none" }}>{contribute.ctaLabel}</a>
          )}
        </div>
        <ul style={{ marginTop: 16, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
          {links.map((link) => (
            <li key={link.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <ContributeLinkIcon icon={link.icon} />
              <a href={link.href} target="_blank" rel="noreferrer" style={{ fontWeight: 500, color: ACCENT }}>{link.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
