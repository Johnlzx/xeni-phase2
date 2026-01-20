"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Sparkles,
  Shield,
  Clock,
  Play,
  ArrowRight,
  FileText,
  CheckCircle2,
  Zap,
  FileSearch,
  ListChecks,
  AlertCircle,
  ChevronRight,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VisaType } from "@/types";
import {
  useCaseDetailStore,
  useDocumentGroups,
  useSelectedVisaType,
} from "@/store/case-detail-store";
import { VISA_TYPE_ICONS } from "@/data/visa-types";
import { CategoryReviewModal } from "../shared";
import type { DocumentGroup } from "@/types/case-detail";

// UK Visa Types Configuration
export const VISA_TYPES: {
  id: VisaType;
  name: string;
  shortName: string;
  description: string;
  icon: React.ElementType;
  processingTime: string;
  color: string;
  bgColor: string;
  borderColor: string;
}[] = [
  {
    id: "skilled-worker",
    name: "Skilled Worker Visa",
    shortName: "Skilled Worker",
    description: "Job offer from a UK employer with sponsor licence",
    icon: VISA_TYPE_ICONS["skilled-worker"],
    processingTime: "3 weeks",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    id: "naturalisation",
    name: "Naturalisation",
    shortName: "Naturalisation",
    description: "Apply for British citizenship through naturalisation",
    icon: VISA_TYPE_ICONS["naturalisation"],
    processingTime: "6 months",
    color: "text-violet-600",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
  },
  {
    id: "visitor",
    name: "Visitor Visa",
    shortName: "Visitor",
    description: "Tourism, family visits, or business meetings",
    icon: VISA_TYPE_ICONS["visitor"],
    processingTime: "3 weeks",
    color: "text-sky-600",
    bgColor: "bg-sky-50",
    borderColor: "border-sky-200",
  },
  {
    id: "partner-spouse",
    name: "Partner/Spouse Visa (outside the UK)",
    shortName: "Partner/Spouse",
    description: "Join British citizens or settled partners from outside the UK",
    icon: VISA_TYPE_ICONS["partner-spouse"],
    processingTime: "24 weeks",
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
  },
];

// Get visa config by ID
export const getVisaConfig = (visaId: VisaType) => {
  return VISA_TYPES.find((v) => v.id === visaId);
};

// Analysis Step Component
const AnalysisStep = ({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  description,
  delay,
}: {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.3, ease: "easeOut" }}
    className="flex items-start gap-4"
  >
    <div
      className={cn(
        "size-10 rounded-xl flex items-center justify-center shrink-0",
        iconBg
      )}
    >
      <Icon size={18} className={iconColor} />
    </div>
    <div className="flex-1 pt-0.5">
      <h4 className="text-sm font-semibold text-stone-800">{title}</h4>
      <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
        {description}
      </p>
    </div>
  </motion.div>
);

// Document Category Badge
const DocumentBadge = ({
  group,
  onClick,
}: {
  group: DocumentGroup;
  onClick: () => void;
}) => {
  const isReady = group.status === "reviewed";
  const pageCount = group.files.filter((f) => !f.isRemoved).length;

  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
        "border bg-white hover:shadow-sm",
        isReady
          ? "border-emerald-200 hover:border-emerald-300"
          : "border-amber-200 hover:border-amber-300"
      )}
    >
      <div
        className={cn(
          "size-6 rounded-md flex items-center justify-center",
          isReady ? "bg-emerald-50" : "bg-amber-50"
        )}
      >
        {isReady ? (
          <CheckCircle2 size={14} className="text-emerald-600" />
        ) : (
          <Clock size={14} className="text-amber-600" />
        )}
      </div>
      <div className="flex-1 text-left">
        <span className="font-medium text-stone-700 truncate max-w-[120px] block">
          {group.title}
        </span>
      </div>
      <span className="text-xs text-stone-400 tabular-nums">{pageCount}p</span>
      <ChevronRight
        size={14}
        className="text-stone-300 group-hover:text-stone-400 transition-colors"
      />
    </button>
  );
};

interface ApplicationLandingPageProps {
  onRunAnalysis?: () => void;
}

