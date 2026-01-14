"use client";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FileHubContent } from "./FileHubContent";

export function FileHubPage() {
  return (
    <DndProvider backend={HTML5Backend}>
      <FileHubContent />
    </DndProvider>
  );
}
