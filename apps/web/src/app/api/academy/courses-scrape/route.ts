import { NextResponse } from "next/server";

/**
 * API endpoint to scrape courses from academy.web3privacy.info
 * URL: https://academy.web3privacy.info/l/products?sortKey=name&sortDirection=asc&page=1
 */
export async function GET() {
  try {
    const url = "https://academy.web3privacy.info/l/products?sortKey=name&sortDirection=asc&page=1";
    
    const response = await fetch(url, {
      next: { revalidate: 86400 }, // Cache for 24 hours
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch courses page: ${response.status}`);
      return NextResponse.json({ courses: [] });
    }
    
    const html = await response.text();
    
    // Parse HTML to extract course data
    const courses: any[] = [];
    
    // Try to find product cards - the structure may vary, so we'll try multiple patterns
    // Look for product images, titles, descriptions, and links
    
    // Pattern 1: Look for product image URLs
    const imageRegex = /<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>/g;
    const imageMatches = [...html.matchAll(imageRegex)];
    
    // Pattern 2: Look for product links and titles
    const linkRegex = /<a[^>]+href="([^"]+)"[^>]*>[\s\S]*?<h[1-6][^>]*>([^<]+)<\/h[1-6]>/g;
    const linkMatches = [...html.matchAll(linkRegex)];
    
    // Pattern 3: Look for course descriptions
    const descRegex = /<p[^>]*class="[^"]*description[^"]*"[^>]*>([^<]+)<\/p>/gi;
    const descMatches = [...html.matchAll(descRegex)];
    
    // Since the page structure is complex, we'll extract what we can
    // and create course objects from the available data
    
    // Extract product cards using a more comprehensive approach
    const productCardRegex = /Product image for ([^<]+)/g;
    let productMatch;
    let index = 0;
    
    while ((productMatch = productCardRegex.exec(html)) !== null && index < 20) {
      const title = productMatch[1].trim();
      
      // Try to find corresponding link
      const titleEscaped = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const linkPattern = new RegExp(`<a[^>]+href="([^"]+)"[^>]*>[\\s\\S]{0,500}${titleEscaped}`, 'i');
      const linkMatch = html.match(linkPattern);
      const courseUrl = linkMatch ? linkMatch[1] : null;
      
      // Try to find image
      const imagePattern = new RegExp(`Product image for ${titleEscaped}[\\s\\S]{0,200}<img[^>]+src="([^"]+)"`, 'i');
      const imageMatch = html.match(imagePattern);
      const imageUrl = imageMatch ? imageMatch[1] : null;
      
      // Try to find description
      const descPattern = new RegExp(`${titleEscaped}[\\s\\S]{0,500}<p[^>]*>([^<]+)<\/p>`, 'i');
      const descMatch = html.match(descPattern);
      const description = descMatch ? descMatch[1].trim() : undefined;
      
      // Try to find author (By Web3Privacy Now)
      const authorPattern = new RegExp(`${titleEscaped}[\\s\\S]{0,300}By ([^<]+)`, 'i');
      const authorMatch = html.match(authorPattern);
      const author = authorMatch ? authorMatch[1].trim() : "Web3Privacy Now";
      
      if (title && courseUrl) {
        courses.push({
          id: `course-${index + 1}`,
          title: title,
          description: description,
          url: courseUrl.startsWith('http') ? courseUrl : `https://academy.web3privacy.info${courseUrl}`,
          icon: imageUrl ? (imageUrl.startsWith('http') ? imageUrl : `https://academy.web3privacy.info${imageUrl}`) : undefined,
          author: author,
        });
        index++;
      }
    }
    
    // If we didn't find courses with the first method, try alternative parsing
    if (courses.length === 0) {
      // Look for structured data or JSON-LD
      const jsonLdRegex = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
      const jsonLdMatches = [...html.matchAll(jsonLdRegex)];
      
      for (const match of jsonLdMatches) {
        try {
          const jsonData = JSON.parse(match[1]);
          if (Array.isArray(jsonData)) {
            for (const item of jsonData) {
              if (item['@type'] === 'Course' || item['@type'] === 'Product') {
                courses.push({
                  id: item['@id'] || `course-${courses.length + 1}`,
                  title: item.name || item.headline,
                  description: item.description,
                  url: item.url || item['@id'],
                  icon: item.image,
                  author: item.author?.name || item.provider?.name || "Web3Privacy Now",
                });
              }
            }
          } else if (jsonData['@type'] === 'Course' || jsonData['@type'] === 'Product') {
            courses.push({
              id: jsonData['@id'] || 'course-1',
              title: jsonData.name || jsonData.headline,
              description: jsonData.description,
              url: jsonData.url || jsonData['@id'],
              icon: jsonData.image,
              author: jsonData.author?.name || jsonData.provider?.name || "Web3Privacy Now",
            });
          }
        } catch (e) {
          // Ignore JSON parse errors
        }
      }
    }
    
    console.log(`[Courses Scrape] Found ${courses.length} courses`);
    return NextResponse.json({ courses });
  } catch (error) {
    console.error("Error scraping courses:", error);
    return NextResponse.json({ courses: [] });
  }
}
