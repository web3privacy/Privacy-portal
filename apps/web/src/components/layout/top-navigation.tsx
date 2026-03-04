"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { getNavItems, PortalHeader } from "@web3privacy/portal-ui";

type TopNavigationProps = {
  active?: "stacks" | "categories";
  rightSlot?: ReactNode;
};

type SubNavigationProps = {
  backHref: string;
  backLabel: string;
  rightSlot?: ReactNode;
  backMode?: "link" | "history";
};

export function TopNavigation({ active, rightSlot }: TopNavigationProps) {
  const navItems = getNavItems("unified");

  return (
    <header className="relative z-50 border-b border-[#d8d8d8] bg-white dark:border-[#2c3139] dark:bg-[#151a21]">
      <PortalHeader
        activeId={active}
        navItems={navItems}
        rightSlot={rightSlot}
      />
    </header>
  );
}

export function SubNavigation({
  backHref,
  backLabel,
  rightSlot,
  backMode = "link",
}: SubNavigationProps) {
  const router = useRouter();

  return (
    <div className="border-b border-[#d8d8d8] bg-white dark:border-[#2c3139] dark:bg-[#151a21]">
      <div className="viewport-range-shell mx-auto flex min-h-[56px] w-full max-w-[1140px] items-center justify-between gap-3 px-4 py-2 md:min-h-[67px] md:px-6 lg:max-w-[75vw]">
        {backMode === "history" ? (
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 rounded-[8px] px-2 py-1 text-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-black/5 dark:text-[#f2f4f6] dark:hover:bg-white/10"
          >
            <span className="material-symbols-rounded text-[22px] leading-none md:text-[26px]">
              arrow_back
            </span>
            <span className="font-serif text-[12px] leading-none md:text-[18px]">{backLabel}</span>
          </button>
        ) : (
          <Link
            href={backHref}
            className="flex items-center gap-2 rounded-[8px] px-2 py-1 text-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-black/5 dark:text-[#f2f4f6] dark:hover:bg-white/10"
          >
            <span className="material-symbols-rounded text-[22px] leading-none md:text-[26px]">
              arrow_back
            </span>
            <span className="font-serif text-[12px] leading-none md:text-[18px]">{backLabel}</span>
          </Link>
        )}
        <div className="flex items-center gap-4 text-[12px] font-bold uppercase tracking-[0.05em] text-black md:gap-8 md:text-[14px] dark:text-[#f2f4f6]">
          {rightSlot}
        </div>
      </div>
    </div>
  );
}
