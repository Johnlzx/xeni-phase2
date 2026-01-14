"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useCaseDetailStore } from "@/store/case-detail-store";
import { ApplicationLandingPage } from "./ApplicationLandingPage";
import { ApplicationWorkspace } from "./ApplicationWorkspace";
import { VisaType } from "@/types";

type ApplicationStage = "landing" | "workspace";

export function ApplicationPage() {
  const selectedVisaType = useCaseDetailStore(
    (state) => state.selectedVisaType,
  );
  const setVisaType = useCaseDetailStore((state) => state.setVisaType);

  const [stage, setStage] = useState<ApplicationStage>(
    selectedVisaType ? "workspace" : "landing",
  );
  const [pendingVisaType, setPendingVisaType] = useState<VisaType | null>(
    selectedVisaType,
  );

  // Handle starting the application from landing page
  const handleStartApplication = (visaType: VisaType) => {
    setPendingVisaType(visaType);
    setStage("workspace");
  };

  // Handle canceling - return to landing
  const handleCancel = () => {
    setPendingVisaType(null);
    setVisaType(null);
    setStage("landing");
  };

  // Handle visa type confirmed (after questionnaire)
  const handleVisaTypeConfirmed = () => {
    if (pendingVisaType) {
      setVisaType(pendingVisaType);
    }
  };

  return (
    <div className="h-full flex flex-col bg-stone-50 overflow-hidden">
      <AnimatePresence mode="wait">
        {/* Landing Stage - Select Visa Type */}
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
              onStartQuestionnaire={handleStartApplication}
            />
          </motion.div>
        )}

        {/* Workspace Stage - Questionnaire + Checklist */}
        {stage === "workspace" && pendingVisaType && (
          <motion.div
            key="workspace"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="h-full"
          >
            <ApplicationWorkspace
              visaType={pendingVisaType}
              onCancel={handleCancel}
              onVisaTypeConfirmed={handleVisaTypeConfirmed}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
