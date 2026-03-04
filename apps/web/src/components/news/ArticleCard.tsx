"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@web3privacy/portal-ui";
import type { Article, ArticleType } from "@/types/news";
import { format } from "date-fns";

/** Use native img for external URLs so any domain works without next.config remotePatterns. */
function ArticleImage({
  src,
  alt,
  fill,
  className,
  sizes,
}: {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
}) {
  const isExternal = src.startsWith("http://") || src.startsWith("https://");
  if (isExternal) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn(fill && "absolute inset-0 h-full w-full object-cover", className)}
        sizes={sizes}
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill ?? false}
      className={className}
      sizes={sizes}
    />
  );
}

type Variant = "default" | "highlight" | "highlight-horizontal" | "sub-highlight" | "list" | "compact";

interface ArticleCardProps {
  article: Article;
  variant?: Variant;
  showTags?: boolean;
  showAuthor?: boolean;
}

function getCtaLabel(type: ArticleType): string {
  switch (type) {
    case "podcast":
      return "LISTEN NOW";
    case "video":
      return "WATCH NOW";
    default:
      return "Read More";
  }
}

function CardWrapper({
  href,
  isExternal,
  variant,
  titleOnlyClickable,
  children,
}: {
  href: string;
  isExternal: boolean;
  variant: Variant;
  titleOnlyClickable?: boolean;
  children: React.ReactNode;
}) {
  const borderCls =
    variant === "list"
      ? "border-0 rounded-xl"
      : "rounded-xl";
  const base = cn(
    "block bg-white dark:bg-[#151a21]",
    !titleOnlyClickable && "transition-shadow hover:shadow-lg dark:hover:shadow-xl",
    titleOnlyClickable && "rounded-xl",
    borderCls
  );
  const cls = cn(
    base,
    variant === "highlight-horizontal" && "p-0 overflow-hidden",
    variant === "sub-highlight" && "p-3",
    variant === "list" && "p-0 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]",
    variant === "default" && "p-3",
    variant === "highlight" && "p-4 md:p-5",
    variant === "compact" && "p-2"
  );
  if (titleOnlyClickable) {
    return <div className={cls}>{children}</div>;
  }
  const linkProps = isExternal
    ? { target: "_blank", rel: "noopener noreferrer" as const }
    : {};
  if (isExternal) {
    return <a href={href} className={cls} {...linkProps}>{children}</a>;
  }
  return <Link href={href} className={cls}>{children}</Link>;
}

