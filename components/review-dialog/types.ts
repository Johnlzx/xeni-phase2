// ============================================
// Review Dialog Types
// ============================================

/**
 * File type representing a document file
 */
export interface FileType {
  id: string;
  name: string;
  size: string;
  pages?: number;
  date?: string;
  type: 'pdf' | 'doc';
  isNew?: boolean;
  isRemoved?: boolean;
}

/**
 * Group/Container type representing a document group
 */
export interface GroupType {
  id: string;
  title: string;
  tag: string;
  mergedFileName?: string;
  status: 'pending' | 'reviewed';
  hasChanges?: boolean;
  files: FileType[];
}

/**
 * Review page representing a single page in the review view
 */
export interface ReviewPage {
  id: string;
  fileId: string;
  fileName: string;
  pageIndex: number;
  totalPages: number;
  thumbnail: string;
  color: string;
  isNew?: boolean;
  isRemoved?: boolean;
}

/**
 * Group info for selectors (simplified group data)
 */
export interface GroupInfo {
  id: string;
  title: string;
  pageCount: number;
  status: 'pending' | 'reviewed';
  fileCount: number;
}

/**
 * Drag item for react-dnd
 */
export interface DragItem {
  index: number;
  id: string;
  type: string;
}

// ============================================
// Component Props Types
// ============================================

export interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groups: GroupType[];
  currentGroupId: string;
  onGroupChange: (groupId: string) => void;
  onReorder: (dragIndex: number, hoverIndex: number, groupId: string) => void;
  onMoveToGroup?: (fileId: string, sourceGroupId: string, targetGroupId: string) => void;
  onConfirm: () => void;
}
