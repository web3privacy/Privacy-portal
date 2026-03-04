import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getArticleById } from "@/lib/news";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";

type Props = {
  params: Promise<{ id: string }>;
};

const articleProseClasses =
  "article-prose mx-auto max-w-[65ch] text-[1.0625rem] leading-[1.75] text-black/90 dark:text-white/90 " +
  "[&_p]:mb-5 [&_p:last-child]:mb-0 " +
  "[&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-black dark:[&_h2]:text-white " +
  "[&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-black dark:[&_h3]:text-white " +
  "[&_ul]:my-5 [&_ul]:pl-6 [&_ul]:list-disc [&_ul]:space-y-2 " +
  "[&_ol]:my-5 [&_ol]:pl-6 [&_ol]:list-decimal [&_ol]:space-y-2 " +
  "[&_li]:pl-1 [&_li]:leading-[1.7] " +
  "[&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-black/20 [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-black/80 dark:[&_blockquote]:border-white/20 dark:[&_blockquote]:text-white/80 " +
  "[&_a]:text-[#22c55e] [&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-[#22c55e]/40 [&_a]:hover:decoration-[#22c55e] " +
  "[&_code]:rounded [&_code]:bg-black/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em] dark:[&_code]:bg-white/10 " +
  "[&_pre]:my-5 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-black/5 [&_pre]:p-4 [&_pre]:text-sm dark:[&_pre]:bg-white/5 " +
  "[&_pre_code]:bg-transparent [&_pre_code]:p-0 " +
  "[&_hr]:my-8 [&_hr]:border-black/10 dark:[&_hr]:border-white/10 " +
  "[&_img]:my-5 [&_img]:rounded-lg [&_img]:w-full [&_img]:object-cover";

export default async function NewsDetailPage({ params }: Props) {
  const { id } = await params;
  const article = getArticleById(id);

  if (!article || !article.hasDetail) {
    notFound();
  }

  return (
    <main className="viewport-range-shell mx-auto w-full max-w-[900px] px-4 py-10 md:px-6">
      <Link
        href="/news"
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-black/65 hover:text-black dark:text-white/65 dark:hover:text-white"
      >
        <span className="material-symbols-rounded text-[18px]">arrow_back</span>
        Back to News
      </Link>

      <article className="mb-16">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-black/5 dark:bg-black/30">
          {(article.imageUrl.startsWith("http://") ||
            article.imageUrl.startsWith("https://")) ? (
            <img
              src={article.imageUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <Image
              src={article.imageUrl}
              alt=""
              fill
              className="object-cover"
              priority
            />
          )}
        </div>

        <header className="mt-8">
          <h1 className="font-serif text-[1.75rem] leading-[1.25] tracking-tight text-black md:text-[2.125rem] dark:text-[#f2f4f6]">
            {article.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-black/60 dark:text-white/60">
            <time dateTime={article.date}>
              {article.date ? format(new Date(article.date), "MMMM d, yyyy") : ""}
            </time>
            {article.author && <span aria-hidden>·</span>}
            {article.author && <span>{article.author}</span>}
          </div>
          {article.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-black/5 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-black/65 dark:bg-white/20 dark:text-white/65"
                >
                  {tag.replace(/-/g, " ")}
                </span>
              ))}
            </div>
          )}
        </header>

        {article.content ? (
          <div className={`mt-10 ${articleProseClasses}`}>
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>
        ) : (
          <p className="mt-10 max-w-[65ch] text-[1.0625rem] leading-[1.75] text-black/80 dark:text-white/80">
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#22c55e] underline underline-offset-2 hover:no-underline"
            >
              Read full article
            </a>
          </p>
        )}
      </article>
    </main>
  );
}
