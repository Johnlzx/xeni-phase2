'use client';

import { useMemo, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Info,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCommandCenterStore, useApplication } from '@/store/command-center-store';
import type { Issue, IssueSeverity } from '@/types/command-center';

const SEVERITY_CONFIG: Record<
  IssueSeverity,
  {
    icon: React.ReactNode;
    label: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
  }
> = {
  critical: {
    icon: <AlertCircle className="w-4 h-4" />,
    label: 'Critical',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
  },
  warning: {
    icon: <AlertTriangle className="w-4 h-4" />,
    label: 'Warning',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
  },
  info: {
    icon: <Info className="w-4 h-4" />,
    label: 'Info',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
  },
};

export function IssueCenter() {
  const application = useApplication();
  const { ui, openVerificationWorkbench, openClientRequestModal, setIssueFilter } =
    useCommandCenterStore();
  const [activeTab, setActiveTab] = useState<'issues' | 'resolved'>('issues');

  // Get all issues from modules
  const allIssues = useMemo(() => {
    if (!application) return [];
    return application.modules.flatMap((m) =>
      m.issues.map((issue) => ({
        ...issue,
        moduleName: m.name,
      }))
    );
  }, [application]);

  // Filter issues
  const unresolvedIssues = allIssues.filter((i) => !i.resolvedAt);
  const resolvedIssues = allIssues.filter((i) => i.resolvedAt);

  // Apply severity filter
  const filteredUnresolved =
    ui.issueFilter === 'all'
      ? unresolvedIssues
      : unresolvedIssues.filter((i) => i.severity === ui.issueFilter);

  const criticalCount = unresolvedIssues.filter((i) => i.severity === 'critical').length;
  const warningCount = unresolvedIssues.filter((i) => i.severity === 'warning').length;

  if (!application || !application.triageCompleted) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center">
          <AlertTriangle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Start building your application</p>
          <p className="text-xs text-gray-400 mt-1">Issues will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab('issues')}
          className={cn(
            'flex-1 px-4 py-2.5 text-xs font-medium transition-colors relative',
            activeTab === 'issues'
              ? 'text-[#0E4369]'
              : 'text-gray-500 hover:text-gray-700'
          )}
        >
          Open Issues
          {unresolvedIssues.length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-red-100 text-red-700">
              {unresolvedIssues.length}
            </span>
          )}
          {activeTab === 'issues' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0E4369]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('resolved')}
          className={cn(
            'flex-1 px-4 py-2.5 text-xs font-medium transition-colors relative',
            activeTab === 'resolved'
              ? 'text-[#0E4369]'
              : 'text-gray-500 hover:text-gray-700'
          )}
        >
          Resolved
          {resolvedIssues.length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-green-100 text-green-700">
              {resolvedIssues.length}
            </span>
          )}
          {activeTab === 'resolved' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0E4369]" />
          )}
        </button>
      </div>

      {/* Filter Bar (only for issues tab) */}
      {activeTab === 'issues' && unresolvedIssues.length > 0 && (
        <div className="px-3 py-2 border-b border-gray-100 flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-gray-400" />
          <div className="flex gap-1">
            <FilterChip
              label="All"
              count={unresolvedIssues.length}
              active={ui.issueFilter === 'all'}
              onClick={() => setIssueFilter('all')}
            />
            <FilterChip
              label="Critical"
              count={criticalCount}
              active={ui.issueFilter === 'critical'}
              onClick={() => setIssueFilter('critical')}
              color="red"
            />
            <FilterChip
              label="Warning"
              count={warningCount}
              active={ui.issueFilter === 'warning'}
              onClick={() => setIssueFilter('warning')}
              color="amber"
            />
          </div>
        </div>
      )}

      {/* Issue List */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'issues' ? (
          filteredUnresolved.length > 0 ? (
            <div className="p-3 space-y-2">
              {filteredUnresolved.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  moduleName={(issue as Issue & { moduleName: string }).moduleName}
                  onNavigate={() => openVerificationWorkbench(issue.moduleId)}
                  onRequestInfo={openClientRequestModal}
                />
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-6">
              <div className="text-center">
                <CheckCircle2 className="w-10 h-10 text-green-300 mx-auto mb-3" />
                <p className="text-sm text-gray-600 font-medium">All clear!</p>
                <p className="text-xs text-gray-400 mt-1">No open issues</p>
              </div>
            </div>
          )
        ) : resolvedIssues.length > 0 ? (
          <div className="p-3 space-y-2">
            {resolvedIssues.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                moduleName={(issue as Issue & { moduleName: string }).moduleName}
                resolved
              />
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center p-6">
            <div className="text-center">
              <Info className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No resolved issues yet</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// Filter Chip
// =============================================================================

interface FilterChipProps {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  color?: 'gray' | 'red' | 'amber';
}

function FilterChip({ label, count, active, onClick, color = 'gray' }: FilterChipProps) {
  const colorClasses = {
    gray: active ? 'bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-500',
    red: active ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500',
    amber: active ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500',
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors',
        colorClasses[color]
      )}
    >
      {label} ({count})
    </button>
  );
}

// =============================================================================
// Issue Card
// =============================================================================

interface IssueCardProps {
  issue: Issue;
  moduleName: string;
  resolved?: boolean;
  onNavigate?: () => void;
  onRequestInfo?: () => void;
}

function IssueCard({
  issue,
  moduleName,
  resolved,
  onNavigate,
  onRequestInfo,
}: IssueCardProps) {
  const config = SEVERITY_CONFIG[issue.severity];

  return (
    <div
      className={cn(
        'p-3 rounded-lg border transition-all',
        resolved ? 'bg-gray-50 border-gray-200 opacity-75' : config.bgColor,
        resolved ? 'border-gray-200' : config.borderColor
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-2">
        <span className={cn(resolved ? 'text-gray-400' : config.textColor)}>
          {resolved ? <CheckCircle2 className="w-4 h-4" /> : config.icon}
        </span>
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              'text-xs font-medium',
              resolved ? 'text-gray-500 line-through' : 'text-gray-900'
            )}
          >
            {issue.title}
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">{moduleName}</p>
        </div>
        {!resolved && (
          <span
            className={cn(
              'flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium',
              config.bgColor,
              config.textColor
            )}
          >
            {config.label}
          </span>
        )}
      </div>

      {/* Description */}
      <p
        className={cn(
          'mt-2 text-[11px] leading-relaxed',
          resolved ? 'text-gray-400' : 'text-gray-600'
        )}
      >
        {issue.description}
      </p>

      {/* Actions */}
      {!resolved && (
        <div className="mt-3 flex items-center gap-2">
          {onNavigate && (
            <button
              onClick={onNavigate}
              className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium text-[#0E4369] bg-white border border-[#0E4369]/20 hover:bg-[#0E4369]/5 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Go to module
            </button>
          )}
          {onRequestInfo && (
            <button
              onClick={onRequestInfo}
              className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <MessageSquare className="w-3 h-3" />
              Request info
            </button>
          )}
        </div>
      )}

      {/* Resolved info */}
      {resolved && issue.resolvedAt && (
        <p className="mt-2 text-[10px] text-gray-400">
          Resolved on {new Date(issue.resolvedAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
