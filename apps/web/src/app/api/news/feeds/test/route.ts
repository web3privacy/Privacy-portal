import { NextRequest, NextResponse } from "next/server";
import Parser from "rss-parser";

const USER_AGENT =
  "Privacy-Portal-Crawler/1.0 (+https://github.com/web3privacy/portal)";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url || typeof url !== "string") {
    return NextResponse.json(
      { ok: false, error: "Missing url query parameter" },
      { status: 400 }
    );
  }
  try {
    const parser = new Parser({
      headers: { "User-Agent": USER_AGENT },
    });
    const feed = await parser.parseURL(url);
    const itemsCount = feed.items?.length ?? 0;
    return NextResponse.json({
      ok: true,
      title: feed.title ?? null,
      itemsCount,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load feed";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 422 }
    );
  }
}
