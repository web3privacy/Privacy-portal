const GITHUB_API = "https://api.github.com";
const ORG = "web3privacy";
const CACHE_KEY = "w3pn_github_community_v3";
const CACHE_TTL_MS = 1000 * 60 * 60 * 12;

export interface GitHubCommunityMember {
  login: string;
  avatarUrl: string;
  profileUrl: string;
}

async function fetchJson<T = unknown>(url: string, headers: Record<string, string> = {}): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      ...headers,
    },
  });
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

function addUser(
  collection: Map<string, GitHubCommunityMember & { score: number }>,
  user: { login?: string; avatar_url?: string; html_url?: string },
  scoreBoost: number
) {
  if (!user?.login || !user?.avatar_url || !user?.html_url) return;
  const existing = collection.get(user.login);
  if (existing) {
    existing.score += scoreBoost;
    return;
  }
  collection.set(user.login, {
    login: user.login,
    avatarUrl: user.avatar_url,
    profileUrl: user.html_url,
    score: scoreBoost,
  });
}

function readCache(): GitHubCommunityMember[] {
  if (typeof window === "undefined") return [];
  try {
    const payload = JSON.parse(window.localStorage.getItem(CACHE_KEY) ?? "{}");
    if (!payload?.expiresAt || !Array.isArray(payload?.items)) return [];
    if (Date.now() > payload.expiresAt) return [];
    return payload.items;
  } catch {
    return [];
  }
}

function writeCache(items: GitHubCommunityMember[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        expiresAt: Date.now() + CACHE_TTL_MS,
        items,
      })
    );
  } catch {
    // noop
  }
}

export async function getGitHubCommunityMembers(limit = 280): Promise<GitHubCommunityMember[]> {
  if (typeof window === "undefined") return [];
  const cached = readCache();
  if (cached.length) return cached.slice(0, limit);

  try {
    const users = new Map<string, GitHubCommunityMember & { score: number }>();
    const repos = await fetchJson<Array<{ name: string; fork: boolean }>>(
      `${GITHUB_API}/orgs/${ORG}/repos?sort=updated&per_page=8&type=public`
    );
    const repoNames = repos.filter((r) => !r.fork).slice(0, 6).map((r) => r.name);

    const membersRequest = fetchJson<Array<{ login: string; avatar_url: string; html_url: string }>>(
      `${GITHUB_API}/orgs/${ORG}/members?per_page=100`
    );
    const contributorRequests = repoNames.map((repoName) =>
      fetchJson<Array<{ user?: { login: string; avatar_url: string; html_url: string }; login?: string; avatar_url?: string; html_url?: string; contributions?: number }>>(
        `${GITHUB_API}/repos/${ORG}/${repoName}/contributors?per_page=100`
      ).catch(() => [])
    );
    const stargazerRequests = repoNames.slice(0, 3).map((repoName) =>
      fetchJson<Array<{ user?: { login: string; avatar_url: string; html_url: string }; login?: string; avatar_url?: string; html_url?: string }>>(
        `${GITHUB_API}/repos/${ORG}/${repoName}/stargazers?per_page=100`,
        { Accept: "application/vnd.github.star+json" }
      ).catch(() => [])
    );

    const [members, ...collections] = await Promise.all([
      membersRequest,
      ...contributorRequests,
      ...stargazerRequests,
    ]);

    members.forEach((member) => addUser(users, member, 10));
    collections.forEach((group) => {
      group.forEach((entry) => {
        const user = entry?.user ?? entry;
        const score = typeof (entry as { contributions?: number }).contributions === "number"
          ? Math.max(1, (entry as { contributions: number }).contributions)
          : 1;
        addUser(users, user, score);
      });
    });

    const result = Array.from(users.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ score: _s, ...rest }) => rest);

    writeCache(result);
    return result;
  } catch {
    return [];
  }
}
