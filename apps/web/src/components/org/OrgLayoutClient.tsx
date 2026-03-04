"use client";

import { useEffect, useState } from "react";
import { GlobalFooter } from "@web3privacy/portal-ui/global-footer";
import "@web3privacy/portal-ui/global-footer.css";
import OrgNavHeader from "@/components/org/OrgNavHeader";
import { getOrgGlobalFooterConfig } from "@/lib/org/global-footer-config";

const GITHUB_API = "https://api.github.com";
const ORG = "web3privacy";
const MAILING_LIST_KEY = "w3pn_mailing_list";

async function fetchJson(url: string) {
  const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  return res.json();
}

async function getGitHubCommunityMembers(limit: number): Promise<Array<{ login: string; avatarUrl: string; profileUrl: string }>> {
  try {
    const [members, repos] = await Promise.all([
      fetchJson(`${GITHUB_API}/orgs/${ORG}/members?per_page=100`),
      fetchJson(`${GITHUB_API}/orgs/${ORG}/repos?sort=updated&per_page=6&type=public`),
    ]);
    const repoNames = (repos as { name: string; fork?: boolean }[]).filter((r) => !r.fork).map((r) => r.name).slice(0, 4);
    const contributors = await Promise.all(
      repoNames.map((name) => fetchJson(`${GITHUB_API}/repos/${ORG}/${name}/contributors?per_page=50`).catch(() => []))
    );
    const users = new Map<string, { login: string; avatarUrl: string; profileUrl: string; score: number }>();
    (members as { login: string; avatar_url: string; html_url: string }[]).forEach((u) => {
      if (u?.login && u?.avatar_url && u?.html_url) users.set(u.login, { login: u.login, avatarUrl: u.avatar_url, profileUrl: u.html_url, score: 10 });
    });
    contributors.flat().forEach((entry: { user?: { login: string; avatar_url: string; html_url: string }; login?: string; avatar_url?: string; html_url?: string }) => {
      const u = entry?.user ?? entry;
      if (!u?.login || !u?.avatar_url || !u?.html_url) return;
      const existing = users.get(u.login);
      const score = existing ? existing.score + 1 : 1;
      users.set(u.login, { login: u.login, avatarUrl: u.avatar_url, profileUrl: u.html_url, score });
    });
    return Array.from(users.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(({ score: _s, ...rest }) => rest);
  } catch {
    return [];
  }
}

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

  async function handleNewsletterSubmit(email: string) {
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
  }

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
