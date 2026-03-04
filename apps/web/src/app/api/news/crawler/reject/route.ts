import { NextRequest, NextResponse } from "next/server";
import { rejectCandidate } from "@/lib/news-feeds";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { id } = body;
    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Missing candidate id" },
        { status: 400 }
      );
    }

    rejectCandidate(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error rejecting candidate:", err);
    return NextResponse.json(
      { error: "Failed to reject" },
      { status: 500 }
    );
  }
}
