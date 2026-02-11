"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import { X, Check, FolderOpen, FileText } from "lucide-react";
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
  const [selectedGroupIds, setSelectedGroupIds] = useState<Set<string>>(new Set());

  // Read section linkage data from store
  const sectionReferenceDocIds = useCaseDetailStore((s) => s.sectionReferenceDocIds);
  const assessmentReferenceDocIds = useCaseDetailStore((s) => s.assessmentReferenceDocIds);

  // Only show reviewed, classified groups that have active files
  const classifiedGroups = useMemo(
    () =>
      documentGroups.filter(
        (g) =>
          g.id !== "unclassified" &&
          g.status === "reviewed" &&
          g.files.filter((f) => !f.isRemoved).length > 0
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

  const toggleGroup = (groupId: string) => {
    setSelectedGroupIds((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  };

  const hasDocuments = classifiedGroups.length > 0;
  const selectionCount = selectedGroupIds.size;

  const handleConfirm = () => {
    if (onLinkGroup) {
      selectedGroupIds.forEach((groupId) => onLinkGroup(groupId));
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
            <h2 className="text-lg font-semibold text-stone-900">Add Reference Documents</h2>
            <p className="text-sm text-stone-500 mt-0.5">
              Select from your reviewed documents
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
                {classifiedGroups.length} document{classifiedGroups.length !== 1 ? "s" : ""} available
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
                    const isSelected = selectedGroupIds.has(group.id);
                    const linked = linkedSectionsMap[group.id] || [];

                    return (
                      <tr
                        key={group.id}
                        onClick={() => toggleGroup(group.id)}
                        className={cn(
                          "transition-colors cursor-pointer hover:bg-stone-50",
                          isSelected && "bg-[#0E4268]/5 hover:bg-[#0E4268]/5"
                        )}
                      >
                        {/* Selection indicator — checkbox style */}
                        <td className="px-3 py-3 text-center">
                          {isSelected ? (
                            <div className="mx-auto size-5 rounded bg-[#0E4268] flex items-center justify-center">
                              <Check className="size-3 text-white" strokeWidth={3} />
                            </div>
                          ) : (
                            <div className="mx-auto size-5 rounded border border-stone-300 bg-white" />
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
            <p className="text-sm font-medium">No reviewed documents</p>
            <p className="text-xs mt-1">Review your uploaded documents first</p>
          </div>
        )}

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <span className="text-sm text-stone-500 tabular-nums">
            {selectionCount > 0 ? `${selectionCount} selected` : "\u00A0"}
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectionCount === 0}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                selectionCount > 0
                  ? "bg-[#0E4268] text-white hover:bg-[#0a3555]"
                  : "bg-stone-200 text-stone-400 cursor-not-allowed"
              )}
            >
              {selectionCount > 0
                ? `Add ${selectionCount} document${selectionCount !== 1 ? "s" : ""}`
                : "Add"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
