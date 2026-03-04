"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "./cn";

type Theme = "light" | "dark";

export type ThemeToggleProps = {
  className?: string;
  storageKey?: string;
};

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  // Keep UA widgets consistent.
  document.documentElement.style.colorScheme = theme;
}

export function ThemeToggle({
  className,
  storageKey = "privacy-portal-theme",
}: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      const initial: Theme = saved === "dark" ? "dark" : "light";
      setTheme(initial);
      applyTheme(initial);
    } catch {
      // ignore
    }
  }, [storageKey]);

  const label = useMemo(() => (theme === "dark" ? "Dark" : "Light"), [theme]);

  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-foreground/15 bg-transparent text-foreground/80",
        "hover:text-foreground hover:bg-foreground/5",
        className
      )}
      onClick={() => {
        const next: Theme = theme === "dark" ? "light" : "dark";
        setTheme(next);
        applyTheme(next);
        try {
          localStorage.setItem(storageKey, next);
        } catch {
          // ignore
        }
      }}
      aria-label={`Switch theme (currently ${label})`}
    >
      <svg
        viewBox="0 0 24 24"
        width={18}
        height={18}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {theme === "dark" ? (
          <>
            {/* Sun */}
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="M4.93 4.93l1.41 1.41" />
            <path d="M17.66 17.66l1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="M4.93 19.07l1.41-1.41" />
            <path d="M17.66 6.34l1.41-1.41" />
          </>
        ) : (
          <>
            {/* Moon */}
            <path d="M21 14.5A8.5 8.5 0 0 1 9.5 3a7 7 0 1 0 11.5 11.5z" />
          </>
        )}
      </svg>
    </button>
  );
}
