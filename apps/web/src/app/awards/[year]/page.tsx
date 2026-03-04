import { AwardsPageContent } from "@/components/awards/awards-page-content";
import { loadAwardsData, getAwardYear } from "@/lib/awards";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Awards | Privacy Portal",
  description: "Annual community driven awards given to the best and the worst within the privacy ecosystem",
};

// Disable caching to ensure fresh data
export const revalidate = 0;

type Props = {
  params: Promise<{ year: string }>;
};

export default async function AwardsYearPage({ params }: Props) {
  const { year: yearParam } = await params;
  const year = parseInt(yearParam, 10);

  if (isNaN(year)) {
    return notFound();
  }

  const data = loadAwardsData();
  const awardYear = getAwardYear(data, year);

  if (!awardYear) {
    return notFound();
  }

  const availableYears = data.years.map(y => y.year).sort((a, b) => b - a);

  return (
    <AwardsPageContent
      year={awardYear}
      availableYears={availableYears}
    />
  );
}
