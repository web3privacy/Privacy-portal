"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { LikeCounts, Stack, Tools } from "@/types";
import { getCategoryLabel } from "@/lib/stacks-view";
import { useWallet } from "@/components/wallet/wallet-provider";
import { StackPreviewCard } from "./stack-preview-card";
import { AddOwnStackForm } from "./add-own-stack-form";

type AddStackPayload = {
  stack: Stack;
  toolsPatch: Tools;
};

type AddStackResult = {
  ok: boolean;
  error?: string;
};

type StacksExplorerProps = {
  stacks: Stack[];
  tools: Tools;
  likeCounts: LikeCounts;
  initialVisible?: number;
  query: string;
  onQueryChange: (value: string) => void;
  selectedCategories: string[];
  onSelectedCategoriesChange: (value: string[]) => void;
  onLikeCountsChange: (value: LikeCounts) => void;
  onAddStack: (payload: AddStackPayload) => Promise<AddStackResult>;
};

type CategoryOption = {
  key: string;
  label: string;
};

const PAGE_SIZE = 8;
type SortMode = "default" | "alphabetical" | "newest" | "popularity";

const SORT_OPTIONS: Array<{ value: SortMode; label: string }> = [
  { value: "default", label: "Default" },
  { value: "popularity", label: "Popularity" },
  { value: "alphabetical", label: "Alphabetical" },
  { value: "newest", label: "Newest" },
];

