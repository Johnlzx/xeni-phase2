"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import {
  Check,
  Sparkles,
  FileText,
  MapPin,
  Plane,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  User,
  Briefcase,
  Wallet,
  GraduationCap,
  Users,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VisaType } from "@/types";
import { useCaseDetailStore } from "@/store/case-detail-store";
import { LockedChecklistPreview } from "./LockedChecklistPreview";

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
}

interface CaseAssessmentViewProps {
  visaType: VisaType;
  onComplete?: () => void;
}

// Checklist sections that will be generated after assessment
const CHECKLIST_SECTIONS = [
  { id: "personal", title: "Personal Information", icon: User },
  { id: "employment", title: "Employment Details", icon: Briefcase },
  { id: "financial", title: "Financial Evidence", icon: Wallet },
  { id: "travel", title: "Travel History", icon: History },
  { id: "education", title: "Education", icon: GraduationCap },
  { id: "family", title: "Family Information", icon: Users },
];

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
      question: "Is the client's passport valid for the intended stay duration?",
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

  const visaSpecificQuestions: Record<string, Question[]> = {
    "skilled-worker": [
      {
        id: "cos_received",
        question: "Has the sponsor issued a Certificate of Sponsorship (CoS)?",
        description: "The employer must assign a valid CoS before the application can proceed",
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
        description: "Applications can be submitted up to 3 months before the start date",
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
        question: "Does the offered salary meet the minimum threshold requirements?",
        description: "General threshold is £38,700/year, or the going rate for the occupation",
        type: "single",
        options: [
          { id: "yes", label: "Yes, meets or exceeds threshold" },
          { id: "tradeable", label: "Below threshold, but client qualifies for tradeable points" },
          { id: "unsure", label: "Need to verify against SOC code rates" },
        ],
        required: true,
      },
    ],
  };

  return [...baseQuestions, ...(visaSpecificQuestions[visaType] || [])];
};

// Option button component
const OptionButton = ({
  option,
  isSelected,
  onClick,
}: {
  option: { id: string; label: string; description?: string; icon?: React.ElementType };
  isSelected: boolean;
  onClick: () => void;
}) => {
  const Icon = option.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-colors",
        isSelected
          ? "border-[#0E4268] bg-[#0E4268]/5"
          : "border-stone-200 bg-white hover:border-stone-300"
      )}
    >
      {Icon && (
        <div
          className={cn(
            "size-8 rounded-lg flex items-center justify-center shrink-0",
            isSelected ? "bg-[#0E4268] text-white" : "bg-stone-100 text-stone-500"
          )}
        >
          <Icon size={16} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm font-medium text-balance",
          isSelected ? "text-[#0E4268]" : "text-stone-800"
        )}>
          {option.label}
        </p>
      </div>
      <div
        className={cn(
          "size-4 rounded-full border-2 flex items-center justify-center shrink-0",
          isSelected ? "border-[#0E4268] bg-[#0E4268]" : "border-stone-300"
        )}
      >
        {isSelected && <Check size={10} className="text-white" />}
      </div>
    </button>
  );
};

// Extracted value hint component
const ExtractedHint = ({ value, source }: { value: string; source: string }) => {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-100 rounded-lg mb-3">
      <FileText size={12} className="text-emerald-600 shrink-0" />
      <span className="text-xs text-emerald-700 text-pretty">
        <span className="font-medium">From {source}:</span> {value}
      </span>
      <CheckCircle2 size={12} className="text-emerald-500 ml-auto shrink-0" />
    </div>
  );
};

