"use client";

import { Play, ExternalLink, Pause, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useCaseDetailStore, useFormPilotStatus } from "@/store/case-detail-store";
import { cn } from "@/lib/utils";

// Task status type
type TaskStatus = "idle" | "running" | "paused" | "completed" | "error";

// Skeleton loading state
function FormPilotCardSkeleton() {
  return (
    <div className="flex flex-col rounded-lg border border-stone-200 bg-white overflow-hidden">
      <div className="px-3 py-2 border-b border-stone-100 bg-stone-50/50">
        <div className="flex items-center gap-2">
          <div className="size-5 rounded bg-stone-100 flex items-center justify-center">
            <Play className="size-3 text-stone-400" />
          </div>
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
            Form Pilot
          </span>
        </div>
      </div>
      <div className="p-3">
        <div className="h-6 w-8 bg-stone-100 rounded animate-pulse mb-1" />
        <div className="h-3 w-16 bg-stone-100 rounded animate-pulse" />
      </div>
    </div>
  );
}

// Empty state
function FormPilotCardEmpty() {
  return (
    <div className="flex flex-col rounded-lg border border-stone-200 bg-white overflow-hidden">
      <div className="px-3 py-2 border-b border-stone-100 bg-stone-50/50">
        <div className="flex items-center gap-2">
          <div className="size-5 rounded bg-stone-100 flex items-center justify-center">
            <Play className="size-3 text-stone-400" />
          </div>
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
            Form Pilot
          </span>
        </div>
      </div>
      <div className="p-3 flex items-center justify-center">
        <p className="text-xs text-stone-400">Not started</p>
      </div>
    </div>
  );
}

// Status config
const STATUS_CONFIG: Record<TaskStatus, {
  label: string;
  icon: typeof Play;
  color: string;
  iconColor: string;
}> = {
  idle: {
    label: "Ready",
    icon: Play,
    color: "text-stone-600",
    iconColor: "text-stone-400",
  },
  running: {
    label: "Running",
    icon: Loader2,
    color: "text-blue-600",
    iconColor: "text-blue-500",
  },
  paused: {
    label: "Paused",
    icon: Pause,
    color: "text-amber-600",
    iconColor: "text-amber-500",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    color: "text-emerald-600",
    iconColor: "text-emerald-500",
  },
  error: {
    label: "Error",
    icon: AlertCircle,
    color: "text-red-600",
    iconColor: "text-red-500",
  },
};

export function FormPilotCard() {
  const isAnalyzing = useCaseDetailStore(
    (state) => state.isAnalyzingDocuments,
  );
  const lastAnalysisAt = useCaseDetailStore((state) => state.lastAnalysisAt);
  const formPilotStatus = useFormPilotStatus();
  const launchFormPilot = useCaseDetailStore((state) => state.launchFormPilot);

  if (isAnalyzing) {
    return <FormPilotCardSkeleton />;
  }

  if (!lastAnalysisAt) {
    return <FormPilotCardEmpty />;
  }

  const { totalSessions, lastRunStatus, lastRunAt } = formPilotStatus;

  // Determine current task status
  const getTaskStatus = (): TaskStatus => {
    // null status with recent lastRunAt means running
    if (lastRunStatus === null && lastRunAt) {
      return "running";
    }
    if (!lastRunStatus) return "idle";
    if (lastRunStatus === "success") return "completed";
    if (lastRunStatus === "cancelled") return "paused";
    if (lastRunStatus === "error") return "error";
    return "idle";
  };

  const taskStatus = getTaskStatus();
  const statusConfig = STATUS_CONFIG[taskStatus];
  const StatusIcon = statusConfig.icon;

  const handleLaunch = () => {
    launchFormPilot();
  };

  return (
    <div className="flex flex-col rounded-lg border border-stone-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 border-b border-stone-100 bg-stone-50/50">
        <div className="flex items-center gap-2">
          <div className="size-5 rounded bg-stone-100 flex items-center justify-center">
            <Play className="size-3 text-stone-600" />
          </div>
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
            Form Pilot
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold text-stone-800 tabular-nums leading-none">
            {totalSessions}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <StatusIcon
              className={cn(
                "size-3",
                statusConfig.iconColor,
                taskStatus === "running" && "animate-spin",
              )}
            />
            <span className={cn("text-[11px]", statusConfig.color)}>
              {totalSessions === 1 ? "session" : "sessions"} · {statusConfig.label}
            </span>
          </div>
        </div>
        <button
          onClick={handleLaunch}
          className="size-7 flex items-center justify-center rounded-md text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
          aria-label="Launch Form Pilot"
        >
          <ExternalLink className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
