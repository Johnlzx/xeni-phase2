"use client";

import React from "react";
import { motion } from "motion/react";
import {
  Briefcase,
  GraduationCap,
  Users,
  Plane,
  Lightbulb,
  Star,
  Sparkles,
  Shield,
  Clock,
  Play,
  ArrowRight,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VisaType } from "@/types";
import { DocumentsReadyCard } from "./DocumentsReadyCard";
import {
  useCaseDetailStore,
  useDocumentGroups,
  useSelectedVisaType,
} from "@/store/case-detail-store";

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
    icon: Briefcase,
    processingTime: "3 weeks",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    id: "global-talent",
    name: "Global Talent Visa",
    shortName: "Global Talent",
    description: "Leaders in academia, research, arts, or digital tech",
    icon: Star,
    processingTime: "8 weeks",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  {
    id: "student",
    name: "Student Visa",
    shortName: "Student",
    description: "Study offer from a licensed student sponsor",
    icon: GraduationCap,
    processingTime: "3 weeks",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
  },
  {
    id: "family",
    name: "Family Visa",
    shortName: "Family",
    description: "Join British citizens or settled family members",
    icon: Users,
    processingTime: "24 weeks",
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
  },
  {
    id: "visitor",
    name: "Standard Visitor Visa",
    shortName: "Visitor",
    description: "Tourism, family visits, or business meetings",
    icon: Plane,
    processingTime: "3 weeks",
    color: "text-sky-600",
    bgColor: "bg-sky-50",
    borderColor: "border-sky-200",
  },
  {
    id: "innovator",
    name: "Innovator Founder Visa",
    shortName: "Innovator",
    description: "Establish an innovative business in the UK",
    icon: Lightbulb,
    processingTime: "8 weeks",
    color: "text-violet-600",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
  },
];

// Get visa config by ID
export const getVisaConfig = (visaId: VisaType) => {
  return VISA_TYPES.find((v) => v.id === visaId);
};

interface ApplicationLandingPageProps {
  onRunAnalysis?: () => void;
}

export function ApplicationLandingPage({
  onRunAnalysis,
}: ApplicationLandingPageProps) {
  const selectedVisaType = useSelectedVisaType();
  const documentGroups = useDocumentGroups();
  const startAnalysisAndGenerateQuestionnaire = useCaseDetailStore(
    (state) => state.startAnalysisAndGenerateQuestionnaire
  );

  const visaConfig = selectedVisaType ? getVisaConfig(selectedVisaType) : null;

  // Calculate document stats
  const classifiedGroups = documentGroups.filter(
    (g) => g.id !== "unclassified"
  );
  const readyGroups = classifiedGroups.filter((g) => g.status === "reviewed");
  const totalPages = readyGroups.reduce(
    (sum, g) => sum + g.files.filter((f) => !f.isRemoved).length,
    0
  );

  // Check if we can run analysis (need reviewed documents)
  const canRunAnalysis = readyGroups.length > 0;

  const handleRunAnalysis = () => {
    if (onRunAnalysis) {
      onRunAnalysis();
    } else {
      startAnalysisAndGenerateQuestionnaire();
    }
  };

  return (
    <div className="h-full flex flex-col bg-stone-50 overflow-auto">
      <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-8">
        {/* Header with Visa Type Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#0E4268]/5 rounded-full mb-4">
            <Shield size={14} className="text-[#0E4268]" />
            <span className="text-xs font-medium text-[#0E4268] tracking-wide">
              UK Visa Application
            </span>
          </div>

          <h1 className="text-2xl font-bold text-stone-900 mb-2 tracking-tight text-balance">
            Build Your Application
          </h1>

          <p className="text-sm text-stone-500 text-pretty max-w-md mx-auto">
            We'll analyze your documents and extract information to auto-fill
            your application form
          </p>
        </motion.div>

        {/* Visa Type Card - shows selected visa from case creation */}
        {visaConfig && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.2, ease: "easeOut" }}
            className="mb-6"
          >
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-4">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "size-12 rounded-xl flex items-center justify-center",
                    visaConfig.bgColor
                  )}
                >
                  <visaConfig.icon size={24} className={visaConfig.color} />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-stone-900">
                    {visaConfig.name}
                  </h3>
                  <p className="text-sm text-stone-500">
                    {visaConfig.description}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-stone-400">
                  <Clock size={12} />
                  <span>{visaConfig.processingTime}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Documents Ready Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.2, ease: "easeOut" }}
        >
          <DocumentsReadyCard className="mb-8" />
        </motion.div>

        {/* Analysis Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.2, ease: "easeOut" }}
          className="bg-white rounded-xl border border-stone-200 shadow-sm p-5 mb-8"
        >
          <h3 className="text-sm font-semibold text-stone-800 mb-3">
            What happens next?
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="size-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                <FileText size={12} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-stone-700">
                  <span className="font-medium">Document Analysis</span> - AI
                  extracts data from your uploaded documents
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="size-6 rounded-full bg-violet-50 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles size={12} className="text-violet-600" />
              </div>
              <div>
                <p className="text-sm text-stone-700">
                  <span className="font-medium">Gap Analysis</span> - We
                  identify missing information and generate targeted questions
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="size-6 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 size={12} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-stone-700">
                  <span className="font-medium">Checklist Generation</span> -
                  Build a complete checklist with quality audit
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.2, ease: "easeOut" }}
          className="text-center"
        >
          <button
            onClick={handleRunAnalysis}
            disabled={!canRunAnalysis}
            className={cn(
              "group inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-base transition-all",
              canRunAnalysis
                ? "bg-[#0E4268] text-white shadow-lg shadow-[#0E4268]/20 hover:bg-[#0a3555] hover:shadow-xl"
                : "bg-stone-100 text-stone-400 cursor-not-allowed"
            )}
          >
            <Play size={20} className={canRunAnalysis ? "text-blue-200" : ""} />
            <span>Run Analysis</span>
            <ArrowRight
              size={18}
              className={cn(
                "transition-transform",
                canRunAnalysis && "group-hover:translate-x-1"
              )}
            />
          </button>

          <p className="mt-3 text-xs text-stone-400 text-pretty">
            {canRunAnalysis
              ? `Ready to analyze ${readyGroups.length} documents (${totalPages} pages)`
              : "Confirm your documents to proceed"}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
