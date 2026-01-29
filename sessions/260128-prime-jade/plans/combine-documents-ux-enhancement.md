# Plan: Combine Documents UX Enhancement

## Summary

Enhance the "Combine Documents" feature with two new interaction flows:
1. **Empty container action** — Add an "Add from existing" button on empty "Other Documents" containers
2. **Multi-select cards** — Allow selecting multiple document cards in the grid, then combine them

## Current State

- "Combine Documents" modal exists (file-level selection with drag-to-reorder)
- "Add Category" dropdown includes "Other Documents" option
- Empty containers show "No files / Drop files here"
- No multi-select capability for document cards

## Changes Required

### 1. Rename "Add Category" to "New Category"

Update the button text and dropdown label in `AddCategoryCard`:
- Button text: "New Category" (shorter, clearer)
- Dropdown label: "Category Type"

### 2. Add "Add from existing" Action to Empty Containers

**File:** `FileHubContent.tsx` — `CategoryCard` component

When `totalPages === 0` (empty container), enhance the empty state UI:
- Add clickable "Add from existing documents" button below "Drop files here"
- Clicking opens a **file selection modal** (reuse the Combine modal Step 1 UI)
- Selected files are **moved** to this container (not creating a new container)

**New store action:** `addFilesToGroup(groupId: string, fileIds: string[])`
- Moves files from their current containers to the target container
- Updates each file's `containerIds`
- Removes files from source groups' `fileIds`
- Auto-deletes empty source groups

### 3. Multi-Select Document Cards in Grid

**File:** `FileHubContent.tsx`

Add selection state to the `FileHubContent` component:
- `const [selectedGroupIds, setSelectedGroupIds] = useState<Set<string>>(new Set())`
- `const [isSelectMode, setIsSelectMode] = useState(false)`

**CategoryCard updates:**
- Add checkbox overlay in top-left corner (visible when `isSelectMode`)
- Click on checkbox toggles selection
- Click elsewhere opens review modal (normal behavior)
- Long-press or Ctrl+click enters select mode

**Floating Action Bar:**
When `selectedGroupIds.size > 0`, show a fixed bottom bar with:
- Selection count: "2 documents selected"
- "Combine" button — opens Combine modal with pre-selected groups' files
- "Cancel" button — exits select mode

### 4. New "File Selection Modal" (Reusable Component)

Extract the file selection UI from `MergeDocumentsModal` into a reusable component:

```typescript
const FileSelectionModal = ({
  groups,
  title,
  subtitle,
  onClose,
  onConfirm, // (orderedFileIds: string[]) => void
  showReorderStep?: boolean, // default true
}: Props) => { ... }
```

This can be used by:
- Combine Documents flow
- Empty container "Add from existing" flow

## UI Design Details

### Empty Container Enhancement
```
┌─────────────────────────────────┐
│  Other Documents                │
│  ─────────────────────────────  │
│                                 │
│        ┌─────────────┐          │
│        │   📥 inbox  │          │
│        │   No files  │          │
│        │ Drop files  │          │
│        └─────────────┘          │
│                                 │
│  ┌─────────────────────────┐    │
│  │ ＋ Add from existing... │    │  ← New clickable link
│  └─────────────────────────┘    │
│                                 │
│  [Add]          [Download]      │
└─────────────────────────────────┘
```

### Multi-Select Mode
```
Grid with checkboxes:
┌──────────┐ ┌──────────┐ ┌──────────┐
│ ☑        │ │ ☑        │ │ ☐        │
│ Passport │ │ Statement│ │ Letter   │
│  3 pages │ │  5 pages │ │  2 pages │
└──────────┘ └──────────┘ └──────────┘

┌─────────────────────────────────────────────┐
│ 2 documents selected    [Cancel] [Combine]  │  ← Floating bar
└─────────────────────────────────────────────┘
```

## Files Modified

| File | Change |
|------|--------|
| `FileHubContent.tsx` | Multi-select state, CategoryCard checkbox, floating action bar, empty container button |
| `store/case-detail-store.ts` | Add `addFilesToGroup(groupId, fileIds)` action |
| `types/case-detail.ts` | Add `addFilesToGroup` type |

## Implementation Order

1. Add `addFilesToGroup` store action
2. Add empty container "Add from existing" button + modal
3. Add multi-select mode with floating action bar
4. Update "Add Category" text to "New Category"
