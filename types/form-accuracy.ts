// =============================================================================
// Form Accuracy Verification Types
// =============================================================================

export type FormAccuracyVisaTypeId =
  | "skilled-worker"
  | "global-talent"
  | "family"
  | "student"
  | "ilr";

// -----------------------------------------------------------------------------
// Test Case Document Layer
// -----------------------------------------------------------------------------

export type TestCaseDocumentType =
  | "passport"
  | "national-id"
  | "bank-statement"
  | "employment-letter"
  | "proof-of-address"
  | "english-test"
  | "tb-certificate"
  | "marriage-certificate"
  | "cos-letter"
  | "cas-letter"
  | "endorsement-letter"
  | "life-in-uk-certificate"
  | "other";

export interface TestCaseDocument {
  id: string;
  fileName: string;
  fileType: TestCaseDocumentType;
  fileSize: number; // bytes
  mimeType: string;
  uploadedAt: string; // ISO datetime
  uploadedBy: string;
}

// -----------------------------------------------------------------------------
// Extracted Data Layer
// -----------------------------------------------------------------------------

export interface ExtractedField {
  fieldId: string;
  fieldLabel: string;
  value: string;
  fieldType: "text" | "date" | "select" | "radio" | "email" | "tel";
}

export interface ExtractedDataSection {
  sectionName: string;
  fields: ExtractedField[];
}

// -----------------------------------------------------------------------------
// Test Case (replaces TestPath)
// -----------------------------------------------------------------------------

export interface TestCase {
  id: string;
  visaTypeId: FormAccuracyVisaTypeId;
  name: string;
  description: string;
  documents: TestCaseDocument[];
  extractedData: ExtractedDataSection[];
  totalFieldCount: number;
  weight: number; // 0-1, proportion of this case in the visa type
  accuracy: number; // 0-1
  totalRuns: number;
  lastTestedAt: string; // ISO datetime
}

// -----------------------------------------------------------------------------
// Execution & Comparison Layer
// -----------------------------------------------------------------------------

export type FieldMatchStatus = "match" | "mismatch" | "missing" | "extra";

export interface FieldComparisonResult {
  fieldId: string;
  fieldLabel: string;
  expectedValue: string;
  actualValue: string | null;
  fieldType: "text" | "date" | "select" | "radio" | "email" | "tel";
  formSection: string;
  status: FieldMatchStatus;
  note?: string;
}

export interface TestRunResult {
  id: string;
  testCaseId: string;
  visaTypeId: FormAccuracyVisaTypeId;
  executedAt: string;
  executedBy: string;
  durationMs: number;
  fieldResults: FieldComparisonResult[];
  totalFields: number;
  matchedFields: number;
  mismatchedFields: number;
  missingFields: number;
  extraFields: number;
  hitRate: number;
}

// -----------------------------------------------------------------------------
// Aggregation Metrics Layer
// -----------------------------------------------------------------------------

export interface CaseAccuracyMetric {
  testCaseId: string;
  testCaseName: string;
  accuracy: number;
  latestHitRate: number;
  latestRunDate: string;
  totalRuns: number;
  trend: number;
}

export interface VisaTypeAccuracyMetrics {
  visaTypeId: FormAccuracyVisaTypeId;
  visaTypeName: string;
  visaTypeCode: string;
  overallAccuracy: number;
  totalCases: number;
  totalFields: number;
  lastTestDate: string;
  totalRuns: number;
  caseMetrics: CaseAccuracyMetric[];
  totalMatches: number;
  totalMismatches: number;
  totalMissing: number;
}

export interface FormAccuracyDashboardStats {
  averageAccuracy: number;
  totalVisaTypes: number;
  lowestVisaType: { visaTypeId: FormAccuracyVisaTypeId; visaTypeName: string; accuracy: number };
  lastRunTime: string; // ISO datetime
}

// -----------------------------------------------------------------------------
// Batch Run (one run covers all cases for a visa type)
// -----------------------------------------------------------------------------

export interface BatchCaseResult {
  testCaseId: string;
  testCaseName: string;
  hitRate: number;
  totalFields: number;
  matchedFields: number;
  passed: boolean;
}

export interface BatchTestRun {
  id: string;
  visaTypeId: FormAccuracyVisaTypeId;
  executedAt: string;
  executedBy: string;
  trigger: "scheduled" | "manual";
  durationMs: number;
  caseResults: BatchCaseResult[];
  totalCases: number;
  passedCases: number;
  overallAccuracy: number;
  status: "success" | "partial" | "failed";
}

export type RunSchedule = "daily" | "weekly" | "manual";

export type FormAccuracySortOption = "accuracy" | "lastTested" | "fieldCount";
export type FormAccuracyFilterOption = "all" | "below90" | "notTestedIn7Days";

// Heatmap cell data for one day
export interface HeatmapDay {
  date: string; // YYYY-MM-DD
  batchRun: BatchTestRun | null; // null = no run that day
}
