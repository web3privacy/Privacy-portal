"use client";

import { useQueryState } from "nuqs";
import { projectsSearchParams } from "@/types/projectFilters";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

export function ViewToggle() {
  const [view, setView] = useQueryState(
    "view",
    projectsSearchParams.view.withOptions({ shallow: false })
  );

  return (
    <div className="inline-flex overflow-hidden rounded-[10px] border border-black/15 bg-white dark:bg-[#151a21] dark:border-white/15">
      <button
        type="button"
        onClick={() => setView("cards")}
        className={cn(
          "flex h-10 w-10 items-center justify-center transition-colors",
          view === "cards"
            ? "bg-black text-white dark:bg-white dark:text-black"
            : "text-black/70 hover:text-black hover:bg-black/5 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10"
        )}
        aria-pressed={view === "cards"}
        aria-label="Cards view"
      >
        <Icon name="grid_view" size={20} filled={view === "cards"} />
      </button>
      <button
        type="button"
        onClick={() => setView("rows")}
        className={cn(
          "flex h-10 w-10 items-center justify-center transition-colors",
          view === "rows"
            ? "bg-black text-white dark:bg-white dark:text-black"
            : "text-black/70 hover:text-black hover:bg-black/5 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/10"
        )}
        aria-pressed={view === "rows"}
        aria-label="Rows view"
      >
        <Icon name="view_agenda" size={20} filled={view === "rows"} />
      </button>
    </div>
  );
}
