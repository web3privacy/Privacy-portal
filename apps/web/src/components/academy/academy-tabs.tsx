"use client";

import type { AcademyContentType } from "@/types/academy";

type Props = {
  activeTab: AcademyContentType;
  onTabChange: (tab: AcademyContentType) => void;
};

const TABS: { value: AcademyContentType; label: string }[] = [
  { value: "all", label: "ALL CONTENT" },
  { value: "talks", label: "TALKS" },
  { value: "courses", label: "COURSES" },
  { value: "quizes", label: "QUIZEZ" },
  { value: "guides", label: "GUIDES" },
  { value: "podcast", label: "PODCAST" },
  { value: "radio", label: "RADIO" },
];

export function AcademyTabs({ activeTab, onTabChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onTabChange(tab.value)}
          className={`rounded-[8px] px-4 py-2 text-[12px] font-bold uppercase tracking-[0.08em] transition-colors ${
            activeTab === tab.value
              ? "bg-black text-white dark:bg-white dark:text-black"
              : "bg-white text-[#616161] hover:text-black dark:bg-[#181d25] dark:text-[#a7b0bd] dark:hover:text-white"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
