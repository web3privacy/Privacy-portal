"use client";

import Image from "next/image";
import type { Job } from "@/types/jobs";
import { basePath } from "@/lib/utils";

type Props = { job: Job };

const TYPE_TAGS = ["Remote", "Full-time", "Part-time", "Contract"];

function getPlaceholderLogo(company: string): string {
  const name = encodeURIComponent(company.slice(0, 2).toUpperCase());
  return `https://ui-avatars.com/api/?name=${name}&size=96&background=e8e8e8&color=616161`;
}

export function JobCard({ job }: Props) {
  const logo = job.companyLogo
    ? job.companyLogo.startsWith("http")
      ? job.companyLogo
      : `${basePath}${job.companyLogo}`
    : getPlaceholderLogo(job.company);

  const typeTags = job.tags.filter((t) => TYPE_TAGS.includes(t));
  const otherTags = job.tags.filter((t) => !TYPE_TAGS.includes(t));

  return (
    <article className="group rounded-[12px] border border-[#e0e0e0] bg-white px-4 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#f8f8f8] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] dark:border-[#303640] dark:bg-[#181d25] dark:hover:bg-[#1f252d] dark:hover:shadow-[0_8px_20px_rgba(0,0,0,0.25)] sm:flex sm:items-center sm:justify-between sm:gap-4">
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex-shrink-0 size-12 rounded-full bg-[#e8e8e8] dark:bg-[#2c3139] overflow-hidden flex items-center justify-center">
          <Image
            src={logo}
            alt={job.company}
            width={48}
            height={48}
            className="object-cover w-full h-full"
            unoptimized
          />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-[#121212] dark:text-[#f2f4f6] truncate">
            {job.title}
          </h3>
          <p className="text-sm text-[#616161] dark:text-[#a7b0bd]">{job.company}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-0">
        <span className="px-2 py-1 text-xs rounded-[6px] bg-[#e0e0e0] text-black dark:bg-[#3b4048] dark:text-[#f2f4f6]">
          {job.category}
        </span>
        {typeTags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 text-xs rounded-[6px] bg-black text-white dark:bg-white dark:text-black"
          >
            {tag}
          </span>
        ))}
        {otherTags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 text-xs rounded-[6px] bg-[#e0e0e0] text-black dark:bg-[#3b4048] dark:text-[#f2f4f6]"
          >
            {tag}
          </span>
        ))}
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] font-medium uppercase tracking-[0.08em] text-black dark:text-[#f2f4f6]"
        >
          open website →
        </a>
      </div>
    </article>
  );
}
