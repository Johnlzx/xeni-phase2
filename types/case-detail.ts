import { PassportInfo, VisaType } from "./index";

// Navigation
export type CaseDetailNavItem = "overview" | "documents" | "application";

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

// Case Team Member
export interface CaseTeamMember {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

// Case Team
export interface CaseTeam {
  lawyer: CaseTeamMember;
  assistant?: CaseTeamMember;
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
  // One-to-many linking: a page can be linked to multiple groups
  linkedToGroups?: string[]; // Array of group IDs this page is linked to
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
  isSpecial?: boolean; // Special documents like Case Notes - auto-confirmed, no review needed
}

// Document Bundle - Container for grouping multiple logical files (DocumentGroups)
// Represents a custom collection without business definition (not "Passport", "Bank Statement", etc.)
export interface DocumentBundle {
  id: string;
  name: string; // User-defined name: "Financial Package", "Supporting Evidence", etc.
  description?: string;
  linkedGroupIds: string[]; // Array of DocumentGroup IDs linked to this bundle (LINK, not move)
  createdAt: string;
  color?: "violet" | "indigo" | "teal" | "amber" | "rose"; // Accent color for visual distinction
}

// Application Phase (4-stage state machine)
// Note: Visa type is now selected at case creation, so "landing" stage is removed
export type ApplicationPhase =
  | "analyzing" // Document analysis in progress (includes Gap Analysis)
  | "questionnaire" // Quick questionnaire
  | "checklist" // Main checklist interface
  | "form_pilot"; // Form Pilot launch screen

// Checklist Section Types
export type ChecklistSectionType =
  | "personal"
  | "employment"
  | "financial"
  | "travel"
  | "education"
  | "family"
  | "other";

// Application Checklist Item (for the main Application checklist)
export interface ApplicationChecklistItem {
  id: string;
  section: ChecklistSectionType;
  field: string; // Field key
  label: string; // Display label
  value: string | null;
  source: "extracted" | "questionnaire" | "manual" | null;
  linkedFileIds: string[]; // Associated source files
  status: "complete" | "partial" | "missing";
  isRequired: boolean;
}

// Quality Issue Types
export type QualityIssueType = "validity" | "clarity" | "consistency" | "missing";
export type QualityIssueSeverity = "error" | "warning" | "info";

// Quality Issue (displayed inline with checklist items)
export interface QualityIssue {
  id: string;
  type: QualityIssueType;
  severity: QualityIssueSeverity;
  title: string;
  description: string;
  linkedChecklistItemId: string; // Associated field ID
  linkedFileId?: string;
  isResolved: boolean;
}

// ============================================
// Enhanced Issue Workflow Types
// ============================================

// Issue Status - Full workflow support
export type IssueStatus =
  | "open" // Newly identified
  | "in_progress" // Being worked on
  | "forwarded" // Sent to client
  | "pending_review" // Client responded, awaiting review
  | "resolved"; // Completed

// Issue History Entry
export interface IssueHistoryEntry {
  id: string;
  timestamp: string;
  action: "created" | "note_added" | "forwarded" | "status_changed" | "resolved";
  performedBy: {
    id: string;
    name: string;
  };
  details?: string;
  previousStatus?: IssueStatus;
  newStatus?: IssueStatus;
}

// Issue Note
export interface IssueNote {
  id: string;
  content: string;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
  };
}

// Forward to Client Data
export interface ForwardToClientData {
  method: "link" | "email";
  recipientEmail?: string;
  message?: string;
  shareableLink?: string;
  expiresAt?: string;
  sentAt: string;
}

