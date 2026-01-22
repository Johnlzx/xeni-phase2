"use client";

import { useState, useMemo } from "react";
import {
  FileText,
  Edit3,
  Check,
  X,
  CheckCircle2,
  Upload,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  HardDrive,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCaseDetailStore, useDocumentGroups } from "@/store/case-detail-store";
import {
  EnhancedChecklistItem,
  EnhancedQualityIssue,
  RequiredEvidence,
  DocumentGroup,
} from "@/types/case-detail";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CategoryReviewModal } from "../../shared";

interface ChecklistDetailPanelProps {
  sectionTitle: string;
  sectionId: string;
  items: EnhancedChecklistItem[];
  issues: EnhancedQualityIssue[];
}

// Source badge component
function SourceBadge({ source, documentName }: { source: "extracted" | "questionnaire" | "manual" | null; documentName?: string }) {
  if (!source) return null;

  if (source === "extracted") {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-medium text-blue-600 bg-blue-50 border border-blue-100 rounded">
        <FileText className="size-2.5" />
        {documentName || "Extracted"}
      </span>
    );
  }

  if (source === "manual") {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-medium text-violet-600 bg-violet-50 border border-violet-100 rounded">
        <Edit3 className="size-2.5" />
        Edited
      </span>
    );
  }

  if (source === "questionnaire") {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-medium text-stone-500 bg-stone-50 border border-stone-200 rounded">
        Questionnaire
      </span>
    );
  }

  return null;
}

