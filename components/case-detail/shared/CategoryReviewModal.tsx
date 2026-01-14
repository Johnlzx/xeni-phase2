"use client";

import React, { useState, useRef, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import {
  X,
  Check,
  ChevronDown,
  FileStack,
  Grid3X3,
  Eye,
  Download,
  FilePlus,
  ChevronLeft,
  ChevronRight,
  FolderInput,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { useCaseDetailStore } from "@/store/case-detail-store";
import type { DocumentFile, DocumentGroup } from "@/types/case-detail";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const ItemTypes = {
  PAGE: "page",
};

// ============================================================================
// REALISTIC DOCUMENT PREVIEW - Simulates scanned document appearance
// ============================================================================
const DocumentPreviewContent = ({
  variant = "default",
  size = "sm",
}: {
  variant?: "default" | "passport" | "bank" | "letter";
  size?: "sm" | "md" | "lg";
}) => {
  const lineHeight = size === "sm" ? "h-0.5" : size === "md" ? "h-1" : "h-1.5";
  const spacing =
    size === "sm" ? "space-y-1" : size === "md" ? "space-y-1.5" : "space-y-2";
  const marginTop = size === "sm" ? "mt-2" : size === "md" ? "mt-3" : "mt-4";

  return (
    <div className={spacing}>
      {/* Header area - like letterhead */}
      <div className={cn(lineHeight, "bg-stone-300 rounded w-1/3")} />
      <div
        className={cn(lineHeight, "bg-stone-200 rounded w-1/4", marginTop)}
      />

      {/* Body text simulation */}
      <div
        className={cn(lineHeight, "bg-stone-200 rounded w-full", marginTop)}
      />
      <div className={cn(lineHeight, "bg-stone-200 rounded w-full")} />
      <div className={cn(lineHeight, "bg-stone-200 rounded w-5/6")} />
      <div className={cn(lineHeight, "bg-stone-200 rounded w-full")} />
      <div className={cn(lineHeight, "bg-stone-200 rounded w-3/4")} />

      {/* Another paragraph */}
      <div
        className={cn(lineHeight, "bg-stone-200 rounded w-full", marginTop)}
      />
      <div className={cn(lineHeight, "bg-stone-200 rounded w-full")} />
      <div className={cn(lineHeight, "bg-stone-200 rounded w-4/5")} />
      <div className={cn(lineHeight, "bg-stone-200 rounded w-full")} />
      <div className={cn(lineHeight, "bg-stone-200 rounded w-2/3")} />

      {/* Signature area */}
      <div
        className={cn(lineHeight, "bg-stone-300 rounded w-1/4", marginTop)}
      />
      <div className={cn(lineHeight, "bg-stone-200 rounded w-1/3")} />
    </div>
  );
};

// ============================================================================
// SIDEBAR THUMBNAIL (draggable)
// ============================================================================
const SidebarThumbnail = ({
  page,
  pageIndex,
  groupId,
  isActive,
  onClick,
}: {
  page: DocumentFile;
  pageIndex: number;
  groupId: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const reorderFileInGroup = useCaseDetailStore(
    (state) => state.reorderFileInGroup,
  );
  const clearFileNewStatus = useCaseDetailStore(
    (state) => state.clearFileNewStatus,
  );

  // Clear new status when clicked
  const handleClick = () => {
    if (page.isNew) {
      clearFileNewStatus(page.id);
    }
    onClick();
  };

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
        if (item.id === page.id) return;
        if (item.groupId !== groupId) return;
        if (item.pageIndex === pageIndex) return;

        reorderFileInGroup(groupId, item.pageIndex, pageIndex);
        item.pageIndex = pageIndex;
      },
      collect: (monitor) => ({ isOver: monitor.isOver({ shallow: true }) }),
    }),
    [page.id, pageIndex, groupId, reorderFileInGroup],
  );

  drag(drop(ref));

  // Show removed pages with visual indicator
  if (page.isRemoved) {
    return (
      <div className="group relative select-none opacity-40">
        <div className="w-full aspect-[1/1.414] rounded border border-dashed border-stone-300 overflow-hidden bg-stone-100">
          <div className="h-full flex flex-col">
            <div className="flex-1 p-2 relative">
              <DocumentPreviewContent size="sm" />
              {/* Diagonal line indicator */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="w-full h-px bg-stone-400 rotate-45 origin-center"
                  style={{ width: "140%" }}
                />
              </div>
            </div>
            <div className="px-1.5 py-1 bg-stone-200 border-t border-stone-200 flex items-center justify-center">
              <span className="text-[9px] font-medium text-stone-400 tabular-nums line-through">
                {pageIndex + 1}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      onClick={handleClick}
      className={cn(
        "group relative cursor-pointer select-none",
        isDragging && "opacity-50",
      )}
    >
      {/* New page indicator - small blue dot */}
      {page.isNew && (
        <div className="absolute top-1 right-1 z-10">
          <div className="size-1.5 rounded-full bg-blue-500" />
        </div>
      )}

      <div
        className={cn(
          "w-full aspect-[1/1.414] rounded border overflow-hidden shadow-sm transition-all bg-white",
          isOver && "border-[#0E4268] ring-2 ring-[#0E4268]/20",
          isActive && "border-[#0E4268] ring-2 ring-[#0E4268]/20",
          !isOver &&
            !isActive &&
            "border-stone-200 hover:border-stone-300 hover:shadow-md",
        )}
      >
        <div className="h-full flex flex-col">
          <div className="flex-1 p-2">
            <DocumentPreviewContent size="sm" />
          </div>

          <div className="px-1.5 py-1 bg-stone-50 border-t border-stone-100 flex items-center justify-center">
            <span className="text-[9px] font-medium text-stone-500 tabular-nums">
              {pageIndex + 1}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// GRID MODE THUMBNAIL (for tiled view) - with selection support
// ============================================================================
const GridThumbnail = ({
  page,
  pageIndex,
  groupId,
  isSelected,
  onToggleSelect,
}: {
  page: DocumentFile;
  pageIndex: number;
  groupId: string;
  isSelected: boolean;
  onToggleSelect: (pageId: string, shiftKey: boolean) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const reorderFileInGroup = useCaseDetailStore(
    (state) => state.reorderFileInGroup,
  );
  const clearFileNewStatus = useCaseDetailStore(
    (state) => state.clearFileNewStatus,
  );

  // Clear new status when selected
  const handleToggleSelect = (pageId: string, shiftKey: boolean) => {
    if (page.isNew) {
      clearFileNewStatus(page.id);
    }
    onToggleSelect(pageId, shiftKey);
  };

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
        if (item.id === page.id) return;
        if (item.groupId !== groupId) return;
        if (item.pageIndex === pageIndex) return;

        reorderFileInGroup(groupId, item.pageIndex, pageIndex);
        item.pageIndex = pageIndex;
      },
      collect: (monitor) => ({ isOver: monitor.isOver({ shallow: true }) }),
    }),
    [page.id, pageIndex, groupId, reorderFileInGroup],
  );

  drag(drop(ref));

  // Show removed pages with visual indicator
  if (page.isRemoved) {
    return (
      <div className="group relative select-none opacity-40">
        <div className="w-full aspect-[1/1.414] rounded border border-dashed border-stone-300 overflow-hidden bg-stone-100">
          <div className="h-full flex flex-col">
            <div className="flex-1 p-3 relative">
              <DocumentPreviewContent size="md" />
              {/* Diagonal line indicator */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="w-full h-px bg-stone-400 rotate-45 origin-center"
                  style={{ width: "140%" }}
                />
              </div>
            </div>
            <div className="px-2 py-1.5 bg-stone-200 border-t border-stone-200 flex items-center justify-center">
              <span className="text-[10px] font-medium text-stone-400 tabular-nums line-through">
                {pageIndex + 1}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleToggleSelect(page.id, e.shiftKey);
  };

  return (
    <div
      ref={ref}
      className={cn(
        "group relative cursor-grab active:cursor-grabbing select-none",
        isDragging && "opacity-50",
      )}
    >
      {/* New page indicator - small blue dot */}
      {page.isNew && (
        <div className="absolute top-1 right-1 z-10">
          <div className="size-1.5 rounded-full bg-blue-500" />
        </div>
      )}

      <div
        className={cn(
          "w-full aspect-[1/1.414] rounded border overflow-hidden shadow-sm transition-all hover:shadow-md bg-white",
          isOver && "border-[#0E4268] ring-2 ring-[#0E4268]/20",
          isSelected && "border-[#0E4268] ring-2 ring-[#0E4268]/30",
          !isOver && !isSelected && "border-stone-200 hover:border-stone-300",
        )}
      >
        <div className="h-full flex flex-col">
          {/* Selection checkbox area - top left */}
          <button
            onClick={handleSelectClick}
            className={cn(
              "absolute top-1.5 left-1.5 z-10 size-5 rounded border-2 flex items-center justify-center transition-all",
              isSelected
                ? "bg-[#0E4268] border-[#0E4268] text-white"
                : "bg-white/90 border-stone-300 text-transparent hover:border-stone-400 group-hover:opacity-100 opacity-0",
            )}
            aria-label={isSelected ? "Deselect page" : "Select page"}
          >
            {isSelected && <Check size={12} strokeWidth={3} />}
          </button>

          <div className="flex-1 p-3">
            <DocumentPreviewContent size="md" />
          </div>

          <div className="px-2 py-1.5 bg-stone-50 border-t border-stone-100 flex items-center justify-center">
            <span className="text-[10px] font-medium text-stone-500 tabular-nums">
              {pageIndex + 1}
            </span>
          </div>
        </div>
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
  const [viewMode, setViewMode] = useState<"preview" | "grid">("preview");
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedPageIds, setSelectedPageIds] = useState<Set<string>>(
    new Set(),
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(
    null,
  );

  const confirmGroupReview = useCaseDetailStore(
    (state) => state.confirmGroupReview,
  );
  const uploadToGroup = useCaseDetailStore((state) => state.uploadToGroup);
  const clearGroupChangesFlag = useCaseDetailStore(
    (state) => state.clearGroupChangesFlag,
  );
  const moveFileToGroup = useCaseDetailStore((state) => state.moveFileToGroup);
  const markFileForDeletion = useCaseDetailStore(
    (state) => state.markFileForDeletion,
  );

  // Clear hasChanges flag when modal opens
  useEffect(() => {
    if (group.hasChanges) {
      clearGroupChangesFlag(group.id);
    }
  }, [group.id, group.hasChanges, clearGroupChangesFlag]);

  const activeFiles = group.files.filter((f) => !f.isRemoved);
  const isPending = group.status === "pending" && activeFiles.length > 0;
  const currentPage = activeFiles[currentPageIndex];
  const hasSelection = selectedPageIds.size > 0;

  // Other groups for move-to (excluding current and unclassified for "Move to")
  const otherGroups = allGroups.filter(
    (g) => g.id !== group.id && g.id !== "unclassified",
  );

  const handleDownload = () => {
    console.log("Download", group.id);
  };

  const handleAddFiles = () => {
    const pageCount = Math.floor(Math.random() * 3) + 1;
    uploadToGroup(group.id, pageCount);
  };

  const handleConfirm = () => {
    confirmGroupReview(group.id);
    onClose();
  };

  const handlePrevPage = () => {
    setCurrentPageIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPageIndex((prev) => Math.min(activeFiles.length - 1, prev + 1));
  };

  // Selection handlers
  const handleToggleSelect = (pageId: string, shiftKey: boolean) => {
    const currentIndex = activeFiles.findIndex((f) => f.id === pageId);

    setSelectedPageIds((prev) => {
      const newSet = new Set(prev);

      if (shiftKey && lastSelectedIndex !== null) {
        // Shift-click: select range
        const start = Math.min(lastSelectedIndex, currentIndex);
        const end = Math.max(lastSelectedIndex, currentIndex);
        for (let i = start; i <= end; i++) {
          newSet.add(activeFiles[i].id);
        }
      } else {
        // Normal click: toggle single
        if (newSet.has(pageId)) {
          newSet.delete(pageId);
        } else {
          newSet.add(pageId);
        }
      }

      return newSet;
    });

    setLastSelectedIndex(currentIndex);
  };

  const handleSelectAll = () => {
    if (selectedPageIds.size === activeFiles.length) {
      setSelectedPageIds(new Set());
    } else {
      setSelectedPageIds(new Set(activeFiles.map((f) => f.id)));
    }
  };

  const handleClearSelection = () => {
    setSelectedPageIds(new Set());
    setLastSelectedIndex(null);
  };

  // Batch operations
  const handleMoveSelected = (targetGroupId: string) => {
    selectedPageIds.forEach((fileId) => {
      moveFileToGroup(fileId, targetGroupId);
    });
    handleClearSelection();
  };

  const handleUnclassifySelected = () => {
    selectedPageIds.forEach((fileId) => {
      moveFileToGroup(fileId, "unclassified");
    });
    handleClearSelection();
  };

  const handleDeleteSelected = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    selectedPageIds.forEach((fileId) => {
      markFileForDeletion(fileId, group.id);
    });
    handleClearSelection();
    setShowDeleteConfirm(false);
  };

  // Close on escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (viewMode === "preview") {
        if (e.key === "ArrowLeft") handlePrevPage();
        if (e.key === "ArrowRight") handleNextPage();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, viewMode, currentPageIndex]);

  const displayType = group.tag
    .split("-")
    .map((word) => word.toUpperCase())
    .join(" ");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="w-[90vw] max-w-6xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Modal Header - Compact */}
        <div className="shrink-0 px-4 py-2 bg-white border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-stone-800">
              {group.title}
            </h2>
            <span className="text-[10px] text-stone-400 uppercase tracking-wide font-medium">
              {displayType}
            </span>
            <span className="text-xs text-stone-400 tabular-nums">
              {activeFiles.length} pages
            </span>
            {isPending && (
              <span className="px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 bg-amber-50 rounded">
                Pending
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="shrink-0 px-4 py-1.5 bg-stone-50 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-1">
            {/* View toggle */}
            <div className="flex items-center p-0.5 bg-white rounded border border-stone-200">
              <button
                onClick={() => setViewMode("preview")}
                className={cn(
                  "p-1 rounded transition-colors",
                  viewMode === "preview"
                    ? "bg-stone-100 text-stone-800"
                    : "text-stone-400 hover:text-stone-600",
                )}
                aria-label="Preview mode"
              >
                <Eye size={14} />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-1 rounded transition-colors",
                  viewMode === "grid"
                    ? "bg-stone-100 text-stone-800"
                    : "text-stone-400 hover:text-stone-600",
                )}
                aria-label="Grid mode"
              >
                <Grid3X3 size={14} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleDownload}
              disabled={activeFiles.length === 0 || isPending}
              className={cn(
                "flex items-center gap-1 px-2 py-1 text-xs font-medium rounded transition-colors",
                activeFiles.length === 0 || isPending
                  ? "text-stone-300 cursor-not-allowed"
                  : "text-stone-600 hover:bg-stone-200 hover:text-stone-900",
              )}
              title={
                isPending ? "Confirm review before downloading" : undefined
              }
              aria-label={
                isPending ? "Download (confirm review first)" : "Download"
              }
            >
              <Download size={12} />
              Download
            </button>

            <button
              onClick={handleAddFiles}
              className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-stone-600 hover:bg-stone-200 hover:text-stone-900 rounded transition-colors"
              aria-label="Add files"
            >
              <FilePlus size={12} />
              Add
            </button>
          </div>
        </div>

        {/* Modal Content */}
        {viewMode === "preview" ? (
          <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar - Thumbnails - shows all pages including removed ones */}
            <div className="w-32 shrink-0 border-r border-stone-200 bg-stone-50 overflow-y-auto">
              <div className="p-2 space-y-2">
                {group.files.map((page, idx) => (
                  <SidebarThumbnail
                    key={page.id}
                    page={page}
                    pageIndex={idx}
                    groupId={group.id}
                    isActive={!page.isRemoved && idx === currentPageIndex}
                    onClick={() => {
                      if (!page.isRemoved) setCurrentPageIndex(idx);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Right - Preview */}
            <div className="flex-1 flex flex-col bg-stone-100">
              {activeFiles.length > 0 && currentPage ? (
                <>
                  {/* Preview Area - fits one full page */}
                  <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
                    <div className="h-full aspect-[1/1.414] rounded-lg border border-stone-300 shadow-lg p-8 bg-white">
                      <DocumentPreviewContent size="lg" />
                    </div>

                    {/* Navigation Arrows */}
                    {currentPageIndex > 0 && (
                      <button
                        onClick={handlePrevPage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg text-stone-600 hover:text-stone-900 transition-colors"
                        aria-label="Previous page"
                      >
                        <ChevronLeft size={20} />
                      </button>
                    )}

                    {currentPageIndex < activeFiles.length - 1 && (
                      <button
                        onClick={handleNextPage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg text-stone-600 hover:text-stone-900 transition-colors"
                        aria-label="Next page"
                      >
                        <ChevronRight size={20} />
                      </button>
                    )}
                  </div>

                  {/* Preview Footer - same height as Grid footer */}
                  <div className="shrink-0 px-4 py-2 bg-white border-t border-stone-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-stone-500 tabular-nums">
                        Page {currentPageIndex + 1} of {activeFiles.length}
                      </span>
                      {isPending && (
                        <button
                          onClick={handleConfirm}
                          className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          <Check size={14} />
                          Confirm Review
                        </button>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <FileStack
                      size={48}
                      className="mx-auto mb-4 text-stone-300"
                    />
                    <p className="text-sm text-stone-500">No pages</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Grid Mode */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Grid header with select all */}
            <div className="shrink-0 px-6 py-2 bg-white border-b border-stone-100 flex items-center justify-between">
              <button
                onClick={handleSelectAll}
                className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 transition-colors"
              >
                <div
                  className={cn(
                    "size-4 rounded border-2 flex items-center justify-center transition-all",
                    selectedPageIds.size === activeFiles.length &&
                      activeFiles.length > 0
                      ? "bg-[#0E4268] border-[#0E4268] text-white"
                      : selectedPageIds.size > 0
                        ? "bg-[#0E4268]/50 border-[#0E4268] text-white"
                        : "border-stone-300",
                  )}
                >
                  {selectedPageIds.size > 0 && (
                    <Check size={10} strokeWidth={3} />
                  )}
                </div>
                <span>
                  {selectedPageIds.size === activeFiles.length &&
                  activeFiles.length > 0
                    ? "Deselect all"
                    : "Select all"}
                </span>
              </button>

              {hasSelection && (
                <span className="text-sm text-stone-500">
                  {selectedPageIds.size} selected
                </span>
              )}
            </div>

            {/* Grid content - shows all pages including removed ones with visual marker */}
            <div className="flex-1 overflow-auto p-6 bg-stone-50">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {group.files.map((page, idx) => (
                  <GridThumbnail
                    key={page.id}
                    page={page}
                    pageIndex={idx}
                    groupId={group.id}
                    isSelected={selectedPageIds.has(page.id)}
                    onToggleSelect={handleToggleSelect}
                  />
                ))}
              </div>
            </div>

            {/* Grid Footer - shows selection actions OR confirm button */}
            <div className="shrink-0 px-4 py-2 bg-white border-t border-stone-200 flex items-center justify-between">
              {hasSelection ? (
                <>
                  {/* Selection info */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-stone-700">
                      {selectedPageIds.size} page
                      {selectedPageIds.size > 1 ? "s" : ""} selected
                    </span>
                    <button
                      onClick={handleClearSelection}
                      className="text-xs text-stone-500 hover:text-stone-700 underline transition-colors"
                    >
                      Clear
                    </button>
                  </div>

                  {/* Selection actions */}
                  <div className="flex items-center gap-1">
                    {/* Move to dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded transition-colors">
                          <FolderInput size={12} />
                          Move to
                          <ChevronDown size={10} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        {otherGroups.map((g) => (
                          <DropdownMenuItem
                            key={g.id}
                            onClick={() => handleMoveSelected(g.id)}
                          >
                            {g.title}
                          </DropdownMenuItem>
                        ))}
                        {otherGroups.length === 0 && (
                          <DropdownMenuItem disabled>
                            No other categories
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Unclassify button */}
                    <button
                      onClick={handleUnclassifySelected}
                      className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded transition-colors"
                    >
                      <RotateCcw size={12} />
                      Unclassify
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={handleDeleteSelected}
                      className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded transition-colors"
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Page count */}
                  <span className="text-sm text-stone-500 tabular-nums">
                    {activeFiles.length} pages total
                  </span>

                  {/* Confirm button - only when pending and no selection */}
                  {isPending && (
                    <button
                      onClick={handleConfirm}
                      className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <Check size={14} />
                      Confirm Review
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 z-10 flex items-center justify-center bg-black/40"
              onClick={() => setShowDeleteConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold text-stone-800 mb-2">
                  Delete {selectedPageIds.size} page
                  {selectedPageIds.size > 1 ? "s" : ""}?
                </h3>
                <p className="text-sm text-stone-500 mb-6">
                  This action cannot be undone. The selected pages will be
                  permanently removed from this category.
                </p>
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
