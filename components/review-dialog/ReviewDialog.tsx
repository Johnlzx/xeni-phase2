import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useReviewDialog } from './useReviewDialog';
import { ReviewDialogHeader } from './ReviewDialogHeader';
import { ReviewDialogSidebar } from './ReviewDialogSidebar';
import { ReviewDialogToolbar } from './ReviewDialogToolbar';
import { ReviewDialogPreview } from './ReviewDialogPreview';
import { ReviewDialogFooter } from './ReviewDialogFooter';
import { ReviewDialogProps } from './types';

// Re-export types for backwards compatibility
export type { FileType, GroupType } from './types';

export function ReviewDialog({
  open,
  onOpenChange,
  groups,
  currentGroupId,
  onGroupChange,
  onReorder,
  onMoveToGroup,
  onConfirm,
}: ReviewDialogProps) {
  const {
    selectedPageIndex,
    localPages,
    selectedPage,
    groupInfos,
    canMoveUp,
    canMoveDown,
    hasOtherGroups,
    setSelectedPageIndex,
    handlePageReorder,
    handleMoveUp,
    handleMoveDown,
    handleMoveToGroup: handleMoveToGroupAction,
    handleConfirm,
    handleDocumentSwitch,
  } = useReviewDialog({
    open,
    groups,
    currentGroupId,
    onGroupChange,
    onReorder,
    onMoveToGroup,
    onConfirm,
    onOpenChange,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideCloseButton
        style={{
          width: '95vw',
          maxWidth: '1400px',
          height: '90vh',
          maxHeight: '900px',
          padding: 0,
          gap: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
        className="flex flex-col overflow-hidden bg-white border border-gray-200"
      >
        {/* Visually hidden title for accessibility */}
        <DialogTitle className="sr-only">Review Document</DialogTitle>

        {/* Header */}
        <ReviewDialogHeader
          groups={groupInfos}
          currentGroupId={currentGroupId}
          onDocumentSwitch={handleDocumentSwitch}
          onClose={() => onOpenChange(false)}
        />

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Thumbnails */}
          <ReviewDialogSidebar
            pages={localPages}
            selectedPageIndex={selectedPageIndex}
            onPageSelect={setSelectedPageIndex}
            onPageReorder={handlePageReorder}
          />

          {/* Right Content Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Toolbar */}
            <ReviewDialogToolbar
              canMoveUp={canMoveUp}
              canMoveDown={canMoveDown}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              groups={groupInfos}
              currentGroupId={currentGroupId}
              hasOtherGroups={hasOtherGroups}
              canMoveToGroup={!!selectedPage}
              onMoveToGroup={onMoveToGroup ? handleMoveToGroupAction : undefined}
              selectedPageIndex={selectedPageIndex}
            />

            {/* Preview Area */}
            <ReviewDialogPreview selectedPage={selectedPage} />
          </div>
        </div>

        {/* Footer */}
        <ReviewDialogFooter
          onCancel={() => onOpenChange(false)}
          onConfirm={handleConfirm}
        />
      </DialogContent>
    </Dialog>
  );
}
