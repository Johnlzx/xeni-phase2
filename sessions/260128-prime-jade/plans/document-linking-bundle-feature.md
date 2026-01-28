# Document Linking & Bundle Feature Implementation Plan

## Summary

Implement two interconnected features for the Documents section:
1. **Page Linking (One-to-Many)**: Allow a single page to be linked/duplicated to multiple logical files
2. **Document Bundles**: Create container groups that link multiple logical files together without moving them

## Design Direction

**Aesthetic**: Clean, utilitarian with subtle depth. Using connecting visual metaphors (link chains, node connections) to represent relationships. Bundles have a distinctive "stacked folders" appearance to differentiate from regular CategoryCards.

---

## Feature 1: "Duplicate to" for Unclassified Pages

### Type Changes (`types/case-detail.ts`)

```typescript
// Add to DocumentFile interface
export interface DocumentFile {
  // ... existing fields
  linkedToGroups?: string[]; // Array of group IDs this page is linked to (one-to-many)
}
```

### UI Components

#### 1.1 Enhanced Context Menu for Unclassified Pages

Add "Duplicate to" submenu alongside existing "Move to":

```tsx
// In SidebarPageItem context menu
<ContextMenuSub>
  <ContextMenuSubTrigger>
    <Copy size={14} className="mr-2" />
    Duplicate to
  </ContextMenuSubTrigger>
  <ContextMenuSubContent className="w-48">
    {classifiedGroups.map((group) => (
      <ContextMenuItem
        key={group.id}
        onClick={() => duplicateFileToGroup(file.id, group.id)}
      >
        <FileText size={14} className="mr-2 text-stone-400" />
        {group.title}
      </ContextMenuItem>
    ))}
  </ContextMenuSubContent>
</ContextMenuSub>
```

#### 1.2 Link Indicator Badge

When a page is linked to multiple groups, show a visual indicator:

```tsx
// Link count badge on page thumbnail
{file.linkedToGroups && file.linkedToGroups.length > 0 && (
  <div className="absolute -bottom-0.5 -right-0.5 flex items-center gap-0.5 px-1 py-0.5 bg-violet-500 text-white text-[8px] font-bold rounded-full shadow-sm">
    <Link2 size={8} />
    {file.linkedToGroups.length}
  </div>
)}
```

#### 1.3 Store Actions

```typescript
// New action: duplicateFileToGroup
duplicateFileToGroup: (fileId: string, targetGroupId: string) => {
  // 1. Find the source file (in unclassified)
  // 2. Create a copy of the file in the target group
  // 3. Add targetGroupId to linkedToGroups array of BOTH copies
  // 4. The original stays in unclassified, copy appears in target
}
```

---

## Feature 2: Document Bundles (Container Groups)

### Type Definition

```typescript
// New type in case-detail.ts
export interface DocumentBundle {
  id: string;
  name: string; // User-defined: "Supporting Documents", "Financial Package", etc.
  description?: string;
  linkedGroupIds: string[]; // References to DocumentGroup IDs (LINK, not move)
  createdAt: string;
  color?: string; // Accent color: violet, indigo, teal, etc.
}
```

### Naming Alternatives (Better than "Other Documents")

Suggested terms for user selection:
- **Document Package** - Professional, implies bundled submission
- **Combined Set** - Clear, functional
- **Collection** - Simple, familiar
- **Document Bundle** - Technical but clear
- **Custom Group** - Emphasizes user-defined nature

### UI Components

#### 2.1 BundleCard Component

Distinct from CategoryCard with visual hierarchy showing linked groups:

