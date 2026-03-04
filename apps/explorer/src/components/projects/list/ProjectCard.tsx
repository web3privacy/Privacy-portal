import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Project } from "@/types/project";
import Link from "next/link";
import { GitHubIcon, XBrandIcon } from "@/components/ui/brand-icons";
import { Icon } from "@/components/ui/icon";
import { ProjectScoreBar } from "./ProjectScoreBar";

interface ProjectCardProps {
  project: Project;
  ecosystemIconsById: Record<string, string | undefined>;
}

function LinkIconButton({
  href,
  kind,
}: {
  href?: string;
  kind: "web" | "github" | "x";
}) {
  const inner =
    kind === "web" ? (
      <Icon name="public" size={22} />
    ) : kind === "github" ? (
      <GitHubIcon className="h-4 w-4" />
    ) : (
      <XBrandIcon className="h-4 w-4" />
    );

  const classes =
    kind === "web"
      ? "pointer-events-auto relative z-20 inline-flex h-9 w-9 items-center justify-center rounded-[12px] text-[#c0c0c0] hover:bg-black/5 hover:text-black dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white"
      : "pointer-events-auto relative z-20 inline-flex h-9 w-9 items-center justify-center rounded-[12px] text-black/55 hover:bg-black/5 hover:text-black dark:text-white/55 dark:hover:bg-white/10 dark:hover:text-white";

  if (!href) return null;

  return (
    <a href={href} target="_blank" rel="noreferrer" className={classes} aria-label={kind}>
      {inner}
    </a>
  );
}

export function ProjectCard({ project, ecosystemIconsById }: ProjectCardProps) {
  // Extract project properties as constants
  const { id, name, description, logos, ecosystem, categories, usecases } =
    project;
  const logoFile = logos?.[0]?.file;
  // Prefer locally-synced assets (scripts/sync-explorer-assets.mjs). If a file is missing,
  // it will fall back to the remote URL (when available).
  const logoSrc = logoFile
    ? `/project-assets/projects/${encodeURIComponent(id)}/${encodeURIComponent(logoFile)}`
    : (logos?.[0]?.url ?? "");
  const tagUsecases = (usecases ?? []).slice(0, 4);
  const tagCategories = (categories ?? []).slice(0, 4);

  return (
    <Card className="relative h-full gap-0 rounded-[18px] border-black/10 bg-white py-0 transition-shadow hover:shadow-[0_18px_40px_rgba(0,0,0,0.10)] dark:bg-[#151a21] dark:border-white/10 dark:hover:shadow-[0_18px_40px_rgba(0,0,0,0.35)]">
      {/* Clickable overlay (keeps external links valid; no nested anchors). */}
      <Link
        href={`/project/${encodeURIComponent(id)}`}
        className="absolute inset-0 z-0 rounded-[18px] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/25 dark:focus-visible:ring-white/25"
        aria-label={`Open ${name}`}
      >
        <span className="sr-only">Open project</span>
      </Link>

      <CardContent className="pointer-events-none relative z-10 flex h-full flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <LinkIconButton href={project.links?.web} kind="web" />
          </div>

          {(ecosystem ?? []).slice(0, 2).length ? (
            <div className="flex items-center gap-1">
              {(ecosystem ?? []).slice(0, 2).map((eco) => {
                const icon = ecosystemIconsById[eco];
                return (
                  <Avatar
                    key={eco}
                    className="size-5 bg-white dark:bg-[#0f1318]"
                    title={eco}
                  >
                    <AvatarImage
                      src={icon ?? ""}
                      alt={eco}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-contain bg-white dark:bg-[#0f1318]"
                    />
                    <AvatarFallback className="bg-black/5 text-black/60 text-[10px] dark:bg-white/10 dark:text-white/70">
                      {eco[0]?.toUpperCase() ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                );
              })}
            </div>
          ) : (
            <div />
          )}
        </div>

        <div className="flex flex-1 flex-col items-center text-center">
          <Avatar className="size-[104px] items-center justify-center overflow-hidden border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-[#0f1318] sm:size-[148px]">
            <AvatarImage
              src={logoSrc}
              alt={name}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
            <AvatarFallback className="bg-transparent font-serif text-[34px] text-black/70 dark:text-white/70">
              {name?.[0]?.toUpperCase() ?? "?"}
            </AvatarFallback>
          </Avatar>

          <CardTitle className="mt-4 line-clamp-2 max-w-[18ch] text-[20px] font-semibold leading-tight text-black dark:text-[#f2f4f6] sm:text-[28px]">
            {name}
          </CardTitle>

          <ProjectScoreBar project={project} className="mt-3 w-[130px] sm:mt-4" />

          <CardDescription className="mt-4 line-clamp-3 max-w-[34ch] text-[13px] leading-relaxed text-black/65 dark:text-white/65">
            {description || "No description available"}
          </CardDescription>

          <div className="mt-auto w-full">
            <div className="mt-2 flex items-center justify-center gap-1">
              <LinkIconButton href={project.links?.github} kind="github" />
              <LinkIconButton href={project.links?.twitter} kind="x" />
            </div>

            {(tagUsecases.length || tagCategories.length) ? (
              <div className="mt-2 max-h-[54px] overflow-hidden">
                <div className="flex flex-wrap justify-center gap-2">
                  {tagCategories.map((t) => (
                    <Badge
                      key={`cat-${t}`}
                      variant="secondary"
                      className="rounded-full bg-black/15 text-black/75 dark:bg-white/20 dark:text-white/80"
                    >
                      {t}
                    </Badge>
                  ))}
                  {tagUsecases.map((t) => (
                    <Badge
                      key={`uc-${t}`}
                      variant="secondary"
                      className="rounded-full bg-black/5 text-black/70 dark:bg-white/10 dark:text-white/70"
                    >
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
