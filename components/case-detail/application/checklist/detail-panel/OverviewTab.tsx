"use client";

import { useMemo, useState, useEffect, useRef, Fragment } from "react";
import {
  CheckCircle2,
  FileText,
  Paperclip,
  Check,
  AlertTriangle,
  Plus,
  Sparkles,
  Upload,
  PenLine,
  Loader2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  EnhancedChecklistItem,
  EnhancedQualityIssue,
  RequiredEvidence,
  DocumentGroup,
} from "@/types/case-detail";
import { DocumentUploadModal } from "./DocumentUploadModal";
import { CategoryReviewModal } from "@/components/case-detail/shared/CategoryReviewModal";
import { AddReferenceDocModal } from "@/components/case-detail/shared/AddReferenceDocModal";
import { useCaseDetailStore } from "@/store/case-detail-store";
import { ProgressRing } from "@/components/case-detail/shared/ProgressRing";
import type { DetailTabId } from "./ItemDetailTabs";

// Assessment field interface
interface AssessmentField {
  id: string;
  label: string;
  value: string | null;
  type: "text" | "select" | "radio";
  options?: { value: string; label: string }[];
  isRequired: boolean;
  isConditional?: boolean;
  dependsOn?: { fieldId: string; value: string };
  description?: string;
}

// Field for display (includes both completed and missing)
interface DisplayField {
  id: string;
  label: string;
  value: string | null;
  source: "extracted" | "questionnaire" | "manual" | null;
  sourceDocumentName?: string; // Name of the reference document this was extracted from
  status: "complete" | "missing" | "low_confidence";
  fieldType?: "text" | "select" | "date";
  options?: { value: string; label: string }[];
  confidenceScore?: number;
}

// Props types
interface ChecklistOverviewProps {
  itemType: "checklist";
  items: EnhancedChecklistItem[];
  issues: EnhancedQualityIssue[];
  formValues: Record<string, string>;
  documentGroups: DocumentGroup[];
  onEditField: (fieldId: string) => void;
  onFieldChange: (fieldId: string, value: string) => void;
  onNavigateToTab?: (tabId: DetailTabId) => void;
  onReanalyze?: () => void;
}

interface AssessmentOverviewProps {
  itemType: "assessment";
  fields: AssessmentField[];
  formValues: Record<string, string>;
  requiredEvidence: RequiredEvidence[];
  documentGroups: DocumentGroup[];
  onEditField: (fieldId: string) => void;
  onFieldChange: (fieldId: string, value: string) => void;
  onNavigateToTab?: (tabId: DetailTabId) => void;
  onReanalyze?: () => void;
}

export type OverviewTabProps = ChecklistOverviewProps | AssessmentOverviewProps;

// ============================================================================
// Reference Document Item - Shows doc name and analysis time
// ============================================================================
function ReferenceDocItem({
  evidence,
  analyzedAt,
  onClick,
}: {
  evidence: RequiredEvidence;
  analyzedAt?: string;
  onClick: () => void;
}) {
  const displayName = evidence.name.length > 14 ? evidence.name.slice(0, 14) + "..." : evidence.name;

  // Format time ago
  const getTimeAgo = (dateStr?: string) => {
    if (!dateStr) return null;
    // For demo, just show a static time
    return "2h ago";
  };

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left hover:bg-stone-100 transition-colors"
    >
      <FileText className="size-3.5 text-blue-500 shrink-0" />
      <span className="text-xs font-medium text-stone-700 truncate flex-1">
        {displayName}
      </span>
      {analyzedAt && (
        <span className="text-[10px] text-stone-400 shrink-0">
          {getTimeAgo(analyzedAt)}
        </span>
      )}
    </button>
  );
}

