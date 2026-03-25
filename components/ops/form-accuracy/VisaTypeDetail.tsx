"use client";

import { useState, useMemo, useCallback } from "react";
import { ArrowLeft, Play, Loader2, ScanText, FileCheck } from "lucide-react";
import { CircularProgress } from "@/components/ui/circular-progress";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import {
  getBatchRunsForVisaType,
  getHeatmapData,
} from "@/data/form-accuracy-mock";
import type {
  VisaTypeAccuracyMetrics,
  TestCase,
  BatchTestRun,
  HeatmapDay,
} from "@/types/form-accuracy";

// ---------------------------------------------------------------------------
// Refined color palette — desaturated, professional tones
// ---------------------------------------------------------------------------

const STATUS_COLORS = {
  success: { text: "text-emerald-600", bg: "bg-emerald-500", ring: "#10B981" },
  warning: { text: "text-[#B08D5B]", bg: "bg-[#D4A96A]", ring: "#D4A96A" },
  danger:  { text: "text-rose-500", bg: "bg-rose-400", ring: "#F43F5E" },
} as const;

function getAccuracyColor(rate: number) {
  if (rate >= 0.95) return STATUS_COLORS.success;
  if (rate >= 0.90) return STATUS_COLORS.warning;
  return STATUS_COLORS.danger;
}

