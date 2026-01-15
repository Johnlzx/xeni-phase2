"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Globe,
  Hash,
  User,
  FileText,
  Check,
  CreditCard,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VISA_TYPES } from "@/data/constants";
import { MOCK_USERS } from "@/data/users";
import type { PassportInfo, VisaType } from "@/types";

interface CreateCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCaseData) => void;
}

interface CreateCaseData {
  visaType: VisaType;
  referenceNumber: string;
  advisorId: string;
  assistantId?: string;
  passport: PassportInfo;
  caseNotesFile: File;
  passportFile: File;
}

// Mock passport data for demo
const MOCK_PASSPORT: PassportInfo = {
  givenNames: "Bob",
  surname: "Brown",
  nationality: "British",
  countryOfBirth: "France",
  dateOfBirth: "1990-01-23",
  sex: "M",
  dateOfIssue: "2021-01-23",
  dateOfExpiry: "2026-01-23",
  passportNumber: "AT38249065",
  mrzLine1: "P<GRCKOUTSAIMANI<<ELENI<<<<<<<<<<<<<<<<<<<<<",
  mrzLine2: "AT38249065GRC8109149F2611309<<<<<<<<<<<<<<06",
};

// Analyzing animation component
function AnalyzingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative w-16 h-20">
        {/* Document shape */}
        <div className="absolute inset-0 bg-white rounded-lg shadow-sm border border-stone-200 flex flex-col items-center justify-center p-2.5 gap-1">
          <motion.div
            className="w-5 h-1 bg-blue-400 rounded-full"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <motion.div
            className="w-8 h-1 bg-blue-400 rounded-full"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.15 }}
          />
          <motion.div
            className="w-6 h-1 bg-blue-400 rounded-full"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
          />
          <motion.div
            className="w-8 h-1 bg-blue-400 rounded-full"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.45 }}
          />
          <motion.div
            className="w-5 h-1 bg-blue-400 rounded-full"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.6 }}
          />
        </div>
        {/* Scanning line */}
        <motion.div
          className="absolute left-0 right-0 h-px bg-blue-500 shadow-[0_0_8px_2px_rgba(59,130,246,0.5)]"
          animate={{ top: ["10%", "90%", "10%"] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}

// Extracted data display card
function ExtractedDataCard({ passport }: { passport: PassportInfo }) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");
  };

  return (
    <div className="bg-stone-100 rounded-xl p-4">
      {/* Data grid - 4 columns */}
      <div className="grid grid-cols-4 gap-x-4 gap-y-3">
        <div>
          <p className="text-[11px] text-stone-500 mb-0.5">Given names</p>
          <p className="text-sm font-semibold text-stone-900 truncate">
            {passport.givenNames}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-stone-500 mb-0.5">Nationality</p>
          <p className="text-sm font-semibold text-stone-900 truncate">
            {passport.nationality}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-stone-500 mb-0.5">Date of birth</p>
          <p className="text-sm font-semibold text-stone-900 tabular-nums">
            {formatDate(passport.dateOfBirth)}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-stone-500 mb-0.5">Date of issue</p>
          <p className="text-sm font-semibold text-stone-900 tabular-nums">
            {formatDate(passport.dateOfIssue)}
          </p>
        </div>

        <div>
          <p className="text-[11px] text-stone-500 mb-0.5">Surname</p>
          <p className="text-sm font-semibold text-stone-900 truncate">
            {passport.surname}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-stone-500 mb-0.5">Country of birth</p>
          <p className="text-sm font-semibold text-stone-900 truncate">
            {passport.countryOfBirth}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-stone-500 mb-0.5">Sex</p>
          <p className="text-sm font-semibold text-stone-900">{passport.sex}</p>
        </div>
        <div>
          <p className="text-[11px] text-stone-500 mb-0.5">Date of expiry</p>
          <p className="text-sm font-semibold text-stone-900 tabular-nums">
            {formatDate(passport.dateOfExpiry)}
          </p>
        </div>
      </div>

      {/* MRZ Code */}
      {passport.mrzLine1 && passport.mrzLine2 && (
        <div className="mt-3 pt-3 border-t border-stone-200/60 font-mono text-[10px] text-stone-400 tracking-widest leading-relaxed overflow-hidden">
          <div className="truncate">{passport.mrzLine1}</div>
          <div className="truncate">{passport.mrzLine2}</div>
        </div>
      )}
    </div>
  );
}

