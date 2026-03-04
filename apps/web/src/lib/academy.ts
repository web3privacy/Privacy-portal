import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import type { AcademyData, Talk, Course, Guide, FeaturedDocument } from "@/types/academy";

// Get root directory - handle both monorepo and standalone cases
const ROOT_DIR = (() => {
  const cwd = process.cwd();
  // If we're in apps/web, go up two levels to get to root
  if (cwd.endsWith('apps/web')) {
    return path.resolve(cwd, '..', '..');
  }
  // If we're in the root, use it directly
  if (fs.existsSync(path.join(cwd, 'data', 'academy.yaml'))) {
    return cwd;
  }
  // Try to find the root by going up
  let current = cwd;
  for (let i = 0; i < 5; i++) {
    if (fs.existsSync(path.join(current, 'data', 'academy.yaml'))) {
      return current;
    }
    current = path.resolve(current, '..');
  }
  return cwd;
})();

const ACADEMY_FILE = path.join(ROOT_DIR, "data", "academy.yaml");
const USER_ACADEMY_FILE = path.join(ROOT_DIR, "data", "academy-user.yaml");

const EMPTY_ACADEMY: AcademyData = {
  talks: [],
  courses: [],
  quizes: [],
  guides: [],
  podcasts: [],
  radioTracks: [],
  radioPlaylists: [],
  featuredDocuments: [],
  acceleratorItems: [],
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

export function loadAcademyData(): AcademyData {
  // Debug: log file paths
  if (process.env.NODE_ENV === 'development') {
    console.log('[loadAcademyData] File paths:', {
      ROOT_DIR,
      ACADEMY_FILE,
      USER_ACADEMY_FILE,
      academyExists: fs.existsSync(ACADEMY_FILE),
      userAcademyExists: fs.existsSync(USER_ACADEMY_FILE),
    });
  }

  const base = loadYaml<AcademyData>(ACADEMY_FILE, EMPTY_ACADEMY);
  const user = loadYaml<AcademyData>(USER_ACADEMY_FILE, EMPTY_ACADEMY);

  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('[loadAcademyData] Base:', {
      talks: base.talks?.length || 0,
      courses: base.courses?.length || 0,
      guides: base.guides?.length || 0,
      featuredDocuments: base.featuredDocuments?.length || 0,
    });
    console.log('[loadAcademyData] User:', {
      talks: user.talks?.length || 0,
      courses: user.courses?.length || 0,
      guides: user.guides?.length || 0,
      featuredDocuments: user.featuredDocuments?.length || 0,
    });
  }

  // Merge base and user data
  const merged = {
    talks: [...(base.talks ?? []), ...(user.talks ?? [])],
    courses: [...(base.courses ?? []), ...(user.courses ?? [])],
    quizes: [...(base.quizes ?? []), ...(user.quizes ?? [])],
    guides: [...(base.guides ?? []), ...(user.guides ?? [])],
    podcasts: [...(base.podcasts ?? []), ...(user.podcasts ?? [])],
    radioTracks: [...(base.radioTracks ?? []), ...(user.radioTracks ?? [])],
    radioPlaylists: [...(base.radioPlaylists ?? []), ...(user.radioPlaylists ?? [])],
    radioLive: user.radioLive ?? base.radioLive,
    featuredDocuments: [...(base.featuredDocuments ?? []), ...(user.featuredDocuments ?? [])],
    acceleratorItems: [...(base.acceleratorItems ?? []), ...(user.acceleratorItems ?? [])],
  };

  if (process.env.NODE_ENV === 'development') {
    console.log('[loadAcademyData] Merged:', {
      talks: merged.talks.length,
      courses: merged.courses.length,
      guides: merged.guides.length,
      radioTracks: merged.radioTracks.length,
      featuredDocuments: merged.featuredDocuments.length,
      acceleratorItems: merged.acceleratorItems.length,
    });
  }

  return merged;
}

// Get most popular talks (sorted by viewCount, fallback to publishedAt, then by displayOrder)
export function getPopularTalks(talks: Talk[], limit: number = 8): Talk[] {
  return [...talks]
    .sort((a, b) => {
      // First sort by displayOrder if set
      if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
        return a.displayOrder - b.displayOrder;
      }
      if (a.displayOrder !== undefined) return -1;
      if (b.displayOrder !== undefined) return 1;
      
      // Then by viewCount
      if (a.viewCount && b.viewCount) {
        return b.viewCount - a.viewCount;
      }
      if (a.viewCount) return -1;
      if (b.viewCount) return 1;
      
      // Finally by publishedAt
      if (a.publishedAt && b.publishedAt) {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
      return 0;
    })
    .slice(0, limit);
}

// Fetch YouTube videos from channel using RSS feed
export async function fetchYouTubeVideos(channelHandle: string): Promise<Talk[]> {
  try {
    // Try to fetch from API endpoint
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    const response = await fetch(`${baseUrl}/api/academy/youtube`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
      cache: 'no-store', // Force fresh fetch
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.talks ?? [];
    }
    
    // If API fails, return empty and let local data fill in
    console.warn("YouTube API failed, using local data");
    return [];
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    // Return empty and let local data fill in
    return [];
  }
}

// Fetch courses from academy.web3privacy.info
export async function fetchCourses(): Promise<Course[]> {
  try {
    // Try to scrape from API endpoint
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    const response = await fetch(`${baseUrl}/api/academy/courses-scrape`, {
      next: { revalidate: 86400 }, // Cache for 24 hours
      cache: 'no-store', // Force fresh fetch
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.courses ?? [];
    }
    
    // If scraping fails, return empty and let local data fill in
    console.warn("Course scraping failed, using local data");
    return [];
  } catch (error) {
    console.error("Error fetching courses:", error);
    // Return empty and let local data fill in
    return [];
  }
}

// Fetch podcasts from YouTube playlist
export async function fetchPodcasts(): Promise<any[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    const response = await fetch(`${baseUrl}/api/academy/podcasts`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
      cache: 'no-store', // Force fresh fetch
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.podcasts ?? [];
    }
    
    console.warn("Podcast API failed, using local data");
    return [];
  } catch (error) {
    console.error("Error fetching podcasts:", error);
    return [];
  }
}

// Fetch radio tracks from YouTube playlist
export async function fetchRadioTracks(): Promise<any[]> {
  try {
    // Try to fetch from API endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/academy/radio`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.tracks ?? [];
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching radio tracks:", error);
    return [];
  }
}

// Get academy item by ID and type
export function getAcademyItemById(id: string, type: string): any {
  const data = loadAcademyData();
  
  switch (type) {
    case "talk":
      return data.talks.find((t) => t.id === id);
    case "course":
      return data.courses.find((c) => c.id === id);
    case "guide":
      return data.guides.find((g) => g.id === id);
    case "radioTrack":
      return data.radioTracks.find((r) => r.id === id);
    case "featuredDocument":
      return data.featuredDocuments.find((d) => d.id === id);
    case "acceleratorItem":
      return data.acceleratorItems.find((a) => a.id === id);
    default:
      return undefined;
  }
}
