import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticleByIdForAdmin } from "@/lib/news";
import { NewsArticleEditForm } from "@/components/news/NewsArticleEditForm";

export const metadata = {
  title: "Edit Article - News Admin",
  description: "Edit news article",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function NewsArticleEditPage({ params }: Props) {
  const { id } = await params;
  const article = getArticleByIdForAdmin(id);

  if (!article || !article.hasDetail) {
    notFound();
  }

  return (
    <main className="viewport-range-shell mx-auto w-full max-w-[800px] px-4 py-10 md:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-[26px] leading-none text-black md:text-[30px] dark:text-[#f2f4f6]">
          Edit Article: {article.title}
        </h1>
        <Link
          href="/news/admin"
          className="text-sm font-medium text-black/65 hover:text-black dark:text-white/65 dark:hover:text-white"
        >
          ← Back to News Admin
        </Link>
      </div>

      <NewsArticleEditForm article={article} />
    </main>
  );
}