export function ApplicationLandingPage({
  onRunAnalysis,
}: ApplicationLandingPageProps) {
  const selectedVisaType = useSelectedVisaType();
  const documentGroups = useDocumentGroups();
  const uploadDocuments = useCaseDetailStore((state) => state.uploadDocuments);
  const setActiveNav = useCaseDetailStore((state) => state.setActiveNav);
  const startAnalysisAndGenerateQuestionnaire = useCaseDetailStore(
    (state) => state.startAnalysisAndGenerateQuestionnaire
  );

  // State for review modal
  const [reviewGroup, setReviewGroup] = useState<DocumentGroup | null>(null);

  const visaConfig = selectedVisaType ? getVisaConfig(selectedVisaType) : null;

  // Calculate document stats
  // Exclude unclassified and special documents (like Case Notes) from the main list
  const classifiedGroups = documentGroups.filter(
    (g) => g.id !== "unclassified" && !g.isSpecial
  );
  const readyGroups = classifiedGroups.filter((g) => g.status === "reviewed");
  const pendingGroups = classifiedGroups.filter((g) => g.status !== "reviewed");
  const totalPages = readyGroups.reduce(
    (sum, g) => sum + g.files.filter((f) => !f.isRemoved).length,
    0
  );

  // Check if passport is confirmed (required to run analysis)
  const passportGroup = documentGroups.find((g) => g.id === "passport");
  const isPassportConfirmed = passportGroup?.status === "reviewed";

  // Can run analysis if passport is confirmed
  const canRunAnalysis = isPassportConfirmed;

  const handleRunAnalysis = () => {
    if (onRunAnalysis) {
      onRunAnalysis();
    } else {
      startAnalysisAndGenerateQuestionnaire();
    }
  };

  const handleOpenReview = (group: DocumentGroup) => {
    setReviewGroup(group);
  };

  const handleNavigateToDocuments = () => {
    setActiveNav("documents");
  };

  return (
    <>
      <div className="h-full flex flex-col bg-stone-50 overflow-auto">
        <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-3">
              <Shield size={14} className="text-[#0E4268]" />
              <span className="font-medium text-[#0E4268]">
                UK Visa Application
              </span>
              <span className="text-stone-300">/</span>
              <span>Build Application</span>
            </div>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
              Application Builder
            </h1>
            <p className="text-sm text-stone-500 mt-1">
              Analyze documents and auto-fill your visa application
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Visa Type & Documents */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.25 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Visa Type Card */}
              {visaConfig && (
                <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "size-14 rounded-xl flex items-center justify-center",
                          visaConfig.bgColor
                        )}
                      >
                        <visaConfig.icon size={28} className={visaConfig.color} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-stone-900">
                          {visaConfig.name}
                        </h3>
                        <p className="text-sm text-stone-500 mt-0.5">
                          {visaConfig.description}
                        </p>
                      </div>
                      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-stone-50 rounded-lg">
                        <Clock size={14} className="text-stone-400" />
                        <span className="text-sm text-stone-600">
                          {visaConfig.processingTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Documents Section */}
              <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-stone-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-[#0E4268]/10 flex items-center justify-center">
                        <FileText size={16} className="text-[#0E4268]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-stone-800">
                          Documents for Analysis
                        </h3>
                        <p className="text-xs text-stone-500 mt-0.5">
                          {isPassportConfirmed ? (
                            <>
                              <span className="font-medium text-stone-700">
                                {readyGroups.length}
                              </span>{" "}
                              confirmed ·{" "}
                              <span className="font-medium text-stone-700">
                                {totalPages}
                              </span>{" "}
                              pages ready
                            </>
                          ) : (
                            "Confirm passport to start analysis"
                          )}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleNavigateToDocuments}
                      className="text-xs font-medium text-[#0E4268] hover:underline"
                    >
                      Manage all
                    </button>
                  </div>
                </div>

                <div className="p-5">
                  <div className="space-y-4">
                    {/* Pending Documents - Show first to encourage action */}
                    {pendingGroups.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="size-5 rounded-full bg-amber-100 flex items-center justify-center">
                            <AlertCircle size={12} className="text-amber-600" />
                          </div>
                          <span className="text-xs font-medium text-amber-700">
                            Needs Confirmation ({pendingGroups.length})
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {pendingGroups.map((group) => (
                            <DocumentBadge
                              key={group.id}
                              group={group}
                              onClick={() => handleOpenReview(group)}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Ready Documents */}
                    {readyGroups.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="size-5 rounded-full bg-emerald-100 flex items-center justify-center">
                            <CheckCircle2
                              size={12}
                              className="text-emerald-600"
                            />
                          </div>
                          <span className="text-xs font-medium text-emerald-700">
                            Confirmed ({readyGroups.length})
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {readyGroups.map((group) => (
                            <DocumentBadge
                              key={group.id}
                              group={group}
                              onClick={() => handleOpenReview(group)}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Upload more documents link */}
                    <div className="pt-2 border-t border-stone-100">
                      <button
                        onClick={() => uploadDocuments()}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-700 transition-colors"
                      >
                        <Plus size={14} />
                        Add more documents
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Action Panel */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.25 }}
              className="space-y-6"
            >
              {/* Analysis Steps Card */}
              <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
                <h3 className="text-sm font-semibold text-stone-800 mb-5">
                  What happens next?
                </h3>
                <div className="space-y-5">
                  <AnalysisStep
                    icon={FileSearch}
                    iconBg="bg-blue-50"
                    iconColor="text-blue-600"
                    title="Document Analysis"
                    description="AI extracts data from your confirmed documents"
                    delay={0.2}
                  />
                  <AnalysisStep
                    icon={Sparkles}
                    iconBg="bg-violet-50"
                    iconColor="text-violet-600"
                    title="Gap Analysis"
                    description="Identify missing information and generate targeted questions"
                    delay={0.25}
                  />
                  <AnalysisStep
                    icon={ListChecks}
                    iconBg="bg-emerald-50"
                    iconColor="text-emerald-600"
                    title="Checklist Generation"
                    description="Build a complete checklist with quality audit"
                    delay={0.3}
                  />
                </div>
              </div>

              {/* CTA Card */}
              <div
                className={cn(
                  "rounded-xl border overflow-hidden transition-all",
                  canRunAnalysis
                    ? "bg-gradient-to-br from-[#0E4268] to-[#1a5a8a] border-[#0E4268]/20"
                    : "bg-stone-100 border-stone-200"
                )}
              >
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={cn(
                        "size-10 rounded-xl flex items-center justify-center",
                        canRunAnalysis ? "bg-white/10" : "bg-stone-200"
                      )}
                    >
                      <Zap
                        size={20}
                        className={
                          canRunAnalysis ? "text-white" : "text-stone-400"
                        }
                      />
                    </div>
                    <div>
                      <h3
                        className={cn(
                          "text-sm font-semibold",
                          canRunAnalysis ? "text-white" : "text-stone-500"
                        )}
                      >
                        {canRunAnalysis ? "Ready to Analyze" : "Passport Required"}
                      </h3>
                      <p
                        className={cn(
                          "text-xs mt-0.5",
                          canRunAnalysis ? "text-white/70" : "text-stone-400"
                        )}
                      >
                        {canRunAnalysis
                          ? `${readyGroups.length} documents · ${totalPages} pages`
                          : "Confirm passport to continue"}
                      </p>
                    </div>
                  </div>

                  {canRunAnalysis ? (
                    <button
                      onClick={handleRunAnalysis}
                      className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold text-sm bg-white text-[#0E4268] hover:bg-white/90 shadow-lg transition-all"
                    >
                      <Play size={18} />
                      <span>Run Analysis</span>
                      <ArrowRight
                        size={16}
                        className="ml-1 transition-transform group-hover:translate-x-1"
                      />
                    </button>
                  ) : (
                    <button
                      onClick={() => passportGroup && handleOpenReview(passportGroup)}
                      className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold text-sm bg-amber-500 text-white hover:bg-amber-600 transition-all"
                    >
                      <FileText size={18} />
                      <span>Review Passport</span>
                      <ArrowRight size={16} className="ml-1" />
                    </button>
                  )}
                </div>

                {!canRunAnalysis && (
                  <div className="px-5 py-3 bg-stone-50 border-t border-stone-200">
                    <p className="text-xs text-stone-500 text-center">
                      Passport confirmation is required before analysis
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              {canRunAnalysis && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35, duration: 0.2 }}
                  className="bg-white rounded-xl border border-stone-200 shadow-sm p-4"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-500">Estimated time</span>
                    <span className="font-medium text-stone-700">~30 seconds</span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Category Review Modal */}
      <AnimatePresence>
        {reviewGroup && (
          <DndProvider backend={HTML5Backend}>
            <CategoryReviewModal
              group={reviewGroup}
              allGroups={documentGroups}
              onClose={() => setReviewGroup(null)}
            />
          </DndProvider>
        )}
      </AnimatePresence>
    </>
  );
}
