"use client";

import React, { useState, useRef, useEffect } from "react";
import { useDrag, useDrop, useDragLayer } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Download,
  Plus,
  Check,
  Inbox,
  FolderOpen,
  File,
  X,
  FilePlus,
  Pencil,
  Trash2,
  Loader2,
  Copy,
  Link2,
  Layers,
  GripVertical,
  Upload,
  FileStack,
  RotateCcw,
  FileUp,
  FolderUp,
  MoreVertical,
  RefreshCw,
} from "lucide-react";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useCaseDetailStore,
  useDocumentGroups,
  useIsLoadingDocuments,
  useHighlightedGroupId,
  useUnclassifiedFiles,
} from "@/store/case-detail-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CategoryReviewModal, DocumentPreviewContent, DeleteDocumentConfirmDialog } from "../shared";
import { useGroupChecklistBindings } from "@/store/case-detail-store";
import { CreateDocumentCategoryPopover } from "./CreateDocumentCategoryPopover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import {
  DOCUMENT_CATEGORY_SUGGESTIONS,
  DOCUMENT_CATEGORY_GROUPS,
} from "@/data/document-categories";
import type { DocumentGroup, DocumentFile } from "@/types/case-detail";

const ItemTypes = {
  PAGE: "page",
  GROUP: "group",
};

// Helper to generate unique name for duplicate categories
const generateUniqueName = (
  baseName: string,
  existingGroups: DocumentGroup[],
): string => {
  const baseTag = baseName.toLowerCase().replace(/\s+/g, "-");
  const existingWithSameTag = existingGroups.filter(
    (g) => g.tag === baseTag || g.tag.startsWith(`${baseTag}-`),
  );

  if (existingWithSameTag.length === 0) {
    return baseName;
  }

  // Find the highest number suffix
  let maxNum = 0;
  existingWithSameTag.forEach((g) => {
    const match = g.title.match(new RegExp(`^${baseName}\\s*(\\d+)?$`, "i"));
    if (match) {
      const num = match[1] ? parseInt(match[1]) : 0;
      maxNum = Math.max(maxNum, num);
    }
  });

  return `${baseName} ${maxNum + 1}`;
};

// Processing stages for file upload workflow
const PROCESSING_STAGES = [
  { key: "uploading", label: "Uploading...", duration: 600 },
  { key: "splitting", label: "Splitting...", duration: 800 },
  { key: "optimizing", label: "Optimizing...", duration: 700 },
  { key: "classifying", label: "Classifying...", duration: 900 },
] as const;


