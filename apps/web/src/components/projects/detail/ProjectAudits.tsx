import { Link } from "@/components/ui/link";
import {
  DetailCard,
  DetailSection,
  ValuePill,
} from "@/components/projects/detail/detail-ui";
import { Project } from "@/types/project";
import { format } from "date-fns";

interface ProjectAuditsProps {
  project: Project;
}

export function ProjectAudits({ project }: ProjectAuditsProps) {
  const formatAuditDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM do, yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <DetailSection id="audits" title="Audits">
      <DetailCard>
        {project.audits && project.audits.length > 0 ? (
          <div className="divide-y divide-black/10 dark:divide-white/10">
            {project.audits.map((audit, index) => (
              <div
                key={`${audit.name ?? "audit"}-${index}`}
                className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Link
                    href={audit.url || audit.link || ""}
                    className="text-black hover:underline font-semibold dark:text-[#f2f4f6]"
                  >
                    {audit.name || "Audit"}
                  </Link>
                  {audit.time ? (
                    <ValuePill>{formatAuditDate(audit.time)}</ValuePill>
                  ) : null}
                </div>
                {audit.company ? (
                  <div className="text-[13px] text-black/60 dark:text-white/60">
                    Company: {audit.company}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-2 text-[13px] text-black/55 dark:text-white/55">
            No security audits available for this project.
          </div>
        )}
      </DetailCard>
    </DetailSection>
  );
}
