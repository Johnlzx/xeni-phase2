"use client";

import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronRight,
  Loader2,
  FileSearch,
  Play,
  CheckCircle2,
  Circle,
  FileText,
  Sparkles,
  Forward,
  RefreshCw,
  ClipboardCheck,
} from "lucide-react";
import {
  useCaseDetailStore,
  useHasNewFilesAfterAnalysis,
  useNewFilesCount,
  useEnhancedChecklistItems,
  useEnhancedQualityIssues,
} from "@/store/case-detail-store";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getVisaConfig } from "./VisaTypeDialog";
import { AnalysisPreviewDialog } from "./AnalysisPreviewDialog";
import { ChecklistSectionType, EnhancedChecklistItem } from "@/types/case-detail";
import { ChecklistDetailPanel } from "../../application/checklist/ChecklistDetailPanel";
import { SendChecklistSummaryModal } from "../../application/checklist/SendChecklistSummaryModal";

// Section configuration
const SECTION_CONFIG: Record<
  ChecklistSectionType,
  { title: string; icon: typeof FileText }
> = {
  personal: { title: "Personal Information", icon: FileText },
  employment: { title: "Employment Details", icon: FileText },
  financial: { title: "Financial Evidence", icon: FileText },
  travel: { title: "Travel History", icon: FileText },
  education: { title: "Education", icon: FileText },
  family: { title: "Family Information", icon: FileText },
  other: { title: "Other Information", icon: FileText },
};

interface SectionData {
  id: ChecklistSectionType;
  title: string;
  items: EnhancedChecklistItem[];
  completedCount: number;
  totalCount: number;
  missingDataCount: number;
  missingEvidenceCount: number;
}

interface ApplicationCardProps {
  className?: string;
  onOpenVisaDialog: () => void;
}

