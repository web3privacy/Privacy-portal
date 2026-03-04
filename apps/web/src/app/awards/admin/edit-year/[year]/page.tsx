import { AddYearForm } from "@/components/awards/add-year-form";
import { loadAwardsData, getAwardYear } from "@/lib/awards";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Edit Awards Year | Privacy Portal",
};

export const revalidate = 0;

type Props = {
  params: Promise<{ year: string }>;
};

export default async function EditYearPage({ params }: Props) {
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

  const existingYears = data.years.map((y) => y.year);

  return <AddYearForm existingYears={existingYears} initialData={awardYear} />;
}
