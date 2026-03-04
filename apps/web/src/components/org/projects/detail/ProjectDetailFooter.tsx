"use client";

import Link from "next/link";
import { ACCENT, ORG_BASE, orgAsset } from "./ProjectDetailLayout";

const PRODUCTS = [
  { label: "Privacy Explorer", href: "/org/projects/privacy-explorer" },
  { label: "Privacy Tech Awards", href: "/org/projects/privacy-tech-awards" },
  { label: "Annual Report", href: "/org/projects/annual-report" },
  { label: "Pagency", href: "/org/projects/pagency" },
];
const RESEARCH = [
  { label: "Hiring", href: "/org/projects/hiring" },
  { label: "Privacy Guides", href: "/org/projects/privacy-guides" },
  { label: "Use-case DB", href: "/org/projects/usecase-db" },
  { label: "ZK Solutions", href: "/org/projects/zk-solutions" },
  { label: "Hackathon Pack", href: "/org/projects/hackathon-pack" },
];
const SOCIAL = [
  { label: "Twitter", href: "https://twitter.com/web3privacy", icon: "twitter" },
  { label: "Discord", href: "https://discord.gg/web3privacy", icon: "discord" },
  { label: "GitHub", href: "https://github.com/web3privacy", icon: "github" },
  { label: "LinkedIn", href: "https://linkedin.com/company/web3privacy", icon: "linkedin" },
  { label: "Medium", href: "https://medium.com/web3privacy", icon: "medium" },
  { label: "YouTube", href: "https://youtube.com/web3privacy", icon: "youtube" },
];

type FooterData = {
  tagline?: string;
  getStartedHref?: string;
  communityAvatars?: string[];
  ctaImage?: string;
  communityText?: string;
};

export function ProjectDetailFooter({ projectName, footer: footerData }: { projectName?: string; footer: FooterData | undefined }) {
  const tagline = footerData?.tagline ?? "Create your own web3-powered dApps and decentralized experiences with W3PN's AI-driven platform. Join our community of innovators.";
  const getStartedHref = footerData?.getStartedHref ?? "https://web3privacy.info";
  const communityAvatars = footerData?.communityAvatars ?? [];
  const ctaImage = footerData?.ctaImage;
  const communityText = footerData?.communityText ?? "Join the #W3PN community";

  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(0,0,0,0.3)",
        padding: "40px 0",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32, textAlign: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <img src={`${ORG_BASE}/assets/nav-logo.svg`} alt="Web3Privacy" style={{ height: 28, width: "auto" }} />
          <p style={{ margin: "8px 0 0", maxWidth: 480, fontSize: 14, color: "rgba(255,255,255,0.7)" }}>{tagline}</p>
          <a href={getStartedHref} target="_blank" rel="noreferrer" style={{ marginTop: 16, display: "inline-block", padding: "12px 24px", borderRadius: 8, backgroundColor: "#000", color: "#fff", fontWeight: 600, textDecoration: "none" }}>GET STARTED</a>
        </div>
        {communityAvatars.length > 0 && (
          <div className="project-detail-footer-avatars">
            {communityAvatars.slice(0, 16).map((url, i) => (
              <div key={i} style={{ aspectRatio: "1", borderRadius: "50%", overflow: "hidden" }}>
                <img src={orgAsset(url)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
        )}
        {ctaImage && (
          <div style={{ width: "100%", maxWidth: 600, position: "relative", borderRadius: 12, overflow: "hidden", minHeight: 200 }}>
            <img src={orgAsset(ctaImage)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
            <div style={{ position: "relative", padding: 40, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <a href={getStartedHref} target="_blank" rel="noreferrer" style={{ padding: "12px 24px", borderRadius: 8, backgroundColor: ACCENT, color: "#000", fontWeight: 600, textDecoration: "none" }}>GET STARTED</a>
            </div>
          </div>
        )}
        <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.8)" }}>{communityText}</p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
          {SOCIAL.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} style={{ color: "rgba(255,255,255,0.8)" }}>
              <img src={`${ORG_BASE}/assets/project-detail/icon-${s.icon}.svg`} alt="" style={{ width: 24, height: 24 }} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </a>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 24 }}>
          <div>
            <h3 style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", color: "rgba(255,255,255,0.6)", margin: 0 }}>Products</h3>
            <ul style={{ marginTop: 8, padding: 0, listStyle: "none" }}>
              {PRODUCTS.map((item) => (
                <li key={item.label}><Link href={item.href} style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>{item.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", color: "rgba(255,255,255,0.6)", margin: 0 }}>Research</h3>
            <ul style={{ marginTop: 8, padding: 0, listStyle: "none" }}>
              {RESEARCH.map((item) => (
                <li key={item.label}><Link href={item.href} style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>{item.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <p style={{ marginTop: 40, textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>© {new Date().getFullYear()} Web3 Privacy Now. All rights reserved.</p>
    </footer>
  );
}
