import { NextRequest, NextResponse } from "next/server";
import { getNewsUserIndex, saveNewsUserIndex } from "@/lib/news";
import { z } from "zod";

const PutSchema = z.object({
  featuredProjectIds: z.array(z.string().min(1)).max(20),
});

export async function GET() {
  const data = getNewsUserIndex();
  return NextResponse.json({
    featuredProjectIds: data.featuredProjectIds ?? [],
  });
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

    const data = getNewsUserIndex();
    data.featuredProjectIds = parsed.data.featuredProjectIds;
    saveNewsUserIndex(data);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error updating featured projects:", err);
    return NextResponse.json(
      { error: "Failed to update" },
      { status: 500 }
    );
  }
}
