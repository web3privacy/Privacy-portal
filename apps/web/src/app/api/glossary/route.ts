import { NextResponse } from "next/server";
import { addGlossaryTerm, updateGlossaryTerm } from "@/lib/glossary";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      term?: string;
      definition?: string;
      oldTerm?: string;
    };
    const term = typeof body.term === "string" ? body.term : "";
    const definition =
      typeof body.definition === "string" ? body.definition : "";
    const oldTerm = typeof body.oldTerm === "string" ? body.oldTerm : "";

    if (!term.trim() || !definition.trim()) {
      return NextResponse.json(
        { ok: false, error: "Term and definition are required." },
        { status: 400 }
      );
    }

    if (oldTerm.trim()) {
      updateGlossaryTerm(oldTerm, term, definition);
    } else {
      addGlossaryTerm(term, definition);
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Glossary API error:", e);
    return NextResponse.json(
      { ok: false, error: "Failed to save term." },
      { status: 500 }
    );
  }
}
