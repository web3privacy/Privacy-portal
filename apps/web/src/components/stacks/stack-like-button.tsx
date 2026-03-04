"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@/components/wallet/wallet-provider";

type StackLikeButtonProps = {
  stackId: string;
  initialCount: number;
  initialLiked?: boolean;
  onLikeStateChange?: (nextCount: number, liked: boolean) => void;
  compact?: boolean;
};

type LikeResponse = {
  likeCount: number;
  liked: boolean;
  alreadyLiked?: boolean;
};

export function StackLikeButton({
  stackId,
  initialCount,
  initialLiked = false,
  onLikeStateChange,
  compact = false,
}: StackLikeButtonProps) {
  const { walletAddress, connectWallet } = useWallet();
  const [likeCount, setLikeCount] = useState(initialCount);
  const [liked, setLiked] = useState(initialLiked);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLikeCount(initialCount);
  }, [initialCount]);

  useEffect(() => {
    setLiked(initialLiked);
  }, [initialLiked]);

  async function handleLike() {
    if (submitting) {
      return;
    }

    setError("");
    let address = walletAddress;
    if (!address) {
      const connected = await connectWallet();
      if (!connected) {
        setError("Wallet connection required.");
        return;
      }
      address = connected;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stackId,
          address,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(payload.error ?? "Unable to save like.");
      }

      const payload = (await response.json()) as LikeResponse;
      setLikeCount(payload.likeCount);
      setLiked(payload.liked);
      onLikeStateChange?.(payload.likeCount, payload.liked);
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Unable to save like.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={compact ? "space-y-1" : "space-y-1.5"}>
      <button
        type="button"
        onClick={() => {
          void handleLike();
        }}
        disabled={submitting}
        className={`inline-flex items-center gap-1 rounded-[6px] px-0 py-0 text-black transition-all duration-200 hover:-translate-y-0.5 hover:text-[#2fa543] disabled:cursor-not-allowed disabled:opacity-65 dark:text-[#f2f4f6] dark:hover:text-[#68f07b] ${
          compact ? "h-7 text-[11px]" : "h-8 text-[12px]"
        }`}
        title={liked ? "You liked this profile" : "Like this profile"}
        aria-label={liked ? "Liked profile" : "Like profile"}
      >
        <span
          className={`material-symbols-rounded text-[16px] leading-none ${
            liked ? "text-[#2fa543] dark:text-[#68f07b]" : ""
          }`}
        >
          {liked ? "favorite" : "favorite_border"}
        </span>
        <span className="font-semibold leading-none">{likeCount}</span>
      </button>
      {error ? <p className="text-[11px] text-[#b42318]">{error}</p> : null}
    </div>
  );
}
