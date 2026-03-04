"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type {
  LibraryData,
  LibraryDocument,
  LibraryArticle,
  LibraryBook,
} from "@/lib/library";
import { useWallet } from "@/components/wallet/wallet-provider";
import { AddLibraryItemForm } from "./add-library-item-form";

const INITIAL_DOCS = 3;
const INITIAL_ARTICLES = 3;
const INITIAL_BOOKS_PER_CAT = 12;

type Props = {
  data: LibraryData;
  initialRecommendCounts?: Record<string, number>;
};

const CARD_BASE =
  "group relative rounded-[12px] border border-[#e0e0e0] bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.14)] dark:border-[#303640] dark:bg-[#181d25] dark:hover:shadow-[0_14px_30px_rgba(0,0,0,0.55)]";

function DocumentCard({
  item,
  itemKey,
  recommendCount = 0,
  isRecommended = false,
  onRecommend,
}: {
  item: LibraryDocument;
  itemKey: string;
  recommendCount?: number;
  isRecommended?: boolean;
  onRecommend?: (key: string) => void;
}) {
  const content = (
    <>
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f5f5f5] dark:bg-[#252b35]">
        {item.imageUrl ? (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center blur-xl opacity-40 scale-110"
              style={{ backgroundImage: `url(${item.imageUrl})` }}
            />
            <div className="relative flex h-full w-full items-center justify-center p-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.imageUrl}
                alt=""
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </>
        ) : (
          <span className="material-symbols-rounded text-[48px] text-[#ccc] dark:text-[#4a5568]">
            article
          </span>
        )}
      </div>
      <div className="relative p-4">
        <h3 className="font-sans text-[15px] font-semibold text-[#121212] dark:text-[#f2f4f6]">
          {item.title}
        </h3>
        <p className="mt-1 text-[13px] text-[#616161] dark:text-[#a7b0bd]">
          {item.author}
          {item.year != null && `, ${item.year}`}
        </p>
        {item.description && (
          <p className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-[#616161] dark:text-[#a7b0bd]">
            {item.description}
          </p>
        )}
        {onRecommend && (
          <div className="absolute bottom-4 right-4 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onRecommend(itemKey);
              }}
              className="flex items-center gap-1 rounded-full border border-[#70FF88] bg-[#70FF88] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-black hover:bg-[#5bee72]"
            >
              <span className="material-symbols-rounded text-[14px]">
                {isRecommended ? "favorite" : "recommend"}
              </span>
              {recommendCount > 0 && <span>{recommendCount}</span>}
            </button>
          </div>
        )}
      </div>
    </>
  );

  if (item.url) {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`block overflow-hidden ${CARD_BASE}`}
      >
        {content}
      </a>
    );
  }

  return <article className={`overflow-hidden ${CARD_BASE}`}>{content}</article>;
}

function BookCard({
  item,
  itemKey,
  recommendCount = 0,
  isRecommended = false,
  onRecommend,
}: {
  item: LibraryBook;
  itemKey: string;
  recommendCount?: number;
  isRecommended?: boolean;
  onRecommend?: (key: string) => void;
}) {
  const content = (
    <>
      <div className="relative aspect-square w-full overflow-hidden bg-[#f5f5f5] dark:bg-[#252b35]">
        {item.imageUrl ? (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center opacity-40 blur-xl scale-110"
              style={{ backgroundImage: `url(${item.imageUrl})` }}
            />
            <div className="relative flex h-full w-full items-center justify-center p-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.imageUrl}
                alt=""
                className="max-h-full max-w-full object-contain object-top"
              />
            </div>
          </>
        ) : (
          <span className="material-symbols-rounded text-[48px] text-[#ccc] dark:text-[#4a5568]">
            menu_book
          </span>
        )}
      </div>
      <div className="relative p-4">
        <h3 className="font-sans text-[15px] font-semibold text-[#121212] dark:text-[#f2f4f6]">
          {item.title}
        </h3>
        <p className="mt-1 text-[13px] text-[#616161] dark:text-[#a7b0bd]">
          {item.author}
        </p>
        {item.recommendedBy && (
          <p className="mt-2 text-[12px] text-[#888] dark:text-[#95a0ae]">
            Recommended by: {item.recommendedBy}
          </p>
        )}
        {onRecommend && (
          <div className="absolute bottom-4 right-4 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onRecommend(itemKey);
              }}
              className="flex items-center gap-1 rounded-full border border-[#70FF88] bg-[#70FF88] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-black hover:bg-[#5bee72]"
            >
              <span className="material-symbols-rounded text-[14px]">
                {isRecommended ? "favorite" : "recommend"}
              </span>
              {recommendCount > 0 && <span>{recommendCount}</span>}
            </button>
          </div>
        )}
      </div>
    </>
  );

  const catalogUrl = item.catalogUrl ?? `https://openlibrary.org/search?q=${encodeURIComponent(`${item.title} ${item.author}`)}`;

  return (
    <a
      href={catalogUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`block overflow-hidden ${CARD_BASE}`}
    >
      {content}
    </a>
  );
}

