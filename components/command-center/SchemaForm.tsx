'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  Check,
  X,
  Edit2,
  Eye,
  AlertCircle,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Plus,
  Trash2,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCommandCenterStore, useHighlightedFieldId } from '@/store/command-center-store';
import { SCHEMA_DEFINITIONS, getSchemaForDocType } from '@/data/evidence-modules';
import type {
  EvidenceModule,
  ExtractedField,
  EvidenceSlotInstance,
  Issue,
  FieldSource,
} from '@/types/command-center';

// =============================================================================
// Main Component
// =============================================================================

interface SchemaFormProps {
  module: EvidenceModule;
  slotIndex: number;
}

export function SchemaForm({ module, slotIndex }: SchemaFormProps) {
  const slot = module.slots[slotIndex];
  const [expandedSections, setExpandedSections] = useState<string[]>(['extracted']);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  // Get schema for this slot type
  const schema = useMemo(() => {
    // Try to find schema based on template ID
    if (!slot) return undefined;
    return getSchemaForDocType(slot.templateId);
  }, [slot]);

  // Group issues by field
  const issuesByField = useMemo(() => {
    const map = new Map<string, Issue[]>();
    module.issues.forEach((issue) => {
      if (issue.fieldId) {
        const existing = map.get(issue.fieldId) || [];
        map.set(issue.fieldId, [...existing, issue]);
      }
    });
    return map;
  }, [module.issues]);

  // Get slot-level issues (not tied to specific fields)
  const slotIssues = useMemo(() => {
    if (!slot) return [];
    return module.issues.filter(
      (i) => i.slotId === slot.templateId && !i.fieldId
    );
  }, [module.issues, slot]);

  // Handle case when slot doesn't exist
  if (!slot) {
    return (
      <div className="p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-sm font-medium text-gray-900">No evidence slot</h3>
        <p className="text-sm text-gray-500 mt-1">
          This module has no evidence requirements configured.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Slot Header */}
      <SlotHeader slot={slot} schema={schema} />

      {/* Slot-level Issues */}
      {slotIssues.length > 0 && (
        <IssuesList issues={slotIssues} />
      )}

      {/* Extracted Fields Section */}
      {slot.extractedFields.length > 0 && (
        <FormSection
          title="Extracted Data"
          subtitle={`${slot.extractedFields.filter((f) => f.isVerified).length}/${slot.extractedFields.length} verified`}
          icon={<Sparkles className="w-4 h-4 text-purple-500" />}
          isExpanded={expandedSections.includes('extracted')}
          onToggle={() => toggleSection('extracted')}
        >
          <div className="space-y-3">
            {slot.extractedFields.map((field) => (
              <FieldInput
                key={field.id}
                field={field}
                moduleId={module.id}
                issues={issuesByField.get(field.id) || []}
              />
            ))}
          </div>
        </FormSection>
      )}

      {/* Empty State */}
      {slot.extractedFields.length === 0 && slot.documentIds.length === 0 && (
        <EmptySlotState slotName={schema?.name || slot.templateId} />
      )}

      {/* Pending Extraction */}
      {slot.extractedFields.length === 0 && slot.documentIds.length > 0 && (
        <PendingExtractionState documentCount={slot.documentIds.length} />
      )}

      {/* Add Custom Field (if schema allows) */}
      {schema?.allowCustomFields && slot.extractedFields.length > 0 && (
        <AddFieldButton />
      )}
    </div>
  );
}

// =============================================================================
// Slot Header
// =============================================================================

interface SlotHeaderProps {
  slot: EvidenceSlotInstance;
  schema?: ReturnType<typeof getSchemaForDocType>;
}

