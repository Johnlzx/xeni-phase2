// Visa types available in the system
export type VisaType =
  | 'skilled-worker'
  | 'naturalisation'
  | 'visitor'
  | 'partner-spouse';

// Case status types
export type CaseStatus =
  | 'intake'
  | 'review'
  | 'ready'
  | 'approved'
  | 'rejected';

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
