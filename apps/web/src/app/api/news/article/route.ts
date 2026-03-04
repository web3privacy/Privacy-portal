import { NextRequest, NextResponse } from "next/server";
import {
  getArticleByIdForAdmin,
  updateArticleMarkdown,
  createArticleMarkdown,
} from "@/lib/news";
import { z } from "zod";

const PutSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).optional(),
  perex: z.string().optional(),
  link: z.string().optional(),
  content: z.string().optional(),
});

const PostSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  perex: z.string().optional(),
  link: z.string().optional(),
  content: z.string().optional(),
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

    const article = getArticleByIdForAdmin(parsed.data.id);
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    if (!article.hasDetail) {
      return NextResponse.json(
        { error: "Only articles with detail (ours) can be edited" },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {};
    if (parsed.data.title !== undefined) updates.title = parsed.data.title;
    if (parsed.data.perex !== undefined) updates.perex = parsed.data.perex;
    if (parsed.data.link !== undefined) updates.link = parsed.data.link;
    if (parsed.data.content !== undefined) updates.content = parsed.data.content;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ ok: true });
    }

    const ok = updateArticleMarkdown(parsed.data.id, updates);
    if (!ok) {
      return NextResponse.json(
        { error: "Failed to write article file" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error updating article:", err);
    return NextResponse.json(
      { error: "Failed to update" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = PostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid body", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const id = createArticleMarkdown({
      id: parsed.data.id,
      title: parsed.data.title,
      perex: parsed.data.perex,
      link: parsed.data.link,
      content: parsed.data.content,
    });
    if (!id) {
      return NextResponse.json(
        { error: "Article with this id already exists or invalid id" },
        { status: 400 }
      );
    }
    return NextResponse.json({ ok: true, id });
  } catch (err) {
    console.error("Error creating article:", err);
    return NextResponse.json(
      { error: "Failed to create" },
      { status: 500 }
    );
  }
}
