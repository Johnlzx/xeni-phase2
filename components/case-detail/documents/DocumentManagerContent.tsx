"use client";

import React, { useState, useRef, useCallback } from "react";
import { useDrag, useDrop, useDragLayer } from "react-dnd";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import {
  FileText,
  MoreVertical,
  X,
  Check,
  ChevronDown,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  Upload,
  Inbox,
  ChevronUp,
  LayoutGrid,
  List,
  GripVertical,
  Layers,
  FileStack,
  MousePointerClick,
  File,
  FolderOpen,
  Grid3X3,
  AlignJustify,
  Download,
  ArrowRightLeft,
  ArrowUpDown,
  ArrowDownAZ,
  ArrowUpAZ,
  Clock,
  FileStack as FilesIcon,
  Eye,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Undo2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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

import { Input } from "@/components/ui/input";
import {
  useCaseDetailStore,
  useDocumentGroups,
  useIsLoadingDocuments,
} from "@/store/case-detail-store";
import { DocumentFile, DocumentGroup } from "@/types/case-detail";

const ItemTypes = {
  PAGE: "page",
};

type ViewMode = "card" | "list";

// Sort options for categories
type SortOption = "name-asc" | "name-desc" | "modified" | "created" | "status";

const SORT_OPTIONS: {
  value: SortOption;
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: "name-asc", label: "Name (A-Z)", icon: <ArrowDownAZ size={14} /> },
  { value: "name-desc", label: "Name (Z-A)", icon: <ArrowUpAZ size={14} /> },
  { value: "modified", label: "Last Modified", icon: <Clock size={14} /> },
  { value: "created", label: "Date Created", icon: <Clock size={14} /> },
  { value: "status", label: "Status", icon: <FilesIcon size={14} /> },
];

// ============================================================================
// PAGE COLOR SYSTEM - Distinct colors to differentiate pages
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
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    accent: "bg-indigo-500",
    label: "bg-indigo-100 text-indigo-700",
  },
  {
    bg: "bg-slate-50",
    border: "border-slate-200",
    accent: "bg-[#0E4268]",
    label: "bg-slate-100 text-slate-700",
  },
  {
    bg: "bg-fuchsia-50",
    border: "border-fuchsia-200",
    accent: "bg-fuchsia-500",
    label: "bg-fuchsia-100 text-fuchsia-700",
  },
];

