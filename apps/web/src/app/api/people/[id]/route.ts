import { NextRequest, NextResponse } from "next/server";
import { loadPeopleData, getPersonById } from "@/lib/people";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = loadPeopleData();
    const person = getPersonById(data, id);

    if (!person) {
      return NextResponse.json(
        { error: "Person not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ person });
  } catch (error) {
    console.error("Error loading person:", error);
    return NextResponse.json(
      { error: "Failed to load person" },
      { status: 500 }
    );
  }
}