```tsx
const BundleCard = ({ bundle, linkedGroups, onExpand }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={cn(
      "bg-gradient-to-br from-violet-50 to-white rounded-xl border-2 border-violet-200",
      "shadow-sm hover:shadow-md transition-all"
    )}>
      {/* Header with bundle icon */}
      <div className="px-3 py-2.5 border-b border-violet-100">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-lg bg-violet-100 flex items-center justify-center">
            <Layers size={14} className="text-violet-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xs font-semibold text-stone-800 truncate">
              {bundle.name}
            </h3>
            <p className="text-[10px] text-violet-600 font-medium">
              {linkedGroups.length} linked document{linkedGroups.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Stacked preview showing linked groups */}
      <div className="p-3 relative">
        <div className="flex -space-x-3">
          {linkedGroups.slice(0, 4).map((group, idx) => (
            <div
              key={group.id}
              className="w-16 aspect-[1/1.414] rounded border border-stone-200 bg-white shadow-sm"
              style={{ zIndex: linkedGroups.length - idx }}
            >
              {/* Mini document preview */}
            </div>
          ))}
          {linkedGroups.length > 4 && (
            <div className="w-16 aspect-[1/1.414] rounded border border-violet-200 bg-violet-50 flex items-center justify-center">
              <span className="text-xs font-bold text-violet-600">
                +{linkedGroups.length - 4}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Expand to see linked groups */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 py-2 border-t border-violet-100 flex items-center justify-center gap-1 text-xs font-medium text-violet-600 hover:bg-violet-50"
      >
        {isExpanded ? 'Collapse' : 'View linked documents'}
        <ChevronDown size={12} className={cn(isExpanded && 'rotate-180')} />
      </button>

      {/* Expanded view showing all linked groups */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-violet-100 overflow-hidden"
          >
            <div className="p-2 space-y-1">
              {linkedGroups.map((group) => (
                <LinkedGroupRow key={group.id} group={group} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
```

#### 2.2 Create Bundle Flow

Add "Create Bundle" option in AddCategoryCard dropdown:

```tsx
<DropdownMenuSeparator />
<DropdownMenuItem onClick={() => setShowCreateBundleModal(true)}>
  <Layers size={14} className="mr-2 text-violet-500" />
  Create Bundle
</DropdownMenuItem>
```

#### 2.3 CreateBundleModal

```tsx
const CreateBundleModal = ({ groups, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <motion.div className="bg-white rounded-xl shadow-xl w-96 overflow-hidden">
        <div className="px-4 py-3 border-b border-stone-100">
          <h3 className="text-sm font-semibold text-stone-800">Create Document Bundle</h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Group related documents together for organization
          </p>
        </div>

        <div className="p-4 space-y-4">
          {/* Name input */}
          <div>
            <label className="text-xs font-medium text-stone-600 mb-1.5 block">
              Bundle Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Financial Documents, Supporting Evidence..."
              className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none"
            />
          </div>

          {/* Group selection with checkboxes */}
          <div>
            <label className="text-xs font-medium text-stone-600 mb-1.5 block">
              Link Documents (select 2 or more)
            </label>
            <div className="border border-stone-200 rounded-lg max-h-48 overflow-y-auto">
              {groups.map((group) => (
                <label
                  key={group.id}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-stone-50 cursor-pointer border-b border-stone-100 last:border-0"
                >
                  <input
                    type="checkbox"
                    checked={selectedGroups.includes(group.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedGroups([...selectedGroups, group.id]);
                      } else {
                        setSelectedGroups(selectedGroups.filter(id => id !== group.id));
                      }
                    }}
                    className="size-4 rounded border-stone-300 text-violet-600 focus:ring-violet-500"
                  />
                  <FileText size={14} className="text-stone-400" />
                  <span className="text-sm text-stone-700">{group.title}</span>
                  <span className="text-xs text-stone-400 ml-auto">
                    {group.files.length} pages
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 py-3 border-t border-stone-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-100 rounded-lg">
            Cancel
          </button>
          <button
            onClick={() => onCreate({ name, linkedGroupIds: selectedGroups })}
            disabled={!name.trim() || selectedGroups.length < 2}
            className="px-4 py-1.5 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Bundle
          </button>
        </div>
      </motion.div>
    </div>
  );
};
```

