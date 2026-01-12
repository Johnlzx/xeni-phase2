"use client";

import { FileText, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useCaseDetailStore } from "@/store/case-detail-store";
import { CircularProgress } from "@/components/ui/circular-progress";

interface MetricCardProps {
  icon: React.ComponentType<{
    className?: string;
    style?: React.CSSProperties;
  }>;
  label: string;
  value: string | number;
  subtext?: string;
  color: string;
}

function MetricCard({
  icon: Icon,
  label,
  value,
  subtext,
  color,
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3">
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">
            {label}
          </p>
          <div className="flex items-baseline gap-1">
            <p className="text-lg font-semibold text-gray-900">{value}</p>
            {subtext && <p className="text-[10px] text-gray-400">{subtext}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProgressDashboard() {
  const uploadedFilePreviews = useCaseDetailStore(
    (state) => state.uploadedFilePreviews,
  );
  const checklist = useCaseDetailStore((state) => state.checklist);
  const selectedVisaType = useCaseDetailStore(
    (state) => state.selectedVisaType,
  );

  // Calculate overall progress
  const documentsUploaded = uploadedFilePreviews.length;
  const documentsTotal = 12;
  const { completed, total } = checklist.progress;

  // Overall progress
  const visaTypeProgress = selectedVisaType ? 10 : 0;
  const documentProgress = Math.min(
    (documentsUploaded / documentsTotal) * 40,
    40,
  );
  const checklistProgress = total > 0 ? (completed / total) * 50 : 0;
  const overallProgress = Math.round(
    visaTypeProgress + documentProgress + checklistProgress,
  );

  // Mock issues
  const blockingIssues = 2;
  const warningIssues = 3;

  return (
    <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100">
      <div className="grid grid-cols-5 gap-3">
        {/* Overall Progress */}
        <div className="bg-white rounded-lg border border-gray-200 p-3 flex items-center gap-3">
          <CircularProgress
            value={overallProgress}
            size={56}
            strokeWidth={5}
            color="#0E4268"
            trackColor="#E5E7EB"
            showLabel
          />
          <div>
            <p className="text-xs font-medium text-gray-700">Overall</p>
            <p className="text-[10px] text-gray-400">
              {checklist.stage === "empty"
                ? "Not started"
                : checklist.stage === "questionnaire"
                  ? "Gathering"
                  : checklist.stage === "partial"
                    ? "In progress"
                    : "Almost ready"}
            </p>
          </div>
        </div>

        {/* Metric Cards */}
        <MetricCard
          icon={FileText}
          label="Documents"
          value={`${documentsUploaded}/${documentsTotal}`}
          color="#0E4268"
        />

        <MetricCard
          icon={CheckCircle}
          label="Checklist"
          value={`${completed}/${total}`}
          color="#10B981"
        />

        <MetricCard
          icon={AlertTriangle}
          label="Blocking"
          value={blockingIssues}
          color="#EF4444"
        />

        <MetricCard
          icon={Clock}
          label="Warnings"
          value={warningIssues}
          color="#F59E0B"
        />
      </div>
    </div>
  );
}
