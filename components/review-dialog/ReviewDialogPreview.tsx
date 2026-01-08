import { cn } from '@/components/ui/utils';
import { ReviewPage } from './types';

interface ReviewDialogPreviewProps {
  selectedPage: ReviewPage | undefined;
}

export function ReviewDialogPreview({ selectedPage }: ReviewDialogPreviewProps) {
  return (
    <div className="flex-1 bg-gray-100 p-8 flex items-center justify-center overflow-hidden">
      {selectedPage ? (
        <div
          className={cn(
            'w-full max-w-md aspect-[3/4] rounded-lg shadow-lg',
            'flex items-center justify-center'
          )}
          style={{ backgroundColor: selectedPage.color }}
        />
      ) : (
        <div className="text-gray-400">No pages to preview</div>
      )}
    </div>
  );
}
