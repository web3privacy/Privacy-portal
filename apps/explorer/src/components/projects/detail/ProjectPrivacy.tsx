import {
  DetailCard,
  DetailRow,
  DetailSection,
  ValuePill,
} from "@/components/projects/detail/detail-ui";
import { Link } from "@/components/ui/link";
import { Project } from "@/types/project";
import { cn } from "@/lib/utils";

interface ProjectPrivacyProps {
  project: Project;
}

interface DataPoint {
  key: string;
  getValue: () => boolean | string | string[] | undefined;
  isBoolean?: boolean;
  inverted?: boolean;
  positiveDisplay?: string;
  negativeDisplay?: string;
  isArray?: boolean;
  renderAsBadges?: boolean;
}

export function ProjectPrivacy({ project }: ProjectPrivacyProps) {
  const defaultPrivacy = project.default_privacy;
  const kyc = project.tracebility?.kyc;
  const privacyPolicyDefined = project.privacy_policy?.defined;
  const privacyPolicyUrl = project.privacy_policy?.link;
  const compliance = project.compliance;
  const signInRequirements = project.tracebility?.sign_in_type_requirments;
  const collectedData = project.tracebility?.tracked_data;
  const dataUsage = project.privacy_policy?.data_usage;

  const dataPoints: DataPoint[] = [
    {
      key: "Know Your Customer (KYC)",
      getValue: () => kyc,
      isBoolean: true,
      inverted: true,
      positiveDisplay: "Not Required",
      negativeDisplay: "Required",
    },
    {
      key: "Privacy Policy",
      getValue: () => privacyPolicyDefined,
      isBoolean: true,
      positiveDisplay: "Defined",
      negativeDisplay: "Not Defined",
    },
    {
      key: "Compliance",
      getValue: () => compliance,
    },
    {
      key: "Sign-in Requirements",
      getValue: () => signInRequirements,
      isArray: true,
      renderAsBadges: true,
    },
    {
      key: "Collected Data",
      getValue: () => collectedData,
    },
    {
      key: "Data Usage",
      getValue: () => dataUsage,
    },
  ];

  const renderValue = (dataPoint: DataPoint): React.ReactNode => {
    const value = dataPoint.getValue();

    if (value === undefined || value === null || value === "") {
      return <ValuePill>Not available</ValuePill>;
    }

    if (dataPoint.isBoolean) {
      const rawValue = Boolean(value);
      const isPositive = dataPoint.inverted ? !rawValue : rawValue;
      const displayText = isPositive
        ? dataPoint.positiveDisplay
        : dataPoint.negativeDisplay;

      if (
        dataPoint.key === "Privacy Policy" &&
        isPositive &&
        privacyPolicyUrl
      ) {
        return (
          <div className="flex items-center gap-3">
            <ValuePill tone={isPositive ? "positive" : "neutral"}>
              {displayText}
            </ValuePill>
            <Link
              href={privacyPolicyUrl}
              className="text-primary hover:underline flex items-center gap-1 text-sm"
            >
              View Policy
              <span className="text-black/45 dark:text-white/45">→</span>
            </Link>
          </div>
        );
      }

      return (
        <ValuePill tone={isPositive ? "positive" : "neutral"}>
          {displayText}
        </ValuePill>
      );
    }

    if (dataPoint.isArray && Array.isArray(value)) {
      if (value.length === 0) {
        return <ValuePill>Not available</ValuePill>;
      }

      if (dataPoint.renderAsBadges) {
        return (
          <div className="flex flex-wrap justify-end gap-2">
            {value.slice(0, 6).map((item) => (
              <ValuePill key={item}>{item}</ValuePill>
            ))}
            {value.length > 6 ? (
              <ValuePill>{`+${value.length - 6}`}</ValuePill>
            ) : null}
          </div>
        );
      }

      return (
        <div className="flex flex-wrap justify-end gap-2">
          {value.slice(0, 6).map((item) => (
            <ValuePill key={item}>{item}</ValuePill>
          ))}
          {value.length > 6 ? (
            <ValuePill>{`+${value.length - 6}`}</ValuePill>
          ) : null}
        </div>
      );
    }

    return <ValuePill>{String(value)}</ValuePill>;
  };

  return (
    <DetailSection
      id="privacy"
      title="Privacy"
      rightSlot={
        defaultPrivacy ? (
          <span className={cn("text-[12px] font-bold uppercase tracking-[0.08em] text-[#ef4444]")}>
            Privacy by default
          </span>
        ) : null
      }
    >
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
