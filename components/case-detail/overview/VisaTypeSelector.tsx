"use client";

import {
  FileCheck,
  ArrowRight,
  Plane,
  GraduationCap,
  Briefcase,
  Users,
  Home,
  Heart,
} from "lucide-react";
import { useCaseDetailStore } from "@/store/case-detail-store";
import { VISA_TYPES } from "@/data/constants";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// Icon mapping for visa types
const VISA_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  "skilled-worker": Briefcase,
  student: GraduationCap,
  family: Users,
  visitor: Plane,
  spouse: Heart,
  ilr: Home,
};

export function VisaTypeSelector() {
  const selectedVisaType = useCaseDetailStore(
    (state) => state.selectedVisaType,
  );
  const setActiveNav = useCaseDetailStore((state) => state.setActiveNav);

  const hasVisaType = selectedVisaType !== null;
  const visaConfig = selectedVisaType ? VISA_TYPES[selectedVisaType] : null;
  const Icon = selectedVisaType
    ? VISA_ICONS[selectedVisaType] || FileCheck
    : FileCheck;

  return (
    <div className="relative h-full">
      <AnimatePresence mode="wait">
        {!hasVisaType ? (
          // Empty State - Prompt to go to Application
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="h-full min-h-[240px] rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-4 flex flex-col items-center justify-center"
          >
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <FileCheck className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">
              Visa Type
            </h3>
            <p className="text-xs text-gray-500 mb-3 text-center max-w-[140px]">
              Set in Application
            </p>
            <button
              onClick={() => setActiveNav("application")}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg",
                "text-xs font-medium text-gray-600",
                "bg-white border border-gray-200",
                "hover:bg-gray-50 hover:border-gray-300",
                "transition-all duration-200",
              )}
            >
              <span>Go to Application</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </motion.div>
        ) : (
          // Selected State - Large Read-Only Color Block
          <motion.div
            key="selected"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative h-full min-h-[240px] overflow-hidden rounded-xl shadow-lg"
            style={{ backgroundColor: visaConfig?.color }}
          >
            {/* Background Pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.5' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />

            {/* Content */}
            <div className="relative p-4 h-full flex flex-col">
              {/* Header with Icon */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-white/60 uppercase tracking-wider mb-0.5">
                    Visa Category
                  </p>
                  <h3 className="text-lg font-bold text-white leading-tight">
                    {visaConfig?.label}
                  </h3>
                </div>
              </div>

              {/* Description */}
              <p className="mt-3 text-xs text-white/80 leading-relaxed flex-1">
                {visaConfig?.description}
              </p>

              {/* Footer */}
              <div className="mt-3 pt-2 border-t border-white/20 flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-medium text-white/90">
                  Selected
                </span>
                <button
                  onClick={() => setActiveNav("application")}
                  className={cn(
                    "inline-flex items-center gap-1 px-2 py-1 rounded",
                    "text-[10px] font-medium text-white/80",
                    "bg-white/10 hover:bg-white/20",
                    "transition-all duration-200",
                  )}
                >
                  <span>View</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>

            {/* Decorative Corner */}
            <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-white/5 rounded-full" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
