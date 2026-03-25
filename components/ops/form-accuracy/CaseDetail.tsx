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
  Eye,
  Download,
  ScanText,
  FileCheck,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import { Badge } from "@/components/ui/custom-badge";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import type { TestCase, TestCaseDocument, TestCaseDocumentType, ExtractionRunResult } from "@/types/form-accuracy";

// ---------------------------------------------------------------------------
// Helpers
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

function getAccuracyColorClass(rate: number) {
  if (rate >= 0.95) return "text-emerald-600";
  if (rate >= 0.90) return "text-[#B08D5B]";
  return "text-rose-500";
}

function getStatusBadge(rate: number) {
  if (rate >= 0.95) return { label: "Pass", variant: "success" as const };
  if (rate >= 0.90) return { label: "Warning", variant: "warning" as const };
  return { label: "Fail", variant: "error" as const };
}

// ---------------------------------------------------------------------------
// Tab config
// ---------------------------------------------------------------------------

const TAB_DESCRIPTIONS: Record<string, string> = {
  documents: "Source documents uploaded for this test case — passport, bank statements, certificates, etc.",
  "extracted-data": "Human-verified ground truth data and OCR extraction run history. Click a run to inspect the extracted fields.",
  "application-pdf": "Human-filled reference PDF and extension form-fill run history. Both use the same verified extracted data.",
};

type TabId = "documents" | "extracted-data" | "application-pdf";

