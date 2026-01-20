"use client";

import { FileText, Sparkles, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useCaseDetailStore,
  useApplicationPhase,
  useSelectedVisaType,
} from "@/store/case-detail-store";
import { ApplicationLandingPage, getVisaConfig } from "./ApplicationLandingPage";
import { QuickQuestionnaire } from "./QuickQuestionnaire";
import { AnalyzingProgress } from "./AnalyzingProgress";
import { FormPilotLauncher } from "./FormPilotLauncher";
import { ChecklistWorkspace } from "./ChecklistWorkspace";

export function ApplicationBox() {
  const applicationPhase = useApplicationPhase();
  const selectedVisaType = useSelectedVisaType();
  const isAnalyzingDocuments = useCaseDetailStore(
    (state) => state.isAnalyzingDocuments
  );

  const visaConfig = selectedVisaType ? getVisaConfig(selectedVisaType) : null;

  // Determine if we're in the pre-analysis state (analyzing phase but not yet started)
  const isPreAnalysis =
    applicationPhase === "analyzing" && !isAnalyzingDocuments;
  const isCurrentlyAnalyzing =
    applicationPhase === "analyzing" && isAnalyzingDocuments;

  // For checklist phase, render the full-screen workspace
  if (applicationPhase === "checklist") {
    return <ChecklistWorkspace />;
  }

  // For pre-analysis state, render the new full-page landing
  if (isPreAnalysis) {
    return <ApplicationLandingPage />;
  }

  // For other phases, render the box-style UI
  return (
    <div className="h-full overflow-auto p-6">
      <div className="max-w-4xl mx-auto">
        {/* Main Application Box */}
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          {/* Top Section - Always Visible */}
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="size-10 rounded-xl bg-stone-100 flex items-center justify-center">
                <Shield size={20} className="text-stone-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-base font-semibold text-stone-900">
                  Application Builder
                </h2>
                <p className="text-xs text-stone-500">
                  {selectedVisaType && visaConfig
                    ? visaConfig.name
                    : "Visa type not set"}
                </p>
              </div>

              {/* Visa Type Badge */}
              {visaConfig && (
                <div
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
                    visaConfig.bgColor,
                    visaConfig.color
                  )}
                >
                  <visaConfig.icon size={14} />
                  <span>{visaConfig.shortName}</span>
                </div>
              )}

              {/* Status badge */}
              <div className="ml-2">
                {isCurrentlyAnalyzing && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                    <span className="size-1.5 bg-blue-500 rounded-full animate-pulse" />
                    Analyzing
                  </span>
                )}
                {applicationPhase === "questionnaire" && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 text-violet-700 rounded-full text-xs font-medium">
                    <FileText size={12} />
                    Questionnaire
                  </span>
                )}
                {applicationPhase === "form_pilot" && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                    <Sparkles size={12} />
                    Ready
                  </span>
                )}
              </div>
            </div>

            {/* Content based on phase */}
            {isCurrentlyAnalyzing && selectedVisaType && (
              <div className="py-8">
                <AnalyzingProgress visaType={selectedVisaType} />
              </div>
            )}

            {applicationPhase === "questionnaire" && selectedVisaType && (
              <div className="py-4">
                <QuickQuestionnaire
                  visaType={selectedVisaType}
                  isInline={true}
                  hideHeader={true}
                />
              </div>
            )}

            {applicationPhase === "form_pilot" && selectedVisaType && (
              <div className="py-4">
                <FormPilotLauncher visaType={selectedVisaType} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