// Get color based on page ID (consistent color for same page)
const getPageColor = (pageId: string) => {
  let hash = 0;
  for (let i = 0; i < pageId.length; i++) {
    const char = pageId.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return PAGE_COLORS[Math.abs(hash) % PAGE_COLORS.length];
};

// Thumbnail size constants
const THUMBNAIL_SIZES = {
  normal: { width: 192, height: 256 },
  small: { width: 128, height: 168 },
  tiny: { width: 80, height: 104 },
};

// ============================================================================
// CUSTOM DRAG LAYER - Minimal floating card that follows cursor
// ============================================================================
const CustomDragLayer = () => {
  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging || !currentOffset || !item) {
    return null;
  }

  const sizeKey = item.size || "normal";
  const size = THUMBNAIL_SIZES[sizeKey as keyof typeof THUMBNAIL_SIZES];

  return (
    <div
      style={{
        position: "fixed",
        pointerEvents: "none",
        zIndex: 50,
        left: 0,
        top: 0,
        transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)`,
      }}
    >
      <div
        className="bg-white rounded border-2 border-[#0E4268] shadow-xl overflow-hidden"
        style={{
          width: size.width * 0.8,
          height: size.height * 0.8,
          transform: "rotate(3deg)",
        }}
      >
        {/* Document preview with lines */}
        <div className="absolute inset-0 bg-stone-50 p-3">
          <div className="space-y-2">
            <div className="h-2 bg-stone-200 rounded w-3/4" />
            <div className="h-2 bg-stone-200 rounded w-full" />
            <div className="h-2 bg-stone-200 rounded w-5/6" />
            <div className="h-2 bg-stone-200 rounded w-2/3" />
            <div className="h-2 bg-stone-200 rounded w-4/5" />
          </div>
        </div>

        {/* Page number badge */}
        <div className="absolute bottom-2 right-2 bg-[#0E4268] text-white text-xs font-bold px-2 py-1 rounded">
          {item.pageIndex + 1}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// VIEW MODE TOGGLE - Refined pill toggle with smooth animation
// ============================================================================
const ViewModeToggle = ({
  mode,
  onChange,
}: {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}) => {
  return (
    <div className="relative flex items-center p-0.5 bg-stone-100 rounded-lg border border-stone-200/60">
      <motion.div
        className="absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] bg-white rounded-md shadow-sm border border-stone-200/80"
        initial={false}
        animate={{ x: mode === "card" ? 2 : "calc(100% + 2px)" }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />

      <button
        onClick={() => onChange("card")}
        className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
          mode === "card"
            ? "text-stone-800"
            : "text-stone-500 hover:text-stone-700"
        }`}
      >
        <LayoutGrid size={13} />
        <span>Cards</span>
      </button>

      <button
        onClick={() => onChange("list")}
        className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
          mode === "list"
            ? "text-stone-800"
            : "text-stone-500 hover:text-stone-700"
        }`}
      >
        <List size={13} />
        <span>List</span>
      </button>
    </div>
  );
};

// ============================================================================
// PAGE PREVIEW MODAL - Full-size preview with zoom and actions
// ============================================================================
const PagePreviewModal = ({
  page,
  pageIndex,
  groupId,
  allGroups,
  onClose,
}: {
  page: DocumentFile;
  pageIndex: number;
  groupId: string;
  allGroups: DocumentGroup[];
  onClose: () => void;
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const moveFileToGroup = useCaseDetailStore((state) => state.moveFileToGroup);
  const markFileForDeletion = useCaseDetailStore(
    (state) => state.markFileForDeletion,
  );

  const pageColor = getPageColor(page.id);
  const otherGroups = allGroups.filter((g) => g.id !== groupId);
  const currentGroup = allGroups.find((g) => g.id === groupId);
  const unclassifiedGroup = allGroups.find((g) => g.id === "unclassified");

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const handleRotate = () => setRotation((r) => (r + 90) % 360);
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
  };

  const handleDelete = () => {
    markFileForDeletion(page.id, groupId);
    onClose();
  };

  const handleMoveTo = (targetGroupId: string) => {
    moveFileToGroup(page.id, targetGroupId);
    onClose();
  };

  const handleUnclassify = () => {
    if (unclassifiedGroup) {
      moveFileToGroup(page.id, unclassifiedGroup.id);
      onClose();
    }
  };

  // Close on escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=") handleZoomIn();
      if (e.key === "-") handleZoomOut();
      if (e.key === "r") handleRotate();
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
        className="absolute inset-0 bg-black/80"
        onClick={onClose}
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative z-10 flex flex-col max-w-[90vw] max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-3">
            <div className={`size-3 rounded-full ${pageColor.accent}`} />
            <div>
              <h3 className="text-sm font-semibold text-stone-800">
                Page {pageIndex + 1}
              </h3>
              <p className="text-xs text-stone-500">
                {currentGroup?.title || "Document"}
              </p>
            </div>
          </div>

          {/* Zoom & Rotate Controls */}
          <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-1">
            <button
              onClick={handleZoomOut}
              className="p-2 text-stone-600 hover:bg-white hover:shadow-sm rounded-md transition-all"
              title="Zoom out (-)"
              aria-label="Zoom out"
            >
              <ZoomOut size={16} />
            </button>
            <span className="px-2 text-xs font-medium text-stone-600 min-w-[3rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-2 text-stone-600 hover:bg-white hover:shadow-sm rounded-md transition-all"
              title="Zoom in (+)"
              aria-label="Zoom in"
            >
              <ZoomIn size={16} />
            </button>
            <div className="w-px h-5 bg-stone-300 mx-1" />
            <button
              onClick={handleRotate}
              className="p-2 text-stone-600 hover:bg-white hover:shadow-sm rounded-md transition-all"
              title="Rotate (R)"
              aria-label="Rotate"
            >
              <RotateCw size={16} />
            </button>
            <button
              onClick={handleReset}
              className="p-2 text-stone-600 hover:bg-white hover:shadow-sm rounded-md transition-all"
              title="Reset"
              aria-label="Reset zoom and rotation"
            >
              <Undo2 size={16} />
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
            aria-label="Close preview"
          >
            <X size={20} />
          </button>
        </div>

        {/* Document Preview Area */}
        <div className="flex-1 overflow-auto bg-stone-100 p-8 flex items-center justify-center min-h-[60vh]">
          <motion.div
            animate={{
              scale: zoom,
              rotate: rotation,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative"
          >
            <div
              className="bg-white rounded-lg shadow-2xl border border-stone-200 overflow-hidden"
              style={{ width: "500px", maxWidth: "70vw" }}
            >
              <div className="aspect-[3/4] bg-stone-50 relative p-8">
                {/* Simulated document lines */}
                <div className="space-y-4">
                  <div className="h-4 bg-stone-200 rounded w-3/4" />
                  <div className="h-4 bg-stone-200 rounded w-full" />
                  <div className="h-4 bg-stone-200 rounded w-5/6" />
                  <div className="h-4 bg-stone-200 rounded w-2/3" />
                  <div className="h-4 bg-stone-200 rounded w-4/5" />
                  <div className="h-4 bg-stone-100 rounded w-full mt-8" />
                  <div className="h-4 bg-stone-200 rounded w-full" />
                  <div className="h-4 bg-stone-200 rounded w-3/4" />
                  <div className="h-4 bg-stone-200 rounded w-5/6" />
                  <div className="h-4 bg-stone-200 rounded w-2/3" />
                  <div className="h-4 bg-stone-100 rounded w-full mt-8" />
                  <div className="h-4 bg-stone-200 rounded w-4/5" />
                  <div className="h-4 bg-stone-200 rounded w-full" />
                  <div className="h-4 bg-stone-200 rounded w-3/5" />
                </div>
                {/* Page number badge */}
                <div className="absolute bottom-4 left-4 bg-stone-100 text-stone-600 text-lg font-semibold px-4 py-2 rounded tabular-nums">
                  Page {pageIndex + 1}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-stone-200 bg-white">
          {/* Left: Move Actions */}
          <div className="flex items-center gap-2">
            {/* Move to Category Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-medium rounded-lg transition-colors">
                  <ArrowRightLeft size={14} />
                  Move to
                  <ChevronDown size={14} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel>Move to Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {otherGroups
                  .filter((g) => g.id !== "unclassified")
                  .map((targetGroup) => (
                    <DropdownMenuItem
                      key={targetGroup.id}
                      onClick={() => handleMoveTo(targetGroup.id)}
                    >
                      <FolderOpen size={14} className="mr-2 text-stone-400" />
                      {targetGroup.title}
                    </DropdownMenuItem>
                  ))}
                {otherGroups.filter((g) => g.id !== "unclassified").length ===
                  0 && (
                  <div className="px-3 py-2 text-sm text-stone-400 italic">
                    No other categories
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Unclassify Button */}
            {groupId !== "unclassified" && unclassifiedGroup && (
              <button
                onClick={handleUnclassify}
                className="flex items-center gap-2 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 text-sm font-medium rounded-lg transition-colors border border-amber-200"
              >
                <Inbox size={14} />
                Unclassify
              </button>
            )}
          </div>

          {/* Right: Delete Action */}
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors border border-red-200"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ============================================================================
// PAGE THUMBNAIL - Draggable card with smooth reordering
// ============================================================================
const PageThumbnail = ({
  page,
  pageIndex,
  groupId,
  allGroups,
  isSelected,
  onSelect,
  onPreview,
  showDragHandle = true,
  size = "normal",
  isDraggedItem = false,
}: {
  page: DocumentFile;
  pageIndex: number;
  groupId: string;
  allGroups: DocumentGroup[];
  isSelected?: boolean;
  onSelect?: () => void;
  onPreview?: () => void;
  showDragHandle?: boolean;
  size?: "tiny" | "small" | "normal";
  isDraggedItem?: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const pageColor = getPageColor(page.id);
  const reorderFileInGroup = useCaseDetailStore(
    (state) => state.reorderFileInGroup,
  );
  const moveFileToGroup = useCaseDetailStore((state) => state.moveFileToGroup);
  const markFileForDeletion = useCaseDetailStore(
    (state) => state.markFileForDeletion,
  );

  // Preview modal state
  const [showPreview, setShowPreview] = useState(false);

  // Get other groups for "Move to" submenu (exclude current group)
  const otherGroups = allGroups.filter((g) => g.id !== groupId);

  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.PAGE,
    item: () => {
      return {
        id: page.id,
        pageIndex,
        groupId,
        color: pageColor,
        size,
      };
    },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  // Use empty image as drag preview (we render custom layer instead)
  React.useEffect(() => {
    const emptyImg = new Image();
    emptyImg.src =
      "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
    preview(emptyImg, { captureDraggingState: true });
  }, [preview]);

  const [{ isOver }, drop] = useDrop(
    {
      accept: ItemTypes.PAGE,
      hover: (
        item: { id: string; pageIndex: number; groupId: string },
        monitor,
      ) => {
        if (!ref.current) return;

        const dragId = item.id;
        const hoverId = page.id;

        // Don't replace items with themselves
        if (dragId === hoverId) return;

        const dragIndex = item.pageIndex;
        const hoverIndex = pageIndex;
        const sourceGroupId = item.groupId;

        // Only handle same-group reordering in hover
        if (sourceGroupId !== groupId) return;
        if (dragIndex === hoverIndex) return;

        // Get hover element rectangle
        const hoverBoundingRect = ref.current.getBoundingClientRect();

        // Get horizontal middle
        const hoverMiddleX =
          (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

        // Get mouse position
        const clientOffset = monitor.getClientOffset();
        if (!clientOffset) return;

        // Get pixels to the left edge
        const hoverClientX = clientOffset.x - hoverBoundingRect.left;

        // Only perform the move when the mouse has crossed half of the item
        // Dragging right: only move when cursor is past 50%
        // Dragging left: only move when cursor is before 50%
        if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) return;
        if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) return;

        // Time to actually perform the reorder
        reorderFileInGroup(groupId, dragIndex, hoverIndex);

        // Mutate the item to reflect new position
        item.pageIndex = hoverIndex;
      },
      drop: (item: { id: string; pageIndex: number; groupId: string }) => {
        if (item.groupId !== groupId) {
          moveFileToGroup(item.id, groupId);
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver({ shallow: true }),
      }),
    },
    [page.id, pageIndex, groupId, reorderFileInGroup, moveFileToGroup],
  );

  // Combine drag and drop refs
  drag(drop(ref));

  const isRemoved = page.isRemoved;
  const isNew = page.isNew;
  const sizeConfig = THUMBNAIL_SIZES[size];
  const cardWidth = sizeConfig.width;
  const cardHeight = sizeConfig.height;

  if (isRemoved && !showDragHandle) return null;

  // When this item is being dragged, show placeholder
  const showPlaceholder = isDragging;

  // Determine border/ring state
  const getBorderClasses = () => {
    if (showPlaceholder) return "border-dashed border-stone-300 bg-stone-100";
    if (isOver && !isDragging)
      return "border-[#0E4268] ring-2 ring-[#0E4268]/20";
    if (isSelected && !isRemoved)
      return "border-[#0E4268] ring-2 ring-[#0E4268]/20";
    if (isNew && !isRemoved) return "border-emerald-400";
    if (isRemoved) return "border-red-300";
    return "border-stone-200 hover:border-stone-300";
  };

  const thumbnailContent = (
    <div
      ref={isRemoved ? undefined : ref}
      onClick={isRemoved ? undefined : onSelect || onPreview}
      className={cn(
        "group relative select-none",
        isRemoved
          ? "opacity-50 pointer-events-none"
          : "cursor-grab active:cursor-grabbing",
        showPlaceholder && "opacity-60",
      )}
      style={{
        touchAction: "none",
        width: cardWidth,
        height: cardHeight,
      }}
    >
      {/* The card */}
      <div
        className={cn(
          "w-full h-full bg-white rounded border overflow-hidden shadow-sm transition-shadow",
          !showPlaceholder && "hover:shadow-md",
          getBorderClasses(),
        )}
      >
        {/* Placeholder state - show dashed outline */}
        {showPlaceholder ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-stone-400 text-xs">Moving...</div>
          </div>
        ) : (
          <>
            {/* Document content with colored background */}
            <div
              className={cn(
                "h-full flex flex-col",
                isRemoved ? "bg-stone-100" : pageColor.bg,
              )}
            >
              {/* Document skeleton */}
              <div
                className={cn(
                  "flex-1 p-3 space-y-1.5",
                  isRemoved && "opacity-50",
                )}
              >
                <div className="h-1.5 bg-white/60 rounded w-3/4" />
                <div className="h-1.5 bg-white/60 rounded w-full" />
                <div className="h-1.5 bg-white/60 rounded w-5/6" />
                <div className="h-1.5 bg-white/40 rounded w-2/3" />
                <div className="h-1.5 bg-white/60 rounded w-4/5 mt-3" />
                <div className="h-1.5 bg-white/60 rounded w-full" />
                <div className="h-1.5 bg-white/40 rounded w-3/4" />
                <div className="h-1.5 bg-white/60 rounded w-5/6 mt-3" />
                <div className="h-1.5 bg-white/40 rounded w-2/3" />
              </div>

              {/* Footer */}
              <div className="px-2 py-1.5 bg-white/80 border-t border-stone-100 flex items-center justify-between">
                <GripVertical size={12} className="text-stone-300" />
                <span
                  className={cn(
                    "text-[10px] font-medium tabular-nums",
                    isRemoved ? "text-red-500" : "text-stone-500",
                  )}
                >
                  {pageIndex + 1}
                </span>
              </div>
            </div>

            {/* Removed overlay */}
            {isRemoved && (
              <div className="absolute inset-0 bg-red-50/60 flex items-center justify-center">
                <div className="w-4/5 h-0.5 bg-red-400 -rotate-12" />
              </div>
            )}

            {/* NEW badge */}
            {isNew && !isRemoved && (
              <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-emerald-500 text-white text-[9px] font-bold rounded">
                NEW
              </div>
            )}

            {/* DEL badge */}
            {isRemoved && (
              <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-red-500 text-white text-[9px] font-bold rounded">
                DEL
              </div>
            )}

            {/* Selection check */}
            {isSelected && !isRemoved && (
              <div className="absolute top-2 right-2 size-5 bg-[#0E4268] rounded flex items-center justify-center">
                <Check size={12} className="text-white" strokeWidth={3} />
              </div>
            )}

            {/* Preview button on hover */}
            {!isRemoved && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPreview(true);
                }}
                className={cn(
                  "absolute opacity-0 group-hover:opacity-100 transition-opacity",
                  "p-1.5 bg-white/90 hover:bg-white rounded shadow-sm border border-stone-200",
                  isNew || isSelected ? "top-8 left-2" : "top-2 left-2",
                )}
                aria-label="Preview page"
              >
                <Eye size={12} className="text-stone-500" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );

  // If removed, don't show context menu
  if (isRemoved) {
    return thumbnailContent;
  }

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>{thumbnailContent}</ContextMenuTrigger>
        <ContextMenuContent className="w-48 bg-white border border-stone-200 shadow-xl rounded-lg overflow-hidden">
          {/* Preview option */}
          <ContextMenuItem
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 cursor-pointer"
          >
            <Eye size={14} className="text-stone-500" />
            <span>Preview</span>
          </ContextMenuItem>

          <ContextMenuSeparator className="bg-stone-100" />

          {/* Move to submenu */}
          <ContextMenuSub>
            <ContextMenuSubTrigger className="flex items-center gap-2 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 cursor-pointer">
              <ArrowRightLeft size={14} className="text-stone-500" />
              <span>Move to</span>
            </ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-48 bg-white border border-stone-200 shadow-xl rounded-lg overflow-hidden">
              {otherGroups.length > 0 ? (
                otherGroups.map((targetGroup) => (
                  <ContextMenuItem
                    key={targetGroup.id}
                    onClick={() => moveFileToGroup(page.id, targetGroup.id)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-stone-700 hover:bg-[#0E4268]/5 hover:text-[#0E4268] cursor-pointer"
                  >
                    <FolderOpen size={14} className="text-stone-400" />
                    <span className="truncate">{targetGroup.title}</span>
                  </ContextMenuItem>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-stone-400 italic">
                  No other categories
                </div>
              )}
            </ContextMenuSubContent>
          </ContextMenuSub>

          <ContextMenuSeparator className="bg-stone-100" />

          {/* Delete option */}
          <ContextMenuItem
            onClick={() => markFileForDeletion(page.id, groupId)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
          >
            <Trash2 size={14} />
            <span>Delete</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <PagePreviewModal
            page={page}
            pageIndex={pageIndex}
            groupId={groupId}
            allGroups={allGroups}
            onClose={() => setShowPreview(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

// ============================================================================
// CARD VIEW - Category Card Component
// ============================================================================
const CategoryCard = ({
  group,
  allGroups,
  onOpenPreview,
}: {
  group: DocumentGroup;
  allGroups: DocumentGroup[];
  onOpenPreview: (group: DocumentGroup) => void;
}) => {
  const moveFileToGroup = useCaseDetailStore((state) => state.moveFileToGroup);
  const deleteDocumentGroup = useCaseDetailStore(
    (state) => state.deleteDocumentGroup,
  );
  const renameDocumentGroup = useCaseDetailStore(
    (state) => state.renameDocumentGroup,
  );
  const confirmGroupReview = useCaseDetailStore(
    (state) => state.confirmGroupReview,
  );
  const uploadToGroup = useCaseDetailStore((state) => state.uploadToGroup);

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.PAGE,
      drop: (item: { id: string; groupId: string }) => {
        if (item.groupId !== group.id) {
          moveFileToGroup(item.id, group.id);
        }
      },
      collect: (monitor) => ({ isOver: monitor.isOver() }),
    }),
    [group.id, moveFileToGroup],
  );

  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(group.title);

  const totalPages = group.files.length;
  const canDelete = group.files.length === 0;
  const isPending = group.status === "pending" && totalPages > 1;

  const handleUpload = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Simulate uploading 1-3 pages
    const pageCount = Math.floor(Math.random() * 3) + 1;
    uploadToGroup(group.id, pageCount);
  };

  const handleRenameSubmit = () => {
    if (newTitle.trim()) {
      renameDocumentGroup(group.id, newTitle);
    } else {
      setNewTitle(group.mergedFileName || group.title);
    }
    setIsRenaming(false);
  };

  return (
    <>
      <div
        ref={drop as unknown as React.LegacyRef<HTMLDivElement>}
        className={`w-[300px] shrink-0 rounded-2xl transition-all duration-200 flex flex-col overflow-hidden ${
          isOver
            ? "bg-[#0E4268]/5 ring-2 ring-[#0E4268]/30 border-2 border-[#0E4268]/40 shadow-lg scale-[1.02]"
            : "bg-white border border-stone-200 shadow-sm hover:shadow-lg"
        }`}
      >
        {/* Card Header */}
        <div className="px-4 py-3 border-b border-stone-100 bg-stone-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {isRenaming ? (
                <div className="flex items-center gap-1.5 flex-1">
                  <Input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="h-7 text-sm flex-1"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRenameSubmit();
                      if (e.key === "Escape") {
                        setNewTitle(group.title);
                        setIsRenaming(false);
                      }
                    }}
                  />
                  <button
                    onClick={handleRenameSubmit}
                    className="p-1 bg-[#0E4268]/10 text-[#0E4268] rounded hover:bg-[#0E4268]/20"
                  >
                    <Check size={12} />
                  </button>
                  <button
                    onClick={() => {
                      setNewTitle(group.title);
                      setIsRenaming(false);
                    }}
                    className="p-1 bg-stone-100 text-stone-600 rounded hover:bg-stone-200"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="p-1.5 rounded-lg bg-red-50 text-red-500">
                    <File size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-stone-800 truncate">
                      {group.mergedFileName || `${group.title}.pdf`}
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      {totalPages} pages
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {isPending ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                  Review
                </span>
              ) : totalPages > 0 ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-0.5">
                  <Check size={10} strokeWidth={3} /> Ready
                </span>
              ) : null}

              <button
                onClick={handleUpload}
                className="p-1 text-stone-400 hover:text-[#0E4268] hover:bg-[#0E4268]/10 rounded transition-colors"
                aria-label="Upload to category"
              >
                <Upload size={14} />
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded transition-colors">
                    <MoreVertical size={14} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={handleUpload}>
                    <Upload size={12} className="mr-2" /> Upload
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setNewTitle(group.title);
                      setIsRenaming(true);
                    }}
                  >
                    <Pencil size={12} className="mr-2" /> Rename
                  </DropdownMenuItem>
                  {isPending && (
                    <DropdownMenuItem
                      onClick={() => confirmGroupReview(group.id)}
                    >
                      <Check size={12} className="mr-2" /> Confirm
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    disabled={!canDelete}
                    onClick={() => canDelete && setShowDeleteAlert(true)}
                    className={canDelete ? "text-red-600" : "text-stone-300"}
                  >
                    <Trash2 size={12} className="mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Pages Preview Grid - Clean document style */}
        <div
          className="flex-1 p-3 cursor-pointer hover:bg-stone-50/50 transition-colors"
          onClick={() => onOpenPreview(group)}
        >
          {totalPages > 0 ? (
            <div className="grid grid-cols-4 gap-1.5">
              {group.files
                .filter((f) => !f.isRemoved)
                .slice(0, 8)
                .map((page, idx) => {
                  const isNew = page.isNew;
                  return (
                    <div
                      key={page.id}
                      className={cn(
                        "aspect-[3/4] bg-stone-50 rounded border overflow-hidden relative",
                        isNew ? "border-emerald-400" : "border-stone-200",
                      )}
                    >
                      {/* Simulated document lines */}
                      <div className="absolute inset-0 p-1">
                        <div className="space-y-0.5">
                          <div className="h-0.5 bg-stone-200 rounded w-3/4" />
                          <div className="h-0.5 bg-stone-200 rounded w-full" />
                          <div className="h-0.5 bg-stone-200 rounded w-2/3" />
                        </div>
                      </div>
                      {isNew && (
                        <div className="absolute top-0 left-0 bg-emerald-500 text-white text-[5px] font-bold px-0.5 rounded-br">
                          N
                        </div>
                      )}
                      <div
                        className={cn(
                          "absolute bottom-0 right-0 text-[6px] font-semibold px-0.5 rounded-tl tabular-nums",
                          isNew
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-stone-100 text-stone-500",
                        )}
                      >
                        {idx + 1}
                      </div>
                    </div>
                  );
                })}
              {group.files.filter((f) => !f.isRemoved).length > 8 && (
                <div className="aspect-[3/4] bg-stone-100 rounded border border-stone-200 flex items-center justify-center">
                  <span className="text-[10px] font-semibold text-stone-500 tabular-nums">
                    +{group.files.filter((f) => !f.isRemoved).length - 8}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[120px] flex flex-col items-center justify-center text-stone-400">
              <Upload size={24} className="mb-2 opacity-50" />
              <span className="text-xs text-pretty">Drop pages here</span>
            </div>
          )}
        </div>

        {/* Card Footer - Quick Actions */}
        {totalPages > 0 && (
          <div className="px-3 py-2 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
            <button
              onClick={() => onOpenPreview(group)}
              className="text-xs text-[#0E4268] hover:text-[#0E4268]/80 font-medium flex items-center gap-1"
            >
              <Grid3X3 size={12} />
              View all pages
            </button>
            {isPending && (
              <button
                onClick={() => confirmGroupReview(group.id)}
                className="text-xs text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
              >
                <Check size={12} />
                Confirm
              </button>
            )}
          </div>
        )}
      </div>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{group.title}"? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteDocumentGroup(group.id);
                setShowDeleteAlert(false);
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

// ============================================================================
// CARD VIEW - Full Page Preview Modal
// ============================================================================
const CategoryPreviewModal = ({
  group,
  allGroups,
  onClose,
}: {
  group: DocumentGroup;
  allGroups: DocumentGroup[];
  onClose: () => void;
}) => {
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

  // Filter out removed files for display
  const activeFiles = group.files.filter((f) => !f.isRemoved);
  const isPending = group.status === "pending" && activeFiles.length > 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
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
                {group.files.length} pages
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
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-white shadow-sm text-stone-800"
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                <Grid3X3 size={14} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-white shadow-sm text-stone-800"
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                <AlignJustify size={14} />
              </button>
            </div>

            {isPending ? (
              <button
                onClick={() => confirmGroupReview(group.id)}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#0E4268] hover:bg-[#0a3555] text-white text-sm font-medium rounded-lg transition-colors"
              >
                <Check size={14} />
                Confirm
              </button>
            ) : group.status === "reviewed" ? (
              <button
                onClick={() => {
                  // Simulate download
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
            <div className="flex flex-wrap gap-8 content-start">
              {group.files.map((page, idx) => (
                <PageThumbnail
                  key={page.id}
                  page={page}
                  pageIndex={idx}
                  groupId={group.id}
                  allGroups={allGroups}
                  isSelected={
                    selectedPages.includes(page.id) && !page.isRemoved
                  }
                  onSelect={() =>
                    !page.isRemoved && togglePageSelection(page.id)
                  }
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-6 items-center max-w-3xl mx-auto">
              {group.files.map((page, idx) => {
                return (
                  <motion.div key={page.id} layout className="w-full">
                    <div className="bg-white rounded shadow-md border border-stone-200 overflow-hidden">
                      <div className="aspect-[4/5] bg-stone-50 relative p-6">
                        {/* Simulated document lines */}
                        <div className="space-y-3">
                          <div className="h-3 bg-stone-200 rounded w-3/4" />
                          <div className="h-3 bg-stone-200 rounded w-full" />
                          <div className="h-3 bg-stone-200 rounded w-5/6" />
                          <div className="h-3 bg-stone-200 rounded w-2/3" />
                          <div className="h-3 bg-stone-200 rounded w-4/5" />
                          <div className="h-3 bg-stone-100 rounded w-full mt-6" />
                          <div className="h-3 bg-stone-200 rounded w-full" />
                          <div className="h-3 bg-stone-200 rounded w-3/4" />
                          <div className="h-3 bg-stone-200 rounded w-5/6" />
                        </div>
                        <div className="absolute bottom-4 left-4 bg-stone-100 text-stone-600 text-sm font-semibold px-3 py-1 rounded tabular-nums">
                          Page {idx + 1} of {group.files.length}
                        </div>
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
};

// ============================================================================
// LIST VIEW - Sidebar Category Item
// ============================================================================
const SidebarCategoryItem = ({
  group,
  isSelected,
  onSelect,
  allGroups,
}: {
  group: DocumentGroup;
  isSelected: boolean;
  onSelect: () => void;
  allGroups: DocumentGroup[];
}) => {
  const moveFileToGroup = useCaseDetailStore((state) => state.moveFileToGroup);
  const uploadToGroup = useCaseDetailStore((state) => state.uploadToGroup);
  const ref = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.PAGE,
      drop: (item: { id: string; groupId: string }) => {
        if (item.groupId !== group.id) {
          moveFileToGroup(item.id, group.id);
        }
      },
      collect: (monitor) => ({ isOver: monitor.isOver() }),
    }),
    [group.id, moveFileToGroup],
  );

  drop(ref);

  const handleUpload = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Simulate uploading 1-3 pages
    const pageCount = Math.floor(Math.random() * 3) + 1;
    uploadToGroup(group.id, pageCount);
  };

  // Filter out removed files for display
  const activeFiles = group.files.filter((f) => !f.isRemoved);
  const totalPages = activeFiles.length;
  const isPending = group.status === "pending" && totalPages > 1;

  return (
    <div
      ref={ref}
      onClick={onSelect}
      className={`
        group flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-150
        ${
          isSelected
            ? "bg-[#0E4268]/5 border border-[#0E4268]/30 shadow-sm"
            : isOver
              ? "bg-[#0E4268]/5 border border-[#0E4268]/30 border-dashed"
              : "hover:bg-stone-50 border border-transparent"
        }
      `}
    >
      <div
        className={`
        p-2 rounded-lg shrink-0 transition-colors
        ${isSelected ? "bg-[#0E4268]/15 text-[#0E4268]" : "bg-red-50 text-red-500"}
      `}
      >
        <File size={16} />
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium truncate ${isSelected ? "text-[#0E4268]" : "text-stone-700"}`}
        >
          {group.mergedFileName || `${group.title}.pdf`}
        </p>
        <p className="text-xs text-stone-400 flex items-center gap-1.5">
          <span>{totalPages} pages</span>
          {isPending && (
            <>
              <span className="size-1 rounded-full bg-amber-400" />
              <span className="text-amber-600">Review needed</span>
            </>
          )}
        </p>
      </div>

      {/* Upload button - visible on hover */}
      <button
        onClick={handleUpload}
        className="p-1.5 text-stone-400 hover:text-[#0E4268] hover:bg-[#0E4268]/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Upload to category"
      >
        <Upload size={14} />
      </button>

      {isPending && (
        <div className="size-2 rounded-full bg-amber-400 shrink-0 animate-pulse" />
      )}
    </div>
  );
};

