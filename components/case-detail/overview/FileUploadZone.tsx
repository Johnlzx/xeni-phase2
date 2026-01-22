"use client";

import { useCallback, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { AnimatePresence } from "motion/react";
import {
  Upload,
  FolderOpen,
  FileText,
  ExternalLink,
  CheckCircle2,
  Clock,
  Check,
} from "lucide-react";
import {
  useCaseDetailStore,
  useDocumentGroups,
  useIsLoadingDocuments,
} from "@/store/case-detail-store";
import { cn } from "@/lib/utils";
import { CategoryReviewModal } from "../shared";
import type { DocumentGroup } from "@/types/case-detail";

export function FileUploadZone() {
  const groups = useDocumentGroups();
  const isLoading = useIsLoadingDocuments();
  const uploadDocuments = useCaseDetailStore((state) => state.uploadDocuments);
  const setActiveNav = useCaseDetailStore((state) => state.setActiveNav);

  // State for review modal
  const [reviewGroup, setReviewGroup] = useState<DocumentGroup | null>(null);

  // Filter out unclassified for display
  const classifiedGroups = groups.filter((g) => g.id !== "unclassified");

  // Reviewable groups (exclude special documents like Case Notes)
  const reviewableGroups = classifiedGroups.filter((g) => !g.isSpecial);
  const specialGroups = classifiedGroups.filter((g) => g.isSpecial);

  const totalFiles = groups.reduce((sum, g) => sum + g.files.length, 0);
  const reviewedGroups = reviewableGroups.filter(
    (g) => g.status === "reviewed",
  ).length;

  const handleUploadClick = useCallback(() => {
    uploadDocuments();
  }, [uploadDocuments]);

  const handleOpenReview = (group: DocumentGroup) => {
    setReviewGroup(group);
  };

  return (
    <div className="h-full flex flex-col rounded-xl border border-stone-200 overflow-hidden bg-white">
      {/* Header - clickable to open File Hub - unified height h-14 */}
      <button
        onClick={() => totalFiles > 0 && setActiveNav("documents")}
        className={cn(
          "shrink-0 h-14 flex items-center justify-between px-4 bg-stone-50 border-b border-stone-200 w-full text-left",
          totalFiles > 0 && "hover:bg-stone-100 transition-colors group cursor-pointer",
          totalFiles === 0 && "cursor-default",
        )}
      >
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg border border-stone-300 bg-white flex items-center justify-center">
            <FolderOpen className="size-4 text-stone-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-stone-800 text-balance">
              Documents
            </h3>
            {totalFiles > 0 && (
              <p className="text-xs text-stone-500">
                {classifiedGroups.length} documents
              </p>
            )}
          </div>
        </div>

        {totalFiles > 0 && (
          <ExternalLink className="size-4 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </button>

      {/* Main content area */}
      <div className="flex-1 p-3 overflow-hidden">
        {isLoading ? (
          // Loading State
          <div className="h-full flex flex-col items-center justify-center gap-2">
            <div className="relative">
              <div className="size-10 border-2 border-stone-200 border-t-stone-500 rounded-full animate-spin" />
              <FileText className="size-4 text-stone-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-xs text-stone-500">Organizing...</p>
          </div>
        ) : totalFiles === 0 ? (
          // Empty State
          <button
            onClick={handleUploadClick}
            className="w-full h-full flex flex-col items-center justify-center gap-3 group rounded-lg border-2 border-dashed border-stone-200 hover:border-stone-300 hover:bg-stone-50 transition-colors"
          >
            <div className="size-12 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-stone-200 transition-colors">
              <Upload className="size-5 text-stone-500" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-stone-600 text-balance">
                Upload Documents
              </p>
              <p className="text-xs text-stone-400 text-pretty">
                Click to simulate
              </p>
            </div>
          </button>
        ) : (
          // Filled State - Icon grid layout
          <div className="h-full flex flex-col min-h-0">
            {/* Scrollable icon grid - hidden scrollbar */}
            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
              <div className="grid grid-cols-4 gap-2">
                {classifiedGroups.map((group) => {
                  const isReviewed = group.status === "reviewed";
                  const isSpecial = group.isSpecial;

                  return (
                    <button
                      key={group.id}
                      onClick={() => handleOpenReview(group)}
                      title={isSpecial ? `${group.title} (Auto-confirmed)` : group.title}
                      className="flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors hover:bg-stone-50"
                    >
                      {/* File icon with status badge */}
                      <div className="relative">
                        <FileText className="size-8 text-stone-400" />
                        {/* Status badge - bottom right */}
                        <div className={cn(
                          "absolute -bottom-0.5 -right-0.5 size-4 rounded-full flex items-center justify-center",
                          isSpecial
                            ? "bg-stone-500"
                            : isReviewed
                              ? "bg-emerald-500"
                              : "bg-amber-500",
                        )}>
                          {isSpecial ? (
                            <Check className="size-2.5 text-white" strokeWidth={3} />
                          ) : isReviewed ? (
                            <CheckCircle2 className="size-2.5 text-white" strokeWidth={3} />
                          ) : (
                            <Clock className="size-2.5 text-white" strokeWidth={3} />
                          )}
                        </div>
                      </div>
                      {/* File name */}
                      <span className="text-xs font-medium text-stone-600 truncate max-w-[72px] text-center">
                        {group.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Review status - always at bottom */}
            <div className="pt-2 mt-2 border-t border-stone-100 shrink-0">
              {reviewableGroups.length > 0 && reviewedGroups < reviewableGroups.length ? (
                // Pending review
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-600 font-medium">
                    {reviewableGroups.length - reviewedGroups} need review
                  </span>
                  <span className="text-stone-400 tabular-nums">
                    {reviewedGroups + specialGroups.length}/{classifiedGroups.length} ready
                  </span>
                </div>
              ) : (
                // All reviewed
                <div className="flex items-center justify-center gap-1.5 text-xs">
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                  <span className="font-medium text-emerald-600">
                    All {classifiedGroups.length} documents ready
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Category Review Modal - wrapped in DndProvider for drag-drop support */}
      <AnimatePresence>
        {reviewGroup && (
          <DndProvider backend={HTML5Backend}>
            <CategoryReviewModal
              group={reviewGroup}
              allGroups={groups}
              onClose={() => setReviewGroup(null)}
            />
          </DndProvider>
        )}
      </AnimatePresence>
    </div>
  );
}
