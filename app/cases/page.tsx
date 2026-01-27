"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Globe, MoreVertical, Trash2, Settings, X, Plus } from "lucide-react";
import { XeniLogo } from "@/components/case-detail/XeniLogo";
import { CreateCaseModal } from "@/components/case-hub/CreateCaseModal";
import { CaseListEmptyState } from "@/components/case-hub/CaseListEmptyState";
import { useCaseDetailStore } from "@/store/case-detail-store";
import { VISA_TYPES, CASE_STATUSES, ROUTES } from "@/data/constants";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import type { Case, VisaType, PassportInfo } from "@/types";

export default function CasesPage() {
  const router = useRouter();
  const [cases, setCases] = useState<Case[]>([]);
  const [settingsCase, setSettingsCase] = useState<Case | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleOpenCreateModal = useCallback(() => {
    setShowCreateModal(true);
  }, []);

  // Get store initialization function
  const initializeCaseFromCreation = useCaseDetailStore(
    (state) => state.initializeCaseFromCreation,
  );

  const handleCreateCase = useCallback(
    (data: {
      visaType: VisaType;
      referenceNumber: string;
      advisorId: string;
      assistantId?: string;
      passport: PassportInfo;
      caseNotesFile: File;
      passportFile: File;
    }) => {
      // Generate a new case ID
      const newCaseId = `case-new-${Date.now()}`;

      // Initialize the case store with documents and visa type
      // Case notes and passport are special - auto-confirmed (no need for review)
      initializeCaseFromCreation({
        visaType: data.visaType,
        passport: data.passport,
        caseNotesFileName: data.caseNotesFile.name,
        passportFileName: data.passportFile.name,
        referenceNumber: data.referenceNumber,
        advisorId: data.advisorId,
        assistantId: data.assistantId,
      });

      // Store case data for session persistence
      const newCaseData = {
        id: newCaseId,
        createdAt: new Date().toISOString(),
        visaType: data.visaType,
        referenceNumber: data.referenceNumber,
        advisorId: data.advisorId,
        assistantId: data.assistantId,
        passport: data.passport,
        hasCaseNotes: !!data.caseNotesFile,
      };
      sessionStorage.setItem(
        `new-case-${newCaseId}`,
        JSON.stringify(newCaseData),
      );

      // Navigate to the case overview
      router.push(ROUTES.CASE_DETAIL(newCaseId));
    },
    [router, initializeCaseFromCreation],
  );

  const handleDeleteCase = (caseId: string) => {
    if (confirm("Are you sure you want to delete this case?")) {
      setCases(cases.filter((c) => c.id !== caseId));
    }
  };

  const handleOpenSettings = (caseData: Case) => {
    setSettingsCase(caseData);
  };

  const handleSaveSettings = (
    caseId: string,
    data: { referenceNumber: string; advisorId: string; assistantId: string },
  ) => {
    console.log("Saving settings for case:", caseId, data);
    setSettingsCase(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="h-14 bg-white border-b border-stone-200 px-6 flex items-center justify-between sticky top-0 z-40">
        <Link
          href="/cases"
          className="hover:opacity-80 transition-opacity"
          aria-label="Xeni home"
        >
          <XeniLogo size="md" />
        </Link>
        <div className="flex items-center gap-3">
          <button
            className="size-8 rounded-full bg-[#0E4268] text-white font-medium flex items-center justify-center text-sm"
            aria-label="User menu"
          >
            JD
          </button>
        </div>
      </header>

      {/* Action Bar - only show when there are cases */}
      {cases.length > 0 && (
        <div className="sticky top-14 z-10 bg-[#F8FAFC] border-b border-gray-100">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Left: Title */}
              <h1 className="text-xl font-semibold text-gray-900">Cases</h1>

              {/* Right: New Case Button */}
              <button
                onClick={handleOpenCreateModal}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#0E4369] hover:bg-[#0B3654] text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                New Case
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="p-8">
        {cases.length === 0 ? (
          <CaseListEmptyState onCreateCase={handleOpenCreateModal} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cases.map((caseItem) => (
              <CaseCard
                key={caseItem.id}
                caseData={caseItem}
                onDelete={handleDeleteCase}
                onOpenSettings={handleOpenSettings}
              />
            ))}
          </div>
        )}
      </main>

      {/* Case Settings Modal */}
      {settingsCase && (
        <CaseSettingsModal
          caseData={settingsCase}
          onClose={() => setSettingsCase(null)}
          onSave={handleSaveSettings}
        />
      )}

      {/* Create Case Modal */}
      <CreateCaseModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateCase}
      />
    </div>
  );
}

