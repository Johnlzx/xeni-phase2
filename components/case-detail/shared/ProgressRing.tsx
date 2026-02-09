import { CheckCircle2 } from "lucide-react";

export function ProgressRing({
  percent,
  isComplete,
  size = 48,
  strokeWidth = 4,
  iconSize = "size-5",
  textSize = "text-xs",
}: {
  percent: number;
  isComplete: boolean;
  size?: number;
  strokeWidth?: number;
  iconSize?: string;
  textSize?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg className="-rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-stone-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={isComplete ? "text-emerald-500" : "text-amber-500"}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {isComplete ? (
          <CheckCircle2 className={`${iconSize} text-emerald-500`} />
        ) : (
          <span className={`${textSize} font-bold text-stone-700 tabular-nums`}>{percent}%</span>
        )}
      </div>
    </div>
  );
}
