import type { PopularTool, Stack, ToolDetail, Tools } from "@/types";
import { basePath } from "@/lib/utils";

const CATEGORY_LABELS: Record<string, string> = {
  OS_Mobile: "Operating system",
  OS_Desktop: "Operating system",
  Browser_Desktop: "Browser",
  Browser_Mobile: "Browser",
  Phone: "Phone OS",
  Password: "Password manager",
  Download_Self_Hosted: "Self-hostable LLMs",
  Self_Hosted_LLM: "Self-Hosted LLMs",
  Wallet: "Wallet",
  Docs: "Docs",
  Messenger: "Messenger",
  Search: "Search",
};

const SUMMARY_LABELS: Record<string, string> = {
  Operating_system: "Operation System",
  Operating_systems: "Operation System",
  Operating_system_mobile: "Operation System",
  Operating_system_desktop: "Operation System",
  Operating_system_mobile_desktop: "Operation System",
  Operating_system_mobile_and_desktop: "Operation System",
  Operating_system_desktop_and_mobile: "Operation System",
  Operating_system_mobile_or_desktop: "Operation System",
};

const SUMMARY_PRIORITY = ["Wallet", "Operation System", "Docs", "Phone OS"];

const ROLE_MATCHERS: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /founder|co-?founder/i, label: "Founder" },
  { pattern: /developer|engineer/i, label: "Developer" },
  { pattern: /research|scientist/i, label: "Researcher" },
  { pattern: /minister|ambassador|policy|public/i, label: "Public" },
  { pattern: /dao|contributor|builder/i, label: "Contributor" },
];

export type StackToolEntry = {
  categoryKey: string;
  categoryLabel: string;
  tools: ToolDetail[];
};

export type CategoryPopularity = {
  categoryKey: string;
  categoryLabel: string;
  totalVotes: number;
  tools: Array<ToolDetail & { count: number }>;
};

export type CategoryToolUsage = {
  name: string;
  count: number;
  avatars: string[];
  detail: ToolDetail;
};

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function findToolDetail(
  categoryKey: string,
  toolName: string,
  tools: Tools
): ToolDetail | undefined {
  const categoryTools = tools[categoryKey];

  if (!categoryTools) {
    return undefined;
  }

  if (categoryTools[toolName]) {
    return categoryTools[toolName];
  }

  const normalized = normalize(toolName);
  return Object.values(categoryTools).find(
    (detail) => normalize(detail.name) === normalized
  );
}

function getSummaryCategoryLabelFromLabel(label: string): string {
  const key = label.replace(/\s+/g, "_");
  return SUMMARY_LABELS[key] ?? label;
}

export function getCategoryLabel(categoryKey: string): string {
  return CATEGORY_LABELS[categoryKey] ?? categoryKey.replace(/_/g, " ");
}

export function getToolImageSrc(image?: string): string {
  if (image?.startsWith("http://") || image?.startsWith("https://") || image?.startsWith("/")) {
    return image;
  }

  return image && image.length > 0
    ? `${basePath}/images/icons/${image}`
    : `${basePath}/images/icons/placeholder.png`;
}

export function getAvatarSrc(avatar: string): string {
  return avatar.startsWith("http")
    ? avatar
    : `${basePath}/images/pfp/${avatar}`;
}

export function getStackRoleTags(stack: Stack): string[] {
  const org = stack.org;
  const tags = ROLE_MATCHERS.filter((item) => item.pattern.test(org)).map(
    (item) => item.label
  );

  if (tags.length > 0) {
    return Array.from(new Set(tags)).slice(0, 2);
  }

  if (stack.id === "vitalik") {
    return ["Developer", "Founder"];
  }

  return ["Expert"];
}

export function getStackToolEntries(stack: Stack, tools: Tools): StackToolEntry[] {
  return Object.entries(stack.tools).map(([categoryKey, rawValue]) => {
    const names = Array.isArray(rawValue) ? rawValue : [rawValue];
    const resolvedTools = names.map((name) => {
      const detail = findToolDetail(categoryKey, name, tools);

      if (detail) {
        return detail;
      }

      return {
        name,
        url: "#",
      };
    });

    return {
      categoryKey,
      categoryLabel: getCategoryLabel(categoryKey),
      tools: resolvedTools,
    };
  });
}

