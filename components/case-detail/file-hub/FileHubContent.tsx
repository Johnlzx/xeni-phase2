"use client";

import React, { useState, useRef, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
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
  Cloud,
  Copy,
  Link2,
  Layers,
  Package,
  ChevronUp,
  GripVertical,
  Unlink,
} from "lucide-react";

// ============================================================================
// CLOUD PROVIDER ICONS - Monochrome gray, colorful on hover
// ============================================================================
const GoogleDriveIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M7.71 3.5L1.15 15l3.43 5.97L11.14 9.5 7.71 3.5zm1.14 0l6.86 12H22.3l-3.43-6-9.72-6H8.85zM8 14.5l-3.43 6h13.72l3.43-6H8z" />
  </svg>
);

const DropboxIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M6 2l6 3.75L6 9.5 0 5.75 6 2zm12 0l6 3.75-6 3.75-6-3.75L18 2zM0 13.25L6 9.5l6 3.75L6 17 0 13.25zm18-3.75l6 3.75L18 17l-6-3.75 6-3.75zM6 18.25l6-3.75 6 3.75-6 3.75-6-3.75z" />
  </svg>
);

const OneDriveIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M19.35 10.04A7.49 7.49 0 0012 4a7.48 7.48 0 00-6.64 4.05A5.998 5.998 0 006 20h13a5 5 0 00.35-9.96z" />
  </svg>
);

// Cloud provider configurations
const CLOUD_PROVIDERS = [
  {
    id: "google-drive",
    name: "Google Drive",
    Icon: GoogleDriveIcon,
    hoverColor: "hover:text-[#4285F4]",
    activeColor: "text-[#4285F4]",
  },
  {
    id: "dropbox",
    name: "Dropbox",
    Icon: DropboxIcon,
    hoverColor: "hover:text-[#0061FF]",
    activeColor: "text-[#0061FF]",
  },
  {
    id: "onedrive",
    name: "OneDrive",
    Icon: OneDriveIcon,
    hoverColor: "hover:text-[#0078D4]",
    activeColor: "text-[#0078D4]",
  },
] as const;

