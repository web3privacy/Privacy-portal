import type { GlobalFooterConfig } from "@web3privacy/portal-ui";

const ASSETS_BASE =
  typeof process !== "undefined" && process.env?.NEXT_PUBLIC_ORG_WEB_URL
    ? process.env.NEXT_PUBLIC_ORG_WEB_URL
    : "https://web3privacy.info";

/**
 * Portal global footer config – 1:1 content/layout with org-web.
 * Assets (images) are loaded from org-web (ASSETS_BASE) unless overridden.
 */
export const portalGlobalFooterConfig: GlobalFooterConfig = {
  contribute: {
    eyeImage: "/assets/contribute-eye-now.png",
    roundLogoImage: null,
    title: "Contribute to Future of Privacy",
    text:
      "Privacy advocates worldwide are coming together to discuss how to mainstream privacy within the Web3 industry. So it will become a cultural phenomenon embodying both decentralisation & anti-surveillance capitalism practices.",
    ctaText: "GET INVOLVED AND CONTRIBUTE",
    ctaLink: `${ASSETS_BASE}/#support`,
    communityAvatars: [
      `${ASSETS_BASE}/assets/profile-vitalik.png`,
      `${ASSETS_BASE}/assets/profiles/aya-miyaguchi.png`,
      `${ASSETS_BASE}/assets/profiles/kurt-opsahl.png`,
      `${ASSETS_BASE}/assets/profiles/richard-stallman.png`,
      `${ASSETS_BASE}/assets/profile-vitalik.png`,
      `${ASSETS_BASE}/assets/profile-vitalik.png`,
    ],
  },
  donation: {
    title: "Empower Change With Your Donation",
    text:
      "To support our future activities, you can donate to our cause and be forever remembered.",
    ctaText: "DONATE NOW",
    ctaLink: "https://explorer.web3privacy.com/donate?theme=dark",
    backgroundImage: "/assets/donation-banner-bg.png",
  },
  newsletter: {
    text: "Join our Newsletter and get information from our ecosystem",
    placeholder: "Your e-mail",
    buttonText: "SUBSCRIBE",
    actionUrl: "",
  },
  members: {
    title: "Our members enable our mission and support our projects.",
    logos: [
      { name: "DYNE", handle: "@GuyZys", image: "/assets/members/dyne.png" },
      { name: "LOGOS", handle: "@GuyZys", image: "/assets/members/logos.png" },
      { name: "NOMOS", handle: "@GuyZys", image: "/assets/members/nomos.png" },
      { name: "CODEX", handle: "@GuyZys", image: "/assets/members/codex.png" },
      { name: "LABYRINTH", handle: "@GuyZys", image: "/assets/members/labyrinth.png" },
      { name: "WAKU", handle: "@GuyZys", image: "/assets/members/waku.png" },
    ],
    ctaText: "BECOME A MEMBER",
    ctaLink: "https://discord.gg/web3privacy",
  },
  footer: {
    logo: "/assets/nav-logo.svg",
    linksColumn1: [
      { label: "Manifesto", href: `${ASSETS_BASE}/#manifesto` },
      { label: "How to get involved", href: `${ASSETS_BASE}/#support` },
      { label: "Grants / Support Us", href: `${ASSETS_BASE}/#support` },
    ],
    linksColumn2: [
      { label: "Events", href: `${ASSETS_BASE}/events` },
      { label: "Articles", href: `${ASSETS_BASE}/resources` },
      { label: "Talks", href: `${ASSETS_BASE}/#` },
    ],
    linksColumn3: [
      { label: "Privacy Explorer", href: "https://explorer.web3privacy.com", external: true },
      { label: "Privacy use-cases database", href: "#" },
    ],
    socialLabel: "Join our privacy movement on:",
    social: [
      { label: "GitHub", icon: "github", href: "https://github.com/web3privacy" },
      { label: "X", icon: "x", href: "https://x.com/web3privacy" },
      { label: "YouTube", icon: "youtube", href: "https://www.youtube.com/@web3privacy" },
      { label: "Telegram", icon: "telegram", href: "https://t.me/web3privacy" },
      { label: "Discord", icon: "discord", href: "https://discord.gg/web3privacy" },
      { label: "RSS", icon: "rss", href: "https://news.web3privacy.info/feed.xml" },
    ],
    legal: "All rights not reserved, Creative commons 2024 - Web3Privacy",
  },
};
