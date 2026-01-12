'use client';

import { useEffect } from 'react';
import { CaseDetailSidebar } from './CaseDetailSidebar';
import { CaseDetailContent } from './CaseDetailContent';
import { useCaseDetailStore } from '@/store/case-detail-store';

interface CaseDetailLayoutProps {
  caseId: string;
}

export function CaseDetailLayout({ caseId }: CaseDetailLayoutProps) {
  const setCaseId = useCaseDetailStore((state) => state.setCaseId);

  useEffect(() => {
    setCaseId(caseId);
  }, [caseId, setCaseId]);

  return (
    <div className="h-screen w-full flex">
      <CaseDetailSidebar />
      <CaseDetailContent />
    </div>
  );
}
