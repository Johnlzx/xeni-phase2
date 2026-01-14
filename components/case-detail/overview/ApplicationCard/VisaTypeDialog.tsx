"use client";

import { useState, useEffect } from "react";
import {
  Briefcase,
  GraduationCap,
  Users,
  Plane,
  Lightbulb,
  Star,
  Clock,
  CheckCircle2,
  Shield,
  FileText,
  Check,
  Circle,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { VisaType } from "@/types";
import { useCaseDetailStore, useDocumentGroups } from "@/store/case-detail-store";

// Visa Types Configuration
export const VISA_TYPES_CONFIG: {
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
export function getVisaConfig(visaId: VisaType) {
  return VISA_TYPES_CONFIG.find((v) => v.id === visaId);
}

// Visa Type Card Component
function VisaTypeCard({
  visa,
  isSelected,
  onSelect,
}: {
  visa: (typeof VISA_TYPES_CONFIG)[0];
  isSelected: boolean;
  onSelect: () => void;
}) {
  const Icon = visa.icon;

  return (
    <button
      onClick={onSelect}
      className={cn(
        "group relative text-left p-4 rounded-xl border-2 transition-colors",
        isSelected
          ? "border-[#0E4268] bg-[#0E4268]/5"
          : "border-stone-200 bg-white hover:border-stone-300",
      )}
    >
      {isSelected && (
        <div className="absolute top-3 right-3 size-5 bg-[#0E4268] rounded-full flex items-center justify-center">
          <CheckCircle2 size={12} className="text-white" />
        </div>
      )}

      <div
        className={cn(
          "size-10 rounded-lg flex items-center justify-center mb-3",
          visa.bgColor,
        )}
      >
        <Icon size={20} className={visa.color} />
      </div>

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

      <div className="flex items-center gap-1 text-[10px] text-stone-400">
        <Clock size={10} />
        <span>{visa.processingTime}</span>
      </div>
    </button>
  );
}

// Step 1: Visa Selection
function VisaSelectionStep({
  selectedVisa,
  onSelectVisa,
  onNext,
  onCancel,
}: {
  selectedVisa: VisaType | null;
  onSelectVisa: (visa: VisaType) => void;
  onNext: () => void;
  onCancel: () => void;
}) {
  return (
    <>
      <DialogHeader className="px-6 pt-6 pb-4 border-b border-stone-100">
        <div className="flex items-center gap-2 mb-2">
          <div className="size-8 rounded-lg bg-[#0E4268]/5 flex items-center justify-center">
            <Shield size={16} className="text-[#0E4268]" />
          </div>
          <DialogTitle className="text-balance">Select Visa Type</DialogTitle>
        </div>
        <DialogDescription className="text-pretty">
          Choose a visa category to proceed with document analysis
        </DialogDescription>
      </DialogHeader>

      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {VISA_TYPES_CONFIG.map((visa) => (
            <VisaTypeCard
              key={visa.id}
              visa={visa}
              isSelected={selectedVisa === visa.id}
              onSelect={() => onSelectVisa(visa.id)}
            />
          ))}
        </div>
      </div>

      <DialogFooter className="px-6 py-4 border-t border-stone-100 bg-stone-50 flex-row justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onNext}
          disabled={!selectedVisa}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2",
            selectedVisa
              ? "bg-[#0E4268] text-white hover:bg-[#0a3555]"
              : "bg-stone-100 text-stone-400 cursor-not-allowed",
          )}
        >
          Continue
          <ArrowRight size={14} />
        </button>
      </DialogFooter>
    </>
  );
}

