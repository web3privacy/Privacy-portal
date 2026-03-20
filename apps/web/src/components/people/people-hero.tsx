"use client";

import { useEffect, useRef } from "react";

export function PeopleHero() {
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
        const parallaxOffset = scrollY * 0.15;
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
    <section className="relative overflow-hidden border-b border-[#d8d8d8] bg-[#000000] px-4 py-16 dark:border-[#2c3139] dark:bg-[#000000] md:px-6 md:py-20 lg:py-24">
      <div className="absolute inset-0">
        {/* Background image - full cover, clipped by section overflow-hidden */}
        <div 
          ref={backgroundRef}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/bg-people.png')",
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
            willChange: "background-position",
          }}
        />
        {/* Side fade overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-80" />
        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black to-transparent" />
      </div>
      <div className="viewport-range-shell relative mx-auto max-w-[1140px] lg:max-w-[75vw]">
        {/* Title and Description */}
        <div className="text-center">
          <h1 className="font-serif text-[36px] font-bold text-white md:text-[48px] lg:text-[56px] tracking-tight">
            Personas
          </h1>
          <p className="mx-auto mt-4 max-w-[640px] text-[15px] leading-relaxed text-white/90 md:text-[16px]">
            These foundational documents form the bedrock of the Cypherpunk movement. Reading them will provide you with a deep understanding of the ideals and motivations that inspired activists to leverage technology in the defense of individual rights and freedoms.
          </p>
        </div>
      </div>
    </section>
  );
}
