"use client";

import {
  FileText,
  Sparkles,
  Shield,
  Play,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useCaseDetailStore,
  useApplicationPhase,
  useSelectedVisaType,
  useDocumentGroups,
} from "@/store/case-detail-store";
import { DocumentsReadyCard } from "./DocumentsReadyCard";
import { getVisaConfig } from "./ApplicationLandingPage";
import { QuickQuestionnaire } from "./QuickQuestionnaire";
import { AnalyzingProgress } from "./AnalyzingProgress";
import { FormPilotLauncher } from "./FormPilotLauncher";
import { ChecklistWorkspace } from "./ChecklistWorkspace";

export function ApplicationBox() {
  const applicationPhase = useApplicationPhase();
  const selectedVisaType = useSelectedVisaType();
  const documentGroups = useDocumentGroups();
  const isAnalyzingDocuments = useCaseDetailStore(
    (state) => state.isAnalyzingDocuments
  );

  // Calculate document count
  const classifiedGroups = documentGroups.filter(
    (g) => g.id !== "unclassified"
  );
  const readyGroups = classifiedGroups.filter((g) => g.status === "reviewed");
  const hasReadyDocuments = readyGroups.length > 0;
  const totalPages = readyGroups.reduce(
    (sum, g) => sum + g.files.filter((f) => !f.isRemoved).length,
    0
  );

  const startAnalysisAndGenerateQuestionnaire = useCaseDetailStore(
    (state) => state.startAnalysisAndGenerateQuestionnaire
  );

  const visaConfig = selectedVisaType ? getVisaConfig(selectedVisaType) : null;

  const handleRunAnalysis = () => {
    startAnalysisAndGenerateQuestionnaire();
  };

  // Determine if we're in the pre-analysis state (analyzing phase but not yet started)
  const isPreAnalysis =
    applicationPhase === "analyzing" && !isAnalyzingDocuments;
  const isCurrentlyAnalyzing =
    applicationPhase === "analyzing" && isAnalyzingDocuments;

  // For checklist phase, render the full-screen workspace
  if (applicationPhase === "checklist") {
    return <ChecklistWorkspace />;
  }

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
            {isPreAnalysis && (
              <>
                <DocumentsReadyCard className="mb-5" />
                <div className="flex items-center justify-between">
                  <p className="text-sm text-stone-500">
                    {hasReadyDocuments
                      ? `Ready to analyze ${readyGroups.length} documents (${totalPages} pages)`
                      : "Confirm your documents to proceed"}
                  </p>
                  <button
                    onClick={handleRunAnalysis}
                    disabled={!hasReadyDocuments}
                    className={cn(
                      "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      hasReadyDocuments
                        ? "bg-[#0E4268] text-white hover:bg-[#0a3555]"
                        : "bg-stone-100 text-stone-400 cursor-not-allowed"
                    )}
                  >
                    <Play size={16} />
                    Run Analysis
                  </button>
                </div>
              </>
            )}

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

        {isPreAnalysis && (
          <p className="mt-4 text-center text-xs text-stone-400 text-pretty">
            Your documents will be analyzed to auto-fill the application form
          </p>
        )}
      </div>
    </div>
  );
}
