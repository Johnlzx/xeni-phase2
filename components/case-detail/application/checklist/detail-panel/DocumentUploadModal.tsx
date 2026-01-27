"use client";

import { useState } from "react";
import {
  Upload,
  X,
  FolderOpen,
  FileText,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RequiredEvidence, DocumentGroup } from "@/types/case-detail";
import { useCaseDetailStore, useDocumentGroups } from "@/store/case-detail-store";

// Document Preview Content - Simulates scanned document appearance
function DocumentPreviewContent() {
  return (
    <div className="space-y-0.5">
      <div className="h-0.5 bg-stone-300 rounded w-1/3" />
      <div className="h-0.5 bg-stone-200 rounded w-1/4 mt-1" />
      <div className="h-0.5 bg-stone-200 rounded w-full mt-1" />
      <div className="h-0.5 bg-stone-200 rounded w-full" />
      <div className="h-0.5 bg-stone-200 rounded w-5/6" />
    </div>
  );
}

interface DocumentUploadModalProps {
  evidence: RequiredEvidence;
  onClose: () => void;
}

export function DocumentUploadModal({ evidence, onClose }: DocumentUploadModalProps) {
  const documentGroups = useDocumentGroups();
  const uploadForEvidence = useCaseDetailStore((state) => state.uploadForEvidence);
  const linkEvidenceToGroup = useCaseDetailStore((state) => state.linkEvidenceToGroup);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Filter to classified groups with files
  const classifiedGroups = documentGroups.filter(
    (g) => g.id !== "unclassified" && g.files.filter((f) => !f.isRemoved).length > 0
  );

  const handleUpload = () => {
    uploadForEvidence(evidence.id, evidence.name);
    onClose();
  };

  const handleLink = () => {
    if (selectedGroupId) {
      linkEvidenceToGroup(evidence.id, selectedGroupId);
      onClose();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    // Trigger upload flow
    handleUpload();
  };

  const hasExistingDocuments = classifiedGroups.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-[720px] max-w-[90vw] max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="shrink-0 px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-stone-900 text-balance">
              Add: {evidence.name}
            </h2>
            {evidence.description && (
              <p className="text-sm text-stone-500 mt-0.5 line-clamp-1">
                {evidence.description}
              </p>
            )}
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
        <div className="flex-1 overflow-auto p-6">
          {/* Upload Zone */}
          <div>
            <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-3">
              Upload New File
            </p>
            <button
              onClick={handleUpload}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "w-full py-10 rounded-xl border-2 border-dashed transition-colors flex flex-col items-center justify-center gap-3",
                isDragOver
                  ? "border-[#0E4268] bg-[#0E4268]/5"
                  : "border-stone-300 bg-stone-50 hover:border-stone-400 hover:bg-stone-100"
              )}
            >
              <div
                className={cn(
                  "size-14 rounded-full flex items-center justify-center transition-colors",
                  isDragOver ? "bg-[#0E4268]/10" : "bg-stone-200"
                )}
              >
                <Upload
                  className={cn(
                    "size-6 transition-colors",
                    isDragOver ? "text-[#0E4268]" : "text-stone-500"
                  )}
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-stone-700">
                  Click to upload or drag files here
                </p>
                <p className="text-xs text-stone-500 mt-1">PDF, JPG, PNG</p>
              </div>
            </button>
          </div>

          {/* Divider */}
          {hasExistingDocuments && (
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-stone-200" />
              <span className="text-xs font-medium text-stone-400 uppercase tracking-wide">
                Or
              </span>
              <div className="flex-1 h-px bg-stone-200" />
            </div>
          )}

          {/* Link from File Hub */}
          {hasExistingDocuments && (
            <div>
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-3">
                Link from File Hub
              </p>
              <div className="grid grid-cols-4 gap-3">
                {classifiedGroups.map((group) => {
                  const activeFiles = group.files.filter((f) => !f.isRemoved);
                  const isSelected = selectedGroupId === group.id;
                  const isPending = group.status === "pending";
                  const isReviewed = group.status === "reviewed";

                  return (
                    <button
                      key={group.id}
                      onClick={() => setSelectedGroupId(isSelected ? null : group.id)}
                      className={cn(
                        "rounded-lg border-2 overflow-hidden text-left transition-all",
                        isSelected
                          ? "border-[#0E4268] ring-1 ring-[#0E4268]/20"
                          : isPending
                          ? "border-amber-200 hover:border-amber-300"
                          : "border-stone-200 hover:border-stone-300"
                      )}
                    >
                      {/* Thumbnail */}
                      <div className="aspect-[4/3] bg-stone-50 p-2 flex items-center justify-center relative">
                        <div className="h-full aspect-[1/1.414] bg-white rounded border border-stone-200 p-1.5">
                          <DocumentPreviewContent />
                        </div>
                        {/* Status badge */}
                        <div className="absolute top-1.5 right-1.5">
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
                          <div className="absolute top-1.5 left-1.5 size-5 rounded-full bg-[#0E4268] flex items-center justify-center">
                            <Check className="size-3 text-white" strokeWidth={3} />
                          </div>
                        )}
                      </div>
                      {/* Title and info */}
                      <div className="px-2 py-1.5 border-t border-stone-100">
                        <p
                          className={cn(
                            "text-xs font-medium truncate transition-colors",
                            isSelected ? "text-[#0E4268]" : "text-stone-700"
                          )}
                        >
                          {group.title}
                        </p>
                        <p className="text-[10px] text-stone-400 tabular-nums">
                          {activeFiles.length} page{activeFiles.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty state for File Hub */}
          {!hasExistingDocuments && (
            <div className="mt-6 pt-6 border-t border-stone-200">
              <div className="flex flex-col items-center justify-center py-6 text-stone-400">
                <FolderOpen className="size-8 mb-2" />
                <p className="text-sm font-medium">No documents in File Hub</p>
                <p className="text-xs mt-1">Upload files to get started</p>
              </div>
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
          {selectedGroupId ? (
            <button
              onClick={handleLink}
              className="px-4 py-2 text-sm font-medium bg-[#0E4268] text-white hover:bg-[#0a3555] rounded-lg transition-colors"
            >
              Link Selected
            </button>
          ) : (
            <button
              onClick={handleUpload}
              className="px-4 py-2 text-sm font-medium bg-[#0E4268] text-white hover:bg-[#0a3555] rounded-lg transition-colors"
            >
              Upload
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
