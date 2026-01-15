"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  FileText,
  CheckCircle2,
  Clock,
  ArrowRight,
  Files,
  Upload,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useDocumentGroups,
  useCaseDetailStore,
} from "@/store/case-detail-store";
import { CategoryReviewModal } from "../shared";
import type { DocumentGroup } from "@/types/case-detail";

// Document category badge - clickable for preview
const CategoryBadge = ({
  group,
  onClick,
}: {
  group: DocumentGroup;
  onClick: () => void;
}) => {
  const isReady = group.status === "reviewed";
  const pageCount = group.files.filter((f) => !f.isRemoved).length;

  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
        isReady
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
          : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100",
      )}
    >
      {isReady ? (
        <CheckCircle2 size={12} className="text-emerald-500" />
      ) : (
        <Clock size={12} className="text-amber-500" />
      )}
      <span className="truncate max-w-[80px]">{group.title}</span>
      <span className="text-[10px] opacity-70 tabular-nums">{pageCount}p</span>
    </button>
  );
};

interface DocumentsReadyCardProps {
  variant?: "full" | "compact" | "inline";
  className?: string;
  isAnalyzing?: boolean;
}

export function DocumentsReadyCard({
  variant = "full",
  className,
  isAnalyzing = false,
}: DocumentsReadyCardProps) {
  const documentGroups = useDocumentGroups();
  const setActiveNav = useCaseDetailStore((state) => state.setActiveNav);
  const uploadDocuments = useCaseDetailStore((state) => state.uploadDocuments);

  // State for review modal
  const [reviewGroup, setReviewGroup] = useState<DocumentGroup | null>(null);

  // Calculate stats
  const classifiedGroups = documentGroups.filter(
    (g) => g.id !== "unclassified",
  );
  const readyGroups = classifiedGroups.filter((g) => g.status === "reviewed");

  // Stats only count confirmed/reviewed documents
  const confirmedFiles = readyGroups.length;
  const confirmedPages = readyGroups.reduce(
    (sum, g) => sum + g.files.filter((f) => !f.isRemoved).length,
    0,
  );

  const handleNavigateToDocuments = () => {
    setActiveNav("documents");
  };

  const handleUpload = () => {
    uploadDocuments();
  };

  const handleOpenReview = (group: DocumentGroup) => {
    setReviewGroup(group);
  };

  // Compact variant for header (button style)
  if (variant === "compact") {
    return (
      <button
        onClick={handleNavigateToDocuments}
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium",
          "bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors",
          className,
        )}
      >
        <Files size={14} className="text-stone-500" />
        <span className="tabular-nums">{confirmedFiles} files</span>
        <span className="text-stone-400">·</span>
        <span className="tabular-nums">{confirmedPages} pages</span>
      </button>
    );
  }

  // Inline variant for checklist header (smaller, informational)
  if (variant === "inline") {
    return (
      <div
        className={cn(
          "flex items-center gap-4 px-6 py-3 border-b border-stone-200",
          isAnalyzing ? "bg-blue-50" : "bg-stone-50",
          className,
        )}
      >
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "p-1.5 rounded-lg",
              isAnalyzing ? "bg-blue-100" : "bg-[#0E4268]/10",
            )}
          >
            {isAnalyzing ? (
              <div className="size-3.5 rounded-full border-2 border-blue-300 border-t-blue-600 animate-spin" />
            ) : (
              <FileText size={14} className="text-[#0E4268]" />
            )}
          </div>
          <div className="text-sm">
            {isAnalyzing ? (
              <span className="text-blue-700 font-medium">
                Analyzing documents...
              </span>
            ) : (
              <>
                <span className="text-stone-600">Information from </span>
                <span className="font-medium text-stone-800 tabular-nums">
                  {confirmedFiles} documents
                </span>
                <span className="text-stone-400 mx-1.5">·</span>
                <span className="font-medium text-stone-800 tabular-nums">
                  {confirmedPages} pages
                </span>
              </>
            )}
          </div>
        </div>

        {isAnalyzing ? (
          <span className="ml-auto text-xs text-blue-600">
            Extracting data for auto-fill
          </span>
        ) : (
          <button
            onClick={handleNavigateToDocuments}
            className="ml-auto text-xs font-medium text-[#0E4268] hover:underline"
          >
            Manage documents
          </button>
        )}
      </div>
    );
  }

  // Full variant for landing page
  const hasDocuments = classifiedGroups.length > 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={cn(
          "bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden",
          className,
        )}
      >
        {/* Header */}
        <div className="px-5 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "p-2 rounded-lg",
                  hasDocuments ? "bg-[#0E4268]/10" : "bg-stone-100",
                )}
              >
                <FileText
                  size={18}
                  className={hasDocuments ? "text-[#0E4268]" : "text-stone-400"}
                />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-stone-800 text-balance">
                  {hasDocuments
                    ? "Your documents are ready"
                    : "Upload your documents"}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5 text-pretty">
                  {hasDocuments ? (
                    confirmedFiles > 0 ? (
                      <>
                        We'll extract information from{" "}
                        <span className="font-medium text-stone-700 tabular-nums">
                          {confirmedPages} pages
                        </span>{" "}
                        across{" "}
                        <span className="font-medium text-stone-700 tabular-nums">
                          {confirmedFiles} confirmed documents
                        </span>{" "}
                        to auto-fill your application
                      </>
                    ) : (
                      "Review and confirm your documents to proceed"
                    )
                  ) : (
                    "Add documents to speed up your application with Form Pilot"
                  )}
                </p>
              </div>
            </div>

            {/* Upload button when no documents */}
            {!hasDocuments && (
              <div className="shrink-0">
                <button
                  onClick={handleUpload}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-900 text-white hover:bg-stone-800 transition-colors"
                >
                  <Upload size={12} />
                  Upload
                </button>
              </div>
            )}
          </div>

          {/* Category badges - clickable for preview */}
          {hasDocuments && (
            <div className="flex flex-wrap gap-2 mt-4">
              {classifiedGroups.map((group) => (
                <CategoryBadge
                  key={group.id}
                  group={group}
                  onClick={() => handleOpenReview(group)}
                />
              ))}
              {/* Add more button */}
              <button
                onClick={handleUpload}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-stone-500 bg-stone-100 hover:bg-stone-200 transition-colors"
              >
                <Plus size={12} />
                Add
              </button>
            </div>
          )}
        </div>

        {/* Footer - Link to Documents */}
        <div className="px-5 py-3 bg-stone-50 border-t border-stone-100">
          <button
            onClick={handleNavigateToDocuments}
            className="group flex items-center gap-1.5 text-sm font-medium text-[#0E4268] hover:text-[#0a3555] transition-colors"
          >
            <span>
              {hasDocuments ? "Manage all documents" : "Go to Documents"}
            </span>
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </button>
        </div>
      </motion.div>

      {/* Category Review Modal - wrapped in DndProvider for drag-drop support */}
      <AnimatePresence>
        {reviewGroup && (
          <DndProvider backend={HTML5Backend}>
            <CategoryReviewModal
              group={reviewGroup}
              allGroups={documentGroups}
              onClose={() => setReviewGroup(null)}
            />
          </DndProvider>
        )}
      </AnimatePresence>
    </>
  );
}