// ============================================================================
// SIDEBAR - macOS-style collapsible sidebar for unclassified pages
// ============================================================================
const Sidebar = ({
  unclassifiedFiles,
  allGroups,
  isCollapsed,
  onToggleCollapse,
  onPreviewPage,
}: {
  unclassifiedFiles: DocumentFile[];
  allGroups: DocumentGroup[];
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onPreviewPage: (file: DocumentFile, index: number) => void;
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [processingStage, setProcessingStage] = useState<number | null>(null);
  const [processingLabel, setProcessingLabel] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const folderInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const moveFileToGroup = useCaseDetailStore((state) => state.moveFileToGroup);
  const uploadAndAutoClassify = useCaseDetailStore((state) => state.uploadAndAutoClassify);
  const uploadFolder = useCaseDetailStore((state) => state.uploadFolder);

  const isProcessing = processingStage !== null;

  // Run processing workflow with auto-classification
  const runProcessingWorkflow = async () => {
    for (let i = 0; i < PROCESSING_STAGES.length; i++) {
      setProcessingStage(i);
      await new Promise((resolve) =>
        setTimeout(resolve, PROCESSING_STAGES[i].duration),
      );
    }
    setProcessingStage(null);
    // Auto-classify uploaded documents into categories
    const pageCount = Math.floor(Math.random() * 4) + 6; // 6-9 pages
    uploadAndAutoClassify(pageCount);
    toast.success("Documents uploaded", {
      description: `${pageCount} pages uploaded and auto-classified.`,
    });
  };

  // Handle folder input change
  const handleFolderSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    // Run folder processing workflow
    setProcessingStage(0);
    setProcessingLabel("Scanning folder structure...");
    await new Promise((resolve) => setTimeout(resolve, 500));

    setProcessingLabel("Parsing paths...");
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Collect files with their relative paths
    const filesWithPaths: Array<{ file: File; relativePath: string }> = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      // webkitRelativePath contains the full path from the selected folder root
      const relativePath = (file as File & { webkitRelativePath: string }).webkitRelativePath;
      if (relativePath) {
        // Get directory path (without filename)
        const dirPath = relativePath.substring(0, relativePath.lastIndexOf('/') + 1);
        filesWithPaths.push({ file, relativePath: dirPath });
      }
    }

    setProcessingLabel("Classifying documents...");
    await new Promise((resolve) => setTimeout(resolve, 600));

    setProcessingLabel("Creating document groups...");
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Upload folder with parsed paths
    if (filesWithPaths.length > 0) {
      uploadFolder(filesWithPaths);
      toast.success("Folder uploaded", {
        description: `${filesWithPaths.length} files imported and classified.`,
      });
    }

    setProcessingStage(null);
    setProcessingLabel(null);

    // Reset input so the same folder can be selected again
    e.target.value = '';
  };

  // Trigger folder input click
  const handleFolderUploadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isProcessing && folderInputRef.current) {
      folderInputRef.current.click();
    }
  };

  // Trigger file input click
  const handleFileUploadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isProcessing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle individual file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    // Use the same processing workflow as drag-and-drop
    await runProcessingWorkflow();
    e.target.value = "";
  };

  // Drop target for internal page drags
  const [{ isOver: isInternalDragOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.PAGE,
      drop: (item: { id: string; groupId: string }) => {
        if (item.groupId !== "unclassified") {
          moveFileToGroup(item.id, "unclassified");
          toast.success("Page moved to Unclassified");
        }
      },
      collect: (monitor) => ({ isOver: monitor.isOver() }),
    }),
    [moveFileToGroup],
  );

  // Native file drag handlers
  const handleNativeDragOver = (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes("Files") && !isProcessing) {
      e.preventDefault();
      setIsDragOver(true);
    }
  };

  const handleNativeDragLeave = (e: React.DragEvent) => {
    if (!isDragOver) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const { clientX, clientY } = e;
      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        setIsDragOver(false);
      }
    }
  };

  const handleNativeDrop = (e: React.DragEvent) => {
    if (e.dataTransfer.files.length > 0 && !isProcessing) {
      e.preventDefault();
      setIsDragOver(false);
      runProcessingWorkflow();
    }
  };

  const isAnyDragOver = isDragOver || isInternalDragOver;
  const currentStage =
    processingStage !== null ? PROCESSING_STAGES[processingStage] : null;

  // Get current processing label - either from folder upload or file upload
  const currentProcessingLabel = processingLabel || currentStage?.label;

  const setRefs = (el: HTMLDivElement | null) => {
    containerRef.current = el;
    drop(el);
  };

  // Collapsed state - unified icon group with subtle indicator
  if (isCollapsed) {
    const hasFiles = unclassifiedFiles.length > 0;

    return (
      <div
        className="fixed z-30 transition-all duration-200 ease-out"
        style={{
          top: "calc(var(--header-height, 104px) + 16px)",
          left: "16px",
        }}
      >
        <div className="flex flex-col rounded-2xl bg-white border border-stone-200 shadow-sm overflow-hidden">
          {/* Expand button with subtle dot indicator */}
          <button
            onClick={onToggleCollapse}
            className={cn(
              "relative size-11 flex items-center justify-center transition-colors",
              hasFiles
                ? "text-stone-600 hover:text-stone-800 hover:bg-stone-50"
                : "text-stone-400 hover:text-stone-600 hover:bg-stone-50",
            )}
            aria-label="Expand sidebar"
          >
            <Inbox size={18} />
            {/* Subtle dot indicator - just shows presence, not count */}
            {hasFiles && (
              <span className="absolute top-2 right-2 size-2 rounded-full bg-amber-400" />
            )}
          </button>

          {/* Divider */}
          <div className="mx-2 h-px bg-stone-100" />

          {/* Upload file button */}
          <button
            onClick={handleFileUploadClick}
            disabled={isProcessing}
            className={cn(
              "size-11 flex items-center justify-center transition-colors",
              isProcessing
                ? "text-[#0E4268]"
                : "text-stone-400 hover:text-[#0E4268] hover:bg-stone-50",
            )}
            aria-label="Upload files"
            title="Upload files"
          >
            {isProcessing ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <FileUp size={16} />
            )}
          </button>

          {/* Upload folder button */}
          <button
            onClick={handleFolderUploadClick}
            disabled={isProcessing}
            className={cn(
              "size-11 flex items-center justify-center transition-colors",
              isProcessing
                ? "text-[#0E4268] cursor-default"
                : "text-stone-400 hover:text-[#0E4268] hover:bg-stone-50",
            )}
            aria-label="Upload folder"
            title="Upload folder"
          >
            <FolderUp size={16} />
          </button>
        </div>
        {/* Hidden file inputs (needed for collapsed state too) */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
          accept=".pdf,.jpg,.jpeg,.png,.tiff,.tif"
          multiple
        />
        <input
          ref={folderInputRef}
          type="file"
          className="hidden"
          onChange={handleFolderSelect}
          {...{ webkitdirectory: "", directory: "" } as React.InputHTMLAttributes<HTMLInputElement>}
          multiple
        />
      </div>
    );
  }

  return (
    <div
      ref={setRefs}
      onDragOver={handleNativeDragOver}
      onDragLeave={handleNativeDragLeave}
      onDrop={handleNativeDrop}
      style={{
        top: "calc(var(--header-height, 104px) + 16px)",
        left: "16px",
        height: "calc(100dvh - var(--header-height, 104px) - 32px)",
      }}
      className={cn(
        "fixed z-30 w-64 flex flex-col rounded-xl border shadow-sm overflow-hidden transition-all duration-200 ease-out",
        isAnyDragOver
          ? "bg-[#0E4268]/5 border-[#0E4268]"
          : "bg-white/80 backdrop-blur-sm border-stone-200",
      )}
    >
      {/* Sidebar Header */}
      <div className="h-10 px-3 flex items-center justify-between border-b border-stone-100 shrink-0">
        <span className="text-xs font-medium text-stone-600">
          Unclassified
          {unclassifiedFiles.length > 0 && ` (${unclassifiedFiles.length})`}
        </span>
        <button
          onClick={onToggleCollapse}
          className="p-1 rounded hover:bg-stone-100 transition-colors"
          aria-label="Collapse sidebar"
        >
          <ChevronLeft size={14} className="text-stone-400" />
        </button>
      </div>

      {/* Pages List - Scrollable */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-2 py-2 min-h-0">
        {unclassifiedFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <Inbox size={24} className="text-stone-300 mb-2" />
            <p className="text-[11px] text-stone-400 text-pretty">
              No unclassified pages
            </p>
            <p className="text-[10px] text-stone-300 mt-1">
              Upload files below
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {unclassifiedFiles.map((file, idx) => (
              <SidebarPageItem
                key={file.id}
                file={file}
                index={idx}
                allGroups={allGroups}
                onPreview={() => onPreviewPage(file, idx)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileSelect}
        accept=".pdf,.jpg,.jpeg,.png,.tiff,.tif"
        multiple
      />
      <input
        ref={folderInputRef}
        type="file"
        className="hidden"
        onChange={handleFolderSelect}
        {...{ webkitdirectory: "", directory: "" } as React.InputHTMLAttributes<HTMLInputElement>}
        multiple
      />

      {/* Upload Zone */}
      <div className="shrink-0 p-3 border-t border-stone-100 space-y-2">
        {/* Dashed drop area */}
        <div
          className={cn(
            "w-full rounded-xl border-2 border-dashed transition-all",
            isProcessing
              ? "border-[#0E4268]/40 bg-[#0E4268]/5 cursor-default"
              : isAnyDragOver
                ? "border-[#0E4268] bg-[#0E4268]/10 scale-[1.02]"
                : "border-stone-300",
          )}
        >
          {isProcessing ? (
            <div className="w-full px-4 py-4 flex flex-col items-center justify-center gap-1.5">
              <Loader2 size={20} className="text-[#0E4268] animate-spin" />
              <span className="text-xs font-medium text-[#0E4268]">
                {currentProcessingLabel}
              </span>
            </div>
          ) : (
            <div className="w-full px-4 py-3.5 flex flex-col items-center justify-center gap-1">
              <div className={cn(
                "size-8 rounded-lg flex items-center justify-center transition-colors",
                isAnyDragOver ? "bg-[#0E4268]/10" : "bg-stone-100"
              )}>
                <FilePlus
                  size={16}
                  className={cn(
                    "transition-colors",
                    isAnyDragOver ? "text-[#0E4268]" : "text-stone-400",
                  )}
                />
              </div>
              <span className={cn(
                "text-xs font-medium transition-colors",
                isAnyDragOver ? "text-[#0E4268]" : "text-stone-500"
              )}>
                {isAnyDragOver ? "Drop here" : "Drag & drop"}
              </span>
            </div>
          )}
        </div>

        {/* Text button links for file / folder upload */}
        {!isProcessing && !isAnyDragOver && (
          <div className="flex items-center justify-center gap-1 text-[11px]">
            <button
              onClick={handleFileUploadClick}
              className="font-medium text-[#0E4268]/70 hover:text-[#0E4268] hover:underline transition-colors cursor-pointer"
            >
              Upload Files
            </button>
            <span className="text-stone-300">|</span>
            <button
              onClick={handleFolderUploadClick}
              className="font-medium text-[#0E4268]/70 hover:text-[#0E4268] hover:underline transition-colors cursor-pointer"
            >
              Upload Folder
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// SIDEBAR PAGE ITEM - Single page row in sidebar list
// ============================================================================
const SidebarPageItem = ({
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
  const moveFileToGroup = useCaseDetailStore((state) => state.moveFileToGroup);
  const duplicateFileToGroup = useCaseDetailStore((state) => state.duplicateFileToGroup);
  const classifiedGroups = allGroups.filter((g) => g.id !== "unclassified");

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.PAGE,
    item: () => ({ id: file.id, groupId: "unclassified", pageIndex: index }),
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  drag(ref);

  const linkCount = file.containerIds?.length || 0;

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          ref={ref}
          onClick={onPreview}
          className={cn(
            "group flex items-center gap-2.5 px-2 py-1.5 rounded-md cursor-pointer transition-colors select-none",
            isDragging ? "opacity-50" : "hover:bg-white/80",
          )}
        >
          {/* Page thumbnail */}
          <div className="relative shrink-0">
            <div className="w-8 aspect-[1/1.414] rounded border border-stone-200 bg-white overflow-hidden">
              <div className="w-full h-full p-1">
                <div className="space-y-px">
                  <div className="h-px bg-stone-300 rounded w-1/2" />
                  <div className="h-px bg-stone-200 rounded w-full mt-0.5" />
                  <div className="h-px bg-stone-200 rounded w-4/5" />
                  <div className="h-px bg-stone-200 rounded w-full" />
                </div>
              </div>
            </div>
            {/* New indicator */}
            {file.isNew && (
              <div className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-blue-500 border border-white" />
            )}
            {/* Link count badge - shows when page is linked to multiple groups */}
            {linkCount > 0 && (
              <div className="absolute -bottom-0.5 -right-0.5 flex items-center gap-0.5 px-1 py-0.5 bg-violet-500 text-white text-[7px] font-bold rounded-full shadow-sm border border-white">
                <Link2 size={7} />
                {linkCount}
              </div>
            )}
          </div>

          {/* Page info */}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-stone-700 truncate">Page {index + 1}</p>
            <p className="text-[10px] text-stone-400 truncate">{file.name}</p>
          </div>

          {/* Page number badge */}
          <span className="text-[10px] font-medium text-stone-400 tabular-nums opacity-0 group-hover:opacity-100 transition-opacity">
            #{index + 1}
          </span>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <FolderOpen size={14} className="mr-2" />
            Move to
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            {classifiedGroups.map((group) => (
              <ContextMenuItem
                key={group.id}
                onClick={() => {
                  moveFileToGroup(file.id, group.id);
                  toast.success("Page moved", { description: `Moved to "${group.title}".` });
                }}
              >
                <FileText size={14} className="mr-2 text-stone-400" />
                {group.title}
              </ContextMenuItem>
            ))}
            {classifiedGroups.length === 0 && (
              <ContextMenuItem disabled>No categories</ContextMenuItem>
            )}
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Copy size={14} className="mr-2 text-violet-500" />
            Duplicate to
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            {classifiedGroups.map((group) => (
              <ContextMenuItem
                key={group.id}
                onClick={() => duplicateFileToGroup(file.id, group.id)}
              >
                <FileText size={14} className="mr-2 text-stone-400" />
                {group.title}
              </ContextMenuItem>
            ))}
            {classifiedGroups.length === 0 && (
              <ContextMenuItem disabled>No categories</ContextMenuItem>
            )}
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem className="text-red-600">
          <Trash2 size={14} className="mr-2" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const moveFileToGroup = useCaseDetailStore((state) => state.moveFileToGroup);
  const markFileForDeletion = useCaseDetailStore(
    (state) => state.markFileForDeletion,
  );
  const clearFileNewStatus = useCaseDetailStore(
    (state) => state.clearFileNewStatus,
  );
  const classifiedGroups = allGroups.filter((g) => g.id !== "unclassified");

  // Clear NEW status when modal opens
  React.useEffect(() => {
    if (file.isNew) {
      clearFileNewStatus(file.id);
    }
  }, [file.id, file.isNew, clearFileNewStatus]);

  // Close on escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (showDeleteConfirm) {
          setShowDeleteConfirm(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, showDeleteConfirm]);

  const handleDelete = () => {
    markFileForDeletion(file.id, "unclassified");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="absolute inset-0 bg-black/70"
        onClick={showDeleteConfirm ? undefined : onClose}
      />

      {/* Modal Content - larger size for A4 preview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="relative z-10 flex flex-col max-w-2xl w-full mx-4 bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Header - no circle before page name */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-stone-200 bg-stone-50">
          <span className="text-sm font-medium text-stone-800">
            Page {pageIndex + 1}
          </span>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
            aria-label="Close preview"
          >
            <X size={18} />
          </button>
        </div>

        {/* Page Preview - larger A4 ratio */}
        <div className="p-8 bg-stone-100 flex items-center justify-center">
          <div className="aspect-[1/1.414] w-full max-w-md rounded-lg border border-stone-200 shadow-md p-8 bg-white">
            <DocumentPreviewContent size="lg" />
          </div>
        </div>

        {/* Footer - Move to dropdown and Delete button */}
        <div className="px-5 py-3 border-t border-stone-200 bg-white">
          <div className="flex items-center justify-between">
            {/* Left side - Delete with confirmation */}
            {showDeleteConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-red-600">Delete this page?</span>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1.5 text-sm font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                aria-label="Delete page"
              >
                <Trash2 size={14} />
                Delete
              </button>
            )}

            {/* Right side - Move to dropdown */}
            {!showDeleteConfirm && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors">
                    Move to
                    <ChevronDown size={14} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Categories</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {classifiedGroups.length > 0 ? (
                    classifiedGroups.map((group) => (
                      <DropdownMenuItem
                        key={group.id}
                        onClick={() => {
                          moveFileToGroup(file.id, group.id);
                          toast.success("Page moved", { description: `Moved to "${group.title}".` });
                          onClose();
                        }}
                      >
                        {group.title}
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <DropdownMenuItem disabled>
                      No categories available
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
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
            "w-12 aspect-[1/1.414] rounded border border-stone-200 bg-white overflow-hidden cursor-pointer transition-all hover:scale-105 hover:shadow-md relative select-none",
            isDragging && "opacity-50 cursor-grabbing",
          )}
          title={file.name}
        >
          {/* Page content */}
          <div className="w-full h-full p-1">
            <div className="space-y-0.5">
              <div className="h-px bg-stone-300 rounded w-1/3" />
              <div className="h-px bg-stone-200 rounded w-full mt-0.5" />
              <div className="h-px bg-stone-200 rounded w-full" />
              <div className="h-px bg-stone-200 rounded w-4/5" />
              <div className="h-px bg-stone-200 rounded w-full" />
              <div className="h-px bg-stone-200 rounded w-2/3" />
            </div>
          </div>
          {/* Page number circle - top left, new files have blue fill */}
          <div
            className={cn(
              "absolute top-0.5 left-0.5 size-4 flex items-center justify-center text-[8px] font-semibold tabular-nums rounded-full",
              file.isNew
                ? "bg-blue-500 text-white"
                : "border border-stone-300 text-stone-500",
            )}
          >
            {index + 1}
          </div>
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
                onClick={() => {
                  moveFileToGroup(file.id, group.id);
                  toast.success("Page moved", { description: `Moved to "${group.title}".` });
                }}
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
// CATEGORY CARD (A4 ratio, no icon, uppercase type)
// ============================================================================
const CategoryCard = ({
  group,
  allGroups,
  unclassifiedFiles,
  onReview,
  isHighlighted,
  onHighlightComplete,
  isSelected,
  onToggleSelect,
  isSelectMode,
  selectedGroupIds,
  onMergeComplete,
}: {
  group: DocumentGroup;
  allGroups: DocumentGroup[];
  unclassifiedFiles: DocumentFile[];
  onReview: () => void;
  isHighlighted?: boolean;
  onHighlightComplete?: () => void;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  isSelectMode?: boolean;
  selectedGroupIds?: Set<string>;
  onMergeComplete?: () => void;
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isRenamingTitle, setIsRenamingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(group.title);
  // Track the initial title at mount time as fallback for reset
  const [initialTitle] = useState(() => group.originalTitle || group.title);
  const [isFileDragOver, setIsFileDragOver] = useState(false);
  const [showHighlight, setShowHighlight] = useState(false);
  const [hoveredFileId, setHoveredFileId] = useState<string | null>(null);
  const [showAddFromDocsModal, setShowAddFromDocsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pendingMergeGroupIds, setPendingMergeGroupIds] = useState<string[] | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const deleteDocumentGroup = useCaseDetailStore((state) => state.deleteDocumentGroup);
  const mergeDocumentsIntoGroup = useCaseDetailStore((state) => state.mergeDocumentsIntoGroup);
  const checklistBindings = useGroupChecklistBindings(group.id);

  // Handle highlight animation and scroll into view
  useEffect(() => {
    if (isHighlighted && cardRef.current) {
      // Scroll the card into view
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      // Show highlight effect
      setShowHighlight(true);
      // Clear highlight after animation
      const timer = setTimeout(() => {
        setShowHighlight(false);
        onHighlightComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isHighlighted, onHighlightComplete]);

  const moveFileToGroup = useCaseDetailStore((state) => state.moveFileToGroup);
  const confirmGroupReview = useCaseDetailStore(
    (state) => state.confirmGroupReview,
  );
  const uploadToGroup = useCaseDetailStore((state) => state.uploadToGroup);
  const replaceGroupFiles = useCaseDetailStore((state) => state.replaceGroupFiles);
  const renameDocumentGroup = useCaseDetailStore(
    (state) => state.renameDocumentGroup,
  );
  const addFilesToGroup = useCaseDetailStore((state) => state.addFilesToGroup);
  const resetGroupTitle = useCaseDetailStore((state) => state.resetGroupTitle);

  // Handle native file drag and drop (only for files from OS, not react-dnd)
  const handleNativeDragOver = (e: React.DragEvent) => {
    // Only handle native file drags, not react-dnd internal drags
    if (e.dataTransfer.types.includes("Files")) {
      e.preventDefault();
      setIsFileDragOver(true);
    }
  };

  const handleNativeDragLeave = (e: React.DragEvent) => {
    // Only handle if we were tracking a native file drag
    if (!isFileDragOver) return;

    // Only set to false if we're leaving the card entirely
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      const { clientX, clientY } = e;
      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        setIsFileDragOver(false);
      }
    }
  };

  const handleNativeDrop = (e: React.DragEvent) => {
    // Only handle native file drops
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      e.preventDefault();
      setIsFileDragOver(false);
      // Simulate uploading files - in real app would process actual files
      uploadToGroup(group.id, files.length);
      toast.success("Files uploaded", {
        description: `${files.length} page${files.length !== 1 ? "s" : ""} added to "${group.title}".`,
      });
    }
  };

  const handleUpload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const pageCount = Math.floor(Math.random() * 3) + 1;
    uploadToGroup(group.id, pageCount);
    toast.success("Files uploaded", {
      description: `${pageCount} page${pageCount !== 1 ? "s" : ""} added to "${group.title}".`,
    });
  };

  const activeFiles = group.files.filter((f) => !f.isRemoved);
  const totalPages = activeFiles.length;

  // Keep currentPageIndex in bounds when pages change
  const prevTotalPagesRef = useRef(totalPages);
  useEffect(() => {
    if (totalPages > prevTotalPagesRef.current) {
      // New files added, jump to the last page
      setCurrentPageIndex(totalPages - 1);
    } else if (totalPages < prevTotalPagesRef.current && totalPages > 0) {
      // Pages removed, clamp index to last available page
      setCurrentPageIndex((prev) => Math.min(prev, totalPages - 1));
    }
    prevTotalPagesRef.current = totalPages;
  }, [totalPages]);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Download", group.id);
  };

  const handleConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    confirmGroupReview(group.id);
    toast.success("Review confirmed", {
      description: `"${group.title}" marked as reviewed.`,
    });
  };

  const effectiveOriginalTitle = group.originalTitle || initialTitle;
  const isRenamed = effectiveOriginalTitle && group.title !== effectiveOriginalTitle;

  const handleRenameSubmit = () => {
    if (editedTitle.trim() && editedTitle !== group.title) {
      renameDocumentGroup(group.id, editedTitle.trim());
      toast.success("Document renamed", {
        description: `Renamed to "${editedTitle.trim()}".`,
      });
    } else {
      setEditedTitle(group.title);
    }
    setIsRenamingTitle(false);
  };

  const handleResetTitle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (group.originalTitle) {
      resetGroupTitle(group.id);
    } else {
      // Fallback: use local initial title if store doesn't have originalTitle
      renameDocumentGroup(group.id, effectiveOriginalTitle);
    }
    toast.success("Title restored", {
      description: `Reset to "${effectiveOriginalTitle}".`,
    });
    setEditedTitle(effectiveOriginalTitle);
  };

  const currentFile = activeFiles[currentPageIndex];
  const isPending = group.status === "pending" && totalPages > 0;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPageIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPageIndex((prev) => Math.min(totalPages - 1, prev + 1));
  };

  // Drag hook: make this group draggable
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: ItemTypes.GROUP,
      item: () => ({
        groupId: group.id,
        title: group.title,
        pageCount: totalPages,
        selectedGroupIds: selectedGroupIds?.has(group.id)
          ? Array.from(selectedGroupIds)
          : undefined,
      }),
      canDrag: () => totalPages > 0,
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    }),
    [group.id, group.title, totalPages, selectedGroupIds],
  );

  // Use empty image as drag preview to replace default full-size screenshot
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  // Drop hook: accept PAGE and GROUP drops
  const [{ isOver, isGroupOver }, drop] = useDrop<
    { id: string; groupId: string; title?: string; selectedGroupIds?: string[] },
    void,
    { isOver: boolean; isGroupOver: boolean }
  >(
    () => ({
      accept: [ItemTypes.PAGE, ItemTypes.GROUP],
      drop: (item, monitor) => {
        const itemType = monitor.getItemType();
        if (itemType === ItemTypes.PAGE) {
          if (item.groupId !== group.id) {
            moveFileToGroup(item.id, group.id);
            toast.success("Page moved", { description: `Moved to "${group.title}".` });
          }
        } else if (itemType === ItemTypes.GROUP) {
          if (item.groupId !== group.id) {
            const sourceIds = item.selectedGroupIds
              ? item.selectedGroupIds.filter((id: string) => id !== group.id)
              : [item.groupId];
            if (sourceIds.length > 0) {
              setPendingMergeGroupIds(sourceIds);
            }
          }
        }
      },
      canDrop: (item, monitor) => {
        const itemType = monitor.getItemType();
        if (itemType === ItemTypes.GROUP) {
          if (item.groupId === group.id) return false;
          if (item.selectedGroupIds?.includes(group.id)) return false;
        }
        return true;
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        isGroupOver: monitor.isOver() && monitor.getItemType() === ItemTypes.GROUP && monitor.canDrop(),
      }),
    }),
    [group.id, moveFileToGroup],
  );

  // Display type from tag (uppercase with tracking)
  const displayType = group.tag
    .split("-")
    .map((word) => word.toUpperCase())
    .join(" ");

  // Combine refs for react-dnd drag + drop and native drag
  const setRefs = (el: HTMLDivElement | null) => {
    cardRef.current = el;
    drag(drop(el));
  };

  return (
    <div
      ref={setRefs}
      className={cn(
        "bg-white rounded-xl border overflow-hidden flex flex-col transition-all cursor-pointer relative",
        isDragging && "opacity-50 scale-95",
        isGroupOver
          ? "border-blue-500 ring-2 ring-blue-500/30 border-dashed scale-[1.02]"
          : isOver || isFileDragOver
            ? "border-[#0E4268] ring-2 ring-[#0E4268]/20 scale-[1.02]"
            : isSelected
              ? "border-[#0E4268] ring-2 ring-[#0E4268]/20"
              : showHighlight
                ? "border-[#0E4268] ring-2 ring-[#0E4268]/30 shadow-lg shadow-[#0E4268]/10"
                : "border-stone-200 hover:border-stone-300 hover:shadow-md",
      )}
      onClick={onReview}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDragOver={handleNativeDragOver}
      onDragLeave={handleNativeDragLeave}
      onDrop={handleNativeDrop}
    >
      {/* Card Header - Title + Checkbox row 1, Type + Status row 2 */}
      <div className="px-3 py-2 border-b border-stone-100 shrink-0">
        {/* Row 1: Checkbox + Title sharing full width */}
        <div className="flex items-center gap-2 mb-1">
          {/* Selection checkbox */}
          {(isSelectMode || isHovered) && onToggleSelect && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                onToggleSelect();
              }}
              className="shrink-0"
            >
              <div
                className={cn(
                  "size-4 rounded flex items-center justify-center transition-colors cursor-pointer",
                  isSelected
                    ? "bg-[#0E4268] text-white"
                    : "bg-white border border-stone-300 hover:border-stone-400 text-transparent hover:text-stone-400"
                )}
              >
                <Check size={10} strokeWidth={3} />
              </div>
            </div>
          )}
          {/* Title - takes remaining width */}
          <div className="flex-1 min-w-0 flex items-center gap-0.5">
            {isRenamingTitle ? (
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={handleRenameSubmit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRenameSubmit();
                  if (e.key === "Escape") {
                    setEditedTitle(group.title);
                    setIsRenamingTitle(false);
                  }
                  e.stopPropagation();
                }}
                onClick={(e) => e.stopPropagation()}
                className="w-full text-xs font-semibold text-stone-800 bg-white border-2 border-[#0E4268] rounded px-1.5 py-0.5 outline-none shadow-sm"
                autoFocus
              />
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsRenamingTitle(true);
                }}
                className="group min-w-0 flex-1 text-xs font-semibold text-stone-800 truncate text-left hover:text-[#0E4268] rounded transition-all flex items-center gap-1"
                title="Click to rename"
                aria-label="Rename document"
              >
                <span className="truncate">{group.title}</span>
                {group.hasChanges && (
                  <span
                    className="size-1.5 rounded-full bg-blue-500 shrink-0"
                    title="Recently updated"
                  />
                )}
                <Pencil
                  size={10}
                  className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-[#0E4268]"
                />
              </button>
            )}
            {isRenamed && !isRenamingTitle && (
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleResetTitle}
                      onPointerDown={(e) => e.stopPropagation()}
                      className="shrink-0 size-5 rounded flex items-center justify-center hover:bg-stone-100 transition-colors cursor-pointer"
                      aria-label="Reset to original name"
                    >
                      <RotateCcw size={11} className="text-[#0E4268]/60 hover:text-[#0E4268]" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    Reset to: {effectiveOriginalTitle}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>

        {/* Row 2: File Type + Status badges */}
        <div className="flex items-center justify-between">
          <div className="text-[9px] text-stone-400 uppercase tracking-wide font-medium">
            {displayType}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {isPending ? (
              <span className="px-1.5 py-0.5 text-[9px] font-semibold text-amber-700 bg-amber-50 rounded whitespace-nowrap">
                Pending
              </span>
            ) : totalPages > 0 ? (
              <span className="px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700 bg-emerald-50 rounded flex items-center gap-0.5">
                <Check size={8} strokeWidth={3} />
                Ready
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Card Content - Page Preview (A4 ratio) */}
      <div className="flex-1 relative bg-stone-50 flex items-center justify-center overflow-hidden min-h-0">
        {totalPages > 0 && currentFile ? (
          <>
            <div className="w-full h-full p-2 flex items-center justify-center">
              <div className="h-full aspect-[1/1.414] rounded border border-stone-200 shadow-sm p-2 relative bg-white">
                <DocumentPreviewContent size="sm" />

                {/* New page indicator on current preview */}
                {currentFile.isNew && (
                  <div className="absolute top-1 right-1">
                    <div className="size-1.5 rounded-full bg-blue-500" />
                  </div>
                )}

                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-medium text-stone-600 bg-stone-50 px-1.5 py-0.5 rounded tabular-nums">
                  {currentPageIndex + 1}/{totalPages}
                </div>
              </div>
            </div>

            <motion.button
              onClick={handlePrev}
              disabled={currentPageIndex === 0}
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered && currentPageIndex > 0 ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "absolute left-1 top-1/2 -translate-y-1/2 p-1 rounded bg-white/90 shadow-md transition-colors z-10",
                currentPageIndex === 0
                  ? "cursor-not-allowed text-stone-300"
                  : "text-stone-600 hover:text-stone-900 hover:bg-white",
              )}
              aria-label="Previous page"
            >
              <ChevronLeft size={14} />
            </motion.button>

            <motion.button
              onClick={handleNext}
              disabled={currentPageIndex >= totalPages - 1}
              initial={{ opacity: 0 }}
              animate={{
                opacity: isHovered && currentPageIndex < totalPages - 1 ? 1 : 0,
              }}
              transition={{ duration: 0.2 }}
              className={cn(
                "absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded bg-white/90 shadow-md transition-colors z-10",
                currentPageIndex >= totalPages - 1
                  ? "cursor-not-allowed text-stone-300"
                  : "text-stone-600 hover:text-stone-900 hover:bg-white",
              )}
              aria-label="Next page"
            >
              <ChevronRight size={14} />
            </motion.button>
          </>
        ) : (
          <div className="w-full h-full p-2 flex items-center justify-center">
            <div className="h-full aspect-[1/1.414] rounded border border-dashed border-stone-200 p-2 relative bg-white flex flex-col items-center justify-center">
              <div className="text-center">
                <Inbox size={18} className="mx-auto mb-1 text-stone-300" />
                <p className="text-[10px] text-stone-400">No files</p>
                <p className="text-[9px] text-stone-300 mt-0.5">Drop files here</p>
              </div>
            </div>
          </div>
        )}

        {/* Native file drag overlay */}
        {isFileDragOver && (
          <div className="absolute inset-0 bg-[#0E4268]/10 flex items-center justify-center z-20 pointer-events-none">
            <div className="bg-white/95 rounded-lg px-3 py-2 shadow-lg flex items-center gap-2">
              <FilePlus size={16} className="text-[#0E4268]" />
              <span className="text-sm font-medium text-[#0E4268]">
                Drop to upload
              </span>
            </div>
          </div>
        )}

        {/* Group merge overlay */}
        {isGroupOver && (
          <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center z-20 pointer-events-none">
            <div className="bg-white/95 rounded-lg px-3 py-2 shadow-lg flex items-center gap-2">
              <Layers size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-600">
                Merge into {group.title}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="px-3 py-2 border-t border-stone-100 flex items-center justify-between bg-white shrink-0">
        {/* Left: CTA when pending, page info otherwise */}
        {isPending ? (
          <button
            onClick={handleConfirm}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
            aria-label="Confirm review"
          >
            <Check size={10} strokeWidth={2.5} />
            <span>Confirm</span>
          </button>
        ) : (
          <span className="text-[10px] text-stone-400 tabular-nums">
            {totalPages} {totalPages === 1 ? "page" : "pages"}
          </span>
        )}

        {/* Right: Overflow menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-1 rounded text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
              aria-label="More options"
            >
              <MoreVertical size={12} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            side="top"
            className="min-w-[180px]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Add options */}
            <DropdownMenuItem
              onClick={handleUpload}
              className="text-xs cursor-pointer"
            >
              <Upload size={14} className="mr-2" />
              Upload from device
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger
                className="text-xs cursor-pointer"
                disabled={unclassifiedFiles.length === 0}
              >
                <Inbox size={14} className="mr-2" />
                <span>From Unclassified</span>
                {unclassifiedFiles.length > 0 && (
                  <span className="ml-auto text-[10px] text-stone-400">
                    {unclassifiedFiles.length}
                  </span>
                )}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="min-w-[200px] max-h-[280px] overflow-y-auto">
                {unclassifiedFiles.length === 0 ? (
                  <div className="px-2 py-3 text-xs text-stone-400 text-center">
                    No unclassified pages
                  </div>
                ) : (
                  unclassifiedFiles.map((file) => (
                    <DropdownMenuItem
                      key={file.id}
                      onClick={() => {
                        addFilesToGroup(group.id, [file.id]);
                        toast.success("Page added", { description: `Added to "${group.title}".` });
                      }}
                      className="text-xs cursor-pointer group relative"
                      onMouseEnter={() => setHoveredFileId(file.id)}
                      onMouseLeave={() => setHoveredFileId(null)}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="size-8 rounded border border-stone-200 bg-stone-50 shrink-0 flex items-center justify-center overflow-hidden">
                          <File size={12} className="text-stone-400" />
                        </div>
                        <span className="truncate">{file.name}</span>
                      </div>
                      {/* Thumbnail preview on hover */}
                      {hoveredFileId === file.id && (
                        <div className="absolute left-full top-0 ml-2 z-50 pointer-events-none">
                          <div className="w-32 aspect-[1/1.414] bg-white rounded-lg shadow-xl border border-stone-200 p-2">
                            <div className="w-full h-full bg-stone-50 rounded flex items-center justify-center">
                              <DocumentPreviewContent size="sm" />
                            </div>
                          </div>
                        </div>
                      )}
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem
              onClick={() => setShowAddFromDocsModal(true)}
              className="text-xs cursor-pointer"
            >
              <FileStack size={14} className="mr-2" />
              <span>From Documents</span>
            </DropdownMenuItem>

            {/* Replace */}
            {totalPages > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    const pageCount = Math.floor(Math.random() * 3) + 1;
                    replaceGroupFiles(group.id, pageCount);
                    toast.success("Document replaced", {
                      description: `"${group.title}" replaced with ${pageCount} new page${pageCount !== 1 ? "s" : ""}.`,
                    });
                  }}
                  className="text-xs cursor-pointer"
                >
                  <RefreshCw size={14} className="mr-2" />
                  Replace
                </DropdownMenuItem>
              </>
            )}

            <DropdownMenuSeparator />

            {/* Download */}
            <DropdownMenuItem
              onClick={handleDownload}
              disabled={totalPages === 0}
              className="text-xs cursor-pointer"
            >
              <Download size={14} className="mr-2" />
              Download
            </DropdownMenuItem>

            {/* Delete */}
            {!group.isSpecial && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-xs text-rose-600 focus:text-rose-600 cursor-pointer"
                >
                  <Trash2 size={14} className="mr-2" />
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Add From Documents Modal */}
      {showAddFromDocsModal && (
        <AddFromDocumentsModal
          groups={allGroups}
          targetGroupId={group.id}
          targetGroupTitle={group.title}
          onClose={() => setShowAddFromDocsModal(false)}
          onConfirm={(orderedFileIds) => {
            addFilesToGroup(group.id, orderedFileIds);
            setShowAddFromDocsModal(false);
            toast.success("Pages added", {
              description: `${orderedFileIds.length} page${orderedFileIds.length !== 1 ? "s" : ""} added to "${group.title}".`,
            });
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteDocumentConfirmDialog
        open={showDeleteConfirm}
        groupTitle={group.title}
        fileCount={activeFiles.length}
        checklistBindings={checklistBindings}
        onConfirm={() => {
          deleteDocumentGroup(group.id);
          setShowDeleteConfirm(false);
          toast.success("Document deleted", {
            description: `"${group.title}" has been removed.`,
          });
        }}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {/* Merge via Combine Modal */}
      {pendingMergeGroupIds && (
        <CombineFromSelectionModal
          selectedGroups={[
            group,
            ...pendingMergeGroupIds
              .map((id) => allGroups.find((g) => g.id === id))
              .filter((g): g is DocumentGroup => g !== undefined),
          ]}
          onClose={() => setPendingMergeGroupIds(null)}
          onCombine={(name, orderedFileIds) => {
            mergeDocumentsIntoGroup(name, orderedFileIds);
            onMergeComplete?.();
            setPendingMergeGroupIds(null);
            toast.success("Documents combined", {
              description: `Created "${name}" with ${orderedFileIds.length} page${orderedFileIds.length !== 1 ? "s" : ""}.`,
            });
          }}
        />
      )}
    </div>
  );
};

// ============================================================================
// FILE SELECTION MODAL - Select files from existing containers
// ============================================================================
const FileSelectionModal = ({
  groups,
  targetGroupId,
  targetGroupTitle,
  onClose,
  onConfirm,
}: {
  groups: DocumentGroup[];
  targetGroupId: string;
  targetGroupTitle: string;
  onClose: () => void;
  onConfirm: (orderedFileIds: string[]) => void;
}) => {
  const [selectedFileIds, setSelectedFileIds] = useState<Set<string>>(new Set());
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Only show groups with active files (exclude target group and unclassified)
  const availableGroups = groups.filter(
    (g) =>
      g.id !== "unclassified" &&
      g.id !== targetGroupId &&
      g.files.filter((f) => !f.isRemoved).length > 0
  );

  // Auto-expand all groups on mount
  useEffect(() => {
    setExpandedGroups(new Set(availableGroups.map((g) => g.id)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Toggle a file's selection
  const toggleFile = (fileId: string) => {
    setSelectedFileIds((prev) => {
      const next = new Set(prev);
      if (next.has(fileId)) {
        next.delete(fileId);
      } else {
        next.add(fileId);
      }
      return next;
    });
  };

  // Toggle all files in a group
  const toggleGroup = (group: DocumentGroup) => {
    const activeFiles = group.files.filter((f) => !f.isRemoved);
    const allSelected = activeFiles.every((f) => selectedFileIds.has(f.id));
    setSelectedFileIds((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        activeFiles.forEach((f) => next.delete(f.id));
      } else {
        activeFiles.forEach((f) => next.add(f.id));
      }
      return next;
    });
  };

  // Toggle group expand/collapse
  const toggleExpand = (groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  // Count selected files in a group
  const getGroupSelectionCount = (group: DocumentGroup) => {
    const activeFiles = group.files.filter((f) => !f.isRemoved);
    return activeFiles.filter((f) => selectedFileIds.has(f.id)).length;
  };

  const handleConfirm = () => {
    if (selectedFileIds.size > 0) {
      // Collect files in order (by group, then by file order within group)
      const orderedFileIds: string[] = [];
      for (const group of availableGroups) {
        for (const file of group.files.filter((f) => !f.isRemoved)) {
          if (selectedFileIds.has(file.id)) {
            orderedFileIds.push(file.id);
          }
        }
      }
      onConfirm(orderedFileIds);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.15 }}
        className="relative bg-white rounded-xl shadow-2xl w-[420px] overflow-hidden"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-stone-100 flex items-center justify-center">
              <Layers size={16} className="text-stone-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-800">
                Add to {targetGroupTitle}
              </h3>
              <p className="text-[10px] text-stone-500">
                Select files from existing documents
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="border border-stone-200 rounded-lg max-h-72 overflow-y-auto">
            {availableGroups.length > 0 ? (
              <div className="divide-y divide-stone-100">
                {availableGroups.map((group) => {
                  const activeFiles = group.files.filter((f) => !f.isRemoved);
                  const selectedCount = getGroupSelectionCount(group);
                  const allSelected =
                    activeFiles.length > 0 &&
                    activeFiles.every((f) => selectedFileIds.has(f.id));
                  const someSelected = selectedCount > 0 && !allSelected;
                  const isExpanded = expandedGroups.has(group.id);

                  return (
                    <div key={group.id}>
                      {/* Container header */}
                      <div
                        className="flex items-center gap-2 px-3 py-2 bg-stone-50/80 hover:bg-stone-100/80 transition-colors cursor-pointer"
                        onClick={() => toggleExpand(group.id)}
                      >
                        <ChevronDown
                          size={12}
                          className={cn(
                            "text-stone-400 transition-transform shrink-0",
                            !isExpanded && "-rotate-90"
                          )}
                        />
                        <input
                          type="checkbox"
                          checked={allSelected}
                          ref={(el) => {
                            if (el) el.indeterminate = someSelected;
                          }}
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleGroup(group);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="size-3.5 rounded border-stone-300 text-stone-600 focus:ring-stone-500"
                        />
                        <FolderOpen size={13} className="text-stone-400 shrink-0" />
                        <span className="text-xs font-medium text-stone-700 flex-1 truncate">
                          {group.title}
                        </span>
                        {selectedCount > 0 && (
                          <span className="text-[10px] font-medium text-stone-500 bg-stone-200 px-1.5 py-0.5 rounded-full tabular-nums">
                            {selectedCount}/{activeFiles.length}
                          </span>
                        )}
                        {selectedCount === 0 && (
                          <span className="text-[10px] text-stone-400 tabular-nums">
                            {activeFiles.length}
                          </span>
                        )}
                      </div>

                      {/* File list (collapsible) */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="overflow-hidden"
                          >
                            {activeFiles.map((file) => (
                              <label
                                key={file.id}
                                className={cn(
                                  "flex items-center gap-2.5 pl-9 pr-3 py-1.5 cursor-pointer transition-colors",
                                  selectedFileIds.has(file.id)
                                    ? "bg-stone-50"
                                    : "hover:bg-stone-50/50"
                                )}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedFileIds.has(file.id)}
                                  onChange={() => toggleFile(file.id)}
                                  className="size-3.5 rounded border-stone-300 text-stone-600 focus:ring-stone-500"
                                />
                                <FileText
                                  size={12}
                                  className="text-stone-400 shrink-0"
                                />
                                <span className="text-xs text-stone-700 flex-1 truncate">
                                  {file.name}
                                </span>
                              </label>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="px-3 py-4 text-center">
                <p className="text-xs text-stone-400">
                  No documents available to add
                </p>
              </div>
            )}
          </div>
          {selectedFileIds.size > 0 && (
            <p className="text-xs text-stone-500 mt-2">
              {selectedFileIds.size} file{selectedFileIds.size !== 1 ? "s" : ""} selected
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-stone-100 bg-stone-50 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedFileIds.size === 0}
            className="px-4 py-1.5 text-sm font-medium text-white bg-[#0E4268] hover:bg-[#0E4268]/90 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
          >
            <Plus size={14} />
            Add Files
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ============================================================================
// DRAGGABLE FILE ITEM - For reordering in Merge Documents Modal
// ============================================================================
const MERGE_FILE_ITEM_TYPE = "MERGE_FILE_ITEM";

const DraggableMergeDocumentItem = ({
  group,
  index,
  moveFile,
}: {
  group: DocumentGroup;
  index: number;
  moveFile: (dragIndex: number, hoverIndex: number) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const activeFiles = group.files.filter((f) => !f.isRemoved);
  const displayTag = group.tag.split("-").map((w) => w.toUpperCase()).join(" ");

  const [{ isDragging }, drag] = useDrag({
    type: MERGE_FILE_ITEM_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: MERGE_FILE_ITEM_TYPE,
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveFile(item.index, index);
        item.index = index;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-2 px-3 py-2.5 rounded-lg border border-stone-200 bg-white transition-all",
        isDragging && "opacity-50 shadow-lg",
        isOver && "border-stone-400 bg-stone-50"
      )}
    >
      <GripVertical
        size={14}
        className="text-stone-300 shrink-0 cursor-grab active:cursor-grabbing"
      />
      <div className="relative size-9 shrink-0">
        <div className="absolute inset-0 bg-stone-100 rounded border border-stone-200 translate-x-0.5 translate-y-0.5" />
        <div className="absolute inset-0 bg-white rounded border border-stone-200 flex items-center justify-center">
          <FileText size={14} className="text-stone-400" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-stone-700 truncate">{group.title}</p>
        <p className="text-[10px] text-stone-400">
          {displayTag} &middot; {activeFiles.length} page{activeFiles.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// ADD FROM DOCUMENTS MODAL - Multi-select documents then order before adding
// ============================================================================
const AddFromDocumentsModal = ({
  groups,
  targetGroupId,
  targetGroupTitle,
  onClose,
  onConfirm,
}: {
  groups: DocumentGroup[];
  targetGroupId: string;
  targetGroupTitle: string;
  onClose: () => void;
  onConfirm: (orderedFileIds: string[]) => void;
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedGroupIds, setSelectedGroupIds] = useState<Set<string>>(new Set());
  const [orderedGroups, setOrderedGroups] = useState<DocumentGroup[]>([]);

  const availableGroups = groups.filter(
    (g) =>
      g.id !== "unclassified" &&
      g.id !== targetGroupId &&
      g.files.filter((f) => !f.isRemoved).length > 0
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const toggleGroup = (groupId: string) => {
    setSelectedGroupIds((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedGroupIds.size === availableGroups.length) {
      setSelectedGroupIds(new Set());
    } else {
      setSelectedGroupIds(new Set(availableGroups.map((g) => g.id)));
    }
  };

  const handleNextStep = () => {
    const selected = availableGroups.filter((g) => selectedGroupIds.has(g.id));
    setOrderedGroups(selected);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const moveFile = (dragIndex: number, hoverIndex: number) => {
    const newGroups = [...orderedGroups];
    const [draggedItem] = newGroups.splice(dragIndex, 1);
    newGroups.splice(hoverIndex, 0, draggedItem);
    setOrderedGroups(newGroups);
  };

  const handleConfirm = () => {
    if (orderedGroups.length > 0) {
      const allFileIds = orderedGroups.flatMap((g) =>
        g.files.filter((f) => !f.isRemoved).map((f) => f.id)
      );
      onConfirm(allFileIds);
    }
  };

  const canProceed = selectedGroupIds.size >= 1;
  const allSelected =
    availableGroups.length > 0 && selectedGroupIds.size === availableGroups.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 8 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className="relative bg-white rounded-2xl shadow-2xl w-[560px] max-h-[85vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-gradient-to-br from-stone-100 to-stone-50 flex items-center justify-center shadow-sm">
                <FilePlus size={18} className="text-stone-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-stone-900">Add from Documents</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Add pages to <span className="font-medium text-stone-700">{targetGroupTitle}</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors -mr-1 -mt-1"
            >
              <X size={18} />
            </button>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 flex-1">
              <div
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors duration-300",
                  step >= 1 ? "bg-[#0E4268]" : "bg-stone-200"
                )}
              />
              <div
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors duration-300",
                  step >= 2 ? "bg-[#0E4268]" : "bg-stone-200"
                )}
              />
            </div>
            <span className="text-[10px] font-medium text-stone-400 tabular-nums">
              {step}/2
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 pb-5 flex-1 overflow-hidden flex flex-col">
          {step === 1 ? (
            <div className="space-y-4 flex-1 flex flex-col">
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-stone-600">
                    Select Documents
                  </label>
                  {availableGroups.length > 0 && (
                    <button
                      onClick={toggleSelectAll}
                      className="text-[10px] font-medium text-stone-500 hover:text-stone-700 transition-colors cursor-pointer"
                    >
                      {allSelected ? "Deselect all" : "Select all"}
                    </button>
                  )}
                </div>
                <div className="border border-stone-200 rounded-xl flex-1 overflow-hidden bg-stone-50/30">
                  <div className="max-h-[320px] overflow-y-auto">
                    {availableGroups.length > 0 ? (
                      <div className="p-1.5 space-y-0.5">
                        {availableGroups.map((g) => {
                          const activeFiles = g.files.filter((f) => !f.isRemoved);
                          const displayTag = g.tag
                            .split("-")
                            .map((w) => w.toUpperCase())
                            .join(" ");
                          return (
                            <label
                              key={g.id}
                              className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all",
                                selectedGroupIds.has(g.id)
                                  ? "bg-white shadow-sm border border-stone-200"
                                  : "hover:bg-white/60"
                              )}
                            >
                              <input
                                type="checkbox"
                                checked={selectedGroupIds.has(g.id)}
                                onChange={() => toggleGroup(g.id)}
                                className="size-4 rounded border-stone-300 text-[#0E4268] focus:ring-[#0E4268]/30 focus:ring-offset-0 accent-[#0E4268]"
                              />
                              <div className="relative size-9 shrink-0">
                                <div className="absolute inset-0 bg-stone-100 rounded border border-stone-200 translate-x-0.5 translate-y-0.5" />
                                <div className="absolute inset-0 bg-white rounded border border-stone-200 flex items-center justify-center">
                                  <FileText size={14} className="text-stone-400" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-stone-800 truncate">
                                  {g.title}
                                </p>
                                <p className="text-[10px] text-stone-400">
                                  {displayTag} &middot; {activeFiles.length} page
                                  {activeFiles.length !== 1 ? "s" : ""}
                                </p>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="px-4 py-8 text-center">
                        <Inbox size={24} className="mx-auto mb-2 text-stone-300" />
                        <p className="text-xs text-stone-400">
                          No other documents available
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {selectedGroupIds.size > 0 && (
                  <p className="text-xs text-stone-500 mt-2">
                    {selectedGroupIds.size} document
                    {selectedGroupIds.size !== 1 ? "s" : ""} selected
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0">
              <label className="text-xs font-medium text-stone-600 mb-2 block">
                Arrange Document Order{" "}
                <span className="text-stone-400 font-normal">(drag to reorder)</span>
              </label>
              <div className="border border-stone-200 rounded-xl flex-1 overflow-hidden bg-stone-50/30">
                <div className="max-h-[340px] overflow-y-auto p-2 space-y-1.5">
                  {orderedGroups.map((g, index) => (
                    <DraggableMergeDocumentItem
                      key={g.id}
                      group={g}
                      index={index}
                      moveFile={moveFile}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-stone-500 mt-2">
                {orderedGroups.length} document
                {orderedGroups.length !== 1 ? "s" : ""} will be added in this
                order
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between">
          {step === 2 ? (
            <button
              onClick={handleBack}
              className="px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <ChevronLeft size={16} />
              Back
            </button>
          ) : (
            <div />
          )}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            {step === 1 ? (
              <button
                onClick={handleNextStep}
                disabled={!canProceed}
                className="px-4 py-2 text-sm font-medium text-white bg-[#0E4268] hover:bg-[#0E4268]/90 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
              >
                Continue
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-[#0E4268] hover:bg-[#0E4268]/90 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <FilePlus size={16} />
                Add to Document
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ============================================================================
// MERGE DOCUMENTS MODAL - Combine individual files into "Other Documents"
// ============================================================================
const MergeDocumentsModal = ({
  groups,
  onClose,
  onMerge,
}: {
  groups: DocumentGroup[];
  onClose: () => void;
  onMerge: (name: string, orderedFileIds: string[]) => void;
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [selectedGroupIds, setSelectedGroupIds] = useState<Set<string>>(new Set());
  const [orderedGroups, setOrderedGroups] = useState<DocumentGroup[]>([]);

  // Collect available logical documents (groups with active files, excluding unclassified)
  const availableGroups = groups.filter(
    (g) => g.id !== "unclassified" && g.files.filter((f) => !f.isRemoved).length > 0
  );

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Toggle a group's selection
  const toggleGroup = (groupId: string) => {
    setSelectedGroupIds((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  // Select all / Deselect all
  const toggleSelectAll = () => {
    if (selectedGroupIds.size === availableGroups.length) {
      setSelectedGroupIds(new Set());
    } else {
      setSelectedGroupIds(new Set(availableGroups.map((g) => g.id)));
    }
  };

  // When moving to step 2, collect selected groups
  const handleNextStep = () => {
    const selected = availableGroups.filter((g) => selectedGroupIds.has(g.id));
    setOrderedGroups(selected);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const moveFile = (dragIndex: number, hoverIndex: number) => {
    const newGroups = [...orderedGroups];
    const [draggedItem] = newGroups.splice(dragIndex, 1);
    newGroups.splice(hoverIndex, 0, draggedItem);
    setOrderedGroups(newGroups);
  };

  const handleMerge = () => {
    if (name.trim() && orderedGroups.length > 0) {
      // Collect all file IDs from selected groups in order
      const allFileIds = orderedGroups.flatMap((g) =>
        g.files.filter((f) => !f.isRemoved).map((f) => f.id)
      );
      onMerge(name.trim(), allFileIds);
      onClose();
    }
  };

  const canProceed = name.trim() && selectedGroupIds.size >= 2;
  const allSelected = availableGroups.length > 0 && selectedGroupIds.size === availableGroups.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 8 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className="relative bg-white rounded-2xl shadow-2xl w-[560px] max-h-[85vh] flex flex-col overflow-hidden"
      >
        {/* Header with integrated step indicator */}
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-gradient-to-br from-stone-100 to-stone-50 flex items-center justify-center shadow-sm">
                <Layers size={18} className="text-stone-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-stone-900">Combine Documents</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Create a new document from existing files
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors -mr-1 -mt-1"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modern step indicator - subtle progress bar style */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 flex-1">
              <div
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors duration-300",
                  step >= 1 ? "bg-[#0E4268]" : "bg-stone-200"
                )}
              />
              <div
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors duration-300",
                  step >= 2 ? "bg-[#0E4268]" : "bg-stone-200"
                )}
              />
            </div>
            <span className="text-[10px] font-medium text-stone-400 tabular-nums">
              {step}/2
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 pb-5 flex-1 overflow-hidden flex flex-col">
          {step === 1 ? (
            <div className="space-y-4 flex-1 flex flex-col">
              {/* Name input */}
              <div>
                <label className="text-xs font-medium text-stone-600 mb-1.5 block">
                  Document Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Supporting Evidence, Travel History..."
                  className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:border-stone-400 focus:ring-2 focus:ring-stone-100 outline-none transition-all bg-stone-50/50"
                  autoFocus
                />
              </div>

              {/* Logical document selection list */}
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-stone-600">
                    Select Documents <span className="text-stone-400 font-normal">(2 or more)</span>
                  </label>
                  {availableGroups.length > 0 && (
                    <button
                      onClick={toggleSelectAll}
                      className="text-[10px] font-medium text-stone-500 hover:text-stone-700 transition-colors cursor-pointer"
                    >
                      {allSelected ? "Deselect all" : "Select all"}
                    </button>
                  )}
                </div>
                <div className="border border-stone-200 rounded-xl flex-1 overflow-hidden bg-stone-50/30">
                  <div className="max-h-[280px] overflow-y-auto">
                    {availableGroups.length > 0 ? (
                      <div className="p-1.5 space-y-0.5">
                        {availableGroups.map((group) => {
                          const activeFiles = group.files.filter((f) => !f.isRemoved);
                          const displayTag = group.tag.split("-").map((w) => w.toUpperCase()).join(" ");
                          return (
                            <label
                              key={group.id}
                              className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all",
                                selectedGroupIds.has(group.id)
                                  ? "bg-white shadow-sm border border-stone-200"
                                  : "hover:bg-white/60"
                              )}
                            >
                              <input
                                type="checkbox"
                                checked={selectedGroupIds.has(group.id)}
                                onChange={() => toggleGroup(group.id)}
                                className="size-4 rounded border-stone-300 text-[#0E4268] focus:ring-[#0E4268]/30 focus:ring-offset-0 accent-[#0E4268]"
                              />
                              <div className="relative size-9 shrink-0">
                                <div className="absolute inset-0 bg-stone-100 rounded border border-stone-200 translate-x-0.5 translate-y-0.5" />
                                <div className="absolute inset-0 bg-white rounded border border-stone-200 flex items-center justify-center">
                                  <FileText size={14} className="text-stone-400" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-stone-800 truncate">{group.title}</p>
                                <p className="text-[10px] text-stone-400">
                                  {displayTag} &middot; {activeFiles.length} page{activeFiles.length !== 1 ? "s" : ""}
                                </p>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="px-4 py-8 text-center">
                        <Inbox size={24} className="mx-auto mb-2 text-stone-300" />
                        <p className="text-xs text-stone-400">No documents available</p>
                      </div>
                    )}
                  </div>
                </div>
                {selectedGroupIds.size > 0 && (
                  <p className="text-xs text-stone-500 mt-2">
                    {selectedGroupIds.size} document{selectedGroupIds.size !== 1 ? "s" : ""} selected
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* Step 2: Reorder documents */
            <div className="flex-1 flex flex-col min-h-0">
              <label className="text-xs font-medium text-stone-600 mb-2 block">
                Arrange Document Order <span className="text-stone-400 font-normal">(drag to reorder)</span>
              </label>
              <div className="border border-stone-200 rounded-xl flex-1 overflow-hidden bg-stone-50/30">
                <div className="max-h-[340px] overflow-y-auto p-2 space-y-1.5">
                  {orderedGroups.map((group, index) => (
                    <DraggableMergeDocumentItem
                      key={group.id}
                      group={group}
                      index={index}
                      moveFile={moveFile}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-stone-500 mt-2">
                {orderedGroups.length} document{orderedGroups.length !== 1 ? "s" : ""} will be combined in this order
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between">
          {step === 2 ? (
            <button
              onClick={handleBack}
              className="px-3 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <ChevronLeft size={16} />
              Back
            </button>
          ) : (
            <div />
          )}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            {step === 1 ? (
              <button
                onClick={handleNextStep}
                disabled={!canProceed}
                className="px-4 py-2 text-sm font-medium text-white bg-[#0E4268] hover:bg-[#0E4268]/90 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
              >
                Continue
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleMerge}
                className="px-4 py-2 text-sm font-medium text-white bg-[#0E4268] hover:bg-[#0E4268]/90 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Layers size={16} />
                Combine
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ============================================================================
// COMBINE FROM SELECTION MODAL - For multi-select combine workflow
// ============================================================================
const CombineFromSelectionModal = ({
  selectedGroups,
  onClose,
  onCombine,
}: {
  selectedGroups: DocumentGroup[];
  onClose: () => void;
  onCombine: (name: string, orderedFileIds: string[]) => void;
}) => {
  const [name, setName] = useState("");
  const [orderedDocs, setOrderedDocs] = useState<DocumentGroup[]>([]);

  // Initialize ordered documents from selected groups
  useEffect(() => {
    setOrderedDocs([...selectedGroups]);
  }, [selectedGroups]);

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const moveFile = (dragIndex: number, hoverIndex: number) => {
    const newDocs = [...orderedDocs];
    const [draggedItem] = newDocs.splice(dragIndex, 1);
    newDocs.splice(hoverIndex, 0, draggedItem);
    setOrderedDocs(newDocs);
  };

  const handleCombine = () => {
    if (name.trim() && orderedDocs.length > 0) {
      // Collect all file IDs from ordered groups
      const allFileIds = orderedDocs.flatMap((g) =>
        g.files.filter((f) => !f.isRemoved).map((f) => f.id)
      );
      onCombine(name.trim(), allFileIds);
    }
  };

  const canCombine = name.trim() && orderedDocs.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.15 }}
        className="relative bg-white rounded-xl shadow-2xl w-[460px] overflow-hidden"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-stone-100 flex items-center justify-center">
              <Layers size={16} className="text-stone-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-800">Combine Documents</h3>
              <p className="text-[10px] text-stone-500">
                {selectedGroups.length} document{selectedGroups.length !== 1 ? "s" : ""} selected
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Name input */}
          <div>
            <label className="text-xs font-medium text-stone-600 mb-1.5 block">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Supporting Evidence, Travel History..."
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:border-stone-400 focus:ring-2 focus:ring-stone-100 outline-none transition-all"
              autoFocus
            />
          </div>

          {/* Document reorder list */}
          <div>
            <label className="text-xs font-medium text-stone-600 mb-1.5 block">
              Document Order <span className="text-stone-400">(drag to reorder)</span>
            </label>
            <div className="border border-stone-200 rounded-lg max-h-72 overflow-y-auto">
              <div className="p-2 space-y-1.5">
                {orderedDocs.map((group, index) => (
                  <DraggableMergeDocumentItem
                    key={group.id}
                    group={group}
                    index={index}
                    moveFile={moveFile}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-stone-500 mt-2">
              {orderedDocs.length} document{orderedDocs.length !== 1 ? "s" : ""} will be combined
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-stone-100 bg-stone-50 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCombine}
            disabled={!canCombine}
            className="px-4 py-1.5 text-sm font-medium text-white bg-[#0E4268] hover:bg-[#0E4268]/90 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
          >
            <Layers size={14} />
            Combine
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ============================================================================
// ADD CATEGORY CARD
// ============================================================================
const AddCategoryCard = ({
  onAdd,
  existingGroups,
  onMergeDocuments,
}: {
  onAdd: (name: string) => void;
  existingGroups: DocumentGroup[];
  onMergeDocuments: () => void;
}) => {
  const [isFileDragOver, setIsFileDragOver] = useState(false);
  const [droppedFileCount, setDroppedFileCount] = useState(0);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [dropSearch, setDropSearch] = useState("");
  const cardRef = useRef<HTMLDivElement | null>(null);

  const uploadToGroup = useCaseDetailStore((state) => state.uploadToGroup);
  const moveFileToGroup = useCaseDetailStore((state) => state.moveFileToGroup);
  const documentGroups = useCaseDetailStore((state) => state.documentGroups);

  // Track if we're receiving an internal page drag (from react-dnd)
  const [pendingPageMove, setPendingPageMove] = useState<string | null>(null);

  // react-dnd drop handler for internal page drags
  const [{ isOver: isInternalDragOver }, drop] = useDrop<
    { id: string; groupId: string },
    void,
    { isOver: boolean }
  >(
    () => ({
      accept: ItemTypes.PAGE,
      drop: (item) => {
        // Store the file id, show category picker to choose destination
        setPendingPageMove(item.id);
        setShowCategoryPicker(true);
      },
      collect: (monitor) => ({ isOver: monitor.isOver() }),
    }),
    [moveFileToGroup],
  );

  const handleAddCategory = (baseName: string) => {
    const uniqueName = generateUniqueName(baseName, existingGroups);
    onAdd(uniqueName);
  };

  const handleAddCategoryWithFiles = (baseName: string) => {
    const uniqueName = generateUniqueName(baseName, existingGroups);
    onAdd(uniqueName);
    // After adding category, either upload files or move page
    // Use setTimeout to let state update first, then find the new group
    setTimeout(() => {
      // Find the newly created group by title
      const newGroup = useCaseDetailStore
        .getState()
        .documentGroups.find((g) => g.title === uniqueName);
      if (newGroup) {
        if (pendingPageMove) {
          // Move existing page to new category
          moveFileToGroup(pendingPageMove, newGroup.id);
          setPendingPageMove(null);
        } else if (droppedFileCount > 0) {
          // Upload new files to category
          uploadToGroup(newGroup.id, droppedFileCount);
          setDroppedFileCount(0);
        }
      }
      setShowCategoryPicker(false);
    }, 50);
  };

  // Handle native file drag and drop (only for files from OS, not react-dnd)
  const handleNativeDragOver = (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes("Files")) {
      e.preventDefault();
      setIsFileDragOver(true);
    }
  };

  const handleNativeDragLeave = (e: React.DragEvent) => {
    if (!isFileDragOver) return;

    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      const { clientX, clientY } = e;
      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        setIsFileDragOver(false);
      }
    }
  };

  const handleNativeDrop = (e: React.DragEvent) => {
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      e.preventDefault();
      setIsFileDragOver(false);
      setDroppedFileCount(files.length);
      setShowCategoryPicker(true);
    }
  };

  // Combine refs for both react-dnd and native drag
  const setRefs = (el: HTMLDivElement | null) => {
    cardRef.current = el;
    drop(el);
  };

  const isDragOver = isFileDragOver || isInternalDragOver;

  return (
    <>
      <div
        ref={setRefs}
        onDragOver={handleNativeDragOver}
        onDragLeave={handleNativeDragLeave}
        onDrop={handleNativeDrop}
        className="relative"
      >
        <CreateDocumentCategoryPopover
          onSelect={handleAddCategory}
          onMergeDocuments={onMergeDocuments}
        >
          <button
            className={cn(
              "w-full h-full bg-white rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer group",
              isDragOver
                ? "border-[#0E4268] bg-[#0E4268]/5 scale-[1.02]"
                : "border-stone-200 hover:border-stone-300 hover:bg-stone-50/50",
            )}
          >
            {isDragOver ? (
              <>
                <div className="size-8 rounded-xl bg-[#0E4268]/10 flex items-center justify-center">
                  <FilePlus size={16} className="text-[#0E4268]" />
                </div>
                <span className="text-xs font-medium text-[#0E4268]">
                  Drop to create category
                </span>
              </>
            ) : (
              <>
                <div className="size-8 rounded-xl bg-stone-100 group-hover:bg-stone-200 flex items-center justify-center transition-colors">
                  <Plus size={16} className="text-stone-400" />
                </div>
                <span className="text-xs font-medium text-stone-500">
                  New Category
                </span>
              </>
            )}
          </button>
        </CreateDocumentCategoryPopover>
      </div>

      {/* Category picker dialog after file drop */}
      <AnimatePresence>
        {showCategoryPicker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="bg-white rounded-xl border border-stone-200 shadow-xl w-72"
            >
              <div className="flex items-center justify-between px-4 pt-4 pb-2">
                <h3 className="text-sm font-semibold text-stone-800">
                  Select Category
                </h3>
                <button
                  onClick={() => {
                    setShowCategoryPicker(false);
                    setDroppedFileCount(0);
                    setPendingPageMove(null);
                    setDropSearch("");
                  }}
                  className="p-1 text-stone-400 hover:text-stone-600 rounded transition-colors"
                  aria-label="Close"
                >
                  <X size={14} />
                </button>
              </div>
              <p className="text-xs text-stone-500 px-4 pb-2">
                {pendingPageMove
                  ? "Page will be moved to the new category"
                  : `${droppedFileCount} file${droppedFileCount > 1 ? "s" : ""} will be added to the new category`}
              </p>
              <Command shouldFilter={true}>
                <CommandInput
                  placeholder="Type a name or pick below..."
                  value={dropSearch}
                  onValueChange={setDropSearch}
                />
                <CommandList className="max-h-[320px]">
                  <CommandEmpty className="py-3 text-center text-xs text-stone-500">
                    No matching categories
                  </CommandEmpty>

                  {/* Custom name create action */}
                  {dropSearch.trim().length > 0 && !DOCUMENT_CATEGORY_SUGGESTIONS.some(
                    (s) => s.name.toLowerCase() === dropSearch.trim().toLowerCase(),
                  ) && (
                    <>
                      <CommandGroup>
                        <CommandItem
                          value={`__create__${dropSearch.trim()}`}
                          onSelect={() => {
                            handleAddCategoryWithFiles(dropSearch.trim());
                            setDropSearch("");
                          }}
                          className="text-sm font-medium text-[#0E4268]"
                        >
                          <Plus size={14} className="mr-2 text-[#0E4268]" />
                          Create &ldquo;{dropSearch.trim()}&rdquo;
                        </CommandItem>
                      </CommandGroup>
                      <CommandSeparator />
                    </>
                  )}

                  {/* Grouped suggestions */}
                  {DOCUMENT_CATEGORY_GROUPS.map((group) => (
                    <CommandGroup
                      key={group}
                      heading={group}
                      className="[&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-stone-400 [&_[cmdk-group-heading]]:font-medium"
                    >
                      {DOCUMENT_CATEGORY_SUGGESTIONS.filter((s) => s.group === group).map((item) => (
                        <CommandItem
                          key={item.name}
                          value={item.name}
                          onSelect={() => {
                            handleAddCategoryWithFiles(item.name);
                            setDropSearch("");
                          }}
                          className="text-sm"
                        >
                          {item.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ))}
                </CommandList>
              </Command>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

// ============================================================================
// EMPTY STATE - Minimal modern design with clear action
// ============================================================================
const EmptyState = ({ onUpload }: { onUpload: () => void }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    if (e.dataTransfer.types.includes("Files")) {
      e.preventDefault();
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const { clientX, clientY } = e;
      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        setIsDragOver(false);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      onUpload();
    }
  };

  return (
    <div
      ref={containerRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="flex-1 flex items-center justify-center p-8"
    >
      <div className="flex flex-col items-center max-w-sm text-center">
        {/* Minimal icon */}
        <div
          className={cn(
            "size-12 rounded-xl flex items-center justify-center mb-4 transition-colors",
            isDragOver ? "bg-[#0E4268]/10" : "bg-stone-200/60",
          )}
        >
          <FolderOpen
            size={24}
            className={cn(
              "transition-colors",
              isDragOver ? "text-[#0E4268]" : "text-stone-400",
            )}
          />
        </div>

        {/* Title */}
        <h3 className="text-sm font-medium text-stone-700 mb-1 text-balance">
          {isDragOver ? "Drop to upload" : "No documents"}
        </h3>

        {/* Subtitle */}
        <p className="text-xs text-stone-400 mb-5 text-pretty">
          Upload files to organize and manage your case documents
        </p>

        {/* Single clear action button */}
        <button
          onClick={onUpload}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
            isDragOver
              ? "bg-[#0E4268] text-white"
              : "bg-[#0E4268] text-white hover:bg-[#0E4268]/90",
          )}
        >
          Upload Files
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// LOADING STATE - Structural skeleton layout
// ============================================================================
const LoadingState = () => {
  return (
    <div className="flex-1 p-4">
      {/* Sidebar skeleton */}
      <div
        className="fixed z-30 w-64 rounded-xl border border-stone-200 bg-white overflow-hidden"
        style={{
          top: "calc(var(--header-height, 104px) + 16px)",
          left: "16px",
          height: "calc(100dvh - var(--header-height, 104px) - 32px)",
        }}
      >
        {/* Sidebar header skeleton */}
        <div className="h-10 px-3 flex items-center justify-between border-b border-stone-100">
          <div className="h-3 w-24 bg-stone-200 rounded animate-pulse" />
          <div className="size-5 bg-stone-100 rounded animate-pulse" />
        </div>
        {/* Sidebar content skeleton */}
        <div className="p-2 space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-2.5 px-2 py-1.5">
              <div className="w-8 aspect-[1/1.414] bg-stone-100 rounded animate-pulse" />
              <div className="flex-1 space-y-1">
                <div className="h-2.5 w-12 bg-stone-100 rounded animate-pulse" />
                <div className="h-2 w-20 bg-stone-50 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category cards skeleton grid */}
      <div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
        style={{ marginLeft: "272px", gridAutoRows: "360px" }}
      >
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-stone-200 overflow-hidden flex flex-col"
          >
            {/* Card header skeleton */}
            <div className="px-3 py-2 border-b border-stone-100">
              <div className="flex items-center justify-between mb-1.5">
                <div className="h-3 w-20 bg-stone-100 rounded animate-pulse" />
                <div className="h-4 w-16 bg-stone-50 rounded animate-pulse" />
              </div>
              <div className="h-2 w-14 bg-stone-50 rounded animate-pulse" />
            </div>
            {/* Card content skeleton - A4 preview */}
            <div className="flex-1 bg-stone-50 flex items-center justify-center p-2">
              <div className="h-full aspect-[1/1.414] bg-white rounded border border-stone-200 p-3">
                <div className="space-y-1.5">
                  <div className="h-1.5 w-1/3 bg-stone-100 rounded animate-pulse" />
                  <div className="h-1 w-full bg-stone-50 rounded animate-pulse mt-2" />
                  <div className="h-1 w-full bg-stone-50 rounded animate-pulse" />
                  <div className="h-1 w-4/5 bg-stone-50 rounded animate-pulse" />
                  <div className="h-1 w-full bg-stone-50 rounded animate-pulse" />
                  <div className="h-1 w-2/3 bg-stone-50 rounded animate-pulse" />
                </div>
              </div>
            </div>
            {/* Card footer skeleton */}
            <div className="px-2 py-1.5 border-t border-stone-100 flex gap-1">
              <div className="h-6 flex-1 bg-stone-50 rounded animate-pulse" />
              <div className="h-6 flex-1 bg-stone-50 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// GROUP DRAG LAYER - Compact custom drag preview for group cards
// ============================================================================
const GroupDragLayer = () => {
  const { itemType, item, isDragging, currentOffset } = useDragLayer((monitor) => ({
    itemType: monitor.getItemType(),
    item: monitor.getItem() as { groupId: string; title: string; pageCount: number; selectedGroupIds?: string[] } | null,
    isDragging: monitor.isDragging(),
    currentOffset: monitor.getSourceClientOffset(),
  }));

  if (!isDragging || itemType !== ItemTypes.GROUP || !currentOffset || !item) return null;

  const isMultiSelect = item.selectedGroupIds && item.selectedGroupIds.length > 1;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <div
        style={{ transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)` }}
        className="inline-flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-xl border border-stone-200 max-w-[200px]"
      >
        <Layers size={14} className="text-[#0E4268] shrink-0" />
        {isMultiSelect ? (
          <span className="text-xs font-semibold text-stone-800 truncate">
            {item.selectedGroupIds!.length} documents
          </span>
        ) : (
          <>
            <span className="text-xs font-semibold text-stone-800 truncate">{item.title}</span>
            <span className="text-[10px] text-stone-400 shrink-0">{item.pageCount}p</span>
          </>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN FILE HUB CONTENT
// ============================================================================
export function FileHubContent() {
  const groups = useDocumentGroups();
  const isLoading = useIsLoadingDocuments();
  const highlightedGroupId = useHighlightedGroupId();
  const uploadDocuments = useCaseDetailStore((state) => state.uploadDocuments);
  const addDocumentGroup = useCaseDetailStore(
    (state) => state.addDocumentGroup,
  );
  const mergeDocumentsIntoGroup = useCaseDetailStore(
    (state) => state.mergeDocumentsIntoGroup,
  );
  const clearHighlightedGroup = useCaseDetailStore(
    (state) => state.clearHighlightedGroup,
  );

  const [reviewGroupId, setReviewGroupId] = useState<string | null>(null);
  const reviewGroup = reviewGroupId ? groups.find((g) => g.id === reviewGroupId) ?? null : null;
  const [previewPage, setPreviewPage] = useState<{
    file: DocumentFile;
    index: number;
  } | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // Collapsed by default
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [selectedGroupIds, setSelectedGroupIds] = useState<Set<string>>(new Set());
  const [showCombineModal, setShowCombineModal] = useState(false);

  // Toggle group selection
  const toggleGroupSelection = (groupId: string) => {
    setSelectedGroupIds((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedGroupIds(new Set());
  };

  // Get all files from selected groups for combine modal
  const getSelectedGroupsFiles = () => {
    const files: { file: DocumentFile; groupTitle: string }[] = [];
    for (const groupId of selectedGroupIds) {
      const group = groups.find((g) => g.id === groupId);
      if (group) {
        for (const file of group.files.filter((f) => !f.isRemoved)) {
          files.push({ file, groupTitle: group.title });
        }
      }
    }
    return files;
  };

  const classifiedGroups = groups.filter((g) => g.id !== "unclassified");
  // Use the new 1:N model selector: unclassified = files with containerIds.length === 0
  const unclassifiedFiles = useUnclassifiedFiles();

  if (isLoading) {
    return (
      <div
        className="bg-stone-100 p-4 pb-20"
        style={{ minHeight: "calc(100% + 60px)" }}
      >
        <LoadingState />
      </div>
    );
  }

  const hasAnyFiles = groups.some((g) => (g.files?.length ?? 0) > 0) || unclassifiedFiles.length > 0;

  if (!hasAnyFiles && classifiedGroups.length === 0) {
    return (
      <div
        className="bg-stone-100 flex flex-col"
        style={{ height: "calc(100dvh - var(--header-height, 104px))" }}
      >
        <EmptyState onUpload={uploadDocuments} />
      </div>
    );
  }

  // Calculate sidebar width for content margin
  const sidebarWidth = sidebarCollapsed ? 44 : 256; // collapsed icon (44px) or full width (w-64 = 256px)

  return (
    <div
      className="bg-stone-100 p-4 pb-20"
      style={{ minHeight: "calc(100% + 60px)" }}
    >
      {/* Left Sidebar - Fixed position */}
      <Sidebar
        unclassifiedFiles={unclassifiedFiles}
        allGroups={groups}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onPreviewPage={(file, index) => setPreviewPage({ file, index })}
      />

      {/* Main Content - Category Grid with dynamic left margin */}
      <div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 transition-[margin] duration-200 ease-out"
        style={{ marginLeft: `${sidebarWidth + 16}px`, gridAutoRows: "360px" }}
      >
        {classifiedGroups.map((group) => (
          <CategoryCard
            key={group.id}
            group={group}
            allGroups={groups}
            unclassifiedFiles={unclassifiedFiles}
            onReview={() => setReviewGroupId(group.id)}
            isHighlighted={highlightedGroupId === group.id}
            onHighlightComplete={clearHighlightedGroup}
            isSelected={selectedGroupIds.has(group.id)}
            onToggleSelect={() => toggleGroupSelection(group.id)}
            isSelectMode={selectedGroupIds.size > 0}
            selectedGroupIds={selectedGroupIds}
            onMergeComplete={clearSelection}
          />
        ))}

        <AddCategoryCard
          onAdd={addDocumentGroup}
          existingGroups={classifiedGroups}
          onMergeDocuments={() => setShowMergeModal(true)}
        />
      </div>

      {/* Custom drag preview for group cards */}
      <GroupDragLayer />

      <AnimatePresence>
        {reviewGroup && (
          <CategoryReviewModal
            group={reviewGroup}
            allGroups={groups}
            onClose={() => setReviewGroupId(null)}
          />
        )}
      </AnimatePresence>

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

      {/* Combine Documents Modal */}
      <AnimatePresence>
        {showMergeModal && (
          <MergeDocumentsModal
            groups={groups}
            onClose={() => setShowMergeModal(false)}
            onMerge={(name, orderedFileIds) => {
              mergeDocumentsIntoGroup(name, orderedFileIds);
              toast.success("Documents combined", {
                description: `Created "${name}" with ${orderedFileIds.length} page${orderedFileIds.length !== 1 ? "s" : ""}.`,
              });
            }}
          />
        )}
      </AnimatePresence>

      {/* Combine from Selection Modal */}
      <AnimatePresence>
        {showCombineModal && (
          <CombineFromSelectionModal
            selectedGroups={Array.from(selectedGroupIds)
              .map((id) => groups.find((g) => g.id === id))
              .filter((g): g is DocumentGroup => g !== undefined)}
            onClose={() => setShowCombineModal(false)}
            onCombine={(name, orderedFileIds) => {
              mergeDocumentsIntoGroup(name, orderedFileIds);
              clearSelection();
              setShowCombineModal(false);
              toast.success("Documents combined", {
                description: `Created "${name}" with ${orderedFileIds.length} page${orderedFileIds.length !== 1 ? "s" : ""}.`,
              });
            }}
          />
        )}
      </AnimatePresence>

      {/* Floating Action Bar - shown when items are selected */}
      <AnimatePresence>
        {selectedGroupIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.15 }}
            className="fixed bottom-6 left-0 right-0 z-40 flex justify-center pointer-events-none"
          >
            <div className="bg-white border border-stone-200 rounded-xl shadow-lg px-5 py-2.5 flex items-center gap-4 pointer-events-auto">
              <span className="text-sm font-medium text-stone-700">
                {selectedGroupIds.size} document{selectedGroupIds.size !== 1 ? "s" : ""} selected
              </span>
              <div className="h-4 w-px bg-stone-200" />
              <button
                onClick={clearSelection}
                className="text-sm text-stone-500 hover:text-stone-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCombineModal(true)}
                className="px-3 py-1.5 text-sm font-medium bg-[#0E4268] text-white rounded-lg hover:bg-[#0E4268]/90 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Layers size={14} />
                Combine
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
