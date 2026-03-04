import { RadioPageContent } from "@/components/academy/radio-page-content";
import { loadAcademyData, fetchRadioTracks } from "@/lib/academy";

export const metadata = {
  title: "Radio & Interviews | Privacy Academy",
  description: "Privacy radio interviews and audio content",
};

export default async function RadioPage() {
  const data = loadAcademyData();
  const externalTracks = await fetchRadioTracks();
  
  // Merge and sort by displayOrder
  const allTracks = [...externalTracks, ...data.radioTracks].sort((a, b) => {
    if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
      return a.displayOrder - b.displayOrder;
    }
    if (a.displayOrder !== undefined) return -1;
    if (b.displayOrder !== undefined) return 1;
    return 0;
  });

  return <RadioPageContent tracks={allTracks} />;
}
