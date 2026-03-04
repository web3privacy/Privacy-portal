"use client";

type Featured = {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  videoThumbnailUrl?: string;
};

export function EventsFeaturedBlock({ featured }: { featured: Featured | null | undefined }) {
  if (!featured) return null;
  const { title, description, ctaLabel, ctaHref, videoThumbnailUrl } = featured;

  return (
    <section className="events-featured-block">
      <div className="events-featured-inner">
        <div className="events-featured-media">
          {videoThumbnailUrl && (
            <div className="events-featured-thumb">
              <img src={videoThumbnailUrl} alt="" loading="lazy" />
              <span className="events-featured-play" aria-hidden>
                <svg viewBox="0 0 24 24" aria-hidden>
                  <path fill="currentColor" d="M8 6.5v11l9-5.5-9-5.5z" />
                </svg>
              </span>
            </div>
          )}
        </div>
        <div className="events-featured-copy">
          <h3>{title}</h3>
          {description && <p>{description}</p>}
          {ctaLabel && ctaHref && (
            <a href={ctaHref} className="primary-btn" target="_blank" rel="noreferrer">
              {ctaLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
