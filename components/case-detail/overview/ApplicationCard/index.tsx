"use client";

import { Clock, ChevronRight, Loader2, FileSearch, Sparkles } from "lucide-react";
import { useCaseDetailStore } from "@/store/case-detail-store";
import { cn } from "@/lib/utils";
import { getVisaConfig } from "./VisaTypeDialog";
import { AnalyzedFilesCard } from "./cards/AnalyzedFilesCard";
import { FormSchemaCard } from "./cards/FormSchemaCard";
import { FormPilotCard } from "./cards/FormPilotCard";

interface ApplicationCardProps {
  className?: string;
  onOpenVisaDialog: () => void;
}

// Header component with visa type display and action buttons
function ApplicationHeader({
  onOpenVisaDialog,
}: {
  onOpenVisaDialog: () => void;
}) {
  const selectedVisaType = useCaseDetailStore(
    (state) => state.selectedVisaType,
  );
  const isAnalyzingDocuments = useCaseDetailStore(
    (state) => state.isAnalyzingDocuments,
  );
  const lastAnalysisAt = useCaseDetailStore((state) => state.lastAnalysisAt);
  const analysisProgress = useCaseDetailStore((state) => state.analysisProgress);

  const visaConfig = selectedVisaType ? getVisaConfig(selectedVisaType) : null;

  // Format time ago
  const getTimeAgo = () => {
    if (!lastAnalysisAt) return null;
    const diff = Date.now() - new Date(lastAnalysisAt).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  // State: No visa type selected
  if (!selectedVisaType) {
    return (
      <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-stone-800">Application</h3>
          <p className="text-xs text-stone-400 mt-0.5">
            Select visa type to begin
          </p>
        </div>
        <button
          onClick={onOpenVisaDialog}
          className={cn(
            "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
            "bg-[#0E4268] text-white hover:bg-[#0a3555]",
            "flex items-center gap-1.5",
          )}
        >
          Select Visa Type
          <ChevronRight className="size-3.5" />
        </button>
      </div>
    );
  }

  // State: Analyzing documents
  if (isAnalyzingDocuments) {
    return (
      <div className="px-4 py-3 border-b border-stone-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {visaConfig && (
              <>
                <div
                  className={cn(
                    "size-8 rounded-lg flex items-center justify-center",
                    visaConfig.bgColor,
                  )}
                >
                  <visaConfig.icon size={16} className={visaConfig.color} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-stone-800">
                    {visaConfig.shortName}
                  </h3>
                  <p className="text-xs text-stone-400">
                    Processing: {visaConfig.processingTime}
                  </p>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-[#0E4268]">
            <Loader2 className="size-3.5 animate-spin" />
            <span>Analyzing... {analysisProgress}%</span>
          </div>
        </div>
      </div>
    );
  }

  // State: Analysis completed
  if (lastAnalysisAt) {
    return (
      <div className="px-4 py-3 border-b border-stone-100">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-3">
            {visaConfig && (
              <>
                <div
                  className={cn(
                    "size-8 rounded-lg flex items-center justify-center",
                    visaConfig.bgColor,
                  )}
                >
                  <visaConfig.icon size={16} className={visaConfig.color} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-stone-800">
                    {visaConfig.shortName}
                  </h3>
                  <p className="text-xs text-stone-400">
                    Processing: {visaConfig.processingTime}
                  </p>
                </div>
              </>
            )}
          </div>
          <button
            onClick={onOpenVisaDialog}
            className="text-xs text-stone-500 hover:text-stone-700 transition-colors"
          >
            Change Visa
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-600">
          <div className="size-1.5 rounded-full bg-emerald-500" />
          <span>Analysis completed</span>
          <span className="text-stone-400">·</span>
          <span className="text-stone-500 flex items-center gap-1">
            <Clock className="size-3" />
            {getTimeAgo()}
          </span>
        </div>
      </div>
    );
  }

  // State: Visa selected but not analyzed
  return (
    <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {visaConfig && (
          <>
            <div
              className={cn(
                "size-8 rounded-lg flex items-center justify-center",
                visaConfig.bgColor,
              )}
            >
              <visaConfig.icon size={16} className={visaConfig.color} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-stone-800">
                {visaConfig.shortName}
              </h3>
              <p className="text-xs text-stone-400">
                Processing: {visaConfig.processingTime}
              </p>
            </div>
          </>
        )}
      </div>
      <button
        onClick={onOpenVisaDialog}
        className={cn(
          "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
          "bg-[#0E4268] text-white hover:bg-[#0a3555]",
          "flex items-center gap-1.5",
        )}
      >
        Run Analysis
        <ChevronRight className="size-3.5" />
      </button>
    </div>
  );
}

// Empty state component - shown when no analysis has been done
function ApplicationEmptyState() {
  const selectedVisaType = useCaseDetailStore(
    (state) => state.selectedVisaType,
  );
  const documentGroups = useCaseDetailStore((state) => state.documentGroups);

  // Check if there are reviewed documents ready for analysis
  const hasReviewedDocs = documentGroups.some(
    (g) => g.id !== "unclassified" && g.status === "reviewed" && g.files.some((f) => !f.isRemoved)
  );

  // No visa type selected yet
  if (!selectedVisaType) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="size-14 rounded-2xl bg-stone-100 flex items-center justify-center mb-4">
          <FileSearch className="size-7 text-stone-400" />
        </div>
        <h4 className="text-sm font-medium text-stone-700 mb-1.5 text-balance text-center">
          Ready to Build Your Application
        </h4>
        <p className="text-xs text-stone-500 text-center text-pretty max-w-sm">
          Select a visa type from the button above to start analyzing your documents and auto-fill the application form.
        </p>
      </div>
    );
  }

  // Visa selected but no reviewed documents
  if (!hasReviewedDocs) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="size-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
          <FileSearch className="size-7 text-amber-500" />
        </div>
        <h4 className="text-sm font-medium text-stone-700 mb-1.5 text-balance text-center">
          Review Documents First
        </h4>
        <p className="text-xs text-stone-500 text-center text-pretty max-w-sm">
          Review and confirm your uploaded documents in File Hub before running the analysis.
        </p>
      </div>
    );
  }

  // Visa selected and has reviewed docs - ready to analyze
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      <div className="size-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
        <Sparkles className="size-7 text-emerald-500" />
      </div>
      <h4 className="text-sm font-medium text-stone-700 mb-1.5 text-balance text-center">
        Documents Ready for Analysis
      </h4>
      <p className="text-xs text-stone-500 text-center text-pretty max-w-sm">
        Your documents are reviewed. Click "Run Analysis" above to extract information and auto-fill the application form.
      </p>
    </div>
  );
}

