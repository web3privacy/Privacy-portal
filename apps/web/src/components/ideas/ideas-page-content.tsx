"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Idea, IdeaType } from "@/types/ideas";
import {
  loadIdeas,
  loadUserIdeas,
  allCategories,
  pickRandomIdea,
  getFeaturedOrganisations,
  type IdeaWithSource,
} from "@/lib/ideas";
import { AddIdeaForm } from "./AddIdeaForm";
import { GeneratedIdeaDialog } from "./GeneratedIdeaDialog";
import { IdeaCard } from "./IdeaCard";
import { FilterDropdown } from "@/components/ui/filter-dropdown";

const TAB_LABELS: Record<IdeaType, string> = {
  community: "Community ideas",
  expert: "Expert ideas",
  organization: "Organisation ideas",
};

export function IdeasPageContent() {
  const [ideas, setIdeas] = useState<Record<IdeaType, Idea[]>>({
    community: [],
    expert: [],
    organization: [],
  });
  const [userIdeas, setUserIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<IdeaType | "">("");
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<IdeaType>("community");
  const [organizationFilter, setOrganizationFilter] = useState<string>("");
  const [failedLogos, setFailedLogos] = useState<Set<string>>(new Set());
  const [addOpen, setAddOpen] = useState(false);
  const [generatedIdea, setGeneratedIdea] = useState<IdeaWithSource | null>(null);
  const [generatedOpen, setGeneratedOpen] = useState(false);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadIdeas()
      .then((data) => {
        if (!cancelled) setIdeas(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setUserIdeas(loadUserIdeas());
  }, [addOpen]);

  // Parallax effect for hero background
  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      rafRef.current = requestAnimationFrame(() => {
        if (!backgroundRef.current) return;
        const scrollY = window.scrollY;
        // Jemný vertikální posun - pohybuje se pomaleji než scroll
        const parallaxOffset = scrollY * 0.15;
        // Použijeme background-position pro plynulejší efekt, zarovnáno na bottom
        backgroundRef.current.style.backgroundPosition = `center calc(100% + ${parallaxOffset}px)`;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const tagOptions = useMemo(
    () => allCategories(ideas, userIdeas).map((tag) => ({ value: tag, label: tag })),
    [ideas, userIdeas]
  );

  const typeOptions = useMemo(
    () => [
      { value: "community", label: "Community" },
      { value: "expert", label: "Expert" },
      { value: "organization", label: "Organisation" },
    ],
    []
  );

  const showFeaturedOrgs = search.trim() === "" && tagFilter.length === 0 && typeFilter === "" && organizationFilter === "";

  const featuredOrgs = useMemo(
    () => getFeaturedOrganisations(ideas),
    [ideas]
  );

  const generateRandom = useCallback(() => {
    const type: IdeaType | null = typeFilter || null;
    const tags = tagFilter.length ? tagFilter : null;
    const idea = pickRandomIdea(ideas, userIdeas, type, tags);
    setGeneratedIdea(idea ?? null);
    setGeneratedOpen(!!idea);
  }, [ideas, userIdeas, typeFilter, tagFilter]);

  const filteredByTab = useMemo(() => {
    const list = [
      ...(activeTab === "community" ? userIdeas : []),
      ...(ideas[activeTab] ?? []),
    ];
    if (activeTab !== "community") {
      // user ideas only in community
    }
    let result = list;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          (i.description?.toLowerCase().includes(q) ?? false) ||
          (i.categories?.some((c) => c.toLowerCase().includes(q)) ?? false)
      );
    }
    if (tagFilter.length > 0) {
      result = result.filter((i) =>
        tagFilter.some((t) => i.categories?.includes(t))
      );
    }
    if (typeFilter && activeTab !== typeFilter) {
      result = [];
    }
    if (organizationFilter) {
      result = result.filter((i) => {
        const orgName = i.organizationName ?? i.organization ?? "";
        return orgName === organizationFilter;
      });
    }
    return result;
  }, [ideas, userIdeas, activeTab, search, tagFilter, typeFilter, organizationFilter]);

  const counts = useMemo(
    () => ({
      community: (ideas.community?.length ?? 0) + userIdeas.length,
      expert: ideas.expert?.length ?? 0,
      organization: ideas.organization?.length ?? 0,
    }),
    [ideas, userIdeas]
  );

  if (loading && ideas.community.length === 0 && ideas.expert.length === 0) {
    return (
      <main className="min-h-screen bg-white dark:bg-[#0f1318]">
        <div className="viewport-range-shell mx-auto px-4 py-16 text-center text-[#616161] dark:text-[#a7b0bd]">
          Loading ideas…
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-[#121212] dark:bg-[#0f1318] dark:text-[#f2f4f6]">
      {/* Hero */}
      <section className="relative border-b border-[#d8d8d8] bg-[#000000] px-4 py-12 dark:border-[#2c3139] dark:bg-[#000000] md:px-6 md:py-16 lg:py-20">
        <div className="absolute inset-0 overflow-hidden">
          {/* Background image - aligned to bottom, 1440px wide */}
          <div 
            ref={backgroundRef}
            className="absolute left-1/2 bottom-0 w-[1440px] -translate-x-1/2 bg-cover bg-no-repeat"
            style={{
              backgroundImage: "url('/images/bg-generator.png')",
              backgroundSize: "cover",
              backgroundPosition: "center bottom",
              height: "100%",
              willChange: "background-position",
            }}
          />
          {/* Gradient overlays - 128px transitions on both sides */}
          <div className="absolute left-0 top-0 h-full w-full">
            <div className="absolute left-0 top-0 h-full w-[calc((100%-1440px)/2+128px)] bg-[#000000]" />
            <div className="absolute left-[calc((100%-1440px)/2+128px)] top-0 h-full w-[128px] bg-gradient-to-r from-[#000000] to-transparent" />
            <div className="absolute right-[calc((100%-1440px)/2+128px)] top-0 h-full w-[128px] bg-gradient-to-l from-[#000000] to-transparent" />
            <div className="absolute right-0 top-0 h-full w-[calc((100%-1440px)/2+128px)] bg-[#000000]" />
          </div>
        </div>
        <div className="viewport-range-shell relative mx-auto max-w-[1140px] text-center lg:max-w-[75vw]">
          <h1 className="font-serif text-[36px] font-bold text-white md:text-[48px] lg:text-[56px] tracking-tight">
            Privacy Idea Generator
          </h1>
          <p className="mx-auto mt-4 max-w-[640px] text-[15px] leading-relaxed text-white/90 md:text-[16px]">
            We collected best ideas that yet have to come to life — we asked
            experts and privacy partners what they would like to see hacked
            soon.
          </p>
          <button
            type="button"
            onClick={generateRandom}
            className="mt-8 inline-flex h-12 items-center justify-center rounded-[12px] bg-[#70FF88] px-8 text-[14px] font-bold uppercase tracking-[0.08em] text-black transition-all hover:-translate-y-0.5 hover:bg-[#5bee72]"
          >
            Generate new idea
          </button>
        </div>
      </section>

      {/* Submenu - sticky */}
      <div className="viewport-range-shell mx-auto w-full px-4 py-6 md:px-6 lg:max-w-[75vw]">
        <div className="sticky top-0 z-40 rounded-[12px] bg-[#f0f0f0] p-3 dark:bg-[#1a1f27]">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="grid w-full grid-cols-2 gap-2 md:flex md:flex-1 md:items-center md:gap-3">
              <label className="relative w-full md:max-w-[240px]">
                <input
                  type="text"
                  placeholder="Search idea"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-10 w-full rounded-[8px] border border-transparent bg-white px-4 pr-10 text-[14px] text-black outline-none transition-[border-color,box-shadow] placeholder:text-[#606060] focus:border-black/25 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.08)] dark:border-[#3b4048] dark:bg-[#12161d] dark:text-[#f2f4f6] dark:placeholder:text-[#95a0ae] dark:focus:border-white/20 dark:focus:shadow-[0_0_0_3px_rgba(255,255,255,0.08)]"
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-black/70 dark:text-[#c6ccd6]">
                  <span className="material-symbols-rounded block text-[18px] leading-none">
                    search
                  </span>
                </span>
              </label>
              <FilterDropdown
                value={typeFilter ? [typeFilter] : []}
                onChange={(v) => {
                  const newType = (v[0] || "") as IdeaType | "";
                  setTypeFilter(newType);
                  if (newType) {
                    setActiveTab(newType);
                  }
                  setOrganizationFilter(""); // Clear org filter when changing type
                }}
                options={typeOptions}
                placeholder="Type of idea"
                className="w-full md:w-auto"
              />
              <FilterDropdown
                value={tagFilter}
                onChange={setTagFilter}
                options={tagOptions}
                placeholder="Filter by tags"
                className="w-full md:w-auto"
              />
            </div>
            <div className="flex shrink-0 items-center gap-3 md:ml-auto">
              <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full border border-[#70FF88] bg-[#70FF88] px-4 text-[12px] font-bold uppercase tracking-[0.08em] text-black transition-all hover:-translate-y-0.5 hover:bg-[#5bee72]"
                  >
                    + Add new idea
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Add new idea</DialogTitle>
                  </DialogHeader>
                  <AddIdeaForm
                    onSuccess={() => {
                      setAddOpen(false);
                      setUserIdeas(loadUserIdeas());
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="viewport-range-shell mx-auto w-full max-w-[1140px] px-4 py-10 md:px-6 lg:max-w-[75vw]">
        {/* Featured organisations */}
        {showFeaturedOrgs && featuredOrgs.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 font-serif text-[22px] font-bold text-black dark:text-[#f2f4f6]">
              Featured organisation
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {featuredOrgs.map((org) => (
                <button
                  key={org.name}
                  type="button"
                  onClick={() => {
                    setOrganizationFilter(org.name);
                    setActiveTab("organization");
                    setTypeFilter("organization");
                  }}
                  className="flex flex-col items-center gap-2 rounded-[12px] border border-[#e0e0e0] bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-[#303640] dark:bg-[#181d25] dark:hover:shadow-lg"
                >
                  <div className="relative h-12 w-12">
                    {org.logo && !failedLogos.has(org.logo) ? (
                      <img
                        src={org.logo}
                        alt=""
                        className="h-12 w-12 rounded-full object-contain dark:brightness-0 dark:invert"
                        onError={() => {
                          setFailedLogos((prev) => new Set(prev).add(org.logo!));
                        }}
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e8e8e8] text-[18px] font-bold text-[#616161] dark:bg-[#2a3039] dark:text-[#a7b0bd]">
                        {org.name[0]}
                      </div>
                    )}
                  </div>
                  <span className="text-center text-[14px] font-semibold text-black dark:text-[#f2f4f6]">
                    {org.name}
                  </span>
                  <span className="text-[12px] text-[#616161] dark:text-[#a7b0bd]">
                    {org.count} Ideas
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Featured Ideas tabs */}
        <section>
          <h2 className="mb-4 font-serif text-[22px] font-bold text-black dark:text-[#f2f4f6]">
            Featured Ideas
          </h2>
          <div className="mb-6 flex flex-wrap gap-2">
            {(["community", "expert", "organization"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-[8px] px-4 py-2 text-[12px] font-bold uppercase tracking-[0.08em] transition-colors ${
                  activeTab === tab
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "bg-white text-[#616161] hover:text-black dark:bg-[#181d25] dark:text-[#a7b0bd] dark:hover:text-white"
                }`}
              >
                {TAB_LABELS[tab]} ({counts[tab]})
              </button>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredByTab.map((idea, idx) => (
              <IdeaCard
                key={idea.id ?? `${idea.name}-${idx}`}
                idea={idea}
                onSelect={() => {
                  setGeneratedIdea({
                    ...idea,
                    source: activeTab,
                    index: idx,
                  });
                  setGeneratedOpen(true);
                }}
              />
            ))}
          </div>
          {filteredByTab.length === 0 && (
            <p className="py-8 text-center text-[14px] text-[#616161] dark:text-[#a7b0bd]">
              No ideas match your filters.
            </p>
          )}
        </section>
      </div>

      <GeneratedIdeaDialog
        open={generatedOpen}
        onOpenChange={setGeneratedOpen}
        idea={generatedIdea}
        onRegenerate={generateRandom}
      />
    </main>
  );
}
