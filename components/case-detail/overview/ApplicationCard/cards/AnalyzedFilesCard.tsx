"use client";

import { FileText, ExternalLink } from "lucide-react";
import { useCaseDetailStore, useAnalyzedFiles } from "@/store/case-detail-store";
import { cn } from "@/lib/utils";

// Skeleton loading state
function AnalyzedFilesCardSkeleton() {
  return (
    <div className="flex flex-col h-full rounded-lg border border-stone-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-stone-100 bg-stone-50/50">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded bg-stone-100 flex items-center justify-center">
            <FileText className="size-3.5 text-stone-400" />
          </div>
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
            Source Files
          </span>
        </div>
      </div>

      {/* Content - Skeleton */}
      <div className="flex-1 p-3">
        <div className="space-y-2">
          <div className="h-7 w-12 bg-stone-100 rounded animate-pulse" />
          <div className="h-4 w-28 bg-stone-100 rounded animate-pulse" />
        </div>
        <div className="mt-4 space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-4 bg-stone-100 rounded animate-pulse"
              style={{ width: `${80 - i * 10}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Empty state
function AnalyzedFilesCardEmpty() {
  return (
    <div className="flex flex-col h-full rounded-lg border border-stone-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-stone-100 bg-stone-50/50">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded bg-stone-100 flex items-center justify-center">
            <FileText className="size-3.5 text-stone-400" />
          </div>
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
            Source Files
          </span>
        </div>
      </div>

      {/* Content - Empty */}
      <div className="flex-1 p-3 flex flex-col items-center justify-center text-center">
        <div className="size-10 rounded-lg bg-stone-100 flex items-center justify-center mb-2">
          <FileText className="size-5 text-stone-400" />
        </div>
        <p className="text-xs text-stone-400 text-pretty">
          Run analysis to see results
        </p>
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

  // Loading state
  if (isAnalyzing) {
    return <AnalyzedFilesCardSkeleton />;
  }

  // Empty state
  if (analyzedFiles.length === 0) {
    return <AnalyzedFilesCardEmpty />;
  }

  // Group files by category
  const groupedFiles = analyzedFiles.reduce(
    (acc, file) => {
      if (!acc[file.groupTitle]) {
        acc[file.groupTitle] = { pages: 0, count: 0 };
      }
      acc[file.groupTitle].pages += file.pages;
      acc[file.groupTitle].count += 1;
      return acc;
    },
    {} as Record<string, { pages: number; count: number }>,
  );

  const groups = Object.entries(groupedFiles);
  const totalDocuments = groups.length;
  const totalPages = analyzedFiles.reduce((sum, f) => sum + f.pages, 0);

  const handleViewAll = () => {
    setActiveNav("documents");
  };

  return (
    <div className="flex flex-col h-full rounded-lg border border-stone-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-stone-100 bg-stone-50/50">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded bg-stone-100 flex items-center justify-center">
            <FileText className="size-3.5 text-stone-600" />
          </div>
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Source Files
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-3 overflow-y-auto">
        {/* Summary */}
        <div className="mb-3">
          <p className="text-xl font-semibold text-stone-800 tabular-nums">
            {totalDocuments}
          </p>
          <p className="text-xs text-stone-500">
            documents · {totalPages} pages
          </p>
        </div>

        {/* File List */}
        <div className="space-y-1.5">
          {groups.slice(0, 5).map(([title, data]) => (
            <div key={title} className="flex items-center justify-between py-1">
              <span className="text-xs text-stone-700 truncate">{title}</span>
              <span className="text-xs text-stone-400 tabular-nums shrink-0 ml-2">
                {data.pages}p
              </span>
            </div>
          ))}
          {groups.length > 5 && (
            <div className="text-xs text-stone-400 pt-1">
              +{groups.length - 5} more
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-stone-100">
        <button
          onClick={handleViewAll}
          className="w-full text-xs text-[#0E4268] hover:text-[#0a3555] flex items-center justify-center gap-1"
        >
          View all
          <ExternalLink className="size-3" />
        </button>
      </div>
    </div>
  );
}
