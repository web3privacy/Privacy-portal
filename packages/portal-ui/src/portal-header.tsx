"use client";

import Link from "next/link";
import * as React from "react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "./cn";
import { ThemeToggle } from "./theme-toggle";
import { PortalIcon } from "./icon";
import styles from "./portal-header.module.css";

function useActiveIndicator(activeId: string | undefined) {
  const navRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const wrap = navRef.current;
    if (!wrap) return;
    const active = wrap.querySelector(`.${styles.activeLinkIndicator}`);
    if (!active) {
      setIndicator({ left: 0, width: 0 });
      return;
    }
    const wrapRect = wrap.getBoundingClientRect();
    const elRect = active.getBoundingClientRect();
    setIndicator({
      left: elRect.left - wrapRect.left,
      width: elRect.width,
    });
  }, [activeId]);

  useLayoutEffect(() => {
    const wrap = navRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(() => {
      const active = wrap.querySelector(`.${styles.activeLinkIndicator}`);
      if (!active) {
        setIndicator({ left: 0, width: 0 });
        return;
      }
      const wrapRect = wrap.getBoundingClientRect();
      const elRect = active.getBoundingClientRect();
      setIndicator({
        left: elRect.left - wrapRect.left,
        width: elRect.width,
      });
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  return [navRef, indicator] as const;
}

export type PortalNavItem = {
  href: string;
  label: string;
  id?: string;
  underlined?: boolean;
  external?: boolean;
  /** Sub-items for dropdown (e.g. MORE → Glossary) */
  subItems?: PortalNavItem[];
};

export type PortalHeaderProps = {
  activeId?: string;
  brandHref?: string;
  navItems?: PortalNavItem[];
  rightSlot?: ReactNode;
  showThemeToggle?: boolean;
  logoSrc?: string;
};

const defaultNavItems: PortalNavItem[] = [
  { href: "#", label: "NEWS" },
  { href: "/", label: "EXPLORER", id: "explorer" },
  { href: "#", label: "EVENTS" },
  { href: "#", label: "ACADEMY" },
  { href: "/stacks", label: "STACKS", id: "stacks" },
  { href: "#", label: "AWARDS" },
  { href: "#", label: "JOBS" },
  { href: "#", label: "MORE" },
  { href: "#", label: "//" },
  { href: "#", label: "ABOUT US" },
];

const DROPDOWN_CLOSE_DELAY = 120;

export function PortalHeader({
  activeId,
  brandHref = "/",
  navItems,
  rightSlot,
  showThemeToggle = true,
  logoSrc,
}: PortalHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const closeTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const items = useMemo(() => navItems ?? defaultNavItems, [navItems]);
  const [desktopNavRef, activeIndicator] = useActiveIndicator(activeId);

  const scheduleClose = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => setDropdownOpen(null), DROPDOWN_CLOSE_DELAY);
  };

  const cancelClose = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (mobileMenuOpen && dropdownOpen) setDropdownOpen(null);
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <div className={cn("viewport-range-shell", styles.shell)}>
        <Link href={brandHref} className={styles.brandLink}>
          {logoSrc ? (
            <img src={logoSrc} alt="privacy portal" className="h-[25.6px] md:h-[28.8px]" />
          ) : (
            <>
              <span className={styles.brandWord}>privacy</span>
              <span className={styles.brandBlock} />
              <span className={styles.brandWord}>portal</span>
            </>
          )}
        </Link>

        <div ref={desktopNavRef} className={styles.desktopNavWrap}>
        <nav className={styles.desktopNav}>
          {items.map((item) => {
            if (item.label === "//") {
              return (
                <span
                  key="nav-sep"
                  className={styles.navSep}
                  aria-hidden
                />
              );
            }
            const isActive =
              item.id === activeId ||
              item.subItems?.some((s) => s.id === activeId);
            const hasSub = item.subItems && item.subItems.length > 0;

            if (hasSub) {
              const isOpen = dropdownOpen === item.id;
              return (
                <div
                  key={`${item.href}-${item.label}`}
                  className={styles.dropdownWrap}
                  onMouseEnter={() => {
                    cancelClose();
                    setDropdownOpen(item.id ?? item.label);
                  }}
                  onMouseLeave={scheduleClose}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setDropdownOpen(isOpen ? null : (item.id ?? item.label))
                    }
                    className={cn(
                      styles.desktopLink,
                      styles.dropdownTrigger,
                      isActive && styles.activeLink,
                      item.id === activeId && styles.activeLinkIndicator
                    )}
                  >
                    {item.label}
                    <span className="material-symbols-rounded text-[16px] leading-none">keyboard_arrow_down</span>
                  </button>
                  {isOpen && (
                    <div 
                      className={styles.dropdownPanel}
                      onMouseEnter={cancelClose}
                      onMouseLeave={scheduleClose}
                    >
                      {item.subItems!.map((sub) => {
                        const subProps = sub.external
                          ? ({
                              target: "_blank",
                              rel: "noopener noreferrer",
                            } as const)
                          : {};
                        return (
                          <Link
                            key={sub.href + sub.label}
                            href={sub.href}
                            className={styles.dropdownItem}
                            onClick={() => setDropdownOpen(null)}
                            {...subProps}
                          >
                            {sub.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            const props = item.external
              ? ({ target: "_blank", rel: "noopener noreferrer" } as const)
              : {};
            return (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className={cn(
                  styles.desktopLink,
                  isActive && styles.activeLink,
                  item.id === activeId && styles.activeLinkIndicator
                )}
                {...props}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div
          className={styles.navActiveIndicator}
          style={{ left: activeIndicator.left, width: activeIndicator.width }}
          aria-hidden
        />
        </div>

        <div className={styles.desktopActions}>
          <div className={styles.rightSlot}>
            {rightSlot ? rightSlot : null}
            {showThemeToggle ? <ThemeToggle /> : null}
          </div>
        </div>

        <div className={styles.mobileQuickActions}>
          {showThemeToggle ? <ThemeToggle className="px-2" /> : null}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className={styles.mobileTrigger}
            aria-label="Open menu"
          >
            <PortalIcon name="menu" size={24} />
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className={styles.overlay} onClick={() => setMobileMenuOpen(false)}>
          <div
            className={styles.mobilePanel}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.mobileTop}>
              <span className={styles.mobileTitle}>Menu</span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className={styles.mobileClose}
                aria-label="Close menu"
              >
                <PortalIcon name="close" size={22} />
              </button>
            </div>

            <div className={styles.mobileToggleWrap}>
              <div className={styles.mobileTopControls}>
                {rightSlot ? rightSlot : null}
                {showThemeToggle ? <ThemeToggle /> : null}
              </div>
            </div>

            <nav className={styles.mobileNav}>
              {items.map((item) => {
                if (item.label === "//") {
                  return (
                    <span
                      key="mobile-nav-sep"
                      className={styles.navSep}
                      aria-hidden
                    />
                  );
                }
                const isActive =
                  item.id === activeId ||
                  item.subItems?.some((s) => s.id === activeId);

                if (item.subItems && item.subItems.length > 0) {
                  return (
                    <div key={`mobile-${item.label}`}>
                      <span
                        className={cn(
                          styles.mobileLink,
                          styles.mobileSectionLabel
                        )}
                      >
                        {item.label}
                      </span>
                      {item.subItems.map((sub) => {
                        const subProps = sub.external
                          ? ({
                              target: "_blank",
                              rel: "noopener noreferrer",
                            } as const)
                          : {};
                        return (
                          <Link
                            key={`mobile-${sub.href}-${sub.label}`}
                            href={sub.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                              styles.mobileLink,
                              styles.mobileSubItem,
                              sub.id === activeId && styles.mobileActiveLink
                            )}
                            {...subProps}
                          >
                            {sub.label}
                          </Link>
                        );
                      })}
                    </div>
                  );
                }

                const props = item.external
                  ? ({ target: "_blank", rel: "noopener noreferrer" } as const)
                  : {};
                return (
                  <Link
                    key={`mobile-${item.href}-${item.label}`}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      styles.mobileLink,
                      isActive && styles.mobileActiveLink
                    )}
                    {...props}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
