"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  MoreVertical,
  X,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Copy,
  Plus,
  Pencil,
  Download,
  Eye,
  AlertCircle,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getCaseById } from "@/data/cases";
import { VISA_TYPES } from "@/data/constants";
import {
  CommandCenterLayout,
  ApplicationChecklist,
  DocumentsPanel,
  IssueCenter,
  BuildApplicationModal,
  VerificationWorkbench,
} from "@/components/command-center";
import { useCommandCenterStore } from "@/store/command-center-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { ReviewDialog as NewReviewDialog } from "@/components/review-dialog";
import svgPaths from "@/lib/imports/svg-znjy2uzkhq";

const imgImageUserProfile = "/6583d01df7ada9696869b9565893d6c4c2134237.png";

// --- Types ---

type FileType = {
  id: string;
  name: string;
  size: string;
  pages?: number;
  date?: string;
  type: "pdf" | "doc";
  isNew?: boolean;
  isRemoved?: boolean;
};

type GroupType = {
  id: string;
  title: string;
  tag: string;
  mergedFileName?: string; // The name of the resulting PDF
  status: "pending" | "reviewed"; // Added status
  hasChanges?: boolean;
  files: FileType[];
};

const ItemTypes = {
  FILE: "file",
  THUMBNAIL: "thumbnail", // Added for dialog sorting
  PAGE: "page", // For split dialog
};

// --- Initial Data ---

