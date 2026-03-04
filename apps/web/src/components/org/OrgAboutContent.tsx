"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { SocialIcon, PlayIcon } from "./SharedIcons";

type Content = Record<string, unknown>;

type AboutHero = { title?: string; backgroundImage?: string; social?: { label: string; icon?: string; href: string }[] };
type AboutMission = {
  title?: string;
  paragraphs?: string[];
  imageUrl?: string;
  videoUrl?: string;
  ctaLabel?: string;
  ctaHref?: string;
};
type AboutStory = {
  title?: string;
  subtitle?: string;
  body?: string;
  timeline?: Array<{ year?: string; quarter?: string; time?: string; title?: string; description?: string }>;
  ctaLabel?: string;
  ctaHref?: string;
  ctaMoreLabel?: string;
  ctaMoreHref?: string;
};
type AboutFounders = {
  title?: string;
  body?: string;
  images?: string[];
  ctaReadLabel?: string;
  ctaReadHref?: string;
  ctaJoinLabel?: string;
  ctaJoinHref?: string;
};
type AboutActivism = {
  title?: string;
  body?: string;
  quote?: string;
  quoteAuthor?: string;
  ctaButtons?: { label: string; href: string }[];
};
type AboutWorkItem = { title?: string; subtitle?: string; description?: string; image?: string; ctaLabel?: string; ctaHref?: string; bgVariant?: number };
type AboutGallery = { title?: string; images?: string[] };
type AboutTeam = { title?: string; subtitle?: string; members?: { name: string; role: string; image: string }[]; ctaLabel?: string; ctaHref?: string };
type AboutAmbassadors = { title?: string; members?: { name: string; role: string; image: string }[] };
type AboutPartners = { title?: string; logos?: string[] };
type AboutEvent = { title?: string; date?: string; location?: string; image?: string; ctaLabel?: string; ctaHref?: string };
type AboutFAQ = { title?: string; items?: { question: string; answer: string }[] };
type AboutCommunity = {
  title?: string;
  subtitle?: string;
  body?: string;
  logoUrl?: string;
  newsletterPlaceholder?: string;
  newsletterButtonText?: string;
  social?: { label: string; icon?: string; href: string }[];
};

