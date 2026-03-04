"use client";

import { usePathname } from "next/navigation";
import { getNavItems, PortalHeader } from "@web3privacy/portal-ui";

const NAV_ITEMS = getNavItems("unified");

function getActiveId(pathname: string): string | undefined {
  if (pathname === "/" || pathname.startsWith("/news")) return "news";
  if (pathname === "/explorer" || pathname.startsWith("/project")) return "explorer";
  if (pathname.startsWith("/stacks") || pathname.startsWith("/categories") || pathname.startsWith("/share")) return "stacks";
  if (pathname.startsWith("/about")) return "about";
  if (pathname.startsWith("/jobs")) return "jobs";
  if (pathname.startsWith("/glossary")) return "glossary";
  if (pathname.startsWith("/library")) return "library";
  if (pathname.startsWith("/ideas")) return "ideas";
  if (pathname.startsWith("/academy")) return "academy";
  if (pathname.startsWith("/events")) return "events";
  // Projects live on org web; no active state for projects on portal
  if (pathname.startsWith("/awards")) return "awards";
  if (pathname.startsWith("/people") || pathname.startsWith("/person")) return "people";
  if (pathname.startsWith("/donate")) return "donate";
  return undefined;
}

export function PortalNav() {
  const pathname = usePathname();
  const activeId = getActiveId(pathname);
  
  // Always use privacy-portal logo
  const logoSrc = "/logo-portal.svg";

  return (
    <PortalHeader
      activeId={activeId}
      brandHref="/"
      navItems={NAV_ITEMS}
      logoSrc={logoSrc}
    />
  );
}
