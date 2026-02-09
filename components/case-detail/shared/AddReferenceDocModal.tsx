"use client";

import { useState } from "react";
import { X, Check, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { DocumentGroup } from "@/types/case-detail";
import { DocumentPreviewContent } from "./DocumentPreviewContent";

interface AddReferenceDocModalProps {
  documentGroups: DocumentGroup[];
  onClose: () => void;
  onLinkGroup?: (groupId: string) => void;
}

export function AddReferenceDocModal({
  documentGroups,
  onClose,
  onLinkGroup,
}: AddReferenceDocModalProps) {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  // Only show classified groups that have active files
  const classifiedGroups = documentGroups.filter(
    (g) => g.id !== "unclassified" && g.files.filter((f) => !f.isRemoved).length > 0
  );

  const hasDocuments = classifiedGroups.length > 0;

  const handleConfirm = () => {
    if (selectedGroupId && onLinkGroup) {
      onLinkGroup(selectedGroupId);
    }
    onClose();
  };

  const hasSelection = selectedGroupId !== null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-[720px] max-w-[92vw] h-[520px] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="shrink-0 px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-stone-900">Add Reference Document</h2>
            <p className="text-sm text-stone-500 mt-0.5">
              Select a reviewed document from File Hub
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 p-6">
          {hasDocuments ? (
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-3 shrink-0">
                <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">
                  Documents
                </p>
                <span className="text-[10px] text-stone-400 tabular-nums">
                  {classifiedGroups.filter((g) => g.status === "reviewed").length} ready
                  {classifiedGroups.some((g) => g.status === "pending") && (
                    <span className="text-stone-300">
                      {" · "}
                      {classifiedGroups.filter((g) => g.status === "pending").length} pending
                    </span>
                  )}
                </span>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto">
                <div className="grid grid-cols-3 gap-3 auto-rows-min content-start">
                  {classifiedGroups.map((group) => {
                    const activeFiles = group.files.filter((f) => !f.isRemoved);
                    const isReviewed = group.status === "reviewed";
                    const isPending = group.status === "pending";
                    const isSelectable = isReviewed;
                    const isSelected = selectedGroupId === group.id;

                    return (
                      <button
                        key={group.id}
                        onClick={() => {
                          if (!isSelectable) return;
                          setSelectedGroupId(isSelected ? null : group.id);
                        }}
                        disabled={!isSelectable}
                        className={cn(
                          "rounded-xl border-2 overflow-hidden text-left transition-all",
                          isSelected
                            ? "border-[#0E4268] ring-2 ring-[#0E4268]/20 shadow-sm"
                            : isSelectable
                              ? "border-stone-200 hover:border-stone-300 hover:shadow-sm"
                              : "border-stone-200 opacity-50 cursor-not-allowed"
                        )}
                      >
                        {/* Thumbnail area */}
                        <div className="aspect-[4/3] bg-stone-50 p-3 flex items-center justify-center relative">
                          <div className="h-full aspect-[1/1.414] bg-white rounded-md border border-stone-200 shadow-sm p-2">
                            <DocumentPreviewContent />
                          </div>
                          {/* Status badge */}
                          <div className="absolute top-2 right-2">
                            {isPending ? (
                              <span className="px-1.5 py-0.5 text-[9px] font-semibold text-amber-700 bg-amber-100 rounded">
                                Pending
                              </span>
                            ) : isReviewed ? (
                              <span className="px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700 bg-emerald-100 rounded flex items-center gap-0.5">
                                <Check size={8} strokeWidth={3} />
                                Ready
                              </span>
                            ) : null}
                          </div>
                          {/* Selection indicator */}
                          {isSelected && (
                            <div className="absolute top-2 left-2 size-5 rounded-full bg-[#0E4268] flex items-center justify-center shadow-sm">
                              <Check className="size-3 text-white" strokeWidth={3} />
                            </div>
                          )}
                        </div>
                        {/* Title and info */}
                        <div className="px-2.5 py-2 border-t border-stone-100">
                          <p
                            className={cn(
                              "text-xs font-medium truncate transition-colors",
                              isSelected ? "text-[#0E4268]" : "text-stone-700"
                            )}
                          >
                            {group.title}
                          </p>
                          <p className="text-[10px] text-stone-400 tabular-nums mt-0.5">
                            {activeFiles.length} page{activeFiles.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-stone-400">
              <FolderOpen className="size-8 mb-2" />
              <p className="text-sm font-medium">No documents in File Hub</p>
              <p className="text-xs mt-1">Upload and review files to get started</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 border-t border-stone-200 bg-stone-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!hasSelection}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              hasSelection
                ? "bg-[#0E4268] text-white hover:bg-[#0a3555]"
                : "bg-stone-200 text-stone-400 cursor-not-allowed"
            )}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
