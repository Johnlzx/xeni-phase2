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
  action: "confirm-review" | "rename" | "replace";
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
  const title =
    action === "rename"
      ? <>Rename &ldquo;{groupTitle}&rdquo; to &ldquo;{newTitle}&rdquo;?</>
      : action === "replace"
        ? <>Replace &ldquo;{groupTitle}&rdquo;?</>
        : <>Confirm review of &ldquo;{groupTitle}&rdquo;?</>;

  const description =
    action === "rename"
      ? "This document is referenced by the checklist. Renaming it may affect the analysis of related sections."
      : action === "replace"
        ? "This document is referenced by the checklist. Replacing it will require re-analysis of related sections."
        : "This document is referenced by the checklist. Confirming the review may affect the analysis of related sections.";

  const buttonLabel =
    action === "rename" ? "Rename" : action === "replace" ? "Replace" : "Confirm Review";

  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-balance">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-pretty">
            {description}
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
                You can re-analyze affected sections in the Application tab.
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
            {buttonLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
