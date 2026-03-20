"use client";

import { useCallback, useEffect, useState } from "react";
import { GlobalFooter } from "@web3privacy/portal-ui/global-footer";
import "@web3privacy/portal-ui/global-footer.css";
import OrgNavHeader from "@/components/org/OrgNavHeader";
import { getOrgGlobalFooterConfig } from "@/lib/org/global-footer-config";
import { getGitHubCommunityMembers } from "@/lib/github-community";

const MAILING_LIST_KEY = "w3pn_mailing_list";

type Content = Record<string, unknown>;

export default function OrgLayoutClient({
  content,
  children,
}: {
  content: Content;
  children: React.ReactNode;
}) {
  const [communityMembers, setCommunityMembers] = useState<Array<{ login: string; avatarUrl: string; profileUrl: string }>>([]);
  const [newsletterState, setNewsletterState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [newsletterMessage, setNewsletterMessage] = useState("");

  useEffect(() => {
    getGitHubCommunityMembers(280).then(setCommunityMembers).catch(() => {});
  }, []);

  const footerConfig = getOrgGlobalFooterConfig(content);
  const newsletterConfig = (content.newsletter ?? {}) as { actionUrl?: string };

  const handleNewsletterSubmit = useCallback(async (email: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setNewsletterState("error");
      setNewsletterMessage("Please provide a valid email address.");
      return;
    }
    setNewsletterState("loading");
    setNewsletterMessage("");
    try {
      const existing = JSON.parse(typeof window !== "undefined" ? window.localStorage.getItem(MAILING_LIST_KEY) ?? "[]" : "[]");
      const nextList = Array.isArray(existing) ? existing : [];
      if (!nextList.includes(normalizedEmail)) nextList.push(normalizedEmail);
      if (typeof window !== "undefined") window.localStorage.setItem(MAILING_LIST_KEY, JSON.stringify(nextList));
      if (newsletterConfig.actionUrl) {
        const res = await fetch(newsletterConfig.actionUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ email: normalizedEmail }),
        });
        if (!res.ok) throw new Error("Remote mailing list endpoint failed");
      }
      setNewsletterState("success");
      setNewsletterMessage("Subscribed. Thank you.");
    } catch {
      setNewsletterState("error");
      setNewsletterMessage("Subscription failed. Please try again.");
    }
  }, [newsletterConfig.actionUrl]);

  return (
    <div className="org-web-root landing-root">
      <OrgNavHeader content={content} />
      {children}
      <GlobalFooter
        config={footerConfig}
        communityMembers={communityMembers}
        onNewsletterSubmit={handleNewsletterSubmit}
        newsletterState={newsletterState}
        newsletterMessage={newsletterMessage}
        variant="org"
      />
    </div>
  );
}
