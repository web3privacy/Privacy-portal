"use client";

import Link from "next/link";
import type { AcceleratorItem } from "@/types/academy";

type Props = {
  items?: AcceleratorItem[];
};

export function AcceleratorSection({ items = [] }: Props) {
  // Fallback to default items if none provided
  const displayItems = items.length > 0 ? items : [
    { id: "default-1", title: "How to boost your crypto project?", icon: "rocket_launch", url: "https://github.com/web3privacy" },
    { id: "default-2", title: "Looking for teammates for your privacy project?", icon: "groups", url: "https://github.com/web3privacy" },
    { id: "default-3", title: "We are providing grants for hackathon winners", icon: "workspace_premium", url: "https://github.com/web3privacy" },
  ];

  return (
    <section className="mb-12 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-[22px] font-bold text-black dark:text-[#f2f4f6]">
          Accelerator
        </h2>
        <a
          href="https://github.com/web3privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#616161] hover:text-black dark:text-[#a7b0bd] dark:hover:text-white"
        >
          Build projects with us →
        </a>
      </div>
      <div className="rounded-[12px] border border-[#e0e0e0] bg-[#f0f0f0] p-6 dark:border-[#303640] dark:bg-[#1a1f27]">
        <ul className="space-y-3 mb-6">
          {displayItems.map((item) => (
            <li key={item.id}>
              <a
                href={item.url || "https://github.com/web3privacy"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 transition-colors hover:text-[#616161] dark:hover:text-[#a7b0bd]"
              >
                <span 
                  className="material-symbols-rounded text-[20px] text-[#616161] dark:text-[#a7b0bd] shrink-0"
                >
                  {item.icon || "help"}
                </span>
                <span className="text-[14px] text-black dark:text-[#f2f4f6]">
                  {item.title}
                </span>
              </a>
            </li>
          ))}
        </ul>
        <a
          href="https://academy.web3privacy.info/l/products"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center justify-center rounded-full border border-[#70FF88] bg-[#70FF88] px-4 text-[12px] font-bold uppercase tracking-[0.08em] text-black transition-all hover:-translate-y-0.5 hover:bg-[#5bee72]"
        >
          LEARN MORE
        </a>
      </div>
    </section>
  );
}
