"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown,
  ChevronRight,
  Check,
  CheckCircle2,
  Circle,
  AlertCircle,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  MapPin,
  Calendar,
  CreditCard,
  Shield,
  Plane,
  Heart,
  Building2,
  Clock,
  Sparkles,
  ArrowRight,
  Edit3,
  Eye,
  Lock,
} from "lucide-react";
import { VisaType } from "@/types";

// Checklist item status
type ItemStatus = "complete" | "partial" | "pending" | "locked";

interface ChecklistItem {
  id: string;
  label: string;
  status: ItemStatus;
  value?: string;
  source?: "extracted" | "questionnaire" | "manual";
  sourceDocument?: string;
  required: boolean;
  editable?: boolean;
}

interface ChecklistSection {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  items: ChecklistItem[];
  progress: number;
}

interface ApplicationChecklistViewProps {
  visaType: VisaType;
  answers: Record<string, unknown>;
  onStartAutoFill: () => void;
  onBack?: () => void;
}

// Generate checklist based on visa type and answers
const generateChecklist = (
  visaType: VisaType,
  answers: Record<string, unknown>,
): ChecklistSection[] => {
  // Base sections for all visa types
  const sections: ChecklistSection[] = [
    {
      id: "personal",
      title: "Personal Details",
      icon: User,
      description: "Basic information about the applicant",
      progress: 75,
      items: [
        {
          id: "full_name",
          label: "Full Name",
          status: "complete",
          value: "Zhang Wei",
          source: "extracted",
          sourceDocument: "Passport",
          required: true,
        },
        {
          id: "dob",
          label: "Date of Birth",
          status: "complete",
          value: "15 March 1990",
          source: "extracted",
          sourceDocument: "Passport",
          required: true,
        },
        {
          id: "nationality",
          label: "Nationality",
          status: "complete",
          value: "Chinese",
          source: "extracted",
          sourceDocument: "Passport",
          required: true,
        },
        {
          id: "passport_number",
          label: "Passport Number",
          status: "complete",
          value: "E12345678",
          source: "extracted",
          sourceDocument: "Passport",
          required: true,
        },
        {
          id: "passport_expiry",
          label: "Passport Expiry",
          status: "complete",
          value: "15 March 2029",
          source: "extracted",
          sourceDocument: "Passport",
          required: true,
        },
        {
          id: "current_address",
          label: "Current Address",
          status: "pending",
          required: true,
          editable: true,
        },
        {
          id: "phone",
          label: "Phone Number",
          status: "pending",
          required: true,
          editable: true,
        },
        {
          id: "email",
          label: "Email Address",
          status: "pending",
          required: true,
          editable: true,
        },
      ],
    },
    {
      id: "travel_history",
      title: "Travel History",
      icon: Plane,
      description: "Previous UK visits and travel records",
      progress: 50,
      items: [
        {
          id: "previous_uk",
          label: "Previous UK Visits",
          status: answers.previous_uk_visa === "yes" ? "partial" : "complete",
          value:
            answers.previous_uk_visa === "yes"
              ? "Yes - details needed"
              : "No previous visits",
          source: "questionnaire",
          required: true,
        },
        {
          id: "current_location",
          label: "Current Location",
          status: "complete",
          value:
            answers.applicant_location === "uk"
              ? "In the UK"
              : "Outside the UK",
          source: "questionnaire",
          required: true,
        },
        {
          id: "travel_stamps",
          label: "Travel History (5 years)",
          status: "partial",
          value: "3 countries detected",
          source: "extracted",
          sourceDocument: "Passport",
          required: true,
        },
        {
          id: "visa_refusals",
          label: "Previous Visa Refusals",
          status: "pending",
          required: true,
          editable: true,
        },
      ],
    },
    {
      id: "financial",
      title: "Financial Evidence",
      icon: CreditCard,
      description: "Proof of funds and financial stability",
      progress: 60,
      items: [
        {
          id: "bank_statements",
          label: "Bank Statements (6 months)",
          status: "complete",
          value: "12 pages uploaded",
          source: "extracted",
          sourceDocument: "Bank Statement",
          required: true,
        },
        {
          id: "current_balance",
          label: "Current Balance",
          status: "partial",
          value: "Extraction pending review",
          source: "extracted",
          sourceDocument: "Bank Statement",
          required: true,
        },
        {
          id: "income_source",
          label: "Source of Income",
          status: "pending",
          required: true,
          editable: true,
        },
        {
          id: "sponsorship",
          label: "Financial Sponsorship",
          status: "pending",
          required: false,
          editable: true,
        },
      ],
    },
  ];

  // Add visa-specific sections
  if (visaType === "skilled-worker") {
    sections.push({
      id: "employment",
      title: "Employment & Sponsorship",
      icon: Briefcase,
      description: "Job offer and employer details",
      progress: answers.cos_received === "yes" ? 80 : 30,
      items: [
        {
          id: "cos_number",
          label: "Certificate of Sponsorship",
          status: answers.cos_received === "yes" ? "complete" : "pending",
          value:
            answers.cos_received === "yes"
              ? "CoS received"
              : "Awaiting from employer",
          source: "questionnaire",
          required: true,
        },
        {
          id: "employer_name",
          label: "Employer Name",
          status: "pending",
          required: true,
          editable: true,
        },
        {
          id: "job_title",
          label: "Job Title",
          status: "pending",
          required: true,
          editable: true,
        },
        {
          id: "salary",
          label: "Annual Salary",
          status: answers.salary_threshold === "yes" ? "complete" : "partial",
          value:
            answers.salary_threshold === "yes"
              ? "Meets threshold"
              : "Needs verification",
          source: "questionnaire",
          required: true,
        },
        {
          id: "start_date",
          label: "Employment Start Date",
          status: "partial",
          value:
            answers.job_start_date === "within_month"
              ? "Within 1 month"
              : answers.job_start_date === "1_3_months"
                ? "1-3 months"
                : "3+ months",
          source: "questionnaire",
          required: true,
        },
        {
          id: "employment_letter",
          label: "Employment Letter",
          status: "complete",
          value: "5 pages uploaded",
          source: "extracted",
          sourceDocument: "Employment Letter",
          required: true,
        },
      ],
    });
  }

  if (visaType === "student") {
    sections.push({
      id: "education",
      title: "Course & Institution",
      icon: GraduationCap,
      description: "University and course details",
      progress: answers.cas_received === "yes" ? 70 : 20,
      items: [
        {
          id: "cas_number",
          label: "CAS Number",
          status: answers.cas_received === "yes" ? "complete" : "pending",
          value:
            answers.cas_received === "yes"
              ? "CAS received"
              : "Awaiting from institution",
          source: "questionnaire",
          required: true,
        },
        {
          id: "institution",
          label: "Institution Name",
          status: "pending",
          required: true,
          editable: true,
        },
        {
          id: "course_name",
          label: "Course Name",
          status: "pending",
          required: true,
          editable: true,
        },
        {
          id: "course_level",
          label: "Course Level",
          status: "complete",
          value:
            answers.course_level === "undergraduate"
              ? "Undergraduate"
              : answers.course_level === "postgraduate"
                ? "Postgraduate"
                : answers.course_level === "phd"
                  ? "PhD/Doctorate"
                  : "Other",
          source: "questionnaire",
          required: true,
        },
        {
          id: "course_start",
          label: "Course Start Date",
          status: "partial",
          value:
            answers.course_start === "within_month"
              ? "Within 1 month"
              : answers.course_start === "1_3_months"
                ? "1-3 months"
                : "3+ months",
          source: "questionnaire",
          required: true,
        },
      ],
    });
  }

  // Add supporting documents section
  sections.push({
    id: "documents",
    title: "Supporting Documents",
    icon: FileText,
    description: "Required documentation for your application",
    progress: 45,
    items: [
      {
        id: "passport_copy",
        label: "Passport Copy (all pages)",
        status: "complete",
        value: "6 pages uploaded",
        source: "extracted",
        sourceDocument: "Passport",
        required: true,
      },
      {
        id: "photo",
        label: "Passport Photo",
        status: "pending",
        required: true,
        editable: true,
      },
      {
        id: "tb_test",
        label: "TB Test Certificate",
        status:
          answers.applicant_location === "outside" ? "pending" : "complete",
        value:
          answers.applicant_location === "outside"
            ? undefined
            : "Not required (in UK)",
        required: answers.applicant_location === "outside",
      },
      {
        id: "english_proof",
        label: "English Language Proof",
        status: "pending",
        required: visaType !== "visitor",
        editable: true,
      },
    ],
  });

  return sections;
};

