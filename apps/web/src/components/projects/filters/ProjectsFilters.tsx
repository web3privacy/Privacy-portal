"use client";

import { Button } from "@/components/ui/button";
import SearchInput from "@/components/ui/search-input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Link from "next/link";
import CategoryFilter from "./CategoryFilter";
import EcosystemFilter from "./EcosystemFilter";
import UsecaseFilter from "./UsecaseFilter";
import { NAVIGATION_LINKS } from "@/lib/constants";
import { Icon } from "@/components/ui/icon";

interface ProjectsFiltersProps {
  className?: string;
}

const ProjectsFilters: React.FC<ProjectsFiltersProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("relative w-full", className)}>
      {/* Mobile: Collapsible filter panel */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Icon name="tune" size={18} />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-6">
              <div>
                <label className="text-[12px] font-bold uppercase tracking-[0.08em] text-black/60 dark:text-white/60 mb-2 block">
                  Search
                </label>
                <SearchInput />
              </div>
              <div>
                <label className="text-[12px] font-bold uppercase tracking-[0.08em] text-black/60 dark:text-white/60 mb-2 block">
                  Ecosystem
                </label>
                <EcosystemFilter />
              </div>
              <div>
                <label className="text-[12px] font-bold uppercase tracking-[0.08em] text-black/60 dark:text-white/60 mb-2 block">
                  Category
                </label>
                <CategoryFilter />
              </div>
              <div>
                <label className="text-[12px] font-bold uppercase tracking-[0.08em] text-black/60 dark:text-white/60 mb-2 block">
                  Use Case
                </label>
                <UsecaseFilter />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: Horizontal layout - submenu style like Library/Jobs/Glossary, sticky when scrolling */}
      <div className="hidden md:block">
        <div className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-4 rounded-[12px] bg-[#f0f0f0] p-3 dark:bg-[#1a1f27]">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <div className="w-[240px] max-w-full flex-shrink-0">
              <SearchInput />
            </div>
            <EcosystemFilter />
            <CategoryFilter />
            <UsecaseFilter />
          </div>
          <div className="flex shrink-0 items-center gap-4 md:ml-auto">
            <Link
              href={NAVIGATION_LINKS.SCORING_EXTERNAL}
              target="_blank"
              rel="noreferrer"
              className="text-[12px] font-bold uppercase tracking-[0.08em] text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
            >
              Scoring
            </Link>
            <Link
              href={NAVIGATION_LINKS.CONTRIBUTE}
              target="_blank"
              rel="noreferrer"
              className="text-[12px] font-bold uppercase tracking-[0.08em] text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
            >
              Contribute
            </Link>
            <Link
              href={NAVIGATION_LINKS.ADD_PROJECT}
              className="inline-flex h-10 items-center justify-center rounded-full border border-[#70FF88] bg-[#70FF88] px-4 text-[12px] font-bold uppercase tracking-[0.08em] text-black transition-all hover:-translate-y-0.5 hover:bg-[#5bee72]"
            >
              ADD PROJECT
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsFilters;
