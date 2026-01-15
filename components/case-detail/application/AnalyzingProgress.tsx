"use client";

import { motion } from "motion/react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCaseDetailStore } from "@/store/case-detail-store";
import { VisaType } from "@/types";

interface AnalyzingProgressProps {
  visaType: VisaType;
}

// Analysis steps
const ANALYSIS_STEPS = [
  { id: "read", label: "Reading files", threshold: 20 },
  { id: "extract", label: "Extracting information", threshold: 40 },
  { id: "match", label: "Matching to schema", threshold: 60 },
  { id: "gap", label: "Gap analysis", threshold: 80 },
  { id: "generate", label: "Generating questionnaire", threshold: 100 },
];

export function AnalyzingProgress({ visaType }: AnalyzingProgressProps) {
  const analysisProgress = useCaseDetailStore(
    (state) => state.analysisProgress,
  );
  const analyzedFiles = useCaseDetailStore((state) => state.analyzedFiles);

  // Get current step based on progress
  const getCurrentStep = () => {
    for (let i = ANALYSIS_STEPS.length - 1; i >= 0; i--) {
      if (analysisProgress >= ANALYSIS_STEPS[i].threshold) {
        return i;
      }
    }
    return -1;
  };

  const currentStepIndex = getCurrentStep();

  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Main progress card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8"
        >
          {/* Animated icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="size-16 rounded-full border-4 border-stone-100 border-t-[#0E4268]"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-[#0E4268]">
                  {analysisProgress}%
                </span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-lg font-semibold text-stone-800 text-center mb-2 text-balance">
            Analyzing your documents
          </h2>
          <p className="text-sm text-stone-500 text-center mb-6 text-pretty">
            We&apos;re extracting information and preparing your questionnaire
          </p>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#0E4268] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${analysisProgress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            {ANALYSIS_STEPS.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isActive =
                index === currentStepIndex + 1 ||
                (index === 0 && currentStepIndex === -1);

              return (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-center gap-3 text-sm transition-colors",
                    isCompleted
                      ? "text-stone-700"
                      : isActive
                        ? "text-[#0E4268]"
                        : "text-stone-400",
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  ) : isActive ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <div className="size-4 rounded-full border-2 border-stone-300" />
                  )}
                  <span
                    className={cn(
                      isCompleted && "line-through",
                      isActive && "font-medium",
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Files being analyzed */}
        {analyzedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.2 }}
            className="mt-4 text-center"
          >
            <p className="text-xs text-stone-400">
              Processing {analyzedFiles.length} files from your documents
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
