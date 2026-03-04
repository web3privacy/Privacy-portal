import path from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { z } from "zod";

export const ReviewSchema = z.object({
  id: z.string().min(6).max(64),
  rating: z.number().int().min(1).max(5),
  author: z.string().max(64).optional(),
  comment: z.string().min(2).max(1000),
  createdAt: z.string().datetime(),
});

export type Review = z.infer<typeof ReviewSchema>;

const ReviewsFileSchema = z.object({
  projectId: z.string().min(2).max(128),
  reviews: z.array(ReviewSchema),
});

function normalizeProjectId(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

function getReviewsDir(): string {
  // Repo root is the Next app cwd: apps/explorer. We store local edits in the shared root `data/`.
  return path.join(process.cwd(), "data", "explorer-data", "local", "reviews");
}

function getReviewsFile(projectId: string): string {
  const id = normalizeProjectId(projectId);
  return path.join(getReviewsDir(), `${id}.json`);
}

export async function readReviews(projectId: string): Promise<Review[]> {
  const filePath = getReviewsFile(projectId);
  try {
    const raw = await readFile(filePath, "utf8");
    const json = JSON.parse(raw) as unknown;
    const parsed = ReviewsFileSchema.safeParse(json);
    if (!parsed.success) return [];
    return parsed.data.reviews;
  } catch {
    return [];
  }
}

export async function appendReview(
  projectId: string,
  review: Omit<Review, "id" | "createdAt"> & { id?: string; createdAt?: string }
): Promise<Review[]> {
  const dir = getReviewsDir();
  const filePath = getReviewsFile(projectId);
  await mkdir(dir, { recursive: true });

  const existing = await readReviews(projectId);

  const now = new Date().toISOString();
  const id =
    (review.id && review.id.trim()) ||
    // reasonably unique, stable, file-friendly
    `r_${now.replace(/[:.]/g, "-")}_${Math.random().toString(16).slice(2, 8)}`;

  const nextReview: Review = {
    id,
    rating: review.rating,
    author: review.author?.trim() ? review.author.trim().slice(0, 64) : undefined,
    comment: review.comment.trim().slice(0, 1000),
    createdAt: review.createdAt ?? now,
  };

  const validated = ReviewSchema.safeParse(nextReview);
  if (!validated.success) {
    throw new Error("Invalid review");
  }

  const next = [validated.data, ...existing].slice(0, 200);
  const payload = { projectId: normalizeProjectId(projectId), reviews: next };
  await writeFile(filePath, JSON.stringify(payload, null, 2) + "\n", "utf8");
  return next;
}

export function summarizeReviews(reviews: Review[]) {
  const count = reviews.length;
  if (!count) {
    return { count: 0, average: 0, percentage: 0 };
  }
  const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / count;
  return {
    count,
    average: Math.round(avg * 10) / 10,
    percentage: Math.round((avg / 5) * 100),
  };
}

