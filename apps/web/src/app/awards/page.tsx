import { AwardsPageContent } from "@/components/awards/awards-page-content";
import { loadAwardsData, getAwardYear, getLatestAwardYear } from "@/lib/awards";
import { notFound, redirect } from "next/navigation";

export const metadata = {
  title: "Awards | Privacy Portal",
  description: "Annual community driven awards given to the best and the worst within the privacy ecosystem",
};

// Disable caching to ensure fresh data
export const revalidate = 0;

export default async function AwardsPage() {
  const data = loadAwardsData();
  
  if (data.years.length === 0) {
    return (
      <main className="min-h-screen bg-white text-[#121212] dark:bg-[#0f1318] dark:text-[#f2f4f6]">
        <div className="viewport-range-shell mx-auto w-full max-w-[1140px] px-4 py-20 text-center md:px-6 lg:max-w-[75vw]">
          <h1 className="mb-4 text-[32px] font-bold text-black dark:text-[#f2f4f6]">
            Awards
          </h1>
          <p className="text-[16px] text-black/70 dark:text-[#a8b0bd]">
            No awards data available yet.
          </p>
        </div>
      </main>
    );
  }

  // Get the latest year by default
  const latestYear = getLatestAwardYear(data);
  if (!latestYear) {
    return notFound();
  }

  // Redirect to latest year
  redirect(`/awards/${latestYear.year}`);
}