const INITIAL_GROUPS: GroupType[] = [
  {
    id: "passport",
    title: "Passport",
    tag: "Passport",
    mergedFileName: "Passport_Combined.pdf",
    status: "pending",
    files: [
      {
        id: "f1",
        name: "Passport_Main.pdf",
        size: "2.4 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
    ],
  },
  {
    id: "bank_statement",
    title: "Bank Statement",
    tag: "Bank Statement",
    mergedFileName: "BankStatement_Q3.pdf",
    status: "pending",
    files: [
      {
        id: "f2_1",
        name: "Statement_July.pdf",
        size: "1.2 MB",
        pages: 3,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "f2_2",
        name: "Statement_August.pdf",
        size: "1.1 MB",
        pages: 2,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
    ],
  },
  {
    id: "utility_bill",
    title: "Utility Bill",
    tag: "Utility Bill",
    mergedFileName: "Utility_Bills_2023.pdf",
    status: "pending",
    files: [
      {
        id: "f3",
        name: "Electric_Bill_Oct.pdf",
        size: "0.8 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "f_rem",
        name: "Old_Electric_Bill.pdf",
        size: "0.9 MB",
        pages: 1,
        date: "Yesterday",
        type: "pdf",
        isRemoved: true,
      },
    ],
  },
  {
    id: "unclassified",
    title: "Unclassified",
    tag: "Unclassified",
    status: "pending",
    files: [
      {
        id: "u1",
        name: "Scan_Batch_001.pdf",
        size: "15 MB",
        pages: 12,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "u2",
        name: "Unknown_Doc_X.pdf",
        size: "4.5 MB",
        pages: 5,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "u3",
        name: "Email_Attachment_Final.pdf",
        size: "8.2 MB",
        pages: 8,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
    ],
  },
];

// --- Components ---

interface DragItem {
  index: number;
  id: string;
  groupId: string;
  type: string;
}

const FilePill = ({
  file,
  index,
  groupId,
  allGroups,
  moveFile,
  onMoveTo,
  isDraggable = true,
  isUnclassified,
  onSplitRequest,
  onPreview,
  isSingleFile,
}: {
  file: FileType;
  index: number;
  groupId: string;
  allGroups: GroupType[];
  moveFile: (dragIndex: number, hoverIndex: number, groupId: string) => void;
  onMoveTo: (targetGroupId: string) => void;
  isDraggable?: boolean;
  isUnclassified?: boolean;
  onSplitRequest?: (id: string) => void;
  onPreview: (file: FileType) => void;
  isSingleFile?: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.FILE,
    item: () => {
      return { id: file.id, index, groupId };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: isDraggable,
  });

  if (isDraggable) {
    drag(ref);
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div
          ref={ref}
          onClick={() => {
            if (isUnclassified && onSplitRequest) {
              onSplitRequest(file.id);
            } else {
              onPreview(file);
            }
          }}
          className={`
            group flex items-center w-full gap-2 px-2 py-1.5 rounded-md border shadow-sm bg-white border-gray-200
            ${isDragging ? "opacity-50" : "opacity-100"}
            ${
              isDraggable
                ? "cursor-grab active:cursor-grabbing hover:border-gray-300"
                : "cursor-pointer"
            }
            ${
              isUnclassified
                ? "cursor-pointer hover:bg-blue-50 border-blue-200"
                : ""
            }
            transition-all
          `}
        >
          <div className="p-0.5 rounded bg-red-50 text-red-500 shrink-0">
            <FileText size={12} />
          </div>
          <div className="flex flex-col leading-none min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-gray-700 truncate">
                {file.name}
              </span>
              {file.isNew && !isSingleFile && (
                <span className="bg-green-100 text-green-700 text-[8px] px-1 py-0.5 rounded-full font-bold">
                  New
                </span>
              )}
            </div>
            <span className="text-[9px] text-gray-400 mt-0.5">{file.size}</span>
          </div>

          <div className="flex items-center gap-1">
            {isDraggable && !isUnclassified && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div
                    className="opacity-0 group-hover:opacity-100 text-gray-400 shrink-0 cursor-pointer p-0.5 hover:bg-gray-100 rounded"
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <MoreVertical size={12} />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 bg-white"
                  onClick={(e) => e.stopPropagation()}
                >
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreview(file);
                    }}
                  >
                    <Eye size={14} className="mr-2" />
                    Preview File
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-xs text-gray-500 font-normal">
                    Move to...
                  </DropdownMenuLabel>
                  {allGroups
                    .filter((g) => g.id !== groupId)
                    .map((g) => (
                      <DropdownMenuItem
                        key={g.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onMoveTo(g.id);
                        }}
                        className="cursor-pointer"
                      >
                        <span className="w-2 h-2 rounded-full mr-2 bg-gray-400"></span>
                        {g.title}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent side="right" align="start" className="w-64 p-2">
        <div className="space-y-2">
          <div className="relative aspect-[3/4] w-full bg-gray-100 rounded-md overflow-hidden border border-gray-200">
            <img
              src="https://images.unsplash.com/photo-1765445773776-d3b7ddd1b19b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N1bWVudCUyMHByZXZpZXclMjBibHVycnklMjB0ZXh0fGVufDF8fHx8MTc2NzY2MzUxNXww&ixlib=rb-4.1.0&q=80&w=400"
              alt="Document preview"
              className="object-cover w-full h-full opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-2">
              <p className="text-white text-xs font-medium truncate">
                {file.name}
              </p>
            </div>
          </div>
          <div className="text-[10px] text-gray-500">
            <p>Type: {file.type.toUpperCase()}</p>
            <p>
              Size: {file.size} • {file.pages || 1} pages
            </p>
            <p>Date: {file.date || "Unknown"}</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

const FilePreviewDialog = ({
  open,
  onOpenChange,
  file,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: FileType | null;
}) => {
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    if (open) setPageIndex(0);
  }, [open, file]);

  if (!file) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] p-0 flex flex-col overflow-hidden bg-gray-50">
        <DialogHeader className="px-6 py-4 bg-white border-b shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Eye size={18} className="text-gray-500" />
            Preview: {file.name}
          </DialogTitle>
          <DialogDescription>
            Read-only preview of source file. {file.pages || 1} pages.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Pages */}
          <div className="w-64 bg-gray-100 border-r overflow-y-auto p-4 flex flex-col gap-3">
            {Array.from({ length: file.pages || 1 }).map((_, idx) => (
              <div
                key={idx}
                onClick={() => setPageIndex(idx)}
                className={`
                                    cursor-pointer p-2 rounded border-2 transition-all flex gap-3 items-center
                                    ${
                                      pageIndex === idx
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-transparent hover:bg-gray-200"
                                    }
                                `}
              >
                <div className="w-10 h-14 bg-white border shrink-0 flex items-center justify-center text-[10px] text-gray-400">
                  {idx + 1}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Page {idx + 1}
                </span>
              </div>
            ))}
          </div>

          {/* Main View */}
          <div className="flex-1 bg-gray-500/10 p-8 flex items-center justify-center overflow-hidden">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden max-h-full aspect-[3/4] relative">
              <img
                src={`https://images.unsplash.com/photo-1765445773776-d3b7ddd1b19b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N1bWVudCUyMHByZXZpZXclMjBibHVycnklMjB0ZXh0fGVufDF8fHx8MTc2NzY2MzUxNXww&ixlib=rb-4.1.0&q=80&w=800`}
                alt={`Preview Page ${pageIndex + 1}`}
                className="object-contain w-full h-full"
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm backdrop-blur-md">
                Page {pageIndex + 1} of {file.pages || 1}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border-t flex justify-end shrink-0">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const FileSplitDialog = ({
  open,
  onOpenChange,
  file,
  onSplit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: FileType | null;
  onSplit: (
    originalFileId: string,
    selectedIndices: number[],
    newName: string
  ) => void;
}) => {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [previewIndex, setPreviewIndex] = useState<number>(0);
  const [splitName, setSplitName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);

  useEffect(() => {
    if (open) {
      setSelectedIndices([]);
      setPreviewIndex(0);
      setSplitName("");
      setShowNameInput(false);
    }
  }, [open, file]);

  if (!file) return null;

  const toggleSelection = (index: number) => {
    setSelectedIndices((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index].sort((a, b) => a - b)
    );
  };

  const handleSplitClick = () => {
    if (selectedIndices.length === 0) return;
    setSplitName(`${file.name.replace(".pdf", "")}_split.pdf`);
    setShowNameInput(true);
  };

  const handleConfirmSplit = () => {
    if (splitName.trim()) {
      onSplit(file.id, selectedIndices, splitName);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] p-0 flex flex-col overflow-hidden bg-gray-50">
        <DialogHeader className="px-6 py-4 bg-white border-b shrink-0">
          <DialogTitle>View & Split Document</DialogTitle>
          <DialogDescription>
            Select pages to extract into a new file.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Pages */}
          <div className="w-64 bg-gray-100 border-r overflow-y-auto p-4 flex flex-col gap-3">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Pages ({file.pages || 1})
            </h4>
            <div className="flex flex-col gap-3">
              {Array.from({ length: file.pages || 1 }).map((_, index) => {
                const isSelected = selectedIndices.includes(index);
                const isPreview = previewIndex === index;

                return (
                  <div
                    key={index}
                    onClick={() => setPreviewIndex(index)}
                    className={`
                         relative group rounded-md overflow-hidden border-2 cursor-pointer transition-all flex gap-2 p-2
                         ${
                           isPreview
                             ? "border-blue-500 bg-blue-50"
                             : "border-transparent hover:bg-gray-200"
                         }
                       `}
                  >
                    {/* Selection Checkbox Overlay */}
                    <div
                      className="absolute top-2 left-2 z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelection(index);
                      }}
                    >
                      <div
                        className={`
                           w-5 h-5 rounded border shadow-sm flex items-center justify-center transition-colors
                           ${
                             isSelected
                               ? "bg-blue-600 border-blue-600"
                               : "bg-white border-gray-300 hover:border-gray-400"
                           }
                         `}
                      >
                        {isSelected && (
                          <Check size={12} className="text-white" />
                        )}
                      </div>
                    </div>

                    <div className="w-12 h-16 bg-white border shrink-0 flex items-center justify-center text-[8px] text-gray-400 overflow-hidden relative">
                      <img
                        src="https://images.unsplash.com/photo-1765445773776-d3b7ddd1b19b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N1bWVudCUyMHByZXZpZXclMjBibHVycnklMjB0ZXh0fGVufDF8fHx8MTc2NzY2MzUxNXww&ixlib=rb-4.1.0&q=80&w=100"
                        alt={`Page ${index + 1}`}
                        className="w-full h-full object-cover opacity-50"
                      />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/5">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        Page {index + 1}
                      </span>
                      <span className="text-xs text-gray-500">
                        Click box to select
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Preview Area */}
          <div className="flex-1 bg-gray-500/10 p-8 flex items-center justify-center overflow-hidden">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden max-h-full aspect-[3/4] relative">
              <img
                src="https://images.unsplash.com/photo-1765445773776-d3b7ddd1b19b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N1bWVudCUyMHByZXZpZXclMjBibHVycnklMjB0ZXh0fGVufDF8fHx8MTc2NzY2MzUxNXww&ixlib=rb-4.1.0&q=80&w=800"
                alt="Preview"
                className="object-contain w-full h-full"
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm backdrop-blur-md">
                Page {previewIndex + 1}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t flex justify-between items-center shrink-0">
          {showNameInput ? (
            <div className="flex items-center gap-2 flex-1">
              <span className="text-sm font-medium text-gray-700">
                New File Name:
              </span>
              <Input
                value={splitName}
                onChange={(e) => setSplitName(e.target.value)}
                className="max-w-xs h-9"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleConfirmSplit()}
              />
              <button
                onClick={handleConfirmSplit}
                className="px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                Confirm Split
              </button>
              <button
                onClick={() => setShowNameInput(false)}
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <div className="text-sm text-gray-500">
                {selectedIndices.length} pages selected
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onOpenChange(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleSplitClick}
                  disabled={selectedIndices.length === 0}
                  className={`
                      px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm transition-colors
                      ${
                        selectedIndices.length > 0
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-gray-300 cursor-not-allowed"
                      }
                    `}
                >
                  Split Selected Pages
                </button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const MergedFilePreviewContent = ({
  fileName,
  totalPages,
}: {
  fileName: string;
  totalPages: number;
}) => {
  const [page, setPage] = useState(1);
  return (
    <div className="flex flex-col bg-white">
      <div className="relative aspect-[3/4] w-full bg-gray-100">
        <img
          src="https://images.unsplash.com/photo-1765445773776-d3b7ddd1b19b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N1bWVudCUyMHByZXZpZXclMjBibHVycnklMjB0ZXh0fGVufDF8fHx8MTc2NzY2MzUxNXww&ixlib=rb-4.1.0&q=80&w=400"
          alt="Document preview"
          className="object-cover w-full h-full opacity-90"
        />
        <button
          className="absolute top-2 right-2 p-1.5 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors backdrop-blur-sm z-10"
          onClick={(e) => {
            e.stopPropagation();
            alert(`Downloading ${fileName}`);
          }}
        >
          <Download size={14} />
        </button>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-4xl font-bold text-black/10 select-none">
            {page}
          </span>
        </div>
        <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white p-2 flex justify-between items-center backdrop-blur-sm">
          <button
            disabled={page === 1}
            onClick={(e) => {
              e.stopPropagation();
              setPage((p) => p - 1);
            }}
            className="p-1 hover:bg-white/20 rounded disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs font-medium tabular-nums">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={(e) => {
              e.stopPropagation();
              setPage((p) => p + 1);
            }}
            className="p-1 hover:bg-white/20 rounded disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div className="p-3 border-t">
        <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
        <p className="text-xs text-gray-500 mt-1">
          PDF Document • {totalPages} pages
        </p>
      </div>
    </div>
  );
};

const MergedFilePreview = ({
  fileName,
  fileCount,
  groupTitle,
  status,
  hasChanges,
  onReview,
  onRename,
  totalSize,
  totalPages,
}: {
  fileName?: string;
  fileCount: number;
  groupTitle: string;
  status: "pending" | "reviewed";
  hasChanges?: boolean;
  onReview: () => void;
  onRename: () => void;
  totalSize: string;
  totalPages: number;
}) => {
  // Approximate pages as fileCount * 2 or default to 5
  const displayFileName = fileName || `${groupTitle}.pdf`;

  const isPendingReview = status === "pending";
  const cardStyle = isPendingReview
    ? "bg-white hover:bg-amber-50/50 border-amber-400 hover:ring-4 hover:ring-amber-100 hover:shadow-[0_0_15px_rgba(251,191,36,0.2)]"
    : "bg-white hover:bg-blue-50/50 border-blue-200 hover:border-blue-300 shadow-sm hover:shadow-md";

  return (
    <div
      onClick={onReview}
      className={`border rounded-lg p-3 flex items-center gap-3 cursor-pointer transition-all duration-200 group relative ${cardStyle}`}
    >
      <div className="bg-red-50 p-2 rounded-lg text-red-500 relative shrink-0">
        <FileText size={24} />
        <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-[9px] font-bold px-1 rounded-full border border-white">
          {fileCount}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">
          {displayFileName}
        </p>
        <p className="text-xs text-gray-500 truncate">
          {totalSize} • {totalPages} Pages
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0"></div>
    </div>
  );
};

const GroupContainer = ({
  group,
  allGroups,
  onDropFile,
  moveFile,
  onDelete,
  onRename,
  onOpenReview,
  onSplitRequest,
  onPreview,
}: {
  group: GroupType;
  allGroups: GroupType[];
  onDropFile: (fileId: string, groupId: string) => void;
  moveFile: (dragIndex: number, hoverIndex: number, groupId: string) => void;
  onDelete: (groupId: string) => void;
  onRename: (groupId: string, newTitle: string) => void;
  onOpenReview: (groupId: string) => void;
  onSplitRequest?: (fileId: string) => void;
  onPreview: (file: FileType) => void;
}) => {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.FILE,
      drop: (item: { id: string; groupId: string }) => {
        if (item.groupId !== group.id) {
          onDropFile(item.id, group.id);
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    [group.id, onDropFile]
  );

  const [isSourceCollapsed, setIsSourceCollapsed] = useState(true);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(group.title);

  const totalPages = group.files.reduce((acc, f) => acc + (f.pages || 0), 0);
  const totalSizeMB = group.files.reduce((acc, f) => {
    const match = f.size.match(/([\d.]+)\s*([a-zA-Z]+)/);
    if (match) {
      const val = parseFloat(match[1]);
      const unit = match[2].toUpperCase();
      return acc + (unit === "KB" ? val / 1024 : val);
    }
    return acc;
  }, 0);
  const totalSize =
    totalSizeMB < 1
      ? (totalSizeMB * 1024).toFixed(0) + " KB"
      : totalSizeMB.toFixed(1) + " MB";

  const canDelete = group.files.length === 0 && group.id !== "unclassified";
  const showMergedView = group.files.length >= 2 && group.id !== "unclassified";
  const isUnclassified = group.id === "unclassified";

  const handleRenameSubmit = () => {
    if (newTitle.trim()) {
      onRename(group.id, newTitle);
    } else {
      setNewTitle(group.mergedFileName || group.title);
    }
    setIsRenaming(false);
  };

  return (
    <>
      <div
        ref={drop as unknown as React.LegacyRef<HTMLDivElement>}
        className={`rounded-xl p-4 transition-all duration-200 ${
          isOver
            ? "bg-blue-50/50 ring-2 ring-blue-100 border-2 border-blue-200 shadow-lg scale-[1.01]"
            : isUnclassified
            ? "bg-slate-50/50 border-2 border-dashed border-slate-200 shadow-sm hover:border-slate-300"
            : "bg-white border border-gray-100 shadow-sm hover:shadow-md"
        }`}
      >
        {/* Group Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {isUnclassified ? (
              <span className="text-sm font-semibold text-gray-500 px-2">
                {group.title}
              </span>
            ) : (
              <span className="text-sm font-semibold px-2 py-1 rounded-md bg-gray-100 text-gray-700 border border-gray-200">
                {group.title}
              </span>
            )}
            {/* Status Badges */}
            {!isUnclassified && group.files.length > 0 && (
              <>
                {group.files.length === 1 || group.status === "reviewed" ? (
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700 flex items-center gap-1 whitespace-nowrap">
                      <Check size={10} strokeWidth={3} />
                      Ready
                    </div>
                    {group.files.length >= 2 && group.hasChanges && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="text-amber-500 bg-amber-50 rounded-full p-1">
                              <AlertCircle size={16} />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Content changed. Click to review.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                ) : (
                  <div className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap">
                    Pending Review
                  </div>
                )}
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {showMergedView && group.status === "reviewed" && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Mock download action
                        console.log("Downloading", group.mergedFileName);
                      }}
                      className="text-gray-400 hover:text-blue-600 p-1 hover:bg-blue-50 rounded transition-colors"
                    >
                      <Download size={16} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download Merged File</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {!isUnclassified && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-50 rounded">
                    <MoreVertical size={16} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {showMergedView && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setNewTitle(group.mergedFileName || group.title);
                        setIsRenaming(true);
                      }}
                    >
                      <Pencil size={14} className="mr-2" />
                      Rename Merged File
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    disabled={!canDelete}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (canDelete) setShowDeleteAlert(true);
                    }}
                    className={`focus:bg-red-50 focus:text-red-700 ${
                      canDelete
                        ? "text-red-600 cursor-pointer"
                        : "text-gray-300 cursor-not-allowed"
                    }`}
                  >
                    <Trash2 size={14} className="mr-2" />
                    Delete Container
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Merged File View */}
        {showMergedView && (
          <div className="mb-3">
            {isRenaming ? (
              <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-blue-200 shadow-sm mb-2">
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="h-8 text-sm"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRenameSubmit();
                    if (e.key === "Escape") {
                      setNewTitle(group.mergedFileName || group.title);
                      setIsRenaming(false);
                    }
                  }}
                />
                <button
                  onClick={handleRenameSubmit}
                  className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => {
                    setNewTitle(group.mergedFileName || group.title);
                    setIsRenaming(false);
                  }}
                  className="p-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <MergedFilePreview
                fileName={group.mergedFileName}
                fileCount={group.files.length}
                groupTitle={group.title}
                status={group.status}
                hasChanges={group.hasChanges}
                totalSize={totalSize}
                totalPages={totalPages}
                onReview={() => onOpenReview(group.id)}
                onRename={() => {
                  setNewTitle(group.mergedFileName || group.title);
                  setIsRenaming(true);
                }}
              />
            )}
          </div>
        )}

        {/* Source Files (Collapsible if merged) */}
        <div className="space-y-2">
          {showMergedView && (
            <button
              onClick={() => setIsSourceCollapsed(!isSourceCollapsed)}
              className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-blue-800 mb-2"
            >
              {isSourceCollapsed ? (
                <ChevronRight size={14} />
              ) : (
                <ChevronDown size={14} />
              )}
              {isSourceCollapsed ? "Show source files" : "Hide source files"}
            </button>
          )}

          <AnimatePresence>
            {(!isSourceCollapsed || !showMergedView) && (
              <motion.div
                initial={showMergedView ? { height: 0, opacity: 0 } : false}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="flex flex-col gap-2"
              >
                {group.files.map((file, index) => (
                  <FilePill
                    key={file.id}
                    file={file}
                    index={index}
                    groupId={group.id}
                    allGroups={allGroups}
                    moveFile={moveFile}
                    onMoveTo={(targetGroupId) =>
                      onDropFile(file.id, targetGroupId)
                    }
                    isDraggable={true}
                    isUnclassified={isUnclassified}
                    onSplitRequest={onSplitRequest}
                    onPreview={onPreview}
                    isSingleFile={group.files.length === 1}
                  />
                ))}
                {group.files.length === 0 && (
                  <div className="py-6 flex items-center justify-center text-xs text-gray-400 italic">
                    Container is empty
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Group?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{group.title}"? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete(group.id);
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

const RightSidebar = () => {
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reviewingGroupId, setReviewingGroupId] = useState<string | null>(null);

  const handleUploadDocuments = async () => {
    setIsLoading(true);
    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setGroups(INITIAL_GROUPS);
    setIsLoading(false);
  };

  const handleDropFile = (fileId: string, targetGroupId: string) => {
    // Special handling for split request
    if (targetGroupId === "SPLIT_REQUEST") {
      let file: FileType | undefined;
      for (const g of groups) {
        const found = g.files.find((f) => f.id === fileId);
        if (found) {
          file = found;
          break;
        }
      }
      if (file) {
        setFileToSplit(file);
      }
      return;
    }

    setGroups((prevGroups) => {
      // Find the file and its current group
      let file: FileType | undefined;
      let sourceGroupId: string | undefined;

      for (const g of prevGroups) {
        const found = g.files.find((f) => f.id === fileId);
        if (found) {
          file = found;
          sourceGroupId = g.id;
          break;
        }
      }

      if (!file || !sourceGroupId || sourceGroupId === targetGroupId)
        return prevGroups;

      return prevGroups.map((group) => {
        // Remove from source
        if (group.id === sourceGroupId) {
          const remainingFiles = group.files.filter((f) => f.id !== fileId);
          const wasReviewed = group.status === "reviewed";
          return {
            ...group,
            files: remainingFiles,
            // If it was reviewed and we removed a file, it needs review again
            status: wasReviewed ? "pending" : group.status,
            hasChanges: wasReviewed ? true : group.hasChanges,
          };
        }
        // Add to target
        if (group.id === targetGroupId) {
          const wasReviewed = group.status === "reviewed";
          return {
            ...group,
            status: wasReviewed ? "pending" : group.status,
            hasChanges: wasReviewed ? true : group.hasChanges,
            // Prepend new file so it appears at the top
            files: [{ ...file!, isNew: true }, ...group.files],
          };
        }
        return group;
      });
    });
  };

  const handleReorder = (
    dragIndex: number,
    hoverIndex: number,
    groupId: string
  ) => {
    setGroups((prevGroups) => {
      const newGroups = [...prevGroups];
      const groupIndex = newGroups.findIndex((g) => g.id === groupId);
      if (groupIndex === -1) return prevGroups;

      const group = newGroups[groupIndex];
      const newFiles = [...group.files];

      const [draggedFile] = newFiles.splice(dragIndex, 1);
      newFiles.splice(hoverIndex, 0, draggedFile);

      const isReviewed = group.status === "reviewed";
      newGroups[groupIndex] = {
        ...group,
        files: newFiles,
        hasChanges: isReviewed ? true : group.hasChanges,
      };
      return newGroups;
    });
  };

  const handleAddGroup = (templateName: string) => {
    // Determine suffix by finding max existing suffix for this tag
    let maxSuffix = 0;
    let hasBase = false;

    groups.forEach((g) => {
      if (g.tag !== templateName) return;
      if (g.title === templateName) {
        hasBase = true;
      } else if (g.title.startsWith(templateName + " ")) {
        const suffixStr = g.title.substring(templateName.length + 1);
        const suffix = parseInt(suffixStr, 10);
        if (!isNaN(suffix) && suffix > maxSuffix) {
          maxSuffix = suffix;
        }
      }
    });

    let newTitle = templateName;
    if (hasBase || maxSuffix > 0) {
      newTitle = `${templateName} ${maxSuffix + 1}`;
    }

    const newGroup: GroupType = {
      id: `group_${Date.now()}`,
      title: newTitle,
      tag: templateName,
      mergedFileName: `${newTitle}.pdf`,
      status: "pending",
      files: [],
    };

    setGroups((prev) => {
      // Insert new group before 'unclassified' if it exists
      const unclassifiedIndex = prev.findIndex((g) => g.id === "unclassified");
      if (unclassifiedIndex === -1) return [newGroup, ...prev];

      const newGroups = [...prev];
      newGroups.splice(unclassifiedIndex, 0, newGroup);
      return newGroups;
    });
  };

  const handleRenameGroup = (groupId: string, newTitle: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        // Only rename mergedFileName
        if (g.id === groupId) {
          return { ...g, mergedFileName: newTitle };
        }
        return g;
      })
    );
  };

  const handleDeleteGroup = (groupId: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
  };

  const handleConfirmReview = (groupId: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              status: "reviewed",
              hasChanges: false,
              // Clear isNew flag from all files in the group
              files: g.files.map((f) => ({ ...f, isNew: false })),
            }
          : g
      )
    );
  };

  const handleSplit = (
    originalFileId: string,
    selectedIndices: number[],
    newName: string
  ) => {
    setGroups((prev) =>
      prev.map((group) => {
        if (group.id !== "unclassified") return group;

        const originalFile = group.files.find((f) => f.id === originalFileId);
        if (!originalFile) return group;

        const newFilePages = selectedIndices.length;
        const remainingPages = (originalFile.pages || 1) - newFilePages;

        let newFiles = [...group.files];

        // Update or remove original file
        if (remainingPages > 0) {
          newFiles = newFiles.map((f) =>
            f.id === originalFileId ? { ...f, pages: remainingPages } : f
          );
        } else {
          newFiles = newFiles.filter((f) => f.id !== originalFileId);
        }

        // Create and add new file
        const newFile: FileType = {
          id: `split_${Date.now()}`,
          name: newName.endsWith(".pdf") ? newName : `${newName}.pdf`,
          size: "1 MB",
          pages: newFilePages,
          type: originalFile.type,
          date: "Just now",
          isNew: true,
        };

        newFiles.push(newFile);

        return { ...group, files: newFiles };
      })
    );
  };

  const [fileToSplit, setFileToSplit] = useState<FileType | null>(null);
  const [fileToPreview, setFileToPreview] = useState<FileType | null>(null);

  return (
    <div className="w-[382px] flex flex-col h-full bg-white border-l border-gray-200 shrink-0">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="font-bold text-gray-800">Documents</span>
          {/* Pending Review Badge */}
          {(() => {
            const trackable = groups.filter((g) => g.id !== "unclassified");
            const pendingCount = trackable.filter(
              (g) => g.status === "pending" && g.files.length > 1
            ).length;
            if (pendingCount === 0) return null;
            return (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                {pendingCount} pending review
              </span>
            );
          })()}
        </div>
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 outline-none">
                <Plus size={20} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Add Group from Template</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleAddGroup("Bank Statement")}
              >
                Bank Statement
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddGroup("Passport")}>
                Passport
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddGroup("Utility Bill")}>
                Utility Bill
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleAddGroup("Additional Documents")}
              >
                Additional Documents
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Group List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          /* Loading State */
          <div className="flex flex-col items-center justify-center h-full py-12">
            <div className="w-10 h-10 border-3 border-gray-200 border-t-[#0E4369] rounded-full animate-spin mb-4" />
            <p className="text-sm font-medium text-gray-700">Processing documents...</p>
            <p className="text-xs text-gray-400 mt-1">AI is analyzing and categorizing files</p>
          </div>
        ) : groups.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-full py-12 px-6">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">No documents yet</h3>
            <p className="text-sm text-gray-500 text-center mb-6">
              Upload documents to get started. AI will automatically categorize and organize them.
            </p>
            <button
              onClick={handleUploadDocuments}
              className="px-4 py-2.5 bg-[#0E4369] text-white text-sm font-medium rounded-lg hover:bg-[#0B3654] transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              Upload Documents
            </button>
          </div>
        ) : (
          /* Document Groups */
          groups.map((group) => (
            <GroupContainer
              key={group.id}
              group={group}
              allGroups={groups}
              onDropFile={handleDropFile}
              moveFile={handleReorder}
              onDelete={handleDeleteGroup}
              onRename={handleRenameGroup}
              onOpenReview={setReviewingGroupId}
              onSplitRequest={(fileId) => {
                const file = group.files.find((f) => f.id === fileId);
                if (file) setFileToSplit(file);
              }}
              onPreview={(file) => setFileToPreview(file)}
            />
          ))
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-gray-800">
            xeni-intake@msg.xeni.legal
          </div>
          <Copy
            size={14}
            className="text-gray-400 cursor-pointer hover:text-gray-600"
          />
        </div>
        <p className="text-xs text-gray-500 leading-tight">
          Forward client emails here. AI will extract info and create cases automatically.
        </p>
      </div>

      <FileSplitDialog
        open={!!fileToSplit}
        onOpenChange={(open) => !open && setFileToSplit(null)}
        file={fileToSplit}
        onSplit={handleSplit}
      />
      <FilePreviewDialog
        open={!!fileToPreview}
        onOpenChange={(open) => !open && setFileToPreview(null)}
        file={fileToPreview}
      />

      {/* New Review Dialog */}
      <NewReviewDialog
        open={!!reviewingGroupId}
        onOpenChange={(open) => !open && setReviewingGroupId(null)}
        groups={groups}
        currentGroupId={reviewingGroupId || ""}
        onGroupChange={setReviewingGroupId}
        onReorder={handleReorder}
        onMoveToGroup={(fileId, sourceGroupId, targetGroupId) => {
          setGroups((prev) => {
            const sourceGroup = prev.find((g) => g.id === sourceGroupId);
            const file = sourceGroup?.files.find((f) => f.id === fileId);
            if (!file) return prev;

            return prev.map((g) => {
              if (g.id === sourceGroupId) {
                return {
                  ...g,
                  files: g.files.filter((f) => f.id !== fileId),
                  hasChanges: true,
                };
              }
              if (g.id === targetGroupId) {
                return { ...g, files: [...g.files, file], hasChanges: true };
              }
              return g;
            });
          });
        }}
        onConfirm={() => {
          if (reviewingGroupId) {
            handleConfirmReview(reviewingGroupId);
          }
        }}
      />
    </div>
  );
};
// ... rest of the file (IconHome, Header, Dashboard, MainContent, App) remains same but I must include it because write_tool overwrites ...
// I will reuse the previous read content for the rest.

