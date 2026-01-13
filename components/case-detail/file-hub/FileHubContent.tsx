"use client";

import React, { useState, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { motion, AnimatePresence } from "motion/react";
import {
  Upload,
  FileText,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Plus,
  Check,
  Inbox,
  FolderOpen,
  File,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useCaseDetailStore,
  useDocumentGroups,
  useIsLoadingDocuments,
} from "@/store/case-detail-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { CategoryReviewModal, getPageColor } from "../shared";
import type { DocumentGroup, DocumentFile } from "@/types/case-detail";

const ItemTypes = {
  PAGE: "page",
};

// ============================================================================
// FILE HUB HEADER
// ============================================================================
const FileHubHeader = ({ groups }: { groups: DocumentGroup[] }) => {
  const pendingCount = groups.filter(
    (g) =>
      g.id !== "unclassified" && g.status === "pending" && g.files.length > 0,
  ).length;

  return (
    <div className="shrink-0 px-6 py-4 bg-white border-b border-stone-200">
      <div className="flex items-center gap-4">
        <div className="p-2 rounded-xl bg-[#0E4268]/10">
          <FolderOpen size={20} className="text-[#0E4268]" />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-stone-800">File Hub</h1>
            {pendingCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
                {pendingCount} pending review
              </span>
            )}
          </div>
          <p className="text-sm text-stone-500">
            Organize and manage your documents
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SINGLE PAGE PREVIEW MODAL
// ============================================================================
const SinglePagePreviewModal = ({
  file,
  pageIndex,
  allGroups,
  onClose,
}: {
  file: DocumentFile;
  pageIndex: number;
  allGroups: DocumentGroup[];
  onClose: () => void;
}) => {
  const pageColor = getPageColor(file.id);
  const moveFileToGroup = useCaseDetailStore((state) => state.moveFileToGroup);
  const classifiedGroups = allGroups.filter((g) => g.id !== "unclassified");

  // Close on escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="relative z-10 flex flex-col max-w-lg w-full mx-4 bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2">
            <div className={cn("size-3 rounded-full", pageColor.accent)} />
            <span className="text-sm font-medium text-stone-800">
              Page {pageIndex + 1}
            </span>
            {file.isNew && (
              <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-[9px] font-bold rounded">
                NEW
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
            aria-label="Close preview"
          >
            <X size={18} />
          </button>
        </div>

        {/* Page Preview */}
        <div className="p-6 bg-stone-100">
          <div
            className={cn(
              "aspect-[3/4] rounded-lg border border-stone-200 shadow-md p-6 mx-auto max-w-xs",
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
              <div className="h-3 bg-white/60 rounded w-5/6 mt-6" />
              <div className="h-3 bg-white/60 rounded w-2/3" />
              <div className="h-3 bg-white/40 rounded w-4/5" />
            </div>
          </div>
        </div>

        {/* Footer - Move Actions */}
        <div className="px-4 py-3 border-t border-stone-200 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs text-stone-500">Move to category:</span>
            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              {classifiedGroups.slice(0, 4).map((group) => (
                <button
                  key={group.id}
                  onClick={() => {
                    moveFileToGroup(file.id, group.id);
                    onClose();
                  }}
                  className="px-2.5 py-1 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded transition-colors"
                >
                  {group.title}
                </button>
              ))}
              {classifiedGroups.length > 4 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="px-2.5 py-1 text-xs font-medium text-stone-500 bg-stone-100 hover:bg-stone-200 rounded transition-colors">
                      +{classifiedGroups.length - 4} more
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    {classifiedGroups.slice(4).map((group) => (
                      <DropdownMenuItem
                        key={group.id}
                        onClick={() => {
                          moveFileToGroup(file.id, group.id);
                          onClose();
                        }}
                      >
                        {group.title}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ============================================================================
// DRAGGABLE UNCLASSIFIED PAGE THUMBNAIL
// ============================================================================
const DraggableUnclassifiedPage = ({
  file,
  index,
  allGroups,
  onPreview,
}: {
  file: DocumentFile;
  index: number;
  allGroups: DocumentGroup[];
  onPreview: () => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const pageColor = getPageColor(file.id);
  const moveFileToGroup = useCaseDetailStore((state) => state.moveFileToGroup);

  const classifiedGroups = allGroups.filter((g) => g.id !== "unclassified");

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.PAGE,
    item: () => ({ id: file.id, groupId: "unclassified", pageIndex: index }),
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  drag(ref);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          ref={ref}
          onClick={onPreview}
          className={cn(
            "w-12 h-[60px] rounded border overflow-hidden flex flex-col cursor-pointer transition-all hover:scale-105 hover:shadow-md relative select-none",
            isDragging && "opacity-50 cursor-grabbing",
            file.isNew ? "border-emerald-400" : "border-stone-200",
          )}
          title={file.name}
        >
          <div className={cn("flex-1 p-1", pageColor.bg)}>
            <div className="space-y-0.5">
              <div className="h-0.5 bg-white/60 rounded w-3/4" />
              <div className="h-0.5 bg-white/60 rounded w-full" />
              <div className="h-0.5 bg-white/40 rounded w-2/3" />
              <div className="h-0.5 bg-white/60 rounded w-4/5" />
            </div>
          </div>
          <div className="h-3.5 bg-white flex items-center justify-center border-t border-stone-100">
            <span className="text-[8px] text-stone-500 font-medium tabular-nums">
              {index + 1}
            </span>
          </div>
          {file.isNew && (
            <div className="absolute -top-0.5 -right-0.5 size-2 bg-emerald-500 rounded-full" />
          )}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <File size={14} className="mr-2" />
            Move to
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            {classifiedGroups.map((group) => (
              <ContextMenuItem
                key={group.id}
                onClick={() => moveFileToGroup(file.id, group.id)}
              >
                <FileText size={14} className="mr-2 text-red-500" />
                {group.title}
              </ContextMenuItem>
            ))}
            {classifiedGroups.length === 0 && (
              <ContextMenuItem disabled>
                No categories available
              </ContextMenuItem>
            )}
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem className="text-red-600">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

// ============================================================================
// UPLOAD AREA (drop zone left, unclassified container right)
// ============================================================================
const UploadArea = ({
  unclassifiedFiles,
  allGroups,
  onUpload,
  onPreviewPage,
}: {
  unclassifiedFiles: DocumentFile[];
  allGroups: DocumentGroup[];
  onUpload: () => void;
  onPreviewPage: (file: DocumentFile, index: number) => void;
}) => {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.PAGE,
      collect: (monitor) => ({ isOver: monitor.isOver() }),
    }),
    [],
  );

  return (
    <div className="shrink-0 px-4 py-3 bg-stone-50 border-b border-stone-200">
      <div className="flex items-stretch gap-4">
        {/* Drop Zone (left side - larger) */}
        <div
          ref={drop as unknown as React.LegacyRef<HTMLDivElement>}
          onClick={onUpload}
          className={cn(
            "flex items-center gap-4 px-6 py-4 border-2 border-dashed rounded-xl cursor-pointer transition-colors min-w-[280px]",
            isOver
              ? "border-[#0E4268] bg-[#0E4268]/5"
              : "border-stone-300 hover:border-stone-400 hover:bg-white",
          )}
        >
          <div className="size-12 rounded-xl bg-stone-100 flex items-center justify-center shrink-0">
            <Upload size={24} className="text-stone-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-stone-700">
              Drag & Drop files here
            </p>
            <p className="text-xs text-stone-500 mt-0.5">or click to browse</p>
          </div>
        </div>

        {/* Unclassified Pages Container (right side) */}
        {unclassifiedFiles.length > 0 && (
          <div className="flex-1 bg-white rounded-xl border border-stone-200 p-3 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Inbox size={14} className="text-stone-400" />
              <span className="text-xs font-medium text-stone-600">
                Unclassified ({unclassifiedFiles.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-[68px] overflow-y-auto">
              {unclassifiedFiles.map((file, idx) => (
                <DraggableUnclassifiedPage
                  key={file.id}
                  file={file}
                  index={idx}
                  allGroups={allGroups}
                  onPreview={() => onPreviewPage(file, idx)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// CATEGORY CARD WITH PAGE NAVIGATION (smaller size)
// ============================================================================
const CategoryCard = ({
  group,
  allGroups,
  onReview,
}: {
  group: DocumentGroup;
  allGroups: DocumentGroup[];
  onReview: () => void;
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const moveFileToGroup = useCaseDetailStore((state) => state.moveFileToGroup);
  const confirmGroupReview = useCaseDetailStore(
    (state) => state.confirmGroupReview,
  );

  const activeFiles = group.files.filter((f) => !f.isRemoved);
  const totalPages = activeFiles.length;
  const currentFile = activeFiles[currentPageIndex];
  const currentPageColor = currentFile ? getPageColor(currentFile.id) : null;

  const isPending = group.status === "pending" && totalPages > 0;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPageIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPageIndex((prev) => Math.min(totalPages - 1, prev + 1));
  };

  // Drop target for receiving files
  const [{ isOver }, drop] = useDrop<
    { id: string; groupId: string },
    void,
    { isOver: boolean }
  >(
    () => ({
      accept: ItemTypes.PAGE,
      drop: (item) => {
        if (item.groupId !== group.id) {
          moveFileToGroup(item.id, group.id);
        }
      },
      collect: (monitor) => ({ isOver: monitor.isOver() }),
    }),
    [group.id, moveFileToGroup],
  );

  return (
    <div
      ref={drop as unknown as React.LegacyRef<HTMLDivElement>}
      className={cn(
        "bg-white rounded-xl border overflow-hidden flex flex-col transition-all cursor-pointer",
        isOver
          ? "border-[#0E4268] ring-2 ring-[#0E4268]/20 scale-[1.02]"
          : "border-stone-200 hover:border-stone-300 hover:shadow-md",
      )}
      onClick={onReview}
    >
      {/* Card Header */}
      <div className="px-3 py-2.5 border-b border-stone-100 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1 rounded-md bg-red-50 text-red-500 shrink-0">
            <FileText size={12} />
          </div>
          <span className="text-sm font-semibold text-stone-800 truncate">
            {group.title}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {isPending ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                confirmGroupReview(group.id);
              }}
              className="px-2 py-0.5 text-[10px] font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded transition-colors"
            >
              Review
            </button>
          ) : totalPages > 0 ? (
            <span className="px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 rounded flex items-center gap-0.5">
              <Check size={10} strokeWidth={3} />
              Ready
            </span>
          ) : null}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                className="p-1 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded transition-colors"
                aria-label="Category options"
              >
                <MoreVertical size={14} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem>Rename</DropdownMenuItem>
              <DropdownMenuItem>Download</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Card Content - Page Preview (smaller) */}
      <div className="flex-1 p-3 bg-stone-50/50 min-h-[140px] flex items-center justify-center">
        {totalPages > 0 && currentFile ? (
          <div className="w-full">
            {/* Document Preview with color */}
            <div
              className={cn(
                "aspect-[4/3] rounded border border-stone-200 shadow-sm p-3 relative",
                currentPageColor?.bg || "bg-white",
              )}
            >
              <div className="space-y-1.5">
                <div className="h-1.5 bg-white/60 rounded w-3/4" />
                <div className="h-1.5 bg-white/60 rounded w-full" />
                <div className="h-1.5 bg-white/60 rounded w-5/6" />
                <div className="h-1.5 bg-white/40 rounded w-full mt-3" />
                <div className="h-1.5 bg-white/60 rounded w-2/3" />
              </div>
              {/* Page Number */}
              <div className="absolute bottom-1.5 right-1.5 text-[9px] font-medium text-stone-600 bg-white/80 px-1 py-0.5 rounded tabular-nums">
                {currentPageIndex + 1}/{totalPages}
              </div>
              {/* New Badge */}
              {currentFile.isNew && (
                <div className="absolute top-1.5 left-1.5 px-1 py-0.5 bg-emerald-500 text-white text-[8px] font-bold rounded">
                  NEW
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <Inbox size={24} className="mx-auto mb-1.5 text-stone-300" />
            <p className="text-xs text-stone-400">No files</p>
            <p className="text-[10px] text-stone-300 mt-0.5">Drop files here</p>
          </div>
        )}
      </div>

      {/* Card Footer - Navigation */}
      <div className="px-3 py-1.5 border-t border-stone-100 flex items-center justify-between bg-white">
        <button
          onClick={handlePrev}
          disabled={currentPageIndex === 0 || totalPages === 0}
          className={cn(
            "p-1 rounded transition-colors",
            currentPageIndex === 0 || totalPages === 0
              ? "text-stone-200 cursor-not-allowed"
              : "text-stone-500 hover:text-stone-700 hover:bg-stone-100",
          )}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        <span className="text-[11px] text-stone-400 tabular-nums">
          {totalPages > 0 ? `${totalPages} pages` : "Empty"}
        </span>

        <button
          onClick={handleNext}
          disabled={currentPageIndex >= totalPages - 1 || totalPages === 0}
          className={cn(
            "p-1 rounded transition-colors",
            currentPageIndex >= totalPages - 1 || totalPages === 0
              ? "text-stone-200 cursor-not-allowed"
              : "text-stone-500 hover:text-stone-700 hover:bg-stone-100",
          )}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// ADD CATEGORY CARD (smaller)
// ============================================================================
const AddCategoryCard = ({ onAdd }: { onAdd: (name: string) => void }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-full min-h-[220px] bg-white rounded-xl border-2 border-dashed border-stone-200 hover:border-stone-300 hover:bg-stone-50/50 flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer group">
          <div className="size-10 rounded-xl bg-stone-100 group-hover:bg-stone-200 flex items-center justify-center transition-colors">
            <Plus size={20} className="text-stone-400" />
          </div>
          <span className="text-sm font-medium text-stone-500">
            Add Category
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-48">
        <DropdownMenuLabel>Add Category</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onAdd("Passport")}>
          Passport
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAdd("Bank Statement")}>
          Bank Statement
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAdd("Utility Bill")}>
          Utility Bill
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAdd("Employment Letter")}>
          Employment Letter
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onAdd("Other Documents")}>
          Other Documents
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// ============================================================================
// EMPTY STATE
// ============================================================================
const EmptyState = ({ onUpload }: { onUpload: () => void }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="size-16 rounded-2xl bg-stone-100 flex items-center justify-center mb-4">
        <FileText size={32} className="text-stone-300" />
      </div>
      <h3 className="text-lg font-semibold text-stone-800 mb-2 text-balance">
        No documents yet
      </h3>
      <p className="text-sm text-stone-500 text-center max-w-sm mb-6 text-pretty">
        Upload documents to organize them into categories for your application.
      </p>
      <button
        onClick={onUpload}
        className="flex items-center gap-2 px-5 py-2.5 bg-[#0E4268] text-white text-sm font-medium rounded-xl hover:bg-[#0a3555] transition-colors"
      >
        <Upload size={16} />
        Upload Documents
      </button>
    </div>
  );
};

// ============================================================================
// LOADING STATE
// ============================================================================
const LoadingState = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="size-10 border-2 border-stone-200 border-t-[#0E4268] rounded-full animate-spin mb-4" />
      <p className="text-sm text-stone-500">Processing documents...</p>
    </div>
  );
};

// ============================================================================
// MAIN FILE HUB CONTENT
// ============================================================================
export function FileHubContent() {
  const groups = useDocumentGroups();
  const isLoading = useIsLoadingDocuments();
  const uploadDocuments = useCaseDetailStore((state) => state.uploadDocuments);
  const addDocumentGroup = useCaseDetailStore(
    (state) => state.addDocumentGroup,
  );

  // Review modal state
  const [reviewGroup, setReviewGroup] = useState<DocumentGroup | null>(null);

  // Single page preview state
  const [previewPage, setPreviewPage] = useState<{
    file: DocumentFile;
    index: number;
  } | null>(null);

  const classifiedGroups = groups.filter((g) => g.id !== "unclassified");
  const unclassifiedGroup = groups.find((g) => g.id === "unclassified");
  const unclassifiedFiles =
    unclassifiedGroup?.files.filter((f) => !f.isRemoved) || [];

  if (isLoading) {
    return (
      <div className="h-full flex flex-col bg-stone-50">
        <FileHubHeader groups={groups} />
        <LoadingState />
      </div>
    );
  }

  const hasAnyFiles = groups.some((g) => g.files.length > 0);

  if (!hasAnyFiles && classifiedGroups.length === 0) {
    return (
      <div className="h-full flex flex-col bg-stone-50">
        <FileHubHeader groups={groups} />
        <UploadArea
          unclassifiedFiles={[]}
          allGroups={groups}
          onUpload={uploadDocuments}
          onPreviewPage={() => {}}
        />
        <EmptyState onUpload={uploadDocuments} />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-stone-50">
      {/* Header */}
      <FileHubHeader groups={groups} />

      {/* Upload Area with Unclassified Preview */}
      <UploadArea
        unclassifiedFiles={unclassifiedFiles}
        allGroups={groups}
        onUpload={uploadDocuments}
        onPreviewPage={(file, index) => setPreviewPage({ file, index })}
      />

      {/* Category Grid */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {classifiedGroups.map((group) => (
            <CategoryCard
              key={group.id}
              group={group}
              allGroups={groups}
              onReview={() => setReviewGroup(group)}
            />
          ))}

          {/* Add Category Card */}
          <AddCategoryCard onAdd={addDocumentGroup} />
        </div>
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {reviewGroup && (
          <CategoryReviewModal
            group={reviewGroup}
            allGroups={groups}
            onClose={() => setReviewGroup(null)}
          />
        )}
      </AnimatePresence>

      {/* Single Page Preview Modal */}
      <AnimatePresence>
        {previewPage && (
          <SinglePagePreviewModal
            file={previewPage.file}
            pageIndex={previewPage.index}
            allGroups={groups}
            onClose={() => setPreviewPage(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
