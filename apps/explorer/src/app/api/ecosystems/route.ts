import { API_RESPONSE_KEYS, API_URLS } from "@/lib/constants";
import { loadExplorerDataFromDisk } from "@/lib/load-explorer-data";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data =
      (await loadExplorerDataFromDisk().catch(() => null)) ??
      (await fetch(process.env.EXPLORER_DATA_URL ?? API_URLS.EXPLORER_DATA).then(
        (r) => r.json()
      ));
    const ecosystems = data[API_RESPONSE_KEYS.ECOSYSTEMS] || [];

    return NextResponse.json({
      [API_RESPONSE_KEYS.ECOSYSTEMS]: ecosystems,
    });
  } catch (error) {
    console.error("Error fetching ecosystems:", error);

    return NextResponse.json(
      { error: "Failed to fetch ecosystems" },
      { status: 500 }
    );
  }
}
