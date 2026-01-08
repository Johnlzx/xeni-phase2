import { X } from 'lucide-react';
import { cn } from '@/components/ui/utils';
import { DocumentSwitcher } from './DocumentSwitcher';
import { GroupInfo } from './types';

interface ReviewDialogHeaderProps {
  groups: GroupInfo[];
  currentGroupId: string;
  onDocumentSwitch: (groupId: string) => void;
  onClose: () => void;
}

export function ReviewDialogHeader({
  groups,
  currentGroupId,
  onDocumentSwitch,
  onClose,
}: ReviewDialogHeaderProps) {
  return (
    <div className="h-14 px-4 flex items-center justify-between border-b border-gray-200 bg-white shrink-0">
      <DocumentSwitcher
        groups={groups}
        currentGroupId={currentGroupId}
        onSwitch={onDocumentSwitch}
      />

      <button
        onClick={onClose}
        className={cn(
          'p-2 rounded-lg',
          'text-gray-400 hover:text-gray-600',
          'hover:bg-gray-100',
          'transition-colors duration-150'
        )}
      >
        <X size={20} />
      </button>
    </div>
  );
}
