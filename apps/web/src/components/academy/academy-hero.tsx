"use client";

import { useEffect, useRef } from "react";

export function AcademyHero() {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      rafRef.current = requestAnimationFrame(() => {
        if (!backgroundRef.current) return;
        const scrollY = window.scrollY;
        // Jemný vertikální posun - pohybuje se pomaleji než scroll
        const parallaxOffset = scrollY * 0.15;
        // Použijeme background-position pro plynulejší efekt, zarovnáno na bottom
        backgroundRef.current.style.backgroundPosition = `center calc(100% + ${parallaxOffset}px)`;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <section className="relative border-b border-[#d8d8d8] bg-[#000000] px-4 py-16 dark:border-[#2c3139] dark:bg-[#000000] md:px-6 md:py-20 lg:py-24">
      <div className="absolute inset-0 overflow-hidden">
        {/* Background image - aligned to bottom, 1440px wide */}
        <div 
          ref={backgroundRef}
          className="absolute left-1/2 bottom-0 w-[1440px] -translate-x-1/2 bg-cover bg-no-repeat"
          style={{
            backgroundImage: "url('/images/bg-academy.png')",
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
            height: "100%",
            willChange: "background-position",
          }}
        />
        {/* Gradient overlays - 128px transitions on both sides */}
        <div className="absolute left-0 top-0 h-full w-full">
          <div className="absolute left-0 top-0 h-full w-[calc((100%-1440px)/2+128px)] bg-[#000000]" />
          <div className="absolute left-[calc((100%-1440px)/2+128px)] top-0 h-full w-[128px] bg-gradient-to-r from-[#000000] to-transparent" />
          <div className="absolute right-[calc((100%-1440px)/2+128px)] top-0 h-full w-[128px] bg-gradient-to-l from-[#000000] to-transparent" />
          <div className="absolute right-0 top-0 h-full w-[calc((100%-1440px)/2+128px)] bg-[#000000]" />
        </div>
      </div>
      <div className="viewport-range-shell relative mx-auto max-w-[1140px] lg:max-w-[75vw]">
        
        {/* Title and Description */}
        <div className="text-center">
          <h1 className="font-serif text-[36px] font-bold text-white md:text-[48px] lg:text-[56px] tracking-tight">
            Privacy Academy
          </h1>
          <p className="mx-auto mt-4 max-w-[640px] text-[15px] leading-relaxed text-white/90 md:text-[16px]">
            A curated list of guides, lectures, talks, interviews, documents all to teach you what privacy means for you.
          </p>
        </div>
      </div>
    </section>
  );
}