// Header component - synced with ApplicationPage
function ApplicationHeader({
  onOpenVisaDialog,
  onRequestInfo,
}: {
  onOpenVisaDialog: () => void;
  onRequestInfo: () => void;
}) {
  const [showAnalysisPreview, setShowAnalysisPreview] = useState(false);

  const selectedVisaType = useCaseDetailStore((state) => state.selectedVisaType);
  const isAnalyzingDocuments = useCaseDetailStore((state) => state.isAnalyzingDocuments);
  const isLoadingDocuments = useCaseDetailStore((state) => state.isLoadingDocuments);
  const documentGroups = useCaseDetailStore((state) => state.documentGroups);
  const lastAnalysisAt = useCaseDetailStore((state) => state.lastAnalysisAt);
  const analysisProgress = useCaseDetailStore((state) => state.analysisProgress);
  const startAnalysis = useCaseDetailStore((state) => state.startAnalysis);
  const reAnalyze = useCaseDetailStore((state) => state.reAnalyze);
  const hasNewFilesAfterAnalysis = useHasNewFilesAfterAnalysis();
  const newFilesCount = useNewFilesCount();
  const launchFormPilot = useCaseDetailStore((state) => state.launchFormPilot);

  const visaConfig = selectedVisaType ? getVisaConfig(selectedVisaType) : null;

  // Check if there are confirmed documents
  const hasConfirmedDocs = documentGroups.some(
    (g) => g.id !== "unclassified" && g.status === "reviewed" && g.files.some((f) => !f.isRemoved)
  );

  // Button should be disabled when processing or no confirmed docs
  const isRunAnalysisDisabled = isLoadingDocuments || !hasConfirmedDocs;

  // Tooltip message for disabled button
  const getDisabledReason = () => {
    if (isLoadingDocuments) return "Please wait while documents are being processed";
    if (!hasConfirmedDocs) return "Review and confirm documents first";
    return "";
  };

  const handleOpenAnalysisPreview = () => setShowAnalysisPreview(true);
  const handleConfirmAnalysis = () => startAnalysis();
  const handleReAnalyze = () => reAnalyze();

  // No visa type selected
  if (!selectedVisaType) {
    return (
      <div className="shrink-0 h-12 px-4 flex items-center justify-between bg-stone-50 border-b border-stone-200">
        <div>
          <h3 className="text-sm font-semibold text-stone-800">Application</h3>
          <p className="text-xs text-stone-400">Select visa type to begin</p>
        </div>
        <button
          onClick={onOpenVisaDialog}
          className="px-3 py-1.5 text-sm font-medium rounded-lg bg-[#0E4268] text-white hover:bg-[#0a3555] transition-colors flex items-center gap-1.5"
        >
          Select Visa Type
          <ChevronRight className="size-4" />
        </button>
      </div>
    );
  }

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

  // Analysis completed - show status and action buttons
  if (lastAnalysisAt) {
    return (
      <div className="shrink-0 h-12 px-4 flex items-center justify-between bg-stone-50 border-b border-stone-200">
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

        {/* Right: Action buttons */}
        <div className="flex items-center gap-2">
          {/* Re-analyze button */}
          {hasNewFilesAfterAnalysis && (
            <button
              onClick={handleReAnalyze}
              className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="size-3.5" />
              Re-analyze
            </button>
          )}

          {/* Request Info button */}
          <button
            onClick={onRequestInfo}
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors flex items-center gap-1.5"
            aria-label="Request missing information from client"
          >
            <Forward className="size-3.5" />
            Request Info
          </button>

          {/* Form Pilot button */}
          <button
            onClick={launchFormPilot}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#0E4268] text-white hover:bg-[#0a3555] transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="size-3.5" />
            Form Pilot
            <ChevronRight className="size-3.5" />
          </button>
        </div>

        {/* Analysis Preview Dialog for re-analysis */}
        <AnalysisPreviewDialog
          open={showAnalysisPreview}
          onOpenChange={setShowAnalysisPreview}
          documentGroups={documentGroups}
          onConfirm={handleConfirmAnalysis}
        />
      </div>
    );
  }

  // Visa selected but not analyzed - show Run Gap Analysis
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

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <button
                onClick={handleOpenAnalysisPreview}
                disabled={isRunAnalysisDisabled}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5",
                  isRunAnalysisDisabled
                    ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                    : "bg-[#0E4268] text-white hover:bg-[#0a3555]"
                )}
              >
                <Play className="size-4" />
                Run Gap Analysis
              </button>
            </span>
          </TooltipTrigger>
          {isRunAnalysisDisabled && (
            <TooltipContent side="bottom">
              <p className="text-sm">{getDisabledReason()}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      <AnalysisPreviewDialog
        open={showAnalysisPreview}
        onOpenChange={setShowAnalysisPreview}
        documentGroups={documentGroups}
        onConfirm={handleConfirmAnalysis}
      />
    </div>
  );
}

