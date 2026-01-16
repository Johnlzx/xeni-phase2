"use client";

import { FileText, ExternalLink } from "lucide-react";
import { useCaseDetailStore, useAnalyzedFiles } from "@/store/case-detail-store";

// Skeleton loading state
function AnalyzedFilesCardSkeleton() {
  return (
    <div className="flex flex-col rounded-lg border border-stone-200 bg-white overflow-hidden">
      <div className="px-3 py-2 border-b border-stone-100 bg-stone-50/50">
        <div className="flex items-center gap-2">
          <div className="size-5 rounded bg-stone-100 flex items-center justify-center">
            <FileText className="size-3 text-stone-400" />
          </div>
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
            Source Documents
          </span>
        </div>
      </div>
      <div className="p-3">
        <div className="h-6 w-8 bg-stone-100 rounded animate-pulse mb-1" />
        <div className="h-3 w-20 bg-stone-100 rounded animate-pulse" />
      </div>
    </div>
  );
}

// Empty state
function AnalyzedFilesCardEmpty() {
  return (
    <div className="flex flex-col rounded-lg border border-stone-200 bg-white overflow-hidden">
      <div className="px-3 py-2 border-b border-stone-100 bg-stone-50/50">
        <div className="flex items-center gap-2">
          <div className="size-5 rounded bg-stone-100 flex items-center justify-center">
            <FileText className="size-3 text-stone-400" />
          </div>
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
            Source Documents
          </span>
        </div>
      </div>
      <div className="p-3 flex items-center justify-center">
        <p className="text-xs text-stone-400">No documents analyzed</p>
      </div>
    </div>
  );
}

export function AnalyzedFilesCard() {
  const isAnalyzing = useCaseDetailStore(
    (state) => state.isAnalyzingDocuments,
  );
  const analyzedFiles = useAnalyzedFiles();
  const setActiveNav = useCaseDetailStore((state) => state.setActiveNav);

  if (isAnalyzing) {
    return <AnalyzedFilesCardSkeleton />;
  }

  if (analyzedFiles.length === 0) {
    return <AnalyzedFilesCardEmpty />;
  }

  // Count unique document groups
  const uniqueGroups = new Set(analyzedFiles.map((f) => f.groupTitle));
  const totalDocuments = uniqueGroups.size;

  const handleViewAll = () => {
    setActiveNav("documents");
  };

  return (
    <div className="flex flex-col rounded-lg border border-stone-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 border-b border-stone-100 bg-stone-50/50">
        <div className="flex items-center gap-2">
          <div className="size-5 rounded bg-stone-100 flex items-center justify-center">
            <FileText className="size-3 text-stone-600" />
          </div>
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
            Source Documents
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold text-stone-800 tabular-nums leading-none">
            {totalDocuments}
          </p>
          <p className="text-[11px] text-stone-500 mt-1">
            documents analyzed
          </p>
        </div>
        <button
          onClick={handleViewAll}
          className="size-7 flex items-center justify-center rounded-md text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
          aria-label="View source documents"
        >
          <ExternalLink className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
