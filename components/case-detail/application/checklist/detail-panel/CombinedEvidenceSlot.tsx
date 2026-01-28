"use client";

import { useState, useMemo } from "react";
import {
  CheckCircle2,
  CircleDashed,
  Plus,
  X,
  Eye,
  FileText,
  Link2,
  ChevronRight,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RequiredEvidence, DocumentGroup } from "@/types/case-detail";
import { useCaseDetailStore } from "@/store/case-detail-store";
import { CategoryReviewModal } from "../../../shared";
import { DocumentUploadModal } from "./DocumentUploadModal";

// Document Preview Content - Simulates scanned document appearance
const DocumentPreviewContent = () => (
  <div className="space-y-0.5">
    <div className="h-0.5 bg-stone-300 rounded w-1/3" />
    <div className="h-0.5 bg-stone-200 rounded w-1/4 mt-1" />
    <div className="h-0.5 bg-stone-200 rounded w-full mt-1" />
    <div className="h-0.5 bg-stone-200 rounded w-full" />
    <div className="h-0.5 bg-stone-200 rounded w-5/6" />
  </div>
);

// Individual slot within a combined group
interface SlotItemProps {
  evidence: RequiredEvidence;
  linkedGroup?: DocumentGroup;
  allGroups: DocumentGroup[];
  isLast: boolean;
  variant: "compact" | "expanded";
}

function SlotItem({ evidence, linkedGroup, allGroups, isLast, variant }: SlotItemProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const linkEvidenceToGroup = useCaseDetailStore((state) => state.linkEvidenceToGroup);
  const unlinkEvidence = useCaseDetailStore((state) => state.unlinkEvidence);

  const isUploaded = evidence.isUploaded;
  const isPendingReview = linkedGroup?.status === "pending";

  const handleDragOver = (e: React.DragEvent) => {
    if (isUploaded) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "link";
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (isUploaded) return;
    const groupId = e.dataTransfer.getData("application/x-document-group-id");
    if (groupId) linkEvidenceToGroup(evidence.id, groupId);
  };

  const handleCardClick = () => {
    if (isUploaded && linkedGroup) setShowReviewModal(true);
  };

  if (variant === "compact") {
    return (
      <>
        <div
          onClick={handleCardClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "relative flex items-center gap-2.5 py-2.5 px-3 transition-all",
            !isLast && "border-b border-dashed border-stone-200",
            isUploaded && "cursor-pointer hover:bg-stone-50/50",
            isDragOver && "bg-blue-50"
          )}
        >
          {/* Status indicator */}
          <div className="shrink-0">
            {isUploaded ? (
              <div className={cn(
                "size-5 rounded-full flex items-center justify-center",
                isPendingReview ? "bg-amber-100" : "bg-emerald-100"
              )}>
                <CheckCircle2 className={cn(
                  "size-3",
                  isPendingReview ? "text-amber-600" : "text-emerald-600"
                )} />
              </div>
            ) : (
              <div className={cn(
                "size-5 rounded-full border-2 border-dashed flex items-center justify-center",
                isDragOver ? "border-blue-400 bg-blue-50" : "border-stone-300"
              )}>
                <Plus className={cn(
                  "size-2.5",
                  isDragOver ? "text-blue-500" : "text-stone-400"
                )} />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className={cn(
              "text-xs font-medium truncate",
              isUploaded ? "text-stone-700" : "text-stone-500"
            )}>
              {evidence.name}
            </p>
            {isUploaded && linkedGroup ? (
              <p className="text-[10px] text-stone-400 truncate">
                {linkedGroup.title}
              </p>
            ) : (
              <p className="text-[10px] text-stone-400">
                {evidence.isMandatory ? "Required" : "Optional"}
              </p>
            )}
          </div>

          {/* Actions */}
          {isUploaded ? (
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowReviewModal(true);
                }}
                className="p-1 rounded text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
              >
                <Eye className="size-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  unlinkEvidence(evidence.id);
                }}
                className="p-1 rounded text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowUploadModal(true);
              }}
              className="px-2 py-1 text-[10px] font-medium text-[#0E4268] bg-[#0E4268]/5 hover:bg-[#0E4268]/10 rounded transition-colors"
            >
              Add
            </button>
          )}
        </div>

        {showUploadModal && (
          <DocumentUploadModal
            evidence={evidence}
            onClose={() => setShowUploadModal(false)}
          />
        )}
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

  // Expanded variant - card style
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
              ? "border-amber-200 bg-gradient-to-br from-amber-50/50 to-white cursor-pointer hover:border-amber-300"
              : "border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-white cursor-pointer hover:border-emerald-300"
            : isDragOver
            ? "border-blue-400 bg-blue-50/50"
            : "border-dashed border-stone-300 bg-stone-50/30 hover:border-stone-400 hover:bg-stone-50/50"
        )}
      >
        {isUploaded ? (
          <div className="flex items-start gap-3 p-3">
            {/* Thumbnail */}
            <div className="shrink-0 w-10 aspect-[1/1.414] bg-white rounded border border-stone-200 p-1 shadow-sm">
              <DocumentPreviewContent />
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-medium text-stone-700 truncate">{evidence.name}</p>
                {isPendingReview ? (
                  <span className="shrink-0 size-1.5 rounded-full bg-amber-400" />
                ) : (
                  <CheckCircle2 className="shrink-0 size-3.5 text-emerald-500" />
                )}
              </div>
              <p className="text-[10px] text-stone-400 truncate mt-0.5">
                {linkedGroup?.title}
              </p>
              <div className="mt-2 flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowReviewModal(true);
                  }}
                  className="text-[10px] font-medium text-stone-500 hover:text-stone-700 transition-colors"
                >
                  Preview
                </button>
                <span className="text-stone-300">·</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    unlinkEvidence(evidence.id);
                  }}
                  className="text-[10px] font-medium text-stone-400 hover:text-red-500 transition-colors"
                >
                  Unlink
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 flex flex-col items-center justify-center min-h-[80px] text-center">
            <div className={cn(
              "size-8 rounded-full border-2 border-dashed flex items-center justify-center mb-2",
              isDragOver ? "border-blue-400 bg-blue-100" : "border-stone-300"
            )}>
              <Plus className={cn("size-4", isDragOver ? "text-blue-500" : "text-stone-400")} />
            </div>
            <p className="text-xs font-medium text-stone-600 mb-0.5">{evidence.name}</p>
            <p className="text-[10px] text-stone-400 mb-2">
              {evidence.isMandatory ? "Required" : "Optional"}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowUploadModal(true);
              }}
              className="px-2.5 py-1 text-[10px] font-medium text-white bg-[#0E4268] hover:bg-[#0a3555] rounded transition-colors"
            >
              Add Document
            </button>
          </div>
        )}
      </div>

      {showUploadModal && (
        <DocumentUploadModal
          evidence={evidence}
          onClose={() => setShowUploadModal(false)}
        />
      )}
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

