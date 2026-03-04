"use client";

import { LayoutGrid, FileText, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export type OpsMenuItem = "workspaces" | "visa-types" | "form-accuracy";

const MENU_ITEMS: { id: OpsMenuItem; label: string; icon: React.ElementType }[] = [
  { id: "workspaces", label: "Workspaces", icon: LayoutGrid },
  { id: "visa-types", label: "Visa Types", icon: FileText },
  { id: "form-accuracy", label: "Form Accuracy", icon: ClipboardCheck },
];

export function OpsSidebar({
  activeItem,
  onNavigate,
}: {
  activeItem: OpsMenuItem;
  onNavigate: (item: OpsMenuItem) => void;
}) {
  return (
    <nav className="w-[200px] shrink-0 border-r border-stone-200 bg-white py-3 px-2">
      <div className="space-y-0.5">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#0E4268] text-white"
                  : "text-stone-600 hover:bg-stone-100"
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
