"use client";

import type { FeaturedDocument } from "@/types/academy";

type Props = {
  documents: FeaturedDocument[];
};

export function FeaturedDocuments({ documents }: Props) {
  if (documents.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="mb-4 font-serif text-[22px] font-bold text-black dark:text-[#f2f4f6]">
        Featured Documents
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {documents.map((doc) => (
          <a
            key={doc.id}
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-[12px] border border-[#e0e0e0] bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.14)] dark:border-[#303640] dark:bg-[#181d25] dark:hover:shadow-[0_14px_30px_rgba(0,0,0,0.55)]"
          >
            <div className="relative aspect-video w-full overflow-hidden rounded-t-[12px] bg-[#f5f5f5] dark:bg-[#252b35]">
              {doc.thumbnailUrl && doc.thumbnailUrl.trim() ? (
                <img
                  src={doc.thumbnailUrl}
                  alt={doc.title}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    // Hide image and show icon on error
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent && !parent.querySelector('.material-symbols-rounded')) {
                      const iconDiv = document.createElement('div');
                      iconDiv.className = 'flex h-full items-center justify-center';
                      iconDiv.innerHTML = '<span class="material-symbols-rounded text-[48px] text-[#616161] dark:text-[#a7b0bd]">description</span>';
                      parent.appendChild(iconDiv);
                    }
                  }}
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="material-symbols-rounded text-[48px] text-[#616161] dark:text-[#a7b0bd]">
                    description
                  </span>
                </div>
              )}
              {doc.duration && (
                <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                  {doc.duration}
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="line-clamp-2 font-sans text-[15px] font-semibold leading-tight text-black dark:text-[#f2f4f6]">
                {doc.title}
              </h3>
              {doc.description && (
                <p className="mt-1 line-clamp-2 text-[12px] text-[#616161] dark:text-[#a7b0bd]">
                  {doc.description}
                </p>
              )}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
