import Image from "next/image";
import Link from "next/link";
import type { Stack, Tools } from "@/types";
import {
  getAvatarSrc,
  getStackRoleTags,
  getStackToolEntries,
  getToolImageSrc,
} from "@/lib/stacks-view";
import { StackLikeButton } from "@/components/stacks/stack-like-button";

type StackPreviewCardProps = {
  stack: Stack;
  tools: Tools;
  selectedCategories?: string[];
  likeCount?: number;
  liked?: boolean;
  onLikeStateChange?: (nextCount: number, liked: boolean) => void;
};

export function StackPreviewCard({
  stack,
  tools,
  selectedCategories = [],
  likeCount = 0,
  liked = false,
  onLikeStateChange,
}: StackPreviewCardProps) {
  const allToolRows = getStackToolEntries(stack, tools)
    .map((entry) => ({ ...entry, tool: entry.tools[0] }))
    .filter((entry) => entry.tool);

  const hasCategoryFilter = selectedCategories.length > 0;
  const filteredRows = hasCategoryFilter
    ? allToolRows.filter((entry) => selectedCategories.includes(entry.categoryKey))
    : allToolRows;

  const toolRows = hasCategoryFilter ? filteredRows : filteredRows.slice(0, 5);
  const hiddenToolsCount = hasCategoryFilter ? 0 : Math.max(filteredRows.length - toolRows.length, 0);

  const roleTags = getStackRoleTags(stack);
  const detailsHref = `/stacks/${stack.id}`;
  const [mobileFirstName, ...mobileRest] = stack.name.trim().split(/\s+/);
  const mobileRestName = mobileRest.join(" ");

  return (
    <article className="group min-h-[360px] rounded-[12px] border border-[#e0e0e0] bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.14)] dark:border-[#303640] dark:bg-[#181d25] dark:hover:shadow-[0_14px_30px_rgba(0,0,0,0.55)] md:min-h-[465px]">
      <div className="flex items-start gap-2 px-4 pb-4 pt-4 md:px-6">
        <Link href={detailsHref} className="flex min-w-0 flex-1 items-start gap-3 md:gap-4">
          <Image
            src={getAvatarSrc(stack.avatar)}
            alt={`${stack.name} avatar`}
            width={80}
            height={80}
            className="h-14 w-14 rounded-full object-cover md:h-20 md:w-20"
          />
          <div className="min-w-0">
            <h3 className="min-h-[2.3em] whitespace-normal break-words font-sans text-[15px] font-bold leading-[1.15] text-black transition-colors duration-200 group-hover:text-black/80 dark:text-[#f2f4f6] dark:group-hover:text-white md:min-h-0 md:text-[26px] md:leading-6">
              <span className="md:hidden">
                {mobileFirstName}
                {mobileRestName ? <><br />{mobileRestName}</> : null}
              </span>
              <span className="hidden truncate whitespace-nowrap md:block">{stack.name}</span>
            </h3>
            <p className="mt-1 line-clamp-2 text-[12px] leading-4 tracking-[0.03em] text-black/50 dark:text-[#9ea7b5] md:text-[14px] md:leading-5">
              {stack.org}
            </p>
          </div>
        </Link>
      </div>

      <div className="space-y-1.5 border-t border-[#e0e0e0] px-4 pb-3 pt-3 dark:border-[#303640] md:space-y-3 md:px-6 md:pb-4 md:pt-4">
        {toolRows.map((entry) => (
          <div key={`${stack.id}-${entry.categoryKey}`} className="flex items-start gap-3">
            <a
              href={entry.tool.url}
              target="_blank"
              rel="noreferrer"
              className="-mx-2 flex w-full items-start gap-3 rounded-[8px] px-2 py-1 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#f7f7f7] md:py-2 dark:hover:bg-white/10"
            >
              <Image
                src={getToolImageSrc(entry.tool.image)}
                alt={entry.tool.name}
                width={40}
                height={40}
                className="h-8 w-8 rounded-full md:h-10 md:w-10"
              />
              <div className="min-w-0 pt-0.5">
                <span className="block text-[11px] leading-4 tracking-[0.03em] text-[#606060] dark:text-[#9ca5b3] md:text-[12px] md:leading-5">
                  {entry.categoryLabel}
                </span>
                <span className="block whitespace-normal break-words text-[14px] leading-5 text-black dark:text-[#f2f4f6] md:text-[16px]">
                  {entry.tool.name}
                </span>
              </div>
            </a>
          </div>
        ))}

        {hasCategoryFilter && toolRows.length === 0 && (
          <p className="rounded-[8px] bg-[#f4f4f4] px-2 py-2 text-[12px] text-[#606060] dark:bg-[#11161e] dark:text-[#98a1af]">
            No tools in selected categories.
          </p>
        )}

        {hiddenToolsCount > 0 && (
          <Link
            href={detailsHref}
            className="inline-flex text-[14px] leading-5 text-black/65 transition-colors duration-150 hover:text-black hover:underline dark:text-[#a8b0bd] dark:hover:text-white"
          >
            Show all {hiddenToolsCount} stack{hiddenToolsCount === 1 ? "" : "s"}
          </Link>
        )}
      </div>

      <div className="flex items-end justify-between gap-2 px-4 pb-3 pt-1 md:px-6 md:pb-4">
        <div className="flex flex-wrap gap-2">
          {roleTags.map((tag) => (
            <span
              key={`${stack.id}-${tag}`}
              className="rounded-[100px] bg-[#d9d9d9] px-2 py-0.5 text-[11px] leading-5 text-black dark:bg-[#2a3039] dark:text-[#f2f4f6] md:text-[12px] md:leading-6"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="relative top-[4px] shrink-0">
          <StackLikeButton
            stackId={stack.id}
            initialCount={likeCount}
            initialLiked={liked}
            onLikeStateChange={onLikeStateChange}
            compact
          />
        </div>
      </div>
    </article>
  );
}
