"use client";

import Image from "next/image";
import Link from "next/link";

type FeaturedProject = {
  id: string;
  name: string;
  logos?: Array<{ file?: string; url?: string }>;
};

type Props = {
  featuredProjects: FeaturedProject[];
};

export function NewsContributeSection({ featuredProjects }: Props) {
  return (
    <section className="rounded-xl border border-black/10 bg-white p-8 dark:border-white/10 dark:bg-[#151a21] md:p-12">
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-black/5 dark:bg-black/30">
          <span className="material-symbols-rounded text-[64px] text-black/20 dark:text-white/20">
            visibility
          </span>
        </div>
        <h2 className="text-xl font-bold text-black dark:text-white md:text-2xl">
          Contribute to Future of Privacy
        </h2>
        <p className="mt-3 max-w-xl text-sm text-black/65 dark:text-white/65">
          Join our community of privacy builders and help shape the future of decentralized privacy technologies.
        </p>
        <Link
          href="/explorer"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#70ff88] px-6 py-3 font-semibold text-black transition-colors hover:bg-[#5eef70]"
        >
          View all Privacy Projects
        </Link>
      </div>

      {featuredProjects.length > 0 && (
        <div className="mt-10 grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
          {featuredProjects.slice(0, 24).map((p) => {
            const logoUrl = p.logos?.[0]?.url
              ? p.logos[0].url
              : p.logos?.[0]?.file
                ? `/project-assets/projects/${encodeURIComponent(p.id)}/${encodeURIComponent(p.logos[0].file)}`
                : null;
            return (
              <Link
                key={p.id}
                href={`/project/${p.id}`}
                className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-white transition-colors hover:bg-black/5 dark:border-white/10 dark:bg-[#0f1318] dark:hover:bg-white/10 md:h-16 md:w-16"
                title={p.name}
              >
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt={p.name}
                    width={48}
                    height={48}
                    className="h-10 w-10 object-contain md:h-12 md:w-12"
                    unoptimized={logoUrl.startsWith("http")}
                  />
                ) : (
                  <span className="text-xs font-medium text-black/40 dark:text-white/40">
                    {p.name.slice(0, 1)}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
