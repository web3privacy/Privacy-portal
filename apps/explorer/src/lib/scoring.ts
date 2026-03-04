import type { Project, ProjectRating, ProjectRatingItem } from "@/types/project";

export type RankRef = {
  field: string;
  label: {
    name: string;
    positive: string;
    negative: string;
  };
  condition: {
    minLength?: number;
    equals?: unknown;
    exists?: boolean;
  };
  points: number;
};

export type Rank = {
  id: string;
  name: string;
  references?: RankRef[];
};

const getNestedField = (obj: unknown, path: string): unknown => {
  return path.split(".").reduce((current, key) => {
    if (current && typeof current === "object" && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
};

export function computeProjectRatings(
  project: Project,
  ranks: Rank[]
): { ratings: ProjectRating[]; percentage: number } {
  let totalPoints = 0;
  let totalMaxPoints = 0;

  const ratings: ProjectRating[] = ranks.map((rank) => {
    let rankPoints = 0;
    let maxPoints = 0;
    const items: ProjectRatingItem[] = [];

    for (const ref of rank.references ?? []) {
      const field = ref.field.includes(".")
        ? getNestedField(project, ref.field)
        : (project as unknown as Record<string, unknown>)[ref.field];

      // Match the legacy Explorer scoring behavior:
      // - only count at most one non-doc "Link" ref (twitter/discord/etc)
      // - do not penalize missing non-doc social links (skip ref entirely)
      if (ref.label.positive === "Link" && ref.label.name !== "Documentation") {
        const alreadyHasSocialLink = items.some(
          (r) =>
            r.positive === "Link" &&
            r.label !== "Documentation" &&
            Boolean(r.value)
        );
        if (alreadyHasSocialLink || !field) {
          continue;
        }
      }

      let isValid = false;
      let value = 0;
      let positive: string | undefined;

      if (ref.condition.minLength !== undefined) {
        value = Array.isArray(field) ? field.length : 0;
        if (value) {
          isValid = value >= ref.condition.minLength;
          positive = `${value} ${ref.label.positive}${value > 1 ? "s" : ""}`;
        }
      } else if (ref.condition.equals !== undefined) {
        value = field ? 1 : 0;
        isValid = field === ref.condition.equals;
      } else if (ref.condition.exists !== undefined) {
        value = field ? 1 : 0;
        isValid = ref.condition.exists ? !!field : !field;
      }

      if (ref.field === "compliance" && typeof field === "string") {
        positive = field;
      }

      rankPoints += isValid ? ref.points : 0;
      maxPoints += ref.points;

      items.push({
        isValid,
        label: ref.label.name,
        positive: positive ?? ref.label.positive,
        negative: ref.label.negative,
        value,
      });
    }

    totalPoints += rankPoints;
    totalMaxPoints += maxPoints;

    return {
      type: rank.id,
      name: rank.name,
      items,
      points: rankPoints,
      percentagePoints: maxPoints > 0 ? (rankPoints / maxPoints) * 100 : 0,
    };
  });

  return {
    ratings,
    percentage: totalMaxPoints > 0 ? (totalPoints / totalMaxPoints) * 100 : 0,
  };
}

export function isRankArray(value: unknown): value is Rank[] {
  if (!Array.isArray(value)) return false;
  return value.every((rank) => {
    if (!rank || typeof rank !== "object") return false;
    const r = rank as Record<string, unknown>;
    if (typeof r.id !== "string" || typeof r.name !== "string") return false;
    if (r.references === undefined) return true;
    if (!Array.isArray(r.references)) return false;
    return true;
  });
}