type CloudProviderId = (typeof CLOUD_PROVIDERS)[number]["id"];
import { cn } from "@/lib/utils";
import {
  useCaseDetailStore,
  useDocumentGroups,
  useIsLoadingDocuments,
  useHighlightedGroupId,
  useDocumentBundles,
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
import { CategoryReviewModal } from "../shared";

// ============================================================================
// REALISTIC DOCUMENT PREVIEW - Simulates scanned document appearance
// ============================================================================
const DocumentPreviewContent = ({
  size = "sm",
}: {
  size?: "sm" | "md" | "lg";
}) => {
  const lineHeight = size === "sm" ? "h-0.5" : size === "md" ? "h-1" : "h-1.5";
  const spacing =
    size === "sm" ? "space-y-0.5" : size === "md" ? "space-y-1" : "space-y-2";
  const marginTop = size === "sm" ? "mt-1" : size === "md" ? "mt-2" : "mt-4";

  return (
    <div className={spacing}>
      <div className={cn(lineHeight, "bg-stone-300 rounded w-1/3")} />
      <div
        className={cn(lineHeight, "bg-stone-200 rounded w-1/4", marginTop)}
      />
      <div
        className={cn(lineHeight, "bg-stone-200 rounded w-full", marginTop)}
      />
      <div className={cn(lineHeight, "bg-stone-200 rounded w-full")} />
      <div className={cn(lineHeight, "bg-stone-200 rounded w-5/6")} />
      <div className={cn(lineHeight, "bg-stone-200 rounded w-full")} />
      <div className={cn(lineHeight, "bg-stone-200 rounded w-3/4")} />
      <div
        className={cn(lineHeight, "bg-stone-200 rounded w-full", marginTop)}
      />
      <div className={cn(lineHeight, "bg-stone-200 rounded w-4/5")} />
      <div
        className={cn(lineHeight, "bg-stone-300 rounded w-1/4", marginTop)}
      />
    </div>
  );
};
import type { DocumentGroup, DocumentFile, DocumentBundle } from "@/types/case-detail";

const ItemTypes = {
  PAGE: "page",
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

// Cloud import processing stages - distinguishes download vs upload
const CLOUD_IMPORT_STAGES = {
  "google-drive": [
    { key: "connecting", label: "Connecting to Google Drive...", duration: 400 },
    { key: "downloading", label: "Importing from Drive...", duration: 1200 },
    { key: "uploading", label: "Uploading to server...", duration: 800 },
    { key: "splitting", label: "Splitting...", duration: 600 },
    { key: "classifying", label: "Classifying...", duration: 700 },
  ],
  dropbox: [
    { key: "connecting", label: "Connecting to Dropbox...", duration: 400 },
    { key: "downloading", label: "Importing from Dropbox...", duration: 1200 },
    { key: "uploading", label: "Uploading to server...", duration: 800 },
    { key: "splitting", label: "Splitting...", duration: 600 },
    { key: "classifying", label: "Classifying...", duration: 700 },
  ],
  onedrive: [
    { key: "connecting", label: "Connecting to OneDrive...", duration: 400 },
    { key: "downloading", label: "Importing from OneDrive...", duration: 1200 },
    { key: "uploading", label: "Uploading to server...", duration: 800 },
    { key: "splitting", label: "Splitting...", duration: 600 },
    { key: "classifying", label: "Classifying...", duration: 700 },
  ],
} as const;

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
  const [cloudImportProvider, setCloudImportProvider] = useState<CloudProviderId | null>(null);
  const [cloudProcessingLabel, setCloudProcessingLabel] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const moveFileToGroup = useCaseDetailStore((state) => state.moveFileToGroup);
  const uploadAndAutoClassify = useCaseDetailStore((state) => state.uploadAndAutoClassify);

  const isProcessing = processingStage !== null || cloudImportProvider !== null;

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
  };

  // Run cloud import workflow - simulates OAuth popup + file picker + import
  const runCloudImportWorkflow = async (providerId: CloudProviderId) => {
    setCloudImportProvider(providerId);

    // Simulate OAuth popup - in real implementation this would open a popup window
    // and wait for the OAuth callback
    const stages = CLOUD_IMPORT_STAGES[providerId];

    for (let i = 0; i < stages.length; i++) {
      setCloudProcessingLabel(stages[i].label);
      await new Promise((resolve) => setTimeout(resolve, stages[i].duration));
    }

    setCloudImportProvider(null);
    setCloudProcessingLabel(null);

    // Auto-classify imported documents
    const pageCount = Math.floor(Math.random() * 5) + 4; // 4-8 pages from cloud
    uploadAndAutoClassify(pageCount);
  };

  // Handle cloud provider click - prevent event bubbling
  const handleCloudProviderClick = (e: React.MouseEvent, providerId: CloudProviderId) => {
    e.stopPropagation();
    if (!isProcessing) {
      runCloudImportWorkflow(providerId);
    }
  };

  // Drop target for internal page drags
  const [{ isOver: isInternalDragOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.PAGE,
      drop: (item: { id: string; groupId: string }) => {
        if (item.groupId !== "unclassified") {
          moveFileToGroup(item.id, "unclassified");
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

  // Get current processing label - either from local upload or cloud import
  const currentProcessingLabel = cloudProcessingLabel || currentStage?.label;

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

          {/* Upload button */}
          <button
            onClick={() => !isProcessing && runProcessingWorkflow()}
            disabled={isProcessing}
            className={cn(
              "size-11 flex items-center justify-center transition-colors",
              isProcessing
                ? "text-[#0E4268]"
                : "text-stone-400 hover:text-[#0E4268] hover:bg-stone-50",
            )}
            aria-label="Upload files"
          >
            {isProcessing ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Plus size={18} />
            )}
          </button>
        </div>
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

      {/* Upload Zone - Fixed at bottom with cloud import */}
      <div className="shrink-0 p-3 border-t border-stone-100">
        <div
          className={cn(
            "w-full rounded-xl border-2 border-dashed overflow-hidden transition-all",
            isProcessing
              ? "border-[#0E4268]/40 bg-[#0E4268]/5"
              : isAnyDragOver
                ? "border-[#0E4268] bg-[#0E4268]/10 scale-[1.02]"
                : "border-stone-300 hover:border-stone-400",
          )}
        >
          {/* Main upload area - clickable for local files */}
          <button
            onClick={() => !isProcessing && runProcessingWorkflow()}
            disabled={isProcessing}
            className={cn(
              "w-full px-4 py-3 flex flex-col items-center justify-center gap-1.5 transition-colors",
              !isProcessing && "hover:bg-stone-50/80",
            )}
          >
            {isProcessing ? (
              <>
                <Loader2 size={20} className="text-[#0E4268] animate-spin" />
                <span className="text-xs font-medium text-[#0E4268]">
                  {currentProcessingLabel}
                </span>
              </>
            ) : (
              <>
                <FilePlus
                  size={20}
                  className={cn(
                    "transition-colors",
                    isAnyDragOver ? "text-[#0E4268]" : "text-stone-400",
                  )}
                />
                <span
                  className={cn(
                    "text-xs font-medium transition-colors",
                    isAnyDragOver ? "text-[#0E4268]" : "text-stone-500",
                  )}
                >
                  {isAnyDragOver ? "Drop here" : "Upload Files"}
                </span>
                <span className="text-[10px] text-stone-400">Drop or click</span>
              </>
            )}
          </button>

          {/* Cloud import section - only show when not processing */}
          {!isProcessing && (
            <div className="px-3 pb-3">
              {/* Divider with text */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-px bg-stone-200" />
                <span className="text-[9px] text-stone-400 uppercase tracking-wider font-medium">
                  or import from
                </span>
                <div className="flex-1 h-px bg-stone-200" />
              </div>

              {/* Cloud provider icons */}
              <div className="flex items-center justify-center gap-3">
                {CLOUD_PROVIDERS.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={(e) => handleCloudProviderClick(e, provider.id)}
                    className={cn(
                      "group p-2 rounded-lg transition-all",
                      "text-stone-400",
                      provider.hoverColor,
                      "hover:bg-stone-100 hover:scale-110",
                      "active:scale-95",
                    )}
                    title={provider.name}
                    aria-label={`Import from ${provider.name}`}
                  >
                    <provider.Icon className="size-5 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
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

  const linkCount = file.linkedToGroups?.length || 0;

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
                onClick={() => moveFileToGroup(file.id, group.id)}
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
// CATEGORY CARD (A4 ratio, no icon, uppercase type)
// ============================================================================
const CategoryCard = ({
  group,
  allGroups,
  onReview,
  isHighlighted,
  onHighlightComplete,
}: {
  group: DocumentGroup;
  allGroups: DocumentGroup[];
  onReview: () => void;
  isHighlighted?: boolean;
  onHighlightComplete?: () => void;
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isRenamingTitle, setIsRenamingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(group.title);
  const [isFileDragOver, setIsFileDragOver] = useState(false);
  const [showHighlight, setShowHighlight] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

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
  const renameDocumentGroup = useCaseDetailStore(
    (state) => state.renameDocumentGroup,
  );

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
    }
  };

  const handleUpload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const pageCount = Math.floor(Math.random() * 3) + 1;
    uploadToGroup(group.id, pageCount);
  };

  const activeFiles = group.files.filter((f) => !f.isRemoved);
  const totalPages = activeFiles.length;

  // Jump to latest page when new files are added
  const prevTotalPagesRef = useRef(totalPages);
  useEffect(() => {
    if (totalPages > prevTotalPagesRef.current) {
      // New files added, jump to the last page
      setCurrentPageIndex(totalPages - 1);
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
  };

  const handleRenameSubmit = () => {
    if (editedTitle.trim() && editedTitle !== group.title) {
      renameDocumentGroup(group.id, editedTitle.trim());
    } else {
      setEditedTitle(group.title);
    }
    setIsRenamingTitle(false);
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

  // Display type from tag (uppercase with tracking)
  const displayType = group.tag
    .split("-")
    .map((word) => word.toUpperCase())
    .join(" ");

  // Combine refs for both react-dnd and native drag
  const setRefs = (el: HTMLDivElement | null) => {
    cardRef.current = el;
    drop(el);
  };

  return (
    <div
      ref={setRefs}
      className={cn(
        "bg-white rounded-xl border overflow-hidden flex flex-col transition-all cursor-pointer",
        isOver || isFileDragOver
          ? "border-[#0E4268] ring-2 ring-[#0E4268]/20 scale-[1.02]"
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
      {/* Card Header - no icon */}
      <div className="px-3 py-2 border-b border-stone-100 shrink-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2 min-w-0 flex-1">
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
                className="text-xs font-semibold text-stone-800 bg-white border-2 border-[#0E4268] rounded px-1.5 py-0.5 outline-none flex-1 min-w-0 shadow-sm"
                autoFocus
              />
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsRenamingTitle(true);
                }}
                className="group text-xs font-semibold text-stone-800 truncate text-left hover:text-[#0E4268] hover:bg-stone-50 rounded px-1 py-0.5 -mx-1 transition-all flex-1 min-w-0 flex items-center gap-1"
                title="Click to rename"
                aria-label="Rename document"
              >
                <span className="truncate">{group.title}</span>
                <Pencil
                  size={10}
                  className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-[#0E4268]"
                />
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {group.hasChanges && (
              <span
                className="size-1.5 rounded-full bg-blue-500"
                title="Recently updated"
              />
            )}
            {isPending ? (
              <span className="px-2 py-0.5 text-[10px] font-semibold text-amber-700 bg-amber-50 rounded whitespace-nowrap">
                Pending Review
              </span>
            ) : totalPages > 0 ? (
              <span className="px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 rounded flex items-center gap-0.5">
                <Check size={10} strokeWidth={3} />
                Ready
              </span>
            ) : null}
          </div>
        </div>
        {/* File Type Display - uppercase with tracking */}
        <div className="text-[9px] text-stone-400 uppercase tracking-wide font-medium">
          {displayType}
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
            <div className="h-full aspect-[1/1.414] rounded border border-dashed border-stone-200 p-2 relative bg-white flex items-center justify-center">
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
      </div>

      {/* Card Footer */}
      <div className="px-2 py-1.5 border-t border-stone-100 flex items-center gap-1 bg-white shrink-0">
        <button
          onClick={handleUpload}
          className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors flex-1 justify-center"
          aria-label="Add files to category"
        >
          <FilePlus size={11} />
          <span>Add</span>
        </button>

        {/* Confirm / Download - mutually exclusive */}
        {isPending ? (
          <button
            onClick={handleConfirm}
            className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors flex-1 justify-center"
            aria-label="Confirm review"
          >
            <Check size={11} />
            <span>Confirm</span>
          </button>
        ) : (
          <button
            onClick={handleDownload}
            disabled={totalPages === 0}
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-colors flex-1 justify-center",
              totalPages === 0
                ? "text-stone-300 cursor-not-allowed"
                : "text-stone-600 hover:bg-stone-100 hover:text-stone-900",
            )}
            aria-label="Download category"
          >
            <Download size={11} />
            <span>Download</span>
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// DRAGGABLE LINKED DOCUMENT ITEM - For reordering in Combined Evidence
// ============================================================================
const LINKED_DOC_ITEM_TYPE = "LINKED_DOC_ITEM";

const DraggableLinkedDocumentItem = ({
  group,
  index,
  onReviewGroup,
  onUnlink,
  moveDocument,
}: {
  group: DocumentGroup;
  index: number;
  onReviewGroup: (group: DocumentGroup) => void;
  onUnlink: () => void;
  moveDocument: (dragIndex: number, hoverIndex: number) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type: LINKED_DOC_ITEM_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: LINKED_DOC_ITEM_TYPE,
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveDocument(item.index, index);
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
        "flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-stone-50 group transition-all",
        isDragging && "opacity-50 bg-stone-100",
        isOver && "bg-stone-100"
      )}
    >
      {/* Drag handle */}
      <GripVertical
        size={12}
        className="text-stone-300 shrink-0 cursor-grab active:cursor-grabbing"
      />
      <FileText size={14} className="text-stone-400 shrink-0" />
      <button
        onClick={() => onReviewGroup(group)}
        className="flex-1 text-left text-xs font-medium text-stone-700 hover:text-stone-900 truncate"
      >
        {group.title}
      </button>
      <span className="text-[10px] text-stone-400 tabular-nums">
        {group.files.filter((f) => !f.isRemoved).length} pages
      </span>
      <button
        onClick={onUnlink}
        className="p-1 text-stone-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
        title="Unlink"
      >
        <Unlink size={12} />
      </button>
    </div>
  );
};

// ============================================================================
// COMBINED EVIDENCE CARD - Container for grouping multiple logical files
// ============================================================================
const BundleCard = ({
  bundle,
  linkedGroups,
  allGroups,
  onReviewGroup,
  onPreviewCombined,
}: {
  bundle: DocumentBundle;
  linkedGroups: DocumentGroup[];
  allGroups: DocumentGroup[];
  onReviewGroup: (group: DocumentGroup) => void;
  onPreviewCombined?: (bundle: DocumentBundle) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [editedName, setEditedName] = useState(bundle.name);

  const renameDocumentBundle = useCaseDetailStore((state) => state.renameDocumentBundle);
  const deleteDocumentBundle = useCaseDetailStore((state) => state.deleteDocumentBundle);
  const unlinkGroupFromBundle = useCaseDetailStore((state) => state.unlinkGroupFromBundle);
  const linkGroupToBundle = useCaseDetailStore((state) => state.linkGroupToBundle);
  const reorderLinkedDocumentsInBundle = useCaseDetailStore((state) => state.reorderLinkedDocumentsInBundle);

  // Drag-to-reorder handler
  const moveDocument = (dragIndex: number, hoverIndex: number) => {
    const newOrder = [...bundle.linkedGroupIds];
    const [draggedItem] = newOrder.splice(dragIndex, 1);
    newOrder.splice(hoverIndex, 0, draggedItem);
    reorderLinkedDocumentsInBundle(bundle.id, newOrder);
  };

  // Groups that can still be linked (not already in this bundle)
  const availableGroups = allGroups.filter(
    (g) => g.id !== "unclassified" && !bundle.linkedGroupIds.includes(g.id)
  );

  const handleRenameSubmit = () => {
    if (editedName.trim() && editedName !== bundle.name) {
      renameDocumentBundle(bundle.id, editedName.trim());
    } else {
      setEditedName(bundle.name);
    }
    setIsRenaming(false);
  };

  const totalPages = linkedGroups.reduce((acc, g) => acc + g.files.filter(f => !f.isRemoved).length, 0);

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden flex flex-col transition-all shadow-sm hover:shadow-md hover:border-stone-300">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-stone-100 shrink-0">
        <div className="flex items-center gap-2">
          {/* Combined icon */}
          <Layers size={14} className="text-stone-400 shrink-0" />
          <div className="flex-1 min-w-0">
            {isRenaming ? (
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onBlur={handleRenameSubmit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRenameSubmit();
                  if (e.key === "Escape") {
                    setEditedName(bundle.name);
                    setIsRenaming(false);
                  }
                }}
                className="text-xs font-semibold text-stone-800 bg-white border-2 border-stone-400 rounded px-1.5 py-0.5 outline-none w-full shadow-sm"
                autoFocus
              />
            ) : (
              <button
                onClick={() => setIsRenaming(true)}
                className="group text-xs font-semibold text-stone-800 truncate text-left hover:text-stone-600 rounded px-1 py-0.5 -mx-1 transition-all flex items-center gap-1 w-full"
              >
                <span className="truncate">{bundle.name}</span>
                <Pencil
                  size={10}
                  className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-stone-400"
                />
              </button>
            )}
            <p className="text-[10px] font-medium text-stone-500">
              {linkedGroups.length} linked document{linkedGroups.length !== 1 ? "s" : ""} • {totalPages} pages
            </p>
          </div>
        </div>
      </div>

      {/* Stacked preview - shows up to 4 linked groups */}
      {/* Click background for combined preview, click individual thumbnail for that document */}
      <div
        className="flex-1 p-3 relative bg-stone-50/50 min-h-0 flex items-center justify-center cursor-pointer hover:bg-stone-100/50 transition-colors"
        onClick={() => linkedGroups.length > 0 && onPreviewCombined?.(bundle)}
      >
        {linkedGroups.length > 0 ? (
          <div className="flex -space-x-6">
            {linkedGroups.slice(0, 4).map((group, idx) => (
              <button
                key={group.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onReviewGroup(group);
                }}
                className="relative w-20 aspect-[1/1.414] rounded-lg border border-stone-200 bg-white shadow-sm hover:shadow-md hover:z-10 hover:scale-105 transition-all overflow-hidden"
                style={{ zIndex: linkedGroups.length - idx }}
              >
                <div className="w-full h-full p-2">
                  <div className="space-y-1">
                    <div className="h-1 bg-stone-300 rounded w-1/3" />
                    <div className="h-0.5 bg-stone-200 rounded w-full mt-1" />
                    <div className="h-0.5 bg-stone-200 rounded w-4/5" />
                    <div className="h-0.5 bg-stone-200 rounded w-full" />
                    <div className="h-0.5 bg-stone-200 rounded w-2/3" />
                    <div className="h-0.5 bg-stone-200 rounded w-full" />
                    <div className="h-0.5 bg-stone-200 rounded w-3/4" />
                  </div>
                </div>
                <div className="absolute bottom-0 inset-x-0 px-1.5 py-1 bg-gradient-to-t from-stone-900/70 to-transparent">
                  <p className="text-[8px] font-medium text-white truncate text-center">
                    {group.title}
                  </p>
                </div>
              </button>
            ))}
            {linkedGroups.length > 4 && (
              <div className="w-20 aspect-[1/1.414] rounded-lg border-2 border-dashed border-stone-300 bg-stone-50 flex items-center justify-center">
                <span className="text-sm font-bold text-stone-500">
                  +{linkedGroups.length - 4}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <Layers size={20} className="mx-auto mb-1 text-stone-300" />
            <p className="text-[10px] text-stone-400">No linked documents</p>
          </div>
        )}
      </div>

      {/* Expand/collapse button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 py-2 border-t border-stone-100 flex items-center justify-center gap-1 text-[10px] font-medium text-stone-500 hover:bg-stone-50 transition-colors"
      >
        {isExpanded ? "Hide details" : "View linked documents"}
        {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>

      {/* Expanded view - linked groups list */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-stone-100 bg-white"
          >
            <div className="p-2 space-y-1 max-h-48 overflow-y-auto">
              {linkedGroups.map((group, index) => (
                <DraggableLinkedDocumentItem
                  key={group.id}
                  group={group}
                  index={index}
                  onReviewGroup={onReviewGroup}
                  onUnlink={() => unlinkGroupFromBundle(group.id, bundle.id)}
                  moveDocument={moveDocument}
                />
              ))}

              {/* Add more groups dropdown */}
              {availableGroups.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-full flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg border border-dashed border-stone-300 text-[10px] font-medium text-stone-500 hover:border-stone-400 hover:text-stone-600 transition-colors">
                      <Plus size={12} />
                      Link another document
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-48">
                    <DropdownMenuLabel className="text-xs">Available Documents</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {availableGroups.map((group) => (
                      <DropdownMenuItem
                        key={group.id}
                        onClick={() => linkGroupToBundle(group.id, bundle.id)}
                      >
                        <FileText size={14} className="mr-2 text-stone-400" />
                        {group.title}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Delete button - only enabled when no linked documents */}
              <button
                onClick={() => linkedGroups.length === 0 && deleteDocumentBundle(bundle.id)}
                disabled={linkedGroups.length > 0}
                className={cn(
                  "w-full flex items-center justify-center gap-1 px-2 py-1.5 mt-2 text-[10px] font-medium rounded-lg transition-colors",
                  linkedGroups.length > 0
                    ? "text-stone-300 cursor-not-allowed"
                    : "text-red-500 hover:bg-red-50"
                )}
                title={linkedGroups.length > 0 ? "Unlink all documents before deleting" : "Delete this combined evidence"}
              >
                <Trash2 size={12} />
                Delete
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// CREATE COMBINED EVIDENCE MODAL
// ============================================================================
const CreateBundleModal = ({
  groups,
  onClose,
  onCreate,
}: {
  groups: DocumentGroup[];
  onClose: () => void;
  onCreate: (name: string, linkedGroupIds: string[]) => void;
}) => {
  const [name, setName] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  const availableGroups = groups.filter((g) => g.id !== "unclassified");

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = () => {
    if (name.trim() && selectedGroups.length >= 2) {
      onCreate(name.trim(), selectedGroups);
      onClose();
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
        className="relative bg-white rounded-xl shadow-2xl w-[380px] overflow-hidden"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-stone-100 flex items-center justify-center">
              <Layers size={16} className="text-stone-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-800">Create Combined Evidence</h3>
              <p className="text-[10px] text-stone-500">Group related documents together</p>
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
              placeholder="e.g., Financial Documents, Supporting Evidence..."
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:border-stone-400 focus:ring-2 focus:ring-stone-100 outline-none transition-all"
              autoFocus
            />
          </div>

          {/* Group selection */}
          <div>
            <label className="text-xs font-medium text-stone-600 mb-1.5 block">
              Link Documents <span className="text-stone-400">(select 2 or more)</span>
            </label>
            <div className="border border-stone-200 rounded-lg max-h-48 overflow-y-auto">
              {availableGroups.length > 0 ? (
                availableGroups.map((group) => (
                  <label
                    key={group.id}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-stone-50 cursor-pointer border-b border-stone-100 last:border-0 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedGroups.includes(group.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedGroups([...selectedGroups, group.id]);
                        } else {
                          setSelectedGroups(selectedGroups.filter((id) => id !== group.id));
                        }
                      }}
                      className="size-4 rounded border-stone-300 text-stone-600 focus:ring-stone-500"
                    />
                    <FileText size={14} className="text-stone-400 shrink-0" />
                    <span className="text-sm text-stone-700 flex-1 truncate">{group.title}</span>
                    <span className="text-xs text-stone-400 tabular-nums">
                      {group.files.filter((f) => !f.isRemoved).length} pages
                    </span>
                  </label>
                ))
              ) : (
                <div className="px-3 py-4 text-center">
                  <p className="text-xs text-stone-400">No documents available to link</p>
                </div>
              )}
            </div>
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
            onClick={handleSubmit}
            disabled={!name.trim() || selectedGroups.length < 2}
            className="px-4 py-1.5 text-sm font-medium text-white bg-stone-800 hover:bg-stone-900 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
          >
            <Layers size={14} />
            Create
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
  onCreateBundle,
}: {
  onAdd: (name: string) => void;
  existingGroups: DocumentGroup[];
  onCreateBundle: () => void;
}) => {
  const [isFileDragOver, setIsFileDragOver] = useState(false);
  const [droppedFileCount, setDroppedFileCount] = useState(0);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
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
                    Add Category
                  </span>
                </>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-48">
            <DropdownMenuLabel>Add Category</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleAddCategory("Passport")}>
              Passport
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleAddCategory("Bank Statement")}
            >
              Bank Statement
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddCategory("Utility Bill")}>
              Utility Bill
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleAddCategory("Employment Letter")}
            >
              Employment Letter
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleAddCategory("Other Documents")}
            >
              Other Documents
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onCreateBundle}>
              <Layers size={14} className="mr-2 text-stone-400" />
              Create Combined Evidence
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
              className="bg-white rounded-xl shadow-xl p-4 w-64"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-stone-800">
                  Select Category
                </h3>
                <button
                  onClick={() => {
                    setShowCategoryPicker(false);
                    setDroppedFileCount(0);
                    setPendingPageMove(null);
                  }}
                  className="p-1 text-stone-400 hover:text-stone-600 rounded transition-colors"
                  aria-label="Close"
                >
                  <X size={14} />
                </button>
              </div>
              <p className="text-xs text-stone-500 mb-3">
                {pendingPageMove
                  ? "Page will be moved to the new category"
                  : `${droppedFileCount} file${droppedFileCount > 1 ? "s" : ""} will be added to the new category`}
              </p>
              <div className="space-y-1">
                {[
                  "Passport",
                  "Bank Statement",
                  "Utility Bill",
                  "Employment Letter",
                  "Other Documents",
                ].map((category) => (
                  <button
                    key={category}
                    onClick={() => handleAddCategoryWithFiles(category)}
                    className="w-full text-left px-3 py-2 text-sm text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                  >
                    {category}
                  </button>
                ))}
              </div>
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
              : "bg-stone-800 text-white hover:bg-stone-700",
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
// MAIN FILE HUB CONTENT
// ============================================================================
export function FileHubContent() {
  const groups = useDocumentGroups();
  const bundles = useDocumentBundles();
  const isLoading = useIsLoadingDocuments();
  const highlightedGroupId = useHighlightedGroupId();
  const uploadDocuments = useCaseDetailStore((state) => state.uploadDocuments);
  const addDocumentGroup = useCaseDetailStore(
    (state) => state.addDocumentGroup,
  );
  const createDocumentBundle = useCaseDetailStore(
    (state) => state.createDocumentBundle,
  );
  const clearHighlightedGroup = useCaseDetailStore(
    (state) => state.clearHighlightedGroup,
  );

  const [reviewGroup, setReviewGroup] = useState<DocumentGroup | null>(null);
  const [previewPage, setPreviewPage] = useState<{
    file: DocumentFile;
    index: number;
  } | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showCreateBundleModal, setShowCreateBundleModal] = useState(false);

  const classifiedGroups = groups.filter((g) => g.id !== "unclassified");
  const unclassifiedGroup = groups.find((g) => g.id === "unclassified");
  const unclassifiedFiles =
    unclassifiedGroup?.files.filter((f) => !f.isRemoved) || [];

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

  const hasAnyFiles = groups.some((g) => g.files.length > 0);

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
            onReview={() => setReviewGroup(group)}
            isHighlighted={highlightedGroupId === group.id}
            onHighlightComplete={clearHighlightedGroup}
          />
        ))}

        {/* Document Bundles */}
        {bundles.map((bundle) => {
          const linkedGroups = bundle.linkedGroupIds
            .map((id) => groups.find((g) => g.id === id))
            .filter((g): g is DocumentGroup => g !== undefined);
          return (
            <BundleCard
              key={bundle.id}
              bundle={bundle}
              linkedGroups={linkedGroups}
              allGroups={groups}
              onReviewGroup={(group) => setReviewGroup(group)}
            />
          );
        })}

        <AddCategoryCard
          onAdd={addDocumentGroup}
          existingGroups={classifiedGroups}
          onCreateBundle={() => setShowCreateBundleModal(true)}
        />
      </div>

      <AnimatePresence>
        {reviewGroup && (
          <CategoryReviewModal
            group={reviewGroup}
            allGroups={groups}
            onClose={() => setReviewGroup(null)}
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

      {/* Create Bundle Modal */}
      <AnimatePresence>
        {showCreateBundleModal && (
          <CreateBundleModal
            groups={groups}
            onClose={() => setShowCreateBundleModal(false)}
            onCreate={(name, linkedGroupIds) => {
              createDocumentBundle(name, linkedGroupIds);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
