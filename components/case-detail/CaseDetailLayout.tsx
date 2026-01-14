"use client";

import { useEffect, useRef } from "react";
import { CaseDetailHeader } from "./CaseDetailHeader";
import { CaseDetailContent } from "./CaseDetailContent";
import { useCaseDetailStore } from "@/store/case-detail-store";

interface CaseDetailLayoutProps {
  caseId: string;
}

export function CaseDetailLayout({ caseId }: CaseDetailLayoutProps) {
  const setCaseId = useCaseDetailStore((state) => state.setCaseId);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCaseId(caseId);
  }, [caseId, setCaseId]);

  return (
    <div className="h-dvh w-full flex flex-col bg-stone-50">
      {/* Fixed Header with scroll-aware layout */}
      <CaseDetailHeader contentRef={contentRef} />

      {/* Scrollable Content Area */}
      <main ref={contentRef} className="flex-1 overflow-auto">
        <CaseDetailContent />
      </main>
    </div>
  );
}
