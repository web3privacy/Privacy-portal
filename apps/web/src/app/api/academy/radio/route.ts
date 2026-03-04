import { NextResponse } from "next/server";

/**
 * API endpoint to fetch radio/interview tracks from YouTube playlist
 * Playlist: https://www.youtube.com/playlist?list=PLSsVHWrO8Yh1WwICFUsZnB__ThC9bhgqM
 * 
 * Fetches videos from YouTube playlist using RSS feed
 */
export async function GET() {
  try {
    const playlistId = "PLSsVHWrO8Yh1WwICFUsZnB__ThC9bhgqM";
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`;
    
    // Fetch RSS feed
    const response = await fetch(rssUrl, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    
    if (!response.ok) {
      return NextResponse.json({ tracks: [] });
    }
    
    const xmlText = await response.text();
    
    // Parse XML
    const tracks: any[] = [];
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let match;
    
    while ((match = entryRegex.exec(xmlText)) !== null) {
      const entry = match[1];
      
      // Extract video ID
      const videoIdMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      const videoId = videoIdMatch ? videoIdMatch[1] : null;
      
      if (!videoId) continue;
      
      // Extract title
      const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
      const title = titleMatch ? titleMatch[1] : "";
      
      // Extract published date
      const publishedMatch = entry.match(/<published>([^<]+)<\/published>/);
      const published = publishedMatch ? publishedMatch[1] : new Date().toISOString();
      
      // Extract author (speaker)
      const authorMatch = entry.match(/<name>([^<]+)<\/name>/);
      const author = authorMatch ? authorMatch[1] : "";
      
      tracks.push({
        id: `radio-${videoId}`,
        title: title,
        youtubeId: videoId,
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        speaker: author || undefined,
        createdAt: published,
      });
    }
    
    return NextResponse.json({ tracks });
  } catch (error) {
    console.error("Error fetching radio tracks:", error);
    return NextResponse.json({ tracks: [] });
  }
}
