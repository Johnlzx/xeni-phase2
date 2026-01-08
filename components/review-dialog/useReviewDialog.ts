import { useState, useMemo, useEffect, useCallback } from 'react';
import { ReviewPage, GroupType, GroupInfo } from './types';
import { getPageColor } from './constants';

// ============================================
// Hook Props & Return Types
// ============================================

export interface UseReviewDialogProps {
  open: boolean;
  groups: GroupType[];
  currentGroupId: string;
  onGroupChange: (groupId: string) => void;
  onReorder: (dragIndex: number, hoverIndex: number, groupId: string) => void;
  onMoveToGroup?: (fileId: string, sourceGroupId: string, targetGroupId: string) => void;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
}

export interface UseReviewDialogReturn {
  // State
  selectedPageIndex: number;
  localPages: ReviewPage[];

  // Computed values
  currentGroup: GroupType | undefined;
  selectedPage: ReviewPage | undefined;
  groupInfos: GroupInfo[];
  canMoveUp: boolean;
  canMoveDown: boolean;
  hasOtherGroups: boolean;

  // Actions
  setSelectedPageIndex: (index: number) => void;
  handlePageReorder: (dragIndex: number, hoverIndex: number) => void;
  handleMoveUp: () => void;
  handleMoveDown: () => void;
  handleMoveToGroup: (targetGroupId: string) => void;
  handleConfirm: () => void;
  handleDocumentSwitch: (groupId: string) => void;
}

// ============================================
// Main Hook
// ============================================

export function useReviewDialog({
  open,
  groups,
  currentGroupId,
  onGroupChange,
  onReorder,
  onMoveToGroup,
  onConfirm,
  onOpenChange,
}: UseReviewDialogProps): UseReviewDialogReturn {
  // ============================================
  // State
  // ============================================

  const [selectedPageIndex, setSelectedPageIndex] = useState<number>(0);
  const [localPages, setLocalPages] = useState<ReviewPage[]>([]);

  // ============================================
  // Computed Values
  // ============================================

  const currentGroup = groups.find((g) => g.id === currentGroupId);

  // Flatten files into pages for visualization
  const flattenedPages = useMemo((): ReviewPage[] => {
    if (!currentGroup) return [];

    let pageCounter = 0;
    return currentGroup.files.flatMap((file) =>
      Array.from({ length: file.pages || 1 }).map((_, i) => ({
        id: `${file.id}_page_${i}`,
        fileId: file.id,
        fileName: file.name,
        pageIndex: i,
        totalPages: file.pages || 1,
        thumbnail: '',
        color: getPageColor(pageCounter++),
        isNew: file.isNew,
        isRemoved: file.isRemoved,
      }))
    );
  }, [currentGroup]);

  // Convert groups to GroupInfo for selectors
  const groupInfos: GroupInfo[] = useMemo(() => {
    return groups.map((g) => ({
      id: g.id,
      title: g.title,
      pageCount: g.files.reduce((sum, f) => sum + (f.pages || 1), 0),
      status: g.status,
      fileCount: g.files.length,
    }));
  }, [groups]);

  const selectedPage = localPages[selectedPageIndex] || localPages[0];
  const canMoveUp = selectedPageIndex > 0;
  const canMoveDown = selectedPageIndex < localPages.length - 1;
  const hasOtherGroups = groups.length > 1;

  // ============================================
  // Effects
  // ============================================

  // Sync local pages when flattened pages change
  useEffect(() => {
    setLocalPages(flattenedPages);
  }, [flattenedPages]);

  // Reset selection when dialog opens or group changes
  useEffect(() => {
    if (open) {
      setSelectedPageIndex(0);
    }
  }, [open, currentGroupId]);

  // ============================================
  // Callbacks
  // ============================================

  // Handle page reordering
  const handlePageReorder = useCallback((dragIndex: number, hoverIndex: number) => {
    setLocalPages((prev) => {
      const newPages = [...prev];
      const [draggedPage] = newPages.splice(dragIndex, 1);
      newPages.splice(hoverIndex, 0, draggedPage);
      return newPages;
    });

    // Update selection to follow the dragged item
    setSelectedPageIndex((prevIndex) => {
      if (prevIndex === dragIndex) {
        return hoverIndex;
      } else if (dragIndex < prevIndex && hoverIndex >= prevIndex) {
        return prevIndex - 1;
      } else if (dragIndex > prevIndex && hoverIndex <= prevIndex) {
        return prevIndex + 1;
      }
      return prevIndex;
    });
  }, []);

  // Handle move up
  const handleMoveUp = useCallback(() => {
    if (selectedPageIndex > 0) {
      handlePageReorder(selectedPageIndex, selectedPageIndex - 1);
    }
  }, [selectedPageIndex, handlePageReorder]);

  // Handle move down
  const handleMoveDown = useCallback(() => {
    if (selectedPageIndex < localPages.length - 1) {
      handlePageReorder(selectedPageIndex, selectedPageIndex + 1);
    }
  }, [selectedPageIndex, localPages.length, handlePageReorder]);

  // Handle move to another group
  const handleMoveToGroup = useCallback((targetGroupId: string) => {
    if (selectedPage && onMoveToGroup) {
      onMoveToGroup(selectedPage.fileId, currentGroupId, targetGroupId);
      // Reset selection after move
      setSelectedPageIndex(Math.max(0, selectedPageIndex - 1));
    }
  }, [selectedPage, onMoveToGroup, currentGroupId, selectedPageIndex]);

  // Handle confirm - map local order back to file order
  const handleConfirm = useCallback(() => {
    // Get unique file IDs in the new order
    const seenFiles = new Set<string>();
    const newFileOrder: string[] = [];

    localPages.forEach((page) => {
      if (!seenFiles.has(page.fileId)) {
        seenFiles.add(page.fileId);
        newFileOrder.push(page.fileId);
      }
    });

    // Apply the reordering through the parent callback
    if (currentGroup) {
      const originalOrder = currentGroup.files.map((f) => f.id);

      // Find pairs to swap to achieve the new order
      for (let i = 0; i < newFileOrder.length; i++) {
        const targetFileId = newFileOrder[i];
        const currentIndex = originalOrder.indexOf(targetFileId);

        if (currentIndex !== i && currentIndex !== -1) {
          // Swap positions
          onReorder(currentIndex, i, currentGroupId);
          // Update our tracking
          [originalOrder[i], originalOrder[currentIndex]] = [originalOrder[currentIndex], originalOrder[i]];
        }
      }
    }

    onConfirm();
    onOpenChange(false);
  }, [localPages, currentGroup, onReorder, currentGroupId, onConfirm, onOpenChange]);

  // Handle document switch
  const handleDocumentSwitch = useCallback((groupId: string) => {
    onGroupChange(groupId);
    setSelectedPageIndex(0);
  }, [onGroupChange]);

  // ============================================
  // Return
  // ============================================

  return {
    // State
    selectedPageIndex,
    localPages,

    // Computed values
    currentGroup,
    selectedPage,
    groupInfos,
    canMoveUp,
    canMoveDown,
    hasOtherGroups,

    // Actions
    setSelectedPageIndex,
    handlePageReorder,
    handleMoveUp,
    handleMoveDown,
    handleMoveToGroup,
    handleConfirm,
    handleDocumentSwitch,
  };
}
