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

      {/* Desktop: Horizontal layout */}
      <div className="hidden md:block">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[16px] bg-black/[0.03] px-4 py-3 dark:bg-white/[0.04]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-[260px] flex-shrink-0">
              <SearchInput />
            </div>
            <EcosystemFilter />
            <CategoryFilter />
            <UsecaseFilter />
          </div>
          <div className="flex items-center gap-6 text-[12px] font-bold uppercase tracking-[0.08em] text-black/60 dark:text-white/60">
            <Link
              href={NAVIGATION_LINKS.SCORING_EXTERNAL}
              target="_blank"
              rel="noreferrer"
              className="hover:text-black dark:hover:text-white"
            >
              Scoring
            </Link>
            <Link
              href={NAVIGATION_LINKS.CONTRIBUTE}
              target="_blank"
              rel="noreferrer"
              className="hover:text-black dark:hover:text-white"
            >
              Contribute
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsFilters;
