import Image from "next/image";
import { notFound } from "next/navigation";
import { ShareDialog } from "@/components/share/share-dialog";
import { SubNavigation, TopNavigation } from "@/components/layout/top-navigation";
import { siteConfig } from "@/lib/config";
import { loadAppData } from "@/lib/data";
import {
  getCategoryLabel,
  getCategoryToolUsage,
  getToolImageSrc,
} from "@/lib/stacks-view";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = decodeURIComponent((await params).id);
  return {
    title: `${getCategoryLabel(id)} - ${siteConfig.name}`,
  };
}

export default async function CategoryDetails({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ share?: string }>;
}) {
  const id = decodeURIComponent((await params).id);
  const isShareMode = (await searchParams).share === "1";
  const data = loadAppData();

  if (!data.tools[id]) {
    notFound();
  }

  const stacks = Object.values(data.stacks);
  const rows = getCategoryToolUsage(id, data.tools, stacks);
  const title = getCategoryLabel(id) === "Wallet" ? "Wallets" : getCategoryLabel(id);

  return (
    <main className={`min-h-screen text-[#121212] ${isShareMode ? "bg-white" : "bg-[#f0f0f0] dark:bg-[#0f1318] dark:text-[#f2f4f6]"}`}>
      {!isShareMode && (
        <>
          <TopNavigation active="stacks" />
          <SubNavigation
            backHref="/categories"
            backLabel="Back"
            backMode="history"
            rightSlot={
              <ShareDialog targetId="category-detail-content" twitterText={`Popular tools in ${title}`} />
            }
          />
        </>
      )}

      <section
        id="category-detail-capture"
        className={
          isShareMode
            ? "mx-auto w-full max-w-[900px] bg-white px-4 py-8"
            : "viewport-range-shell mx-auto w-full max-w-[1140px] bg-[#f0f0f0] px-4 pb-12 pt-6 dark:bg-[#0f1318] md:px-6 md:pb-16 md:pt-8 lg:max-w-[75vw]"
        }
      >
        <article
          id="category-detail-content"
          className="mx-auto w-full max-w-[800px] overflow-hidden rounded-[12px] border border-[#e0e0e0] bg-white shadow-[0px_1px_8px_0px_rgba(0,0,0,0.15)] dark:border-[#303640] dark:bg-[#181d25] dark:shadow-[0px_1px_8px_0px_rgba(0,0,0,0.55)]"
        >
          <header className="border-b border-[#d8d8d8] px-6 py-8 text-center dark:border-[#303640] md:px-10 md:py-10">
            <h1 className="font-sans text-[36px] font-bold leading-[1.1] text-black dark:text-[#f2f4f6] md:text-[48px]">
              {title}
            </h1>
            <p className="mt-4 text-[15px] leading-6 text-[#606060] dark:text-[#a9b1be] md:text-[18px]">
              What are the most popular wallets out there
            </p>
          </header>

          <div>
            {rows.map((row) => (
              <div
                key={`${id}-${row.name}`}
                className="grid min-h-16 grid-cols-[1fr_auto] items-center gap-3 border-b border-[#d8d8d8] px-4 py-3 dark:border-[#303640] md:grid-cols-[220px_1fr_auto] md:px-9"
              >
                <div className="flex items-center gap-3 text-[16px] text-black dark:text-[#f2f4f6]">
                  <Image
                    src={getToolImageSrc(row.detail.image)}
                    alt={row.detail.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full"
                  />
                  <a href={row.detail.url} target="_blank" rel="noreferrer" className="hover:underline">
                    {row.detail.name}
                  </a>
                </div>

                <div className="-space-x-2 flex max-w-[260px] overflow-hidden md:max-w-none">
                  {row.avatars
                    .slice(0, 6)
                    .map((avatar, index) => (
                    <Image
                      key={`${row.name}-${avatar}-${index}`}
                      src={avatar}
                      alt={`${row.name} user ${index + 1}`}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full border-2 border-white object-cover"
                    />
                    ))}
                </div>

                <span className="justify-self-end rounded-[8px] bg-[#d9d9d9] px-2 py-0.5 text-[16px] leading-6 text-black dark:bg-[#2a3039] dark:text-[#f2f4f6]">
                  {row.count}x
                </span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
