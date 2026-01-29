# Merge Documents Feature Plan

## Summary
Remove the Combined Evidence (bundle/link) feature and replace it with a Merge Documents feature that actually merges files from multiple document groups into a single new logical document.

## Key Difference
| Aspect | Combined Evidence (Remove) | Merge Documents (Add) |
|--------|---------------------------|----------------------|
| Relationship | Links (reference) | Merge (copy files) |
| Original docs | Remain separate | Files moved to new container |
| Result | Bundle containing references | New DocumentGroup with merged files |
| Level | Separate UI concept | Same level as other document groups |

## Steps

### Phase 1: Remove Combined Evidence Feature

1. **Remove from Types** (`types/case-detail.ts`)
   - Remove `DocumentBundle` interface (lines 124-133)
   - Remove `documentBundles` from `CaseDetailState` (line 378)
   - Remove bundle-related action types (lines 493-498)

2. **Remove from Store** (`store/case-detail-store.ts`)
   - Remove `documentBundles: []` from initial state
   - Remove actions: `createDocumentBundle`, `deleteDocumentBundle`, `renameDocumentBundle`, `linkGroupToBundle`, `unlinkGroupFromBundle`, `reorderLinkedDocumentsInBundle`
   - Remove `useDocumentBundles` selector

3. **Remove from UI** (`components/case-detail/file-hub/FileHubContent.tsx`)
   - Remove `BundleCard` component
   - Remove `DraggableLinkedDocumentItem` component
   - Remove `CreateBundleModal` component (will be repurposed)
   - Remove `LINKED_DOC_ITEM_TYPE` constant
   - Remove bundle rendering in main grid
   - Remove "Combined Evidence" from AddCategoryCard dropdown

### Phase 2: Add Merge Documents Feature

1. **Add Store Action** (`store/case-detail-store.ts`)
   ```typescript
   mergeDocumentsIntoGroup: (
     targetGroupId: string,  // The new "Other Documents" group
     sourceGroupIds: string[], // Groups to merge from
     orderedFileIds: string[]  // Files in specified order
   ) => void
   ```
   - Create the target group if it doesn't exist
   - Move files from source groups to target group in specified order
   - Optionally remove empty source groups

2. **Create MergeDocumentsModal** (`components/case-detail/file-hub/FileHubContent.tsx`)
   - Repurpose CreateBundleModal UI
   - Two-step flow:
     - Step 1: Enter name, select documents to merge
     - Step 2: Drag-to-reorder files before merge
   - Show preview of files from selected groups
   - Support drag-to-reorder for final file order
   - "Merge" button creates new group with all files

3. **Update AddCategoryCard**
   - Change "Combined Evidence" to "Merge Documents"
   - Opens MergeDocumentsModal instead

4. **Update Type Definition** (if needed)
   - Add `isMerged?: boolean` flag to DocumentGroup to indicate merged documents
   - Or use `tag: "other-documents"` to identify merged containers

## UI Flow

1. User clicks "+" card → Dropdown shows "Other Documents" or "Merge Documents"
2. "Merge Documents" opens modal:
   - **Step 1**: Enter name (e.g., "Financial Package"), select 2+ document groups
   - **Step 2**: Preview all files from selected groups, drag to reorder
3. User clicks "Merge" → New DocumentGroup created with all files
4. Original groups become empty (can be auto-deleted or kept)
5. New merged document appears in the grid like any other category

## Files to Modify
- `/types/case-detail.ts` - Remove bundle types, update action types
- `/store/case-detail-store.ts` - Remove bundle actions, add merge action
- `/components/case-detail/file-hub/FileHubContent.tsx` - Replace bundle UI with merge UI
