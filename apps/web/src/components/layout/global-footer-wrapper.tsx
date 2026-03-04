"use client";

import { useCallback, useEffect, useState } from "react";
import { GlobalFooter } from "@web3privacy/portal-ui";
import type { GlobalFooterConfig } from "@web3privacy/portal-ui";
import { getGitHubCommunityMembers } from "@/lib/github-community";

const MAILING_LIST_KEY = "w3pn_mailing_list";

interface GlobalFooterWrapperProps {
  config: GlobalFooterConfig;
}

export function GlobalFooterWrapper({ config }: GlobalFooterWrapperProps) {
  const [communityMembers, setCommunityMembers] = useState<Array<{ login: string; avatarUrl: string; profileUrl: string }>>([]);
  const [newsletterState, setNewsletterState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [newsletterMessage, setNewsletterMessage] = useState("");

  useEffect(() => {
    let mounted = true;
    getGitHubCommunityMembers(280).then((members) => {
      if (mounted && members.length) setCommunityMembers(members);
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  const onNewsletterSubmit = useCallback(async (email: string) => {
    const normalized = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      setNewsletterState("error");
      setNewsletterMessage("Please provide a valid email address.");
      return;
    }
    setNewsletterState("loading");
    setNewsletterMessage("");
    try {
      const existing = JSON.parse(typeof window !== "undefined" ? window.localStorage.getItem(MAILING_LIST_KEY) ?? "[]" : "[]");
      const nextList = Array.isArray(existing) ? existing : [];
      if (!nextList.includes(normalized)) nextList.push(normalized);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(MAILING_LIST_KEY, JSON.stringify(nextList));
      }
      const actionUrl = config.newsletter?.actionUrl;
      if (actionUrl) {
        const res = await fetch(actionUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ email: normalized }),
        });
        if (!res.ok) throw new Error("Subscription endpoint failed");
      }
      setNewsletterState("success");
      setNewsletterMessage("Subscribed. Thank you.");
    } catch {
      setNewsletterState("error");
      setNewsletterMessage("Subscription failed. Please try again.");
    }
  }, [config.newsletter?.actionUrl]);

  return (
    <GlobalFooter
      config={config}
      communityMembers={communityMembers}
      onNewsletterSubmit={onNewsletterSubmit}
      newsletterState={newsletterState}
      newsletterMessage={newsletterMessage}
      variant="portal"
    />
  );
}
