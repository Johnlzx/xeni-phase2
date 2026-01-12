// UKVI Command Center Types
// Based on phase2 design.md - Evidence & Compliance Dashboard

// =============================================================================
// Module Status & Categories
// =============================================================================

export type ModuleStatus =
  | 'empty'           // No documents assigned
  | 'in-progress'     // Some documents, pending extraction
  | 'review-needed'   // AI extracted, needs human verification
  | 'critical-issue'  // Blocking issues found (e.g., 28-day rule violation)
  | 'ready';          // Verified and complete

export type ModuleCategory =
  | 'identity'        // Passport, BRP, Travel History
  | 'sponsorship'     // CoS, Job details
  | 'financial'       // Bank statements, 28-day rule
  | 'english'         // SELT, Degree certificates
  | 'accommodation'   // Address proof
  | 'relationship'    // Marriage cert, cohabitation proof (Family visas)
  | 'business'        // Business plans (Innovator)
  | 'academic';       // CAS, qualifications (Student)

export type IssueSeverity = 'critical' | 'warning' | 'info';

export type IssueType =
  | 'missing-document'
  | 'date-conflict'
  | 'gap-detected'
  | 'threshold-not-met'
  | 'document-expired'
  | 'data-mismatch';

// =============================================================================
// Evidence Slot - Template for required documents
// =============================================================================

export interface EvidenceSlotTemplate {
  id: string;
  name: string;
  description: string;
  acceptedDocTypes: string[];        // e.g., ['passport', 'brp']
  required: boolean;
  validationRules?: ValidationRule[];
}

export interface ValidationRule {
  id: string;
  type: 'date-range' | 'threshold' | 'continuity' | 'match' | 'expiry';
  params: Record<string, unknown>;
  errorMessage: string;
}

// =============================================================================
// Evidence Slot Instance - Runtime state of a slot
// =============================================================================

export interface LinkedDocument {
  id: string;
  name: string;
  pages: number;
  thumbnailUrl?: string;
}

export interface EvidenceSlotInstance {
  templateId: string;
  name: string;                      // Display name from template
  documentIds: string[];             // Linked document IDs
  linkedDocuments: LinkedDocument[]; // Document details for display
  extractedFields: ExtractedField[];
  status: 'empty' | 'filled' | 'verified';
  issues: Issue[];
}

// =============================================================================
// Extracted Field - AI-extracted data with source linking
// =============================================================================

export interface ExtractedField {
  id: string;
  schemaId: string;                  // Field identifier in schema
  label: string;
  value: unknown;
  displayValue: string;              // Formatted for display
  dataType: 'string' | 'date' | 'number' | 'currency' | 'boolean';
  confidence: number;                // 0-1 confidence score
  source: FieldSource;
  isVerified: boolean;
  verifiedBy?: string;               // User ID who verified
  verifiedAt?: string;               // ISO timestamp
}

export interface FieldSource {
  documentId: string;
  documentName: string;
  pageNumber: number;
  boundingBox?: BoundingBox;         // For highlight linking
}

export interface BoundingBox {
  x: number;      // Percentage from left
  y: number;      // Percentage from top
  width: number;  // Percentage width
  height: number; // Percentage height
}

// =============================================================================
// Issue - Problems found during analysis
// =============================================================================

