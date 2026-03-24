"use client";

import { useState, useRef, useCallback } from "react";
import {
  ArrowLeft,
  Upload,
  Trash2,
  FileText,
  BookOpen,
  CreditCard,
  Landmark,
  Briefcase,
  Home,
  GraduationCap,
  Heart,
  Award,
  ScrollText,
  ShieldCheck,
} from "lucide-react";
import { CircularProgress } from "@/components/ui/circular-progress";
import { Badge } from "@/components/ui/custom-badge";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import type { TestCase, TestCaseDocument, TestCaseDocumentType } from "@/types/form-accuracy";

// ---------------------------------------------------------------------------
// File type display config
// ---------------------------------------------------------------------------

const FILE_TYPE_CONFIG: Record<TestCaseDocumentType, { label: string; icon: React.ElementType; variant: "success" | "error" | "warning" | "info" }> = {
  passport:              { label: "Passport",           icon: BookOpen,      variant: "info" },
  "national-id":         { label: "National ID",        icon: CreditCard,    variant: "info" },
  "bank-statement":      { label: "Bank Statement",     icon: Landmark,      variant: "warning" },
  "employment-letter":   { label: "Employment Letter",  icon: Briefcase,     variant: "success" },
  "proof-of-address":    { label: "Proof of Address",   icon: Home,          variant: "info" },
  "english-test":        { label: "English Test",       icon: GraduationCap, variant: "success" },
  "tb-certificate":      { label: "TB Certificate",     icon: Heart,         variant: "error" },
  "marriage-certificate": { label: "Marriage Cert",     icon: Heart,         variant: "warning" },
  "cos-letter":          { label: "CoS Letter",         icon: ScrollText,    variant: "success" },
  "cas-letter":          { label: "CAS Letter",         icon: ScrollText,    variant: "success" },
  "endorsement-letter":  { label: "Endorsement",        icon: Award,         variant: "info" },
  "life-in-uk-certificate": { label: "Life in UK",      icon: ShieldCheck,   variant: "success" },
  other:                 { label: "Other",              icon: FileText,      variant: "info" },
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getAccuracyColor(rate: number) {
  if (rate >= 0.95) return { text: "text-emerald-600", ring: "#10B981" };
  if (rate >= 0.90) return { text: "text-[#B08D5B]", ring: "#D4A96A" };
  return { text: "text-rose-500", ring: "#F43F5E" };
}

// ---------------------------------------------------------------------------
// CaseDetail Component
// ---------------------------------------------------------------------------

export function CaseDetail({
  testCase,
  visaTypeName,
  onBack,
}: {
  testCase: TestCase;
  visaTypeName: string;
  onBack: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"documents" | "extracted-data">("documents");
  const [documents, setDocuments] = useState<TestCaseDocument[]>(testCase.documents);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const color = getAccuracyColor(testCase.accuracy);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newDocs: TestCaseDocument[] = Array.from(files).map((file, i) => ({
      id: `upload-${Date.now()}-${i}`,
      fileName: file.name,
      fileType: "other" as TestCaseDocumentType,
      fileSize: file.size,
      mimeType: file.type || "application/pdf",
      uploadedAt: new Date().toISOString(),
      uploadedBy: "Admin",
    }));

    setDocuments((prev) => [...prev, ...newDocs]);
    toast.success(`${newDocs.length} file(s) uploaded`, {
      description: newDocs.map((d) => d.fileName).join(", "),
    });

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleDelete = useCallback((docId: string, fileName: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
    toast.success("Document removed", { description: fileName });
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-8 py-6">
      {/* Breadcrumb */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 transition-colors mb-4 cursor-pointer"
      >
        <ArrowLeft className="size-4" />
        <span>{visaTypeName}</span>
        <span className="text-stone-300">/</span>
        <span className="text-stone-700 font-medium">{testCase.name}</span>
      </button>

      {/* Header card */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 mb-6">
        <div className="flex items-start gap-6">
          <CircularProgress
            value={testCase.accuracy * 100}
            size={72}
            strokeWidth={6}
            color={color.ring}
          />
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-stone-800">{testCase.name}</h2>
            <p className="text-sm text-stone-500 mt-0.5">{testCase.description}</p>
            <div className="flex items-center gap-4 mt-3 text-xs text-stone-500">
              <span>{testCase.totalFieldCount} fields</span>
              <span>{documents.length} documents</span>
              <span>{testCase.totalRuns} runs</span>
              {testCase.lastTestedAt && (
                <span>Last tested: {formatDate(testCase.lastTestedAt, "short")}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-4">
        <button
          onClick={() => setActiveTab("documents")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
            activeTab === "documents"
              ? "bg-[#0E4268] text-white"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          Documents
        </button>
        <button
          onClick={() => setActiveTab("extracted-data")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
            activeTab === "extracted-data"
              ? "bg-[#0E4268] text-white"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          Extracted Data
        </button>
      </div>

      {/* Tab content */}
      {activeTab === "documents" ? (
        <DocumentsTab
          documents={documents}
          onUpload={handleUpload}
          onDelete={handleDelete}
          fileInputRef={fileInputRef}
        />
      ) : (
        <ExtractedDataTab sections={testCase.extractedData} />
      )}
    </div>
  );
}

// =============================================================================
// DOCUMENTS TAB
// =============================================================================

function DocumentsTab({
  documents,
  onUpload,
  onDelete,
  fileInputRef,
}: {
  documents: TestCaseDocument[];
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: (docId: string, fileName: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}) {
  return (
    <div className="space-y-4">
      {/* Upload area */}
      <div className="bg-white rounded-xl border border-dashed border-stone-300 p-6 flex flex-col items-center gap-3">
        <div className="size-10 rounded-lg bg-stone-100 flex items-center justify-center">
          <Upload className="size-5 text-stone-400" />
        </div>
        <p className="text-sm text-stone-500">
          Upload documents for this test case
        </p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-[#0E4268] text-white hover:bg-[#0B3554] transition-colors cursor-pointer"
        >
          Choose Files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          onChange={onUpload}
          className="hidden"
        />
        <p className="text-xs text-stone-400">PDF, JPG, PNG, DOC up to 10MB</p>
      </div>

      {/* Document list */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100">
              <th className="text-left text-xs font-medium text-stone-500 px-4 py-3">Document</th>
              <th className="text-left text-xs font-medium text-stone-500 px-4 py-3 w-32">Type</th>
              <th className="text-left text-xs font-medium text-stone-500 px-4 py-3 w-20">Size</th>
              <th className="text-left text-xs font-medium text-stone-500 px-4 py-3 w-28">Uploaded</th>
              <th className="text-right text-xs font-medium text-stone-500 px-4 py-3 w-16">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-sm text-stone-400">
                  No documents uploaded yet
                </td>
              </tr>
            ) : (
              documents.map((doc) => {
                const config = FILE_TYPE_CONFIG[doc.fileType] ?? FILE_TYPE_CONFIG.other;
                const Icon = config.icon;
                return (
                  <tr
                    key={doc.id}
                    className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                          <Icon className="size-4 text-stone-500" />
                        </div>
                        <span className="text-sm font-medium text-stone-700 truncate">
                          {doc.fileName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={config.variant}>{config.label}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-stone-500 tabular-nums">
                      {formatFileSize(doc.fileSize)}
                    </td>
                    <td className="px-4 py-3 text-xs text-stone-400">
                      {formatDate(doc.uploadedAt, "short")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onDelete(doc.id, doc.fileName)}
                        className="inline-flex items-center justify-center size-7 rounded-md text-stone-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete document"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =============================================================================
// EXTRACTED DATA TAB
// =============================================================================

function ExtractedDataTab({
  sections,
}: {
  sections: TestCase["extractedData"];
}) {
  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <div
          key={section.sectionName}
          className="bg-white rounded-xl border border-stone-200 overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-stone-100 bg-stone-50/50">
            <h4 className="text-sm font-medium text-stone-700">{section.sectionName}</h4>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {section.fields.map((field) => (
                <div key={field.fieldId} className="flex flex-col gap-0.5">
                  <span className="text-xs text-stone-500">{field.fieldLabel}</span>
                  <span className="text-sm font-medium text-stone-800">{field.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
      {sections.length === 0 && (
        <div className="bg-white rounded-xl border border-stone-200 py-12 text-center text-sm text-stone-400">
          No extracted data available
        </div>
      )}
    </div>
  );
}
