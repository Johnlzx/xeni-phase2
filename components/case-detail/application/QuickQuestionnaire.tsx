"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import {
  Check,
  Sparkles,
  FileText,
  User,
  Briefcase,
  MapPin,
  GraduationCap,
  Building2,
  Plane,
  Heart,
  AlertCircle,
  CheckCircle2,
  X,
  FolderOpen,
  Files,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VisaType } from "@/types";

// Question types
type QuestionType = "single" | "multi" | "text" | "date" | "confirm";

interface Question {
  id: string;
  question: string;
  description?: string;
  type: QuestionType;
  options?: {
    id: string;
    label: string;
    description?: string;
    icon?: React.ElementType;
  }[];
  extractedValue?: string;
  extractedFrom?: string;
  required?: boolean;
  dependsOn?: { questionId: string; value: string };
}

// Analyzed document type
interface AnalyzedDocument {
  id: string;
  name: string;
  type: string;
  pages?: number;
}

interface QuickQuestionnaireProps {
  visaType: VisaType;
  onComplete: (answers: Record<string, unknown>) => void;
  onClose: () => void;
  onNavigateToDocuments?: () => void;
  analyzedDocuments?: AnalyzedDocument[];
  isInline?: boolean;
  hideHeader?: boolean;
}

// Questions configuration based on visa type
const getQuestionsForVisa = (visaType: VisaType): Question[] => {
  const baseQuestions: Question[] = [
    {
      id: "applicant_location",
      question: "Where is your client currently located?",
      description: "This determines the application route and timeline",
      type: "single",
      options: [
        { id: "uk", label: "Currently in the UK", icon: MapPin },
        { id: "outside", label: "Outside the UK", icon: Plane },
      ],
      required: true,
    },
    {
      id: "previous_uk_visa",
      question: "Has your client held a UK visa before?",
      description: "Previous visa history affects documentation requirements",
      type: "single",
      options: [
        { id: "yes", label: "Yes, previous UK visa holder", icon: Check },
        { id: "no", label: "No, first-time applicant", icon: AlertCircle },
      ],
      required: true,
    },
    {
      id: "passport_valid",
      question:
        "Is the client's passport valid for the intended stay duration?",
      type: "single",
      extractedValue: "Valid until 14 June 2031",
      extractedFrom: "Passport",
      options: [
        { id: "yes", label: "Yes, sufficient validity" },
        { id: "no", label: "No, renewal required before application" },
        { id: "unsure", label: "Need to verify expiry date" },
      ],
      required: true,
    },
  ];

  const visaSpecificQuestions: Record<VisaType, Question[]> = {
    "skilled-worker": [
      {
        id: "cos_received",
        question: "Has the sponsor issued a Certificate of Sponsorship (CoS)?",
        description:
          "The employer must assign a valid CoS before the application can proceed",
        type: "single",
        options: [
          { id: "yes", label: "Yes, CoS has been assigned" },
          { id: "pending", label: "Pending - awaiting sponsor action" },
          { id: "no", label: "Not yet requested from sponsor" },
        ],
        required: true,
      },
      {
        id: "job_start_date",
        question: "What is the intended employment start date?",
        description:
          "Applications can be submitted up to 3 months before the start date",
        type: "single",
        options: [
          { id: "within_month", label: "Within 1 month" },
          { id: "1_3_months", label: "1-3 months from now" },
          { id: "3_plus_months", label: "More than 3 months away" },
        ],
        required: true,
      },
      {
        id: "salary_threshold",
        question:
          "Does the offered salary meet the minimum threshold requirements?",
        description:
          "General threshold is £38,700/year, or the going rate for the occupation",
        type: "single",
        options: [
          { id: "yes", label: "Yes, meets or exceeds threshold" },
          {
            id: "tradeable",
            label: "Below threshold, but client qualifies for tradeable points",
          },
          { id: "unsure", label: "Need to verify against SOC code rates" },
        ],
        required: true,
      },
    ],
    "global-talent": [
      {
        id: "endorsement",
        question: "Has your client received their endorsement?",
        description:
          "Stage 1 endorsement from the relevant endorsing body is required",
        type: "single",
        options: [
          { id: "yes", label: "Yes, endorsement granted" },
          { id: "pending", label: "Stage 1 application pending" },
          { id: "no", label: "Endorsement not yet applied for" },
        ],
        required: true,
      },
      {
        id: "talent_field",
        question: "Which endorsing body route applies to your client?",
        type: "single",
        options: [
          {
            id: "tech",
            label: "Tech Nation - Digital Technology",
            icon: Building2,
          },
          {
            id: "arts",
            label: "Arts Council England - Arts & Culture",
            icon: Heart,
          },
          {
            id: "academia",
            label: "UKRI / British Academy - Academia & Research",
            icon: GraduationCap,
          },
        ],
        required: true,
      },
    ],
    student: [
      {
        id: "cas_received",
        question: "Has the education provider issued a CAS?",
        description:
          "Confirmation of Acceptance for Studies must be assigned before applying",
        type: "single",
        options: [
          { id: "yes", label: "Yes, CAS has been issued" },
          { id: "pending", label: "Awaiting CAS from institution" },
          { id: "no", label: "Offer accepted, CAS not yet requested" },
        ],
        required: true,
      },
      {
        id: "course_level",
        question: "What level is the course of study?",
        description: "Course level affects maintenance funds and work rights",
        type: "single",
        options: [
          { id: "undergraduate", label: "Undergraduate (RQF 6)" },
          { id: "postgraduate", label: "Postgraduate (RQF 7)" },
          { id: "phd", label: "Doctoral (RQF 8)" },
          { id: "other", label: "Other / Pre-sessional" },
        ],
        required: true,
      },
      {
        id: "course_start",
        question: "When does the course commence?",
        description:
          "Student visa applications can be submitted up to 6 months before course start",
        type: "single",
        options: [
          { id: "within_month", label: "Within 1 month" },
          { id: "1_3_months", label: "1-3 months from now" },
          { id: "3_plus_months", label: "More than 3 months away" },
        ],
        required: true,
      },
    ],
    family: [
      {
        id: "sponsor_status",
        question: "What is the sponsor's immigration status in the UK?",
        description:
          "The UK-based family member who will sponsor the application",
        type: "single",
        options: [
          { id: "british", label: "British Citizen" },
          { id: "settled", label: "Indefinite Leave to Remain (ILR)" },
          { id: "refugee", label: "Refugee or Humanitarian Protection" },
          { id: "other", label: "Other visa category" },
        ],
        required: true,
      },
      {
        id: "relationship",
        question:
          "What is the relationship between your client and the sponsor?",
        description: "This determines which family route applies",
        type: "single",
        options: [
          { id: "spouse", label: "Spouse or Civil Partner", icon: Heart },
          {
            id: "unmarried",
            label: "Unmarried Partner (2+ years cohabitation)",
            icon: Heart,
          },
          { id: "child", label: "Child under 18", icon: User },
          {
            id: "adult_dependent",
            label: "Adult Dependent Relative",
            icon: User,
          },
        ],
        required: true,
      },
    ],
    visitor: [
      {
        id: "visit_purpose",
        question: "What is the primary purpose of your client's visit?",
        description:
          "Standard Visitor visa covers most purposes; some require specific routes",
        type: "single",
        options: [
          { id: "tourism", label: "Tourism / Leisure", icon: Plane },
          { id: "family", label: "Visiting Family or Friends", icon: Heart },
          {
            id: "business",
            label: "Business (meetings, conferences, training)",
            icon: Briefcase,
          },
          { id: "medical", label: "Private Medical Treatment" },
          { id: "study", label: "Short-term Study (up to 6 months)" },
        ],
        required: true,
      },
      {
        id: "stay_duration",
        question: "What is the intended duration of stay?",
        description: "Standard visitor visa allows stays of up to 6 months",
        type: "single",
        options: [
          { id: "under_1_month", label: "Less than 1 month" },
          { id: "1_3_months", label: "1-3 months" },
          { id: "3_6_months", label: "3-6 months" },
        ],
        required: true,
      },
    ],
    innovator: [
      {
        id: "endorsement_body",
        question: "Has your client secured endorsement from an approved body?",
        description:
          "Innovator Founder visa requires endorsement for a genuine, innovative business",
        type: "single",
        options: [
          { id: "yes", label: "Yes, endorsement confirmed" },
          { id: "pending", label: "Endorsement application in progress" },
          { id: "no", label: "Not yet approached endorsing bodies" },
        ],
        required: true,
      },
      {
        id: "investment_ready",
        question:
          "Does your client have access to the required investment funds?",
        description: "Minimum £50,000 investment funds must be evidenced",
        type: "single",
        options: [
          { id: "yes", label: "Yes, £50,000+ available and documented" },
          { id: "partial", label: "Partial funds secured" },
          { id: "no", label: "Funding not yet arranged" },
        ],
        required: true,
      },
    ],
  };

  return [...baseQuestions, ...(visaSpecificQuestions[visaType] || [])];
};

