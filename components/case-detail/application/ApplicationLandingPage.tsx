"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Briefcase,
  GraduationCap,
  Users,
  Plane,
  Lightbulb,
  Star,
  FileCheck,
  Sparkles,
  Shield,
  Clock,
  CheckCircle2,
  FileText,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { VisaType } from "@/types";
import {
  useDocumentGroups,
  useCaseDetailStore,
} from "@/store/case-detail-store";

// UK Visa Types Configuration
const VISA_TYPES: {
  id: VisaType;
  name: string;
  shortName: string;
  description: string;
  icon: React.ElementType;
  processingTime: string;
  gradient: string;
}[] = [
  {
    id: "skilled-worker",
    name: "Skilled Worker Visa",
    shortName: "Skilled Worker",
    description: "Job offer from a UK employer with sponsor licence",
    icon: Briefcase,
    processingTime: "3 weeks",
    gradient: "from-blue-600 to-blue-800",
  },
  {
    id: "global-talent",
    name: "Global Talent Visa",
    shortName: "Global Talent",
    description: "Leaders in academia, research, arts, or digital tech",
    icon: Star,
    processingTime: "8 weeks",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    id: "student",
    name: "Student Visa",
    shortName: "Student",
    description: "Study offer from a licensed student sponsor",
    icon: GraduationCap,
    processingTime: "3 weeks",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    id: "family",
    name: "Family Visa",
    shortName: "Family",
    description: "Join British citizens or settled family members",
    icon: Users,
    processingTime: "24 weeks",
    gradient: "from-rose-500 to-pink-600",
  },
  {
    id: "visitor",
    name: "Standard Visitor Visa",
    shortName: "Visitor",
    description: "Tourism, family visits, or business meetings",
    icon: Plane,
    processingTime: "3 weeks",
    gradient: "from-sky-500 to-cyan-600",
  },
  {
    id: "innovator",
    name: "Innovator Founder Visa",
    shortName: "Innovator",
    description: "Establish an innovative business in the UK",
    icon: Lightbulb,
    processingTime: "8 weeks",
    gradient: "from-violet-500 to-purple-600",
  },
];

// Compact visa type card for horizontal scroll
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onClick={onSelect}
      className={`
        group relative flex-shrink-0 w-[200px] text-left p-5 rounded-2xl border-2 transition-all duration-200
        ${
          isSelected
            ? "border-blue-600 bg-blue-50 shadow-lg shadow-blue-100 scale-[1.02]"
            : "border-stone-200 bg-white hover:border-stone-300 hover:shadow-md"
        }
      `}
    >
      {/* Selection indicator */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute top-3 right-3 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center"
          >
            <CheckCircle2 size={12} className="text-white" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Icon */}
      <div
        className={`
        w-11 h-11 rounded-xl bg-gradient-to-br ${visa.gradient}
        flex items-center justify-center mb-3 shadow-md
        group-hover:scale-105 transition-transform duration-200
      `}
      >
        <Icon size={20} className="text-white" />
      </div>

      {/* Content */}
      <h3
        className={`text-sm font-semibold mb-1 ${isSelected ? "text-blue-900" : "text-stone-800"}`}
      >
        {visa.shortName}
      </h3>
      <p className="text-xs text-stone-500 leading-relaxed line-clamp-2 mb-2">
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

// Compact document chip
const DocumentChip = ({
  title,
  count,
  status,
}: {
  title: string;
  count: number;
  status: "ready" | "pending";
}) => {
  const isReady = status === "ready";
  return (
    <div
      className={`
      inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium
      ${isReady ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}
    `}
    >
      {isReady ? (
        <CheckCircle2 size={12} className="text-emerald-500" />
      ) : (
        <Clock size={12} className="text-amber-500" />
      )}
      <span className="truncate max-w-[100px]">{title}</span>
      <span className="text-[10px] opacity-70">{count}p</span>
    </div>
  );
};

interface ApplicationLandingPageProps {
  onStartQuestionnaire?: (visaType: VisaType) => void;
}