export interface Issue {
  id: string;
  moduleId: string;
  slotId?: string;
  fieldId?: string;
  type: IssueType;
  severity: IssueSeverity;
  title: string;
  description: string;
  suggestion?: string;               // AI-suggested resolution
  relatedDocumentIds: string[];
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

// =============================================================================
// Evidence Module - A category of evidence
// =============================================================================

export interface EvidenceModule {
  id: string;
  name: string;
  description: string;
  category: ModuleCategory;
  status: ModuleStatus;
  priority: 'required' | 'recommended' | 'optional';
  slots: EvidenceSlotInstance[];
  issues: Issue[];
  progress: {
    completed: number;
    total: number;
  };
  order: number;                     // Display order
}

// =============================================================================
// Visa Route Configuration
// =============================================================================

export interface VisaRoute {
  id: string;
  code: string;                      // e.g., 'SW', 'GT', 'FM'
  name: string;
  description: string;
  category: 'work' | 'family' | 'study' | 'visit' | 'settlement';
  triageQuestions: TriageQuestion[];
  moduleTemplates: EvidenceModuleTemplate[];
}

export interface TriageQuestion {
  id: string;
  question: string;
  questionZh?: string;               // Chinese translation
  type: 'boolean' | 'single-choice' | 'multi-choice';
  options?: TriageOption[];
  dependsOn?: {                      // Conditional display
    questionId: string;
    value: unknown;
  };
  affectsModules?: string[];         // Module IDs affected by this answer
}

export interface TriageOption {
  value: string;
  label: string;
  labelZh?: string;
}

export interface EvidenceModuleTemplate {
  id: string;
  name: string;
  category: ModuleCategory;
  priority: 'required' | 'recommended' | 'optional';
  slots: EvidenceSlotTemplate[];
  conditionalOn?: {                  // Only include if triage answer matches
    questionId: string;
    value: unknown;
  };
}

// =============================================================================
// Application Build State - Main state for Command Center
// =============================================================================

export interface ApplicationBuildState {
  caseId: string;
  visaRouteId: string | null;
  visaRouteName: string | null;
  triageAnswers: Record<string, unknown>;
  triageCompleted: boolean;
  modules: EvidenceModule[];

  // Computed stats
  totalModules: number;
  readyModules: number;
  blockingIssuesCount: number;
  warningIssuesCount: number;
  isSubmittable: boolean;

  // Timestamps
  startedAt: string;
  lastUpdatedAt: string;
}

// =============================================================================
// Client Request - For Issue resolution
// =============================================================================

export interface ClientRequest {
  id: string;
  caseId: string;
  issueIds: string[];
  requestType: 'document' | 'information' | 'clarification';
  message: string;
  channel: 'email' | 'whatsapp' | 'sms' | 'portal';
  magicLinkUrl?: string;
  sentAt?: string;
  respondedAt?: string;
  status: 'draft' | 'sent' | 'viewed' | 'responded';
}

// =============================================================================
// UI State Types
// =============================================================================

export interface CommandCenterUIState {
  // Panel states
  leftPanelCollapsed: boolean;
  rightPanelCollapsed: boolean;

  // Active selections
  activeModuleId: string | null;
  activeSlotId: string | null;
  activeDocumentId: string | null;

  // Highlight linking
  highlightedFieldId: string | null;
  highlightedSource: FieldSource | null;

  // Modals & Drawers
  buildApplicationModalOpen: boolean;
  buildApplicationStep: 'route' | 'triage' | 'complete';
  verificationWorkbenchOpen: boolean;
  issueTriageCenterOpen: boolean;
  caseProfileDrawerOpen: boolean;
  clientRequestModalOpen: boolean;

  // Search & Filter
  moduleSearchQuery: string;
  issueFilter: IssueSeverity | 'all';
}

// =============================================================================
// Schema Form Types - For Verification Workbench
// =============================================================================

export interface SchemaField {
  id: string;
  label: string;
  labelZh?: string;
  dataType: 'string' | 'date' | 'number' | 'currency' | 'boolean' | 'select';
  required: boolean;
  options?: { value: string; label: string }[];  // For select type
  placeholder?: string;
  helpText?: string;
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
    minDate?: string;
    maxDate?: string;
  };
}

export interface SchemaDefinition {
  id: string;
  name: string;
  category: ModuleCategory;
  fields: SchemaField[];
  allowCustomFields: boolean;
}

// =============================================================================
// Document Types (extending existing)
// =============================================================================

export interface DocumentAnalysis {
  documentId: string;
  status: 'pending' | 'analyzing' | 'completed' | 'failed';
  extractedFields: ExtractedField[];
  detectedType: string;
  confidence: number;
  pageCount: number;
  analyzedAt?: string;
}
