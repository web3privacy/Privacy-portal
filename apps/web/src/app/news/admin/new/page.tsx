import Link from "next/link";
import { NewsArticleEditForm } from "@/components/news/NewsArticleEditForm";
import type { Article } from "@/types/news";

export const metadata = {
  title: "New Article - News Admin",
  description: "Create a new news article",
};

const emptyArticle: Article = {
  id: "",
  title: "",
  perex: "",
  link: "",
  imageUrl: "",
  date: "",
  author: "",
  tags: [],
  isHighlighted: false,
  type: "article",
  source: "manual",
  hasDetail: true,
  published: true,
  content: "",
};

export default function NewsNewArticlePage() {
  return (
    <main className="viewport-range-shell mx-auto w-full max-w-[800px] px-4 py-10 md:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-[26px] leading-none text-black md:text-[30px] dark:text-[#f2f4f6]">
          New Article
        </h1>
        <Link
          href="/news/admin"
          className="text-sm font-medium text-black/65 hover:text-black dark:text-white/65 dark:hover:text-white"
        >
          ← Back to News Admin
        </Link>
      </div>

      <NewsArticleEditForm article={emptyArticle} isNew />
    </main>
  );
}
