"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { IdeaWithSource } from "@/lib/ideas";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  idea: IdeaWithSource | null;
  onRegenerate: () => void;
};

export function GeneratedIdeaDialog({
  open,
  onOpenChange,
  idea,
  onRegenerate,
}: Props) {
  if (!idea) return null;

  const eventOrOrg = idea.event ?? idea.organizationName ?? idea.organization;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-white dark:bg-[#181d25]">
        <DialogHeader>
          <DialogTitle className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#616161] dark:text-[#a7b0bd]">
            Generated idea
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <h3 className="font-serif text-[22px] font-bold leading-tight text-black dark:text-[#f2f4f6]">
            {idea.name}
          </h3>
          <p className="text-[15px] leading-relaxed text-[#616161] dark:text-[#a7b0bd]">
            {idea.description}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {(idea.categories ?? []).map((c) => (
              <span
                key={c}
                className="rounded-full bg-[#e8e8e8] px-2.5 py-0.5 text-[12px] font-medium text-[#616161] dark:bg-[#2a3039] dark:text-[#a7b0bd]"
              >
                {c}
              </span>
            ))}
            {eventOrOrg && (
              <span className="text-[12px] text-[#616161] dark:text-[#a7b0bd]">
                {eventOrOrg}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between gap-2 pt-2">
            <div className="flex items-center gap-2">
              {idea.website && (
                <a
                  href={idea.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#70FF88] hover:underline"
                  aria-label="Website"
                >
                  <span className="material-symbols-rounded text-[20px]">
                    language
                  </span>
                </a>
              )}
              {idea.github && (
                <a
                  href={idea.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#70FF88] hover:underline"
                  aria-label="GitHub"
                >
                  <span className="material-symbols-rounded text-[20px]">
                    code
                  </span>
                </a>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                onRegenerate();
              }}
              className="rounded-[10px] bg-[#70FF88] px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.08em] text-black transition-all hover:-translate-y-0.5 hover:bg-[#5bee72]"
            >
              Regenerate
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
