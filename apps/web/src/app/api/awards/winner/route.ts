import { NextRequest, NextResponse } from "next/server";
import { loadAwardsData } from "@/lib/awards";
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import type { AwardsData } from "@/types/awards";

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

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { year, winner } = body;

    if (!year || !winner) {
      return NextResponse.json(
        { error: "Year and winner are required" },
        { status: 400 }
      );
    }

    const existing = loadAwardsData();
    const existingUser = fs.existsSync(USER_AWARDS_FILE)
      ? (yaml.load(fs.readFileSync(USER_AWARDS_FILE, "utf8")) as AwardsData | null)
      : { years: [] };

    const userData: AwardsData = existingUser || { years: [] };
    let yearData = userData.years.find((y) => y.year === year);

    if (!yearData) {
      // Create new year from base data
      const baseYear = existing.years.find((y) => y.year === year);
      if (!baseYear) {
        return NextResponse.json(
          { error: "Year not found" },
          { status: 404 }
        );
      }
      yearData = { ...baseYear };
      userData.years.push(yearData);
    }

    // Add or update winner
    if (!yearData.winners) {
      yearData.winners = [];
    }
    const winnerIndex = yearData.winners.findIndex(
      (w) => w.category === winner.category
    );
    if (winnerIndex >= 0) {
      yearData.winners[winnerIndex] = winner;
    } else {
      yearData.winners.push(winner);
    }

    // Save
    fs.mkdirSync(path.dirname(USER_AWARDS_FILE), { recursive: true });
    fs.writeFileSync(USER_AWARDS_FILE, yaml.dump(userData, { lineWidth: 120 }), "utf8");

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error updating winner:", error);
    return NextResponse.json(
      { error: "Failed to update winner" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const year = searchParams.get("year");
    const category = searchParams.get("category");

    if (!year || !category) {
      return NextResponse.json(
        { error: "Year and category are required" },
        { status: 400 }
      );
    }

    const yearNum = parseInt(year, 10);
    const existingUser = fs.existsSync(USER_AWARDS_FILE)
      ? (yaml.load(fs.readFileSync(USER_AWARDS_FILE, "utf8")) as AwardsData | null)
      : { years: [] };

    const userData: AwardsData = existingUser || { years: [] };
    let yearData = userData.years.find((y) => y.year === yearNum);

    if (!yearData) {
      // Create new year from base data
      const existing = loadAwardsData();
      const baseYear = existing.years.find((y) => y.year === yearNum);
      if (!baseYear) {
        return NextResponse.json(
          { error: "Year not found" },
          { status: 404 }
        );
      }
      yearData = { ...baseYear };
      userData.years.push(yearData);
    }

    // Remove winner
    if (yearData.winners) {
      yearData.winners = yearData.winners.filter(
        (w) => w.category !== category
      );
    }

    // Save
    fs.mkdirSync(path.dirname(USER_AWARDS_FILE), { recursive: true });
    fs.writeFileSync(USER_AWARDS_FILE, yaml.dump(userData, { lineWidth: 120 }), "utf8");

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error deleting winner:", error);
    return NextResponse.json(
      { error: "Failed to delete winner" },
      { status: 500 }
    );
  }
}
