import { NextRequest, NextResponse } from "next/server";
import {
  getCandidates,
  approveCandidateToArticle,
  addApprovedId,
} from "@/lib/news-feeds";

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

    const candidates = getCandidates();
    const candidate = candidates.find((c) => c.id === id);
    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404 }
      );
    }

    const articleId = approveCandidateToArticle(candidate);
    if (!articleId) {
      return NextResponse.json(
        { error: "Failed to create article" },
        { status: 500 }
      );
    }

    addApprovedId(id);
    return NextResponse.json({ ok: true, articleId });
  } catch (err) {
    console.error("Error approving candidate:", err);
    return NextResponse.json(
      { error: "Failed to approve" },
      { status: 500 }
    );
  }
}
