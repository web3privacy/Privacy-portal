// Academy content types

export type AcademyContentType = "all" | "talks" | "courses" | "quizes" | "guides" | "podcast" | "radio";

export interface Talk {
  id: string;
  title: string;
  description?: string;
  youtubeId: string;
  thumbnailUrl?: string;
  duration?: string; // "19:42"
  speaker?: string;
  publishedAt?: string;
  viewCount?: number; // for popularity sorting
  displayOrder?: number; // for manual ordering in admin
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  icon?: string; // URL to icon/image
  url: string; // Link to course
  duration?: string;
  level?: string;
  createdAt: string;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  url: string;
  duration?: string;
  questionsCount?: number;
  createdAt: string;
}

export interface Guide {
  id: string;
  title: string;
  description: string;
  url: string; // External link
  duration?: string; // "6 min"
  tags?: string[];
  isNew?: boolean;
  createdAt: string;
}

export interface Podcast {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  duration?: string;
  publishedAt?: string;
  createdAt: string;
}

export interface RadioTrack {
  id: string;
  title: string;
  youtubeId: string;
  thumbnailUrl?: string;
  duration?: string;
  speaker?: string;
  displayOrder?: number;
  createdAt: string;
}

export interface RadioPlaylist {
  id: string;
  title: string;
  description?: string;
  tracksCount: number;
  duration: string; // "4hod 32 min"
  url?: string;
  tracks?: RadioTrack[];
  createdAt: string;
}

export interface RadioLive {
  title: string;
  description?: string;
  currentTrack?: string;
  currentTime?: string;
  url?: string;
}

export interface FeaturedDocument {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  url: string;
  duration?: string;
  publishedAt?: string;
  createdAt: string;
}

export interface AcceleratorItem {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  url?: string;
}

export interface AcademyData {
  talks: Talk[];
  courses: Course[];
  quizes: Quiz[];
  guides: Guide[];
  podcasts: Podcast[];
  radioTracks: RadioTrack[]; // Individual radio/interview tracks
  radioPlaylists: RadioPlaylist[];
  radioLive?: RadioLive;
  featuredDocuments: FeaturedDocument[];
  acceleratorItems: AcceleratorItem[];
}
