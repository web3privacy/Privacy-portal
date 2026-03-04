"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type SidebarBlock = {
  label: string;
  link?: string;
  items?: { label: string; link: string }[];
};

const STORAGE_KEY = "org-docs-nav-open";

function getInitialOpenGroups(sidebar: SidebarBlock[] | null): Record<number, boolean> {
  const open: Record<number, boolean> = {};
  (sidebar ?? []).forEach((block, i) => {
    open[i] = block.label === "About us";
  });
  return open;
}

function loadStoredOpenGroups(): Record<number, boolean> | null {
  if (typeof window === "undefined") return null;
  try {
    const s = sessionStorage.getItem(STORAGE_KEY);
    if (!s) return null;
    const parsed = JSON.parse(s);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
  } catch {
    // ignore
  }
  return null;
}

function saveOpenGroups(openGroups: Record<number, boolean>) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(openGroups));
  } catch {
    // ignore
  }
}

function NavItem({
  item,
  basePath,
  currentSlug,
  isNested,
}: {
  item: { label: string; link: string };
  basePath: string;
  currentSlug: string;
  isNested: boolean;
}) {
  const href = item.link === "" ? basePath : `${basePath}/${item.link}`;
  const isActive =
    (item.link === "" && currentSlug === "") || (item.link !== "" && currentSlug === item.link);
  const className = isActive ? "docs-nav-link docs-nav-link-active" : "docs-nav-link";
  return (
    <li className={isNested ? "docs-nav-nested" : ""}>
      <Link href={href} className={className}>
        {item.label}
      </Link>
    </li>
  );
}

function NavBlock({
  block,
  basePath,
  currentSlug,
  isOpen,
  onToggle,
}: {
  block: SidebarBlock;
  basePath: string;
  currentSlug: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  if (block.link !== undefined) {
    return (
      <NavItem
        item={{ label: block.label, link: block.link }}
        basePath={basePath}
        currentSlug={currentSlug}
        isNested={false}
      />
    );
  }
  const hasItems = (block.items ?? []).length > 0;
  return (
    <li className={`docs-nav-group ${isOpen ? "is-open" : "is-closed"}`}>
      <button
        type="button"
        className="docs-nav-group-header"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`docs-nav-group-${block.label.replace(/\s+/g, "-")}`}
      >
        <span className="docs-nav-group-label">{block.label}</span>
        {hasItems && <span className="docs-nav-group-chevron" aria-hidden />}
      </button>
      {hasItems && (
        <ul
          id={`docs-nav-group-${block.label.replace(/\s+/g, "-")}`}
          className="docs-nav-list docs-nav-sublist"
        >
          {(block.items ?? []).map((item, i) => (
            <NavItem
              key={i}
              item={item}
              basePath={basePath}
              currentSlug={currentSlug}
              isNested
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function DocsNav({
  sidebar,
  basePath,
  currentSlug,
}: {
  sidebar: SidebarBlock[] | null;
  basePath: string;
  currentSlug: string;
}) {
  const [openGroups, setOpenGroups] = useState<Record<number, boolean>>(() => {
    const stored = loadStoredOpenGroups();
    if (stored) return stored;
    return getInitialOpenGroups(sidebar ?? null);
  });

  useEffect(() => {
    if (!sidebar?.length) return;
    const stored = loadStoredOpenGroups();
    if (stored && Object.keys(stored).length > 0) {
      setOpenGroups((prev) => (Object.keys(prev).length > 0 ? prev : stored));
    } else {
      setOpenGroups(getInitialOpenGroups(sidebar));
    }
  }, [sidebar]);

  useEffect(() => {
    if (Object.keys(openGroups).length > 0) saveOpenGroups(openGroups);
  }, [openGroups]);

  const toggle = (i: number) => {
    setOpenGroups((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  return (
    <nav className="docs-nav" aria-label="Documentation">
      <h2 className="docs-nav-title">Documentation</h2>
      <ul className="docs-nav-list">
        {(sidebar ?? []).map((block, i) => (
          <NavBlock
            key={i}
            block={block}
            basePath={basePath}
            currentSlug={currentSlug}
            isOpen={openGroups[i] === true}
            onToggle={() => (block.items ? toggle(i) : undefined)}
          />
        ))}
      </ul>
    </nav>
  );
}
