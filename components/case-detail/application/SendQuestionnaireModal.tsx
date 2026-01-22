"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Mail,
  MessageCircle,
  Link2,
  Check,
  Send,
  FileText,
  Copy,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Channel options - only actual delivery methods
const CHANNELS = [
  {
    id: "email",
    label: "Email",
    description: "Send via email with tracking",
    icon: Mail,
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    description: "Share via WhatsApp message",
    icon: MessageCircle,
  },
] as const;

type ChannelId = (typeof CHANNELS)[number]["id"];

interface SendQuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionTitle: string;
  sectionId: string;
  questionCount?: number;
  caseReference: string;
  clientName?: string;
}

export function SendQuestionnaireModal({
  isOpen,
  onClose,
  sectionTitle,
  sectionId,
  questionCount = 5,
  caseReference,
  clientName = "Client",
}: SendQuestionnaireModalProps) {
  const [selectedChannel, setSelectedChannel] = useState<ChannelId | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const questionnaireLink = `https://app.xeni.ai/q/${caseReference}/${sectionId}`;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(questionnaireLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleSend = async () => {
    if (!selectedChannel) return;

    setIsSending(true);

    // Simulate sending
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSending(false);
    setIsSent(true);

    // Auto close after success
    setTimeout(() => {
      onClose();
      // Reset state after close
      setTimeout(() => {
        setSelectedChannel(null);
        setIsSent(false);
        setLinkCopied(false);
      }, 300);
    }, 1500);
  };

  const handleClose = () => {
    onClose();
    // Reset state after close animation
    setTimeout(() => {
      setSelectedChannel(null);
      setIsSent(false);
      setIsSending(false);
      setLinkCopied(false);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40"
        onClick={handleClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-stone-100 flex items-center justify-center">
              <FileText size={18} className="text-stone-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-900">Send Questionnaire</h3>
              <p className="text-xs text-stone-500">{sectionTitle}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="size-8 rounded-lg hover:bg-stone-100 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X size={18} className="text-stone-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Success State */}
          <AnimatePresence mode="wait">
            {isSent ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-8 text-center"
              >
                <div className="size-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                  <Check size={24} className="text-emerald-600" />
                </div>
                <p className="text-sm font-medium text-stone-900">Questionnaire Sent!</p>
                <p className="text-xs text-stone-500 mt-1">
                  Sent to {clientName} via {CHANNELS.find((c) => c.id === selectedChannel)?.label}
                </p>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Preview Info */}
                <div className="mb-4 p-3 bg-stone-50 rounded-lg border border-stone-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-500">Questions to collect</span>
                    <span className="font-medium text-stone-700 tabular-nums">{questionCount} fields</span>
                  </div>
                  <div className="flex items-center justify-between text-xs mt-2">
                    <span className="text-stone-500">Recipient</span>
                    <span className="font-medium text-stone-700">{clientName}</span>
                  </div>
                </div>

                {/* Shareable Link - Always visible */}
                <div className="mb-4">
                  <p className="text-xs font-medium text-stone-600 mb-2">Shareable link</p>
                  <div className="flex items-center gap-2 p-2 bg-stone-50 rounded-lg border border-stone-200">
                    <Link2 size={14} className="shrink-0 text-stone-400" />
                    <span className="flex-1 text-xs text-stone-600 truncate font-mono">
                      {questionnaireLink}
                    </span>
                    <button
                      onClick={handleCopyLink}
                      className={cn(
                        "shrink-0 px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1",
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
                </div>

                {/* Channel Selection */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-stone-600 mb-2">Or send directly via</p>
                  {CHANNELS.map((channel) => {
                    const Icon = channel.icon;
                    const isSelected = selectedChannel === channel.id;

                    return (
                      <button
                        key={channel.id}
                        onClick={() => setSelectedChannel(channel.id)}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left",
                          isSelected
                            ? "border-[#0E4268] bg-[#0E4268]/5"
                            : "border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                        )}
                      >
                        <div
                          className={cn(
                            "size-8 rounded-lg flex items-center justify-center shrink-0",
                            isSelected ? "bg-[#0E4268] text-white" : "bg-stone-100 text-stone-500"
                          )}
                        >
                          <Icon size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={cn(
                              "text-sm font-medium",
                              isSelected ? "text-[#0E4268]" : "text-stone-700"
                            )}
                          >
                            {channel.label}
                          </p>
                          <p className="text-xs text-stone-500 truncate">{channel.description}</p>
                        </div>
                        <div
                          className={cn(
                            "size-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                            isSelected ? "border-[#0E4268] bg-[#0E4268]" : "border-stone-300"
                          )}
                        >
                          {isSelected && <Check size={12} className="text-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {!isSent && (
          <div className="px-5 py-4 border-t border-stone-100 flex items-center justify-end gap-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={!selectedChannel || isSending}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5",
                selectedChannel && !isSending
                  ? "bg-[#0E4268] text-white hover:bg-[#0a3555]"
                  : "bg-stone-200 text-stone-400 cursor-not-allowed"
              )}
            >
              {isSending ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Send size={14} />
                  </motion.div>
                  Sending...
                </>
              ) : (
                <>
                  <Send size={14} />
                  Send
                </>
              )}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
