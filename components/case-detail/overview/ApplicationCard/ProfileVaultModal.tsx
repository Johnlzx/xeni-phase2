"use client";

import { useState } from "react";
import { X, ChevronRight, AlertCircle, Pencil, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileVaultModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data for profile sections
const PROFILE_SECTIONS = [
  {
    id: "accommodation",
    title: "Accommodation",
    isComplete: false,
    fields: [
      {
        id: "knowsWhereStaying",
        label: "knowsWhereStaying",
        type: "checkbox",
        value: false,
        description: "Do you know where you will be staying in the UK?",
      },
      {
        id: "stayType",
        label: "stayType",
        type: "select",
        value: "initial",
        options: ["initial", "temporary", "intendedResidence"],
        required: true,
        description:
          "Type of stay: 'initial' = first address upon arrival, 'temporary' = short-term stay (hotel, B&B, friends), 'intendedResidence' = where couple will live with sponsor",
      },
      {
        id: "stayingWithName",
        label: "stayingWithName",
        type: "text",
        value: "XXXXX",
        description:
          "If staying with friends, relatives, or another person, give their full name. For hotels/B&Bs, enter the accommodation name.",
      },
      {
        id: "address",
        label: "address",
        type: "text",
        value: "",
        description: "Full address of accommodation",
      },
    ],
  },
  {
    id: "planned-travel",
    title: "Planned Travel",
    isComplete: false,
    fields: [
      {
        id: "departureDate",
        label: "departureDate",
        type: "date",
        value: "",
        description: "When do you plan to travel to the UK?",
      },
    ],
  },
  {
    id: "sex-relationship",
    title: "Sex Relationship",
    isComplete: false,
    fields: [],
  },
  {
    id: "special-country-travel",
    title: "Special Country Travel History",
    isComplete: false,
    fields: [],
  },
  {
    id: "sponsor",
    title: "Sponsor",
    isComplete: false,
    fields: [],
  },
  {
    id: "sponsor-finance",
    title: "Sponsor Finance",
    isComplete: false,
    fields: [],
  },
  {
    id: "uk-medical",
    title: "UK Medical",
    isComplete: false,
    fields: [],
  },
  {
    id: "uk-travel-history",
    title: "UK Travel History",
    isComplete: false,
    fields: [],
  },
  {
    id: "visa-type",
    title: "Visa Type",
    isComplete: true,
    fields: [],
  },
  {
    id: "world-travel-history",
    title: "World Travel History",
    isComplete: false,
    fields: [],
  },
];

// Field component
function FieldInput({
  field,
}: {
  field: {
    id: string;
    label: string;
    type: string;
    value: unknown;
    options?: string[];
    required?: boolean;
    description?: string;
  };
}) {
  const [value, setValue] = useState(field.value);

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-stone-800">
        {field.label}
        {field.required && <span className="text-rose-500">*</span>}
      </label>

      {field.type === "checkbox" && (
        <button
          onClick={() => setValue(!value)}
          className={cn(
            "size-5 rounded border-2 flex items-center justify-center transition-colors",
            value
              ? "bg-[#0E4268] border-[#0E4268] text-white"
              : "border-stone-300 bg-white"
          )}
        >
          {Boolean(value) && <Check className="size-3" strokeWidth={3} />}
        </button>
      )}

      {field.type === "select" && field.options && (
        <div className="relative">
          <select
            value={value as string}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm bg-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0E4268]/20 focus:border-[#0E4268]"
          >
            {field.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-stone-400 rotate-90 pointer-events-none" />
        </div>
      )}

      {field.type === "text" && (
        <input
          type="text"
          value={value as string}
          onChange={(e) => setValue(e.target.value)}
          placeholder={field.label}
          className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0E4268]/20 focus:border-[#0E4268]"
        />
      )}

      {field.type === "date" && (
        <input
          type="date"
          value={value as string}
          onChange={(e) => setValue(e.target.value)}
          className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0E4268]/20 focus:border-[#0E4268]"
        />
      )}

      {field.description && (
        <p className="text-xs text-stone-500 text-pretty">{field.description}</p>
      )}
    </div>
  );
}

// Section component
function ProfileSection({
  section,
}: {
  section: {
    id: string;
    title: string;
    isComplete: boolean;
    fields: {
      id: string;
      label: string;
      type: string;
      value: unknown;
      options?: string[];
      required?: boolean;
      description?: string;
    }[];
  };
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-stone-200 bg-white overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-4 flex items-center justify-between hover:bg-stone-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <ChevronRight
            className={cn(
              "size-4 text-stone-400 transition-transform",
              isExpanded && "rotate-90"
            )}
          />
          <span className="text-sm font-medium text-stone-700">
            {section.title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {!section.isComplete && (
            <AlertCircle className="size-5 text-amber-500" />
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(true);
            }}
            className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
            aria-label={`Edit ${section.title}`}
          >
            <Pencil className="size-4" />
          </button>
        </div>
      </button>

      {/* Content */}
      {isExpanded && section.fields.length > 0 && (
        <div className="px-4 pb-4 pt-2 border-t border-stone-100">
          <div className="space-y-4">
            {section.fields.map((field) => (
              <FieldInput key={field.id} field={field} />
            ))}
          </div>
        </div>
      )}

      {isExpanded && section.fields.length === 0 && (
        <div className="px-4 pb-4 pt-2 border-t border-stone-100">
          <p className="text-sm text-stone-400 text-center py-4">
            No fields configured
          </p>
        </div>
      )}
    </div>
  );
}

export function ProfileVaultModal({
  open,
  onOpenChange,
}: ProfileVaultModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-stone-50 rounded-2xl shadow-xl overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4 bg-white border-b border-stone-200">
          <h2 className="text-lg font-semibold text-stone-900">Profile vault</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="size-5 text-stone-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {PROFILE_SECTIONS.map((section) => (
              <ProfileSection key={section.id} section={section} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
