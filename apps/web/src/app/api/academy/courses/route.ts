import { NextResponse } from "next/server";

/**
 * API endpoint to fetch courses from academy.web3privacy.info
 * 
 * Note: The website has anti-bot protection, so we cannot scrape it directly.
 * Courses are stored in academy.yaml and can be edited via the admin interface.
 * 
 * This endpoint returns empty array - courses are loaded from YAML files via loadAcademyData()
 */
export async function GET() {
  try {
    // Since we cannot scrape due to anti-bot protection,
    // courses are managed via YAML files and admin interface
    // This endpoint exists for consistency but returns empty
    return NextResponse.json({ courses: [] });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({ courses: [] });
  }
}
