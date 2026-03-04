import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import type { Event } from "@/types/events";

const DATA_DIR = path.join(process.cwd(), "data", "events");
const INDEX_FILE = path.join(DATA_DIR, "index.yaml");
const USER_FILE = path.join(DATA_DIR, "events-user.yaml");
const VISIBILITY_FILE = path.join(DATA_DIR, "events-visibility.yaml");

function loadYaml<T>(filePath: string, fallback: T): T {
  if (!fs.existsSync(filePath)) return fallback;
  const content = fs.readFileSync(filePath, "utf8");
  const parsed = yaml.load(content) as T | null;
  return parsed ?? fallback;
}

function loadBaseEvents(): Event[] {
  const raw = loadYaml<Event[] | { events?: Event[] }>(INDEX_FILE, []);
  return Array.isArray(raw) ? raw : (raw.events ?? []);
}

function loadUserEvents(): Event[] {
  const parsed = loadYaml<{ events?: Event[] }>(USER_FILE, {});
  return parsed.events ?? [];
}

function loadVisibility(): string[] {
  const parsed = loadYaml<{ hidden?: string[] }>(VISIBILITY_FILE, {});
  return parsed.hidden ?? [];
}

function saveUserEvents(events: Event[]) {
  if (!fs.existsSync(path.dirname(USER_FILE))) {
    fs.mkdirSync(path.dirname(USER_FILE), { recursive: true });
  }
  fs.writeFileSync(USER_FILE, yaml.dump({ events }), "utf8");
}

function saveVisibility(hidden: string[]) {
  if (!fs.existsSync(path.dirname(VISIBILITY_FILE))) {
    fs.mkdirSync(path.dirname(VISIBILITY_FILE), { recursive: true });
  }
  fs.writeFileSync(VISIBILITY_FILE, yaml.dump({ hidden }), "utf8");
}

function mergeEvents(base: Event[], user: Event[]): Event[] {
  const map = new Map<string, Event>();
  base.forEach((e) => map.set(e.id, e));
  user.forEach((e) => map.set(e.id, e));
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const admin = searchParams.get("admin") === "1";

  const base = loadBaseEvents();
  const user = loadUserEvents();
  const hidden = loadVisibility();
  const merged = mergeEvents(base, user);

  if (admin) {
    const res = NextResponse.json({
      events: merged.map((e) => ({
        ...e,
        hidden: hidden.includes(e.id),
      })),
      hidden,
    });
    res.headers.set("Access-Control-Allow-Origin", "*");
    return res;
  }

  const visible = merged.filter((e) => !hidden.includes(e.id));
  const res = NextResponse.json({ events: visible });
  res.headers.set("Access-Control-Allow-Origin", "*");
  return res;
}

export async function POST(request: Request) {
  const body = await request.json();
  const id = body.id ?? `e${Date.now()}`;
  const event: Event = {
    id,
    type: body.type ?? "meetup",
    date: body.date ?? new Date().toISOString().split("T")[0],
    city: body.city ?? "",
    country: body.country ?? "",
    title: body.title ?? undefined,
    description: body.description ?? undefined,
    place: body.place ?? undefined,
    "place-address": body["place-address"] ?? body.placeAddress ?? undefined,
    confirmed: body.confirmed ?? undefined,
    coincidence: body.coincidence ?? undefined,
    lead: body.lead ?? "",
    links: body.links ?? undefined,
    speakers: body.speakers ?? undefined,
    helpers: body.helpers ?? undefined,
    optional: body.optional ?? undefined,
    days: body.days ?? undefined,
    design: body.design ?? undefined,
    premium: body.premium ?? undefined,
  };
  const userEvents = loadUserEvents();
  userEvents.push(event);
  saveUserEvents(userEvents);
  return NextResponse.json({ ok: true, id: event.id });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const userEvents = loadUserEvents();
  const idx = userEvents.findIndex((e) => e.id === body.id);
  const event: Event = {
    ...body,
    id: body.id,
    type: body.type ?? "meetup",
    date: body.date ?? new Date().toISOString().split("T")[0],
    city: body.city ?? "",
    country: body.country ?? "",
    lead: body.lead ?? "",
  };
  if (idx >= 0) {
    userEvents[idx] = { ...userEvents[idx], ...event };
  } else {
    userEvents.push(event);
  }
  saveUserEvents(userEvents);
  return NextResponse.json({ ok: true });
}
