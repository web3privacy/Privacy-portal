"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AddLibraryItemType } from "@/lib/library";

type Props = {
  onSuccess?: () => void;
};

export function AddLibraryItemForm({ onSuccess }: Props) {
  const router = useRouter();
  const [type, setType] = useState<AddLibraryItemType>("book");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  const [recommendedBy, setRecommendedBy] = useState("");
  const [category, setCategory] = useState("Cryptography, Privacy and Technology");
  const [isbn, setIsbn] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!title.trim() || !author.trim()) {
      setError("Title and author are required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/library", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          title: title.trim(),
          author: author.trim(),
          year: year ? parseInt(year, 10) : undefined,
          description: description.trim() || undefined,
          recommendedBy: recommendedBy.trim() || undefined,
          category: type === "book" ? category.trim() : undefined,
          isbn: isbn.trim() || undefined,
          url: url.trim() || undefined,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Failed to add item.");
        return;
      }
      onSuccess ? onSuccess() : router.push("/library");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-[10px] border border-[#d6d6d6] bg-white px-4 py-2.5 text-sm text-black placeholder:text-[#616161] dark:border-[#3b4048] dark:bg-[#151a21] dark:text-[#f2f4f6] dark:placeholder:text-[#a7b0bd]";
  const labelClass =
    "mb-1 block text-[12px] font-bold uppercase tracking-[0.08em] text-black/70 dark:text-white/70";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as AddLibraryItemType)}
          className={inputClass}
        >
          <option value="document">Document</option>
          <option value="article">Article</option>
          <option value="book">Book</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. The Cypherpunk Manifesto"
          className={inputClass}
          disabled={submitting}
        />
      </div>

      <div>
        <label className={labelClass}>Author</label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="e.g. Eric Hughes"
          className={inputClass}
          disabled={submitting}
        />
      </div>

      <div>
        <label className={labelClass}>Year (optional)</label>
        <input
          type="number"
          min={1900}
          max={2100}
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="e.g. 1993"
          className={inputClass}
          disabled={submitting}
        />
      </div>

      <div>
        <label className={labelClass}>Description (optional)</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief summary..."
          rows={3}
          className={inputClass}
          disabled={submitting}
        />
      </div>

      {type === "book" && (
        <>
          <div>
            <label className={labelClass}>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClass}
            >
              <option value="Cryptography, Privacy and Technology">
                Cryptography, Privacy and Technology
              </option>
              <option value="Decentralization, Economics and other important ideas">
                Decentralization, Economics and other important ideas
              </option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Recommended by (optional)</label>
            <input
              type="text"
              value={recommendedBy}
              onChange={(e) => setRecommendedBy(e.target.value)}
              placeholder="e.g. Ben West"
              className={inputClass}
              disabled={submitting}
            />
          </div>
          <div>
            <label className={labelClass}>ISBN (optional, for cover image)</label>
            <input
              type="text"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              placeholder="e.g. 9781610395694"
              className={inputClass}
              disabled={submitting}
            />
          </div>
        </>
      )}

      <div>
        <label className={labelClass}>URL (optional)</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          className={inputClass}
          disabled={submitting}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-[10px] bg-[#70FF88] px-5 py-2.5 text-[13px] font-bold uppercase tracking-[0.08em] text-black transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? "Adding…" : "Add item"}
        </button>
      </div>
    </form>
  );
}
