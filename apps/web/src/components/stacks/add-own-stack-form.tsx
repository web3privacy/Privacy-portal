"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { createToolKey } from "@/lib/tool-key";
import type { Stack, Tools } from "@/types";

type AddStackPayload = {
  stack: Stack;
  toolsPatch: Tools;
};

type AddStackResult = {
  ok: boolean;
  error?: string;
};

type AddOwnStackFormProps = {
  tools: Tools;
  onAddStack: (payload: AddStackPayload) => Promise<AddStackResult>;
};

type ToolRow = {
  rowId: string;
  categoryKey: string;
  mode: "existing" | "custom";
  toolKey: string;
  customName: string;
  customUrl: string;
  customImage: string;
};

function toSlug(value: string): string {
  const normalized = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || `stack-${Date.now().toString(36)}`;
}

function rowId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function createEmptyRow(tools: Tools): ToolRow {
  const categoryKeys = Object.keys(tools).sort();
  const categoryKey = categoryKeys[0] ?? "";
  const firstToolKey = categoryKey ? Object.keys(tools[categoryKey] ?? {})[0] ?? "" : "";

  return {
    rowId: rowId(),
    categoryKey,
    mode: "existing",
    toolKey: firstToolKey,
    customName: "",
    customUrl: "",
    customImage: "",
  };
}

