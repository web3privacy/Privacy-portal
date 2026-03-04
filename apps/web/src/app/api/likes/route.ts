import { NextResponse } from "next/server";
import { loadAppData, loadLikesFile, saveLikesFile } from "@/lib/data";

type LikePayload = {
  stackId?: string;
  address?: string;
};

function normalizeAddress(value: string): string {
  return value.trim().toLowerCase();
}

function isEthereumAddress(value: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(value);
}

export async function GET(request: Request) {
  const data = loadAppData();
  const likesSchema = loadLikesFile();
  const requestUrl = new URL(request.url);
  const rawAddress = requestUrl.searchParams.get("address");
  const address = rawAddress ? normalizeAddress(rawAddress) : "";

  const likedStackIds =
    address && isEthereumAddress(address)
      ? Object.entries(likesSchema.likes)
          .filter(([, addresses]) => addresses.includes(address))
          .map(([stackId]) => stackId)
      : [];

  return NextResponse.json({
    likeCounts: data.likeCounts,
    likedStackIds,
  });
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as LikePayload;
    const stackId = payload.stackId?.trim();
    const address = payload.address ? normalizeAddress(payload.address) : "";

    if (!stackId || !isEthereumAddress(address)) {
      return NextResponse.json({ error: "Invalid like payload" }, { status: 400 });
    }

    const data = loadAppData();
    const stackExists = Object.values(data.stacks).some((stack) => stack.id === stackId);
    if (!stackExists) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const likesSchema = loadLikesFile();
    const existing = likesSchema.likes[stackId] ?? [];
    const alreadyLiked = existing.includes(address);
    const nextAddresses = alreadyLiked ? existing : [...existing, address];

    likesSchema.likes[stackId] = nextAddresses;
    saveLikesFile(likesSchema);

    return NextResponse.json({
      stackId,
      liked: true,
      alreadyLiked,
      likeCount: nextAddresses.length,
    });
  } catch {
    return NextResponse.json({ error: "Failed to save like" }, { status: 500 });
  }
}

