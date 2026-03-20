import { AcademyPageContent } from "@/components/academy/academy-page-content";
import { loadAcademyData, getPopularTalks, fetchYouTubeVideos, fetchCourses, fetchRadioTracks, fetchPodcasts } from "@/lib/academy";

export const metadata = {
  title: "Academy | Privacy Portal",
  description: "A curated list of guides, lectures, talks, interviews, documents all to teach you what privacy means for you.",
};

// Disable caching to ensure fresh data
export const revalidate = 0;

export default async function AcademyPage() {
  const data = loadAcademyData();

  // Fetch external data in parallel
  const [youtubeTalks, externalCourses, radioTracks, podcasts] = await Promise.all([
    fetchYouTubeVideos("@Web3PrivacyNow"),
    fetchCourses(),
    fetchRadioTracks(),
    fetchPodcasts(),
  ]);

  // Merge YouTube talks with local data and sort by displayOrder if set
  const allTalks = [...youtubeTalks, ...data.talks].sort((a, b) => {
    if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
      return a.displayOrder - b.displayOrder;
    }
    if (a.displayOrder !== undefined) return -1;
    if (b.displayOrder !== undefined) return 1;
    return 0;
  });
  const popularTalks = getPopularTalks(allTalks, 8);
  
  // Merge external courses with local data
  const allCourses = [...externalCourses, ...data.courses];

  // Merge radio tracks with local data
  const allRadioTracks = [...radioTracks, ...data.radioTracks].sort((a, b) => {
    if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
      return a.displayOrder - b.displayOrder;
    }
    if (a.displayOrder !== undefined) return -1;
    if (b.displayOrder !== undefined) return 1;
    return 0;
  });

  // Merge podcasts with local data
  const allPodcasts = [...podcasts, ...(data.podcasts || [])];

  // Populate featured documents with random videos from YouTube if empty
  let featuredDocs = [...data.featuredDocuments];
  if (featuredDocs.length === 0 && youtubeTalks.length > 0) {
    // Take random 4 videos from YouTube channel
    const shuffled = [...youtubeTalks].sort(() => 0.5 - Math.random());
    featuredDocs = shuffled.slice(0, 4).map((talk, index) => ({
      id: `doc-yt-${talk.youtubeId}`,
      title: talk.title,
      description: talk.description || "",
      thumbnailUrl: talk.thumbnailUrl,
      url: `https://www.youtube.com/watch?v=${talk.youtubeId}`,
      duration: talk.duration || "",
      createdAt: talk.publishedAt || new Date().toISOString(),
    }));
  }

  return (
    <AcademyPageContent
      talks={allTalks}
      courses={allCourses}
      guides={data.guides}
      featuredDocuments={featuredDocs}
      popularTalks={popularTalks}
      radioTracks={allRadioTracks}
      radioPlaylists={data.radioPlaylists}
      acceleratorItems={data.acceleratorItems}
      podcasts={allPodcasts}
    />
  );
}