export function VisaTypeDetail({
  metrics,
  cases,
  onBack,
  onSelectCase,
}: {
  metrics: VisaTypeAccuracyMetrics;
  cases: TestCase[];
  onBack: () => void;
  onSelectCase: (caseId: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<"cases" | "history">("cases");
  const [isRunning, setIsRunning] = useState(false);

  const ocrColor = getAccuracyColor(metrics.overallAccuracy);
  const ffColor = getAccuracyColor(metrics.formFillOverallAccuracy);
  const batchRuns = useMemo(() => getBatchRunsForVisaType(metrics.visaTypeId), [metrics.visaTypeId]);
  const heatmapData = useMemo(() => getHeatmapData(metrics.visaTypeId), [metrics.visaTypeId]);
  const sortedBatchRuns = useMemo(
    () => [...batchRuns].sort((a, b) => b.executedAt.localeCompare(a.executedAt)),
    [batchRuns]
  );

  const handleRunNow = useCallback(() => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      toast.success("Test run completed", {
        description: `OCR: ${metrics.totalCases}/${metrics.totalCases} passed · Form Fill: ${metrics.totalCases}/${metrics.totalCases} passed`,
      });
    }, 3000);
  }, [metrics.totalCases]);

  return (
    <div className="max-w-5xl mx-auto px-8 py-6">
      {/* Breadcrumb */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 transition-colors mb-4 cursor-pointer"
      >
        <ArrowLeft className="size-4" />
        <span>Form Accuracy</span>
        <span className="text-stone-300">/</span>
        <span className="text-stone-700 font-medium">{metrics.visaTypeName}</span>
      </button>

      {/* Header card — dual gauges */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 mb-6">
        <div className="flex items-center gap-6">
          {/* Dual gauges */}
          <div className="flex items-center gap-5 shrink-0">
            <div className="flex flex-col items-center gap-1">
              <CircularProgress
                value={metrics.overallAccuracy * 100}
                size={64}
                strokeWidth={5}
                color={ocrColor.ring}
              />
              <span className="text-[10px] font-medium text-stone-500 flex items-center gap-1">
                <ScanText className="size-3" />
                OCR
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <CircularProgress
                value={metrics.formFillOverallAccuracy * 100}
                size={64}
                strokeWidth={5}
                color={ffColor.ring}
              />
              <span className="text-[10px] font-medium text-stone-500 flex items-center gap-1">
                <FileCheck className="size-3" />
                Form Fill
              </span>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-stone-800">{metrics.visaTypeName}</h2>
              <span className="px-2 py-0.5 text-xs font-bold rounded bg-stone-100 text-stone-500 border border-stone-200">
                {metrics.visaTypeCode}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-stone-500">
              <span>{metrics.totalCases} cases</span>
              <span>{metrics.totalFields} total fields</span>
              <span>{batchRuns.length} runs</span>
              {metrics.lastTestDate && (
                <span>Last tested: {formatDate(metrics.lastTestDate, "short")}</span>
              )}
            </div>
            {/* Dual benchmark stats */}
            <div className="grid grid-cols-2 gap-x-6 mt-2">
              <div className="flex items-center gap-3 text-xs">
                <span className="text-stone-400 font-medium w-14">OCR</span>
                <span className="text-emerald-600">{metrics.totalMatches} matches</span>
                <span className="text-rose-500">{metrics.totalMismatches} mismatches</span>
                <span className="text-[#B08D5B]">{metrics.totalMissing} missing</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-stone-400 font-medium w-14">Form Fill</span>
                <span className="text-emerald-600">{metrics.formFillTotalMatches} matches</span>
                <span className="text-rose-500">{metrics.formFillTotalMismatches} mismatches</span>
                <span className="text-[#B08D5B]">{metrics.formFillTotalMissing} missing</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleRunNow}
              disabled={isRunning}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-[#0E4268] text-white hover:bg-[#0B3554] disabled:opacity-60 transition-colors cursor-pointer"
            >
              {isRunning ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="size-4" />
                  Run Now
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Uptime Bar — tab-switched benchmark */}
      <BenchmarkUptimeSection data={heatmapData} />

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-4">
        <button
          onClick={() => setActiveTab("cases")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
            activeTab === "cases"
              ? "bg-[#0E4268] text-white"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          Cases
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
            activeTab === "history"
              ? "bg-[#0E4268] text-white"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          Run History
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        {activeTab === "cases" ? (
          <CasesTable cases={cases} onSelect={onSelectCase} />
        ) : (
          <BatchRunHistoryTable runs={sortedBatchRuns} isRunning={isRunning} />
        )}
      </div>
    </div>
  );
}

// =============================================================================
// UPTIME BAR (Status-page style — thin vertical bars in a single row)
// =============================================================================

function getBarColorForBenchmark(run: BatchTestRun | null, benchmark: "ocr" | "formFill"): string {
  if (!run) return "bg-stone-200";
  const accuracy = benchmark === "ocr" ? run.overallAccuracy : run.formFillOverallAccuracy;
  if (accuracy >= 0.95) return "bg-emerald-400";
  if (accuracy >= 0.90) return "bg-[#D4A96A]";
  return "bg-rose-400";
}

function UptimeBar({ data, benchmark }: { data: HeatmapDay[]; benchmark: "ocr" | "formFill" }) {
  const [tooltip, setTooltip] = useState<{ x: number; day: HeatmapDay } | null>(null);

  const daysWithRuns = data.filter((d) => d.batchRun !== null);
  const avg =
    daysWithRuns.length > 0
      ? daysWithRuns.reduce((sum, d) => {
          const acc = benchmark === "ocr" ? (d.batchRun?.overallAccuracy ?? 0) : (d.batchRun?.formFillOverallAccuracy ?? 0);
          return sum + acc;
        }, 0) / daysWithRuns.length
      : 0;

  return (
    <div className="relative">
      {/* Bar row */}
      <div className="flex items-end gap-[1.5px] h-8">
        {data.map((day) => {
          const barColor = getBarColorForBenchmark(day.batchRun, benchmark);
          return (
            <div
              key={day.date}
              className={`flex-1 h-full rounded-[2px] ${barColor} cursor-pointer transition-opacity hover:opacity-80`}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const parentRect = e.currentTarget.closest(".relative")!.getBoundingClientRect();
                setTooltip({
                  x: rect.left - parentRect.left + rect.width / 2,
                  day,
                });
              }}
              onMouseLeave={() => setTooltip(null)}
            />
          );
        })}
      </div>

      {/* Labels row */}
      <div className="flex items-center justify-between mt-2">
        <span className="text-[11px] text-stone-400">{data.length} days ago</span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[11px] text-stone-400">
            <span className="inline-block size-2 rounded-sm bg-emerald-400" />
            &ge; 95%
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-stone-400">
            <span className="inline-block size-2 rounded-sm bg-[#D4A96A]" />
            90&ndash;95%
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-stone-400">
            <span className="inline-block size-2 rounded-sm bg-rose-400" />
            &lt; 90%
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-stone-400">
            <span className="inline-block size-2 rounded-sm bg-stone-200" />
            No run
          </span>
        </div>
        <span className="text-[11px] text-stone-400">Today</span>
      </div>

      {/* Overall average */}
      {daysWithRuns.length > 0 && (
        <p className="text-xs text-stone-500 mt-1.5">
          <span className="font-semibold tabular-nums" style={{ color: getAccuracyColor(avg).ring }}>
            {(avg * 100).toFixed(1)}%
          </span>{" "}
          average over {daysWithRuns.length} runs
        </p>
      )}

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute z-50 bg-stone-800 text-white text-[11px] px-3 py-2 rounded-lg shadow-lg pointer-events-none whitespace-nowrap -top-2"
          style={{
            left: tooltip.x,
            transform: "translate(-50%, -100%)",
          }}
        >
          <p className="font-medium">{formatDate(tooltip.day.date, "short")}</p>
          {tooltip.day.batchRun ? (
            <p className="text-stone-300 mt-0.5">
              {((benchmark === "ocr" ? tooltip.day.batchRun.overallAccuracy : tooltip.day.batchRun.formFillOverallAccuracy) * 100).toFixed(1)}%
              {" · "}
              {benchmark === "ocr" ? tooltip.day.batchRun.passedCases : tooltip.day.batchRun.formFillPassedCases}/{tooltip.day.batchRun.totalCases} cases
            </p>
          ) : (
            <p className="text-stone-400 mt-0.5">No run</p>
          )}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// BENCHMARK UPTIME SECTION — tab-switched OCR / Form Fill
// =============================================================================

function BenchmarkUptimeSection({ data }: { data: HeatmapDay[] }) {
  const [activeBenchmark, setActiveBenchmark] = useState<"ocr" | "formFill">("ocr");

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-stone-700">Accuracy History</h3>
        <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-0.5">
          <button
            onClick={() => setActiveBenchmark("ocr")}
            className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeBenchmark === "ocr"
                ? "bg-white text-stone-800 shadow-sm"
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            <ScanText className="size-3" />
            OCR
          </button>
          <button
            onClick={() => setActiveBenchmark("formFill")}
            className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeBenchmark === "formFill"
                ? "bg-white text-stone-800 shadow-sm"
                : "text-stone-500 hover:text-stone-700"
            }`}
          >
            <FileCheck className="size-3" />
            Form Fill
          </button>
        </div>
      </div>
      <UptimeBar data={data} benchmark={activeBenchmark} />
    </div>
  );
}

// =============================================================================
// CASES TABLE — dual accuracy columns
// =============================================================================

function getCaseAccuracyColor(rate: number) {
  if (rate >= 0.95) return { text: "text-emerald-600", bg: "bg-emerald-500" };
  if (rate >= 0.90) return { text: "text-[#B08D5B]", bg: "bg-[#D4A96A]" };
  return { text: "text-rose-500", bg: "bg-rose-400" };
}

function AccuracyCell({ value }: { value: number }) {
  const color = getCaseAccuracyColor(value);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color.bg}`}
          style={{ width: `${value * 100}%` }}
        />
      </div>
      <span className={`text-xs font-medium tabular-nums ${color.text}`}>
        {(value * 100).toFixed(0)}%
      </span>
    </div>
  );
}

