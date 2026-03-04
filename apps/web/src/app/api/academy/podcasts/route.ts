import { NextResponse } from "next/server";

/**
 * API endpoint to fetch podcasts from YouTube playlist (Interview playlist)
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
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    
    if (!response.ok) {
      return NextResponse.json({ podcasts: [] });
    }
    
    const xmlText = await response.text();
    
    // Parse XML
    const podcasts: any[] = [];
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
      
      // Extract media description
      const descriptionMatch = entry.match(/<media:description>([\s\S]*?)<\/media:description>/);
      let description = descriptionMatch ? descriptionMatch[1].trim() : "";
      // Clean up HTML entities and tags
      description = description
        .replace(/<[^>]+>/g, '')
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&nbsp;/g, ' ')
        .trim();
      
      podcasts.push({
        id: `podcast-${videoId}`,
        title: title,
        description: description || undefined,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        publishedAt: published,
        createdAt: published,
      });
    }
    
    return NextResponse.json({ podcasts });
  } catch (error) {
    console.error("Error fetching podcasts:", error);
    return NextResponse.json({ podcasts: [] });
  }
}
