import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/components/ui/utils';
import { FileText, ChevronDown } from 'lucide-react';
import { GroupInfo } from './types';

// Re-export for backwards compatibility
export type { GroupInfo };

interface MoveToSelectorProps {
  groups: GroupInfo[];
  currentGroupId: string;
  disabled?: boolean;
  onMove: (targetGroupId: string) => void;
  selectedPageIndex?: number;
}

export function MoveToSelector({
  groups,
  currentGroupId,
  disabled = false,
  onMove,
  selectedPageIndex,
}: MoveToSelectorProps) {
  const [open, setOpen] = useState(false);

  const otherGroups = groups.filter((g) => g.id !== currentGroupId);

  const handleMove = (targetGroupId: string) => {
    onMove(targetGroupId);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          disabled={disabled}
          className={cn(
            'group flex items-center gap-2 px-4 py-2 rounded-lg',
            'bg-white',
            'border border-gray-200',
            'transition-all duration-200 ease-out',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            !disabled && 'hover:bg-[#0E4268]/5 hover:border-[#0E4268]/30',
            'focus:outline-none focus:ring-2 focus:ring-[#0E4268]/30 focus:border-[#0E4268]/50'
          )}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(
              'text-gray-500 transition-all duration-200',
              !disabled && 'group-hover:text-[#0E4268] group-hover:translate-x-0.5'
            )}
          >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>

          <span className={cn(
            'text-sm font-medium text-gray-600 transition-colors',
            !disabled && 'group-hover:text-[#0E4268]'
          )}>
            Move to
          </span>

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
        align="end"
        sideOffset={6}
        className={cn(
          'w-72 p-0 overflow-hidden',
          'bg-white',
          'border border-gray-200',
          'rounded-xl',
          'shadow-xl'
        )}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-7 h-10 rounded-md shadow-sm bg-[#0E4268]/20" />
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Select destination
              </p>
              <p className="text-sm text-gray-700 mt-0.5">
                {selectedPageIndex !== undefined ? `Page ${selectedPageIndex + 1}` : 'Selected page'}
              </p>
            </div>
          </div>
        </div>

        {/* Document Options */}
        <div className="p-1.5 space-y-0.5">
          {otherGroups.length === 0 ? (
            <div className="px-3 py-4 text-center">
              <p className="text-sm text-gray-400">No other documents available</p>
            </div>
          ) : (
            otherGroups.map((group) => (
              <button
                key={group.id}
                onClick={() => handleMove(group.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg',
                  'bg-white hover:bg-[#0E4268]/5',
                  'border border-transparent hover:border-[#0E4268]/20',
                  'transition-all duration-150',
                  'focus:outline-none focus:ring-2 focus:ring-[#0E4268]/30'
                )}
              >
                {/* Document Icon */}
                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                  <FileText size={18} className="text-gray-500" />
                </div>

                {/* Document info */}
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-700">
                    {group.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {group.pageCount} {group.pageCount === 1 ? 'page' : 'pages'}
                  </p>
                </div>

                {/* Arrow */}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-300"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2.5 bg-gray-50/80 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            Page will be added to the end of the document
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
