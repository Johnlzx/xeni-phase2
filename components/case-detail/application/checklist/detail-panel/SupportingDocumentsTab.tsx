"use client";

import { useState, useMemo } from "react";
import {
  CheckCircle2,
  CircleDashed,
  Plus,
  X,
  Eye,
  FileText,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  EnhancedChecklistItem,
  RequiredEvidence,
  DocumentGroup,
} from "@/types/case-detail";
import { useCaseDetailStore } from "@/store/case-detail-store";
import { CategoryReviewModal } from "../../../shared";
import { DocumentUploadModal } from "./DocumentUploadModal";

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
    </div>
  );
};

// Full Evidence Card for Supporting Documents tab
function EvidenceCard({
  evidence,
  linkedGroup,
  allGroups,
}: {
  evidence: RequiredEvidence;
  linkedGroup?: DocumentGroup;
  allGroups: DocumentGroup[];
}) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const linkEvidenceToGroup = useCaseDetailStore((state) => state.linkEvidenceToGroup);
  const unlinkEvidence = useCaseDetailStore((state) => state.unlinkEvidence);

  const isUploaded = evidence.isUploaded;
  const isPendingReview = linkedGroup?.status === "pending";

  const handleUnlink = (e: React.MouseEvent) => {
    e.stopPropagation();
    unlinkEvidence(evidence.id);
  };

  const handleCardClick = () => {
    if (isUploaded && linkedGroup) {
      setShowReviewModal(true);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    if (isUploaded) return;
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
    if (isUploaded) return;

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
          "rounded-lg border overflow-hidden transition-all",
          isUploaded
            ? isPendingReview
              ? "border-amber-200 bg-amber-50/30 cursor-pointer hover:border-amber-300 hover:shadow-sm"
              : "border-emerald-200 bg-emerald-50/30 cursor-pointer hover:border-emerald-300 hover:shadow-sm"
            : isDragOver
            ? "border-blue-400 border-solid bg-blue-50 ring-1 ring-blue-200"
            : "border-dashed border-stone-300 bg-white hover:border-stone-400"
        )}
      >
        {isUploaded ? (
          <>
            {/* Document preview - compact layout */}
            <div className="flex items-start gap-3 p-3">
              {/* Thumbnail */}
              <div className="shrink-0 w-12 aspect-[1/1.414] bg-white rounded border border-stone-200 p-1 shadow-sm">
                <DocumentPreviewContent size="sm" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-stone-800 truncate">{evidence.name}</p>
                    <p className="text-xs text-stone-500 truncate">
                      {linkedGroup?.title || "Linked document"}
                    </p>
                  </div>
                  {isPendingReview ? (
                    <span className="shrink-0 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 bg-amber-100 rounded">
                      Pending Review
                    </span>
                  ) : (
                    <span className="shrink-0 flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-100 rounded">
                      <CheckCircle2 className="size-3" />
                      Ready
                    </span>
                  )}
                </div>

                {/* Validation info if available */}
                {evidence.validityPeriod && (
                  <div className="mt-1.5 flex items-center gap-1 text-[11px] text-stone-500">
                    <Calendar className="size-3" />
                    <span className="truncate">{evidence.validityPeriod}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-2 flex items-center gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (linkedGroup) setShowReviewModal(true);
                    }}
                    className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-stone-600 bg-white border border-stone-200 rounded hover:bg-stone-50 hover:border-stone-300 transition-colors"
                  >
                    <Eye className="size-3" />
                    Preview
                  </button>
                  <button
                    onClick={handleUnlink}
                    className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-stone-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <X className="size-3" />
                    Unlink
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Empty state - needs upload - compact */
          <div className="p-3">
            <div className="flex items-start gap-2">
              <CircleDashed
                className={cn(
                  "size-4 shrink-0 mt-0.5",
                  evidence.isMandatory ? "text-amber-500" : "text-stone-400"
                )}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-800 truncate">{evidence.name}</p>
                {evidence.description && (
                  <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">
                    {evidence.description}
                  </p>
                )}

                {/* Actions */}
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-white bg-[#0E4268] rounded hover:bg-[#0a3555] transition-colors"
                  >
                    <Plus className="size-3" />
                    Add
                  </button>

                  {!evidence.isMandatory && (
                    <span className="px-1.5 py-0.5 text-[10px] font-medium text-stone-500 bg-stone-100 rounded">
                      Optional
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <DocumentUploadModal
          evidence={evidence}
          onClose={() => setShowUploadModal(false)}
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

// Props for checklist items
interface ChecklistSupportingDocsProps {
  itemType: "checklist";
  items: EnhancedChecklistItem[];
  documentGroups: DocumentGroup[];
}

// Props for assessment items
interface AssessmentSupportingDocsProps {
  itemType: "assessment";
  requiredEvidence: RequiredEvidence[];
  documentGroups: DocumentGroup[];
}

export type SupportingDocumentsTabProps =
  | ChecklistSupportingDocsProps
  | AssessmentSupportingDocsProps;

export function SupportingDocumentsTab(props: SupportingDocumentsTabProps) {
  const { itemType, documentGroups } = props;

  // Collect all required evidence
  const allEvidence = useMemo(() => {
    if (itemType === "checklist") {
      const evidenceMap = new Map<string, RequiredEvidence>();
      props.items.forEach((item) => {
        item.requiredEvidence?.forEach((ev) => {
          if (!evidenceMap.has(ev.id)) {
            evidenceMap.set(ev.id, ev);
          }
        });
      });
      return Array.from(evidenceMap.values());
    } else {
      return props.requiredEvidence;
    }
  }, [itemType, props]);

  // Helper to find linked group for evidence
  const getLinkedGroup = (evidence: RequiredEvidence): DocumentGroup | undefined => {
    if (!evidence.linkedFileId) return undefined;
    return documentGroups.find((g) => g.id === evidence.linkedFileId);
  };

  // Split into mandatory and optional
  const mandatoryEvidence = allEvidence.filter((ev) => ev.isMandatory);
  const optionalEvidence = allEvidence.filter((ev) => !ev.isMandatory);

  // Count stats
  const uploadedMandatory = mandatoryEvidence.filter((ev) => ev.isUploaded).length;
  const uploadedOptional = optionalEvidence.filter((ev) => ev.isUploaded).length;

  if (allEvidence.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[200px] text-stone-400">
        <FileText className="size-8 mb-2" />
        <p className="text-sm font-medium">No documents required</p>
        <p className="text-xs mt-1">This section doesn&apos;t require any supporting documents</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-4 space-y-5">
      {/* Summary header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-stone-700">Supporting Documents</h3>
        <div className="flex items-center gap-3 text-xs text-stone-500">
          <span className="tabular-nums">
            <span className={uploadedMandatory === mandatoryEvidence.length ? "text-emerald-600" : ""}>
              {uploadedMandatory}/{mandatoryEvidence.length}
            </span>{" "}
            required
          </span>
          {optionalEvidence.length > 0 && (
            <span className="tabular-nums">
              {uploadedOptional}/{optionalEvidence.length} optional
            </span>
          )}
        </div>
      </div>

      {/* Required Evidence */}
      {mandatoryEvidence.length > 0 && (
        <div>
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-3">
            Required Evidence
          </p>
          <div className="grid grid-cols-2 gap-3">
            {mandatoryEvidence.map((ev) => (
              <EvidenceCard
                key={ev.id}
                evidence={ev}
                linkedGroup={getLinkedGroup(ev)}
                allGroups={documentGroups}
              />
            ))}
          </div>
        </div>
      )}

      {/* Optional Evidence */}
      {optionalEvidence.length > 0 && (
        <div>
          <p className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-3">
            Optional Evidence
          </p>
          <div className="grid grid-cols-2 gap-3">
            {optionalEvidence.map((ev) => (
              <EvidenceCard
                key={ev.id}
                evidence={ev}
                linkedGroup={getLinkedGroup(ev)}
                allGroups={documentGroups}
              />
            ))}
          </div>
        </div>
      )}

      {/* Drag hint */}
      <div className="text-center py-2 border-t border-stone-100">
        <p className="text-[10px] text-stone-400">
          Tip: You can drag documents from Documents page and drop them here
        </p>
      </div>
    </div>
  );
}
