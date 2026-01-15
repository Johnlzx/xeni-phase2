"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { VisaType } from "@/types";
import { useCaseDetailStore } from "@/store/case-detail-store";
import { getVisaConfig } from "./ApplicationLandingPage";
import { DocumentsReadyCard } from "./DocumentsReadyCard";
import { QuickQuestionnaire } from "./QuickQuestionnaire";
import { ChecklistContent } from "./ChecklistContent";

type WorkspacePhase = "questionnaire" | "checklist" | "builder";

interface ApplicationWorkspaceProps {
  visaType: VisaType;
  onCancel: () => void;
  onVisaTypeConfirmed: () => void;
}

export function ApplicationWorkspace({
  visaType,
  onCancel,
  onVisaTypeConfirmed,
}: ApplicationWorkspaceProps) {
  const setActiveNav = useCaseDetailStore((state) => state.setActiveNav);
  const visaConfig = getVisaConfig(visaType);

  const [phase, setPhase] = useState<WorkspacePhase>("questionnaire");
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<
    Record<string, unknown>
  >({});

  if (!visaConfig) return null;

  const Icon = visaConfig.icon;

  // Handle questionnaire completion
  const handleQuestionnaireComplete = (answers: Record<string, unknown>) => {
    setQuestionnaireAnswers(answers);
    onVisaTypeConfirmed();
    setPhase("checklist");
  };

  // Handle navigating to documents
  const handleNavigateToDocuments = () => {
    setActiveNav("documents");
  };

  // Handle starting auto-fill
  const handleStartAutoFill = () => {
    setPhase("builder");
  };

  return (
    <div className="h-full flex flex-col">
      {/* Unified Header */}
      <div className="shrink-0 bg-white border-b border-stone-200">
        {/* Top bar with visa type and cancel */}
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left: Visa Type Info */}
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "size-10 rounded-xl flex items-center justify-center",
                visaConfig.bgColor,
              )}
            >
              <Icon size={20} className={visaConfig.color} />
            </div>
            <div>
              <h1 className="text-base font-semibold text-stone-800 text-balance">
                {visaConfig.name}
              </h1>
              <p className="text-xs text-stone-500">
                Processing time: {visaConfig.processingTime}
              </p>
            </div>
          </div>

          {/* Right: Documents & Cancel */}
          <div className="flex items-center gap-3">
            <DocumentsReadyCard variant="compact" />

            <button
              onClick={onCancel}
              className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
              aria-label="Cancel and return to visa selection"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {/* Questionnaire Phase */}
          {phase === "questionnaire" && (
            <motion.div
              key="questionnaire"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="h-full overflow-auto"
            >
              <QuickQuestionnaire
                visaType={visaType}
                onComplete={handleQuestionnaireComplete}
                onClose={onCancel}
                onNavigateToDocuments={handleNavigateToDocuments}
                isInline={true}
                hideHeader={true}
              />
            </motion.div>
          )}

          {/* Checklist Phase */}
          {phase === "checklist" && (
            <motion.div
              key="checklist"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="h-full overflow-auto"
            >
              <ChecklistContent
                visaType={visaType}
                answers={questionnaireAnswers}
                onStartAutoFill={handleStartAutoFill}
              />
            </motion.div>
          )}

          {/* Builder Phase (placeholder) */}
          {phase === "builder" && (
            <motion.div
              key="builder"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="h-full flex items-center justify-center"
            >
              <div className="text-center">
                <div className="size-16 mx-auto mb-4 rounded-full border-4 border-stone-200 border-t-[#0E4268] animate-spin" />
                <h2 className="text-xl font-bold text-stone-800 mb-2 text-balance">
                  Auto-Fill in Progress
                </h2>
                <p className="text-stone-500 text-pretty">
                  Building your application...
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
