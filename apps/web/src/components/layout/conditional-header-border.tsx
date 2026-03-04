"use client";

import { usePathname } from "next/navigation";

export function ConditionalHeaderBorder({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Show border only for Explorer (project pages); News has submenu so no border needed
  const showBorder = pathname.startsWith("/project");
  
  return (
    <header className={`relative z-50 bg-white dark:bg-[#151a21] ${showBorder ? "border-b border-[#d8d8d8] dark:border-[#2c3139]" : ""}`}>
      {children}
    </header>
  );
}
