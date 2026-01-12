"use client";

import { useState } from "react";
import {
  Wand2,
  CheckCircle2,
  Loader2,
  FileSearch,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useCaseDetailStore } from "@/store/case-detail-store";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function DemoControls() {
  const [isExpanded, setIsExpanded] = useState(true);

  const documentGroups = useCaseDetailStore((state) => state.documentGroups);
  const isAnalyzingDocuments = useCaseDetailStore(
    (state) => state.isAnalyzingDocuments,
  );
  const reviewAllDocumentsAndAnalyze = useCaseDetailStore(
    (state) => state.reviewAllDocumentsAndAnalyze,
  );
  const clientProfile = useCaseDetailStore((state) => state.clientProfile);
  const uploadDocuments = useCaseDetailStore((state) => state.uploadDocuments);
  const isLoadingDocuments = useCaseDetailStore(
    (state) => state.isLoadingDocuments,
  );

  const hasDocuments = documentGroups.length > 0;
  const allReviewed =
    hasDocuments && documentGroups.every((g) => g.status === "reviewed");
  const hasProfile = !!clientProfile.passport;

  const handleReviewAndAnalyze = async () => {
    if (!hasDocuments || isAnalyzingDocuments) return;
    await reviewAllDocumentsAndAnalyze();
  };

  const handleLoadDocuments = async () => {
    if (isLoadingDocuments) return;
    await uploadDocuments();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
        style={{ width: isExpanded ? 280 : "auto" }}
      >
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white"
        >
          <div className="flex items-center gap-2">
            <Wand2 className="w-4 h-4" />
            <span className="font-medium text-sm">Demo Controls</span>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronUp className="w-4 h-4" />
          )}
        </button>

        {/* Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-3">
                {/* Actions */}
                {/* Load Documents Button */}
                {!hasDocuments && (
                  <button
                    onClick={handleLoadDocuments}
                    disabled={isLoadingDocuments}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg",
                      "text-sm font-medium transition-all duration-200",
                      isLoadingDocuments
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600",
                    )}
                  >
                    {isLoadingDocuments ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <FileSearch className="w-4 h-4" />
                        <span>Load Demo Documents</span>
                      </>
                    )}
                  </button>
                )}

                {/* Review All & Analyze Button */}
                {hasDocuments && (
                  <button
                    onClick={handleReviewAndAnalyze}
                    disabled={
                      isAnalyzingDocuments || (allReviewed && hasProfile)
                    }
                    className={cn(
                      "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg",
                      "text-sm font-medium transition-all duration-200",
                      isAnalyzingDocuments
                        ? "bg-violet-100 text-violet-600"
                        : allReviewed && hasProfile
                          ? "bg-green-100 text-green-600 cursor-default"
                          : "bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700",
                    )}
                  >
                    {isAnalyzingDocuments ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : allReviewed && hasProfile ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Complete</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" />
                        <span>Review All & Generate Profile</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