// --- Static SVG Components from original design ---
// I'll define wrappers for the imported SVGs to keep the left side consistent

function IconHome() {
  return (
    <div className="size-[16px] flex items-center justify-center">
      <svg className="block size-full" fill="none" viewBox="0 0 16 16">
        <path d={svgPaths.p30d8e900} fill="#5F6368" />
      </svg>
    </div>
  );
}

// --- Main App Layout ---

function Header() {
  const params = useParams();
  const caseId = params.caseId as string;
  const caseData = getCaseById(caseId);

  const applicantName = caseData
    ? `${caseData.applicant.passport.givenNames} ${caseData.applicant.passport.surname}`
    : 'New Case';

  const visaLabel = caseData?.visaType
    ? VISA_TYPES[caseData.visaType]?.label
    : null;

  const headerTitle = visaLabel
    ? `${applicantName} - ${visaLabel}`
    : applicantName;

  return (
    <div className="bg-white h-[50px] border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <Link
          href="/cases"
          className="w-5 h-5 bg-black rounded-sm flex items-center justify-center text-white font-bold text-xs hover:bg-gray-800 transition-colors"
        >
          X
        </Link>
        <div className="h-4 w-px bg-gray-300"></div>
        <div className="flex items-center gap-2 text-sm">
          <Link
            href="/cases"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cases
          </Link>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="font-medium text-gray-900">
            {headerTitle}
          </span>
          <span className="bg-blue-50 text-blue-500 text-[10px] font-bold px-2 py-0.5 rounded">
            IN PROGRESS
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-gray-500">
          <MoreVertical size={18} />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 text-xs font-bold">
            SJ
          </div>
        </div>
      </div>
    </div>
  );
}

function MainContent() {
  const params = useParams();
  const caseId = params.caseId as string;
  const caseData = getCaseById(caseId);
  const { initializeApplication, application, resetApplication } = useCommandCenterStore();

  // Initialize or reset application state when entering case or switching cases
  useEffect(() => {
    if (caseId) {
      // If no application exists, or if switching to a different case, initialize
      if (!application || application.caseId !== caseId) {
        initializeApplication(caseId);
      }
    }
  }, [caseId, application, initializeApplication]);

  const caseName = caseData
    ? `${caseData.applicant.passport.givenNames} ${caseData.applicant.passport.surname}`
    : undefined;

  return (
    <div className="flex-1 overflow-hidden">
      <CommandCenterLayout
        leftPanel={null}
        mainContent={<ApplicationChecklist caseName={caseName} />}
        rightPanel={<DocumentsPanel />}
      />
      <BuildApplicationModal />
      <VerificationWorkbench />
    </div>
  );
}

export default function MainApp() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen w-full flex flex-col bg-white overflow-hidden font-sans">
        <Header />
        <MainContent />
      </div>
    </DndProvider>
  );
}
