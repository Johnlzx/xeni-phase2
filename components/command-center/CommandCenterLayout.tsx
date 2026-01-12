"use client";

import { ReactNode } from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { ChevronRight, FileText } from "lucide-react";
import { useCommandCenterStore } from "@/store/command-center-store";

interface CommandCenterLayoutProps {
  leftPanel?: ReactNode | null;
  mainContent: ReactNode;
  rightPanel: ReactNode;
}

export function CommandCenterLayout({
  leftPanel,
  mainContent,
  rightPanel,
}: CommandCenterLayoutProps) {
  const { ui, setRightPanelCollapsed } = useCommandCenterStore();

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Main Content - Evidence Board */}
        <ResizablePanel
          defaultSize={ui.rightPanelCollapsed ? 100 : 75}
          minSize={50}
        >
          <div className="h-full overflow-auto bg-gray-50">{mainContent}</div>
        </ResizablePanel>

        {/* Right Panel - Documents (completely hidden when collapsed) */}
        {!ui.rightPanelCollapsed && (
          <>
            <ResizableHandle
              withHandle
              className="bg-gray-100 hover:bg-gray-200 transition-colors"
            />

            <ResizablePanel
              defaultSize={25}
              minSize={18}
              maxSize={45}
              className="transition-all duration-200"
            >
              <div className="h-full flex flex-col bg-white border-l border-gray-200">
                {/* Panel Header with Collapse Button */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-semibold text-gray-700">
                      Documents
                    </span>
                  </div>
                  <button
                    onClick={() => setRightPanelCollapsed(true)}
                    className="p-1.5 rounded-md hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Collapse documents panel"
                    title="Close panel"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                {/* Panel Content */}
                <div className="flex-1 overflow-auto">{rightPanel}</div>
              </div>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
}
