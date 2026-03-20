import { getRanks } from "@/queries/ranks.queries";
import {
  Project,
  ProjectRatingItem,
  ProjectRating as ProjectRatingType,
} from "@/types/project";

const RATING_COLORS = [
  "hsl(358, 77%, 30%)",
  "hsl(11, 100%, 30%)",
  "hsl(25, 98%, 30%)",
  "hsl(35, 96%, 30%)",
  "hsl(48, 98%, 30%)",
  "hsl(51, 100%, 30%)",
  "hsl(72, 85%, 30%)",
  "hsl(85, 85%, 30%)",
  "hsl(102, 100%, 30%)",
  "hsl(102, 100%, 30%)",
] as const;

export const getRatingColor = (percentage: number): string => {
  if (percentage === 100) return "hsl(102, 100%, 30%)";
  if (percentage === 0) return "hsl(0, 0%, 30%)";
  const normalized = Math.min(Math.max(percentage, 0), 100);
  const index = Math.floor(normalized / 10);
  return RATING_COLORS[Math.min(index, RATING_COLORS.length - 1)];
};

export const getRatingLabel = (percentage: number): string => {
  if (percentage >= 90) return "Excellent";
  if (percentage >= 80) return "Very Good";
  if (percentage >= 70) return "Good";
  if (percentage >= 60) return "Fair";
  if (percentage >= 50) return "Average";
  if (percentage >= 40) return "Below Average";
  if (percentage >= 30) return "Poor";
  if (percentage >= 20) return "Very Poor";
  if (percentage >= 10) return "Critical";
  return "Failing";
};

const getNestedField = (obj: unknown, path: string): unknown => {
  return path.split(".").reduce((current, key) => {
    if (current && typeof current === "object" && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
};

export const generateProjectRatings = async (
  project: Project
): Promise<ProjectRatingType[]> => {
  const ranks = await getRanks();
  if (!ranks) return [];

  return ranks.map((rank) => {
    let rankPoints = 0;
    let maxPoints = 0;
    const ratingStats: ProjectRatingItem[] = [];

    rank.references?.forEach((ref) => {
      let isValid = false;
      const field = ref.field.includes(".")
        ? getNestedField(project, ref.field)
        : project[ref.field as keyof Project];

      if (
        ref.label.positive === "Link" &&
        ref.label.name !== "Documentation" &&
        (ratingStats.some(
          (r) => r.positive === "Link" && r.label !== "Documentation" && r.value
        ) ||
          !field)
      ) {
        return;
      }

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

      ratingStats.push({
        isValid,
        label: ref.label.name,
        positive: positive ?? ref.label.positive,
        negative: ref.label.negative,
        value,
      });
    });

    return {
      type: rank.id,
      name: rank.name,
      items: ratingStats,
      points: rankPoints,
      percentagePoints: maxPoints > 0 ? (rankPoints / maxPoints) * 100 : 0,
    };
  });
};
