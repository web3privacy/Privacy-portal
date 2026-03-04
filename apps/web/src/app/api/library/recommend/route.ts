import { NextResponse } from "next/server";
import {
  addLibraryRecommendation,
  loadLibraryRecommendations,
  getRecommendCounts,
  getRecommendedByAddress,
} from "@/lib/library";

function isEthereumAddress(value: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(value);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const address = url.searchParams.get("address")?.trim().toLowerCase() ?? "";

  const schema = loadLibraryRecommendations();
  const recommendCounts = getRecommendCounts(schema);
  const recommendedKeys =
    address && isEthereumAddress(address)
      ? Array.from(getRecommendedByAddress(schema, address))
      : [];

  return NextResponse.json({
    recommendCounts,
    recommendedKeys,
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      itemKey?: string;
      address?: string;
    };
    const itemKey = typeof body.itemKey === "string" ? body.itemKey.trim() : "";
    const address =
      typeof body.address === "string" ? body.address.trim().toLowerCase() : "";

    if (!itemKey || !address || !isEthereumAddress(address)) {
      return NextResponse.json(
        { ok: false, error: "Valid itemKey and wallet address required." },
        { status: 400 }
      );
    }

    addLibraryRecommendation(itemKey, address);

    const schema = loadLibraryRecommendations();
    const addrs = schema.recommendations[itemKey] ?? [];
    const count = addrs.length;

    return NextResponse.json({
      ok: true,
      recommendCount: count,
      recommended: true,
    });
  } catch (e) {
    console.error("Library recommend API error:", e);
    return NextResponse.json(
      { ok: false, error: "Failed to add recommendation." },
      { status: 500 }
    );
  }
}
