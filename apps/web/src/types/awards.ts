// Awards types

export type AwardCategory = 
  | "favourite-privacy-project"
  | "exciting-innovation"
  | "major-news-event"
  | "doxxer-of-year";

export interface AwardCategoryConfig {
  id: AwardCategory;
  name: string;
  description?: string;
  maxNominations?: number; // e.g., 3 for favourite privacy project, 1 for doxxer
}

export interface Nomination {
  id: string;
  category: AwardCategory;
  nominee: string; // Name of the nominated project/person/event
  description?: string;
  url?: string;
  icon?: string; // URL to icon/image
  projectId?: string; // Reference to Explorer project ID (if it's a project)
  personId?: string; // Reference to People database ID (if it's a person)
}

export interface Nominator {
  id: string;
  name: string;
  title?: string; // e.g., "Founder of Ethereum, Developer, Thinker"
  avatar?: string; // URL to avatar image
  org?: string;
  personId?: string; // Reference to People database ID
  nominations: Nomination[];
}

export interface Winner {
  category: AwardCategory;
  winner: string; // Name of the winner
  description?: string;
  icon?: string;
  url?: string;
  projectId?: string; // Reference to Explorer project ID (if it's a project)
  personId?: string; // Reference to People database ID (if it's a person)
}

export interface AwardYear {
  year: number; // 2024, 2025, 2026
  title?: string; // Optional custom title
  description?: string;
  heroBackgroundImage?: string; // URL to hero background
  
  // Important dates
  dates: {
    nominationsOpen: string; // ISO date string
    nominationsClose: string; // ISO date string
    announcement: string; // ISO date string
  };
  
  // Categories configuration
  categories: AwardCategoryConfig[];
  
  // Winners (if announced)
  winners?: Winner[];
  
  // Nominations from users
  nominations: Nominator[];
  
  // Rules (can differ by year)
  rules?: string; // Markdown or plain text
  
  // Related articles
  articles?: Article[];
  
  // Banner ads (placeholder)
  bannerAds?: BannerAd[];
  
  // How to nominate section
  howToNominate?: string; // Markdown or plain text
}

export interface Article {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  url: string;
  publishedAt?: string; // ISO date string
  createdAt: string; // ISO date string
}

export interface BannerAd {
  id: string;
  title?: string;
  imageUrl?: string;
  url?: string;
  description?: string;
}

export interface AwardsData {
  years: AwardYear[];
  // Global articles (can be used across years)
  articles?: Article[];
}
