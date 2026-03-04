"use client";

import type { Idea } from "@/types/ideas";

type Props = {
  idea: Idea;
  onSelect?: () => void;
};

export function IdeaCard({ idea, onSelect }: Props) {
  const eventOrOrg = idea.event ?? idea.organizationName ?? idea.organization;

  return (
    <article
      className="group rounded-[12px] border border-[#e0e0e0] bg-white p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.14)] dark:border-[#303640] dark:bg-[#181d25] dark:hover:shadow-[0_14px_30px_rgba(0,0,0,0.55)]"
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect?.();
        }
      }}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
    >
      <h3 className="font-serif text-[18px] font-bold leading-tight text-black dark:text-[#f2f4f6]">
        {idea.name}
      </h3>
      <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-[#616161] dark:text-[#a7b0bd]">
        {idea.description}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {(idea.categories ?? []).slice(0, 4).map((c) => (
          <span
            key={c}
            className="rounded-full bg-[#e8e8e8] px-2 py-0.5 text-[11px] font-medium text-[#616161] dark:bg-[#2a3039] dark:text-[#a7b0bd]"
          >
            {c}
          </span>
        ))}
        {eventOrOrg && (
          <span className="text-[11px] text-[#616161] dark:text-[#a7b0bd]">
            {eventOrOrg}
          </span>
        )}
        <div className="ml-auto flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          {idea.website && (
            <a
              href={idea.website}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-[8px] px-2 py-1 text-[12px] text-[#606060] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#f7f7f7] dark:text-[#9ca5b3] dark:hover:bg-white/10"
              aria-label="Website"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="material-symbols-rounded text-[16px]">language</span>
            </a>
          )}
          {idea.github && (
            <a
              href={idea.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-[8px] px-2 py-1 text-[12px] text-[#606060] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#f7f7f7] dark:text-[#9ca5b3] dark:hover:bg-white/10"
              aria-label="GitHub"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="material-symbols-rounded text-[16px]">share</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