export function StacksExplorer({
  stacks,
  tools,
  likeCounts,
  initialVisible = PAGE_SIZE,
  query,
  onQueryChange,
  selectedCategories,
  onSelectedCategoriesChange,
  onLikeCountsChange,
  onAddStack,
}: StacksExplorerProps) {
  const { walletAddress } = useWallet();
  const [visible, setVisible] = useState(initialVisible);
  const [sortMode, setSortMode] = useState<SortMode>("default");
  const [sortOpen, setSortOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [likedStackIds, setLikedStackIds] = useState<Set<string>>(new Set());
  const sortRef = useRef<HTMLDivElement | null>(null);
  const categoryRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setSortOpen(false);
      }

      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setCategoryOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (!walletAddress) {
      setLikedStackIds(new Set());
      return;
    }

    let cancelled = false;

    async function loadLikesForWallet() {
      try {
        const response = await fetch(`/api/likes?address=${encodeURIComponent(walletAddress)}`);
        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as {
          likedStackIds?: string[];
        };
        if (cancelled) {
          return;
        }

        setLikedStackIds(new Set(payload.likedStackIds ?? []));
      } catch {
        if (!cancelled) {
          setLikedStackIds(new Set());
        }
      }
    }

    void loadLikesForWallet();
    return () => {
      cancelled = true;
    };
  }, [walletAddress]);

  useEffect(() => {
    const valid = selectedCategories.filter((key) => Boolean(tools[key]));
    if (valid.length !== selectedCategories.length) {
      onSelectedCategoriesChange(valid);
    }
  }, [onSelectedCategoriesChange, selectedCategories, tools]);

  const categoryOptions = useMemo<CategoryOption[]>(() => {
    return Object.keys(tools)
      .map((key) => ({
        key,
        label: getCategoryLabel(key),
      }))
      .sort((a, b) => a.label.localeCompare(b.label, "en", { sensitivity: "base" }));
  }, [tools]);

  const filteredStacks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return stacks;
    }

    return stacks.filter((stack) => {
      const text = `${stack.name} ${stack.org}`.toLowerCase();
      return text.includes(normalizedQuery);
    });
  }, [stacks, query]);

  const categoryFilteredStacks = useMemo(() => {
    if (selectedCategories.length === 0) {
      return filteredStacks;
    }

    return filteredStacks.filter((stack) =>
      selectedCategories.some((categoryKey) => Boolean(stack.tools[categoryKey]))
    );
  }, [filteredStacks, selectedCategories]);

  const sortedStacks = useMemo(() => {
    if (sortMode === "default") {
      return categoryFilteredStacks;
    }

    if (sortMode === "alphabetical") {
      return [...categoryFilteredStacks].sort((a, b) =>
        a.name.localeCompare(b.name, "en", { sensitivity: "base" })
      );
    }

    if (sortMode === "popularity") {
      const inputOrder = new Map(categoryFilteredStacks.map((stack, index) => [stack.id, index]));
      return [...categoryFilteredStacks].sort((a, b) => {
        const diff = (likeCounts[b.id] ?? 0) - (likeCounts[a.id] ?? 0);
        if (diff !== 0) {
          return diff;
        }
        return (inputOrder.get(a.id) ?? 0) - (inputOrder.get(b.id) ?? 0);
      });
    }

    return [...categoryFilteredStacks].reverse();
  }, [categoryFilteredStacks, likeCounts, sortMode]);

  const isCategoryFiltered = selectedCategories.length > 0;
  const shownStacks = isCategoryFiltered ? sortedStacks : sortedStacks.slice(0, visible);

  function toggleCategory(categoryKey: string) {
    setVisible(initialVisible);
    const exists = selectedCategories.includes(categoryKey);
    if (exists) {
      onSelectedCategoriesChange(selectedCategories.filter((item) => item !== categoryKey));
      return;
    }

    onSelectedCategoriesChange([...selectedCategories, categoryKey]);
  }

  return (
    <section className="space-y-8 pt-6 md:pt-6">
      <div className="animate-fade-up relative z-[120] rounded-[12px] bg-[#f0f0f0] p-3 dark:bg-[#1a1f27]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="grid w-full grid-cols-2 gap-2 md:flex md:items-center md:gap-3">
            <label className="relative w-full md:max-w-[320px]">
              <input
                value={query}
                onChange={(event) => {
                  setVisible(initialVisible);
                  onQueryChange(event.target.value);
                }}
                className="h-10 w-full rounded-[8px] border border-transparent bg-white px-4 text-[16px] text-black outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[#606060] focus:border-black/25 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.08)] dark:border-[#3b4048] dark:bg-[#12161d] dark:text-[#f2f4f6] dark:placeholder:text-[#95a0ae] dark:focus:border-white/20 dark:focus:shadow-[0_0_0_3px_rgba(255,255,255,0.08)]"
                placeholder="Search name"
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-black/70 dark:text-[#c6ccd6]">
                <span className="material-symbols-rounded block text-[18px] leading-none">search</span>
              </span>
            </label>

            <div ref={categoryRef} className="relative w-full md:w-auto">
              <button
                type="button"
                onClick={() => setCategoryOpen((current) => !current)}
                className="inline-flex h-10 w-full items-center justify-between rounded-[8px] bg-[#70ff88] px-3 text-[13px] font-semibold tracking-[0.03em] text-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#5eef70] md:min-w-[210px]"
              >
                <span>
                  {selectedCategories.length > 0
                    ? `Categories (${selectedCategories.length})`
                    : "Select categories"}
                </span>
                <span
                  className={`material-symbols-rounded text-[18px] leading-none transition-transform duration-150 ${
                    categoryOpen ? "rotate-180" : ""
                  }`}
                >
                  keyboard_arrow_down
                </span>
              </button>

              {categoryOpen && (
                <div className="absolute left-0 right-0 top-full z-[220] mt-1 rounded-[10px] border border-[#d9d9d9] bg-white p-2 shadow-[0_12px_24px_rgba(0,0,0,0.14)] md:right-auto md:w-[290px] dark:border-[#3a3f47] dark:bg-[#11161e] dark:shadow-[0_12px_24px_rgba(0,0,0,0.45)]">
                  <div className="mb-2 flex items-center justify-between px-1">
                    <span className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#5c5c5c] dark:text-[#aab3c1]">
                      Filter categories
                    </span>
                    {selectedCategories.length > 0 && (
                      <button
                        type="button"
                        onClick={() => onSelectedCategoriesChange([])}
                        className="text-[11px] font-semibold uppercase tracking-[0.05em] text-black/70 transition-colors duration-150 hover:text-black dark:text-[#c6ccd6] dark:hover:text-white"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  <div className="max-h-[260px] space-y-1 overflow-y-auto pr-1">
                    {categoryOptions.map((option) => {
                      const checked = selectedCategories.includes(option.key);
                      return (
                        <label
                          key={option.key}
                          className="flex cursor-pointer items-center gap-2 rounded-[8px] px-2 py-1.5 text-[13px] text-black transition-colors duration-150 hover:bg-black/5 dark:text-[#e2e7ef] dark:hover:bg-white/10"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleCategory(option.key)}
                            className="h-4 w-4 rounded border-[#bdbdbd] accent-[#70ff88]"
                          />
                          <span>{option.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="hidden justify-center md:ml-auto md:flex md:justify-end">
            <AddOwnStackForm
              tools={tools}
              onAddStack={async (payload) => {
                const result = await onAddStack(payload);
                if (result.ok) {
                  setVisible((prev) => prev + 1);
                }
                return result;
              }}
            />
          </div>
        </div>
      </div>

      <div className="animate-fade-up mt-2 text-center" style={{ animationDelay: "50ms" }}>
        <h1 className="text-[28px] italic leading-[1.15] text-black dark:text-[#f2f4f6] sm:text-[32px] md:text-[48px]">
          Personal FOSS stack by experts & users
        </h1>
        <p className="mt-2 pb-2 text-[15px] text-black/50 dark:text-[#a7afbb] sm:text-[17px] md:pb-1 md:text-[24px]">
          Explore what personal tool are people using
        </p>
        <div className="mt-2 flex justify-center md:hidden">
          <AddOwnStackForm
            tools={tools}
            onAddStack={async (payload) => {
              const result = await onAddStack(payload);
              if (result.ok) {
                setVisible((prev) => prev + 1);
              }
              return result;
            }}
          />
        </div>
      </div>

      <div className="space-y-4 md:space-y-6">
        <div
          className="animate-fade-up relative z-40 flex items-center justify-between gap-3"
          style={{ animationDelay: "90ms" }}
        >
          <h2 className="text-[18px] leading-none text-black dark:text-[#f2f4f6]">
            {sortedStacks.length} Expert&apos;s stacks
          </h2>
          <div ref={sortRef} className="relative inline-flex">
            <button
              type="button"
              onClick={() => setSortOpen((current) => !current)}
              className={`inline-flex items-center gap-1 rounded-[8px] px-2 py-1 text-[12px] font-semibold uppercase tracking-[0.06em] transition-colors duration-150 hover:bg-black/5 dark:hover:bg-white/10 ${
                sortOpen ? "text-[#2fa543] dark:text-[#68f07b]" : "text-black dark:text-[#d4dae4]"
              }`}
            >
              <span>Sorting</span>
              <span
                className={`material-symbols-rounded text-[17px] leading-none transition-transform duration-150 ${
                  sortOpen ? "rotate-180" : ""
                }`}
              >
                keyboard_arrow_down
              </span>
            </button>

            {sortOpen && (
              <div className="absolute right-0 top-full z-[90] mt-1 min-w-[160px] rounded-[10px] border border-[#d9d9d9] bg-white py-1 shadow-[0_12px_24px_rgba(0,0,0,0.14)] dark:border-[#3a3f47] dark:bg-[#11161e] dark:shadow-[0_12px_24px_rgba(0,0,0,0.45)]">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSortMode(option.value);
                      setSortOpen(false);
                    }}
                    className={`block w-full px-3 py-2 text-left text-[13px] transition-colors duration-150 hover:bg-black/5 dark:hover:bg-white/10 ${
                      sortMode === option.value
                        ? "font-semibold text-black dark:text-white"
                        : "text-black/80 dark:text-[#c8cfdb]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
          {shownStacks.map((stack, index) => (
            <div
              key={stack.id}
              className="animate-fade-up"
              style={{ animationDelay: `${Math.min(index * 35, 320)}ms` }}
            >
              <StackPreviewCard
                stack={stack}
                tools={tools}
                selectedCategories={selectedCategories}
                likeCount={likeCounts[stack.id] ?? 0}
                liked={likedStackIds.has(stack.id)}
                onLikeStateChange={(nextCount, isLiked) => {
                  onLikeCountsChange({
                    ...likeCounts,
                    [stack.id]: nextCount,
                  });
                  if (isLiked) {
                    setLikedStackIds((prev) => new Set(prev).add(stack.id));
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {!isCategoryFiltered && shownStacks.length < sortedStacks.length && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setVisible((prev) => prev + PAGE_SIZE)}
            className="h-10 rounded-[8px] border-2 border-black px-5 text-[14px] font-bold tracking-[0.05em] text-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-black hover:text-white hover:shadow-[0_10px_24px_rgba(0,0,0,0.18)] dark:border-[#e8edf5] dark:text-[#e8edf5] dark:hover:bg-[#e8edf5] dark:hover:text-[#0f1318]"
          >
            SHOW MORE STACKS
          </button>
        </div>
      )}
    </section>
  );
}
