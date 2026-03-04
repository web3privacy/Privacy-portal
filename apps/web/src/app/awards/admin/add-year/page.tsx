import { AddYearForm } from "@/components/awards/add-year-form";
import { loadAwardsData } from "@/lib/awards";

export const metadata = {
  title: "Add Awards Year | Privacy Portal",
};

export const revalidate = 0;

export default async function AddYearPage() {
  const data = loadAwardsData();
  const existingYears = data.years.map((y) => y.year);

  return <AddYearForm existingYears={existingYears} />;
}