// ---------------------------------------------------------------------------
// CaseDetail
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
  const [activeTab, setActiveTab] = useState<TabId>("documents");
  const [documents, setDocuments] = useState<TestCaseDocument[]>(testCase.documents);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    toast.success(`${newDocs.length} file(s) uploaded`);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleDelete = useCallback((docId: string, fileName: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
    toast.success("Document removed", { description: fileName });
  }, []);

  // Latest accuracy from most recent runs
  const latestOcr = testCase.extractionRuns[0]?.accuracy ?? testCase.accuracy;
  const latestFf = testCase.applicationPdfs.extensionRuns[0]?.accuracy ?? testCase.formFillAccuracy;

  const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: "documents", label: "Documents", icon: FileText },
    { id: "extracted-data", label: "Extracted Data", icon: ScanText },
    { id: "application-pdf", label: "Application PDF", icon: FileCheck },
  ];

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

      {/* Header — pure text, no visualization */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 mb-6">
        <h2 className="text-lg font-semibold text-stone-800">{testCase.name}</h2>
        <p className="text-sm text-stone-500 mt-0.5">{testCase.description}</p>
        <div className="flex items-center gap-4 mt-2 text-xs text-stone-500">
          <span>{testCase.totalFieldCount} fields</span>
          <span>{documents.length} documents</span>
          <span>{testCase.totalRuns} runs</span>
          {testCase.lastTestedAt && (
            <span>Last tested: {formatDate(testCase.lastTestedAt, "short")}</span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-2 text-xs">
          <span className="text-stone-400">Latest</span>
          <span className={`font-semibold tabular-nums ${getAccuracyColorClass(latestOcr)}`}>
            OCR {(latestOcr * 100).toFixed(1)}%
          </span>
          <span className="text-stone-300">·</span>
          <span className={`font-semibold tabular-nums ${getAccuracyColorClass(latestFf)}`}>
            Form Fill {(latestFf * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#0E4268] text-white"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              <Icon className="size-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-stone-400 mb-4 px-1">{TAB_DESCRIPTIONS[activeTab]}</p>

      {/* Tab content */}
      {activeTab === "documents" && (
        <DocumentsTab documents={documents} onUpload={handleUpload} onDelete={handleDelete} fileInputRef={fileInputRef} />
      )}
      {activeTab === "extracted-data" && (
        <ExtractedDataTab testCase={testCase} />
      )}
      {activeTab === "application-pdf" && (
        <ApplicationPdfTab testCase={testCase} />
      )}
    </div>
  );
}

// =============================================================================
// DOCUMENTS TAB
// =============================================================================

function DocumentsTab({
  documents, onUpload, onDelete, fileInputRef,
}: {
  documents: TestCaseDocument[];
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: (docId: string, fileName: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}) {
  return (
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
            <tr><td colSpan={5} className="py-12 text-center text-sm text-stone-400">No documents uploaded yet</td></tr>
          ) : (
            documents.map((doc) => {
              const config = FILE_TYPE_CONFIG[doc.fileType] ?? FILE_TYPE_CONFIG.other;
              const Icon = config.icon;
              return (
                <tr key={doc.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                        <Icon className="size-4 text-stone-500" />
                      </div>
                      <span className="text-sm font-medium text-stone-700 truncate">{doc.fileName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge variant={config.variant}>{config.label}</Badge></td>
                  <td className="px-4 py-3 text-sm text-stone-500 tabular-nums">{formatFileSize(doc.fileSize)}</td>
                  <td className="px-4 py-3 text-xs text-stone-400">{formatDate(doc.uploadedAt, "short")}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => onDelete(doc.id, doc.fileName)} className="inline-flex items-center justify-center size-7 rounded-md text-stone-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer" title="Delete">
                      <Trash2 className="size-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      <div className="flex items-center justify-between px-4 py-3 border-t border-stone-100 bg-stone-50/30">
        <span className="text-xs text-stone-400">{documents.length} document(s)</span>
        <div>
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 hover:border-stone-300 transition-colors cursor-pointer">
            <Upload className="size-3" />Upload
          </button>
          <input ref={fileInputRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={onUpload} className="hidden" />
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// EXTRACTED DATA TAB — Verified Baseline + Run List
// =============================================================================

function ExtractedDataTab({ testCase }: { testCase: TestCase }) {
  const [expandedGT, setExpandedGT] = useState(false);
  const [expandedRunId, setExpandedRunId] = useState<string | null>(null);

  const fieldCount = testCase.extractedData.reduce((s, sec) => s + sec.fields.length, 0);

  return (
    <div className="space-y-4">
      {/* Verified Baseline box */}
      <div className="bg-emerald-50/50 rounded-xl border border-emerald-200 overflow-hidden">
        <button
          onClick={() => setExpandedGT(!expandedGT)}
          className="w-full flex items-center justify-between px-4 py-3 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <ShieldAlert className="size-4 text-emerald-600" />
            <span className="text-sm font-semibold text-stone-800">Verified Baseline</span>
            <span className="text-xs text-stone-500">Human-verified · {fieldCount} fields</span>
          </div>
          {expandedGT ? <ChevronDown className="size-4 text-stone-400" /> : <ChevronRight className="size-4 text-stone-400" />}
        </button>
        {expandedGT && (
          <div className="border-t border-emerald-200 px-4 py-4 space-y-3">
            {testCase.extractedData.map((section) => (
              <div key={section.sectionName}>
                <h5 className="text-xs font-medium text-stone-500 mb-1.5">{section.sectionName}</h5>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                  {section.fields.map((f) => (
                    <div key={f.fieldId} className="flex flex-col">
                      <span className="text-[11px] text-stone-400">{f.fieldLabel}</span>
                      <span className="text-xs font-medium text-stone-700">{f.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Extraction Runs */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-stone-100">
          <h4 className="text-sm font-medium text-stone-700">Extraction Runs</h4>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100">
              <th className="text-left text-xs font-medium text-stone-500 px-4 py-2.5 w-8">#</th>
              <th className="text-left text-xs font-medium text-stone-500 px-4 py-2.5">Date</th>
              <th className="text-left text-xs font-medium text-stone-500 px-4 py-2.5 w-28">Accuracy</th>
              <th className="text-left text-xs font-medium text-stone-500 px-4 py-2.5 w-28">Fields Matched</th>
              <th className="text-left text-xs font-medium text-stone-500 px-4 py-2.5 w-20">Status</th>
            </tr>
          </thead>
          <tbody>
            {testCase.extractionRuns.map((run, idx) => {
              const badge = getStatusBadge(run.accuracy);
              const isExpanded = expandedRunId === run.id;
              return (
                <ExtractionRunRow
                  key={run.id}
                  run={run}
                  index={idx + 1}
                  badge={badge}
                  isExpanded={isExpanded}
                  onToggle={() => setExpandedRunId(isExpanded ? null : run.id)}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ExtractionRunRow({
  run, index, badge, isExpanded, onToggle,
}: {
  run: ExtractionRunResult;
  index: number;
  badge: { label: string; variant: "success" | "warning" | "error" };
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr
        onClick={onToggle}
        className="border-b border-stone-50 hover:bg-stone-50/50 cursor-pointer transition-colors"
      >
        <td className="px-4 py-2.5 text-xs text-stone-400 tabular-nums">
          <div className="flex items-center gap-1">
            {isExpanded ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
            {index}
          </div>
        </td>
        <td className="px-4 py-2.5 text-sm text-stone-700">{formatDate(run.executedAt, "short")}</td>
        <td className="px-4 py-2.5">
          <span className={`text-sm font-medium tabular-nums ${getAccuracyColorClass(run.accuracy)}`}>
            {(run.accuracy * 100).toFixed(1)}%
          </span>
        </td>
        <td className="px-4 py-2.5 text-sm text-stone-600 tabular-nums">
          {run.matchedFields}/{run.totalFields}
        </td>
        <td className="px-4 py-2.5">
          <Badge variant={badge.variant}>{badge.label}</Badge>
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan={5} className="px-4 py-4 bg-stone-50/50 border-b border-stone-100">
            <div className="space-y-3 max-w-3xl">
              {run.extractedData.map((section) => (
                <div key={section.sectionName}>
                  <h5 className="text-xs font-medium text-stone-500 mb-1.5">{section.sectionName}</h5>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                    {section.fields.map((f) => (
                      <div key={f.fieldId} className="flex flex-col">
                        <span className="text-[11px] text-stone-400">{f.fieldLabel}</span>
                        <span className="text-xs font-medium text-stone-700">{f.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// =============================================================================
// APPLICATION PDF TAB — Verified Baseline PDF + Extension Run List
// =============================================================================

function ApplicationPdfTab({ testCase }: { testCase: TestCase }) {
  const { humanFilled, extensionRuns } = testCase.applicationPdfs;

  return (
    <div className="space-y-4">
      {/* Verified Baseline PDF card */}
      <div className="bg-emerald-50/50 rounded-xl border border-emerald-200 p-4">
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-lg bg-white flex items-center justify-center shrink-0 border border-emerald-200">
            <CheckCircle2 className="size-5 text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-stone-800">Reference PDF</h4>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-medium">Verified Baseline</span>
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">Manually filled by a human operator on the UKVI website</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs font-medium text-stone-700 truncate">{humanFilled.fileName}</p>
            <p className="text-[11px] text-stone-400">{formatFileSize(humanFilled.fileSize)} · {formatDate(humanFilled.uploadedAt, "short")}</p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer shrink-0">
            <Eye className="size-3" />View
          </button>
        </div>
      </div>

      {/* Extension-filled PDF Runs */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-stone-100">
          <h4 className="text-sm font-medium text-stone-700">Extension Form-Fill Runs</h4>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100">
              <th className="text-left text-xs font-medium text-stone-500 px-4 py-2.5 w-8">#</th>
              <th className="text-left text-xs font-medium text-stone-500 px-4 py-2.5">Date</th>
              <th className="text-left text-xs font-medium text-stone-500 px-4 py-2.5 w-28">Accuracy</th>
              <th className="text-left text-xs font-medium text-stone-500 px-4 py-2.5">File</th>
              <th className="text-left text-xs font-medium text-stone-500 px-4 py-2.5 w-20">Size</th>
              <th className="text-right text-xs font-medium text-stone-500 px-4 py-2.5 w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {extensionRuns.map((run, idx) => (
              <tr key={run.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors">
                <td className="px-4 py-2.5 text-xs text-stone-400 tabular-nums">{idx + 1}</td>
                <td className="px-4 py-2.5 text-sm text-stone-700">{formatDate(run.executedAt, "short")}</td>
                <td className="px-4 py-2.5">
                  <span className={`text-sm font-medium tabular-nums ${getAccuracyColorClass(run.accuracy)}`}>
                    {(run.accuracy * 100).toFixed(1)}%
                  </span>
                </td>
                <td className="px-4 py-2.5 text-xs text-stone-600 truncate">{run.fileName}</td>
                <td className="px-4 py-2.5 text-xs text-stone-500 tabular-nums">{formatFileSize(run.fileSize)}</td>
                <td className="px-4 py-2.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer">
                      <Eye className="size-3" />View
                    </button>
                    <button className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer">
                      <Download className="size-3" />Download
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {extensionRuns.length === 0 && (
              <tr><td colSpan={6} className="py-8 text-center text-sm text-stone-400">No extension runs yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-[10px] text-stone-400 px-1">
        Both the reference PDF and extension PDFs are filled using the same human-verified extracted data. Accuracy measures how closely the extension output matches the human-filled reference.
      </p>
    </div>
  );
}