// Enhanced Quality Issue (with full workflow support)
export interface EnhancedQualityIssue {
  id: string;
  type: QualityIssueType;
  severity: QualityIssueSeverity;
  status: IssueStatus;
  title: string;
  description: string;
  suggestedAction?: string;
  linkedChecklistItemId: string;
  linkedFileIds: string[]; // Multiple source documents
  linkedPageNumbers?: Record<string, number[]>; // fileId -> page numbers
  history: IssueHistoryEntry[];
  forwardData?: ForwardToClientData;
  notes: IssueNote[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolvedBy?: {
    id: string;
    name: string;
  };
}

// ============================================
// Enhanced Checklist Item Types
// ============================================

// Linked Document Reference (source documents for data extraction)
export interface LinkedDocument {
  fileId: string;
  fileName: string;
  groupTitle: string;
  pageNumbers: number[];
  extractedText?: string;
  thumbnailUrl?: string;
}

// Required Evidence (documents needed for visa submission)
export interface RequiredEvidence {
  id: string;
  name: string; // e.g., "Valid Passport", "Bank Statements"
  description?: string; // Detailed requirement
  isUploaded: boolean; // Whether the document has been uploaded
  linkedFileId?: string; // If uploaded, the file ID
  linkedFileName?: string; // If uploaded, the file name
  isMandatory: boolean; // Whether it's mandatory for the application
  acceptedFormats?: string[]; // e.g., ["PDF", "JPEG"]
  validityPeriod?: string; // e.g., "Must be dated within 31 days"
}

// Enhanced Checklist Item (with document references)
export interface EnhancedChecklistItem {
  id: string;
  section: ChecklistSectionType;
  field: string;
  label: string;
  description?: string;
  value: string | null;
  source: "extracted" | "questionnaire" | "manual" | null;
  linkedDocuments: LinkedDocument[]; // Source documents (for extraction)
  requiredEvidence: RequiredEvidence[]; // Required evidence for submission
  status: "complete" | "partial" | "missing";
  isRequired: boolean;
  isEditable: boolean;
  confidenceScore?: number; // 0-100 for extracted values
}

// Checklist Section (group of related fields)
export interface ChecklistSection {
  id: ChecklistSectionType;
  title: string;
  fields: ApplicationChecklistItem[];
  completedCount: number;
  totalCount: number;
  isExpanded: boolean;
}

// Form Schema Status
export interface FormSchemaStatus {
  schemaName: string;
  schemaVersion: string;
  totalFields: number;
  filledFields: number;
  completionPercentage: number;
  emptyRequiredFields: string[];
  lastUpdatedAt: string | null;
}

// Form Pilot Status
export interface FormPilotStatus {
  totalSessions: number;
  lastRunAt: string | null;
  lastRunStatus: "success" | "cancelled" | "error" | null;
}

// Analyzed File Summary
export interface AnalyzedFileSummary {
  id: string;
  name: string;
  groupTitle: string;
  pages: number;
  analyzedAt: string;
}

// Case Notes Summary (extracted from case notes during creation)
export interface CaseNotesSummary {
  summary: string; // Brief summary of the case
  clientBackground?: string; // Client background info
  keyDates?: string[]; // Important dates mentioned
  extractedAt?: string; // When the summary was extracted
}

// Case Detail Store State
export interface CaseDetailState {
  // Current case ID
  caseId: string | null;

  // Case Reference
  caseReference: string;

  // Case Notes Summary
  caseNotesSummary: CaseNotesSummary | null;

  // Case Team
  caseTeam: CaseTeam;

  // Navigation
  activeNav: CaseDetailNavItem;
  highlightedGroupId: string | null;

  // Client Profile
  clientProfile: ClientProfile;

  // Visa Type - set at case creation, always has a value after case is created
  selectedVisaType: VisaType | null;

  // Checklist
  checklist: ChecklistState;

  // File Upload Previews
  uploadedFilePreviews: UploadedFilePreview[];
  maxPreviewFiles: number;

  // Document Groups (shared between Overview and Documents)
  documentGroups: DocumentGroup[];
  isLoadingDocuments: boolean;

  // Document Bundles (containers for grouping multiple logical files)
  documentBundles: DocumentBundle[];

  // Demo Controls
  demoStage: number;

  // Document Analysis State
  isAnalyzingDocuments: boolean;
  analysisProgress: number; // 0-100
  lastAnalysisAt: string | null; // ISO timestamp of last analysis
  analyzedFileIds: string[]; // IDs of files included in last analysis

  // Application Phase (5-stage state machine)
  applicationPhase: ApplicationPhase;

  // Form Schema (visa-specific schema once visa is selected)
  formSchema: FormSchemaStatus | null;

  // Form Pilot
  formPilotStatus: FormPilotStatus;

  // Analyzed Files Summary (populated after analysis)
  analyzedFiles: AnalyzedFileSummary[];

  // Application Checklist (main checklist items)
  applicationChecklistItems: ApplicationChecklistItem[];

  // Quality Issues (inline with checklist)
  qualityIssues: QualityIssue[];

  // Questionnaire Answers (stored for back navigation)
  questionnaireAnswers: Record<string, string>;

  // Checklist Section Expansion State
  checklistSectionExpanded: Record<ChecklistSectionType, boolean>;

  // ============================================
  // Enhanced Checklist Workspace State
  // ============================================

  // Enhanced Checklist Items (with linked documents)
  enhancedChecklistItems: EnhancedChecklistItem[];

  // Enhanced Quality Issues (with full workflow)
  enhancedQualityIssues: EnhancedQualityIssue[];

