"use client";

import Image from "next/image";
import Link from "next/link";
import type { EventDetailArticles } from "@/types/event-detail";
import type { Article } from "@/types/news";

type Props = {
  section: EventDetailArticles;
  articles: Article[];
};

export function DetailArticles({ section, articles }: Props) {
  if (!section.enabled || !section.articleIds?.length) return null;

  const items = section.articleIds
    .map((id) => articles.find((a) => a.id === id))
    .filter((a): a is Article => !!a);

  if (items.length === 0) return null;

  return (
    <section id="articles" className="py-10 md:py-14">
      <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.15em] text-[#121212] dark:text-white">
        Articles
      </h2>
      <ul className="space-y-4">
        {items.map((article) => (
          <li key={article.id}>
            <Link
              href={article.hasDetail ? `/news/${article.id}` : article.link}
              {...(article.hasDetail ? {} : { target: "_blank", rel: "noopener noreferrer" })}
              className="flex gap-4 rounded-xl border border-[#e0e0e0] bg-[#f8f8f8] p-4 transition hover:border-[#70FF88]/50 dark:border-[#303640] dark:bg-[#1a1f27] dark:hover:border-[#70FF88]/50"
            >
              <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={article.imageUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-[#70FF88] dark:text-[#70FF88]">
                  {article.title}
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-[#616161] dark:text-[#a7b0bd]">
                  {article.perex}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <a
        href="#articles"
        className="mt-6 inline-flex h-10 items-center justify-center rounded-lg border border-[#70FF88] bg-transparent px-5 text-[12px] font-bold uppercase tracking-[0.08em] text-[#70FF88] transition hover:bg-[#70FF88]/10 dark:text-[#70FF88] dark:hover:bg-[#70FF88]/10"
      >
        View all articles
      </a>
    </section>
  );
}
