import Image from "next/image";
import Link from "next/link";
import type { Nominator } from "@/types/awards";
import { getAvatarSrc } from "@/lib/stacks-view";

type NominationCardProps = {
  nominator: Nominator;
};

export function NominationCard({ nominator }: NominationCardProps) {
  const avatarSrc = getAvatarSrc(nominator.avatar || "default-avatar.png");

  return (
    <article className="group min-h-[360px] rounded-[12px] border border-[#e0e0e0] bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.14)] dark:border-[#303640] dark:bg-[#181d25] dark:hover:shadow-[0_14px_30px_rgba(0,0,0,0.55)] md:min-h-[400px]">
      <div className="flex items-start gap-2 px-4 pb-4 pt-4 md:px-6">
        <div className="flex min-w-0 flex-1 items-start gap-3 md:gap-4">
          <Image
            src={avatarSrc}
            alt={`${nominator.name} avatar`}
            width={80}
            height={80}
            className="h-14 w-14 rounded-full object-cover md:h-20 md:w-20"
          />
          <div className="min-w-0">
            <h3 className="min-h-[2.3em] whitespace-normal break-words font-sans text-[15px] font-bold leading-[1.15] text-black transition-colors duration-200 group-hover:text-black/80 dark:text-[#f2f4f6] dark:group-hover:text-white md:min-h-0 md:text-[20px] md:leading-6">
              {nominator.name}
            </h3>
            {nominator.title && (
              <p className="mt-1 line-clamp-2 text-[12px] leading-4 tracking-[0.03em] text-black/50 dark:text-[#9ea7b5] md:text-[14px] md:leading-5">
                {nominator.title}
              </p>
            )}
            {nominator.org && (
              <p className="mt-1 line-clamp-1 text-[12px] leading-4 tracking-[0.03em] text-black/50 dark:text-[#9ea7b5] md:text-[14px] md:leading-5">
                {nominator.org}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-1.5 border-t border-[#e0e0e0] px-4 pb-3 pt-3 dark:border-[#303640] md:space-y-3 md:px-6 md:pb-4 md:pt-4">
        {nominator.nominations.map((nomination) => {
          const projectLink = nomination.projectId ? `/project/${nomination.projectId}` : nomination.url;
          const NomineeContent = (
            <div className="flex w-full items-start gap-3 rounded-[8px] px-2 py-1 transition-colors hover:bg-[#f7f7f7] dark:hover:bg-white/10 md:py-2">
              {nomination.icon && (
                <Image
                  src={nomination.icon}
                  alt={nomination.nominee}
                  width={40}
                  height={40}
                  className="h-8 w-8 rounded-full md:h-10 md:w-10"
                />
              )}
              <div className="min-w-0 pt-0.5">
                <span className="block text-[11px] leading-4 tracking-[0.03em] text-[#606060] dark:text-[#9ca5b3] md:text-[12px] md:leading-5">
                  {getCategoryLabel(nomination.category)}
                </span>
                <span className="block whitespace-normal break-words text-[14px] leading-5 text-black dark:text-[#f2f4f6] md:text-[16px]">
                  {nomination.nominee}
                </span>
                {nomination.description && (
                  <span className="block mt-1 text-[12px] leading-4 text-black/70 dark:text-[#a8b0bd] md:text-[13px]">
                    {nomination.description}
                  </span>
                )}
              </div>
            </div>
          );

          return (
            <div key={nomination.id} className="flex items-start gap-3">
              {projectLink ? (
                <Link href={projectLink} className="flex-1">
                  {NomineeContent}
                </Link>
              ) : (
                NomineeContent
              )}
            </div>
          );
        })}
      </div>
    </article>
  );
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    "favourite-privacy-project": "Favourite Privacy Project",
    "exciting-innovation": "Exciting Innovation",
    "major-news-event": "Major News / Event",
    "doxxer-of-year": "Doxxer of the Year",
  };
  return labels[category] || category;
}
