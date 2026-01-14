"use client";

import { Play, ExternalLink, Check, X, AlertCircle } from "lucide-react";
import { useCaseDetailStore, useFormPilotStatus } from "@/store/case-detail-store";
import { cn } from "@/lib/utils";

// Skeleton loading state
function FormPilotCardSkeleton() {
  return (
    <div className="flex flex-col h-full rounded-lg border border-stone-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-stone-100 bg-stone-50/50">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded bg-stone-100 flex items-center justify-center">
            <Play className="size-3.5 text-stone-400" />
          </div>
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
            Form Pilot
          </span>
        </div>
      </div>

      {/* Content - Skeleton */}
      <div className="flex-1 p-3">
        <div className="space-y-2 mb-3">
          <div className="h-7 w-8 bg-stone-100 rounded animate-pulse" />
          <div className="h-4 w-16 bg-stone-100 rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-stone-100 rounded animate-pulse" />
          <div className="h-6 w-20 bg-stone-100 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// Empty state
function FormPilotCardEmpty() {
  return (
    <div className="flex flex-col h-full rounded-lg border border-stone-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-stone-100 bg-stone-50/50">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded bg-stone-100 flex items-center justify-center">
            <Play className="size-3.5 text-stone-400" />
          </div>
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
            Form Pilot
          </span>
        </div>
      </div>

      {/* Content - Empty */}
      <div className="flex-1 p-3 flex flex-col items-center justify-center text-center">
        <div className="size-10 rounded-lg bg-stone-100 flex items-center justify-center mb-2">
          <Play className="size-5 text-stone-400" />
        </div>
        <p className="text-xs text-stone-400 text-pretty">
          Complete analysis to enable
        </p>
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

  // Loading state
  if (isAnalyzing) {
    return <FormPilotCardSkeleton />;
  }

  // Empty state - no analysis completed yet
  if (!lastAnalysisAt) {
    return <FormPilotCardEmpty />;
  }

  const { totalSessions, lastRunAt, lastRunStatus } = formPilotStatus;

  // Format time ago
  const getTimeAgo = () => {
    if (!lastRunAt) return null;
    const diff = Date.now() - new Date(lastRunAt).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleLaunch = () => {
    launchFormPilot();
    // In real implementation, would open external Form Pilot tool
    // window.open('form-pilot://launch', '_blank');
  };

  const statusConfig = {
    success: {
      icon: Check,
      label: "Success",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
      iconColor: "text-emerald-600",
    },
    cancelled: {
      icon: X,
      label: "Cancelled",
      bgColor: "bg-amber-50",
      textColor: "text-amber-700",
      iconColor: "text-amber-600",
    },
    error: {
      icon: AlertCircle,
      label: "Error",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      iconColor: "text-red-600",
    },
  };

  const status = lastRunStatus ? statusConfig[lastRunStatus] : null;

  return (
    <div className="flex flex-col h-full rounded-lg border border-stone-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-stone-100 bg-stone-50/50">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded bg-stone-100 flex items-center justify-center">
            <Play className="size-3.5 text-stone-600" />
          </div>
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Form Pilot
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-3">
        {/* Session Count */}
        <div className="mb-3">
          <p className="text-xl font-semibold text-stone-800 tabular-nums">
            {totalSessions}
          </p>
          <p className="text-xs text-stone-500">
            {totalSessions === 1 ? "session" : "sessions"}
          </p>
        </div>

        {/* Last Run Info */}
        {totalSessions > 0 && status ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500">Last run</span>
              <span className="text-stone-600">{getTimeAgo()}</span>
            </div>

            {/* Status Badge */}
            <div
              className={cn(
                "inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs",
                status.bgColor,
                status.textColor,
              )}
            >
              <status.icon className={cn("size-3", status.iconColor)} />
              {status.label}
            </div>
          </div>
        ) : (
          <div className="py-2 text-xs text-stone-400">Never run</div>
        )}
      </div>

      {/* Footer - Launch Button */}
      <div className="px-3 py-2 border-t border-stone-100">
        <button
          onClick={handleLaunch}
          className={cn(
            "w-full flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium",
            "bg-[#0E4268] text-white hover:bg-[#0a3555] transition-colors",
          )}
        >
          Launch
          <ExternalLink className="size-3" />
        </button>
      </div>
    </div>
  );
}