// Question card component
const QuestionCard = ({
  question,
  index,
  answer,
  onAnswer,
  isActive,
}: {
  question: Question;
  index: number;
  answer: string | null | undefined;
  onAnswer: (value: string) => void;
  isActive: boolean;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: isActive || answer ? 1 : 0.5 }}
      className={cn(
        "p-4 rounded-xl border transition-all",
        isActive
          ? "border-[#0E4268]/20 bg-white shadow-sm"
          : answer
            ? "border-stone-200 bg-white"
            : "border-stone-100 bg-stone-50/50"
      )}
    >
      {/* Extracted value hint */}
      {question.extractedValue && isActive && (
        <ExtractedHint
          value={question.extractedValue}
          source={question.extractedFrom || "documents"}
        />
      )}

      {/* Question header */}
      <div className="flex items-start gap-3 mb-3">
        <span
          className={cn(
            "flex items-center justify-center size-6 rounded-full text-xs font-medium shrink-0 tabular-nums transition-colors",
            answer
              ? "bg-emerald-100 text-emerald-700"
              : isActive
                ? "bg-[#0E4268] text-white"
                : "bg-stone-200 text-stone-400"
          )}
        >
          {answer ? <Check size={12} /> : index + 1}
        </span>
        <div className="flex-1">
          <h3 className={cn(
            "text-sm font-semibold text-balance transition-colors",
            isActive || answer ? "text-stone-900" : "text-stone-500"
          )}>
            {question.question}
          </h3>
          {question.description && isActive && (
            <p className="text-xs text-stone-500 mt-1 text-pretty">
              {question.description}
            </p>
          )}
        </div>
      </div>

      {/* Options - only show if active or answered */}
      {(isActive || answer) && question.type === "single" && question.options && (
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
    </motion.div>
  );
};

