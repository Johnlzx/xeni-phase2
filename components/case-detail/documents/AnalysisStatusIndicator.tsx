"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Activity,
  CheckCircle2,
  AlertCircle,
  Zap,
  FileText,
  Clock,
  RefreshCw,
} from "lucide-react";
import {
  useCaseDetailStore,
  useDocumentGroups,
} from "@/store/case-detail-store";

type AnalysisStatus = "synced" | "partial" | "outdated" | "analyzing" | "empty";

interface AnalysisStats {
  status: AnalysisStatus;
  totalReady: number; // Files ready for analysis (reviewed, not removed)
  totalAnalyzed: number; // Files already analyzed
  newSinceAnalysis: number; // New files added since last analysis
  pendingReview: number; // Files pending review
  lastAnalysisAt: string | null;
}

function useAnalysisStats(): AnalysisStats {
  const groups = useDocumentGroups();
  const lastAnalysisAt = useCaseDetailStore((state) => state.lastAnalysisAt);
  const analyzedFileIds = useCaseDetailStore((state) => state.analyzedFileIds);
  const isAnalyzing = useCaseDetailStore((state) => state.isAnalyzingDocuments);

  // Calculate stats
  const classifiedGroups = groups.filter((g) => g.id !== "unclassified");

  // Ready files: from reviewed groups, not removed
  const readyFiles = classifiedGroups
    .filter((g) => g.status === "reviewed")
    .flatMap((g) => g.files.filter((f) => !f.isRemoved));

  // Pending files: from pending groups, not removed
  const pendingFiles = classifiedGroups
    .filter((g) => g.status === "pending")
    .flatMap((g) => g.files.filter((f) => !f.isRemoved));

  const totalReady = readyFiles.length;
  const totalAnalyzed = readyFiles.filter((f) =>
    analyzedFileIds.includes(f.id),
  ).length;
  const newSinceAnalysis = totalReady - totalAnalyzed;
  const pendingReview = pendingFiles.length;

  // Determine status
  let status: AnalysisStatus;
  if (isAnalyzing) {
    status = "analyzing";
  } else if (totalReady === 0 && pendingReview === 0) {
    status = "empty";
  } else if (totalReady === 0 && pendingReview > 0) {
    status = "outdated"; // All files pending review
  } else if (newSinceAnalysis === 0 && totalAnalyzed > 0) {
    status = "synced";
  } else if (totalAnalyzed > 0 && newSinceAnalysis > 0) {
    status = "partial";
  } else {
    status = "outdated";
  }

  return {
    status,
    totalReady,
    totalAnalyzed,
    newSinceAnalysis,
    pendingReview,
    lastAnalysisAt,
  };
}

const STATUS_CONFIG: Record<
  AnalysisStatus,
  {
    label: string;
    description: string;
    color: string;
    bgColor: string;
    borderColor: string;
    icon: React.ReactNode;
    pulseColor?: string;
  }
> = {
  synced: {
    label: "Synced",
    description: "All documents analyzed",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    icon: <CheckCircle2 size={14} className="text-emerald-600" />,
  },
  partial: {
    label: "Partial",
    description: "New documents since last analysis",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    icon: <AlertCircle size={14} className="text-amber-600" />,
    pulseColor: "bg-amber-400",
  },
  outdated: {
    label: "Outdated",
    description: "Analysis needed",
    color: "text-rose-700",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    icon: <AlertCircle size={14} className="text-rose-600" />,
    pulseColor: "bg-rose-400",
  },
  analyzing: {
    label: "Analyzing",
    description: "Processing documents...",
    color: "text-[#0E4268]",
    bgColor: "bg-[#0E4268]/5",
    borderColor: "border-[#0E4268]/30",
    icon: <RefreshCw size={14} className="text-[#0E4268] animate-spin" />,
  },
  empty: {
    label: "No Data",
    description: "Upload documents to begin",
    color: "text-stone-500",
    bgColor: "bg-stone-50",
    borderColor: "border-stone-200",
    icon: <FileText size={14} className="text-stone-400" />,
  },
};

