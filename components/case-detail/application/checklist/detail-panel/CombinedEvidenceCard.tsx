"use client";

import { useState, useMemo } from "react";
import {
  CheckCircle2,
  Plus,
  X,
  Eye,
  FileText,
  Link2,
  Upload,
  Layers,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RequiredEvidence, DocumentGroup } from "@/types/case-detail";
import { useCaseDetailStore } from "@/store/case-detail-store";
import { CategoryReviewModal } from "../../../shared";
import { DocumentUploadModal } from "./DocumentUploadModal";

// ============================================================================
// Types
// ============================================================================

export interface CombinedEvidenceConfig {
  id: string;
  title: string;
  description?: string;
  relationship: "all" | "any";
  evidenceItems: RequiredEvidence[];
}

interface CombinedEvidenceCardProps {
  config: CombinedEvidenceConfig;
  documentGroups: DocumentGroup[];
  className?: string;
}

interface SlotProps {
  evidence: RequiredEvidence;
  linkedGroup?: DocumentGroup;
  allGroups: DocumentGroup[];
  isOnly?: boolean;
  slotIndex: number;
  totalSlots: number;
}

// ============================================================================
// Document Preview Placeholder
// ============================================================================

const DocumentPlaceholder = ({ className }: { className?: string }) => (
  <div className={cn("flex flex-col justify-between h-full", className)}>
    {/* Header simulation */}
    <div className="space-y-0.5">
      <div className="h-[3px] bg-stone-300/80 rounded-full w-2/3" />
      <div className="h-[2px] bg-stone-200/70 rounded-full w-1/3 mt-1" />
    </div>
    {/* Body simulation */}
    <div className="flex-1 mt-2 space-y-1">
      <div className="h-[2px] bg-stone-200/60 rounded-full w-full" />
      <div className="h-[2px] bg-stone-200/50 rounded-full w-full" />
      <div className="h-[2px] bg-stone-200/50 rounded-full w-4/5" />
      <div className="h-[2px] bg-stone-200/40 rounded-full w-full" />
      <div className="h-[2px] bg-stone-200/40 rounded-full w-3/4" />
    </div>
  </div>
);

// ============================================================================
// Individual Evidence Slot
// ============================================================================

