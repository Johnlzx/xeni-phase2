"use client";

import dynamic from "next/dynamic";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// Dynamically import the document management components
const DocumentManagerContent = dynamic(
  () => import("./DocumentManagerContent"),
  {
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading documents...</p>
        </div>
      </div>
    ),
  },
);

export function DocumentsPage() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-full bg-gray-50">
        <DocumentManagerContent />
      </div>
    </DndProvider>
  );
}
