'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Check, Circle, AlertCircle, Lock, FileText } from 'lucide-react';
import { useCaseDetailStore } from '@/store/case-detail-store';
import { ChecklistItem, ChecklistItemStatus } from '@/types/case-detail';
import { cn } from '@/lib/utils';

interface ChecklistItemRowProps {
  item: ChecklistItem;
  depth?: number;
  onStatusChange: (itemId: string, status: ChecklistItemStatus) => void;
}

function getStatusIcon(status: ChecklistItemStatus) {
  switch (status) {
    case 'completed':
      return <Check className="w-4 h-4 text-green-600" />;
    case 'in-progress':
      return <Circle className="w-4 h-4 text-blue-500 fill-blue-500" />;
    case 'blocked':
      return <Lock className="w-4 h-4 text-gray-400" />;
    default:
      return <Circle className="w-4 h-4 text-gray-300" />;
  }
}

function ChecklistItemRow({ item, depth = 0, onStatusChange }: ChecklistItemRowProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = item.children && item.children.length > 0;
  const isBlocked = item.status === 'blocked';

  const handleClick = () => {
    if (isBlocked) return;

    if (hasChildren) {
      setIsExpanded(!isExpanded);
    } else {
      // Toggle between pending and completed
      const newStatus: ChecklistItemStatus =
        item.status === 'completed' ? 'pending' : 'completed';
      onStatusChange(item.id, newStatus);
    }
  };

  return (
    <div>
      <div
        onClick={handleClick}
        className={cn(
          'flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all cursor-pointer',
          depth === 0 ? 'bg-gray-50 hover:bg-gray-100' : 'hover:bg-gray-50',
          isBlocked && 'opacity-50 cursor-not-allowed'
        )}
        style={{ paddingLeft: `${12 + depth * 20}px` }}
      >
        {/* Expand/Collapse or Status Icon */}
        {hasChildren ? (
          <button className="p-0.5 -ml-1">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </button>
        ) : (
          <div className="p-0.5 -ml-1">{getStatusIcon(item.status)}</div>
        )}

        {/* Label */}
        <span
          className={cn(
            'flex-1 text-sm',
            item.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900',
            depth === 0 && 'font-medium'
          )}
        >
          {item.label}
        </span>

        {/* Linked documents indicator */}
        {item.linkedDocuments && item.linkedDocuments.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <FileText className="w-3 h-3" />
            <span>{item.linkedDocuments.length}</span>
          </div>
        )}

        {/* Status badge for parent items */}
        {hasChildren && (
          <span
            className={cn(
              'text-xs px-2 py-0.5 rounded-full',
              item.status === 'completed'
                ? 'bg-green-100 text-green-700'
                : item.status === 'in-progress'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600'
            )}
          >
            {item.children?.filter((c) => c.status === 'completed').length}/{item.children?.length}
          </span>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="ml-2">
          {item.children?.map((child) => (
            <ChecklistItemRow
              key={child.id}
              item={child}
              depth={depth + 1}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function MultiStepMode() {
  const checklist = useCaseDetailStore((state) => state.checklist);
  const updateChecklistItem = useCaseDetailStore((state) => state.updateChecklistItem);

  const { completed, total } = checklist.progress;
  const progress = total > 0 ? (completed / total) * 100 : 0;

  // Group items by category
  const categories = checklist.items.reduce((acc, item) => {
    const category = item.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  const categoryLabels: Record<string, string> = {
    identity: 'Identity Documents',
    financial: 'Financial Evidence',
    sponsorship: 'Sponsorship',
    english: 'English Language',
    other: 'Other Requirements',
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Application Checklist</h3>
          <p className="text-sm text-gray-500">Complete all required items before submission</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-600">
            {completed}/{total}
          </span>
        </div>
      </div>

      {/* Checklist sections */}
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
        {Object.entries(categories).map(([category, items]) => (
          <div key={category} className="p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2 px-3">
              {categoryLabels[category] || category}
            </h4>
            <div className="space-y-1">
              {items.map((item) => (
                <ChecklistItemRow
                  key={item.id}
                  item={item}
                  onStatusChange={updateChecklistItem}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Completion message */}
      {completed === total && total > 0 && (
        <div className="flex items-center justify-center gap-2 py-4 px-6 bg-green-50 rounded-xl border border-green-200 text-green-700">
          <Check className="w-5 h-5" />
          <span className="font-medium">All items completed! Ready for review.</span>
        </div>
      )}
    </div>
  );
}
