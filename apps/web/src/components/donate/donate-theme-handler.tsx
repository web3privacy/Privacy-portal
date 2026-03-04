"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const THEME_KEY = "privacy-portal-theme";

function applyDarkMode() {
  document.documentElement.classList.add("dark");
  document.documentElement.style.colorScheme = "dark";
  try {
    localStorage.setItem(THEME_KEY, "dark");
  } catch {
    /* ignore */
  }
}

export function DonateThemeHandler() {
  const searchParams = useSearchParams();
  useEffect(() => {
    const themeParam = searchParams.get("theme");
    if (themeParam === "dark") {
      applyDarkMode();
    }
  }, [searchParams]);
  return null;
}
