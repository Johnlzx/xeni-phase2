"use client";

import {
  CheckCircle2,
  AlertCircle,
  Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ChecklistSectionType,
  EnhancedChecklistItem,
  EnhancedQualityIssue,
} from "@/types/case-detail";

interface SectionData {
  id: ChecklistSectionType;
  title: string;
  items: EnhancedChecklistItem[];
  completedCount: number;
  totalCount: number;
  issuesCount: number;
  isExpanded: boolean;
}

interface ChecklistSidebarProps {
  sections: SectionData[];
  selectedSectionId: ChecklistSectionType | null;
  onSelectSection: (sectionId: ChecklistSectionType) => void;
  enhancedIssues: EnhancedQualityIssue[];
}

// Checklist item (section as item)
function ChecklistItem({
  section,
  isSelected,
  onClick,
}: {
  section: SectionData;
  isSelected: boolean;
  onClick: () => void;
}) {
  const { title, completedCount, totalCount, issuesCount } = section;
  const isComplete = completedCount === totalCount && totalCount > 0;
  const hasIssues = issuesCount > 0;

  // Status icon
  const StatusIcon = isComplete
    ? CheckCircle2
    : hasIssues
      ? AlertCircle
      : Circle;

  const statusColor = isComplete
    ? "text-emerald-500"
    : hasIssues
      ? "text-amber-500"
      : "text-stone-300";

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
        isSelected
          ? "bg-stone-100 border-l-2 border-[#0E4268]"
          : "hover:bg-stone-50 border-l-2 border-transparent"
      )}
    >
      {/* Status icon */}
      <StatusIcon className={cn("size-5 shrink-0", statusColor)} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <span
          className={cn(
            "text-sm block truncate",
            isSelected ? "font-medium text-stone-900" : "text-stone-700"
          )}
        >
          {title}
        </span>
        <span className="text-xs text-stone-400 tabular-nums">
          {completedCount}/{totalCount} fields
        </span>
      </div>

      {/* Issue badge */}
      {issuesCount > 0 && (
        <span className="shrink-0 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-amber-100 text-amber-700 text-[11px] font-medium tabular-nums">
          {issuesCount}
        </span>
      )}
    </button>
  );
}

export function ChecklistSidebar({
  sections,
  selectedSectionId,
  onSelectSection,
}: ChecklistSidebarProps) {
  return (
    <div className="w-64 shrink-0 bg-white border-r border-stone-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-4 py-3 border-b border-stone-200">
        <h3 className="text-sm font-semibold text-stone-800">
          Checklist
        </h3>
      </div>

      {/* Checklist items */}
      <div className="flex-1 overflow-auto py-1">
        {sections.map((section) => (
          <ChecklistItem
            key={section.id}
            section={section}
            isSelected={selectedSectionId === section.id}
            onClick={() => onSelectSection(section.id)}
          />
        ))}
      </div>
    </div>
  );
}