function formatTimeAgo(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export function AnalysisStatusIndicator() {
  const stats = useAnalysisStats();
  const config = STATUS_CONFIG[stats.status];
  const runAnalysis = useCaseDetailStore((state) => state.runDocumentAnalysis);
  const isAnalyzing = useCaseDetailStore((state) => state.isAnalyzingDocuments);
  const analysisProgress = useCaseDetailStore(
    (state) => state.analysisProgress,
  );

  const canAnalyze =
    stats.status !== "analyzing" &&
    stats.status !== "empty" &&
    (stats.status === "outdated" ||
      stats.status === "partial" ||
      stats.totalReady > 0);

  return (
    <div
      className={`
        relative flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300
        ${config.bgColor} ${config.borderColor}
      `}
    >
      {/* Pulse indicator for attention states */}
      <AnimatePresence>
        {config.pulseColor && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="absolute -top-1 -right-1"
          >
            <span className="relative flex size-3">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.pulseColor} opacity-75`}
              />
              <span
                className={`relative inline-flex rounded-full size-3 ${config.pulseColor}`}
              />
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Icon */}
      <div
        className={`
          flex items-center justify-center size-9 rounded-lg
          ${stats.status === "synced" ? "bg-emerald-100" : ""}
          ${stats.status === "partial" ? "bg-amber-100" : ""}
          ${stats.status === "outdated" ? "bg-rose-100" : ""}
          ${stats.status === "analyzing" ? "bg-[#0E4268]/10" : ""}
          ${stats.status === "empty" ? "bg-stone-100" : ""}
        `}
      >
        {config.icon}
      </div>

      {/* Status Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${config.color}`}>
            {config.label}
          </span>
          {stats.status === "analyzing" && (
            <span className="text-xs text-[#0E4268] font-medium">
              {analysisProgress}%
            </span>
          )}
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 mt-0.5">
          {stats.status !== "empty" && (
            <>
              <div className="flex items-center gap-1 text-xs text-stone-500">
                <Activity size={10} />
                <span>
                  {stats.totalAnalyzed}/{stats.totalReady + stats.pendingReview}{" "}
                  in analysis
                </span>
              </div>
              {stats.newSinceAnalysis > 0 && (
                <div className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                  <Zap size={10} />
                  <span>+{stats.newSinceAnalysis} new</span>
                </div>
              )}
              {stats.pendingReview > 0 && (
                <div className="flex items-center gap-1 text-xs text-stone-400">
                  <Clock size={10} />
                  <span>{stats.pendingReview} pending</span>
                </div>
              )}
            </>
          )}
          {stats.status === "empty" && (
            <span className="text-xs text-stone-400">{config.description}</span>
          )}
        </div>

        {/* Progress bar during analysis */}
        <AnimatePresence>
          {stats.status === "analyzing" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2"
            >
              <div className="h-1.5 bg-[#0E4268]/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#0E4268] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${analysisProgress}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Last analysis time */}
      {stats.lastAnalysisAt && stats.status !== "analyzing" && (
        <div className="text-[10px] text-stone-400 whitespace-nowrap">
          {formatTimeAgo(stats.lastAnalysisAt)}
        </div>
      )}

      {/* Analyze button */}
      {canAnalyze && (
        <motion.button
          onClick={runAnalysis}
          disabled={isAnalyzing}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
            transition-all duration-200 shrink-0
            ${
              stats.status === "synced"
                ? "bg-stone-100 text-stone-600 hover:bg-stone-200"
                : "bg-[#0E4268] text-white hover:bg-[#0a3555] shadow-sm"
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          <RefreshCw size={12} className={isAnalyzing ? "animate-spin" : ""} />
          {stats.status === "synced" ? "Re-analyze" : "Analyze"}
        </motion.button>
      )}
    </div>
  );
}

// Compact version for sidebar/header use
export function AnalysisStatusBadge() {
  const stats = useAnalysisStats();
  const config = STATUS_CONFIG[stats.status];

  return (
    <div
      className={`
        inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium
        ${config.bgColor} ${config.color} border ${config.borderColor}
      `}
    >
      {config.icon}
      <span>
        {stats.totalAnalyzed}/{stats.totalReady + stats.pendingReview}
      </span>
      {config.pulseColor && (
        <span className="relative flex size-2 ml-0.5">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.pulseColor} opacity-75`}
          />
          <span
            className={`relative inline-flex rounded-full size-2 ${config.pulseColor}`}
          />
        </span>
      )}
    </div>
  );
}
