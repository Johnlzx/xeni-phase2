"use client";

import { useCallback } from "react";
import {
  Upload,
  FolderOpen,
  FileText,
  ArrowRight,
  Layers,
  CheckCircle2,
} from "lucide-react";
import {
  useCaseDetailStore,
  useDocumentGroups,
  useIsLoadingDocuments,
} from "@/store/case-detail-store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Color palette for folder tabs - warm, archival tones
const FOLDER_COLORS = [
  { bg: "bg-amber-100", border: "border-amber-300", text: "text-amber-800" },
  { bg: "bg-rose-100", border: "border-rose-300", text: "text-rose-800" },
  { bg: "bg-sky-100", border: "border-sky-300", text: "text-sky-800" },
  {
    bg: "bg-emerald-100",
    border: "border-emerald-300",
    text: "text-emerald-800",
  },
  { bg: "bg-violet-100", border: "border-violet-300", text: "text-violet-800" },
  { bg: "bg-orange-100", border: "border-orange-300", text: "text-orange-800" },
];

export function FileUploadZone() {
  const groups = useDocumentGroups();
  const isLoading = useIsLoadingDocuments();
  const uploadDocuments = useCaseDetailStore((state) => state.uploadDocuments);
  const setActiveNav = useCaseDetailStore((state) => state.setActiveNav);

  // Filter out unclassified for display
  const classifiedGroups = groups.filter((g) => g.id !== "unclassified");
  const unclassifiedGroup = groups.find((g) => g.id === "unclassified");
  const unclassifiedCount = unclassifiedGroup?.files.length || 0;

  const totalFiles = groups.reduce((sum, g) => sum + g.files.length, 0);
  const reviewedGroups = classifiedGroups.filter(
    (g) => g.status === "reviewed",
  ).length;

  const handleUploadClick = useCallback(() => {
    uploadDocuments();
  }, [uploadDocuments]);

  return (
    <div className="h-full min-h-[240px] flex flex-col rounded-xl border border-stone-200 overflow-hidden bg-gradient-to-b from-stone-50 to-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-stone-100 to-amber-50/50 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0E4268] to-[#0a3555] flex items-center justify-center shadow-sm">
            <FolderOpen className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-stone-800">Documents</h3>
            {totalFiles > 0 && (
              <p className="text-[10px] text-stone-500">
                {totalFiles} files · {classifiedGroups.length} categories
              </p>
            )}
          </div>
        </div>

        {totalFiles > 0 && (
          <button
            onClick={() => setActiveNav("documents")}
            className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium text-stone-600 hover:bg-stone-100 transition-all"
          >
            <span>Open</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Main content area */}
      <div className="flex-1 p-3 overflow-hidden">
        {isLoading ? (
          // Loading State
          <div className="h-full flex flex-col items-center justify-center gap-2">
            <div className="relative">
              <div className="w-10 h-10 border-2 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
              <FileText className="w-4 h-4 text-amber-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="text-xs text-stone-500">Organizing...</p>
          </div>
        ) : totalFiles === 0 ? (
          // Empty State
          <button
            onClick={handleUploadClick}
            className="w-full h-full flex flex-col items-center justify-center gap-3 group"
          >
            <div className="relative">
              <motion.div
                initial={{ rotate: -6 }}
                whileHover={{ rotate: -8 }}
                className="absolute w-12 h-9 rounded bg-amber-100 border border-amber-200"
                style={{ left: -3, top: 2 }}
              />
              <motion.div
                initial={{ rotate: 3 }}
                whileHover={{ rotate: 5 }}
                className="absolute w-12 h-9 rounded bg-rose-100 border border-rose-200"
                style={{ left: 3, top: 1 }}
              />
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative w-12 h-9 rounded bg-sky-100 border border-sky-300 flex items-center justify-center"
              >
                <Upload className="w-5 h-5 text-sky-600" />
              </motion.div>
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-stone-600">
                Upload Documents
              </p>
              <p className="text-[10px] text-stone-400">Click to simulate</p>
            </div>
          </button>
        ) : (
          // Filled State - Compact folder grid
          <div className="h-full flex flex-col">
            {/* Folder tabs - 2 columns, max 4 visible */}
            <div className="grid grid-cols-2 gap-1.5 mb-2">
              {classifiedGroups.slice(0, 4).map((group, index) => {
                const colorScheme = FOLDER_COLORS[index % FOLDER_COLORS.length];
                const isReviewed = group.status === "reviewed";

                return (
                  <motion.button
                    key={group.id}
                    onClick={() => setActiveNav("documents")}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={cn(
                      "relative text-left p-2 rounded border transition-all duration-200",
                      colorScheme.bg,
                      colorScheme.border,
                      "hover:shadow-sm hover:-translate-y-0.5",
                    )}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <p
                        className={cn(
                          "text-[10px] font-medium truncate",
                          colorScheme.text,
                        )}
                      >
                        {group.title}
                      </p>
                      {isReviewed && (
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[9px] text-stone-500">
                      {group.files.length} files
                    </p>
                  </motion.button>
                );
              })}
            </div>

            {/* More folders + unclassified */}
            <div className="flex items-center gap-2 text-[10px]">
              {classifiedGroups.length > 4 && (
                <button
                  onClick={() => setActiveNav("documents")}
                  className="flex items-center gap-1 text-stone-500 hover:text-stone-700"
                >
                  <Layers className="w-3 h-3" />
                  <span>+{classifiedGroups.length - 4} more</span>
                </button>
              )}
              {unclassifiedCount > 0 && (
                <span className="text-amber-600">
                  {unclassifiedCount} unclassified
                </span>
              )}
            </div>

            {/* Review status - prominent CTA when pending */}
            <div className="mt-auto pt-2 border-t border-stone-100">
              {reviewedGroups < classifiedGroups.length ? (
                // Pending review - prominent CTA
                <motion.button
                  onClick={() => setActiveNav("documents")}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 hover:border-amber-300 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          repeatDelay: 2,
                        }}
                      >
                        <FileText className="w-3 h-3 text-amber-600" />
                      </motion.div>
                    </div>
                    <div className="text-left">
                      <p className="text-[11px] font-medium text-amber-800">
                        {classifiedGroups.length - reviewedGroups} categories
                        need review
                      </p>
                      <p className="text-[9px] text-amber-600/70">
                        Click to review documents
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-amber-500 group-hover:translate-x-0.5 transition-transform" />
                </motion.button>
              ) : (
                // All reviewed - compact success state
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    </div>
                    <span className="text-[11px] font-medium text-emerald-700">
                      All documents reviewed
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-medium">
                    {reviewedGroups}/{classifiedGroups.length}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
