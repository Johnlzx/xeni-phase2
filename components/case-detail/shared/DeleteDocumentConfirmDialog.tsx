"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";
import type { GroupChecklistBinding } from "@/store/case-detail-store";

const SECTION_LABELS: Record<string, string> = {
  personal: "Personal Details",
  employment: "Employment",
  financial: "Financial",
  travel: "Travel History",
  education: "Education",
  family: "Family",
  other: "Other",
};

interface DeleteDocumentConfirmDialogProps {
  open: boolean;
  groupTitle: string;
  fileCount: number;
  checklistBindings: GroupChecklistBinding[];
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteDocumentConfirmDialog({
  open,
  groupTitle,
  fileCount,
  checklistBindings,
  onConfirm,
  onCancel,
}: DeleteDocumentConfirmDialogProps) {
  const hasBindings = checklistBindings.length > 0;

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-balance">
            Delete &ldquo;{groupTitle}&rdquo;?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-pretty">
            {fileCount > 0
              ? `This document contains ${fileCount} page${fileCount !== 1 ? "s" : ""}. It will be permanently removed.`
              : "This empty category will be removed from your document list."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {hasBindings && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm">
            <div className="flex items-start gap-2">
              <AlertTriangle className="size-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-amber-800 mb-1">
                  Checklist references will be removed
                </p>
                <ul className="text-amber-700 space-y-0.5">
                  {checklistBindings.map((binding, i) =>
                    binding.type === "assessment" ? (
                      <li key={i}>Case Assessment reference document</li>
                    ) : (
                      <li key={i}>
                        {SECTION_LABELS[binding.sectionId] || binding.sectionId} section reference
                      </li>
                    ),
                  )}
                </ul>
                <p className="text-amber-600 mt-1.5 text-xs">
                  Deleting will remove these references. Related information extraction may be affected.
                </p>
              </div>
            </div>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-rose-600 hover:bg-rose-700 text-white"
          >
            {hasBindings ? "Delete and Remove References" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
