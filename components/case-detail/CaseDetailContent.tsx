'use client';

import { useCaseDetailStore } from '@/store/case-detail-store';
import { OverviewPage } from './overview/OverviewPage';
import { DocumentsPage } from './documents/DocumentsPage';
import { ApplicationPage } from './application/ApplicationPage';

export function CaseDetailContent() {
  const activeNav = useCaseDetailStore((state) => state.activeNav);

  return (
    <main className="flex-1 h-full overflow-auto bg-gray-50">
      {activeNav === 'overview' && <OverviewPage />}
      {activeNav === 'documents' && <DocumentsPage />}
      {activeNav === 'application' && <ApplicationPage />}
    </main>
  );
}
