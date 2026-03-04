"use client";

import { useState } from "react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      // Placeholder – integrate with Paragraph / newsletter API
      await new Promise((r) => setTimeout(r, 500));
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        className="h-10 rounded-lg border border-black/10 bg-white px-3 text-sm text-black outline-none placeholder:text-black/40 focus:border-[#70ff88] dark:border-white/10 dark:bg-[#151a21] dark:text-white dark:placeholder:text-white/40"
        disabled={status === "loading"}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="h-10 shrink-0 rounded-lg bg-[#70ff88] px-5 font-semibold text-black transition-colors hover:bg-[#5eef70] disabled:opacity-70"
      >
        {status === "loading" ? "..." : "Sign Up"}
      </button>
    </form>
  );
}
