"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  FileText,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCaseDetailStore } from "@/store/case-detail-store";
import {
  ChecklistSectionType,
  ApplicationChecklistItem,
} from "@/types/case-detail";

// Section configuration
const SECTION_CONFIG: Record<ChecklistSectionType, { title: string }> = {
  personal: { title: "Personal Information" },
  employment: { title: "Employment Details" },
  financial: { title: "Financial Evidence" },
  travel: { title: "Travel History" },
  education: { title: "Education & Qualifications" },
  family: { title: "Family Information" },
  other: { title: "Other Information" },
};

interface SectionQuestionnaireProps {
  section: ChecklistSectionType;
  items: ApplicationChecklistItem[];
  onClose: () => void;
  onComplete: () => void;
}

// Question input component
function QuestionInput({
  item,
  value,
  onChange,
  isActive,
}: {
  item: ApplicationChecklistItem;
  value: string;
  onChange: (value: string) => void;
  isActive: boolean;
}) {
  // Determine input type based on field
  const isDate = item.field.toLowerCase().includes("date");
  const isNumber =
    item.field.toLowerCase().includes("salary") ||
    item.field.toLowerCase().includes("amount");

  return (
    <div
      className={cn(
        "transition-opacity",
        isActive ? "opacity-100" : "opacity-50",
      )}
    >
      {/* Extracted hint */}
      {item.source === "extracted" && item.value && (
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg mb-3">
          <FileText size={14} className="text-blue-500 shrink-0" />
          <span className="text-xs text-blue-700 text-pretty">
            <span className="font-medium">Auto-extracted:</span> {item.value}
          </span>
          <Check size={14} className="text-blue-500 ml-auto shrink-0" />
        </div>
      )}

      {/* Input field */}
      <div className="relative">
        <input
          type={isDate ? "date" : isNumber ? "number" : "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${item.label.toLowerCase()}...`}
          autoFocus={isActive}
          className={cn(
            "w-full px-4 py-3 text-base bg-white border rounded-xl outline-none transition-all",
            "focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10",
            value ? "border-stone-300" : "border-stone-200",
          )}
        />
        {value && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Check size={18} className="text-emerald-500" />
          </div>
        )}
      </div>

      {/* Help text */}
      {item.isRequired && (
        <p className="text-xs text-stone-400 mt-2 flex items-center gap-1">
          <AlertCircle size={12} />
          This field is required for your application
        </p>
      )}
    </div>
  );
}

export function SectionQuestionnaire({
  section,
  items,
  onClose,
  onComplete,
}: SectionQuestionnaireProps) {
  const updateChecklistField = useCaseDetailStore(
    (state) => state.updateChecklistField,
  );

  // Only show items that are missing or partial
  const missingItems = items.filter(
    (item) => item.status === "missing" || item.status === "partial",
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    // Initialize with existing values
    const initial: Record<string, string> = {};
    for (const item of missingItems) {
      initial[item.id] = item.value || "";
    }
    return initial;
  });

  const currentItem = missingItems[currentIndex];
  const config = SECTION_CONFIG[section];

  const handleNext = () => {
    if (currentIndex < missingItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleComplete = () => {
    // Save all answers to store
    for (const [itemId, value] of Object.entries(answers)) {
      if (value) {
        updateChecklistField(itemId, value);
      }
    }
    onComplete();
  };

  const answeredCount = Object.values(answers).filter((v) => v).length;
  const isLastQuestion = currentIndex === missingItems.length - 1;
  const canProceed = answers[currentItem?.id] || !currentItem?.isRequired;

  if (missingItems.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-stone-900 flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-stone-800 text-balance">
                {config.title}
              </h2>
              <p className="text-xs text-stone-500">
                Question {currentIndex + 1} of {missingItems.length}
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

        {/* Progress bar */}
        <div className="h-1 bg-stone-100">
          <motion.div
            className="h-full bg-stone-900"
            initial={{ width: 0 }}
            animate={{
              width: `${((currentIndex + 1) / missingItems.length) * 100}%`,
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          />
        </div>

        {/* Question content */}
        <div className="px-6 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.15 }}
            >
              {/* Question label */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-stone-500">
                    {currentItem.label}
                  </span>
                  {currentItem.isRequired && (
                    <span className="text-[10px] text-rose-500 font-medium uppercase">
                      Required
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-stone-900 text-balance">
                  What is the {currentItem.label.toLowerCase()}?
                </h3>
              </div>

              {/* Input */}
              <QuestionInput
                item={currentItem}
                value={answers[currentItem.id] || ""}
                onChange={(value) =>
                  setAnswers((prev) => ({ ...prev, [currentItem.id]: value }))
                }
                isActive={true}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-100">
          <div className="flex items-center justify-between">
            {/* Previous button */}
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                currentIndex === 0
                  ? "text-stone-300 cursor-not-allowed"
                  : "text-stone-600 hover:bg-stone-100",
              )}
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            {/* Progress indicator */}
            <div className="flex items-center gap-1">
              {missingItems.map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "size-1.5 rounded-full transition-colors",
                    idx === currentIndex
                      ? "bg-stone-900"
                      : idx < currentIndex
                        ? "bg-stone-400"
                        : "bg-stone-200",
                  )}
                />
              ))}
            </div>

            {/* Next / Complete button */}
            {isLastQuestion ? (
              <button
                onClick={handleComplete}
                disabled={!canProceed}
                className={cn(
                  "flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors",
                  canProceed
                    ? "bg-stone-900 text-white hover:bg-stone-800"
                    : "bg-stone-200 text-stone-400 cursor-not-allowed",
                )}
              >
                Complete
                <Check size={16} />
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!canProceed}
                className={cn(
                  "flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors",
                  canProceed
                    ? "bg-stone-900 text-white hover:bg-stone-800"
                    : "bg-stone-200 text-stone-400 cursor-not-allowed",
                )}
              >
                Next
                <ChevronRight size={16} />
              </button>
            )}
          </div>

          {/* Skip hint */}
          {!currentItem.isRequired && !answers[currentItem.id] && (
            <p className="text-xs text-stone-400 text-center mt-3">
              This field is optional. You can skip it.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
