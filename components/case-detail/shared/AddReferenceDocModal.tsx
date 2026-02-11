"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { X, Check, FolderOpen, FileText, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { DocumentGroup } from "@/types/case-detail";
import { useCaseDetailStore } from "@/store/case-detail-store";

// Section ID → short display label
const SECTION_LABELS: Record<string, string> = {
  personal: "Personal",
  employment: "Employment",
  financial: "Financial",
  travel: "Travel",
  education: "Education",
  family: "Family",
  other: "Other",
};

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

  // Read section linkage data from store
  const sectionReferenceDocIds = useCaseDetailStore((s) => s.sectionReferenceDocIds);
  const assessmentReferenceDocIds = useCaseDetailStore((s) => s.assessmentReferenceDocIds);

  // Only show classified groups that have active files
  const classifiedGroups = useMemo(
    () =>
      documentGroups.filter(
        (g) => g.id !== "unclassified" && g.files.filter((f) => !f.isRemoved).length > 0
      ),
    [documentGroups]
  );

  // Compute linked sections for a given group ID
  const linkedSectionsMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    classifiedGroups.forEach((group) => {
      const sections: string[] = [];
      if (assessmentReferenceDocIds.includes(group.id)) {
        sections.push("Assessment");
      }
      Object.entries(sectionReferenceDocIds).forEach(([sectionId, groupIds]) => {
        if (groupIds.includes(group.id)) {
          sections.push(SECTION_LABELS[sectionId] || sectionId);
        }
      });
      map[group.id] = sections;
    });
    return map;
  }, [classifiedGroups, sectionReferenceDocIds, assessmentReferenceDocIds]);

  const hasDocuments = classifiedGroups.length > 0;
  const hasSelection = selectedGroupId !== null;
  const reviewedCount = classifiedGroups.filter((g) => g.status === "reviewed").length;
  const pendingCount = classifiedGroups.filter((g) => g.status === "pending").length;

  const handleConfirm = () => {
    if (selectedGroupId && onLinkGroup) {
      onLinkGroup(selectedGroupId);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Bottom sheet */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="absolute inset-x-0 bottom-0 top-16 bg-white rounded-t-2xl shadow-2xl flex flex-col overflow-hidden"
      >
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
        {hasDocuments ? (
          <div className="flex-1 min-h-0 flex flex-col">
            {/* Stats bar */}
            <div className="shrink-0 px-6 py-2.5 border-b border-stone-100 flex items-center gap-3">
              <span className="text-xs text-stone-500 tabular-nums">
                {reviewedCount} ready
                {pendingCount > 0 && (
                  <span className="text-stone-300"> · {pendingCount} pending review</span>
                )}
              </span>
            </div>

            {/* Table */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 z-10 bg-stone-50 border-b border-stone-200">
                  <tr>
                    <th className="w-10 px-3 py-2.5" />
                    <th className="text-left text-[11px] font-semibold text-stone-500 uppercase tracking-wider px-3 py-2.5">
                      Document
                    </th>
                    <th className="text-left text-[11px] font-semibold text-stone-500 uppercase tracking-wider px-3 py-2.5 w-24">
                      Status
                    </th>
                    <th className="text-left text-[11px] font-semibold text-stone-500 uppercase tracking-wider px-3 py-2.5 w-20">
                      Pages
                    </th>
                    <th className="text-left text-[11px] font-semibold text-stone-500 uppercase tracking-wider px-3 py-2.5">
                      Linked Sections
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {classifiedGroups.map((group) => {
                    const activeFiles = group.files.filter((f) => !f.isRemoved);
                    const isReviewed = group.status === "reviewed";
                    const isSelectable = isReviewed;
                    const isSelected = selectedGroupId === group.id;
                    const linked = linkedSectionsMap[group.id] || [];

                    return (
                      <tr
                        key={group.id}
                        onClick={() => {
                          if (!isSelectable) return;
                          setSelectedGroupId(isSelected ? null : group.id);
                        }}
                        className={cn(
                          "transition-colors",
                          isSelectable
                            ? "cursor-pointer hover:bg-stone-50"
                            : "opacity-40 cursor-not-allowed",
                          isSelected && "bg-[#0E4268]/5 hover:bg-[#0E4268]/5"
                        )}
                      >
                        {/* Selection indicator */}
                        <td className="px-3 py-3 text-center">
                          {isSelected ? (
                            <div className="mx-auto size-5 rounded-full bg-[#0E4268] flex items-center justify-center">
                              <Check className="size-3 text-white" strokeWidth={3} />
                            </div>
                          ) : (
                            <Circle
                              className={cn(
                                "mx-auto size-5",
                                isSelectable ? "text-stone-300" : "text-stone-200"
                              )}
                              strokeWidth={1.5}
                            />
                          )}
                        </td>

                        {/* Document name */}
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2.5">
                            <FileText
                              className={cn(
                                "size-4 shrink-0",
                                isSelected ? "text-[#0E4268]" : "text-stone-400"
                              )}
                            />
                            <span
                              className={cn(
                                "text-sm font-medium truncate",
                                isSelected ? "text-[#0E4268]" : "text-stone-700"
                              )}
                            >
                              {group.title}
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-3 py-3">
                          {isReviewed ? (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded">
                              <Check size={10} strokeWidth={3} />
                              Reviewed
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-100 rounded">
                              Pending
                            </span>
                          )}
                        </td>

                        {/* Pages */}
                        <td className="px-3 py-3">
                          <span className="text-xs text-stone-500 tabular-nums">
                            {activeFiles.length} page{activeFiles.length !== 1 ? "s" : ""}
                          </span>
                        </td>

                        {/* Linked sections */}
                        <td className="px-3 py-3">
                          {linked.length > 0 ? (
                            <div className="flex items-center gap-1 flex-wrap">
                              {linked.map((label) => (
                                <span
                                  key={label}
                                  className="px-1.5 py-0.5 text-[10px] font-medium text-stone-600 bg-stone-100 rounded"
                                >
                                  {label}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[11px] text-stone-300">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-stone-400">
            <FolderOpen className="size-8 mb-2" />
            <p className="text-sm font-medium">No documents in File Hub</p>
            <p className="text-xs mt-1">Upload and review files to get started</p>
          </div>
        )}

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
      </motion.div>
    </div>
  );
}