// Compact upload slot component
function UploadSlot({
  label,
  icon: Icon,
  file,
  isAnalyzing,
  isComplete,
  accept,
  onUpload,
  onRemove,
}: {
  label: string;
  icon: typeof FileText;
  file: File | null;
  isAnalyzing: boolean;
  isComplete: boolean;
  accept: string;
  onUpload: (file: File) => void;
  onRemove: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) onUpload(droppedFile);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) onUpload(selectedFile);
  };

  // Analyzing state
  if (isAnalyzing) {
    return (
      <div className="flex-1 border border-stone-200 rounded-xl p-3 bg-stone-50">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-lg bg-blue-100 flex items-center justify-center">
            <div className="size-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-stone-700">Analyzing...</p>
            <p className="text-[11px] text-stone-500 truncate">
              {file?.name || "Processing"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Complete state
  if (isComplete && file) {
    return (
      <div className="flex-1 border border-emerald-200 rounded-xl p-3 bg-emerald-50/50">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-lg bg-emerald-100 flex items-center justify-center">
            <Check className="size-4 text-emerald-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-stone-700">{label}</p>
            <p className="text-[11px] text-emerald-600 truncate">{file.name}</p>
          </div>
          <button
            onClick={onRemove}
            className="shrink-0 p-1.5 text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
            aria-label={`Remove ${label}`}
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // Upload state
  return (
    <label
      className="flex-1 border border-dashed border-stone-300 rounded-xl p-3 cursor-pointer hover:border-stone-400 hover:bg-stone-50 transition-colors"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        accept={accept}
        onChange={handleChange}
      />
      <div className="flex items-center gap-2.5">
        <div className="size-9 rounded-lg bg-stone-100 flex items-center justify-center">
          <Icon className="size-4 text-stone-400" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-stone-700">{label}</p>
          <p className="text-[11px] text-rose-500">* Required</p>
        </div>
      </div>
    </label>
  );
}

// Select component
function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  icon,
  optional,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  icon?: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-1.5">
        {label}
        {optional && (
          <span className="text-stone-400 font-normal ml-1">(Optional)</span>
        )}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
            {icon}
          </div>
        )}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-900",
            "bg-white appearance-none cursor-pointer",
            "focus:outline-none focus:ring-2 focus:ring-[#0E4268]/20 focus:border-[#0E4268]",
            "transition-colors",
            icon && "pl-10"
          )}
        >
          {placeholder && (
            <option value="" className="text-stone-400">
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-stone-400 pointer-events-none" />
      </div>
    </div>
  );
}

