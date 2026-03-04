import { ProjectOpenness } from "@/components/projects/detail/openness/ProjectOpenness";
import { ProjectAudits } from "@/components/projects/detail/ProjectAudits";
import { ProjectPrivacy } from "@/components/projects/detail/ProjectPrivacy";
import { ProjectSecurity } from "@/components/projects/detail/ProjectSecurity";
import { ProjectTechnology } from "@/components/projects/detail/ProjectTechnology";
import { ProjectRating } from "@/components/projects/detail/ProjectRating";
import { ProjectCommunityReviews } from "@/components/projects/detail/ProjectCommunityReviews";
import { ProjectMedia } from "@/components/projects/detail/ProjectMedia";
import { ProjectArticles } from "@/components/projects/detail/ProjectArticles";
import { ProjectTokenInfo } from "@/components/projects/detail/ProjectTokenInfo";
import { getEcosystems } from "@/queries/ecosystems.queries";
import { getProject } from "@/queries/projects.queries";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { existsSync } from "node:fs";
import path from "node:path";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const paramsData = await params;
  const id = paramsData.id;

  try {
    const project = await getProject(id);
    return {
      title: `${project.name} - Web3Privacy Explorer`,
      description:
        project.description ||
        `Learn more about ${project.name} on Web3Privacy Explorer`,
    };
  } catch {
    return {
      title: "Project Not Found - Web3Privacy Explorer",
    };
  }
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const paramsData = await params;
  const id = paramsData.id;

  const [project, ecosystems] = await Promise.all([
    getProject(id).catch(() => notFound()),
    getEcosystems(),
  ]);

  const logoFile = project.logos?.[0]?.file;
  const publicLogoPath = logoFile
    ? path.join(
        process.cwd(),
        "apps",
        "explorer",
        "public",
        "project-assets",
        "projects",
        project.id,
        logoFile
      )
    : null;
  const logoSrc =
    logoFile && publicLogoPath && existsSync(publicLogoPath)
      ? `/project-assets/projects/${encodeURIComponent(project.id)}/${encodeURIComponent(logoFile)}`
      : project.logos?.[0]?.url;

  return (
    <main className="viewport-range-shell mx-auto w-full max-w-[1280px] px-4 py-10 md:px-6">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/#projects-section"
          className="inline-flex items-center gap-2 rounded-[10px] px-2 py-1 text-black/70 transition-colors hover:bg-black/5 hover:text-black dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <Icon name="arrow_back" size={20} />
          <span className="text-[12px] font-bold uppercase tracking-[0.08em]">
            Back to list
          </span>
        </Link>

        <Link
          href={`/project/${encodeURIComponent(project.id)}/edit`}
          className="inline-flex items-center rounded-full bg-accent px-4 py-2 text-[12px] font-bold uppercase tracking-[0.08em] text-accent-foreground hover:bg-accent/90"
        >
          Edit project
        </Link>
      </div>

      <div className="mt-6 rounded-[18px] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-[#151a21]">
        <div className="grid gap-6 md:grid-cols-[1fr_260px] md:items-start">
          <div className="flex items-start gap-5">
            <div className="flex h-[92px] w-[92px] items-center justify-center overflow-hidden rounded-full border border-black/10 bg-white dark:border-white/10 dark:bg-[#0f1318]">
              {logoSrc ? (
                <Image
                  src={logoSrc}
                  alt={project.name}
                  width={92}
                  height={92}
                  className="h-full w-full object-contain"
                  unoptimized
                />
              ) : (
                <span className="font-serif text-[28px] text-black/70 dark:text-white/70">
                  {project.name?.[0]?.toUpperCase() ?? "?"}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <h1 className="font-serif text-[26px] leading-[1.05] text-black md:text-[34px] dark:text-[#f2f4f6]">
                {project.name}
              </h1>
              {project.description ? (
                <p className="mt-2 max-w-[70ch] text-[13px] leading-relaxed text-black/65 dark:text-white/65">
                  {project.description}
                </p>
              ) : null}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {(project.categories ?? []).slice(0, 4).map((c) => (
                  <Badge
                    key={c}
                    variant="secondary"
                    className="rounded-full bg-black/5 text-black/70 dark:bg-white/10 dark:text-white/70"
                  >
                    {c}
                  </Badge>
                ))}
                {(project.usecases ?? []).slice(0, 4).map((u) => (
                  <Badge
                    key={u}
                    variant="outline"
                    className="rounded-full border-black/15 text-black/60 dark:border-white/15 dark:text-white/60"
                  >
                    {u}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[16px] border border-black/10 bg-black/[0.02] p-5 dark:border-white/10 dark:bg-white/[0.04]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[12px] font-bold uppercase tracking-[0.08em] text-black/55 dark:text-white/55">
                  Web3Privacy scoring
                </div>
                <div className="mt-1 text-[12px] text-black/45 dark:text-white/45">
                  Hover for details
                </div>
              </div>
              <ProjectRating project={project} size={110} />
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-[#d8d8d8] pt-5 dark:border-[#2c3139]">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <div className="text-[12px] font-bold uppercase tracking-[0.08em] text-black/55 dark:text-white/55">
                Ecosystem
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {(project.ecosystem ?? []).slice(0, 6).map((eco) => {
                  const found = ecosystems.find((e) => e.id === eco);
                  return (
                    <span
                      key={eco}
                      className="inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-2 text-[12px] font-semibold text-black/70 dark:bg-white/10 dark:text-white/70"
                    >
                      {found?.icon ? (
                        <Image
                          src={found.icon}
                          alt={found.name ?? eco}
                          width={16}
                          height={16}
                          className="h-4 w-4 object-contain"
                          unoptimized
                        />
                      ) : null}
                      {found?.name ?? eco}
                    </span>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="text-[12px] font-bold uppercase tracking-[0.08em] text-black/55 dark:text-white/55">
                Development
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.links?.github ? (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-2 text-[12px] font-semibold text-black/70 hover:bg-black/10 dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/15"
                  >
                    GitHub
                  </a>
                ) : (
                  <span className="text-[12px] text-black/45 dark:text-white/45">
                    Not available
                  </span>
                )}
              </div>
            </div>

            <div>
              <div className="text-[12px] font-bold uppercase tracking-[0.08em] text-black/55 dark:text-white/55">
                Other
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.links?.web ? (
                  <a
                    href={project.links.web}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-2 text-[12px] font-semibold text-black/70 hover:bg-black/10 dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/15"
                  >
                    Website
                  </a>
                ) : null}
                {project.links?.twitter ? (
                  <a
                    href={project.links.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-2 text-[12px] font-semibold text-black/70 hover:bg-black/10 dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/15"
                  >
                    Twitter / X
                  </a>
                ) : null}
                {!project.links?.web && !project.links?.twitter ? (
                  <span className="text-[12px] text-black/45 dark:text-white/45">
                    Not available
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 space-y-10">
        <section id="screenshots" className="scroll-mt-24">
          <h2 className="font-serif text-[26px] leading-none text-black md:text-[30px] dark:text-[#f2f4f6]">
            Screenshots
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {(project.screenshots && project.screenshots.length
              ? project.screenshots.slice(0, 3)
              : []).map((shot, i) => (
              <div
                key={`${shot.url}-${i}`}
                className="relative overflow-hidden rounded-[18px] border border-black/10 bg-black/[0.02] aspect-[16/10] dark:border-white/10 dark:bg-white/[0.04]"
              >
                <Image
                  src={shot.url}
                  alt={shot.caption ?? `${project.name} screenshot`}
                  fill
                  className="object-cover"
                  unoptimized
                />
                {shot.caption ? (
                  <div className="absolute inset-x-0 bottom-0 bg-black/55 p-3 text-[12px] font-semibold text-white backdrop-blur-sm">
                    {shot.caption}
                  </div>
                ) : null}
              </div>
            ))}

            {(!project.screenshots || project.screenshots.length === 0) &&
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={`s-empty-${i}`}
                  className="relative overflow-hidden rounded-[18px] border border-black/10 bg-black/[0.02] aspect-[16/10] dark:border-white/10 dark:bg-white/[0.04]"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(89,242,109,0.15),transparent_45%),radial-gradient(circle_at_80%_60%,rgba(0,0,0,0.10),transparent_55%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(89,242,109,0.10),transparent_45%),radial-gradient(circle_at_80%_60%,rgba(255,255,255,0.06),transparent_55%)]" />
                  {logoSrc ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image
                        src={logoSrc}
                        alt=""
                        width={120}
                        height={120}
                        className="h-16 w-16 object-contain opacity-80"
                        unoptimized
                      />
                    </div>
                  ) : null}
                </div>
              ))}
          </div>
        </section>

        <ProjectOpenness project={project} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <ProjectTechnology project={project} />
          <ProjectPrivacy project={project} />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <ProjectSecurity project={project} />
          <ProjectAudits project={project} />
        </div>

        <ProjectCommunityReviews projectId={project.id} />

        <ProjectMedia project={project} />

        <ProjectArticles project={project} />

        <ProjectTokenInfo project={project} />
      </div>
    </main>
  );
}
