"use client";

import { useState } from "react";

const WEB3PRIVACY_SOCIAL = [
  { href: "https://github.com/web3privacy", label: "GitHub", icon: "code" },
  { href: "https://x.com/web3privacy", label: "X / Twitter", icon: "campaign" },
  { href: "https://www.youtube.com/@web3privacy", label: "YouTube", icon: "play_circle" },
  { href: "https://t.me/web3privacy", label: "Telegram", icon: "send" },
  { href: "https://discord.gg/web3privacy", label: "Discord", icon: "forum" },
  { href: "https://mirror.xyz/0x0f1F3DAf416B74DB3DE55Eb4D7513a80F4841073", label: "Mirror", icon: "auto_stories" },
] as const;

export function NewsGetInvolvedCard() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      await new Promise((r) => setTimeout(r, 500));
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="rounded-2xl bg-[#f0f0f0] p-6 dark:bg-[#1a1f27]">
      <div className="space-y-5">
        <div>
          <p className="mb-2 text-sm font-medium text-black dark:text-white">
            Join our privacy movement on:
          </p>
          <div className="flex flex-wrap gap-2">
            {WEB3PRIVACY_SOCIAL.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-black transition-colors hover:bg-black/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                aria-label={s.label}
                title={s.label}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                <span className="material-symbols-rounded text-[20px]">{s.icon}</span>
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm font-medium text-black dark:text-white">
            Subscribe to Newsletter:
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="w-full rounded-[8px] border border-transparent bg-white px-4 py-2.5 text-sm text-black outline-none transition-[border-color,box-shadow] placeholder:text-[#606060] focus:border-black/25 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.08)] dark:border-[#3b4048] dark:bg-[#12161d] dark:text-[#f2f4f6] dark:placeholder:text-[#95a0ae] dark:focus:border-white/20 dark:focus:shadow-[0_0_0_3px_rgba(255,255,255,0.08)]"
              disabled={status === "loading"}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="flex h-10 w-full items-center justify-center rounded-full border border-[#70FF88] bg-[#70FF88] px-4 text-[12px] font-bold uppercase tracking-[0.08em] text-black transition-all hover:-translate-y-0.5 hover:bg-[#5bee72] disabled:opacity-70"
            >
              {status === "loading" ? "..." : "Subscribe"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