function EvidenceSlot({
  evidence,
  linkedGroup,
  allGroups,
  isOnly,
  slotIndex,
  totalSlots,
}: SlotProps) {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const linkEvidenceToGroup = useCaseDetailStore((s) => s.linkEvidenceToGroup);
  const unlinkEvidence = useCaseDetailStore((s) => s.unlinkEvidence);

  const isUploaded = evidence.isUploaded;
  const isPending = linkedGroup?.status === "pending";

  // Drag handlers
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

  // Click to preview
  const handleClick = () => {
    if (isUploaded && linkedGroup) setShowReviewModal(true);
  };

  // Position-based styling for visual "stacking" effect
  const isFirst = slotIndex === 0;
  const isLast = slotIndex === totalSlots - 1;

  return (
    <>
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative group transition-all duration-200",
          // Size based on total slots
          totalSlots === 2 ? "flex-1" : "flex-1",
          // Cursor
          isUploaded ? "cursor-pointer" : "cursor-default"
        )}
      >
        {/* Card content */}
        <div
          className={cn(
            "relative h-full rounded-lg border-2 overflow-hidden transition-all duration-200",
            // States
            isUploaded
              ? isPending
                ? "border-amber-300 bg-gradient-to-br from-amber-50 to-amber-25 hover:border-amber-400 hover:shadow-md"
                : "border-emerald-300 bg-gradient-to-br from-emerald-50 to-emerald-25 hover:border-emerald-400 hover:shadow-md"
              : isDragOver
              ? "border-[#0E4268] bg-[#0E4268]/5 shadow-lg"
              : "border-dashed border-stone-300 bg-stone-50/50 hover:border-stone-400 hover:bg-stone-50"
          )}
        >
          {isUploaded ? (
            /* ─────────────────────────────────────────────────────────────────
               UPLOADED STATE
            ───────────────────────────────────────────────────────────────── */
            <div className="h-full flex flex-col">
              {/* Document thumbnail area */}
              <div
                className={cn(
                  "relative flex-1 min-h-[72px] p-2.5 flex items-center justify-center",
                  isPending ? "bg-amber-100/30" : "bg-emerald-100/30"
                )}
              >
                {/* Mini document preview */}
                <div className="w-12 aspect-[1/1.35] bg-white rounded shadow-sm border border-stone-200/80 p-1.5 transform group-hover:scale-105 transition-transform">
                  <DocumentPlaceholder />
                </div>

                {/* Status indicator */}
                <div
                  className={cn(
                    "absolute top-2 right-2 size-5 rounded-full flex items-center justify-center",
                    isPending
                      ? "bg-amber-400 text-white"
                      : "bg-emerald-500 text-white"
                  )}
                >
                  <CheckCircle2 className="size-3" />
                </div>

                {/* Quick actions on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowReviewModal(true);
                      }}
                      className="p-1.5 rounded-full bg-white/90 hover:bg-white shadow-sm text-stone-600 hover:text-[#0E4268] transition-colors"
                    >
                      <Eye className="size-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        unlinkEvidence(evidence.id);
                      }}
                      className="p-1.5 rounded-full bg-white/90 hover:bg-white shadow-sm text-stone-600 hover:text-red-500 transition-colors"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Info footer */}
              <div className="px-2.5 py-2 border-t border-stone-100 bg-white/80">
                <p className="text-[11px] font-semibold text-stone-700 truncate leading-tight">
                  {evidence.name}
                </p>
                <p className="text-[10px] text-stone-400 truncate mt-0.5">
                  {linkedGroup?.title || "Linked"}
                </p>
              </div>
            </div>
          ) : (
            /* ─────────────────────────────────────────────────────────────────
               EMPTY STATE
            ───────────────────────────────────────────────────────────────── */
            <div className="h-full flex flex-col items-center justify-center p-3 min-h-[120px]">
              {/* Upload indicator */}
              <div
                className={cn(
                  "size-10 rounded-xl border-2 border-dashed flex items-center justify-center mb-2 transition-all",
                  isDragOver
                    ? "border-[#0E4268] bg-[#0E4268]/10 scale-110"
                    : "border-stone-300 bg-white group-hover:border-stone-400"
                )}
              >
                {isDragOver ? (
                  <Upload className="size-5 text-[#0E4268] animate-bounce" />
                ) : (
                  <Plus className="size-5 text-stone-400 group-hover:text-stone-500" />
                )}
              </div>

              {/* Label */}
              <p className="text-[11px] font-medium text-stone-600 text-center leading-tight mb-0.5">
                {evidence.name}
              </p>
              <p className="text-[9px] text-stone-400 mb-2">
                {evidence.isMandatory ? "Required" : "Optional"}
              </p>

              {/* Add button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUploadModal(true);
                }}
                className={cn(
                  "px-3 py-1.5 text-[10px] font-semibold rounded-md transition-all",
                  "bg-[#0E4268] text-white hover:bg-[#0c3858] active:scale-95"
                )}
              >
                Add Document
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
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

// ============================================================================
// Connector Element (visual link between slots)
// ============================================================================

function SlotConnector({ relationship }: { relationship: "all" | "any" }) {
  return (
    <div className="flex flex-col items-center justify-center px-1 self-stretch">
      {/* Visual connector line */}
      <div className="flex-1 w-px bg-gradient-to-b from-transparent via-stone-300 to-transparent" />

      {/* Relationship badge */}
      <div
        className={cn(
          "px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider whitespace-nowrap",
          "border shadow-sm",
          relationship === "all"
            ? "bg-stone-100 text-stone-600 border-stone-200"
            : "bg-blue-50 text-blue-600 border-blue-200"
        )}
      >
        {relationship === "all" ? "AND" : "OR"}
      </div>

      <div className="flex-1 w-px bg-gradient-to-b from-transparent via-stone-300 to-transparent" />
    </div>
  );
}

// ============================================================================
// Main Combined Evidence Card
// ============================================================================