export function CreateCaseModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateCaseModalProps) {
  // Case notes state
  const [caseNotesFile, setCaseNotesFile] = useState<File | null>(null);
  const [caseNotesAnalyzing, setCaseNotesAnalyzing] = useState(false);

  // Passport state (triggers extracted data display)
  const [passportFile, setPassportFile] = useState<File | null>(null);
  const [passportAnalyzing, setPassportAnalyzing] = useState(false);
  const [passportData, setPassportData] = useState<PassportInfo | null>(null);

  const [formData, setFormData] = useState({
    visaType: "",
    referenceNumber: "",
    advisorId: MOCK_USERS[0]?.id || "",
    assistantId: "",
  });

  const visaOptions = Object.entries(VISA_TYPES).map(([value, config]) => ({
    value,
    label: config.label,
  }));

  const userOptions = MOCK_USERS.filter((u) => u.role !== "applicant").map(
    (u) => ({
      value: u.id,
      label: u.name,
    })
  );

  // Handle case notes upload (async, doesn't block passport data display)
  const handleCaseNotesUpload = useCallback(async (file: File) => {
    setCaseNotesFile(file);
    setCaseNotesAnalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    setCaseNotesAnalyzing(false);
  }, []);

  const handleCaseNotesRemove = useCallback(() => {
    setCaseNotesFile(null);
    setCaseNotesAnalyzing(false);
  }, []);

  // Handle passport upload (triggers extracted data display)
  const handlePassportUpload = useCallback(async (file: File) => {
    setPassportFile(file);
    setPassportAnalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setPassportData(MOCK_PASSPORT);
    setPassportAnalyzing(false);
  }, []);

  const handlePassportRemove = useCallback(() => {
    setPassportFile(null);
    setPassportData(null);
  }, []);

  // Handle form submission
  const handleSubmit = () => {
    if (!caseNotesFile || !passportFile || !passportData || !formData.visaType) return;

    onSubmit({
      visaType: formData.visaType as VisaType,
      referenceNumber: formData.referenceNumber,
      advisorId: formData.advisorId,
      assistantId: formData.assistantId || undefined,
      passport: passportData,
      caseNotesFile: caseNotesFile,
      passportFile: passportFile,
    });
    handleClose();
  };

  // Handle modal close
  const handleClose = () => {
    setCaseNotesFile(null);
    setCaseNotesAnalyzing(false);
    setPassportFile(null);
    setPassportAnalyzing(false);
    setPassportData(null);
    setFormData({
      visaType: "",
      referenceNumber: "",
      advisorId: MOCK_USERS[0]?.id || "",
      assistantId: "",
    });
    onClose();
  };

  // Form validation - all required fields
  const isFormValid =
    caseNotesFile !== null &&
    !caseNotesAnalyzing &&
    passportFile !== null &&
    passportData !== null &&
    formData.visaType !== "";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h2 className="text-lg font-semibold text-stone-900">
            Create a New Case
          </h2>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="size-5 text-stone-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            {/* Document Upload Section */}
            <section className="space-y-3">
              {/* Extracted Data Card - shows after passport is analyzed */}
              <AnimatePresence>
                {passportData && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ExtractedDataCard passport={passportData} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Upload slots - always visible */}
              <div className="flex gap-3">
                <UploadSlot
                  label="Case Notes"
                  icon={FileText}
                  file={caseNotesFile}
                  isAnalyzing={caseNotesAnalyzing}
                  isComplete={!!caseNotesFile && !caseNotesAnalyzing}
                  accept=".pdf,.doc,.docx,.txt"
                  onUpload={handleCaseNotesUpload}
                  onRemove={handleCaseNotesRemove}
                />
                <UploadSlot
                  label="Passport"
                  icon={CreditCard}
                  file={passportFile}
                  isAnalyzing={passportAnalyzing}
                  isComplete={!!passportData}
                  accept=".pdf,.jpg,.jpeg,.png"
                  onUpload={handlePassportUpload}
                  onRemove={handlePassportRemove}
                />
              </div>
            </section>

            {/* Form Fields Section */}
            <section className="space-y-4">
              <SelectField
                label="Visa type"
                value={formData.visaType}
                onChange={(value) =>
                  setFormData({ ...formData, visaType: value })
                }
                options={visaOptions}
                placeholder="Select a visa type..."
                icon={<Globe className="size-4" />}
              />

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Reference number
                </label>
                <div className="relative">
                  <Hash className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Enter case's reference number"
                    value={formData.referenceNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        referenceNumber: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#0E4268]/20 focus:border-[#0E4268] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <SelectField
                  label="Advisor"
                  value={formData.advisorId}
                  onChange={(value) =>
                    setFormData({ ...formData, advisorId: value })
                  }
                  options={userOptions}
                  icon={<User className="size-4" />}
                />

                <SelectField
                  label="Assistant"
                  value={formData.assistantId}
                  onChange={(value) =>
                    setFormData({ ...formData, assistantId: value })
                  }
                  options={[
                    { value: "", label: "Select assistant" },
                    ...userOptions,
                  ]}
                  icon={<User className="size-4" />}
                />
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 border-t border-stone-100 bg-stone-50/50">
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className={cn(
              "w-full py-3 rounded-xl text-sm font-medium transition-colors",
              isFormValid
                ? "bg-[#0E4268] text-white hover:bg-[#0a3555]"
                : "bg-stone-200 text-stone-400 cursor-not-allowed"
            )}
          >
            Next
          </button>
        </div>
      </motion.div>
    </div>
  );
}
