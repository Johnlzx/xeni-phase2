"use client";

import { Play, ExternalLink, Pause, Loader2, CheckCircle2, AlertCircle, Clock, Search, FileText } from "lucide-react";
import { useCaseDetailStore, useFormPilotStatus } from "@/store/case-detail-store";
import { cn } from "@/lib/utils";

// Form filling status type
type FormFillingStatus = "idle" | "analyzing" | "waiting" | "on_hold" | "filling" | "completed" | "error";

// Task execution status
type TaskExecutionStatus = "idle" | "running" | "paused";

// Form filling status config
const FORM_STATUS_CONFIG: Record<FormFillingStatus, {
  label: string;
  labelZh: string;
  icon: typeof Play;
  color: string;
  bgColor: string;
}> = {
  idle: {
    label: "Ready",
    labelZh: "Ready",
    icon: Play,
    color: "text-stone-600",
    bgColor: "bg-stone-100",
  },
  analyzing: {
    label: "Analyzing",
    labelZh: "Analyzing",
    icon: Search,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  waiting: {
    label: "Waiting",
    labelZh: "Waiting",
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  on_hold: {
    label: "On Hold",
    labelZh: "On Hold",
    icon: Pause,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  filling: {
    label: "Filling",
    labelZh: "Filling",
    icon: FileText,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
  completed: {
    label: "Completed",
    labelZh: "Completed",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  error: {
    label: "Error",
    labelZh: "Error",
    icon: AlertCircle,
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
};

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
        <div className="h-5 w-20 bg-stone-100 rounded animate-pulse mb-2" />
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

  const { lastRunStatus, lastRunAt } = formPilotStatus;

  // Determine form filling status
  const getFormFillingStatus = (): FormFillingStatus => {
    if (!lastRunStatus && !lastRunAt) return "idle";
    if (lastRunStatus === "success") return "completed";
    if (lastRunStatus === "error") return "error";
    // Simulate different states based on context
    if (lastRunStatus === "cancelled") return "on_hold";
    if (lastRunAt && !lastRunStatus) return "filling";
    return "idle";
  };

  // Determine task execution status
  const getTaskExecutionStatus = (): TaskExecutionStatus => {
    if (lastRunStatus === null && lastRunAt) return "running";
    if (lastRunStatus === "cancelled") return "paused";
    return "idle";
  };

  const formStatus = getFormFillingStatus();
  const executionStatus = getTaskExecutionStatus();
  const statusConfig = FORM_STATUS_CONFIG[formStatus];
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
          {/* Form filling status badge */}
          <div className={cn(
            "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium",
            statusConfig.bgColor,
            statusConfig.color
          )}>
            <StatusIcon className="size-3.5" />
            <span>{statusConfig.label}</span>
          </div>

          {/* Execution status indicator */}
          <div className="flex items-center gap-1.5 mt-1.5">
            {executionStatus === "running" ? (
              <>
                <Loader2 className="size-3 text-blue-500 animate-spin" />
                <span className="text-[11px] text-blue-600">Running</span>
              </>
            ) : executionStatus === "paused" ? (
              <>
                <Pause className="size-3 text-amber-500" />
                <span className="text-[11px] text-amber-600">Paused</span>
              </>
            ) : (
              <span className="text-[11px] text-stone-400">Idle</span>
            )}
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
