import { create } from "zustand";
import { devtools } from "zustand/middleware";
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
} from "@/types/case-detail";
import { PassportInfo, VisaType } from "@/types";

// Initial document groups data - Rich mock data with many pages per category
const INITIAL_DOCUMENT_GROUPS: DocumentGroup[] = [
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
  caseTeam: {
    lawyer: { id: "john-001", name: "John", email: "john@example.com" },
  },
  activeNav: "overview",
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
  documentGroups: [],
  isLoadingDocuments: false,
  demoStage: 0,
  isAnalyzingDocuments: false,
  analysisProgress: 0,
  lastAnalysisAt: null,
  analyzedFileIds: [],
  // Application Phase
  applicationPhase: "idle",
  formSchema: null,
  formPilotStatus: {
    totalSessions: 0,
    lastRunAt: null,
    lastRunStatus: null,
  },
  analyzedFiles: [],
};

// Helper to sync file previews from document groups
const syncFilePreviewsFromGroups = (
  groups: DocumentGroup[],
): UploadedFilePreview[] => {
  const previews: UploadedFilePreview[] = [];
  for (const group of groups) {
    for (const file of group.files) {
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
    (set, get) => ({
      ...initialState,

      // Navigation
      setActiveNav: (nav: CaseDetailNavItem) => {
        set({ activeNav: nav }, false, "setActiveNav");
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

      // Visa Type
      setVisaType: (type: VisaType | null) => {
        set({ selectedVisaType: type }, false, "setVisaType");
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
              tag: templateName,
              mergedFileName: `${templateName}.pdf`,
              status: "pending",
              files: [],
            };
            const unclassifiedIndex = state.documentGroups.findIndex(
              (g) => g.id === "unclassified",
            );
            let newGroups: DocumentGroup[];
            if (unclassifiedIndex === -1) {
              newGroups = [newGroup, ...state.documentGroups];
            } else {
              newGroups = [...state.documentGroups];
              newGroups.splice(unclassifiedIndex, 0, newGroup);
            }
            return { documentGroups: newGroups };
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
              g.id === groupId ? { ...g, mergedFileName: newTitle } : g,
            ),
          }),
          false,
          "renameDocumentGroup",
        );
      },

      moveFileToGroup: (fileId: string, targetGroupId: string) => {
        set(
          (state) => {
            let file: DocumentFile | undefined;
            let sourceGroupId: string | undefined;

            for (const g of state.documentGroups) {
              // Find the file (excluding already removed ones for the source check)
              const found = g.files.find(
                (f) => f.id === fileId && !f.isRemoved,
              );
              if (found) {
                file = found;
                sourceGroupId = g.id;
                break;
              }
            }

            if (!file || !sourceGroupId || sourceGroupId === targetGroupId) {
              return state;
            }

            const newGroups = state.documentGroups.map((group) => {
              if (group.id === sourceGroupId) {
                return {
                  ...group,
                  // Mark file as removed instead of deleting it (for diff view)
                  files: group.files.map((f) =>
                    f.id === fileId
                      ? { ...f, isRemoved: true, isNew: false }
                      : f,
                  ),
                  status: "pending" as const,
                  hasChanges: true,
                };
              }
              if (group.id === targetGroupId) {
                return {
                  ...group,
                  status: "pending" as const,
                  hasChanges: true,
                  files: [
                    { ...file!, isNew: true, isRemoved: false },
                    ...group.files,
                  ],
                };
              }
              return group;
            });

            const previews = syncFilePreviewsFromGroups(newGroups);
            return {
              documentGroups: newGroups,
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

              const newFiles = [...group.files];
              const [removed] = newFiles.splice(fromIndex, 1);
              newFiles.splice(toIndex, 0, removed);

              return {
                ...group,
                files: newFiles,
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
            const newGroups = state.documentGroups.map((group) => {
              if (group.id !== groupId) return group;

              return {
                ...group,
                status: "pending" as const,
                hasChanges: true,
                files: group.files.map((f) =>
                  f.id === fileId ? { ...f, isRemoved: true, isNew: false } : f,
                ),
              };
            });

            const previews = syncFilePreviewsFromGroups(newGroups);
            return {
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
          (state) => ({
            documentGroups: state.documentGroups.map((group) => ({
              ...group,
              files: group.files.map((f) =>
                f.id === fileId ? { ...f, isNew: false } : f,
              ),
            })),
          }),
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
          (state) => ({
            documentGroups: state.documentGroups.map((g) =>
              g.id === groupId
                ? {
                    ...g,
                    status: "reviewed" as const,
                    hasChanges: false,
                    // Remove files marked as isRemoved, clear isNew flag for remaining
                    files: g.files
                      .filter((f) => !f.isRemoved)
                      .map((f) => ({ ...f, isNew: false })),
                  }
                : g,
            ),
          }),
          false,
          "confirmGroupReview",
        );
      },

      uploadDocuments: async () => {
        set({ isLoadingDocuments: true }, false, "uploadDocuments:start");
        // Simulate AI processing
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const previews = syncFilePreviewsFromGroups(INITIAL_DOCUMENT_GROUPS);
        set(
          {
            documentGroups: INITIAL_DOCUMENT_GROUPS,
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
            const newGroups = state.documentGroups.map((g) => {
              if (g.id === groupId) {
                const newFiles: DocumentFile[] = [];
                for (let i = 0; i < fileCount; i++) {
                  const fileId = `file_${Date.now()}_${i}`;
                  newFiles.push({
                    id: fileId,
                    name: `Uploaded_Page_${g.files.length + i + 1}.pdf`,
                    size: "0.5 MB",
                    pages: 1,
                    date: "Just now",
                    type: "pdf",
                    isNew: true,
                  });
                }
                return {
                  ...g,
                  files: [...g.files, ...newFiles],
                  status: "pending" as const,
                  hasChanges: true,
                };
              }
              return g;
            });
            const previews = syncFilePreviewsFromGroups(newGroups);
            return {
              documentGroups: newGroups,
              uploadedFilePreviews: previews,
            };
          },
          false,
          "uploadToGroup",
        );
      },

      // Demo: Review all documents and analyze to generate client profile
      reviewAllDocumentsAndAnalyze: async () => {
        const state = get();

        // Step 1: Mark all document groups as reviewed
        set(
          {
            isAnalyzingDocuments: true,
            analysisProgress: 0,
            documentGroups: state.documentGroups.map((g) => ({
              ...g,
              status: "reviewed" as const,
              hasChanges: false,
              files: g.files
                .filter((f) => !f.isRemoved)
                .map((f) => ({ ...f, isNew: false })),
            })),
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
          .flatMap((g) => g.files.filter((f) => !f.isRemoved).map((f) => f.id));

        set(
          (state) => {
            const newProfile = {
              ...state.clientProfile,
              passport: mockPassportInfo,
              contactInfo: mockContactInfo,
            };
            newProfile.completeness = calculateCompleteness(newProfile);
            return {
              clientProfile: newProfile,
              isAnalyzingDocuments: false,
              analysisProgress: 100,
              lastAnalysisAt: new Date().toISOString(),
              analyzedFileIds,
              // Mark all analyzed files
              documentGroups: state.documentGroups.map((g) => ({
                ...g,
                files: g.files.map((f) =>
                  analyzedFileIds.includes(f.id)
                    ? {
                        ...f,
                        isAnalyzed: true,
                        analyzedAt: new Date().toISOString(),
                      }
                    : f,
                ),
              })),
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
          .flatMap((g) => g.files.filter((f) => !f.isRemoved));

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
          (state) => ({
            isAnalyzingDocuments: false,
            analysisProgress: 100,
            lastAnalysisAt: new Date().toISOString(),
            analyzedFileIds,
            documentGroups: state.documentGroups.map((g) => ({
              ...g,
              files: g.files.map((f) =>
                analyzedFileIds.includes(f.id)
                  ? {
                      ...f,
                      isAnalyzed: true,
                      analyzedAt: new Date().toISOString(),
                    }
                  : f,
              ),
            })),
          }),
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
          "global-talent": {
            schemaName: "Global Talent Visa Application",
            schemaVersion: "2024.1",
            totalFields: 45,
            emptyRequiredFields: [
              "Endorsement reference",
              "Endorsing body",
              "Talent field",
              "Evidence of achievements",
              "Previous UK visas",
            ],
          },
          "student": {
            schemaName: "Student Visa Application",
            schemaVersion: "2024.1",
            totalFields: 52,
            emptyRequiredFields: [
              "CAS number",
              "Course name",
              "Institution name",
              "Course start date",
              "Course end date",
              "Tuition fees",
              "Accommodation costs",
            ],
          },
          "family": {
            schemaName: "Family Visa Application",
            schemaVersion: "2024.1",
            totalFields: 62,
            emptyRequiredFields: [
              "Sponsor relationship",
              "Sponsor immigration status",
              "Accommodation details",
              "Financial evidence",
              "English language proof",
            ],
          },
          "visitor": {
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
          "innovator": {
            schemaName: "Innovator Founder Visa Application",
            schemaVersion: "2024.1",
            totalFields: 48,
            emptyRequiredFields: [
              "Endorsement reference",
              "Business plan summary",
              "Investment funds proof",
              "Innovation evidence",
              "Scalability evidence",
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
          g.files.filter((f) => !f.isRemoved)
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
          g.files
            .filter((f) => !f.isRemoved)
            .map((f) => ({
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
              applicationPhase: "completed",
              isAnalyzingDocuments: false,
              analysisProgress: 100,
              lastAnalysisAt: new Date().toISOString(),
              analyzedFileIds,
              analyzedFiles,
              formSchema: updatedSchema,
              clientProfile: newProfile,
              documentGroups: state.documentGroups.map((g) => ({
                ...g,
                files: g.files.map((f) =>
                  analyzedFileIds.includes(f.id)
                    ? {
                        ...f,
                        isAnalyzed: true,
                        analyzedAt: new Date().toISOString(),
                      }
                    : f
                ),
              })),
            };
          },
          false,
          "analysisComplete"
        );

        get().evolveChecklist();
      },

      // Launch Form Pilot (opens external tool)
      launchFormPilot: () => {
        set(
          (state) => ({
            formPilotStatus: {
              ...state.formPilotStatus,
              totalSessions: state.formPilotStatus.totalSessions + 1,
              lastRunAt: new Date().toISOString(),
              lastRunStatus: "success",
            },
          }),
          false,
          "launchFormPilot"
        );

        // In real implementation, this would open the external Form Pilot tool
        // window.open('form-pilot://launch', '_blank');
      },

      // Reset
      reset: () => {
        set(initialState, false, "reset");
      },
    }),
    { name: "case-detail-store" },
  ),
);

// Selector hooks for optimized re-renders
export const useActiveNav = () =>
  useCaseDetailStore((state) => state.activeNav);
export const useClientProfile = () =>
  useCaseDetailStore((state) => state.clientProfile);
export const useSelectedVisaType = () =>
  useCaseDetailStore((state) => state.selectedVisaType);
export const useChecklist = () =>
  useCaseDetailStore((state) => state.checklist);
export const useChecklistStage = () =>
  useCaseDetailStore((state) => state.checklist.stage);
export const useDocumentGroups = () =>
  useCaseDetailStore((state) => state.documentGroups);
export const useIsLoadingDocuments = () =>
  useCaseDetailStore((state) => state.isLoadingDocuments);
export const useUploadedFilePreviews = () =>
  useCaseDetailStore((state) => state.uploadedFilePreviews);
export const useApplicationPhase = () =>
  useCaseDetailStore((state) => state.applicationPhase);
export const useFormSchema = () =>
  useCaseDetailStore((state) => state.formSchema);
export const useFormPilotStatus = () =>
  useCaseDetailStore((state) => state.formPilotStatus);
export const useAnalyzedFiles = () =>
  useCaseDetailStore((state) => state.analyzedFiles);
