import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import type { Job, JobsData } from "@/types/jobs";

const ROOT_DIR = process.cwd();
const JOBS_FILE = path.join(ROOT_DIR, "data", "jobs.yaml");
const USER_JOBS_FILE = path.join(ROOT_DIR, "data", "jobs-user.yaml");

const EMPTY_JOBS: JobsData = {
  categories: [],
  jobs: [],
};

function loadYaml<T>(filePath: string, fallback: T): T {
  if (!fs.existsSync(filePath)) return fallback;
  const content = fs.readFileSync(filePath, "utf8");
  const parsed = yaml.load(content) as T | null;
  return parsed ?? fallback;
}

function loadUserJobs(): Job[] {
  const parsed = loadYaml<{ jobs?: Job[] }>(USER_JOBS_FILE, {});
  return parsed.jobs ?? [];
}

function mergeJobs(base: Job[], user: Job[]): Job[] {
  const map = new Map<string, Job>();
  base.forEach((j) => map.set(j.id, j));
  user.forEach((j) => map.set(j.id, j));
  return Array.from(map.values());
}

export function loadJobsData(): JobsData {
  const base = loadYaml<JobsData>(JOBS_FILE, EMPTY_JOBS);
  const userJobs = loadUserJobs();
  return {
    ...base,
    jobs: mergeJobs(base.jobs, userJobs),
  };
}

export function getJobById(id: string): Job | undefined {
  const data = loadJobsData();
  return data.jobs.find((j) => j.id === id);
}
