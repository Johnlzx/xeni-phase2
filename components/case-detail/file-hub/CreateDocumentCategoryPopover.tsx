"use client";

import { useState } from "react";
import { Layers, Plus } from "lucide-react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DOCUMENT_CATEGORY_SUGGESTIONS,
  DOCUMENT_CATEGORY_GROUPS,
} from "@/data/document-categories";

interface CreateDocumentCategoryPopoverProps {
  onSelect: (name: string) => void;
  onMergeDocuments: () => void;
  children: React.ReactNode;
}

export function CreateDocumentCategoryPopover({
  onSelect,
  onMergeDocuments,
  children,
}: CreateDocumentCategoryPopoverProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleSelect = (name: string) => {
    onSelect(name);
    setSearch("");
    setOpen(false);
  };

  const handleMerge = () => {
    onMergeDocuments();
    setSearch("");
    setOpen(false);
  };

  // Check if search text matches any existing suggestion (case-insensitive)
  const trimmedSearch = search.trim();
  const isExactMatch = trimmedSearch.length > 0 && DOCUMENT_CATEGORY_SUGGESTIONS.some(
    (s) => s.name.toLowerCase() === trimmedSearch.toLowerCase(),
  );

  // Group suggestions by category
  const groupedSuggestions = DOCUMENT_CATEGORY_GROUPS.map((group) => ({
    group,
    items: DOCUMENT_CATEGORY_SUGGESTIONS.filter((s) => s.group === group),
  }));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="w-72 p-0 bg-white rounded-xl border border-stone-200 shadow-xl"
        side="bottom"
        align="start"
        sideOffset={4}
      >
        <Command shouldFilter={true}>
          <CommandInput
            placeholder="Type a name or pick below..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList className="max-h-[320px]">
            <CommandEmpty className="py-3 text-center text-xs text-stone-500">
              No matching categories
            </CommandEmpty>

            {/* Custom name create action — always at top when typing */}
            {trimmedSearch.length > 0 && !isExactMatch && (
              <>
                <CommandGroup>
                  <CommandItem
                    value={`__create__${trimmedSearch}`}
                    onSelect={() => handleSelect(trimmedSearch)}
                    className="text-sm font-medium text-[#0E4268]"
                  >
                    <Plus size={14} className="mr-2 text-[#0E4268]" />
                    Create &ldquo;{trimmedSearch}&rdquo;
                  </CommandItem>
                </CommandGroup>
                <CommandSeparator />
              </>
            )}

            {/* Grouped suggestions */}
            {groupedSuggestions.map(({ group, items }) => (
              <CommandGroup
                key={group}
                heading={group}
                className="[&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-stone-400 [&_[cmdk-group-heading]]:font-medium"
              >
                {items.map((item) => (
                  <CommandItem
                    key={item.name}
                    value={item.name}
                    onSelect={() => handleSelect(item.name)}
                    className="text-sm"
                  >
                    {item.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}

            {/* Merge Documents link */}
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                value="__merge_documents__"
                onSelect={handleMerge}
                className="text-sm"
              >
                <Layers size={14} className="mr-2 text-stone-400" />
                Merge Documents
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
