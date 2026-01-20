"use client";

import * as React from "react";
import { Toaster, toast } from "sonner";
import { FloatingButton } from "./floating-button";

interface FloatingButtonContextValue {
  isPluginActive: boolean;
  setPluginActive: (active: boolean) => void;
}

const FloatingButtonContext = React.createContext<FloatingButtonContextValue | null>(null);

export function useFloatingButton() {
  const context = React.useContext(FloatingButtonContext);
  if (!context) {
    throw new Error("useFloatingButton must be used within FloatingButtonProvider");
  }
  return context;
}

interface FloatingButtonProviderProps {
  children: React.ReactNode;
}

export function FloatingButtonProvider({ children }: FloatingButtonProviderProps) {
  const [isPluginActive, setPluginActive] = React.useState(false);

  const handlePluginActivate = React.useCallback(() => {
    setPluginActive(true);
    toast.success("Plugin activated", {
      description: "The plugin has been launched successfully.",
    });
    // Reset after a short delay for demo purposes
    setTimeout(() => setPluginActive(false), 2000);
  }, []);

  return (
    <FloatingButtonContext.Provider value={{ isPluginActive, setPluginActive }}>
      {children}
      <FloatingButton onPluginActivate={handlePluginActivate} />
      <Toaster position="bottom-right" />
    </FloatingButtonContext.Provider>
  );
}
