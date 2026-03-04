import { NextResponse } from "next/server";
import { z } from "zod";
import { appendReview, summarizeReviews } from "@/lib/reviews-store";

export const runtime = "nodejs";

const BodySchema = z.object({
  projectId: z.string().min(2).max(128),
  rating: z.number().int().min(1).max(5),
  author: z.string().max(64).optional(),
  comment: z.string().min(2).max(1000),
});

export async function POST(req: Request) {
  const parsed = BodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  try {
    const next = await appendReview(parsed.data.projectId, {
      rating: parsed.data.rating,
      author: parsed.data.author,
      comment: parsed.data.comment,
    });
    return NextResponse.json({
      ok: true,
      reviews: next,
      summary: summarizeReviews(next),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save review";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

