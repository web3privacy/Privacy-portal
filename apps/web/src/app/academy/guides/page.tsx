import { GuidesPageContent } from "@/components/academy/guides-page-content";
import { loadAcademyData } from "@/lib/academy";

export const metadata = {
  title: "Guides | Privacy Academy",
  description: "Privacy guides and tutorials",
};

export default function GuidesPage() {
  const data = loadAcademyData();
  return <GuidesPageContent guides={data.guides} />;
}
