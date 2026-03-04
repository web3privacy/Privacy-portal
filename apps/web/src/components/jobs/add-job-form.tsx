"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = ["Engineering", "Design", "Product", "Marketing", "Sales", "Operations", "Other"];
const TAG_OPTIONS = ["Remote", "Full-time", "Part-time", "Contract", "Internship"];

type Props = {
  onSuccess?: () => void;
};

export function AddJobForm({ onSuccess }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("Other");
  const [tags, setTags] = useState<string[]>([]);
  const [explorerProjectId, setExplorerProjectId] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleTag = (tag: string) => {
    setTags((p) => (p.includes(tag) ? p.filter((t) => t !== tag) : [...p, tag]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          company,
          companyLogo: companyLogo || null,
          description,
          url,
          category,
          tags,
          explorerProjectId: explorerProjectId || null,
        }),
      });
      if (res.ok) {
        onSuccess ? onSuccess() : router.push("/jobs");
        router.refresh();
      } else alert("Failed to add job");
    } catch {
      alert("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Job Title</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded border px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Company</label>
        <input
          type="text"
          required
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full rounded border px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Company Logo URL</label>
        <input
          type="url"
          value={companyLogo}
          onChange={(e) => setCompanyLogo(e.target.value)}
          placeholder="https://..."
          className="w-full rounded border px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full rounded border px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Job URL (details)</label>
        <input
          type="url"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          className="w-full rounded border px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded border px-3 py-2 text-sm"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Tags (Fulltime / Remote etc.)</label>
        <div className="flex flex-wrap gap-2">
          {TAG_OPTIONS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => toggleTag(t)}
              className={`px-3 py-1 rounded text-sm ${tags.includes(t) ? "bg-black text-white" : "bg-gray-200"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Explorer Project ID (optional)</label>
        <input
          type="text"
          value={explorerProjectId}
          onChange={(e) => setExplorerProjectId(e.target.value)}
          placeholder="Link to project from Explorer"
          className="w-full rounded border px-3 py-2 text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-[#70FF88] text-black font-bold rounded"
      >
        {loading ? "Saving..." : "Add Job"}
      </button>
    </form>
  );
}
