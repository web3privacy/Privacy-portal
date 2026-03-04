/** Idea from community, expert, or organization source (matches privacy-idea-generator repo) */
export type IdeaType = "community" | "expert" | "organization";

export type Idea = {
  id?: string;
  name: string;
  description: string;
  categories: string[];
  author?: string;
  organization?: string;
  organizationName?: string;
  organizationLogo?: string;
  github?: string;
  website?: string;
  event?: string;
  featured?: boolean;
  features?: string[];
};

export const IDEA_CATEGORIES = [
  "Privacy",
  "DeFi",
  "Identity",
  "Communication",
  "Infrastructure",
  "AI",
  "Storage",
  "Security",
  "Wallet",
  "R&D",
  "Social",
  "Voting",
  "Gaming",
  "Auth",
  "Payments",
  "Collaboration",
  "Whistleblowing",
  "DID",
  "Credentials",
  "Marketing",
  "Health",
  "Charity",
  "DAO",
  "Token",
  "Computation",
  "Blockchain",
  "Networking",
  "Finance",
  "Machine Learning",
  "Genomics",
  "Auction",
  "Loyalty Program",
  "Communications",
  "Music",
  "ZK",
  "Email",
  "GDPR",
  "eDiscovery",
  "Domain",
  "Nodes",
  "RPC",
  "Hacktivism",
  "Censorship-Resistance",
  "Reputation",
  "Hiring",
  "Bug bounty",
  "Frontend",
  "Data",
  "Programming",
  "Dating",
  "Calendar",
  "Project management",
  "MEV",
  "Sybil resistance",
  "Coordination",
  "Groups",
  "P2P",
  "Education",
  "Media",
  "Fitness",
  "Defi",
  "Socials",
  "Credit scoring",
  "Wallets",
  "Home security",
  "Indexing",
] as const;

export type IdeaCategory = (typeof IDEA_CATEGORIES)[number];

export function ideaId(idea: Idea, type: IdeaType, index: number): string {
  return idea.id ?? `${type}-${slug(idea.name)}-${index}`;
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "idea";
}