// Skeleton loading state for the cards
function ApplicationCardsSkeleton() {
  return (
    <div className="flex-1 min-h-0 p-4">
      <div className="grid grid-cols-3 gap-3 h-full">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-lg border border-stone-200 bg-white overflow-hidden flex flex-col"
          >
            {/* Header skeleton */}
            <div className="px-3 py-2.5 border-b border-stone-100 bg-stone-50/50">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded bg-stone-200 animate-pulse" />
                <div className="h-3 w-16 bg-stone-200 rounded animate-pulse" />
              </div>
            </div>
            {/* Content skeleton */}
            <div className="flex-1 p-3">
              <div className="space-y-3">
                <div className="h-6 w-12 bg-stone-100 rounded animate-pulse" />
                <div className="h-4 w-24 bg-stone-100 rounded animate-pulse" />
                <div className="space-y-2 pt-2">
                  <div className="h-3 bg-stone-100 rounded animate-pulse" style={{ width: "80%" }} />
                  <div className="h-3 bg-stone-100 rounded animate-pulse" style={{ width: "60%" }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ApplicationCard({
  className,
  onOpenVisaDialog,
}: ApplicationCardProps) {
  const lastAnalysisAt = useCaseDetailStore((state) => state.lastAnalysisAt);
  const isAnalyzing = useCaseDetailStore((state) => state.isAnalyzingDocuments);

  return (
    <div
      className={cn(
        "rounded-xl border border-stone-200 bg-white overflow-hidden flex flex-col",
        className,
      )}
    >
      {/* Header - Always visible */}
      <ApplicationHeader onOpenVisaDialog={onOpenVisaDialog} />

      {/* Content area - conditionally render based on analysis state */}
      {isAnalyzing ? (
        <ApplicationCardsSkeleton />
      ) : lastAnalysisAt ? (
        /* Three Cards Grid - Only show after analysis is completed */
        <div className="flex-1 min-h-0 p-4">
          <div className="grid grid-cols-3 gap-3 h-full">
            <AnalyzedFilesCard />
            <FormSchemaCard />
            <FormPilotCard />
          </div>
        </div>
      ) : (
        /* Empty state - Show when no analysis has been done */
        <ApplicationEmptyState />
      )}
    </div>
  );
}
