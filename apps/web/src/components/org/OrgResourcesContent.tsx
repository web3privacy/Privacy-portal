"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Content = Record<string, unknown>;

type ResourceAsset = { id?: string; name?: string; thumbnailUrl?: string; downloadUrl?: string; description?: string; date?: string; meta?: string };
type ResourceCategory = { id?: string; name?: string; order?: number; assets?: ResourceAsset[] };
type ResourcesConfig = {
  hero?: { title?: string; description?: string; viewAllHref?: string; shareStoryHref?: string; backgroundImageUrl?: string };
  expandAllLabel?: string;
  filter?: { defaultLabel?: string; browseLabel?: string; browseHref?: string; forgotLabel?: string };
  categoriesSummary?: { id?: string; name?: string }[];
  categories?: ResourceCategory[];
};

function ResourceCard({ asset, categoryName }: { asset: ResourceAsset; categoryName?: string }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const name = asset?.name ?? "";
  const thumbnailUrl = asset?.thumbnailUrl ?? "";
  const downloadUrl = asset?.downloadUrl ?? "";
  const meta = asset?.date ?? asset?.meta ?? categoryName ?? "";
  const showThumb = thumbnailUrl && !imgError;
  const showPlaceholder = !showThumb || !imgLoaded;
  const DOWNLOAD_ICON = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
  return (
    <article className="resource-card">
      <div className="resource-card-media">
        {showThumb && (
          <img
            src={thumbnailUrl}
            alt=""
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            className={`resource-card-thumb ${imgLoaded ? "is-loaded" : ""}`}
          />
        )}
        {showPlaceholder && (
          <div className="resource-card-placeholder" aria-hidden>
            <span className="resource-card-placeholder-icon">◇</span>
          </div>
        )}
      </div>
      <div className="resource-card-body">
        <h3 className="resource-card-title">{name || "Untitled"}</h3>
        {meta ? <p className="resource-card-meta">{meta}</p> : null}
        {downloadUrl ? (
          <a href={downloadUrl} target="_blank" rel="noreferrer noopener" className="resource-card-download">
            {DOWNLOAD_ICON}
            <span>Download</span>
          </a>
        ) : (
          <span className="resource-card-download resource-card-download-disabled" aria-disabled="true">
            {DOWNLOAD_ICON}
            <span>Download</span>
          </span>
        )}
      </div>
    </article>
  );
}

const CHEVRON_DOWN = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const ICONS: Record<string, React.ReactNode> = {
  docs: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  whitepaper: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <line x1="8" y1="7" x2="16" y2="7" />
      <line x1="8" y1="11" x2="16" y2="11" />
      <line x1="8" y1="15" x2="12" y2="15" />
    </svg>
  ),
  security: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  identity: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  algorithms: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
    </svg>
  ),
  hardware: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <line x1="6" y1="10" x2="6.01" y2="10" />
      <line x1="10" y1="10" x2="10.01" y2="10" />
      <line x1="14" y1="10" x2="14.01" y2="10" />
      <line x1="18" y1="10" x2="18.01" y2="10" />
    </svg>
  ),
};

function getIcon(id?: string) {
  return (id && ICONS[id]) ?? ICONS.docs;
}

