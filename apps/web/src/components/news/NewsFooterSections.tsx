"use client";

import { NewsContributeSection } from "./NewsContributeSection";
import { NewsDonationSection } from "./NewsDonationSection";

type FeaturedProject = {
  id: string;
  name: string;
  logos?: Array<{ file?: string; url?: string }>;
};

type DonationTier = {
  amount: string;
  label: string;
  url?: string;
};

type Props = {
  featuredProjects: FeaturedProject[];
  donationTiers: DonationTier[];
};

export function NewsFooterSections({ featuredProjects, donationTiers }: Props) {
  return (
    <div className="mt-16 w-full border-t border-black/10 dark:border-white/10">
      <div className="viewport-range-shell mx-auto w-full px-4 py-12 md:px-6">
        <NewsContributeSection featuredProjects={featuredProjects} />
        <section className="mt-12">
          <NewsDonationSection tiers={donationTiers} />
        </section>
      </div>
    </div>
  );
}
