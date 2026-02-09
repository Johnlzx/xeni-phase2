import { useMemo } from "react";
import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import {
  CaseDetailStore,
  CaseDetailState,
  CaseDetailNavItem,
  ChecklistStage,
  ChecklistItemStatus,
  UploadedFilePreview,
  QuestionnaireQuestion,
  ChecklistItem,
  DocumentGroup,
  DocumentFile,
  ApplicationPhase,
  FormSchemaStatus,
  FormPilotStatus,
  AnalyzedFileSummary,
  ApplicationChecklistItem,
  QualityIssue,
  QualityIssueType,
  QualityIssueSeverity,
  ChecklistSectionType,
  CaseNotesSummary,
  // Enhanced types for checklist workspace
  EnhancedChecklistItem,
  EnhancedQualityIssue,
  IssueStatus,
  IssueHistoryEntry,
  ForwardToClientData,
  LinkedDocument,
  RequiredEvidence,
} from "@/types/case-detail";
import { PassportInfo, VisaType } from "@/types";
import { parseDocumentPath } from "@/lib/document-path-parser";

// Old-style document group type (with files embedded) - for legacy data
interface LegacyDocumentGroup {
  id: string;
  title: string;
  tag: string;
  mergedFileName?: string;
  status: "pending" | "reviewed";
  hasChanges?: boolean;
  files: Array<Omit<DocumentFile, 'containerIds'> & { containerIds?: string[] }>;
  isSpecial?: boolean;
  entityType?: DocumentFile['entityType'];
  generatedName?: string;
}

