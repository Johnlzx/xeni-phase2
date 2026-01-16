"use client";

import { Sparkles, FileText, Check, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { DocumentGroup } from "@/types/case-detail";

interface AnalysisPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentGroups: DocumentGroup[];
  onConfirm: () => void;
}

export function AnalysisPreviewDialog({
  open,
  onOpenChange,
  documentGroups,
  onConfirm,
}: AnalysisPreviewDialogProps) {
  // Get documents that will be analyzed (reviewed status, not unclassified)
  const analyzableGroups = documentGroups.filter(
    (g) =>
      g.id !== "unclassified" &&
      g.status === "reviewed" &&
      g.files.some((f) => !f.isRemoved)
  );

  // Calculate total pages
  const totalPages = analyzableGroups.reduce((sum, g) => {
    const files = g.files.filter((f) => !f.isRemoved);
    return sum + files.reduce((s, f) => s + (f.pages || 1), 0);
  }, 0);

  const handleConfirm = () => {
    onOpenChange(false);
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white p-0" hideCloseButton>
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="size-8 rounded-lg bg-[#0E4268]/5 flex items-center justify-center">
              <Sparkles size={16} className="text-[#0E4268]" />
            </div>
            <DialogTitle className="text-balance">Run Analysis</DialogTitle>
          </div>
          <DialogDescription className="text-pretty">
            The following documents will be analyzed to extract information for
            your application
          </DialogDescription>
        </DialogHeader>

        <div className="p-6">
          {/* Document List */}
          <div className="space-y-2 max-h-[280px] overflow-y-auto">
            {analyzableGroups.map((group) => {
              const files = group.files.filter((f) => !f.isRemoved);
              const pages = files.reduce((sum, f) => sum + (f.pages || 1), 0);
              const isSpecial = group.isSpecial;

              return (
                <div
                  key={group.id}
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-emerald-50/50"
                >
                  <div className="flex items-center gap-2">
                    <Check className="size-4 text-emerald-600" />
                    <span className="text-sm text-stone-700">{group.title}</span>
                    {isSpecial && (
                      <span className="text-xs text-stone-400">(auto-confirmed)</span>
                    )}
                  </div>
                  <span className="text-xs text-stone-500 tabular-nums">
                    {pages} {pages === 1 ? "page" : "pages"}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="mt-4 pt-4 border-t border-stone-100">
            <div className="flex items-center gap-2 text-xs text-stone-600">
              <FileText className="size-3.5" />
              <span className="tabular-nums">
                {analyzableGroups.length}{" "}
                {analyzableGroups.length === 1 ? "category" : "categories"} ready
              </span>
              <span className="text-stone-400">·</span>
              <span className="tabular-nums">{totalPages} pages total</span>
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-stone-100 bg-stone-50 flex-row justify-end gap-3">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2",
              "bg-[#0E4268] text-white hover:bg-[#0a3555]"
            )}
          >
            Start Analysis
            <ArrowRight size={14} />
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