export function getCategoryPopularity(
  tools: Tools,
  stacks: Stack[],
  take = 4
): CategoryPopularity[] {
  const grouped = new Map<
    string,
    {
      categoryKey: string;
      toolMap: Map<string, { detail: ToolDetail; count: number }>;
      totalVotes: number;
    }
  >();

  for (const categoryKey of Object.keys(tools)) {
    const usage = getCategoryToolUsage(categoryKey, tools, stacks);

    if (usage.length < 2) {
      continue;
    }

    const baseLabel = getCategoryLabel(categoryKey);
    const categoryLabel = getSummaryCategoryLabelFromLabel(baseLabel);

    if (!grouped.has(categoryLabel)) {
      grouped.set(categoryLabel, {
        categoryKey,
        toolMap: new Map(),
        totalVotes: 0,
      });
    }

    const group = grouped.get(categoryLabel);

    if (!group) {
      continue;
    }

    for (const item of usage) {
      group.totalVotes += item.count;
      const toolKey = normalize(item.detail.name);
      const existing = group.toolMap.get(toolKey);

      if (existing) {
        existing.count += item.count;
      } else {
        group.toolMap.set(toolKey, {
          detail: item.detail,
          count: item.count,
        });
      }
    }
  }

  const results: CategoryPopularity[] = Array.from(grouped.entries()).map(
    ([categoryLabel, group]) => ({
      categoryKey: group.categoryKey,
      categoryLabel,
      totalVotes: group.totalVotes,
      tools: Array.from(group.toolMap.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
        .map((item) => ({
          ...item.detail,
          count: item.count,
        })),
    })
  );

  return results
    .sort((a, b) => {
      const ai = SUMMARY_PRIORITY.indexOf(a.categoryLabel);
      const bi = SUMMARY_PRIORITY.indexOf(b.categoryLabel);

      if (ai !== -1 || bi !== -1) {
        if (ai === -1) {
          return 1;
        }
        if (bi === -1) {
          return -1;
        }
        return ai - bi;
      }

      if (b.totalVotes !== a.totalVotes) {
        return b.totalVotes - a.totalVotes;
      }

      return a.categoryLabel.localeCompare(b.categoryLabel);
    })
    .slice(0, take);
}

export function getCategoryToolUsage(
  categoryKey: string,
  tools: Tools,
  stacks: Stack[]
): CategoryToolUsage[] {
  const usage = new Map<
    string,
    { count: number; avatars: string[]; detail: ToolDetail }
  >();

  for (const stack of stacks) {
    const rawValue = stack.tools[categoryKey];

    if (!rawValue) {
      continue;
    }

    const names = Array.isArray(rawValue) ? rawValue : [rawValue];
    const seenInStack = new Set<string>();

    for (const name of names) {
      const detail = findToolDetail(categoryKey, name, tools) ?? {
        name,
        url: "#",
      };
      const key = normalize(detail.name);

      if (seenInStack.has(key)) {
        continue;
      }

      seenInStack.add(key);

      const existing = usage.get(key);
      if (existing) {
        existing.count += 1;
        existing.avatars.push(getAvatarSrc(stack.avatar));
      } else {
        usage.set(key, {
          count: 1,
          avatars: [getAvatarSrc(stack.avatar)],
          detail,
        });
      }
    }
  }

  return Array.from(usage.values())
    .map((item) => ({
      name: item.detail.name,
      count: item.count,
      avatars: item.avatars,
      detail: item.detail,
    }))
    .sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }

      return a.name.localeCompare(b.name);
    });
}

export function toCategoryRoute(categoryKey: string): string {
  return `/categories/${encodeURIComponent(categoryKey)}`;
}

export function getMostPopularTools(tools: Tools, stacks: Stack[], take = 10): PopularTool[] {
  const usage = new Map<string, { detail: ToolDetail; count: number }>();

  for (const stack of stacks) {
    const seenInStack = new Set<string>();

    for (const [categoryKey, rawValue] of Object.entries(stack.tools)) {
      const names = Array.isArray(rawValue) ? rawValue : [rawValue];

      for (const name of names) {
        const detail = findToolDetail(categoryKey, name, tools) ?? {
          name,
          url: "#",
        };
        const key = normalize(detail.name);

        if (seenInStack.has(key)) {
          continue;
        }

        seenInStack.add(key);

        const existing = usage.get(key);
        if (existing) {
          existing.count += 1;
        } else {
          usage.set(key, {
            detail,
            count: 1,
          });
        }
      }
    }
  }

  return Array.from(usage.entries())
    .map(([key, value]) => ({
      key,
      name: value.detail.name,
      url: value.detail.url,
      image: value.detail.image,
      count: value.count,
    }))
    .sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }
      return a.name.localeCompare(b.name);
    })
    .slice(0, take);
}
