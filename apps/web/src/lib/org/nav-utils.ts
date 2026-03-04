/**
 * Nav helpers for org web under /org. Paths are already prefixed with /org in content.
 */
const ORG_BASE = "/org";

export function isNavItemActive(href: string, pathname: string): boolean {
  if (!href || href.startsWith("http") || href.startsWith("#")) return false;
  const path = (pathname ?? "").replace(/\/$/, "") || "/";
  const normHref = href.replace(/\/$/, "") || "/";
  if (normHref === `${ORG_BASE}/projects`) return path === `${ORG_BASE}/projects` || path.startsWith(`${ORG_BASE}/projects/`);
  if (normHref === `${ORG_BASE}/events`) return path === `${ORG_BASE}/events` || (path.startsWith(`${ORG_BASE}/events/`) && path !== `${ORG_BASE}/events/admin`);
  if (normHref === `${ORG_BASE}/docs`) return path === `${ORG_BASE}/docs` || path.startsWith(`${ORG_BASE}/docs/`);
  if (normHref === `${ORG_BASE}/resources`) return path === `${ORG_BASE}/resources`;
  return path === normHref;
}

type NavItem = { label: string; href?: string; external?: boolean };

export function getNavItemsForOrgWeb(content: { nav?: { items?: NavItem[] } }, pathname: string): NavItem[] {
  const raw = content?.nav?.items ?? [];
  const isHome = pathname === ORG_BASE || pathname === `${ORG_BASE}/` || pathname === "";

  return raw.map((item) => {
    const out = { ...item };
    if (item.label === "PRIVACY PORTAL") {
      out.href = "/";
      out.external = false;
      return out;
    }
    if (item.href?.startsWith("#") && !isHome) {
      out.href = `${ORG_BASE}/${item.href}`;
    }
    return out;
  });
}
