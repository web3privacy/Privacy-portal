"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "privacy-portal-theme";

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const initialTheme: Theme = stored === "dark" ? "dark" : "light";
    setTheme(initialTheme);
    applyTheme(initialTheme);
    setMounted(true);
  }, []);

  function toggleTheme() {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    applyTheme(nextTheme);
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex h-10 w-10 items-center justify-center rounded-[8px] border border-[#d6d6d6] bg-white text-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-black/5 dark:border-[#3b3f46] dark:bg-[#1b1f25] dark:text-[#f2f4f6] dark:hover:bg-white/10"
    >
      <span className="material-symbols-rounded text-[20px] leading-none">
        {mounted && theme === "dark" ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
}
