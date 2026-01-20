"use client";

import { Play, ExternalLink, Loader2, CheckCircle2, History } from "lucide-react";
import { useCaseDetailStore, useFormPilotStatus } from "@/store/case-detail-store";
import { cn } from "@/lib/utils";

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

// Empty state - analysis not done yet
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
        <p className="text-xs text-stone-400 text-pretty">Run analysis first</p>
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

  // Has run before?
  const hasRunBefore = lastRunAt !== null;
  // Currently running (lastRunAt set but no status yet)
  const isRunning = lastRunAt !== null && lastRunStatus === null;

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
      <div className="p-3 flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          {isRunning ? (
            // Running state
            <div className="flex items-center gap-2">
              <Loader2 className="size-4 text-blue-500 animate-spin shrink-0" />
              <span className="text-sm font-medium text-blue-600">Running</span>
            </div>
          ) : hasRunBefore ? (
            // Has run before - show completion status
            <div className="flex items-center gap-2">
              {lastRunStatus === "success" ? (
                <>
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  <span className="text-sm font-medium text-emerald-600">Completed</span>
                </>
              ) : lastRunStatus === "cancelled" ? (
                <>
                  <History className="size-4 text-stone-400 shrink-0" />
                  <span className="text-sm text-stone-500">Paused</span>
                </>
              ) : (
                <>
                  <History className="size-4 text-stone-400 shrink-0" />
                  <span className="text-sm text-stone-500">View History</span>
                </>
              )}
            </div>
          ) : (
            // Ready to launch
            <div>
              <p className="text-sm font-medium text-stone-700 text-balance">Ready</p>
              <p className="text-[11px] text-stone-400 text-pretty">Click to launch</p>
            </div>
          )}
        </div>

        <button
          onClick={handleLaunch}
          disabled={isRunning}
          className={cn(
            "size-8 flex items-center justify-center rounded-lg transition-colors",
            isRunning
              ? "text-stone-300 cursor-not-allowed"
              : "text-stone-500 hover:text-stone-700 hover:bg-stone-100"
          )}
          aria-label="Launch Form Pilot"
        >
          <ExternalLink className="size-4" />
        </button>
      </div>
    </div>
  );
}
