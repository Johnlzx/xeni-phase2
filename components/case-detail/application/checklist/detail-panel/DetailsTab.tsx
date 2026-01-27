"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  FileText,
  Edit3,
  Check,
  X,
  Eye,
  ListFilter,
  AlertCircle,
  CircleDashed,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  EnhancedChecklistItem,
  DocumentGroup,
  LinkedDocument,
} from "@/types/case-detail";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CategoryReviewModal } from "../../../shared";

// Assessment field interface
interface AssessmentField {
  id: string;
  label: string;
  value: string | null;
  type: "text" | "select" | "radio";
  options?: { value: string; label: string }[];
  isRequired: boolean;
  isConditional?: boolean;
  dependsOn?: { fieldId: string; value: string };
  description?: string;
}

// Clickable Source badge component - opens document preview on click
function SourceBadge({
  source,
  documentName,
  linkedDocument,
  confidenceScore,
  documentGroups,
}: {
  source: "extracted" | "questionnaire" | "manual" | null;
  documentName?: string;
  linkedDocument?: LinkedDocument;
  confidenceScore?: number;
  documentGroups: DocumentGroup[];
}) {
  const [showPreview, setShowPreview] = useState(false);

  if (!source) return null;

  // Find the linked group for preview
  const linkedGroup = linkedDocument
    ? documentGroups.find((g) => g.files.some((f) => f.id === linkedDocument.fileId))
    : undefined;

  if (source === "extracted") {
    const isLowConfidence = confidenceScore !== undefined && confidenceScore < 80;

    return (
      <>
        <button
          onClick={() => linkedGroup && setShowPreview(true)}
          className={cn(
            "inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-medium rounded transition-colors",
            isLowConfidence
              ? "text-amber-600 bg-amber-50 border border-amber-200"
              : "text-blue-600 bg-blue-50 border border-blue-100",
            linkedGroup && "hover:bg-blue-100 hover:border-blue-200 cursor-pointer"
          )}
        >
          <FileText className="size-2.5" />
          {documentName || "Extracted"}
          {confidenceScore !== undefined && (
            <span className={cn(
              "tabular-nums",
              isLowConfidence ? "text-amber-500" : "text-blue-400"
            )}>
              ({confidenceScore}%)
            </span>
          )}
          {linkedGroup && <Eye className="size-2.5 ml-0.5 opacity-60" />}
        </button>

        {/* Preview Modal */}
        {showPreview && linkedGroup && (
          <CategoryReviewModal
            group={linkedGroup}
            allGroups={documentGroups}
            onClose={() => setShowPreview(false)}
          />
        )}
      </>
    );
  }

  if (source === "manual") {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-medium text-violet-600 bg-violet-50 border border-violet-100 rounded">
        <Edit3 className="size-2.5" />
        Edited
      </span>
    );
  }

  if (source === "questionnaire") {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-medium text-stone-500 bg-stone-50 border border-stone-200 rounded">
        Questionnaire
      </span>
    );
  }

  return null;
}