// Checklist sidebar item - synced with ApplicationPage
function ChecklistSidebarItem({
  section,
  isSelected,
  onClick,
}: {
  section: SectionData;
  isSelected: boolean;
  onClick: () => void;
}) {
  const isComplete = section.missingDataCount === 0 && section.missingEvidenceCount === 0;
  const hasMissingData = section.missingDataCount > 0;
  const hasMissingEvidence = section.missingEvidenceCount > 0;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-2 px-3 py-2.5 text-left transition-colors border-l-2",
        isSelected
          ? "bg-stone-100 border-[#0E4268]"
          : "hover:bg-stone-50 border-transparent"
      )}
    >
      {/* Status icon */}
      <div className="shrink-0">
        {isComplete ? (
          <CheckCircle2 className="size-4 text-emerald-500" />
        ) : (
          <Circle className="size-4 text-stone-300" />
        )}
      </div>

      {/* Section info */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-xs font-medium truncate",
          isSelected ? "text-[#0E4268]" : "text-stone-700"
        )}>
          {section.title}
        </p>
        {/* Missing counts */}
        <div className="flex items-center gap-2 text-[10px] tabular-nums">
          {hasMissingData && (
            <span className="text-stone-400">{section.missingDataCount} data</span>
          )}
          {hasMissingEvidence && (
            <span className="text-amber-600">{section.missingEvidenceCount} doc</span>
          )}
          {isComplete && (
            <span className="text-emerald-600">Complete</span>
          )}
        </div>
      </div>
    </button>
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
function ApplicationEmptyState({ onOpenVisaDialog }: { onOpenVisaDialog: () => void }) {
  const selectedVisaType = useCaseDetailStore((state) => state.selectedVisaType);
  const documentGroups = useCaseDetailStore((state) => state.documentGroups);

  const hasReviewedDocs = documentGroups.some(
    (g) => g.id !== "unclassified" && g.status === "reviewed" && g.files.some((f) => !f.isRemoved)
  );

  // No visa type
  if (!selectedVisaType) {
    return (
      <EmptyStateLayout
        icon={FileSearch}
        iconBgClass="bg-stone-100"
        iconClass="text-stone-400"
        title="Ready to Build Your Application"
        description="Select a visa type to start gap analysis and generate your application checklist."
        action={
          <button
            onClick={onOpenVisaDialog}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-[#0E4268] text-white hover:bg-[#0a3555] transition-colors flex items-center gap-2"
          >
            Select Visa Type
            <ChevronRight className="size-4" />
          </button>
        }
      />
    );
  }

  // Visa selected but no reviewed documents
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
      description="Click 'Run Gap Analysis' to identify missing information and generate your application checklist."
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

// Empty detail panel
function EmptyDetailPanel() {
  return (
    <EmptyStateLayout
      icon={FileText}
      iconBgClass="bg-stone-100"
      iconClass="text-stone-400"
      title="Select a Section"
      description="Click on any section to view fields and issues."
    />
  );
}

export function ApplicationCard({ className, onOpenVisaDialog }: ApplicationCardProps) {
  const lastAnalysisAt = useCaseDetailStore((state) => state.lastAnalysisAt);
  const isAnalyzing = useCaseDetailStore((state) => state.isAnalyzingDocuments);
  const selectedVisaType = useCaseDetailStore((state) => state.selectedVisaType);
  const questionnaireAnswers = useCaseDetailStore((state) => state.questionnaireAnswers);
  const enhancedItems = useEnhancedChecklistItems();
  const enhancedIssues = useEnhancedQualityIssues();

  const [selectedSectionId, setSelectedSectionId] = useState<ChecklistSectionType | null>(null);
  const [showSendSummaryModal, setShowSendSummaryModal] = useState(false);

  // Check if questionnaire needs to be shown
  const needsQuestionnaire = selectedVisaType && Object.keys(questionnaireAnswers).length === 0;

  // Group items by section - synced with ApplicationPage
  const sections = useMemo(() => {
    const grouped = new Map<ChecklistSectionType, EnhancedChecklistItem[]>();

    enhancedItems.forEach((item) => {
      const existing = grouped.get(item.section) || [];
      existing.push(item);
      grouped.set(item.section, existing);
    });

    return Array.from(grouped.entries()).map(([sectionType, items]) => {
      const config = SECTION_CONFIG[sectionType];
      const completedCount = items.filter((i) => i.status === "complete").length;

      // Missing data: items without value
      const missingDataCount = items.filter((i) => !i.value).length;

      // Missing evidence: count unique evidence items that are not uploaded
      const evidenceMap = new Map<string, boolean>();
      items.forEach((item) => {
        item.requiredEvidence?.forEach((ev) => {
          if (!evidenceMap.has(ev.id)) {
            evidenceMap.set(ev.id, ev.isUploaded);
          }
        });
      });
      const missingEvidenceCount = Array.from(evidenceMap.values()).filter((uploaded) => !uploaded).length;

      return {
        id: sectionType,
        title: config.title,
        items,
        completedCount,
        totalCount: items.length,
        missingDataCount,
        missingEvidenceCount,
      };
    });
  }, [enhancedItems]);

  const selectedSection = useMemo(() => {
    if (!selectedSectionId) return null;
    return sections.find((s) => s.id === selectedSectionId) ?? null;
  }, [selectedSectionId, sections]);

  const selectedSectionIssues = useMemo(() => {
    if (!selectedSection) return [];
    const sectionItemIds = selectedSection.items.map((item) => item.id);
    return enhancedIssues.filter((issue) => sectionItemIds.includes(issue.linkedChecklistItemId));
  }, [selectedSection, enhancedIssues]);

  // Calculate totals for progress bar
  const totals = useMemo(() => {
    const totalItems = sections.reduce((acc, s) => acc + s.totalCount, 0);
    const totalComplete = sections.reduce((acc, s) => acc + s.completedCount, 0);
    const totalMissingData = sections.reduce((acc, s) => acc + s.missingDataCount, 0);
    const totalMissingEvidence = sections.reduce((acc, s) => acc + s.missingEvidenceCount, 0);
    const completePercent = totalItems > 0 ? (totalComplete / totalItems) * 100 : 0;
    return { totalItems, totalComplete, totalMissingData, totalMissingEvidence, completePercent };
  }, [sections]);

  const setActiveNav = useCaseDetailStore((state) => state.setActiveNav);

  return (
    <div className={cn("flex flex-col border border-stone-200 bg-white rounded-xl overflow-hidden", className)}>
      {/* Header - always show */}
      <div className="shrink-0 sticky top-0 z-10 bg-white">
        <ApplicationHeader
          onOpenVisaDialog={onOpenVisaDialog}
          onRequestInfo={() => setShowSendSummaryModal(true)}
        />
      </div>

      {/* Content */}
      {isAnalyzing ? (
        <AnalyzingSkeleton />
      ) : needsQuestionnaire && selectedVisaType ? (
        /* Assessment pending - show empty state directing to Application page */
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
      ) : lastAnalysisAt ? (
        /* Sidebar + Detail layout */
        <div className="flex-1 flex min-h-0">
          {/* Checklist Sidebar */}
          <div className="w-48 shrink-0 border-r border-stone-200 flex flex-col overflow-hidden">
            {/* Sidebar header with progress bar */}
            <div className="shrink-0 px-3 py-2.5 border-b border-stone-100">
              <h4 className="text-xs font-semibold text-stone-600 uppercase tracking-wide mb-2">Checklist</h4>

              {/* Single color progress bar */}
              <div className="h-2 rounded-full overflow-hidden bg-stone-200 mb-2">
                <div
                  className="h-full bg-[#0E4268] rounded-full transition-all"
                  style={{ width: `${totals.completePercent}%` }}
                />
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-stone-600 font-medium">{Math.round(totals.completePercent)}% Complete</span>
                <div className="flex items-center gap-2">
                  {totals.totalMissingData > 0 && (
                    <span className="flex items-center gap-1 text-stone-400">
                      <span className="size-1.5 rounded-full bg-stone-400" />
                      {totals.totalMissingData}
                    </span>
                  )}
                  {totals.totalMissingEvidence > 0 && (
                    <span className="flex items-center gap-1 text-amber-600">
                      <span className="size-1.5 rounded-full bg-amber-500" />
                      {totals.totalMissingEvidence}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Checklist items - scrollable */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {sections.map((section) => (
                <ChecklistSidebarItem
                  key={section.id}
                  section={section}
                  isSelected={selectedSectionId === section.id}
                  onClick={() => setSelectedSectionId(section.id)}
                />
              ))}
            </div>
          </div>

          {/* Detail Panel */}
          <div className="flex-1 flex flex-col min-w-0 min-h-0">
            <AnimatePresence mode="wait">
              {selectedSection ? (
                <motion.div
                  key={selectedSection.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex flex-col min-h-0 overflow-hidden"
                >
                  <ChecklistDetailPanel
                    sectionTitle={selectedSection.title}
                    sectionId={selectedSection.id}
                    items={selectedSection.items}
                    issues={selectedSectionIssues}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 flex flex-col"
                >
                  <EmptyDetailPanel />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        /* Empty state */
        <ApplicationEmptyState onOpenVisaDialog={onOpenVisaDialog} />
      )}

      {/* Send Summary to Client Modal */}
      {showSendSummaryModal && (
        <SendChecklistSummaryModal
          items={enhancedItems}
          issues={enhancedIssues}
          onClose={() => setShowSendSummaryModal(false)}
        />
      )}
    </div>
  );
}
