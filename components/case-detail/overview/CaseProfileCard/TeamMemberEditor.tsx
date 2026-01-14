"use client";

import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CaseTeamMember } from "@/types/case-detail";
import { SYSTEM_USERS } from "@/store/case-detail-store";

interface TeamMemberEditorProps {
  label?: string;
  member?: CaseTeamMember;
  isCurrentUser?: boolean;
  emptyText?: string;
  onSave: (member: CaseTeamMember) => void;
  onClear?: () => void;
  compact?: boolean;
}

export function TeamMemberEditor({
  label,
  member,
  isCurrentUser = false,
  emptyText = "Not assigned",
  onSave,
  onClear,
  compact = false,
}: TeamMemberEditorProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (user: (typeof SYSTEM_USERS)[0]) => {
    onSave({
      id: user.id,
      name: user.name,
      email: user.email,
    });
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClear) {
      onClear();
    }
  };

  if (compact) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "flex items-center gap-1 text-left group",
              "hover:bg-stone-50 -mx-0.5 px-0.5 rounded transition-colors",
            )}
            aria-label={label ? `Select ${label}` : "Select team member"}
          >
            <span
              className={cn(
                "text-xs truncate",
                member ? "text-stone-700" : "text-stone-400",
              )}
            >
              {member?.name || emptyText}
            </span>
            {isCurrentUser && member && (
              <span className="text-[9px] px-1 py-0.5 rounded bg-[#0E4268]/10 text-[#0E4268] font-medium shrink-0">
                You
              </span>
            )}
            <ChevronDown className="size-3 text-stone-400 shrink-0" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-48 p-1 bg-white rounded-lg border border-stone-200 shadow-lg"
        >
          <div className="max-h-40 overflow-y-auto">
            {SYSTEM_USERS.map((user) => (
              <button
                key={user.id}
                onClick={() => handleSelect(user)}
                className={cn(
                  "w-full text-left px-2 py-1 rounded-md",
                  "hover:bg-stone-100 transition-colors",
                  member?.id === user.id && "bg-stone-100",
                )}
              >
                <p className="text-xs text-stone-800">{user.name}</p>
                <p className="text-[10px] text-stone-400">{user.role}</p>
              </button>
            ))}
          </div>
          {onClear && member && (
            <>
              <div className="border-t border-stone-100 my-1" />
              <button
                onClick={handleClear}
                className="w-full text-left px-2 py-1 rounded-md text-xs text-rose-600 hover:bg-rose-50 transition-colors"
              >
                Remove
              </button>
            </>
          )}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex-1 min-w-0">
        {label && (
          <p className="text-[10px] text-stone-500 uppercase tracking-wider mb-0.5">
            {label}
          </p>
        )}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "flex items-center gap-1.5 w-full text-left group",
                "hover:bg-stone-50 -mx-1 px-1 py-0.5 rounded transition-colors",
              )}
              aria-label={label ? `Select ${label}` : "Select team member"}
            >
              <span
                className={cn(
                  "text-sm truncate flex-1",
                  member ? "text-stone-800" : "text-stone-400",
                )}
              >
                {member?.name || emptyText}
              </span>
              {isCurrentUser && member && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0E4268]/10 text-[#0E4268] font-medium shrink-0">
                  You
                </span>
              )}
              {onClear && member && (
                <button
                  onClick={handleClear}
                  className="size-5 rounded flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-stone-200 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  aria-label={`Clear ${label}`}
                >
                  <X className="size-3" />
                </button>
              )}
              <ChevronDown className="size-3.5 text-stone-400 shrink-0" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            className="w-56 p-1 bg-white rounded-lg border border-stone-200 shadow-lg"
          >
            <div className="max-h-48 overflow-y-auto">
              {SYSTEM_USERS.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleSelect(user)}
                  className={cn(
                    "w-full text-left px-2 py-1.5 rounded-md",
                    "hover:bg-stone-100 transition-colors",
                    member?.id === user.id && "bg-stone-100",
                  )}
                >
                  <p className="text-sm text-stone-800">{user.name}</p>
                  <p className="text-[10px] text-stone-500">{user.role}</p>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
