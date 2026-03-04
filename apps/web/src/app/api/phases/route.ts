import { API_RESPONSE_KEYS, API_URLS } from "@/lib/constants";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(process.env.EXPLORER_DATA_URL ?? API_URLS.EXPLORER_DATA);
    const data = await res.json();
    const phases = data[API_RESPONSE_KEYS.PHASES] || [];

    return NextResponse.json({
      [API_RESPONSE_KEYS.PHASES]: phases,
    });
  } catch (error) {
    console.error("Error fetching phases:", error);
    return NextResponse.json({ error: "Failed to fetch phases" }, { status: 500 });
  }
}

