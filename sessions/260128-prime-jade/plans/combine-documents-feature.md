# Plan: Combine Logical Documents into "Other Documents" Container

## Summary

Refactor the existing `MergeDocumentsModal` from **group-level selection** to **file-level selection**. Users will pick individual files (logical documents) from any container, define their sequence via drag-to-reorder, and combine them into a new "Other Documents" container. The store action will be updated to work with individual file IDs and auto-clean empty source containers.

## Design Direction

Follow the existing modal aesthetic exactly — stone color palette, `motion/react` animations, `rounded-xl` cards, `text-xs`/`text-sm` typography, lucide-react icons. The key UI enhancement is replacing the flat group-checkbox list in Step 1 with a **grouped file picker**: collapsible container sections with individual file checkboxes underneath.

## Steps

### 1. Update type signature in `types/case-detail.ts`

Change `mergeDocumentsIntoGroup` from:
```typescript
mergeDocumentsIntoGroup: (name: string, sourceGroupIds: string[], orderedFileIds: string[]) => void;
```
To:
```typescript
mergeDocumentsIntoGroup: (name: string, orderedFileIds: string[]) => void;
```

The action no longer needs explicit source group IDs — it derives affected groups from each file's `containerIds`.

### 2. Update store action in `store/case-detail-store.ts`

Refactor `mergeDocumentsIntoGroup` (lines 1821-1878):
- Accept only `(name, orderedFileIds)`
- For each file: remove it from all current containers (update `containerIds`), add the new group ID
- For each affected source group: remove the file from its `fileIds`
- Auto-delete source groups that become empty (no remaining `fileIds`)
- Create the new "Other Documents" group with the ordered file IDs

### 3. Refactor `MergeDocumentsModal` UI (lines 1289-1535 in FileHubContent.tsx)

**Step 1 — File Selection (redesigned):**
- Name input stays the same
- Replace group checkboxes with a **collapsible file list grouped by container**:
  - Each container renders as a section header row with a `ChevronDown` toggle and container title
  - Under each container: individual file rows with checkboxes, file icon, name, and page count indicator
  - Container header shows "X/Y selected" count badge
  - "Select all in container" toggle on the header row
- Minimum: 2+ files selected (not groups)
- Footer shows: "X files selected"

**Step 2 — Reorder (minimal changes):**
- Same drag-to-reorder using existing `DraggableMergeFileItem`
- `groupTitle` now shows original container name per file

**Signature change:**
```typescript
onMerge: (name: string, orderedFileIds: string[]) => void;
// Remove sourceGroupIds parameter
```

### 4. Update `FileHubContent` call site (line 2070-2072)

Change the `onMerge` callback to match the new 2-parameter signature:
```typescript
onMerge={(name, orderedFileIds) => {
  mergeDocumentsIntoGroup(name, orderedFileIds);
}}
```

## Files Modified

| File | Change |
|------|--------|
| `types/case-detail.ts` | Update `mergeDocumentsIntoGroup` signature (remove `sourceGroupIds`) |
| `store/case-detail-store.ts` | Refactor action: derive source groups from files, auto-delete empty groups |
| `components/case-detail/file-hub/FileHubContent.tsx` | Refactor modal Step 1 to file-level selection with grouped layout; update call site |

## Design Details

- Collapsible sections use `motion.div` with `AnimatePresence` for smooth expand/collapse
- Container headers: `bg-stone-50 rounded-lg px-3 py-2` with bold title, file count, select-all checkbox
- File rows: `px-3 py-1.5 ml-2` indented under header, with `FileText` icon, name, checkbox
- Selected files get subtle `bg-stone-50` highlight
- Step indicator, footer buttons, and overall modal chrome remain unchanged