// Form field component with source indicator
function FormField({
  item,
  editValue,
  onValueChange,
  isEdited,
}: {
  item: EnhancedChecklistItem;
  editValue: string;
  onValueChange: (value: string) => void;
  isEdited: boolean;
}) {
  const hasValue = !!editValue;
  const isComplete = item.status === "complete" || hasValue;

  // Determine display source - show "Edited" if value changed from original
  const displaySource = isEdited ? "manual" : item.source;
  const sourceDocName = item.linkedDocuments.length > 0 ? item.linkedDocuments[0].groupTitle : undefined;

  return (
    <div className={cn(
      "group py-3 px-3 rounded-lg transition-colors",
      !hasValue && item.isRequired && "bg-amber-50/30"
    )}>
      {/* Label row with status and source badge */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className={cn(
            "shrink-0 size-1.5 rounded-full",
            isComplete ? "bg-emerald-500" : item.isRequired ? "bg-amber-400" : "bg-stone-300"
          )} />
          <label className="text-[11px] font-medium text-stone-600 leading-tight truncate">
            {item.label}
          </label>
        </div>
        {hasValue && (
          <SourceBadge source={displaySource} documentName={displaySource === "extracted" ? sourceDocName : undefined} />
        )}
      </div>

      {/* Input field */}
      <input
        type="text"
        value={editValue}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={item.isRequired ? "Required" : "Optional"}
        className={cn(
          "w-full px-3 py-2 text-sm border rounded-md transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-[#0E4268]/20 focus:border-[#0E4268]",
          hasValue ? "border-stone-200 bg-white" : "border-stone-200 bg-stone-50"
        )}
      />
    </div>
  );
}

// Document Preview Content - Simulates scanned document appearance
const DocumentPreviewContent = ({ size = "sm" }: { size?: "sm" | "md" }) => {
  const lineHeight = size === "sm" ? "h-0.5" : "h-1";
  const spacing = size === "sm" ? "space-y-0.5" : "space-y-1";
  const marginTop = size === "sm" ? "mt-1" : "mt-2";

  return (
    <div className={spacing}>
      <div className={cn(lineHeight, "bg-stone-300 rounded w-1/3")} />
      <div className={cn(lineHeight, "bg-stone-200 rounded w-1/4", marginTop)} />
      <div className={cn(lineHeight, "bg-stone-200 rounded w-full", marginTop)} />
      <div className={cn(lineHeight, "bg-stone-200 rounded w-full")} />
      <div className={cn(lineHeight, "bg-stone-200 rounded w-5/6")} />
      <div className={cn(lineHeight, "bg-stone-200 rounded w-full")} />
      <div className={cn(lineHeight, "bg-stone-200 rounded w-3/4")} />
    </div>
  );
};

// Link Documents Modal
function FileHubPickerModal({
  onClose,
  onSelect,
  evidenceName,
}: {
  onClose: () => void;
  onSelect: (groupId: string) => void;
  evidenceName: string;
}) {
  const documentGroups = useDocumentGroups();
  const classifiedGroups = documentGroups.filter(
    (g) => g.id !== "unclassified" && g.files.filter((f) => !f.isRemoved).length > 0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-[480px] max-h-[60vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-stone-800">Link Document</h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Select a document to link as "{evidenceName}"
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {classifiedGroups.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {classifiedGroups.map((group) => {
                const activeFiles = group.files.filter((f) => !f.isRemoved);
                const isPending = group.status === "pending";
                const isReviewed = group.status === "reviewed";

                return (
                  <button
                    key={group.id}
                    onClick={() => onSelect(group.id)}
                    className={cn(
                      "bg-white rounded-lg border transition-all text-left overflow-hidden group",
                      isPending
                        ? "border-amber-200 hover:border-amber-400 hover:shadow-md"
                        : "border-stone-200 hover:border-[#0E4268] hover:shadow-md"
                    )}
                  >
                    {/* Mini preview */}
                    <div className="aspect-[4/3] bg-stone-50 p-2 flex items-center justify-center relative">
                      <div className="h-full aspect-[1/1.414] bg-white rounded border border-stone-200 p-1.5">
                        <DocumentPreviewContent size="sm" />
                      </div>
                      {/* Status badge */}
                      <div className="absolute top-1.5 right-1.5">
                        {isPending ? (
                          <span className="px-1.5 py-0.5 text-[9px] font-semibold text-amber-700 bg-amber-100 rounded">
                            Pending Review
                          </span>
                        ) : isReviewed ? (
                          <span className="px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700 bg-emerald-100 rounded flex items-center gap-0.5">
                            <Check size={8} strokeWidth={3} />
                            Ready
                          </span>
                        ) : null}
                      </div>
                    </div>
                    {/* Title and info */}
                    <div className="px-2 py-1.5 border-t border-stone-100">
                      <p className="text-xs font-medium text-stone-700 truncate group-hover:text-[#0E4268] transition-colors">
                        {group.title}
                      </p>
                      <p className="text-[10px] text-stone-400 tabular-nums">
                        {activeFiles.length} page{activeFiles.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-stone-400">
              <FolderOpen className="size-8 mb-2" />
              <p className="text-sm font-medium">No documents available</p>
              <p className="text-xs mt-1">Upload documents first</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Supporting Document Card - A4 ratio card with preview/review
function SupportingDocumentCard({
  evidence,
  linkedGroup,
  allGroups,
}: {
  evidence: RequiredEvidence;
  linkedGroup?: DocumentGroup;
  allGroups: DocumentGroup[];
}) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showFileHubPicker, setShowFileHubPicker] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const uploadForEvidence = useCaseDetailStore((state) => state.uploadForEvidence);
  const linkEvidenceToGroup = useCaseDetailStore((state) => state.linkEvidenceToGroup);
  const confirmGroupReview = useCaseDetailStore((state) => state.confirmGroupReview);

  const activeFiles = linkedGroup?.files.filter((f) => !f.isRemoved) || [];
  const totalPages = activeFiles.length;
  const isPendingReview = linkedGroup?.status === "pending" && totalPages > 0;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPageIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPageIndex((prev) => Math.min(totalPages - 1, prev + 1));
  };

  const handleUploadLocal = () => {
    uploadForEvidence(evidence.id, evidence.name);
  };

  const handleSelectFromFileHub = (groupId: string) => {
    linkEvidenceToGroup(evidence.id, groupId);
    setShowFileHubPicker(false);
  };

  const handleCardClick = () => {
    if (evidence.isUploaded && linkedGroup) {
      setShowReviewModal(true);
    }
  };

  const handleConfirmReview = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (linkedGroup) {
      confirmGroupReview(linkedGroup.id);
    }
  };

  return (
    <>
      {/* A4 Ratio Card Container */}
      <div
        className={cn(
          "bg-white rounded-lg border overflow-hidden flex flex-col transition-all aspect-[1/1.414]",
          evidence.isUploaded && linkedGroup
            ? isPendingReview
              ? "border-amber-300 hover:border-amber-400 hover:shadow-md cursor-pointer"
              : "border-stone-200 hover:border-stone-300 hover:shadow-md cursor-pointer"
            : "border-dashed border-stone-300"
        )}
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {evidence.isUploaded && linkedGroup && totalPages > 0 ? (
          /* Has document - show preview */
          <>
            {/* Preview area - fills most of the card */}
            <div className="flex-1 relative bg-stone-50 p-1.5 overflow-hidden">
              <div className="w-full h-full relative bg-white rounded border border-stone-200 shadow-sm p-1.5">
                <DocumentPreviewContent size="sm" />

                {/* Page indicator */}
                <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[7px] font-medium text-stone-500 bg-white/90 px-1 py-0.5 rounded tabular-nums">
                  {currentPageIndex + 1}/{totalPages}
                </div>
              </div>

              {/* Navigation arrows - only show on hover when multiple pages */}
              {totalPages > 1 && isHovered && (
                <>
                  <button
                    onClick={handlePrev}
                    disabled={currentPageIndex === 0}
                    className={cn(
                      "absolute left-0 top-1/2 -translate-y-1/2 p-0.5 rounded bg-white/90 shadow-sm transition-all z-10",
                      currentPageIndex === 0
                        ? "opacity-0 pointer-events-none"
                        : "opacity-100 text-stone-500 hover:text-stone-700 hover:bg-white"
                    )}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={10} />
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentPageIndex >= totalPages - 1}
                    className={cn(
                      "absolute right-0 top-1/2 -translate-y-1/2 p-0.5 rounded bg-white/90 shadow-sm transition-all z-10",
                      currentPageIndex >= totalPages - 1
                        ? "opacity-0 pointer-events-none"
                        : "opacity-100 text-stone-500 hover:text-stone-700 hover:bg-white"
                    )}
                    aria-label="Next page"
                  >
                    <ChevronRight size={10} />
                  </button>
                </>
              )}
            </div>

            {/* Footer with title and status */}
            <div className="shrink-0 px-1.5 py-1 border-t border-stone-100 bg-white">
              <p className="text-[8px] font-medium text-stone-700 truncate mb-0.5" title={evidence.name}>
                {evidence.name}
              </p>
              {isPendingReview ? (
                <button
                  onClick={handleConfirmReview}
                  className="text-[7px] font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-0.5 transition-colors"
                >
                  <Check size={8} strokeWidth={3} />
                  Review
                </button>
              ) : (
                <span className="text-[7px] font-medium text-emerald-600 flex items-center gap-0.5">
                  <Check size={8} strokeWidth={3} />
                  Ready
                </span>
              )}
            </div>
          </>
        ) : (
          /* Empty state - needs upload */
          <div className="flex-1 flex flex-col items-center justify-center p-2">
            <Upload size={14} className="text-stone-300 mb-1" />
            <p className="text-[8px] font-medium text-stone-500 text-center mb-0.5 truncate w-full px-1" title={evidence.name}>
              {evidence.name}
            </p>
            <p className="text-[7px] text-stone-400 mb-2">
              {evidence.isMandatory ? "Required" : "Optional"}
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-center gap-0.5 px-2 py-1 rounded text-[8px] font-medium text-white bg-[#0E4268] hover:bg-[#0a3555] transition-colors"
                >
                  <Plus size={9} />
                  Add
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48">
                <DropdownMenuItem onClick={handleUploadLocal} className="gap-2 text-xs">
                  <HardDrive size={12} className="text-stone-400 shrink-0" />
                  <span className="whitespace-nowrap">Upload from Computer</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowFileHubPicker(true)} className="gap-2 text-xs">
                  <FolderOpen size={12} className="text-stone-400 shrink-0" />
                  <span className="whitespace-nowrap">Select from Documents</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* File Hub Picker Modal */}
      {showFileHubPicker && (
        <FileHubPickerModal
          evidenceName={evidence.name}
          onClose={() => setShowFileHubPicker(false)}
          onSelect={handleSelectFromFileHub}
        />
      )}

      {/* Review Modal */}
      {showReviewModal && linkedGroup && (
        <CategoryReviewModal
          group={linkedGroup}
          allGroups={allGroups}
          onClose={() => setShowReviewModal(false)}
        />
      )}
    </>
  );
}

// Main Detail Panel - Form Data & Supporting Documents tabs
export function ChecklistDetailPanel({
  sectionTitle,
  sectionId,
  items,
  issues,
}: ChecklistDetailPanelProps) {
  const documentGroups = useDocumentGroups();
  const updateField = useCaseDetailStore((state) => state.updateEnhancedChecklistField);

  // Local form state - initialize from items
  const [formValues, setFormValues] = useState<Record<string, string>>(() => {
    const values: Record<string, string> = {};
    items.forEach((item) => {
      values[item.id] = item.value || "";
    });
    return values;
  });

  // Track original values to detect changes
  const originalValues = useMemo(() => {
    const values: Record<string, string> = {};
    items.forEach((item) => {
      values[item.id] = item.value || "";
    });
    return values;
  }, [items]);

  // Detect if any field has been edited
  const hasChanges = useMemo(() => {
    return items.some((item) => formValues[item.id] !== originalValues[item.id]);
  }, [formValues, originalValues, items]);

  // Get edited field IDs
  const editedFieldIds = useMemo(() => {
    const ids = new Set<string>();
    items.forEach((item) => {
      if (formValues[item.id] !== originalValues[item.id]) {
        ids.add(item.id);
      }
    });
    return ids;
  }, [formValues, originalValues, items]);

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSave = () => {
    // Save all changed fields
    items.forEach((item) => {
      if (formValues[item.id] !== originalValues[item.id]) {
        updateField(item.id, formValues[item.id]);
      }
    });
  };

  const handleCancel = () => {
    // Reset to original values
    setFormValues(originalValues);
  };

  // Collect all required evidence from items (deduplicated)
  const allRequiredEvidence = useMemo(() => {
    const evidenceMap = new Map<string, RequiredEvidence>();
    items.forEach((item) => {
      item.requiredEvidence?.forEach((ev) => {
        if (!evidenceMap.has(ev.id)) {
          evidenceMap.set(ev.id, ev);
        }
      });
    });
    return Array.from(evidenceMap.values());
  }, [items]);

  // Helper to find linked group for evidence
  const getLinkedGroup = (evidence: RequiredEvidence): DocumentGroup | undefined => {
    if (!evidence.linkedFileId) return undefined;
    return documentGroups.find((g) => g.id === evidence.linkedFileId);
  };

  // Split into mandatory and optional
  const mandatoryEvidence = allRequiredEvidence.filter((ev) => ev.isMandatory);
  const optionalEvidence = allRequiredEvidence.filter((ev) => !ev.isMandatory);
  const missingMandatory = mandatoryEvidence.filter((ev) => !ev.isUploaded);

  // Completed fields count (based on current form values)
  const completedFields = items.filter((i) => !!formValues[i.id]).length;

  // Unresolved issues count (for display in header)
  const unresolvedIssues = issues.filter((i) => i.status !== "resolved");

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Section Header */}
      <div className="shrink-0 px-6 py-3 border-b border-stone-100">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <h2 className="text-base font-semibold text-stone-900">{sectionTitle}</h2>
            <span className="text-xs text-stone-400 tabular-nums">
              {completedFields}/{items.length} complete
            </span>
          </div>
          {/* Status indicators - match sidebar display */}
          <div className="flex items-center gap-2 text-xs text-stone-500">
            {items.length - completedFields > 0 && (
              <span className="tabular-nums">
                {items.length - completedFields} field{items.length - completedFields > 1 ? "s" : ""}
              </span>
            )}
            {items.length - completedFields > 0 && missingMandatory.length > 0 && (
              <span>,</span>
            )}
            {missingMandatory.length > 0 && (
              <span className="text-amber-600 tabular-nums">
                {missingMandatory.length} doc{missingMandatory.length > 1 ? "s" : ""}
              </span>
            )}
            {(items.length - completedFields > 0 || missingMandatory.length > 0) && (
              <span>needed</span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs - Form Data & Supporting Documents */}
      <Tabs
        defaultValue="form-data"
        className="flex-1 flex flex-col min-h-0 overflow-hidden"
      >
        <TabsList className="shrink-0 w-full h-10 p-1 bg-stone-50 rounded-none justify-start gap-1 px-6 border-b border-stone-100">
          <TabsTrigger
            value="form-data"
            className="px-3 py-1.5 rounded-md text-sm text-stone-500 data-[state=active]:bg-white data-[state=active]:text-stone-900 data-[state=active]:shadow-sm hover:text-stone-700 transition-all"
          >
            Details
            <span className="ml-1.5 text-xs text-stone-400 tabular-nums">{items.length}</span>
          </TabsTrigger>
          <TabsTrigger
            value="supporting-documents"
            className="px-3 py-1.5 rounded-md text-sm text-stone-500 data-[state=active]:bg-white data-[state=active]:text-stone-900 data-[state=active]:shadow-sm hover:text-stone-700 transition-all"
          >
            Supporting Documents
            {missingMandatory.length > 0 && (
              <span className="ml-1.5 text-xs text-amber-600 tabular-nums">{missingMandatory.length}</span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Details Tab - Two column form */}
        <TabsContent
          value="form-data"
          className="flex-1 min-h-0 mt-0 data-[state=inactive]:hidden overflow-auto"
        >
          <div className="px-6 py-5">
            {items.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                {items.map((item) => (
                  <FormField
                    key={item.id}
                    item={item}
                    editValue={formValues[item.id] || ""}
                    onValueChange={(value) => handleFieldChange(item.id, value)}
                    isEdited={editedFieldIds.has(item.id)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-stone-400 py-8 text-center">
                No fields in this section
              </p>
            )}
          </div>
        </TabsContent>

        {/* Supporting Documents Tab */}
        <TabsContent
          value="supporting-documents"
          className="flex-1 min-h-0 mt-0 data-[state=inactive]:hidden overflow-auto"
        >
          <div className="px-6 py-5 space-y-5">
            {allRequiredEvidence.length > 0 ? (
              <>
                {/* Mandatory documents - grid with A4 ratio cards */}
                {mandatoryEvidence.length > 0 && (
                  <div>
                    <p className="text-[11px] font-medium text-stone-500 uppercase tracking-wide mb-2">
                      Required Documents
                    </p>
                    <div className="grid grid-cols-6 xl:grid-cols-8 gap-2">
                      {mandatoryEvidence.map((ev) => (
                        <SupportingDocumentCard
                          key={ev.id}
                          evidence={ev}
                          linkedGroup={getLinkedGroup(ev)}
                          allGroups={documentGroups}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Optional documents - grid with A4 ratio cards */}
                {optionalEvidence.length > 0 && (
                  <div>
                    <p className="text-[11px] font-medium text-stone-400 uppercase tracking-wide mb-2">
                      Optional Documents
                    </p>
                    <div className="grid grid-cols-6 xl:grid-cols-8 gap-2">
                      {optionalEvidence.map((ev) => (
                        <SupportingDocumentCard
                          key={ev.id}
                          evidence={ev}
                          linkedGroup={getLinkedGroup(ev)}
                          allGroups={documentGroups}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-stone-400">
                <FileText className="size-6 mb-2" />
                <p className="text-xs">No documents required</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Save/Cancel Footer - fixed at bottom, only show when changes detected */}
      {hasChanges && (
        <div className="shrink-0 px-6 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <p className="text-xs text-stone-500">
            {editedFieldIds.size} field{editedFieldIds.size !== 1 ? "s" : ""} modified
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
              <Check size={14} />
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
