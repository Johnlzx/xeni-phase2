"use client";

import { motion } from "motion/react";
import { Sparkles, ListChecks } from "lucide-react";

interface LockedChecklistPreviewProps {
  progress: number; // 0-100
  isUnlocking?: boolean;
}

export function LockedChecklistPreview({
  progress,
  isUnlocking = false,
}: LockedChecklistPreviewProps) {

  return (
    <div className="absolute inset-0 flex flex-col pointer-events-none">
      {/* Very subtle gradient overlay */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isUnlocking ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1"
        style={{
          background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.05) 100%)",
        }}
      />

      {/* Centered guide message */}
      {!isUnlocking && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-center px-4">
            <ListChecks size={20} className="mx-auto mb-1.5 text-stone-300" />
            <p className="text-[11px] text-stone-400 leading-relaxed">
              Complete assessment to<br />generate tailored checklist
            </p>
          </div>
        </motion.div>
      )}

      {/* Unlocking animation */}
      {isUnlocking && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: [0.5, 1.5], opacity: [1, 0] }}
            transition={{ duration: 1 }}
          >
            <Sparkles size={32} className="text-[#0E4268]" />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
