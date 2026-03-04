import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import type { EventDetail } from "@/types/event-detail";

const EVENTS_DIR = path.join(process.cwd(), "data", "events");
const DETAILS_DIR = path.join(EVENTS_DIR, "details");

function loadYaml<T>(filePath: string, fallback: T): T {
  if (!fs.existsSync(filePath)) return fallback;
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const parsed = yaml.load(content) as T | null;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export function loadEventDetail(eventId: string): EventDetail | null {
  const filePath = path.join(DETAILS_DIR, `${eventId}.yaml`);
  const detail = loadYaml<EventDetail | null>(filePath, null);
  if (!detail || typeof detail !== "object") return null;
  return { ...detail, eventId };
}

export function saveEventDetail(detail: EventDetail): void {
  if (!fs.existsSync(DETAILS_DIR)) {
    fs.mkdirSync(DETAILS_DIR, { recursive: true });
  }
  const filePath = path.join(DETAILS_DIR, `${detail.eventId}.yaml`);
  const toSave = { ...detail };
  delete (toSave as Record<string, unknown>).eventId;
  fs.writeFileSync(filePath, yaml.dump(toSave), "utf8");
}