#### 2.4 Link Group to Existing Bundle

Add context menu action on CategoryCard:

```tsx
// In CategoryCard context menu
<ContextMenuSub>
  <ContextMenuSubTrigger>
    <Link2 size={14} className="mr-2" />
    Link to Bundle
  </ContextMenuSubTrigger>
  <ContextMenuSubContent className="w-48">
    {bundles.map((bundle) => (
      <ContextMenuItem
        key={bundle.id}
        onClick={() => linkGroupToBundle(group.id, bundle.id)}
      >
        <Layers size={14} className="mr-2 text-violet-500" />
        {bundle.name}
      </ContextMenuItem>
    ))}
    <ContextMenuSeparator />
    <ContextMenuItem onClick={() => setShowCreateBundleWithGroup(group.id)}>
      <Plus size={14} className="mr-2" />
      New Bundle...
    </ContextMenuItem>
  </ContextMenuSubContent>
</ContextMenuSub>
```

---

## Store Changes (`store/case-detail-store.ts`)

```typescript
// Add to state
documentBundles: DocumentBundle[];

// New actions
duplicateFileToGroup: (fileId: string, targetGroupId: string) => void;
createDocumentBundle: (name: string, linkedGroupIds: string[]) => void;
linkGroupToBundle: (groupId: string, bundleId: string) => void;
unlinkGroupFromBundle: (groupId: string, bundleId: string) => void;
deleteDocumentBundle: (bundleId: string) => void;
renameDocumentBundle: (bundleId: string, newName: string) => void;
```

---

## Visual Hierarchy Summary

```
┌─────────────────────────────────────────────────────────┐
│  Documents Page                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │ Passport │  │  Bank    │  │Employment│  ...          │
│  │ [Card]   │  │Statement │  │ Letter   │               │
│  │          │  │ [Card]   │  │ [Card]   │               │
│  └──────────┘  └──────────┘  └──────────┘               │
│                                                          │
│  ┌────────────────────────────────────┐                 │
│  │ 📦 Financial Package [Bundle]      │  ← Distinct     │
│  │ ┌────┐┌────┐┌────┐                 │    styling      │
│  │ │Bank││Tax ││Pay │ 3 linked docs   │                 │
│  │ └────┘└────┘└────┘                 │                 │
│  │ [View linked documents ▼]          │                 │
│  └────────────────────────────────────┘                 │
│                                                          │
│  ┌──────────┐                                           │
│  │+ Add     │                                           │
│  │ Category │                                           │
│  └──────────┘                                           │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Files to Modify

1. **`types/case-detail.ts`**
   - Add `linkedToGroups` to `DocumentFile`
   - Add `DocumentBundle` interface

2. **`store/case-detail-store.ts`**
   - Add `documentBundles` state
   - Add new actions for duplication and bundle management

3. **`components/case-detail/file-hub/FileHubContent.tsx`**
   - Add "Duplicate to" context menu in `SidebarPageItem`
   - Add link count badge to page thumbnails
   - Add `BundleCard` component
   - Add `CreateBundleModal` component
   - Update `AddCategoryCard` with "Create Bundle" option
   - Add bundle management to grid layout

---

## Implementation Steps

1. **Phase 1: Type & Store Foundation**
   - Update `DocumentFile` interface
   - Add `DocumentBundle` interface
   - Add state and actions to store

2. **Phase 2: Page Linking UI**
   - Add "Duplicate to" context menu
   - Add link indicator badges
   - Handle duplication logic

3. **Phase 3: Bundle Components**
   - Create `BundleCard` component
   - Create `CreateBundleModal` component
   - Integrate bundles into grid layout

4. **Phase 4: Bundle Management**
   - Add "Link to Bundle" context menu on CategoryCard
   - Implement expand/collapse for bundle contents
   - Add bundle rename/delete actions
