import Image from "next/image";
import { notFound } from "next/navigation";
import { loadAppData } from "@/lib/data";
import {
  getCategoryLabel,
  getCategoryToolUsage,
  getToolImageSrc,
} from "@/lib/stacks-view";

export const dynamic = "force-dynamic";

export default async function ShareCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = decodeURIComponent((await params).id);
  const data = loadAppData();

  if (!data.tools[id]) {
    notFound();
  }

  const rows = getCategoryToolUsage(id, data.tools, Object.values(data.stacks));
  const title = getCategoryLabel(id) === "Wallet" ? "Wallets" : getCategoryLabel(id);

  return (
    <main className="min-h-screen bg-white px-6 py-8 text-[#121212]">
      <section className="mx-auto w-full max-w-[900px]">
        <article
          id="category-detail-content"
          className="mx-auto w-full max-w-[800px] overflow-hidden rounded-[12px] border border-[#e0e0e0] bg-white shadow-none"
        >
          <header className="border-b border-[#d8d8d8] px-6 py-8 text-center md:px-10 md:py-10">
            <h1 className="font-sans text-[36px] font-bold leading-[1.1] text-black md:text-[48px]">{title}</h1>
            <p className="mt-4 text-[15px] leading-6 text-[#606060] md:text-[18px]">
              What are the most popular wallets out there
            </p>
          </header>

          <div>
            {rows.map((row) => (
              <div
                key={`${id}-${row.name}`}
                className="grid min-h-16 grid-cols-[1fr_auto] items-center gap-3 border-b border-[#d8d8d8] px-4 py-3 md:grid-cols-[220px_1fr_auto] md:px-9"
              >
                <div className="flex items-center gap-3 text-[16px] text-black">
                  <Image
                    src={getToolImageSrc(row.detail.image)}
                    alt={row.detail.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full"
                  />
                  <a href={row.detail.url} target="_blank" rel="noreferrer">
                    {row.detail.name}
                  </a>
                </div>

                <div className="-space-x-2 flex max-w-[260px] overflow-hidden md:max-w-none">
                  {row.avatars.slice(0, 6).map((avatar, index) => (
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

                <span className="justify-self-end rounded-[8px] bg-[#d9d9d9] px-2 py-0.5 text-[16px] leading-6 text-black">
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
