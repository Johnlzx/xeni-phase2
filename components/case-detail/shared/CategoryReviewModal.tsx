"use client";

import React, { useState, useRef, useCallback } from "react";
import { useDrag, useDrop } from "react-dnd";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import {
  X,
  Check,
  ChevronDown,
  GripVertical,
  Layers,
  FileStack,
  File,
  Grid3X3,
  AlignJustify,
  Download,
  Inbox,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCaseDetailStore } from "@/store/case-detail-store";
import type { DocumentFile, DocumentGroup } from "@/types/case-detail";

const ItemTypes = {
  PAGE: "page",
};

// ============================================================================
// PAGE COLOR SYSTEM
// ============================================================================
const PAGE_COLORS = [
  {
    bg: "bg-rose-50",
    border: "border-rose-200",
    accent: "bg-rose-500",
    label: "bg-rose-100 text-rose-700",
  },
  {
    bg: "bg-sky-50",
    border: "border-sky-200",
    accent: "bg-sky-500",
    label: "bg-sky-100 text-sky-700",
  },
  {
    bg: "bg-amber-50",
    border: "border-amber-200",
    accent: "bg-amber-500",
    label: "bg-amber-100 text-amber-700",
  },
  {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    accent: "bg-emerald-500",
    label: "bg-emerald-100 text-emerald-700",
  },
  {
    bg: "bg-violet-50",
    border: "border-violet-200",
    accent: "bg-violet-500",
    label: "bg-violet-100 text-violet-700",
  },
  {
    bg: "bg-orange-50",
    border: "border-orange-200",
    accent: "bg-orange-500",
    label: "bg-orange-100 text-orange-700",
  },
  {
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    accent: "bg-cyan-500",
    label: "bg-cyan-100 text-cyan-700",
  },
  {
    bg: "bg-pink-50",
    border: "border-pink-200",
    accent: "bg-pink-500",
    label: "bg-pink-100 text-pink-700",
  },
  {
    bg: "bg-lime-50",
    border: "border-lime-200",
    accent: "bg-lime-500",
    label: "bg-lime-100 text-lime-700",
  },
  {
    bg: "bg-fuchsia-50",
    border: "border-fuchsia-200",
    accent: "bg-fuchsia-500",
    label: "bg-fuchsia-100 text-fuchsia-700",
  },
];

