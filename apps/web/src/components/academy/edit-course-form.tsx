"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Course } from "@/types/academy";

type Props = {
  course: Course;
};

export function EditCourseForm({ course }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description);
  const [url, setUrl] = useState(course.url);
  const [icon, setIcon] = useState(course.icon || "");
  const [duration, setDuration] = useState(course.duration || "");
  const [level, setLevel] = useState(course.level || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/academy", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "course",
          id: course.id,
          title,
          description,
          url,
          icon: icon || undefined,
          duration: duration || undefined,
          level: level || undefined,
        }),
      });
      if (res.ok) {
        router.push("/academy/admin");
        router.refresh();
      } else {
        alert("Failed to update course");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to update course");
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
        <label className="block text-sm font-medium mb-1">Icon URL</label>
        <input
          type="url"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Duration</label>
        <input
          type="text"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full rounded border px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Level</label>
        <input
          type="text"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
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
