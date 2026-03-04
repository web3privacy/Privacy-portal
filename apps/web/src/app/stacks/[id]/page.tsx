import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShareDialog } from "@/components/share/share-dialog";
import { SubNavigation } from "@/components/layout/top-navigation";
import { AddOwnStackAction } from "@/components/stacks/add-own-stack-action";
import { StackLikeButton } from "@/components/stacks/stack-like-button";
import { siteConfig } from "@/lib/config";
import { loadAppData } from "@/lib/data";
import {
  getAvatarSrc,
  getCategoryLabel,
  getStackRoleTags,
  getStackToolEntries,
  getToolImageSrc,
} from "@/lib/stacks-view";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const data = loadAppData();
  const stack = Object.values(data.stacks).find((item) => item.id === id);

  return {
    title: stack ? `${stack.name} - ${siteConfig.name}` : siteConfig.name,
  };
}

export default async function StackDetails({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ share?: string }>;
}) {
  const id = (await params).id;
  const isShareMode = (await searchParams).share === "1";
  const data = loadAppData();
  const stack = Object.values(data.stacks).find((item) => item.id === id);

  if (!stack) {
    notFound();
  }

  const rows = getStackToolEntries(stack, data.tools);
  const roleTags = getStackRoleTags(stack);
  const likeCount = data.likeCounts[stack.id] ?? 0;

  return (
    <main className={`min-h-screen text-[#121212] ${isShareMode ? "bg-white" : "bg-[#f0f0f0] dark:bg-[#0f1318] dark:text-[#f2f4f6]"}`}>
      {!isShareMode && (
        <>
          <SubNavigation
            backHref="/stacks"
            backLabel="Back to List"
            rightSlot={
              <>
                <ShareDialog targetId="stack-detail-content" twitterText={`Check ${stack.name}'s stack`} />
                <div className="hidden md:block">
                  <AddOwnStackAction tools={data.tools} />
                </div>
              </>
            }
          />
        </>
      )}

      <section
        id="stack-detail-capture"
        className={
          isShareMode
            ? "mx-auto w-full max-w-[900px] bg-white px-4 py-8"
            : "viewport-range-shell mx-auto w-full max-w-[1140px] bg-[#f0f0f0] px-4 pb-12 pt-6 dark:bg-[#0f1318] md:px-6 md:pb-16 md:pt-8 lg:max-w-[75vw]"
        }
      >
        <article
          id="stack-detail-content"
          className="mx-auto w-full max-w-[800px] overflow-hidden rounded-[12px] border border-[#e0e0e0] bg-white shadow-[0px_1px_8px_0px_rgba(0,0,0,0.15)] dark:border-[#303640] dark:bg-[#181d25] dark:shadow-[0px_1px_8px_0px_rgba(0,0,0,0.55)]"
        >
          <header className="flex flex-col gap-6 border-b border-[#d8d8d8] p-5 dark:border-[#303640] md:flex-row md:items-center md:p-8">
            <Image
              src={getAvatarSrc(stack.avatar)}
              alt={`${stack.name} avatar`}
              width={200}
              height={200}
              className="h-[120px] w-[120px] rounded-full object-cover md:h-[200px] md:w-[200px]"
            />

            <div>
              <h1 className="font-sans text-[28px] font-bold leading-7 text-black dark:text-[#f2f4f6] md:text-[32px] md:leading-6">
                {stack.name}
              </h1>
              <p className="mt-3 text-[16px] leading-6 text-[#606060] dark:text-[#a9b1be] md:mt-4 md:text-[18px]">{stack.org}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {roleTags.map((tag) => (
                  <span
                    key={`${stack.id}-${tag}`}
                    className="inline-flex items-center rounded-[100px] bg-[#d9d9d9] px-3 py-1 text-[16px] leading-none text-black dark:bg-[#2a3039] dark:text-[#f2f4f6]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {!isShareMode && (
                <div className="mt-3">
                  <StackLikeButton stackId={stack.id} initialCount={likeCount} />
                </div>
              )}
            </div>
          </header>

          <div>
            {rows.map((row) => (
              <div
                key={`${stack.id}-${row.categoryKey}`}
                className="grid min-h-16 grid-cols-1 items-center border-b border-[#d8d8d8] px-6 py-3 dark:border-[#303640] md:grid-cols-[240px_1fr]"
              >
                <Link
                  href={`/categories/${encodeURIComponent(row.categoryKey)}`}
                  className="text-[16px] leading-6 text-[#606060] hover:underline dark:text-[#a9b1be]"
                >
                  {getCategoryLabel(row.categoryKey)}
                </Link>
                <div className="mt-1 flex flex-wrap items-center gap-4 md:mt-0">
                  {row.tools.map((tool) => (
                    <a
                      key={`${stack.id}-${row.categoryKey}-${tool.name}`}
                      href={tool.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-10 items-center gap-3 text-[16px] leading-none text-black hover:underline dark:text-[#f2f4f6]"
                    >
                      <Image
                        src={getToolImageSrc(tool.image)}
                        alt={tool.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 shrink-0 rounded-full"
                      />
                      {tool.name}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
