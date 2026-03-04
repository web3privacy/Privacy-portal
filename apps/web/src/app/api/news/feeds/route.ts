import { NextRequest, NextResponse } from "next/server";
import { getFeedSourcesAll, saveFeedSources } from "@/lib/news-feeds";
import { z } from "zod";

const SourceSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["rss", "url"]),
  url: z.string().url(),
  enabled: z.boolean().optional(),
});

const PutSchema = z.object({
  sources: z.array(SourceSchema),
});

export async function GET() {
  const sources = getFeedSourcesAll();
  return NextResponse.json({ sources });
}

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
    saveFeedSources(parsed.data.sources);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error saving feeds:", err);
    return NextResponse.json(
      { error: "Failed to save" },
      { status: 500 }
    );
  }
}
