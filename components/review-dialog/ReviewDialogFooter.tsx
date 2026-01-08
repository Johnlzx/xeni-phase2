import { cn } from '@/components/ui/utils';
import { THEME_CLASSES } from './constants';

interface ReviewDialogFooterProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export function ReviewDialogFooter({ onCancel, onConfirm }: ReviewDialogFooterProps) {
  return (
    <div className="h-16 px-6 flex items-center justify-end gap-3 border-t border-gray-200 bg-white shrink-0">
      <button
        onClick={onCancel}
        className={cn(
          'shrink-0 px-6 py-2.5 rounded-lg',
          'bg-white border border-gray-200',
          'text-sm font-medium text-gray-600',
          'hover:bg-gray-50 hover:border-gray-300',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-gray-200'
        )}
      >
        Cancel
      </button>

      <button
        onClick={onConfirm}
        className={cn(
          'shrink-0 px-6 py-2.5 rounded-lg',
          THEME_CLASSES.btnPrimary,
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-[#0E4268]/50 focus:ring-offset-2'
        )}
      >
        Confirm
      </button>
    </div>
  );
}
