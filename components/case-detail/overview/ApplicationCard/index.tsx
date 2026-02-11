"use client";

import { useMemo } from "react";
import {
  ChevronRight,
  Loader2,
  FileSearch,
  FileText,
  ClipboardCheck,
  FileStack,
  LayoutGrid,
  Play,
  ExternalLink,
  Maximize2,
} from "lucide-react";
import {
  useCaseDetailStore,
  useHasNewFilesAfterAnalysis,
  useNewFilesCount,
  useEnhancedChecklistItems,
  useAnalyzedFiles,
} from "@/store/case-detail-store";
import { cn } from "@/lib/utils";
import { getVisaConfig } from "./VisaTypeDialog";

interface ApplicationCardProps {
  className?: string;
  onStartAnalysis?: () => void;
}

// Header component - shows status only (no action buttons)
function ApplicationHeader() {
  const selectedVisaType = useCaseDetailStore((state) => state.selectedVisaType);
  const isAnalyzingDocuments = useCaseDetailStore((state) => state.isAnalyzingDocuments);
  const isLoadingDocuments = useCaseDetailStore((state) => state.isLoadingDocuments);
  const lastAnalysisAt = useCaseDetailStore((state) => state.lastAnalysisAt);
  const analysisProgress = useCaseDetailStore((state) => state.analysisProgress);
  const hasNewFilesAfterAnalysis = useHasNewFilesAfterAnalysis();
  const newFilesCount = useNewFilesCount();

  const visaConfig = selectedVisaType ? getVisaConfig(selectedVisaType) : null;

  // Analyzing state
  if (isAnalyzingDocuments) {
    return (
      <div className="shrink-0 h-12 px-4 flex items-center justify-between bg-stone-50 border-b border-stone-200">
        <div className="flex items-center gap-2">
          {visaConfig && (
            <>
              <div className={cn("size-8 rounded-lg flex items-center justify-center", visaConfig.bgColor)}>
                <visaConfig.icon size={16} className={visaConfig.color} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-stone-800">{visaConfig.shortName}</h3>
                <div className="flex items-center gap-1.5 text-xs">
                  <Loader2 className="size-3.5 animate-spin text-[#0E4268]" />
                  <span className="text-[#0E4268] tabular-nums">Analyzing... {analysisProgress}%</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Analysis completed - show status
  if (lastAnalysisAt) {
    return (
      <div className="shrink-0 h-12 px-4 flex items-center bg-stone-50 border-b border-stone-200">
        {/* Left: Visa type + Status */}
        <div className="flex items-center gap-2">
          {visaConfig && (
            <>
              <div className={cn("size-8 rounded-lg flex items-center justify-center", visaConfig.bgColor)}>
                <visaConfig.icon size={16} className={visaConfig.color} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-stone-800">{visaConfig.shortName}</h3>
                {/* Status: All files analyzed vs Update available */}
                <div className="flex items-center gap-1.5 text-xs">
                  {hasNewFilesAfterAnalysis ? (
                    <>
                      <div className="size-1.5 rounded-full bg-amber-500" />
                      <span className="text-amber-600">Update available</span>
                      {newFilesCount > 0 && (
                        <span className="px-1 py-0.5 rounded bg-amber-100 text-amber-700 text-[10px] font-medium tabular-nums">
                          +{newFilesCount}
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="size-1.5 rounded-full bg-emerald-500" />
                      <span className="text-emerald-600">All files analyzed</span>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Visa selected but not analyzed - show status
  return (
    <div className="shrink-0 h-12 px-4 flex items-center bg-stone-50 border-b border-stone-200">
      <div className="flex items-center gap-2">
        {visaConfig && (
          <>
            <div className={cn("size-8 rounded-lg flex items-center justify-center", visaConfig.bgColor)}>
              <visaConfig.icon size={16} className={visaConfig.color} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-800">{visaConfig.shortName}</h3>
              {isLoadingDocuments ? (
                <div className="flex items-center gap-1.5 text-xs">
                  <Loader2 className="size-3.5 animate-spin text-stone-400" />
                  <span className="text-stone-500">Processing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs">
                  <div className="size-1.5 rounded-full bg-stone-400" />
                  <span className="text-stone-500">Ready to analyze</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Unified empty state component
function EmptyStateLayout({
  icon: Icon,
  iconBgClass,
  iconClass,
  title,
  description,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  iconBgClass: string;
  iconClass: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className={cn("size-12 rounded-xl flex items-center justify-center mb-3", iconBgClass)}>
        <Icon className={cn("size-6", iconClass)} />
      </div>
      <h4 className="text-sm font-semibold text-stone-700 mb-1 text-balance text-center">
        {title}
      </h4>
      <p className="text-sm text-stone-500 text-center text-pretty max-w-xs leading-relaxed">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// Empty state - before analysis
function ApplicationEmptyState({ onStartAnalysis }: { onStartAnalysis?: () => void }) {
  const documentGroups = useCaseDetailStore((state) => state.documentGroups);

  const hasReviewedDocs = documentGroups.some(
    (g) => g.id !== "unclassified" && g.status === "reviewed" && g.files.some((f) => !f.isRemoved)
  );

  // No reviewed documents yet
  if (!hasReviewedDocs) {
    return (
      <EmptyStateLayout
        icon={FileSearch}
        iconBgClass="bg-amber-50"
        iconClass="text-amber-500"
        title="Review Documents First"
        description="Review and confirm your uploaded documents before running gap analysis."
      />
    );
  }

  // Ready to analyze
  return (
    <EmptyStateLayout
      icon={FileSearch}
      iconBgClass="bg-emerald-50"
      iconClass="text-emerald-500"
      title="Documents Ready"
      description="Your documents are reviewed and ready for gap analysis."
      action={
        onStartAnalysis && (
          <button
            onClick={onStartAnalysis}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-[#0E4268] text-white hover:bg-[#0a3555] transition-colors flex items-center gap-2"
          >
            Run Gap Analysis
            <ChevronRight className="size-4" />
          </button>
        )
      }
    />
  );
}

// Analyzing skeleton
function AnalyzingSkeleton() {
  return (
    <div className="flex-1 flex">
      {/* Sidebar skeleton */}
      <div className="w-48 shrink-0 border-r border-stone-200 p-3 space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-2 p-2">
            <div className="size-4 rounded-full bg-stone-200 animate-pulse" />
            <div className="flex-1 space-y-1">
              <div className="h-3 bg-stone-200 rounded animate-pulse" style={{ width: `${60 + i * 5}%` }} />
              <div className="h-2 bg-stone-100 rounded animate-pulse w-8" />
            </div>
          </div>
        ))}
      </div>
      {/* Main content skeleton */}
      <div className="flex-1 p-4">
        <div className="h-4 bg-stone-200 rounded animate-pulse w-32 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-stone-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

// Ready state dashboard - shown after case assessment is completed
function ApplicationReadyDashboard() {
  const analyzedFiles = useAnalyzedFiles();
  const enhancedItems = useEnhancedChecklistItems();
  const setActiveNav = useCaseDetailStore((state) => state.setActiveNav);

  // Calculate completeness percentage
  const completePercent = useMemo(() => {
    if (enhancedItems.length === 0) return 0;
    const completed = enhancedItems.filter((i) => i.status === "complete").length;
    return Math.round((completed / enhancedItems.length) * 100);
  }, [enhancedItems]);

  const docCount = analyzedFiles.length;

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="shrink-0 px-5 pt-5 pb-4">
        <h3 className="text-base font-semibold text-stone-900">Application</h3>
        <div className="flex items-center gap-1.5 mt-0.5">
          <div className="size-2 rounded-full bg-emerald-500" />
          <span className="text-sm text-emerald-600 font-medium">Ready</span>
        </div>
      </div>

      {/* Three cards */}
      <div className="flex-1 px-5 pb-5">
        <div className="grid grid-cols-3 gap-4 h-full">
          {/* SOURCE DOCUMENTS */}
          <button
            onClick={() => setActiveNav("application")}
            className="flex flex-col border border-stone-200 rounded-xl p-4 hover:border-stone-300 hover:bg-stone-50/50 transition-colors text-left group"
          >
            <div className="flex items-center justify-between w-full mb-auto">
              <div className="flex items-center gap-2">
                <FileStack className="size-4 text-stone-400" />
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                  Source Documents
                </span>
              </div>
            </div>
            <div className="mt-3 flex items-end justify-between">
              <div>
                <p className="text-2xl font-semibold text-stone-900">{docCount}</p>
                <p className="text-sm text-stone-400 mt-0.5">documents analyzed</p>
              </div>
              <ChevronRight className="size-5 text-stone-300 group-hover:text-stone-400 transition-colors mb-1" />
            </div>
          </button>

          {/* COMPLETENESS */}
          <button
            onClick={() => setActiveNav("application")}
            className="flex flex-col border border-stone-200 rounded-xl p-4 hover:border-stone-300 hover:bg-stone-50/50 transition-colors text-left group"
          >
            <div className="flex items-center justify-between w-full mb-auto">
              <div className="flex items-center gap-2">
                <LayoutGrid className="size-4 text-stone-400" />
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                  Completeness
                </span>
              </div>
              <Maximize2 className="size-4 text-stone-300 group-hover:text-stone-400 transition-colors" />
            </div>
            <div className="mt-3">
              <p className="text-2xl font-semibold text-stone-900">{completePercent}%</p>
              <div className="mt-2 h-2 rounded-full overflow-hidden bg-stone-200">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${completePercent}%` }}
                />
              </div>
            </div>
          </button>

          {/* FORM PILOT */}
          <button
            onClick={() => setActiveNav("application")}
            className="flex flex-col border border-stone-200 rounded-xl p-4 hover:border-stone-300 hover:bg-stone-50/50 transition-colors text-left group"
          >
            <div className="flex items-center justify-between w-full mb-auto">
              <div className="flex items-center gap-2">
                <Play className="size-4 text-stone-400" />
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                  Form Pilot
                </span>
              </div>
              <ExternalLink className="size-4 text-stone-300 group-hover:text-stone-400 transition-colors" />
            </div>
            <div className="mt-3">
              <div className="flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-emerald-500" />
                <span className="text-base font-semibold text-emerald-600">Ready to Launch</span>
              </div>
              <p className="text-sm text-stone-400 mt-0.5">Click to start</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export function ApplicationCard({ className, onStartAnalysis }: ApplicationCardProps) {
  const lastAnalysisAt = useCaseDetailStore((state) => state.lastAnalysisAt);
  const isAnalyzing = useCaseDetailStore((state) => state.isAnalyzingDocuments);
  const selectedVisaType = useCaseDetailStore((state) => state.selectedVisaType);
  const questionnaireAnswers = useCaseDetailStore((state) => state.questionnaireAnswers);

  // Check if questionnaire needs to be shown
  const needsQuestionnaire = selectedVisaType && Object.keys(questionnaireAnswers).length === 0;
  // Assessment completed = has analysis + has questionnaire answers
  const assessmentCompleted = lastAnalysisAt && !needsQuestionnaire;

  const setActiveNav = useCaseDetailStore((state) => state.setActiveNav);

  return (
    <div className={cn("flex flex-col border border-stone-200 bg-white rounded-xl overflow-hidden", className)}>
      {/* Content */}
      {isAnalyzing ? (
        <>
          <div className="shrink-0 sticky top-0 z-10 bg-white">
            <ApplicationHeader />
          </div>
          <AnalyzingSkeleton />
        </>
      ) : needsQuestionnaire && selectedVisaType ? (
        <>
          <div className="shrink-0 sticky top-0 z-10 bg-white">
            <ApplicationHeader />
          </div>
          {/* Assessment pending - show empty state directing to Application page */}
          <EmptyStateLayout
            icon={ClipboardCheck}
            iconBgClass="bg-[#0E4268]/10"
            iconClass="text-[#0E4268]"
            title="Complete Case Assessment"
            description="Answer a few questions about the applicant to generate a personalized application checklist."
            action={
              <button
                onClick={() => setActiveNav("application")}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-[#0E4268] text-white hover:bg-[#0a3555] transition-colors flex items-center gap-2"
              >
                Start Assessment
                <ChevronRight className="size-4" />
              </button>
            }
          />
        </>
      ) : assessmentCompleted ? (
        /* Ready dashboard with three cards */
        <ApplicationReadyDashboard />
      ) : (
        <>
          <div className="shrink-0 sticky top-0 z-10 bg-white">
            <ApplicationHeader />
          </div>
          {/* Empty state */}
          <ApplicationEmptyState onStartAnalysis={onStartAnalysis} />
        </>
      )}
    </div>
  );
}