// Combined Evidence Group Props
export interface CombinedEvidenceGroup {
  id: string;
  title: string; // e.g., "Income Verification"
  description?: string; // e.g., "Provide bank statements AND payslips"
  evidenceItems: RequiredEvidence[];
  relationship: "all" | "any"; // all = need all, any = need at least one
}

interface CombinedEvidenceSlotProps {
  group: CombinedEvidenceGroup;
  documentGroups: DocumentGroup[];
  variant?: "compact" | "expanded";
}

export function CombinedEvidenceSlot({
  group,
  documentGroups,
  variant = "compact",
}: CombinedEvidenceSlotProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Helper to find linked group
  const getLinkedGroup = (evidence: RequiredEvidence): DocumentGroup | undefined => {
    if (!evidence.linkedFileId) return undefined;
    return documentGroups.find((g) => g.id === evidence.linkedFileId);
  };

  // Calculate completion status
  const stats = useMemo(() => {
    const uploaded = group.evidenceItems.filter((ev) => ev.isUploaded).length;
    const total = group.evidenceItems.length;
    const isComplete = group.relationship === "all"
      ? uploaded === total
      : uploaded >= 1;
    const hasPendingReview = group.evidenceItems.some((ev) => {
      if (!ev.isUploaded || !ev.linkedFileId) return false;
      const linkedGroup = documentGroups.find((g) => g.id === ev.linkedFileId);
      return linkedGroup?.status === "pending";
    });
    return { uploaded, total, isComplete, hasPendingReview };
  }, [group, documentGroups]);

  if (variant === "expanded") {
    return (
      <div className="rounded-xl border border-stone-200 bg-white overflow-hidden">
        {/* Header */}
        <div className={cn(
          "px-4 py-3 border-b transition-colors",
          stats.isComplete
            ? stats.hasPendingReview
              ? "bg-amber-50/50 border-amber-100"
              : "bg-emerald-50/50 border-emerald-100"
            : "bg-stone-50 border-stone-100"
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={cn(
                "size-7 rounded-lg flex items-center justify-center",
                stats.isComplete
                  ? stats.hasPendingReview
                    ? "bg-amber-100"
                    : "bg-emerald-100"
                  : "bg-stone-100"
              )}>
                <Layers className={cn(
                  "size-4",
                  stats.isComplete
                    ? stats.hasPendingReview
                      ? "text-amber-600"
                      : "text-emerald-600"
                    : "text-stone-500"
                )} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-stone-800">{group.title}</h4>
                {group.description && (
                  <p className="text-[11px] text-stone-500 mt-0.5">{group.description}</p>
                )}
              </div>
            </div>

            {/* Status badge */}
            <div className="flex items-center gap-2">
              <span className={cn(
                "px-2 py-1 rounded-full text-[10px] font-semibold tabular-nums",
                stats.isComplete
                  ? stats.hasPendingReview
                    ? "bg-amber-100 text-amber-700"
                    : "bg-emerald-100 text-emerald-700"
                  : "bg-stone-100 text-stone-600"
              )}>
                {stats.uploaded}/{stats.total} {group.relationship === "all" ? "required" : "uploaded"}
              </span>
            </div>
          </div>

          {/* Combined indicator */}
          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-stone-500">
            <Link2 className="size-3" />
            <span>
              {group.relationship === "all"
                ? `All ${group.evidenceItems.length} documents required together`
                : `At least 1 of ${group.evidenceItems.length} documents required`
              }
            </span>
          </div>
        </div>

        {/* Evidence grid */}
        <div className="p-4">
          <div className={cn(
            "grid gap-3",
            group.evidenceItems.length === 2 ? "grid-cols-2" : "grid-cols-3"
          )}>
            {group.evidenceItems.map((evidence, idx) => (
              <SlotItem
                key={evidence.id}
                evidence={evidence}
                linkedGroup={getLinkedGroup(evidence)}
                allGroups={documentGroups}
                isLast={idx === group.evidenceItems.length - 1}
                variant="expanded"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Compact variant - collapsible list
  return (
    <div className={cn(
      "rounded-lg border overflow-hidden transition-all",
      stats.isComplete
        ? stats.hasPendingReview
          ? "border-amber-200 bg-amber-50/20"
          : "border-emerald-200 bg-emerald-50/20"
        : "border-stone-200 bg-white"
    )}>
      {/* Collapsible header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors",
          "hover:bg-stone-50/50"
        )}
      >
        {/* Status icon */}
        <div className={cn(
          "size-6 rounded-md flex items-center justify-center shrink-0",
          stats.isComplete
            ? stats.hasPendingReview
              ? "bg-amber-100"
              : "bg-emerald-100"
            : "bg-stone-100"
        )}>
          <Layers className={cn(
            "size-3.5",
            stats.isComplete
              ? stats.hasPendingReview
                ? "text-amber-600"
                : "text-emerald-600"
              : "text-stone-500"
          )} />
        </div>

        {/* Title & info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold text-stone-700 truncate">{group.title}</p>
            <span className={cn(
              "shrink-0 px-1.5 py-0.5 rounded text-[9px] font-medium tabular-nums",
              stats.isComplete
                ? stats.hasPendingReview
                  ? "bg-amber-100 text-amber-700"
                  : "bg-emerald-100 text-emerald-700"
                : "bg-stone-100 text-stone-600"
            )}>
              {stats.uploaded}/{stats.total}
            </span>
          </div>
          <p className="text-[10px] text-stone-400 mt-0.5">
            {group.relationship === "all" ? "All required" : "At least one"} · {group.evidenceItems.length} documents
          </p>
        </div>

        {/* Expand icon */}
        <ChevronRight className={cn(
          "size-4 text-stone-400 transition-transform shrink-0",
          isExpanded && "rotate-90"
        )} />
      </button>

      {/* Expandable content */}
      {isExpanded && (
        <div className="border-t border-stone-100">
          {group.evidenceItems.map((evidence, idx) => (
            <SlotItem
              key={evidence.id}
              evidence={evidence}
              linkedGroup={getLinkedGroup(evidence)}
              allGroups={documentGroups}
              isLast={idx === group.evidenceItems.length - 1}
              variant="compact"
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Demo data generator for testing
export function createDemoCombinedGroups(): CombinedEvidenceGroup[] {
  return [
    {
      id: "income-verification",
      title: "Income Verification",
      description: "Evidence of stable income from employment",
      relationship: "all",
      evidenceItems: [
        {
          id: "ev-bank-statements",
          name: "Bank Statements",
          description: "Last 3 months of bank statements",
          isUploaded: false,
          isMandatory: true,
          validityPeriod: "Must be dated within last 3 months",
        },
        {
          id: "ev-payslips",
          name: "Payslips",
          description: "Last 3 months of payslips from employer",
          isUploaded: false,
          isMandatory: true,
          validityPeriod: "Must be dated within last 3 months",
        },
      ],
    },
    {
      id: "identity-verification",
      title: "Identity Documents",
      description: "Proof of identity",
      relationship: "any",
      evidenceItems: [
        {
          id: "ev-passport",
          name: "Valid Passport",
          isUploaded: true,
          linkedFileId: "passport-group",
          isMandatory: true,
        },
        {
          id: "ev-national-id",
          name: "National ID Card",
          isUploaded: false,
          isMandatory: false,
        },
        {
          id: "ev-driving-license",
          name: "Driving License",
          isUploaded: false,
          isMandatory: false,
        },
      ],
    },
  ];
}
