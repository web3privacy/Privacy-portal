"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Guide } from "@/types/academy";

type Props = {
  guide: Guide;
};

export function EditGuideForm({ guide }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(guide.title);
  const [description, setDescription] = useState(guide.description);
  const [url, setUrl] = useState(guide.url);
  const [duration, setDuration] = useState(guide.duration || "");
  const [isNew, setIsNew] = useState(guide.isNew || false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/academy", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "guide",
          id: guide.id,
          title,
          description,
          url,
          duration: duration || undefined,
          isNew,
        }),
      });
      if (res.ok) {
        router.push("/academy/admin");
        router.refresh();
      } else {
        alert("Failed to update guide");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update guide");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full rounded border px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description *</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          className="w-full rounded border px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">URL *</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          className="w-full rounded border px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Duration (e.g., 6 min)</label>
        <input
          type="text"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
      </div>
      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isNew}
            onChange={(e) => setIsNew(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Mark as NEW</span>
        </label>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded bg-[#70FF88] px-4 py-2 text-black font-bold uppercase text-sm disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
