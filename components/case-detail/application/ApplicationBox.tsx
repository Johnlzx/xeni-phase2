"use client";

import {
  CheckCircle2,
  FileText,
  Sparkles,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useCaseDetailStore,
  useApplicationPhase,
  useSelectedVisaType,
  useDocumentGroups,
} from "@/store/case-detail-store";
import { VisaType } from "@/types";
import { DocumentsReadyCard } from "./DocumentsReadyCard";
import { getVisaConfig, VISA_TYPES } from "./ApplicationLandingPage";
import { QuickQuestionnaire } from "./QuickQuestionnaire";
import { AnalyzingProgress } from "./AnalyzingProgress";
import { FormPilotLauncher } from "./FormPilotLauncher";
import { ChecklistWorkspace } from "./ChecklistWorkspace";

// Visa type selector for top section
function VisaTypeSelector({
  selectedVisa,
  onSelect,
}: {
  selectedVisa: VisaType | null;
  onSelect: (visa: VisaType) => void;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {VISA_TYPES.map((visa) => {
        const Icon = visa.icon;
        const isSelected = selectedVisa === visa.id;

        return (
          <button
            key={visa.id}
            onClick={() => onSelect(visa.id)}
            className={cn(
              "relative flex items-center gap-3 p-3 rounded-lg border text-left transition-colors",
              isSelected
                ? "border-stone-900 bg-stone-50"
                : "border-stone-200 hover:border-stone-300 hover:bg-stone-50/50",
            )}
          >
            <div
              className={cn(
                "size-8 rounded-lg flex items-center justify-center shrink-0",
                visa.bgColor,
              )}
            >
              <Icon size={16} className={visa.color} />
            </div>
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "text-sm font-medium truncate",
                  isSelected ? "text-stone-900" : "text-stone-700",
                )}
              >
                {visa.shortName}
              </p>
            </div>
            {isSelected && (
              <div className="absolute top-2 right-2">
                <CheckCircle2 size={14} className="text-stone-900" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function ApplicationBox() {
  const applicationPhase = useApplicationPhase();
  const selectedVisaType = useSelectedVisaType();
  const documentGroups = useDocumentGroups();

  // Calculate document count
  const classifiedGroups = documentGroups.filter(
    (g) => g.id !== "unclassified",
  );
  const hasDocuments = classifiedGroups.length > 0;

  const setVisaType = useCaseDetailStore((state) => state.setVisaType);
  const initFormSchema = useCaseDetailStore((state) => state.initFormSchema);
  const startAnalysisAndGenerateQuestionnaire = useCaseDetailStore(
    (state) => state.startAnalysisAndGenerateQuestionnaire,
  );

  const visaConfig = selectedVisaType ? getVisaConfig(selectedVisaType) : null;

  const handleStartApplication = () => {
    if (selectedVisaType) {
      initFormSchema(selectedVisaType);
      startAnalysisAndGenerateQuestionnaire();
    }
  };

  const handleSelectVisa = (visa: VisaType) => {
    setVisaType(visa);
  };

  const isWorking = applicationPhase !== "landing";

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
              <div>
                <h2 className="text-base font-semibold text-stone-900">
                  Application Builder
                </h2>
                <p className="text-xs text-stone-500">
                  {selectedVisaType && visaConfig
                    ? visaConfig.name
                    : "Select a visa type to begin"}
                </p>
              </div>

              {/* Status badge */}
              {isWorking && (
                <div className="ml-auto">
                  {applicationPhase === "analyzing" && (
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
              )}
            </div>

            {/* Content based on phase */}
            {applicationPhase === "landing" && (
              <>
                <DocumentsReadyCard className="mb-5" />
                <div className="mb-5">
                  <h3 className="text-sm font-medium text-stone-700 mb-3">
                    Select Visa Type
                  </h3>
                  <VisaTypeSelector
                    selectedVisa={selectedVisaType}
                    onSelect={handleSelectVisa}
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleStartApplication}
                    disabled={!selectedVisaType || !hasDocuments}
                    className={cn(
                      "px-5 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      selectedVisaType && hasDocuments
                        ? "bg-[#0E4268] text-white hover:bg-[#0a3555]"
                        : "bg-stone-100 text-stone-400 cursor-not-allowed",
                    )}
                  >
                    Build Application
                  </button>
                </div>
              </>
            )}

            {applicationPhase === "analyzing" && selectedVisaType && (
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

        {applicationPhase === "landing" && (
          <p className="mt-4 text-center text-xs text-stone-400 text-pretty">
            Your documents will be analyzed to auto-fill the application form
          </p>
        )}
      </div>
    </div>
  );
}