  // Selected item in checklist workspace
  selectedChecklistItemId: string | null;

  // Selected issue for detail view
  selectedIssueId: string | null;

  // Forward to Client Modal state
  forwardModalOpen: boolean;
  forwardModalIssueId: string | null;
}

// Case Detail Store Actions
export interface CaseDetailActions {
  // Navigation
  setActiveNav: (nav: CaseDetailNavItem) => void;
  navigateToDocumentGroup: (groupId: string) => void;
  clearHighlightedGroup: () => void;

  // Case
  setCaseId: (caseId: string) => void;
  setCaseReference: (reference: string) => void;

  // Case Team
  setLawyer: (lawyer: CaseTeamMember) => void;
  setAssistant: (assistant: CaseTeamMember | undefined) => void;

  // Case Notes Summary
  setCaseNotesSummary: (summary: CaseNotesSummary | null) => void;

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
  clearFileNewStatus: (fileId: string) => void;
  clearGroupChangesFlag: (groupId: string) => void;
  confirmGroupReview: (groupId: string) => void;
  uploadDocuments: () => Promise<void>;
  uploadToGroup: (groupId: string, fileCount?: number) => void;
  uploadAndAutoClassify: (totalPages?: number) => void;

  // Page Linking (one-to-many: a page can be linked to multiple groups)
  duplicateFileToGroup: (fileId: string, targetGroupId: string) => void;

  // Document Bundles (containers for grouping logical files)
  createDocumentBundle: (name: string, linkedGroupIds: string[]) => void;
  deleteDocumentBundle: (bundleId: string) => void;
  renameDocumentBundle: (bundleId: string, newName: string) => void;
  linkGroupToBundle: (groupId: string, bundleId: string) => void;
  unlinkGroupFromBundle: (groupId: string, bundleId: string) => void;
  reorderLinkedDocumentsInBundle: (bundleId: string, newOrder: string[]) => void;

  // Demo Controls
  advanceDemoStage: () => void;
  resetDemoStage: () => void;

  // Demo: Review all documents and analyze
  reviewAllDocumentsAndAnalyze: () => Promise<void>;

  // Analysis
  runDocumentAnalysis: () => Promise<void>;

  // Application Phase
  setApplicationPhase: (phase: ApplicationPhase) => void;
  startAnalysis: () => Promise<void>;
  reAnalyze: () => Promise<void>;
  initFormSchema: (visaType: VisaType) => void;
  launchFormPilot: () => void;

  // Application Checklist Actions
  startAnalysisAndGenerateQuestionnaire: () => Promise<void>;
  submitQuestionnaireAnswers: (answers: Record<string, string>) => void;
  generateChecklist: () => void;
  updateChecklistField: (fieldId: string, value: string) => void;
  resolveIssue: (issueId: string) => void;
  goBackToPhase: (phase: ApplicationPhase) => void;
  toggleChecklistSection: (sectionId: ChecklistSectionType) => void;

  // ============================================
  // Enhanced Checklist Workspace Actions
  // ============================================

  // Checklist Item Selection
  selectChecklistItem: (itemId: string | null) => void;
  selectIssue: (issueId: string | null) => void;

  // Enhanced Checklist Field Update
  updateEnhancedChecklistField: (fieldId: string, value: string) => void;

  // Issue Workflow Actions
  updateIssueStatus: (issueId: string, status: IssueStatus) => void;
  addIssueNote: (issueId: string, note: string) => void;
  forwardIssueToClient: (issueId: string, data: ForwardToClientData) => void;
  markIssueResolved: (issueId: string, resolution?: string) => void;

  // Forward Modal Actions
  openForwardModal: (issueId: string) => void;
  closeForwardModal: () => void;

  // Generate Enhanced Checklist (called after questionnaire)
  generateEnhancedChecklist: () => void;

  // Evidence Upload (mock upload for evidence requirement)
  uploadForEvidence: (evidenceId: string, evidenceName: string) => void;

  // Link evidence to an existing document group from File Hub
  linkEvidenceToGroup: (evidenceId: string, groupId: string) => void;

  // Unlink evidence from a document group
  unlinkEvidence: (evidenceId: string) => void;

  // Initialize case from CreateCaseModal
  // Case Notes and Passport are special documents - auto-confirmed
  initializeCaseFromCreation: (data: {
    visaType: VisaType;
    passport: PassportInfo;
    caseNotesFileName: string;
    passportFileName: string;
    referenceNumber?: string;
    advisorId?: string;
    assistantId?: string;
  }) => void;

  // Reset
  reset: () => void;
}

export type CaseDetailStore = CaseDetailState & CaseDetailActions;
