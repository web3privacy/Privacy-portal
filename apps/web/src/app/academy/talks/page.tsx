import { TalksPageContent } from "@/components/academy/talks-page-content";
import { loadAcademyData, getPopularTalks, fetchYouTubeVideos } from "@/lib/academy";

export const metadata = {
  title: "Talks | Privacy Academy",
  description: "All privacy talks and interviews from Web3PrivacyNow YouTube channel.",
};

// Disable caching to ensure fresh data
export const revalidate = 0;

export default async function TalksPage() {
  const data = loadAcademyData();
  const youtubeTalks = await fetchYouTubeVideos("@Web3PrivacyNow");
  
  // Merge and sort by displayOrder
  const allTalks = [...youtubeTalks, ...data.talks].sort((a, b) => {
    if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
      return a.displayOrder - b.displayOrder;
    }
    if (a.displayOrder !== undefined) return -1;
    if (b.displayOrder !== undefined) return 1;
    // Fallback to viewCount or publishedAt
    if (a.viewCount && b.viewCount) {
      return b.viewCount - a.viewCount;
    }
    if (a.publishedAt && b.publishedAt) {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    }
    return 0;
  });

  return <TalksPageContent talks={allTalks} />;
}
