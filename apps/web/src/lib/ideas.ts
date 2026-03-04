import type { Idea, IdeaType } from "@/types/ideas";

const IDEAS_STORAGE_KEY = "privacy-portal-ideas-user";

export type IdeaWithSource = Idea & { source: IdeaType; index: number };

export async function loadIdeas(): Promise<Record<IdeaType, Idea[]>> {
  const [community, expert, organization] = await Promise.all([
    fetch("/data/ideas/community-ideas.json").then((r) => r.json() as Promise<Idea[]>),
    fetch("/data/ideas/expert-ideas.json").then((r) => r.json() as Promise<Idea[]>),
    fetch("/data/ideas/organization-ideas.json").then((r) => r.json() as Promise<Idea[]>),
  ]);
  return { community, expert, organization };
}

export function loadUserIdeas(): Idea[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(IDEAS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Idea[];
  } catch {
    return [];
  }
}

export function saveUserIdeas(ideas: Idea[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(IDEAS_STORAGE_KEY, JSON.stringify(ideas));
  } catch {
    // ignore
  }
}

export function addUserIdea(idea: Idea): void {
  const list = loadUserIdeas();
  list.unshift({ ...idea, id: `user-${Date.now()}` });
  saveUserIdeas(list);
}

export function allCategories(ideas: Record<IdeaType, Idea[]>, userIdeas: Idea[]): string[] {
  const set = new Set<string>();
  for (const list of Object.values(ideas)) {
    for (const i of list) i.categories?.forEach((c) => set.add(c));
  }
  for (const i of userIdeas) i.categories?.forEach((c) => set.add(c));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export function pickRandomIdea(
  ideas: Record<IdeaType, Idea[]>,
  userIdeas: Idea[],
  typeFilter?: IdeaType | null,
  tagFilter?: string[] | null
): IdeaWithSource | null {
  const withSource: IdeaWithSource[] = [];
  const types: IdeaType[] = typeFilter ? [typeFilter] : ["community", "expert", "organization"];
  for (const t of types) {
    const list = ideas[t] ?? [];
    list.forEach((idea, index) => {
      if (tagFilter?.length && !tagFilter.some((tag) => idea.categories?.includes(tag))) return;
      withSource.push({ ...idea, source: t, index });
    });
  }
  userIdeas.forEach((idea, index) => {
    if (typeFilter && typeFilter !== "community") return;
    if (tagFilter?.length && !tagFilter.some((tag) => idea.categories?.includes(tag))) return;
    withSource.push({ ...idea, source: "community", index: -1 - index });
  });
  if (withSource.length === 0) return null;
  const i = Math.floor(Math.random() * withSource.length);
  return withSource[i] ?? null;
}

export function getFeaturedOrganisations(
  ideas: Record<IdeaType, Idea[]>
): { name: string; logo?: string; count: number }[] {
  const byOrg = new Map<string, { logo?: string; count: number }>();
  const orgIdeas = ideas.organization ?? [];
  for (const idea of orgIdeas) {
    const name = idea.organizationName ?? idea.organization ?? "Other";
    const cur = byOrg.get(name) ?? { logo: idea.organizationLogo, count: 0 };
    cur.count += 1;
    if (idea.organizationLogo) cur.logo = idea.organizationLogo;
    byOrg.set(name, cur);
  }
  return Array.from(byOrg.entries())
    .map(([name, { logo, count }]) => ({ name, logo, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}
