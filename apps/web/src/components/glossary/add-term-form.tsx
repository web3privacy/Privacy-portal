"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  className?: string;
  onSuccess?: () => void;
};

export function AddTermForm({ className = "", onSuccess }: Props) {
  const router = useRouter();
  const [term, setTerm] = useState("");
  const [definition, setDefinition] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!term.trim() || !definition.trim()) {
      setError("Please fill in both term and definition.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/glossary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ term: term.trim(), definition: definition.trim() }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Failed to add term.");
        return;
      }
      onSuccess ? onSuccess() : router.push("/glossary");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      <div>
        <label
          htmlFor="term"
          className="mb-1 block text-[12px] font-bold uppercase tracking-[0.08em] text-black/70 dark:text-white/70"
        >
          Term name
        </label>
        <input
          id="term"
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="e.g. Zero-Knowledge Proof"
          className="w-full rounded-[10px] border border-[#d6d6d6] bg-white px-4 py-2.5 text-sm text-black placeholder:text-[#616161] dark:border-[#3b4048] dark:bg-[#151a21] dark:text-[#f2f4f6] dark:placeholder:text-[#a7b0bd]"
          disabled={submitting}
        />
      </div>
      <div>
        <label
          htmlFor="definition"
          className="mb-1 block text-[12px] font-bold uppercase tracking-[0.08em] text-black/70 dark:text-white/70"
        >
          Definition
        </label>
        <textarea
          id="definition"
          value={definition}
          onChange={(e) => setDefinition(e.target.value)}
          placeholder="Explain the term..."
          rows={5}
          className="w-full rounded-[10px] border border-[#d6d6d6] bg-white px-4 py-2.5 text-sm text-black placeholder:text-[#616161] dark:border-[#3b4048] dark:bg-[#151a21] dark:text-[#f2f4f6] dark:placeholder:text-[#a7b0bd]"
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
          {submitting ? "Adding…" : "Add term"}
        </button>
        {!onSuccess && (
          <a
            href="/glossary"
            className="rounded-[10px] border border-[#d8d8d8] px-5 py-2.5 text-[13px] font-bold uppercase tracking-[0.08em] text-black transition-colors hover:bg-[#f5f5f5] dark:border-[#2c3139] dark:text-[#f2f4f6] dark:hover:bg-[#1f252d]"
          >
            Cancel
          </a>
        )}
      </div>
    </form>
  );
}
