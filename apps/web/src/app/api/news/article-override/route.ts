import { NextRequest, NextResponse } from "next/server";
import { getNewsUserIndex, saveNewsUserIndex } from "@/lib/news";
import { z } from "zod";

const PutSchema = z.object({
  articleId: z.string().min(1),
  published: z.boolean().optional(),
  isHighlighted: z.boolean().optional(),
  link: z.string().optional(),
});

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = PutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid body", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { articleId, published, isHighlighted, link } = parsed.data;
    const data = getNewsUserIndex();
    data.articleOverrides ??= {};

    const existing = data.articleOverrides[articleId] ?? {};
    if (published !== undefined) existing.published = published;
    if (isHighlighted !== undefined) existing.isHighlighted = isHighlighted;
    if (link !== undefined) existing.link = link || undefined;

    data.articleOverrides[articleId] = { ...existing };
    saveNewsUserIndex(data);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error updating article override:", err);
    return NextResponse.json(
      { error: "Failed to update" },
      { status: 500 }
    );
  }
}