// Status badge component
const StatusBadge = ({ status }: { status: ItemStatus }) => {
  const config = {
    complete: {
      bg: "bg-emerald-100",
      text: "text-emerald-700",
      icon: CheckCircle2,
      label: "Complete",
    },
    partial: {
      bg: "bg-amber-100",
      text: "text-amber-700",
      icon: AlertCircle,
      label: "Needs review",
    },
    pending: {
      bg: "bg-stone-100",
      text: "text-stone-600",
      icon: Circle,
      label: "Pending",
    },
    locked: {
      bg: "bg-stone-100",
      text: "text-stone-400",
      icon: Lock,
      label: "Locked",
    },
  };

  const { bg, text, icon: Icon, label } = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}
    >
      <Icon size={12} />
      {label}
    </span>
  );
};

// Source badge component
const SourceBadge = ({
  source,
  document,
}: {
  source: string;
  document?: string;
}) => {
  if (source === "extracted") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
        <FileText size={10} />
        From {document}
      </span>
    );
  }
  if (source === "questionnaire") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-blue-600">
        <Sparkles size={10} />
        From questionnaire
      </span>
    );
  }
  return null;
};

// Checklist item row
const ChecklistItemRow = ({ item }: { item: ChecklistItem }) => {
  return (
    <div className="flex items-center gap-4 py-3 px-4 hover:bg-stone-50 rounded-lg transition-colors">
      {/* Status icon */}
      <div className="flex-shrink-0">
        {item.status === "complete" ? (
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
            <Check size={14} className="text-white" />
          </div>
        ) : item.status === "partial" ? (
          <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
            <AlertCircle size={14} className="text-white" />
          </div>
        ) : item.status === "locked" ? (
          <div className="w-6 h-6 rounded-full bg-stone-300 flex items-center justify-center">
            <Lock size={12} className="text-white" />
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full border-2 border-stone-300" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p
            className={`text-sm font-medium ${item.status === "locked" ? "text-stone-400" : "text-stone-800"}`}
          >
            {item.label}
          </p>
          {!item.required && (
            <span className="text-[10px] text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
              Optional
            </span>
          )}
        </div>
        {item.value && (
          <p className="text-sm text-stone-500 mt-0.5">{item.value}</p>
        )}
        {item.source && (
          <SourceBadge source={item.source} document={item.sourceDocument} />
        )}
      </div>

      {/* Actions */}
      <div className="flex-shrink-0 flex items-center gap-2">
        {item.editable && item.status !== "complete" && (
          <button className="p-1.5 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Edit3 size={14} />
          </button>
        )}
        {item.status === "complete" && (
          <button className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors">
            <Eye size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

// Section component
const ChecklistSectionCard = ({
  section,
  isExpanded,
  onToggle,
  index,
}: {
  section: ChecklistSection;
  isExpanded: boolean;
  onToggle: () => void;
  index: number;
}) => {
  const Icon = section.icon;
  const completedItems = section.items.filter(
    (i) => i.status === "complete",
  ).length;
  const totalRequired = section.items.filter((i) => i.required).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm"
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-5 hover:bg-stone-50 transition-colors"
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-stone-100 to-stone-50 flex items-center justify-center">
          <Icon size={22} className="text-stone-600" />
        </div>

        <div className="flex-1 text-left">
          <h3 className="font-semibold text-stone-800">{section.title}</h3>
          <p className="text-sm text-stone-500">{section.description}</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-stone-700">
              {completedItems}/{totalRequired}
            </p>
            <p className="text-xs text-stone-400">completed</p>
          </div>

          <div className="w-16 h-2 bg-stone-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                section.progress === 100
                  ? "bg-emerald-500"
                  : section.progress >= 50
                    ? "bg-blue-500"
                    : "bg-amber-500"
              }`}
              style={{ width: `${section.progress}%` }}
            />
          </div>

          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight size={20} className="text-stone-400" />
          </motion.div>
        </div>
      </button>

      {/* Items */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-stone-100"
          >
            <div className="p-2">
              {section.items.map((item) => (
                <ChecklistItemRow key={item.id} item={item} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Main checklist view
export function ApplicationChecklistView({
  visaType,
  answers,
  onStartAutoFill,
  onBack,
}: ApplicationChecklistViewProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["personal"]),
  );
  const sections = generateChecklist(visaType, answers);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  // Calculate overall progress
  const totalItems = sections.reduce(
    (sum, s) => sum + s.items.filter((i) => i.required).length,
    0,
  );
  const completedItems = sections.reduce(
    (sum, s) =>
      sum + s.items.filter((i) => i.required && i.status === "complete").length,
    0,
  );
  const overallProgress = Math.round((completedItems / totalItems) * 100);

  return (
    <div className="h-full flex flex-col bg-stone-50">
      {/* Header */}
      <div className="px-8 py-6 border-b border-stone-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield size={18} className="text-[#0E4268]" />
              <span className="text-sm font-medium text-[#0E4268]">
                {visaType
                  .replace("-", " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}{" "}
                Visa
              </span>
              {onBack && (
                <button
                  onClick={onBack}
                  className="ml-2 text-xs text-stone-500 hover:text-stone-700 underline"
                >
                  Change visa type
                </button>
              )}
            </div>
            <h1 className="text-2xl font-bold text-stone-900 text-balance">
              Application Checklist
            </h1>
            <p className="text-sm text-stone-500 mt-1 text-pretty">
              Complete all required fields to enable auto-fill
            </p>
          </div>

          {/* Overall progress */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-3xl font-bold text-stone-900 tabular-nums">
                {overallProgress}%
              </p>
              <p className="text-sm text-stone-500">Complete</p>
            </div>
            <div className="size-24 relative">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="none"
                  stroke="#e7e5e4"
                  strokeWidth="8"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="none"
                  stroke={overallProgress === 100 ? "#10b981" : "#3b82f6"}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${overallProgress * 2.51} 251`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                {overallProgress === 100 ? (
                  <CheckCircle2 size={28} className="text-emerald-500" />
                ) : (
                  <Clock size={24} className="text-blue-500" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl mx-auto space-y-4">
          {sections.map((section, index) => (
            <ChecklistSectionCard
              key={section.id}
              section={section}
              isExpanded={expandedSections.has(section.id)}
              onToggle={() => toggleSection(section.id)}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="px-8 py-4 bg-white border-t border-stone-200">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-sm text-stone-600">
              <span className="font-medium text-stone-800">
                {completedItems}
              </span>{" "}
              of{" "}
              <span className="font-medium text-stone-800">{totalItems}</span>{" "}
              required fields completed
            </p>
            <p className="text-xs text-stone-400">
              {totalItems - completedItems} fields remaining before auto-fill
            </p>
          </div>

          <button
            onClick={onStartAutoFill}
            disabled={overallProgress < 100}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all
              ${
                overallProgress >= 100
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:shadow-xl"
                  : "bg-stone-100 text-stone-400 cursor-not-allowed"
              }
            `}
          >
            <Sparkles size={18} />
            Start Auto-Fill
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
