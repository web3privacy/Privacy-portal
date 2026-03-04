"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import type { FeedCandidate, FeedSource } from "@/lib/news-feeds";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CANDIDATES_PER_PAGE = 100;

export function NewsAdminAggregatedFeed() {
  const router = useRouter();
  const [sources, setSources] = useState<FeedSource[]>([]);
  const [candidates, setCandidates] = useState<FeedCandidate[]>([]);
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [page, setPage] = useState(1);
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());
  const [lastCrawledAt, setLastCrawledAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [testLoading, setTestLoading] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{
    id: string;
    ok: boolean;
    title?: string;
    itemsCount?: number;
    error?: string;
  } | null>(null);
  const [newSource, setNewSource] = useState({ id: "", type: "rss" as FeedSource["type"], url: "" });
  const [savingSources, setSavingSources] = useState(false);
  const [crawlRunning, setCrawlRunning] = useState(false);
  const [crawlLog, setCrawlLog] = useState<string[]>([]);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const loadCandidates = useCallback((p: number): Promise<void> => {
    setLoading(true);
    return fetch(
      `/api/news/crawler/candidates?page=${p}&limit=${CANDIDATES_PER_PAGE}`
    )
      .then((r) => r.json())
      .then((d) => {
        setCandidates(d.candidates || []);
        setTotalCandidates(d.total ?? 0);
        setLastCrawledAt(d.lastCrawledAt || null);
        setApprovedIds(new Set((d.approvedIds as string[]) || []));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function loadFeeds() {
    fetch("/api/news/feeds")
      .then((r) => r.json())
      .then((d) => setSources(d.sources || []))
      .catch(() => {});
  }

  useEffect(() => {
    loadFeeds();
  }, []);

  useEffect(() => {
    loadCandidates(page);
  }, [page, loadCandidates]);

  async function approve(id: string) {
    setSaving(id);
    try {
      const res = await fetch("/api/news/crawler/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed");
      setApprovedIds((prev) => new Set([...prev, id]));
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(null);
    }
  }

  async function reject(id: string) {
    setSaving(id);
    try {
      const res = await fetch("/api/news/crawler/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed");
      setCandidates((prev) => prev.filter((c) => c.id !== id));
      setTotalCandidates((t) => Math.max(0, t - 1));
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(null);
    }
  }

  async function runCrawl() {
    setCrawlRunning(true);
    setCrawlLog(["Starting crawl…"]);
    try {
      const res = await fetch("/api/news/crawler/run", { method: "POST" });
      if (!res.ok || !res.body) {
        setCrawlLog((prev) => [...prev, "Request failed."]);
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6)) as { line?: string };
              if (data.line) setCrawlLog((prev) => [...prev, data.line!]);
            } catch {
              // ignore
            }
          }
        }
      }
      setCrawlLog((prev) => [...prev, "Crawl finished. Refreshing…"]);
      setPage(1);
      await new Promise((r) => setTimeout(r, 400));
      await loadCandidates(1);
      router.refresh();
    } catch (e) {
      setCrawlLog((prev) => [...prev, `Error: ${e instanceof Error ? e.message : "Unknown"}`]);
    } finally {
      setCrawlRunning(false);
    }
  }

  async function testSource(url: string, id: string) {
    setTestLoading(id);
    setTestResult(null);
    try {
      const res = await fetch(`/api/news/feeds/test?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      setTestResult({
        id,
        ok: data.ok === true,
        title: data.title ?? undefined,
        itemsCount: data.itemsCount ?? undefined,
        error: data.error,
      });
    } catch {
      setTestResult({ id, ok: false, error: "Request failed" });
    } finally {
      setTestLoading(null);
    }
  }

  async function addSource() {
    if (!newSource.id.trim() || !newSource.url.trim()) return;
    const url = newSource.url.trim();
    if (!url.startsWith("http")) return;
    setSavingSources(true);
    try {
      const next: FeedSource[] = [
        ...sources,
        { id: newSource.id.trim(), type: newSource.type, url, enabled: true },
      ];
      const res = await fetch("/api/news/feeds", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sources: next }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSources(next);
      setNewSource({ id: "", type: "rss", url: "" });
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setSavingSources(false);
    }
  }

  async function removeSource(sourceId: string) {
    setSavingSources(true);
    try {
      const next = sources.filter((s) => s.id !== sourceId);
      const res = await fetch("/api/news/feeds", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sources: next }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSources(next);
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setSavingSources(false);
    }
  }

  const totalPages = Math.max(1, Math.ceil(totalCandidates / CANDIDATES_PER_PAGE));

  return (
    <Tabs defaultValue="candidates">
      <TabsList>
        <TabsTrigger value="candidates">
          Candidates ({totalCandidates})
        </TabsTrigger>
        <TabsTrigger value="sources">Source channels</TabsTrigger>
      </TabsList>

      <TabsContent value="candidates" className="mt-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={runCrawl}
            disabled={crawlRunning || sources.length === 0}
            className="rounded bg-[#22c55e] px-3 py-1.5 text-sm font-medium text-black hover:bg-[#22c55e]/90 disabled:opacity-50"
          >
            {crawlRunning ? "Crawling…" : "Run crawl"}
          </button>
          {sources.length === 0 && (
            <span className="text-xs text-black/55 dark:text-white/55">
              Add source channels first.
            </span>
          )}
        </div>

        {crawlRunning && (
          <div className="rounded-xl border border-black/10 bg-black/5 p-4 dark:border-white/10 dark:bg-white/5">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-black dark:text-white">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#22c55e] border-t-transparent" />
              Loading feeds…
            </div>
            <div className="max-h-40 overflow-auto font-mono text-xs text-black/75 dark:text-white/75">
              {crawlLog.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-sm text-black/55 dark:text-white/55">Loading…</p>
        ) : candidates.length === 0 ? (
          <p className="text-sm text-black/70 dark:text-white/70">
            No candidates. Add source channels above, then click &quot;Run crawl&quot; to load
            articles.
          </p>
        ) : (
          <div className="rounded-xl border border-black/10 bg-white dark:border-white/10 dark:bg-[#151a21]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/10 px-4 py-2 dark:border-white/10">
              {lastCrawledAt && (
                <p className="text-xs text-black/55 dark:text-white/55">
                  Last crawl: {format(new Date(lastCrawledAt), "PPp")}
                </p>
              )}
              <div className="flex items-center gap-2">
                <span className="text-xs text-black/65 dark:text-white/65">
                  Page {page} of {totalPages} ({totalCandidates} total)
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded bg-black/10 px-2 py-1 text-xs disabled:opacity-50 dark:bg-white/10"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="rounded bg-black/10 px-2 py-1 text-xs disabled:opacity-50 dark:bg-white/10"
                >
                  Next
                </button>
              </div>
            </div>
            <div className="max-h-[70vh] overflow-auto">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 z-10 bg-white dark:bg-[#151a21]">
                  <tr className="border-b border-black/10 dark:border-white/10">
                    <th className="px-4 py-3 font-semibold">Preview</th>
                    <th className="px-4 py-3 font-semibold">Title</th>
                    <th className="px-4 py-3 font-semibold">Source</th>
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((c) => {
                    const isApproved = approvedIds.has(c.id);
                    const showImage = c.imageUrl && !imageErrors.has(c.id);
                    return (
                      <tr
                        key={c.id}
                        className="border-b border-black/5 dark:border-white/5 last:border-0"
                      >
                        <td className="w-20 px-4 py-2">
                          {showImage ? (
                            <img
                              src={c.imageUrl}
                              alt=""
                              className="h-12 w-16 rounded object-cover bg-black/5 dark:bg-white/5"
                              loading="lazy"
                              onError={() =>
                                setImageErrors((s) => new Set([...s, c.id]))
                              }
                            />
                          ) : (
                            <span className="inline-flex h-12 w-16 items-center justify-center rounded bg-black/5 text-black/30 dark:bg-white/5 dark:text-white/30">
                              —
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <div className="max-w-[280px]">
                            <div className="font-medium line-clamp-1">
                              {c.title}
                            </div>
                            <div className="line-clamp-2 text-xs text-black/60 dark:text-white/60">
                              {c.perex}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-black/75 dark:text-white/75">
                          {c.sourceId} ({c.sourceType})
                        </td>
                        <td className="px-4 py-2 text-black/75 dark:text-white/75">
                          {c.date
                            ? format(new Date(c.date), "MMM d, yyyy")
                            : "—"}
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex gap-2">
                            {isApproved ? (
                              <span className="rounded bg-black/10 px-2 py-1 text-xs font-medium text-black dark:bg-white/10 dark:text-white">
                                Already in feed
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => approve(c.id)}
                                disabled={saving === c.id}
                                className="rounded bg-[#22c55e] px-2 py-1 text-xs font-medium text-black hover:bg-[#22c55e]/90 disabled:opacity-50"
                              >
                                Add to feed
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => reject(c.id)}
                              disabled={saving === c.id}
                              className="rounded bg-black/10 px-2 py-1 text-xs text-black hover:bg-black/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </TabsContent>

      <TabsContent value="sources" className="mt-4">
        <div className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-[#151a21]">
          <p className="mb-3 text-sm text-black/70 dark:text-white/70">
            Add and manage source channels below. Saved to{" "}
            <code className="rounded bg-black/5 px-1 dark:bg-white/10">
              data/news/news-user.yaml
            </code>{" "}
            (feedSources). You can also edit{" "}
            <code className="rounded bg-black/5 px-1 dark:bg-white/10">
              data/news/feeds.yaml
            </code>{" "}
            for default sources.
          </p>

          <div className="mb-4 flex flex-wrap items-end gap-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-black/65 dark:text-white/65">
                ID (slug)
              </label>
              <input
                type="text"
                value={newSource.id}
                onChange={(e) =>
                  setNewSource((s) => ({ ...s, id: e.target.value }))
                }
                placeholder="e.g. eff-updates"
                className="w-40 rounded border border-black/20 bg-white px-2 py-1.5 text-sm dark:border-white/20 dark:bg-[#1f252d]"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-black/65 dark:text-white/65">
                Type
              </label>
              <select
                value={newSource.type}
                onChange={(e) =>
                  setNewSource((s) => ({
                    ...s,
                    type: e.target.value as FeedSource["type"],
                  }))
                }
                className="rounded border border-black/20 bg-white px-2 py-1.5 text-sm dark:border-white/20 dark:bg-[#1f252d]"
              >
                <option value="rss">RSS</option>
                <option value="url">URL</option>
              </select>
            </div>
            <div className="min-w-[200px] flex-1">
              <label className="mb-1 block text-xs font-medium text-black/65 dark:text-white/65">
                URL
              </label>
              <input
                type="url"
                value={newSource.url}
                onChange={(e) =>
                  setNewSource((s) => ({ ...s, url: e.target.value }))
                }
                placeholder="https://..."
                className="w-full rounded border border-black/20 bg-white px-2 py-1.5 text-sm dark:border-white/20 dark:bg-[#1f252d]"
              />
            </div>
            <button
              type="button"
              onClick={addSource}
              disabled={savingSources || !newSource.id.trim() || !newSource.url.trim()}
              className="rounded bg-[#22c55e] px-3 py-1.5 text-sm font-medium text-black hover:bg-[#22c55e]/90 disabled:opacity-50"
            >
              Add source
            </button>
          </div>

          <ul className="space-y-2 text-sm">
            {sources.map((s) => (
              <li
                key={s.id}
                className="flex flex-wrap items-center gap-2 rounded border border-black/5 bg-black/5 py-2 pl-3 pr-2 dark:border-white/5 dark:bg-white/5"
              >
                <code className="rounded bg-black/10 px-1.5 py-0.5 dark:bg-white/10">
                  {s.id}
                </code>
                <span className="text-black/60 dark:text-white/60">
                  ({s.type})
                </span>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate text-black hover:underline dark:text-white"
                >
                  {s.url}
                </a>
                <button
                  type="button"
                  onClick={() => testSource(s.url, s.id)}
                  disabled={testLoading === s.id}
                  className="rounded bg-black/10 px-2 py-1 text-xs text-black hover:bg-black/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15 disabled:opacity-50"
                >
                  {testLoading === s.id ? "Loading…" : "Test load"}
                </button>
                {testResult?.id === s.id && (
                  <span
                    className={
                      testResult.ok
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }
                  >
                    {testResult.ok
                      ? `OK — ${testResult.itemsCount ?? 0} items`
                      : testResult.error}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeSource(s.id)}
                  disabled={savingSources}
                  className="ml-auto rounded p-1 text-black/50 hover:bg-red-500/20 hover:text-red-600 dark:text-white/50 dark:hover:text-red-400 disabled:opacity-50"
                  title="Remove source"
                >
                  <span className="material-symbols-rounded text-[18px]">
                    close
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </TabsContent>
    </Tabs>
  );
}
