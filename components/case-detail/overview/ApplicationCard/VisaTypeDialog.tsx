"use client";

import { useState, useEffect } from "react";
import {
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
import { VISA_TYPE_ICONS } from "@/data/visa-types";

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
      <p className="text-xs text-stone-500 leading-relaxed line-clamp-2 text-pretty">
        {visa.description}
      </p>
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
  onClose,
  isStarting,
}: {
  selectedVisa: VisaType | null;
  onBack: () => void;
  onStartAnalysis: () => void;
  onClose: () => void;
  isStarting: boolean;
}) {
  const documentGroups = useDocumentGroups();
  const setActiveNav = useCaseDetailStore((state) => state.setActiveNav);
  const uploadDocuments = useCaseDetailStore((state) => state.uploadDocuments);
  const visaConfig = selectedVisa ? getVisaConfig(selectedVisa) : null;

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

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

  const hasNoReadyDocuments = readyFiles.length === 0;

  // Handle going to documents page
  const handleGoToDocuments = () => {
    onClose();
    setActiveNav("documents");
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setUploadedFiles(Array.from(files));
    }
  };

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files) {
      setUploadedFiles(Array.from(files));
    }
  };

  // Handle submit upload
  const handleSubmitUpload = async () => {
    setIsUploading(true);
    // Simulate upload and trigger document processing
    uploadDocuments();
    onClose();
  };

  // Remove a file from selection
  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Empty state - no ready documents
  if (hasNoReadyDocuments) {
    return (
      <>
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="size-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <FileText size={20} className="text-amber-600" />
            </div>
            <div>
              <DialogTitle className="text-balance">
                Upload Documents
              </DialogTitle>
              <DialogDescription className="text-pretty mt-0.5">
                Add files to continue with your application
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6">
          {/* Uploaded Files Display */}
          {uploadedFiles.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-stone-200 bg-white"
                  >
                    <div className="size-6 rounded bg-rose-100 flex items-center justify-center shrink-0">
                      <FileText size={12} className="text-rose-600" />
                    </div>
                    <span className="text-sm text-stone-700 max-w-[180px] truncate">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="size-5 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
                      aria-label={`Remove ${file.name}`}
                    >
                      <span className="text-lg leading-none">&times;</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Zone */}
          <label
            className={cn(
              "block border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors",
              "border-stone-200 hover:border-stone-300 hover:bg-stone-50",
            )}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <input
              type="file"
              className="hidden"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
            />
            <div className="size-12 mx-auto mb-3 rounded-full bg-stone-100 flex items-center justify-center">
              <ArrowRight size={24} className="text-stone-400 -rotate-90" />
            </div>
            <p className="text-sm font-medium text-stone-800">
              Drop files here or click to browse
            </p>
            <p className="text-xs text-stone-500 mt-1">
              PDF, JPG, PNG supported
            </p>
          </label>

          {/* Info text */}
          <p className="text-xs text-stone-500 mt-4 text-center text-pretty">
            After upload, you'll need to review and confirm documents in the Documents section
          </p>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-stone-100 bg-stone-50 flex-row justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          {uploadedFiles.length > 0 ? (
            <button
              onClick={handleSubmitUpload}
              disabled={isUploading}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                isUploading
                  ? "bg-stone-100 text-stone-400"
                  : "bg-[#0E4268] text-white hover:bg-[#0a3555]",
              )}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          ) : (
            <button
              onClick={handleGoToDocuments}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-[#0E4268] text-white hover:bg-[#0a3555] transition-colors"
            >
              Go to Documents
            </button>
          )}
        </DialogFooter>
      </>
    );
  }

  // Has ready documents
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
          <div className="flex items-center gap-2 text-xs text-stone-600">
            <FileText className="size-3.5" />
            <span className="tabular-nums">
              {readyGroups.length}{" "}
              {readyGroups.length === 1 ? "category" : "categories"} ready
            </span>
            <span className="text-stone-400">·</span>
            <span className="tabular-nums">{totalPages} pages total</span>
          </div>
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
          disabled={isStarting}
          className={cn(
            "px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2",
            !isStarting
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
            onClose={handleCancel}
            isStarting={isStarting}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
