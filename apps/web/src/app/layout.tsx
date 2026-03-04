import type { Metadata } from "next";

import "@web3privacy/portal-ui/global-footer.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { WalletProvider } from "@/components/wallet/wallet-provider";
import { PortalOrOrgShell } from "@/components/layout/portal-or-org-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Privacy Portal | Explorer & Stacks",
  description: "Explore privacy-related projects and personal FOSS stacks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600;700&family=Domine:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,400,0,0&display=swap"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var key='privacy-portal-theme';var v=localStorage.getItem(key);var t=(v==='dark'?'dark':'light');document.documentElement.classList.toggle('dark',t==='dark');document.documentElement.style.colorScheme=t;}catch(e){document.documentElement.classList.remove('dark');document.documentElement.style.colorScheme='light';}})();`,
          }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <NuqsAdapter>
          <WalletProvider>
            <PortalOrOrgShell>{children}</PortalOrOrgShell>
          </WalletProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
