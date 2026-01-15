"use client";

import { useState } from "react";
import { CaseProfileCard } from "./CaseProfileCard";
import { FileUploadZone } from "./FileUploadZone";
import { ApplicationCard } from "./ApplicationCard";
import { VisaTypeDialog } from "./ApplicationCard/VisaTypeDialog";

export function OverviewPage() {
  const [visaDialogOpen, setVisaDialogOpen] = useState(false);

  const handleOpenVisaDialog = () => {
    setVisaDialogOpen(true);
  };

  return (
    <div className="h-full overflow-y-auto scrollbar-hide">
      <div className="max-w-7xl w-full mx-auto p-6 pb-20 flex flex-col gap-6">
        {/* Top Section - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[320px]">
          {/* Left Column - Case Profile */}
          <CaseProfileCard onOpenVisaDialog={handleOpenVisaDialog} />

          {/* Right Column - Document Hub */}
          <FileUploadZone />
        </div>

        {/* Application Section - Full Width */}
        <div className="min-h-[360px]">
          <ApplicationCard
            onOpenVisaDialog={handleOpenVisaDialog}
            className="h-full"
          />
        </div>
      </div>

      {/* Shared Visa Type Dialog */}
      <VisaTypeDialog open={visaDialogOpen} onOpenChange={setVisaDialogOpen} />
    </div>
  );
}