// Initial document groups data - Rich mock data with many pages per category
// Uses legacy format (files embedded) - converted to new model when used
const INITIAL_DOCUMENT_GROUPS_LEGACY: LegacyDocumentGroup[] = [
  {
    id: "passport",
    title: "Passport",
    tag: "Passport",
    mergedFileName: "Passport_Combined.pdf",
    status: "pending",
    files: [
      {
        id: "pp_1",
        name: "Passport_Cover.pdf",
        size: "0.8 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "pp_2",
        name: "Passport_Bio_Page.pdf",
        size: "1.2 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "pp_3",
        name: "Passport_Visa_Page_1.pdf",
        size: "0.9 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "pp_4",
        name: "Passport_Visa_Page_2.pdf",
        size: "0.9 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "pp_5",
        name: "Passport_Stamp_Page.pdf",
        size: "0.7 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "pp_6",
        name: "Passport_Back_Cover.pdf",
        size: "0.6 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
    ],
  },
  {
    id: "bank_statement",
    title: "Bank Statement",
    tag: "Bank Statement",
    mergedFileName: "BankStatement_6Months.pdf",
    status: "pending",
    files: [
      {
        id: "bs_1",
        name: "Statement_Jan_Page1.pdf",
        size: "0.5 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "bs_2",
        name: "Statement_Jan_Page2.pdf",
        size: "0.5 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "bs_3",
        name: "Statement_Feb_Page1.pdf",
        size: "0.5 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "bs_4",
        name: "Statement_Feb_Page2.pdf",
        size: "0.5 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "bs_5",
        name: "Statement_Mar_Page1.pdf",
        size: "0.5 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "bs_6",
        name: "Statement_Mar_Page2.pdf",
        size: "0.5 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "bs_7",
        name: "Statement_Apr_Page1.pdf",
        size: "0.5 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "bs_8",
        name: "Statement_Apr_Page2.pdf",
        size: "0.5 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "bs_9",
        name: "Statement_May_Page1.pdf",
        size: "0.5 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "bs_10",
        name: "Statement_May_Page2.pdf",
        size: "0.5 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "bs_11",
        name: "Statement_Jun_Page1.pdf",
        size: "0.5 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "bs_12",
        name: "Statement_Jun_Page2.pdf",
        size: "0.5 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
    ],
  },
  {
    id: "employment_letter",
    title: "Employment Letter",
    tag: "Employment Letter",
    mergedFileName: "Employment_Verification.pdf",
    status: "pending",
    files: [
      {
        id: "emp_1",
        name: "Employment_Letter_Page1.pdf",
        size: "0.3 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "emp_2",
        name: "Employment_Letter_Page2.pdf",
        size: "0.3 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "emp_3",
        name: "Salary_Slip_Jan.pdf",
        size: "0.4 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "emp_4",
        name: "Salary_Slip_Feb.pdf",
        size: "0.4 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "emp_5",
        name: "Salary_Slip_Mar.pdf",
        size: "0.4 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
    ],
  },
  {
    id: "utility_bill",
    title: "Utility Bill",
    tag: "Utility Bill",
    mergedFileName: "Utility_Bills_2024.pdf",
    status: "pending",
    files: [
      {
        id: "ub_1",
        name: "Electric_Bill_Jan.pdf",
        size: "0.2 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "ub_2",
        name: "Electric_Bill_Feb.pdf",
        size: "0.2 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "ub_3",
        name: "Gas_Bill_Jan.pdf",
        size: "0.2 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "ub_4",
        name: "Gas_Bill_Feb.pdf",
        size: "0.2 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "ub_5",
        name: "Water_Bill_Q1.pdf",
        size: "0.3 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "ub_6",
        name: "Council_Tax_Bill.pdf",
        size: "0.4 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "ub_7",
        name: "Internet_Bill_Jan.pdf",
        size: "0.2 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "ub_8",
        name: "Internet_Bill_Feb.pdf",
        size: "0.2 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
    ],
  },
  {
    id: "tax_documents",
    title: "Tax Documents",
    tag: "Tax Documents",
    mergedFileName: "Tax_Records_2023.pdf",
    status: "pending",
    files: [
      {
        id: "tax_1",
        name: "P60_2023.pdf",
        size: "0.6 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "tax_2",
        name: "Tax_Return_Page1.pdf",
        size: "0.5 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "tax_3",
        name: "Tax_Return_Page2.pdf",
        size: "0.5 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "tax_4",
        name: "Tax_Return_Page3.pdf",
        size: "0.5 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "tax_5",
        name: "Tax_Calculation.pdf",
        size: "0.4 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "tax_6",
        name: "Tax_Payment_Receipt.pdf",
        size: "0.3 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
    ],
  },
  {
    id: "education",
    title: "Education Certificates",
    tag: "Education",
    mergedFileName: "Education_Documents.pdf",
    status: "pending",
    files: [
      {
        id: "edu_1",
        name: "Degree_Certificate.pdf",
        size: "1.2 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "edu_2",
        name: "Transcript_Page1.pdf",
        size: "0.8 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "edu_3",
        name: "Transcript_Page2.pdf",
        size: "0.8 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "edu_4",
        name: "Transcript_Page3.pdf",
        size: "0.8 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "edu_5",
        name: "IELTS_Result.pdf",
        size: "0.5 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "edu_6",
        name: "IELTS_TRF.pdf",
        size: "0.5 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "edu_7",
        name: "Professional_Certificate.pdf",
        size: "0.7 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
    ],
  },
  {
    id: "travel_history",
    title: "Travel History",
    tag: "Travel History",
    mergedFileName: "Travel_Documents.pdf",
    status: "pending",
    files: [
      {
        id: "travel_1",
        name: "Old_Passport_Page1.pdf",
        size: "0.8 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "travel_2",
        name: "Old_Passport_Page2.pdf",
        size: "0.8 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "travel_3",
        name: "Old_Passport_Page3.pdf",
        size: "0.8 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "travel_4",
        name: "Flight_Itinerary_UK.pdf",
        size: "0.4 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "travel_5",
        name: "Hotel_Booking_UK.pdf",
        size: "0.3 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
    ],
  },
  {
    id: "unclassified",
    title: "Unclassified",
    tag: "Unclassified",
    status: "pending",
    files: [
      {
        id: "u1",
        name: "Scan_Page_001.pdf",
        size: "0.8 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "u2",
        name: "Scan_Page_002.pdf",
        size: "0.7 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "u3",
        name: "Scan_Page_003.pdf",
        size: "0.9 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "u4",
        name: "Unknown_Doc_A.pdf",
        size: "0.5 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "u5",
        name: "Unknown_Doc_B.pdf",
        size: "0.6 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "u6",
        name: "Misc_Scan_001.pdf",
        size: "0.4 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "u7",
        name: "Misc_Scan_002.pdf",
        size: "0.5 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
      {
        id: "u8",
        name: "Photo_Doc.pdf",
        size: "1.2 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
      },
    ],
  },
];

// System users (mock data)
export const SYSTEM_USERS: { id: string; name: string; email: string; role: string }[] = [
  { id: "john-001", name: "John Smith", email: "john@lawfirm.com", role: "Partner" },
  { id: "sarah-002", name: "Sarah Johnson", email: "sarah@lawfirm.com", role: "Senior Associate" },
  { id: "michael-003", name: "Michael Chen", email: "michael@lawfirm.com", role: "Associate" },
  { id: "emma-004", name: "Emma Wilson", email: "emma@lawfirm.com", role: "Paralegal" },
  { id: "david-005", name: "David Brown", email: "david@lawfirm.com", role: "Paralegal" },
  { id: "lisa-006", name: "Lisa Taylor", email: "lisa@lawfirm.com", role: "Legal Assistant" },
];

// Initial questionnaire questions
const initialQuestions: QuestionnaireQuestion[] = [
  {
    id: "q1",
    question: "Is the applicant currently in the UK?",
    questionZh: "申请人目前在英国吗？",
    type: "boolean",
  },
  {
    id: "q2",
    question: "Does the applicant have a valid passport?",
    questionZh: "申请人是否持有有效护照？",
    type: "boolean",
  },
  {
    id: "q3",
    question: "Has the applicant applied for a UK visa before?",
    questionZh: "申请人之前是否申请过英国签证？",
    type: "boolean",
  },
  {
    id: "q4",
    question: "What is the purpose of the application?",
    questionZh: "申请的目的是什么？",
    type: "single-choice",
    options: [
      { value: "work", label: "Work" },
      { value: "study", label: "Study" },
      { value: "family", label: "Family reunion" },
      { value: "visit", label: "Visit" },
      { value: "settlement", label: "Settlement" },
    ],
  },
  {
    id: "q5",
    question: "Does the applicant have a sponsor (employer/university)?",
    questionZh: "申请人是否有担保人（雇主/大学）？",
    type: "boolean",
    dependsOn: { questionId: "q4", value: "work" },
  },
];

// Initial checklist items (for detailed stage)
const initialChecklistItems: ChecklistItem[] = [
  {
    id: "identity",
    label: "Identity Documents",
    category: "identity",
    status: "pending",
    children: [
      { id: "passport", label: "Valid Passport", status: "pending" },
      { id: "photo", label: "Passport Photo", status: "pending" },
      { id: "prev-visas", label: "Previous Visa History", status: "pending" },
    ],
  },
  {
    id: "financial",
    label: "Financial Evidence",
    category: "financial",
    status: "pending",
    dependsOn: ["identity"],
    children: [
      {
        id: "bank-statements",
        label: "Bank Statements (6 months)",
        status: "pending",
      },
      {
        id: "employment-letter",
        label: "Employment Letter",
        status: "pending",
      },
      { id: "tax-records", label: "Tax Records", status: "pending" },
    ],
  },
  {
    id: "sponsorship",
    label: "Sponsorship Documents",
    category: "sponsorship",
    status: "pending",
    dependsOn: ["identity"],
    children: [
      { id: "cos", label: "Certificate of Sponsorship", status: "pending" },
      { id: "job-offer", label: "Job Offer Letter", status: "pending" },
    ],
  },
  {
    id: "english",
    label: "English Language",
    category: "english",
    status: "pending",
    children: [
      { id: "ielts", label: "IELTS/English Test Results", status: "pending" },
    ],
  },
];

// Initial state
const initialState: CaseDetailState = {
  caseId: null,
  caseReference: "REF-2024-001",
  caseNotesSummary: null,
  caseTeam: {
    lawyer: { id: "john-001", name: "John", email: "john@example.com" },
  },
  activeNav: "overview",
  highlightedGroupId: null,
  clientProfile: {
    completeness: 0,
  },
  selectedVisaType: null,
  checklist: {
    stage: "empty",
    questions: initialQuestions,
    items: initialChecklistItems,
    progress: {
      completed: 0,
      total: 0,
    },
  },
  uploadedFilePreviews: [],
  maxPreviewFiles: 6,
  allFiles: {},
  documentGroups: [],
  isLoadingDocuments: false,
  demoStage: 0,
  isAnalyzingDocuments: false,
  analysisProgress: 0,
  lastAnalysisAt: null,
  analyzedFileIds: [],
  // Application Phase - starts at analyzing since visa type is set at case creation
  applicationPhase: "analyzing",
  formSchema: null,
  formPilotStatus: {
    totalSessions: 0,
    lastRunAt: null,
    lastRunStatus: null,
  },
  analyzedFiles: [],
  // Application Checklist
  applicationChecklistItems: [],
  qualityIssues: [],
  questionnaireAnswers: {},
  checklistSectionExpanded: {
    personal: true,
    employment: true,
    financial: false,
    travel: false,
    education: false,
    family: false,
    other: false,
  },
  // Enhanced Checklist Workspace State
  enhancedChecklistItems: [],
  enhancedQualityIssues: [],
  selectedChecklistItemId: null,
  selectedIssueId: null,
  forwardModalOpen: false,
  forwardModalIssueId: null,
  assessmentReferenceDocIds: [],
};

// ============================================================================
// Helper Functions for 1:N File-Container Model
// ============================================================================

// Helper to sync file previews from allFiles and documentGroups
const syncFilePreviewsFromState = (
  allFiles: Record<string, DocumentFile>,
  groups: DocumentGroup[],
): UploadedFilePreview[] => {
  const previews: UploadedFilePreview[] = [];
  for (const group of groups) {
    for (const fileId of group.fileIds) {
      const file = allFiles[fileId];
      if (file && !file.isRemoved) {
        previews.push({
          id: file.id,
          name: file.name,
          type: file.type === "pdf" ? "application/pdf" : "application/msword",
          groupId: group.id,
        });
      }
    }
  }
  return previews;
};

// Helper to get files for a specific container
const getContainerFiles = (
  allFiles: Record<string, DocumentFile>,
  group: DocumentGroup,
): DocumentFile[] => {
  return group.fileIds
    .map(id => allFiles[id])
    .filter((f): f is DocumentFile => f !== undefined && !f.isRemoved);
};

// Helper to get unclassified files (files with no container associations)
const getUnclassifiedFiles = (
  allFiles: Record<string, DocumentFile>,
): DocumentFile[] => {
  return Object.values(allFiles).filter(
    f => !f.isRemoved && f.containerIds.length === 0
  );
};

// Legacy compatibility: Helper to sync file previews from old-style groups (with files array)
// Used during migration and for backwards compatibility
const syncFilePreviewsFromGroups = (
  groups: Array<DocumentGroup & { files?: DocumentFile[] }>,
): UploadedFilePreview[] => {
  const previews: UploadedFilePreview[] = [];
  for (const group of groups) {
    // Support both new model (fileIds) and old model (files)
    const files = (group as { files?: DocumentFile[] }).files || [];
    for (const file of files) {
      previews.push({
        id: file.id,
        name: file.name,
        type: file.type === "pdf" ? "application/pdf" : "application/msword",
        groupId: group.id,
      });
    }
  }
  return previews;
};

// Convert old-style groups (files embedded) to new model (files separate, groups have fileIds)
const convertLegacyGroupsToNewModel = (
  legacyGroups: LegacyDocumentGroup[]
): { allFiles: Record<string, DocumentFile>; documentGroups: DocumentGroup[] } => {
  const allFiles: Record<string, DocumentFile> = {};
  const documentGroups: DocumentGroup[] = [];

  for (const group of legacyGroups) {
    const fileIds: string[] = [];

    for (const file of group.files) {
      // Determine containerIds: empty if unclassified group, otherwise [group.id]
      const containerIds = group.id === 'unclassified' ? [] : [group.id];

      // Store file in allFiles with containerIds
      allFiles[file.id] = {
        ...file,
        containerIds: file.containerIds || containerIds,
      };
      fileIds.push(file.id);
    }

    // Create new-style group with fileIds instead of files
    documentGroups.push({
      id: group.id,
      title: group.title,
      originalTitle: group.title,
      tag: group.tag,
      mergedFileName: group.mergedFileName,
      status: group.status,
      hasChanges: group.hasChanges,
      fileIds,
      files: [],
      isSpecial: group.isSpecial,
      entityType: group.entityType,
      generatedName: group.generatedName,
    });
  }

  return { allFiles, documentGroups };
};

// Calculate profile completeness
const calculateCompleteness = (
  profile: CaseDetailState["clientProfile"],
): number => {
  let score = 0;
  const total = 3; // passport, contact info (email), contact info (phone)

  if (profile.passport) score += 1;
  if (profile.contactInfo?.email) score += 1;
  if (profile.contactInfo?.phone) score += 1;

  return Math.round((score / total) * 100);
};

// Calculate checklist progress
const calculateProgress = (
  items: ChecklistItem[],
): { completed: number; total: number } => {
  let completed = 0;
  let total = 0;

  const countItems = (itemList: ChecklistItem[]) => {
    for (const item of itemList) {
      if (item.children && item.children.length > 0) {
        countItems(item.children);
      } else {
        total++;
        if (item.status === "completed") completed++;
      }
    }
  };

  countItems(items);
  return { completed, total };
};

export const useCaseDetailStore = create<CaseDetailStore>()(
  devtools(
    persist(
    (set, get) => ({
      ...initialState,

      // Navigation
      setActiveNav: (nav: CaseDetailNavItem) => {
        set({ activeNav: nav }, false, "setActiveNav");
      },

      navigateToDocumentGroup: (groupId: string) => {
        set(
          { activeNav: "documents", highlightedGroupId: groupId },
          false,
          "navigateToDocumentGroup"
        );
      },

      clearHighlightedGroup: () => {
        set({ highlightedGroupId: null }, false, "clearHighlightedGroup");
      },

      // Case
      setCaseId: (caseId: string) => {
        set({ caseId }, false, "setCaseId");
      },

      setCaseReference: (reference: string) => {
        set({ caseReference: reference }, false, "setCaseReference");
      },

      // Case Team
      setLawyer: (lawyer) => {
        set(
          (state) => ({
            caseTeam: { ...state.caseTeam, lawyer },
          }),
          false,
          "setLawyer"
        );
      },

      setAssistant: (assistant) => {
        set(
          (state) => ({
            caseTeam: { ...state.caseTeam, assistant },
          }),
          false,
          "setAssistant"
        );
      },

      // Case Notes Summary
      setCaseNotesSummary: (summary: CaseNotesSummary | null) => {
        set({ caseNotesSummary: summary }, false, "setCaseNotesSummary");
      },

      // Client Profile
      updateClientProfile: (updates) => {
        set(
          (state) => {
            const newProfile = { ...state.clientProfile, ...updates };
            newProfile.completeness = calculateCompleteness(newProfile);
            return { clientProfile: newProfile };
          },
          false,
          "updateClientProfile",
        );
      },

      setPassportInfo: (passport: PassportInfo) => {
        set(
          (state) => {
            const newProfile = { ...state.clientProfile, passport };
            newProfile.completeness = calculateCompleteness(newProfile);
            return { clientProfile: newProfile };
          },
          false,
          "setPassportInfo",
        );
      },

      // Checklist
      setChecklistStage: (stage: ChecklistStage) => {
        set(
          (state) => ({
            checklist: { ...state.checklist, stage },
          }),
          false,
          "setChecklistStage",
        );
      },

      answerQuestion: (questionId: string, answer: unknown) => {
        set(
          (state) => {
            const questions = state.checklist.questions.map((q) =>
              q.id === questionId ? { ...q, answer } : q,
            );
            return {
              checklist: { ...state.checklist, questions },
            };
          },
          false,
          "answerQuestion",
        );
      },

      updateChecklistItem: (itemId: string, status: ChecklistItemStatus) => {
        set(
          (state) => {
            const updateItemRecursive = (
              items: ChecklistItem[],
            ): ChecklistItem[] => {
              return items.map((item) => {
                if (item.id === itemId) {
                  return { ...item, status };
                }
                if (item.children) {
                  return {
                    ...item,
                    children: updateItemRecursive(item.children),
                  };
                }
                return item;
              });
            };

            const newItems = updateItemRecursive(state.checklist.items);
            const progress = calculateProgress(newItems);

            return {
              checklist: {
                ...state.checklist,
                items: newItems,
                progress,
              },
            };
          },
          false,
          "updateChecklistItem",
        );
      },

      evolveChecklist: () => {
        const state = get();
        const { checklist, uploadedFilePreviews } = state;
        const fileCount = uploadedFilePreviews.length;
        const answeredQuestions = checklist.questions.filter(
          (q) => q.answer !== undefined,
        ).length;
        const totalQuestions = checklist.questions.length;

        let newStage: ChecklistStage = checklist.stage;

        // Evolution logic based on files and answers
        if (fileCount === 0) {
          newStage = "empty";
        } else if (fileCount >= 1 && checklist.stage === "empty") {
          newStage = "questionnaire";
        } else if (
          (answeredQuestions >= totalQuestions * 0.5 || fileCount >= 3) &&
          checklist.stage === "questionnaire"
        ) {
          newStage = "partial";
        } else if (
          (answeredQuestions === totalQuestions || state.selectedVisaType) &&
          checklist.stage === "partial"
        ) {
          newStage = "detailed";
        }

        if (newStage !== checklist.stage) {
          set(
            (state) => ({
              checklist: {
                ...state.checklist,
                stage: newStage,
                progress: calculateProgress(state.checklist.items),
              },
            }),
            false,
            "evolveChecklist",
          );
        }
      },

      // File Previews
      addFilePreview: (file: UploadedFilePreview) => {
        set(
          (state) => {
            const newPreviews = [...state.uploadedFilePreviews, file];
            return { uploadedFilePreviews: newPreviews };
          },
          false,
          "addFilePreview",
        );
        // Trigger checklist evolution
        get().evolveChecklist();
      },

      removeFilePreview: (fileId: string) => {
        set(
          (state) => ({
            uploadedFilePreviews: state.uploadedFilePreviews.filter(
              (f) => f.id !== fileId,
            ),
          }),
          false,
          "removeFilePreview",
        );
        get().evolveChecklist();
      },

      setFilePreviews: (files: UploadedFilePreview[]) => {
        set({ uploadedFilePreviews: files }, false, "setFilePreviews");
        get().evolveChecklist();
      },

      // Demo Controls
      advanceDemoStage: () => {
        set(
          (state) => {
            const stages: ChecklistStage[] = [
              "empty",
              "questionnaire",
              "partial",
              "detailed",
            ];
            const currentIndex = stages.indexOf(state.checklist.stage);
            const nextIndex = Math.min(currentIndex + 1, stages.length - 1);

            return {
              demoStage: state.demoStage + 1,
              checklist: {
                ...state.checklist,
                stage: stages[nextIndex],
                progress: calculateProgress(state.checklist.items),
              },
            };
          },
          false,
          "advanceDemoStage",
        );
      },

      resetDemoStage: () => {
        set(
          {
            demoStage: 0,
            checklist: {
              ...initialState.checklist,
              stage: "empty",
            },
          },
          false,
          "resetDemoStage",
        );
      },

      // Document Groups
      setDocumentGroups: (groups: DocumentGroup[]) => {
        const previews = syncFilePreviewsFromGroups(groups);
        set(
          { documentGroups: groups, uploadedFilePreviews: previews },
          false,
          "setDocumentGroups",
        );
        get().evolveChecklist();
      },

      addDocumentGroup: (templateName: string) => {
        set(
          (state) => {
            const newGroup: DocumentGroup = {
              id: `group_${Date.now()}`,
              title: templateName,
              originalTitle: templateName,
              tag: templateName,
              mergedFileName: `${templateName}.pdf`,
              status: "pending",
              fileIds: [],
              files: [],
            };
            // Append new category to the end of the array
            // The grid filters out "unclassified" so new categories appear at the end
            return { documentGroups: [...state.documentGroups, newGroup] };
          },
          false,
          "addDocumentGroup",
        );
      },

      deleteDocumentGroup: (groupId: string) => {
        set(
          (state) => {
            const newGroups = state.documentGroups.filter(
              (g) => g.id !== groupId,
            );
            const previews = syncFilePreviewsFromGroups(newGroups);
            return {
              documentGroups: newGroups,
              uploadedFilePreviews: previews,
            };
          },
          false,
          "deleteDocumentGroup",
        );
        get().evolveChecklist();
      },

      renameDocumentGroup: (groupId: string, newTitle: string) => {
        set(
          (state) => ({
            documentGroups: state.documentGroups.map((g) =>
              g.id === groupId
                ? {
                    ...g,
                    title: newTitle,
                    // Capture original title on first rename if not already set
                    originalTitle: g.originalTitle ?? g.title,
                  }
                : g,
            ),
          }),
          false,
          "renameDocumentGroup",
        );
      },

      resetGroupTitle: (groupId: string) => {
        set(
          (state) => ({
            documentGroups: state.documentGroups.map((g) =>
              g.id === groupId && g.originalTitle
                ? { ...g, title: g.originalTitle }
                : g,
            ),
          }),
          false,
          "resetGroupTitle",
        );
      },

      // ============================================
      // One-to-Many File-Container Actions
      // ============================================

      // Add file to container (creates reference)
      addFileToContainer: (fileId: string, containerId: string) => {
        set(
          (state) => {
            const file = state.allFiles[fileId];
            const group = state.documentGroups.find(g => g.id === containerId);

            if (!file || !group) return state;

            // Idempotency: if already in container, do nothing
            if (file.containerIds.includes(containerId)) return state;

            // Update file's containerIds
            const updatedFile = {
              ...file,
              containerIds: [...file.containerIds, containerId],
              isNew: true,
            };

            // Update container's fileIds
            const updatedGroups = state.documentGroups.map(g => {
              if (g.id === containerId) {
                return {
                  ...g,
                  fileIds: [fileId, ...g.fileIds], // Add to beginning
                  status: "pending" as const,
                  hasChanges: true,
                };
              }
              return g;
            });

            const newAllFiles = { ...state.allFiles, [fileId]: updatedFile };
            const previews = syncFilePreviewsFromState(newAllFiles, updatedGroups);

            return {
              allFiles: newAllFiles,
              documentGroups: updatedGroups,
              uploadedFilePreviews: previews,
            };
          },
          false,
          "addFileToContainer",
        );
      },

      // Remove file from container (removes reference only)
      removeFileFromContainer: (fileId: string, containerId: string) => {
        set(
          (state) => {
            const file = state.allFiles[fileId];
            const group = state.documentGroups.find(g => g.id === containerId);

            if (!file || !group) return state;

            // Update file's containerIds
            const updatedFile = {
              ...file,
              containerIds: file.containerIds.filter(id => id !== containerId),
            };

            // Update container's fileIds
            const updatedGroups = state.documentGroups.map(g => {
              if (g.id === containerId) {
                return {
                  ...g,
                  fileIds: g.fileIds.filter(id => id !== fileId),
                  status: "pending" as const,
                  hasChanges: true,
                };
              }
              return g;
            });

            const newAllFiles = { ...state.allFiles, [fileId]: updatedFile };
            const previews = syncFilePreviewsFromState(newAllFiles, updatedGroups);

            return {
              allFiles: newAllFiles,
              documentGroups: updatedGroups,
              uploadedFilePreviews: previews,
            };
          },
          false,
          "removeFileFromContainer",
        );
      },

      // Reuse file in another container (adds reference, keeps original)
      reuseFileInContainer: (fileId: string, targetContainerId: string) => {
        // Just call addFileToContainer - file will be in both containers
        get().addFileToContainer(fileId, targetContainerId);
      },

      // Move file between containers (remove from source, add to target)
      moveFileBetweenContainers: (fileId: string, fromContainerId: string, toContainerId: string) => {
        get().removeFileFromContainer(fileId, fromContainerId);
        get().addFileToContainer(fileId, toContainerId);
      },

      // Legacy moveFileToGroup - for Unclassified to Container moves
      // When moving from Unclassified (containerIds=[]), just add to target container
      // When moving between containers, use moveFileBetweenContainers
      moveFileToGroup: (fileId: string, targetGroupId: string) => {
        set(
          (state) => {
            const file = state.allFiles[fileId];
            if (!file || file.isRemoved) return state;

            // Find source container (first container in list, or empty for unclassified)
            const sourceContainerId = file.containerIds.length > 0 ? file.containerIds[0] : null;

            // If moving to same container, do nothing
            if (sourceContainerId === targetGroupId) return state;

            // Update file's containerIds
            let newContainerIds: string[];
            if (sourceContainerId) {
              // Replace source with target
              newContainerIds = file.containerIds.filter(id => id !== sourceContainerId);
              if (!newContainerIds.includes(targetGroupId)) {
                newContainerIds = [targetGroupId, ...newContainerIds];
              }
            } else {
              // Unclassified: just add target
              newContainerIds = [targetGroupId];
            }

            const updatedFile = {
              ...file,
              containerIds: newContainerIds,
              isNew: true,
            };

            // Update groups
            const updatedGroups = state.documentGroups.map(g => {
              if (sourceContainerId && g.id === sourceContainerId) {
                // Remove from source
                return {
                  ...g,
                  fileIds: g.fileIds.filter(id => id !== fileId),
                  status: "pending" as const,
                  hasChanges: true,
                };
              }
              if (g.id === targetGroupId && !g.fileIds.includes(fileId)) {
                // Add to target
                return {
                  ...g,
                  fileIds: [fileId, ...g.fileIds],
                  status: "pending" as const,
                  hasChanges: true,
                };
              }
              return g;
            });

            const newAllFiles = { ...state.allFiles, [fileId]: updatedFile };
            const previews = syncFilePreviewsFromState(newAllFiles, updatedGroups);

            return {
              allFiles: newAllFiles,
              documentGroups: updatedGroups,
              uploadedFilePreviews: previews,
            };
          },
          false,
          "moveFileToGroup",
        );
      },

      reorderFileInGroup: (
        groupId: string,
        fromIndex: number,
        toIndex: number,
      ) => {
        set(
          (state) => {
            const newGroups = state.documentGroups.map((group) => {
              if (group.id !== groupId) return group;

              const newFileIds = [...group.fileIds];
              const [removed] = newFileIds.splice(fromIndex, 1);
              newFileIds.splice(toIndex, 0, removed);

              return {
                ...group,
                fileIds: newFileIds,
                status: "pending" as const,
                hasChanges: true,
              };
            });

            return { documentGroups: newGroups };
          },
          false,
          "reorderFileInGroup",
        );
      },

      markFileForDeletion: (fileId: string, groupId: string) => {
        set(
          (state) => {
            const file = state.allFiles[fileId];
            if (!file) return state;

            // Mark file as removed
            const updatedFile = { ...file, isRemoved: true, isNew: false };
            const newAllFiles = { ...state.allFiles, [fileId]: updatedFile };

            // Update group status
            const newGroups = state.documentGroups.map((group) => {
              if (group.id !== groupId) return group;
              return {
                ...group,
                status: "pending" as const,
                hasChanges: true,
              };
            });

            const previews = syncFilePreviewsFromState(newAllFiles, newGroups);
            return {
              allFiles: newAllFiles,
              documentGroups: newGroups,
              uploadedFilePreviews: previews,
            };
          },
          false,
          "markFileForDeletion",
        );
      },

      clearFileNewStatus: (fileId: string) => {
        set(
          (state) => {
            const file = state.allFiles[fileId];
            if (!file) return state;

            return {
              allFiles: {
                ...state.allFiles,
                [fileId]: { ...file, isNew: false },
              },
            };
          },
          false,
          "clearFileNewStatus",
        );
      },

      clearGroupChangesFlag: (groupId: string) => {
        set(
          (state) => ({
            documentGroups: state.documentGroups.map((group) =>
              group.id === groupId ? { ...group, hasChanges: false } : group,
            ),
          }),
          false,
          "clearGroupChangesFlag",
        );
      },

      confirmGroupReview: (groupId: string) => {
        set(
          (state) => {
            const group = state.documentGroups.find((g) => g.id === groupId);
            if (!group) return {};

            // Update allFiles: remove isRemoved files, clear isNew flag for remaining
            const newAllFiles = { ...state.allFiles };
            const activeFileIds: string[] = [];
            for (const fileId of group.fileIds) {
              const file = newAllFiles[fileId];
              if (!file) continue;
              if (file.isRemoved) {
                // Remove the file from allFiles entirely
                delete newAllFiles[fileId];
              } else {
                // Clear isNew flag
                newAllFiles[fileId] = { ...file, isNew: false };
                activeFileIds.push(fileId);
              }
            }

            return {
              allFiles: newAllFiles,
              documentGroups: state.documentGroups.map((g) =>
                g.id === groupId
                  ? {
                      ...g,
                      status: "reviewed" as const,
                      hasChanges: false,
                      fileIds: activeFileIds,
                    }
                  : g,
              ),
            };
          },
          false,
          "confirmGroupReview",
        );
      },

      uploadDocuments: async () => {
        set({ isLoadingDocuments: true }, false, "uploadDocuments:start");
        // Simulate AI processing
        await new Promise((resolve) => setTimeout(resolve, 2000));
        // Convert legacy groups to new model
        const { allFiles, documentGroups } = convertLegacyGroupsToNewModel(INITIAL_DOCUMENT_GROUPS_LEGACY);
        const previews = syncFilePreviewsFromState(allFiles, documentGroups);
        set(
          {
            allFiles,
            documentGroups,
            uploadedFilePreviews: previews,
            isLoadingDocuments: false,
          },
          false,
          "uploadDocuments:complete",
        );
        get().evolveChecklist();
      },

      uploadToGroup: (groupId: string, fileCount: number = 1) => {
        set(
          (state) => {
            const group = state.documentGroups.find(g => g.id === groupId);
            if (!group) return state;

            const timestamp = Date.now();
            const newAllFiles = { ...state.allFiles };
            const newFileIds: string[] = [];

            for (let i = 0; i < fileCount; i++) {
              const fileId = `file_${timestamp}_${i}`;
              newAllFiles[fileId] = {
                id: fileId,
                name: `Uploaded_Page_${group.fileIds.length + i + 1}.pdf`,
                size: "0.5 MB",
                pages: 1,
                date: "Just now",
                type: "pdf",
                isNew: true,
                containerIds: [groupId],
              };
              newFileIds.push(fileId);
            }

            const newGroups = state.documentGroups.map(g => {
              if (g.id === groupId) {
                return {
                  ...g,
                  fileIds: [...g.fileIds, ...newFileIds],
                  status: "pending" as const,
                  hasChanges: true,
                };
              }
              return g;
            });

            const previews = syncFilePreviewsFromState(newAllFiles, newGroups);
            return {
              allFiles: newAllFiles,
              documentGroups: newGroups,
              uploadedFilePreviews: previews,
            };
          },
          false,
          "uploadToGroup",
        );
      },

      // Upload and auto-classify documents (simulates AI classification)
      uploadAndAutoClassify: (totalPages: number = 8) => {
        set(
          (state) => {
            const timestamp = Date.now();
            const newAllFiles = { ...state.allFiles };

            // Helper to normalize names for comparison (remove spaces, hyphens, lowercase)
            const normalize = (str: string) =>
              str.toLowerCase().replace(/[\s\-_]/g, "");

            // Categories to potentially create (simulating AI classification results)
            const allPossibleCategories = [
              { category: "Passport", pages: 2 },
              { category: "Bank Statement", pages: 3 },
              { category: "Employment Letter", pages: 2 },
              { category: "Utility Bill", pages: 2 },
              { category: "Tax Documents", pages: 2 },
              { category: "Education Certificate", pages: 1 },
              { category: "Travel History", pages: 2 },
              { category: "Medical Records", pages: 2 },
              { category: "Marriage Certificate", pages: 1 },
              { category: "Birth Certificate", pages: 1 },
            ];

            // Find categories that don't exist yet
            const existingNormalizedTitles = state.documentGroups
              .filter((g) => g.id !== "unclassified")
              .map((g) => normalize(g.title));

            const newCategories = allPossibleCategories.filter(
              (c) => !existingNormalizedTitles.includes(normalize(c.category))
            );

            // Select 1-2 NEW categories to create
            const numNewCategories = Math.min(
              Math.floor(Math.random() * 2) + 1,
              newCategories.length
            );
            const selectedNewCategories = newCategories
              .sort(() => Math.random() - 0.5)
              .slice(0, numNewCategories);

            // Also add files to 0-1 existing categories (if any exist)
            const existingClassifiedGroups = state.documentGroups.filter(
              (g) => g.id !== "unclassified" && g.id !== "case_notes"
            );
            const selectedExistingGroup =
              existingClassifiedGroups.length > 0 && Math.random() > 0.3
                ? existingClassifiedGroups[
                    Math.floor(Math.random() * existingClassifiedGroups.length)
                  ]
                : null;

            // Calculate pages distribution
            const newCategoryPages = selectedNewCategories.reduce(
              (sum, c) => sum + c.pages,
              0
            );
            const existingGroupPages = selectedExistingGroup ? 2 : 0;
            const classifiedPages = newCategoryPages + existingGroupPages;
            const unclassifiedPages = Math.max(2, totalPages - classifiedPages);

            let newGroups = [...state.documentGroups];

            // Create NEW category groups with files
            selectedNewCategories.forEach((result, catIndex) => {
              const groupId = `group_${timestamp}_${catIndex}`;
              const fileIds: string[] = [];

              for (let i = 0; i < result.pages; i++) {
                const fileId = `classified_${timestamp}_${catIndex}_${i}`;
                newAllFiles[fileId] = {
                  id: fileId,
                  name: `${result.category.replace(/\s+/g, "_")}_Page_${i + 1}.pdf`,
                  size: "0.5 MB",
                  pages: 1,
                  date: "Just now",
                  type: "pdf",
                  isNew: true,
                  containerIds: [groupId],
                };
                fileIds.push(fileId);
              }

              newGroups.push({
                id: groupId,
                title: result.category,
                tag: result.category,
                mergedFileName: `${result.category.replace(/\s+/g, "_")}.pdf`,
                status: "pending",
                hasChanges: true,
                fileIds,
                files: [],
              });
            });

            // Add files to an existing group (if selected)
            if (selectedExistingGroup) {
              const existingFileIds: string[] = [];
              for (let i = 0; i < existingGroupPages; i++) {
                const fileId = `existing_${timestamp}_${i}`;
                newAllFiles[fileId] = {
                  id: fileId,
                  name: `${selectedExistingGroup.title.replace(/\s+/g, "_")}_New_${i + 1}.pdf`,
                  size: "0.5 MB",
                  pages: 1,
                  date: "Just now",
                  type: "pdf",
                  isNew: true,
                  containerIds: [selectedExistingGroup.id],
                };
                existingFileIds.push(fileId);
              }
              newGroups = newGroups.map((g) =>
                g.id === selectedExistingGroup.id
                  ? {
                      ...g,
                      fileIds: [...g.fileIds, ...existingFileIds],
                      status: "pending" as const,
                      hasChanges: true,
                    }
                  : g
              );
            }

            // Add remaining pages as unclassified (containerIds = [])
            if (unclassifiedPages > 0) {
              const existingUnclassifiedCount = getUnclassifiedFiles(state.allFiles).length;
              for (let i = 0; i < unclassifiedPages; i++) {
                const fileId = `unclassified_${timestamp}_${i}`;
                newAllFiles[fileId] = {
                  id: fileId,
                  name: `Scan_Page_${String(existingUnclassifiedCount + i + 1).padStart(3, "0")}.pdf`,
                  size: "0.5 MB",
                  pages: 1,
                  date: "Just now",
                  type: "pdf",
                  isNew: true,
                  containerIds: [], // Empty = unclassified
                };
              }
            }

            const previews = syncFilePreviewsFromState(newAllFiles, newGroups);
            return {
              allFiles: newAllFiles,
              documentGroups: newGroups,
              uploadedFilePreviews: previews,
            };
          },
          false,
          "uploadAndAutoClassify",
        );
      },

      // Duplicate/Reuse a file to another group (one-to-many linking)
      // Now uses reference model - no physical duplication needed
      duplicateFileToGroup: (fileId: string, targetGroupId: string) => {
        // In the new 1:N model, this is the same as reuseFileInContainer
        get().addFileToContainer(fileId, targetGroupId);
      },

      // Add multiple files to an existing container (moves files from their current containers)
      // Copy files into a target group - source files remain unchanged
      addFilesToGroup: (groupId: string, orderedFileIds: string[]) => {
        set(
          (state) => {
            const targetGroup = state.documentGroups.find((g) => g.id === groupId);
            if (!targetGroup) return state;

            const timestamp = Date.now();
            const newAllFiles = { ...state.allFiles };
            const copiedFileIds: string[] = [];

            // Create COPIES of each file for the target group
            // Original files remain unchanged in their source containers
            for (let i = 0; i < orderedFileIds.length; i++) {
              const originalFileId = orderedFileIds[i];
              const originalFile = newAllFiles[originalFileId];
              if (originalFile) {
                const newFileId = `${originalFileId}_copy_${timestamp}_${i}`;
                newAllFiles[newFileId] = {
                  ...originalFile,
                  id: newFileId,
                  containerIds: [groupId],
                  isNew: true,
                };
                copiedFileIds.push(newFileId);
              }
            }

            // Only update the target group - source groups remain unchanged
            const updatedGroups = state.documentGroups.map((group) => {
              if (group.id === groupId) {
                return {
                  ...group,
                  fileIds: [...group.fileIds, ...copiedFileIds],
                  hasChanges: true,
                };
              }
              return group;
            });

            const previews = syncFilePreviewsFromState(newAllFiles, updatedGroups);

            return {
              allFiles: newAllFiles,
              documentGroups: updatedGroups,
              uploadedFilePreviews: previews,
            };
          },
          false,
          "addFilesToGroup"
        );
      },

      // Merge (copy) multiple files into a new combined document group
      // Source files remain unchanged - this creates copies for the merged document
      mergeDocumentsIntoGroup: (
        name: string,
        orderedFileIds: string[]
      ) => {
        set(
          (state) => {
            const timestamp = Date.now();
            const newGroupId = `merged_${timestamp}_${Math.random().toString(36).substr(2, 9)}`;
            const newAllFiles = { ...state.allFiles };

            // Create COPIES of selected files for the merged document
            // Original files remain unchanged in their source containers
            const copiedFileIds: string[] = [];

            for (let i = 0; i < orderedFileIds.length; i++) {
              const originalFileId = orderedFileIds[i];
              const originalFile = newAllFiles[originalFileId];
              if (originalFile) {
                // Create a new file ID for the copy
                const newFileId = `${originalFileId}_copy_${timestamp}_${i}`;

                // Create a copy of the file for the new merged group
                newAllFiles[newFileId] = {
                  ...originalFile,
                  id: newFileId,
                  containerIds: [newGroupId],
                  isNew: true,
                };
                copiedFileIds.push(newFileId);
              }
            }

            // Source groups remain unchanged - no files are removed

            // Create new merged group with copied files
            const newGroup: DocumentGroup = {
              id: newGroupId,
              title: name,
              originalTitle: name,
              tag: "Other Documents",
              mergedFileName: `${name.replace(/\s+/g, "_")}_Merged.pdf`,
              status: "pending",
              fileIds: copiedFileIds,
              files: [],
              hasChanges: true,
            };

            const updatedGroups = [...state.documentGroups, newGroup];
            const previews = syncFilePreviewsFromState(newAllFiles, updatedGroups);

            return {
              allFiles: newAllFiles,
              documentGroups: updatedGroups,
              uploadedFilePreviews: previews,
            };
          },
          false,
          "mergeDocumentsIntoGroup",
        );
      },

      // Upload folder with recursive path parsing
      uploadFolder: (files: Array<{ file: File; relativePath: string }>) => {
        set(
          (state) => {
            const timestamp = Date.now();
            const newAllFiles = { ...state.allFiles };

            // Separate files into recognized (known entity) and unrecognized (unknown entity)
            const recognizedFiles: Array<{ file: File; relativePath: string; parsed: ReturnType<typeof parseDocumentPath> }> = [];
            const unrecognizedFiles: Array<{ file: File; relativePath: string; parsed: ReturnType<typeof parseDocumentPath> }> = [];

            for (const fileData of files) {
              const parsed = parseDocumentPath(fileData.relativePath, fileData.file.name);
              if (parsed.who === 'unknown') {
                unrecognizedFiles.push({ ...fileData, parsed });
              } else {
                recognizedFiles.push({ ...fileData, parsed });
              }
            }

            // Group recognized files by their generated document name
            const groupedByName = new Map<string, {
              parsedDoc: ReturnType<typeof parseDocumentPath>;
              files: Array<{ file: File; relativePath: string }>;
            }>();

            for (const fileData of recognizedFiles) {
              if (!groupedByName.has(fileData.parsed.generatedName)) {
                groupedByName.set(fileData.parsed.generatedName, {
                  parsedDoc: fileData.parsed,
                  files: [],
                });
              }
              groupedByName.get(fileData.parsed.generatedName)!.files.push(fileData);
            }

            // Create DocumentGroups for each unique generated name
            const newGroups: DocumentGroup[] = [];
            let fileIndex = 0;

            // Determine tag from document type
            const tagMap: Record<string, string> = {
              passport: "Identity",
              nationalId: "Identity",
              birthCertificate: "Identity",
              bankStatement: "Financial",
              payslip: "Financial",
              taxReturn: "Financial",
              employmentLetter: "Employment",
              employmentContract: "Employment",
              educationCertificate: "Education",
              transcript: "Education",
              schoolEnrollment: "Education",
              marriageCertificate: "Relationship",
              proofOfCohabitation: "Relationship",
              propertyTitle: "Accommodation",
              proofOfAccommodation: "Accommodation",
              utilityBill: "Utility",
              visa: "Travel",
              insurance: "Insurance",
              letterOfConsent: "Other",
              document: "Other Documents",
            };

            for (const [generatedName, data] of groupedByName) {
              const groupId = `group_folder_${timestamp}_${newGroups.length}`;
              const fileIds: string[] = [];

              for (const fileData of data.files) {
                const fileId = `folder_${timestamp}_${fileIndex++}`;
                newAllFiles[fileId] = {
                  id: fileId,
                  name: fileData.file.name,
                  size: `${(fileData.file.size / 1024).toFixed(1)} KB`,
                  pages: 1,
                  date: "Just now",
                  type: "pdf" as const,
                  isNew: true,
                  containerIds: [groupId],
                  relativePath: fileData.relativePath,
                  entityType: data.parsedDoc.who,
                };
                fileIds.push(fileId);
              }

              const tag = tagMap[data.parsedDoc.documentType] || "Other Documents";

              newGroups.push({
                id: groupId,
                title: generatedName,
                originalTitle: generatedName,
                tag,
                mergedFileName: `${generatedName}.pdf`,
                status: "pending",
                fileIds,
                files: [],
                hasChanges: true,
                entityType: data.parsedDoc.who,
                generatedName,
              });
            }

            // Add unrecognized files as unclassified (containerIds = [])
            for (const fileData of unrecognizedFiles) {
              const fileId = `folder_${timestamp}_${fileIndex++}`;
              newAllFiles[fileId] = {
                id: fileId,
                name: fileData.file.name,
                size: `${(fileData.file.size / 1024).toFixed(1)} KB`,
                pages: 1,
                date: "Just now",
                type: "pdf" as const,
                isNew: true,
                containerIds: [], // Empty = unclassified
                relativePath: fileData.relativePath,
                entityType: "unknown" as const,
              };
            }

            // Add new classified groups
            const updatedGroups = [...state.documentGroups, ...newGroups];
            const previews = syncFilePreviewsFromState(newAllFiles, updatedGroups);

            return {
              allFiles: newAllFiles,
              documentGroups: updatedGroups,
              uploadedFilePreviews: previews,
            };
          },
          false,
          "uploadFolder",
        );
      },

      // Upload file for a specific evidence requirement
      uploadForEvidence: (evidenceId: string, evidenceName: string) => {
        set(
          (state) => {
            const timestamp = Date.now();
            const normalizedName = evidenceName.toLowerCase().replace(/[\s\-_]/g, "");
            const newAllFiles = { ...state.allFiles };

            // Find existing group that matches the evidence name
            let targetGroupId: string | undefined;
            for (const g of state.documentGroups) {
              const normalizedGroupTitle = g.title.toLowerCase().replace(/[\s\-_]/g, "");
              if (normalizedGroupTitle.includes(normalizedName) || normalizedName.includes(normalizedGroupTitle)) {
                targetGroupId = g.id;
                break;
              }
            }

            // If no matching group exists, create one
            if (!targetGroupId) {
              targetGroupId = `group_${timestamp}`;
            }

            const fileId = `evidence_${timestamp}`;
            newAllFiles[fileId] = {
              id: fileId,
              name: `${evidenceName.replace(/\s+/g, "_")}.pdf`,
              size: "0.5 MB",
              pages: 1,
              date: "Just now",
              type: "pdf",
              isNew: true,
              containerIds: [targetGroupId],
            };

            let newGroups = [...state.documentGroups];

            const existingGroup = newGroups.find(g => g.id === targetGroupId);
            if (existingGroup) {
              // Add file to existing group
              newGroups = newGroups.map((g) =>
                g.id === targetGroupId
                  ? {
                      ...g,
                      fileIds: [...g.fileIds, fileId],
                      status: "pending" as const,
                      hasChanges: true,
                    }
                  : g
              );
            } else {
              // Create new group for this evidence
              newGroups.push({
                id: targetGroupId,
                title: evidenceName,
                tag: evidenceName,
                mergedFileName: `${evidenceName}.pdf`,
                status: "pending",
                fileIds: [fileId],
                files: [],
                hasChanges: true,
              });
            }

            // Update enhanced checklist items (requiredEvidence is only on EnhancedChecklistItem)
            const updatedEnhancedItems = state.enhancedChecklistItems.map((item) => ({
              ...item,
              requiredEvidence: item.requiredEvidence?.map((ev) =>
                ev.id === evidenceId
                  ? {
                      ...ev,
                      isUploaded: true,
                      linkedFileId: fileId,
                      linkedFileName: newAllFiles[fileId].name,
                    }
                  : ev
              ),
            }));

            // Mark related issue as resolved
            const issueIdToResolve = `issue_missing_evidence_${evidenceId}`;
            const updatedIssues = state.enhancedQualityIssues.map((issue) =>
              issue.id === issueIdToResolve
                ? {
                    ...issue,
                    status: "resolved" as IssueStatus,
                    resolvedAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  }
                : issue
            );

            const previews = syncFilePreviewsFromState(newAllFiles, newGroups);

            return {
              allFiles: newAllFiles,
              documentGroups: newGroups,
              uploadedFilePreviews: previews,
              enhancedChecklistItems: updatedEnhancedItems,
              enhancedQualityIssues: updatedIssues,
            };
          },
          false,
          "uploadForEvidence"
        );
      },

      // Link evidence to an existing document group from File Hub
      linkEvidenceToGroup: (evidenceId: string, groupId: string) => {
        set(
          (state) => {
            const targetGroup = state.documentGroups.find((g) => g.id === groupId);
            if (!targetGroup) return state;

            // Update enhanced checklist items
            const updatedEnhancedItems = state.enhancedChecklistItems.map((item) => ({
              ...item,
              requiredEvidence: item.requiredEvidence?.map((ev) =>
                ev.id === evidenceId
                  ? {
                      ...ev,
                      isUploaded: true,
                      linkedFileId: groupId, // Link to the group ID
                      linkedFileName: targetGroup.title,
                    }
                  : ev
              ),
            }));

            // Mark related issue as resolved
            const issueIdToResolve = `issue_missing_evidence_${evidenceId}`;
            const updatedIssues = state.enhancedQualityIssues.map((issue) =>
              issue.id === issueIdToResolve
                ? {
                    ...issue,
                    status: "resolved" as IssueStatus,
                    resolvedAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  }
                : issue
            );

            return {
              enhancedChecklistItems: updatedEnhancedItems,
              enhancedQualityIssues: updatedIssues,
            };
          },
          false,
          "linkEvidenceToGroup"
        );
      },

      // Unlink evidence from a document group
      unlinkEvidence: (evidenceId: string) => {
        set(
          (state) => {
            // Update enhanced checklist items - reset the evidence to unlinked state
            const updatedEnhancedItems = state.enhancedChecklistItems.map((item) => ({
              ...item,
              requiredEvidence: item.requiredEvidence?.map((ev) =>
                ev.id === evidenceId
                  ? {
                      ...ev,
                      isUploaded: false,
                      linkedFileId: undefined,
                      linkedFileName: undefined,
                    }
                  : ev
              ),
            }));

            return {
              enhancedChecklistItems: updatedEnhancedItems,
            };
          },
          false,
          "unlinkEvidence"
        );
      },

      // Demo: Review all documents and analyze to generate client profile
      reviewAllDocumentsAndAnalyze: async () => {
        const state = get();

        // Step 1: Mark all document groups as reviewed
        set(
          (prev) => {
            const newAllFiles = { ...prev.allFiles };
            const newDocumentGroups = prev.documentGroups.map((g) => {
              const activeFileIds: string[] = [];
              for (const fileId of g.fileIds) {
                const file = newAllFiles[fileId];
                if (!file) continue;
                if (file.isRemoved) {
                  delete newAllFiles[fileId];
                } else {
                  newAllFiles[fileId] = { ...file, isNew: false };
                  activeFileIds.push(fileId);
                }
              }
              return {
                ...g,
                status: "reviewed" as const,
                hasChanges: false,
                fileIds: activeFileIds,
              };
            });
            return {
              isAnalyzingDocuments: true,
              analysisProgress: 0,
              allFiles: newAllFiles,
              documentGroups: newDocumentGroups,
            };
          },
          false,
          "reviewAllDocuments",
        );

        // Step 2: Simulate document analysis with progress updates
        const totalSteps = 5;
        for (let i = 1; i <= totalSteps; i++) {
          await new Promise((resolve) => setTimeout(resolve, 600));
          set(
            { analysisProgress: Math.round((i / totalSteps) * 100) },
            false,
            `analyzing:step${i}`,
          );
        }

        // Step 3: Generate mock client profile from "extracted" document data
        const mockPassportInfo: PassportInfo = {
          surname: "HARTWELL",
          givenNames: "Oliver James",
          nationality: "British",
          dateOfBirth: "1988-11-23",
          sex: "M",
          countryOfBirth: "United Kingdom",
          passportNumber: "533284719",
          dateOfIssue: "2021-06-15",
          dateOfExpiry: "2031-06-14",
        };

        const mockContactInfo = {
          email: "oliver.hartwell@gmail.com",
          phone: "+44 7911 234567",
          address: "42 Kensington Gardens, London W8 4PX",
        };

        // Step 4: Update client profile and record analyzed files
        const currentState = get();
        const analyzedFileIds = currentState.documentGroups
          .filter((g) => g.id !== "unclassified" && g.status === "reviewed")
          .flatMap((g) => getContainerFiles(currentState.allFiles, g).map((f) => f.id));

        set(
          (state) => {
            const newProfile = {
              ...state.clientProfile,
              passport: mockPassportInfo,
              contactInfo: mockContactInfo,
            };
            newProfile.completeness = calculateCompleteness(newProfile);

            // Mark all analyzed files in allFiles
            const newAllFiles = { ...state.allFiles };
            const now = new Date().toISOString();
            for (const fileId of analyzedFileIds) {
              const file = newAllFiles[fileId];
              if (file) {
                newAllFiles[fileId] = { ...file, isAnalyzed: true, analyzedAt: now };
              }
            }

            return {
              clientProfile: newProfile,
              isAnalyzingDocuments: false,
              analysisProgress: 100,
              lastAnalysisAt: now,
              analyzedFileIds,
              allFiles: newAllFiles,
            };
          },
          false,
          "analysisComplete",
        );

        // Evolve checklist based on new data
        get().evolveChecklist();
      },

      // Run document analysis on ready (reviewed) documents only
      runDocumentAnalysis: async () => {
        const state = get();

        // Get all ready files (from reviewed groups, excluding unclassified and removed)
        const readyFiles = state.documentGroups
          .filter((g) => g.id !== "unclassified" && g.status === "reviewed")
          .flatMap((g) => getContainerFiles(state.allFiles, g));

        if (readyFiles.length === 0) {
          return; // Nothing to analyze
        }

        set(
          { isAnalyzingDocuments: true, analysisProgress: 0 },
          false,
          "startAnalysis",
        );

        // Simulate analysis
        const totalSteps = 4;
        for (let i = 1; i <= totalSteps; i++) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          set(
            { analysisProgress: Math.round((i / totalSteps) * 100) },
            false,
            `analyzing:step${i}`,
          );
        }

        const analyzedFileIds = readyFiles.map((f) => f.id);

        set(
          (state) => {
            // Mark analyzed files in allFiles
            const newAllFiles = { ...state.allFiles };
            const now = new Date().toISOString();
            for (const fileId of analyzedFileIds) {
              const file = newAllFiles[fileId];
              if (file) {
                newAllFiles[fileId] = { ...file, isAnalyzed: true, analyzedAt: now };
              }
            }
            return {
              isAnalyzingDocuments: false,
              analysisProgress: 100,
              lastAnalysisAt: now,
              analyzedFileIds,
              allFiles: newAllFiles,
            };
          },
          false,
          "analysisComplete",
        );
      },

      // Application Phase Management
      setApplicationPhase: (phase: ApplicationPhase) => {
        set({ applicationPhase: phase }, false, "setApplicationPhase");
      },

      // Initialize form schema based on visa type
      initFormSchema: (visaType: VisaType) => {
        const schemaConfigs: Record<VisaType, Omit<FormSchemaStatus, "filledFields" | "completionPercentage" | "lastUpdatedAt">> = {
          "skilled-worker": {
            schemaName: "Skilled Worker Visa Application",
            schemaVersion: "2024.1",
            totalFields: 58,
            emptyRequiredFields: [
              "Certificate of Sponsorship number",
              "Sponsor license number",
              "Job start date",
              "Annual salary",
              "SOC code",
              "Working hours per week",
              "Main work location",
              "Previous UK visas",
              "Criminal convictions",
              "TB test certificate",
            ],
          },
          naturalisation: {
            schemaName: "Naturalisation Application",
            schemaVersion: "2024.1",
            totalFields: 55,
            emptyRequiredFields: [
              "Current immigration status",
              "Date ILR granted",
              "Residency period details",
              "Life in the UK test pass date",
              "English language proof",
              "Good character declaration",
              "Referee details",
            ],
          },
          visitor: {
            schemaName: "Visitor Visa Application",
            schemaVersion: "2024.1",
            totalFields: 38,
            emptyRequiredFields: [
              "Visit purpose",
              "Intended stay duration",
              "Accommodation address",
              "Return ticket booking",
              "Ties to home country",
            ],
          },
          "partner-spouse": {
            schemaName: "Partner/Spouse Visa Application",
            schemaVersion: "2024.1",
            totalFields: 62,
            emptyRequiredFields: [
              "Sponsor relationship",
              "Sponsor immigration status",
              "Accommodation details",
              "Financial evidence",
              "English language proof",
              "Relationship evidence",
            ],
          },
        };

        const config = schemaConfigs[visaType];
        const formSchema: FormSchemaStatus = {
          ...config,
          filledFields: 0,
          completionPercentage: 0,
          lastUpdatedAt: null,
        };

        set({ formSchema }, false, "initFormSchema");
      },

      // Start document analysis (Application workflow)
      startAnalysis: async () => {
        const state = get();

        // Get ready files (from reviewed groups, excluding unclassified)
        const reviewedGroups = state.documentGroups.filter(
          (g) => g.id !== "unclassified" && g.status === "reviewed"
        );
        const readyFiles = reviewedGroups.flatMap((g) =>
          getContainerFiles(state.allFiles, g)
        );

        if (readyFiles.length === 0) {
          return;
        }

        // Set analyzing phase
        set(
          {
            applicationPhase: "analyzing",
            isAnalyzingDocuments: true,
            analysisProgress: 0,
          },
          false,
          "startAnalysis"
        );

        // Simulate analysis with progress
        const totalSteps = 5;
        for (let i = 1; i <= totalSteps; i++) {
          await new Promise((resolve) => setTimeout(resolve, 800));
          set(
            { analysisProgress: Math.round((i / totalSteps) * 100) },
            false,
            `analyzing:step${i}`
          );
        }

        // Generate analyzed files summary
        const analyzedFiles: AnalyzedFileSummary[] = reviewedGroups.flatMap((g) =>
          getContainerFiles(state.allFiles, g).map((f) => ({
            id: f.id,
            name: f.name,
            groupTitle: g.title,
            pages: f.pages || 1,
            analyzedAt: new Date().toISOString(),
          }))
        );

        const analyzedFileIds = readyFiles.map((f) => f.id);

        // Update form schema with mock extracted data
        const currentSchema = state.formSchema;
        const filledFields = currentSchema
          ? Math.round(currentSchema.totalFields * 0.73)
          : 0;
        const updatedSchema: FormSchemaStatus | null = currentSchema
          ? {
              ...currentSchema,
              filledFields,
              completionPercentage: Math.round(
                (filledFields / currentSchema.totalFields) * 100
              ),
              lastUpdatedAt: new Date().toISOString(),
            }
          : null;

        // Mock passport extraction
        const mockPassportInfo: PassportInfo = {
          surname: "HARTWELL",
          givenNames: "Oliver James",
          nationality: "British",
          dateOfBirth: "1988-11-23",
          sex: "M",
          countryOfBirth: "United Kingdom",
          passportNumber: "533284719",
          dateOfIssue: "2021-06-15",
          dateOfExpiry: "2031-06-14",
        };

        const mockContactInfo = {
          email: "oliver.hartwell@gmail.com",
          phone: "+44 7911 234567",
          address: "42 Kensington Gardens, London W8 4PX",
        };

        set(
          (state) => {
            const newProfile = {
              ...state.clientProfile,
              passport: mockPassportInfo,
              contactInfo: mockContactInfo,
            };
            newProfile.completeness = calculateCompleteness(newProfile);

            return {
              applicationPhase: "questionnaire",
              isAnalyzingDocuments: false,
              analysisProgress: 100,
              lastAnalysisAt: new Date().toISOString(),
              analyzedFileIds,
              analyzedFiles,
              formSchema: updatedSchema,
              clientProfile: newProfile,
              // Reset questionnaire answers to trigger questionnaire flow
              questionnaireAnswers: {},
              // Mark analyzed files in allFiles
              allFiles: (() => {
                const newAllFiles = { ...state.allFiles };
                const now = new Date().toISOString();
                for (const fileId of analyzedFileIds) {
                  const file = newAllFiles[fileId];
                  if (file) {
                    newAllFiles[fileId] = { ...file, isAnalyzed: true, analyzedAt: now };
                  }
                }
                return newAllFiles;
              })(),
            };
          },
          false,
          "analysisComplete"
        );

        // Don't auto-generate checklist - wait for questionnaire to be completed
        // Checklist will be generated when user submits questionnaire answers
      },

      // Re-analyze: only updates analyzed files without regenerating checklist
      // Used when new files are added after initial checklist generation
      reAnalyze: async () => {
        const state = get();

        // Get all currently reviewed file IDs
        const reviewedGroups = state.documentGroups.filter(
          (g) => g.id !== "unclassified" && g.status === "reviewed"
        );
        const allReadyFileIds = reviewedGroups.flatMap((g) =>
          getContainerFiles(state.allFiles, g).map((f) => f.id)
        );

        // Find new files that haven't been analyzed
        const newFileIds = allReadyFileIds.filter(
          (id) => !state.analyzedFileIds.includes(id)
        );

        if (newFileIds.length === 0) {
          return;
        }

        // Brief analyzing state
        set(
          { isAnalyzingDocuments: true, analysisProgress: 0 },
          false,
          "reAnalyze:start"
        );

        // Simulate quick analysis
        await new Promise((resolve) => setTimeout(resolve, 500));
        set({ analysisProgress: 50 }, false, "reAnalyze:progress");
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Update analyzed file IDs to include new files
        const updatedAnalyzedFileIds = [...state.analyzedFileIds, ...newFileIds];

        set(
          (currentState) => {
            // Mark new files as analyzed in allFiles
            const newAllFiles = { ...currentState.allFiles };
            const now = new Date().toISOString();
            for (const fileId of newFileIds) {
              const file = newAllFiles[fileId];
              if (file) {
                newAllFiles[fileId] = { ...file, isAnalyzed: true, analyzedAt: now };
              }
            }
            return {
              isAnalyzingDocuments: false,
              analysisProgress: 100,
              lastAnalysisAt: now,
              analyzedFileIds: updatedAnalyzedFileIds,
              allFiles: newAllFiles,
            };
          },
          false,
          "reAnalyze:complete"
        );
      },

      // Launch Form Pilot (opens mock form with auto-fill)
      launchFormPilot: () => {
        const state = get();

        // Import and use the bridge dynamically to avoid SSR issues
        import("@/lib/form-pilot-bridge").then(({ launchFormPilotDemo, listenForCompletion }) => {
          // Launch the form pilot demo
          const { cleanup } = launchFormPilotDemo();

          // Listen for completion
          const removeListener = listenForCompletion((result) => {
            set(
              (currentState) => ({
                formPilotStatus: {
                  ...currentState.formPilotStatus,
                  totalSessions: currentState.formPilotStatus.totalSessions + 1,
                  lastRunAt: new Date().toISOString(),
                  lastRunStatus: result.status === "success" ? "success" : "error",
                },
              }),
              false,
              "formPilotComplete"
            );

            // Cleanup
            removeListener();
            cleanup();
          });
        });

        // Update status immediately to show "running"
        set(
          (currentState) => ({
            formPilotStatus: {
              ...currentState.formPilotStatus,
              lastRunAt: new Date().toISOString(),
              lastRunStatus: null, // null indicates running/in-progress
            },
          }),
          false,
          "launchFormPilot"
        );
      },

      // Start analysis and generate questionnaire (Application workflow)
      startAnalysisAndGenerateQuestionnaire: async () => {
        const state = get();

        // Get ready files (from reviewed groups, excluding unclassified)
        const reviewedGroups = state.documentGroups.filter(
          (g) => g.id !== "unclassified" && g.status === "reviewed"
        );
        const readyFiles = reviewedGroups.flatMap((g) =>
          getContainerFiles(state.allFiles, g)
        );

        if (readyFiles.length === 0) {
          return;
        }

        // Set analyzing phase
        set(
          {
            applicationPhase: "analyzing",
            isAnalyzingDocuments: true,
            analysisProgress: 0,
          },
          false,
          "startAnalysisAndGenerateQuestionnaire"
        );

        // Simulate analysis with progress (includes Gap Analysis)
        const totalSteps = 5;
        for (let i = 1; i <= totalSteps; i++) {
          await new Promise((resolve) => setTimeout(resolve, 800));
          set(
            { analysisProgress: Math.round((i / totalSteps) * 100) },
            false,
            `analyzing:step${i}`
          );
        }

        // Generate analyzed files summary
        const analyzedFiles: AnalyzedFileSummary[] = reviewedGroups.flatMap((g) =>
          getContainerFiles(state.allFiles, g).map((f) => ({
            id: f.id,
            name: f.name,
            groupTitle: g.title,
            pages: f.pages || 1,
            analyzedAt: new Date().toISOString(),
          }))
        );

        const analyzedFileIds = readyFiles.map((f) => f.id);

        // Mock passport extraction
        const mockPassportInfo: PassportInfo = {
          surname: "HARTWELL",
          givenNames: "Oliver James",
          nationality: "British",
          dateOfBirth: "1988-11-23",
          sex: "M",
          countryOfBirth: "United Kingdom",
          passportNumber: "533284719",
          dateOfIssue: "2021-06-15",
          dateOfExpiry: "2031-06-14",
        };

        const mockContactInfo = {
          email: "oliver.hartwell@gmail.com",
          phone: "+44 7911 234567",
          address: "42 Kensington Gardens, London W8 4PX",
        };

        set(
          (state) => {
            const newProfile = {
              ...state.clientProfile,
              passport: mockPassportInfo,
              contactInfo: mockContactInfo,
            };
            newProfile.completeness = calculateCompleteness(newProfile);

            return {
              applicationPhase: "questionnaire",
              isAnalyzingDocuments: false,
              analysisProgress: 100,
              lastAnalysisAt: new Date().toISOString(),
              analyzedFileIds,
              analyzedFiles,
              clientProfile: newProfile,
              // Mark analyzed files in allFiles
              allFiles: (() => {
                const newAllFiles = { ...state.allFiles };
                const now = new Date().toISOString();
                for (const fileId of analyzedFileIds) {
                  const file = newAllFiles[fileId];
                  if (file) {
                    newAllFiles[fileId] = { ...file, isAnalyzed: true, analyzedAt: now };
                  }
                }
                return newAllFiles;
              })(),
            };
          },
          false,
          "analysisAndQuestionnaireComplete"
        );
      },

      // Submit questionnaire answers and proceed to checklist
      submitQuestionnaireAnswers: (answers: Record<string, string>) => {
        const state = get();

        // Get all currently reviewed file IDs to mark as analyzed
        const analyzedFileIds = state.documentGroups
          .filter((g) => g.id !== "unclassified" && g.status === "reviewed")
          .flatMap((g) => getContainerFiles(state.allFiles, g).map((f) => f.id));

        set(
          {
            questionnaireAnswers: answers,
            applicationPhase: "checklist",
            // Mark analysis as complete when questionnaire is submitted
            lastAnalysisAt: new Date().toISOString(),
            // Track which files were analyzed
            analyzedFileIds,
          },
          false,
          "submitQuestionnaireAnswers"
        );
        // First generate the base checklist items (mock data)
        get().generateChecklist();
        // Then convert to enhanced format with issues
        get().generateEnhancedChecklist();
      },

      // Generate checklist with mock data and quality issues
      generateChecklist: () => {
        const state = get();
        const passport = state.clientProfile.passport;

        // Get passport file ID from document groups
        const passportGroup = state.documentGroups.find(g => g.id === "passport");
        const passportFileId = passportGroup?.fileIds[0]
          ? (state.allFiles[passportGroup.fileIds[0]]?.id || "pp_1")
          : "pp_1";

        // Mock checklist items based on UK Skilled Worker Visa requirements
        const mockChecklistItems: ApplicationChecklistItem[] = [
          // ==========================================
          // PERSONAL INFORMATION
          // ==========================================
          {
            id: "given_names",
            section: "personal",
            field: "givenNames",
            label: "Given Names",
            value: passport?.givenNames || null,
            source: passport?.givenNames ? "extracted" : null,
            linkedFileIds: [passportFileId],
            status: passport?.givenNames ? "complete" : "missing",
            isRequired: true,
          },
          {
            id: "surname",
            section: "personal",
            field: "surname",
            label: "Surname",
            value: passport?.surname || null,
            source: passport?.surname ? "extracted" : null,
            linkedFileIds: [passportFileId],
            status: passport?.surname ? "complete" : "missing",
            isRequired: true,
          },
          {
            id: "dob",
            section: "personal",
            field: "dateOfBirth",
            label: "Date of Birth",
            value: passport?.dateOfBirth || null,
            source: passport?.dateOfBirth ? "extracted" : null,
            linkedFileIds: [passportFileId],
            status: passport?.dateOfBirth ? "complete" : "missing",
            isRequired: true,
          },
          {
            id: "place_of_birth",
            section: "personal",
            field: "placeOfBirth",
            label: "Place of Birth",
            value: passport?.countryOfBirth || "Beijing, China",
            source: passport?.countryOfBirth ? "extracted" : "extracted",
            linkedFileIds: [passportFileId],
            status: "complete",
            isRequired: true,
          },
          {
            id: "gender",
            section: "personal",
            field: "gender",
            label: "Gender",
            value: passport?.sex || null,
            source: passport?.sex ? "extracted" : null,
            linkedFileIds: [passportFileId],
            status: passport?.sex ? "complete" : "missing",
            isRequired: true,
          },
          {
            id: "passport_number",
            section: "personal",
            field: "passportNumber",
            label: "Passport Number",
            value: passport?.passportNumber || null,
            source: passport?.passportNumber ? "extracted" : null,
            linkedFileIds: [passportFileId],
            status: passport?.passportNumber ? "complete" : "missing",
            isRequired: true,
          },
          {
            id: "passport_issue_date",
            section: "personal",
            field: "passportIssueDate",
            label: "Passport Issue Date",
            value: passport?.dateOfIssue || null,
            source: passport?.dateOfIssue ? "extracted" : null,
            linkedFileIds: [passportFileId],
            status: passport?.dateOfIssue ? "complete" : "missing",
            isRequired: true,
          },
          {
            id: "passport_expiry_date",
            section: "personal",
            field: "passportExpiryDate",
            label: "Passport Expiry Date",
            value: passport?.dateOfExpiry || null,
            source: passport?.dateOfExpiry ? "extracted" : null,
            linkedFileIds: [passportFileId],
            status: passport?.dateOfExpiry ? "complete" : "missing",
            isRequired: true,
          },
          {
            id: "nationality",
            section: "personal",
            field: "nationality",
            label: "Nationality",
            value: passport?.nationality || null,
            source: passport?.nationality ? "extracted" : null,
            linkedFileIds: [passportFileId],
            status: passport?.nationality ? "complete" : "missing",
            isRequired: true,
          },
          {
            id: "current_address",
            section: "personal",
            field: "currentAddress",
            label: "Current Residential Address",
            value: "15 Maple Street, London SW1A 1AA",
            source: "questionnaire",
            linkedFileIds: [],
            status: "complete",
            isRequired: true,
          },
          {
            id: "phone_number",
            section: "personal",
            field: "phoneNumber",
            label: "Contact Phone Number",
            value: "+44 7700 900123",
            source: "questionnaire",
            linkedFileIds: [],
            status: "complete",
            isRequired: true,
          },
          {
            id: "email_address",
            section: "personal",
            field: "emailAddress",
            label: "Email Address",
            value: "john.smith@email.com",
            source: "questionnaire",
            linkedFileIds: [],
            status: "complete",
            isRequired: true,
          },
          {
            id: "national_insurance",
            section: "personal",
            field: "nationalInsurance",
            label: "National Insurance Number",
            value: null,
            source: null,
            linkedFileIds: [],
            status: "missing",
            isRequired: false,
          },
          {
            id: "biometric_residence_permit",
            section: "personal",
            field: "biometricResidencePermit",
            label: "Previous BRP Number (if applicable)",
            value: null,
            source: null,
            linkedFileIds: [],
            status: "missing",
            isRequired: false,
          },

          // ==========================================
          // EMPLOYMENT DETAILS
          // ==========================================
          {
            id: "cos_number",
            section: "employment",
            field: "cosNumber",
            label: "Certificate of Sponsorship (CoS) Number",
            value: null,
            source: null,
            linkedFileIds: [],
            status: "missing",
            isRequired: true,
          },
          {
            id: "sponsor_name",
            section: "employment",
            field: "sponsorName",
            label: "Sponsor Name",
            value: "ACME Technology Ltd",
            source: "extracted",
            linkedFileIds: [],
            status: "complete",
            isRequired: true,
          },
          {
            id: "sponsor_license_number",
            section: "employment",
            field: "sponsorLicenseNumber",
            label: "Sponsor License Number",
            value: "A1B2C3D4E5F6",
            source: "extracted",
            linkedFileIds: [],
            status: "complete",
            isRequired: true,
          },
          {
            id: "sponsor_address",
            section: "employment",
            field: "sponsorAddress",
            label: "Sponsor Address",
            value: "100 Tech Park, Cambridge CB1 2AB",
            source: "extracted",
            linkedFileIds: [],
            status: "complete",
            isRequired: true,
          },
          {
            id: "job_title",
            section: "employment",
            field: "jobTitle",
            label: "Job Title",
            value: "Senior Software Engineer",
            source: "extracted",
            linkedFileIds: [],
            status: "complete",
            isRequired: true,
          },
          {
            id: "soc_code",
            section: "employment",
            field: "socCode",
            label: "SOC Code",
            value: "2136",
            source: "extracted",
            linkedFileIds: [],
            status: "complete",
            isRequired: true,
          },
          {
            id: "salary",
            section: "employment",
            field: "annualSalary",
            label: "Annual Salary (GBP)",
            value: "£65,000",
            source: "extracted",
            linkedFileIds: [],
            status: "complete",
            isRequired: true,
          },
          {
            id: "employment_start_date",
            section: "employment",
            field: "employmentStartDate",
            label: "Employment Start Date",
            value: "2024-04-01",
            source: "extracted",
            linkedFileIds: [],
            status: "complete",
            isRequired: true,
          },
          {
            id: "working_hours",
            section: "employment",
            field: "workingHoursPerWeek",
            label: "Working Hours per Week",
            value: "37.5",
            source: "extracted",
            linkedFileIds: [],
            status: "complete",
            isRequired: true,
          },
          {
            id: "work_address",
            section: "employment",
            field: "workAddress",
            label: "Work Location Address",
            value: "100 Tech Park, Cambridge CB1 2AB",
            source: "extracted",
            linkedFileIds: [],
            status: "complete",
            isRequired: true,
          },
          {
            id: "cos_assigned_date",
            section: "employment",
            field: "cosAssignedDate",
            label: "CoS Assigned Date",
            value: null,
            source: null,
            linkedFileIds: [],
            status: "missing",
            isRequired: true,
          },
          {
            id: "cos_expiry_date",
            section: "employment",
            field: "cosExpiryDate",
            label: "CoS Expiry Date",
            value: null,
            source: null,
            linkedFileIds: [],
            status: "missing",
            isRequired: true,
          },
          {
            id: "shortage_occupation",
            section: "employment",
            field: "shortageOccupation",
            label: "Is Role on Shortage Occupation List?",
            value: null,
            source: null,
            linkedFileIds: [],
            status: "missing",
            isRequired: true,
          },

          // ==========================================
          // FINANCIAL EVIDENCE
          // ==========================================
          {
            id: "bank_account_holder",
            section: "financial",
            field: "bankAccountHolder",
            label: "Bank Account Holder Name",
            value: passport?.givenNames && passport?.surname ? `${passport.givenNames} ${passport.surname}` : null,
            source: "extracted",
            linkedFileIds: [],
            status: passport?.givenNames ? "complete" : "missing",
            isRequired: true,
          },
          {
            id: "bank_name",
            section: "financial",
            field: "bankName",
            label: "Bank Name",
            value: "HSBC UK",
            source: "extracted",
            linkedFileIds: [],
            status: "complete",
            isRequired: true,
          },
          {
            id: "account_number",
            section: "financial",
            field: "accountNumber",
            label: "Account Number (Last 4 digits)",
            value: "****4521",
            source: "extracted",
            linkedFileIds: [],
            status: "complete",
            isRequired: false,
          },
          {
            id: "bank_balance",
            section: "financial",
            field: "bankBalance",
            label: "Current Balance",
            value: "£28,450.00",
            source: "extracted",
            linkedFileIds: [],
            status: "complete",
            isRequired: true,
          },
          {
            id: "funds_held_period",
            section: "financial",
            field: "fundsHeldPeriod",
            label: "Funds Held for 28 Consecutive Days",
            value: "Yes - Verified",
            source: "extracted",
            linkedFileIds: [],
            status: "complete",
            isRequired: true,
          },
          {
            id: "statement_date",
            section: "financial",
            field: "statementDate",
            label: "Bank Statement Date",
            value: "2024-01-15",
            source: "extracted",
            linkedFileIds: [],
            status: "complete",
            isRequired: true,
          },
          {
            id: "maintenance_requirement",
            section: "financial",
            field: "maintenanceRequirement",
            label: "Maintenance Requirement Met (£1,270)",
            value: "Yes",
            source: "extracted",
            linkedFileIds: [],
            status: "complete",
            isRequired: true,
          },
          {
            id: "additional_funds_source",
            section: "financial",
            field: "additionalFundsSource",
            label: "Source of Additional Funds",
            value: null,
            source: null,
            linkedFileIds: [],
            status: "missing",
            isRequired: false,
          },
          {
            id: "sponsor_maintenance_cert",
            section: "financial",
            field: "sponsorMaintenanceCert",
            label: "Sponsor Maintenance Certification",
            value: null,
            source: null,
            linkedFileIds: [],
            status: "missing",
            isRequired: false,
          },

          // ==========================================
          // TRAVEL HISTORY
          // ==========================================
          {
            id: "previous_uk_visa",
            section: "travel",
            field: "previousUKVisa",
            label: "Previous UK Visa History",
            value: "Tier 4 Student Visa (2015-2018)",
            source: "extracted",
            linkedFileIds: [passportFileId],
            status: "complete",
            isRequired: false,
          },
          {
            id: "current_immigration_status",
            section: "travel",
            field: "currentImmigrationStatus",
            label: "Current Immigration Status",
            value: "Outside UK",
            source: "questionnaire",
            linkedFileIds: [],
            status: "complete",
            isRequired: true,
          },
          {
            id: "travel_history_10_years",
            section: "travel",
            field: "travelHistory10Years",
            label: "Countries Visited (Last 10 Years)",
            value: null,
            source: null,
            linkedFileIds: [],
            status: "partial",
            isRequired: true,
          },
          {
            id: "visa_refusals",
            section: "travel",
            field: "visaRefusals",
            label: "Previous Visa Refusals",
            value: "None",
            source: "questionnaire",
            linkedFileIds: [],
            status: "complete",
            isRequired: true,
          },
          {
            id: "deportation_history",
            section: "travel",
            field: "deportationHistory",
            label: "Deportation or Removal History",
            value: "None",
            source: "questionnaire",
            linkedFileIds: [],
            status: "complete",
            isRequired: true,
          },
          {
            id: "criminal_convictions",
            section: "travel",
            field: "criminalConvictions",
            label: "Criminal Convictions",
            value: null,
            source: null,
            linkedFileIds: [],
            status: "missing",
            isRequired: true,
          },
          {
            id: "uk_address_history",
            section: "travel",
            field: "ukAddressHistory",
            label: "UK Address History (Last 5 Years)",
            value: null,
            source: null,
            linkedFileIds: [],
            status: "missing",
            isRequired: false,
          },

          // ==========================================
          // EDUCATION & QUALIFICATIONS
          // ==========================================
          {
            id: "highest_qualification",
            section: "education",
            field: "highestQualification",
            label: "Highest Qualification",
            value: "BSc Computer Science",
            source: "extracted",
            linkedFileIds: [],
            status: "complete",
            isRequired: false,
          },
          {
            id: "institution_name",
            section: "education",
            field: "institutionName",
            label: "Institution Name",
            value: "University of Manchester",
            source: "extracted",
            linkedFileIds: [],
            status: "complete",
            isRequired: false,
          },
          {
            id: "graduation_date",
            section: "education",
            field: "graduationDate",
            label: "Graduation Date",
            value: "July 2018",
            source: "extracted",
            linkedFileIds: [],
            status: "complete",
            isRequired: false,
          },
          {
            id: "english_test_type",
            section: "education",
            field: "englishTestType",
            label: "English Language Test Type",
            value: "IELTS Academic",
            source: "extracted",
            linkedFileIds: [],
            status: "complete",
            isRequired: true,
          },
          {
            id: "english_test_score",
            section: "education",
            field: "englishTestScore",
            label: "English Test Score",
            value: "Overall 7.5 (L:8.0, R:7.5, W:7.0, S:7.5)",
            source: "extracted",
            linkedFileIds: [],
            status: "complete",
            isRequired: true,
          },
          {
            id: "english_test_date",
            section: "education",
            field: "englishTestDate",
            label: "English Test Date",
            value: "2023-06-15",
            source: "extracted",
            linkedFileIds: [],
            status: "complete",
            isRequired: true,
          },
          {
            id: "cefr_level",
            section: "education",
            field: "cefrLevel",
            label: "CEFR Level",
            value: "B1 (Minimum Required)",
            source: "extracted",
            linkedFileIds: [],
            status: "complete",
            isRequired: true,
          },
          {
            id: "english_test_reference",
            section: "education",
            field: "englishTestReference",
            label: "English Test Reference Number",
            value: null,
            source: null,
            linkedFileIds: [],
            status: "missing",
            isRequired: true,
          },
          {
            id: "atas_certificate",
            section: "education",
            field: "atasCertificate",
            label: "ATAS Certificate (if applicable)",
            value: null,
            source: null,
            linkedFileIds: [],
            status: "missing",
            isRequired: false,
          },

          // ==========================================
          // FAMILY INFORMATION
          // ==========================================
          {
            id: "marital_status",
            section: "family",
            field: "maritalStatus",
            label: "Marital Status",
            value: "Married",
            source: "questionnaire",
            linkedFileIds: [],
            status: "complete",
            isRequired: true,
          },
          {
            id: "spouse_name",
            section: "family",
            field: "spouseName",
            label: "Spouse Full Name",
            value: "Jane Smith",
            source: "questionnaire",
            linkedFileIds: [],
            status: "complete",
            isRequired: false,
          },
          {
            id: "spouse_nationality",
            section: "family",
            field: "spouseNationality",
            label: "Spouse Nationality",
            value: "Chinese",
            source: "questionnaire",
            linkedFileIds: [],
            status: "complete",
            isRequired: false,
          },
          {
            id: "dependants_count",
            section: "family",
            field: "dependantsCount",
            label: "Number of Dependants",
            value: "1 (Spouse applying separately)",
            source: "questionnaire",
            linkedFileIds: [],
            status: "complete",
            isRequired: true,
          },
          {
            id: "children_count",
            section: "family",
            field: "childrenCount",
            label: "Number of Children",
            value: "0",
            source: "questionnaire",
            linkedFileIds: [],
            status: "complete",
            isRequired: true,
          },
          {
            id: "spouse_passport_number",
            section: "family",
            field: "spousePassportNumber",
            label: "Spouse Passport Number",
            value: null,
            source: null,
            linkedFileIds: [],
            status: "missing",
            isRequired: false,
          },
          {
            id: "marriage_certificate_date",
            section: "family",
            field: "marriageCertificateDate",
            label: "Marriage Certificate Date",
            value: null,
            source: null,
            linkedFileIds: [],
            status: "missing",
            isRequired: false,
          },
          {
            id: "family_members_in_uk",
            section: "family",
            field: "familyMembersInUK",
            label: "Other Family Members in UK",
            value: null,
            source: null,
            linkedFileIds: [],
            status: "missing",
            isRequired: false,
          },
        ];

        // Mock quality issues based on common Skilled Worker visa issues
        const mockQualityIssues: QualityIssue[] = [
          {
            id: "issue_cos",
            type: "missing",
            severity: "error",
            title: "CoS Number Required",
            description: "Certificate of Sponsorship number is missing. This is mandatory for Skilled Worker visa applications. Please obtain from your sponsor.",
            linkedChecklistItemId: "cos_number",
            isResolved: false,
          },
          {
            id: "issue_cos_dates",
            type: "missing",
            severity: "error",
            title: "CoS Dates Required",
            description: "CoS assigned date and expiry date are missing. These are required to verify the validity of your sponsorship.",
            linkedChecklistItemId: "cos_assigned_date",
            isResolved: false,
          },
          {
            id: "issue_travel_history",
            type: "missing",
            severity: "warning",
            title: "Incomplete Travel History",
            description: "Travel history for the last 10 years is incomplete. UKVI requires full travel history including all countries visited.",
            linkedChecklistItemId: "travel_history_10_years",
            isResolved: false,
          },
          {
            id: "issue_criminal_check",
            type: "missing",
            severity: "error",
            title: "Criminal Convictions Declaration Required",
            description: "You must declare any criminal convictions. This is a mandatory question on the visa application form.",
            linkedChecklistItemId: "criminal_convictions",
            isResolved: false,
          },
          {
            id: "issue_english_ref",
            type: "missing",
            severity: "warning",
            title: "English Test Reference Number",
            description: "The reference number for your English language test is required for verification with the test provider.",
            linkedChecklistItemId: "english_test_reference",
            isResolved: false,
          },
          {
            id: "issue_passport_validity",
            type: "validity",
            severity: "info",
            title: "Passport Validity Check",
            description: "Ensure passport is valid for the duration of intended stay. Recommended to have at least 6 months validity beyond visa end date.",
            linkedChecklistItemId: "passport_expiry_date",
            linkedFileId: passportFileId,
            isResolved: false,
          },
          {
            id: "issue_shortage",
            type: "missing",
            severity: "info",
            title: "Shortage Occupation Status",
            description: "Please confirm whether your role is on the Shortage Occupation List, as this affects salary threshold requirements.",
            linkedChecklistItemId: "shortage_occupation",
            isResolved: false,
          },
        ];

        set(
          {
            applicationPhase: "checklist",
            applicationChecklistItems: mockChecklistItems,
            qualityIssues: mockQualityIssues,
          },
          false,
          "generateChecklist"
        );

        // Also generate enhanced checklist for the new workspace UI
        get().generateEnhancedChecklist();
      },

      // Update a checklist field value
      updateChecklistField: (fieldId: string, value: string) => {
        set(
          (state) => ({
            applicationChecklistItems: state.applicationChecklistItems.map((item) =>
              item.id === fieldId
                ? {
                    ...item,
                    value,
                    source: "manual",
                    status: value ? "complete" : "missing",
                  }
                : item
            ),
          }),
          false,
          "updateChecklistField"
        );
      },

      // Resolve a quality issue
      resolveIssue: (issueId: string) => {
        set(
          (state) => ({
            qualityIssues: state.qualityIssues.map((issue) =>
              issue.id === issueId ? { ...issue, isResolved: true } : issue
            ),
          }),
          false,
          "resolveIssue"
        );
      },

      // Go back to a previous phase
      goBackToPhase: (phase: ApplicationPhase) => {
        set({ applicationPhase: phase }, false, "goBackToPhase");
      },

      // Toggle checklist section expansion
      toggleChecklistSection: (sectionId: ChecklistSectionType) => {
        set(
          (state) => ({
            checklistSectionExpanded: {
              ...state.checklistSectionExpanded,
              [sectionId]: !state.checklistSectionExpanded[sectionId],
            },
          }),
          false,
          "toggleChecklistSection"
        );
      },

      // ============================================
      // Enhanced Checklist Workspace Actions
      // ============================================

      // Select a checklist item (for detail panel)
      selectChecklistItem: (itemId: string | null) => {
        set({ selectedChecklistItemId: itemId }, false, "selectChecklistItem");
      },

      // Select an issue (for detail view)
      selectIssue: (issueId: string | null) => {
        set({ selectedIssueId: issueId }, false, "selectIssue");
      },

      // Update enhanced checklist field value
      updateEnhancedChecklistField: (fieldId: string, value: string) => {
        set(
          (state) => ({
            enhancedChecklistItems: state.enhancedChecklistItems.map((item) =>
              item.id === fieldId
                ? {
                    ...item,
                    value,
                    source: "manual" as const,
                    status: value ? "complete" as const : "missing" as const,
                  }
                : item
            ),
          }),
          false,
          "updateEnhancedChecklistField"
        );
      },

      // Update issue status
      updateIssueStatus: (issueId: string, status: IssueStatus) => {
        const currentUser = SYSTEM_USERS[0]; // Mock current user
        set(
          (state) => ({
            enhancedQualityIssues: state.enhancedQualityIssues.map((issue) => {
              if (issue.id !== issueId) return issue;
              const historyEntry: IssueHistoryEntry = {
                id: `history_${Date.now()}`,
                timestamp: new Date().toISOString(),
                action: "status_changed",
                performedBy: { id: currentUser.id, name: currentUser.name },
                previousStatus: issue.status,
                newStatus: status,
              };
              return {
                ...issue,
                status,
                updatedAt: new Date().toISOString(),
                history: [...issue.history, historyEntry],
              };
            }),
          }),
          false,
          "updateIssueStatus"
        );
      },

      // Add a note to an issue
      addIssueNote: (issueId: string, note: string) => {
        const currentUser = SYSTEM_USERS[0]; // Mock current user
        set(
          (state) => ({
            enhancedQualityIssues: state.enhancedQualityIssues.map((issue) => {
              if (issue.id !== issueId) return issue;
              const historyEntry: IssueHistoryEntry = {
                id: `history_${Date.now()}`,
                timestamp: new Date().toISOString(),
                action: "note_added",
                performedBy: { id: currentUser.id, name: currentUser.name },
                details: note,
              };
              return {
                ...issue,
                updatedAt: new Date().toISOString(),
                notes: [
                  ...issue.notes,
                  {
                    id: `note_${Date.now()}`,
                    content: note,
                    createdAt: new Date().toISOString(),
                    createdBy: { id: currentUser.id, name: currentUser.name },
                  },
                ],
                history: [...issue.history, historyEntry],
              };
            }),
          }),
          false,
          "addIssueNote"
        );
      },

      // Forward issue to client
      forwardIssueToClient: (issueId: string, data: ForwardToClientData) => {
        const currentUser = SYSTEM_USERS[0]; // Mock current user
        set(
          (state) => ({
            enhancedQualityIssues: state.enhancedQualityIssues.map((issue) => {
              if (issue.id !== issueId) return issue;
              const historyEntry: IssueHistoryEntry = {
                id: `history_${Date.now()}`,
                timestamp: new Date().toISOString(),
                action: "forwarded",
                performedBy: { id: currentUser.id, name: currentUser.name },
                details: data.method === "email"
                  ? `Forwarded via email to ${data.recipientEmail}`
                  : "Shareable link generated",
              };
              return {
                ...issue,
                status: "forwarded" as IssueStatus,
                updatedAt: new Date().toISOString(),
                forwardData: data,
                history: [...issue.history, historyEntry],
              };
            }),
            forwardModalOpen: false,
            forwardModalIssueId: null,
          }),
          false,
          "forwardIssueToClient"
        );
      },

      // Mark issue as resolved
      markIssueResolved: (issueId: string, resolution?: string) => {
        const currentUser = SYSTEM_USERS[0]; // Mock current user
        set(
          (state) => ({
            enhancedQualityIssues: state.enhancedQualityIssues.map((issue) => {
              if (issue.id !== issueId) return issue;
              const historyEntry: IssueHistoryEntry = {
                id: `history_${Date.now()}`,
                timestamp: new Date().toISOString(),
                action: "resolved",
                performedBy: { id: currentUser.id, name: currentUser.name },
                details: resolution,
                previousStatus: issue.status,
                newStatus: "resolved",
              };
              return {
                ...issue,
                status: "resolved" as IssueStatus,
                updatedAt: new Date().toISOString(),
                resolvedAt: new Date().toISOString(),
                resolvedBy: { id: currentUser.id, name: currentUser.name },
                history: [...issue.history, historyEntry],
              };
            }),
          }),
          false,
          "markIssueResolved"
        );
      },

      // Open forward modal
      openForwardModal: (issueId: string) => {
        set(
          { forwardModalOpen: true, forwardModalIssueId: issueId },
          false,
          "openForwardModal"
        );
      },

      // Close forward modal
      closeForwardModal: () => {
        set(
          { forwardModalOpen: false, forwardModalIssueId: null },
          false,
          "closeForwardModal"
        );
      },

      // Generate enhanced checklist with linked documents and issues
      generateEnhancedChecklist: () => {
        const state = get();
        const currentUser = SYSTEM_USERS[0];

        // Create linked documents from analyzed files
        const createLinkedDocument = (fileId: string): LinkedDocument | null => {
          const file = state.allFiles[fileId];
          if (!file || file.isRemoved) return null;
          // Find the group this file belongs to
          const group = state.documentGroups.find((g) =>
            g.fileIds.includes(fileId)
          );
          return {
            fileId: file.id,
            fileName: file.name,
            groupTitle: group?.title || "Unknown",
            pageNumbers: [1], // Mock page number
            extractedText: `Extracted from ${file.name}`,
          };
        };

        // Evidence ID → Document Group ID mapping for auto-linking
        const EVIDENCE_GROUP_MAP: Record<string, string> = {
          ev_passport: "passport",
          ev_cos: "employment_letter", // CoS auto-linked to employment docs
          ev_bank_statements: "bank_statement",
          ev_payslip: "bank_statement", // payslip may be in same group
          ev_employment_contract: "employment_letter",
          ev_travel_history: "travel_history",
          ev_english_cert: "education",
          ev_degree_cert: "education",
        };

        // Auto-link evidence to existing document groups
        const autoLinkEvidence = (ev: RequiredEvidence): RequiredEvidence => {
          const groupId = EVIDENCE_GROUP_MAP[ev.id];
          if (!groupId) return ev;
          const group = state.documentGroups.find(g => g.id === groupId);
          if (!group || group.fileIds.length === 0) return ev;
          return {
            ...ev,
            isUploaded: true,
            linkedFileId: group.id,
            linkedFileName: group.title,
          };
        };

        // Required evidence configuration per section (UK Skilled Worker Visa)
        const SECTION_REQUIRED_EVIDENCE: Record<ChecklistSectionType, RequiredEvidence[]> = {
          personal: [
            {
              id: "ev_passport",
              name: "Valid Passport",
              description: "Current passport with at least 1 blank page for visa vignette",
              isUploaded: false,
              isMandatory: true,
              acceptedFormats: ["PDF", "JPEG", "PNG"],
              validityPeriod: "Must be valid for duration of stay",
            },
            {
              id: "ev_photo",
              name: "Passport-sized Photograph",
              description: "Recent photo meeting UK visa photo requirements (45mm x 35mm)",
              isUploaded: false,
              isMandatory: true,
              acceptedFormats: ["JPEG", "PNG"],
            },
            {
              id: "ev_previous_passport",
              name: "Previous Passports (if applicable)",
              description: "Any previous passports showing UK immigration history",
              isUploaded: false,
              isMandatory: false,
              acceptedFormats: ["PDF", "JPEG"],
            },
          ],
          employment: [
            {
              id: "ev_cos",
              name: "Certificate of Sponsorship (CoS)",
              description: "CoS reference number from licensed UK sponsor",
              isUploaded: false,
              isMandatory: true,
            },
            {
              id: "ev_employment_contract",
              name: "Employment Contract / Job Offer Letter",
              description: "Signed contract showing job title, salary, and start date",
              isUploaded: false,
              isMandatory: true,
              acceptedFormats: ["PDF"],
            },
            {
              id: "ev_sponsor_letter",
              name: "Sponsor Confirmation Letter",
              description: "Letter from sponsor confirming employment details",
              isUploaded: false,
              isMandatory: false,
              acceptedFormats: ["PDF"],
            },
          ],
          financial: [
            {
              id: "ev_bank_statements",
              name: "Bank Statements (28 days)",
              description: "Showing funds held for 28 consecutive days ending within 31 days of application",
              isUploaded: false,
              isMandatory: true,
              acceptedFormats: ["PDF"],
              validityPeriod: "Must be dated within 31 days of application",
            },
            {
              id: "ev_payslip",
              name: "Payslip",
              description: "Recent payslips showing salary payments (last 3 months recommended)",
              isUploaded: false,
              isMandatory: true,
              acceptedFormats: ["PDF"],
            },
          ],
          travel: [
            {
              id: "ev_travel_history",
              name: "Travel History Documentation",
              description: "Evidence of travel history for last 10 years (passport stamps, boarding passes)",
              isUploaded: false,
              isMandatory: true,
              acceptedFormats: ["PDF", "JPEG"],
            },
            {
              id: "ev_old_visas",
              name: "Previous UK Visas (if any)",
              description: "Copies of any previous UK visas or BRPs",
              isUploaded: false,
              isMandatory: false,
              acceptedFormats: ["PDF", "JPEG"],
            },
          ],
          education: [
            {
              id: "ev_english_cert",
              name: "English Language Test Certificate",
              description: "IELTS, TOEFL, or approved SELT certificate (CEFR B1 minimum)",
              isUploaded: false,
              isMandatory: true,
              acceptedFormats: ["PDF"],
              validityPeriod: "Must be within 2 years of application date",
            },
            {
              id: "ev_degree_cert",
              name: "Degree Certificate / Academic Qualification",
              description: "Original or certified copy of highest qualification",
              isUploaded: false,
              isMandatory: false,
              acceptedFormats: ["PDF"],
            },
            {
              id: "ev_atas",
              name: "ATAS Certificate (if applicable)",
              description: "Academic Technology Approval Scheme certificate for certain fields",
              isUploaded: false,
              isMandatory: false,
              acceptedFormats: ["PDF"],
            },
          ],
          family: [
            {
              id: "ev_marriage_cert",
              name: "Marriage Certificate (if applicable)",
              description: "Official marriage certificate if applying with spouse",
              isUploaded: false,
              isMandatory: false,
              acceptedFormats: ["PDF"],
            },
            {
              id: "ev_birth_cert",
              name: "Birth Certificates (if applicable)",
              description: "For any dependent children",
              isUploaded: false,
              isMandatory: false,
              acceptedFormats: ["PDF"],
            },
          ],
          other: [],
        };

        // Get required evidence for a section (with auto-linking applied)
        const getRequiredEvidence = (section: ChecklistSectionType): RequiredEvidence[] => {
          return (SECTION_REQUIRED_EVIDENCE[section] || []).map(autoLinkEvidence);
        };

        // Convert existing checklist items to enhanced format
        const enhancedItems: EnhancedChecklistItem[] = state.applicationChecklistItems.map((item) => ({
          id: item.id,
          section: item.section,
          field: item.field,
          label: item.label,
          value: item.value,
          source: item.source,
          linkedDocuments: item.linkedFileIds
            .map(createLinkedDocument)
            .filter((doc): doc is LinkedDocument => doc !== null),
          requiredEvidence: getRequiredEvidence(item.section),
          status: item.status,
          isRequired: item.isRequired,
          isEditable: true,
          confidenceScore: item.source === "extracted" ? 95 : undefined,
        }));

        // Convert existing quality issues to enhanced format
        const existingEnhancedIssues: EnhancedQualityIssue[] = state.qualityIssues.map((issue) => ({
          id: issue.id,
          type: issue.type,
          severity: issue.severity,
          status: issue.isResolved ? "resolved" as IssueStatus : "open" as IssueStatus,
          title: issue.title,
          description: issue.description,
          linkedChecklistItemId: issue.linkedChecklistItemId,
          linkedFileIds: issue.linkedFileId ? [issue.linkedFileId] : [],
          history: [
            {
              id: `history_${issue.id}_created`,
              timestamp: new Date().toISOString(),
              action: "created" as const,
              performedBy: { id: "system", name: "System" },
            },
          ],
          notes: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));

        // Generate issues for missing fields (checklist items with status "missing")
        const missingFieldIssues: EnhancedQualityIssue[] = enhancedItems
          .filter((item) => item.status === "missing" && item.isRequired)
          .map((item) => ({
            id: `issue_missing_field_${item.id}`,
            type: "missing" as QualityIssueType,
            severity: "warning" as QualityIssueSeverity,
            status: "open" as IssueStatus,
            title: `Missing: ${item.label}`,
            description: `The field "${item.label}" is required but has not been provided. Please fill in this information or upload supporting documents.`,
            linkedChecklistItemId: item.id,
            linkedFileIds: [],
            history: [
              {
                id: `history_missing_field_${item.id}_created`,
                timestamp: new Date().toISOString(),
                action: "created" as const,
                performedBy: { id: "system", name: "System" },
              },
            ],
            notes: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }));

        // Generate issues for missing required evidence
        const allRequiredEvidence = Object.values(SECTION_REQUIRED_EVIDENCE).flat();
        const missingEvidenceIssues: EnhancedQualityIssue[] = allRequiredEvidence
          .filter((ev) => ev.isMandatory && !ev.isUploaded)
          .map((ev) => {
            // Find a related checklist item in the same section
            const sectionType = Object.entries(SECTION_REQUIRED_EVIDENCE)
              .find(([, evidenceList]) => evidenceList.some((e) => e.id === ev.id))?.[0] as ChecklistSectionType | undefined;
            const relatedItem = enhancedItems.find((item) => item.section === sectionType);

            return {
              id: `issue_missing_evidence_${ev.id}`,
              type: "missing" as QualityIssueType,
              severity: "error" as QualityIssueSeverity,
              status: "open" as IssueStatus,
              title: `Missing Document: ${ev.name}`,
              description: ev.description || `The document "${ev.name}" is required but has not been uploaded.`,
              suggestedAction: "Upload the required document",
              linkedChecklistItemId: relatedItem?.id || enhancedItems[0]?.id || "",
              linkedFileIds: [],
              history: [
                {
                  id: `history_missing_evidence_${ev.id}_created`,
                  timestamp: new Date().toISOString(),
                  action: "created" as const,
                  performedBy: { id: "system", name: "System" },
                },
              ],
              notes: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
          });

        // Combine all issues (filter out duplicates by checking if similar issue exists)
        const existingIssueIds = new Set(existingEnhancedIssues.map((i) => i.linkedChecklistItemId));
        const filteredMissingFieldIssues = missingFieldIssues.filter(
          (i) => !existingIssueIds.has(i.linkedChecklistItemId)
        );

        const enhancedIssues: EnhancedQualityIssue[] = [
          ...existingEnhancedIssues,
          ...filteredMissingFieldIssues,
          ...missingEvidenceIssues,
        ];

        set(
          {
            enhancedChecklistItems: enhancedItems,
            enhancedQualityIssues: enhancedIssues,
            // Auto-select first item if available
            selectedChecklistItemId: enhancedItems.length > 0 ? enhancedItems[0].id : null,
          },
          false,
          "generateEnhancedChecklist"
        );
      },

      // Initialize case from CreateCaseModal data
      // Passport is parsed immediately at case creation (not dependent on analysis)
      // Case Notes is auto-confirmed, Passport requires confirm review
      initializeCaseFromCreation: (data: {
        visaType: VisaType;
        passport: PassportInfo;
        caseNotesFileName: string;
        passportFileName: string;
        referenceNumber?: string;
        advisorId?: string;
        assistantId?: string;
      }) => {
        // Mock case notes summary (would be extracted from uploaded case notes)
        const mockCaseNotesSummary: CaseNotesSummary = {
          summary: "Client seeking Skilled Worker visa for a Senior Software Engineer position at ACME Technology Ltd. Has previous UK visa history (Tier 4 Student, 2015-2018). Strong financial background with verified savings. Main concern is ensuring CoS documentation is complete.",
          clientBackground: "British national currently residing in London. Has worked in tech industry for 8+ years.",
          keyDates: ["CoS expected: Feb 2024", "Target application: Mar 2024"],
          extractedAt: new Date().toISOString(),
        };

        // Create files for allFiles store
        const caseNotesFileId = `cn_${Date.now()}`;
        const passportFileId = `pp_${Date.now()}`;

        const newAllFiles: Record<string, DocumentFile> = {
          [caseNotesFileId]: {
            id: caseNotesFileId,
            name: data.caseNotesFileName,
            size: "1.2 MB",
            pages: 5,
            date: "Just now",
            type: "pdf",
            isNew: false, // Not marked as new since it's auto-confirmed
            containerIds: ["case_notes"],
          },
          [passportFileId]: {
            id: passportFileId,
            name: data.passportFileName,
            size: "0.8 MB",
            pages: 1,
            date: "Just now",
            type: "pdf",
            isNew: true,
            containerIds: ["passport"],
          },
        };

        // Create document groups - case notes is special (auto-confirmed), passport requires review
        const caseNotesGroup: DocumentGroup = {
          id: "case_notes",
          title: "Case Notes",
          originalTitle: "Case Notes",
          tag: "Case Notes",
          mergedFileName: data.caseNotesFileName,
          status: "reviewed", // Auto-confirmed, no review needed
          isSpecial: true, // Special document - doesn't require manual review
          fileIds: [caseNotesFileId],
          files: [],
        };

        // Passport document requires confirm review (not isSpecial)
        const passportGroup: DocumentGroup = {
          id: "passport",
          title: "Passport",
          originalTitle: "Passport",
          tag: "Passport",
          mergedFileName: data.passportFileName,
          status: "pending", // Requires confirm review
          fileIds: [passportFileId],
          files: [],
        };

        // Create empty unclassified group for future uploads
        const unclassifiedGroup: DocumentGroup = {
          id: "unclassified",
          title: "Unclassified",
          originalTitle: "Unclassified",
          tag: "unclassified",
          status: "pending",
          fileIds: [],
          files: [],
        };

        // Client profile includes passport data parsed at creation time
        // Passport parsing is immediate, not dependent on analysis
        const profileWithPassport = {
          passport: data.passport,
          completeness: 0,
        };
        profileWithPassport.completeness = calculateCompleteness(profileWithPassport);

        const documentGroups = [unclassifiedGroup, caseNotesGroup, passportGroup];
        const previews = syncFilePreviewsFromState(newAllFiles, documentGroups);

        set(
          {
            // Navigation - land on overview page
            activeNav: "overview",
            selectedVisaType: data.visaType,
            clientProfile: profileWithPassport,
            caseReference: data.referenceNumber || "REF-2024-001",
            caseNotesSummary: mockCaseNotesSummary,
            allFiles: newAllFiles,
            documentGroups,
            uploadedFilePreviews: previews,
            // Reset analysis state
            lastAnalysisAt: null,
            analyzedFileIds: [],
            analyzedFiles: [],
            isAnalyzingDocuments: false,
            analysisProgress: 0,
            // Reset questionnaire to trigger case assessment form
            questionnaireAnswers: {},
            // Reset application phase to analyzing (ready to start analysis)
            applicationPhase: "analyzing",
            formSchema: null,
          },
          false,
          "initializeCaseFromCreation"
        );

        // Initialize form schema for the selected visa type
        get().initFormSchema(data.visaType);

        // Evolve checklist based on new data
        get().evolveChecklist();
      },

      // Assessment Reference Documents
      addAssessmentReferenceDoc: (groupId: string) => {
        set(
          (state) => ({
            assessmentReferenceDocIds: state.assessmentReferenceDocIds.includes(groupId)
              ? state.assessmentReferenceDocIds
              : [...state.assessmentReferenceDocIds, groupId],
          }),
          false,
          "addAssessmentReferenceDoc"
        );
      },

      removeAssessmentReferenceDoc: (groupId: string) => {
        set(
          (state) => ({
            assessmentReferenceDocIds: state.assessmentReferenceDocIds.filter(
              (id) => id !== groupId
            ),
          }),
          false,
          "removeAssessmentReferenceDoc"
        );
      },

      // Reset
      reset: () => {
        sessionStorage.removeItem("xeni-case-detail");
        set(initialState, false, "reset");
      },
    }),
    {
      name: "xeni-case-detail",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => {
        // Exclude transient UI state from persistence
        const {
          isLoadingDocuments,
          isAnalyzingDocuments,
          analysisProgress,
          demoStage,
          highlightedGroupId,
          forwardModalOpen,
          forwardModalIssueId,
          ...persisted
        } = state;
        return persisted;
      },
    },
    ),
    { name: "case-detail-store" },
  ),
);

// Selector hooks for optimized re-renders
export const useActiveNav = () =>
  useCaseDetailStore((state) => state.activeNav);
export const useHighlightedGroupId = () =>
  useCaseDetailStore((state) => state.highlightedGroupId);
export const useClientProfile = () =>
  useCaseDetailStore((state) => state.clientProfile);
export const useCaseNotesSummary = () =>
  useCaseDetailStore((state) => state.caseNotesSummary);
export const useSelectedVisaType = () =>
  useCaseDetailStore((state) => state.selectedVisaType);
export const useChecklistStage = () =>
  useCaseDetailStore((state) => state.checklist.stage);
// Returns document groups with files resolved from allFiles (backward compatible)
// UI components can access group.files directly
// Uses separate subscriptions + useMemo to avoid infinite re-render loops
export const useDocumentGroups = () => {
  const groups = useCaseDetailStore((state) => state.documentGroups);
  const allFiles = useCaseDetailStore((state) => state.allFiles);
  return useMemo(
    () =>
      groups.map((group) => ({
        ...group,
        files: group.fileIds
          .map((id) => allFiles[id])
          .filter((f): f is DocumentFile => f !== undefined),
      })),
    [groups, allFiles]
  );
};
export const useIsLoadingDocuments = () =>
  useCaseDetailStore((state) => state.isLoadingDocuments);
export const useApplicationPhase = () =>
  useCaseDetailStore((state) => state.applicationPhase);
export const useFormSchema = () =>
  useCaseDetailStore((state) => state.formSchema);
export const useFormPilotStatus = () =>
  useCaseDetailStore((state) => state.formPilotStatus);
export const useAnalyzedFiles = () =>
  useCaseDetailStore((state) => state.analyzedFiles);

// Enhanced Checklist Workspace Selectors
export const useEnhancedChecklistItems = () =>
  useCaseDetailStore((state) => state.enhancedChecklistItems);
export const useEnhancedQualityIssues = () =>
  useCaseDetailStore((state) => state.enhancedQualityIssues);
export const useSelectedChecklistItemId = () =>
  useCaseDetailStore((state) => state.selectedChecklistItemId);
export const useSelectedIssueId = () =>
  useCaseDetailStore((state) => state.selectedIssueId);
export const useForwardModalOpen = () =>
  useCaseDetailStore((state) => state.forwardModalOpen);
export const useForwardModalIssueId = () =>
  useCaseDetailStore((state) => state.forwardModalIssueId);

// Get selected checklist item with its issues
export const useSelectedChecklistItem = () =>
  useCaseDetailStore((state) => {
    if (!state.selectedChecklistItemId) return null;
    return state.enhancedChecklistItems.find(
      (item) => item.id === state.selectedChecklistItemId
    ) || null;
  });

// Get issues for selected checklist item - memoized to prevent infinite loops
export const useIssuesForSelectedItem = () => {
  const selectedChecklistItemId = useCaseDetailStore(
    (state) => state.selectedChecklistItemId
  );
  const enhancedQualityIssues = useCaseDetailStore(
    (state) => state.enhancedQualityIssues
  );

  return useMemo(() => {
    if (!selectedChecklistItemId) return [];
    return enhancedQualityIssues.filter(
      (issue) => issue.linkedChecklistItemId === selectedChecklistItemId
    );
  }, [selectedChecklistItemId, enhancedQualityIssues]);
};

// Get issue counts by severity - memoized to prevent infinite loops
export const useIssueCounts = () => {
  const enhancedQualityIssues = useCaseDetailStore(
    (state) => state.enhancedQualityIssues
  );

  return useMemo(() => {
    const issues = enhancedQualityIssues.filter(
      (issue) => issue.status !== "resolved"
    );
    return {
      errors: issues.filter((i) => i.severity === "error").length,
      warnings: issues.filter((i) => i.severity === "warning").length,
      info: issues.filter((i) => i.severity === "info").length,
      total: issues.length,
    };
  }, [enhancedQualityIssues]);
};

// Selector to detect if there are new ready files since the last analysis
// Only triggers when NEW files are confirmed (ready), not when files become pending
export const useHasNewFilesAfterAnalysis = () =>
  useCaseDetailStore((state) => {
    // Only check if analysis has been completed
    if (!state.lastAnalysisAt) return false;

    // Get all file IDs from reviewed groups (excluding unclassified and removed)
    const currentReviewedFileIds = state.documentGroups
      .filter((g) => g.id !== "unclassified" && g.status === "reviewed")
      .flatMap((g) => getContainerFiles(state.allFiles, g).map((f) => f.id));

    const analyzedFileIds = state.analyzedFileIds;

    // Only check for NEW ready files - files that are reviewed but weren't analyzed
    // Don't trigger for removals (e.g., when a group goes from reviewed to pending)
    const hasNewReadyFiles = currentReviewedFileIds.some(
      (id) => !analyzedFileIds.includes(id)
    );

    return hasNewReadyFiles;
  });

// Returns the count of new ready document groups that have unanalyzed files
export const useNewFilesCount = () =>
  useCaseDetailStore((state) => {
    if (!state.lastAnalysisAt) return 0;

    const analyzedFileIds = state.analyzedFileIds;

    // Count document groups that have at least one new unanalyzed file
    const groupsWithNewFiles = state.documentGroups.filter((g) => {
      if (g.id === "unclassified" || g.status !== "reviewed") return false;

      // Check if this group has any files that weren't analyzed
      const activeFiles = getContainerFiles(state.allFiles, g);
      return activeFiles.some((f) => !analyzedFileIds.includes(f.id));
    });

    return groupsWithNewFiles.length;
  });

// ============================================================================
// One-to-Many Model Selectors
// ============================================================================

// Get all files from the central store
export const useAllFiles = () =>
  useCaseDetailStore((state) => state.allFiles);

// Get unclassified files (files with no container associations)
export const useUnclassifiedFiles = () => {
  const allFiles = useCaseDetailStore((state) => state.allFiles);
  return useMemo(
    () =>
      Object.values(allFiles).filter(
        (f) => !f.isRemoved && f.containerIds.length === 0
      ),
    [allFiles]
  );
};

// Get files for a specific container/group
export const useContainerFiles = (containerId: string) => {
  const groups = useCaseDetailStore((state) => state.documentGroups);
  const allFiles = useCaseDetailStore((state) => state.allFiles);
  return useMemo(() => {
    const group = groups.find((g) => g.id === containerId);
    if (!group) return [];
    return group.fileIds
      .map((id) => allFiles[id])
      .filter((f): f is DocumentFile => f !== undefined && !f.isRemoved);
  }, [groups, allFiles, containerId]);
};

// Get the number of containers a file is in (for showing linked badge)
export const useFileContainerCount = (fileId: string) =>
  useCaseDetailStore((state) => {
    const file = state.allFiles[fileId];
    return file?.containerIds.length ?? 0;
  });

// Check if a file is in multiple containers (shared/reused)
export const useIsFileShared = (fileId: string) =>
  useCaseDetailStore((state) => {
    const file = state.allFiles[fileId];
    return (file?.containerIds.length ?? 0) > 1;
  });
