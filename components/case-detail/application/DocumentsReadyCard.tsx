"use client";

import React from "react";
import { motion } from "motion/react";
import {
  FileText,
  CheckCircle2,
  Clock,
  ArrowRight,
  Files,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useDocumentGroups,
  useCaseDetailStore,
} from "@/store/case-detail-store";

// Document category badge
const CategoryBadge = ({
  title,
  pageCount,
  isReady,
}: {
  title: string;
  pageCount: number;
  isReady: boolean;
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
        isReady
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
          : "bg-amber-50 text-amber-700 border border-amber-200",
      )}
    >
      {isReady ? (
        <CheckCircle2 size={12} className="text-emerald-500" />
      ) : (
        <Clock size={12} className="text-amber-500" />
      )}
      <span className="truncate max-w-[80px]">{title}</span>
      <span className="text-[10px] opacity-70 tabular-nums">{pageCount}p</span>
    </span>
  );
};

interface DocumentsReadyCardProps {
  variant?: "full" | "compact" | "inline";
  className?: string;
}

export function DocumentsReadyCard({
  variant = "full",
  className,
}: DocumentsReadyCardProps) {
  const documentGroups = useDocumentGroups();
  const setActiveNav = useCaseDetailStore((state) => state.setActiveNav);

  // Calculate stats
  const classifiedGroups = documentGroups.filter(
    (g) => g.id !== "unclassified",
  );
  const readyGroups = classifiedGroups.filter((g) => g.status === "reviewed");
  const pendingGroups = classifiedGroups.filter((g) => g.status === "pending");

  const totalFiles = classifiedGroups.length;
  const totalPages = classifiedGroups.reduce(
    (sum, g) => sum + g.files.filter((f) => !f.isRemoved).length,
    0,
  );

  const handleNavigateToDocuments = () => {
    setActiveNav("documents");
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
        <span className="tabular-nums">{totalFiles} files</span>
        <span className="text-stone-400">·</span>
        <span className="tabular-nums">{totalPages} pages</span>
      </button>
    );
  }

  // Inline variant for checklist header (smaller, informational)
  if (variant === "inline") {
    return (
      <div
        className={cn(
          "flex items-center gap-4 px-4 py-3 bg-stone-50 border-b border-stone-200",
          className,
        )}
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#0E4268]/10">
            <FileText size={14} className="text-[#0E4268]" />
          </div>
          <div className="text-sm">
            <span className="text-stone-600">Evidence from </span>
            <span className="font-medium text-stone-800 tabular-nums">
              {totalFiles} documents
            </span>
            <span className="text-stone-400 mx-1.5">·</span>
            <span className="font-medium text-stone-800 tabular-nums">
              {totalPages} pages
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {readyGroups.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700">
              <CheckCircle2 size={10} />
              {readyGroups.length} verified
            </span>
          )}
          {pendingGroups.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-700">
              <Clock size={10} />
              {pendingGroups.length} pending
            </span>
          )}
        </div>

        <button
          onClick={handleNavigateToDocuments}
          className="ml-auto text-xs font-medium text-[#0E4268] hover:underline"
        >
          Manage documents
        </button>
      </div>
    );
  }

  // Full variant for landing page
  const hasDocuments = totalFiles > 0;
  const allReady = pendingGroups.length === 0 && readyGroups.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "bg-white rounded-xl border shadow-sm overflow-hidden",
        allReady ? "border-emerald-200" : "border-stone-200",
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
                  <>
                    We'll extract information from{" "}
                    <span className="font-medium text-stone-700 tabular-nums">
                      {totalPages} pages
                    </span>{" "}
                    across{" "}
                    <span className="font-medium text-stone-700 tabular-nums">
                      {totalFiles} documents
                    </span>{" "}
                    to auto-fill your application
                  </>
                ) : (
                  "Add documents to speed up your application with auto-fill"
                )}
              </p>
            </div>
          </div>

          {/* Status summary */}
          {hasDocuments && (
            <div className="flex items-center gap-2 shrink-0">
              {allReady ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 size={12} />
                  All verified
                </span>
              ) : (
                <>
                  {readyGroups.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                      <CheckCircle2 size={12} />
                      {readyGroups.length} ready
                    </span>
                  )}
                  {pendingGroups.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                      <AlertCircle size={12} />
                      {pendingGroups.length} need review
                    </span>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Category badges */}
        {hasDocuments && (
          <div className="flex flex-wrap gap-2 mt-4">
            {classifiedGroups.slice(0, 5).map((group) => (
              <CategoryBadge
                key={group.id}
                title={group.title}
                pageCount={group.files.filter((f) => !f.isRemoved).length}
                isReady={group.status === "reviewed"}
              />
            ))}
            {classifiedGroups.length > 5 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs text-stone-500 bg-stone-100">
                +{classifiedGroups.length - 5} more
              </span>
            )}
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
            {hasDocuments ? "Add or review documents" : "Go to Documents"}
          </span>
          <ArrowRight
            size={14}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </button>
      </div>
    </motion.div>
  );
}
