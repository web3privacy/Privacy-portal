import type { Metadata } from "next";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import { getNavItems, PortalHeader } from "@web3privacy/portal-ui";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Explorer | Privacy Portal",
  description: "Explore privacy-related projects and tools.",
};

function getNavUrls() {
  return {
    webUrl: process.env.NEXT_PUBLIC_WEB_URL ?? undefined,
    explorerUrl: process.env.NEXT_PUBLIC_EXPLORER_URL ?? undefined,
    stacksUrl: process.env.NEXT_PUBLIC_STACKS_URL ?? undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navItems = getNavItems("explorer", getNavUrls());

  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,400,0,0&display=swap"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var key='privacy-portal-theme';var v=localStorage.getItem(key);var t=(v==='dark'?'dark':'light');document.documentElement.classList.toggle('dark',t==='dark');document.documentElement.style.colorScheme=t;}catch(e){document.documentElement.classList.remove('dark');document.documentElement.style.colorScheme='light';}})();`,
          }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <NuqsAdapter>
          <header className="sticky top-0 z-50 border-b border-[#d8d8d8] bg-white dark:border-[#2c3139] dark:bg-[#151a21]">
            <PortalHeader
              activeId="explorer"
              navItems={navItems}
              rightSlot={
                <Link
                  href="/project/create"
                  className="inline-flex items-center rounded-[10px] border border-black/15 bg-white px-3 py-2 text-[12px] font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-black/5 dark:border-white/15 dark:bg-[#151a21] dark:text-[#f2f4f6] dark:hover:bg-white/10"
                >
                  + Add project
                </Link>
              }
            />
          </header>
          <main className="flex-1">{children}</main>
        </NuqsAdapter>
      </body>
    </html>
  );
}
