/**
 * W3PN org projects loader. Data from data/org/w3pn-projects.
 * Asset paths are prefixed with /org for Next.js public serving.
 *
 * SEPARATION FROM EXPLORER:
 * - Explorer (portal) uses: data/explorer-data/index.json, /api/projects, and
 *   /project-assets/projects/{id}/{file} (from public/project-assets/).
 * - Org web uses ONLY: this module (data/org/w3pn-projects/*.json) and
 *   /org/assets/projects/* (from public/org/assets/projects/).
 * Do not mix these: org project IDs (e.g. "academy", "privacy-explorer") and
 * explorer project IDs (e.g. "presearch", "nemi") are different datasets.
 */

import projectsData from "@/data/org/w3pn-projects/projects.json";
import detailsData from "@/data/org/w3pn-projects/details.json";

const ORG_BASE = "/org";

const CATEGORY_ORDER = ["infrastructure", "education", "tools", "research", "media"] as const;
const CATEGORY_LABELS: Record<string, string> = {
  infrastructure: "INFRASTRUCTURE",
  education: "EDUCATION",
  tools: "TOOLS",
  research: "RESEARCH",
  media: "MEDIA",
};

const ID_TO_CATEGORY: Record<string, string> = {
  "privacy-explorer": "infrastructure",
  "privacy-portal": "infrastructure",
  "join-in-privacy": "infrastructure",
  academy: "education",
  "personal-stacks": "education",
  "hackathon-pack": "education",
  ideas: "tools",
  scoring: "tools",
  "blur-tool": "tools",
  "privacy-audits": "tools",
  "privacy-ecosystem-report": "research",
  "annual-report": "research",
  pagency: "research",
  hiring: "research",
  "privacy-guides": "research",
  "usecase-db": "research",
  "zk-solutions": "research",
  newsletter: "media",
  "privacy-tech-awards": "media",
  radio: "media",
  jobs: "media",
};

const PROJECT_ICONS: Record<string, string> = {
  "privacy-explorer": `${ORG_BASE}/assets/projects/explorer-logo.svg`,
  "privacy-portal": `${ORG_BASE}/assets/projects/portal-logo.svg`,
  "join-in-privacy": `${ORG_BASE}/assets/projects/portal-logo.svg`,
  academy: `${ORG_BASE}/assets/projects/academy-logo.svg`,
  "personal-stacks": `${ORG_BASE}/assets/projects/personal-stacks-logo.svg`,
  "hackathon-pack": `${ORG_BASE}/assets/projects/hackathon-pack-logo.svg`,
  "privacy-tech-awards": `${ORG_BASE}/assets/projects/privacy-awards-logo.svg`,
};

type Project = { id: string; icon?: string; category?: string; order?: number; [k: string]: unknown };

function mapCategory(p: Project): string {
  return ID_TO_CATEGORY[p.id] ?? (CATEGORY_ORDER.includes(p.category as any) ? (p.category as string) : "research");
}

function withResolvedIcon(p: Project): Project {
  const icon = p.icon ?? PROJECT_ICONS[p.id] ?? `${ORG_BASE}/assets/projects/explorer-logo.svg`;
  return { ...p, icon };
}

const projects: Project[] = (projectsData as Project[])
  .map((p) => ({ ...p, category: mapCategory(p) }))
  .map(withResolvedIcon)
  .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

export function getProjects(): Project[] {
  return projects;
}

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function getProjectDetail(id: string): Record<string, unknown> | null {
  return (detailsData as Record<string, Record<string, unknown>>)[id] ?? null;
}

export function getProjectsByCategory(): Map<string, Project[]> {
  const byCategory = new Map<string, Project[]>();
  for (const cat of CATEGORY_ORDER) {
    byCategory.set(cat, projects.filter((p) => p.category === cat));
  }
  return byCategory;
}

export function getCategoryOrder(): readonly string[] {
  return CATEGORY_ORDER;
}

export function getCategoryLabel(cat: string): string {
  return CATEGORY_LABELS[cat] ?? cat;
}
