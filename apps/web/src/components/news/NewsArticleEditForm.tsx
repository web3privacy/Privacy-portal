"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Article } from "@/types/news";

type Props = {
  article: Article;
  /** When true, form creates a new article (POST) instead of updating (PUT). */
  isNew?: boolean;
};

function insertMarkdown(
  textarea: HTMLTextAreaElement,
  value: string,
  before: string,
  after: string,
  placeholder: string
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = value.slice(start, end);
  const left = value.slice(0, start);
  const right = value.slice(end);
  const insertText = selected || placeholder;
  const newText = left + before + insertText + after + right;
  const newCursor = start + before.length;
  return { newText, newCursor };
}

export function NewsArticleEditForm({ article, isNew }: Props) {
  const router = useRouter();
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [title, setTitle] = useState(article.title);
  const [perex, setPerex] = useState(article.perex);
  const [link, setLink] = useState(article.link);
  const [content, setContent] = useState(article.content ?? "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const applyMarkdown = useCallback(
    (before: string, after: string, placeholder: string = "text") => {
      const ta = contentRef.current;
      if (!ta) return;
      const { newText, newCursor } = insertMarkdown(
        ta,
        content,
        before,
        after,
        placeholder
      );
      setContent(newText);
      requestAnimationFrame(() => {
        ta.focus();
        ta.setSelectionRange(newCursor, newCursor);
      });
    },
    [content]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    setSubmitting(true);
    try {
      if (isNew) {
        const res = await fetch("/api/news/article", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            perex: perex.trim(),
            link: link.trim() || undefined,
            content: content.trim() || undefined,
          }),
        });
        const data = (await res.json()) as { ok?: boolean; id?: string; error?: string };
        if (!res.ok || !data.ok) {
          setError(data.error ?? "Failed to create article.");
          return;
        }
        router.refresh();
        router.push(data.id ? `/news/admin/edit/${data.id}` : "/news/admin");
      } else {
        const res = await fetch("/api/news/article", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: article.id,
            title: title.trim(),
            perex: perex.trim(),
            link: link.trim() || undefined,
            content: content.trim() || undefined,
          }),
        });
        const data = (await res.json()) as { ok?: boolean; error?: string };
        if (!res.ok || !data.ok) {
          setError(data.error ?? "Failed to update article.");
          return;
        }
        router.refresh();
        router.push("/news/admin");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <div>
        <label
          htmlFor="edit-title"
          className="mb-1 block text-xs font-bold uppercase tracking-wider text-black/70 dark:text-white/70"
        >
          Title
        </label>
        <input
          id="edit-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-[10px] border border-[#d6d6d6] bg-white px-4 py-2.5 text-sm text-black dark:border-[#3b4048] dark:bg-[#151a21] dark:text-[#f2f4f6]"
          disabled={submitting}
        />
      </div>

      <div>
        <label
          htmlFor="edit-perex"
          className="mb-1 block text-xs font-bold uppercase tracking-wider text-black/70 dark:text-white/70"
        >
          Perex
        </label>
        <textarea
          id="edit-perex"
          value={perex}
          onChange={(e) => setPerex(e.target.value)}
          rows={2}
          className="w-full rounded-[10px] border border-[#d6d6d6] bg-white px-4 py-2.5 text-sm text-black dark:border-[#3b4048] dark:bg-[#151a21] dark:text-[#f2f4f6]"
          disabled={submitting}
        />
      </div>

      <div>
        <label
          htmlFor="edit-link"
          className="mb-1 block text-xs font-bold uppercase tracking-wider text-black/70 dark:text-white/70"
        >
          Link
        </label>
        <input
          id="edit-link"
          type="text"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="/news/[id] or external URL"
          className="w-full rounded-[10px] border border-[#d6d6d6] bg-white px-4 py-2.5 text-sm text-black dark:border-[#3b4048] dark:bg-[#151a21] dark:text-[#f2f4f6]"
          disabled={submitting}
        />
      </div>

      <div>
        <label
          htmlFor="edit-content"
          className="mb-1 block text-xs font-bold uppercase tracking-wider text-black/70 dark:text-white/70"
        >
          Content (Markdown)
        </label>
        <div className="mb-1.5 flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => applyMarkdown("**", "**", "bold text")}
            disabled={submitting}
            className="rounded border border-black/20 bg-black/5 px-2 py-1 text-xs font-bold hover:bg-black/10 dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20 disabled:opacity-50"
            title="Bold"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => applyMarkdown("*", "*", "italic text")}
            disabled={submitting}
            className="rounded border border-black/20 bg-black/5 px-2 py-1 text-xs italic hover:bg-black/10 dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20 disabled:opacity-50"
            title="Italic"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => applyMarkdown("[", "](url)", "link text")}
            disabled={submitting}
            className="rounded border border-black/20 bg-black/5 px-2 py-1 text-xs hover:bg-black/10 dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20 disabled:opacity-50"
            title="Link"
          >
            Link
          </button>
          <button
            type="button"
            onClick={() => applyMarkdown("\n## ", "\n", "Heading")}
            disabled={submitting}
            className="rounded border border-black/20 bg-black/5 px-2 py-1 text-xs hover:bg-black/10 dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20 disabled:opacity-50"
            title="Heading 2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => applyMarkdown("\n### ", "\n", "Subheading")}
            disabled={submitting}
            className="rounded border border-black/20 bg-black/5 px-2 py-1 text-xs hover:bg-black/10 dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20 disabled:opacity-50"
            title="Heading 3"
          >
            H3
          </button>
          <button
            type="button"
            onClick={() => applyMarkdown("\n- ", "\n", "list item")}
            disabled={submitting}
            className="rounded border border-black/20 bg-black/5 px-2 py-1 text-xs hover:bg-black/10 dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20 disabled:opacity-50"
            title="Bullet list"
          >
            •
          </button>
          <button
            type="button"
            onClick={() => applyMarkdown("\n1. ", "\n", "item")}
            disabled={submitting}
            className="rounded border border-black/20 bg-black/5 px-2 py-1 text-xs hover:bg-black/10 dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20 disabled:opacity-50"
            title="Numbered list"
          >
            1.
          </button>
          <button
            type="button"
            onClick={() => applyMarkdown("\n> ", "\n", "quote")}
            disabled={submitting}
            className="rounded border border-black/20 bg-black/5 px-2 py-1 text-xs hover:bg-black/10 dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20 disabled:opacity-50"
            title="Quote"
          >
            “
          </button>
          <button
            type="button"
            onClick={() => applyMarkdown("`", "`", "code")}
            disabled={submitting}
            className="rounded border border-black/20 bg-black/5 px-2 py-1 font-mono text-xs hover:bg-black/10 dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20 disabled:opacity-50"
            title="Inline code"
          >
            &lt;/&gt;
          </button>
        </div>
        <textarea
          ref={contentRef}
          id="edit-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={16}
          className="w-full font-mono text-[13px] rounded-[10px] border border-[#d6d6d6] bg-white px-4 py-2.5 text-black dark:border-[#3b4048] dark:bg-[#151a21] dark:text-[#f2f4f6]"
          disabled={submitting}
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-[10px] bg-[#70ff88] px-4 py-2 text-sm font-medium text-black hover:bg-[#5eef70] disabled:opacity-50"
        >
          {submitting ? (isNew ? "Creating…" : "Saving…") : isNew ? "Create article" : "Save"}
        </button>
        <Link
          href="/news/admin"
          className="rounded-[10px] border border-black/20 px-4 py-2 text-sm font-medium hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/5"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
