"use client";

import { useState, useRef, useEffect } from "react";
import { Pencil, Check, User } from "lucide-react";
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
    <div className="h-full rounded-xl border border-stone-200 bg-white flex flex-col overflow-hidden">
      {/* Header - unified height h-14 */}
      <div className="shrink-0 h-14 px-4 flex items-center justify-between gap-3 bg-stone-50 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg border border-stone-300 bg-white flex items-center justify-center">
            <User className="size-4 text-stone-500" />
          </div>
          <div className="min-w-0">
            {isEmpty ? (
              <>
                <h2 className="text-sm font-semibold text-stone-400">
                  Case Profile
                </h2>
                <p className="text-xs text-stone-400">
                  Upload passport to auto-fill
                </p>
              </>
            ) : (
              <>
                <h2 className="text-sm font-semibold text-stone-800 truncate">
                  {passport.givenNames} {passport.surname}
                </h2>
                <p className="text-xs text-stone-500">
                  <span className="font-mono">{passport.passportNumber}</span>
                  <span className="mx-1.5 text-stone-300">·</span>
                  <span>{passport.nationality}</span>
                </p>
              </>
            )}
          </div>
        </div>
        {/* Reference badge */}
        {isEditingRef ? (
          <div className="flex items-center gap-1.5 shrink-0">
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
              className="size-7 rounded flex items-center justify-center text-stone-500 hover:text-stone-700 hover:bg-stone-100"
              aria-label="Save reference"
            >
              <Check className="size-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setRefValue(caseReference);
              setIsEditingRef(true);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-stone-100 hover:bg-stone-200 transition-colors group shrink-0"
          >
            <span className="font-mono text-xs text-stone-600">
              {caseReference}
            </span>
            <Pencil className="size-3.5 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        )}
      </div>

      {/* Content - compact layout */}
      <div className="flex-1 px-4 py-4 overflow-y-auto scrollbar-hide">
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          {/* Row 1: DOB & Sex */}
          <div>
            <p className="text-xs text-stone-500 mb-1">Date of Birth</p>
            <p
              className={cn(
                "text-sm tabular-nums",
                isEmpty ? "text-stone-400" : "text-stone-800",
              )}
            >
              {isEmpty ? "—" : passport.dateOfBirth}
            </p>
          </div>
          <div>
            <p className="text-xs text-stone-500 mb-1">Sex</p>
            <p
              className={cn(
                "text-sm",
                isEmpty ? "text-stone-400" : "text-stone-800",
              )}
            >
              {isEmpty
                ? "—"
                : passport.sex === "M"
                  ? "Male"
                  : passport.sex === "F"
                    ? "Female"
                    : "Other"}
            </p>
          </div>

          {/* Row 2: Email & Phone */}
          <div>
            <p className="text-xs text-stone-500 mb-1">Email</p>
            <p
              className={cn(
                "text-sm truncate",
                isEmpty || !contactInfo?.email
                  ? "text-stone-400"
                  : "text-stone-800",
              )}
            >
              {contactInfo?.email || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-stone-500 mb-1">Phone</p>
            <p
              className={cn(
                "text-sm tabular-nums truncate",
                isEmpty || !contactInfo?.phone
                  ? "text-stone-400"
                  : "text-stone-800",
              )}
            >
              {contactInfo?.phone || "—"}
            </p>
          </div>

          {/* Row 3: Visa & Lawyer */}
          <div>
            <p className="text-xs text-stone-500 mb-1">Visa Type</p>
            <button
              onClick={onOpenVisaDialog}
              className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
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
                  <span className="text-sm text-stone-800">
                    {visaConfig.shortName}
                  </span>
                </>
              ) : (
                <span className="text-sm text-stone-400">Not selected</span>
              )}
            </button>
          </div>
          <div>
            <p className="text-xs text-stone-500 mb-1">Lawyer</p>
            <TeamMemberEditor
              member={caseTeam.lawyer}
              isCurrentUser={caseTeam.lawyer?.id === "john-001"}
              onSave={setLawyer}
              compact
            />
          </div>

          {/* Row 4: Assistant */}
          <div className="col-span-2">
            <p className="text-xs text-stone-500 mb-1">Assistant</p>
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