// Step 2: Ready for Analysis
function ReadyForAnalysisStep({
  selectedVisa,
  onBack,
  onStartAnalysis,
  isStarting,
}: {
  selectedVisa: VisaType | null;
  onBack: () => void;
  onStartAnalysis: () => void;
  isStarting: boolean;
}) {
  const documentGroups = useDocumentGroups();
  const visaConfig = selectedVisa ? getVisaConfig(selectedVisa) : null;

  // Get ready files (reviewed status, excluding unclassified)
  const readyGroups = documentGroups.filter(
    (g) => g.id !== "unclassified" && g.status === "reviewed",
  );
  const pendingGroups = documentGroups.filter(
    (g) => g.id !== "unclassified" && g.status === "pending",
  );

  const readyFiles = readyGroups.flatMap((g) =>
    g.files.filter((f) => !f.isRemoved),
  );
  const totalPages = readyFiles.reduce((sum, f) => sum + (f.pages || 1), 0);

  return (
    <>
      <DialogHeader className="px-6 pt-6 pb-4 border-b border-stone-100">
        <div className="flex items-center gap-2 mb-2">
          {visaConfig && (
            <div
              className={cn(
                "size-8 rounded-lg flex items-center justify-center",
                visaConfig.bgColor,
              )}
            >
              <visaConfig.icon size={16} className={visaConfig.color} />
            </div>
          )}
          <DialogTitle className="text-balance">Ready for Analysis</DialogTitle>
        </div>
        <DialogDescription className="text-pretty">
          The following reviewed documents will be analyzed to extract
          information for your {visaConfig?.shortName} application
        </DialogDescription>
      </DialogHeader>

      <div className="p-6">
        {/* Document List */}
        <div className="space-y-2 max-h-[280px] overflow-y-auto">
          {/* Ready Groups */}
          {readyGroups.map((group) => {
            const files = group.files.filter((f) => !f.isRemoved);
            const pages = files.reduce((sum, f) => sum + (f.pages || 1), 0);
            return (
              <div
                key={group.id}
                className="flex items-center justify-between py-2 px-3 rounded-lg bg-emerald-50/50"
              >
                <div className="flex items-center gap-2">
                  <Check className="size-4 text-emerald-600" />
                  <span className="text-sm text-stone-700">{group.title}</span>
                </div>
                <span className="text-xs text-stone-500 tabular-nums">
                  {pages} {pages === 1 ? "page" : "pages"}
                </span>
              </div>
            );
          })}

          {/* Pending Groups */}
          {pendingGroups.map((group) => {
            const files = group.files.filter((f) => !f.isRemoved);
            const pages = files.reduce((sum, f) => sum + (f.pages || 1), 0);
            if (pages === 0) return null;
            return (
              <div
                key={group.id}
                className="flex items-center justify-between py-2 px-3 rounded-lg bg-stone-50"
              >
                <div className="flex items-center gap-2">
                  <Circle className="size-4 text-stone-400" />
                  <span className="text-sm text-stone-500">{group.title}</span>
                  <span className="text-xs text-stone-400">(pending review)</span>
                </div>
                <span className="text-xs text-stone-400 tabular-nums">
                  {pages} {pages === 1 ? "page" : "pages"}
                </span>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-4 pt-4 border-t border-stone-100">
          {readyFiles.length > 0 ? (
            <div className="flex items-center gap-2 text-xs text-stone-600">
              <FileText className="size-3.5" />
              <span className="tabular-nums">
                {readyGroups.length}{" "}
                {readyGroups.length === 1 ? "category" : "categories"} ready
              </span>
              <span className="text-stone-400">·</span>
              <span className="tabular-nums">{totalPages} pages total</span>
            </div>
          ) : (
            <div className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
              No documents ready for analysis. Please review documents first.
            </div>
          )}
        </div>
      </div>

      <DialogFooter className="px-6 py-4 border-t border-stone-100 bg-stone-50 flex-row justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-lg transition-colors flex items-center gap-1"
        >
          <ChevronLeft size={14} />
          Change Visa
        </button>
        <button
          onClick={onStartAnalysis}
          disabled={readyFiles.length === 0 || isStarting}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2",
            readyFiles.length > 0 && !isStarting
              ? "bg-[#0E4268] text-white hover:bg-[#0a3555]"
              : "bg-stone-100 text-stone-400 cursor-not-allowed",
          )}
        >
          {isStarting ? "Starting..." : "Start Analysis"}
          {!isStarting && <ArrowRight size={14} />}
        </button>
      </DialogFooter>
    </>
  );
}

interface VisaTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VisaTypeDialog({ open, onOpenChange }: VisaTypeDialogProps) {
  const currentVisaType = useCaseDetailStore((state) => state.selectedVisaType);
  const setVisaType = useCaseDetailStore((state) => state.setVisaType);
  const initFormSchema = useCaseDetailStore((state) => state.initFormSchema);
  const startAnalysis = useCaseDetailStore((state) => state.startAnalysis);

  // Step 1 = visa selection, Step 2 = ready for analysis
  const [step, setStep] = useState<1 | 2>(currentVisaType ? 2 : 1);
  const [localSelectedVisa, setLocalSelectedVisa] = useState<VisaType | null>(
    currentVisaType,
  );
  const [isStarting, setIsStarting] = useState(false);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      // If visa already selected, go to step 2
      setStep(currentVisaType ? 2 : 1);
      setLocalSelectedVisa(currentVisaType);
      setIsStarting(false);
    }
  }, [open, currentVisaType]);

  const handleNext = () => {
    if (localSelectedVisa) {
      // Save visa selection and initialize form schema
      setVisaType(localSelectedVisa);
      initFormSchema(localSelectedVisa);
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleCancel = () => {
    setLocalSelectedVisa(currentVisaType);
    onOpenChange(false);
  };

  const handleStartAnalysis = async () => {
    setIsStarting(true);
    // Ensure visa is saved if changed
    if (localSelectedVisa && localSelectedVisa !== currentVisaType) {
      setVisaType(localSelectedVisa);
      initFormSchema(localSelectedVisa);
    }
    // Close dialog immediately, analysis runs in background
    onOpenChange(false);
    // Start analysis
    await startAnalysis();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white p-0" hideCloseButton>
        {step === 1 && (
          <VisaSelectionStep
            selectedVisa={localSelectedVisa}
            onSelectVisa={setLocalSelectedVisa}
            onNext={handleNext}
            onCancel={handleCancel}
          />
        )}
        {step === 2 && (
          <ReadyForAnalysisStep
            selectedVisa={localSelectedVisa}
            onBack={handleBack}
            onStartAnalysis={handleStartAnalysis}
            isStarting={isStarting}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
