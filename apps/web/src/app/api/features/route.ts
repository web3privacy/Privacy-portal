import { API_RESPONSE_KEYS, API_URLS } from "@/lib/constants";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(process.env.EXPLORER_DATA_URL ?? API_URLS.EXPLORER_DATA);
    const data = await res.json();
    const features = data[API_RESPONSE_KEYS.FEATURES] || [];

    return NextResponse.json({
      [API_RESPONSE_KEYS.FEATURES]: features,
    });
  } catch (error) {
    console.error("Error fetching features:", error);
    return NextResponse.json({ error: "Failed to fetch features" }, { status: 500 });
  }
}

