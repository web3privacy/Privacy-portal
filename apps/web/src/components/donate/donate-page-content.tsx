"use client";

import { Suspense } from "react";
import { DonateThemeHandler } from "./donate-theme-handler";
import { DonateHero } from "./donate-hero";
import { GetInvolvedSection } from "./get-involved-section";
import { NftPlaceholderSection } from "./nft-placeholder-section";
import { CryptoDonationSection } from "./crypto-donation-section";
import { MembershipSection } from "./membership-section";

export function DonatePageContent() {
  return (
    <>
      <Suspense fallback={null}>
        <DonateThemeHandler />
      </Suspense>
      <main className="min-h-screen bg-white text-[#121212] dark:bg-[#0f1318] dark:text-[#f2f4f6]">
        <DonateHero />
        <GetInvolvedSection />
        <NftPlaceholderSection />
        <CryptoDonationSection />
        <MembershipSection />
      </main>
    </>
  );
}
