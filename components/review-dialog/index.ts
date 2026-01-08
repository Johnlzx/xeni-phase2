// ============================================
// Review Dialog - Barrel Export
// ============================================

// Main component
export { ReviewDialog } from './ReviewDialog';

// Types
export type {
  FileType,
  GroupType,
  ReviewPage,
  GroupInfo,
  DragItem,
  ReviewDialogProps,
} from './types';

// Hook (for advanced usage)
export { useReviewDialog } from './useReviewDialog';
export type { UseReviewDialogProps, UseReviewDialogReturn } from './useReviewDialog';

// Sub-components (for custom compositions)
export { ReviewDialogHeader } from './ReviewDialogHeader';
export { ReviewDialogSidebar } from './ReviewDialogSidebar';
export { ReviewDialogToolbar } from './ReviewDialogToolbar';
export { ReviewDialogPreview } from './ReviewDialogPreview';
export { ReviewDialogFooter } from './ReviewDialogFooter';

// Utility components
export { PageThumbnail } from './PageThumbnail';
export { DocumentSwitcher } from './DocumentSwitcher';
export { MoveToSelector } from './MoveToSelector';
export { DragLayer } from './DragLayer';

// Constants (for theming/customization)
export {
  THEME_COLOR,
  DRAG_ITEM_TYPE,
  PAGE_COLORS,
  getPageColor,
  SPRING_CONFIG,
  SPRING_FAST,
  FADE_CONFIG,
  THEME_CLASSES,
} from './constants';
