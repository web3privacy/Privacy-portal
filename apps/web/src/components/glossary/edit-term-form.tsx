"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { GlossaryTerm } from "@/lib/glossary";

type Props = {
  term: GlossaryTerm;
  onSuccess?: () => void;
};

export function EditTermForm({ term, onSuccess }: Props) {
  const router = useRouter();
  const [value, setValue] = useState(term.term);
  const [definition, setDefinition] = useState(term.definition);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!value.trim() || !definition.trim()) {
      setError("Please fill in both term and definition.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/glossary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldTerm: term.term,
          term: value.trim(),
          definition: definition.trim(),
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Failed to update term.");
        return;
      }
      onSuccess?.();
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="edit-term"
          className="mb-1 block text-[12px] font-bold uppercase tracking-[0.08em] text-black/70 dark:text-white/70"
        >
          Term name
        </label>
        <input
          id="edit-term"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full rounded-[10px] border border-[#d6d6d6] bg-white px-4 py-2.5 text-sm text-black dark:border-[#3b4048] dark:bg-[#151a21] dark:text-[#f2f4f6]"
          disabled={submitting}
        />
      </div>
      <div>
        <label
          htmlFor="edit-definition"
          className="mb-1 block text-[12px] font-bold uppercase tracking-[0.08em] text-black/70 dark:text-white/70"
        >
          Definition
        </label>
        <textarea
          id="edit-definition"
          value={definition}
          onChange={(e) => setDefinition(e.target.value)}
          rows={5}
          className="w-full rounded-[10px] border border-[#d6d6d6] bg-white px-4 py-2.5 text-sm text-black dark:border-[#3b4048] dark:bg-[#151a21] dark:text-[#f2f4f6]"
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
          {submitting ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={onSuccess}
          className="rounded-[10px] border border-[#d8d8d8] px-5 py-2.5 text-[13px] font-bold uppercase tracking-[0.08em] text-black dark:border-[#2c3139] dark:text-[#f2f4f6]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
