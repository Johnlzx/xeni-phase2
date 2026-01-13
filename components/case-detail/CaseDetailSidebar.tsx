"use client";

import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  ClipboardCheck,
  ArrowLeft,
  FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CaseDetailNavItem } from "@/types/case-detail";
import { useCaseDetailStore } from "@/store/case-detail-store";

interface NavItem {
  id: CaseDetailNavItem;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "file-hub", label: "File Hub", icon: FolderOpen },
  { id: "application", label: "Application", icon: ClipboardCheck },
];

export function CaseDetailSidebar() {
  const router = useRouter();
  const activeNav = useCaseDetailStore((state) => state.activeNav);
  const setActiveNav = useCaseDetailStore((state) => state.setActiveNav);

  return (
    <aside className="w-[200px] h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header with Back Button */}
      <div className="h-16 flex items-center px-3 border-b border-gray-100">
        <button
          onClick={() => router.push("/cases")}
          className="flex items-center gap-2 px-2 py-1.5 -ml-1 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">All Cases</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveNav(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-[#0E4268]/10 text-[#0E4268]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 flex-shrink-0",
                      isActive ? "text-[#0E4268]" : "text-gray-400",
                    )}
                  />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer - Demo Controls (hidden by default, can be toggled) */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={() => useCaseDetailStore.getState().advanceDemoStage()}
          className="w-full text-xs text-gray-400 hover:text-gray-600 py-2 transition-colors"
          title="Advance checklist stage (demo)"
        >
          Demo: Advance Stage
        </button>
      </div>
    </aside>
  );
}
