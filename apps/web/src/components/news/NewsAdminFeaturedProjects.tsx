"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AutocompleteProject } from "@/components/awards/autocomplete-project";

type Props = {
  featuredProjectIds: string[];
};

export function NewsAdminFeaturedProjects({ featuredProjectIds }: Props) {
  const router = useRouter();
  const [ids, setIds] = useState<string[]>(featuredProjectIds);
  const [saving, setSaving] = useState(false);

  async function save(projectIds: string[]) {
    setSaving(true);
    try {
      const res = await fetch("/api/news/featured", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featuredProjectIds: projectIds }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setIds(projectIds);
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  function handleAdd(projectId: string | null) {
    if (!projectId || ids.includes(projectId)) return;
    save([...ids, projectId]);
  }

  function handleRemove(id: string) {
    save(ids.filter((x) => x !== id));
  }

  return (
    <div className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-[#151a21]">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-black/75 dark:text-white/75">
        Featured Projects (sidebar widget)
      </h2>
      <p className="mb-3 text-sm text-black/70 dark:text-white/70">
        Project IDs from Explorer (sidebar widget). Add as many as you need.
      </p>

      {ids.length > 0 && (
        <ul className="mb-3 flex flex-col gap-2">
          {ids.map((id) => (
            <li
              key={id}
              className="flex items-center gap-2 rounded bg-black/5 py-1.5 pl-2 pr-1 dark:bg-white/10"
            >
              <code className="flex-1 text-sm leading-8">{id}</code>
              <button
                type="button"
                onClick={() => handleRemove(id)}
                disabled={saving}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-black/50 hover:bg-black/10 hover:text-red-600 dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-red-400"
                title="Remove from featured"
              >
                <span className="material-symbols-rounded text-[18px] leading-none">close</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mb-3 max-w-sm">
        <label className="mb-1 block text-xs font-medium text-black/65 dark:text-white/65">
          Add project (search Explorer)
        </label>
        <AutocompleteProject
          key={ids.join(",")}
          value=""
          onChange={(projectId) => handleAdd(projectId)}
          placeholder="Search project name..."
        />
      </div>

      {saving && (
        <p className="text-xs text-black/55 dark:text-white/55">Saving...</p>
      )}
    </div>
  );
}
