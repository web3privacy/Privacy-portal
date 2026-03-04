"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import type { Person } from "@/types/people";
import type { Project } from "@/types";
import { getAvatarSrc } from "@/lib/stacks-view";

type PersonDetailPageContentProps = {
  person: Person;
};

export function PersonDetailPageContent({ person }: PersonDetailPageContentProps) {
  const avatarSrc = getAvatarSrc(person.avatar || "default-avatar.png");
  const displayName = person.displayName || person.name;
  const [projects, setProjects] = useState<Record<string, Project>>({});

  // Load project data for person's projects
  useEffect(() => {
    if (!person.projects || person.projects.length === 0) return;

    const loadProjects = async () => {
      const projectData: Record<string, Project> = {};
      for (const projectRef of person.projects || []) {
        try {
          const res = await fetch(`/api/projects/${projectRef.projectId}`);
          if (res.ok) {
            const data = await res.json();
            if (data.project) {
              projectData[projectRef.projectId] = data.project;
            }
          }
        } catch (error) {
          console.error(`Error loading project ${projectRef.projectId}:`, error);
        }
      }
      setProjects(projectData);
    };

    loadProjects();
  }, [person.projects]);

  const getLinkIcon = (type: string) => {
    switch (type) {
      case "github":
        return "code";
      case "twitter":
        return "chat";
      case "web":
        return "language";
      default:
        return "link";
    }
  };

  return (
    <main className="min-h-screen bg-white text-[#121212] dark:bg-[#0f1318] dark:text-[#f2f4f6]">
      <div className="viewport-range-shell mx-auto w-full max-w-[1140px] px-4 py-10 md:px-6 lg:max-w-[75vw]">
        {/* Back link */}
        <Link
          href="/people"
          className="mb-6 inline-flex items-center gap-2 text-[14px] text-black/70 hover:text-black dark:text-[#a8b0bd] dark:hover:text-white"
        >
          <span className="material-symbols-rounded text-[18px]">arrow_back</span>
          Back to People
        </Link>

        {/* Profile Section */}
        <section className="mb-12 rounded-[12px] border border-[#e0e0e0] bg-white p-6 dark:border-[#303640] dark:bg-[#181d25] md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <div className="flex-shrink-0">
              <Image
                src={avatarSrc}
                alt={displayName}
                width={120}
                height={120}
                className="h-24 w-24 rounded-full object-cover md:h-32 md:w-32"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-[28px] font-bold text-black dark:text-[#f2f4f6] md:text-[32px]">
                {displayName}
              </h1>
              {person.title && (
                <p className="mt-2 text-[16px] text-black/70 dark:text-[#a8b0bd]">
                  {person.title}
                </p>
              )}
              {person.tags && person.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {person.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-[100px] bg-[#d9d9d9] px-3 py-1 text-[12px] leading-5 text-black dark:bg-[#2a3039] dark:text-[#f2f4f6]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {person.description && (
                <p className="mt-4 text-[15px] leading-relaxed text-black/80 dark:text-[#a8b0bd]">
                  {person.description}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Links Section */}
        {person.links && person.links.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 text-[24px] font-bold text-black dark:text-[#f2f4f6] md:text-[32px]">
              Links
            </h2>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {person.links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-[12px] border border-[#e0e0e0] bg-white p-4 transition-all hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.14)] dark:border-[#303640] dark:bg-[#181d25] dark:hover:shadow-[0_14px_30px_rgba(0,0,0,0.55)]"
                >
                  <span className="material-symbols-rounded text-[24px] text-black/70 dark:text-[#a8b0bd]">
                    {getLinkIcon(link.type)}
                  </span>
                  <span className="text-[14px] font-medium text-black dark:text-[#f2f4f6]">
                    {link.label || link.url}
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {person.projects && person.projects.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 text-[24px] font-bold text-black dark:text-[#f2f4f6] md:text-[32px]">
              Projects
            </h2>
            <div className="space-y-4">
              {person.projects.map((projectRef, index) => {
                const project = projects[projectRef.projectId];
                const logoSrc = project?.logos?.[0]?.url || project?.logos?.[0]?.file 
                  ? `/project-assets/projects/${projectRef.projectId}/${project?.logos?.[0]?.file || ''}`
                  : null;

                return (
                  <Link
                    key={index}
                    href={`/project/${projectRef.projectId}`}
                    className="flex items-start gap-4 rounded-[12px] border border-[#e0e0e0] bg-white p-4 transition-all hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.14)] dark:border-[#303640] dark:bg-[#181d25] dark:hover:shadow-[0_14px_30px_rgba(0,0,0,0.55)]"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-black dark:bg-white overflow-hidden">
                      {logoSrc ? (
                        <Image
                          src={logoSrc}
                          alt={project?.name || projectRef.projectId}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-[12px] font-bold text-white dark:text-black">
                          {project?.name?.substring(0, 2).toUpperCase() || projectRef.projectId.substring(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 items-center justify-between">
                      <div>
                        <h3 className="text-[16px] font-bold text-black dark:text-[#f2f4f6]">
                          {project?.name || projectRef.projectId}
                        </h3>
                        {project?.description && (
                          <p className="mt-1 line-clamp-2 text-[14px] text-black/70 dark:text-[#a8b0bd]">
                            {project.description}
                          </p>
                        )}
                        {project?.categories && project.categories.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {project.categories.slice(0, 3).map((cat) => (
                              <span
                                key={cat}
                                className="rounded-[100px] bg-[#d9d9d9] px-2 py-0.5 text-[11px] text-black dark:bg-[#2a3039] dark:text-[#f2f4f6]"
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {project?.links?.github && (
                          <a
                            href={project.links.github}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-black/50 hover:text-black dark:text-[#9ea7b5] dark:hover:text-white"
                          >
                            <span className="material-symbols-rounded text-[20px]">code</span>
                          </a>
                        )}
                        {project?.links?.twitter && (
                          <a
                            href={project.links.twitter}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-black/50 hover:text-black dark:text-[#9ea7b5] dark:hover:text-white"
                          >
                            <span className="material-symbols-rounded text-[20px]">chat</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Stacks Section */}
        {person.stacks && person.stacks.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 text-[24px] font-bold text-black dark:text-[#f2f4f6] md:text-[32px]">
              Stacks
            </h2>
            {person.stacks.map((stackRef, index) => (
              <Link
                key={index}
                href={`/stacks/${stackRef.stackId}`}
                className="block mb-4 rounded-[12px] border border-[#e0e0e0] bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.14)] dark:border-[#303640] dark:bg-[#181d25] dark:hover:shadow-[0_14px_30px_rgba(0,0,0,0.55)]"
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="mb-2 text-[14px] text-black/70 dark:text-[#a8b0bd]">
                      Categories
                    </p>
                    <ul className="space-y-2 text-[14px] text-black dark:text-[#f2f4f6]">
                      <li>Operating system</li>
                      <li>Office</li>
                      <li>Public Wallet</li>
                      <li>Messenger</li>
                      <li>Drawings</li>
                      <li>Self-Hosted LLMs</li>
                      <li>Self-hostable LLMs</li>
                      <li>Slides</li>
                      <li>Private Wallet</li>
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 text-[14px] text-black/70 dark:text-[#a8b0bd]">
                      Tools
                    </p>
                    <ul className="space-y-2 text-[14px] text-black dark:text-[#f2f4f6]">
                      <li>Graphene OS</li>
                      <li>ddocs</li>
                      <li>Rabby</li>
                      <li>Signal</li>
                      <li>drawio</li>
                      <li>ollama</li>
                      <li>Hugging Face</li>
                      <li>Github.com/vbuterin/slides</li>
                      <li>Railway</li>
                    </ul>
                  </div>
                </div>
              </Link>
            ))}
          </section>
        )}

        {/* Recommended Books Section */}
        {person.books && person.books.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 text-[24px] font-bold text-black dark:text-[#f2f4f6] md:text-[32px]">
              Recommended Books
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {person.books.map((book, index) => (
                <div
                  key={index}
                  className="rounded-[12px] border border-[#e0e0e0] bg-white overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.14)] dark:border-[#303640] dark:bg-[#181d25] dark:hover:shadow-[0_14px_30px_rgba(0,0,0,0.55)]"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-[#f5f5f5] dark:bg-[#252b35]">
                    {book.imageUrl ? (
                      <img
                        src={book.imageUrl}
                        alt={book.title || "Book cover"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="material-symbols-rounded text-[48px] text-[#ccc] dark:text-[#4a5568]">
                          menu_book
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-[16px] font-bold text-black dark:text-[#f2f4f6]">
                      {book.title}
                    </h3>
                    {book.author && (
                      <p className="mt-1 text-[14px] text-black/70 dark:text-[#a8b0bd]">
                        by {book.author}
                      </p>
                    )}
                    {book.recommendedBy && (
                      <p className="mt-2 text-[12px] text-black/50 dark:text-[#9ea7b5]">
                        Recommended by {book.recommendedBy}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Articles Section */}
        {person.articles && person.articles.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 text-[24px] font-bold text-black dark:text-[#f2f4f6] md:text-[32px]">
              Articles
            </h2>
            <div className="space-y-4">
              {person.articles.map((article, index) => {
                const formatDate = (dateString?: string): string => {
                  if (!dateString) return "";
                  const date = new Date(dateString);
                  return date.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }) + " - " + date.toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                };

                return (
                  <article
                    key={index}
                    className="flex gap-4 rounded-[12px] border border-[#e0e0e0] bg-white transition-all hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.14)] dark:border-[#303640] dark:bg-[#181d25] dark:hover:shadow-[0_14px_30px_rgba(0,0,0,0.55)]"
                  >
                    {article.thumbnailUrl && (
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[8px] md:h-32 md:w-32">
                        <img
                          src={article.thumbnailUrl}
                          alt={article.title || "Article"}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex min-w-0 flex-1 flex-col p-4 md:p-6">
                      <h3 className="mb-2 text-[16px] font-bold leading-5 text-black dark:text-[#f2f4f6] md:text-[18px]">
                        {article.url ? (
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:underline"
                          >
                            {article.title}
                          </a>
                        ) : (
                          article.title
                        )}
                      </h3>
                      {article.publishedAt && (
                        <p className="mt-auto text-[11px] text-black/50 dark:text-[#9ea7b5] md:text-[12px]">
                          {formatDate(article.publishedAt)}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* Events Section */}
        {person.events && person.events.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 text-[24px] font-bold text-black dark:text-[#f2f4f6] md:text-[32px]">
              Events
            </h2>
            <div className="space-y-4">
              {person.events.map((event, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 rounded-[12px] border border-[#e0e0e0] bg-white p-4 transition-all hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.14)] dark:border-[#303640] dark:bg-[#181d25] dark:hover:shadow-[0_14px_30px_rgba(0,0,0,0.55)]"
                >
                  {event.thumbnailUrl && (
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[8px]">
                      <img
                        src={event.thumbnailUrl}
                        alt={event.title || "Event"}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-[16px] font-bold text-black dark:text-[#f2f4f6]">
                      {event.title}
                    </h3>
                    {event.location && (
                      <p className="mt-1 text-[14px] text-black/70 dark:text-[#a8b0bd]">
                        {event.location}
                      </p>
                    )}
                  </div>
                  {event.url && (
                    <a
                      href={event.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-[8px] border border-black bg-white px-4 py-2 text-[13px] font-bold uppercase tracking-[0.08em] text-black transition-all hover:bg-black hover:text-white dark:border-[#e0e0e0] dark:bg-[#181d25] dark:text-[#f2f4f6] dark:hover:bg-[#e0e0e0] dark:hover:text-[#0f1318]"
                    >
                      MORE INFO →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Media Section */}
        {person.media && person.media.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 text-[24px] font-bold text-black dark:text-[#f2f4f6] md:text-[32px]">
              Media
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {person.media.map((media, index) => (
                <a
                  key={index}
                  href={media.url || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="group rounded-[12px] border border-[#e0e0e0] bg-white overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.14)] dark:border-[#303640] dark:bg-[#181d25] dark:hover:shadow-[0_14px_30px_rgba(0,0,0,0.55)]"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-[#f5f5f5] dark:bg-[#252b35]">
                    {media.thumbnailUrl ? (
                      <img
                        src={media.thumbnailUrl}
                        alt={media.title || "Media"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="material-symbols-rounded text-[48px] text-[#ccc] dark:text-[#4a5568]">
                          play_circle
                        </span>
                      </div>
                    )}
                    <div className="absolute left-2 top-2 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5">
                      <span className="text-[10px] font-bold text-white">web3privacy</span>
                      <span className="text-[10px] font-bold text-[#70FF88]">Academy</span>
                    </div>
                    {media.duration && (
                      <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                        {media.duration}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    {media.speaker && (
                      <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-black/70 dark:text-[#a8b0bd]">
                        {media.speaker}
                      </p>
                    )}
                    {media.speakerTitle && (
                      <p className="mt-1 text-[12px] text-black/60 dark:text-[#9ea7b5]">
                        {media.speakerTitle}
                      </p>
                    )}
                    <h3 className="mt-2 text-[14px] font-bold leading-tight text-black dark:text-[#f2f4f6]">
                      {media.title}
                    </h3>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Glossary Section */}
        {person.glossaryTerms && person.glossaryTerms.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 text-[24px] font-bold text-black dark:text-[#f2f4f6] md:text-[32px]">
              Glossary
            </h2>
            <div className="space-y-4">
              {person.glossaryTerms.map((term, index) => (
                <div
                  key={index}
                  className="rounded-[12px] border border-[#e0e0e0] bg-white p-6 dark:border-[#303640] dark:bg-[#181d25]"
                >
                  <h3 className="text-[18px] font-bold text-black dark:text-[#f2f4f6]">
                    {term.term}
                  </h3>
                  {term.definition && (
                    <p className="mt-2 text-[15px] leading-relaxed text-black/80 dark:text-[#a8b0bd]">
                      {term.definition}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