// ============================================================================
// Combined Summary + Fields Card Component
// ============================================================================
function SummaryFieldsCard({
  status,
  totalFields,
  completedFields,
  fields,
  formValues,
  referenceEvidence,
  isAnalyzing,
  needsReanalysis,
  onFieldChange,
  onReferenceDocClick,
  onAddReferenceClick,
  onUnlinkEvidence,
  onAnalyze,
}: {
  status: "complete" | "partial" | "empty";
  totalFields: number;
  completedFields: number;
  fields: DisplayField[];
  formValues: Record<string, string>;
  referenceEvidence: RequiredEvidence[];
  isAnalyzing: boolean;
  needsReanalysis: boolean;
  onFieldChange: (fieldId: string, value: string) => void;
  onReferenceDocClick: (evidence: RequiredEvidence) => void;
  onAddReferenceClick: () => void;
  onUnlinkEvidence?: (evidenceId: string) => void;
  onAnalyze?: () => void;
}) {
  const [pendingChanges, setPendingChanges] = useState<Record<string, string>>({});
  const [manuallyEditedFields, setManuallyEditedFields] = useState<Set<string>>(new Set());
  const [showAllFields, setShowAllFields] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const percent = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;
  const isComplete = status === "complete";
  const missingFields = fields.filter(f => f.status === "missing");
  const allComplete = missingFields.length === 0;
  const displayFields = allComplete || showAllFields ? fields : missingFields;

  // Check if there are pending changes
  const pendingFieldIds = Object.keys(pendingChanges).filter(
    (id) => pendingChanges[id] && pendingChanges[id].trim() !== ""
  );
  const hasPendingChanges = pendingFieldIds.length > 0;

  // Handle local field change (store in pending, don't submit yet)
  const handleFieldChange = (fieldId: string, value: string) => {
    setPendingChanges((prev) => ({ ...prev, [fieldId]: value }));
    setManuallyEditedFields((prev) => new Set(prev).add(fieldId));
  };

  // Submit all pending changes
  const handleSubmit = async () => {
    if (!hasPendingChanges) return;
    setIsSubmitting(true);

    // Submit each pending change
    for (const fieldId of pendingFieldIds) {
      onFieldChange(fieldId, pendingChanges[fieldId]);
    }

    // Clear pending changes after a brief delay for animation
    setTimeout(() => {
      setPendingChanges({});
      setIsSubmitting(false);
    }, 500);
  };

  // Cancel pending changes
  const handleCancel = () => {
    setPendingChanges({});
    setManuallyEditedFields(new Set());
  };

  // Get source badge
  const getSourceBadge = (field: DisplayField) => {
    if (field.source === "extracted") {
      return (
        <span className="inline-flex items-center px-1.5 py-0.5 text-[9px] font-medium text-blue-700 bg-blue-50 rounded">
          Extracted
        </span>
      );
    }
    if (field.source === "manual") {
      return (
        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-medium text-violet-700 bg-violet-50 rounded">
          <PenLine className="size-2" />
          Manual
        </span>
      );
    }
    if (field.source === "questionnaire") {
      return (
        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-medium text-stone-600 bg-stone-100 rounded">
          Questionnaire
        </span>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl border border-stone-200 bg-white overflow-hidden flex flex-col flex-1 min-h-0">
      {/* Header - Fixed height with Reference Documents */}
      <div className="shrink-0 p-4 border-b border-stone-100">
        <div className="flex items-center gap-4">
          {/* Left - Progress Summary */}
          <div className="shrink-0 flex items-center gap-3">
            <ProgressRing percent={percent} isComplete={isComplete} size={48} />
            <div>
              <h3 className="text-sm font-semibold text-stone-700 text-balance">Application Fields</h3>
              <p className="text-[11px] text-stone-400 tabular-nums">
                {completedFields} of {totalFields} completed
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="w-px self-stretch bg-stone-200 shrink-0" />

          {/* Right - Reference Documents */}
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-semibold text-stone-700">Reference Documents</h4>
              {isAnalyzing && (
                <Loader2 className="size-3 text-blue-600 animate-spin" />
              )}
              <div className="flex-1" />
              {needsReanalysis && onAnalyze && (() => {
                const pendingCount = referenceEvidence.filter((ev) => ev.isUploaded).length;
                return (
                  <button
                    onClick={onAnalyze}
                    disabled={isAnalyzing}
                    className="shrink-0 relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-stone-200 text-[11px] font-medium text-stone-600 bg-white hover:bg-stone-50 transition-colors disabled:opacity-50"
                  >
                    <Sparkles className="size-3" />
                    Re-analyze
                    {pendingCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {pendingCount}
                      </span>
                    )}
                  </button>
                );
              })()}
            </div>
            {/* Document cards row — matches CaseAssessmentForm style */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none min-h-[30px]">
              {referenceEvidence.filter((ev) => ev.isUploaded).map((ev) => {
                const referenceKeywords = ["passport", "cos", "certificate of sponsorship", "biometric"];
                const isPinned = referenceKeywords.some((kw) => ev.name.toLowerCase().includes(kw));
                return (
                  <div key={ev.id} className="group/pill shrink-0 relative">
                    <button
                      onClick={() => onReferenceDocClick(ev)}
                      className="inline-flex items-center gap-2 px-2 py-1.5 rounded-lg border border-stone-200 bg-white hover:border-blue-300 transition-all"
                    >
                      <FileText className="size-4 text-blue-500" />
                      <span className="text-xs font-medium text-stone-700 truncate max-w-[120px] group-hover/pill:text-blue-700">
                        {ev.linkedFileName || ev.name}
                      </span>
                    </button>
                    {!isPinned && onUnlinkEvidence && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onUnlinkEvidence(ev.id); }}
                        className="absolute -top-1.5 -right-1.5 size-4 rounded-full bg-white border border-stone-300 shadow-sm flex items-center justify-center opacity-0 group-hover/pill:opacity-100 transition-opacity hover:bg-rose-50 hover:border-rose-400"
                      >
                        <X className="size-2.5 text-rose-500" />
                      </button>
                    )}
                  </div>
                );
              })}
              <button
                onClick={onAddReferenceClick}
                className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-dashed border-stone-300 bg-stone-50 hover:border-[#0E4268] hover:bg-[#0E4268]/5 text-stone-400 hover:text-[#0E4268] transition-colors text-xs"
                title="Add reference document"
              >
                <Plus className="size-3.5" />
                Add reference
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content - min-h-0 is critical for flex overflow to work */}
      <div className="flex-1 min-h-0 p-4 overflow-y-auto">
        {/* Fields Section Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-medium text-stone-600">Fields</h4>
            {!allComplete && missingFields.length > 0 && !showAllFields && (
              <span className="px-1.5 py-0.5 text-[10px] font-medium text-amber-700 bg-amber-100 rounded tabular-nums">
                {missingFields.length} missing
              </span>
            )}
          </div>
          {!allComplete && (
            <button
              onClick={() => setShowAllFields(!showAllFields)}
              className="text-xs font-medium text-stone-500 hover:text-stone-700 transition-colors"
            >
              {showAllFields ? "Show unanswered" : "Show all"}
            </button>
          )}
        </div>

        <div className="space-y-2">
            {displayFields.map((field) => {
              // Use pending value if exists, otherwise use stored value
              const storedValue = formValues[field.id] || field.value || "";
              const currentValue = pendingChanges[field.id] !== undefined ? pendingChanges[field.id] : storedValue;
              const hasPendingValue = pendingChanges[field.id] !== undefined && pendingChanges[field.id].trim() !== "";
              const isMissing = field.status === "missing" && !hasPendingValue;
              const isCompleted = !isMissing && (currentValue || hasPendingValue);
              // Check if user has manually entered/edited this field in this session
              const isManuallyEdited = manuallyEditedFields.has(field.id);

              // Determine which badge to show
              const renderSourceBadge = () => {
                if (hasPendingValue) {
                  return (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-medium text-amber-700 bg-amber-100 rounded">
                      Pending
                    </span>
                  );
                }
                if (isManuallyEdited) {
                  return (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-medium text-violet-700 bg-violet-50 rounded">
                      <PenLine className="size-2" />
                      Manual
                    </span>
                  );
                }
                return getSourceBadge(field);
              };

              return (
                <div
                  key={field.id}
                  className={cn(
                    "p-2.5 rounded-lg border transition-colors",
                    hasPendingValue
                      ? "border-blue-200 bg-blue-50/30"
                      : isMissing
                        ? "border-amber-200 bg-amber-50/50"
                        : "border-stone-100 bg-stone-50/30"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    {isCompleted ? (
                      <CheckCircle2 className={cn(
                        "size-3.5 shrink-0",
                        hasPendingValue ? "text-blue-500" : "text-emerald-500"
                      )} />
                    ) : (
                      <div className="size-3.5 rounded-full border-2 border-amber-400 shrink-0" />
                    )}
                    <label className={cn(
                      "text-xs font-medium truncate flex-1",
                      isMissing ? "text-stone-700" : "text-stone-500"
                    )}>
                      {field.label}
                    </label>
                    {renderSourceBadge()}
                  </div>

                  {/* All fields are editable */}
                  {field.fieldType === "select" && field.options ? (
                    <select
                      value={currentValue}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      className={cn(
                        "w-full px-2.5 py-1.5 text-xs rounded-md border bg-white focus:border-[#0E4268] focus:ring-[#0E4268]/10 focus:outline-none focus:ring-2 transition-colors",
                        hasPendingValue ? "border-blue-300" : isMissing ? "border-stone-200" : "border-stone-100"
                      )}
                    >
                      <option value="">Select...</option>
                      {field.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.fieldType === "date" ? "date" : "text"}
                      value={currentValue}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      placeholder={`Enter ${field.label.toLowerCase()}...`}
                      className={cn(
                        "w-full px-2.5 py-1.5 text-xs rounded-md border bg-white focus:border-[#0E4268] focus:ring-[#0E4268]/10 focus:outline-none focus:ring-2 transition-colors placeholder:text-stone-400",
                        hasPendingValue ? "border-blue-300" : isMissing ? "border-stone-200" : "border-stone-100"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
      </div>

      {/* Footer - shows when there are pending changes */}
      {hasPendingChanges && (
        <div className="shrink-0 px-4 py-3 border-t border-stone-100 flex items-center justify-between bg-stone-50/50">
          <p className="text-xs text-stone-500 tabular-nums">
            {pendingFieldIds.length} field{pendingFieldIds.length !== 1 ? "s" : ""} pending
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-[#0E4268] hover:bg-[#0a3555] rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="size-3.5" />
                  Save {pendingFieldIds.length} Field{pendingFieldIds.length !== 1 ? "s" : ""}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Missing Information Card - Shows fields that still need to be completed
// ============================================================================
function MissingInformationCard({
  fields,
  formValues,
  onFieldChange,
  onViewMore,
}: {
  fields: DisplayField[];
  formValues: Record<string, string>;
  onFieldChange: (fieldId: string, value: string) => void;
  onViewMore?: () => void;
}) {
  const [savingFields, setSavingFields] = useState<Set<string>>(new Set());
  const [showAllFields, setShowAllFields] = useState(false);

  // Filter to only show missing fields
  const missingFields = fields.filter(f => f.status === "missing");
  const completedCount = fields.length - missingFields.length;

  // Fields to display based on toggle
  const displayFields = showAllFields ? fields : missingFields;

  const handleFieldChange = (fieldId: string, value: string) => {
    onFieldChange(fieldId, value);
    setSavingFields((prev) => new Set(prev).add(fieldId));
    setTimeout(() => {
      setSavingFields((prev) => {
        const next = new Set(prev);
        next.delete(fieldId);
        return next;
      });
    }, 1000);
  };

  return (
    <div className="rounded-xl border border-stone-200 bg-white overflow-hidden h-full flex flex-col">
      <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-stone-700 text-balance">Missing Information</h3>
          {missingFields.length > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-medium text-amber-700 bg-amber-100 rounded tabular-nums">
              {missingFields.length}
            </span>
          )}
        </div>
        {/* Toggle between showing missing only vs all fields */}
        {completedCount > 0 && (
          <button
            onClick={() => setShowAllFields(!showAllFields)}
            className="text-xs font-medium text-stone-500 hover:text-stone-700 transition-colors"
          >
            {showAllFields ? (missingFields.length > 0 ? "Show unanswered" : "Hide all") : "Show all"}
          </button>
        )}
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {missingFields.length === 0 && !showAllFields ? (
          <div className="h-full flex flex-col items-center justify-center py-6 text-center">
            <div className="size-10 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
              <CheckCircle2 className="size-5 text-emerald-500" />
            </div>
            <p className="text-sm font-medium text-stone-700">All complete</p>
            <p className="text-xs text-stone-400 mt-0.5 text-pretty">All information has been provided</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {displayFields.slice(0, showAllFields ? undefined : 6).map((field) => {
              const currentValue = formValues[field.id] || field.value || "";
              const isSaving = savingFields.has(field.id);
              const isCompleted = field.status !== "missing";

              return (
                <div key={field.id} className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "size-3.5 rounded-full border-2 shrink-0",
                      isCompleted ? "bg-emerald-500 border-emerald-500" : "border-amber-400"
                    )} />
                    <label className="text-xs font-medium text-stone-600 truncate flex-1">
                      {field.label}
                    </label>
                    {isSaving && (
                      <span className="inline-flex items-center gap-0.5 px-1 py-0.5 text-[9px] font-medium text-emerald-700 bg-emerald-100 rounded">
                        <Check className="size-2" />
                        Saved
                      </span>
                    )}
                  </div>

                  {field.fieldType === "select" && field.options ? (
                    <select
                      value={currentValue}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-md border border-stone-200 bg-white focus:border-[#0E4268] focus:ring-[#0E4268]/10 focus:outline-none focus:ring-2 transition-colors"
                    >
                      <option value="">Select...</option>
                      {field.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.fieldType === "date" ? "date" : "text"}
                      value={currentValue}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      placeholder={`Enter ${field.label.toLowerCase()}...`}
                      className="w-full px-2.5 py-1.5 text-xs rounded-md border border-stone-200 bg-white focus:border-[#0E4268] focus:ring-[#0E4268]/10 focus:outline-none focus:ring-2 transition-colors placeholder:text-stone-400"
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Combined Evidence Slot - Shows grouped document requirements
// ============================================================================
function CombinedEvidenceSlotInline({
  title,
  relationship,
  documents,
  onAddClick,
  onUnlinkEvidence,
}: {
  title: string;
  relationship: "all" | "any";
  documents: RequiredEvidence[];
  onAddClick: (evidence: RequiredEvidence) => void;
  onUnlinkEvidence?: (evidenceId: string) => void;
}) {
  const uploadedCount = documents.filter(d => d.isUploaded).length;
  const totalCount = documents.length;
  const isComplete = relationship === "all"
    ? uploadedCount === totalCount
    : uploadedCount >= 1;

  return (
    <div className={cn(
      "rounded-xl border-2 overflow-hidden transition-all",
      isComplete
        ? "border-emerald-300 bg-gradient-to-b from-emerald-50 to-white shadow-sm"
        : "border-stone-200 bg-white"
    )}>
      {/* Header */}
      <div className={cn(
        "px-3 py-2.5 border-b",
        isComplete ? "border-emerald-200 bg-emerald-50" : "border-stone-100 bg-stone-50"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isComplete && (
              <CheckCircle2 className="size-4 text-emerald-500" />
            )}
            <span className={cn(
              "text-xs font-semibold",
              isComplete ? "text-emerald-700" : "text-stone-700"
            )}>
              {title}
            </span>
            {/* Relationship badge */}
            <span className={cn(
              "px-1.5 py-0.5 text-[9px] font-bold uppercase rounded",
              isComplete
                ? "bg-emerald-200 text-emerald-700"
                : relationship === "all"
                  ? "bg-stone-200 text-stone-600"
                  : "bg-blue-100 text-blue-600"
            )}>
              {isComplete ? "Complete" : relationship === "all" ? "All required" : "Any one"}
            </span>
          </div>
          <span className={cn(
            "text-[10px] font-semibold tabular-nums",
            isComplete ? "text-emerald-600" : "text-stone-500"
          )}>
            {uploadedCount}/{totalCount}
          </span>
        </div>
      </div>

      {/* Document slots - horizontal flex layout */}
      <div className="p-3">
        <div className="flex items-center gap-2">
          {documents.map((doc, idx) => (
            <Fragment key={doc.id}>
              {/* Slot - flex-1 for equal width, fixed height */}
              <div className="group/cslot flex-1 min-w-0 relative">
                <button
                  onClick={() => onAddClick(doc)}
                  className={cn(
                    "w-full h-24 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-2 px-2",
                    doc.isUploaded
                      ? "border-emerald-300 bg-emerald-50 hover:border-emerald-400 hover:shadow-sm"
                      : "border-dashed border-stone-300 bg-stone-50/50 hover:border-stone-400 hover:bg-stone-100"
                  )}
                >
                  {doc.isUploaded ? (
                    <>
                      {/* Uploaded state - document preview style */}
                      <div className="relative">
                        <div className="w-10 h-12 rounded bg-white border border-emerald-200 shadow-sm flex flex-col p-1.5 gap-0.5">
                          <div className="h-0.5 bg-emerald-300 rounded w-2/3" />
                          <div className="h-0.5 bg-emerald-200 rounded w-full" />
                          <div className="h-0.5 bg-emerald-200 rounded w-full" />
                          <div className="h-0.5 bg-emerald-200 rounded w-4/5" />
                        </div>
                        <div className="absolute -top-1 -right-1 size-4 rounded-full bg-emerald-500 flex items-center justify-center">
                          <Check className="size-2.5 text-white" strokeWidth={3} />
                        </div>
                      </div>
                      <span className="text-[10px] font-medium text-emerald-700 text-center line-clamp-1 max-w-full">
                        {doc.linkedFileName || doc.name}
                      </span>
                    </>
                  ) : (
                    <>
                      {/* Empty state */}
                      <div className="size-10 rounded-lg bg-white border-2 border-dashed border-stone-300 flex items-center justify-center">
                        <Upload className="size-4 text-stone-400" />
                      </div>
                      <span className="text-[10px] font-medium text-stone-500 text-center line-clamp-1 max-w-full">
                        {doc.name}
                      </span>
                    </>
                  )}
                </button>
                {doc.isUploaded && onUnlinkEvidence && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onUnlinkEvidence(doc.id); }}
                    className="absolute -top-1.5 -right-1.5 size-4 rounded-full bg-white border border-stone-300 shadow-sm flex items-center justify-center opacity-0 group-hover/cslot:opacity-100 transition-opacity hover:bg-rose-50 hover:border-rose-400"
                  >
                    <X className="size-2.5 text-rose-500" />
                  </button>
                )}
              </div>

              {/* Connector between slots */}
              {idx < documents.length - 1 && (
                <div className="shrink-0 flex items-center justify-center">
                  <span className={cn(
                    "px-2 py-1 text-[9px] font-bold rounded-full",
                    isComplete
                      ? "bg-emerald-100 text-emerald-600"
                      : relationship === "all"
                        ? "bg-stone-100 text-stone-500"
                        : "bg-blue-50 text-blue-500"
                  )}>
                    {relationship === "all" ? "+" : "or"}
                  </span>
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Supporting Documents Card - Shows all document slots as cards
// ============================================================================
function SupportingDocumentsCard({
  documents,
  onAddClick,
  onViewMore,
  onUnlinkEvidence,
}: {
  documents: RequiredEvidence[];
  onAddClick: (evidence: RequiredEvidence) => void;
  onViewMore?: () => void;
  onUnlinkEvidence?: (evidenceId: string) => void;
}) {
  // Group documents by type for combined evidence slots
  const groupedDocs = useMemo(() => {
    // Check if we have bank statements and payslip - combine them as Financial Evidence
    const bankStatements = documents.find(d =>
      d.name.toLowerCase().includes("bank statement")
    );
    const payslip = documents.find(d =>
      d.name.toLowerCase().includes("payslip")
    );

    // If we have both bank statements and payslip, group them
    if (bankStatements && payslip) {
      const financialGroup = {
        title: "Financial Evidence",
        relationship: "all" as const, // Both bank statements AND payslip required
        documents: [bankStatements, payslip],
      };

      // Get remaining standalone documents
      const groupedIds = new Set([bankStatements.id, payslip.id]);
      const standalone = documents.filter(d => !groupedIds.has(d.id));

      return { groups: [financialGroup], standalone };
    }

    // No grouping needed
    return { groups: [], standalone: documents };
  }, [documents]);

  // Calculate counts treating combined groups as single items
  const counts = useMemo(() => {
    // Total = number of groups + number of standalone docs
    const totalCount = groupedDocs.groups.length + groupedDocs.standalone.length;

    // Uploaded count for groups (based on relationship)
    const uploadedGroups = groupedDocs.groups.filter(group => {
      const uploadedInGroup = group.documents.filter(d => d.isUploaded).length;
      if (group.relationship === "all") {
        return uploadedInGroup === group.documents.length;
      } else {
        return uploadedInGroup >= 1;
      }
    }).length;

    // Uploaded count for standalone docs
    const uploadedStandalone = groupedDocs.standalone.filter(d => d.isUploaded).length;

    const uploadedCount = uploadedGroups + uploadedStandalone;

    return { totalCount, uploadedCount };
  }, [groupedDocs]);

  return (
    <div className="rounded-xl border border-stone-200 bg-white overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="shrink-0 px-4 py-3 border-b border-stone-100">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-stone-700">Supporting Documents</h3>
          <span className="text-[11px] text-stone-400 tabular-nums">
            {counts.uploadedCount}/{counts.totalCount}
          </span>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {documents.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-6">
            <div className="size-10 rounded-full bg-stone-100 flex items-center justify-center mb-3">
              <Paperclip className="size-5 text-stone-400" />
            </div>
            <p className="text-sm text-stone-500 text-pretty">No supporting documents required</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Combined Evidence Groups */}
            {groupedDocs.groups.map((group, idx) => (
              <CombinedEvidenceSlotInline
                key={`group-${idx}`}
                title={group.title}
                relationship={group.relationship}
                documents={group.documents}
                onAddClick={onAddClick}
                onUnlinkEvidence={onUnlinkEvidence}
              />
            ))}

            {/* Standalone Documents */}
            {groupedDocs.standalone.length > 0 && (
              <div className="space-y-2">
                {groupedDocs.standalone.map((doc) => (
                  <div key={doc.id} className="group/slot relative">
                    <button
                      onClick={() => onAddClick(doc)}
                      className={cn(
                        "w-full p-3 rounded-lg border-2 transition-colors text-left",
                        doc.isUploaded
                          ? "border-emerald-200 bg-emerald-50/50 hover:border-emerald-300"
                          : "border-dashed border-stone-300 bg-stone-50/50 hover:border-stone-400 hover:bg-stone-100/50"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "size-9 rounded-lg flex items-center justify-center shrink-0",
                          doc.isUploaded
                            ? "bg-emerald-100"
                            : "bg-stone-100 border border-dashed border-stone-300"
                        )}>
                          {doc.isUploaded ? (
                            <FileText className="size-4 text-emerald-600" />
                          ) : (
                            <Upload className="size-4 text-stone-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "text-xs font-medium truncate",
                              doc.isUploaded ? "text-stone-700" : "text-stone-600"
                            )}>
                              {doc.name}
                            </span>
                            {doc.isUploaded && (
                              <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                            )}
                          </div>
                          {doc.isUploaded && doc.linkedFileName && (
                            <p className="text-[11px] text-emerald-600 mt-0.5 truncate">
                              {doc.linkedFileName}
                            </p>
                          )}
                          {!doc.isUploaded && doc.description && (
                            <p className="text-[10px] text-stone-400 mt-0.5 line-clamp-1 text-pretty">
                              {doc.description}
                            </p>
                          )}
                        </div>
                        {!doc.isUploaded && (
                          <Plus className="size-4 text-stone-400 shrink-0" />
                        )}
                      </div>
                    </button>
                    {doc.isUploaded && onUnlinkEvidence && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onUnlinkEvidence(doc.id); }}
                        className="absolute top-1.5 right-1.5 size-5 rounded-full bg-white border border-stone-300 shadow-sm flex items-center justify-center opacity-0 group-hover/slot:opacity-100 transition-opacity hover:bg-rose-50 hover:border-rose-400"
                      >
                        <X className="size-3 text-rose-500" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Mock extracted data for simulation
// ============================================================================
const MOCK_EXTRACTED_DATA: Record<string, { value: string; sourceDoc: string }> = {
  "emp-job-title": { value: "Senior Software Engineer", sourceDoc: "Certificate of Sponsorship" },
  "emp-soc-code": { value: "2136", sourceDoc: "Certificate of Sponsorship" },
  "emp-salary": { value: "£65,000", sourceDoc: "Certificate of Sponsorship" },
  "emp-start-date": { value: "2024-03-01", sourceDoc: "Certificate of Sponsorship" },
  "emp-sponsor-name": { value: "Tech Solutions Ltd", sourceDoc: "Certificate of Sponsorship" },
  "emp-sponsor-number": { value: "ABC123456", sourceDoc: "Certificate of Sponsorship" },
  "emp-cos-number": { value: "S1234567890", sourceDoc: "Certificate of Sponsorship" },
  "emp-working-hours": { value: "37.5 hours per week", sourceDoc: "Certificate of Sponsorship" },
};

// ============================================================================
// Main Overview Tab Component
// ============================================================================
export function OverviewTab(props: OverviewTabProps) {
  const { itemType, formValues, documentGroups, onFieldChange, onNavigateToTab, onReanalyze } = props;
  const unlinkEvidence = useCaseDetailStore((state) => state.unlinkEvidence);
  const linkEvidenceToGroup = useCaseDetailStore((state) => state.linkEvidenceToGroup);
  const [selectedEvidence, setSelectedEvidence] = useState<RequiredEvidence | null>(null);
  const [previewGroup, setPreviewGroup] = useState<DocumentGroup | null>(null);
  const [showAddRefModal, setShowAddRefModal] = useState(false);
  const [needsReanalysis, setNeedsReanalysis] = useState(false);

  // Analysis simulation state
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Track reference document upload count to detect changes
  const prevRefUploadedRef = useRef<number | null>(null);

  // Calculate stats
  const stats = useMemo(() => {
    if (itemType === "checklist") {
      const items = props.items;
      const completedFields = items.filter((i) => !!formValues[i.id] || !!i.value).length;
      const totalFields = items.length;

      // Collect all evidence from items
      const evidenceMap = new Map<string, RequiredEvidence>();
      items.forEach((item) => {
        item.requiredEvidence?.forEach((ev) => {
          if (!evidenceMap.has(ev.id)) {
            evidenceMap.set(ev.id, ev);
          }
        });
      });
      const allEvidence = Array.from(evidenceMap.values());

      // Reference docs: passport, CoS, etc. (used for data extraction)
      const referenceKeywords = ["passport", "cos", "certificate of sponsorship", "biometric"];
      const referenceEvidence = allEvidence.filter((ev) =>
        referenceKeywords.some((kw) => ev.name.toLowerCase().includes(kw))
      );

      // Supporting docs: everything else (evidence for proof)
      const supportingEvidence = allEvidence.filter((ev) =>
        !referenceEvidence.includes(ev)
      );

      return {
        completedFields,
        totalFields,
        referenceEvidence,
        supportingEvidence,
        allEvidence,
      };
    } else {
      // Assessment type
      const fields = props.fields;
      const completedFields = fields.filter((f) => !!formValues[f.id]).length;
      const totalFields = fields.length;
      const allEvidence = props.requiredEvidence || [];

      // Reference docs for assessment
      const referenceKeywords = ["passport", "cos", "certificate of sponsorship", "biometric"];
      const referenceEvidence = allEvidence.filter((ev) =>
        referenceKeywords.some((kw) => ev.name.toLowerCase().includes(kw))
      );

      // Supporting docs: everything else
      const supportingEvidence = allEvidence.filter((ev) => !referenceEvidence.includes(ev));

      return {
        completedFields,
        totalFields,
        referenceEvidence,
        supportingEvidence,
        allEvidence,
      };
    }
  }, [itemType, formValues, props]);

  // Prepare all fields for display
  const displayFields = useMemo((): DisplayField[] => {
    if (itemType === "checklist") {
      const items = props.items;
      return items.map((item) => {
        const hasValue = !!formValues[item.id] || !!item.value;
        const isLowConfidence = item.source === "extracted" &&
          item.confidenceScore !== undefined &&
          item.confidenceScore < 80;

        // Get source document name from linkedDocuments
        const sourceDocName = item.source === "extracted" && item.linkedDocuments?.length > 0
          ? item.linkedDocuments[0].groupTitle || item.linkedDocuments[0].fileName
          : undefined;

        return {
          id: item.id,
          label: item.label,
          value: formValues[item.id] || item.value,
          source: item.source,
          sourceDocumentName: sourceDocName,
          status: isLowConfidence ? "low_confidence" : (hasValue ? "complete" : "missing"),
          fieldType: "text",
          confidenceScore: item.confidenceScore,
        };
      });
    } else {
      const fields = props.fields;
      return fields.map((field) => ({
        id: field.id,
        label: field.label,
        value: formValues[field.id] || field.value,
        source: formValues[field.id] ? "manual" : null,
        status: formValues[field.id] ? "complete" : "missing",
        fieldType: field.type === "select" ? "select" : "text",
        options: field.options,
      }));
    }
  }, [itemType, formValues, props]);

  // Status helpers
  const getFieldStatus = () => {
    if (stats.completedFields === stats.totalFields) return "complete";
    if (stats.completedFields > 0) return "partial";
    return "empty";
  };

  const refUploaded = stats.referenceEvidence.filter((e) => e.isUploaded).length;

  // Handle reference doc click - find linked group and open preview
  const handleReferenceDocClick = (evidence: RequiredEvidence) => {
    if (evidence.linkedFileId) {
      // Find the group containing this file
      const group = documentGroups.find((g) =>
        g.files.some((f) => f.id === evidence.linkedFileId)
      );
      if (group) {
        setPreviewGroup(group);
        return;
      }
    }
    // Fallback: open upload modal
    setSelectedEvidence(evidence);
  };

  const handleAddReferenceClick = () => {
    setShowAddRefModal(true);
  };

  const handleLinkReferenceGroup = (groupId: string) => {
    // Link the selected group to the first un-uploaded reference evidence
    const firstUnlinked = stats.referenceEvidence.find((e) => !e.isUploaded);
    if (firstUnlinked) {
      linkEvidenceToGroup(firstUnlinked.id, groupId);
    }
  };

  // Simulate document analysis
  const handleAnalyze = () => {
    if (isAnalyzing) return;

    setIsAnalyzing(true);

    // Simulate analysis delay
    setTimeout(() => {
      // Find empty fields and populate them with mock data
      if (itemType === "checklist") {
        let filledCount = 0;

        props.items.forEach((item) => {
          const hasValue = !!formValues[item.id] || !!item.value;
          if (!hasValue) {
            // Check if we have mock data for this field
            const mockData = MOCK_EXTRACTED_DATA[item.id];
            if (mockData) {
              onFieldChange(item.id, mockData.value);
              filledCount++;
            }
          }
        });

        // If no specific mock data, fill first 3 empty fields with generic data
        if (filledCount === 0) {
          const emptyItems = props.items.filter(
            (item) => !formValues[item.id] && !item.value
          ).slice(0, 3);

          emptyItems.forEach((item, index) => {
            const genericValues = ["Sample Value 1", "Sample Value 2", "Sample Value 3"];
            onFieldChange(item.id, genericValues[index] || "Extracted Value");
          });
        }
      }

      setIsAnalyzing(false);
      setNeedsReanalysis(false);
    }, 1500); // 1.5 second analysis simulation
  };

  // Flag manual re-analysis only when new reference documents are linked
  useEffect(() => {
    if (prevRefUploadedRef.current !== null && refUploaded > prevRefUploadedRef.current) {
      setNeedsReanalysis(true);
    }
    prevRefUploadedRef.current = refUploaded;
  }, [refUploaded]);

  return (
    <>
      <div className="h-full flex flex-col min-h-0">
        <div className="flex-1 p-6 min-h-0 h-full">
          {/* Unified layout for all sections: 2:1 grid for Fields : Supporting Documents */}
          <div className="grid grid-cols-3 gap-4 h-full">
            <div className="col-span-2 h-full min-h-0 flex flex-col">
              <SummaryFieldsCard
                status={getFieldStatus()}
                totalFields={stats.totalFields}
                completedFields={stats.completedFields}
                fields={displayFields}
                formValues={formValues}
                referenceEvidence={stats.referenceEvidence}
                isAnalyzing={isAnalyzing}
                needsReanalysis={needsReanalysis}
                onFieldChange={onFieldChange}
                onReferenceDocClick={handleReferenceDocClick}
                onAddReferenceClick={handleAddReferenceClick}
                onUnlinkEvidence={unlinkEvidence}
                onAnalyze={handleAnalyze}
              />
            </div>
            <SupportingDocumentsCard
              documents={stats.supportingEvidence}
              onAddClick={(evidence) => setSelectedEvidence(evidence)}
              onViewMore={() => onNavigateToTab?.("supporting-documents")}
              onUnlinkEvidence={unlinkEvidence}
            />
          </div>
        </div>

      </div>

      {/* Document Upload Modal */}
      {selectedEvidence && (
        <DocumentUploadModal
          evidence={selectedEvidence}
          onClose={() => setSelectedEvidence(null)}
        />
      )}

      {/* Document Preview Modal */}
      {previewGroup && (
        <CategoryReviewModal
          group={previewGroup}
          allGroups={documentGroups}
          onClose={() => setPreviewGroup(null)}
        />
      )}

      {/* Add Reference Document Modal */}
      {showAddRefModal && (
        <AddReferenceDocModal
          documentGroups={documentGroups}
          onClose={() => setShowAddRefModal(false)}
          onLinkGroup={handleLinkReferenceGroup}
        />
      )}
    </>
  );
}
