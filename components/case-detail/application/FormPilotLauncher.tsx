"use client";

import { motion } from "motion/react";
import {
  Rocket,
  CheckCircle2,
  FileJson,
  Download,
  ExternalLink,
  Shield,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useCaseDetailStore,
  useFormSchema,
  useFormPilotStatus,
  useApplicationChecklistItems,
  useQualityIssues,
} from "@/store/case-detail-store";
import { VisaType } from "@/types";

interface FormPilotLauncherProps {
  visaType: VisaType;
}

export function FormPilotLauncher({ visaType }: FormPilotLauncherProps) {
  const formSchema = useFormSchema();
  const formPilotStatus = useFormPilotStatus();
  const checklistItems = useApplicationChecklistItems();
  const qualityIssues = useQualityIssues();
  const launchFormPilot = useCaseDetailStore((state) => state.launchFormPilot);
  const goBackToPhase = useCaseDetailStore((state) => state.goBackToPhase);

  // Calculate stats
  const completedFields = checklistItems.filter(
    (i) => i.status === "complete",
  ).length;
  const totalFields = checklistItems.length;
  const unresolvedIssues = qualityIssues.filter((i) => !i.isResolved).length;
  const isReady = unresolvedIssues === 0;

  const handleLaunch = () => {
    launchFormPilot();
    // In real app, this would open the Form Pilot browser extension or external tool
  };

  const handleDownloadJSON = () => {
    // Generate JSON data from checklist items
    const data = checklistItems.reduce(
      (acc, item) => {
        if (item.value) {
          acc[item.field] = item.value;
        }
        return acc;
      },
      {} as Record<string, string>,
    );

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${visaType}-application-data.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex items-center justify-center p-6 bg-gradient-to-b from-stone-50 to-white">
      <div className="w-full max-w-lg">
        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="bg-white rounded-2xl border border-stone-200 shadow-lg overflow-hidden"
        >
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-[#0E4268] to-[#1a5a8a] px-8 py-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="size-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Rocket size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Form Pilot</h2>
                <p className="text-sm text-white/80">Auto-fill your application</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="px-8 py-6 border-b border-stone-100">
            <div className="grid grid-cols-2 gap-4">
              {/* Fields ready */}
              <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl">
                <div className="size-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 size={20} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-700">
                    {completedFields}/{totalFields}
                  </p>
                  <p className="text-xs text-emerald-600">Fields verified</p>
                </div>
              </div>

              {/* Issues */}
              <div
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl",
                  unresolvedIssues === 0 ? "bg-stone-50" : "bg-amber-50",
                )}
              >
                <div
                  className={cn(
                    "size-10 rounded-lg flex items-center justify-center",
                    unresolvedIssues === 0 ? "bg-stone-100" : "bg-amber-100",
                  )}
                >
                  <Shield
                    size={20}
                    className={
                      unresolvedIssues === 0
                        ? "text-stone-500"
                        : "text-amber-600"
                    }
                  />
                </div>
                <div>
                  <p
                    className={cn(
                      "text-2xl font-bold",
                      unresolvedIssues === 0
                        ? "text-stone-600"
                        : "text-amber-700",
                    )}
                  >
                    {unresolvedIssues}
                  </p>
                  <p
                    className={cn(
                      "text-xs",
                      unresolvedIssues === 0
                        ? "text-stone-500"
                        : "text-amber-600",
                    )}
                  >
                    Issues remaining
                  </p>
                </div>
              </div>
            </div>

            {/* Schema info */}
            {formSchema && (
              <div className="mt-4 p-3 bg-stone-50 rounded-lg">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">Form Schema</span>
                  <span className="font-medium text-stone-700">
                    {formSchema.schemaName}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="px-8 py-6 space-y-3">
            {/* Main CTA */}
            <button
              onClick={handleLaunch}
              disabled={!isReady}
              className={cn(
                "w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-base transition-all",
                isReady
                  ? "bg-[#0E4268] text-white shadow-lg shadow-[#0E4268]/20 hover:bg-[#0a3555] hover:shadow-xl"
                  : "bg-stone-100 text-stone-400 cursor-not-allowed",
              )}
            >
              <Zap size={20} />
              <span>Start Auto-Fill</span>
              <ExternalLink size={16} />
            </button>

            {/* Alternative action */}
            <button
              onClick={handleDownloadJSON}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors"
            >
              <FileJson size={18} />
              <span className="text-sm font-medium">Download as JSON</span>
              <Download size={14} />
            </button>

            {/* Back to checklist */}
            <button
              onClick={() => goBackToPhase("checklist")}
              className="w-full text-center text-sm text-stone-500 hover:text-stone-700 py-2"
            >
              Back to checklist
            </button>
          </div>
        </motion.div>

        {/* Help text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.2 }}
          className="mt-4 text-center text-xs text-stone-400 text-pretty"
        >
          Form Pilot will automatically fill in your application on the official
          government website
        </motion.p>

        {/* Previous sessions */}
        {formPilotStatus.totalSessions > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.2 }}
            className="mt-4 text-center text-xs text-stone-400"
          >
            {formPilotStatus.totalSessions} previous session
            {formPilotStatus.totalSessions > 1 ? "s" : ""}
            {formPilotStatus.lastRunStatus === "success" && (
              <span className="text-emerald-500"> (last: success)</span>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
