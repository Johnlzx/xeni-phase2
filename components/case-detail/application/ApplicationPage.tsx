"use client";

import { useState } from "react";
import { useCaseDetailStore } from "@/store/case-detail-store";
import { ApplicationLandingPage } from "./ApplicationLandingPage";
import { QuickQuestionnaire } from "./QuickQuestionnaire";
import { ApplicationChecklistView } from "./ApplicationChecklist";
import { VisaType } from "@/types";

type ApplicationStage = "landing" | "questionnaire" | "checklist" | "builder";

export function ApplicationPage() {
  const selectedVisaType = useCaseDetailStore(
    (state) => state.selectedVisaType,
  );
  const setVisaType = useCaseDetailStore((state) => state.setVisaType);

  const [stage, setStage] = useState<ApplicationStage>(
    selectedVisaType ? "checklist" : "landing",
  );
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState<
    Record<string, any>
  >({});
  const [pendingVisaType, setPendingVisaType] = useState<VisaType | null>(null);

  // Handle starting the questionnaire from landing page
  const handleStartQuestionnaire = (visaType: VisaType) => {
    setPendingVisaType(visaType);
    setStage("questionnaire");
  };

  // Handle questionnaire completion
  const handleQuestionnaireComplete = (answers: Record<string, any>) => {
    setQuestionnaireAnswers(answers);
    if (pendingVisaType) {
      setVisaType(pendingVisaType);
    }
    setStage("checklist");
  };

  // Handle closing questionnaire
  const handleCloseQuestionnaire = () => {
    setPendingVisaType(null);
    setStage("landing");
  };

  // Handle starting auto-fill
  const handleStartAutoFill = () => {
    setStage("builder");
  };

  // Show landing page if no visa type selected
  if (stage === "landing") {
    return (
      <>
        <ApplicationLandingPage
          onStartQuestionnaire={handleStartQuestionnaire}
        />
      </>
    );
  }

  // Show questionnaire modal
  if (stage === "questionnaire" && pendingVisaType) {
    return (
      <>
        <ApplicationLandingPage
          onStartQuestionnaire={handleStartQuestionnaire}
        />
        <QuickQuestionnaire
          visaType={pendingVisaType}
          onComplete={handleQuestionnaireComplete}
          onClose={handleCloseQuestionnaire}
        />
      </>
    );
  }

  // Show checklist view
  if (stage === "checklist" && selectedVisaType) {
    return (
      <ApplicationChecklistView
        visaType={selectedVisaType}
        answers={questionnaireAnswers}
        onStartAutoFill={handleStartAutoFill}
      />
    );
  }

  // Show builder (placeholder for now)
  if (stage === "builder" && selectedVisaType) {
    return (
      <div className="h-full flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-stone-800 mb-2">
            Auto-Fill in Progress
          </h2>
          <p className="text-stone-500">Building your application...</p>
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <ApplicationLandingPage onStartQuestionnaire={handleStartQuestionnaire} />
  );
}