// Option button component (compact for scrollable form)
const OptionButton = ({
  option,
  isSelected,
  onClick,
}: {
  option: {
    id: string;
    label: string;
    description?: string;
    icon?: React.ElementType;
  };
  isSelected: boolean;
  onClick: () => void;
}) => {
  const Icon = option.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-colors",
        isSelected
          ? "border-[#0E4268] bg-[#0E4268]/5"
          : "border-stone-200 bg-white hover:border-stone-300",
      )}
    >
      {Icon && (
        <div
          className={cn(
            "size-8 rounded-lg flex items-center justify-center shrink-0",
            isSelected
              ? "bg-[#0E4268] text-white"
              : "bg-stone-100 text-stone-500",
          )}
        >
          <Icon size={16} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-medium text-balance",
            isSelected ? "text-[#0E4268]" : "text-stone-800",
          )}
        >
          {option.label}
        </p>
        {option.description && (
          <p className="text-xs text-stone-500 mt-0.5 text-pretty">
            {option.description}
          </p>
        )}
      </div>
      <div
        className={cn(
          "size-4 rounded-full border-2 flex items-center justify-center shrink-0",
          isSelected ? "border-[#0E4268] bg-[#0E4268]" : "border-stone-300",
        )}
      >
        {isSelected && <Check size={10} className="text-white" />}
      </div>
    </button>
  );
};