export function CombinedEvidenceCard({
  config,
  documentGroups,
  className,
}: CombinedEvidenceCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Calculate completion status
  const stats = useMemo(() => {
    const items = config.evidenceItems;
    const uploaded = items.filter((ev) => ev.isUploaded).length;
    const total = items.length;

    const isComplete =
      config.relationship === "all" ? uploaded === total : uploaded >= 1;

    const hasPending = items.some((ev) => {
      if (!ev.isUploaded || !ev.linkedFileId) return false;
      const linked = documentGroups.find((g) => g.id === ev.linkedFileId);
      return linked?.status === "pending";
    });

    return { uploaded, total, isComplete, hasPending };
  }, [config, documentGroups]);

  // Get linked group for evidence
  const getLinkedGroup = (ev: RequiredEvidence) => {
    if (!ev.linkedFileId) return undefined;
    return documentGroups.find((g) => g.id === ev.linkedFileId);
  };

  const items = config.evidenceItems;

  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden transition-all duration-200",
        "border-2",
        stats.isComplete
          ? stats.hasPending
            ? "border-amber-200 bg-gradient-to-br from-amber-50/50 to-white shadow-sm"
            : "border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-white shadow-sm"
          : "border-stone-200 bg-white hover:border-stone-300",
        className
      )}
    >
      {/* ─────────────────────────────────────────────────────────────────────
          Header
      ───────────────────────────────────────────────────────────────────── */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
          "hover:bg-stone-50/50"
        )}
      >
        {/* Icon */}
        <div
          className={cn(
            "size-9 rounded-lg flex items-center justify-center shrink-0",
            stats.isComplete
              ? stats.hasPending
                ? "bg-amber-100"
                : "bg-emerald-100"
              : "bg-stone-100"
          )}
        >
          <Layers
            className={cn(
              "size-5",
              stats.isComplete
                ? stats.hasPending
                  ? "text-amber-600"
                  : "text-emerald-600"
                : "text-stone-500"
            )}
          />
        </div>

        {/* Title & description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-stone-800 truncate">
              {config.title}
            </h4>

            {/* Status badge */}
            <span
              className={cn(
                "shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold tabular-nums",
                stats.isComplete
                  ? stats.hasPending
                    ? "bg-amber-100 text-amber-700"
                    : "bg-emerald-100 text-emerald-700"
                  : "bg-stone-100 text-stone-600"
              )}
            >
              {stats.uploaded}/{stats.total}
            </span>
          </div>

          {/* Description with relationship info */}
          <div className="flex items-center gap-1.5 mt-0.5">
            <Link2 className="size-3 text-stone-400 shrink-0" />
            <p className="text-[11px] text-stone-500 truncate">
              {config.description ||
                (config.relationship === "all"
                  ? `All ${items.length} documents required`
                  : `At least 1 of ${items.length} documents`)}
            </p>
          </div>
        </div>

        {/* Expand indicator */}
        <ChevronDown
          className={cn(
            "size-5 text-stone-400 transition-transform shrink-0",
            isExpanded && "rotate-180"
          )}
        />
      </button>

      {/* ─────────────────────────────────────────────────────────────────────
          Slots Grid
      ───────────────────────────────────────────────────────────────────── */}
      {isExpanded && (
        <div className="px-4 pb-4">
          {/* Visual hint */}
          <div
            className={cn(
              "mb-3 py-1.5 px-3 rounded-lg text-[10px] font-medium flex items-center gap-1.5",
              config.relationship === "all"
                ? "bg-stone-100/80 text-stone-600"
                : "bg-blue-50 text-blue-600"
            )}
          >
            <FileText className="size-3" />
            <span>
              {config.relationship === "all"
                ? "Submit all documents together"
                : "Submit any one of the following"}
            </span>
          </div>

          {/* Slots container with connectors */}
          <div className="flex items-stretch gap-2">
            {items.map((evidence, idx) => (
              <div key={evidence.id} className="contents">
                <EvidenceSlot
                  evidence={evidence}
                  linkedGroup={getLinkedGroup(evidence)}
                  allGroups={documentGroups}
                  slotIndex={idx}
                  totalSlots={items.length}
                />
                {idx < items.length - 1 && (
                  <SlotConnector relationship={config.relationship} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Exports
// ============================================================================

export default CombinedEvidenceCard;
