'use client';

import { useMemo } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Clock,
  FileQuestion,
  ChevronRight,
  Shield,
  User,
  Briefcase,
  Banknote,
  Languages,
  Home,
  Heart,
  GraduationCap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useModules, useCommandCenterStore, useApplication } from '@/store/command-center-store';
import { EmptyBoardState } from './EmptyBoardState';
import type { EvidenceModule, ModuleStatus, ModuleCategory } from '@/types/command-center';

// Category icon mapping
const CATEGORY_ICONS: Record<ModuleCategory, React.ReactNode> = {
  identity: <User className="w-5 h-5" />,
  sponsorship: <Briefcase className="w-5 h-5" />,
  financial: <Banknote className="w-5 h-5" />,
  english: <Languages className="w-5 h-5" />,
  accommodation: <Home className="w-5 h-5" />,
  relationship: <Heart className="w-5 h-5" />,
  business: <Shield className="w-5 h-5" />,
  academic: <GraduationCap className="w-5 h-5" />,
};

// Status configurations
const STATUS_CONFIG: Record<
  ModuleStatus,
  {
    icon: React.ReactNode;
    label: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
    iconColor: string;
  }
> = {
  ready: {
    icon: <CheckCircle2 className="w-4 h-4" />,
    label: 'Ready',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
    iconColor: 'text-green-500',
  },
  'critical-issue': {
    icon: <AlertCircle className="w-4 h-4" />,
    label: 'Critical Issue',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
    iconColor: 'text-red-500',
  },
  'review-needed': {
    icon: <AlertTriangle className="w-4 h-4" />,
    label: 'Review Needed',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    iconColor: 'text-amber-500',
  },
  'in-progress': {
    icon: <Clock className="w-4 h-4" />,
    label: 'In Progress',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-500',
  },
  empty: {
    icon: <FileQuestion className="w-4 h-4" />,
    label: 'Empty',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-500',
    borderColor: 'border-gray-200 border-dashed',
    iconColor: 'text-gray-400',
  },
};

interface ApplicationChecklistProps {
  caseName?: string;
}

export function ApplicationChecklist({ caseName }: ApplicationChecklistProps) {
  const application = useApplication();
  const modules = useModules();
  const { openVerificationWorkbench } = useCommandCenterStore();

  // Calculate stats
  const stats = useMemo(() => {
    if (!application || modules.length === 0) {
      return { total: 0, ready: 0, critical: 0, warning: 0 };
    }
    return {
      total: modules.length,
      ready: modules.filter((m) => m.status === 'ready').length,
      critical: modules.filter((m) => m.status === 'critical-issue').length,
      warning: modules.filter((m) => m.status === 'review-needed').length,
    };
  }, [application, modules]);

  // Show empty state if no application started
  if (!application || !application.triageCompleted) {
    return <EmptyBoardState caseName={caseName} />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Application Checklist</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {application.visaRouteName} - {stats.total} requirements
          </p>
        </div>

        {/* Stats Summary */}
        <div className="flex items-center gap-4">
          <StatBadge
            label="Ready"
            count={stats.ready}
            total={stats.total}
            color="green"
          />
          {stats.critical > 0 && (
            <StatBadge
              label="Critical"
              count={stats.critical}
              color="red"
            />
          )}
          {stats.warning > 0 && (
            <StatBadge
              label="Review"
              count={stats.warning}
              color="amber"
            />
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#0E4369] to-[#0E4369]/80 transition-all duration-500"
          style={{ width: `${(stats.ready / stats.total) * 100}%` }}
        />
      </div>

      {/* Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((module) => (
          <EvidenceModuleCard
            key={module.id}
            module={module}
            onClick={() => openVerificationWorkbench(module.id)}
          />
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// Stats Badge
// =============================================================================

interface StatBadgeProps {
  label: string;
  count: number;
  total?: number;
  color: 'green' | 'red' | 'amber';
}

function StatBadge({ label, count, total, color }: StatBadgeProps) {
  const colorClasses = {
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
    amber: 'bg-amber-100 text-amber-700',
  };

  return (
    <div className={cn('px-3 py-1.5 rounded-lg text-xs font-medium', colorClasses[color])}>
      {count}
      {total !== undefined && `/${total}`} {label}
    </div>
  );
}

// =============================================================================
// Evidence Module Card
// =============================================================================

interface EvidenceModuleCardProps {
  module: EvidenceModule;
  onClick: () => void;
}

function EvidenceModuleCard({ module, onClick }: EvidenceModuleCardProps) {
  const config = STATUS_CONFIG[module.status];
  const categoryIcon = CATEGORY_ICONS[module.category];

  const unresolvedIssues = module.issues.filter((i) => !i.resolvedAt);
  const criticalCount = unresolvedIssues.filter((i) => i.severity === 'critical').length;
  const warningCount = unresolvedIssues.filter((i) => i.severity === 'warning').length;

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full p-4 rounded-xl border-2 text-left transition-all group',
        'hover:shadow-md hover:scale-[1.01]',
        config.borderColor,
        config.bgColor
      )}
    >
      <div className="flex items-start gap-4">
        {/* Category Icon */}
        <div
          className={cn(
            'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center',
            module.status === 'empty' ? 'bg-gray-100' : 'bg-white shadow-sm'
          )}
        >
          <span className={config.iconColor}>{categoryIcon}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {module.name}
            </h3>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  module.status === 'ready'
                    ? 'bg-green-500'
                    : module.status === 'critical-issue'
                    ? 'bg-red-500'
                    : 'bg-[#0E4369]'
                )}
                style={{
                  width: `${
                    module.progress.total > 0
                      ? (module.progress.completed / module.progress.total) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
            <span className="text-xs text-gray-500">
              {module.progress.completed}/{module.progress.total}
            </span>
          </div>

          {/* Status & Issues */}
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                config.bgColor,
                config.textColor
              )}
            >
              {config.icon}
              {config.label}
            </span>

            {criticalCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                <AlertCircle className="w-3 h-3" />
                {criticalCount}
              </span>
            )}

            {warningCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                <AlertTriangle className="w-3 h-3" />
                {warningCount}
              </span>
            )}
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#0E4369] transition-colors" />
      </div>

      {/* Critical Issue Preview */}
      {criticalCount > 0 && (
        <div className="mt-3 pt-3 border-t border-red-200">
          <p className="text-xs text-red-600 line-clamp-2">
            {unresolvedIssues.find((i) => i.severity === 'critical')?.title}
          </p>
        </div>
      )}
    </button>
  );
}
