"use client";

import { useState, useEffect, useRef, RefObject } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Pencil, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useCaseDetailStore,
  useDocumentGroups,
} from "@/store/case-detail-store";
import { XeniLogo } from "./XeniLogo";

// Navigation Tab component
const NavTab = ({
  label,
  isActive,
  onClick,
  badge,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
  badge?: number;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "relative py-3 text-sm font-medium transition-colors flex items-center gap-1.5",
      isActive ? "text-stone-900" : "text-stone-500 hover:text-stone-700",
    )}
  >
    {label}
    {badge !== undefined && badge > 0 && (
      <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-white text-[10px] font-bold tabular-nums">
        {badge}
      </span>
    )}
    {isActive && (
      <motion.div
        layoutId="nav-tab-indicator"
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900"
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    )}
  </button>
);

// Editable case name component
const EditableCaseName = ({
  name,
  onSave,
}: {
  name: string;
  onSave: (newName: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editValue.trim() && editValue !== name) {
      onSave(editValue.trim());
    } else {
      setEditValue(name);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditValue(name);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-1">
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="text-sm font-medium text-stone-800 bg-white border border-stone-300 rounded px-2 py-0.5 outline-none focus:border-[#0E4268] focus:ring-1 focus:ring-[#0E4268]/20 min-w-[120px]"
        />
        <button
          onClick={handleSave}
          className="p-1 text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded transition-colors"
          aria-label="Save name"
        >
          <Check size={14} />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className="group flex items-center gap-1.5 text-sm font-medium text-stone-800 hover:text-[#0E4268] px-1 py-0.5 -mx-1 rounded hover:bg-stone-50 transition-colors"
      title="Click to rename"
    >
      <span>{name}</span>
      <Pencil
        size={12}
        className="text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </button>
  );
};

// User avatar component
const UserAvatar = () => (
  <button
    className="size-8 rounded-full bg-[#0E4268] text-white text-sm font-medium flex items-center justify-center"
    aria-label="User menu"
  >
    JD
  </button>
);

interface CaseDetailHeaderProps {
  contentRef: RefObject<HTMLDivElement | null>;
  onHeightChange?: (height: number) => void;
}

export function CaseDetailHeader({ contentRef, onHeightChange }: CaseDetailHeaderProps) {
  const [isCompact, setIsCompact] = useState(false);
  const [caseName, setCaseName] = useState("New Case");

  const activeNav = useCaseDetailStore((state) => state.activeNav);
  const setActiveNav = useCaseDetailStore((state) => state.setActiveNav);
  const documentGroups = useDocumentGroups();

  // Calculate pending review count for Documents tab
  const pendingReviewCount = documentGroups.filter(
    (g) =>
      g.id !== "unclassified" && g.status === "pending" && g.files.length > 0,
  ).length;

  // Scroll detection
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const handleScroll = () => {
      setIsCompact(content.scrollTop > 0);
    };

    content.addEventListener("scroll", handleScroll, { passive: true });
    return () => content.removeEventListener("scroll", handleScroll);
  }, [contentRef]);

  // Notify parent of height changes
  useEffect(() => {
    onHeightChange?.(isCompact ? 48 : 104);
  }, [isCompact, onHeightChange]);

  const handleCaseNameSave = (newName: string) => {
    setCaseName(newName);
  };

  // Tabs component - shared between both modes
  const Tabs = () => (
    <nav className="flex items-center gap-6">
      <NavTab
        label="Overview"
        isActive={activeNav === "overview"}
        onClick={() => setActiveNav("overview")}
      />
      <NavTab
        label="Documents"
        isActive={activeNav === "documents"}
        onClick={() => setActiveNav("documents")}
        badge={pendingReviewCount}
      />
      <NavTab
        label="Application"
        isActive={activeNav === "application"}
        onClick={() => setActiveNav("application")}
      />
    </nav>
  );

  return (
    <motion.header
      className="sticky top-0 z-40 bg-white border-b border-stone-200 overflow-hidden"
      initial={false}
      animate={{ height: isCompact ? 48 : 104 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {/* Row 1: Case Info - fades out and slides up */}
      <motion.div
        className="h-14 px-6 flex items-center justify-between"
        initial={false}
        animate={{
          opacity: isCompact ? 0 : 1,
          y: isCompact ? -14 : 0,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div className="flex items-center gap-3">
          <Link
            href="/cases"
            className="hover:opacity-80 transition-opacity"
            aria-label="Go to cases list"
          >
            <XeniLogo size="md" />
          </Link>
          <span className="text-stone-300">/</span>
          <EditableCaseName name={caseName} onSave={handleCaseNameSave} />
        </div>
        <UserAvatar />
      </motion.div>

      {/* Row 2: Tabs - slides up to become Row 1 */}
      <motion.div
        className="px-6 flex items-center gap-6"
        initial={false}
        animate={{
          y: isCompact ? -56 : 0,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {/* Logo appears in compact mode */}
        <motion.div
          initial={false}
          animate={{
            opacity: isCompact ? 1 : 0,
            width: isCompact ? "auto" : 0,
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <Link
            href="/cases"
            className="hover:opacity-80 transition-opacity"
            aria-label="Go to cases list"
          >
            <XeniLogo size="sm" />
          </Link>
        </motion.div>

        <Tabs />
      </motion.div>
    </motion.header>
  );
}