const INTRO_DOCS =
  "These foundational documents form the bedrock of the Cypherpunk movement. Reading them will provide you with a deep understanding of the ideals and motivations that inspired activists to leverage technology in the defense of individual rights and freedoms.";

const INTRO_ARTICLES =
  "These more recent articles and talks assess how technological advancements over the past 30 to 40 years have shaped the Internet and society, evaluating their developments in relation to the original founding values.";

export function LibraryPageContent({
  data,
  initialRecommendCounts = {},
}: Props) {
  const { walletAddress, connectWallet } = useWallet();
  const [search, setSearch] = useState("");
  const [docsCount, setDocsCount] = useState(INITIAL_DOCS);
  const [articlesCount, setArticlesCount] = useState(INITIAL_ARTICLES);
  const [booksCountByCat, setBooksCountByCat] = useState<Record<string, number>>({});
  const [addOpen, setAddOpen] = useState(false);
  const [recommendCounts, setRecommendCounts] = useState(initialRecommendCounts);
  const [recommendedKeys, setRecommendedKeys] = useState<Set<string>>(new Set());
  const [recommendSubmitting, setRecommendSubmitting] = useState(false);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!walletAddress) {
      setRecommendedKeys(new Set());
      return;
    }
    let cancelled = false;
    fetch(`/api/library/recommend?address=${encodeURIComponent(walletAddress)}`)
      .then((r) => r.json())
      .then((d: { recommendedKeys?: string[] }) => {
        if (!cancelled && Array.isArray(d.recommendedKeys)) {
          setRecommendedKeys(new Set(d.recommendedKeys));
        }
      })
      .catch(() => {
        if (!cancelled) setRecommendedKeys(new Set());
      });
    return () => {
      cancelled = true;
    };
  }, [walletAddress]);

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

  const handleRecommend = useCallback(
    async (itemKey: string) => {
      if (recommendSubmitting) return;
      let address = walletAddress;
      if (!address) {
        const connected = await connectWallet();
        if (!connected) return;
        address = connected;
      }
      setRecommendSubmitting(true);
      try {
        const res = await fetch("/api/library/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemKey, address }),
        });
        const json = (await res.json()) as {
          ok?: boolean;
          recommendCount?: number;
        };
        const count = json.recommendCount;
        if (res.ok && json.ok && typeof count === "number") {
          setRecommendCounts((c) => ({ ...c, [itemKey]: count }));
          setRecommendedKeys((s) => new Set([...s, itemKey]));
        }
      } finally {
        setRecommendSubmitting(false);
      }
    },
    [walletAddress, connectWallet, recommendSubmitting]
  );

  const q = search.toLowerCase().trim();

  const filteredDocs = useMemo(() => {
    if (!q) return data.keyDocuments;
    return data.keyDocuments.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.author.toLowerCase().includes(q) ||
        (d.description?.toLowerCase().includes(q) ?? false)
    );
  }, [data.keyDocuments, q]);

  const filteredArticles = useMemo(() => {
    if (!q) return data.importantArticles;
    return data.importantArticles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q) ||
        (a.description?.toLowerCase().includes(q) ?? false)
    );
  }, [data.importantArticles, q]);

  const filteredBooksByCategory = useMemo(() => {
    const out: Record<string, LibraryBook[]> = {};
    for (const [cat, books] of Object.entries(data.books)) {
      if (!q) {
        out[cat] = books;
      } else {
        const matched = books.filter(
          (b) =>
            b.title.toLowerCase().includes(q) ||
            b.author.toLowerCase().includes(q) ||
            (b.recommendedBy?.toLowerCase().includes(q) ?? false)
        );
        if (matched.length) out[cat] = matched;
      }
    }
    return out;
  }, [data.books, q]);

  const displayDocs = filteredDocs.slice(0, docsCount);
  const displayArticles = filteredArticles.slice(0, articlesCount);
  const hasMoreDocs = filteredDocs.length > docsCount;
  const hasMoreArticles = filteredArticles.length > articlesCount;

  function getBooksToShow(cat: string, books: LibraryBook[]): LibraryBook[] {
    const n = booksCountByCat[cat] ?? INITIAL_BOOKS_PER_CAT;
    return books.slice(0, n);
  }
  function hasMoreBooks(cat: string, books: LibraryBook[]): boolean {
    const n = booksCountByCat[cat] ?? INITIAL_BOOKS_PER_CAT;
    return books.length > n;
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
              backgroundImage: "url('/images/bg-library.png')",
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
            Library
          </h1>
          <p className="mx-auto mt-4 max-w-[640px] text-[15px] leading-relaxed text-white/90 md:text-[16px]">
            {INTRO_DOCS}
          </p>
        </div>
      </section>

      {/* Submenu - sticky when scrolling (no transform on this div so sticky works) */}
      <div className="viewport-range-shell mx-auto w-full px-4 py-6 md:px-6 lg:max-w-[75vw]">
        <div className="sticky top-0 z-40 rounded-[12px] bg-[#f0f0f0] p-3 dark:bg-[#1a1f27]">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <label className="relative w-full md:max-w-[320px]">
              <input
                type="text"
                placeholder="Search document / article / book"
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
                  ADD BOOK
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add document / article / book</DialogTitle>
                </DialogHeader>
                <AddLibraryItemForm onSuccess={() => setAddOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="viewport-range-shell mx-auto w-full max-w-[1140px] px-4 py-10 md:px-6 lg:max-w-[75vw]">
        {/* Key Documents */}
        <section className="mb-16">
          <h2 className="text-center font-serif text-[26px] font-bold text-black dark:text-[#f2f4f6] md:text-[30px] md:mb-2">
            Key Documents
          </h2>
          <p className="mx-auto mt-5 max-w-[640px] text-center text-[14px] leading-relaxed text-[#616161] dark:text-[#a7b0bd]">
            {INTRO_DOCS}
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayDocs.map((d) => {
              const key = `doc:${d.title}`;
              return (
                <DocumentCard
                  key={key}
                  item={d}
                  itemKey={key}
                  recommendCount={recommendCounts[key] ?? 0}
                  isRecommended={recommendedKeys.has(key)}
                  onRecommend={handleRecommend}
                />
              );
            })}
          </div>
          {hasMoreDocs && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setDocsCount((n) => n + 6)}
                className="rounded-[10px] border border-black bg-white px-6 py-2.5 text-[13px] font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-[#f5f5f5] dark:border-[#e0e0e0] dark:bg-[#151a21] dark:text-[#f2f4f6] dark:hover:bg-[#1f252d]"
              >
                Load more
              </button>
            </div>
          )}
        </section>

        {/* Important Articles */}
        <section className="mb-16">
          <h2 className="text-center font-serif text-[26px] font-bold text-black dark:text-[#f2f4f6] md:text-[30px] md:mb-2">
            Important Articles
          </h2>
          <p className="mx-auto mt-5 max-w-[640px] text-center text-[14px] leading-relaxed text-[#616161] dark:text-[#a7b0bd]">
            {INTRO_ARTICLES}
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayArticles.map((a) => {
              const key = `article:${a.title}`;
              return (
                <DocumentCard
                  key={key}
                  item={a}
                  itemKey={key}
                  recommendCount={recommendCounts[key] ?? 0}
                  isRecommended={recommendedKeys.has(key)}
                  onRecommend={handleRecommend}
                />
              );
            })}
          </div>
          {hasMoreArticles && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setArticlesCount((n) => n + 6)}
                className="rounded-[10px] border border-black bg-white px-6 py-2.5 text-[13px] font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-[#f5f5f5] dark:border-[#e0e0e0] dark:bg-[#151a21] dark:text-[#f2f4f6] dark:hover:bg-[#1f252d]"
              >
                Load more
              </button>
            </div>
          )}
        </section>

        {/* Books */}
        <section>
          <h2 className="text-center font-serif text-[26px] font-bold text-black dark:text-[#f2f4f6] md:text-[30px] md:mb-2">
            Books recommended by Web3Privacy Now Community
          </h2>
          {Object.entries(filteredBooksByCategory).map(([category, books]) => {
            const toShow = getBooksToShow(category, books);
            const hasMore = hasMoreBooks(category, books);
            return (
              <div key={category} className="mt-10">
                <h3 className="mb-4 text-center font-sans text-[20px] font-semibold text-black dark:text-[#f2f4f6] pb-2">
                  {category}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {toShow.map((b) => {
                    const key = `book:${b.title}|${b.author}`;
                    return (
                      <BookCard
                        key={key}
                        item={b}
                        itemKey={key}
                        recommendCount={recommendCounts[key] ?? 0}
                        isRecommended={recommendedKeys.has(key)}
                        onRecommend={handleRecommend}
                      />
                    );
                  })}
                </div>
                {hasMore && (
                  <div className="mt-6 flex justify-center">
                    <button
                      type="button"
                      onClick={() =>
                        setBooksCountByCat((c) => ({
                          ...c,
                          [category]: (c[category] ?? INITIAL_BOOKS_PER_CAT) + 12,
                        }))
                      }
                      className="rounded-[10px] border border-black bg-white px-6 py-2.5 text-[13px] font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-[#f5f5f5] dark:border-[#e0e0e0] dark:bg-[#151a21] dark:text-[#f2f4f6] dark:hover:bg-[#1f252d]"
                    >
                      Load more
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
}
