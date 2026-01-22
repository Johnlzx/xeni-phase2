"use client";

import { useState, useMemo, useEffect } from "react";
import {
  ChevronRight,
  FileSearch,
  CheckCircle2,
  Circle,
  FileText,
  Sparkles,
  Forward,
  RefreshCw,
  ClipboardCheck,
  Check,
  Edit3,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCaseDetailStore,
  useHasNewFilesAfterAnalysis,
  useNewFilesCount,
  useEnhancedChecklistItems,
  useEnhancedQualityIssues,
} from "@/store/case-detail-store";
import { cn } from "@/lib/utils";
import { VisaTypeDialog, getVisaConfig } from "../overview/ApplicationCard/VisaTypeDialog";
import { AnalysisPreviewDialog } from "../overview/ApplicationCard/AnalysisPreviewDialog";
import { ChecklistSectionType, EnhancedChecklistItem, EnhancedQualityIssue } from "@/types/case-detail";
import { ChecklistDetailPanel } from "./checklist/ChecklistDetailPanel";
import { SendChecklistSummaryModal } from "./checklist/SendChecklistSummaryModal";
import { CaseAssessmentForm } from "./CaseAssessmentForm";

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

type SectionData = {
  id: ChecklistSectionType;
  title: string;
  items: EnhancedChecklistItem[];
  completedCount: number;
  totalCount: number;
  missingDataCount: number;
  missingEvidenceCount: number;
};

// Empty state layout component
function EmptyStateLayout({
  icon: Icon,
  iconBgClass,
  iconClass,
  title,
  description,
  action,
}: {
  icon: typeof FileText;
  iconBgClass: string;
  iconClass: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <div className={cn("size-12 rounded-xl flex items-center justify-center mb-3", iconBgClass)}>
        <Icon className={cn("size-6", iconClass)} />
      </div>
      <h3 className="text-base font-semibold text-stone-800 mb-1 text-balance">{title}</h3>
      <p className="text-sm text-stone-500 text-center max-w-xs mb-4 text-pretty">{description}</p>
      {action}
    </div>
  );
}

// Inline header for checklist view (integrated into main content area)
function ChecklistHeader({ onRequestInfo }: { onRequestInfo: () => void }) {
  const [showAnalysisPreview, setShowAnalysisPreview] = useState(false);

  const selectedVisaType = useCaseDetailStore((state) => state.selectedVisaType);
  const documentGroups = useCaseDetailStore((state) => state.documentGroups);
  const reAnalyze = useCaseDetailStore((state) => state.reAnalyze);
  const hasNewFilesAfterAnalysis = useHasNewFilesAfterAnalysis();
  const newFilesCount = useNewFilesCount();
  const launchFormPilot = useCaseDetailStore((state) => state.launchFormPilot);

  const visaConfig = selectedVisaType ? getVisaConfig(selectedVisaType) : null;

  const handleConfirmAnalysis = () => reAnalyze();

  return (
    <div className="shrink-0 px-5 py-3 bg-white border-b border-stone-200">
      <div className="flex items-center justify-between">
        {/* Left: Visa type + Status */}
        <div className="flex items-center gap-4">
          {visaConfig && (
            <div className="flex items-center gap-2.5">
              <div className={cn("size-9 rounded-lg flex items-center justify-center", visaConfig.bgColor)}>
                <visaConfig.icon size={18} className={visaConfig.color} />
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
                        <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-medium tabular-nums">
                          +{newFilesCount} file{newFilesCount > 1 ? "s" : ""}
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
            </div>
          )}
        </div>

        {/* Right: Action buttons */}
        <div className="flex items-center gap-2">
          {/* Re-analyze button - secondary style, shows when there are new files */}
          {hasNewFilesAfterAnalysis && (
            <button
              onClick={() => setShowAnalysisPreview(true)}
              className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="size-3.5" />
              Re-analyze
            </button>
          )}

          {/* Request Info button - secondary action */}
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
      </div>

      {/* Analysis Preview Dialog */}
      <AnalysisPreviewDialog
        open={showAnalysisPreview}
        onOpenChange={setShowAnalysisPreview}
        documentGroups={documentGroups}
        onConfirm={handleConfirmAnalysis}
      />
    </div>
  );
}

