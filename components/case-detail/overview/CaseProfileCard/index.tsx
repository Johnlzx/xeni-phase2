"use client";

import { useState, useRef, useEffect } from "react";
import {
  User,
  Calendar,
  Globe2,
  FileCheck,
  Pencil,
  Check,
  Mail,
  Phone,
} from "lucide-react";
import { useCaseDetailStore } from "@/store/case-detail-store";
import { cn } from "@/lib/utils";
import { TeamMemberEditor } from "./TeamMemberEditor";
import { getVisaConfig } from "../ApplicationCard/VisaTypeDialog";

interface CaseProfileCardProps {
  onOpenVisaDialog?: () => void;
}

export function CaseProfileCard({ onOpenVisaDialog }: CaseProfileCardProps) {
  const clientProfile = useCaseDetailStore((state) => state.clientProfile);
  const selectedVisaType = useCaseDetailStore(
    (state) => state.selectedVisaType,
  );
  const caseTeam = useCaseDetailStore((state) => state.caseTeam);
  const caseReference = useCaseDetailStore((state) => state.caseReference);
  const setCaseReference = useCaseDetailStore(
    (state) => state.setCaseReference,
  );
  const setLawyer = useCaseDetailStore((state) => state.setLawyer);
  const setAssistant = useCaseDetailStore((state) => state.setAssistant);

  const [isEditingRef, setIsEditingRef] = useState(false);
  const [refValue, setRefValue] = useState(caseReference);
  const refInputRef = useRef<HTMLInputElement>(null);

  const { passport, contactInfo } = clientProfile;
  const visaConfig = selectedVisaType ? getVisaConfig(selectedVisaType) : null;
  const isEmpty = !passport;

  useEffect(() => {
    if (isEditingRef && refInputRef.current) {
      refInputRef.current.focus();
      refInputRef.current.select();
    }
  }, [isEditingRef]);

  const handleRefSave = () => {
    if (refValue.trim()) {
      setCaseReference(refValue.trim());
    } else {
      setRefValue(caseReference);
    }
    setIsEditingRef(false);
  };

  const handleRefKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRefSave();
    } else if (e.key === "Escape") {
      setRefValue(caseReference);
      setIsEditingRef(false);
    }
  };

  return (
    <div className="h-full rounded-xl border border-stone-200 bg-white">
      {/* Header - Name & Reference */}
      <div className="px-4 py-3 border-b border-stone-100">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {isEmpty ? (
              <>
                <h2 className="text-base font-semibold text-stone-400">
                  Client Name
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  Upload passport to auto-fill
                </p>
              </>
            ) : (
              <>
                <h2 className="text-base font-semibold text-stone-800 truncate">
                  {passport.givenNames} {passport.surname}
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  <span className="font-mono">{passport.passportNumber}</span>
                  <span className="mx-1.5 text-stone-300">·</span>
                  <span>{passport.nationality}</span>
                </p>
              </>
            )}
          </div>
          {/* Reference badge */}
          {isEditingRef ? (
            <div className="flex items-center gap-1 shrink-0">
              <input
                ref={refInputRef}
                type="text"
                value={refValue}
                onChange={(e) => setRefValue(e.target.value)}
                onBlur={handleRefSave}
                onKeyDown={handleRefKeyDown}
                className="w-28 font-mono text-xs text-stone-600 bg-white border border-stone-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#0E4268]"
              />
              <button
                onClick={handleRefSave}
                className="size-6 rounded flex items-center justify-center text-stone-500 hover:text-stone-700 hover:bg-stone-100"
                aria-label="Save reference"
              >
                <Check className="size-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setRefValue(caseReference);
                setIsEditingRef(true);
              }}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-stone-100 hover:bg-stone-200 transition-colors group shrink-0"
            >
              <span className="font-mono text-xs text-stone-600">
                {caseReference}
              </span>
              <Pencil className="size-3 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <div className="px-4 py-3 grid grid-cols-2 gap-4">
        {/* Left Column - Personal Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-stone-400 shrink-0" />
            <div>
              <p className="text-[10px] text-stone-400 uppercase">DOB</p>
              <p className={cn("text-sm tabular-nums", isEmpty ? "text-stone-400" : "text-stone-700")}>
                {isEmpty ? "—" : passport.dateOfBirth}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Globe2 className="size-4 text-stone-400 shrink-0" />
            <div>
              <p className="text-[10px] text-stone-400 uppercase">Sex</p>
              <p className={cn("text-sm", isEmpty ? "text-stone-400" : "text-stone-700")}>
                {isEmpty
                  ? "—"
                  : passport.sex === "M"
                    ? "Male"
                    : passport.sex === "F"
                      ? "Female"
                      : "Other"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Mail className="size-4 text-stone-400 shrink-0" />
            <p className={cn("text-sm truncate", isEmpty || !contactInfo?.email ? "text-stone-400" : "text-stone-700")}>
              {contactInfo?.email || "—"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="size-4 text-stone-400 shrink-0" />
            <p className={cn("text-sm tabular-nums", isEmpty || !contactInfo?.phone ? "text-stone-400" : "text-stone-700")}>
              {contactInfo?.phone || "—"}
            </p>
          </div>
        </div>

        {/* Right Column - Case Info */}
        <div className="space-y-3">
          {/* Visa Type - Clickable to open dialog */}
          <div>
            <p className="text-[10px] text-stone-400 uppercase mb-1">Visa</p>
            <button
              onClick={onOpenVisaDialog}
              className={cn(
                "flex items-center gap-2 w-full text-left",
                "hover:bg-stone-50 -mx-0.5 px-0.5 rounded transition-colors",
              )}
            >
              {visaConfig ? (
                <>
                  <div
                    className={cn(
                      "size-5 rounded flex items-center justify-center shrink-0",
                      visaConfig.bgColor,
                    )}
                  >
                    <visaConfig.icon size={12} className={visaConfig.color} />
                  </div>
                  <span className="text-sm text-stone-700 truncate">
                    {visaConfig.shortName}
                  </span>
                </>
              ) : (
                <>
                  <div className="size-5 rounded bg-stone-100 flex items-center justify-center shrink-0">
                    <FileCheck size={12} className="text-stone-400" />
                  </div>
                  <span className="text-sm text-stone-400">Not selected</span>
                </>
              )}
            </button>
          </div>

          {/* Lawyer */}
          <div>
            <p className="text-[10px] text-stone-400 uppercase mb-1">Lawyer</p>
            <TeamMemberEditor
              member={caseTeam.lawyer}
              isCurrentUser={caseTeam.lawyer?.id === "john-001"}
              onSave={setLawyer}
              compact
            />
          </div>

          {/* Assistant */}
          <div>
            <p className="text-[10px] text-stone-400 uppercase mb-1">
              Assistant
            </p>
            <TeamMemberEditor
              member={caseTeam.assistant}
              emptyText="Not assigned"
              onSave={setAssistant}
              onClear={() => setAssistant(undefined)}
              compact
            />
          </div>
        </div>
      </div>
    </div>
  );
}
