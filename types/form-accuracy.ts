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
// Baseline Data Layer
// -----------------------------------------------------------------------------

export interface BaselineFieldValue {
  fieldId: string;
  fieldLabel: string;
  expectedValue: string;
  fieldType: "text" | "date" | "select" | "radio" | "email" | "tel";
  formSection: string;
}

export interface BaselineDataSet {
  id: string;
  visaTypeId: FormAccuracyVisaTypeId;
  visaTypeName: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  fields: BaselineFieldValue[];
  totalFieldCount: number;
}

// -----------------------------------------------------------------------------
// Path Enumeration Layer
// -----------------------------------------------------------------------------

export interface PathCondition {
  fieldId: string;
  fieldLabel: string;
  selectedValue: string;
}

export interface PathField {
  fieldId: string;
  fieldLabel: string;
  expectedValue: string;
  fieldType: "text" | "date" | "select" | "radio" | "email" | "tel";
  formSection: string;
  isConditional: boolean;
}

export interface TestPath {
  id: string;
  visaTypeId: FormAccuracyVisaTypeId;
  name: string;
  description: string;
  conditions: PathCondition[];
  fields: PathField[];
  totalFieldCount: number;
  weight: number;
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
  testPathId: string;
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

export interface PathAccuracyMetric {
  testPathId: string;
  testPathName: string;
  weight: number;
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
  totalPaths: number;
  totalFields: number;
  lastTestDate: string;
  totalRuns: number;
  pathMetrics: PathAccuracyMetric[];
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
// Batch Run (one run covers all paths for a visa type)
// -----------------------------------------------------------------------------

export interface BatchPathResult {
  testPathId: string;
  testPathName: string;
  hitRate: number;
  totalFields: number;
  matchedFields: number;
  passed: boolean; // hitRate >= threshold (e.g. 0.8)
}

export interface BatchTestRun {
  id: string;
  visaTypeId: FormAccuracyVisaTypeId;
  executedAt: string;
  executedBy: string;
  trigger: "scheduled" | "manual";
  durationMs: number;
  pathResults: BatchPathResult[];
  totalPaths: number;
  passedPaths: number;
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