export function ArticleCard({
  article,
  variant = "default",
  showTags = true,
  showAuthor = true,
}: ArticleCardProps) {
  const isExternal = !article.hasDetail;
  const href = article.hasDetail ? `/news/${article.id}` : article.link;
  const ctaLabel = getCtaLabel(article.type);

  const TitleLink = () => (
    isExternal ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className="hover:underline focus:outline-none focus:ring-2 focus:ring-[#70ff88] rounded">
        {article.title}
      </a>
    ) : (
      <Link href={href} className="hover:underline focus:outline-none focus:ring-2 focus:ring-[#70ff88] rounded">
        {article.title}
      </Link>
    )
  );

  if (variant === "highlight-horizontal") {
    return (
      <CardWrapper href={href} isExternal={isExternal} variant={variant} titleOnlyClickable>
        <div className="flex flex-col sm:flex-row">
          <div className="relative aspect-square min-h-[110px] w-full shrink-0 overflow-hidden rounded-[12px] sm:w-[28%] sm:min-h-[140px]">
            <ArticleImage
              src={article.imageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 640px) 45vw, 100vw"
            />
          </div>
          <div className="flex flex-1 flex-col justify-center p-6 sm:p-8">
            <h3 className="text-xl font-bold leading-tight text-black dark:text-white md:text-2xl">
              <TitleLink />
            </h3>
            {article.perex && (
              <p className="mt-2 text-sm text-black/65 dark:text-white/65 break-words">
                {article.perex}
              </p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-black/55 dark:text-white/55">
              {article.date && (
                <time dateTime={article.date}>
                  {format(new Date(article.date), "MMM d, yyyy")}
                </time>
              )}
              {showAuthor && article.author && (
                <span>· {article.author}</span>
              )}
            </div>
            {false && showTags && article.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {article.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-black/5 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-black/65 dark:bg-white/20 dark:text-white/65"
                  >
                    {tag.replace(/-/g, " ")}
                  </span>
                ))}
              </div>
            )}
            {/* CTA removed - only title is clickable */}
          </div>
        </div>
      </CardWrapper>
    );
  }

  if (variant === "list") {
    return (
      <CardWrapper href={href} isExternal={isExternal} variant={variant} titleOnlyClickable>
        <div className="flex gap-4 py-4">
          <div className="relative h-[120px] w-[120px] shrink-0 overflow-hidden rounded-lg bg-black/5 dark:bg-black/30">
            <ArticleImage
              src={article.imageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="120px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold leading-tight text-black dark:text-white">
              <TitleLink />
            </h3>
            {article.perex && (
              <p className="mt-1 line-clamp-2 text-sm text-black/65 dark:text-white/65 break-words">
                {article.perex}
              </p>
            )}
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-black/55 dark:text-white/55">
              {article.date && (
                <time dateTime={article.date}>
                  {format(new Date(article.date), "MMM d, yyyy")}
                </time>
              )}
              {showAuthor && article.author && (
                <span>· {article.author}</span>
              )}
            </div>
            {false && showTags && article.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {article.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-black/5 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-black/65 dark:bg-white/20 dark:text-white/65"
                  >
                    {tag.replace(/-/g, " ")}
                  </span>
                ))}
              </div>
            )}
            {/* CTA removed */}
          </div>
        </div>
      </CardWrapper>
    );
  }

  if (variant === "sub-highlight") {
    return (
      <CardWrapper href={href} isExternal={isExternal} variant={variant} titleOnlyClickable>
        <div className="flex gap-4">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[12px] bg-black/5 dark:bg-black/30 aspect-square">
            <ArticleImage
              src={article.imageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold leading-tight text-black dark:text-white">
              <TitleLink />
            </h3>
            {article.perex && (
              <p className="mt-0.5 text-sm text-black/65 dark:text-white/65 break-words line-clamp-2">
                {article.perex}
              </p>
            )}
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-black/55 dark:text-white/55">
              {article.date && (
                <time dateTime={article.date}>
                  {format(new Date(article.date), "MMM d, yyyy")}
                </time>
              )}
              {showAuthor && article.author && (
                <span>· {article.author}</span>
              )}
            </div>
          </div>
        </div>
      </CardWrapper>
    );
  }

  const content = (
    <>
      <div
        className={cn(
          "relative overflow-hidden rounded-lg bg-black/5 dark:bg-black/30",
          variant === "highlight" && "aspect-square min-h-[100px]",
          variant === "default" && "aspect-square min-h-[80px]",
          variant === "compact" && "aspect-square min-h-[80px]"
        )}
      >
        <ArticleImage
          src={article.imageUrl}
          alt=""
          fill
          className="object-cover"
          sizes={
            variant === "highlight"
              ? "(min-width: 1024px) 50vw, 100vw"
              : variant === "compact"
                ? "120px"
                : "300px"
          }
        />
      </div>
      <div
        className={cn(
          "flex flex-col gap-1",
          variant === "highlight" && "mt-3",
          variant === "default" && "mt-2",
          variant === "compact" && "mt-1.5"
        )}
      >
        <h3
          className={cn(
            "font-semibold leading-tight text-black dark:text-white line-clamp-2",
            variant === "highlight" && "text-lg md:text-xl",
            variant === "default" && "text-base",
            variant === "compact" && "text-sm line-clamp-1"
          )}
        >
          <TitleLink />
        </h3>
        {article.perex && variant !== "compact" && (
          <p className="text-sm text-black/65 dark:text-white/65 line-clamp-2">
            {article.perex}
          </p>
        )}
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-black/55 dark:text-white/55">
          {article.date && (
            <time dateTime={article.date}>
              {format(new Date(article.date), "MMM d, yyyy")}
            </time>
          )}
          {showAuthor && article.author && (
            <span>· {article.author}</span>
          )}
        </div>
        {false && showTags && article.tags.length > 0 && variant !== "compact" && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {article.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-black/5 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-black/65 dark:bg-white/20 dark:text-white/65"
              >
                {tag.replace(/-/g, " ")}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  );

  return (
    <CardWrapper href={href} isExternal={isExternal} variant={variant} titleOnlyClickable>
      {content}
    </CardWrapper>
  );
}
