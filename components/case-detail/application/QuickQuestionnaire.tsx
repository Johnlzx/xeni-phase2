"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Sparkles,
  FileText,
  User,
  Briefcase,
  Calendar,
  MapPin,
  GraduationCap,
  Building2,
  Plane,
  Heart,
  Clock,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Loader2,
  X,
  FolderOpen,
  Upload,
  Files,
} from "lucide-react";
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
  onComplete: (answers: Record<string, any>) => void;
  onClose: () => void;
  onNavigateToDocuments?: () => void;
  analyzedDocuments?: AnalyzedDocument[];
}

// Questions configuration based on visa type - Written for lawyers about their clients
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

  // Add visa-specific questions - all written from lawyer's perspective
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

// Progress indicator component
const ProgressIndicator = ({
  current,
  total,
}: {
  current: number;
  total: number;
}) => {
  const progress = ((current + 1) / total) * 100;

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 h-1.5 bg-stone-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[#0E4268] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
      <span className="text-sm font-medium text-stone-500 tabular-nums">
        {current + 1}/{total}
      </span>
    </div>
  );
};

// Option button component
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
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={`
        w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-200
        ${
          isSelected
            ? "border-[#0E4268] bg-[#0E4268]/5 shadow-md"
            : "border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm"
        }
      `}
    >
      {Icon && (
        <div
          className={`
          w-10 h-10 rounded-lg flex items-center justify-center
          ${isSelected ? "bg-[#0E4268] text-white" : "bg-stone-100 text-stone-500"}
        `}
        >
          <Icon size={20} />
        </div>
      )}
      <div className="flex-1">
        <p
          className={`font-medium ${isSelected ? "text-[#0E4268]" : "text-stone-800"}`}
        >
          {option.label}
        </p>
        {option.description && (
          <p className="text-sm text-stone-500 mt-0.5">{option.description}</p>
        )}
      </div>
      <div
        className={`
        w-5 h-5 rounded-full border-2 flex items-center justify-center
        ${isSelected ? "border-[#0E4268] bg-[#0E4268]" : "border-stone-300"}
      `}
      >
        {isSelected && <Check size={12} className="text-white" />}
      </div>
    </motion.button>
  );
};

// Extracted value hint component
const ExtractedHint = ({
  value,
  source,
}: {
  value: string;
  source: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg mb-4"
    >
      <FileText size={14} className="text-emerald-600" />
      <span className="text-sm text-emerald-700">
        <span className="font-medium">Extracted from {source}:</span> {value}
      </span>
      <CheckCircle2 size={14} className="text-emerald-500 ml-auto" />
    </motion.div>
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
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 rounded-full border-4 border-[#0E4268]/20 border-t-[#0E4268] mb-6"
      />
      <AnimatePresence mode="wait">
        <motion.p
          key={currentItem}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-lg font-medium text-stone-700"
        >
          {items[currentItem]}
        </motion.p>
      </AnimatePresence>
      <p className="text-sm text-stone-400 mt-2">This won't take long</p>
    </div>
  );
};

// Mock analyzed documents - in real app would come from props or store
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
}: QuickQuestionnaireProps) {
  const questions = getQuestionsForVisa(visaType);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const canProceed = answers[currentQuestion.id] !== undefined;

  const handleAnswer = (value: any) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setIsGenerating(true);
      // Simulate checklist generation
      setTimeout(() => {
        onComplete(answers);
      }, 4000);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  if (isGenerating) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-[#0E4268] flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-stone-800 text-balance">
                Case Assessment
              </h2>
              <p className="text-xs text-stone-500">
                Quick questions about your client's situation
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
        <div className="px-6 py-3 bg-stone-50 border-b border-stone-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Files size={14} className="text-stone-500" />
                <span className="text-xs font-medium text-stone-600">
                  {analyzedDocuments.length} documents analyzed
                </span>
              </div>
              <div className="flex items-center gap-1">
                {analyzedDocuments.slice(0, 3).map((doc) => (
                  <span
                    key={doc.id}
                    className="px-2 py-0.5 bg-white border border-stone-200 rounded text-[10px] text-stone-600 truncate max-w-[100px]"
                    title={doc.name}
                  >
                    {doc.type}
                  </span>
                ))}
                {analyzedDocuments.length > 3 && (
                  <span className="px-2 py-0.5 bg-stone-100 rounded text-[10px] text-stone-500">
                    +{analyzedDocuments.length - 3}
                  </span>
                )}
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

        {/* Progress */}
        <div className="px-6 py-3 border-b border-stone-100">
          <ProgressIndicator current={currentIndex} total={questions.length} />
        </div>

        {/* Question content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Extracted value hint */}
              {currentQuestion.extractedValue && (
                <ExtractedHint
                  value={currentQuestion.extractedValue}
                  source={currentQuestion.extractedFrom || "documents"}
                />
              )}

              {/* Question */}
              <h3 className="text-xl font-semibold text-stone-900 mb-2">
                {currentQuestion.question}
              </h3>
              {currentQuestion.description && (
                <p className="text-sm text-stone-500 mb-6">
                  {currentQuestion.description}
                </p>
              )}

              {/* Options */}
              {currentQuestion.type === "single" && currentQuestion.options && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option) => (
                    <OptionButton
                      key={option.id}
                      option={option}
                      isSelected={answers[currentQuestion.id] === option.id}
                      onClick={() => handleAnswer(option.id)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentIndex === 0}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
              ${
                currentIndex === 0
                  ? "text-stone-300 cursor-not-allowed"
                  : "text-stone-600 hover:bg-stone-200"
              }
            `}
          >
            <ChevronLeft size={18} />
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed}
            className={`
              flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all
              ${
                canProceed
                  ? "bg-[#0E4268] text-white hover:bg-[#0a3555] shadow-lg shadow-[#0E4268]/20"
                  : "bg-stone-200 text-stone-400 cursor-not-allowed"
              }
            `}
          >
            {isLastQuestion ? (
              <>
                Generate Checklist
                <Sparkles size={16} />
              </>
            ) : (
              <>
                Continue
                <ChevronRight size={18} />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