// ============================================================================
// LIST VIEW - Empty State
// ============================================================================
const PreviewEmptyState = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center px-8">
      <div className="relative mb-8">
        <div className="relative w-40 h-48">
          {[2, 1, 0].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.2 }}
              className="absolute bg-white rounded-lg border border-stone-200 shadow-sm"
              style={{
                width: "120px",
                height: "160px",
                left: `${i * 10}px`,
                top: `${i * 8}px`,
                zIndex: 3 - i,
                transform: `rotate(${(i - 1) * 3}deg)`,
              }}
            >
              <div className="absolute inset-3 flex flex-col gap-2">
                <div className="h-2 bg-stone-100 rounded w-3/4" />
                <div className="h-2 bg-stone-100 rounded w-1/2" />
                <div className="flex-1 bg-stone-50 rounded mt-2" />
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.2 }}
            className="absolute -right-4 bottom-4 z-10"
          >
            <div className="bg-[#0E4268] rounded-full p-2 shadow-lg shadow-[#0E4268]/30">
              <MousePointerClick size={16} className="text-white" />
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center max-w-xs"
      >
        <h3 className="text-lg font-semibold text-stone-800 mb-2">
          Select a Category
        </h3>
        <p className="text-sm text-stone-500 leading-relaxed">
          Choose a document category from the sidebar to view and reorder its
          pages.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex gap-3 mt-6"
      >
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 rounded-full text-xs text-stone-600">
          <GripVertical size={12} />
          <span>Drag to reorder</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 rounded-full text-xs text-stone-600">
          <Layers size={12} />
          <span>Move pages between categories</span>
        </div>
      </motion.div>
    </div>
  );
};

