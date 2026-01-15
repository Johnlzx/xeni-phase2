"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  X,
  Link2,
  Mail,
  Copy,
  Check,
  Send,
  AlertCircle,
  AlertTriangle,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCaseDetailStore } from "@/store/case-detail-store";
import {
  EnhancedQualityIssue,
  ForwardToClientData,
} from "@/types/case-detail";

interface ForwardToClientModalProps {
  issue: EnhancedQualityIssue;
  onClose: () => void;
}

// Severity configuration
const SEVERITY_CONFIG = {
  error: {
    icon: AlertCircle,
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    textColor: "text-rose-700",
    iconColor: "text-rose-500",
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-700",
    iconColor: "text-amber-500",
  },
  info: {
    icon: Info,
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    iconColor: "text-blue-500",
  },
};

export function ForwardToClientModal({
  issue,
  onClose,
}: ForwardToClientModalProps) {
  const [method, setMethod] = useState<"link" | "email">("email");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(
    `Dear Client,\n\nWe've identified an issue that requires your attention regarding your visa application:\n\n${issue.title}\n${issue.description}\n\n${issue.suggestedAction ? `Suggested action: ${issue.suggestedAction}\n\n` : ""}Please address this at your earliest convenience.\n\nBest regards,\nYour Immigration Team`
  );
  const [linkCopied, setLinkCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const forwardIssue = useCaseDetailStore((state) => state.forwardIssueToClient);

  const severityConfig = SEVERITY_CONFIG[issue.severity];
  const SeverityIcon = severityConfig.icon;

  // Generate a mock shareable link
  const shareableLink = `https://app.xeni.io/client/issues/${issue.id}`;

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

    const forwardData: ForwardToClientData = {
      method,
      sentAt: new Date().toISOString(),
      ...(method === "email"
        ? {
            recipientEmail: email,
            message,
          }
        : {
            shareableLink,
            expiresAt: new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000
            ).toISOString(),
          }),
    };

    forwardIssue(issue.id, forwardData);
    setIsSending(false);
    onClose();
  };

  const isValid = method === "link" || (method === "email" && email.includes("@"));

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
        className="relative w-full max-w-lg bg-white rounded-xl shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-200">
          <h2 className="text-lg font-semibold text-stone-900">
            Forward Issue to Client
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Issue preview */}
          <div
            className={cn(
              "flex items-start gap-3 p-3 rounded-lg border-l-4",
              severityConfig.bgColor,
              severityConfig.borderColor
            )}
          >
            <SeverityIcon
              className={cn("size-5 shrink-0 mt-0.5", severityConfig.iconColor)}
            />
            <div>
              <p className={cn("text-sm font-medium", severityConfig.textColor)}>
                {issue.title}
              </p>
              <p
                className={cn(
                  "text-sm mt-0.5",
                  severityConfig.textColor,
                  "opacity-80"
                )}
              >
                {issue.description}
              </p>
            </div>
          </div>

          {/* Method selection */}
          <div>
            <p className="text-sm font-medium text-stone-700 mb-3">
              How would you like to share this?
            </p>
            <div className="flex gap-3">
              {/* Link option */}
              <button
                onClick={() => setMethod("link")}
                className={cn(
                  "flex-1 flex items-center gap-3 p-3 rounded-lg border-2 transition-colors",
                  method === "link"
                    ? "border-[#0E4268] bg-[#0E4268]/5"
                    : "border-stone-200 hover:border-stone-300"
                )}
              >
                <div
                  className={cn(
                    "size-10 rounded-lg flex items-center justify-center",
                    method === "link" ? "bg-[#0E4268]" : "bg-stone-100"
                  )}
                >
                  <Link2
                    className={cn(
                      "size-5",
                      method === "link" ? "text-white" : "text-stone-400"
                    )}
                  />
                </div>
                <div className="text-left">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      method === "link" ? "text-[#0E4268]" : "text-stone-700"
                    )}
                  >
                    Shareable Link
                  </p>
                  <p className="text-xs text-stone-500">Expires in 7 days</p>
                </div>
              </button>

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
                    Send Email
                  </p>
                  <p className="text-xs text-stone-500">
                    Direct to client inbox
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Method-specific content */}
          {method === "link" ? (
            <div>
              <p className="text-sm text-stone-600 mb-2">
                Copy and share this link with your client:
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={shareableLink}
                  readOnly
                  className="flex-1 px-3 py-2 text-sm text-stone-600 bg-stone-50 border border-stone-200 rounded-lg"
                />
                <button
                  onClick={handleCopyLink}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    linkCopied
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                  )}
                >
                  {linkCopied ? (
                    <>
                      <Check className="size-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="size-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
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
                  rows={6}
                  className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:border-[#0E4268] focus:ring-1 focus:ring-[#0E4268]/20 resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-stone-200 bg-stone-50">
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
            ) : method === "link" ? (
              <>
                <Check className="size-4" />
                Done
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
