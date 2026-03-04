import { NextResponse } from "next/server";

/**
 * API endpoint to fetch YouTube videos from Web3PrivacyNow channel
 * Channel: https://www.youtube.com/@Web3PrivacyNow
 * 
 * Uses YouTube RSS feed (no API key needed)
 * For channel handle @Web3PrivacyNow, we can use the channel's custom URL
 * to get the channel ID, or use the handle directly in RSS feed
 */
export async function GET() {
  try {
    // Method 1: Try to get channel ID from channel page
    // Channel handle: @Web3PrivacyNow
    // Channel URL: https://www.youtube.com/@Web3PrivacyNow
    
    // Try to fetch channel page to extract channel ID
    const channelUrl = "https://www.youtube.com/@Web3PrivacyNow";
    const channelResponse = await fetch(channelUrl, {
      next: { revalidate: 86400 }, // Cache for 24 hours
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    
    let channelId: string | null = null;
    
    if (channelResponse.ok) {
      const channelHtml = await channelResponse.text();
      // Extract channel ID from meta tag or JSON-LD
      // YouTube stores channel ID in various places in the HTML
      const channelIdMatch = channelHtml.match(/"channelId":"([^"]+)"/);
      if (channelIdMatch) {
        channelId = channelIdMatch[1];
      } else {
        // Alternative: Look for canonical URL with channel ID
        const canonicalMatch = channelHtml.match(/<link[^>]+rel="canonical"[^>]+href="[^"]*\/channel\/([^"\/]+)"/);
        if (canonicalMatch) {
          channelId = canonicalMatch[1];
        }
      }
    }
    
    // Fallback: Use environment variable
    if (!channelId) {
      channelId = process.env.YOUTUBE_CHANNEL_ID || null;
    }
    
    // Try multiple methods to get channel ID
    if (!channelId) {
      // Try to extract from channel page HTML more thoroughly
      try {
        const channelPageResponse = await fetch("https://www.youtube.com/@Web3PrivacyNow", {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        });
        
        if (channelPageResponse.ok) {
          const html = await channelPageResponse.text();
          
          // Try multiple patterns to find channel ID
          const patterns = [
            /"channelId":"([^"]+)"/,
            /"externalId":"([^"]+)"/,
            /\/channel\/(UC[a-zA-Z0-9_-]{22})/,
            /"browseId":"([^"]+)"/,
            /"ucid":"([^"]+)"/,
            /"channelId":"(UC[a-zA-Z0-9_-]{22})"/,
          ];
          
          for (const pattern of patterns) {
            const match = html.match(pattern);
            if (match && match[1] && match[1].startsWith('UC')) {
              channelId = match[1];
              break;
            }
          }
        }
      } catch (e) {
        console.error("Error fetching channel page:", e);
      }
    }
    
    // If we have channel ID, use RSS feed
    if (channelId) {
      const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
      
      try {
        const response = await fetch(rssUrl, {
          next: { revalidate: 3600 }, // Cache for 1 hour
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        });
        
        if (response.ok) {
          const xmlText = await response.text();
          
          // Parse XML
          const talks: any[] = [];
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
            
            // Extract author (speaker) - usually channel name
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
            
            talks.push({
              id: `yt-${videoId}`,
              title: title,
              description: description || undefined,
              youtubeId: videoId,
              thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
              speaker: author || "Web3PrivacyNow" || undefined,
              publishedAt: published,
              viewCount: 0, // RSS doesn't provide viewCount
              createdAt: published,
            });
          }
          
          if (talks.length > 0) {
            console.log(`[YouTube API] Successfully fetched ${talks.length} videos from channel`);
            return NextResponse.json({ talks });
          }
        }
      } catch (e) {
        console.error("Error fetching RSS feed:", e);
      }
    }
    
    // Return empty array if we couldn't fetch videos
    // Don't return placeholder data with rick-roll videos
    console.warn("Could not fetch YouTube videos, returning empty array");
    return NextResponse.json({ 
      talks: []
    });
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    // Return empty array on error
    return NextResponse.json({ talks: [] });
  }
}
