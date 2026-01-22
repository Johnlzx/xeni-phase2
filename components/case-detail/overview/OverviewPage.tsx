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
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col px-4 lg:px-6 py-4 gap-4 min-h-0">
        {/* Top Row - Case Notes & Documents (side by side, fixed height) */}
        <div className="shrink-0 grid grid-cols-1 lg:grid-cols-2 gap-4 h-[280px]">
          {/* Case Notes Card */}
          <CaseProfileCard onOpenVisaDialog={handleOpenVisaDialog} />

          {/* Documents Card */}
          <FileUploadZone />
        </div>

        {/* Application Card - fills remaining space, scrolls internally */}
        <div className="flex-1 min-h-0">
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
