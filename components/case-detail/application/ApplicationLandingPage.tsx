"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VisaType } from "@/types";
import { DocumentsReadyCard } from "./DocumentsReadyCard";

// UK Visa Types Configuration
const VISA_TYPES: {
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

// Visa type card for grid layout
const VisaTypeCard = ({
  visa,
  isSelected,
  onSelect,
  index,
}: {
  visa: (typeof VISA_TYPES)[0];
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}) => {
  const Icon = visa.icon;

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.2, ease: "easeOut" }}
      onClick={onSelect}
      className={cn(
        "group relative text-left p-4 rounded-xl border-2 transition-all",
        isSelected
          ? "border-[#0E4268] bg-[#0E4268]/5 shadow-md"
          : "border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm",
      )}
    >
      {/* Selection indicator */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute top-3 right-3 size-5 bg-[#0E4268] rounded-full flex items-center justify-center"
          >
            <CheckCircle2 size={12} className="text-white" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icon */}
      <div
        className={cn(
          "size-10 rounded-lg flex items-center justify-center mb-3 transition-transform",
          visa.bgColor,
          "group-hover:scale-105",
        )}
      >
        <Icon size={20} className={visa.color} />
      </div>

      {/* Content */}
      <h3
        className={cn(
          "text-sm font-semibold mb-1 text-balance",
          isSelected ? "text-[#0E4268]" : "text-stone-800",
        )}
      >
        {visa.shortName}
      </h3>
      <p className="text-xs text-stone-500 leading-relaxed line-clamp-2 mb-2 text-pretty">
        {visa.description}
      </p>

      {/* Processing time */}
      <div className="flex items-center gap-1 text-[10px] text-stone-400">
        <Clock size={10} />
        <span>{visa.processingTime}</span>
      </div>
    </motion.button>
  );
};

interface ApplicationLandingPageProps {
  onStartQuestionnaire?: (visaType: VisaType) => void;
}

export function ApplicationLandingPage({
  onStartQuestionnaire,
}: ApplicationLandingPageProps) {
  const [selectedVisa, setSelectedVisa] = useState<VisaType | null>(null);

  const handleBuildApplication = () => {
    if (selectedVisa && onStartQuestionnaire) {
      onStartQuestionnaire(selectedVisa);
    }
  };

  return (
    <div className="h-full flex flex-col bg-stone-50 overflow-auto">
      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#0E4268]/5 rounded-full mb-3">
            <Shield size={14} className="text-[#0E4268]" />
            <span className="text-xs font-medium text-[#0E4268] tracking-wide">
              UK Visa Application
            </span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 mb-1.5 tracking-tight text-balance">
            Build Your Application
          </h1>
          <p className="text-sm text-stone-500 text-pretty">
            Select a visa type to start building your case
          </p>
        </motion.div>

        {/* Documents Ready Card */}
        <DocumentsReadyCard className="mb-6" />

        {/* Visa Type Grid */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-stone-700 mb-3">
            Select Visa Type
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {VISA_TYPES.map((visa, index) => (
              <VisaTypeCard
                key={visa.id}
                visa={visa}
                isSelected={selectedVisa === visa.id}
                onSelect={() => setSelectedVisa(visa.id)}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.2, ease: "easeOut" }}
          className="text-center pt-4"
        >
          <button
            onClick={handleBuildApplication}
            disabled={!selectedVisa}
            className={cn(
              "group inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-base transition-all",
              selectedVisa
                ? "bg-[#0E4268] text-white shadow-lg shadow-[#0E4268]/20 hover:bg-[#0a3555] hover:shadow-xl"
                : "bg-stone-100 text-stone-400 cursor-not-allowed",
            )}
          >
            <Sparkles
              size={20}
              className={selectedVisa ? "text-blue-200" : ""}
            />
            <span>Build Application</span>
            <ArrowRight
              size={18}
              className={cn(
                "transition-transform",
                selectedVisa && "group-hover:translate-x-1",
              )}
            />
          </button>

          <p className="mt-3 text-xs text-stone-400 text-pretty">
            {selectedVisa
              ? `Ready to build your ${VISA_TYPES.find((v) => v.id === selectedVisa)?.name} application`
              : "Select a visa type above to continue"}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