export function ApplicationLandingPage({
  onStartQuestionnaire,
}: ApplicationLandingPageProps) {
  const [selectedVisa, setSelectedVisa] = useState<VisaType | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const documentGroups = useDocumentGroups();

  // Calculate document stats
  const classifiedGroups = documentGroups.filter(
    (g) => g.id !== "unclassified",
  );
  const readyGroups = classifiedGroups.filter((g) => g.status === "reviewed");
  const pendingGroups = classifiedGroups.filter((g) => g.status === "pending");
  const totalPages = classifiedGroups.reduce(
    (sum, g) => sum + g.files.filter((f) => !f.isRemoved).length,
    0,
  );

  const handleBuildApplication = () => {
    if (selectedVisa && onStartQuestionnaire) {
      onStartQuestionnaire(selectedVisa);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 220;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-stone-50 to-white overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 right-0 h-48 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:20px_20px]" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/2" />
      </div>

      <div className="relative flex-1 flex flex-col max-w-6xl mx-auto w-full px-8 py-6">
        {/* Header - Compact */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-900/5 rounded-full mb-3">
            <Shield size={14} className="text-blue-800" />
            <span className="text-xs font-medium text-blue-800 tracking-wide">
              UK Visa Application
            </span>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 mb-1.5 tracking-tight">
            Select Your Visa Type
          </h1>
          <p className="text-sm text-stone-500">
            Choose a category to start building your application
          </p>
        </motion.div>

        {/* Visa type horizontal scroll */}
        <div className="relative mb-6">
          {/* Scroll buttons */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-8 h-8 bg-white rounded-full shadow-lg border border-stone-200 flex items-center justify-center text-stone-600 hover:text-stone-900 hover:shadow-xl transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-8 h-8 bg-white rounded-full shadow-lg border border-stone-200 flex items-center justify-center text-stone-600 hover:text-stone-900 hover:shadow-xl transition-all"
          >
            <ChevronRight size={18} />
          </button>

          {/* Scrollable container */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide px-1 py-2 -mx-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
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

        {/* Documents section - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileCheck size={18} className="text-blue-600" />
              <h2 className="text-base font-semibold text-stone-800">
                Documents Ready
              </h2>
              <span className="text-xs text-stone-400">
                {totalPages} pages · {classifiedGroups.length} categories
              </span>
            </div>

            <div className="flex items-center gap-2">
              {readyGroups.length > 0 && (
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  {readyGroups.length} ready
                </span>
              )}
              {pendingGroups.length > 0 && (
                <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                  {pendingGroups.length} pending
                </span>
              )}
            </div>
          </div>

          {/* Document chips */}
          <div className="flex flex-wrap gap-2">
            {classifiedGroups.slice(0, 6).map((group) => (
              <DocumentChip
                key={group.id}
                title={group.title}
                count={group.files.filter((f) => !f.isRemoved).length}
                status={group.status === "reviewed" ? "ready" : "pending"}
              />
            ))}
            {classifiedGroups.length > 6 && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs text-stone-400 bg-stone-50">
                +{classifiedGroups.length - 6} more
              </span>
            )}
          </div>
        </motion.div>

        {/* CTA Section - Always visible */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="mt-auto text-center pb-4"
        >
          <button
            onClick={handleBuildApplication}
            disabled={!selectedVisa}
            className={`
              group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-base
              transition-all duration-300 overflow-hidden
              ${
                selectedVisa
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl shadow-blue-200 hover:shadow-2xl hover:shadow-blue-300 hover:scale-[1.02]"
                  : "bg-stone-100 text-stone-400 cursor-not-allowed"
              }
            `}
          >
            {selectedVisa && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            )}

            <Sparkles
              size={20}
              className={selectedVisa ? "text-blue-200" : ""}
            />
            <span>Build Application</span>
            <ArrowRight
              size={18}
              className={`transition-transform duration-300 ${selectedVisa ? "group-hover:translate-x-1" : ""}`}
            />
          </button>

          <p className="mt-3 text-xs text-stone-400">
            {selectedVisa
              ? `Ready to build your ${VISA_TYPES.find((v) => v.id === selectedVisa)?.name} application`
              : "Select a visa type above to continue"}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
