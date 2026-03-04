import type { Project } from "@/types/project";
import { generateProjectRatings, getRatingColor, getRatingLabel } from "@/lib/ratings";

const ORDER = ["openness", "technology", "privacy"] as const;

export async function ProjectScoreSummary({ project }: { project: Project }) {
  const ratings = await generateProjectRatings(project);

  if (!ratings.length) return null;

  return (
    <div className="w-full max-w-[360px]">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-black/55 dark:text-white/55">
          Web3Privacy scoring
        </span>
        <span className="text-[12px] text-black/45 dark:text-white/45">Learn more</span>
      </div>

      <div className="mt-4 space-y-3">
        {ORDER.map((type) => {
          const rating = ratings.find((r) => r.type?.toLowerCase() === type);
          const pct = rating?.percentagePoints ?? 0;
          const color = getRatingColor(pct);
          const label = getRatingLabel(pct);
          const name = rating?.name ?? type;

          return (
            <div key={type} className="grid grid-cols-[110px_1fr] items-center gap-3">
              <div className="text-[12px] font-bold uppercase tracking-[0.08em] text-black/60 dark:text-white/60">
                {name}
              </div>
              <div className="flex items-center gap-3">
                <div className="h-[8px] w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/15">
                  <div className="h-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                </div>
                <div className="shrink-0 text-[12px] font-semibold text-black/70 dark:text-white/70">
                  {pct.toFixed(0)}% <span className="text-black/45 dark:text-white/45">({label})</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

