"use client";

import { Plus } from "lucide-react";

interface CaseListEmptyStateProps {
  onCreateCase: () => void;
}

export function CaseListEmptyState({ onCreateCase }: CaseListEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      {/* Illustration */}
      <div className="relative mb-8">
        {/* Stacked documents illustration */}
        <div className="relative w-28 h-32">
          {/* Back document */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-24 bg-stone-100 rounded-lg border border-stone-200 rotate-[-6deg]" />
          {/* Middle document */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-24 bg-stone-50 rounded-lg border border-stone-200 rotate-[3deg]" />
          {/* Front document with content lines */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-24 bg-white rounded-lg border border-stone-200 shadow-sm flex flex-col p-3 gap-1.5">
            <div className="w-8 h-1.5 bg-stone-200 rounded-full" />
            <div className="w-12 h-1.5 bg-stone-100 rounded-full" />
            <div className="w-10 h-1.5 bg-stone-100 rounded-full" />
            <div className="w-8 h-1.5 bg-stone-100 rounded-full" />
            <div className="flex-1" />
            <div className="w-6 h-6 rounded bg-stone-100 self-end" />
          </div>
          {/* Plus icon overlay */}
          <div className="absolute -bottom-2 -right-2 size-10 bg-[#0E4268] rounded-full flex items-center justify-center shadow-md">
            <Plus className="size-5 text-white" />
          </div>
        </div>
      </div>

      {/* Content */}
      <h2 className="text-xl font-semibold text-stone-900 text-balance mb-2">
        No cases yet
      </h2>
      <p className="text-sm text-stone-500 text-pretty max-w-xs mb-8">
        Create your first immigration case to start managing applications,
        documents, and evidence.
      </p>

      {/* CTA Button */}
      <button
        onClick={onCreateCase}
        className="flex items-center gap-2 px-5 py-3 bg-[#0E4268] hover:bg-[#0a3555] text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
      >
        <Plus className="size-4" />
        New Case
      </button>
    </div>
  );
}
