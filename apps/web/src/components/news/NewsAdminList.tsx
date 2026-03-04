"use client";

import Link from "next/link";
import { format } from "date-fns";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Article } from "@/types/news";

type Props = {
  articles: Article[];
};

export function NewsAdminList({ articles }: Props) {
  const router = useRouter();
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [linkValue, setLinkValue] = useState("");
  const [saving, setSaving] = useState<string | null>(null);

  async function updateOverride(
    articleId: string,
    updates: { published?: boolean; isHighlighted?: boolean; link?: string }
  ) {
    setSaving(articleId);
    try {
      const res = await fetch("/api/news/article-override", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId, ...updates }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setEditingLinkId(null);
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(null);
    }
  }

  function startEditLink(a: Article) {
    setEditingLinkId(a.id);
    setLinkValue(a.link);
  }

  function saveLink(articleId: string) {
    updateOverride(articleId, { link: linkValue });
  }

  return (
    <div className="rounded-xl border border-black/10 bg-white dark:border-white/10 dark:bg-[#151a21]">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-black/10 dark:border-white/10">
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Source</th>
              <th className="px-4 py-3 font-semibold">Highlight</th>
              <th className="px-4 py-3 font-semibold">Published</th>
              <th className="px-4 py-3 font-semibold">Link</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr
                key={a.id}
                className={`border-b border-black/5 dark:border-white/5 last:border-0 ${
                  a.published === false ? "opacity-60" : ""
                }`}
              >
                <td className="px-4 py-3">
                  <span className="line-clamp-1 font-medium">{a.title}</span>
                  <span className="text-xs text-black/55 dark:text-white/55">
                    {a.id}
                  </span>
                </td>
                <td className="px-4 py-3 text-black/75 dark:text-white/75">
                  {a.date ? format(new Date(a.date), "MMM d, yyyy") : "—"}
                </td>
                <td className="px-4 py-3 text-black/75 dark:text-white/75">
                  {a.source}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={a.isHighlighted}
                    onClick={() =>
                      updateOverride(a.id, { isHighlighted: !a.isHighlighted })
                    }
                    disabled={saving === a.id}
                    className={`relative inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 dark:focus-visible:ring-white/20 disabled:opacity-50 ${
                      a.isHighlighted
                        ? "bg-[#22c55e]"
                        : "bg-black/20 dark:bg-white/20"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                        a.isHighlighted ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={a.published !== false}
                    onClick={() =>
                      updateOverride(a.id, { published: a.published !== false ? false : true })
                    }
                    disabled={saving === a.id}
                    className={`relative inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 dark:focus-visible:ring-white/20 disabled:opacity-50 ${
                      a.published !== false
                        ? "bg-[#22c55e]"
                        : "bg-black/20 dark:bg-white/20"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                        a.published !== false ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </td>
                <td className="px-4 py-3">
                  {editingLinkId === a.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={linkValue}
                        onChange={(e) => setLinkValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveLink(a.id);
                          if (e.key === "Escape") setEditingLinkId(null);
                        }}
                        className="min-w-[180px] rounded border border-black/20 bg-white px-2 py-1 text-xs dark:border-white/20 dark:bg-[#1f252d]"
                      />
                      <button
                        type="button"
                        onClick={() => saveLink(a.id)}
                        disabled={saving === a.id}
                        className="text-black hover:underline dark:text-white"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingLinkId(null)}
                        className="text-black/60 hover:underline dark:text-white/60"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => startEditLink(a)}
                      className="max-w-[120px] truncate text-left text-xs text-black hover:underline dark:text-white"
                    >
                      {a.link}
                    </button>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/news/${a.id}`}
                      className="text-black hover:underline dark:text-white"
                    >
                      View
                    </Link>
                    {a.hasDetail && (
                      <Link
                        href={`/news/admin/edit/${a.id}`}
                        className="text-black hover:underline dark:text-white"
                      >
                        Edit
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
