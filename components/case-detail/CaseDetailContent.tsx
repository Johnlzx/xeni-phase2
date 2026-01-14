"use client";

import { useCaseDetailStore } from "@/store/case-detail-store";
import { OverviewPage } from "./overview/OverviewPage";
import { FileHubPage } from "./file-hub";
import { ApplicationPage } from "./application/ApplicationPage";

export function CaseDetailContent() {
  const activeNav = useCaseDetailStore((state) => state.activeNav);

  return (
    <div className="min-h-full bg-stone-50">
      {activeNav === "overview" && <OverviewPage />}
      {activeNav === "documents" && <FileHubPage />}
      {activeNav === "application" && <ApplicationPage />}
    </div>
  );
}
