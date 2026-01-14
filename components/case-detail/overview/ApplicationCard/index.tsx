"use client";

import { ChevronRight, Loader2, FileSearch, Sparkles, RefreshCw } from "lucide-react";
import { useCaseDetailStore, useHasNewFilesAfterAnalysis } from "@/store/case-detail-store";
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
  const startAnalysis = useCaseDetailStore((state) => state.startAnalysis);
  const hasNewFilesAfterAnalysis = useHasNewFilesAfterAnalysis();

  const visaConfig = selectedVisaType ? getVisaConfig(selectedVisaType) : null;

  // State: No visa type selected
  if (!selectedVisaType) {
    return (
      <div className="shrink-0 h-14 px-4 flex items-center justify-between bg-stone-50 border-b border-stone-200">
        <div>
          <h3 className="text-sm font-semibold text-stone-800">Application</h3>
          <p className="text-[10px] text-stone-400">
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
      <div className="shrink-0 h-14 px-4 flex items-center justify-between bg-stone-50 border-b border-stone-200">
        <div className="flex items-center gap-2">
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
                <h3 className="text-sm font-semibold text-stone-800">
                  {visaConfig.shortName}
                </h3>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <Loader2 className="size-3 animate-spin text-[#0E4268]" />
                  <span className="text-[#0E4268]">Analyzing... {analysisProgress}%</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // State: Analysis completed but new files available
  if (lastAnalysisAt && hasNewFilesAfterAnalysis) {
    return (
      <div className="shrink-0 h-14 px-4 flex items-center justify-between bg-stone-50 border-b border-stone-200">
        <div className="flex items-center gap-2">
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
                <h3 className="text-sm font-semibold text-stone-800">
                  {visaConfig.shortName}
                </h3>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <div className="size-1.5 rounded-full bg-amber-500" />
                  <span className="text-amber-600">Update available</span>
                </div>
              </div>
            </>
          )}
        </div>
        <button
          onClick={() => startAnalysis()}
          className={cn(
            "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
            "border border-[#0E4268] text-[#0E4268] bg-transparent",
            "hover:bg-[#0E4268]/5",
            "flex items-center gap-1.5",
          )}
        >
          Re-analyze
          <RefreshCw className="size-3.5" />
        </button>
      </div>
    );
  }

  // State: Analysis completed
  if (lastAnalysisAt) {
    return (
      <div className="shrink-0 h-14 px-4 flex items-center bg-stone-50 border-b border-stone-200">
        <div className="flex items-center gap-2">
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
                <h3 className="text-sm font-semibold text-stone-800">
                  {visaConfig.shortName}
                </h3>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <div className="size-1.5 rounded-full bg-emerald-500" />
                  <span className="text-emerald-600">Ready</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // State: Visa selected but not analyzed
  return (
    <div className="shrink-0 h-14 px-4 flex items-center justify-between bg-stone-50 border-b border-stone-200">
      <div className="flex items-center gap-2">
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
              <h3 className="text-sm font-semibold text-stone-800">
                {visaConfig.shortName}
              </h3>
              <p className="text-[10px] text-stone-400">
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
