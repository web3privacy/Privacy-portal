import Image from "next/image";
import Link from "next/link";
import type { Winner, AwardCategory } from "@/types/awards";

type WinnerCardProps = {
  winner: Winner;
  categoryName: string;
};

export function WinnerCard({ winner, categoryName }: WinnerCardProps) {
  const projectLink = winner.projectId ? `/project/${winner.projectId}` : winner.url;
  
  const CardContent = (
    <div className="flex flex-col items-center text-center">
      {winner.icon && (
        <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-black p-3 dark:bg-white md:h-24 md:w-24">
          <Image
            src={winner.icon}
            alt={winner.winner}
            width={64}
            height={64}
            className="h-full w-full object-contain"
          />
        </div>
      )}
      <div className="min-w-0 flex-1">
        {categoryName && (
          <span className="block text-[11px] leading-4 tracking-[0.03em] text-[#606060] dark:text-[#9ca5b3] md:text-[12px] md:leading-5">
            {categoryName}
          </span>
        )}
        <h3 className="mt-1 text-[16px] font-bold leading-6 text-black dark:text-[#f2f4f6] md:text-[18px]">
          {winner.winner}
        </h3>
        {winner.description && (
          <p className="mt-2 text-[13px] leading-5 text-black/70 dark:text-[#a8b0bd]">
            {winner.description}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="rounded-[12px] border border-[#e0e0e0] bg-white p-4 transition-all hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.14)] dark:border-[#303640] dark:bg-[#181d25] dark:hover:shadow-[0_14px_30px_rgba(0,0,0,0.55)] md:p-6">
      {projectLink ? (
        <Link href={projectLink}>
          {CardContent}
        </Link>
      ) : (
        CardContent
      )}
    </div>
  );
}

type WinnersSectionProps = {
  winners?: Winner[];
  categories: Array<{ id: AwardCategory; name: string }>;
  year?: number;
};

export function WinnersSection({ winners = [], categories, year }: WinnersSectionProps) {
  const categoryMap = new Map(categories.map(c => [c.id, c.name]));

  if (winners.length === 0) {
    return (
      <section className="mb-12">
        <h2 className="mb-6 text-[24px] font-bold text-black dark:text-[#f2f4f6] md:text-[32px]">
          Winners
        </h2>
        <div className="rounded-[12px] border border-[#e0e0e0] bg-white p-8 text-center dark:border-[#303640] dark:bg-[#181d25]">
          <p className="text-[16px] text-black/70 dark:text-[#a8b0bd]">
            Winners will be announced soon
          </p>
        </div>
      </section>
    );
  }

  // Group winners by category
  const winnersByCategory = new Map<AwardCategory, Winner[]>();
  winners.forEach(winner => {
    const existing = winnersByCategory.get(winner.category) || [];
    winnersByCategory.set(winner.category, [...existing, winner]);
  });

  // Use provided year or calculate from context
  const winnersYear = year || (winners.length > 0 ? new Date().getFullYear() - 1 : new Date().getFullYear());

  return (
    <section className="mb-12">
      <h2 className="mb-6 text-[24px] font-bold text-black dark:text-[#f2f4f6] md:text-[32px]">
        Winners of {winnersYear}
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from(winnersByCategory.entries()).map(([category, categoryWinners]) => (
          <div key={category} className="space-y-4">
            <h3 className="mb-2 text-[14px] font-bold uppercase tracking-[0.08em] text-black/70 dark:text-[#a8b0bd]">
              {categoryMap.get(category) || category}
            </h3>
            {categoryWinners.map((winner, index) => (
              <WinnerCard
                key={`${category}-${index}`}
                winner={winner}
                categoryName=""
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
