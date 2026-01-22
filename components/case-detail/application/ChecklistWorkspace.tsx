"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  ChevronRight,
  Play,
} from "lucide-react";
import {
  useCaseDetailStore,
  useEnhancedChecklistItems,
  useEnhancedQualityIssues,
  useIssueCounts,
} from "@/store/case-detail-store";
import { cn } from "@/lib/utils";
import { ChecklistSectionType, EnhancedChecklistItem } from "@/types/case-detail";
import { getVisaConfig } from "./ApplicationLandingPage";
import { ChecklistSidebar } from "./checklist/ChecklistSidebar";
import { ChecklistDetailPanel } from "./checklist/ChecklistDetailPanel";
import { ForwardToClientModal } from "./issues/ForwardToClientModal";

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

// Header component with progress and issue counts
function WorkspaceHeader() {
  const selectedVisaType = useCaseDetailStore((state) => state.selectedVisaType);
  const enhancedItems = useEnhancedChecklistItems();
  const issueCounts = useIssueCounts();
  const launchFormPilot = useCaseDetailStore((state) => state.launchFormPilot);

  const visaConfig = selectedVisaType ? getVisaConfig(selectedVisaType) : null;

  // Calculate progress
  const completedCount = enhancedItems.filter(
    (item) => item.status === "complete"
  ).length;
  const totalCount = enhancedItems.length;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Total issues
  const totalIssues = issueCounts.errors + issueCounts.warnings + issueCounts.info;

  // Form Pilot ready check
  const canLaunchFormPilot = issueCounts.errors === 0 && progressPercent >= 80;

  return (
    <div className="shrink-0 h-14 px-4 flex items-center justify-between bg-stone-50 border-b border-stone-200">
      {/* Left: Visa type badge */}
      <div className="flex items-center gap-3">
        {visaConfig && (
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "size-8 rounded-lg flex items-center justify-center",
                visaConfig.bgColor
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
                <span className="text-emerald-600">Active</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Center: Progress and Issues */}
      <div className="flex items-center gap-6">
        {/* Progress */}
        <div className="flex items-center gap-2">
          <div className="w-24 h-1.5 bg-stone-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-emerald-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <span className="text-xs text-stone-600 tabular-nums">
            {progressPercent}%
          </span>
        </div>

        {/* Issue counts */}
        {totalIssues > 0 && (
          <div className="flex items-center gap-2">
            {issueCounts.errors > 0 && (
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-50">
                <AlertCircle className="size-3 text-rose-500" />
                <span className="text-[10px] font-medium text-rose-600">
                  {issueCounts.errors}
                </span>
              </div>
            )}
            {issueCounts.warnings > 0 && (
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50">
                <Clock className="size-3 text-amber-500" />
                <span className="text-[10px] font-medium text-amber-600">
                  {issueCounts.warnings}
                </span>
              </div>
            )}
            {issueCounts.info > 0 && (
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50">
                <CheckCircle2 className="size-3 text-blue-500" />
                <span className="text-[10px] font-medium text-blue-600">
                  {issueCounts.info}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Form Pilot button */}
      <button
        onClick={launchFormPilot}
        disabled={!canLaunchFormPilot}
        className={cn(
          "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5",
          canLaunchFormPilot
            ? "bg-[#0E4268] text-white hover:bg-[#0a3555]"
            : "bg-stone-100 text-stone-400 cursor-not-allowed"
        )}
      >
        <Play className="size-3.5" />
        Launch Form Pilot
        <ChevronRight className="size-3.5" />
      </button>
    </div>
  );
}

// Empty state when no section is selected
function EmptyDetailPanel() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="size-16 rounded-2xl bg-stone-100 flex items-center justify-center mb-4">
        <FileText className="size-8 text-stone-400" />
      </div>
      <h4 className="text-sm font-medium text-stone-700 mb-1.5">
        Select a Section
      </h4>
      <p className="text-xs text-stone-500 max-w-xs">
        Click on any section in the checklist to view its data fields, source
        documents, and related issues.
      </p>
    </div>
  );
}

// Main workspace component
export function ChecklistWorkspace() {
  const enhancedItems = useEnhancedChecklistItems();
  const enhancedIssues = useEnhancedQualityIssues();

  // Section selection state
  const [selectedSectionId, setSelectedSectionId] =
    useState<ChecklistSectionType | null>(null);

  // Forward modal state
  const forwardModalOpen = useCaseDetailStore((state) => state.forwardModalOpen);
  const forwardModalIssueId = useCaseDetailStore(
    (state) => state.forwardModalIssueId
  );
  const closeForwardModal = useCaseDetailStore(
    (state) => state.closeForwardModal
  );

  // Get the issue being forwarded
  const forwardingIssue = forwardModalIssueId
    ? enhancedIssues.find((i) => i.id === forwardModalIssueId)
    : null;

  // Group items by section
  const sections = useMemo(() => {
    const grouped = new Map<ChecklistSectionType, EnhancedChecklistItem[]>();

    enhancedItems.forEach((item) => {
      const existing = grouped.get(item.section) || [];
      existing.push(item);
      grouped.set(item.section, existing);
    });

    // Convert to array with section info
    return Array.from(grouped.entries()).map(([sectionType, items]) => {
      const config = SECTION_CONFIG[sectionType];
      const completedCount = items.filter((i) => i.status === "complete").length;
      const issuesCount = enhancedIssues.filter(
        (issue) =>
          items.some((item) => item.id === issue.linkedChecklistItemId) &&
          issue.status !== "resolved"
      ).length;

      return {
        id: sectionType,
        title: config.title,
        icon: config.icon,
        items,
        completedCount,
        totalCount: items.length,
        issuesCount,
        isExpanded: true,
      };
    });
  }, [enhancedItems, enhancedIssues]);

  // Get selected section data
  const selectedSection = useMemo(() => {
    if (!selectedSectionId) return null;
    return sections.find((s) => s.id === selectedSectionId) ?? null;
  }, [selectedSectionId, sections]);

  // Get issues for selected section
  const selectedSectionIssues = useMemo(() => {
    if (!selectedSection) return [];
    const sectionItemIds = selectedSection.items.map((item) => item.id);
    return enhancedIssues.filter((issue) =>
      sectionItemIds.includes(issue.linkedChecklistItemId)
    );
  }, [selectedSection, enhancedIssues]);

  // Handle section selection
  const handleSelectSection = (sectionId: ChecklistSectionType) => {
    setSelectedSectionId(sectionId);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <WorkspaceHeader />

      {/* Main content - Left/Right split */}
      <div className="flex-1 flex min-h-0">
        {/* Left Panel - Checklist Sidebar */}
        <ChecklistSidebar
          sections={sections}
          selectedSectionId={selectedSectionId}
          onSelectSection={handleSelectSection}
          enhancedIssues={enhancedIssues}
        />

        {/* Right Panel - Detail View */}
        <div className="flex-1 border-l border-stone-200 flex flex-col min-w-0">
          <AnimatePresence mode="wait">
            {selectedSection ? (
              <motion.div
                key={selectedSection.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="flex-1 flex flex-col min-h-0"
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
                className="flex-1"
              >
                <EmptyDetailPanel />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Forward to Client Modal */}
      {forwardModalOpen && forwardingIssue && (
        <ForwardToClientModal
          issue={forwardingIssue}
          onClose={closeForwardModal}
        />
      )}
    </div>
  );
}
