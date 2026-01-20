"use client";

import { useState, useRef, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Pencil, Check, FileText, Users, BookOpen, AlertCircle } from "lucide-react";
import { useCaseDetailStore, useCaseNotesSummary, useClientProfile, useDocumentGroups } from "@/store/case-detail-store";
import { cn } from "@/lib/utils";
import { TeamMemberEditor } from "./TeamMemberEditor";
import { PassportPreviewModal } from "./PassportPreviewModal";
import { CategoryReviewModal } from "../../shared";

interface CaseProfileCardProps {
  onOpenVisaDialog?: () => void;
}

export function CaseProfileCard({ onOpenVisaDialog }: CaseProfileCardProps) {
  const caseNotesSummary = useCaseNotesSummary();
  const clientProfile = useClientProfile();
  const documentGroups = useDocumentGroups();
  const caseTeam = useCaseDetailStore((state) => state.caseTeam);
  const caseReference = useCaseDetailStore((state) => state.caseReference);
  const setCaseReference = useCaseDetailStore(
    (state) => state.setCaseReference,
  );
  const setLawyer = useCaseDetailStore((state) => state.setLawyer);
  const setAssistant = useCaseDetailStore((state) => state.setAssistant);

  const [isEditingRef, setIsEditingRef] = useState(false);
  const [refValue, setRefValue] = useState(caseReference);
  const [passportModalOpen, setPassportModalOpen] = useState(false);
  const [passportReviewModalOpen, setPassportReviewModalOpen] = useState(false);

  // Check if passport document has been reviewed
  const passportGroup = documentGroups.find((g) => g.id === "passport");
  const isPassportReviewed = passportGroup?.status === "reviewed";

  const handleViewFullPassport = () => {
    setPassportModalOpen(false);
    if (passportGroup) {
      setPassportReviewModalOpen(true);
    }
  };
  const refInputRef = useRef<HTMLInputElement>(null);

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
      {/* Header */}
      <div className="shrink-0 h-14 px-4 flex items-center justify-between gap-3 bg-stone-50 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg border border-stone-300 bg-white flex items-center justify-center">
            <FileText className="size-4 text-stone-500" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-stone-800">Case Notes</h2>
            <p className="text-xs text-stone-500">Summary & Configuration</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Passport Preview Button */}
          <button
            onClick={() => setPassportModalOpen(true)}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all",
              clientProfile.passport
                ? isPassportReviewed
                  ? "bg-gradient-to-r from-[#0E4268] to-[#1a5a8a] text-white shadow-sm hover:shadow-md hover:scale-[1.02]"
                  : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                : "bg-stone-100 text-stone-400 hover:bg-stone-200"
            )}
            title={
              clientProfile.passport
                ? isPassportReviewed
                  ? "View passport details"
                  : "Passport pending review"
                : "No passport data"
            }
          >
            <BookOpen className="size-3.5" />
            <span>Passport</span>
            {clientProfile.passport && (
              isPassportReviewed ? (
                <span className="size-1.5 rounded-full bg-emerald-400" />
              ) : (
                <AlertCircle className="size-3.5 text-amber-500" />
              )
            )}
          </button>

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
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4 overflow-y-auto scrollbar-hide flex flex-col gap-4">
        {/* Case Notes Summary */}
        <div className="flex-1">
          <div className="flex items-center gap-1.5 mb-2">
            <FileText className="size-3.5 text-stone-400" />
            <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">
              Summary
            </p>
          </div>
          {caseNotesSummary ? (
            <p className="text-sm text-stone-700 leading-relaxed">
              {caseNotesSummary.summary}
            </p>
          ) : (
            <p className="text-sm text-stone-400 italic">
              Upload case notes to generate summary
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-stone-100" />

        {/* Team Configuration */}
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <Users className="size-3.5 text-stone-400" />
            <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">
              Case Team
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {/* Lawyer */}
            <div className="bg-stone-50 rounded-lg px-3 py-2.5">
              <p className="text-[10px] text-stone-500 uppercase tracking-wider mb-1">
                Lawyer
              </p>
              <TeamMemberEditor
                member={caseTeam.lawyer}
                isCurrentUser={caseTeam.lawyer?.id === "john-001"}
                onSave={setLawyer}
                compact
              />
            </div>

            {/* Assistant */}
            <div className="bg-stone-50 rounded-lg px-3 py-2.5">
              <p className="text-[10px] text-stone-500 uppercase tracking-wider mb-1">
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

      {/* Passport Preview Modal */}
      <PassportPreviewModal
        open={passportModalOpen}
        onOpenChange={setPassportModalOpen}
        passport={clientProfile.passport}
        isReviewed={isPassportReviewed}
        onViewFullPassport={passportGroup ? handleViewFullPassport : undefined}
      />

      {/* Passport Review Modal (Full Document View) - wrapped in DndProvider for drag-drop support */}
      {passportReviewModalOpen && passportGroup && (
        <DndProvider backend={HTML5Backend}>
          <CategoryReviewModal
            group={passportGroup}
            allGroups={documentGroups}
            onClose={() => setPassportReviewModalOpen(false)}
          />
        </DndProvider>
      )}
    </div>
  );
}
