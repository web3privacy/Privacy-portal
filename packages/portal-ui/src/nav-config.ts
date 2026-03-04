import type { PortalNavItem } from "./portal-header";

export type NavContext = "unified" | "stacks" | "explorer";

export type NavUrls = {
  /** Base URL of the unified portal (Explorer + Stacks + Jobs at /, /stacks, /jobs) */
  webUrl: string;
  /** URL of the Web3Privacy org web (About Us) – defaults to web3privacy.info */
  orgUrl?: string;
  /** URL of standalone Explorer app (when running explorer or stacks) */
  explorerUrl?: string;
  /** URL of standalone Stacks app (when running explorer or web) */
  stacksUrl?: string;
};

/** Default URLs for production – override via getNavItems(urls) from app env */
export const DEFAULT_NAV_URLS: NavUrls = {
  webUrl: "https://explorer.web3privacy.com",
  orgUrl: "https://web3privacy.info",
  explorerUrl: "https://explorer.web3privacy.com",
  stacksUrl:
    "https://personalstack-dhlfqhhbo-counmandeers-projects.vercel.app/stacks",
};

/**
 * Returns nav items for the given context. Use this for consistent navigation
 * across web (unified), standalone stacks, and standalone explorer apps.
 */
export function getNavItems(
  context: NavContext,
  urls: Partial<NavUrls> = {}
): PortalNavItem[] {
  const u = { ...DEFAULT_NAV_URLS, ...urls };
  const webBase = u.webUrl!.replace(/\/$/, "");
  const explorerBase = (u.explorerUrl ?? webBase).replace(/\/$/, "");
  const stacksBase = (u.stacksUrl ?? webBase + "/stacks").replace(/\/$/, "");

  const newsHref = context === "unified" ? "/" : webBase;
  const explorerHref =
    context === "unified"
      ? "/explorer"
      : context === "explorer"
        ? "/"
        : explorerBase;
  const stacksHref =
    context === "unified"
      ? "/stacks"
      : context === "stacks"
        ? "/stacks"
        : stacksBase;
  const jobsHref =
    context === "unified" ? "/jobs" : webBase + "/jobs";
  const eventsHref =
    context === "unified" ? "/events" : webBase + "/events";
  const orgBase = (u.orgUrl ?? "https://web3privacy.info").replace(/\/$/, "");
  /** When unified, org is now under /org in the same app */
  const aboutHref =
    context === "unified"
      ? "/org"
      : context === "explorer"
        ? orgBase
        : context === "stacks"
          ? "/categories"
          : orgBase;

  return [
    { href: newsHref, label: "NEWS", id: "news", external: context !== "unified" },
    {
      href: explorerHref,
      label: "EXPLORER",
      id: "explorer",
      external: context !== "unified" && context !== "explorer",
    },
    {
      href: eventsHref,
      label: "EVENTS",
      id: "events",
      external: context !== "unified",
    },
    {
      href: context === "unified" ? "/academy" : webBase + "/academy",
      label: "ACADEMY",
      id: "academy",
      external: context !== "unified",
    },
    {
      href: stacksHref,
      label: "STACKS",
      id: "stacks",
      external: context !== "unified" && context !== "stacks",
    },
    {
      href: context === "unified" ? "/awards" : webBase + "/awards",
      label: "AWARDS",
      id: "awards",
      external: context !== "unified",
    },
    {
      href: jobsHref,
      label: "JOBS",
      id: "jobs",
      external: context !== "unified",
    },
    {
      href: "#",
      label: "MORE",
      id: "more",
      subItems:
        context === "unified"
          ? [
              { href: "/donate", label: "Donate", id: "donate" },
              { href: "/glossary", label: "Glossary", id: "glossary" },
              { href: "/library", label: "Library", id: "library" },
              { href: "/ideas", label: "Idea Generator", id: "ideas" },
              { href: "/people", label: "Personas", id: "people" },
            ]
          : [
              { href: webBase + "/donate", label: "Donate", id: "donate", external: true },
              { href: webBase + "/glossary", label: "Glossary", id: "glossary", external: true },
              { href: webBase + "/library", label: "Library", id: "library", external: true },
              { href: webBase + "/ideas", label: "Idea Generator", id: "ideas", external: true },
              { href: webBase + "/people", label: "Personas", id: "people", external: true },
            ],
    },
    { href: "#", label: "//" },
    {
      href: aboutHref,
      label: "ABOUT US",
      id: "about",
      external: context !== "unified",
    },
  ];
}