// Analyzing skeleton
function AnalyzingSkeleton() {
  return (
    <div className="flex-1 flex">
      {/* Sidebar skeleton */}
      <div className="w-56 shrink-0 border-r border-stone-200 p-3 space-y-2">
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
      <div className="flex-1 p-6">
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

// Application empty state
function ApplicationEmptyState({ onOpenVisaDialog }: { onOpenVisaDialog: () => void }) {
  const selectedVisaType = useCaseDetailStore((state) => state.selectedVisaType);
  const documentGroups = useCaseDetailStore((state) => state.documentGroups);

  const hasReviewedDocs = documentGroups.some(
    (g) => g.id !== "unclassified" && g.status === "reviewed" && g.files.some((f) => !f.isRemoved)
  );

  // No visa type selected
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

// Source badge component for assessment fields
function AssessmentSourceBadge({ source, documentName, isEdited }: { source?: "extracted"; documentName?: string; isEdited: boolean }) {
  if (isEdited) {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-medium text-violet-600 bg-violet-50 border border-violet-100 rounded">
        <Edit3 className="size-2.5" />
        Edited
      </span>
    );
  }

  if (source === "extracted" && documentName) {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-medium text-blue-600 bg-blue-50 border border-blue-100 rounded">
        <FileText className="size-2.5" />
        {documentName}
      </span>
    );
  }

  return null;
}

// Assessment Detail Panel - shows assessment fields in key-value format
function AssessmentDetailPanel({ visaType }: { visaType: import("@/types").VisaType }) {
  const passport = useCaseDetailStore((state) => state.clientProfile.passport);
  const questionnaireAnswers = useCaseDetailStore((state) => state.questionnaireAnswers);
  const submitQuestionnaireAnswers = useCaseDetailStore((state) => state.submitQuestionnaireAnswers);

  // Assessment fields - same as in CaseAssessmentForm but displayed in detail format
  const MAJORITY_ENGLISH_COUNTRIES = [
    "British", "United Kingdom", "UK",
    "United States", "USA", "American",
    "Canada", "Canadian",
    "Australia", "Australian",
    "New Zealand",
    "Ireland", "Irish",
  ];

  const isEnglishNational = passport?.nationality && MAJORITY_ENGLISH_COUNTRIES.some(
    (country) => passport.nationality!.toLowerCase().includes(country.toLowerCase())
  );

  // Field definitions with source tracking
  interface AssessmentField {
    id: string;
    label: string;
    options: { value: string; label: string }[];
    showIf?: { fieldId: string; values: string[] };
    prefilledValue?: string;
    source?: "extracted";
    sourceDocument?: string;
  }

  const fields: AssessmentField[] = [
    {
      id: "current_location",
      label: "Applicant's current location",
      options: [
        { value: "uk", label: "In the UK" },
        { value: "outside", label: "Outside UK" },
      ],
    },
    {
      id: "immigration_status",
      label: "Current immigration status",
      showIf: { fieldId: "current_location", values: ["uk"] },
      options: [
        { value: "leave_to_remain", label: "Valid leave" },
        { value: "section_3c", label: "Section 3C" },
        { value: "overstayer", label: "Overstayer" },
        { value: "visitor", label: "Visitor" },
      ],
    },
    {
      id: "has_dependants",
      label: "Will dependants apply?",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
    {
      id: "dependant_types",
      label: "Types of dependants",
      showIf: { fieldId: "has_dependants", values: ["yes"] },
      options: [
        { value: "partner_only", label: "Partner only" },
        { value: "children_only", label: "Children only" },
        { value: "partner_and_children", label: "Partner & children" },
      ],
    },
    {
      id: "english_exemption",
      label: "English language exemption",
      options: [
        { value: "none", label: "No exemption" },
        { value: "majority_english_national", label: "Majority English country" },
        { value: "degree_in_english", label: "UK degree" },
        { value: "previous_visa", label: "Previous visa" },
      ],
      prefilledValue: isEnglishNational ? "majority_english_national" : undefined,
      source: isEnglishNational ? "extracted" : undefined,
      sourceDocument: isEnglishNational ? `Passport (${passport?.nationality})` : undefined,
    },
    {
      id: "maintenance_exemption",
      label: "Maintenance funds exemption",
      options: [
        { value: "sponsor_certified", label: "Sponsor certified" },
        { value: "12_months_uk", label: "12+ months in UK" },
        { value: "no_exemption", label: "No exemption" },
      ],
    },
    {
      id: "previous_refusals",
      label: "Previous visa refusals",
      options: [
        { value: "none", label: "None" },
        { value: "refusal_only", label: "Refusals only" },
        { value: "deportation", label: "Deportation" },
      ],
    },
    {
      id: "criminal_convictions",
      label: "Criminal convictions",
      options: [
        { value: "none", label: "None" },
        { value: "spent", label: "Spent only" },
        { value: "unspent", label: "Unspent" },
      ],
    },
  ];

  // Skilled Worker specific fields
  if (visaType === "skilled-worker") {
    fields.push(
      {
        id: "shortage_occupation",
        label: "Role on Shortage Occupation List",
        options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" },
          { value: "unsure", label: "Not sure" },
        ],
      },
      {
        id: "new_entrant",
        label: "Qualifies as new entrant",
        options: [
          { value: "yes", label: "Yes (under 26)" },
          { value: "no", label: "No" },
        ],
      },
      {
        id: "phd_relevant",
        label: "Has relevant PhD",
        options: [
          { value: "yes_uk", label: "Yes, UK" },
          { value: "yes_overseas", label: "Yes, overseas STEM" },
          { value: "no", label: "No" },
        ],
      }
    );
  }

  // Original values from store (for change detection)
  const originalValues = useMemo(() => ({ ...questionnaireAnswers }), [questionnaireAnswers]);

  // Local state for editing
  const [values, setValues] = useState<Record<string, string>>(() => ({
    ...questionnaireAnswers,
  }));

  // Sync with store when questionnaireAnswers changes
  useEffect(() => {
    setValues({ ...questionnaireAnswers });
  }, [questionnaireAnswers]);

  // Track edited fields (changed from prefilled/extracted values)
  const editedFieldIds = useMemo(() => {
    const edited = new Set<string>();
    fields.forEach((field) => {
      // If field has prefilled value and current value differs from prefilled
      if (field.prefilledValue && values[field.id] && values[field.id] !== field.prefilledValue) {
        edited.add(field.id);
      }
    });
    return edited;
  }, [values, fields]);

  // Detect unsaved changes
  const hasChanges = useMemo(() => {
    return Object.keys(values).some((key) => values[key] !== originalValues[key]);
  }, [values, originalValues]);

  // Count changed fields
  const changedFieldIds = useMemo(() => {
    const ids = new Set<string>();
    Object.keys(values).forEach((key) => {
      if (values[key] !== originalValues[key]) {
        ids.add(key);
      }
    });
    return ids;
  }, [values, originalValues]);

  // Filter visible fields
  const visibleFields = fields.filter((field) => {
    if (!field.showIf) return true;
    const dependentValue = values[field.showIf.fieldId];
    return field.showIf.values.includes(dependentValue);
  });

  // Calculate completion
  const completedCount = visibleFields.filter((f) => values[f.id]).length;

  const handleFieldChange = (fieldId: string, value: string) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSave = () => {
    submitQuestionnaireAnswers(values);
  };

  const handleCancel = () => {
    setValues({ ...originalValues });
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Section Header */}
      <div className="shrink-0 px-6 py-3 border-b border-stone-100">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <h2 className="text-base font-semibold text-stone-900">Case Assessment</h2>
            <span className="text-xs text-stone-400 tabular-nums">
              {completedCount}/{visibleFields.length} complete
            </span>
          </div>
          {/* Status */}
          {visibleFields.length - completedCount > 0 && (
            <span className="text-xs text-stone-500 tabular-nums">
              {visibleFields.length - completedCount} field{visibleFields.length - completedCount > 1 ? "s" : ""} needed
            </span>
          )}
        </div>
      </div>

      {/* Fields - Two column grid */}
      <div className="flex-1 min-h-0 overflow-auto">
        <div className="px-6 py-5">
          <div className="grid grid-cols-2 gap-x-6 gap-y-1">
            {visibleFields.map((field) => {
              const value = values[field.id] || "";
              const hasValue = !!value;
              const selectedOption = field.options.find((o) => o.value === value);
              const isEditedFromExtracted = editedFieldIds.has(field.id);
              const isExtracted = field.source === "extracted" && value === field.prefilledValue;

              // All assessment fields are required
              const isRequired = true;

              return (
                <div
                  key={field.id}
                  className={cn(
                    "group py-3 px-3 rounded-lg transition-colors",
                    !hasValue && isRequired && "bg-amber-50/30"
                  )}
                >
                  {/* Label row with status and source badge */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className={cn(
                        "shrink-0 size-1.5 rounded-full",
                        hasValue ? "bg-emerald-500" : isRequired ? "bg-amber-400" : "bg-stone-300"
                      )} />
                      <label className="text-[11px] font-medium text-stone-600 leading-tight truncate">
                        {field.label}
                      </label>
                    </div>
                    {hasValue && (
                      <AssessmentSourceBadge
                        source={field.source}
                        documentName={field.sourceDocument}
                        isEdited={isEditedFromExtracted}
                      />
                    )}
                  </div>

                  {/* Select dropdown - styled to match text input in ChecklistDetailPanel */}
                  <Select value={value} onValueChange={(v) => handleFieldChange(field.id, v)}>
                    <SelectTrigger className={cn(
                      "w-full",
                      !hasValue && "bg-stone-50"
                    )}>
                      <SelectValue placeholder={isRequired ? "Required" : "Optional"} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer - only show when changes detected */}
      {hasChanges && (
        <div className="shrink-0 px-6 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <p className="text-xs text-stone-500">
            {changedFieldIds.size} field{changedFieldIds.size !== 1 ? "s" : ""} modified
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-[#0E4268] hover:bg-[#0a3555] rounded-lg transition-colors flex items-center gap-1.5"
            >
              <RefreshCw size={14} />
              Regenerate Checklist
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Checklist sidebar item
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

  // Build status description
  const getStatusText = () => {
    if (isComplete) return null;

    const parts: string[] = [];
    if (hasMissingData) {
      parts.push(`${section.missingDataCount} field${section.missingDataCount > 1 ? "s" : ""}`);
    }
    if (hasMissingEvidence) {
      parts.push(`${section.missingEvidenceCount} doc${section.missingEvidenceCount > 1 ? "s" : ""}`);
    }
    return parts.join(", ") + " needed";
  };

  const statusText = getStatusText();

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
          "text-sm font-medium truncate",
          isSelected ? "text-[#0E4268]" : "text-stone-700"
        )}>
          {section.title}
        </p>
        {/* Status description */}
        <p className={cn(
          "text-[10px] truncate",
          isComplete ? "text-emerald-600" : hasMissingEvidence ? "text-amber-600" : "text-stone-400"
        )}>
          {isComplete ? "Complete" : statusText}
        </p>
      </div>
    </button>
  );
}

export function ApplicationPage() {
  const [visaDialogOpen, setVisaDialogOpen] = useState(false);

  const lastAnalysisAt = useCaseDetailStore((state) => state.lastAnalysisAt);
  const isAnalyzing = useCaseDetailStore((state) => state.isAnalyzingDocuments);
  const selectedVisaType = useCaseDetailStore((state) => state.selectedVisaType);
  const questionnaireAnswers = useCaseDetailStore((state) => state.questionnaireAnswers);
  const enhancedItems = useEnhancedChecklistItems();
  const enhancedIssues = useEnhancedQualityIssues();

  const [selectedSectionId, setSelectedSectionId] = useState<ChecklistSectionType | "assessment" | null>(null);
  const [showSendSummaryModal, setShowSendSummaryModal] = useState(false);

  // Check if questionnaire needs to be shown - show when visa is selected but questionnaire not completed
  const needsQuestionnaire = selectedVisaType && Object.keys(questionnaireAnswers).length === 0;
  const hasAnsweredQuestionnaire = Object.keys(questionnaireAnswers).length > 0;

  const handleOpenVisaDialog = () => setVisaDialogOpen(true);

  // Group items by section
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

  return (
    <div className="h-full flex flex-col bg-stone-100 overflow-hidden">
      {/* Content - no top header bar, header is integrated into main content */}
      <div className="flex-1 flex min-h-0 overflow-hidden gap-3 p-4">
        {isAnalyzing ? (
          <div className="flex-1 bg-white rounded-xl border border-stone-200 overflow-hidden">
            <AnalyzingSkeleton />
          </div>
        ) : needsQuestionnaire && selectedVisaType ? (
          /* Case Assessment - structured form with pre-filled data */
          <CaseAssessmentForm visaType={selectedVisaType} />
        ) : lastAnalysisAt ? (
          <>
            {/* Checklist Sidebar - rounded container */}
            <div className="w-56 shrink-0 bg-white rounded-xl border border-stone-200 flex flex-col overflow-hidden">
              {/* Checklist header with progress bar */}
              <div className="shrink-0 px-4 py-3 border-b border-stone-100">
                <h4 className="text-xs font-semibold text-stone-600 uppercase tracking-wide mb-2">Checklist</h4>

                {/* Progress bar */}
                {(() => {
                  const totalItems = sections.reduce((acc, s) => acc + s.totalCount, 0);
                  const totalComplete = sections.reduce((acc, s) => acc + s.completedCount, 0);
                  const totalMissingData = sections.reduce((acc, s) => acc + s.missingDataCount, 0);
                  const totalMissingEvidence = sections.reduce((acc, s) => acc + s.missingEvidenceCount, 0);

                  const completePercent = totalItems > 0 ? (totalComplete / totalItems) * 100 : 0;

                  return (
                    <>
                      {/* Single color progress bar - data completion only */}
                      <div className="h-2 rounded-full overflow-hidden bg-stone-200 mb-2">
                        <div
                          className="h-full bg-[#0E4268] rounded-full transition-all"
                          style={{ width: `${completePercent}%` }}
                        />
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-stone-600 font-medium">{Math.round(completePercent)}% Complete</span>
                        <div className="flex items-center gap-2">
                          {totalMissingData > 0 && (
                            <span className="flex items-center gap-1 text-stone-400">
                              <span className="size-1.5 rounded-full bg-stone-400" />
                              {totalMissingData}
                            </span>
                          )}
                          {totalMissingEvidence > 0 && (
                            <span className="flex items-center gap-1 text-amber-600">
                              <span className="size-1.5 rounded-full bg-amber-500" />
                              {totalMissingEvidence}
                            </span>
                          )}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
              {/* Checklist items - scrollable if needed */}
              <div className="flex-1 overflow-y-auto">
                {/* Case Assessment - permanent item */}
                <button
                  onClick={() => setSelectedSectionId("assessment")}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2.5 text-left transition-colors border-l-2",
                    selectedSectionId === "assessment"
                      ? "bg-stone-100 border-[#0E4268]"
                      : "hover:bg-stone-50 border-transparent"
                  )}
                >
                  <div className={cn(
                    "shrink-0 size-6 rounded flex items-center justify-center",
                    hasAnsweredQuestionnaire
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-[#0E4268]/10 text-[#0E4268]"
                  )}>
                    <ClipboardCheck className="size-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm font-medium truncate",
                      selectedSectionId === "assessment" ? "text-[#0E4268]" : "text-stone-700"
                    )}>
                      Case Assessment
                    </p>
                    <div className="flex items-center gap-2 text-[10px] tabular-nums">
                      {hasAnsweredQuestionnaire ? (
                        <span className="text-emerald-600">Complete</span>
                      ) : (
                        <span className="text-stone-400">Required</span>
                      )}
                    </div>
                  </div>
                </button>

                {/* Divider */}
                <div className="mx-3 my-1.5 border-t border-stone-100" />

                {/* Regular checklist sections */}
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

            {/* Detail Panel - rounded container with integrated header */}
            <div className="flex-1 flex flex-col bg-white rounded-xl border border-stone-200 overflow-hidden">
              {/* Integrated header - visa info, progress, actions */}
              <ChecklistHeader onRequestInfo={() => setShowSendSummaryModal(true)} />

              {/* Detail content */}
              <div className="flex-1 min-h-0 overflow-hidden">
                {selectedSectionId === "assessment" && selectedVisaType ? (
                  <AssessmentDetailPanel visaType={selectedVisaType} />
                ) : selectedSection ? (
                  <ChecklistDetailPanel
                    sectionTitle={selectedSection.title}
                    sectionId={selectedSection.id}
                    items={selectedSection.items}
                    issues={selectedSectionIssues}
                  />
                ) : (
                  <EmptyDetailPanel />
                )}
              </div>
            </div>
          </>
        ) : (
          /* Empty state - rounded container */
          <div className="flex-1 bg-white rounded-xl border border-stone-200 overflow-hidden">
            <ApplicationEmptyState onOpenVisaDialog={handleOpenVisaDialog} />
          </div>
        )}
      </div>

      {/* Send Summary to Client Modal */}
      {showSendSummaryModal && (
        <SendChecklistSummaryModal
          items={enhancedItems}
          issues={enhancedIssues}
          onClose={() => setShowSendSummaryModal(false)}
        />
      )}

      {/* Visa Type Dialog */}
      <VisaTypeDialog open={visaDialogOpen} onOpenChange={setVisaDialogOpen} />
    </div>
  );
}
