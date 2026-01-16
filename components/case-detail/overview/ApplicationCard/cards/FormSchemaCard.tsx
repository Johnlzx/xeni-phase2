"use client";

import { useState } from "react";
import { LayoutGrid, Expand } from "lucide-react";
import { useCaseDetailStore, useFormSchema } from "@/store/case-detail-store";
import { cn } from "@/lib/utils";
import { ProfileVaultModal } from "../ProfileVaultModal";

// Skeleton loading state
function FormSchemaCardSkeleton() {
  return (
    <div className="flex flex-col rounded-lg border border-stone-200 bg-white overflow-hidden">
      <div className="px-3 py-2 border-b border-stone-100 bg-stone-50/50">
        <div className="flex items-center gap-2">
          <div className="size-5 rounded bg-stone-100 flex items-center justify-center">
            <LayoutGrid className="size-3 text-stone-400" />
          </div>
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
            Completeness
          </span>
        </div>
      </div>
      <div className="p-3">
        <div className="h-6 w-12 bg-stone-100 rounded animate-pulse mb-1" />
        <div className="h-3 w-24 bg-stone-100 rounded animate-pulse" />
      </div>
    </div>
  );
}

// Empty state
function FormSchemaCardEmpty() {
  return (
    <div className="flex flex-col rounded-lg border border-stone-200 bg-white overflow-hidden">
      <div className="px-3 py-2 border-b border-stone-100 bg-stone-50/50">
        <div className="flex items-center gap-2">
          <div className="size-5 rounded bg-stone-100 flex items-center justify-center">
            <LayoutGrid className="size-3 text-stone-400" />
          </div>
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
            Completeness
          </span>
        </div>
      </div>
      <div className="p-3 flex items-center justify-center">
        <p className="text-xs text-stone-400">Select visa type</p>
      </div>
    </div>
  );
}

export function FormSchemaCard() {
  const [showProfileVault, setShowProfileVault] = useState(false);

  const isAnalyzing = useCaseDetailStore(
    (state) => state.isAnalyzingDocuments,
  );
  const formSchema = useFormSchema();

  if (isAnalyzing) {
    return <FormSchemaCardSkeleton />;
  }

  if (!formSchema) {
    return <FormSchemaCardEmpty />;
  }

  const {
    totalFields,
    filledFields,
    completionPercentage,
  } = formSchema;

  return (
    <>
      <div className="flex flex-col rounded-lg border border-stone-200 bg-white overflow-hidden">
        {/* Header */}
        <div className="px-3 py-2 border-b border-stone-100 bg-stone-50/50">
          <div className="flex items-center gap-2">
            <div className="size-5 rounded bg-stone-100 flex items-center justify-center">
              <LayoutGrid className="size-3 text-stone-600" />
            </div>
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              Completeness
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1.5">
              <span
                className={cn(
                  "text-lg font-semibold tabular-nums leading-none",
                  completionPercentage === 100
                    ? "text-emerald-600"
                    : "text-stone-800",
                )}
              >
                {completionPercentage}%
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    completionPercentage === 100 ? "bg-emerald-500" : "bg-[#0E4268]",
                  )}
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <span className="text-[11px] text-stone-500 tabular-nums shrink-0">
                {filledFields}/{totalFields}
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowProfileVault(true)}
            className="size-7 flex items-center justify-center rounded-md text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors ml-3"
            aria-label="View profile vault"
          >
            <Expand className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Profile Vault Modal */}
      <ProfileVaultModal
        open={showProfileVault}
        onOpenChange={setShowProfileVault}
      />
    </>
  );
}
