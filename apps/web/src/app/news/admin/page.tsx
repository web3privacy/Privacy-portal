import Link from "next/link";
import { loadNewsDataForAdmin } from "@/lib/news";
import { NewsAdminTabs } from "@/components/news/NewsAdminTabs";

export const metadata = {
  title: "News Admin - Privacy Portal",
  description: "Manage news articles",
};

export default function NewsAdminPage() {
  const data = loadNewsDataForAdmin();

  return (
    <main className="viewport-range-shell mx-auto w-full max-w-[1000px] px-4 py-10 md:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-[26px] leading-none text-black md:text-[30px] dark:text-[#f2f4f6]">
          News Admin
        </h1>
        <Link
          href="/"
          className="text-sm font-medium text-black/65 hover:text-black dark:text-white/65 dark:hover:text-white"
        >
          ← Back to News
        </Link>
      </div>

      <NewsAdminTabs
        featuredProjectIds={data.featuredProjectIds}
        articles={data.articles}
      />
    </main>
  );
}
