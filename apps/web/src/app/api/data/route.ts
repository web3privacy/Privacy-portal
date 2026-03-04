import { NextResponse } from "next/server";
import { loadExplorerDataFromDisk } from "@/lib/load-explorer-data";

export const runtime = "nodejs";

export async function GET() {
  try {
    const data = await loadExplorerDataFromDisk();
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load local data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
