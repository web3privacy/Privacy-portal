"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { GlossaryTerm } from "@/lib/glossary";
import { AddTermForm } from "./add-term-form";
import { EditTermForm } from "./edit-term-form";

const INITIAL_SHOW = 10;

type Props = {
  terms: GlossaryTerm[];
};

export function GlossaryPageContent({ terms }: Props) {
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_SHOW);
  const [addOpen, setAddOpen] = useState(false);
  const [editTerm, setEditTerm] = useState<GlossaryTerm | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return terms;
    const q = search.toLowerCase();
    return terms.filter(
      (t) =>
        t.term.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q)
    );
  }, [terms, search]);

  const display = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visibleCount;

  return (
    <main className="min-h-screen bg-white text-[#121212] dark:bg-[#0f1318] dark:text-[#f2f4f6]">
      {/* Hero */}
      <section className="relative border-b border-[#d8d8d8] bg-[#000000] px-4 py-12 dark:border-[#2c3139] dark:bg-[#000000] md:px-6 md:py-16 lg:py-20">
        <div className="absolute inset-0 overflow-hidden">
          {/* Background image - centered, aligned to bottom, 1440px wide */}
          <div 
            className="absolute left-1/2 bottom-0 w-[1440px] -translate-x-1/2 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/images/bg-glossary.png')",
              backgroundSize: "cover",
              backgroundPosition: "center bottom",
              height: "100%",
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
            Glossary
          </h1>
          <p className="mx-auto mt-4 max-w-[640px] text-[15px] leading-relaxed text-white/90 md:text-[16px]">
            Understanding key terms in the field is essential for recognizing
            threats, advocating for privacy, and navigating the Web3 ecosystem.
            Below is a glossary of important privacy-related concepts covered in
            our courses.
          </p>
        </div>
      </section>

      {/* Submenu - sticky when scrolling (no transform on this div so sticky works) */}
      <div className="viewport-range-shell mx-auto w-full px-4 py-6 md:px-6 lg:max-w-[75vw]">
        <div className="sticky top-0 z-40 rounded-[12px] bg-[#f0f0f0] p-3 dark:bg-[#1a1f27]">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <label className="relative w-full md:max-w-[260px]">
              <input
                type="text"
                placeholder="Search term"
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
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full border border-[#70FF88] bg-[#70FF88] px-4 text-[12px] font-bold uppercase tracking-[0.08em] text-black transition-all hover:-translate-y-0.5 hover:bg-[#5bee72] md:ml-auto"
                >
                  ADD TERM
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add new term</DialogTitle>
                </DialogHeader>
                <AddTermForm onSuccess={() => setAddOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="viewport-range-shell mx-auto w-full max-w-[1140px] px-4 py-10 md:px-6 lg:max-w-[75vw]">
        <h2 className="text-center font-serif text-[26px] font-bold text-black dark:text-[#f2f4f6] md:text-[30px]">
          Key Privacy Terminology
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          {display.map((t) => (
            <article
              key={t.term}
              className="group relative rounded-[12px] border border-[#e0e0e0] bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.14)] dark:border-[#303640] dark:bg-[#181d25] dark:hover:shadow-[0_14px_30px_rgba(0,0,0,0.55)]"
            >
              <h3 className="font-sans text-[15px] font-semibold text-[#121212] dark:text-[#f2f4f6]">
                {t.term}
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[#616161] dark:text-[#a7b0bd]">
                {t.definition}
              </p>
              <div className="mt-3 flex items-center opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => setEditTerm(t)}
                  className="rounded-[6px] bg-[#70FF88] px-3 py-1.5 text-[12px] font-semibold text-black transition-colors hover:bg-[#5bee72]"
                >
                  Edit
                </button>
              </div>
            </article>
          ))}
        </div>

        <Dialog open={!!editTerm} onOpenChange={(open) => !open && setEditTerm(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit term</DialogTitle>
            </DialogHeader>
            {editTerm && (
              <EditTermForm
                term={editTerm}
                onSuccess={() => setEditTerm(null)}
              />
            )}
          </DialogContent>
        </Dialog>

        {hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((n) => n + 10)}
              className="rounded-[10px] border border-[#d8d8d8] bg-white px-6 py-2.5 text-[13px] font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-[#f5f5f5] dark:border-[#2c3139] dark:bg-[#151a21] dark:text-[#f2f4f6] dark:hover:bg-[#1f252d]"
            >
              Show more
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
