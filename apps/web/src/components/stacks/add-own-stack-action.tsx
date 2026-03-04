"use client";

import { useRouter } from "next/navigation";
import { AddOwnStackForm } from "@/components/stacks/add-own-stack-form";
import type { Tools } from "@/types";

type AddOwnStackActionProps = {
  tools: Tools;
};

export function AddOwnStackAction({ tools }: AddOwnStackActionProps) {
  const router = useRouter();

  return (
    <AddOwnStackForm
      tools={tools}
      onAddStack={async ({ stack, toolsPatch }) => {
        try {
          const response = await fetch("/api/profiles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ stack, toolsPatch }),
          });

          if (!response.ok) {
            const payload = (await response.json().catch(() => ({}))) as { error?: string };
            return {
              ok: false,
              error: payload.error ?? "Unable to save profile.",
            };
          }

          router.push(`/stacks/${encodeURIComponent(stack.id)}`);
          router.refresh();
          return { ok: true };
        } catch {
          return {
            ok: false,
            error: "Unable to reach save API.",
          };
        }
      }}
    />
  );
}