export default function OrgResourcesContent({ content }: { content: Content }) {
  const resourcesConfig = (content?.resources ?? {}) as ResourcesConfig;
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const categories = useMemo(
    () => [...(resourcesConfig.categories ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [resourcesConfig.categories]
  );

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 200);
    return () => clearTimeout(t);
  }, []);

  const expandAll = useMemo(() => {
    const ids: Record<string, boolean> = {};
    categories.forEach((c) => {
      if (c.id) ids[c.id] = true;
    });
    return ids;
  }, [categories]);

  const allExpanded = categories.length > 0 && categories.every((c) => (c.id != null && expanded[c.id]));

  const onExpandAll = useCallback(() => {
    setExpanded((prev) => (allExpanded ? {} : expandAll));
  }, [allExpanded, expandAll]);

  const toggleCategory = useCallback((categoryId: string) => {
    setExpanded((prev) => ({ ...prev, [categoryId]: !prev[categoryId] }));
  }, []);

  const hero = resourcesConfig.hero ?? {};
  const title = hero.title ?? "Community Resources";
  const description = hero.description ?? "";
  const viewAllHref = hero.viewAllHref ?? "";
  const shareStoryHref = hero.shareStoryHref ?? "";
  const backgroundImageUrl = hero.backgroundImageUrl ?? "";
  const filter = resourcesConfig.filter ?? {};
  const defaultLabel = filter.defaultLabel ?? "WEB3";
  const browseLabel = filter.browseLabel ?? "BROWSE";
  const browseHref = filter.browseHref ?? "#categories";
  const summaryItems = resourcesConfig.categoriesSummary ?? [];
  const list = summaryItems.length > 0 ? summaryItems.slice(0, 6) : [];
  const expandAllLabel = allExpanded ? "Collapse All" : (resourcesConfig.expandAllLabel ?? "Expand All");

  return (
    <main className="landing-root resources-page">
      <div className="page-content-wrap page-content-wrap--with-padding">
        <section className="resources-hero">
          {backgroundImageUrl ? (
            <div className="resources-hero-bg" style={{ backgroundImage: `url(${backgroundImageUrl})` }} aria-hidden />
          ) : (
            <div className="resources-hero-bg resources-hero-bg--default" aria-hidden />
          )}
          <div className="resources-hero-inner">
            <h1 className="resources-hero-title">{title}</h1>
            {description ? <p className="resources-hero-description">{description}</p> : null}
            <div className="resources-hero-actions">
              {viewAllHref && (
                <Link href={viewAllHref} className="resources-hero-cta resources-hero-cta--view">
                  VIEW ALL
                </Link>
              )}
              {shareStoryHref && (
                <Link href={shareStoryHref} className="resources-hero-cta resources-hero-cta--share">
                  SHARE YOUR STORY
                </Link>
              )}
              <button type="button" className="resources-expand-all" onClick={onExpandAll} aria-label={expandAllLabel}>
                {expandAllLabel}
              </button>
            </div>
          </div>
        </section>

        <div className="resources-filter">
          <div className="resources-filter-separator" aria-hidden />
          <div className="resources-filter-bar">
            <span className="resources-filter-pill">
              <span className="resources-filter-pill-label">{defaultLabel}</span>
            </span>
            <a href={browseHref} className="resources-filter-browse">
              <span className="resources-filter-browse-label">{browseLabel}</span>
            </a>
          </div>
        </div>

        <div className="resources-content-wrap">
          {loading ? (
            <div className="resources-loading" aria-busy>
              <div className="resources-skeleton-hero" />
              <div className="resources-skeleton-categories">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="resources-skeleton-category" />
                ))}
              </div>
            </div>
          ) : (
            <>
              {list.length > 0 && (
                <section className="resources-categories-grid-section" id="categories">
                  <h2 className="resources-section-title">CATEGORIES</h2>
                  <div className="resources-categories-grid">
                    {list.map((item) => (
                      <div key={item.id ?? item.name} className="resources-category-tile">
                        <span className="resources-category-tile-icon">{getIcon(item.id)}</span>
                        <span className="resources-category-tile-label">{item.name ?? ""}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              <section className="resources-categories">
                <div className="resources-categories-toolbar">
                  <button type="button" className="resources-expand-all-btn primary-btn" onClick={onExpandAll} aria-expanded={allExpanded}>
                    {expandAllLabel}
                  </button>
                </div>
                <div className="resources-accordion">
                  {categories.map((category) => {
                    const isOpen = expanded[category.id ?? ""];
                    const assets = category.assets ?? [];
                    return (
                      <div key={category.id ?? category.name} className={`resources-accordion-item ${isOpen ? "is-open" : ""}`}>
                        <button
                          type="button"
                          className="resources-accordion-trigger"
                          onClick={() => toggleCategory(category.id ?? "")}
                          aria-expanded={isOpen}
                          aria-controls={`resources-category-${category.id}`}
                          id={`resources-trigger-${category.id}`}
                        >
                          <span className="resources-accordion-title">{category.name}</span>
                          <span className="resources-accordion-icon">{CHEVRON_DOWN}</span>
                        </button>
                        <div
                          id={`resources-category-${category.id}`}
                          role="region"
                          aria-labelledby={`resources-trigger-${category.id}`}
                          className="resources-accordion-panel"
                          hidden={!isOpen}
                        >
                          <div className="resources-asset-grid">
                            {assets.map((asset) => (
                              <ResourceCard key={asset.id ?? asset.name} asset={asset} categoryName={category.name} />
                            ))}
                            {assets.length === 0 && isOpen ? <p className="resources-empty-category">No assets in this category yet.</p> : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
