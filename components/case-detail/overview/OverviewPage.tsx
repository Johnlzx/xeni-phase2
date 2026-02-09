"use client";

import { useState } from "react";
import { CaseProfileCard } from "./CaseProfileCard";
import { FileUploadZone } from "./FileUploadZone";
import { ApplicationCard } from "./ApplicationCard";
import { VisaTypeDialog } from "./ApplicationCard/VisaTypeDialog";

export function OverviewPage() {
  const [analysisDialogOpen, setAnalysisDialogOpen] = useState(false);

  const handleOpenAnalysisDialog = () => {
    setAnalysisDialogOpen(true);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col px-6 lg:px-10 py-4 gap-4 min-h-0">
        {/* Top Row - Case Notes & Documents (side by side, fixed height) */}
        <div className="shrink-0 grid grid-cols-1 lg:grid-cols-2 gap-4 h-[280px]">
          {/* Case Notes Card */}
          <CaseProfileCard />

          {/* Documents Card */}
          <FileUploadZone />
        </div>

        {/* Application Card - half height of container */}
        <div className="h-1/2 min-h-0">
          <ApplicationCard
            onStartAnalysis={handleOpenAnalysisDialog}
            className="h-full"
          />
        </div>
      </div>

      {/* Analysis Confirmation Dialog */}
      <VisaTypeDialog open={analysisDialogOpen} onOpenChange={setAnalysisDialogOpen} />
    </div>
  );
}
