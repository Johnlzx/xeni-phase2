"use client";

import { Upload, HelpCircle, ListChecks, CheckSquare } from "lucide-react";
import { useCaseDetailStore } from "@/store/case-detail-store";
import { QuestionnaireMode } from "./QuestionnaireMode";
import { MultiStepMode } from "./MultiStepMode";
import { cn } from "@/lib/utils";

// Stage indicator component
function StageIndicator() {
  const stage = useCaseDetailStore((state) => state.checklist.stage);

  const stages = [
    { id: "empty", label: "Upload", icon: Upload },
    { id: "questionnaire", label: "Questions", icon: HelpCircle },
    { id: "partial", label: "Review", icon: ListChecks },
    { id: "detailed", label: "Complete", icon: CheckSquare },
  ];

  const currentIndex = stages.findIndex((s) => s.id === stage);

  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {stages.map((s, index) => {
        const Icon = s.icon;
        const isActive = s.id === stage;
        const isPast = index < currentIndex;

        return (
          <div key={s.id} className="flex items-center">
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all",
                isActive
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : isPast
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-400",
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {index < stages.length - 1 && (
              <div
                className={cn(
                  "w-8 h-0.5 mx-1",
                  index < currentIndex ? "bg-green-300" : "bg-gray-200",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Empty state component
function EmptyState() {
  const setActiveNav = useCaseDetailStore((state) => state.setActiveNav);

  return (
    <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-8">
      <div className="flex flex-col items-center text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Upload className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Upload Documents to Begin
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Start by uploading your documents. Your personalized checklist will be
          generated based on the documents you provide.
        </p>
        <button
          onClick={() => setActiveNav("documents")}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to File Hub
        </button>
      </div>
    </div>
  );
}

// Partial mode - mixed questionnaire and checklist
function PartialMode() {
  const checklist = useCaseDetailStore((state) => state.checklist);
  const unansweredQuestions = checklist.questions.filter(
    (q) => q.answer === undefined,
  );

  return (
    <div className="space-y-6">
      {/* Show remaining questions if any */}
      {unansweredQuestions.length > 0 && (
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
          <h4 className="text-sm font-medium text-amber-800 mb-2">
            {unansweredQuestions.length} questions remaining
          </h4>
          <p className="text-sm text-amber-600">
            Complete the remaining questions to unlock more checklist items.
          </p>
        </div>
      )}

      {/* Show the multi-step checklist */}
      <MultiStepMode />
    </div>
  );
}

export function DynamicChecklist() {
  const stage = useCaseDetailStore((state) => state.checklist.stage);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Stage Indicator */}
      <StageIndicator />

      {/* Content based on stage */}
      {stage === "empty" && <EmptyState />}
      {stage === "questionnaire" && <QuestionnaireMode />}
      {stage === "partial" && <PartialMode />}
      {stage === "detailed" && <MultiStepMode />}
    </div>
  );
}
