import {
  DetailCard,
  DetailRow,
  DetailSection,
  ValuePill,
} from "@/components/projects/detail/detail-ui";
import { Project } from "@/types/project";

interface ProjectSecurityProps {
  project: Project;
}

interface DataPoint {
  key: string;
  getValue: () => string | undefined;
}

export function ProjectSecurity({ project }: ProjectSecurityProps) {
  const technicalDependency = project.technical_spof;
  const socialDependency = project.social_trust;
  const thirdPartyDependency = project.third_party_dependency;

  const dataPoints: DataPoint[] = [
    {
      key: "Technical Dependency",
      getValue: () => technicalDependency,
    },
    {
      key: "Social Dependency",
      getValue: () => socialDependency,
    },
    {
      key: "Third-party Dependency",
      getValue: () => thirdPartyDependency,
    },
  ];

  const renderValue = (dataPoint: DataPoint): React.ReactNode => {
    const value = dataPoint.getValue();

    if (!value || value.trim() === "") {
      return <ValuePill>Not available</ValuePill>;
    }

    return <ValuePill>{value}</ValuePill>;
  };

  return (
    <DetailSection id="security" title="Security">
      <DetailCard>
        <div className="divide-y divide-black/10 dark:divide-white/10">
          {dataPoints.map((dataPoint) => (
            <DetailRow
              key={dataPoint.key}
              label={dataPoint.key}
              value={renderValue(dataPoint)}
            />
          ))}
        </div>
      </DetailCard>
    </DetailSection>
  );
}
