// Visa types available in the system
export type VisaType =
  | 'skilled-worker'
  | 'global-talent'
  | 'student'
  | 'family'
  | 'visitor'
  | 'innovator';

// Case status types
export type CaseStatus =
  | 'intake'
  | 'review'
  | 'ready'
  | 'approved'
  | 'rejected';

// Issue status and type
export type IssueStatus = 'open' | 'resolved' | 'pending';
export type IssueType = 'quality' | 'logic' | 'missing' | 'expiry';
export type IssueSeverity = 'low' | 'medium' | 'high' | 'critical';

// User role
export type UserRole = 'lawyer' | 'assistant' | 'applicant' | 'admin';

// Passport information extracted from document
export interface PassportInfo {
  givenNames: string;
  surname: string;
  nationality: string;
  countryOfBirth: string;
  dateOfBirth: string;
  sex: 'M' | 'F' | 'X';
  dateOfIssue: string;
  dateOfExpiry: string;
  passportNumber: string;
  mrzLine1?: string;
  mrzLine2?: string;
}

// User in the system
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// Applicant with passport info
export interface Applicant {
  id: string;
  email: string;
  phone?: string;
  passport: PassportInfo;
}

// Case statistics
export interface CaseStats {
  documentsTotal: number;
  documentsUploaded: number;
  qualityIssues: number;
  logicIssues: number;
}

// Main Case type
export interface Case {
  id: string;
  referenceNumber: string;
  visaType: VisaType;
  status: CaseStatus;
  applicant: Applicant;
  advisor: User;
  assistant?: User;
  createdAt: string;
  updatedAt: string;
  stats: CaseStats;
}

// Document pipeline status
export type DocumentPipelineStatus =
  | 'uploading'
  | 'processing'
  | 'ready'
  | 'error';

// Document type
export interface Document {
  id: string;
  caseId: string;
  name: string;
  fileName?: string;
  documentTypeId: string;
  fileType: string;
  fileSize: number;
  pipelineStatus: DocumentPipelineStatus;
  uploadedAt: string;
  assignedToSlots?: string[];
  extractedData?: Record<string, unknown>;
  thumbnailUrl?: string;
  previewUrl?: string;
}

// Issue type
export interface Issue {
  id: string;
  caseId: string;
  documentId?: string;
  targetSlotId?: string;
  type: IssueType;
  severity: IssueSeverity;
  status: IssueStatus;
  title: string;
  description: string;
  suggestedAction?: string;
  createdAt: string;
  resolvedAt?: string;
}

// Evidence slot template
export interface EvidenceSlot {
  id: string;
  name: string;
  description: string;
  priority: 'required' | 'recommended' | 'optional';
  category: string;
  acceptedDocTypes: string[];
}
