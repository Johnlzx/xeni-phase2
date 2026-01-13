"use client";

import React from "react";
import { motion } from "motion/react";
import {
  FileCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Files,
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
          : "bg-amber-50 text-amber-700 border border-amber-200"
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
  variant?: "full" | "compact";
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
    (g) => g.id !== "unclassified"
  );
  const readyGroups = classifiedGroups.filter((g) => g.status === "reviewed");
  const pendingGroups = classifiedGroups.filter((g) => g.status === "pending");

  const totalFiles = classifiedGroups.length;
  const totalPages = classifiedGroups.reduce(
    (sum, g) => sum + g.files.filter((f) => !f.isRemoved).length,
    0
  );

  const handleNavigateToDocuments = () => {
    setActiveNav("documents");
  };

  // Compact variant for header
  if (variant === "compact") {
    return (
      <button
        onClick={handleNavigateToDocuments}
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium",
          "bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors",
          className
        )}
      >
        <Files size={14} className="text-stone-500" />
        <span className="tabular-nums">{totalFiles} files</span>
        <span className="text-stone-400">·</span>
        <span className="tabular-nums">{totalPages} pages</span>
      </button>
    );
  }

  // Full variant for landing page
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "bg-white rounded-xl border border-stone-200 shadow-sm p-5",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-50">
            <FileCheck size={18} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-stone-800 text-balance">
              Documents Ready
            </h3>
            <p className="text-xs text-stone-500 text-pretty">
              <span className="font-medium tabular-nums">{totalFiles}</span>{" "}
              files ·{" "}
              <span className="font-medium tabular-nums">{totalPages}</span>{" "}
              pages will be used for data extraction
            </p>
          </div>
        </div>

        {/* Status summary */}
        <div className="flex items-center gap-2">
          {readyGroups.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
              <CheckCircle2 size={12} />
              {readyGroups.length} ready
            </span>
          )}
          {pendingGroups.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
              <Clock size={12} />
              {pendingGroups.length} pending
            </span>
          )}
        </div>
      </div>

      {/* Category badges */}
      <div className="flex flex-wrap gap-2 mb-4">
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
        {classifiedGroups.length === 0 && (
          <span className="text-sm text-stone-400 italic">
            No documents uploaded yet
          </span>
        )}
      </div>

      {/* Footer - Link to Documents */}
      <div className="pt-3 border-t border-stone-100">
        <button
          onClick={handleNavigateToDocuments}
          className="group flex items-center gap-1.5 text-sm font-medium text-[#0E4268] hover:text-[#0a3555] transition-colors"
        >
          <span>Need to add more? Go to Documents</span>
          <ArrowRight
            size={14}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </button>
      </div>
    </motion.div>
  );
}
