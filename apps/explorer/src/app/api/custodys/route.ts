import { API_RESPONSE_KEYS, API_URLS } from "@/lib/constants";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(process.env.EXPLORER_DATA_URL ?? API_URLS.EXPLORER_DATA);
    const data = await res.json();
    const custodys = data[API_RESPONSE_KEYS.CUSTODYS] || [];

    return NextResponse.json({
      [API_RESPONSE_KEYS.CUSTODYS]: custodys,
    });
  } catch (error) {
    console.error("Error fetching custodys:", error);
    return NextResponse.json({ error: "Failed to fetch custodys" }, { status: 500 });
  }
}

