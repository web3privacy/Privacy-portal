"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AcceleratorItem } from "@/types/academy";

type Props = {
  item: AcceleratorItem;
};

export function EditAcceleratorItemForm({ item }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description || "");
  const [icon, setIcon] = useState(item.icon || "");
  const [url, setUrl] = useState(item.url || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/academy", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "acceleratorItem",
          id: item.id,
          title,
          description: description || undefined,
          icon: icon || undefined,
          url: url || undefined,
        }),
      });
      if (res.ok) {
        router.push("/academy/admin");
        router.refresh();
      } else {
        alert("Failed to update accelerator item");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update accelerator item");
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
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded border px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Icon (Material Symbol name)</label>
        <input
          type="text"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          placeholder="e.g., rocket_launch"
          className="w-full rounded border px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
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
