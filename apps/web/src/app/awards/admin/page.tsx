import { AwardsAdmin } from "@/components/awards/awards-admin";
import { loadAwardsData } from "@/lib/awards";

export const metadata = {
  title: "Awards Admin | Privacy Portal",
  description: "Admin interface for managing Awards",
};

export const revalidate = 0;

export default async function AwardsAdminPage() {
  const data = loadAwardsData();

  return <AwardsAdmin data={data} />;
}