interface CaseCardProps {
  caseData: Case;
  onDelete: (caseId: string) => void;
  onOpenSettings: (caseData: Case) => void;
}

function CaseCard({ caseData, onDelete, onOpenSettings }: CaseCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const visaConfig = VISA_TYPES[caseData.visaType];
  const statusConfig = CASE_STATUSES[caseData.status];

  const statusLabel =
    statusConfig.label === "Intake" ? "In take" : statusConfig.label;

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Link href={ROUTES.CASE_DETAIL(caseData.id)}>
      <div className="group bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300 p-5 min-h-[180px] flex flex-col">
        {/* Top Row: Tags and Menu */}
        <div className="flex items-center justify-between mb-auto">
          <div className="flex items-center gap-2">
            {/* Visa Type Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white text-sm font-medium text-[#475569]">
              <Globe className="w-4 h-4 text-[#64748B]" />
              {visaConfig.label}
            </span>
            {/* Status Badge */}
            <span className="inline-flex items-center px-3 py-1.5 rounded-full border border-gray-200 bg-white text-sm font-medium text-[#475569]">
              {statusLabel}
            </span>
          </div>
          {/* Menu Button */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-[#94A3B8]" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowMenu(false);
                    onOpenSettings(caseData);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                >
                  <Settings className="w-4 h-4 text-[#64748B]" />
                  Case Settings
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowMenu(false);
                    onDelete(caseData.id);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Case
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Applicant Name */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-900 tracking-tight">
            {caseData.applicant.passport.givenNames}{" "}
            {caseData.applicant.passport.surname}
          </h3>
        </div>

        {/* Bottom Row: Reference and Date */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
          <span className="text-sm text-[#94A3B8]">
            Ref No. {caseData.referenceNumber}
          </span>
          <span className="text-sm text-[#94A3B8]">
            Created at {formatDate(caseData.createdAt, "long")}
          </span>
        </div>
      </div>
    </Link>
  );
}

// Case Settings Modal Component
interface CaseSettingsModalProps {
  caseData: Case;
  onClose: () => void;
  onSave: (
    caseId: string,
    data: { referenceNumber: string; advisorId: string; assistantId: string },
  ) => void;
}

function CaseSettingsModal({
  caseData,
  onClose,
  onSave,
}: CaseSettingsModalProps) {
  const [referenceNumber, setReferenceNumber] = useState(
    caseData.referenceNumber,
  );
  const [advisorId, setAdvisorId] = useState(caseData.advisor.id);
  const [assistantId, setAssistantId] = useState(caseData.assistant?.id || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(caseData.id, { referenceNumber, advisorId, assistantId });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Case Settings</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Reference Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Reference Number
            </label>
            <input
              type="text"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0E4369]/20 focus:border-[#0E4369] transition-colors"
              placeholder="Enter reference number"
            />
          </div>

          {/* Advisor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Advisor
            </label>
            <select
              value={advisorId}
              onChange={(e) => setAdvisorId(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0E4369]/20 focus:border-[#0E4369] transition-colors bg-white"
            >
              <option value="user-001">John Smith</option>
              <option value="user-002">Sarah Johnson</option>
              <option value="user-003">Michael Chen</option>
            </select>
          </div>

          {/* Assistant */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Assistant
            </label>
            <select
              value={assistantId}
              onChange={(e) => setAssistantId(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0E4369]/20 focus:border-[#0E4369] transition-colors bg-white"
            >
              <option value="">No assistant assigned</option>
              <option value="user-002">Sarah Johnson</option>
              <option value="user-004">Emily Davis</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 text-sm font-medium text-white bg-[#0E4369] hover:bg-[#0B3654] rounded-lg transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