export function AddOwnStackForm({ tools, onAddStack }: AddOwnStackFormProps) {
  const categoryKeys = useMemo(() => Object.keys(tools).sort(), [tools]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [avatar, setAvatar] = useState("");
  const [mounted, setMounted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [rows, setRows] = useState<ToolRow[]>([createEmptyRow(tools)]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (rows.length === 0) {
      setRows([createEmptyRow(tools)]);
      return;
    }

    setRows((current) =>
      current.map((row) => {
        if (tools[row.categoryKey]) {
          return row;
        }

        const fallback = createEmptyRow(tools);
        return {
          ...row,
          categoryKey: fallback.categoryKey,
          toolKey: fallback.toolKey,
        };
      })
    );
  }, [rows.length, tools]);

  function resetForm() {
    setName("");
    setOrg("");
    setAvatar("");
    setSubmitError("");
    setRows([createEmptyRow(tools)]);
  }

  function addRow() {
    setRows((prev) => {
      if (prev.length >= 8) {
        return prev;
      }

      return [...prev, createEmptyRow(tools)];
    });
  }

  function updateRow(index: number, patch: Partial<ToolRow>) {
    setRows((prev) =>
      prev.map((row, rowIndex) => {
        if (rowIndex !== index) {
          return row;
        }

        const next: ToolRow = { ...row, ...patch };

        if (patch.categoryKey) {
          const firstKey = Object.keys(tools[patch.categoryKey] ?? {})[0] ?? "";
          next.toolKey = firstKey;
        }

        return next;
      })
    );
  }

  function removeRow(index: number) {
    setRows((prev) => {
      if (prev.length === 1) {
        return prev;
      }
      return prev.filter((_, rowIndex) => rowIndex !== index);
    });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const cleanName = name.trim();
    const cleanOrg = org.trim();

    if (!cleanName || !cleanOrg || rows.length === 0) {
      return;
    }

    const stackToolMap = new Map<string, string[]>();
    const toolsPatch: Tools = {};

    for (const row of rows) {
      if (!row.categoryKey) {
        continue;
      }

      if (row.mode === "existing") {
        if (!row.toolKey) {
          continue;
        }
        const list = stackToolMap.get(row.categoryKey) ?? [];
        if (!list.includes(row.toolKey)) {
          list.push(row.toolKey);
        }
        stackToolMap.set(row.categoryKey, list);
        continue;
      }

      const customName = row.customName.trim();
      const customUrl = row.customUrl.trim();
      const customImage = row.customImage.trim();

      if (!customName || !customUrl) {
        continue;
      }

      const categoryTools = {
        ...(tools[row.categoryKey] ?? {}),
        ...(toolsPatch[row.categoryKey] ?? {}),
      };
      const customKey = createToolKey(customName, categoryTools);

      if (!toolsPatch[row.categoryKey]) {
        toolsPatch[row.categoryKey] = {};
      }

      toolsPatch[row.categoryKey][customKey] = {
        name: customName,
        url: customUrl,
        image: customImage || undefined,
      };

      const list = stackToolMap.get(row.categoryKey) ?? [];
      list.push(customKey);
      stackToolMap.set(row.categoryKey, list);
    }

    if (stackToolMap.size === 0) {
      return;
    }

    const stackTools: Record<string, string | string[]> = {};
    for (const [categoryKey, list] of stackToolMap.entries()) {
      const unique = Array.from(new Set(list));
      stackTools[categoryKey] = unique.length === 1 ? unique[0] : unique;
    }

    const slugBase = toSlug(cleanName);
    const id = `custom-${slugBase}-${Date.now().toString(36).slice(-5)}`;
    const avatarSrc =
      avatar.trim() ||
      `https://api.dicebear.com/9.x/personas/svg?seed=${encodeURIComponent(cleanName)}`;

    const result = await onAddStack({
      stack: {
        id,
        name: cleanName,
        org: cleanOrg,
        avatar: avatarSrc,
        tools: stackTools,
      },
      toolsPatch,
    });

    if (!result.ok) {
      setSubmitError(result.error ?? "Unable to save profile.");
      return;
    }

    setOpen(false);
    resetForm();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 items-center gap-1 whitespace-nowrap rounded-[100px] bg-[#70ff88] px-4 text-left text-[12px] font-semibold leading-none tracking-[0.05em] text-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#5bee72] hover:shadow-[0_12px_24px_rgba(89,242,109,0.35)]"
      >
        <span className="material-symbols-rounded translate-y-[1px] text-[18px] leading-none">add</span>
        <span className="inline-flex h-full items-center whitespace-nowrap pt-px leading-none">
          ADD OWN STACK
        </span>
      </button>

      {mounted &&
        open &&
        createPortal(
          <div
            className="fixed inset-0 z-[1000] grid place-items-center bg-black/35 p-4"
            onClick={() => {
              setOpen(false);
              resetForm();
            }}
          >
            <div
              className="animate-pop-in w-full max-w-[760px] rounded-[12px] bg-white p-5 shadow-xl dark:bg-[#161b23] md:p-6"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-serif text-[28px] text-black dark:text-[#f2f4f6]">Add own stack</h3>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close dialog"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#d6d6d6] transition-all duration-200 hover:border-black/30 hover:bg-black/5 dark:border-[#3b4048] dark:text-[#f2f4f6] dark:hover:bg-white/10"
                >
                  <span className="material-symbols-rounded text-[28px] leading-none">close</span>
                </button>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {submitError && (
                  <div className="rounded-[8px] border border-[#e3b8b8] bg-[#fff5f5] px-3 py-2 text-[13px] text-[#b42318] dark:border-[#5b2f32] dark:bg-[#2a1a1c] dark:text-[#ff8b80]">
                    {submitError}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <label className="space-y-1">
                    <span className="text-[12px] font-bold tracking-[0.05em] text-[#505050] dark:text-[#adb6c4]">NAME</span>
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                      className="h-10 w-full rounded-[8px] border border-[#d6d6d6] px-3 text-[14px] transition-[border-color,box-shadow] duration-200 focus:border-black/25 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.08)] focus:outline-none dark:border-[#3b4048] dark:bg-[#11161e] dark:text-[#f2f4f6] dark:focus:border-white/20 dark:focus:shadow-[0_0_0_3px_rgba(255,255,255,0.08)]"
                      placeholder="Jane Doe"
                    />
                  </label>

                  <label className="space-y-1">
                    <span className="text-[12px] font-bold tracking-[0.05em] text-[#505050] dark:text-[#adb6c4]">
                      ROLE / ORG
                    </span>
                    <input
                      value={org}
                      onChange={(event) => setOrg(event.target.value)}
                      required
                      className="h-10 w-full rounded-[8px] border border-[#d6d6d6] px-3 text-[14px] transition-[border-color,box-shadow] duration-200 focus:border-black/25 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.08)] focus:outline-none dark:border-[#3b4048] dark:bg-[#11161e] dark:text-[#f2f4f6] dark:focus:border-white/20 dark:focus:shadow-[0_0_0_3px_rgba(255,255,255,0.08)]"
                      placeholder="Researcher, Example Org"
                    />
                  </label>
                </div>

                <label className="block space-y-1">
                  <span className="text-[12px] font-bold tracking-[0.05em] text-[#505050] dark:text-[#adb6c4]">
                    AVATAR URL (optional)
                  </span>
                  <input
                    value={avatar}
                    onChange={(event) => setAvatar(event.target.value)}
                    className="h-10 w-full rounded-[8px] border border-[#d6d6d6] px-3 text-[14px] transition-[border-color,box-shadow] duration-200 focus:border-black/25 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.08)] focus:outline-none dark:border-[#3b4048] dark:bg-[#11161e] dark:text-[#f2f4f6] dark:focus:border-white/20 dark:focus:shadow-[0_0_0_3px_rgba(255,255,255,0.08)]"
                    placeholder="https://..."
                  />
                </label>

                <div className="space-y-3">
                  <p className="text-[12px] font-bold tracking-[0.05em] text-[#505050] dark:text-[#adb6c4]">TOOLS</p>

                  {rows.map((row, index) => {
                    const toolKeys = Object.keys(tools[row.categoryKey] ?? {});
                    return (
                      <div key={row.rowId} className="space-y-2 rounded-[8px] bg-[#f6f6f6] p-2 dark:bg-[#10151d]">
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_1fr_auto]">
                          <select
                            value={row.categoryKey}
                            onChange={(event) => updateRow(index, { categoryKey: event.target.value })}
                            className="h-10 rounded-[8px] border border-[#d6d6d6] bg-white pl-4 pr-10 text-[14px] transition-[border-color,box-shadow] duration-200 focus:border-black/25 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.08)] focus:outline-none dark:border-[#3b4048] dark:bg-[#11161e] dark:text-[#f2f4f6] dark:focus:border-white/20 dark:focus:shadow-[0_0_0_3px_rgba(255,255,255,0.08)]"
                          >
                            {categoryKeys.map((categoryKey) => (
                              <option key={categoryKey} value={categoryKey}>
                                {categoryKey.replace(/_/g, " ")}
                              </option>
                            ))}
                          </select>

                          <select
                            value={row.mode}
                            onChange={(event) =>
                              updateRow(index, {
                                mode: event.target.value as ToolRow["mode"],
                              })
                            }
                            className="h-10 rounded-[8px] border border-[#d6d6d6] bg-white pl-4 pr-10 text-[14px] transition-[border-color,box-shadow] duration-200 focus:border-black/25 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.08)] focus:outline-none dark:border-[#3b4048] dark:bg-[#11161e] dark:text-[#f2f4f6] dark:focus:border-white/20 dark:focus:shadow-[0_0_0_3px_rgba(255,255,255,0.08)]"
                          >
                            <option value="existing">Existing tool</option>
                            <option value="custom">Custom tool</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => removeRow(index)}
                            className="h-10 rounded-[8px] border border-[#d6d6d6] bg-white px-3 text-[12px] font-bold transition-all duration-200 hover:border-black/30 hover:bg-black/5 dark:border-[#3b4048] dark:bg-[#11161e] dark:text-[#f2f4f6] dark:hover:bg-white/10"
                          >
                            REMOVE
                          </button>
                        </div>

                        {row.mode === "existing" ? (
                          <select
                            value={row.toolKey}
                            onChange={(event) => updateRow(index, { toolKey: event.target.value })}
                            className="h-10 w-full rounded-[8px] border border-[#d6d6d6] bg-white pl-4 pr-10 text-[14px] transition-[border-color,box-shadow] duration-200 focus:border-black/25 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.08)] focus:outline-none dark:border-[#3b4048] dark:bg-[#11161e] dark:text-[#f2f4f6] dark:focus:border-white/20 dark:focus:shadow-[0_0_0_3px_rgba(255,255,255,0.08)]"
                          >
                            {toolKeys.map((toolKey) => (
                              <option key={toolKey} value={toolKey}>
                                {tools[row.categoryKey]?.[toolKey]?.name ?? toolKey}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                            <input
                              value={row.customName}
                              onChange={(event) => updateRow(index, { customName: event.target.value })}
                              placeholder="Tool name"
                              className="h-10 rounded-[8px] border border-[#d6d6d6] bg-white px-3 text-[14px] transition-[border-color,box-shadow] duration-200 focus:border-black/25 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.08)] focus:outline-none dark:border-[#3b4048] dark:bg-[#11161e] dark:text-[#f2f4f6] dark:focus:border-white/20 dark:focus:shadow-[0_0_0_3px_rgba(255,255,255,0.08)]"
                            />
                            <input
                              value={row.customUrl}
                              onChange={(event) => updateRow(index, { customUrl: event.target.value })}
                              placeholder="https://tool.site"
                              className="h-10 rounded-[8px] border border-[#d6d6d6] bg-white px-3 text-[14px] transition-[border-color,box-shadow] duration-200 focus:border-black/25 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.08)] focus:outline-none dark:border-[#3b4048] dark:bg-[#11161e] dark:text-[#f2f4f6] dark:focus:border-white/20 dark:focus:shadow-[0_0_0_3px_rgba(255,255,255,0.08)]"
                            />
                            <input
                              value={row.customImage}
                              onChange={(event) => updateRow(index, { customImage: event.target.value })}
                              placeholder="Logo URL (optional)"
                              className="h-10 rounded-[8px] border border-[#d6d6d6] bg-white px-3 text-[14px] transition-[border-color,box-shadow] duration-200 focus:border-black/25 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.08)] focus:outline-none dark:border-[#3b4048] dark:bg-[#11161e] dark:text-[#f2f4f6] dark:focus:border-white/20 dark:focus:shadow-[0_0_0_3px_rgba(255,255,255,0.08)]"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={addRow}
                      className="inline-flex items-center gap-1 rounded-[8px] px-2 py-1 text-[12px] font-bold tracking-[0.05em] text-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-black/5 dark:text-[#f2f4f6] dark:hover:bg-white/10"
                    >
                      <span className="material-symbols-rounded text-[16px] leading-none">add</span>
                      ADD TOOL
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      resetForm();
                    }}
                    className="h-10 rounded-[8px] border border-[#d6d6d6] px-4 text-[12px] font-bold transition-all duration-200 hover:border-black/30 hover:bg-black/5 dark:border-[#3b4048] dark:text-[#f2f4f6] dark:hover:bg-white/10"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="h-10 rounded-[8px] bg-[#70ff88] px-4 text-[12px] font-bold transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#5bee72] hover:shadow-[0_12px_24px_rgba(89,242,109,0.35)]"
                  >
                    ADD PROFILE
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
