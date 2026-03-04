"use client";

import Link from "next/link";
import Image from "next/image";

export function GlossaryBanner() {
  return (
    <section className="mb-12">
      <h2 className="mb-4 font-serif text-[22px] font-bold text-black dark:text-[#f2f4f6]">
        Glossary
      </h2>
      <Link
        href="/glossary"
        className="group relative block overflow-hidden rounded-[12px] border border-[#e0e0e0] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.14)] dark:border-[#303640] dark:hover:shadow-[0_14px_30px_rgba(0,0,0,0.55)]"
      >
        <div className="relative h-48 w-full md:h-64">
          <Image
            src="/images/bg-glossary-banner.png"
            alt="Glossary"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-8" style={{ paddingLeft: '33%' }}>
            <h3 className="mb-3 font-serif text-[24px] font-bold text-white md:text-[28px]">
              Learn all the terms
            </h3>
            <p className="mb-6 text-[15px] leading-relaxed text-white/90">
              Privacy, Cryptography, Technological acronyms and terms could be confusing, so we made a list where you can learn all the important stuff.
            </p>
            <span className="inline-flex h-10 w-fit items-center justify-center rounded-full border border-[#70FF88] bg-[#70FF88] px-4 text-[12px] font-bold uppercase tracking-[0.08em] text-black transition-all group-hover:-translate-y-0.5 group-hover:bg-[#5bee72]">
              PRIVACY GLOSSARY
            </span>
          </div>
        </div>
      </Link>
    </section>
  );
}
