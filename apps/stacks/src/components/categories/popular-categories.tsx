import Link from "next/link";
import Image from "next/image";
import type { Stack, Tools } from "@/types";
import { getCategoryPopularity, getToolImageSrc, toCategoryRoute } from "@/lib/stacks-view";

type PopularCategoriesProps = {
  tools: Tools;
  stacks: Stack[];
};

export function PopularCategories({ tools, stacks }: PopularCategoriesProps) {
  const categories = getCategoryPopularity(tools, stacks, 4);

  return (
    <section>
      <h2 className="text-center text-[32px] text-black dark:text-[#f2f4f6]">Most popular by category</h2>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {categories.map((category, index) => (
          <article
            key={category.categoryLabel}
            className="animate-fade-up flex flex-col rounded-[12px] border border-[#e0e0e0] bg-white px-4 py-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.14)] dark:border-[#303640] dark:bg-[#181d25] dark:hover:shadow-[0_14px_30px_rgba(0,0,0,0.55)] md:min-h-[387px]"
            style={{ animationDelay: `${Math.min(index * 50, 250)}ms` }}
          >
            <h3 className="mb-5 px-1 pt-1 font-sans text-[24px] font-bold leading-8 text-black dark:text-[#f2f4f6]">
              <Link
                href={toCategoryRoute(category.categoryKey)}
                className="transition-colors duration-150 hover:text-black/70 hover:underline dark:hover:text-white/85"
              >
                {category.categoryLabel}
              </Link>
            </h3>
            <div className="space-y-2">
              {category.tools.map((tool) => (
                <div key={`${category.categoryKey}-${tool.name}`} className="flex items-center">
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noreferrer"
                    className="-mx-1 flex w-full items-center gap-2 rounded-[8px] px-1 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#f7f7f7] dark:hover:bg-white/10"
                  >
                    <Image
                      src={getToolImageSrc(tool.image)}
                      alt={tool.name}
                      width={24}
                      height={24}
                      className="h-6 w-6 rounded-full"
                    />
                    <span className="min-w-0 flex-1 whitespace-normal break-words text-[16px] leading-5 text-black dark:text-[#f2f4f6]">
                      {tool.name}
                    </span>
                    <span className="rounded-[8px] bg-[#d9d9d9] px-2 py-0.5 text-[16px] leading-6 text-black dark:bg-[#2a3039] dark:text-[#f2f4f6]">
                      {tool.count}x
                    </span>
                  </a>
                </div>
              ))}
            </div>

            <p className="mt-auto pt-3 text-[12px] leading-5 text-black dark:text-[#c0c8d4]">{category.totalVotes} Votes</p>
          </article>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href="/categories"
          className="h-10 rounded-[8px] border-2 border-black px-7 text-[14px] font-bold leading-10 tracking-[0.05em] text-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-black hover:text-white hover:shadow-[0_10px_24px_rgba(0,0,0,0.18)] dark:border-[#e8edf5] dark:text-[#e8edf5] dark:hover:bg-[#e8edf5] dark:hover:text-[#0f1318]"
        >
          SHOW ALL CATEGORIES
        </Link>
      </div>
    </section>
  );
}