// Extracted value hint component (compact)
const ExtractedHint = ({
  value,
  source,
}: {
  value: string;
  source: string;
}) => {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg mb-3">
      <FileText size={12} className="text-emerald-600 shrink-0" />
      <span className="text-xs text-emerald-700 text-pretty">
        <span className="font-medium">From {source}:</span> {value}
      </span>
      <CheckCircle2 size={12} className="text-emerald-500 ml-auto shrink-0" />
    </div>
  );
};

// Single question section component
const QuestionSection = ({
  question,
  index,
  answer,
  onAnswer,
}: {
  question: Question;
  index: number;
  answer: unknown;
  onAnswer: (value: unknown) => void;
}) => {
  return (
    <div className="py-6 border-b border-stone-100 last:border-b-0">
      {/* Extracted value hint */}
      {question.extractedValue && (
        <ExtractedHint
          value={question.extractedValue}
          source={question.extractedFrom || "documents"}
        />
      )}

      {/* Question header */}
      <div className="flex items-start gap-3 mb-4">
        <span className="flex items-center justify-center size-6 rounded-full bg-stone-100 text-stone-600 text-xs font-medium shrink-0 tabular-nums">
          {index + 1}
        </span>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-stone-900 text-balance">
            {question.question}
          </h3>
          {question.description && (
            <p className="text-sm text-stone-500 mt-1 text-pretty">
              {question.description}
            </p>
          )}
        </div>
      </div>

      {/* Options */}
      {question.type === "single" && question.options && (
        <div className="space-y-2 pl-9">
          {question.options.map((option) => (
            <OptionButton
              key={option.id}
              option={option}
              isSelected={answer === option.id}
              onClick={() => onAnswer(option.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Generating checklist animation
const GeneratingChecklist = () => {
  const items = [
    "Analyzing case details...",
    "Checking Immigration Rules requirements...",
    "Cross-referencing uploaded documents...",
    "Building your case checklist...",
  ];
  const [currentItem, setCurrentItem] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentItem((prev) => (prev + 1) % items.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="size-16 rounded-full border-4 border-[#0E4268]/20 border-t-[#0E4268] animate-spin mb-6" />
      <p className="text-lg font-medium text-stone-700 text-balance">
        {items[currentItem]}
      </p>
      <p className="text-sm text-stone-400 mt-2 text-pretty">
        This won't take long
      </p>
    </div>
  );
};

// Mock analyzed documents
const MOCK_ANALYZED_DOCUMENTS: AnalyzedDocument[] = [
  { id: "doc-1", name: "Passport_Main.pdf", type: "Passport", pages: 2 },
  {
    id: "doc-2",
    name: "BankStatement_Q3.pdf",
    type: "Bank Statement",
    pages: 5,
  },
  { id: "doc-3", name: "Employment_Letter.pdf", type: "Employment", pages: 1 },
];

export function QuickQuestionnaire({
  visaType,
  onComplete,
  onClose,
  onNavigateToDocuments,
  analyzedDocuments = MOCK_ANALYZED_DOCUMENTS,
  isInline = false,
  hideHeader = false,
}: QuickQuestionnaireProps) {
  const questions = getQuestionsForVisa(visaType);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Count answered questions
  const answeredCount = Object.keys(answers).length;
  const totalCount = questions.length;
  const allAnswered = answeredCount === totalCount;

  const handleAnswer = (questionId: string, value: unknown) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    if (allAnswered) {
      setIsGenerating(true);
      setTimeout(() => {
        onComplete(answers);
      }, 4000);
    }
  };

  // Generating state
  if (isGenerating) {
    if (isInline) {
      return (
        <div className="flex-1 flex items-center justify-center bg-stone-50">
          <GeneratingChecklist />
        </div>
      );
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8"
        >
          <GeneratingChecklist />
        </motion.div>
      </div>
    );
  }

  // Inline mode - scrollable form
  if (isInline) {
    return (
      <div className="flex-1 flex flex-col bg-stone-50">
        {/* Scrollable content */}
        <div ref={scrollRef} className="flex-1 overflow-auto">
          <div className="max-w-2xl mx-auto px-6 py-8">
            {/* Form header */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-stone-900 text-balance">
                Case Assessment
              </h2>
              <p className="text-sm text-stone-500 mt-1 text-pretty">
                Answer these questions to generate your application checklist
              </p>
            </div>

            {/* Progress summary */}
            <div className="flex items-center gap-3 mb-6 p-3 bg-white rounded-lg border border-stone-200">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-sm font-medium text-stone-700">
                    Progress
                  </span>
                  <span className="text-xs text-stone-500 tabular-nums">
                    {answeredCount} of {totalCount} answered
                  </span>
                </div>
                <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0E4268] rounded-full transition-all duration-200"
                    style={{
                      width: `${(answeredCount / totalCount) * 100}%`,
                    }}
                  />
                </div>
              </div>
              {allAnswered && (
                <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
              )}
            </div>

            {/* Questions */}
            <div className="bg-white rounded-xl border border-stone-200">
              <div className="px-5">
                {questions.map((question, index) => (
                  <QuestionSection
                    key={question.id}
                    question={question}
                    index={index}
                    answer={answers[question.id]}
                    onAnswer={(value) => handleAnswer(question.id, value)}
                  />
                ))}
              </div>
            </div>

            {/* Submit button */}
            <div className="mt-6 pb-4">
              <button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className={cn(
                  "w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors",
                  allAnswered
                    ? "bg-[#0E4268] text-white hover:bg-[#0a3555]"
                    : "bg-stone-200 text-stone-400 cursor-not-allowed",
                )}
              >
                <Sparkles size={18} />
                Generate Checklist
              </button>
              {!allAnswered && (
                <p className="text-xs text-stone-500 text-center mt-2">
                  Answer all questions to continue
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Modal mode (legacy - keep for backward compatibility)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-[#0E4268] flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-stone-800 text-balance">
                Case Assessment
              </h2>
              <p className="text-xs text-stone-500">
                {answeredCount} of {totalCount} answered
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
            aria-label="Close questionnaire"
          >
            <X size={20} />
          </button>
        </div>

        {/* Document Analysis Info */}
        {!hideHeader && (
          <div className="px-6 py-3 bg-stone-50 border-b border-stone-100 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Files size={14} className="text-stone-500" />
                  <span className="text-xs font-medium text-stone-600">
                    {analyzedDocuments.length} documents analyzed
                  </span>
                </div>
              </div>
              {onNavigateToDocuments && (
                <button
                  onClick={onNavigateToDocuments}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#0E4268] hover:bg-[#0E4268]/5 rounded-lg transition-colors"
                >
                  <FolderOpen size={14} />
                  Review / Upload
                </button>
              )}
            </div>
          </div>
        )}

        {/* Scrollable questions */}
        <div className="flex-1 overflow-auto">
          <div className="px-5">
            {questions.map((question, index) => (
              <QuestionSection
                key={question.id}
                question={question}
                index={index}
                answer={answers[question.id]}
                onAnswer={(value) => handleAnswer(question.id, value)}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 shrink-0">
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={cn(
              "w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors",
              allAnswered
                ? "bg-[#0E4268] text-white hover:bg-[#0a3555]"
                : "bg-stone-200 text-stone-400 cursor-not-allowed",
            )}
          >
            <Sparkles size={18} />
            Generate Checklist
          </button>
        </div>
      </motion.div>
    </div>
  );
}
