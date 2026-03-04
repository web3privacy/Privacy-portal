"use client";

import { useState, useRef, useLayoutEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getNavItemsForOrgWeb, isNavItemActive } from "@/lib/org/nav-utils";

function ExpandIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden style={{ display: "inline-block", verticalAlign: "middle", marginLeft: "0.25em", marginTop: "-2px" }}>
      <path d="M12 8.5V13H3V4h4.5M14 2L8 8M14 2h-4M14 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type Content = { site?: { title?: string }; nav?: { items?: { label: string; href?: string; external?: boolean }[] } };

function useActiveIndicator(pathname: string) {
  const navRef = useRef<HTMLElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const active = nav.querySelector(".nav-item-active");
    if (!active) {
      setIndicator({ left: 0, width: 0 });
      return;
    }
    const navRect = nav.getBoundingClientRect();
    const linkRect = active.getBoundingClientRect();
    setIndicator({ left: linkRect.left - navRect.left, width: linkRect.width });
  }, [pathname]);

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const ro = new ResizeObserver(() => {
      const active = nav.querySelector(".nav-item-active");
      if (!active) return;
      const navRect = nav.getBoundingClientRect();
      const linkRect = active.getBoundingClientRect();
      setIndicator({ left: linkRect.left - navRect.left, width: linkRect.width });
    });
    ro.observe(nav);
    return () => ro.disconnect();
  }, []);

  return [navRef, indicator] as const;
}

export default function OrgNavHeader({ content }: { content: Content }) {
  const site = content?.site ?? {};
  const pathname = usePathname() ?? "";
  const navItems = getNavItemsForOrgWeb(content, pathname);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [navRef, indicator] = useActiveIndicator(pathname);

  const title = (site as { title?: string }).title ?? "Web3Privacy Now";
  const headerLogo = (site as { headerLogo?: string }).headerLogo ?? "/org/assets/nav-logo.svg";

  return (
    <header className="top-nav">
      <Link href="/org" className="brand" aria-label={title}>
        <img src={headerLogo} alt={title} />
      </Link>
      <button
        type="button"
        className="nav-toggle"
        aria-label="Toggle menu"
        aria-expanded={mobileNavOpen}
        onClick={() => setMobileNavOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>
      <nav ref={navRef} className={mobileNavOpen ? "nav-open" : ""}>
        <div className="nav-links">
          {navItems.map((item) =>
            item.label === "//" ? (
              <span key="nav-sep" className="nav-sep" aria-hidden />
            ) : item.external ? (
              <a
                key={item.label}
                href={item.href ?? "#"}
                target="_blank"
                rel="noreferrer"
                onClick={() => setMobileNavOpen(false)}
              >
                {item.label}
                {item.label === "FORUM" && <ExpandIcon />}
              </a>
            ) : (
              <Link
                key={item.label}
                href={item.href ?? "/org"}
                className={isNavItemActive(item.href ?? "", pathname) ? "nav-item-active" : undefined}
                onClick={() => setMobileNavOpen(false)}
              >
                {item.label}
              </Link>
            )
          )}
        </div>
        <div className="nav-active-indicator" style={{ left: indicator.left, width: indicator.width }} aria-hidden />
      </nav>
      {mobileNavOpen && <div className="nav-overlay" aria-hidden onClick={() => setMobileNavOpen(false)} />}
    </header>
  );
}
