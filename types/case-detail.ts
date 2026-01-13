import { PassportInfo, VisaType } from "./index";

// Navigation
export type CaseDetailNavItem =
  | "overview"
  | "documents"
  | "file-hub"
  | "application";

// Client Profile (progressively filled from documents)
export interface ClientProfile {
  passport?: PassportInfo;
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  completeness: number; // 0-100
}

// Checklist Evolution Stages
export type ChecklistStage =
  | "empty" // No documents uploaded
  | "questionnaire" // Initial questions mode
  | "partial" // Some items resolved, mixed mode
  | "detailed"; // Full multi-step checklist

// Checklist Item Status
export type ChecklistItemStatus =
  | "pending"
  | "in-progress"
  | "completed"
  | "blocked";

// Checklist Item
export interface ChecklistItem {
  id: string;
  label: string;
  description?: string;
  status: ChecklistItemStatus;
  dependsOn?: string[];
  linkedDocuments?: string[];
  children?: ChecklistItem[];
  category?: string;
}

// Questionnaire Question Types
export type QuestionType =
  | "boolean"
  | "single-choice"
  | "multi-choice"
  | "text";

// Questionnaire Question
export interface QuestionnaireQuestion {
  id: string;
  question: string;
  questionZh?: string;
  type: QuestionType;
  options?: { value: string; label: string }[];
  answer?: unknown;
  dependsOn?: { questionId: string; value: unknown };
}

// Checklist State
export interface ChecklistState {
  stage: ChecklistStage;
  questions: QuestionnaireQuestion[];
  items: ChecklistItem[];
  progress: {
    completed: number;
    total: number;
  };
}

// Uploaded File Preview (compact view for Overview)
export interface UploadedFilePreview {
  id: string;
  name: string;
  type: string;
  thumbnailUrl?: string;
  groupId?: string;
}

// Document File (for Documents page)
export interface DocumentFile {
  id: string;
  name: string;
  size: string;
  pages?: number;
  date?: string;
  type: "pdf" | "doc";
  isNew?: boolean;
  isRemoved?: boolean;
  // Analysis tracking
  isAnalyzed?: boolean;
  analyzedAt?: string;
}

// Document Group
export interface DocumentGroup {
  id: string;
  title: string;
  tag: string;
  mergedFileName?: string;
  status: "pending" | "reviewed";
  hasChanges?: boolean;
  files: DocumentFile[];
}

// Case Detail Store State
export interface CaseDetailState {
  // Current case ID
  caseId: string | null;

  // Navigation
  activeNav: CaseDetailNavItem;

  // Client Profile
  clientProfile: ClientProfile;

  // Visa Type Selection
  selectedVisaType: VisaType | null;

  // Checklist
  checklist: ChecklistState;

  // File Upload Previews
  uploadedFilePreviews: UploadedFilePreview[];
  maxPreviewFiles: number;

  // Document Groups (shared between Overview and Documents)
  documentGroups: DocumentGroup[];
  isLoadingDocuments: boolean;

  // Demo Controls
  demoStage: number;

  // Document Analysis State
  isAnalyzingDocuments: boolean;
  analysisProgress: number; // 0-100
  lastAnalysisAt: string | null; // ISO timestamp of last analysis
  analyzedFileIds: string[]; // IDs of files included in last analysis
}

// Case Detail Store Actions
export interface CaseDetailActions {
  // Navigation
  setActiveNav: (nav: CaseDetailNavItem) => void;

  // Case
  setCaseId: (caseId: string) => void;

  // Client Profile
  updateClientProfile: (updates: Partial<ClientProfile>) => void;
  setPassportInfo: (passport: PassportInfo) => void;

  // Visa Type
  setVisaType: (type: VisaType | null) => void;

  // Checklist
  setChecklistStage: (stage: ChecklistStage) => void;
  answerQuestion: (questionId: string, answer: unknown) => void;
  updateChecklistItem: (itemId: string, status: ChecklistItemStatus) => void;
  evolveChecklist: () => void;

  // File Previews
  addFilePreview: (file: UploadedFilePreview) => void;
  removeFilePreview: (fileId: string) => void;
  setFilePreviews: (files: UploadedFilePreview[]) => void;

  // Document Groups
  setDocumentGroups: (groups: DocumentGroup[]) => void;
  addDocumentGroup: (templateName: string) => void;
  deleteDocumentGroup: (groupId: string) => void;
  renameDocumentGroup: (groupId: string, newTitle: string) => void;
  moveFileToGroup: (fileId: string, targetGroupId: string) => void;
  reorderFileInGroup: (
    groupId: string,
    fromIndex: number,
    toIndex: number,
  ) => void;
  markFileForDeletion: (fileId: string, groupId: string) => void;
  confirmGroupReview: (groupId: string) => void;
  uploadDocuments: () => Promise<void>;
  uploadToGroup: (groupId: string, fileCount?: number) => void;

  // Demo Controls
  advanceDemoStage: () => void;
  resetDemoStage: () => void;

  // Demo: Review all documents and analyze
  reviewAllDocumentsAndAnalyze: () => Promise<void>;

  // Analysis
  runDocumentAnalysis: () => Promise<void>;

  // Reset
  reset: () => void;
}

export type CaseDetailStore = CaseDetailState & CaseDetailActions;
