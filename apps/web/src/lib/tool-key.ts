import type { ToolCategory } from "@/types";

export function createToolKey(name: string, categoryTools: ToolCategory): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || "custom_tool";

  let key = base;
  let index = 1;

  while (categoryTools[key]) {
    index += 1;
    key = `${base}_${index}`;
  }

  return key;
}
