"use client";

import { useState } from "react";
import {
  FileText,
  Edit3,
  Check,
  X,
  ExternalLink,
  Eye,
  AlertCircle,
  AlertTriangle,
  Info,
  Clock,
  CheckCircle2,
  MessageSquare,
  Send,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCaseDetailStore } from "@/store/case-detail-store";
import {
  EnhancedChecklistItem,
  EnhancedQualityIssue,
  LinkedDocument,
  IssueStatus,
} from "@/types/case-detail";

interface ChecklistDetailPanelProps {
  sectionTitle: string;
  items: EnhancedChecklistItem[];
  issues: EnhancedQualityIssue[];
}

// Source badge configuration
const SOURCE_CONFIG = {
  extracted: {
    label: "Extracted",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
  },
  questionnaire: {
    label: "Questionnaire",
    bgColor: "bg-violet-50",
    textColor: "text-violet-700",
  },
  manual: {
    label: "Manual",
    bgColor: "bg-stone-100",
    textColor: "text-stone-600",
  },
};

// Issue severity configuration
const SEVERITY_CONFIG = {
  error: {
    icon: AlertCircle,
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    textColor: "text-rose-700",
    iconColor: "text-rose-500",
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-700",
    iconColor: "text-amber-500",
  },
  info: {
    icon: Info,
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    iconColor: "text-blue-500",
  },
};

// Issue status configuration
const STATUS_CONFIG: Record<
  IssueStatus,
  { label: string; bgColor: string; textColor: string }
> = {
  open: { label: "Open", bgColor: "bg-stone-100", textColor: "text-stone-600" },
  in_progress: {
    label: "In Progress",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
  },
  forwarded: {
    label: "Forwarded",
    bgColor: "bg-violet-100",
    textColor: "text-violet-700",
  },
  pending_review: {
    label: "Pending Review",
    bgColor: "bg-amber-100",
    textColor: "text-amber-700",
  },
  resolved: {
    label: "Resolved",
    bgColor: "bg-emerald-100",
    textColor: "text-emerald-700",
  },
};

