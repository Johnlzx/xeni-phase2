"use client";

import { useState, useMemo, useCallback } from "react";
import { Target, FlaskConical, Play, Loader2, Download, Settings2, ArrowUpDown, Filter, AlertTriangle, Clock } from "lucide-react";
import { toast } from "sonner";
import { CircularProgress } from "@/components/ui/circular-progress";
import { formatDate } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MOCK_DASHBOARD_STATS,
  MOCK_VISA_TYPE_METRICS,
  getTestCasesForVisaType,
  getMetricsForVisaType,
  getLastNBatchAccuracies,
  getCoverageTimelineData,
} from "@/data/form-accuracy-mock";
import type { CoverageTimelineRow } from "@/data/form-accuracy-mock";
import type {
  FormAccuracyVisaTypeId,
  FormAccuracyDashboardStats,
  VisaTypeAccuracyMetrics,
  RunSchedule,
  FormAccuracySortOption,
  FormAccuracyFilterOption,
} from "@/types/form-accuracy";
import { VisaTypeDetail } from "./VisaTypeDetail";
import { CaseDetail } from "./CaseDetail";

function getAccuracyColor(rate: number) {
  if (rate >= 0.95) return { text: "text-emerald-600", bg: "bg-emerald-50", ring: "#10B981", border: "border-emerald-200" };
  if (rate >= 0.90) return { text: "text-[#B08D5B]", bg: "bg-[#FDF6EF]", ring: "#D4A96A", border: "border-[#E8D5C0]" };
  return { text: "text-rose-500", bg: "bg-rose-50", ring: "#F43F5E", border: "border-rose-200" };
}

// ---------------------------------------------------------------------------
// Simulate a fresh run: bump accuracy slightly and update timestamps to now
// ---------------------------------------------------------------------------

function simulateRefreshedMetrics(
  metrics: VisaTypeAccuracyMetrics[]
): VisaTypeAccuracyMetrics[] {
  const now = new Date().toISOString();
  return metrics.map((m) => {
    const newCaseMetrics = m.caseMetrics.map((cm) => {
      // Small random bump: +0.5% to +2%
      const ocrBump = 0.005 + Math.random() * 0.015;
      const ffBump = 0.005 + Math.random() * 0.015;
      const newRate = Math.min(1, cm.latestHitRate + ocrBump);
      const newFfRate = Math.min(1, cm.formFillLatestHitRate + ffBump);
      return {
        ...cm,
        latestHitRate: newRate,
        formFillLatestHitRate: newFfRate,
        latestRunDate: now,
        totalRuns: cm.totalRuns + 1,
      };
    });
    const newOverall = newCaseMetrics.reduce((s, c) => s + c.latestHitRate, 0) / newCaseMetrics.length;
    const newFfOverall = newCaseMetrics.reduce((s, c) => s + c.formFillLatestHitRate, 0) / newCaseMetrics.length;
    return {
      ...m,
      overallAccuracy: newOverall,
      formFillOverallAccuracy: newFfOverall,
      lastTestDate: now,
      totalRuns: m.totalRuns + m.totalCases,
      caseMetrics: newCaseMetrics,
    };
  });
}

function buildDashboardStats(metrics: VisaTypeAccuracyMetrics[]): FormAccuracyDashboardStats {
  const avg = metrics.reduce((s, m) => s + m.overallAccuracy, 0) / metrics.length;
  const lowest = metrics.reduce(
    (lo, m) => (m.overallAccuracy < lo.accuracy ? { visaTypeId: m.visaTypeId, visaTypeName: m.visaTypeName, accuracy: m.overallAccuracy } : lo),
    { visaTypeId: metrics[0].visaTypeId, visaTypeName: metrics[0].visaTypeName, accuracy: metrics[0].overallAccuracy }
  );
  const lastRunTime = metrics.reduce((l, m) => (m.lastTestDate > l ? m.lastTestDate : l), metrics[0].lastTestDate);
  return { averageAccuracy: avg, totalVisaTypes: metrics.length, lowestVisaType: lowest, lastRunTime };
}