function AboutHeroSection({ hero }: { hero?: AboutHero }) {
  if (!hero) return null;
  const social = hero.social ?? [];
  return (
    <section className="about-hero" id="about">
      {hero.backgroundImage && <img className="about-hero-bg" src={hero.backgroundImage} alt="" />}
      <div className="about-hero-overlay" aria-hidden />
      <div className="about-hero-content">
        <h1>{hero.title}</h1>
        {social.length > 0 && (
          <div className="social-row hero-social-icons-only about-hero-social">
            {social.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="social-link" aria-label={s.label} title={s.label}>
                <span className="social-icon-wrap">
                  <SocialIcon icon={s.icon ?? s.label?.toLowerCase() ?? ""} />
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function AboutMissionSection({ mission }: { mission?: AboutMission }) {
  if (!mission) return null;
  const videoId = mission.videoUrl?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)?.[1];
  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : mission.imageUrl;
  return (
    <section className="about-section about-mission-section" id="mission">
      <div className="about-mission">
        <div className="about-mission-text">
          <h2>{mission.title}</h2>
          {mission.paragraphs?.map((p, i) => <p key={i}>{p}</p>)}
          {mission.ctaLabel && (
            <a href={mission.ctaHref ?? "#"} className="about-mission-manifesto-btn outline-btn" target={mission.ctaHref?.startsWith("http") ? "_blank" : undefined} rel={mission.ctaHref?.startsWith("http") ? "noreferrer" : undefined}>
              {mission.ctaLabel}
            </a>
          )}
        </div>
        <div className="about-mission-media">
          {(thumbnailUrl || mission.videoUrl) && (
            <div className="about-mission-video-wrap">
              {mission.videoUrl ? (
                <a href={mission.videoUrl} target="_blank" rel="noreferrer" className="about-mission-video-link" aria-label="Play intro video">
                  <img src={thumbnailUrl ?? undefined} alt="" loading="lazy" onError={(e) => { const t = e.currentTarget; if (t.src?.includes("maxresdefault")) t.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`; }} />
                  <span className="about-mission-play" aria-hidden>
                    <PlayIcon />
                  </span>
                </a>
              ) : (
                <>
                  <img src={thumbnailUrl} alt="" loading="lazy" />
                  <span className="about-mission-play" aria-hidden>
                    <PlayIcon />
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const GRID_STEP_PX = 200;

function AboutStorySection({ story }: { story?: AboutStory }) {
  const timeline = story?.timeline ?? [];
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  const scroll = (dir: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.6), behavior: "smooth" });
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateScrollState, timeline.length]);

  if (!story) return null;
  const totalWidth = Math.max(
    timeline.length * GRID_STEP_PX,
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  const firstIndexByYear = new Map<string, number>();
  timeline.forEach((item, index) => {
    const y = item.year;
    if (y && !firstIndexByYear.has(y)) firstIndexByYear.set(y, index);
  });
  const yearLabels = Array.from(firstIndexByYear.entries()).map(([year, index]) => ({ year, index }));

  return (
    <section className="about-section about-story-section about-story-section--fullwidth" id="story">
      <div className="about-story-header">
        <h2 className="about-section-title">{story.title ?? "Our History"}</h2>
        {story.body && <p className="about-story-body">{story.body}</p>}
      </div>
      <div className="about-story-timeline-outer">
        <button
          type="button"
          className="about-story-scroll-btn about-story-scroll-btn--left"
          onClick={() => scroll(-1)}
          aria-label="Scroll left"
          disabled={!canScrollLeft}
          style={{ visibility: canScrollLeft ? "visible" : "hidden" }}
        />
        <div
          className="about-story-timeline-scroll"
          ref={scrollRef}
          onScroll={updateScrollState}
          style={{ ["--timeline-width" as string]: `${totalWidth}px` }}
        >
          <div className="about-story-timeline-track">
            {/* Grid spans full track so vertical lines cross the horizontal line */}
            <div className="about-story-timeline-grid" style={{ width: totalWidth }}>
              {Array.from({ length: Math.ceil(totalWidth / GRID_STEP_PX) + 1 }, (_, i) => (
                <div key={i} className="about-story-timeline-vline" style={{ left: i * GRID_STEP_PX }} />
              ))}
            </div>
            {/* Head: years + line in normal flow */}
            <div className="about-story-timeline-head">
              <div className="about-story-timeline-years" style={{ width: totalWidth }}>
                {yearLabels.map(({ year, index }) => (
                  <span
                    key={year}
                    className="about-story-timeline-year"
                    style={{ left: index * GRID_STEP_PX }}
                  >
                    {year}
                  </span>
                ))}
              </div>
              <div className="about-story-timeline-line" />
            </div>
            {/* Body: events; points sit exactly on the line (intersection) */}
            <div className="about-story-timeline-body">
              <div className="about-story-timeline-events" style={{ width: totalWidth }}>
                {timeline.map((item, i) => {
                  const left = i * GRID_STEP_PX;
                  const timeLabel = item.time ?? [item.quarter, item.year].filter(Boolean).join(" / ");
                  const isAlt = i % 2 === 1;
                  return (
                    <div
                      key={i}
                      className={`about-story-timeline-event ${isAlt ? "about-story-timeline-event--alt" : ""}`}
                      style={{ left }}
                    >
                      <span className="about-story-timeline-point" aria-hidden />
                      <div className="about-story-timeline-event-card">
                        <span className="about-story-timeline-time">{timeLabel}</span>
                        <span className="about-story-timeline-name">{item.title}</span>
                        <p className="about-story-timeline-desc">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <button
          type="button"
          className="about-story-scroll-btn about-story-scroll-btn--right"
          onClick={() => scroll(1)}
          aria-label="Scroll right"
          disabled={!canScrollRight}
          style={{ visibility: canScrollRight ? "visible" : "hidden" }}
        />
        <div className="about-story-timeline-fade" aria-hidden />
      </div>
    </section>
  );
}

function AboutFoundersSection({ founders }: { founders?: AboutFounders }) {
  if (!founders?.images?.length) return null;
  return (
    <section className="about-section" id="founders">
      <div className="about-founders">
        <div className="about-founders-text">
          <h2>{founders.title}</h2>
          <p>{founders.body}</p>
          <div className="about-founders-btns">
            {founders.ctaReadLabel && (
              <a href={founders.ctaReadHref ?? "#"} className="primary-btn" target="_blank" rel="noreferrer">
                {founders.ctaReadLabel}
              </a>
            )}
            {founders.ctaJoinLabel && (
              <a href={founders.ctaJoinHref ?? "#"} className="outline-btn" target="_blank" rel="noreferrer">
                {founders.ctaJoinLabel}
              </a>
            )}
          </div>
        </div>
        <div className="about-founders-media">
          <div className="about-founders-grid">
            {founders.images.slice(0, 4).map((src, i) => (
              <div key={i} className="about-founders-cell">
                <img src={src} alt="" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutActivismSection({ activism }: { activism?: AboutActivism }) {
  if (!activism) return null;
  return (
    <section className="about-section about-activism">
      <div className="about-activism-inner">
        <div className="about-activism-image">
          <img src="/org/assets/about-activism-collage.png" alt="" loading="lazy" />
        </div>
        <div className="about-activism-content">
          <h2>{activism.title}</h2>
          <p>{activism.body}</p>
          <div className="about-activism-btns">
            {(activism.ctaButtons ?? []).map((btn) => (
              <a key={btn.label} href={btn.href} className="outline-btn" target="_blank" rel="noreferrer">
                {btn.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutWorkSection({ work }: { work?: { title?: string; items?: AboutWorkItem[] } }) {
  if (!work?.items?.length) return null;
  return (
    <section className="about-section about-work-section" id="work">
      <div className="about-work-label">{work.title}</div>
      <div className="about-work-blocks">
        {work.items.map((item, i) => (
          <div key={i} className={`about-work-block about-work-block--${item.bgVariant ?? ((i % 3) + 1)}`}>
            <div className="about-work-block-image">
              {item.image && <img src={item.image} alt="" loading="lazy" />}
            </div>
            <div className="about-work-block-panel">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              {item.ctaLabel && (
                <a href={item.ctaHref ?? "#"} className="outline-btn about-work-block-cta" target="_blank" rel="noreferrer">
                  {item.ctaLabel}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AboutGallerySection({ gallery }: { gallery?: AboutGallery }) {
  const galleryRef = useRef<HTMLDivElement>(null);
  if (!gallery?.images?.length) return null;
  const scroll = (dir: number) => {
    if (!galleryRef.current) return;
    const step = galleryRef.current.clientWidth * 0.8;
    galleryRef.current.scrollBy({ left: dir * step, behavior: "smooth" });
  };
  return (
    <section className="about-section about-gallery-section">
      <h2 className="about-section-title about-gallery-title">{gallery.title}</h2>
      <div className="about-gallery-wrap">
        <button type="button" className="about-gallery-arrow about-gallery-arrow--left" onClick={() => scroll(-1)} aria-label="Previous" />
        <div className="about-gallery-scroll" ref={galleryRef}>
          <div className="about-gallery-grid">
            {gallery.images.map((src, i) => (
              <div key={i} className="about-gallery-item">
                <img src={src} alt="" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
        <button type="button" className="about-gallery-arrow about-gallery-arrow--right" onClick={() => scroll(1)} aria-label="Next" />
      </div>
    </section>
  );
}

function AboutTeamSection({ team }: { team?: AboutTeam }) {
  if (!team) return null;
  return (
    <section className="about-section" id="team">
      <div className="about-team-inner">
        <h2>{team.title}</h2>
        {team.subtitle && <p className="about-team-sub">{team.subtitle}</p>}
        <div className="about-team-grid about-team-grid--grayscale">
          {(team.members ?? []).map((m, i) => (
            <article key={i} className="about-team-member">
              <img src={m.image} alt={m.name} loading="lazy" />
              <h5>{m.name}</h5>
              <p>{m.role}</p>
            </article>
          ))}
        </div>
        {team.ctaLabel && (
          <a href={team.ctaHref ?? "#"} className="outline-btn" target="_blank" rel="noreferrer">
            {team.ctaLabel}
          </a>
        )}
      </div>
    </section>
  );
}

function AboutAmbassadorsSection({ ambassadors }: { ambassadors?: AboutAmbassadors }) {
  if (!ambassadors?.members?.length) return null;
  return (
    <section className="about-section">
      <h2 className="about-section-title">{ambassadors.title}</h2>
      <div className="about-ambassadors-grid about-team-grid--grayscale">
        {ambassadors.members.map((m, i) => (
          <article key={i} className="about-team-member">
            <img src={m.image} alt={m.name} loading="lazy" />
            <h5>{m.name}</h5>
            <p>{m.role}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function AboutPartnersSection({ partners }: { partners?: AboutPartners }) {
  if (!partners?.logos?.length) return null;
  return (
    <section className="about-section">
      <h2 className="about-section-title">{partners.title}</h2>
      <div className="about-partners-row">
        {partners.logos.map((logo, i) => (
          <div key={i} className="about-partners-logo">
            <img src={logo} alt="" loading="lazy" />
          </div>
        ))}
      </div>
    </section>
  );
}

function AboutEventsSection({ events }: { events?: AboutEvent[] }) {
  if (!events?.length) return null;
  return (
    <section className="about-section about-events">
      <h2 className="about-section-title">Our Events</h2>
      <div className="about-events-list">
        {events.map((ev, i) => (
          <article key={i} className="about-event-card">
            {ev.image && <img src={ev.image} alt="" loading="lazy" />}
            <div className="about-event-content">
              <h4>{ev.title}</h4>
              <p>{ev.date} · {ev.location}</p>
              {ev.ctaLabel && (
                <a href={ev.ctaHref ?? "#"} className="primary-btn" target="_blank" rel="noreferrer">
                  {ev.ctaLabel}
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function AboutFAQSection({ faq }: { faq?: AboutFAQ }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [expandAll, setExpandAll] = useState(false);
  if (!faq?.items?.length) return null;
  const isOpen = (i: number) => expandAll || openIndex === i;
  return (
    <section className="about-section">
      <div className="about-faq-head">
        <h2 className="about-section-title">{faq.title}</h2>
        <button type="button" className="about-faq-expand-all outline-btn" onClick={() => setExpandAll((v) => !v)}>
          {expandAll ? "Collapse all" : "Expand all"}
        </button>
      </div>
      <div className="about-faq">
        {faq.items.map((item, i) => (
          <div key={i} className={`about-faq-item ${isOpen(i) ? "is-open" : ""}`}>
            <button
              type="button"
              className="about-faq-question"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              aria-expanded={isOpen(i)}
            >
              {item.question}
              <span className="about-faq-icon" aria-hidden>+</span>
            </button>
            <div className="about-faq-answer">
              <p>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AboutCommunitySection({ community }: { community?: AboutCommunity }) {
  if (!community) return null;
  return (
    <section className="about-section about-community">
      <div className="about-community-inner about-community-layout">
        <div className="about-community-logo-wrap">
          {community.logoUrl && (
            <img src={community.logoUrl} alt="" className="about-community-logo" aria-hidden />
          )}
        </div>
        <div className="about-community-content">
          <h2>{community.title}</h2>
          {community.subtitle && <h3>{community.subtitle}</h3>}
          <p>{community.body}</p>
          <div className="about-community-newsletter">
            <input
              type="email"
              placeholder={community.newsletterPlaceholder ?? "Your email address"}
              className="about-community-email"
              aria-label="Email"
            />
            <button type="button" className="primary-btn about-community-subscribe">
              {community.newsletterButtonText ?? "Subscribe"}
            </button>
          </div>
          <div className="about-community-social">
            {(community.social ?? []).map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} title={s.label} className="about-social-link">
                <span className="social-icon-wrap">
                  <SocialIcon icon={s.icon ?? s.label?.toLowerCase() ?? ""} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function OrgAboutContent({ content }: { content: Content }) {
  const about = (content.about ?? {}) as {
    hero?: AboutHero;
    mission?: AboutMission;
    story?: AboutStory;
    founders?: AboutFounders;
    activism?: AboutActivism;
    work?: { title?: string; items?: AboutWorkItem[] };
    gallery?: AboutGallery;
    team?: AboutTeam;
    ambassadors?: AboutAmbassadors;
    partners?: AboutPartners;
    events?: AboutEvent[];
    faq?: AboutFAQ;
    community?: AboutCommunity;
  };

  return (
    <main className="landing-root about-page" id="top">
      <AboutHeroSection hero={about.hero} />
      <AboutMissionSection mission={about.mission} />
      <AboutStorySection story={about.story} />
      <div className="page-content-wrap page-content-wrap--with-padding">
        <AboutActivismSection activism={about.activism} />
        <AboutFoundersSection founders={about.founders} />
        <AboutWorkSection work={about.work} />
        <AboutGallerySection gallery={about.gallery} />
        <AboutTeamSection team={about.team} />
        <AboutAmbassadorsSection ambassadors={about.ambassadors} />
        <AboutPartnersSection partners={about.partners} />
        <AboutEventsSection events={about.events} />
        <AboutFAQSection faq={about.faq} />
        <AboutCommunitySection community={about.community} />
      </div>
    </main>
  );
}
