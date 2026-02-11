"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import {
  FileText,
  Edit3,
  Check,
  X,
  Eye,
  EyeOff,
  Plus,
  FolderOpen,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCaseDetailStore, useDocumentGroups } from "@/store/case-detail-store";
import {
  EnhancedChecklistItem,
  EnhancedQualityIssue,
  DocumentGroup,
  LinkedDocument,
} from "@/types/case-detail";
import { CategoryReviewModal } from "../../shared";
import { ProgressRing } from "../../shared/ProgressRing";
import { AddReferenceDocModal } from "../../shared/AddReferenceDocModal";

interface ChecklistDetailPanelProps {
  sectionTitle: string;
  sectionId: string;
  items: EnhancedChecklistItem[];
  issues: EnhancedQualityIssue[];
}

// Clickable Source badge component - opens document preview on click
function SourceBadge({
  source,
  documentName,
  linkedDocument,
  documentGroups,
}: {
  source: "extracted" | "questionnaire" | "manual" | null;
  documentName?: string;
  linkedDocument?: LinkedDocument;
  documentGroups: DocumentGroup[];
}) {
  const [showPreview, setShowPreview] = useState(false);

  if (!source) return null;

  // Find the linked group for preview
  const linkedGroup = linkedDocument
    ? documentGroups.find((g) => g.files.some((f) => f.id === linkedDocument.fileId))
    : undefined;

  if (source === "extracted") {
    return (
      <>
        <button
          onClick={() => linkedGroup && setShowPreview(true)}
          className={cn(
            "inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-medium text-blue-600 bg-blue-50 border border-blue-100 rounded transition-colors",
            linkedGroup && "hover:bg-blue-100 hover:border-blue-200 cursor-pointer"
          )}
        >
          <FileText className="size-2.5" />
          {documentName || "Extracted"}
          {linkedGroup && <Eye className="size-2.5 ml-0.5 opacity-60" />}
        </button>

        {/* Preview Modal */}
        {showPreview && linkedGroup && (
          <CategoryReviewModal
            group={linkedGroup}
            allGroups={documentGroups}
            onClose={() => setShowPreview(false)}
          />
        )}
      </>
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

// Serialize reference doc IDs into a stable string for comparison
function refDocsKey(docs: { groupId: string }[]) {
  return docs
    .map((d) => d.groupId)
    .sort()
    .join(",");
}

// Main Detail Panel
export function ChecklistDetailPanel({
  sectionTitle,
  sectionId,
  items,
  issues,
}: ChecklistDetailPanelProps) {
  const documentGroups = useDocumentGroups();
  const updateField = useCaseDetailStore((state) => state.updateEnhancedChecklistField);
  const sectionReferenceDocIds = useCaseDetailStore((state) => state.sectionReferenceDocIds);
  const addSectionReferenceDoc = useCaseDetailStore((state) => state.addSectionReferenceDoc);
  const removeSectionReferenceDoc = useCaseDetailStore((state) => state.removeSectionReferenceDoc);

  const [showAddRefModal, setShowAddRefModal] = useState(false);
  const [previewGroup, setPreviewGroup] = useState<DocumentGroup | null>(null);

  // --- Re-analysis state ---
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [reanalysisProgress, setReanalysisProgress] = useState(0);
  // Snapshot of reference doc IDs at last analysis (or mount)
  const analyzedRefSnapshot = useRef<string | null>(null);

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
    if (isReanalyzing) return; // Block edits during re-analysis
    setFormValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSave = () => {
    items.forEach((item) => {
      if (formValues[item.id] !== originalValues[item.id]) {
        updateField(item.id, formValues[item.id]);
      }
    });
  };

  const handleCancel = () => {
    setFormValues(originalValues);
  };

  // Progress calculation
  const completedCount = items.filter((i) => !!formValues[i.id] || !!i.value).length;
  const totalCount = items.length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isComplete = completedCount === totalCount;
  const missingCount = totalCount - completedCount;

  // Field display toggle - default to showing only unfilled fields
  const [showAllFields, setShowAllFields] = useState(false);
  const missingItems = items.filter((i) => !formValues[i.id] && !i.value);
  const allFieldsComplete = missingItems.length === 0;
  const displayItems = allFieldsComplete || showAllFields ? items : missingItems;

  // Reference documents — read exclusively from store (seeded at checklist generation)
  const referenceDocs = useMemo(() => {
    const sectionRefIds = sectionReferenceDocIds[sectionId] || [];
    return sectionRefIds
      .map((groupId) => {
        const group = documentGroups.find((g) => g.id === groupId);
        if (!group || group.files.filter((f) => !f.isRemoved).length === 0) return null;
        return { id: `ref-${groupId}`, groupId: group.id, name: group.title };
      })
      .filter((d): d is NonNullable<typeof d> => d !== null);
  }, [sectionReferenceDocIds, sectionId, documentGroups]);

  // --- Re-analysis: track reference doc changes ---
  const currentRefKey = refDocsKey(referenceDocs);

  // Synchronous init on first render - avoids flash of needsReanalysis=true
  if (analyzedRefSnapshot.current === null) {
    analyzedRefSnapshot.current = currentRefKey;
  }

  // Determine if references changed since last analysis
  const needsReanalysis = !isReanalyzing && analyzedRefSnapshot.current !== currentRefKey;

  // Simulate re-analysis
  const handleReanalyze = useCallback(async () => {
    setIsReanalyzing(true);
    setReanalysisProgress(0);

    // Simulate multi-step analysis (compact, ~2s total)
    const steps = [
      { progress: 20, delay: 300 },
      { progress: 50, delay: 400 },
      { progress: 80, delay: 400 },
      { progress: 100, delay: 300 },
    ];

    for (const step of steps) {
      await new Promise((r) => setTimeout(r, step.delay));
      setReanalysisProgress(step.progress);
    }

    // Complete: update snapshot, clear loading
    analyzedRefSnapshot.current = currentRefKey;
    setIsReanalyzing(false);
    setReanalysisProgress(0);
  }, [currentRefKey]);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="shrink-0 border-b border-stone-100">
        {/* Progress row */}
        <div className="px-4 py-3 flex items-center gap-3">
          <ProgressRing percent={percent} isComplete={isComplete} size={48} />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-stone-700">{sectionTitle}</h3>
            <p className="text-[11px] text-stone-400 tabular-nums">
              {completedCount} of {totalCount} completed
            </p>
          </div>

          {/* Re-analyze button - only visible when references changed */}
          {needsReanalysis && (
            <button
              onClick={handleReanalyze}
              className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-amber-200 bg-amber-50 text-xs font-medium text-amber-700 hover:bg-amber-100 hover:border-amber-300 transition-colors"
            >
              <RefreshCw className="size-3" />
              Re-analyze
            </button>
          )}
        </div>

        {/* Reference Documents - always visible */}
        <div className="border-t border-stone-100 px-4 py-2 flex items-center gap-2 min-h-[36px]">
          <FolderOpen className="size-4 text-stone-400 shrink-0" />
          <span className="text-xs font-medium text-stone-500 shrink-0">References</span>

          {/* Add button - left-aligned, near label */}
          <button
            onClick={() => setShowAddRefModal(true)}
            className="shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium text-stone-400 hover:text-[#0E4268] hover:bg-[#0E4268]/5 transition-colors"
          >
            <Plus className="size-3" />
          </button>

          {/* Document list - inline */}
          <div className="flex-1 min-w-0 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {referenceDocs.map((doc) => {
              const isAnalyzed = analyzedRefSnapshot.current
                ? analyzedRefSnapshot.current.split(",").includes(doc.groupId)
                : true; // first render before snapshot init, treat as analyzed

              return (
                <div
                  key={doc.id}
                  className={cn(
                    "group/item shrink-0 flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors",
                    isAnalyzed
                      ? "bg-blue-50/60 border border-blue-200/60 hover:border-blue-300"
                      : "bg-amber-50 border border-amber-200 hover:border-amber-300"
                  )}
                >
                  <FileText className={cn("size-3", isAnalyzed ? "text-blue-500" : "text-amber-500")} />
                  <button
                    onClick={() => {
                      const g = documentGroups.find((g) => g.id === doc.groupId);
                      if (g) setPreviewGroup(g);
                    }}
                    className={cn(
                      "text-[11px] font-medium truncate max-w-[100px] transition-colors",
                      isAnalyzed
                        ? "text-stone-600 hover:text-blue-600"
                        : "text-amber-700 hover:text-amber-800"
                    )}
                  >
                    {doc.name}
                  </button>
                  <button
                    onClick={() => removeSectionReferenceDoc(sectionId, doc.groupId)}
                    className="shrink-0 size-3.5 rounded-full flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity text-stone-400 hover:text-rose-500"
                  >
                    <X className="size-2.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scrollable Content - with inline loading overlay during re-analysis */}
      <div className="flex-1 relative min-h-0">
        <div
          className={cn(
            "absolute inset-0 px-5 py-4 overflow-y-auto",
            isReanalyzing && "pointer-events-none"
          )}
        >
          {/* Fields Section Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-medium text-stone-600">Fields</h4>
              {!showAllFields && missingCount > 0 && !isReanalyzing && (
                <span className="px-1.5 py-0.5 text-[10px] font-medium text-amber-700 bg-amber-100 rounded tabular-nums">
                  {missingCount} remaining
                </span>
              )}
            </div>
            {/* Toggle: show missing vs show all */}
            {!allFieldsComplete && !isReanalyzing && (
              <button
                onClick={() => setShowAllFields((v) => !v)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
              >
                {showAllFields ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
                {showAllFields ? "Show missing" : "Show all"}
              </button>
            )}
          </div>

          {/* Fields List */}
          <div className={cn("space-y-1 transition-opacity", isReanalyzing && "opacity-30")}>
            {displayItems.map((item) => {
              const value = formValues[item.id] || "";
              const hasValue = !!value;
              const isEdited = editedFieldIds.has(item.id);
              const displaySource = isEdited ? ("manual" as const) : item.source;
              const sourceDocName =
                item.linkedDocuments?.length > 0 ? item.linkedDocuments[0].groupTitle : undefined;
              const firstLinkedDoc =
                item.linkedDocuments?.length > 0 ? item.linkedDocuments[0] : undefined;

              return (
                <div
                  key={item.id}
                  className="group py-3 px-3 rounded-lg transition-colors hover:bg-stone-50/50"
                >
                  {/* Label row with status and source badge */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div
                        className={cn(
                          "shrink-0 size-1.5 rounded-full",
                          hasValue
                            ? "bg-emerald-500"
                            : item.isRequired
                              ? "bg-amber-400"
                              : "bg-stone-300"
                        )}
                      />
                      <label className="text-[11px] font-medium text-stone-600 leading-tight truncate">
                        {item.label}
                      </label>
                    </div>
                    {/* Source badge */}
                    {hasValue && (
                      <SourceBadge
                        source={displaySource}
                        documentName={displaySource === "extracted" ? sourceDocName : undefined}
                        linkedDocument={displaySource === "extracted" ? firstLinkedDoc : undefined}
                        documentGroups={documentGroups}
                      />
                    )}
                  </div>

                  {/* Input field */}
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => handleFieldChange(item.id, e.target.value)}
                    disabled={isReanalyzing}
                    placeholder={item.isRequired ? "Required" : "Optional"}
                    className={cn(
                      "w-full px-3 py-2 text-sm border rounded-md transition-colors",
                      "focus:outline-none focus:ring-2 focus:ring-[#0E4268]/20 focus:border-[#0E4268]",
                      "disabled:cursor-not-allowed disabled:opacity-50",
                      hasValue ? "border-stone-200 bg-white" : "border-stone-200 bg-stone-50"
                    )}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Re-analysis loading overlay - compact, centered */}
        {isReanalyzing && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-3 px-6 py-4 rounded-xl bg-white/90 border border-stone-200 shadow-sm backdrop-blur-sm">
              <Loader2 className="size-5 text-[#0E4268] animate-spin" />
              <div className="text-center">
                <p className="text-xs font-medium text-stone-700">Analyzing references…</p>
                <p className="text-[10px] text-stone-400 tabular-nums mt-0.5">{reanalysisProgress}%</p>
              </div>
              {/* Mini progress bar */}
              <div className="w-32 h-1 rounded-full bg-stone-200 overflow-hidden">
                <div
                  className="h-full bg-[#0E4268] rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${reanalysisProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer - shows when changes detected (hidden during re-analysis) */}
      {hasChanges && !isReanalyzing && (
        <div className="shrink-0 px-4 py-3 border-t border-stone-100 flex items-center justify-between bg-stone-50/50">
          <p className="text-xs text-stone-500 tabular-nums">
            {editedFieldIds.size} field{editedFieldIds.size !== 1 ? "s" : ""} modified
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
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

      {/* Add Reference Document Modal */}
      {showAddRefModal && (
        <AddReferenceDocModal
          documentGroups={documentGroups}
          onClose={() => setShowAddRefModal(false)}
          onLinkGroup={(groupId) => addSectionReferenceDoc(sectionId, groupId)}
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
    </div>
  );
}
