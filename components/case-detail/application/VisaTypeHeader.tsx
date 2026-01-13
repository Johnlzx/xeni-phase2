"use client";

import React from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { VisaType } from "@/types";
import { getVisaConfig } from "./ApplicationLandingPage";
import { DocumentsReadyCard } from "./DocumentsReadyCard";

interface VisaTypeHeaderProps {
  visaType: VisaType;
  showCancel?: boolean;
  onCancel?: () => void;
  className?: string;
}

export function VisaTypeHeader({
  visaType,
  showCancel = true,
  onCancel,
  className,
}: VisaTypeHeaderProps) {
  const visaConfig = getVisaConfig(visaType);

  if (!visaConfig) return null;

  const Icon = visaConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "flex items-center justify-between px-6 py-4 bg-white border-b border-stone-200",
        className
      )}
    >
      {/* Left: Visa Type Info */}
      <div className="flex items-center gap-3">
        <motion.div
          layoutId={`visa-icon-${visaType}`}
          className={cn(
            "size-10 rounded-xl flex items-center justify-center",
            visaConfig.bgColor
          )}
        >
          <Icon size={20} className={visaConfig.color} />
        </motion.div>
        <div>
          <motion.h2
            layoutId={`visa-title-${visaType}`}
            className="text-base font-semibold text-stone-800 text-balance"
          >
            {visaConfig.name}
          </motion.h2>
          <p className="text-xs text-stone-500">
            Processing time: {visaConfig.processingTime}
          </p>
        </div>
      </div>

      {/* Right: Documents & Cancel */}
      <div className="flex items-center gap-3">
        <DocumentsReadyCard variant="compact" />

        {showCancel && onCancel && (
          <button
            onClick={onCancel}
            className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
            aria-label="Cancel and return to visa selection"
          >
            <X size={20} />
          </button>
        )}
      </div>
    </motion.div>
  );
}
