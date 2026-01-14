"use client";

import { useCallback, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { AnimatePresence } from "motion/react";
import {
  Upload,
  FolderOpen,
  FileText,
  ArrowRight,
  CheckCircle2,
  Clock,
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

  const totalFiles = groups.reduce((sum, g) => sum + g.files.length, 0);
  const reviewedGroups = classifiedGroups.filter(
    (g) => g.status === "reviewed",
  ).length;

  const handleUploadClick = useCallback(() => {
    uploadDocuments();
  }, [uploadDocuments]);

  const handleOpenReview = (group: DocumentGroup) => {
    setReviewGroup(group);
  };

  return (
    <div className="h-full min-h-[240px] flex flex-col rounded-xl border border-stone-200 overflow-hidden bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-stone-50 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg border border-stone-300 bg-white flex items-center justify-center">
            <FolderOpen className="size-4 text-stone-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-stone-800 text-balance">
              Documents
            </h3>
            {totalFiles > 0 && (
              <p className="text-[10px] text-stone-500">
                {totalFiles} documents
              </p>
            )}
          </div>
        </div>

        {totalFiles > 0 && (
          <button
            onClick={() => setActiveNav("documents")}
            className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium text-stone-600 hover:bg-stone-100 transition-colors"
          >
            <span>Open</span>
            <ArrowRight className="size-3" />
          </button>
        )}
      </div>

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
              <p className="text-xs font-medium text-stone-600 text-balance">
                Upload Documents
              </p>
              <p className="text-[10px] text-stone-400 text-pretty">
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

                  return (
                    <button
                      key={group.id}
                      onClick={() => handleOpenReview(group)}
                      className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-stone-50 transition-colors group"
                    >
                      {/* Folder icon */}
                      <div className={cn(
                        "size-10 rounded-lg flex items-center justify-center transition-colors",
                        isReviewed ? "bg-emerald-50" : "bg-amber-50",
                      )}>
                        <FolderOpen className={cn(
                          "size-5",
                          isReviewed ? "text-emerald-500" : "text-amber-500",
                        )} />
                      </div>
                      {/* Title with status indicator */}
                      <div className="w-full flex items-center justify-center gap-0.5">
                        {isReviewed ? (
                          <CheckCircle2 className="size-2.5 text-emerald-500 shrink-0" />
                        ) : (
                          <Clock className="size-2.5 text-amber-500 shrink-0" />
                        )}
                        <span className="text-[10px] font-medium text-stone-600 truncate max-w-[60px]">
                          {group.title}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Review status - always at bottom */}
            <div className="pt-2 mt-2 border-t border-stone-100 shrink-0">
              {reviewedGroups < classifiedGroups.length ? (
                // Pending review
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-amber-600 font-medium">
                    {classifiedGroups.length - reviewedGroups} need review
                  </span>
                  <span className="text-stone-400 tabular-nums">
                    {reviewedGroups}/{classifiedGroups.length} ready
                  </span>
                </div>
              ) : (
                // All reviewed
                <div className="flex items-center justify-center gap-1.5 text-[10px]">
                  <CheckCircle2 className="size-3 text-emerald-500" />
                  <span className="font-medium text-emerald-600">
                    All {classifiedGroups.length} categories ready
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
