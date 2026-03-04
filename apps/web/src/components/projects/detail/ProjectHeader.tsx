import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NAVIGATION_LINKS } from "@/lib/constants";
import { Project } from "@/types/project";
import { ExternalLink, Pencil } from "lucide-react";
import { ProjectToolbar } from "./ProjectToolbar";

interface ProjectHeaderProps {
  project: Project;
  ecosystems: Array<{ id: string; icon?: string; name?: string }>;
}

export function ProjectHeader({ project, ecosystems }: ProjectHeaderProps) {
  const getEcosystemIcon = (ecosystemId: string) => {
    const ecosystem = ecosystems.find((eco) => eco.id === ecosystemId);
    return ecosystem?.icon;
  };

  const getEcosystemName = (ecosystemId: string) => {
    const ecosystem = ecosystems.find((eco) => eco.id === ecosystemId);
    return ecosystem?.name || ecosystemId;
  };

  const useCases = project.usecases || [];
  const initialVisibleCount = 3;
  const visibleUseCases = useCases.slice(0, initialVisibleCount);
  const hiddenUseCases = useCases.slice(initialVisibleCount);
  const hiddenCount = hiddenUseCases.length;

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <Avatar className="size-16 md:size-20 shrink-0">
            <AvatarImage
              src={project.logos?.[0]?.url}
              alt={project.name}
              className="object-cover"
            />
            <AvatarFallback className="bg-black/5 text-black/70 text-xl md:text-2xl font-semibold dark:bg-white/10 dark:text-white/70">
              {project.name[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-3 min-w-0 flex-1">
            <div className="flex items-center gap-3">
              {project.links?.web ? (
                <Link href={project.links.web} className="group">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl leading-tight inline-flex items-center gap-2 transition-colors font-serif text-black dark:text-[#f2f4f6]">
                    {project.name}
                    <ExternalLink className="size-4 md:size-5 opacity-50 group-hover:opacity-90 transition-opacity" />
                  </h1>
                </Link>
              ) : (
                <h1 className="text-2xl md:text-3xl lg:text-4xl leading-tight font-serif text-black dark:text-[#f2f4f6]">
                  {project.name}
                </h1>
              )}
              <Link
                href={`${NAVIGATION_LINKS.UPDATE_PROJECT}/${project.id}/edit`}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="border-black/15 hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
                >
                  <Pencil className="size-4" />
                  Update
                </Button>
              </Link>
            </div>

            {project.categories && project.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.categories.map((category, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="rounded-full bg-black/5 text-black/70 dark:bg-white/10 dark:text-white/70"
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {project.description && (
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="prose dark:prose-invert max-w-none cursor-help">
                  <p className="text-sm md:text-base leading-relaxed text-black/70 dark:text-white/70 max-w-[70ch] line-clamp-2">
                    {project.description}
                  </p>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-[70ch]">
                <p>{project.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* Ecosystems and Use Cases */}
        <div className="flex items-center gap-6 border-y border-[#d8d8d8] py-4 dark:border-[#2c3139]">
          {/* Ecosystems */}
          {project.ecosystem && project.ecosystem.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-black/55 dark:text-white/55">
                Ecosystems:
              </span>

              <TooltipProvider delayDuration={100}>
                <div className="flex -space-x-2">
                  {project.ecosystem.map((eco, index) => {
                    const icon = getEcosystemIcon(eco);
                    const name = getEcosystemName(eco);
                    return (
                      <Tooltip key={`${eco}-${index}`}>
                        <TooltipTrigger asChild>
                          <Avatar className="size-8 border-2 border-white bg-white hover:z-10 transition-transform hover:scale-110 dark:border-[#151a21] dark:bg-[#0f1318]">
                            <AvatarImage
                              src={icon}
                              alt={name}
                              className="object-contain p-1"
                            />
                            <AvatarFallback className="bg-black/5 text-black/60 text-xs font-medium dark:bg-white/10 dark:text-white/70">
                              {name ? name[0].toUpperCase() : ""}
                            </AvatarFallback>
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{name}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              </TooltipProvider>
            </div>
          )}

          {/* Separator */}
          {project.ecosystem &&
            project.ecosystem.length > 0 &&
            useCases.length > 0 && (
              <Separator orientation="vertical" className="!h-10" />
            )}

          {/* Use Cases */}
          {useCases.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-black/55 dark:text-white/55">
                Use Cases:
              </span>

              <TooltipProvider delayDuration={100}>
                <div className="flex flex-wrap gap-2 items-center">
                  {visibleUseCases.map((usecase, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="rounded-full text-xs border-black/15 text-black/70 hover:bg-black/5 dark:border-white/15 dark:text-white/70 dark:hover:bg-white/10"
                    >
                      {usecase}
                    </Badge>
                  ))}
                  {hiddenCount > 0 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge
                          variant="secondary"
                          className="rounded-full text-xs cursor-pointer bg-black/5 text-black/70 dark:bg-white/10 dark:text-white/70"
                        >
                          +{hiddenCount}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="flex flex-col gap-1 items-start">
                          {hiddenUseCases.map((usecase, index) => (
                            <span key={index} className="text-xs">
                              {usecase}
                            </span>
                          ))}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </TooltipProvider>
            </div>
          )}
        </div>
      </div>

      <ProjectToolbar project={project} />
    </div>
  );
}
