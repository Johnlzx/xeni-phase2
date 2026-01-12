'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  FileText,
  Sparkles,
  ClipboardList,
  Link2,
  Check,
  PenLine,
  Eye,
  Lightbulb,
  ArrowRight,
  FileWarning,
  Files,
  MessageSquare,
  Clock,
  User,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ChevronDown,
  Send,
  Flag,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useCommandCenterStore,
  useActiveModule,
} from '@/store/command-center-store';
import { getSchemaForDocType } from '@/data/evidence-modules';
import type { EvidenceModule, ExtractedField, SchemaField, SchemaDefinition, Issue } from '@/types/command-center';

// =============================================================================
// Types
// =============================================================================

type ViewMode = 'form' | 'issues' | 'documents';

// =============================================================================
// Main Component
// =============================================================================

export function VerificationWorkbench() {
  const { ui, closeVerificationWorkbench } = useCommandCenterStore();
  const activeModule = useActiveModule();
  const [currentSlotIndex, setCurrentSlotIndex] = useState(0);
  const [activeView, setActiveView] = useState<ViewMode>('form');
  const [documentPanelOpen, setDocumentPanelOpen] = useState(false);

  useEffect(() => {
    setCurrentSlotIndex(0);
    setActiveView('form');
    setDocumentPanelOpen(false);
  }, [ui.activeModuleId]);

  if (!ui.verificationWorkbenchOpen || !activeModule) {
    return null;
  }

  const validSlotIndex = activeModule.slots.length > 0
    ? Math.min(currentSlotIndex, activeModule.slots.length - 1)
    : 0;

  const currentSlot = activeModule.slots[validSlotIndex];
  const schema = currentSlot ? getSchemaForDocType(currentSlot.templateId) : null;
  const extractedFields = currentSlot?.extractedFields || [];
  const unresolvedIssues = activeModule.issues.filter(i => !i.resolvedAt);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        {/* Backdrop with subtle pattern */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-slate-800/70 to-slate-900/80 backdrop-blur-md"
          onClick={closeVerificationWorkbench}
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ type: 'spring', duration: 0.6, bounce: 0.15 }}
          className="relative w-[94vw] max-w-[1400px] h-[88vh] bg-stone-50 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          style={{
            boxShadow: '0 50px 100px -20px rgba(0,0,0,0.4), 0 30px 60px -30px rgba(0,0,0,0.3)',
          }}
        >
          {/* Decorative top accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500" />

          {/* Header */}
          <WorkbenchHeader
            module={activeModule}
            currentSlotIndex={validSlotIndex}
            totalSlots={activeModule.slots.length}
            onSlotChange={setCurrentSlotIndex}
            onClose={closeVerificationWorkbench}
            activeView={activeView}
            issueCount={unresolvedIssues.length}
          />

          {/* Main Content Area */}
          <div className="flex-1 overflow-hidden relative">
            {/* View Content */}
            <AnimatePresence mode="wait">
              {activeView === 'form' && (
                <motion.div
                  key="form-view"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="h-full"
                >
                  <FormView
                    schema={schema}
                    extractedFields={extractedFields}
                    moduleId={activeModule.id}
                    onViewDocument={() => setDocumentPanelOpen(true)}
                  />
                </motion.div>
              )}

              {activeView === 'issues' && (
                <motion.div
                  key="issues-view"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="h-full"
                >
                  <IssuesView
                    issues={activeModule.issues}
                    moduleName={activeModule.name}
                  />
                </motion.div>
              )}

              {activeView === 'documents' && (
                <motion.div
                  key="documents-view"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="h-full"
                >
                  <DocumentsView
                    module={activeModule}
                    slotIndex={validSlotIndex}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Document Slide-Over Panel (when in form view) */}
            <AnimatePresence>
              {documentPanelOpen && activeView === 'form' && (
                <DocumentSlideOver
                  module={activeModule}
                  slotIndex={validSlotIndex}
                  onClose={() => setDocumentPanelOpen(false)}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Footer with Context Switcher */}
          <WorkbenchFooter
            module={activeModule}
            schema={schema}
            extractedFields={extractedFields}
            activeView={activeView}
            onViewChange={setActiveView}
            issueCount={unresolvedIssues.length}
            documentCount={currentSlot?.linkedDocuments?.length || 0}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// =============================================================================
// Workbench Header
// =============================================================================

interface WorkbenchHeaderProps {
  module: EvidenceModule;
  currentSlotIndex: number;
  totalSlots: number;
  onSlotChange: (index: number) => void;
  onClose: () => void;
  activeView: ViewMode;
  issueCount: number;
}

function WorkbenchHeader({
  module,
  currentSlotIndex,
  totalSlots,
  onSlotChange,
  onClose,
  activeView,
  issueCount,
}: WorkbenchHeaderProps) {
  const currentSlot = module.slots[currentSlotIndex];

  return (
    <div className="flex items-center justify-between px-8 py-5 bg-white/80 backdrop-blur-sm border-b border-stone-200/60">
      <div className="flex items-center gap-6">
        {/* Module Info */}
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-stone-900 tracking-tight">
              {module.name}
            </h2>
            {issueCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 border border-rose-200">
                <AlertCircle className="w-3.5 h-3.5" />
                {issueCount} {issueCount === 1 ? 'issue' : 'issues'}
              </span>
            )}
          </div>
          <p className="text-sm text-stone-500 mt-0.5">
            {currentSlot?.name || 'Evidence Verification'}
          </p>
        </div>

        {/* Slot Navigation Pills */}
        {totalSlots > 1 && (
          <div className="flex items-center gap-2 ml-4 pl-6 border-l border-stone-200">
            <button
              onClick={() => onSlotChange(Math.max(0, currentSlotIndex - 1))}
              disabled={currentSlotIndex === 0}
              className="p-1.5 rounded-lg hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4 text-stone-600" />
            </button>

            <div className="flex items-center gap-1.5 px-2">
              {Array.from({ length: totalSlots }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => onSlotChange(idx)}
                  className={cn(
                    'h-2 rounded-full transition-all duration-300',
                    idx === currentSlotIndex
                      ? 'w-8 bg-gradient-to-r from-amber-500 to-orange-500'
                      : 'w-2 bg-stone-300 hover:bg-stone-400'
                  )}
                />
              ))}
            </div>

            <button
              onClick={() => onSlotChange(Math.min(totalSlots - 1, currentSlotIndex + 1))}
              disabled={currentSlotIndex === totalSlots - 1}
              className="p-1.5 rounded-lg hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4 text-stone-600" />
            </button>
          </div>
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-700 transition-all"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

// =============================================================================
// Form View - Compact Questionnaire
// =============================================================================

interface FormViewProps {
  schema: SchemaDefinition | null | undefined;
  extractedFields: ExtractedField[];
  moduleId: string;
  onViewDocument: () => void;
}

function FormView({ schema, extractedFields, moduleId, onViewDocument }: FormViewProps) {
  const { setHighlightedField } = useCommandCenterStore();
  const [editedFields, setEditedFields] = useState<Set<string>>(new Set());

  const fieldValueMap = useMemo(() => {
    const map = new Map<string, ExtractedField>();
    extractedFields.forEach(ef => {
      if (ef.schemaId) {
        map.set(ef.schemaId, ef);
      }
    });
    return map;
  }, [extractedFields]);

  const handleFieldEdit = useCallback((fieldId: string) => {
    setEditedFields(prev => new Set(prev).add(fieldId));
  }, []);

  if (!schema) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-sm">
          <FileText className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <p className="text-sm text-stone-500">No schema defined for this document type</p>
        </div>
      </div>
    );
  }

  const requiredFields = schema.fields.filter(f => f.required);
  const optionalFields = schema.fields.filter(f => !f.required);
  const filledCount = schema.fields.filter(f => fieldValueMap.has(f.id) || editedFields.has(f.id)).length;

  return (
    <div className="h-full overflow-auto bg-stone-50/50">
      {/* Compact Header Bar */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-stone-200 px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-sm font-semibold text-stone-900">{schema.name}</h3>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-24 bg-stone-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(filledCount / schema.fields.length) * 100}%` }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
              <span className="text-xs text-stone-500 tabular-nums">{filledCount}/{schema.fields.length}</span>
            </div>
          </div>
          <button
            onClick={onViewDocument}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Document
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="px-5 py-4">
        {/* AI Extraction Notice - Compact */}
        {extractedFields.length > 0 && (
          <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-violet-50 border border-violet-200/60 rounded-lg">
            <Sparkles className="w-3.5 h-3.5 text-violet-600" />
            <span className="text-xs text-violet-700">
              {extractedFields.length} fields auto-extracted
            </span>
          </div>
        )}

        {/* Required Fields */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-2.5 px-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Required</span>
          </div>
          <div className="space-y-1">
            {requiredFields.map((field) => (
              <CompactFieldRow
                key={field.id}
                field={field}
                extractedField={fieldValueMap.get(field.id)}
                isEdited={editedFields.has(field.id)}
                onEdit={() => handleFieldEdit(field.id)}
                onHighlight={(ef) => ef && setHighlightedField(ef.id, ef.source)}
                onViewSource={onViewDocument}
              />
            ))}
          </div>
        </div>

        {/* Optional Fields */}
        {optionalFields.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2.5 px-1">
              <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Optional</span>
            </div>
            <div className="space-y-1">
              {optionalFields.map((field) => (
                <CompactFieldRow
                  key={field.id}
                  field={field}
                  extractedField={fieldValueMap.get(field.id)}
                  isEdited={editedFields.has(field.id)}
                  onEdit={() => handleFieldEdit(field.id)}
                  onHighlight={(ef) => ef && setHighlightedField(ef.id, ef.source)}
                  onViewSource={onViewDocument}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// Compact Field Row - Dense, Utilitarian Design
// =============================================================================

interface CompactFieldRowProps {
  field: SchemaField;
  extractedField?: ExtractedField;
  isEdited: boolean;
  onEdit: () => void;
  onHighlight: (ef?: ExtractedField) => void;
  onViewSource: () => void;
}

function CompactFieldRow({ field, extractedField, isEdited, onEdit, onHighlight, onViewSource }: CompactFieldRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(extractedField?.displayValue || '');

  const hasExtractedValue = !!extractedField;
  const hasValue = hasExtractedValue || !!localValue;

  // Status: "Extracted" (from document, untouched) | "Edited" (user modified) | none (manual entry)
  const fieldStatus = hasExtractedValue && !isEdited ? 'extracted' : isEdited ? 'edited' : null;

  const handleSave = () => {
    setIsEditing(false);
    if (hasExtractedValue && localValue !== extractedField?.displayValue) {
      onEdit(); // Mark as edited if value changed from extracted
    } else if (!hasExtractedValue && localValue) {
      onEdit(); // Mark as edited for new manual entries
    }
  };

  const handleViewSource = useCallback(() => {
    if (extractedField) {
      onHighlight(extractedField);
      onViewSource();
    }
  }, [extractedField, onHighlight, onViewSource]);

  return (
    <div className={cn(
      'group flex items-center gap-3 px-3 py-2 rounded-lg border transition-all',
      isEditing
        ? 'bg-white border-stone-300 shadow-sm'
        : hasValue
        ? 'bg-white border-stone-200 hover:border-stone-300'
        : 'bg-stone-50 border-dashed border-stone-200 hover:border-stone-300 hover:bg-white'
    )}>
      {/* Field Label - Fixed Width */}
      <div className="w-36 flex-shrink-0">
        <span className="text-xs font-medium text-stone-600 leading-tight">
          {field.label}
          {field.required && <span className="text-rose-500 ml-0.5">*</span>}
        </span>
      </div>

      {/* Value / Input Area - Flexible */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex items-center gap-2">
            {field.dataType === 'select' && field.options ? (
              <select
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                className="flex-1 px-2 py-1 text-sm bg-white border border-stone-200 rounded focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-200"
                autoFocus
              >
                <option value="">Select...</option>
                {field.options.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.dataType === 'date' ? 'date' : field.dataType === 'number' ? 'number' : 'text'}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                className="flex-1 px-2 py-1 text-sm bg-white border border-stone-200 rounded focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-200"
                autoFocus
              />
            )}
            <button
              onClick={handleSave}
              className="p-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setLocalValue(extractedField?.displayValue || '');
                setIsEditing(false);
              }}
              className="p-1 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full flex items-center text-left group/value"
          >
            {hasValue ? (
              <span className="text-sm text-stone-900 truncate">
                {localValue || extractedField?.displayValue}
              </span>
            ) : (
              <span className="text-xs text-stone-400">
                —
              </span>
            )}
            <PenLine className="w-3 h-3 text-stone-300 ml-2 opacity-0 group-hover/value:opacity-100 flex-shrink-0 transition-opacity" />
          </button>
        )}
      </div>

      {/* Status Badge & Actions - Fixed Width */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {fieldStatus === 'extracted' && (
          <span className="px-1.5 py-0.5 text-[10px] font-semibold text-teal-700 bg-teal-100 rounded">
            Extracted
          </span>
        )}
        {fieldStatus === 'edited' && (
          <span className="px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 bg-amber-100 rounded">
            Edited
          </span>
        )}

        {/* Source Link Button */}
        {extractedField?.source && (
          <button
            onClick={handleViewSource}
            className="p-1 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded transition-colors"
            title={`${extractedField.source.documentName}, Page ${extractedField.source.pageNumber}`}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// Issues View
// =============================================================================

interface IssuesViewProps {
  issues: Issue[];
  moduleName: string;
}

function IssuesView({ issues, moduleName }: IssuesViewProps) {
  const unresolvedIssues = issues.filter(i => !i.resolvedAt);
  const resolvedIssues = issues.filter(i => i.resolvedAt);

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-3xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-stone-900 tracking-tight">
            Issues & Flags
          </h3>
          <p className="text-stone-500 mt-1">
            Review and resolve issues for {moduleName}
          </p>
        </div>

        {unresolvedIssues.length === 0 && resolvedIssues.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h4 className="text-xl font-semibold text-stone-900 mb-2">No Issues Found</h4>
            <p className="text-stone-500 max-w-sm mx-auto">
              This evidence module has no reported issues. Everything looks good!
            </p>
          </div>
        ) : (
          <>
            {/* Unresolved Issues */}
            {unresolvedIssues.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 rounded-full bg-rose-500" />
                  <h4 className="text-xs font-bold text-stone-500 uppercase tracking-widest">
                    Open Issues ({unresolvedIssues.length})
                  </h4>
                </div>

                <div className="space-y-3">
                  {unresolvedIssues.map((issue, idx) => (
                    <IssueCard key={issue.id} issue={issue} index={idx} />
                  ))}
                </div>
              </div>
            )}

            {/* Resolved Issues */}
            {resolvedIssues.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                    Resolved ({resolvedIssues.length})
                  </h4>
                </div>

                <div className="space-y-3 opacity-60">
                  {resolvedIssues.map((issue, idx) => (
                    <IssueCard key={issue.id} issue={issue} index={idx} resolved />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Add Issue Button */}
        <div className="mt-8 pt-8 border-t border-stone-200">
          <button className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-stone-600 border-2 border-dashed border-stone-300 rounded-xl hover:border-stone-400 hover:bg-stone-50 transition-all w-full justify-center">
            <Flag className="w-4 h-4" />
            Flag a New Issue
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Issue Card
// =============================================================================

interface IssueCardProps {
  issue: Issue;
  index: number;
  resolved?: boolean;
}

function IssueCard({ issue, index, resolved }: IssueCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className={cn(
        'p-5 rounded-2xl border-2 transition-all',
        resolved
          ? 'border-stone-200 bg-stone-50'
          : issue.severity === 'critical'
          ? 'border-rose-200 bg-gradient-to-r from-rose-50 to-red-50/50'
          : 'border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50/50'
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
          resolved
            ? 'bg-stone-200'
            : issue.severity === 'critical'
            ? 'bg-rose-100'
            : 'bg-amber-100'
        )}>
          {resolved ? (
            <CheckCircle2 className="w-5 h-5 text-stone-500" />
          ) : issue.severity === 'critical' ? (
            <AlertCircle className="w-5 h-5 text-rose-600" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn(
              'text-xs font-bold uppercase tracking-wider',
              resolved
                ? 'text-stone-500'
                : issue.severity === 'critical'
                ? 'text-rose-600'
                : 'text-amber-600'
            )}>
              {issue.severity === 'critical' ? 'Critical' : 'Warning'}
            </span>
            {issue.type && (
              <>
                <span className="text-stone-300">•</span>
                <span className="text-xs text-stone-500">{issue.type.replace(/-/g, ' ')}</span>
              </>
            )}
          </div>

          <h5 className="font-semibold text-stone-900 mb-2">{issue.title}</h5>
          <p className="text-sm text-stone-600">{issue.description}</p>

          {!resolved && (
            <div className="flex items-center gap-2 mt-4">
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors">
                <Check className="w-3 h-3" />
                Resolve
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-600 bg-stone-100 rounded-lg hover:bg-stone-200 transition-colors">
                <Send className="w-3 h-3" />
                Request from Client
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// =============================================================================
// Documents View
// =============================================================================

interface DocumentsViewProps {
  module: EvidenceModule;
  slotIndex: number;
}

function DocumentsView({ module, slotIndex }: DocumentsViewProps) {
  const currentSlot = module.slots[slotIndex];
  const linkedDocs = currentSlot?.linkedDocuments || [];
  const [selectedDoc, setSelectedDoc] = useState<string | null>(linkedDocs[0]?.id || null);

  return (
    <div className="h-full flex">
      {/* Document List Sidebar */}
      <div className="w-72 border-r border-stone-200 bg-white/50">
        <div className="p-4 border-b border-stone-200">
          <h4 className="text-sm font-semibold text-stone-900">Linked Documents</h4>
          <p className="text-xs text-stone-500 mt-0.5">{linkedDocs.length} documents</p>
        </div>

        <div className="p-2 space-y-1">
          {linkedDocs.length === 0 ? (
            <div className="p-4 text-center">
              <FileText className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p className="text-xs text-stone-500">No documents linked</p>
            </div>
          ) : (
            linkedDocs.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setSelectedDoc(doc.id)}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all',
                  selectedDoc === doc.id
                    ? 'bg-stone-900 text-white'
                    : 'hover:bg-stone-100 text-stone-700'
                )}
              >
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                  selectedDoc === doc.id ? 'bg-white/20' : 'bg-stone-100'
                )}>
                  <FileText className={cn('w-5 h-5', selectedDoc === doc.id ? 'text-white' : 'text-stone-500')} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm font-medium truncate', selectedDoc === doc.id ? 'text-white' : 'text-stone-900')}>
                    {doc.name}
                  </p>
                  <p className={cn('text-xs', selectedDoc === doc.id ? 'text-white/60' : 'text-stone-500')}>
                    {doc.pages || 1} pages
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Document Preview */}
      <div className="flex-1 bg-stone-900 flex items-center justify-center">
        {selectedDoc ? (
          <div className="text-center">
            <div className="w-96 h-[500px] bg-white rounded-lg shadow-2xl flex items-center justify-center mx-auto mb-4">
              <div className="text-stone-400">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-sm">Document Preview</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors">
                <ZoomOut className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors">
                <ZoomIn className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors">
                <RotateCw className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center text-white/50">
            <Files className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-sm">Select a document to preview</p>
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// Document Slide-Over Panel
// =============================================================================

interface DocumentSlideOverProps {
  module: EvidenceModule;
  slotIndex: number;
  onClose: () => void;
}

function DocumentSlideOver({ module, slotIndex, onClose }: DocumentSlideOverProps) {
  const currentSlot = module.slots[slotIndex];
  const linkedDocs = currentSlot?.linkedDocuments || [];

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/20"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="absolute right-0 top-0 bottom-0 w-[55%] bg-stone-900 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Document Preview</h4>
              <p className="text-xs text-white/50">
                {linkedDocs.length} linked {linkedDocs.length === 1 ? 'document' : 'documents'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors">
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-60px)] flex items-center justify-center p-8">
          {linkedDocs.length > 0 ? (
            <div className="w-full max-w-lg">
              <div className="aspect-[3/4] bg-white rounded-xl shadow-2xl flex items-center justify-center">
                <div className="text-stone-400 text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-sm">{linkedDocs[0].name}</p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3 mt-6">
                <button className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-white/60 px-4">Page 1 of 3</span>
                <button className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-white/50">
              <Files className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-sm">No documents linked to this slot</p>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}

// =============================================================================
// Workbench Footer with Context Switcher
// =============================================================================

interface WorkbenchFooterProps {
  module: EvidenceModule;
  schema: SchemaDefinition | null | undefined;
  extractedFields: ExtractedField[];
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  issueCount: number;
  documentCount: number;
}

function WorkbenchFooter({
  module,
  schema,
  extractedFields,
  activeView,
  onViewChange,
  issueCount,
  documentCount,
}: WorkbenchFooterProps) {
  const requiredCount = schema?.fields.filter(f => f.required).length || 0;
  const filledRequiredCount = schema?.fields.filter(f => {
    if (!f.required) return false;
    return extractedFields.some(ef => ef.schemaId === f.id);
  }).length || 0;

  const canMarkReady = module.issues.filter(i => i.severity === 'critical' && !i.resolvedAt).length === 0;

  return (
    <div className="flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-sm border-t border-stone-200/60">
      {/* Left - Progress Info */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 text-sm">
          <span className="text-stone-500">Required fields:</span>
          <span className="font-bold text-stone-900">{filledRequiredCount}/{requiredCount}</span>
        </div>
      </div>

      {/* Center - Context Switcher */}
      <div className="flex items-center p-1.5 bg-stone-100 rounded-2xl">
        <ViewSwitchButton
          active={activeView === 'form'}
          onClick={() => onViewChange('form')}
          icon={<ClipboardList className="w-4 h-4" />}
          label="Form"
        />
        <ViewSwitchButton
          active={activeView === 'issues'}
          onClick={() => onViewChange('issues')}
          icon={<FileWarning className="w-4 h-4" />}
          label="Issues"
          badge={issueCount > 0 ? issueCount : undefined}
          badgeColor="rose"
        />
        <ViewSwitchButton
          active={activeView === 'documents'}
          onClick={() => onViewChange('documents')}
          icon={<Files className="w-4 h-4" />}
          label="Documents"
          badge={documentCount > 0 ? documentCount : undefined}
          badgeColor="blue"
        />
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-3">
        <button className="px-4 py-2.5 text-sm font-medium text-stone-700 border border-stone-300 rounded-xl hover:bg-stone-50 transition-colors">
          Request Info
        </button>
        <button
          disabled={!canMarkReady}
          className={cn(
            'flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all',
            canMarkReady
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-orange-500/25'
              : 'bg-stone-100 text-stone-400 cursor-not-allowed'
          )}
        >
          <CheckCircle2 className="w-4 h-4" />
          Mark as Ready
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// View Switch Button
// =============================================================================

interface ViewSwitchButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: number;
  badgeColor?: 'rose' | 'blue' | 'amber';
}

function ViewSwitchButton({ active, onClick, icon, label, badge, badgeColor = 'rose' }: ViewSwitchButtonProps) {
  const badgeColors = {
    rose: 'bg-rose-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
        active
          ? 'bg-white text-stone-900 shadow-sm'
          : 'text-stone-500 hover:text-stone-700'
      )}
    >
      {icon}
      <span>{label}</span>
      {badge !== undefined && (
        <span className={cn(
          'min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold text-white rounded-full',
          badgeColors[badgeColor]
        )}>
          {badge}
        </span>
      )}
    </button>
  );
}
