import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import type { Job, JobsData } from "@/types/jobs";

const DATA_DIR = path.join(process.cwd(), "data");
const JOBS_FILE = path.join(DATA_DIR, "jobs.yaml");
const USER_JOBS_FILE = path.join(DATA_DIR, "jobs-user.yaml");

function loadJobs(): JobsData {
  if (!fs.existsSync(JOBS_FILE)) return { categories: [], jobs: [] };
  const content = fs.readFileSync(JOBS_FILE, "utf8");
  return yaml.load(content) as JobsData;
}

function loadUserJobs(): Job[] {
  if (!fs.existsSync(USER_JOBS_FILE)) return [];
  const content = fs.readFileSync(USER_JOBS_FILE, "utf8");
  const parsed = yaml.load(content) as { jobs?: Job[] } | null;
  return parsed?.jobs ?? [];
}

function saveUserJobs(jobs: Job[]) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(USER_JOBS_FILE, yaml.dump({ jobs }), "utf8");
}

function mergeJobs(base: Job[], user: Job[]): Job[] {
  const map = new Map<string, Job>();
  base.forEach((j) => map.set(j.id, j));
  user.forEach((j) => map.set(j.id, j));
  return Array.from(map.values());
}

export async function GET() {
  const base = loadJobs();
  const userJobs = loadUserJobs();
  const merged = mergeJobs(base.jobs, userJobs);
  return NextResponse.json({
    ...base,
    jobs: merged,
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const job: Job = {
    id: `job-${Date.now()}`,
    title: body.title ?? "",
    company: body.company ?? "",
    companyLogo: body.companyLogo ?? null,
    description: body.description ?? "",
    url: body.url ?? "",
    category: body.category ?? "Other",
    tags: Array.isArray(body.tags) ? body.tags : [body.tags].filter(Boolean),
    explorerProjectId: body.explorerProjectId ?? null,
    createdAt: new Date().toISOString().split("T")[0],
  };
  const userJobs = loadUserJobs();
  userJobs.push(job);
  saveUserJobs(userJobs);
  return NextResponse.json({ ok: true, id: job.id });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const userJobs = loadUserJobs();
  const idx = userJobs.findIndex((j) => j.id === body.id);
  if (idx >= 0) {
    userJobs[idx] = { ...userJobs[idx], ...body };
  } else {
    userJobs.push({ ...body, createdAt: body.createdAt ?? new Date().toISOString().split("T")[0] });
  }
  saveUserJobs(userJobs);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const userJobs = loadUserJobs().filter((j) => j.id !== id);
  saveUserJobs(userJobs);
  return NextResponse.json({ ok: true });
}
