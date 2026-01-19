"use client";

import {
  X,
  User,
  Calendar,
  Hash,
  Globe,
  MapPin,
  Users,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PassportInfo } from "@/types";

interface PassportPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  passport: PassportInfo | undefined;
}

// Format date from ISO to display format (DD MMM YYYY)
function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "—";
  try {
    const date = new Date(dateStr);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(/ /g, " ");
  } catch {
    return dateStr;
  }
}

// Check if passport is expiring soon (within 6 months)
function isExpiringSoon(dateStr: string | undefined): boolean {
  if (!dateStr) return false;
  const expiry = new Date(dateStr);
  const sixMonthsFromNow = new Date();
  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
  return expiry <= sixMonthsFromNow;
}

// Generate MRZ lines based on passport info
function generateMRZ(passport: PassportInfo): { line1: string; line2: string } {
  const surname = passport.surname.toUpperCase().replace(/\s/g, "");
  const givenNames = passport.givenNames.toUpperCase().replace(/\s/g, "<");
  const nationality = passport.nationality.slice(0, 3).toUpperCase();
  const passportNumber = passport.passportNumber.padEnd(9, "<");
  const dob = passport.dateOfBirth.replace(/-/g, "").slice(2);
  const sex = passport.sex;
  const expiry = passport.dateOfExpiry.replace(/-/g, "").slice(2);

  const line1 = `P<${nationality}${surname}<<${givenNames}`.padEnd(44, "<");
  const line2 = `${passportNumber}<${nationality}${dob}<${sex}${expiry}<<<<<<<<`.slice(0, 44);

  return { line1, line2 };
}

// Field component
function Field({
  icon: Icon,
  label,
  value,
  className,
  valueClassName,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  className?: string;
  valueClassName?: string;
}) {
  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center gap-1.5">
        <Icon className="size-3.5 text-stone-400" />
        <span className="text-[10px] font-medium text-stone-400 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className={cn("text-sm font-medium text-stone-800", valueClassName)}>
        {value}
      </p>
    </div>
  );
}

export function PassportPreviewModal({
  open,
  onOpenChange,
  passport,
}: PassportPreviewModalProps) {
  if (!open) return null;

  const mrz = passport ? generateMRZ(passport) : null;
  const expiringSoon = passport ? isExpiringSoon(passport.dateOfExpiry) : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0E4268] to-[#1a5a8a] px-5 py-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Photo placeholder */}
              <div className="size-16 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                <User className="size-8 text-white/60" />
              </div>
              {/* Name and badges */}
              <div>
                <p className="text-[10px] font-medium text-white/60 uppercase tracking-wider mb-0.5">
                  Passport Details
                </p>
                {passport ? (
                  <>
                    <h2 className="text-lg font-semibold text-white">
                      {passport.givenNames} {passport.surname}
                    </h2>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/15 text-[10px] font-medium text-white">
                        <Globe className="size-3" />
                        {passport.nationality}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-[10px] font-medium text-emerald-300">
                        <ShieldCheck className="size-3" />
                        Verified
                      </span>
                    </div>
                  </>
                ) : (
                  <h2 className="text-lg font-semibold text-white/60">
                    No Data
                  </h2>
                )}
              </div>
            </div>
            {/* Close button */}
            <button
              onClick={() => onOpenChange(false)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="size-5 text-white/70" />
            </button>
          </div>
        </div>

        {/* Content */}
        {passport ? (
          <div className="p-5">
            {/* Personal Information */}
            <div className="grid grid-cols-2 gap-4">
              <Field
                icon={User}
                label="Given Names"
                value={passport.givenNames}
              />
              <Field
                icon={User}
                label="Surname"
                value={passport.surname}
              />
              <Field
                icon={Calendar}
                label="Date of Birth"
                value={formatDate(passport.dateOfBirth)}
              />
              <Field
                icon={Users}
                label="Sex"
                value={passport.sex === "M" ? "Male" : passport.sex === "F" ? "Female" : "Other"}
              />
              <Field
                icon={MapPin}
                label="Country of Birth"
                value={passport.countryOfBirth || "—"}
              />
              <Field
                icon={Globe}
                label="Nationality"
                value={passport.nationality}
              />
            </div>

            {/* Divider */}
            <div className="my-4 border-t border-stone-100" />

            {/* Document Information */}
            <p className="text-[10px] font-medium text-stone-400 uppercase tracking-wider mb-3">
              Document Information
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Field
                icon={Hash}
                label="Passport Number"
                value={passport.passportNumber}
                valueClassName="font-mono tracking-wider"
              />
              <Field
                icon={Calendar}
                label="Date of Issue"
                value={formatDate(passport.dateOfIssue)}
              />
              <Field
                icon={Calendar}
                label="Date of Expiry"
                value={formatDate(passport.dateOfExpiry)}
                valueClassName={cn(
                  expiringSoon && "text-amber-600"
                )}
              />
            </div>

            {/* Divider */}
            <div className="my-4 border-t border-stone-100" />

            {/* MRZ Zone */}
            <p className="text-[10px] font-medium text-stone-400 uppercase tracking-wider mb-2">
              Machine Readable Zone
            </p>
            {mrz && (
              <div className="bg-stone-900 rounded-lg px-3 py-2.5 font-mono text-[11px] text-stone-300 leading-relaxed overflow-x-auto">
                <p className="whitespace-nowrap">{mrz.line1}</p>
                <p className="whitespace-nowrap">{mrz.line2}</p>
              </div>
            )}

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2 text-xs text-stone-400">
              <FileText className="size-3.5" />
              <span>Data extracted from uploaded passport document</span>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="p-8 text-center">
            <div className="size-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-3">
              <User className="size-8 text-stone-300" />
            </div>
            <p className="text-sm font-medium text-stone-600">
              No passport data available
            </p>
            <p className="text-xs text-stone-400 mt-1">
              Run document analysis to extract passport information
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
