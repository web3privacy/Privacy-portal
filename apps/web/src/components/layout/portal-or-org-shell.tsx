"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { PortalNav } from "@/components/navigation/portal-nav";
import { GlobalFooterWrapper } from "@/components/layout/global-footer-wrapper";
import { portalGlobalFooterConfig } from "@/config/global-footer-config";
import { ConditionalHeaderBorder } from "@/components/layout/conditional-header-border";

const THEME_KEY = "privacy-portal-theme";

function applyPortalTheme() {
  try {
    const v = localStorage.getItem(THEME_KEY);
    const t = v === "dark" ? "dark" : "light";
    document.documentElement.classList.toggle("dark", t === "dark");
    document.documentElement.style.colorScheme = t;
  } catch {
    document.documentElement.classList.remove("dark");
    document.documentElement.style.colorScheme = "light";
  }
}

export function PortalOrOrgShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isOrg = pathname?.startsWith("/org");

  // When showing portal (not /org), re-apply theme from localStorage.
  useEffect(() => {
    if (!isOrg) {
      applyPortalTheme();
    }
  }, [isOrg]);

  if (isOrg) {
    return <>{children}</>;
  }

  return (
    <>
      <ConditionalHeaderBorder>
        <PortalNav />
      </ConditionalHeaderBorder>
      <main className="flex-1">{children}</main>
      <GlobalFooterWrapper config={portalGlobalFooterConfig} />
    </>
  );
}
