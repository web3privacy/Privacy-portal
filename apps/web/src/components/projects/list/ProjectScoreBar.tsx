import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";

function colorForPercentage(pct: number): string {
  if (pct >= 90) return "#16a34a"; // green
  if (pct >= 80) return "#22c55e";
  if (pct >= 70) return "#84cc16"; // lime
  if (pct >= 60) return "#eab308"; // yellow
  if (pct >= 50) return "#f59e0b"; // amber
  if (pct >= 40) return "#fb923c"; // orange
  if (pct >= 20) return "#ef4444"; // red
  if (pct > 0) return "#b91c1c"; // dark red
  return "rgba(0,0,0,0.18)";
}

function labelForType(type: string): string {
  switch (type) {
    case "openness":
      return "Openness";
    case "technology":
      return "Technology";
    case "privacy":
      return "Privacy";
    default:
      return type;
  }
}

export function ProjectScoreBar({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  const ratings = project.ratings ?? [];
  if (!ratings.length) return null;

  const sorted = ["openness", "technology", "privacy"].map((type) => {
    const found = ratings.find((r) => r.type === type);
    return (
      found ?? {
        type,
        name: labelForType(type),
        percentagePoints: 0,
        points: 0,
        items: [],
      }
    );
  });

  const title = sorted
    .map((r) => `${labelForType(r.type)}: ${r.percentagePoints.toFixed(0)}%`)
    .join(" / ");

  return (
    <div
      className={cn(
        // No outline: just the color segments + white separators (as in the original Explorer).
        "w-full overflow-hidden rounded-full",
        className
      )}
      title={title}
      aria-label={title}
      role="img"
    >
      <div className="grid grid-cols-3">
        {sorted.map((r, idx) => (
          <div
            key={r.type}
            className={cn(
              "h-3",
              idx < sorted.length - 1
                ? "border-r border-white/90 dark:border-black/35"
                : null
            )}
            style={{ background: colorForPercentage(r.percentagePoints) }}
          />
        ))}
      </div>
    </div>
  );
}
