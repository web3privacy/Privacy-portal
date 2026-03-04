import Image from "next/image";
import type { PopularTool } from "@/types";
import { getToolImageSrc } from "@/lib/stacks-view";

type MostPopularToolsProps = {
  tools: PopularTool[];
};

export function MostPopularTools({ tools }: MostPopularToolsProps) {
  if (tools.length === 0) {
    return null;
  }

  return (
    <section className="relative mt-10 pt-8">
      <div className="absolute inset-x-0 top-0 h-px bg-[#d8d8d8] dark:bg-[#2f353f] lg:hidden" />
      <div className="absolute left-1/2 top-0 hidden h-px w-screen -translate-x-1/2 bg-[#d8d8d8] dark:bg-[#2f353f] lg:block" />
      <h2 className="text-center text-[32px] text-black dark:text-[#f2f4f6]">Most popular tools</h2>

      <article className="mx-auto mt-6 w-full max-w-[820px] rounded-[12px] border border-[#e0e0e0] bg-white px-4 py-4 shadow-[0px_1px_8px_0px_rgba(0,0,0,0.08)] dark:border-[#303640] dark:bg-[#181d25] dark:shadow-[0_10px_24px_rgba(0,0,0,0.45)] md:px-6">
        <div className="space-y-2">
          {tools.slice(0, 10).map((tool, index) => (
            <a
              key={tool.key}
              href={tool.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-[8px] px-2 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#f7f7f7] dark:hover:bg-white/10"
            >
              <span className="w-7 text-right text-[13px] font-semibold text-black/50 dark:text-[#a6afbe]">{index + 1}.</span>
              <Image
                src={getToolImageSrc(tool.image)}
                alt={tool.name}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full"
              />
              <span className="flex-1 truncate text-[17px] text-black dark:text-[#f2f4f6]">{tool.name}</span>
              <span className="rounded-[8px] bg-[#d9d9d9] px-2 py-0.5 text-[15px] text-black dark:bg-[#2a3039] dark:text-[#f2f4f6]">
                {tool.count}x
              </span>
            </a>
          ))}
        </div>
      </article>
    </section>
  );
}
