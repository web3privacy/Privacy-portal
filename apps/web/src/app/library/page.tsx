import { LibraryPageContent } from "@/components/library/library-page-content";
import {
  loadLibraryData,
  loadLibraryRecommendations,
  getRecommendCounts,
} from "@/lib/library";

export const metadata = {
  title: "Library | Privacy Portal",
  description:
    "Foundational documents, articles, and books on privacy, cryptography, and the Cypherpunk movement.",
};

export default function LibraryPage() {
  try {
    const data = loadLibraryData();
    const recSchema = loadLibraryRecommendations();
    const recommendCounts = getRecommendCounts(recSchema);
    return (
      <LibraryPageContent data={data} initialRecommendCounts={recommendCounts} />
    );
  } catch (error) {
    console.error("Error loading library page:", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error loading Library</h1>
          <p className="text-gray-600">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }
}