// ============================================================================
// LIST VIEW - Category Preview Panel
// ============================================================================
const CategoryPreviewPanel = ({
  group,
  allGroups,
}: {
  group: DocumentGroup;
  allGroups: DocumentGroup[];
}) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const confirmGroupReview = useCaseDetailStore(
    (state) => state.confirmGroupReview,
  );
  const moveFileToGroup = useCaseDetailStore((state) => state.moveFileToGroup);

  // Reset when group changes
  React.useEffect(() => {
    setSelectedPages([]);
    setActivePageIndex(0);
  }, [group.id]);

  // Scroll to page when clicking thumbnail in list mode
  const scrollToPage = useCallback((index: number) => {
    setActivePageIndex(index);
    pageRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, []);

  // Track active page on scroll in list mode
  React.useEffect(() => {
    if (viewMode !== "list" || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.top + containerRect.height / 2;

      let closestIndex = 0;
      let closestDistance = Infinity;

      pageRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const pageCenter = rect.top + rect.height / 2;
          const distance = Math.abs(pageCenter - containerCenter);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        }
      });

      setActivePageIndex(closestIndex);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [viewMode]);

  const togglePageSelection = (pageId: string) => {
    setSelectedPages((prev) =>
      prev.includes(pageId)
        ? prev.filter((p) => p !== pageId)
        : [...prev, pageId],
    );
  };

  // Filter out removed files for display
  const activeFiles = group.files.filter((f) => !f.isRemoved);
  const isPending = group.status === "pending" && activeFiles.length > 1;

  return (
    <div className="h-full flex flex-col bg-stone-50/30">
      {/* Panel Header */}
      <div className="shrink-0 px-5 py-4 bg-white border-b border-stone-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-50 rounded-xl text-red-500">
            <FileStack size={18} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-stone-800">
              {group.mergedFileName || `${group.title}.pdf`}
            </h2>
            <p className="text-xs text-stone-500">
              {activeFiles.length} pages
              {isPending && (
                <span className="ml-2 text-amber-600 font-medium">
                  • Pending Review
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-0.5 bg-stone-100 rounded-md">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded transition-colors ${
                viewMode === "grid"
                  ? "bg-white shadow-sm text-stone-800"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              <Grid3X3 size={14} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded transition-colors ${
                viewMode === "list"
                  ? "bg-white shadow-sm text-stone-800"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              <AlignJustify size={14} />
            </button>
          </div>

          {isPending ? (
            <button
              onClick={() => confirmGroupReview(group.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0E4268] hover:bg-[#0a3555] text-white text-xs font-medium rounded-lg transition-colors"
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
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors"
            >
              <Download size={14} />
              Download
            </button>
          ) : null}
        </div>
      </div>

      {/* Pages */}
      <div className="flex-1 overflow-hidden">
        {activeFiles.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-stone-400 p-5">
            <Upload size={32} className="mb-3 opacity-50" />
            <p className="text-sm">No pages in this category</p>
            <p className="text-xs mt-1">
              Drag pages here from other categories
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="h-full overflow-auto p-4">
            <div className="flex flex-wrap gap-8 content-start">
              {activeFiles.map((page, idx) => (
                <PageThumbnail
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
          </div>
        ) : (
          <div className="h-full flex">
            {/* Left Thumbnail Navigation */}
            <div className="w-20 shrink-0 bg-stone-50 border-r border-stone-200 overflow-y-auto py-3 px-2">
              <div className="flex flex-col gap-2">
                {activeFiles.map((page, idx) => {
                  const isActive = activePageIndex === idx;
                  return (
                    <button
                      key={page.id}
                      onClick={() => scrollToPage(idx)}
                      aria-label={`Go to page ${idx + 1}`}
                      className={cn(
                        "relative w-full aspect-[3/4] rounded overflow-hidden border bg-white",
                        isActive
                          ? "border-[#0E4268] ring-1 ring-[#0E4268]/30 shadow-sm"
                          : "border-stone-200 opacity-70 hover:opacity-100 hover:border-stone-300",
                      )}
                    >
                      {/* Document lines */}
                      <div className="absolute inset-0 p-1.5 bg-stone-50">
                        <div className="space-y-0.5">
                          <div className="h-0.5 bg-stone-200 rounded w-4/5" />
                          <div className="h-0.5 bg-stone-200 rounded w-full" />
                          <div className="h-0.5 bg-stone-200 rounded w-3/4" />
                        </div>
                      </div>
                      {/* Page number */}
                      <div
                        className={cn(
                          "absolute bottom-1 right-1 text-[8px] font-semibold px-1 rounded tabular-nums",
                          isActive
                            ? "bg-[#0E4268] text-white"
                            : "bg-stone-100 text-stone-500",
                        )}
                      >
                        {idx + 1}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Preview Area */}
            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto p-5"
            >
              <div className="flex flex-col gap-6 items-center max-w-2xl mx-auto">
                {activeFiles.map((page, idx) => {
                  return (
                    <div
                      key={page.id}
                      ref={(el) => {
                        pageRefs.current[idx] = el;
                      }}
                      className="w-full"
                    >
                      <div className="bg-white rounded shadow-md border border-stone-200 overflow-hidden">
                        {/* Document content simulation */}
                        <div className="aspect-[4/5] bg-stone-50 relative p-6">
                          {/* Simulated document lines */}
                          <div className="space-y-3">
                            <div className="h-3 bg-stone-200 rounded w-3/4" />
                            <div className="h-3 bg-stone-200 rounded w-full" />
                            <div className="h-3 bg-stone-200 rounded w-5/6" />
                            <div className="h-3 bg-stone-200 rounded w-2/3" />
                            <div className="h-3 bg-stone-200 rounded w-4/5" />
                            <div className="h-3 bg-stone-100 rounded w-full mt-6" />
                            <div className="h-3 bg-stone-200 rounded w-full" />
                            <div className="h-3 bg-stone-200 rounded w-3/4" />
                            <div className="h-3 bg-stone-200 rounded w-5/6" />
                            <div className="h-3 bg-stone-200 rounded w-2/3" />
                            <div className="h-3 bg-stone-100 rounded w-full mt-6" />
                            <div className="h-3 bg-stone-200 rounded w-4/5" />
                            <div className="h-3 bg-stone-200 rounded w-full" />
                          </div>
                          {/* Page number badge */}
                          <div className="absolute bottom-4 left-4 bg-stone-100 text-stone-600 text-sm font-semibold px-3 py-1 rounded tabular-nums">
                            Page {idx + 1} of {activeFiles.length}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
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
            className="shrink-0 px-5 py-3 bg-white border-t border-stone-200 flex items-center justify-between"
          >
            <span className="text-sm text-stone-600">
              <strong>{selectedPages.length}</strong> page
              {selectedPages.length > 1 ? "s" : ""} selected
            </span>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-100 rounded-lg transition-colors">
                    <Layers size={14} />
                    Move to category
                    <ChevronDown size={12} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Move to...</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {allGroups
                    .filter((g) => g.id !== group.id && g.id !== "unclassified")
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
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
              >
                <Inbox size={14} />
                Unclassify
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// FLOATING UNCLASSIFIED BUBBLE
// ============================================================================
const UnclassifiedBubble = ({
  group,
  allGroups,
}: {
  group: DocumentGroup;
  allGroups: DocumentGroup[];
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDraggingBubble, setIsDraggingBubble] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const moveFileToGroup = useCaseDetailStore((state) => state.moveFileToGroup);

  const pageCount = group.files.length;

  // Drop zone for receiving dragged thumbnails
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.PAGE,
      drop: (item: { id: string; groupId: string }) => {
        if (item.groupId !== group.id) {
          moveFileToGroup(item.id, group.id);
        }
      },
      canDrop: (item: { id: string; groupId: string }) =>
        item.groupId !== group.id,
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [group.id, moveFileToGroup],
  );

  // Connect drop ref
  drop(dropRef);

  // Handle bubble drag start (for repositioning the bubble)
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start drag from the drag handle area
    if ((e.target as HTMLElement).closest("[data-drag-handle]")) {
      e.preventDefault();
      setIsDraggingBubble(true);
      dragStartPos.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
    }
  };

  // Handle bubble drag move
  React.useEffect(() => {
    if (!isDraggingBubble) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - dragStartPos.current.x;
      const newY = e.clientY - dragStartPos.current.y;

      // Constrain to viewport
      const maxX = window.innerWidth - 200;
      const maxY = window.innerHeight - 100;
      const minX = -window.innerWidth + 200;
      const minY = -window.innerHeight + 100;

      setPosition({
        x: Math.max(minX, Math.min(maxX, newX)),
        y: Math.max(minY, Math.min(maxY, newY)),
      });
    };

    const handleMouseUp = () => {
      setIsDraggingBubble(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingBubble]);

  // Show bubble even when empty if something is being dragged over
  const showBubble = pageCount > 0 || (isOver && canDrop);
  if (!showBubble) return null;

  const isDropTarget = isOver && canDrop;

  return (
    <div
      ref={dragRef}
      className="fixed bottom-24 right-6 z-50"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDraggingBubble ? "grabbing" : "auto",
      }}
      onMouseDown={handleMouseDown}
    >
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-[480px] bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-stone-100 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-100">
                  <Inbox size={16} className="text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-800">
                    Unclassified Pages
                  </h3>
                  <p className="text-xs text-stone-500">
                    {pageCount} pages to organize - drag to categories
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1.5 hover:bg-stone-200 rounded-lg transition-colors"
                aria-label="Collapse unclassified panel"
              >
                <ChevronDown size={16} className="text-stone-500" />
              </button>
            </div>

            {/* Pages Grid */}
            <div className="p-4 max-h-[400px] overflow-y-auto">
              <div className="flex flex-wrap gap-4">
                {group.files
                  .filter((f) => !f.isRemoved)
                  .map((page, idx) => (
                    <PageThumbnail
                      key={page.id}
                      page={page}
                      pageIndex={idx}
                      groupId={group.id}
                      allGroups={allGroups}
                      showDragHandle={true}
                      size="tiny"
                    />
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bubble Button - also a drop target */}
      <div
        ref={dropRef}
        className={`
          relative flex items-center gap-1 rounded-full shadow-xl transition-all duration-200
          ${
            isDropTarget
              ? "bg-[#0E4268] text-white border-2 border-solid border-[#0E4268]/70 scale-110 shadow-2xl shadow-[#0E4268]/30"
              : isExpanded
                ? "bg-stone-800 text-white"
                : "bg-white border-2 border-dashed border-amber-300 text-amber-700 hover:border-amber-400 hover:shadow-2xl"
          }
        `}
      >
        {/* Drag Handle */}
        <div
          data-drag-handle
          className={`
            flex items-center justify-center pl-2 pr-1 py-3 cursor-grab active:cursor-grabbing rounded-l-full
            ${isDropTarget ? "text-white/80" : isExpanded ? "text-white/50 hover:text-white/80" : "text-amber-400 hover:text-amber-600"}
          `}
        >
          <GripVertical size={14} />
        </div>

        {/* Click Area */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 pr-4 py-3"
        >
          <Inbox size={18} />
          <span className="text-sm font-semibold">
            {isDropTarget ? "Drop here" : "Unclassified"}
          </span>

          <div
            className={`
            flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold
            ${isDropTarget ? "bg-white/30 text-white" : isExpanded ? "bg-white/20 text-white" : "bg-amber-100 text-amber-700"}
          `}
          >
            <span>{pageCount}</span>
            <span className="text-[10px] opacity-70">pages</span>
          </div>

          {!isDropTarget && (
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronUp
                size={14}
                className={isExpanded ? "text-white/70" : "text-amber-500"}
              />
            </motion.div>
          )}
        </button>

        {!isExpanded && !isDropTarget && pageCount > 0 && (
          <span className="absolute -top-1 -right-1 size-3 bg-amber-400 rounded-full animate-pulse" />
        )}
      </div>
    </div>
  );
};

// ============================================================================
// CARD VIEW CONTENT
// ============================================================================
const CardViewContent = ({
  groups,
  unclassifiedGroup,
  onAddGroup,
}: {
  groups: DocumentGroup[];
  unclassifiedGroup: DocumentGroup | undefined;
  onAddGroup: (name: string) => void;
}) => {
  const [previewGroup, setPreviewGroup] = useState<DocumentGroup | null>(null);
  const classifiedGroups = groups.filter((g) => g.id !== "unclassified");

  return (
    <>
      <div className="h-full p-6 overflow-x-auto">
        <div className="flex gap-5 h-full pb-4">
          {classifiedGroups.map((group) => (
            <CategoryCard
              key={group.id}
              group={group}
              allGroups={groups}
              onOpenPreview={setPreviewGroup}
            />
          ))}

          {/* Add Category Button */}
          <div
            className="w-[200px] shrink-0 rounded-2xl border-2 border-dashed border-stone-200 hover:border-stone-300 hover:bg-stone-50/50 transition-all flex items-center justify-center cursor-pointer group"
            onClick={() => onAddGroup("New Category")}
          >
            <div className="text-center">
              <div className="size-12 mx-auto mb-2 rounded-full bg-stone-100 group-hover:bg-stone-200 flex items-center justify-center transition-colors">
                <Plus size={24} className="text-stone-400" />
              </div>
              <span className="text-sm text-stone-500 font-medium">
                Add Category
              </span>
            </div>
          </div>
        </div>
      </div>

      {unclassifiedGroup && (
        <UnclassifiedBubble group={unclassifiedGroup} allGroups={groups} />
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {previewGroup && (
          <CategoryPreviewModal
            group={previewGroup}
            allGroups={groups}
            onClose={() => setPreviewGroup(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

// ============================================================================
// LIST VIEW CONTENT
// ============================================================================
const ListViewContent = ({
  groups,
  unclassifiedGroup,
  onUpload,
  onAddGroup,
}: {
  groups: DocumentGroup[];
  unclassifiedGroup: DocumentGroup | undefined;
  onUpload: () => void;
  onAddGroup: (name: string) => void;
}) => {
  const classifiedGroups = groups.filter((g) => g.id !== "unclassified");

  // Sort state
  const [sortOption, setSortOption] = useState<SortOption>("name-asc");

  // Sort function
  const sortedGroups = React.useMemo(() => {
    const sorted = [...classifiedGroups];
    switch (sortOption) {
      case "name-asc":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case "name-desc":
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case "modified":
        // Sort by last modified (hasChanges first, then by id as proxy for time)
        return sorted.sort((a, b) => {
          if (a.hasChanges && !b.hasChanges) return -1;
          if (!a.hasChanges && b.hasChanges) return 1;
          return b.id.localeCompare(a.id); // Newer IDs first
        });
      case "created":
        // Sort by creation order (using id as proxy)
        return sorted.sort((a, b) => a.id.localeCompare(b.id));
      case "status":
        // Pending first, then reviewed
        return sorted.sort((a, b) => {
          if (a.status === "pending" && b.status === "reviewed") return -1;
          if (a.status === "reviewed" && b.status === "pending") return 1;
          return a.title.localeCompare(b.title);
        });
      default:
        return sorted;
    }
  }, [classifiedGroups, sortOption]);

  // Auto-select first category to show preview by default
  const [selectedGroup, setSelectedGroup] = useState<DocumentGroup | null>(
    () => sortedGroups[0] || null,
  );

  // Update selection when groups change (e.g., first load or group deleted)
  React.useEffect(() => {
    if (selectedGroup) {
      // Check if selected group still exists
      const stillExists = classifiedGroups.find(
        (g) => g.id === selectedGroup.id,
      );
      if (stillExists) {
        // Update to latest version of the group
        setSelectedGroup(stillExists);
      } else {
        // Group was deleted, select first available
        setSelectedGroup(sortedGroups[0] || null);
      }
    } else if (sortedGroups.length > 0) {
      // No selection but groups exist, select first
      setSelectedGroup(sortedGroups[0]);
    }
  }, [groups, sortOption]);

  return (
    <div className="h-full flex">
      {/* Left Panel - Main Work Area */}
      <div className="flex-1 bg-stone-50/50">
        {selectedGroup ? (
          <CategoryPreviewPanel group={selectedGroup} allGroups={groups} />
        ) : (
          <PreviewEmptyState />
        )}
      </div>

      {/* Right Sidebar - Categories List */}
      <div className="w-80 shrink-0 bg-white border-l border-stone-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="shrink-0 px-4 py-3 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen size={16} className="text-stone-500" />
            <span className="text-sm font-semibold text-stone-700">
              Categories
            </span>
          </div>
          <div className="flex items-center gap-1">
            {/* Sort Button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-1.5 text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                  aria-label="Sort categories"
                >
                  <ArrowUpDown size={14} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {SORT_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setSortOption(option.value)}
                    className={
                      sortOption === option.value ? "bg-stone-100" : ""
                    }
                  >
                    <span className="mr-2 text-stone-500">{option.icon}</span>
                    {option.label}
                    {sortOption === option.value && (
                      <Check size={12} className="ml-auto text-[#0E4268]" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              onClick={onUpload}
              className="p-1.5 text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
              aria-label="Upload documents"
            >
              <Upload size={14} />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="p-1.5 text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                  aria-label="Add category"
                >
                  <Plus size={14} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel>Add Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onAddGroup("Bank Statement")}>
                  Bank Statement
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAddGroup("Passport")}>
                  Passport
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAddGroup("Utility Bill")}>
                  Utility Bill
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onAddGroup("Employment Letter")}
                >
                  Employment Letter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Categories List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {sortedGroups.map((group) => (
            <SidebarCategoryItem
              key={group.id}
              group={group}
              isSelected={selectedGroup?.id === group.id}
              onSelect={() => setSelectedGroup(group)}
              allGroups={groups}
            />
          ))}

          {sortedGroups.length === 0 && (
            <div className="py-12 text-center">
              <FolderOpen size={32} className="mx-auto mb-3 text-stone-300" />
              <p className="text-sm text-stone-500">No categories yet</p>
              <button
                onClick={onUpload}
                className="mt-3 text-xs text-[#0E4268] hover:text-[#0a3555] font-medium"
              >
                Upload documents
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Bubble */}
      {unclassifiedGroup && (
        <UnclassifiedBubble group={unclassifiedGroup} allGroups={groups} />
      )}
    </div>
  );
};

// ============================================================================
// MAIN DOCUMENT MANAGER CONTENT
// ============================================================================
export default function DocumentManagerContent() {
  const groups = useDocumentGroups();
  const isLoading = useIsLoadingDocuments();
  const uploadDocuments = useCaseDetailStore((state) => state.uploadDocuments);
  const addDocumentGroup = useCaseDetailStore(
    (state) => state.addDocumentGroup,
  );

  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const unclassifiedGroup = groups.find((g) => g.id === "unclassified");

  return (
    <div className="h-full flex flex-col bg-stone-50/30">
      {/* Custom Drag Layer for smooth cursor-following */}
      <CustomDragLayer />

      {/* Header */}
      <div className="p-4 bg-white border-b border-stone-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-stone-900">Documents</h1>

          {(() => {
            const pendingCount = groups.filter(
              (g) =>
                g.id !== "unclassified" &&
                g.status === "pending" &&
                g.files.length > 1,
            ).length;
            if (pendingCount === 0) return null;
            return (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                {pendingCount} pending review
              </span>
            );
          })()}
        </div>

        <div className="flex items-center gap-3">
          <ViewModeToggle mode={viewMode} onChange={setViewMode} />

          {viewMode === "card" && (
            <div className="flex items-center gap-2 pl-3 border-l border-stone-200">
              <button
                onClick={uploadDocuments}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <Upload size={16} />
                Upload
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100 rounded-lg transition-colors">
                    <Plus size={16} />
                    Add Category
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Category Templates</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => addDocumentGroup("Bank Statement")}
                  >
                    Bank Statement
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => addDocumentGroup("Passport")}
                  >
                    Passport
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => addDocumentGroup("Utility Bill")}
                  >
                    Utility Bill
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => addDocumentGroup("Employment Letter")}
                  >
                    Employment Letter
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => addDocumentGroup("Other Documents")}
                  >
                    Other Documents
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <div className="size-12 border-3 border-stone-200 border-t-[#0E4268] rounded-full animate-spin mb-4" />
            <p className="text-sm font-medium text-stone-700">
              Processing documents...
            </p>
            <p className="text-xs text-stone-400 mt-1">
              AI is analyzing and categorizing pages
            </p>
          </div>
        ) : groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 px-6">
            <div className="size-24 bg-stone-100 rounded-3xl flex items-center justify-center mb-5">
              <Upload className="size-12 text-stone-400" />
            </div>
            <h3 className="text-xl font-semibold text-stone-800 mb-2">
              No documents yet
            </h3>
            <p className="text-sm text-stone-500 text-center mb-6 max-w-md">
              Upload your PDF documents to get started. AI will automatically
              split pages and suggest categories.
            </p>
            <button
              onClick={uploadDocuments}
              className="px-6 py-3 bg-[#0E4268] text-white text-sm font-medium rounded-xl hover:bg-[#0a3555] transition-colors flex items-center gap-2 shadow-lg shadow-[#0E4268]/30"
            >
              <Upload size={18} />
              Upload Documents
            </button>
          </div>
        ) : viewMode === "card" ? (
          <CardViewContent
            groups={groups}
            unclassifiedGroup={unclassifiedGroup}
            onAddGroup={addDocumentGroup}
          />
        ) : (
          <ListViewContent
            groups={groups}
            unclassifiedGroup={unclassifiedGroup}
            onUpload={uploadDocuments}
            onAddGroup={addDocumentGroup}
          />
        )}
      </div>
    </div>
  );
}
