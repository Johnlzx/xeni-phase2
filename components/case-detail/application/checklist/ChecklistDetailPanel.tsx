"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
  FileText,
  Edit3,
  Check,
  X,
  CheckCircle2,
  Upload,
  FolderOpen,
  HardDrive,
  Plus,
  Eye,
  ListFilter,
  AlertCircle,
  CircleDashed,
  Sparkles,
  PanelRight,
  Columns3,
  Link2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCaseDetailStore, useDocumentGroups } from "@/store/case-detail-store";
import {
  EnhancedChecklistItem,
  EnhancedQualityIssue,
  RequiredEvidence,
  DocumentGroup,
  LinkedDocument,
} from "@/types/case-detail";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CategoryReviewModal, DocumentPreviewContent } from "../../shared";

interface ChecklistDetailPanelProps {
  sectionTitle: string;
  sectionId: string;
  items: EnhancedChecklistItem[];
  issues: EnhancedQualityIssue[];
  onTabChange?: (tab: "overview" | "details" | "supporting-documents") => void;
  externalActiveTab?: "overview" | "details" | "supporting-documents";
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

// Evidence Card - for sidebar display
function EvidenceCard({
  evidence,
  linkedGroup,
  allGroups,
}: {
  evidence: RequiredEvidence;
  linkedGroup?: DocumentGroup;
  allGroups: DocumentGroup[];
}) {
  const [showFileHubPicker, setShowFileHubPicker] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const uploadForEvidence = useCaseDetailStore((state) => state.uploadForEvidence);
  const linkEvidenceToGroup = useCaseDetailStore((state) => state.linkEvidenceToGroup);
  const confirmGroupReview = useCaseDetailStore((state) => state.confirmGroupReview);

  const isUploaded = evidence.isUploaded;
  const isPendingReview = linkedGroup?.status === "pending";

  const handleUploadLocal = () => {
    uploadForEvidence(evidence.id, evidence.name);
  };

  const handleSelectFromFileHub = (groupId: string) => {
    linkEvidenceToGroup(evidence.id, groupId);
    setShowFileHubPicker(false);
  };

  const handleCardClick = () => {
    if (isUploaded && linkedGroup) {
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
      <div
        onClick={handleCardClick}
        className={cn(
          "rounded-lg border overflow-hidden transition-colors",
          isUploaded
            ? isPendingReview
              ? "border-amber-300 bg-amber-50/30 cursor-pointer hover:border-amber-400"
              : "border-emerald-200 bg-emerald-50/30 cursor-pointer hover:border-emerald-300"
            : "border-dashed border-stone-300 bg-stone-50/50"
        )}
      >
        {isUploaded ? (
          <>
            {/* Preview area */}
            <div className="aspect-[4/3] p-2 flex items-center justify-center relative bg-white/50">
              <div className="h-full aspect-[1/1.414] bg-white rounded border border-stone-200 p-1.5 shadow-sm">
                <DocumentPreviewContent size="sm" />
              </div>
              {/* Status indicator */}
              <div className="absolute top-1.5 right-1.5">
                {isPendingReview ? (
                  <button
                    onClick={handleConfirmReview}
                    className="text-[8px] font-semibold text-amber-600 bg-white px-1.5 py-0.5 rounded shadow-sm hover:bg-amber-50 transition-colors"
                  >
                    Review
                  </button>
                ) : (
                  <CheckCircle2 className="size-4 text-emerald-500" />
                )}
              </div>
            </div>
            {/* Title */}
            <div className={cn(
              "px-2 py-1.5 border-t",
              isPendingReview ? "bg-amber-50 border-amber-100" : "bg-emerald-50 border-emerald-100"
            )}>
              <p className={cn(
                "text-[10px] font-medium truncate",
                isPendingReview ? "text-amber-700" : "text-emerald-700"
              )} title={evidence.name}>
                {evidence.name}
              </p>
              <p className="text-[9px] text-stone-400">
                {isPendingReview ? "Pending review" : "Ready"}
              </p>
            </div>
          </>
        ) : (
          /* Empty state - needs upload */
          <div className="p-3 flex flex-col items-center justify-center min-h-[100px]">
            <Upload size={16} className="text-stone-300 mb-1.5" />
            <p className="text-[10px] font-medium text-stone-600 text-center mb-0.5 truncate w-full" title={evidence.name}>
              {evidence.name}
            </p>
            <p className="text-[9px] text-stone-400 mb-2">
              {evidence.isMandatory ? "Required" : "Optional"}
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-center gap-1 px-2.5 py-1 rounded text-[9px] font-medium text-stone-600 bg-white border border-stone-300 hover:bg-stone-50 hover:border-stone-400 transition-colors"
                >
                  <Plus size={10} />
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

// Simplified Field Card - only field info with clickable source badge
function FieldCard({
  item,
  editValue,
  onValueChange,
  isEdited,
  documentGroups,
}: {
  item: EnhancedChecklistItem;
  editValue: string;
  onValueChange: (value: string) => void;
  isEdited: boolean;
  documentGroups: DocumentGroup[];
}) {
  const hasValue = !!editValue;
  const isComplete = item.status === "complete" || hasValue;

  // Determine display source - show "Edited" if value changed from original
  const displaySource = isEdited ? "manual" : item.source;
  const sourceDocName = item.linkedDocuments.length > 0 ? item.linkedDocuments[0].groupTitle : undefined;
  const firstLinkedDoc = item.linkedDocuments.length > 0 ? item.linkedDocuments[0] : undefined;

  return (
    <div className={cn(
      "border rounded-lg p-4 transition-colors",
      !hasValue && item.isRequired
        ? "border-amber-200 bg-amber-50/20"
        : "border-stone-200 hover:border-stone-300 bg-white"
    )}>
      {/* Label row with status and source badge */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className={cn(
            "shrink-0 size-2 rounded-full",
            isComplete ? "bg-emerald-500" : item.isRequired ? "bg-amber-400" : "bg-stone-300"
          )} />
          <label className="text-sm font-medium text-stone-700 truncate">
            {item.label}
          </label>
        </div>
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

// Filter type for field list - based on data source and status
type FieldFilterKey = "missing" | "extracted" | "manual" | "questionnaire" | "low_confidence";

// Filter configuration
const filterOptions: { key: FieldFilterKey; label: string; icon: React.ElementType }[] = [
  { key: "missing", label: "Missing", icon: CircleDashed },
  { key: "extracted", label: "AI Extracted", icon: Sparkles },
  { key: "manual", label: "Manual Entry", icon: Edit3 },
  { key: "questionnaire", label: "Questionnaire", icon: FileText },
  { key: "low_confidence", label: "Needs Review", icon: AlertCircle },
];

// Field Filter Dropdown - Multi-select filter
function FieldFilterDropdown({
  items,
  activeFilters,
  onFilterChange,
}: {
  items: EnhancedChecklistItem[];
  activeFilters: Set<FieldFilterKey>;
  onFilterChange: (filters: Set<FieldFilterKey>) => void;
}) {
  // Calculate counts for each filter
  const counts = useMemo(() => {
    return {
      missing: items.filter((item) => item.isRequired && !item.value).length,
      extracted: items.filter((item) => item.source === "extracted").length,
      manual: items.filter((item) => item.source === "manual").length,
      questionnaire: items.filter((item) => item.source === "questionnaire").length,
      low_confidence: items.filter(
        (item) => item.source === "extracted" && item.confidenceScore !== undefined && item.confidenceScore < 80
      ).length,
    };
  }, [items]);

  // Only show filter options with count > 0
  const availableFilters = filterOptions.filter((opt) => counts[opt.key] > 0);

  if (availableFilters.length === 0) {
    return null;
  }

  const isFiltered = activeFilters.size > 0;
  const selectedCount = activeFilters.size;

  const handleToggle = (key: FieldFilterKey) => {
    const newFilters = new Set(activeFilters);
    if (newFilters.has(key)) {
      newFilters.delete(key);
    } else {
      newFilters.add(key);
    }
    onFilterChange(newFilters);
  };

  const handleClear = () => {
    onFilterChange(new Set());
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border transition-colors",
              isFiltered
                ? "bg-stone-100 text-stone-800 border-stone-300"
                : "bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:bg-stone-50"
            )}
          >
            <ListFilter className="size-3.5" />
            <span>Filter</span>
            {isFiltered && (
              <span className="ml-0.5 px-1.5 py-0.5 text-[10px] bg-stone-200 text-stone-700 rounded tabular-nums">
                {selectedCount}
              </span>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-44 p-1">
          {availableFilters.map((filter) => {
            const Icon = filter.icon;
            const isSelected = activeFilters.has(filter.key);

            return (
              <button
                key={filter.key}
                onClick={() => handleToggle(filter.key)}
                className={cn(
                  "w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded transition-colors text-left",
                  isSelected
                    ? "bg-stone-100 text-stone-800"
                    : "text-stone-600 hover:bg-stone-50"
                )}
              >
                {/* Checkbox indicator */}
                <div className={cn(
                  "size-3.5 rounded border flex items-center justify-center shrink-0",
                  isSelected ? "bg-stone-700 border-stone-700" : "border-stone-300"
                )}>
                  {isSelected && <Check className="size-2.5 text-white" strokeWidth={3} />}
                </div>
                <Icon className="size-3.5 text-stone-400 shrink-0" />
                <span className="flex-1 truncate">{filter.label}</span>
                <span className="tabular-nums text-stone-400">{counts[filter.key]}</span>
              </button>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Active filter tags */}
      {isFiltered && (
        <div className="flex items-center gap-1.5">
          {Array.from(activeFilters).map((key) => {
            const filter = filterOptions.find((f) => f.key === key);
            if (!filter) return null;

            return (
              <span
                key={key}
                className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-stone-600 bg-stone-100 border border-stone-200 rounded"
              >
                {filter.label}
                <button
                  onClick={() => handleToggle(key)}
                  className="text-stone-400 hover:text-stone-600"
                >
                  <X className="size-2.5" />
                </button>
              </span>
            );
          })}
          {selectedCount > 1 && (
            <button
              onClick={handleClear}
              className="text-[10px] font-medium text-stone-500 hover:text-stone-700 hover:underline"
            >
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Panel mode type - only two modes now
type DocumentPanelMode = "default" | "expanded";

// Unified Evidence Slot - consistent style for both modes
function EvidenceSlot({
  evidence,
  linkedGroup,
  isLinking,
  onStartLink,
  onCancelLink,
  allGroups,
}: {
  evidence: RequiredEvidence;
  linkedGroup?: DocumentGroup;
  isLinking: boolean;
  onStartLink: () => void;
  onCancelLink: () => void;
  allGroups: DocumentGroup[];
}) {
  const [showFileHubPicker, setShowFileHubPicker] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const uploadForEvidence = useCaseDetailStore((state) => state.uploadForEvidence);
  const linkEvidenceToGroup = useCaseDetailStore((state) => state.linkEvidenceToGroup);
  const unlinkEvidence = useCaseDetailStore((state) => state.unlinkEvidence);

  const handleUploadLocal = () => {
    uploadForEvidence(evidence.id, evidence.name);
  };

  const handleSelectFromPicker = (groupId: string) => {
    linkEvidenceToGroup(evidence.id, groupId);
    setShowFileHubPicker(false);
  };

  const handleCardClick = () => {
    if (evidence.isUploaded && linkedGroup) {
      setShowReviewModal(true);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    if (evidence.isUploaded) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "link";
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (evidence.isUploaded) return;

    const groupId = e.dataTransfer.getData("application/x-document-group-id");
    if (groupId) {
      linkEvidenceToGroup(evidence.id, groupId);
    }
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "rounded-lg border p-2.5 transition-colors",
          evidence.isUploaded
            ? "border-emerald-200 bg-emerald-50/50 cursor-pointer hover:border-emerald-300"
            : isDragOver
              ? "border-blue-400 border-solid bg-blue-50 ring-1 ring-blue-200"
              : "border-dashed border-stone-300 bg-stone-50/50 hover:border-stone-400"
        )}
      >
        <div className="flex items-start gap-2">
          {evidence.isUploaded ? (
            <CheckCircle2 className="size-4 text-emerald-500 mt-0.5 shrink-0" />
          ) : (
            <CircleDashed className={cn(
              "size-4 mt-0.5 shrink-0",
              evidence.isMandatory ? "text-amber-500" : "text-stone-400"
            )} />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-stone-700 truncate">{evidence.name}</p>
            {linkedGroup ? (
              <p className="text-[10px] text-emerald-600 truncate mt-0.5">
                Linked: {linkedGroup.title}
              </p>
            ) : (
              <p className="text-[10px] text-stone-400 mt-0.5">
                {evidence.isMandatory ? "Required" : "Optional"}
              </p>
            )}
          </div>
          {/* Unlink button for linked evidence */}
          {evidence.isUploaded && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                unlinkEvidence(evidence.id);
              }}
              className="shrink-0 p-1 rounded text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Unlink"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Action buttons for unlinked evidence */}
        {!evidence.isUploaded && (
          <div className="mt-2 flex gap-1.5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-[10px] font-medium text-stone-600 bg-white border border-stone-200 hover:bg-stone-50 hover:border-stone-300 transition-colors"
                >
                  <Plus size={12} />
                  Add
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
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
          onSelect={handleSelectFromPicker}
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

// Document Panel - Two-state panel for evidence management
function DocumentPanel({
  items,
  documentGroups,
  mode,
  onModeChange,
}: {
  items: EnhancedChecklistItem[];
  documentGroups: DocumentGroup[];
  mode: DocumentPanelMode;
  onModeChange: (mode: DocumentPanelMode) => void;
}) {
  // State for document preview modal
  const [previewGroup, setPreviewGroup] = useState<DocumentGroup | null>(null);

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

  // Count stats
  const uploadedMandatory = mandatoryEvidence.filter((ev) => ev.isUploaded).length;
  const totalMandatory = mandatoryEvidence.length;

  // Available document groups for linking (excluding unclassified and empty groups)
  const availableGroups = documentGroups.filter(
    (g) => g.id !== "unclassified" && g.files.filter((f) => !f.isRemoved).length > 0
  );

  // Count how many times each document group is linked
  const linkCountByGroupId = useMemo(() => {
    const counts: Record<string, number> = {};
    allRequiredEvidence.forEach((ev) => {
      if (ev.linkedFileId) {
        counts[ev.linkedFileId] = (counts[ev.linkedFileId] || 0) + 1;
      }
    });
    return counts;
  }, [allRequiredEvidence]);

  // Toggle between modes
  const toggleMode = () => {
    onModeChange(mode === "default" ? "expanded" : "default");
  };

  // ============================================
  // DEFAULT MODE - Single column sidebar
  // ============================================
  if (mode === "default") {
    if (allRequiredEvidence.length === 0) {
      return (
        <div className="h-full flex flex-col bg-stone-50/50">
          {/* Header with expand toggle */}
          <div className="shrink-0 px-3 py-2 border-b border-stone-100 flex items-center justify-between">
            <span className="text-[10px] font-medium text-stone-500 uppercase tracking-wide">Documents</span>
            <button
              onClick={toggleMode}
              className="p-1 rounded hover:bg-stone-200 transition-colors text-stone-400 hover:text-stone-600"
              title="Expand"
            >
              <Columns3 className="size-3.5" />
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-stone-400">
            <FileText className="size-6 mb-2" />
            <p className="text-xs text-center">No documents required</p>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col bg-stone-50/50">
        {/* Header with expand toggle */}
        <div className="shrink-0 px-3 py-2 border-b border-stone-100">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-medium text-stone-500 uppercase tracking-wide">Documents</span>
            <button
              onClick={toggleMode}
              className="p-1 rounded hover:bg-stone-200 transition-colors text-stone-400 hover:text-stone-600"
              title="Expand"
            >
              <Columns3 className="size-3.5" />
            </button>
          </div>
          <p className="text-[10px] text-stone-400 tabular-nums">
            {uploadedMandatory}/{totalMandatory} required uploaded
          </p>
        </div>

        {/* Evidence list - using unified EvidenceSlot */}
        <div className="flex-1 min-h-0 overflow-auto p-3 space-y-3">
          {/* Mandatory documents */}
          {mandatoryEvidence.length > 0 && (
            <div>
              <p className="text-[10px] font-medium text-stone-500 uppercase tracking-wide mb-2 px-1">
                Required
              </p>
              <div className="space-y-2">
                {mandatoryEvidence.map((ev) => (
                  <EvidenceSlot
                    key={ev.id}
                    evidence={ev}
                    linkedGroup={getLinkedGroup(ev)}
                    isLinking={false}
                    onStartLink={() => {}}
                    onCancelLink={() => {}}
                    allGroups={documentGroups}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Optional documents */}
          {optionalEvidence.length > 0 && (
            <div>
              <p className="text-[10px] font-medium text-stone-400 uppercase tracking-wide mb-2 px-1">
                Optional
              </p>
              <div className="space-y-2">
                {optionalEvidence.map((ev) => (
                  <EvidenceSlot
                    key={ev.id}
                    evidence={ev}
                    linkedGroup={getLinkedGroup(ev)}
                    isLinking={false}
                    onStartLink={() => {}}
                    onCancelLink={() => {}}
                    allGroups={documentGroups}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============================================
  // EXPANDED MODE - Two columns: Evidence + Documents
  // ============================================
  return (
    <div className="h-full flex flex-col bg-stone-50/50">
      {/* Header */}
      <div className="shrink-0 px-3 py-2 border-b border-stone-100">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-medium text-stone-500 uppercase tracking-wide">Documents</span>
          <button
            onClick={toggleMode}
            className="p-1 rounded hover:bg-stone-200 transition-colors text-stone-400 hover:text-stone-600"
            title="Collapse"
          >
            <PanelRight className="size-3.5" />
          </button>
        </div>
        <p className="text-[10px] text-stone-400 tabular-nums">
          {uploadedMandatory}/{totalMandatory} required uploaded
        </p>
      </div>

      {/* Two-column layout */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Left: Evidence Requirements */}
        <div className="w-48 shrink-0 border-r border-stone-100 overflow-auto">
          <div className="p-3 space-y-3">
            <p className="text-[10px] font-medium text-stone-500 uppercase tracking-wide px-1">
              Required Documents
            </p>
            {allRequiredEvidence.map((ev) => (
              <EvidenceSlot
                key={ev.id}
                evidence={ev}
                linkedGroup={getLinkedGroup(ev)}
                isLinking={false}
                onStartLink={() => {}}
                onCancelLink={() => {}}
                allGroups={documentGroups}
              />
            ))}
          </div>
        </div>

        {/* Right: Available Documents */}
        <div className="flex-1 min-w-0 overflow-auto">
          <div className="p-3 space-y-3">
            <p className="text-[10px] font-medium text-stone-500 uppercase tracking-wide px-1">
              Documents
            </p>

            {availableGroups.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {availableGroups.map((group) => {
                  const activeFiles = group.files.filter((f) => !f.isRemoved);
                  const linkCount = linkCountByGroupId[group.id] || 0;

                  const handleDragStart = (e: React.DragEvent) => {
                    e.dataTransfer.setData("application/x-document-group-id", group.id);
                    e.dataTransfer.effectAllowed = "link";
                  };

                  const handleClick = () => {
                    setPreviewGroup(group);
                  };

                  return (
                    <div
                      key={group.id}
                      draggable
                      onDragStart={handleDragStart}
                      onClick={handleClick}
                      className={cn(
                        "rounded-lg border overflow-hidden text-left transition-all cursor-pointer hover:shadow-sm",
                        linkCount > 0
                          ? "border-blue-200 bg-blue-50/30 hover:border-blue-300"
                          : "border-stone-200 bg-white hover:border-stone-300"
                      )}
                    >
                      {/* Mini preview */}
                      <div className="aspect-[4/3] bg-stone-50 p-2 flex items-center justify-center relative">
                        <div className="h-full aspect-[1/1.414] bg-white rounded border border-stone-200 p-1.5 shadow-sm">
                          <DocumentPreviewContent size="sm" />
                        </div>
                        {/* Link count badge */}
                        {linkCount > 0 && (
                          <span className="absolute top-1 left-1 px-1.5 py-0.5 text-[8px] font-semibold text-blue-700 bg-blue-100 rounded flex items-center gap-0.5 tabular-nums">
                            <Link2 size={8} />
                            {linkCount}
                          </span>
                        )}
                        {/* Status badge */}
                        {group.status === "reviewed" && (
                          <span className="absolute top-1 right-1 px-1 py-0.5 text-[8px] font-semibold text-emerald-700 bg-emerald-100 rounded flex items-center gap-0.5">
                            <Check size={8} strokeWidth={3} />
                          </span>
                        )}
                      </div>
                      {/* Title and info */}
                      <div className="px-2 py-1.5 border-t border-stone-100">
                        <p className="text-[10px] font-medium text-stone-700 truncate">
                          {group.title}
                        </p>
                        <p className="text-[9px] text-stone-400 tabular-nums">
                          {activeFiles.length} {activeFiles.length === 1 ? "page" : "pages"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-stone-400">
                <FolderOpen className="size-8 mx-auto mb-2" />
                <p className="text-xs">No documents available</p>
                <p className="text-[10px] mt-1">Upload files to Documents first</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drag hint */}
      <div className="shrink-0 px-4 py-2 border-t border-stone-100 bg-stone-50/50">
        <p className="text-[10px] text-stone-400 text-center">
          Drag documents to link them to required slots
        </p>
      </div>

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

// Import new tab components
import { ItemDetailTabs } from "./detail-panel";

// Main Detail Panel - Uses new tabbed interface
export function ChecklistDetailPanel({
  sectionTitle,
  sectionId,
  items,
  issues,
  onTabChange: onTabChangeExternal,
  externalActiveTab,
}: ChecklistDetailPanelProps) {
  const documentGroups = useDocumentGroups();
  const updateField = useCaseDetailStore((state) => state.updateEnhancedChecklistField);

  // Track active tab to conditionally show footer
  const [activeTab, setActiveTab] = useState<"overview" | "details" | "supporting-documents">(externalActiveTab || "overview");

  // Sync with external active tab when it changes (e.g., from header breadcrumb)
  useEffect(() => {
    if (externalActiveTab !== undefined && externalActiveTab !== activeTab) {
      setActiveTab(externalActiveTab);
    }
  }, [externalActiveTab]); // eslint-disable-line react-hooks/exhaustive-deps

  // Wrapper to also notify parent of tab changes
  const handleTabChange = useCallback((tab: "overview" | "details" | "supporting-documents") => {
    setActiveTab(tab);
    onTabChangeExternal?.(tab);
  }, [onTabChangeExternal]);

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

  const handleReanalyze = () => {
    // Trigger document analysis to extract field data
    // This would call an API or store method to analyze documents
    console.log("Analyzing reference documents for section:", sectionId);
    // TODO: Implement actual analysis logic
    // For now, this triggers the UI state change in OverviewTab
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* New Tabbed Interface */}
      <div className="flex-1 min-h-0">
        <ItemDetailTabs
          itemType="checklist"
          itemId={sectionId}
          itemTitle={sectionTitle}
          items={items}
          issues={issues}
          documentGroups={documentGroups}
          formValues={formValues}
          editedFieldIds={editedFieldIds}
          onFieldChange={handleFieldChange}
          onReanalyze={handleReanalyze}
          onTabChange={handleTabChange}
          externalActiveTab={externalActiveTab}
        />
      </div>

      {/* Save/Cancel Footer - only show on Details tab when changes detected */}
      {hasChanges && activeTab === "details" && (
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