// Field Card for checklist items
function FieldCard({
  item,
  editValue,
  onValueChange,
  isEdited,
  documentGroups,
  setInputRef,
}: {
  item: EnhancedChecklistItem;
  editValue: string;
  onValueChange: (value: string) => void;
  isEdited: boolean;
  documentGroups: DocumentGroup[];
  setInputRef?: (el: HTMLInputElement | null) => void;
}) {
  const hasValue = !!editValue;
  const isComplete = item.status === "complete" || hasValue;
  const isLowConfidence =
    item.source === "extracted" &&
    item.confidenceScore !== undefined &&
    item.confidenceScore < 80;

  // Determine display source - show "Edited" if value changed from original
  const displaySource = isEdited ? "manual" : item.source;
  const sourceDocName =
    item.linkedDocuments.length > 0 ? item.linkedDocuments[0].groupTitle : undefined;
  const firstLinkedDoc =
    item.linkedDocuments.length > 0 ? item.linkedDocuments[0] : undefined;

  return (
    <div
      className={cn(
        "border rounded-lg p-4 transition-colors",
        isLowConfidence
          ? "border-amber-200 bg-amber-50/20"
          : !hasValue && item.isRequired
          ? "border-amber-200 bg-amber-50/20"
          : "border-stone-200 hover:border-stone-300 bg-white"
      )}
    >
      {/* Label row with status and source badge */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={cn(
              "shrink-0 size-2 rounded-full",
              isComplete
                ? "bg-emerald-500"
                : item.isRequired
                ? "bg-amber-400"
                : "bg-stone-300"
            )}
          />
          <label className="text-sm font-medium text-stone-700 truncate">
            {item.label}
            {item.isRequired && <span className="text-rose-500 ml-0.5">*</span>}
          </label>
        </div>
        {hasValue && (
          <SourceBadge
            source={displaySource}
            documentName={displaySource === "extracted" ? sourceDocName : undefined}
            linkedDocument={displaySource === "extracted" ? firstLinkedDoc : undefined}
            confidenceScore={
              displaySource === "extracted" ? item.confidenceScore : undefined
            }
            documentGroups={documentGroups}
          />
        )}
      </div>

      {/* Low confidence hint */}
      {isLowConfidence && !isEdited && (
        <div className="flex items-center gap-1.5 mb-2 px-2 py-1.5 bg-amber-50 border border-amber-100 rounded text-xs text-amber-700">
          <AlertCircle className="size-3.5 shrink-0" />
          <span>Low confidence extraction. Please verify this value.</span>
        </div>
      )}

      {/* Input field */}
      <input
        ref={setInputRef}
        type="text"
        value={editValue}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={item.isRequired ? "Required" : "Optional"}
        className={cn(
          "w-full px-3 py-2 text-sm border rounded-md transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-[#0E4268]/20 focus:border-[#0E4268]",
          hasValue ? "border-stone-200 bg-white" : "border-stone-200 bg-stone-50"
        )}
      />

      {/* Verify button for low confidence */}
      {isLowConfidence && !isEdited && hasValue && (
        <div className="mt-2 flex justify-end">
          <button
            onClick={() => onValueChange(editValue)}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded hover:bg-emerald-100 transition-colors"
          >
            <Check className="size-3" />
            Mark as verified
          </button>
        </div>
      )}
    </div>
  );
}

// Filter type for field list
type FieldFilterKey =
  | "missing"
  | "extracted"
  | "manual"
  | "questionnaire"
  | "low_confidence";

// Filter configuration
const filterOptions: {
  key: FieldFilterKey;
  label: string;
  icon: React.ElementType;
}[] = [
  { key: "missing", label: "Missing", icon: CircleDashed },
  { key: "extracted", label: "AI Extracted", icon: Sparkles },
  { key: "manual", label: "Manual Entry", icon: Edit3 },
  { key: "questionnaire", label: "Questionnaire", icon: FileText },
  { key: "low_confidence", label: "Needs Review", icon: AlertCircle },
];

// Field Filter Dropdown
function FieldFilterDropdown({
  items,
  activeFilters,
  onFilterChange,
}: {
  items: EnhancedChecklistItem[];
  activeFilters: Set<FieldFilterKey>;
  onFilterChange: (filters: Set<FieldFilterKey>) => void;
}) {
  // Calculate counts for each filter
  const counts = useMemo(() => {
    return {
      missing: items.filter((item) => item.isRequired && !item.value).length,
      extracted: items.filter((item) => item.source === "extracted").length,
      manual: items.filter((item) => item.source === "manual").length,
      questionnaire: items.filter((item) => item.source === "questionnaire").length,
      low_confidence: items.filter(
        (item) =>
          item.source === "extracted" &&
          item.confidenceScore !== undefined &&
          item.confidenceScore < 80
      ).length,
    };
  }, [items]);

  // Only show filter options with count > 0
  const availableFilters = filterOptions.filter((opt) => counts[opt.key] > 0);

  if (availableFilters.length === 0) {
    return null;
  }

  const isFiltered = activeFilters.size > 0;
  const selectedCount = activeFilters.size;

  const handleToggle = (key: FieldFilterKey) => {
    const newFilters = new Set(activeFilters);
    if (newFilters.has(key)) {
      newFilters.delete(key);
    } else {
      newFilters.add(key);
    }
    onFilterChange(newFilters);
  };

  const handleClear = () => {
    onFilterChange(new Set());
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border transition-colors",
              isFiltered
                ? "bg-stone-100 text-stone-800 border-stone-300"
                : "bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:bg-stone-50"
            )}
          >
            <ListFilter className="size-3.5" />
            <span>Filter</span>
            {isFiltered && (
              <span className="ml-0.5 px-1.5 py-0.5 text-[10px] bg-stone-200 text-stone-700 rounded tabular-nums">
                {selectedCount}
              </span>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-44 p-1">
          {availableFilters.map((filter) => {
            const Icon = filter.icon;
            const isSelected = activeFilters.has(filter.key);

            return (
              <button
                key={filter.key}
                onClick={() => handleToggle(filter.key)}
                className={cn(
                  "w-full flex items-center gap-2 px-2 py-1.5 text-xs rounded transition-colors text-left",
                  isSelected
                    ? "bg-stone-100 text-stone-800"
                    : "text-stone-600 hover:bg-stone-50"
                )}
              >
                {/* Checkbox indicator */}
                <div
                  className={cn(
                    "size-3.5 rounded border flex items-center justify-center shrink-0",
                    isSelected ? "bg-stone-700 border-stone-700" : "border-stone-300"
                  )}
                >
                  {isSelected && (
                    <Check className="size-2.5 text-white" strokeWidth={3} />
                  )}
                </div>
                <Icon className="size-3.5 text-stone-400 shrink-0" />
                <span className="flex-1 truncate">{filter.label}</span>
                <span className="tabular-nums text-stone-400">
                  {counts[filter.key]}
                </span>
              </button>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Active filter tags */}
      {isFiltered && (
        <div className="flex items-center gap-1.5">
          {Array.from(activeFilters).map((key) => {
            const filter = filterOptions.find((f) => f.key === key);
            if (!filter) return null;

            return (
              <span
                key={key}
                className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-stone-600 bg-stone-100 border border-stone-200 rounded"
              >
                {filter.label}
                <button
                  onClick={() => handleToggle(key)}
                  className="text-stone-400 hover:text-stone-600"
                >
                  <X className="size-2.5" />
                </button>
              </span>
            );
          })}
          {selectedCount > 1 && (
            <button
              onClick={handleClear}
              className="text-[10px] font-medium text-stone-500 hover:text-stone-700 hover:underline"
            >
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Props for checklist items
interface ChecklistDetailsProps {
  itemType: "checklist";
  items: EnhancedChecklistItem[];
  formValues: Record<string, string>;
  editedFieldIds: Set<string>;
  documentGroups: DocumentGroup[];
  onFieldChange: (fieldId: string, value: string) => void;
  focusFieldId: string | null;
  onFocusHandled: () => void;
}

// Props for assessment items
interface AssessmentDetailsProps {
  itemType: "assessment";
  fields: AssessmentField[];
  formValues: Record<string, string>;
  documentGroups: DocumentGroup[];
  onFieldChange: (fieldId: string, value: string) => void;
  focusFieldId: string | null;
  onFocusHandled: () => void;
}

export type DetailsTabProps = ChecklistDetailsProps | AssessmentDetailsProps;

export function DetailsTab(props: DetailsTabProps) {
  const {
    itemType,
    formValues,
    documentGroups,
    onFieldChange,
    focusFieldId,
    onFocusHandled,
  } = props;

  // Multi-select filter state (only for checklist items)
  const [activeFilters, setActiveFilters] = useState<Set<FieldFilterKey>>(new Set());

  // Ref map for field inputs
  const inputRefs = useRef<Map<string, HTMLInputElement | null>>(new Map());

  // Handle focus on specific field
  useEffect(() => {
    if (focusFieldId) {
      const input = inputRefs.current.get(focusFieldId);
      if (input) {
        input.scrollIntoView({ behavior: "smooth", block: "center" });
        input.focus();
        onFocusHandled();
      }
    }
  }, [focusFieldId, onFocusHandled]);

  if (itemType === "checklist") {
    const items = props.items;
    const editedFieldIds = props.editedFieldIds;

    // Filter items based on active filters
    const filteredItems = useMemo(() => {
      if (activeFilters.size === 0) return items;

      return items.filter((item) => {
        for (const filterKey of activeFilters) {
          switch (filterKey) {
            case "missing":
              if (item.isRequired && !item.value) return true;
              break;
            case "extracted":
              if (item.source === "extracted") return true;
              break;
            case "manual":
              if (item.source === "manual") return true;
              break;
            case "questionnaire":
              if (item.source === "questionnaire") return true;
              break;
            case "low_confidence":
              if (
                item.source === "extracted" &&
                item.confidenceScore !== undefined &&
                item.confidenceScore < 80
              )
                return true;
              break;
          }
        }
        return false;
      });
    }, [items, activeFilters]);

    return (
      <div className="px-6 py-4">
        {/* Filter Dropdown */}
        <FieldFilterDropdown
          items={items}
          activeFilters={activeFilters}
          onFilterChange={setActiveFilters}
        />

        {/* Field Cards */}
        <div className="space-y-3">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <FieldCard
                key={item.id}
                item={item}
                editValue={formValues[item.id] || ""}
                onValueChange={(value) => onFieldChange(item.id, value)}
                isEdited={editedFieldIds.has(item.id)}
                documentGroups={documentGroups}
                setInputRef={(el) => {
                  inputRefs.current.set(item.id, el);
                }}
              />
            ))
          ) : activeFilters.size > 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-stone-500">No fields match the filter</p>
              <button
                onClick={() => setActiveFilters(new Set())}
                className="mt-2 text-xs text-[#0E4268] hover:underline"
              >
                Show all fields
              </button>
            </div>
          ) : (
            <p className="text-sm text-stone-400 py-8 text-center">
              No fields in this section
            </p>
          )}
        </div>
      </div>
    );
  }

  // Assessment type
  const fields = props.fields;

  return (
    <div className="px-6 py-4">
      <div className="space-y-3">
        {fields.map((field) => {
          const hasValue = !!formValues[field.id];

          return (
            <div
              key={field.id}
              className={cn(
                "border rounded-lg p-4 transition-colors",
                !hasValue && field.isRequired
                  ? "border-amber-200 bg-amber-50/20"
                  : "border-stone-200 hover:border-stone-300 bg-white"
              )}
            >
              {/* Label */}
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={cn(
                    "shrink-0 size-2 rounded-full",
                    hasValue
                      ? "bg-emerald-500"
                      : field.isRequired
                      ? "bg-amber-400"
                      : "bg-stone-300"
                  )}
                />
                <label className="text-sm font-medium text-stone-700">
                  {field.label}
                  {field.isRequired && <span className="text-rose-500 ml-0.5">*</span>}
                </label>
              </div>

              {/* Description if any */}
              {field.description && (
                <p className="text-xs text-stone-500 mb-2">{field.description}</p>
              )}

              {/* Input based on type */}
              {field.type === "text" && (
                <input
                  ref={(el) => {
                    inputRefs.current.set(field.id, el);
                  }}
                  type="text"
                  value={formValues[field.id] || ""}
                  onChange={(e) => onFieldChange(field.id, e.target.value)}
                  placeholder={field.isRequired ? "Required" : "Optional"}
                  className={cn(
                    "w-full px-3 py-2 text-sm border rounded-md transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-[#0E4268]/20 focus:border-[#0E4268]",
                    hasValue
                      ? "border-stone-200 bg-white"
                      : "border-stone-200 bg-stone-50"
                  )}
                />
              )}

              {field.type === "select" && field.options && (
                <select
                  value={formValues[field.id] || ""}
                  onChange={(e) => onFieldChange(field.id, e.target.value)}
                  className={cn(
                    "w-full px-3 py-2 text-sm border rounded-md transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-[#0E4268]/20 focus:border-[#0E4268]",
                    hasValue
                      ? "border-stone-200 bg-white"
                      : "border-stone-200 bg-stone-50"
                  )}
                >
                  <option value="">Select...</option>
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}

              {field.type === "radio" && field.options && (
                <div className="flex flex-wrap gap-2">
                  {field.options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => onFieldChange(field.id, opt.value)}
                      className={cn(
                        "px-3 py-1.5 text-sm border rounded-md transition-colors",
                        formValues[field.id] === opt.value
                          ? "bg-[#0E4268] text-white border-[#0E4268]"
                          : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
