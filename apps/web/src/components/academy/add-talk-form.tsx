"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  onSuccess?: () => void;
};

export function AddTalkForm({ onSuccess }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [youtubeId, setYoutubeId] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [displayOrder, setDisplayOrder] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/academy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "talk",
          title,
          youtubeId,
          speaker: speaker || undefined,
          description: description || undefined,
          duration: duration || undefined,
          displayOrder: displayOrder || undefined,
          thumbnailUrl: youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : undefined,
        }),
      });
      if (res.ok) {
        onSuccess ? onSuccess() : router.push("/academy/admin");
        router.refresh();
      } else {
        alert("Failed to add talk");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to add talk");
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
        <label className="block text-sm font-medium mb-1">YouTube Video ID *</label>
        <input
          type="text"
          value={youtubeId}
          onChange={(e) => setYoutubeId(e.target.value)}
          required
          placeholder="dQw4w9WgXcQ"
          className="w-full rounded border px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Speaker</label>
        <input
          type="text"
          value={speaker}
          onChange={(e) => setSpeaker(e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded border px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Duration (e.g., 19:42)</label>
        <input
          type="text"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="19:42"
          className="w-full rounded border px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Display Order (lower = first)</label>
        <input
          type="number"
          value={displayOrder ?? ""}
          onChange={(e) => setDisplayOrder(e.target.value ? parseInt(e.target.value) : undefined)}
          placeholder="Auto"
          className="w-full rounded border px-3 py-2"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded bg-[#70FF88] px-4 py-2 text-black font-bold uppercase text-sm disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add Talk"}
      </button>
    </form>
  );
}
