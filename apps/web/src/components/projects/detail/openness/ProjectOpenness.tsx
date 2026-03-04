import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DetailCard,
  DetailRow,
  DetailSection,
  ValuePill,
} from "@/components/projects/detail/detail-ui";
import { Project } from "@/types/project";
import { format } from "date-fns";
import { ItemList } from "./ItemList";

interface ProjectOpennessProps {
  project: Project;
}

export function ProjectOpenness({ project }: ProjectOpennessProps) {
  const projectPhase = project.project_phase || "Not available";
  const assetsUsed = project.assets_used || [];
  const tokens = project.tokens || [];
  const launchDay = project.product_launch_day
    ? (() => {
        try {
          return format(new Date(project.product_launch_day), "MMM do, yyyy");
        } catch {
          return "Not available";
        }
      })()
    : "Not available";
  const teamMembers = project.team?.teammembers || [];
  const funding = project.funding || [];

  const nativeToken =
    tokens.length > 0
      ? tokens[0]?.symbol || tokens[0]?.name || "Available"
      : "Not available";

  return (
    <DetailSection id="openness" title="Openness">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DetailCard>
          <div className="divide-y divide-black/10 dark:divide-white/10">
            <DetailRow
              label="Project Phase"
              value={<ValuePill>{projectPhase}</ValuePill>}
            />
            <DetailRow
              label="Launch Day"
              value={<ValuePill>{launchDay}</ValuePill>}
            />
            <DetailRow
              label="Assets Used"
              value={
                assetsUsed.length ? (
                  assetsUsed.slice(0, 4).map((a) => (
                    <ValuePill key={a}>{a}</ValuePill>
                  ))
                ) : (
                  <ValuePill>Not available</ValuePill>
                )
              }
            />
            <DetailRow
              label="Native Token"
              value={<ValuePill>{nativeToken}</ValuePill>}
            />
          </div>
        </DetailCard>

        <DetailCard>
          <Accordion type="multiple" className="w-full" defaultValue={["team", "funding"]}>
            <AccordionItem value="team">
              <AccordionTrigger>
                <div className="text-[12px] font-bold uppercase tracking-[0.08em] text-black/60 dark:text-white/60">
                  Team Members ({teamMembers.length})
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ItemList items={teamMembers} />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="funding">
              <AccordionTrigger>
                <div className="text-[12px] font-bold uppercase tracking-[0.08em] text-black/60 dark:text-white/60">
                  Funding ({funding.length})
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ItemList items={funding} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </DetailCard>
      </div>
    </DetailSection>
  );
}