export function FormAccuracyOverview() {
  const [selectedVisaType, setSelectedVisaType] = useState<FormAccuracyVisaTypeId | null>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<RunSchedule>("daily");
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [runningVisaTypeId, setRunningVisaTypeId] = useState<FormAccuracyVisaTypeId | null>(null);
  const [sortBy, setSortBy] = useState<FormAccuracySortOption>("accuracy");
  const [filterBy, setFilterBy] = useState<FormAccuracyFilterOption>("all");

  // Reactive data — updated after test runs
  const [visaTypeMetrics, setVisaTypeMetrics] = useState(() => [...MOCK_VISA_TYPE_METRICS]);
  const [stats, setStats] = useState(() => ({ ...MOCK_DASHBOARD_STATS }));
  const [timelineData, setTimelineData] = useState(() => getCoverageTimelineData(14));

  const sortedFilteredMetrics = useMemo(() => {
    let list = [...visaTypeMetrics];

    // Filter
    if (filterBy === "below90") {
      list = list.filter((m) => m.overallAccuracy < 0.90);
    } else if (filterBy === "notTestedIn7Days") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      list = list.filter((m) => !m.lastTestDate || new Date(m.lastTestDate) < sevenDaysAgo);
    }

    // Sort
    if (sortBy === "accuracy") {
      list.sort((a, b) => a.overallAccuracy - b.overallAccuracy);
    } else if (sortBy === "lastTested") {
      list.sort((a, b) => (b.lastTestDate ?? "").localeCompare(a.lastTestDate ?? ""));
    } else if (sortBy === "fieldCount") {
      list.sort((a, b) => b.totalFields - a.totalFields);
    }

    return list;
  }, [sortBy, filterBy, visaTypeMetrics]);

  // Refresh all data after a successful run
  const refreshAfterRun = useCallback((updatedMetrics: VisaTypeAccuracyMetrics[]) => {
    setVisaTypeMetrics(updatedMetrics);
    setStats(buildDashboardStats(updatedMetrics));
    // Update timeline: mark today as having a run with the new accuracy
    setTimelineData((prev) =>
      prev.map((row) => {
        const m = updatedMetrics.find((u) => u.visaTypeId === row.visaTypeId);
        if (!m) return row;
        const newDays = row.days.map((d, i) =>
          i === row.days.length - 1 ? { ...d, hasRun: true, accuracy: m.overallAccuracy, formFillAccuracy: m.formFillOverallAccuracy } : d
        );
        return { ...row, accuracy: m.overallAccuracy, formFillAccuracy: m.formFillOverallAccuracy, days: newDays, daysSinceLastRun: 0 };
      })
    );
  }, []);

  const handleRunAll = useCallback(() => {
    setIsRunningAll(true);
    setTimeout(() => {
      const updated = simulateRefreshedMetrics(visaTypeMetrics);
      refreshAfterRun(updated);
      setIsRunningAll(false);
      toast.success("All tests completed", {
        description: `${updated.length} visa types tested — average accuracy ${(buildDashboardStats(updated).averageAccuracy * 100).toFixed(1)}%`,
      });
    }, 4000);
  }, [visaTypeMetrics, refreshAfterRun]);

  const handleRunSingle = useCallback((visaTypeId: FormAccuracyVisaTypeId, visaTypeName: string) => {
    setRunningVisaTypeId(visaTypeId);
    setTimeout(() => {
      const updated = visaTypeMetrics.map((m) => {
        if (m.visaTypeId !== visaTypeId) return m;
        return simulateRefreshedMetrics([m])[0];
      });
      refreshAfterRun(updated);
      setRunningVisaTypeId(null);
      const updatedM = updated.find((m) => m.visaTypeId === visaTypeId)!;
      toast.success(`${visaTypeName} test completed`, {
        description: `Accuracy: ${(updatedM.overallAccuracy * 100).toFixed(1)}%`,
      });
    }, 3000);
  }, [visaTypeMetrics, refreshAfterRun]);

  const handleExport = useCallback(() => {
    toast.success("Report exported", {
      description: "Form accuracy report downloaded as CSV",
    });
  }, []);

  const handleScheduleChange = useCallback((value: RunSchedule) => {
    setSchedule(value);
    setShowScheduleDialog(false);
    const labels: Record<RunSchedule, string> = { daily: "Daily", weekly: "Weekly", manual: "Manual only" };
    toast.success("Schedule updated", { description: `Runs set to: ${labels[value]}` });
  }, []);

  // Level 3: Case Detail
  if (selectedVisaType && selectedCaseId) {
    const cases = getTestCasesForVisaType(selectedVisaType);
    const testCase = cases.find((c) => c.id === selectedCaseId);
    const metrics = getMetricsForVisaType(selectedVisaType);

    if (testCase && metrics) {
      return (
        <div className="flex-1 overflow-y-auto">
          <CaseDetail
            testCase={testCase}
            visaTypeName={metrics.visaTypeName}
            onBack={() => setSelectedCaseId(null)}
          />
        </div>
      );
    }
  }

  // Level 2: Visa Type Detail
  if (selectedVisaType) {
    const metrics = getMetricsForVisaType(selectedVisaType);
    const cases = getTestCasesForVisaType(selectedVisaType);

    if (metrics) {
      return (
        <div className="flex-1 overflow-y-auto">
          <VisaTypeDetail
            metrics={metrics}
            cases={cases}
            onBack={() => setSelectedVisaType(null)}
            onSelectCase={(caseId) => setSelectedCaseId(caseId)}
          />
        </div>
      );
    }
  }

  const lowestColor = getAccuracyColor(stats.lowestVisaType.accuracy);
  const anyRunning = isRunningAll || runningVisaTypeId !== null;

  // Level 1: Overview
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-5 py-6">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-stone-800">Form Accuracy</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowScheduleDialog(true)}
            >
              <Settings2 className="size-4 mr-1.5" />
              Schedule
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
            >
              <Download className="size-4 mr-1.5" />
              Export Report
            </Button>
            <Button
              size="sm"
              onClick={handleRunAll}
              disabled={anyRunning}
              className="bg-[#0E4268] text-white hover:bg-[#0B3554]"
            >
              {isRunningAll ? (
                <>
                  <Loader2 className="size-4 mr-1.5 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="size-4 mr-1.5" />
                  Run All Tests
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard
            icon={<Target className="size-5 text-blue-600" />}
            label="Average Accuracy"
            value={`${(stats.averageAccuracy * 100).toFixed(1)}%`}
            bgColor="bg-blue-50"
          />
          <StatCard
            icon={<FlaskConical className="size-5 text-emerald-600" />}
            label="Visa Types Tested"
            value={String(stats.totalVisaTypes)}
            bgColor="bg-emerald-50"
          />
          <div className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-4">
            <div className="size-10 rounded-lg bg-rose-50 flex items-center justify-center">
              <AlertTriangle className="size-5 text-rose-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-stone-500">Lowest Visa Type</p>
              <p className="text-sm font-semibold text-stone-800 truncate">{stats.lowestVisaType.visaTypeName}</p>
              <p className={`text-xs font-medium tabular-nums ${lowestColor.text}`}>
                {(stats.lowestVisaType.accuracy * 100).toFixed(1)}%
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-4">
            <div className="size-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <Clock className="size-5 text-amber-600" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-stone-500">Last Run Time</p>
              <p className="text-sm font-semibold text-stone-800">{formatDate(stats.lastRunTime, "relative")}</p>
              <p className="text-xs text-stone-400">{formatDate(stats.lastRunTime, "short")}</p>
            </div>
          </div>
        </div>

        {/* Coverage Timeline */}
        <CoverageTimeline data={timelineData} />

        {/* Sort/Filter Row */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-stone-500">
            Visa Types
            {filterBy !== "all" && (
              <span className="ml-2 text-xs text-stone-400">
                ({sortedFilteredMetrics.length} of {MOCK_VISA_TYPE_METRICS.length})
              </span>
            )}
          </h3>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <ArrowUpDown className="size-3.5 mr-1.5" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={sortBy} onValueChange={(v) => setSortBy(v as FormAccuracySortOption)}>
                  <DropdownMenuRadioItem value="accuracy">Accuracy (lowest first)</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="lastTested">Last tested</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="fieldCount">Field count</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="size-3.5 mr-1.5" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={filterBy} onValueChange={(v) => setFilterBy(v as FormAccuracyFilterOption)}>
                  <DropdownMenuRadioItem value="all">All visa types</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="below90">Below 90% accuracy</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="notTestedIn7Days">Not tested in 7 days</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Visa Type Cards Grid */}
        <div className="grid grid-cols-3 gap-3">
          {sortedFilteredMetrics.map((m) => (
            <VisaTypeCard
              key={m.visaTypeId}
              metrics={m}
              isRunning={runningVisaTypeId === m.visaTypeId || isRunningAll}
              disableRun={anyRunning}
              onRun={() => handleRunSingle(m.visaTypeId, m.visaTypeName)}
              onClick={() => setSelectedVisaType(m.visaTypeId)}
            />
          ))}
          {sortedFilteredMetrics.length === 0 && (
            <div className="col-span-3 py-12 text-center text-sm text-stone-400">
              No visa types match the current filter
            </div>
          )}
        </div>
      </div>

      {/* Schedule Dialog */}
      <ScheduleDialog
        open={showScheduleDialog}
        schedule={schedule}
        onOpenChange={setShowScheduleDialog}
        onSave={handleScheduleChange}
      />
    </div>
  );
}

