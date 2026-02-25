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

interface ReferencedDocWarningDialogProps {
  open: boolean;
  action: "confirm-review" | "rename";
  groupTitle: string;
  newTitle?: string;
  checklistBindings: GroupChecklistBinding[];
  onConfirm: () => void;
  onCancel: () => void;
}

export function ReferencedDocWarningDialog({
  open,
  action,
  groupTitle,
  newTitle,
  checklistBindings,
  onConfirm,
  onCancel,
}: ReferencedDocWarningDialogProps) {
  const isRename = action === "rename";

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-balance">
            {isRename
              ? <>Rename &ldquo;{groupTitle}&rdquo; to &ldquo;{newTitle}&rdquo;?</>
              : <>Confirm review of &ldquo;{groupTitle}&rdquo;?</>}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-pretty">
            {isRename
              ? "This document is referenced by the checklist. Renaming it will trigger re-analysis of affected sections."
              : "This document is referenced by the checklist. Confirming the review will trigger re-analysis of affected sections."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm">
          <div className="flex items-start gap-2">
            <AlertTriangle className="size-4 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-amber-800 mb-1">
                Affected checklist sections
              </p>
              <ul className="text-amber-700 space-y-0.5">
                {checklistBindings.map((binding, i) =>
                  binding.type === "assessment" ? (
                    <li key={i}>Case Assessment</li>
                  ) : (
                    <li key={i}>
                      {SECTION_LABELS[binding.sectionId] || binding.sectionId}
                    </li>
                  ),
                )}
              </ul>
              <p className="text-amber-600 mt-1.5 text-xs">
                These sections will be flagged for re-analysis after this action.
              </p>
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            {isRename ? "Rename and Re-analyze" : "Confirm Review and Re-analyze"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
