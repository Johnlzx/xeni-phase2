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
// Test Case
// -----------------------------------------------------------------------------

// Each OCR extraction run result
export interface ExtractionRunResult {
  id: string;
  executedAt: string;
  accuracy: number; // 0-1
  totalFields: number;
  matchedFields: number;
  extractedData: ExtractedDataSection[];
}

// Each plugin form-fill run producing a PDF
export interface PluginFilledPdfRun {
  id: string;
  executedAt: string;
  accuracy: number; // 0-1 vs human-filled PDF
  fileName: string;
  fileSize: number;
}

export interface ApplicationPdfs {
  humanFilled: TestCaseDocument; // static verified baseline
  extensionRuns: PluginFilledPdfRun[]; // history of extension form-fill runs
}

export interface TestCase {
  id: string;
  visaTypeId: FormAccuracyVisaTypeId;
  name: string;
  description: string;
  documents: TestCaseDocument[];
  extractedData: ExtractedDataSection[]; // ground truth (human-verified)
  extractionRuns: ExtractionRunResult[]; // OCR run history
  applicationPdfs: ApplicationPdfs;
  totalFieldCount: number;
  weight: number; // 0-1, proportion of this case in the visa type
  accuracy: number; // 0-1, OCR benchmark accuracy
  formFillAccuracy: number; // 0-1, Form Fill benchmark accuracy
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
  accuracy: number; // OCR
  formFillAccuracy: number; // Form Fill
  latestHitRate: number; // OCR latest
  formFillLatestHitRate: number; // Form Fill latest
  latestRunDate: string;
  totalRuns: number;
  trend: number;
}

export interface VisaTypeAccuracyMetrics {
  visaTypeId: FormAccuracyVisaTypeId;
  visaTypeName: string;
  visaTypeCode: string;
  overallAccuracy: number; // OCR
  formFillOverallAccuracy: number; // Form Fill
  totalCases: number;
  totalFields: number;
  lastTestDate: string;
  totalRuns: number;
  caseMetrics: CaseAccuracyMetric[];
  totalMatches: number; // OCR
  totalMismatches: number; // OCR
  totalMissing: number; // OCR
  formFillTotalMatches: number;
  formFillTotalMismatches: number;
  formFillTotalMissing: number;
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
  // OCR benchmark
  hitRate: number;
  totalFields: number;
  matchedFields: number;
  passed: boolean;
  // Form Fill benchmark
  formFillHitRate: number;
  formFillTotalFields: number;
  formFillMatchedFields: number;
  formFillPassed: boolean;
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
  // OCR benchmark
  passedCases: number;
  overallAccuracy: number;
  // Form Fill benchmark
  formFillPassedCases: number;
  formFillOverallAccuracy: number;
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