// Sidebar item for Case Assessment (spotlight effect)
const AssessmentSidebarItem = ({
  progress,
  isActive,
}: {
  progress: number;
  isActive: boolean;
}) => {
  return (
    <motion.div
      animate={{
        boxShadow: isActive ? "0 0 0 2px rgba(14, 66, 104, 0.15)" : "none",
      }}
      className={cn(
        "relative mx-2 mb-1 rounded-lg overflow-hidden transition-colors",
        isActive ? "bg-[#0E4268]/5" : "bg-transparent"
      )}
    >
      {/* Spotlight glow effect */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-[#0E4268]/5 rounded-lg"
        />
      )}

      <div className={cn(
        "relative flex items-center gap-3 px-3 py-2.5",
      )}>
        {/* Icon with pulse animation when active */}
        <motion.div
          animate={isActive ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          className={cn(
            "size-7 rounded-lg flex items-center justify-center shrink-0",
            isActive ? "bg-[#0E4268] text-white" : "bg-stone-100 text-stone-400"
          )}
        >
          <ClipboardCheck size={14} />
        </motion.div>

        <div className="flex-1 min-w-0">
          <p className={cn(
            "text-sm font-medium truncate",
            isActive ? "text-[#0E4268]" : "text-stone-600"
          )}>
            Case Assessment
          </p>
          {/* Progress bar */}
          <div className="mt-1 h-1 bg-stone-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-[#0E4268] rounded-full"
            />
          </div>
        </div>

        {/* Progress percentage */}
        <span className={cn(
          "text-xs font-medium tabular-nums shrink-0",
          isActive ? "text-[#0E4268]" : "text-stone-400"
        )}>
          {Math.round(progress)}%
        </span>
      </div>
    </motion.div>
  );
};

// Locked section item in sidebar
const LockedSectionItem = ({
  section,
}: {
  section: { id: string; title: string; icon: React.ElementType };
}) => {
  const Icon = section.icon;

  return (
    <div className="flex items-center gap-3 px-3 py-2 mx-2 opacity-40">
      <div className="size-7 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
        <Icon size={14} className="text-stone-400" />
      </div>
      <span className="text-sm text-stone-400 truncate">{section.title}</span>
    </div>
  );
};

export function CaseAssessmentView({ visaType, onComplete }: CaseAssessmentViewProps) {
  const questions = getQuestionsForVisa(visaType);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Store actions
  const submitQuestionnaireAnswers = useCaseDetailStore(
    (state) => state.submitQuestionnaireAnswers
  );

  // Calculate progress
  const answeredCount = Object.keys(answers).length;
  const totalCount = questions.length;
  const progress = (answeredCount / totalCount) * 100;
  const allAnswered = answeredCount === totalCount;

  // Auto-advance to next unanswered question
  useEffect(() => {
    const firstUnanswered = questions.findIndex((q) => !answers[q.id]);
    if (firstUnanswered !== -1) {
      setActiveQuestionIndex(firstUnanswered);
    }
  }, [answers, questions]);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    if (allAnswered) {
      setIsUnlocking(true);

      // Convert answers to string format for store
      const stringAnswers: Record<string, string> = {};
      for (const [key, value] of Object.entries(answers)) {
        stringAnswers[key] = String(value);
      }

      // Wait for unlock animation then submit
      setTimeout(() => {
        submitQuestionnaireAnswers(stringAnswers);
        onComplete?.();
      }, 1200);
    }
  };

  return (
    <div className="h-full flex bg-white">
      {/* Left: Checklist Sidebar */}
      <div className="w-56 shrink-0 border-r border-stone-200 bg-white flex flex-col">
        {/* Sidebar header */}
        <div className="shrink-0 px-4 py-3 border-b border-stone-100">
          <h4 className="text-xs font-semibold text-stone-600 uppercase tracking-wide">
            Checklist
          </h4>
        </div>

        {/* Sidebar content */}
        <div className="flex-1 overflow-y-auto py-2">
          {/* Case Assessment - Spotlight item */}
          <AssessmentSidebarItem progress={progress} isActive={true} />

          {/* Divider */}
          <div className="mx-4 my-3 border-t border-dashed border-stone-200" />

          {/* Locked sections preview */}
          <div className="relative">
            {CHECKLIST_SECTIONS.map((section) => (
              <LockedSectionItem key={section.id} section={section} />
            ))}

            {/* Blur overlay for locked sections */}
            <LockedChecklistPreview progress={progress} isUnlocking={isUnlocking} />
          </div>
        </div>
      </div>

      {/* Right: Main Work Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-stone-50">
        {/* Content header */}
        <div className="shrink-0 px-6 py-4 bg-white border-b border-stone-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-[#0E4268]/10 flex items-center justify-center">
                <ClipboardCheck size={20} className="text-[#0E4268]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-stone-900 text-balance">
                  Case Assessment
                </h2>
                <p className="text-sm text-stone-500 text-pretty">
                  {answeredCount} of {totalCount} questions answered
                </p>
              </div>
            </div>

            {/* Circular progress */}
            <div className="size-12 relative">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke="#e7e5e4"
                  strokeWidth="3"
                />
                <motion.circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke="#0E4268"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 126" }}
                  animate={{ strokeDasharray: `${(progress / 100) * 126} 126` }}
                  transition={{ duration: 0.3 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-semibold text-stone-700 tabular-nums">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Questions */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto p-6 space-y-3">
            {questions.map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question}
                index={index}
                answer={answers[question.id]}
                onAnswer={(value) => handleAnswer(question.id, value)}
                isActive={index === activeQuestionIndex}
              />
            ))}

            {/* Submit section */}
            <div className="pt-4 pb-8">
              <button
                onClick={handleSubmit}
                disabled={!allAnswered || isUnlocking}
                className={cn(
                  "w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold transition-all",
                  allAnswered && !isUnlocking
                    ? "bg-[#0E4268] text-white hover:bg-[#0a3555]"
                    : "bg-stone-200 text-stone-400 cursor-not-allowed"
                )}
              >
                {isUnlocking ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles size={18} />
                    </motion.div>
                    Generating your checklist...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Generate Application Checklist
                    <ChevronRight size={18} />
                  </>
                )}
              </button>
              {!allAnswered && (
                <p className="text-xs text-stone-500 text-center mt-3">
                  Answer {totalCount - answeredCount} more question{totalCount - answeredCount > 1 ? "s" : ""} to generate your checklist
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
