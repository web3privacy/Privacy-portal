import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getRatingLabel } from "@/lib/ratings";
import { Project, type ProjectRating } from "@/types/project";

interface ProjectRatingProps {
  project: Project;
  size?: number;
}

function getSliceColorByType(type: string): string {
  switch (type) {
    case "openness":
      return "#111111";
    case "technology":
      return "var(--accent)";
    case "privacy":
      return "#f59e0b";
    default:
      return "#111111";
  }
}

const PieSlice = ({
  startAngle,
  endAngle,
  color,
  radius,
}: {
  startAngle: number;
  endAngle: number;
  color: string;
  radius: number;
}) => {
  const cx = radius;
  const cy = radius;
  const startRad = ((startAngle - 90) * Math.PI) / 180;
  const endRad = ((endAngle - 90) * Math.PI) / 180;
  const x1 = cx + radius * Math.cos(startRad);
  const y1 = cy + radius * Math.sin(startRad);
  const x2 = cx + radius * Math.cos(endRad);
  const y2 = cy + radius * Math.sin(endRad);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
  const d = `M ${cx},${cy} L ${x1},${y1} A ${radius},${radius} 0 ${largeArcFlag} 1 ${x2},${y2} Z`;
  return (
    <path
      d={d}
      fill={color}
      // Divider should match the current page background (fixes "white bleed" in dark mode).
      stroke="hsl(var(--background))"
      strokeWidth={2.5}
      vectorEffect="non-scaling-stroke"
    />
  );
};

const TooltipContentComponent = ({ ratings }: { ratings: ProjectRating[] }) => {
  const radius = 50;
  const sliceAngle = 360 / ratings.length;

  return (
    <div className="flex items-center gap-4">
      <svg
        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
        width={80}
        height={80}
        className="transform -rotate-90"
      >
        {ratings.map((rating, index) => (
          <PieSlice
            key={rating.type}
            startAngle={index * sliceAngle}
            endAngle={index * sliceAngle + sliceAngle}
            color={getSliceColorByType(rating.type)}
            radius={radius}
          />
        ))}
      </svg>
      <div className="space-y-1">
        {ratings.map((rating) => {
          const label = getRatingLabel(rating.percentagePoints);
          return (
            <div key={rating.type} className="flex items-center gap-2 text-xs">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: getSliceColorByType(rating.type) }}
                aria-hidden="true"
              />
              <span className="text-black/70">{rating.name}:</span>{" "}
              <span className="font-bold text-black">
                {rating.percentagePoints.toFixed(1)}% ({label})
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export function ProjectRating({
  project,
  size = 40,
}: ProjectRatingProps) {
  const ratings = project.ratings ?? [];

  if (!ratings || ratings.length === 0) {
    return null;
  }

  const sliceAngle = 360 / ratings.length;
  const radius = 50;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <svg
            viewBox={`0 0 ${radius * 2} ${radius * 2}`}
            width={size}
            height={size}
            className="transform -rotate-90 cursor-pointer"
          >
            {ratings.map((rating, index) => {
              const startAngle = index * sliceAngle;
              const endAngle = startAngle + sliceAngle;
              return (
                <PieSlice
                  key={rating.type}
                  startAngle={startAngle}
                  endAngle={endAngle}
                  color={getSliceColorByType(rating.type)}
                  radius={radius}
                />
              );
            })}
          </svg>
        </TooltipTrigger>
        <TooltipContent className="p-4 bg-white text-black border border-black/10 shadow-xl">
          <TooltipContentComponent ratings={ratings} />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
