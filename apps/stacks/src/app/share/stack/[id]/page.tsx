import Image from "next/image";
import { notFound } from "next/navigation";
import { loadAppData } from "@/lib/data";
import {
  getAvatarSrc,
  getCategoryLabel,
  getStackRoleTags,
  getStackToolEntries,
  getToolImageSrc,
} from "@/lib/stacks-view";

export const dynamic = "force-dynamic";

export default async function ShareStackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const data = loadAppData();
  const stack = Object.values(data.stacks).find((item) => item.id === id);

  if (!stack) {
    notFound();
  }

  const rows = getStackToolEntries(stack, data.tools);
  const roleTags = getStackRoleTags(stack);

  return (
    <main className="min-h-screen bg-white px-6 py-8 text-[#121212]">
      <section className="mx-auto w-full max-w-[900px]">
        <article
          id="stack-detail-content"
          className="mx-auto w-full max-w-[800px] overflow-hidden rounded-[12px] border border-[#e0e0e0] bg-white shadow-none"
        >
          <header className="flex flex-col gap-6 border-b border-[#d8d8d8] p-5 md:flex-row md:items-center md:p-8">
            <Image
              src={getAvatarSrc(stack.avatar)}
              alt={`${stack.name} avatar`}
              width={200}
              height={200}
              className="h-[120px] w-[120px] rounded-full object-cover md:h-[200px] md:w-[200px]"
            />

            <div>
              <h1 className="font-sans text-[28px] font-bold leading-7 text-black md:text-[32px] md:leading-6">
                {stack.name}
              </h1>
              <p className="mt-3 text-[16px] leading-6 text-[#606060] md:mt-4 md:text-[18px]">{stack.org}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {roleTags.map((tag) => (
                  <span
                    key={`${stack.id}-${tag}`}
                    className="inline-flex h-[30px] items-center rounded-[100px] bg-[#d9d9d9] px-3 text-[16px] leading-none text-black"
                  >
                    <span className="relative -top-[8px]">{tag}</span>
                  </span>
                ))}
              </div>
            </div>
          </header>

          <div>
            {rows.map((row) => (
              <div
                key={`${stack.id}-${row.categoryKey}`}
                className="grid min-h-16 grid-cols-1 items-center border-b border-[#d8d8d8] px-6 py-3 md:grid-cols-[240px_1fr]"
              >
                <span className="text-[16px] leading-6 text-[#606060]">{getCategoryLabel(row.categoryKey)}</span>
                <div className="mt-1 flex flex-wrap items-center gap-4 md:mt-0">
                  {row.tools.map((tool) => (
                    <a
                      key={`${stack.id}-${row.categoryKey}-${tool.name}`}
                      href={tool.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-10 items-center gap-3 text-[16px] leading-none text-black"
                    >
                      <Image
                        src={getToolImageSrc(tool.image)}
                        alt={tool.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 shrink-0 rounded-full"
                      />
                      <span className="relative -top-[4px]">{tool.name}</span>
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
