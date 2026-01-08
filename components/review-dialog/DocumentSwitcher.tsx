import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/components/ui/utils';
import { FileText, Check, ChevronDown } from 'lucide-react';
import { GroupInfo } from './types';

// Re-export for backwards compatibility
export type { GroupInfo };

interface DocumentSwitcherProps {
  groups: GroupInfo[];
  currentGroupId: string;
  onSwitch: (groupId: string) => void;
}

export function DocumentSwitcher({
  groups,
  currentGroupId,
  onSwitch,
}: DocumentSwitcherProps) {
  const [open, setOpen] = useState(false);

  const currentGroup = groups.find((g) => g.id === currentGroupId);

  const handleSwitch = (groupId: string) => {
    onSwitch(groupId);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'group flex items-center gap-2.5 px-3 py-2 rounded-lg',
            'bg-white hover:bg-[#0E4268]/5',
            'border border-gray-200 hover:border-[#0E4268]/30',
            'transition-all duration-200 ease-out',
            'focus:outline-none focus:ring-2 focus:ring-[#0E4268]/30 focus:border-[#0E4268]/50'
          )}
        >
          {/* Document Icon */}
          <div className="relative">
            <FileText
              size={18}
              className="text-gray-500 group-hover:text-[#0E4268] transition-colors"
            />
          </div>

          {/* Document Name */}
          <span className="text-sm font-medium text-gray-700 group-hover:text-[#0E4268] transition-colors">
            {currentGroup?.title || 'Select Document'}
          </span>

          {/* Page Count Badge */}
          <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-md">
            {currentGroup?.pageCount || 0}
          </span>

          {/* Chevron */}
          <ChevronDown
            size={14}
            className={cn(
              'text-gray-400 transition-transform duration-200',
              open && 'rotate-180'
            )}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={6}
        className={cn(
          'w-64 p-1.5',
          'bg-white',
          'border border-gray-200',
          'rounded-xl',
          'shadow-xl'
        )}
      >
        <div className="px-2 py-1.5 mb-1">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Documents
          </p>
        </div>

        <div className="space-y-0.5">
          {groups.map((group) => (
            <button
              key={group.id}
              onClick={() => handleSwitch(group.id)}
              className={cn(
                'w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg',
                'transition-all duration-150',
                group.id === currentGroupId
                  ? 'bg-[#0E4268]/10 text-[#0E4268]'
                  : 'hover:bg-gray-50 text-gray-700',
                'focus:outline-none focus:ring-2 focus:ring-[#0E4268]/30'
              )}
            >
              {/* Document Icon */}
              <div className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center',
                group.id === currentGroupId
                  ? 'bg-[#0E4268]/20'
                  : 'bg-gray-100'
              )}>
                <FileText
                  size={16}
                  className={group.id === currentGroupId ? 'text-[#0E4268]' : 'text-gray-500'}
                />
              </div>

              {/* Document Info */}
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <p className={cn(
                    'text-sm font-medium',
                    group.id === currentGroupId ? 'text-[#0E4268]' : 'text-gray-700'
                  )}>
                    {group.title}
                  </p>
                  {/* Status Badge */}
                  {group.status === 'reviewed' || group.fileCount <= 1 ? (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-700">
                      Ready
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-700">
                      Review
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {group.fileCount} {group.fileCount === 1 ? 'file' : 'files'} · {group.pageCount} {group.pageCount === 1 ? 'page' : 'pages'}
                </p>
              </div>

              {/* Check Mark */}
              {group.id === currentGroupId && (
                <Check size={16} className="text-[#0E4268]" strokeWidth={2.5} />
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
