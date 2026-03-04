import Image from "next/image";
import Link from "next/link";
import type { Person } from "@/types/people";
import { getAvatarSrc } from "@/lib/stacks-view";

type PersonCardProps = {
  person: Person;
};

export function PersonCard({ person }: PersonCardProps) {
  const avatarSrc = getAvatarSrc(person.avatar || "default-avatar.png");
  const displayName = person.displayName || person.name;
  const handle = person.links?.find(l => l.type === "twitter")?.url.split("/").pop() || 
                 person.links?.find(l => l.type === "github")?.url.split("/").pop();

  return (
    <Link href={`/people/${person.id}`}>
      <article className="group relative rounded-[12px] border border-[#e0e0e0] bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.14)] dark:border-[#303640] dark:bg-[#181d25] dark:hover:shadow-[0_14px_30px_rgba(0,0,0,0.55)]">
        {/* Globe icon in top-right */}
        <div className="absolute right-4 top-4 opacity-50">
          <span className="material-symbols-rounded text-[18px] text-black/30 dark:text-white/30">
            language
          </span>
        </div>
        
        {/* Profile picture */}
        <div className="mb-4 flex justify-center">
          <Image
            src={avatarSrc}
            alt={displayName}
            width={120}
            height={120}
            className="h-24 w-24 rounded-full object-cover md:h-32 md:w-32"
          />
        </div>
        
        {/* Name and handle */}
        <div className="text-center">
          <h3 className="text-[18px] font-bold text-black dark:text-[#f2f4f6] md:text-[20px]">
            {displayName}
          </h3>
          {handle && (
            <p className="mt-1 text-[14px] text-black/50 dark:text-[#9ea7b5]">
              @{handle}
            </p>
          )}
        </div>
        
        {/* Description */}
        {person.description && (
          <p className="mt-3 line-clamp-3 text-[14px] leading-relaxed text-black/70 dark:text-[#a8b0bd]">
            {person.description}
          </p>
        )}
        
        {/* Tags */}
        {person.tags && person.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {person.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-[100px] bg-[#d9d9d9] px-3 py-1 text-[12px] leading-5 text-black dark:bg-[#2a3039] dark:text-[#f2f4f6]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </Link>
  );
}
