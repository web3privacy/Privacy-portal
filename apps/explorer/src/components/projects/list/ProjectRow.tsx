import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/types/project";
import { ProjectRating } from "../detail/ProjectRating";
import { GitHubIcon, XBrandIcon } from "@/components/ui/brand-icons";
import { Icon } from "@/components/ui/icon";
import { existsSync } from "node:fs";
import path from "node:path";

function LinkIcon({
  href,
  kind,
}: {
  href?: string;
  kind: "web" | "github" | "x";
}) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] text-black/55 hover:bg-black/5 hover:text-black dark:text-white/55 dark:hover:bg-white/10 dark:hover:text-white"
      aria-label={kind}
    >
      {kind === "web" ? (
        <Icon name="public" size={22} />
      ) : kind === "github" ? (
        <GitHubIcon className="h-5 w-5" />
      ) : (
        <XBrandIcon className="h-5 w-5" />
      )}
    </a>
  );
}

export function ProjectRow({
  project,
  ecosystemIconsById,
}: {
  project: Project;
  ecosystemIconsById: Record<string, string | undefined>;
}) {
  const logoFile = project.logos?.[0]?.file;
  const publicLogoPath = logoFile
    ? path.join(process.cwd(), "apps", "explorer", "public", "project-assets", "projects", project.id, logoFile)
    : null;
  const logoSrc =
    logoFile && publicLogoPath && existsSync(publicLogoPath)
      ? `/project-assets/projects/${encodeURIComponent(project.id)}/${encodeURIComponent(logoFile)}`
      : (project.logos?.[0]?.url ?? "");

  return (
    <div className="grid gap-4 rounded-[14px] border border-black/10 bg-white px-4 py-3 transition-shadow hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-[#151a21] dark:hover:shadow-[0_18px_40px_rgba(0,0,0,0.32)] md:grid-cols-[1fr_96px_110px_120px] md:items-center">
      <Link href={`/project/${encodeURIComponent(project.id)}`} className="group min-w-0">
        <div className="flex min-w-0 items-start gap-4">
          <Avatar className="mt-0.5 size-12 shrink-0 bg-black/5 dark:bg-white/10">
            <AvatarImage
              src={logoSrc}
              alt={project.name}
              loading="lazy"
              decoding="async"
              className="object-contain bg-white dark:bg-[#0f1318]"
            />
            <AvatarFallback className="bg-transparent text-black/70 dark:text-white/70">
              {project.name?.[0]?.toUpperCase() ?? "?"}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <h3 className="min-w-0 truncate font-serif text-[18px] leading-none text-black group-hover:underline dark:text-[#f2f4f6]">
                {project.name}
              </h3>
              {project.usecases?.slice(0, 1).map((uc) => (
                <Badge
                  key={uc}
                  variant="secondary"
                  className="rounded-full bg-black/5 text-black/70 dark:bg-white/10 dark:text-white/70"
                >
                  {uc}
                </Badge>
              ))}
              {project.categories?.slice(0, 1).map((cat) => (
                <Badge
                  key={cat}
                  variant="secondary"
                  className="rounded-full bg-black/5 text-black/70 dark:bg-white/10 dark:text-white/70"
                >
                  {cat}
                </Badge>
              ))}
            </div>

            {project.description ? (
              <p className="mt-2 line-clamp-1 text-[13px] leading-relaxed text-black/60 dark:text-white/60">
                {project.description}
              </p>
            ) : null}
          </div>
        </div>
      </Link>

      <div className="hidden md:flex items-center justify-center">
        <ProjectRating project={project} size={34} />
      </div>

      <div className="hidden md:flex items-center justify-start">
        <div className="flex -space-x-2">
          {(project.ecosystem ?? []).slice(0, 3).map((eco) => {
            const icon = ecosystemIconsById[eco];
            return (
              <Avatar
                key={eco}
                className="size-7 border-2 border-white bg-white dark:border-[#151a21] dark:bg-[#0f1318]"
                title={eco}
              >
                <AvatarImage
                  src={icon ?? ""}
                  alt={eco}
                  loading="lazy"
                  decoding="async"
                  className="object-contain bg-white"
                />
                <AvatarFallback className="bg-black/5 text-black/60 text-[10px] dark:bg-white/10 dark:text-white/70">
                  {eco[0]?.toUpperCase() ?? "?"}
                </AvatarFallback>
              </Avatar>
            );
          })}
        </div>
      </div>

      <div className="hidden md:flex items-center justify-end gap-1">
        <LinkIcon href={project.links?.web} kind="web" />
        <LinkIcon href={project.links?.github} kind="github" />
        <LinkIcon href={project.links?.twitter} kind="x" />
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 md:hidden">
        <ProjectRating project={project} size={34} />
        <div className="flex items-center gap-1">
          <LinkIcon href={project.links?.web} kind="web" />
          <LinkIcon href={project.links?.github} kind="github" />
          <LinkIcon href={project.links?.twitter} kind="x" />
        </div>
      </div>
    </div>
  );
}
