import { NextRequest, NextResponse } from "next/server";
import { loadPeopleData, searchPeople } from "@/lib/people";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("q");

    const data = loadPeopleData();

    if (query) {
      const results = searchPeople(data, query);
      return NextResponse.json({ people: results.slice(0, 20) });
    }

    return NextResponse.json({ people: data.people.slice(0, 100) });
  } catch (error) {
    console.error("Error loading people data:", error);
    return NextResponse.json(
      { error: "Failed to load people data" },
      { status: 500 }
    );
  }
}
