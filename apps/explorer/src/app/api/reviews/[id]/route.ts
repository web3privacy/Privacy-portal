import { NextResponse } from "next/server";
import { readReviews, summarizeReviews } from "@/lib/reviews-store";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const reviews = await readReviews(id);
  return NextResponse.json({
    projectId: id,
    reviews,
    summary: summarizeReviews(reviews),
  });
}

