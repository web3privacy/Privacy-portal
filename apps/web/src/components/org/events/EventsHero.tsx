"use client";

import { useState, useCallback } from "react";

type Hero = {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  galleryImages?: string[];
  eyeImageUrl?: string;
  backgroundImage?: string;
};

const defaultGalleryImages = [
  "https://placekitten.com/220/140?image=1",
  "https://placekitten.com/220/140?image=2",
  "https://placekitten.com/220/140?image=3",
  "https://placekitten.com/220/140?image=4",
  "https://placekitten.com/220/140?image=5",
  "https://placekitten.com/220/140?image=6",
  "https://placekitten.com/220/140?image=7",
  "https://placekitten.com/220/140?image=8",
];

export function EventsHero({ hero }: { hero: Hero | null | undefined }) {
  const [slideIndex, setSlideIndex] = useState(0);

  if (!hero) return null;

  const {
    title,
    description,
    ctaLabel,
    ctaHref,
    galleryImages,
    eyeImageUrl,
    backgroundImage,
  } = hero;
  const images =
    Array.isArray(galleryImages) && galleryImages.length > 0 ? galleryImages : defaultGalleryImages;
  const totalSlides = images.length;
  const canPrev = totalSlides > 0 && slideIndex > 0;
  const canNext = totalSlides > 0 && slideIndex < totalSlides - 1;

  const goPrev = useCallback(() => setSlideIndex((i) => Math.max(0, i - 1)), []);
  const goNext = useCallback(
    () => setSlideIndex((i) => Math.min(totalSlides - 1, i + 1)),
    [totalSlides]
  );

  return (
    <section className="events-hero hero">
      <img
        className="hero-bg"
        src={backgroundImage || "/org/assets/hero-bg.png"}
        alt=""
      />
      <div className="hero-overlay" />
      {eyeImageUrl && (
        <div className="events-hero-eye" aria-hidden>
          <img src={eyeImageUrl} alt="" />
        </div>
      )}
      <div className="hero-content">
        <h1>{title}</h1>
        {description && <p className="events-hero-desc">{description}</p>}
        {ctaLabel && ctaHref && (
          <a href={ctaHref} className="primary-btn hero-cta">
            {ctaLabel}
          </a>
        )}
      </div>
      {images.length > 0 && (
        <div className="events-hero-gallery-wrap">
          <button
            type="button"
            className="events-hero-gallery-arrow events-hero-gallery-arrow-prev"
            aria-label="Previous images"
            onClick={goPrev}
            disabled={!canPrev}
          >
            <svg viewBox="0 0 24 24" aria-hidden>
              <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>
          <div className="events-hero-gallery">
            <div
              className="events-hero-gallery-track"
              style={{
                width: totalSlides > 0 ? `${(totalSlides / 4) * 100}%` : "100%",
                transform:
                  totalSlides > 0 ? `translateX(-${(slideIndex * 400) / totalSlides}%)` : "none",
              }}
            >
              {images.map((src, i) => (
                <div
                  key={i}
                  className="events-hero-gallery-item"
                  style={totalSlides > 0 ? { flex: `0 0 ${100 / totalSlides}%` } : undefined}
                >
                  <img src={src} alt="" loading={i < 4 ? "eager" : "lazy"} />
                </div>
              ))}
            </div>
          </div>
          <button
            type="button"
            className="events-hero-gallery-arrow events-hero-gallery-arrow-next"
            aria-label="Next images"
            onClick={goNext}
            disabled={!canNext}
          >
            <svg viewBox="0 0 24 24" aria-hidden>
              <path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}
