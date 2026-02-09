"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { motion } from "motion/react";
import {
  Sparkles,
  Share2,
  Copy,
  CheckCircle2,
  ExternalLink,
  ClipboardCheck,
  FileText,
  Plus,
  X,
  Check,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { VisaType, PassportInfo } from "@/types";
import { useCaseDetailStore, useDocumentGroups } from "@/store/case-detail-store";
import { LockedChecklistPreview } from "./LockedChecklistPreview";
import { ProgressRing } from "../shared/ProgressRing";
import { AddReferenceDocModal } from "../shared/AddReferenceDocModal";

// Majority English-speaking countries for auto-detection
const MAJORITY_ENGLISH_COUNTRIES = [
  "British", "United Kingdom", "UK",
  "United States", "USA", "American",
  "Canada", "Canadian",
  "Australia", "Australian",
  "New Zealand",
  "Ireland", "Irish",
];

// ============================================
// Types for Assessment Fields
// ============================================

interface AssessmentFieldOption {
  value: string;
  label: string;
}

interface AssessmentFieldConfig {
  id: string;
  label: string;
  options: AssessmentFieldOption[];
  // Conditional visibility
  showIf?: { fieldId: string; values: string[] };
  // Pre-filled from document
  prefilledValue?: string;
  source?: "extracted" | "manual";
  sourceDocument?: string;
}

// ============================================
// Helper Functions
// ============================================

function isEnglishSpeakingNationality(nationality?: string): boolean {
  if (!nationality) return false;
  return MAJORITY_ENGLISH_COUNTRIES.some(
    (country) => nationality.toLowerCase().includes(country.toLowerCase())
  );
}

// ============================================
// Generate Assessment Fields per Visa Type
// ============================================

function getAssessmentFields(visaType: VisaType, passport?: PassportInfo): AssessmentFieldConfig[] {
  const isEnglishNational = isEnglishSpeakingNationality(passport?.nationality);

  const baseFields: AssessmentFieldConfig[] = [
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
      // Auto-fill if passport nationality qualifies
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
    baseFields.push(
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

  return baseFields;
}

// ============================================
// Checklist Sections Preview (locked state)
// ============================================

const CHECKLIST_SECTIONS = [
  { id: "personal", title: "Personal Information" },
  { id: "employment", title: "Employment Details" },
  { id: "financial", title: "Financial Evidence" },
  { id: "travel", title: "Travel History" },
  { id: "education", title: "Education" },
  { id: "family", title: "Family Information" },
];

// ============================================
// Assessment Field Component (Key-Value Style)
// ============================================

interface AssessmentFieldProps {
  field: AssessmentFieldConfig;
  value: string;
  onChange: (value: string) => void;
}

function AssessmentField({ field, value, onChange }: AssessmentFieldProps) {
  const hasValue = !!value;
  // All assessment fields are required
  const isRequired = true;
  const isExtractedValue = field.source === "extracted" && value === field.prefilledValue;

  return (
    <div className="group py-3 px-3 rounded-lg transition-colors hover:bg-stone-50/50">
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
        {/* Source badge - inline with label, matches AssessmentSourceBadge */}
        {hasValue && isExtractedValue && field.sourceDocument && (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-medium text-blue-600 bg-blue-50 border border-blue-100 rounded">
            <FileText className="size-2.5" />
            {field.sourceDocument}
          </span>
        )}
      </div>

      {/* Select dropdown - clean modern styling */}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
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
}

// ============================================
// Sidebar Item for Assessment
// ============================================

function AssessmentSidebarItem({
  progress,
  isActive,
}: {
  progress: number;
  isActive: boolean;
}) {
  const isComplete = progress >= 100;

  return (
    <div className="relative mx-2">
      {/* Left edge indicator - color changes based on state */}
      <div className={cn(
        "absolute left-0 top-2 bottom-2 w-0.5 rounded-full transition-colors",
        isComplete ? "bg-emerald-400" : "bg-[#0E4268]"
      )} />

      <div className={cn(
        "relative flex items-center gap-2.5 pl-3.5 pr-3 py-2.5 rounded-r-lg transition-colors",
        isActive ? "bg-stone-100" : "bg-transparent"
      )}>
        {/* Icon - same icon, different colors for state */}
        <div className={cn(
          "size-6 rounded flex items-center justify-center shrink-0",
          isComplete
            ? "bg-emerald-50 text-emerald-600"
            : "bg-[#0E4268]/10 text-[#0E4268]"
        )}>
          <ClipboardCheck size={13} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-xs font-medium text-stone-700 truncate">
              Case Assessment
            </p>
            {isComplete ? (
              <span className="shrink-0 text-[10px] text-emerald-600 font-medium">Done</span>
            ) : (
              <span className="shrink-0 text-[10px] text-stone-400 tabular-nums">
                {Math.round(progress)}%
              </span>
            )}
          </div>
          <p className="text-[10px] text-stone-400 mt-0.5">
            Defines checklist structure
          </p>
        </div>
      </div>
    </div>
  );
}

// Locked section item
function LockedSectionItem({ section }: { section: { id: string; title: string } }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 mx-2 opacity-40">
      <div className="size-7 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
        <div className="size-1.5 rounded-full bg-stone-300" />
      </div>
      <span className="text-sm text-stone-400 truncate">{section.title}</span>
    </div>
  );
}

// ============================================
// Share Modal
// ============================================

function ShareWithClientModal({
  isOpen,
  onClose,
  caseReference,
}: {
  isOpen: boolean;
  onClose: () => void;
  caseReference: string;
}) {
  const [copied, setCopied] = useState(false);
  const shareLink = `https://app.xeni.ai/client/assessment/${caseReference}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-10 rounded-xl bg-[#0E4268]/10 flex items-center justify-center">
              <Share2 size={20} className="text-[#0E4268]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-stone-900">Share with Client</h3>
              <p className="text-sm text-stone-500">Let your client complete the assessment</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-stone-500">Assessment Link</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-600 truncate">
                  {shareLink}
                </div>
                <button
                  onClick={handleCopy}
                  className={cn(
                    "shrink-0 px-3 py-2 rounded-lg flex items-center gap-1.5 text-sm font-medium transition-colors",
                    copied
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                  )}
                >
                  {copied ? <><CheckCircle2 size={16} />Copied</> : <><Copy size={16} />Copy</>}
                </button>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
              <p className="text-xs text-amber-800">
                The client will see pre-filled information from uploaded documents.
                Their answers will sync back to this case automatically.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => { window.open(shareLink, '_blank'); onClose(); }}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-[#0E4268] hover:bg-[#0a3555] rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                Open Link
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// Main Component
// ============================================

interface CaseAssessmentFormProps {
  visaType: VisaType;
  onComplete?: () => void;
  embedded?: boolean;
}

export function CaseAssessmentForm({ visaType, onComplete, embedded = false }: CaseAssessmentFormProps) {
  const passport = useCaseDetailStore((state) => state.clientProfile.passport);
  const caseReference = useCaseDetailStore((state) => state.caseReference);
  const submitQuestionnaireAnswers = useCaseDetailStore((state) => state.submitQuestionnaireAnswers);
  const assessmentReferenceDocIds = useCaseDetailStore((state) => state.assessmentReferenceDocIds);
  const addAssessmentReferenceDoc = useCaseDetailStore((state) => state.addAssessmentReferenceDoc);
  const removeAssessmentReferenceDoc = useCaseDetailStore((state) => state.removeAssessmentReferenceDoc);
  const documentGroups = useDocumentGroups();

  const fields = useMemo(() => getAssessmentFields(visaType, passport), [visaType, passport]);

  // Reference documents for Case Assessment - passport and case notes are pinned, extras are unlinkable
  const referenceDocuments = useMemo(() => {
    const docs: { id: string; groupId: string; name: string; fileName: string; pinned: boolean }[] = [];

    // Find passport document group (pinned)
    const passportGroup = documentGroups.find(
      (group) => group.title?.toLowerCase().includes("passport")
    );
    if (passportGroup && passportGroup.files.length > 0) {
      docs.push({
        id: "passport",
        groupId: passportGroup.id,
        name: "Passport",
        fileName: passportGroup.files[0].name,
        pinned: true,
      });
    }

    // Find case notes document group (pinned)
    const caseNotesGroup = documentGroups.find(
      (group) => group.title?.toLowerCase().includes("case note")
    );
    if (caseNotesGroup && caseNotesGroup.files.length > 0) {
      docs.push({
        id: "case-notes",
        groupId: caseNotesGroup.id,
        name: "Case Notes",
        fileName: caseNotesGroup.files[0].name,
        pinned: true,
      });
    }

    // Add extra linked reference docs (not pinned)
    assessmentReferenceDocIds.forEach((groupId) => {
      // Skip if already included as pinned
      if (docs.some((d) => d.groupId === groupId)) return;
      const group = documentGroups.find((g) => g.id === groupId);
      if (group && group.files.filter((f) => !f.isRemoved).length > 0) {
        docs.push({
          id: `ref-${groupId}`,
          groupId: group.id,
          name: group.title,
          fileName: group.files.filter((f) => !f.isRemoved)[0].name,
          pinned: false,
        });
      }
    });

    return docs;
  }, [documentGroups, assessmentReferenceDocIds]);

  // Form state - initialize with pre-filled values
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    fields.forEach((field) => {
      if (field.prefilledValue) {
        initial[field.id] = field.prefilledValue;
      }
    });
    return initial;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAddDocModal, setShowAddDocModal] = useState(false);

  // Demo quick-fill shortcut: Cmd+Shift+D (Mac) or Ctrl+Shift+D (Windows)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "d") {
        e.preventDefault();
        // Quick-fill all fields with first option for demo
        const quickFillValues: Record<string, string> = {};
        fields.forEach((field) => {
          // Use prefilled value if available, otherwise use first option
          if (field.prefilledValue) {
            quickFillValues[field.id] = field.prefilledValue;
          } else if (field.options.length > 0) {
            quickFillValues[field.id] = field.options[0].value;
          }
        });
        setValues(quickFillValues);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fields]);

  // Filter visible fields based on conditions
  const visibleFields = useMemo(() => {
    return fields.filter((field) => {
      if (!field.showIf) return true;
      const dependentValue = values[field.showIf.fieldId];
      return field.showIf.values.includes(dependentValue);
    });
  }, [fields, values]);

  // Calculate progress
  const { completedCount, totalCount, progressPercent } = useMemo(() => {
    const completed = visibleFields.filter((f) => values[f.id]?.trim()).length;
    const total = visibleFields.length;
    return {
      completedCount: completed,
      totalCount: total,
      progressPercent: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [visibleFields, values]);

  const canSubmit = progressPercent >= 80;

  const handleFieldChange = useCallback((fieldId: string, value: string) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
  }, []);

  const handleSubmit = async () => {
    if (!canSubmit || isSubmitting) return;
    setIsSubmitting(true);

    const answers: Record<string, string> = {};
    Object.entries(values).forEach(([key, value]) => {
      if (value?.trim()) {
        answers[key] = value;
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 800));
    submitQuestionnaireAnswers(answers);
    onComplete?.();
  };

  return (
    <div className={cn(
      "flex-1 flex gap-3 min-h-0",
      embedded && "gap-0"
    )}>
      {/* Left: Checklist Sidebar with locked preview */}
      <div className={cn(
        "w-56 shrink-0 bg-white flex flex-col overflow-hidden",
        !embedded && "rounded-xl border border-stone-200"
      )}>
        {/* Sidebar header */}
        <div className="shrink-0 px-4 py-3 border-b border-stone-100">
          <h4 className="text-xs font-semibold text-stone-600 uppercase tracking-wide">
            Checklist
          </h4>
        </div>

        {/* Sidebar content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Case Assessment - Spotlight item */}
          <div className="shrink-0 py-2">
            <AssessmentSidebarItem progress={progressPercent} isActive={true} />
          </div>

          {/* Divider */}
          <div className="shrink-0 mx-4 my-1 border-t border-dashed border-stone-200" />

          {/* Locked sections preview */}
          <div className="flex-1 relative min-h-0 overflow-hidden">
            <div className="opacity-60">
              {CHECKLIST_SECTIONS.map((section) => (
                <LockedSectionItem key={section.id} section={section} />
              ))}
            </div>
            <LockedChecklistPreview progress={progressPercent} isUnlocking={isSubmitting} />
          </div>
        </div>
      </div>

      {/* Right: Assessment Form - matches SummaryFieldsCard layout */}
      <div className={cn(
        "flex-1 flex flex-col min-w-0 bg-white overflow-hidden",
        !embedded && "rounded-xl border border-stone-200"
      )}>
        {/* Header - Fixed height with Reference Documents, matches OverviewTab pattern */}
        <div className="shrink-0 p-4 border-b border-stone-100">
          <div className="flex items-center gap-4">
            {/* Left - Progress Summary */}
            <div className="shrink-0 flex items-center gap-3">
              <ProgressRing percent={progressPercent} isComplete={progressPercent === 100} size={48} />
              <div>
                <h3 className="text-sm font-semibold text-stone-700">Case Assessment</h3>
                <p className="text-[11px] text-stone-400 tabular-nums">
                  {completedCount} of {totalCount} completed
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="w-px self-stretch bg-stone-200 shrink-0" />

            {/* Right - Reference Documents (vertical layout) */}
            <div className="flex-1 min-w-0 flex flex-col gap-2">
              {/* Header row */}
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-semibold text-stone-700">Reference Documents</h4>
              </div>
              {/* Document cards row (horizontal scroll) */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none min-h-[30px]">
                {referenceDocuments.length > 0 ? (
                  referenceDocuments.map((doc) => (
                    <div key={doc.id} className="group/pill shrink-0 relative">
                      <button
                        className="inline-flex items-center gap-2 px-2 py-1.5 rounded-lg border border-stone-200 bg-white hover:border-blue-300 transition-all"
                      >
                        <FileText className="size-4 text-blue-500" />
                        <span className="text-xs font-medium text-stone-700 truncate max-w-[120px] group-hover/pill:text-blue-700">
                          {doc.fileName}
                        </span>
                      </button>
                      {!doc.pinned && (
                        <button
                          onClick={(e) => { e.stopPropagation(); removeAssessmentReferenceDoc(doc.groupId); }}
                          className="absolute -top-1.5 -right-1.5 size-4 rounded-full bg-white border border-stone-300 shadow-sm flex items-center justify-center opacity-0 group-hover/pill:opacity-100 transition-opacity hover:bg-rose-50 hover:border-rose-400"
                        >
                          <X className="size-2.5 text-rose-500" />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <span className="text-xs text-stone-400">No documents uploaded</span>
                )}
                {/* Add button — inline after document cards */}
                <button
                  onClick={() => setShowAddDocModal(true)}
                  className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-dashed border-stone-300 bg-stone-50 hover:border-[#0E4268] hover:bg-[#0E4268]/5 text-stone-400 hover:text-[#0E4268] transition-colors text-xs"
                >
                  <Plus className="size-3.5" />
                  Add reference
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 px-5 py-4 overflow-y-auto">
          {/* Fields Section Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-medium text-stone-600">Questions</h4>
              {totalCount - completedCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-medium text-amber-700 bg-amber-100 rounded tabular-nums">
                  {totalCount - completedCount} remaining
                </span>
              )}
            </div>
          </div>

          {/* Fields List */}
          <div className="space-y-1">
            {visibleFields.map((field) => (
              <AssessmentField
                key={field.id}
                field={field}
                value={values[field.id] || ""}
                onChange={(v) => handleFieldChange(field.id, v)}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-4 py-3 border-t border-stone-100 flex items-center justify-between bg-stone-50/50">
          <p className="text-xs text-stone-500 tabular-nums">
            {completedCount}/{totalCount} answered
            {totalCount - completedCount > 0 && (
              <span className="text-amber-600"> · {totalCount - completedCount} remaining</span>
            )}
          </p>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              canSubmit && !isSubmitting
                ? "bg-[#0E4268] text-white hover:bg-[#0a3555]"
                : "bg-stone-200 text-stone-400 cursor-not-allowed"
            )}
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles size={14} />
                </motion.div>
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={14} />
                Generate Checklist
              </>
            )}
          </button>
        </div>
      </div>

      {/* Share Modal */}
      <ShareWithClientModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        caseReference={caseReference}
      />

      {/* Add Reference Document Modal */}
      {showAddDocModal && (
        <AddReferenceDocModal
          documentGroups={documentGroups}
          onClose={() => setShowAddDocModal(false)}
          onLinkGroup={addAssessmentReferenceDoc}
        />
      )}
    </div>
  );
}

// Export the sidebar item for use in ApplicationPage
export { AssessmentSidebarItem };
