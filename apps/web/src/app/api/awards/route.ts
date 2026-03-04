import { NextRequest, NextResponse } from "next/server";
import { loadAwardsData } from "@/lib/awards";
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import type { AwardsData, AwardYear } from "@/types/awards";

const ROOT_DIR = (() => {
  const cwd = process.cwd();
  if (cwd.endsWith('apps/web')) {
    return path.resolve(cwd, '..', '..');
  }
  if (fs.existsSync(path.join(cwd, 'data', 'awards.yaml'))) {
    return cwd;
  }
  let current = cwd;
  for (let i = 0; i < 5; i++) {
    if (fs.existsSync(path.join(current, 'data', 'awards.yaml'))) {
      return current;
    }
    current = path.resolve(current, '..');
  }
  return cwd;
})();

const USER_AWARDS_FILE = path.join(ROOT_DIR, "data", "awards-user.yaml");

export const runtime = "nodejs";

export async function GET() {
  try {
    const data = loadAwardsData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error loading awards data:", error);
    return NextResponse.json(
      { error: "Failed to load awards data" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { year, data: yearData } = body;

    if (!year || !yearData) {
      return NextResponse.json(
        { error: "Year and data are required" },
        { status: 400 }
      );
    }

    // Load existing data
    const existing = loadAwardsData();
    const existingUser = fs.existsSync(USER_AWARDS_FILE)
      ? (yaml.load(fs.readFileSync(USER_AWARDS_FILE, "utf8")) as AwardsData | null)
      : { years: [] };

    const userData: AwardsData = existingUser || { years: [] };

    // Update or add year
    const yearIndex = userData.years.findIndex((y) => y.year === year);
    if (yearIndex >= 0) {
      userData.years[yearIndex] = yearData;
    } else {
      userData.years.push(yearData);
    }

    // Save to user file
    fs.mkdirSync(path.dirname(USER_AWARDS_FILE), { recursive: true });
    fs.writeFileSync(USER_AWARDS_FILE, yaml.dump(userData, { lineWidth: 120 }), "utf8");

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error updating awards data:", error);
    return NextResponse.json(
      { error: "Failed to update awards data" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const year = searchParams.get("year");

    if (!year) {
      return NextResponse.json(
        { error: "Year is required" },
        { status: 400 }
      );
    }

    const yearNum = parseInt(year, 10);
    if (isNaN(yearNum)) {
      return NextResponse.json(
        { error: "Invalid year" },
        { status: 400 }
      );
    }

    // Load existing user data
    const existingUser = fs.existsSync(USER_AWARDS_FILE)
      ? (yaml.load(fs.readFileSync(USER_AWARDS_FILE, "utf8")) as AwardsData | null)
      : { years: [] };

    const userData: AwardsData = existingUser || { years: [] };

    // Remove year
    userData.years = userData.years.filter((y) => y.year !== yearNum);

    // Save to user file
    fs.mkdirSync(path.dirname(USER_AWARDS_FILE), { recursive: true });
    fs.writeFileSync(USER_AWARDS_FILE, yaml.dump(userData, { lineWidth: 120 }), "utf8");

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error deleting awards year:", error);
    return NextResponse.json(
      { error: "Failed to delete awards year" },
      { status: 500 }
    );
  }
}
