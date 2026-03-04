"use client";

import Link from "next/link";
import { cn } from "@web3privacy/portal-ui";

const WEB3PRIVACY_SOCIAL = [
  { href: "https://github.com/web3privacy", label: "GitHub", icon: "code" },
  { href: "https://x.com/web3privacy", label: "X / Twitter", icon: "campaign" },
  { href: "https://www.youtube.com/@web3privacy", label: "YouTube", icon: "play_circle" },
  { href: "https://t.me/web3privacy", label: "Telegram", icon: "send" },
  { href: "https://discord.gg/web3privacy", label: "Discord", icon: "forum" },
  { href: "https://news.web3privacy.info/feed.xml", label: "RSS", icon: "rss_feed" },
] as const;

export function NewsSocialLinks({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2",
        className
      )}
    >
      {WEB3PRIVACY_SOCIAL.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-black/65 transition-colors hover:bg-black/10 hover:text-black dark:bg-white/10 dark:text-white/65 dark:hover:bg-white/20 dark:hover:text-white"
          aria-label={s.label}
          title={s.label}
        >
          <span className="material-symbols-rounded text-[20px]">{s.icon}</span>
        </a>
      ))}
    </div>
  );
}
