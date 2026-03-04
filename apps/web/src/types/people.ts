// People types - database of people across the portal

export interface PersonLink {
  type: "web" | "twitter" | "github" | "linkedin" | "telegram" | "discord" | "other";
  url: string;
  label?: string;
}

export interface PersonStack {
  stackId: string; // Reference to stack ID
  role?: string; // Role in the stack
}

export interface PersonProject {
  projectId: string; // Reference to Explorer project ID
  role?: string; // Role in the project
}

export interface PersonArticle {
  articleId: string; // Reference to article ID
  role?: "author" | "co-author" | "mentioned";
  title?: string; // Article title (for display)
  url?: string; // Article URL
  thumbnailUrl?: string; // Article thumbnail
  publishedAt?: string; // Publication date
}

export interface PersonBook {
  bookId: string; // Reference to book ID
  title?: string; // Book title
  author?: string; // Book author
  imageUrl?: string; // Book cover image
  recommendedBy?: string; // Who recommended it
}

export interface PersonEvent {
  eventId: string; // Reference to event ID
  title?: string; // Event title
  location?: string; // Event location
  date?: string; // Event date
  thumbnailUrl?: string; // Event thumbnail
  url?: string; // Event URL
}

export interface PersonMedia {
  mediaId: string; // Reference to media ID
  title?: string; // Media title
  speaker?: string; // Speaker name
  speakerTitle?: string; // Speaker title
  thumbnailUrl?: string; // Media thumbnail
  duration?: string; // Duration
  url?: string; // Media URL
}

export interface PersonGlossaryTerm {
  termId: string; // Reference to glossary term ID
  term?: string; // Term name
  definition?: string; // Term definition
}

export interface PersonRating {
  source: "explorer" | "community" | "academy";
  rating?: number;
  description?: string;
}

export interface Person {
  id: string;
  name: string;
  displayName?: string; // Alternative display name
  title?: string; // Job title, role
  description?: string; // Bio/description
  avatar?: string; // URL to avatar image
  
  // Links
  links?: PersonLink[];
  
  // Connections
  stacks?: PersonStack[]; // Stacks profiles
  projects?: PersonProject[]; // Explorer projects
  articles?: PersonArticle[]; // Articles authored/mentioned
  books?: PersonBook[]; // Recommended books
  events?: PersonEvent[]; // Events attended/spoke at
  media?: PersonMedia[]; // Media appearances (videos, podcasts)
  glossaryTerms?: PersonGlossaryTerm[]; // Glossary terms related to person
  
  // Ratings and evaluations
  ratings?: PersonRating[];
  
  // Metadata
  tags?: string[]; // e.g., "privacy", "developer", "researcher"
  organizations?: string[]; // Organizations they're part of
  createdAt?: string;
  updatedAt?: string;
}

export interface PeopleData {
  people: Person[];
}
