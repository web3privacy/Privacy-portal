"use client";

import { useState, useRef, useLayoutEffect } from "react";
import Link from "next/link";
import { SocialIcon, PlayIcon } from "./SharedIcons";

type Content = Record<string, unknown>;

function SectionTitle({ title, subtitle }: { title?: string; subtitle?: string }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
  );
}

function Card({
  title,
  text,
  logo,
  linkText,
  linkHref,
}: {
  title: string;
  text: string;
  logo: string;
  linkText: string;
  linkHref: string;
}) {
  const isInternal = linkHref.startsWith("/");
  const inner = (
    <>
      <div className="w3-card-media">
        <img src={logo} alt={`${title} logo`} className="w3-card-logo" loading="lazy" />
      </div>
      <h4>
        <span className="w3-card-title-link">{title}</span>
      </h4>
      <p>{text}</p>
      <span className="w3-card-link">{linkText}</span>
    </>
  );
  return (
    <article className="w3-card">
      {isInternal ? (
        <Link href={linkHref} style={{ color: "inherit", textDecoration: "none" }}>
          {inner}
        </Link>
      ) : (
        <a href={linkHref} target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
          {inner}
        </a>
      )}
    </article>
  );
}

export default function OrgLandingContent({ content }: { content: Content }) {
  const [showAllTestimonials, setShowAllTestimonials] = useState(false);
  const heroBgRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let raf: number | null = null;
    function onScroll() {
      raf = requestAnimationFrame(() => {
        if (!heroBgRef.current) return;
        const y = window.scrollY * 0.24;
        heroBgRef.current.style.transform = `translate3d(0, ${y}px, 0)`;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf != null) cancelAnimationFrame(raf);
    };
  }, []);

  const site = (content.site ?? {}) as { title?: string; headerLogo?: string; ctaText?: string; ctaLink?: string };
  const hero = (content.hero ?? {}) as {
    title?: string;
    backgroundImage?: string;
    overlayImage?: string;
    social?: { label: string; icon?: string; href: string }[];
  };
  const partners = (content.partners ?? {}) as { marqueeImage?: string; logos?: { name: string; image: string }[] };
  const intro = (content.intro ?? {}) as {
    heading?: string;
    videoThumbnail?: string;
    videoTitle?: string;
    supporters?: Array<{ name: string; role: string; type?: string; statValue?: string; image?: string }>;
  };
  const impact = (content.impact ?? {}) as {
    title?: string;
    description?: string;
    sectionImage?: string;
    stats?: Array<{ label: string; value: string }>;
  };
  const activities = (content.activities ?? {}) as {
    categories?: Array<{
      title: string;
      titleImage?: string;
      cards: Array<{ title: string; text: string; logo: string; image?: string; linkText: string; linkHref: string }>;
    }>;
    ctaText?: string;
    ctaLink?: string;
  };
  const academy = (content.academy ?? {}) as {
    title?: string;
    backgroundImage?: string;
    cards?: Array<{ title: string; image: string; link?: string; videoId?: string }>;
    ctaText?: string;
    ctaLink?: string;
  };
  const ecosystem = (content.ecosystem ?? {}) as {
    snapshotMode?: boolean;
    title?: string;
    subtitle?: string;
    diagramImage?: string;
    topLabel?: string;
    middleLabel?: string;
    groups?: Array<{ title: string; items: string[] }>;
  };
  const testimonials = (content.testimonials ?? {}) as {
    title?: string;
    items?: Array<{ name: string; role: string; image: string; quote: string }>;
  };

  const marqueeLogos = partners.marqueeImage
    ? Array(4)
        .fill(null)
        .map(() => ({ name: "Partners", image: partners.marqueeImage! }))
    : partners.logos ?? [];

  return (
    <main className="landing-root" id="top">
      <section className="hero" id="manifesto">
        <div ref={heroBgRef} className="hero-bg-wrap" aria-hidden>
          {hero.backgroundImage && (
            <img className="hero-bg" src={hero.backgroundImage} alt="Web3Privacy event" />
          )}
        </div>
        <div
          className={hero.overlayImage ? "hero-overlay hero-overlay-img" : "hero-overlay"}
          style={hero.overlayImage ? { backgroundImage: `url(${hero.overlayImage})` } : undefined}
          aria-hidden
        />
        <div className="hero-content">
          <h1>{hero.title}</h1>
          <div className="social-row hero-social-icons-only">
            {(hero.social ?? []).map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="social-link"
                aria-label={social.label}
                title={social.label}
              >
                <span className="social-icon-wrap">
                  <SocialIcon icon={social.icon ?? social.label?.toLowerCase() ?? ""} />
                </span>
              </a>
            ))}
          </div>
          {site.ctaLink && site.ctaText && (
            <Link className="primary-btn hero-cta" href={site.ctaLink}>
              {site.ctaText}
            </Link>
          )}
        </div>
        <div className="hero-sponsor-marquee" aria-label="Sponsors">
          <div className="hero-sponsor-track">
            <div className="hero-sponsor-set" aria-hidden>
              {marqueeLogos.map((logo, i) => (
                <div key={`a-${i}`} className="sponsor-logo">
                  <img src={logo.image} alt="" />
                </div>
              ))}
            </div>
            <div className="hero-sponsor-set" aria-hidden>
              {marqueeLogos.map((logo, i) => (
                <div key={`b-${i}`} className="sponsor-logo">
                  <img src={logo.image} alt="" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="hero-marquee-line" aria-hidden />
      </section>

      <div className="page-content-wrap page-content-wrap--with-padding">
        <section className="intro" id="about">
          <SectionTitle title={intro.heading} />
          <div className="intro-main">
            <article className="video-card">
              {intro.videoThumbnail && (
                <img src={intro.videoThumbnail} alt={intro.videoTitle ?? ""} />
              )}
            </article>
            <div className="avatar-grid">
              {(intro.supporters ?? []).map((person) => (
                <article
                  key={person.name}
                  className={person.type === "stat" ? "avatar-item avatar-item-stat" : "avatar-item"}
                >
                  {person.type === "stat" ? (
                    <div className="avatar-stat-circle">{person.statValue}</div>
                  ) : (
                    person.image && <img src={person.image} alt={person.name} />
                  )}
                  <h5>{person.name}</h5>
                  <p>{person.role}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="impact" id="activities">
          <div
            className="impact-top-with-bg"
            style={
              impact.sectionImage
                ? { backgroundImage: `url(${impact.sectionImage})` }
                : undefined
            }
          >
            <div className="impact-top-overlay" aria-hidden />
            <div className="impact-inner impact-inner--top">
              <SectionTitle title={impact.title} subtitle={impact.description} />
              <div className="stat-row">
                {(impact.stats ?? []).map((stat) => (
                  <div key={stat.label} className="stat-item">
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="impact-inner">
            <div className="activities-grid" id="projects">
              {(activities.categories ?? []).map((category) => (
                <div key={category.title} className="activity-column">
                  {category.titleImage ? (
                    <img
                      className="activity-title-image"
                      src={category.titleImage}
                      alt={category.title}
                    />
                  ) : (
                    <h3>{category.title}</h3>
                  )}
                  <div className="activity-cards">
                    {category.cards.map((card) => (
                      <Card
                        key={card.title}
                        title={card.title}
                        text={card.text}
                        logo={card.logo}
                        linkText={card.linkText}
                        linkHref={card.linkHref}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {activities.ctaLink && activities.ctaText && (
              <div className="center-cta-wrap impact-cta">
                <Link className="outline-btn" href={activities.ctaLink}>
                  {activities.ctaText}
                </Link>
              </div>
            )}
          </div>
        </section>

        <section
          className="academy full-width-border-top"
          id="community"
          style={
            academy.backgroundImage
              ? {
                  backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.62), rgba(0, 0, 0, 0.84)), url('${academy.backgroundImage}')`,
                }
              : undefined
          }
        >
          <div className="academy-inner">
            <SectionTitle title={academy.title} />
            <div className="academy-grid">
              {(academy.cards ?? []).map((card, index) => (
                <a
                  key={`${card.title}-${index}`}
                  className="academy-card academy-video-card"
                  href={card.link ?? `https://www.youtube.com/watch?v=${card.videoId ?? ""}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={card.title}
                >
                  <img src={card.image} alt={card.title} loading="lazy" />
                  <span className="academy-play-wrap">
                    <span className="academy-play-icon">
                      <PlayIcon />
                    </span>
                  </span>
                </a>
              ))}
            </div>
            {academy.ctaLink && academy.ctaText && (
              <div className="center-cta-wrap">
                <a
                  className="outline-btn"
                  href={academy.ctaLink}
                  target={academy.ctaLink.startsWith("http") ? "_blank" : undefined}
                  rel={academy.ctaLink.startsWith("http") ? "noreferrer" : undefined}
                >
                  {academy.ctaText}
                </a>
              </div>
            )}
          </div>
        </section>

        <section className="ecosystem" id="ecosystem">
          {ecosystem.snapshotMode && ecosystem.diagramImage ? (
            <>
              <SectionTitle title={ecosystem.title} subtitle={ecosystem.subtitle} />
              <div className="ecosystem-full-shot">
                <img src={ecosystem.diagramImage} alt="Privacy ecosystem" />
              </div>
            </>
          ) : (
            <>
              <SectionTitle title={ecosystem.title} subtitle={ecosystem.subtitle} />
              {ecosystem.topLabel && ecosystem.middleLabel && (
                <div className="ecosystem-rail">
                  <span>{ecosystem.topLabel}</span>
                  <div className="ecosystem-beam" />
                  <span>{ecosystem.middleLabel}</span>
                </div>
              )}
              {ecosystem.diagramImage && (
                <div className="ecosystem-snapshot">
                  <img src={ecosystem.diagramImage} alt="Privacy ecosystem diagram" />
                </div>
              )}
              {(ecosystem.groups ?? []).length > 0 && (
                <div className="ecosystem-groups">
                  {(ecosystem.groups ?? []).map((group) => (
                    <article key={group.title} className="eco-card">
                      <h4>{group.title}</h4>
                      <div className="eco-items">
                        {group.items.map((item) => (
                          <span key={item}>{item}</span>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </section>

        <section className="testimonials" id="testimonials">
          <SectionTitle title={testimonials.title} />
          <div
            className={`testimonial-stack ${showAllTestimonials ? "is-expanded" : "is-collapsed"}`}
          >
            <div className="testimonial-grid">
              {(testimonials.items ?? []).map((item, index) => (
                <article
                  key={`${item.name}-${item.role}-${index}`}
                  className="testimonial-card"
                >
                  <header>
                    <img src={item.image} alt={item.name} />
                    <div>
                      <h5>{item.name}</h5>
                      <p>{item.role}</p>
                    </div>
                  </header>
                  <p>{item.quote}</p>
                </article>
              ))}
            </div>
            {!showAllTestimonials && <div className="testimonial-fade" aria-hidden />}
          </div>
          {!showAllTestimonials && (
            <div className="testimonials-cta">
              <button
                className="outline-btn testimonials-show-more"
                type="button"
                onClick={() => setShowAllTestimonials(true)}
              >
                READ ALL TESTIMONIALS
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
