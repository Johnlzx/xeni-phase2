"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import {
  X,
  Link2,
  Mail,
  MessageCircle,
  Copy,
  Check,
  Send,
  FileText,
  AlertTriangle,
  ClipboardList,
  FileWarning,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  EnhancedChecklistItem,
  EnhancedQualityIssue,
  RequiredEvidence,
  ChecklistSectionType,
} from "@/types/case-detail";

// Section display configuration
const SECTION_TITLES: Record<ChecklistSectionType, string> = {
  personal: "Personal Information",
  employment: "Employment Details",
  financial: "Financial Evidence",
  travel: "Travel History",
  education: "Education",
  family: "Family Information",
  other: "Other Information",
};

interface SectionSummary {
  sectionId: ChecklistSectionType;
  sectionTitle: string;
  missingFields: EnhancedChecklistItem[];
  missingEvidence: RequiredEvidence[];
  unresolvedIssues: EnhancedQualityIssue[];
}

interface SendChecklistSummaryModalProps {
  items: EnhancedChecklistItem[];
  issues: EnhancedQualityIssue[];
  onClose: () => void;
}

export function SendChecklistSummaryModal({
  items,
  issues,
  onClose,
}: SendChecklistSummaryModalProps) {
  const [method, setMethod] = useState<"email" | "whatsapp">("email");
  const [email, setEmail] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );

  // Group items by section and calculate what's missing
  const sectionSummaries = useMemo((): SectionSummary[] => {
    const sectionMap = new Map<ChecklistSectionType, SectionSummary>();

    // Group items by section
    items.forEach((item) => {
      if (!sectionMap.has(item.section)) {
        sectionMap.set(item.section, {
          sectionId: item.section,
          sectionTitle: SECTION_TITLES[item.section],
          missingFields: [],
          missingEvidence: [],
          unresolvedIssues: [],
        });
      }

      const section = sectionMap.get(item.section)!;

      // Check if field is missing/incomplete
      if (item.status !== "complete") {
        section.missingFields.push(item);
      }

      // Collect missing mandatory evidence (deduplicated)
      item.requiredEvidence?.forEach((ev) => {
        if (
          ev.isMandatory &&
          !ev.isUploaded &&
          !section.missingEvidence.some((e) => e.id === ev.id)
        ) {
          section.missingEvidence.push(ev);
        }
      });
    });

    // Add issues to their respective sections
    issues.forEach((issue) => {
      if (issue.status !== "resolved") {
        const item = items.find((i) => i.id === issue.linkedChecklistItemId);
        if (item && sectionMap.has(item.section)) {
          sectionMap.get(item.section)!.unresolvedIssues.push(issue);
        }
      }
    });

    // Filter out sections with no missing items and sort by section order
    const sectionOrder: ChecklistSectionType[] = [
      "personal",
      "employment",
      "financial",
      "travel",
      "education",
      "family",
      "other",
    ];

    return sectionOrder
      .filter((sectionId) => sectionMap.has(sectionId))
      .map((sectionId) => sectionMap.get(sectionId)!)
      .filter(
        (s) =>
          s.missingFields.length > 0 ||
          s.missingEvidence.length > 0 ||
          s.unresolvedIssues.length > 0
      );
  }, [items, issues]);

  // Total counts
  const totalMissingFields = sectionSummaries.reduce(
    (acc, s) => acc + s.missingFields.length,
    0
  );
  const totalMissingEvidence = sectionSummaries.reduce(
    (acc, s) => acc + s.missingEvidence.length,
    0
  );
  const totalUnresolvedIssues = sectionSummaries.reduce(
    (acc, s) => acc + s.unresolvedIssues.length,
    0
  );
  const totalItems =
    totalMissingFields + totalMissingEvidence + totalUnresolvedIssues;

  // Generate message template
  const defaultMessage = useMemo(() => {
    let msg = `Dear Client,\n\nPlease complete the following questionnaire for your visa application. We require the information and documents listed below:\n\n`;

    sectionSummaries.forEach((section) => {
      const sectionItems: string[] = [];

      if (section.missingFields.length > 0) {
        section.missingFields.forEach((field) => {
          sectionItems.push(
            `• ${field.label}${field.value ? " (needs completion)" : ""}`
          );
        });
      }

      if (section.missingEvidence.length > 0) {
        section.missingEvidence.forEach((ev) => {
          let item = `• ${ev.name} [Document Required]`;
          if (ev.validityPeriod) {
            item += ` - ${ev.validityPeriod}`;
          }
          sectionItems.push(item);
        });
      }

      if (section.unresolvedIssues.length > 0) {
        section.unresolvedIssues.forEach((issue) => {
          sectionItems.push(`• ${issue.title} [Action Required]`);
        });
      }

      if (sectionItems.length > 0) {
        msg += `**${section.sectionTitle}:**\n${sectionItems.join("\n")}\n\n`;
      }
    });

    msg += `Please complete this questionnaire at your earliest convenience to avoid delays in your application.\n\nBest regards,\nYour Immigration Team`;

    return msg;
  }, [sectionSummaries]);

  const [message, setMessage] = useState(defaultMessage);

  // Toggle section expansion
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

  // Generate a mock shareable link
  const shareableLink = `https://app.xeni.io/client/questionnaire`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      console.error("Failed to copy link");
    }
  };

  const handleSend = async () => {
    setIsSending(true);

    // Simulate sending
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSending(false);
    onClose();
  };

  const isValid =
    method === "whatsapp" || (method === "email" && email.includes("@"));

  // If nothing to send, show empty state
  if (totalItems === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden"
        >
          <div className="p-6 text-center">
            <div className="size-12 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
              <Check className="size-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold text-stone-900 mb-2">
              All Complete!
            </h3>
            <p className="text-sm text-stone-500 mb-4">
              There are no outstanding items to send to the client. All
              checklist items are complete.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-[#0E4268] hover:bg-[#0a3555] rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.15 }}
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-stone-200">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">
              Generate Client Questionnaire
            </h2>
            <p className="text-sm text-stone-500">
              Create a questionnaire for {totalItems} outstanding item{totalItems !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-5 space-y-5">
          {/* Summary preview by section */}
          <div className="bg-stone-50 rounded-lg border border-stone-200 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-stone-200 bg-stone-100/50">
              <ClipboardList className="size-4 text-stone-500" />
              <span className="text-sm font-medium text-stone-700">
                Questionnaire Items
              </span>
              <div className="ml-auto flex items-center gap-2 text-[10px]">
                {totalMissingFields > 0 && (
                  <span className="px-1.5 py-0.5 rounded bg-stone-200 text-stone-600">
                    {totalMissingFields} fields
                  </span>
                )}
                {totalMissingEvidence > 0 && (
                  <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                    {totalMissingEvidence} documents
                  </span>
                )}
                {totalUnresolvedIssues > 0 && (
                  <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">
                    {totalUnresolvedIssues} issues
                  </span>
                )}
              </div>
            </div>

            <div className="max-h-[240px] overflow-auto">
              {sectionSummaries.map((section) => {
                const sectionItemCount =
                  section.missingFields.length +
                  section.missingEvidence.length +
                  section.unresolvedIssues.length;
                const isExpanded = expandedSections.has(section.sectionId);

                return (
                  <div
                    key={section.sectionId}
                    className="border-b border-stone-100 last:border-b-0"
                  >
                    {/* Section header */}
                    <button
                      onClick={() => toggleSection(section.sectionId)}
                      className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-stone-50 transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronDown className="size-4 text-stone-400" />
                      ) : (
                        <ChevronRight className="size-4 text-stone-400" />
                      )}
                      <span className="text-sm font-medium text-stone-700">
                        {section.sectionTitle}
                      </span>
                      <span className="ml-auto text-xs text-stone-400">
                        {sectionItemCount} item{sectionItemCount !== 1 ? "s" : ""}
                      </span>
                    </button>

                    {/* Section items (expanded) */}
                    {isExpanded && (
                      <div className="px-4 pb-3 pl-10 space-y-1.5">
                        {/* Missing fields */}
                        {section.missingFields.map((field) => (
                          <div
                            key={field.id}
                            className="flex items-center gap-2 py-1 px-2 bg-white rounded border border-stone-100"
                          >
                            <FileText className="size-3 text-stone-400 shrink-0" />
                            <span className="text-xs text-stone-600 truncate">
                              {field.label}
                            </span>
                            {field.isRequired && (
                              <span className="ml-auto text-[9px] text-rose-500 font-medium shrink-0">
                                Required
                              </span>
                            )}
                          </div>
                        ))}

                        {/* Missing evidence */}
                        {section.missingEvidence.map((ev) => (
                          <div
                            key={ev.id}
                            className="flex items-center gap-2 py-1 px-2 bg-rose-50 rounded border border-rose-100"
                          >
                            <FileWarning className="size-3 text-rose-500 shrink-0" />
                            <span className="text-xs text-rose-700 truncate">
                              {ev.name}
                            </span>
                            <span className="ml-auto text-[9px] text-rose-500 font-medium shrink-0">
                              Document
                            </span>
                          </div>
                        ))}

                        {/* Unresolved issues */}
                        {section.unresolvedIssues.map((issue) => (
                          <div
                            key={issue.id}
                            className="flex items-center gap-2 py-1 px-2 bg-amber-50 rounded border border-amber-100"
                          >
                            <AlertTriangle className="size-3 text-amber-500 shrink-0" />
                            <span className="text-xs text-amber-700 truncate">
                              {issue.title}
                            </span>
                            <span className="ml-auto text-[9px] text-amber-600 font-medium shrink-0">
                              Action
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shareable Link - Always visible */}
          <div>
            <p className="text-sm font-medium text-stone-700 mb-2">
              Shareable link
            </p>
            <div className="flex items-center gap-2 p-2.5 bg-stone-50 rounded-lg border border-stone-200">
              <Link2 size={16} className="shrink-0 text-stone-400" />
              <span className="flex-1 text-sm text-stone-600 truncate font-mono">
                {shareableLink}
              </span>
              <button
                onClick={handleCopyLink}
                className={cn(
                  "shrink-0 px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5",
                  linkCopied
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-100"
                )}
              >
                {linkCopied ? (
                  <>
                    <Check size={12} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    Copy
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-stone-400 mt-1.5">Expires in 7 days</p>
          </div>

          {/* Method selection */}
          <div>
            <p className="text-sm font-medium text-stone-700 mb-3">
              Or send directly via
            </p>
            <div className="flex gap-3">
              {/* Email option */}
              <button
                onClick={() => setMethod("email")}
                className={cn(
                  "flex-1 flex items-center gap-3 p-3 rounded-lg border-2 transition-colors",
                  method === "email"
                    ? "border-[#0E4268] bg-[#0E4268]/5"
                    : "border-stone-200 hover:border-stone-300"
                )}
              >
                <div
                  className={cn(
                    "size-10 rounded-lg flex items-center justify-center",
                    method === "email" ? "bg-[#0E4268]" : "bg-stone-100"
                  )}
                >
                  <Mail
                    className={cn(
                      "size-5",
                      method === "email" ? "text-white" : "text-stone-400"
                    )}
                  />
                </div>
                <div className="text-left">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      method === "email" ? "text-[#0E4268]" : "text-stone-700"
                    )}
                  >
                    Email
                  </p>
                  <p className="text-xs text-stone-500">Send with tracking</p>
                </div>
              </button>

              {/* WhatsApp option */}
              <button
                onClick={() => setMethod("whatsapp")}
                className={cn(
                  "flex-1 flex items-center gap-3 p-3 rounded-lg border-2 transition-colors",
                  method === "whatsapp"
                    ? "border-[#0E4268] bg-[#0E4268]/5"
                    : "border-stone-200 hover:border-stone-300"
                )}
              >
                <div
                  className={cn(
                    "size-10 rounded-lg flex items-center justify-center",
                    method === "whatsapp" ? "bg-[#0E4268]" : "bg-stone-100"
                  )}
                >
                  <MessageCircle
                    className={cn(
                      "size-5",
                      method === "whatsapp" ? "text-white" : "text-stone-400"
                    )}
                  />
                </div>
                <div className="text-left">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      method === "whatsapp" ? "text-[#0E4268]" : "text-stone-700"
                    )}
                  >
                    WhatsApp
                  </p>
                  <p className="text-xs text-stone-500">Via WhatsApp message</p>
                </div>
              </button>
            </div>
          </div>

          {/* Method-specific content */}
          {method === "email" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Recipient Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@email.com"
                  className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-[#0E4268] focus:ring-1 focus:ring-[#0E4268]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={8}
                  className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-[#0E4268] focus:ring-1 focus:ring-[#0E4268]/20 resize-none font-mono text-xs leading-relaxed"
                />
              </div>
            </div>
          ) : (
            <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
              <p className="text-sm text-stone-600 mb-2">
                The questionnaire link will be sent via WhatsApp to your client.
              </p>
              <p className="text-xs text-stone-400">
                Make sure you have WhatsApp Business configured for automated messaging.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 flex items-center justify-end gap-3 px-5 py-4 border-t border-stone-200 bg-stone-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={!isValid || isSending}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              isValid && !isSending
                ? "bg-[#0E4268] text-white hover:bg-[#0a3555]"
                : "bg-stone-200 text-stone-400 cursor-not-allowed"
            )}
          >
            {isSending ? (
              <>
                <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </>
            ) : method === "whatsapp" ? (
              <>
                <MessageCircle className="size-4" />
                Send via WhatsApp
              </>
            ) : (
              <>
                <Send className="size-4" />
                Send Email
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