function SlotHeader({ slot, schema }: SlotHeaderProps) {
  const statusConfig = {
    empty: { label: 'No documents', color: 'text-gray-500', bg: 'bg-gray-100' },
    filled: { label: 'Awaiting verification', color: 'text-blue-600', bg: 'bg-blue-50' },
    verified: { label: 'Verified', color: 'text-green-600', bg: 'bg-green-50' },
  };

  const config = statusConfig[slot.status];

  return (
    <div className="flex items-start justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          {schema?.name || slot.templateId}
        </h3>
        <div className="flex items-center gap-3 mt-1">
          <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', config.bg, config.color)}>
            {config.label}
          </span>
          {slot.documentIds.length > 0 && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <FileText className="w-3.5 h-3.5" />
              {slot.documentIds.length} document{slot.documentIds.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Form Section
// =============================================================================

interface FormSectionProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function FormSection({ title, subtitle, icon, isExpanded, onToggle, children }: FormSectionProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-medium text-gray-900">{title}</span>
          {subtitle && (
            <span className="text-xs text-gray-500">{subtitle}</span>
          )}
        </div>
        {isExpanded ? (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-400" />
        )}
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="pt-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Field Input - Main editable field component
// =============================================================================

interface FieldInputProps {
  field: ExtractedField;
  moduleId: string;
  issues: Issue[];
}

function FieldInput({ field, moduleId, issues }: FieldInputProps) {
  const { setHighlightedField, verifyField, updateFieldValue } = useCommandCenterStore();
  const highlightedFieldId = useHighlightedFieldId();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(field.value));

  const isHighlighted = highlightedFieldId === field.id;
  const hasCriticalIssue = issues.some((i) => i.severity === 'critical');
  const hasWarningIssue = issues.some((i) => i.severity === 'warning');

  const handleFocus = useCallback(() => {
    setHighlightedField(field.id, field.source);
  }, [field.id, field.source, setHighlightedField]);

  const handleSaveEdit = useCallback(() => {
    updateFieldValue(moduleId, field.id, editValue);
    setIsEditing(false);
  }, [moduleId, field.id, editValue, updateFieldValue]);

  const handleVerify = useCallback(() => {
    verifyField(moduleId, field.id, 'current-user');
  }, [moduleId, field.id, verifyField]);

  const confidenceColor = field.confidence >= 0.95
    ? 'text-green-600'
    : field.confidence >= 0.85
    ? 'text-amber-600'
    : 'text-red-600';

  return (
    <div
      className={cn(
        'relative p-3 rounded-lg border-2 transition-all cursor-pointer',
        isHighlighted
          ? 'border-[#0E4369] bg-[#0E4369]/5 ring-2 ring-[#0E4369]/20'
          : hasCriticalIssue
          ? 'border-red-200 bg-red-50'
          : hasWarningIssue
          ? 'border-amber-200 bg-amber-50'
          : 'border-gray-200 bg-white hover:border-gray-300'
      )}
      onClick={handleFocus}
    >
      {/* Field Label & Confidence */}
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {field.label}
        </label>
        <div className="flex items-center gap-2">
          <span className={cn('text-xs', confidenceColor)}>
            {Math.round(field.confidence * 100)}%
          </span>
          {field.isVerified && (
            <span className="flex items-center gap-0.5 text-xs text-green-600">
              <Check className="w-3 h-3" />
              Verified
            </span>
          )}
        </div>
      </div>

      {/* Field Value */}
      <div className="flex items-center gap-2">
        {isEditing ? (
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0E4369]/20 focus:border-[#0E4369]"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={(e) => { e.stopPropagation(); handleSaveEdit(); }}
              className="p-1 rounded bg-green-100 text-green-600 hover:bg-green-200"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setIsEditing(false); setEditValue(String(field.value)); }}
              className="p-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <span className="flex-1 text-sm font-medium text-gray-900">
              {field.displayValue}
            </span>
            <div className="flex items-center gap-1">
              {!field.isVerified && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleVerify(); }}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                  title="Verify field"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                className="p-1.5 rounded-lg text-gray-400 hover:text-[#0E4369] hover:bg-[#0E4369]/10 transition-colors"
                title="Edit field"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                className="p-1.5 rounded-lg text-gray-400 hover:text-[#0E4369] hover:bg-[#0E4369]/10 transition-colors"
                title="View in document"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Source Reference */}
      <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
        <FileText className="w-3 h-3" />
        <span>{field.source.documentName}</span>
        <span>• Page {field.source.pageNumber}</span>
      </div>

      {/* Field Issues */}
      {issues.length > 0 && (
        <div className="mt-3 space-y-2">
          {issues.map((issue) => (
            <FieldIssue key={issue.id} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Field Issue
// =============================================================================

interface FieldIssueProps {
  issue: Issue;
}

function FieldIssue({ issue }: FieldIssueProps) {
  const severityConfig = {
    critical: {
      icon: <AlertCircle className="w-4 h-4" />,
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      iconColor: 'text-red-500',
    },
    warning: {
      icon: <AlertTriangle className="w-4 h-4" />,
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-700',
      iconColor: 'text-amber-500',
    },
    info: {
      icon: <Info className="w-4 h-4" />,
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      iconColor: 'text-blue-500',
    },
  };

  const config = severityConfig[issue.severity];

  return (
    <div className={cn('p-2 rounded-lg border', config.bg, config.border)}>
      <div className="flex items-start gap-2">
        <span className={config.iconColor}>{config.icon}</span>
        <div className="flex-1 min-w-0">
          <p className={cn('text-xs font-medium', config.text)}>{issue.title}</p>
          {issue.suggestion && (
            <p className="text-xs text-gray-600 mt-1">{issue.suggestion}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Issues List (Slot-level)
// =============================================================================

interface IssuesListProps {
  issues: Issue[];
}

function IssuesList({ issues }: IssuesListProps) {
  return (
    <div className="space-y-2">
      {issues.map((issue) => (
        <div
          key={issue.id}
          className={cn(
            'p-4 rounded-xl border-2',
            issue.severity === 'critical'
              ? 'bg-red-50 border-red-200'
              : 'bg-amber-50 border-amber-200'
          )}
        >
          <div className="flex items-start gap-3">
            {issue.severity === 'critical' ? (
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            )}
            <div>
              <h4 className={cn(
                'text-sm font-medium',
                issue.severity === 'critical' ? 'text-red-700' : 'text-amber-700'
              )}>
                {issue.title}
              </h4>
              <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
              {issue.suggestion && (
                <p className="text-sm text-gray-500 mt-2 italic">
                  💡 {issue.suggestion}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// Empty & Pending States
// =============================================================================

function EmptySlotState({ slotName }: { slotName: string }) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
        <FileText className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-sm font-medium text-gray-900">No document assigned</h3>
      <p className="text-sm text-gray-500 mt-1">
        Drag a document from the Evidence Library to link it to {slotName}
      </p>
    </div>
  );
}

function PendingExtractionState({ documentCount }: { documentCount: number }) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-100 flex items-center justify-center">
        <Sparkles className="w-8 h-8 text-purple-500 animate-pulse" />
      </div>
      <h3 className="text-sm font-medium text-gray-900">Processing documents</h3>
      <p className="text-sm text-gray-500 mt-1">
        Extracting data from {documentCount} document{documentCount > 1 ? 's' : ''}...
      </p>
    </div>
  );
}

// =============================================================================
// Add Field Button
// =============================================================================

function AddFieldButton() {
  return (
    <button className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
      <Plus className="w-4 h-4" />
      Add Custom Field
    </button>
  );
}