function CasesTable({
  cases,
  onSelect,
}: {
  cases: TestCase[];
  onSelect: (caseId: string) => void;
}) {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-stone-100">
          <th className="text-left text-xs font-medium text-stone-500 px-4 py-3">Case</th>
          <th className="text-left text-xs font-medium text-stone-500 px-4 py-3 w-16">Fields</th>
          <th className="text-left text-xs font-medium text-stone-500 px-4 py-3 w-16">Weight</th>
          <th className="text-left text-xs font-medium text-stone-500 px-4 py-3 w-28">
            <span className="flex items-center gap-1"><ScanText className="size-3" />OCR</span>
          </th>
          <th className="text-left text-xs font-medium text-stone-500 px-4 py-3 w-28">
            <span className="flex items-center gap-1"><FileCheck className="size-3" />Form Fill</span>
          </th>
          <th className="text-left text-xs font-medium text-stone-500 px-4 py-3 w-16">Runs</th>
          <th className="text-left text-xs font-medium text-stone-500 px-4 py-3 w-24">Last Tested</th>
        </tr>
      </thead>
      <tbody>
        {cases.map((tc) => (
          <tr
            key={tc.id}
            onClick={() => onSelect(tc.id)}
            className="border-b border-stone-50 hover:bg-stone-50/50 cursor-pointer transition-colors"
          >
            <td className="px-4 py-3">
              <span className="text-sm font-medium text-stone-700">{tc.name}</span>
              <span className="block text-xs text-stone-400 mt-0.5 line-clamp-1">{tc.description}</span>
            </td>
            <td className="px-4 py-3 text-sm text-stone-600 tabular-nums">{tc.totalFieldCount}</td>
            <td className="px-4 py-3 text-sm text-stone-600 tabular-nums">{(tc.weight * 100).toFixed(0)}%</td>
            <td className="px-4 py-3"><AccuracyCell value={tc.accuracy} /></td>
            <td className="px-4 py-3"><AccuracyCell value={tc.formFillAccuracy} /></td>
            <td className="px-4 py-3 text-sm text-stone-500 tabular-nums">{tc.totalRuns}</td>
            <td className="px-4 py-3 text-xs text-stone-400">
              {tc.lastTestedAt ? formatDate(tc.lastTestedAt, "short") : "\u2014"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// =============================================================================
// BATCH RUN HISTORY TABLE — dual accuracy columns
// =============================================================================

function getBatchStatusBadge(status: BatchTestRun["status"]) {
  if (status === "success") return { label: "Passed", className: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  if (status === "partial") return { label: "Partial", className: "bg-[#FDF6EF] text-[#9A7650] border-[#E8D5C0]" };
  return { label: "Failed", className: "bg-rose-50 text-rose-600 border-rose-200" };
}

function getRunAccuracyColor(rate: number) {
  if (rate >= 0.95) return { text: "text-emerald-600" };
  if (rate >= 0.90) return { text: "text-[#B08D5B]" };
  return { text: "text-rose-500" };
}

function BatchRunHistoryTable({
  runs,
  isRunning,
}: {
  runs: BatchTestRun[];
  isRunning: boolean;
}) {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-stone-100">
          <th className="text-left text-xs font-medium text-stone-500 px-4 py-3">Date</th>
          <th className="text-left text-xs font-medium text-stone-500 px-4 py-3 w-20">Trigger</th>
          <th className="text-left text-xs font-medium text-stone-500 px-4 py-3 w-24">Cases</th>
          <th className="text-left text-xs font-medium text-stone-500 px-4 py-3 w-24">
            <span className="flex items-center gap-1"><ScanText className="size-3" />OCR</span>
          </th>
          <th className="text-left text-xs font-medium text-stone-500 px-4 py-3 w-24">
            <span className="flex items-center gap-1"><FileCheck className="size-3" />Form Fill</span>
          </th>
          <th className="text-left text-xs font-medium text-stone-500 px-4 py-3 w-20">Duration</th>
          <th className="text-left text-xs font-medium text-stone-500 px-4 py-3 w-20">Status</th>
        </tr>
      </thead>
      <tbody>
        {isRunning && (
          <tr className="border-b border-stone-50 bg-blue-50/30 animate-pulse">
            <td className="px-4 py-3 text-sm text-stone-500">Running...</td>
            <td className="px-4 py-3 text-xs text-stone-400">manual</td>
            <td className="px-4 py-3 text-sm text-stone-400">&mdash;</td>
            <td className="px-4 py-3 text-sm text-stone-400">&mdash;</td>
            <td className="px-4 py-3 text-sm text-stone-400">&mdash;</td>
            <td className="px-4 py-3 text-sm text-stone-400">&mdash;</td>
            <td className="px-4 py-3">
              <span className="inline-flex px-2 py-0.5 text-[10px] font-medium rounded border bg-blue-50 text-blue-600 border-blue-200">
                In Progress
              </span>
            </td>
          </tr>
        )}
        {runs.map((run) => {
          const badge = getBatchStatusBadge(run.status);
          const ocrColor = getRunAccuracyColor(run.overallAccuracy);
          const ffColor = getRunAccuracyColor(run.formFillOverallAccuracy);
          return (
            <tr key={run.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors">
              <td className="px-4 py-3 text-sm text-stone-700">{formatDate(run.executedAt, "short")}</td>
              <td className="px-4 py-3">
                <span className="text-xs text-stone-500 capitalize">{run.trigger}</span>
              </td>
              <td className="px-4 py-3 text-sm text-stone-600 tabular-nums">
                {run.passedCases}/{run.totalCases}
              </td>
              <td className="px-4 py-3">
                <span className={`text-sm font-medium tabular-nums ${ocrColor.text}`}>
                  {(run.overallAccuracy * 100).toFixed(1)}%
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`text-sm font-medium tabular-nums ${ffColor.text}`}>
                  {(run.formFillOverallAccuracy * 100).toFixed(1)}%
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-stone-500 tabular-nums">
                {(run.durationMs / 1000).toFixed(1)}s
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded border ${badge.className}`}>
                  {badge.label}
                </span>
              </td>
            </tr>
          );
        })}
        {runs.length === 0 && !isRunning && (
          <tr>
            <td colSpan={7} className="py-12 text-center text-sm text-stone-400">
              No runs yet. Click &ldquo;Run Now&rdquo; to start a test.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
