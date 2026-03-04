import {
  DetailCard,
  DetailRow,
  DetailSection,
  ValuePill,
} from "@/components/projects/detail/detail-ui";
import { Project } from "@/types/project";

interface ProjectTechnologyProps {
  project: Project;
}

interface DataPoint {
  key: string;
  getValue: () => boolean | string | undefined;
  isBoolean?: boolean;
  inverted?: boolean;
  positiveDisplay?: string;
  negativeDisplay?: string;
}

export function ProjectTechnology({ project }: ProjectTechnologyProps) {
  const opensource = project.blockchain_features?.opensource;
  const assetCustodyType = project.blockchain_features?.asset_custody_type;
  const upgradability = project.blockchain_features?.upgradability;
  const technologyType = project.technology?.type;
  const p2pSupport = project.blockchain_features?.p2p;
  const decentralizedStorage = project.storage?.decentralized;

  const dataPoints: DataPoint[] = [
    {
      key: "Open Source",
      getValue: () => opensource,
      isBoolean: true,
      positiveDisplay: "Yes",
      negativeDisplay: "No",
    },
    {
      key: "Decentralized Storage",
      getValue: () => decentralizedStorage,
      isBoolean: true,
      positiveDisplay: "Yes",
      negativeDisplay: "No",
    },
    {
      key: "Upgradability",
      getValue: () => upgradability?.enabled,
      isBoolean: true,
      inverted: true,
      positiveDisplay: "No",
      negativeDisplay: "Yes",
    },
    {
      key: "Peer to Peer (P2P)",
      getValue: () => p2pSupport,
      isBoolean: true,
      positiveDisplay: "Supported",
      negativeDisplay: "Not Supported",
    },
    {
      key: "Asset Custody",
      getValue: () => assetCustodyType,
    },
    {
      key: "Technology Type",
      getValue: () => technologyType,
    },
  ];

  const renderValue = (dataPoint: DataPoint): React.ReactNode => {
    const value = dataPoint.getValue();

    if (value === undefined || value === null) {
      return <ValuePill>Not available</ValuePill>;
    }

    if (dataPoint.isBoolean) {
      const rawValue = Boolean(value);
      const isPositive = dataPoint.inverted ? !rawValue : rawValue;
      const displayText = isPositive
        ? dataPoint.positiveDisplay
        : dataPoint.negativeDisplay;

      return (
        <ValuePill tone={isPositive ? "positive" : "neutral"}>
          {displayText}
        </ValuePill>
      );
    }

    return <ValuePill>{String(value)}</ValuePill>;
  };

  return (
    <DetailSection id="technology" title="Technology">
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