// Field row component
function FieldRow({ item }: { item: EnhancedChecklistItem }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(item.value || "");
  const updateField = useCaseDetailStore(
    (state) => state.updateEnhancedChecklistField
  );

  const handleSave = () => {
    updateField(item.id, editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(item.value || "");
    setIsEditing(false);
  };

  const sourceConfig = item.source ? SOURCE_CONFIG[item.source] : null;

  const statusColor = item.status === "complete"
    ? "bg-emerald-500"
    : item.status === "partial"
      ? "bg-amber-500"
      : "bg-stone-300";

  return (
    <div className="py-3 border-b border-stone-100 last:border-b-0">
      <div className="flex items-start gap-3">
        {/* Status dot */}
        <div className="pt-1.5 shrink-0">
          <div className={cn("size-2 rounded-full", statusColor)} />
        </div>

        {/* Field content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-stone-800">
              {item.label}
            </span>
            {item.isRequired && (
              <span className="text-[10px] text-rose-500 font-medium">
                Required
              </span>
            )}
          </div>

          {/* Value display/edit */}
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="flex-1 px-2 py-1 text-sm border border-stone-300 rounded focus:outline-none focus:border-[#0E4268]"
                autoFocus
              />
              <button
                onClick={handleSave}
                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
              >
                <Check className="size-4" />
              </button>
              <button
                onClick={handleCancel}
                className="p-1 text-stone-400 hover:bg-stone-100 rounded"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-sm",
                  item.value ? "text-stone-600" : "text-stone-400 italic"
                )}
              >
                {item.value || "Not provided"}
              </span>
              {item.isEditable && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit3 className="size-3" />
                </button>
              )}
            </div>
          )}

          {/* Source badge */}
          {sourceConfig && (
            <div className="flex items-center gap-2 mt-1.5">
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded font-medium",
                  sourceConfig.bgColor,
                  sourceConfig.textColor
                )}
              >
                {sourceConfig.label}
              </span>
              {item.confidenceScore !== undefined && (
                <span className="text-[10px] text-stone-400">
                  {item.confidenceScore}% confidence
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Document card component
function DocumentCard({ doc }: { doc: LinkedDocument }) {
  return (
    <div className="flex items-center gap-3 p-2.5 bg-white border border-stone-200 rounded-lg hover:border-stone-300 transition-colors group">
      {/* Thumbnail or icon */}
      <div className="shrink-0 size-10 rounded bg-stone-100 flex items-center justify-center overflow-hidden">
        {doc.thumbnailUrl ? (
          <img
            src={doc.thumbnailUrl}
            alt={doc.fileName}
            className="size-full object-cover"
          />
        ) : (
          <FileText className="size-4 text-stone-400" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-stone-700 truncate">
          {doc.fileName}
        </p>
        <p className="text-xs text-stone-400">
          Page {doc.pageNumbers.join(", ")}
        </p>
      </div>

      {/* Actions */}
      <div className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded"
          aria-label="Preview"
        >
          <Eye className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

// Issue card component
function IssueCard({ issue }: { issue: EnhancedQualityIssue }) {
  const markResolved = useCaseDetailStore((state) => state.markIssueResolved);
  const openForwardModal = useCaseDetailStore((state) => state.openForwardModal);

  const severityConfig = SEVERITY_CONFIG[issue.severity];
  const statusConfig = STATUS_CONFIG[issue.status];
  const SeverityIcon = severityConfig.icon;
  const isResolved = issue.status === "resolved";

  return (
    <div
      className={cn(
        "rounded-lg border-l-4 p-3",
        severityConfig.borderColor,
        severityConfig.bgColor,
        isResolved && "opacity-60"
      )}
    >
      <div className="flex items-start gap-2">
        <SeverityIcon className={cn("size-4 mt-0.5 shrink-0", severityConfig.iconColor)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                "text-sm font-medium",
                severityConfig.textColor,
                isResolved && "line-through"
              )}
            >
              {issue.title}
            </span>
            <span
              className={cn(
                "px-1.5 py-0.5 rounded text-[10px] font-medium",
                statusConfig.bgColor,
                statusConfig.textColor
              )}
            >
              {statusConfig.label}
            </span>
          </div>
          <p className={cn("text-xs mt-1", severityConfig.textColor, "opacity-80")}>
            {issue.description}
          </p>

          {/* Actions */}
          {!isResolved && (
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={() => markResolved(issue.id)}
                className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded transition-colors"
              >
                <CheckCircle2 className="size-3" />
                Resolve
              </button>
              <button
                onClick={() => openForwardModal(issue.id)}
                className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-stone-600 bg-white hover:bg-stone-100 border border-stone-200 rounded transition-colors"
              >
                <Send className="size-3" />
                Forward
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Main Detail Panel
export function ChecklistDetailPanel({
  sectionTitle,
  items,
  issues,
}: ChecklistDetailPanelProps) {
  // Collect all linked documents from items
  const allDocuments = items.flatMap((item) => item.linkedDocuments);
  const uniqueDocuments = allDocuments.filter(
    (doc, index, self) => self.findIndex((d) => d.fileId === doc.fileId) === index
  );

  // Unresolved issues count
  const unresolvedIssues = issues.filter((i) => i.status !== "resolved");

  return (
    <div className="h-full flex flex-col overflow-auto bg-stone-50">
      {/* Section Header */}
      <div className="shrink-0 px-6 py-4 bg-white border-b border-stone-200">
        <h2 className="text-lg font-semibold text-stone-900">{sectionTitle}</h2>
        <p className="text-sm text-stone-500 mt-0.5">
          {items.filter((i) => i.status === "complete").length}/{items.length} fields complete
          {unresolvedIssues.length > 0 && (
            <span className="text-amber-600 ml-2">
              · {unresolvedIssues.length} issue{unresolvedIssues.length > 1 ? "s" : ""}
            </span>
          )}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {/* Structured Data */}
        <div className="px-6 py-4 bg-white border-b border-stone-200">
          <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
            Data Fields
          </h3>
          <div className="group">
            {items.map((item) => (
              <FieldRow key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Linked Documents */}
        <div className="px-6 py-4 bg-white border-b border-stone-200">
          <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
            Source Documents ({uniqueDocuments.length})
          </h3>
          {uniqueDocuments.length > 0 ? (
            <div className="space-y-2">
              {uniqueDocuments.map((doc) => (
                <DocumentCard key={doc.fileId} doc={doc} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-stone-400 italic">No linked documents</p>
          )}
        </div>

        {/* Issues */}
        <div className="px-6 py-4 bg-white">
          <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
            Issues ({unresolvedIssues.length} unresolved)
          </h3>
          {issues.length > 0 ? (
            <div className="space-y-2">
              {issues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-emerald-600">
              <CheckCircle2 className="size-4" />
              <span>No issues found</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
