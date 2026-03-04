import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";
import { SiteFooter } from "@/components/layout/site-footer";
import { WalletProvider } from "@/components/wallet/wallet-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: {
      default: siteConfig.name,
      template: `%s - ${siteConfig.name}`,
    },
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: siteConfig.name,
      template: `%s - ${siteConfig.name}`,
    },
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
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
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var isShare=window.location.pathname.indexOf('/share/')===0;var key='privacy-portal-theme';var v=localStorage.getItem(key);var t=isShare?'light':(v==='dark'?'dark':'light');document.documentElement.classList.toggle('dark',t==='dark');document.documentElement.style.colorScheme=t;}catch(e){document.documentElement.classList.remove('dark');document.documentElement.style.colorScheme='light';}})();`,
          }}
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,400,0,0&display=swap"
        />
      </head>
      <body className="antialiased">
        <WalletProvider>
          {children}
          <SiteFooter />
        </WalletProvider>
      </body>
    </html>
  );
}
