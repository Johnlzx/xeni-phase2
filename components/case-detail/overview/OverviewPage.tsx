"use client";

import { ClientProfileCard } from "./ClientProfileCard";
import { VisaTypeSelector } from "./VisaTypeSelector";
import { FileUploadZone } from "./FileUploadZone";
import { ProgressDashboard } from "./ProgressDashboard";
import { DynamicChecklist } from "../checklist/DynamicChecklist";
import { DemoControls } from "./DemoControls";

export function OverviewPage() {
  return (
    <div className="h-full overflow-auto">
      <div className="max-w-7xl mx-auto p-4 space-y-4">
        {/* First Viewport Section - Profile, Documents, Dashboard */}
        <div className="min-h-0">
          {/* Top Section - Three Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
            {/* Left Column - Profile */}
            <div className="lg:col-span-5">
              <ClientProfileCard />
            </div>

            {/* Middle Column - Visa Type */}
            <div className="lg:col-span-3">
              <VisaTypeSelector />
            </div>

            {/* Right Column - File Upload */}
            <div className="lg:col-span-4">
              <FileUploadZone />
            </div>
          </div>

          {/* Dashboard Section */}
          <ProgressDashboard />
        </div>

        {/* Bottom Section - Dynamic Checklist (scrollable) */}
        <DynamicChecklist />
      </div>

      {/* Demo Controls - Floating Panel */}
      <DemoControls />
    </div>
  );
}
