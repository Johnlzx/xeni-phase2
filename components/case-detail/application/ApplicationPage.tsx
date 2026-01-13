"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useCaseDetailStore } from "@/store/case-detail-store";
import { ApplicationLandingPage } from "./ApplicationLandingPage";
import { QuickQuestionnaire } from "./QuickQuestionnaire";
import { ApplicationChecklistView } from "./ApplicationChecklist";
import { VisaTypeHeader } from "./VisaTypeHeader";
import { VisaType } from "@/types";

type ApplicationStage = "landing" | "questionnaire" | "checklist" | "builder";

export function ApplicationPage() {
  const selectedVisaType = useCaseDetailStore(
    (state) => state.selectedVisaType,
  );
  const setVisaType = useCaseDetailStore((state) => state.setVisaType);
  const setActiveNav = useCaseDetailStore((state) => state.setActiveNav);

  const [stage, setStage] = useState<ApplicationStage>(
    selectedVisaType ? "checklist" : "landing",
  );
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<
    Record<string, unknown>
  >({});
  const [pendingVisaType, setPendingVisaType] = useState<VisaType | null>(null);

  // Handle starting the questionnaire from landing page
  const handleStartQuestionnaire = (visaType: VisaType) => {
    setPendingVisaType(visaType);
    setStage("questionnaire");
  };

  // Handle questionnaire completion
  const handleQuestionnaireComplete = (answers: Record<string, unknown>) => {
    setQuestionnaireAnswers(answers);
    if (pendingVisaType) {
      setVisaType(pendingVisaType);
    }
    setStage("checklist");
  };

  // Handle canceling questionnaire - return to landing
  const handleCancelQuestionnaire = () => {
    setPendingVisaType(null);
    setStage("landing");
  };

  // Handle navigating to documents
  const handleNavigateToDocuments = () => {
    setActiveNav("documents");
  };

  // Handle starting auto-fill
  const handleStartAutoFill = () => {
    setStage("builder");
  };

  // Handle going back from checklist to landing (reset)
  const handleResetApplication = () => {
    setVisaType(null);
    setPendingVisaType(null);
    setQuestionnaireAnswers({});
    setStage("landing");
  };

  return (
    <div className="h-full flex flex-col bg-stone-50 overflow-hidden">
      <AnimatePresence mode="wait">
        {/* Landing Stage */}
        {stage === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="h-full"
          >
            <ApplicationLandingPage
              onStartQuestionnaire={handleStartQuestionnaire}
            />
          </motion.div>
        )}

        {/* Questionnaire Stage */}
        {stage === "questionnaire" && pendingVisaType && (
          <motion.div
            key="questionnaire"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="h-full flex flex-col"
          >
            {/* Header with Visa Type */}
            <VisaTypeHeader
              visaType={pendingVisaType}
              showCancel={true}
              onCancel={handleCancelQuestionnaire}
            />

            {/* Questionnaire Content */}
            <div className="flex-1 overflow-auto">
              <QuickQuestionnaire
                visaType={pendingVisaType}
                onComplete={handleQuestionnaireComplete}
                onClose={handleCancelQuestionnaire}
                onNavigateToDocuments={handleNavigateToDocuments}
                isInline={true}
              />
            </div>
          </motion.div>
        )}

        {/* Checklist Stage */}
        {stage === "checklist" && (selectedVisaType || pendingVisaType) && (
          <motion.div
            key="checklist"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="h-full"
          >
            <ApplicationChecklistView
              visaType={selectedVisaType || pendingVisaType!}
              answers={questionnaireAnswers}
              onStartAutoFill={handleStartAutoFill}
              onBack={handleResetApplication}
            />
          </motion.div>
        )}

        {/* Builder Stage (placeholder) */}
        {stage === "builder" && (selectedVisaType || pendingVisaType) && (
          <motion.div
            key="builder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="h-full flex flex-col"
          >
            {/* Header */}
            <VisaTypeHeader
              visaType={selectedVisaType || pendingVisaType!}
              showCancel={false}
            />

            {/* Builder Content */}
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="size-16 mx-auto mb-4 rounded-full border-4 border-stone-200 border-t-[#0E4268] animate-spin" />
                <h2 className="text-xl font-bold text-stone-800 mb-2 text-balance">
                  Auto-Fill in Progress
                </h2>
                <p className="text-stone-500 text-pretty">
                  Building your application...
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