export const getPageColor = (pageId: string) => {
  let hash = 0;
  for (let i = 0; i < pageId.length; i++) {
    const char = pageId.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return PAGE_COLORS[Math.abs(hash) % PAGE_COLORS.length];
};

// ============================================================================
// DRAGGABLE PAGE THUMBNAIL (for review modal)
// ============================================================================
const DraggablePageThumbnail = ({
  page,
  pageIndex,
  groupId,
  allGroups,
  isSelected,
  onSelect,
}: {
  page: DocumentFile;
  pageIndex: number;
  groupId: string;
  allGroups: DocumentGroup[];
  isSelected?: boolean;
  onSelect?: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const pageColor = getPageColor(page.id);
  const reorderFileInGroup = useCaseDetailStore(
    (state) => state.reorderFileInGroup,
  );
  const moveFileToGroup = useCaseDetailStore((state) => state.moveFileToGroup);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.PAGE,
    item: () => ({ id: page.id, pageIndex, groupId }),
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const [{ isOver }, drop] = useDrop<
    { id: string; pageIndex: number; groupId: string },
    void,
    { isOver: boolean }
  >(
    () => ({
      accept: ItemTypes.PAGE,
      hover: (item) => {
        if (!ref.current) return;
        const dragId = item.id;
        const hoverId = page.id;
        if (dragId === hoverId) return;

        const dragIndex = item.pageIndex;
        const hoverIndex = pageIndex;
        const sourceGroupId = item.groupId;

        if (sourceGroupId !== groupId) return;
        if (dragIndex === hoverIndex) return;

        reorderFileInGroup(groupId, dragIndex, hoverIndex);
        item.pageIndex = hoverIndex;
      },
      drop: (item) => {
        if (item.groupId !== groupId) {
          moveFileToGroup(item.id, groupId);
        }
      },
      collect: (monitor) => ({ isOver: monitor.isOver({ shallow: true }) }),
    }),
    [page.id, pageIndex, groupId, reorderFileInGroup, moveFileToGroup],
  );

  drag(drop(ref));

  const isRemoved = page.isRemoved;
  const isNew = page.isNew;

  if (isRemoved) return null;

  return (
    <div
      ref={ref}
      onClick={onSelect}
      className={cn(
        "group relative select-none cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50",
      )}
      style={{ width: 160, height: 208 }}
    >
      <div
        className={cn(
          "w-full h-full bg-white rounded border overflow-hidden shadow-sm transition-shadow hover:shadow-md",
          isOver && !isDragging && "border-[#0E4268] ring-2 ring-[#0E4268]/20",
          isSelected && "border-[#0E4268] ring-2 ring-[#0E4268]/20",
          isNew && "border-emerald-400",
          !isOver &&
            !isSelected &&
            !isNew &&
            "border-stone-200 hover:border-stone-300",
        )}
      >
        {/* Page content */}
        <div className={cn("h-full flex flex-col", pageColor.bg)}>
          {/* Document skeleton */}
          <div className="flex-1 p-3 space-y-1.5">
            <div className="h-1.5 bg-white/60 rounded w-3/4" />
            <div className="h-1.5 bg-white/60 rounded w-full" />
            <div className="h-1.5 bg-white/60 rounded w-5/6" />
            <div className="h-1.5 bg-white/40 rounded w-2/3" />
            <div className="h-1.5 bg-white/60 rounded w-4/5 mt-3" />
            <div className="h-1.5 bg-white/60 rounded w-full" />
            <div className="h-1.5 bg-white/40 rounded w-3/4" />
          </div>

          {/* Footer */}
          <div className="px-2 py-1.5 bg-white/80 border-t border-stone-100 flex items-center justify-between">
            <GripVertical size={12} className="text-stone-300" />
            <span className="text-[10px] font-medium text-stone-500 tabular-nums">
              {pageIndex + 1}
            </span>
            {isNew && (
              <span className="px-1 py-0.5 bg-emerald-500 text-white text-[8px] font-bold rounded">
                NEW
              </span>
            )}
          </div>
        </div>

        {/* Selection checkbox */}
        {isSelected && (
          <div className="absolute top-2 right-2 size-5 bg-[#0E4268] rounded flex items-center justify-center">
            <Check size={12} className="text-white" strokeWidth={3} />
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// CATEGORY REVIEW MODAL
// ============================================================================
export interface CategoryReviewModalProps {
  group: DocumentGroup;
  allGroups: DocumentGroup[];
  onClose: () => void;
}

export function CategoryReviewModal({
  group,
  allGroups,
  onClose,
}: CategoryReviewModalProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const confirmGroupReview = useCaseDetailStore(
    (state) => state.confirmGroupReview,
  );
  const moveFileToGroup = useCaseDetailStore((state) => state.moveFileToGroup);

  const togglePageSelection = (pageId: string) => {
    setSelectedPages((prev) =>
      prev.includes(pageId)
        ? prev.filter((p) => p !== pageId)
        : [...prev, pageId],
    );
  };

  const activeFiles = group.files.filter((f) => !f.isRemoved);
  const isPending = group.status === "pending" && activeFiles.length > 0;

  // Close on escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="w-[90vw] max-w-5xl h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Modal Header */}
        <div className="shrink-0 px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-50 text-red-500">
              <FileStack size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-stone-800">
                {group.mergedFileName || `${group.title}.pdf`}
              </h2>
              <p className="text-sm text-stone-500">
                {activeFiles.length} pages
                {isPending && (
                  <span className="ml-2 text-amber-600 font-medium">
                    • Pending Review
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View toggle */}
            <div className="flex items-center p-0.5 bg-stone-100 rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-1.5 rounded-md transition-colors",
                  viewMode === "grid"
                    ? "bg-white shadow-sm text-stone-800"
                    : "text-stone-500 hover:text-stone-700",
                )}
                aria-label="Grid view"
              >
                <Grid3X3 size={14} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-1.5 rounded-md transition-colors",
                  viewMode === "list"
                    ? "bg-white shadow-sm text-stone-800"
                    : "text-stone-500 hover:text-stone-700",
                )}
                aria-label="List view"
              >
                <AlignJustify size={14} />
              </button>
            </div>

            {isPending ? (
              <button
                onClick={() => {
                  confirmGroupReview(group.id);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#0E4268] hover:bg-[#0a3555] text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Check size={14} />
                Confirm
              </button>
            ) : group.status === "reviewed" ? (
              <button
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = "#";
                  link.download = `${group.title.replace(/\s+/g, "_")}.pdf`;
                  link.click();
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Download size={14} />
                Download
              </button>
            ) : null}

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Pages Content */}
        <div className="flex-1 overflow-auto p-4 bg-stone-50/50">
          {viewMode === "grid" ? (
            <div className="flex flex-wrap gap-6 content-start">
              {activeFiles.map((page, idx) => (
                <DraggablePageThumbnail
                  key={page.id}
                  page={page}
                  pageIndex={idx}
                  groupId={group.id}
                  allGroups={allGroups}
                  isSelected={selectedPages.includes(page.id)}
                  onSelect={() => togglePageSelection(page.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-6 items-center max-w-3xl mx-auto">
              {activeFiles.map((page, idx) => {
                const pageColor = getPageColor(page.id);
                return (
                  <motion.div key={page.id} layout className="w-full">
                    <div className="bg-white rounded shadow-md border border-stone-200 overflow-hidden">
                      <div
                        className={cn(
                          "aspect-[4/5] relative p-6",
                          pageColor.bg,
                        )}
                      >
                        <div className="space-y-3">
                          <div className="h-3 bg-white/60 rounded w-3/4" />
                          <div className="h-3 bg-white/60 rounded w-full" />
                          <div className="h-3 bg-white/60 rounded w-5/6" />
                          <div className="h-3 bg-white/40 rounded w-2/3" />
                          <div className="h-3 bg-white/60 rounded w-4/5 mt-6" />
                          <div className="h-3 bg-white/60 rounded w-full" />
                          <div className="h-3 bg-white/40 rounded w-3/4" />
                          <div className="h-3 bg-white/60 rounded w-5/6" />
                        </div>
                        <div className="absolute bottom-4 left-4 bg-white/80 text-stone-600 text-sm font-semibold px-3 py-1 rounded tabular-nums">
                          Page {idx + 1} of {activeFiles.length}
                        </div>
                        {page.isNew && (
                          <div className="absolute top-4 right-4 px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded">
                            NEW
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selection Action Bar */}
        <AnimatePresence>
          {selectedPages.length > 0 && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="shrink-0 px-6 py-4 bg-white border-t border-stone-200 flex items-center justify-between"
            >
              <span className="text-sm text-stone-600">
                <strong>{selectedPages.length}</strong> page
                {selectedPages.length > 1 ? "s" : ""} selected
              </span>

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-stone-700 hover:bg-stone-100 rounded-lg transition-colors">
                      <Layers size={14} />
                      Move to category
                      <ChevronDown size={12} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Move to...</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {allGroups
                      .filter(
                        (g) => g.id !== group.id && g.id !== "unclassified",
                      )
                      .map((g) => (
                        <DropdownMenuItem
                          key={g.id}
                          onClick={() => {
                            selectedPages.forEach((pageId) =>
                              moveFileToGroup(pageId, g.id),
                            );
                            setSelectedPages([]);
                          }}
                        >
                          <File size={14} className="mr-2 text-red-500" />
                          {g.title}
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <button
                  onClick={() => {
                    selectedPages.forEach((pageId) =>
                      moveFileToGroup(pageId, "unclassified"),
                    );
                    setSelectedPages([]);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                >
                  <Inbox size={14} />
                  Unclassify
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
