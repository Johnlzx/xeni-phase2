"use client";

import { useState, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/custom-badge";
import { CircularProgress } from "@/components/ui/circular-progress";
import { formatDate } from "@/lib/utils";
import type { TestRunResult, FieldMatchStatus } from "@/types/form-accuracy";
import type { TestPath } from "@/types/form-accuracy";

type FilterMode = "all" | "mismatch" | "missing";

const STATUS_BADGE: Record<FieldMatchStatus, { variant: "success" | "error" | "warning" | "info"; label: string }> = {
  match: { variant: "success", label: "Match" },
  mismatch: { variant: "error", label: "Mismatch" },
  missing: { variant: "warning", label: "Missing" },
  extra: { variant: "info", label: "Extra" },
};

function getAccuracyColor(rate: number) {
  if (rate >= 0.95) return { text: "text-emerald-600", ring: "#10B981" };
  if (rate >= 0.90) return { text: "text-amber-600", ring: "#F59E0B" };
  return { text: "text-red-600", ring: "#EF4444" };
}

export function PathDetail({
  path,
  run,
  visaTypeName,
  onBack,
}: {
  path: TestPath;
  run: TestRunResult;
  visaTypeName: string;
  onBack: () => void;
}) {
  const [filter, setFilter] = useState<FilterMode>("all");

  const filteredFields = useMemo(() => {
    if (filter === "all") return run.fieldResults;
    if (filter === "mismatch") return run.fieldResults.filter((f) => f.status === "mismatch");
    return run.fieldResults.filter((f) => f.status === "missing");
  }, [run.fieldResults, filter]);

  const color = getAccuracyColor(run.hitRate);

  return (
    <div className="max-w-5xl mx-auto px-8 py-6">
      {/* Breadcrumb */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 transition-colors mb-4"
      >
        <ArrowLeft className="size-4" />
        <span>{visaTypeName}</span>
        <span className="text-stone-300">/</span>
        <span className="text-stone-700 font-medium">{path.name}</span>
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 mb-6">
        <div className="flex items-start gap-6">
          <CircularProgress
            value={run.hitRate * 100}
            size={72}
            strokeWidth={6}
            color={color.ring}
          />
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-stone-800">{path.name}</h2>
            <p className="text-sm text-stone-500 mt-0.5">{path.description}</p>
            <div className="flex items-center gap-4 mt-3 text-xs text-stone-500">
              <span>{run.totalFields} fields</span>
              <span>Weight: {(path.weight * 100).toFixed(0)}%</span>
              <span>Tested: {formatDate(run.executedAt, "short")}</span>
              <span>Duration: {(run.durationMs / 1000).toFixed(1)}s</span>
            </div>
            {/* Conditions */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {path.conditions.map((c) => (
                <span
                  key={c.fieldId}
                  className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded bg-stone-100 text-stone-600 border border-stone-200"
                >
                  {c.fieldLabel}: {c.selectedValue}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filter + summary */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          {(["all", "mismatch", "missing"] as FilterMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                filter === mode
                  ? "bg-[#0E4268] text-white"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              {mode === "all" ? "All" : mode === "mismatch" ? "Mismatches Only" : "Missing Only"}
            </button>
          ))}
        </div>
        <span className="text-sm text-stone-500">
          <span className={`font-semibold ${color.text}`}>
            {run.matchedFields}/{run.totalFields}
          </span>{" "}
          fields matched ({(run.hitRate * 100).toFixed(1)}%)
        </span>
      </div>

      {/* Field comparison table */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100">
              <th className="text-left text-xs font-medium text-stone-500 px-4 py-3 w-10">#</th>
              <th className="text-left text-xs font-medium text-stone-500 px-4 py-3 w-32">Section</th>
              <th className="text-left text-xs font-medium text-stone-500 px-4 py-3">Field</th>
              <th className="text-left text-xs font-medium text-stone-500 px-4 py-3">Expected</th>
              <th className="text-left text-xs font-medium text-stone-500 px-4 py-3">Actual</th>
              <th className="text-left text-xs font-medium text-stone-500 px-4 py-3 w-24">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredFields.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-sm text-stone-400">
                  No fields match the current filter
                </td>
              </tr>
            ) : (
              filteredFields.map((field, idx) => {
                const badge = STATUS_BADGE[field.status];
                const isIssue = field.status === "mismatch" || field.status === "missing";
                return (
                  <tr
                    key={field.fieldId}
                    className={`border-b border-stone-50 transition-colors ${
                      isIssue ? "bg-red-50/40" : "hover:bg-stone-50/50"
                    }`}
                  >
                    <td className="px-4 py-3 text-xs text-stone-400 tabular-nums">{idx + 1}</td>
                    <td className="px-4 py-3 text-xs text-stone-500">{field.formSection}</td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-stone-700">{field.fieldLabel}</span>
                      {field.note && (
                        <span className="block text-xs text-stone-400 mt-0.5">{field.note}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-stone-700 font-mono text-xs">
                      {field.expectedValue}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-xs">
                      <span className={isIssue ? "text-red-600" : "text-stone-700"}>
                        {field.actualValue ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