// =============================================================================
// COVERAGE TIMELINE
// =============================================================================

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function CoverageTimeline({ data }: { data: CoverageTimelineRow[] }) {
  const [activeBenchmark, setActiveBenchmark] = useState<"ocr" | "formFill">("ocr");
  const [tooltip, setTooltip] = useState<{ x: number; y: number; date: string; accuracy: number } | null>(null);

  // Precompute date labels from first row, reversed so newest is on the left
  const dayDates = useMemo(() => {
    if (data.length === 0) return [];
    return [...data[0].days].reverse().map((d) => {
      const dt = new Date(d.date + "T00:00:00");
      return { date: d.date, day: dt.getDate(), month: dt.getMonth(), monthLabel: MONTH_SHORT[dt.getMonth()] };
    });
  }, [data]);

  // Group consecutive days by month for the header spans
  const monthSpans = useMemo(() => {
    const spans: { label: string; cols: number }[] = [];
    for (const dd of dayDates) {
      const last = spans[spans.length - 1];
      if (last && last.label === dd.monthLabel) {
        last.cols++;
      } else {
        spans.push({ label: dd.monthLabel, cols: 1 });
      }
    }
    return spans;
  }, [dayDates]);

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5 mb-6 relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-stone-700">Test Coverage Timeline</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-0.5">
            <button
              onClick={() => setActiveBenchmark("ocr")}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                activeBenchmark === "ocr"
                  ? "bg-white text-stone-800 shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
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
              Form Fill
            </button>
          </div>
          <span className="text-xs text-stone-400">Past 14 days</span>
        </div>
      </div>

      {/* Date header — month row + day-number row */}
      <div className="flex items-end gap-0 mb-1.5">
        {/* Left gutter (matches name + accuracy columns) */}
        <div className="w-[88px] shrink-0 mr-3" />
        <div className="w-10 shrink-0 mr-3 text-right">
          <span className="text-[10px] font-medium text-stone-400 uppercase tracking-wide">Latest</span>
        </div>
        {/* Grid header */}
        <div className="flex-1 min-w-0">
          {/* Month labels */}
          <div className="flex">
            {monthSpans.map((span, i) => (
              <div
                key={i}
                className="text-[10px] font-medium text-stone-400 uppercase tracking-wide"
                style={{ flex: span.cols }}
              >
                {span.label}
              </div>
            ))}
          </div>
          {/* Day numbers */}
          <div className="flex gap-[3px]">
            {dayDates.map((dd) => (
              <div key={dd.date} className="flex-1 text-center">
                <span className="text-[10px] tabular-nums text-stone-400 leading-none">
                  {dd.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data rows */}
      <div className="space-y-[3px]">
        {data.map((row) => {
          // Show today's accuracy for the active benchmark
          const todayDay = row.days[row.days.length - 1];
          const rowAccuracy = activeBenchmark === "ocr" ? row.accuracy : row.formFillAccuracy;
          const todayAcc = activeBenchmark === "ocr"
            ? (todayDay?.hasRun && todayDay.accuracy !== null ? todayDay.accuracy : rowAccuracy)
            : (todayDay?.hasRun && todayDay.formFillAccuracy !== null ? todayDay.formFillAccuracy : rowAccuracy);
          const color = getAccuracyColor(todayAcc);
          const reversedDays = [...row.days].reverse();

          return (
            <div key={row.visaTypeId} className="flex items-center gap-0">
              {/* Visa name */}
              <span className="text-xs text-stone-600 w-[88px] truncate shrink-0 font-medium mr-3">
                {row.visaTypeName}
              </span>
              {/* Today's accuracy */}
              <span className={`text-xs font-medium tabular-nums w-10 shrink-0 text-right mr-3 ${color.text}`}>
                {(todayAcc * 100).toFixed(0)}%
              </span>
              {/* Day cells — square grid (newest first) */}
              <div className="flex-1 flex items-center gap-[3px]">
                {reversedDays.map((day) => {
                  const dayAcc = activeBenchmark === "ocr" ? day.accuracy : day.formFillAccuracy;
                  const cellColor = day.hasRun
                    ? getAccuracyColor(dayAcc ?? 0).ring
                    : undefined;
                  return (
                    <div key={day.date} className="flex-1 flex justify-center">
                      <div
                        className={`size-[14px] rounded-[2px] transition-opacity ${
                          day.hasRun
                            ? "hover:opacity-80 cursor-default"
                            : "bg-stone-100"
                        }`}
                        style={day.hasRun ? { backgroundColor: cellColor } : undefined}
                        onMouseEnter={(e) => {
                          if (!day.hasRun || dayAcc === null) return;
                          const rect = e.currentTarget.getBoundingClientRect();
                          const containerRect = e.currentTarget.closest(".relative")!.getBoundingClientRect();
                          setTooltip({
                            x: rect.left - containerRect.left + rect.width / 2,
                            y: rect.top - containerRect.top,
                            date: day.date,
                            accuracy: dayAcc!,
                          });
                        }}
                        onMouseLeave={() => setTooltip(null)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-stone-100">
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-[2px] bg-emerald-500" />
          <span className="text-[11px] text-stone-400">&ge; 95%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-[2px] bg-[#D4A96A]" />
          <span className="text-[11px] text-stone-400">90&ndash;95%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-[2px] bg-rose-400" />
          <span className="text-[11px] text-stone-400">&lt; 90%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-[2px] bg-stone-100 border border-stone-200" />
          <span className="text-[11px] text-stone-400">no run</span>
        </div>
      </div>

      {/* Hover tooltip */}
      {tooltip && (
        <div
          className="absolute z-50 bg-stone-800 text-white text-[11px] px-3 py-2 rounded-lg shadow-lg pointer-events-none whitespace-nowrap"
          style={{
            left: tooltip.x,
            top: tooltip.y - 4,
            transform: "translate(-50%, -100%)",
          }}
        >
          <p className="font-medium">{formatDate(tooltip.date, "short")}</p>
          <p className="text-stone-300 mt-0.5">{(tooltip.accuracy * 100).toFixed(1)}%</p>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// THRESHOLD LEGEND
// =============================================================================

function ThresholdLegend() {
  return (
    <div className="flex items-center gap-5 mb-5 px-1">
      <div className="flex items-center gap-1.5">
        <span className="size-2.5 rounded-full bg-emerald-500" />
        <span className="text-xs text-stone-500">&ge; 95%</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="size-2.5 rounded-full bg-amber-400" />
        <span className="text-xs text-stone-500">90&ndash;95%</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="size-2.5 rounded-full bg-rose-400" />
        <span className="text-xs text-stone-500">&lt; 90%</span>
      </div>
    </div>
  );
}

// =============================================================================
// SCHEDULE DIALOG
// =============================================================================

const SCHEDULE_OPTIONS: { value: RunSchedule; label: string; description: string }[] = [
  { value: "daily", label: "Daily", description: "Run tests automatically every day at 2:00 AM" },
  { value: "weekly", label: "Weekly", description: "Run tests automatically every Monday at 2:00 AM" },
  { value: "manual", label: "Manual only", description: "Tests only run when triggered manually" },
];

function ScheduleDialog({
  open,
  schedule,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  schedule: RunSchedule;
  onOpenChange: (open: boolean) => void;
  onSave: (value: RunSchedule) => void;
}) {
  const [selected, setSelected] = useState(schedule);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-full bg-white border border-stone-200 p-6">
        <DialogHeader>
          <DialogTitle>Test Schedule</DialogTitle>
          <DialogDescription>
            Configure how often form accuracy tests run automatically across all visa types.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-2">
          {SCHEDULE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSelected(opt.value)}
              className={`w-full text-left px-4 py-3 rounded-lg border transition-colors cursor-pointer ${
                selected === opt.value
                  ? "border-[#0E4268] bg-[#0E4268]/5"
                  : "border-stone-200 hover:border-stone-300"
              }`}
            >
              <p className={`text-sm font-medium ${selected === opt.value ? "text-[#0E4268]" : "text-stone-700"}`}>
                {opt.label}
              </p>
              <p className="text-xs text-stone-500 mt-0.5">{opt.description}</p>
            </button>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => onSave(selected)}
            className="bg-[#0E4268] text-white hover:bg-[#0B3554]"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// =============================================================================
// SPARKLINE
// =============================================================================

function Sparkline({
  values,
  color,
  width = 80,
  height = 24,
}: {
  values: number[];
  color: string;
  width?: number;
  height?: number;
}) {
  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 0.01;
  const padding = 2;

  const points = values.map((v, i) => {
    const x = padding + (i / (values.length - 1)) * (width - padding * 2);
    const y = height - padding - ((v - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  });

  const lastPoint = points[points.length - 1].split(",");

  return (
    <svg width={width} height={height} className="shrink-0">
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={lastPoint[0]}
        cy={lastPoint[1]}
        r={2.5}
        fill={color}
      />
    </svg>
  );
}

// =============================================================================
// STAT CARD
// =============================================================================

function StatCard({
  icon,
  label,
  value,
  bgColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  bgColor: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-4">
      <div className={`size-10 rounded-lg ${bgColor} flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-stone-500">{label}</p>
        <p className="text-2xl font-semibold text-stone-800 tabular-nums">{value}</p>
      </div>
    </div>
  );
}

// =============================================================================
// VISA TYPE CARD
// =============================================================================

function VisaTypeCard({
  metrics,
  isRunning,
  disableRun,
  onRun,
  onClick,
}: {
  metrics: VisaTypeAccuracyMetrics;
  isRunning: boolean;
  disableRun: boolean;
  onRun: () => void;
  onClick: () => void;
}) {
  const ocrColor = getAccuracyColor(metrics.overallAccuracy);
  const ffColor = getAccuracyColor(metrics.formFillOverallAccuracy);

  return (
    <div className="relative bg-white rounded-xl border border-stone-200 hover:border-stone-300 hover:shadow-sm transition-all text-left w-full">
      {/* Loading overlay */}
      {isRunning && (
        <div className="absolute inset-0 z-10 bg-white/60 rounded-xl flex items-center justify-center backdrop-blur-[1px]">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white shadow-sm border border-stone-200">
            <Loader2 className="size-4 animate-spin text-[#0E4268]" />
            <span className="text-xs font-medium text-stone-600">Running tests...</span>
          </div>
        </div>
      )}

      <button
        onClick={onClick}
        className="w-full text-left px-4 pt-4 pb-4 cursor-pointer"
      >
        {/* Top row: title + run button */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-stone-800 truncate">{metrics.visaTypeName}</h3>
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-stone-100 text-stone-500 shrink-0">
                {metrics.visaTypeCode}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-stone-500">
              <span>{metrics.totalCases} cases</span>
              <span>{metrics.totalFields} fields</span>
              <span>{metrics.totalRuns} runs</span>
            </div>
            {metrics.lastTestDate && (
              <p className="text-xs text-stone-400 mt-1">
                Last tested: {formatDate(metrics.lastTestDate, "short")}
              </p>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRun();
            }}
            disabled={disableRun}
            className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium rounded-md border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 hover:border-stone-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
            title={`Run tests for ${metrics.visaTypeName}`}
          >
            <Play className="size-3" />
            Run
          </button>
        </div>

        {/* Dual accuracy stats */}
        <div className="flex items-center gap-6 mt-3 pt-3 border-t border-stone-100">
          <div className="flex-1">
            <p className="text-[10px] text-stone-400 uppercase tracking-wide">OCR</p>
            <p className={`text-lg font-bold tabular-nums ${ocrColor.text}`}>
              {(metrics.overallAccuracy * 100).toFixed(1)}%
            </p>
          </div>
          <div className="flex-1">
            <p className="text-[10px] text-stone-400 uppercase tracking-wide">Form Fill</p>
            <p className={`text-lg font-bold tabular-nums ${ffColor.text}`}>
              {(metrics.formFillOverallAccuracy * 100).toFixed(1)}%
            </p>
          </div>
        </div>

      </button>
    </div>
  );
}
