import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/components/ui/utils';
import { MoveToSelector } from './MoveToSelector';
import { GroupInfo } from './types';
import { THEME_CLASSES } from './constants';

interface ReviewDialogToolbarProps {
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  groups: GroupInfo[];
  currentGroupId: string;
  hasOtherGroups: boolean;
  canMoveToGroup: boolean;
  onMoveToGroup?: (targetGroupId: string) => void;
  selectedPageIndex: number;
}

export function ReviewDialogToolbar({
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  groups,
  currentGroupId,
  hasOtherGroups,
  canMoveToGroup,
  onMoveToGroup,
  selectedPageIndex,
}: ReviewDialogToolbarProps) {
  return (
    <div className="h-14 px-4 flex items-center justify-between border-b border-gray-200 bg-white shrink-0">
      {/* Left side - Up/Down buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onMoveUp}
          disabled={!canMoveUp}
          className={cn(
            'shrink-0 flex items-center justify-center gap-1.5 w-20 py-2 rounded-lg',
            'bg-white border border-gray-200',
            'text-sm font-medium text-gray-600',
            'transition-all duration-200',
            canMoveUp
              ? `${THEME_CLASSES.bgHover} ${THEME_CLASSES.borderHover} ${THEME_CLASSES.textHover}`
              : 'opacity-40 cursor-not-allowed'
          )}
        >
          <ChevronUp size={16} />
          <span>Up</span>
        </button>

        <button
          onClick={onMoveDown}
          disabled={!canMoveDown}
          className={cn(
            'shrink-0 flex items-center justify-center gap-1.5 w-20 py-2 rounded-lg',
            'bg-white border border-gray-200',
            'text-sm font-medium text-gray-600',
            'transition-all duration-200',
            canMoveDown
              ? `${THEME_CLASSES.bgHover} ${THEME_CLASSES.borderHover} ${THEME_CLASSES.textHover}`
              : 'opacity-40 cursor-not-allowed'
          )}
        >
          <ChevronDown size={16} />
          <span>Down</span>
        </button>
      </div>

      {/* Right side - Move to */}
      {hasOtherGroups && onMoveToGroup && (
        <MoveToSelector
          groups={groups}
          currentGroupId={currentGroupId}
          disabled={!canMoveToGroup}
          onMove={onMoveToGroup}
          selectedPageIndex={selectedPageIndex}
        />
      )}
    </div>
  );
}
