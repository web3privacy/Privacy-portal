import { API_RESPONSE_KEYS, API_URLS } from "@/lib/constants";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(process.env.EXPLORER_DATA_URL ?? API_URLS.EXPLORER_DATA);
    const data = await res.json();
    const requirements = data[API_RESPONSE_KEYS.REQUIREMENTS] || [];

    return NextResponse.json({
      [API_RESPONSE_KEYS.REQUIREMENTS]: requirements,
    });
  } catch (error) {
    console.error("Error fetching requirements:", error);
    return NextResponse.json({ error: "Failed to fetch requirements" }, { status: 500 });
  }
}

