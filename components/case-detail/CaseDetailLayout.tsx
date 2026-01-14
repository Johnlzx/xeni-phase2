"use client";

import { useEffect, useRef, useState } from "react";
import { CaseDetailHeader } from "./CaseDetailHeader";
import { CaseDetailContent } from "./CaseDetailContent";
import { useCaseDetailStore } from "@/store/case-detail-store";

interface CaseDetailLayoutProps {
  caseId: string;
}

export function CaseDetailLayout({ caseId }: CaseDetailLayoutProps) {
  const setCaseId = useCaseDetailStore((state) => state.setCaseId);
  const contentRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(104);

  useEffect(() => {
    setCaseId(caseId);
  }, [caseId, setCaseId]);

  // Update CSS variable when header height changes
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--header-height",
      `${headerHeight}px`
    );
  }, [headerHeight]);

  return (
    <div className="h-dvh w-full flex flex-col bg-stone-50">
      {/* Fixed Header with scroll-aware layout */}
      <CaseDetailHeader
        contentRef={contentRef}
        onHeightChange={setHeaderHeight}
      />

      {/* Scrollable Content Area */}
      <main ref={contentRef} className="flex-1 overflow-auto">
        <CaseDetailContent />
      </main>
    </div>
  );
}
