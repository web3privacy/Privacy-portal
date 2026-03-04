"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Idea } from "@/types/ideas";
import { addUserIdea } from "@/lib/ideas";
import { IDEA_CATEGORIES } from "@/types/ideas";

type Props = {
  onSuccess: () => void;
};

const CATEGORY_OPTIONS = Array.from(
  new Set(IDEA_CATEGORIES.filter((c) => c.length > 0))
).slice(0, 40);

export function AddIdeaForm({ onSuccess }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [organization, setOrganization] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [event, setEvent] = useState("");
  const [github, setGithub] = useState("");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState("");

  function toggleCategory(c: string) {
    setCategories((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Name is required.");
      return;
    }
    const idea: Idea = {
      name: trimmedName,
      description: description.trim(),
      categories: categories.length ? categories : ["Privacy"],
      author: author.trim() || undefined,
      organization: organization.trim() || undefined,
      event: event.trim() || undefined,
      github: github.trim() || undefined,
      website: website.trim() || undefined,
    };
    addUserIdea(idea);
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-[13px] text-red-600 dark:text-red-400">{error}</p>
      )}
      <div>
        <label className="mb-1 block text-[12px] font-bold uppercase tracking-[0.08em] text-black/70 dark:text-white/70">
          Idea name *
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-10 w-full rounded-[8px] border border-[#d8d8d8] bg-white px-3 text-[14px] text-black outline-none focus:border-[#70FF88] dark:border-[#2c3139] dark:bg-[#12161d] dark:text-[#f2f4f6]"
          placeholder="e.g. Private voting"
        />
      </div>
      <div>
        <label className="mb-1 block text-[12px] font-bold uppercase tracking-[0.08em] text-black/70 dark:text-white/70">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-[8px] border border-[#d8d8d8] bg-white px-3 py-2 text-[14px] text-black outline-none focus:border-[#70ff88] dark:border-[#2c3139] dark:bg-[#12161d] dark:text-[#f2f4f6]"
          placeholder="Clear description of the project and its privacy benefits"
        />
      </div>
      <div>
        <label className="mb-1 block text-[12px] font-bold uppercase tracking-[0.08em] text-black/70 dark:text-white/70">
          Author
        </label>
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="h-10 w-full rounded-[8px] border border-[#d8d8d8] bg-white px-3 text-[14px] text-black outline-none focus:border-[#70FF88] dark:border-[#2c3139] dark:bg-[#12161d] dark:text-[#f2f4f6]"
          placeholder="Your name or @username"
        />
      </div>
      <div>
        <label className="mb-1 block text-[12px] font-bold uppercase tracking-[0.08em] text-black/70 dark:text-white/70">
          Organization (optional)
        </label>
        <input
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
          className="h-10 w-full rounded-[8px] border border-[#d8d8d8] bg-white px-3 text-[14px] text-black outline-none focus:border-[#70FF88] dark:border-[#2c3139] dark:bg-[#12161d] dark:text-[#f2f4f6]"
          placeholder="Your organization"
        />
      </div>
      <div>
        <label className="mb-2 block text-[12px] font-bold uppercase tracking-[0.08em] text-black/70 dark:text-white/70">
          Categories
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_OPTIONS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => toggleCategory(c)}
              className={`rounded-full px-2.5 py-1 text-[12px] font-medium transition-colors ${
                categories.includes(c)
                  ? "bg-[#70FF88] text-black"
                  : "bg-[#e8e8e8] text-[#616161] hover:bg-[#d8d8d8] dark:bg-[#2a3039] dark:text-[#a7b0bd] dark:hover:bg-[#3b4048]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="mb-1 block text-[12px] font-bold uppercase tracking-[0.08em] text-black/70 dark:text-white/70">
          Event (optional)
        </label>
        <input
          value={event}
          onChange={(e) => setEvent(e.target.value)}
          className="h-10 w-full rounded-[8px] border border-[#d8d8d8] bg-white px-3 text-[14px] text-black outline-none focus:border-[#70FF88] dark:border-[#2c3139] dark:bg-[#12161d] dark:text-[#f2f4f6]"
          placeholder="e.g. ETHDam"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-[12px] font-bold uppercase tracking-[0.08em] text-black/70 dark:text-white/70">
            GitHub (optional)
          </label>
          <input
            value={github}
            onChange={(e) => setGithub(e.target.value)}
            type="url"
            className="h-10 w-full rounded-[8px] border border-[#d8d8d8] bg-white px-3 text-[14px] text-black outline-none focus:border-[#70FF88] dark:border-[#2c3139] dark:bg-[#12161d] dark:text-[#f2f4f6]"
            placeholder="https://github.com/..."
          />
        </div>
        <div>
          <label className="mb-1 block text-[12px] font-bold uppercase tracking-[0.08em] text-black/70 dark:text-white/70">
            Website (optional)
          </label>
          <input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            type="url"
            className="h-10 w-full rounded-[8px] border border-[#d8d8d8] bg-white px-3 text-[14px] text-black outline-none focus:border-[#70FF88] dark:border-[#2c3139] dark:bg-[#12161d] dark:text-[#f2f4f6]"
            placeholder="https://..."
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" className="bg-[#70FF88] text-black hover:bg-[#5bee72]">
          Add idea
        </Button>
      </div>
    </form>
  );
}
