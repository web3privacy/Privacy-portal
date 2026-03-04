import { NextResponse } from "next/server";
import { addLibraryItem, type AddLibraryItemInput } from "@/lib/library";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<AddLibraryItemInput>;
    const type = body.type;
    const title = typeof body.title === "string" ? body.title : "";
    const author = typeof body.author === "string" ? body.author : "";

    if (!["document", "article", "book"].includes(type ?? "")) {
      return NextResponse.json(
        { ok: false, error: "Type must be document, article, or book." },
        { status: 400 }
      );
    }

    if (!title.trim() || !author.trim()) {
      return NextResponse.json(
        { ok: false, error: "Title and author are required." },
        { status: 400 }
      );
    }

    addLibraryItem({
      type: type as AddLibraryItemInput["type"],
      title,
      author,
      year: typeof body.year === "number" ? body.year : undefined,
      description: typeof body.description === "string" ? body.description : undefined,
      recommendedBy: typeof body.recommendedBy === "string" ? body.recommendedBy : undefined,
      category: typeof body.category === "string" ? body.category : undefined,
      isbn: typeof body.isbn === "string" ? body.isbn : undefined,
      url: typeof body.url === "string" ? body.url : undefined,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Library API error:", e);
    return NextResponse.json(
      { ok: false, error: "Failed to add item." },
      { status: 500 }
    );
  }
}
