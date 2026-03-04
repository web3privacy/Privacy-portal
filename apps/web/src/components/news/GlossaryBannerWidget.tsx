"use client";

import Link from "next/link";
import Image from "next/image";

export function GlossaryBannerWidget() {
  return (
    <Link
      href="/glossary"
      className="group relative block overflow-hidden rounded-[12px] border border-[#e0e0e0] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.14)] dark:border-[#303640] dark:hover:shadow-[0_14px_30px_rgba(0,0,0,0.55)]"
    >
      <div className="relative h-36 w-full md:h-40">
        <Image
          src="/images/bg-glossary-banner.png"
          alt="Privacy Glossary"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-center p-4 pl-[30%]">
          <h3 className="mb-2 font-serif text-[18px] font-bold text-white">
            Learn all the terms
          </h3>
          <p className="mb-4 text-[13px] leading-relaxed text-white/90 line-clamp-2">
            Privacy, cryptography, technological acronyms – learn all the important stuff in our glossary.
          </p>
          <span className="inline-flex h-9 w-fit items-center justify-center rounded-full border border-[#70FF88] bg-[#70FF88] px-3 text-[11px] font-bold uppercase tracking-[0.08em] text-black transition-all group-hover:bg-[#5bee72]">
            PRIVACY GLOSSARY
          </span>
        </div>
      </div>
    </Link>
  );
}
