"use client";

import { useState } from "react";
import { LayoutGrid, ChevronDown, ChevronUp } from "lucide-react";
import { useCaseDetailStore, useFormSchema } from "@/store/case-detail-store";
import { cn } from "@/lib/utils";

// Skeleton loading state
function FormSchemaCardSkeleton() {
  return (
    <div className="flex flex-col h-full rounded-lg border border-stone-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-stone-100 bg-stone-50/50">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded bg-stone-100 flex items-center justify-center">
            <LayoutGrid className="size-3.5 text-stone-400" />
          </div>
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
            Completeness
          </span>
        </div>
      </div>

      {/* Content - Skeleton */}
      <div className="flex-1 p-3">
        <div className="space-y-2 mb-3">
          <div className="h-5 w-32 bg-stone-100 rounded animate-pulse" />
          <div className="h-3 w-20 bg-stone-100 rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-2 bg-stone-100 rounded-full animate-pulse" />
          <div className="flex justify-between">
            <div className="h-4 w-10 bg-stone-100 rounded animate-pulse" />
            <div className="h-4 w-16 bg-stone-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Empty state
function FormSchemaCardEmpty() {
  return (
    <div className="flex flex-col h-full rounded-lg border border-stone-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-stone-100 bg-stone-50/50">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded bg-stone-100 flex items-center justify-center">
            <LayoutGrid className="size-3.5 text-stone-400" />
          </div>
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
            Completeness
          </span>
        </div>
      </div>

      {/* Content - Empty */}
      <div className="flex-1 p-3 flex flex-col items-center justify-center text-center">
        <div className="size-10 rounded-lg bg-stone-100 flex items-center justify-center mb-2">
          <LayoutGrid className="size-5 text-stone-400" />
        </div>
        <p className="text-xs text-stone-400 text-pretty">
          Select visa type to view schema
        </p>
      </div>
    </div>
  );
}

export function FormSchemaCard() {
  const isAnalyzing = useCaseDetailStore(
    (state) => state.isAnalyzingDocuments,
  );
  const formSchema = useFormSchema();
  const [showEmptyFields, setShowEmptyFields] = useState(false);

  // Loading state
  if (isAnalyzing) {
    return <FormSchemaCardSkeleton />;
  }

  // Empty state - no schema loaded
  if (!formSchema) {
    return <FormSchemaCardEmpty />;
  }

  const {
    schemaName,
    schemaVersion,
    totalFields,
    filledFields,
    completionPercentage,
    emptyRequiredFields,
  } = formSchema;

  const emptyCount = emptyRequiredFields.length;
  const visibleEmptyFields = showEmptyFields
    ? emptyRequiredFields
    : emptyRequiredFields.slice(0, 3);

  return (
    <div className="flex flex-col h-full rounded-lg border border-stone-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-stone-100 bg-stone-50/50">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded bg-stone-100 flex items-center justify-center">
            <LayoutGrid className="size-3.5 text-stone-600" />
          </div>
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Completeness
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-3 overflow-y-auto">
        {/* Schema Info */}
        <div className="mb-3">
          <p className="text-sm font-medium text-stone-800 text-balance leading-tight">
            {schemaName.replace(" Application", "")}
          </p>
          <p className="text-xs text-stone-400 mt-0.5">
            Version {schemaVersion}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                completionPercentage === 100 ? "bg-emerald-500" : "bg-[#0E4268]",
              )}
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-sm font-semibold text-stone-800 tabular-nums">
              {completionPercentage}%
            </span>
            <span className="text-xs text-stone-500 tabular-nums">
              {filledFields}/{totalFields} fields
            </span>
          </div>
        </div>

        {/* Empty Required Fields */}
        {emptyCount > 0 && (
          <div className="pt-2 border-t border-stone-100">
            <p className="text-xs text-stone-500 mb-1.5">
              {emptyCount} empty required
            </p>
            <div className="space-y-1">
              {visibleEmptyFields.map((field, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-stone-300 text-xs">•</span>
                  <span className="text-xs text-stone-600 line-clamp-1">
                    {field}
                  </span>
                </div>
              ))}
            </div>
            {emptyCount > 3 && (
              <button
                onClick={() => setShowEmptyFields(!showEmptyFields)}
                className="mt-1.5 text-xs text-stone-400 hover:text-stone-600 flex items-center gap-0.5"
              >
                {showEmptyFields ? (
                  <>
                    Show less
                    <ChevronUp className="size-3" />
                  </>
                ) : (
                  <>
                    +{emptyCount - 3} more
                    <ChevronDown className="size-3" />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
