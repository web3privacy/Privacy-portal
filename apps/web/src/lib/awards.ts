import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import type { AwardsData, AwardYear } from "@/types/awards";

// Get root directory - handle both monorepo and standalone cases
const ROOT_DIR = (() => {
  const cwd = process.cwd();
  // If we're in apps/web, go up two levels to get to root
  if (cwd.endsWith('apps/web')) {
    return path.resolve(cwd, '..', '..');
  }
  // If we're in the root, use it directly
  if (fs.existsSync(path.join(cwd, 'data', 'awards.yaml'))) {
    return cwd;
  }
  // Try to find the root by going up
  let current = cwd;
  for (let i = 0; i < 5; i++) {
    if (fs.existsSync(path.join(current, 'data', 'awards.yaml'))) {
      return current;
    }
    current = path.resolve(current, '..');
  }
  return cwd;
})();

const AWARDS_FILE = path.join(ROOT_DIR, "data", "awards.yaml");
const USER_AWARDS_FILE = path.join(ROOT_DIR, "data", "awards-user.yaml");

const EMPTY_AWARDS: AwardsData = {
  years: [],
  articles: [],
};

function loadYaml<T>(filePath: string, fallback: T): T {
  if (!fs.existsSync(filePath)) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[loadYaml] File not found: ${filePath}`);
    }
    return fallback;
  }
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const parsed = yaml.load(content) as T | null;
    if (!parsed && process.env.NODE_ENV === 'development') {
      console.warn(`[loadYaml] Parsed data is null for: ${filePath}`);
    }
    return parsed ?? fallback;
  } catch (error) {
    console.error(`[loadYaml] Error loading YAML file ${filePath}:`, error);
    return fallback;
  }
}

export function loadAwardsData(): AwardsData {
  // Debug: log file paths
  if (process.env.NODE_ENV === 'development') {
    console.log('[loadAwardsData] File paths:', {
      ROOT_DIR,
      AWARDS_FILE,
      USER_AWARDS_FILE,
      awardsExists: fs.existsSync(AWARDS_FILE),
      userAwardsExists: fs.existsSync(USER_AWARDS_FILE),
    });
  }

  const base = loadYaml<AwardsData>(AWARDS_FILE, EMPTY_AWARDS);
  const user = loadYaml<AwardsData>(USER_AWARDS_FILE, EMPTY_AWARDS);

  // Merge base and user data
  // For years, we merge by year number (user data overrides base)
  const yearMap = new Map<number, AwardYear>();
  
  // Add base years
  base.years?.forEach(year => {
    yearMap.set(year.year, year);
  });
  
  // Override with user years
  user.years?.forEach(year => {
    yearMap.set(year.year, year);
  });

  const merged: AwardsData = {
    years: Array.from(yearMap.values()).sort((a, b) => b.year - a.year), // Sort descending (newest first)
    articles: [...(base.articles ?? []), ...(user.articles ?? [])],
  };

  if (process.env.NODE_ENV === 'development') {
    console.log('[loadAwardsData] Loaded:', {
      years: merged.years.length,
      yearsList: merged.years.map(y => y.year),
      articles: merged.articles?.length || 0,
    });
  }

  return merged;
}

export function getAwardYear(data: AwardsData, year: number): AwardYear | undefined {
  return data.years.find(y => y.year === year);
}

export function getLatestAwardYear(data: AwardsData): AwardYear | undefined {
  if (data.years.length === 0) return undefined;
  return data.years[0]; // Already sorted descending
}
