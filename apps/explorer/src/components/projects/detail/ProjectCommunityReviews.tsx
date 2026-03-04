"use client";

import { useEffect, useMemo, useState } from "react";
import { DetailCard, DetailSection, ValuePill } from "./detail-ui";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Review = {
  id: string;
  rating: number;
  author?: string;
  comment: string;
  createdAt: string;
};

type Summary = { count: number; average: number; percentage: number };

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
  } catch {
    return iso;
  }
}

function Stars({
  value,
  onChange,
  interactive = false,
  size = 16,
}: {
  value: number;
  onChange?: (v: number) => void;
  interactive?: boolean;
  size?: number;
}) {
  const total = 5;
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: total }).map((_, i) => {
        const v = i + 1;
        const on = v <= value;
        return (
          <button
            key={v}
            type="button"
            className={cn(
              "inline-flex items-center justify-center rounded-md p-1",
              interactive ? "hover:bg-black/5 dark:hover:bg-white/10" : "pointer-events-none"
            )}
            onClick={() => onChange?.(v)}
            aria-label={`${v} star`}
          >
            <svg
              viewBox="0 0 24 24"
              width={size}
              height={size}
              className={on ? "text-[#f5b400]" : "text-black/20 dark:text-white/20"}
              fill="currentColor"
              role="presentation"
            >
              <path d="M12 17.3l-6.2 3.6 1.7-7.1L2 8.9l7.2-.6L12 1.8l2.8 6.5 7.2.6-5.5 4.9 1.7 7.1z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

export function ProjectCommunityReviews({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<Summary>({ count: 0, average: 0, percentage: 0 });
  const [expanded, setExpanded] = useState(false);

  const visibleReviews = useMemo(() => {
    if (expanded) return reviews;
    return reviews.slice(0, 3);
  }, [expanded, reviews]);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews/${encodeURIComponent(projectId)}`, { cache: "no-store" });
      const data = (await res.json()) as { reviews?: Review[]; summary?: Summary };
      setReviews(Array.isArray(data.reviews) ? data.reviews : []);
      setSummary(data.summary ?? { count: 0, average: 0, percentage: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return (
    <DetailSection id="community-reviews" title="Community Reviews">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="text-[12px] font-bold uppercase tracking-[0.08em] text-black/55 dark:text-white/55">
            {loading ? "Loading reviews" : `${summary.count} review${summary.count === 1 ? "" : "s"}`}
          </div>
          {summary.count ? (
            <>
              <div className="opacity-30">/</div>
              <div className="flex items-center gap-2">
                <Stars value={Math.round(summary.average)} />
                <div className="text-[12px] font-bold uppercase tracking-[0.08em] text-black/55 dark:text-white/55">
                  {summary.percentage}%
                </div>
              </div>
            </>
          ) : null}
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center rounded-full bg-accent px-4 py-2 text-[12px] font-bold uppercase tracking-[0.08em] text-accent-foreground hover:bg-accent/90"
            >
              Add rating
            </button>
          </DialogTrigger>
          <DialogContent className="rounded-[18px] border border-black/15 bg-white p-6 text-black shadow-lg dark:border-white/15 dark:bg-[#151a21] dark:text-[#f2f4f6]">
            <DialogHeader>
              <DialogTitle className="font-serif text-[22px]">Add your review</DialogTitle>
            </DialogHeader>
            <ReviewForm
              projectId={projectId}
              onSaved={(nextReviews, nextSummary) => {
                setReviews(nextReviews);
                setSummary(nextSummary);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-4">
        <DetailCard>
          {summary.count === 0 && !loading ? (
            <div className="flex items-center justify-between gap-4">
              <div className="text-[13px] text-black/55 dark:text-white/55">
                No reviews yet. Be the first to contribute.
              </div>
              <ValuePill>New</ValuePill>
            </div>
          ) : null}

          <div className="mt-2 divide-y divide-black/10 dark:divide-white/10">
            {visibleReviews.map((r) => (
              <div key={r.id} className="py-5 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <Stars value={r.rating} />
                      <div className="text-[12px] font-bold uppercase tracking-[0.08em] text-black/45 dark:text-white/45">
                        {formatDate(r.createdAt)}
                      </div>
                      {r.author ? (
                        <div className="text-[12px] font-bold uppercase tracking-[0.08em] text-black/55 dark:text-white/55">
                          {r.author}
                        </div>
                      ) : null}
                    </div>
                    <div className="mt-3 text-[13px] leading-relaxed text-black/65 dark:text-white/65">
                      {r.comment}
                    </div>
                  </div>
                  <ValuePill>{`${r.rating}/5`}</ValuePill>
                </div>
              </div>
            ))}
          </div>

          {reviews.length > 3 ? (
            <div className="mt-5 flex justify-start">
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="inline-flex items-center rounded-full border border-black/15 bg-white px-4 py-2 text-[12px] font-bold uppercase tracking-[0.08em] text-black hover:bg-black/[0.02] dark:border-white/15 dark:bg-[#151a21] dark:text-[#f2f4f6] dark:hover:bg-white/[0.04]"
              >
                {expanded ? "Show less" : "Show all"}
              </button>
            </div>
          ) : null}
        </DetailCard>
      </div>
    </DetailSection>
  );
}

function ReviewForm({
  projectId,
  onSaved,
}: {
  projectId: string;
  onSaved: (reviews: Review[], summary: Summary) => void;
}) {
  const [rating, setRating] = useState(4);
  const [author, setAuthor] = useState("");
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = comment.trim().length >= 2 && !saving;

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!canSubmit) return;
        setSaving(true);
        setError(null);
        try {
          const res = await fetch("/api/local/save-review", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              projectId,
              rating,
              author: author.trim() ? author.trim() : undefined,
              comment: comment.trim(),
            }),
          });
          const data = (await res.json()) as { ok?: boolean; reviews?: Review[]; summary?: Summary; error?: string };
          if (!res.ok || !data.ok) {
            throw new Error(data.error || "Failed to save review");
          }
          onSaved(data.reviews ?? [], data.summary ?? { count: 0, average: 0, percentage: 0 });
          setComment("");
          setAuthor("");
          setRating(4);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to save review");
        } finally {
          setSaving(false);
        }
      }}
      className="mt-2 space-y-4"
    >
      <div>
        <div className="text-[12px] font-bold uppercase tracking-[0.08em] text-black/55 dark:text-white/55">
          Rating
        </div>
        <div className="mt-2">
          <Stars value={rating} onChange={setRating} interactive size={20} />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <div className="text-[12px] font-bold uppercase tracking-[0.08em] text-black/55 dark:text-white/55">
            Name (optional)
          </div>
          <Input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Anonymous"
            className="mt-2 rounded-[12px] border-black/15 bg-white/70 text-black dark:border-white/15 dark:bg-[#0f1318] dark:text-[#f2f4f6]"
          />
        </div>

        <div>
          <div className="text-[12px] font-bold uppercase tracking-[0.08em] text-black/55 dark:text-white/55">
            Tip
          </div>
          <div className="mt-2 text-[13px] text-black/55 dark:text-white/55">
            Keep it factual. No personal data.
          </div>
        </div>
      </div>

      <div>
        <div className="text-[12px] font-bold uppercase tracking-[0.08em] text-black/55 dark:text-white/55">
          Comment
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What worked well? What should improve?"
          className="mt-2 min-h-[120px] w-full rounded-[12px] border border-black/15 bg-white/70 p-3 text-[13px] leading-relaxed text-black outline-none focus:border-black/35 dark:border-white/15 dark:bg-[#0f1318] dark:text-[#f2f4f6] dark:focus:border-white/35"
        />
      </div>

      {error ? (
        <div className="rounded-[12px] border border-[#ef4444]/30 bg-[#ef4444]/10 p-3 text-[13px] text-[#7f1d1d] dark:text-[#fecaca]">
          {error}
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <div className="text-[12px] text-black/45 dark:text-white/45">
          Saved locally to `data/explorer-data/local/reviews/`.
        </div>
        <button
          type="submit"
          disabled={!canSubmit}
          className={cn(
            "inline-flex items-center rounded-full bg-accent px-5 py-2 text-[12px] font-bold uppercase tracking-[0.08em] text-accent-foreground",
            canSubmit ? "hover:bg-accent/90" : "opacity-50 cursor-not-allowed"
          )}
        >
          {saving ? "Saving..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
