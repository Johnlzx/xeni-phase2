"use client";

import { Agentation } from "agentation";

export function AgentationProvider() {
  // Only render in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return <Agentation />;
}
