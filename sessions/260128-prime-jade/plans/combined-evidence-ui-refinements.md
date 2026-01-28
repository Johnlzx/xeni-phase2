# Combined Evidence UI Refinements Plan

## Summary
Implement 5 UI refinements for the Combined Evidence (BundleCard) component to improve usability and visual consistency.

## Steps

1. **Change delete button text** - Change "Unlink all to delete" to just "Delete" while keeping the disabled state styling and tooltip
   - File: `FileHubContent.tsx` line 1517

2. **Replace color dot with Layers icon** - Remove the color indicator dot from the header and replace with a Layers icon; also remove color selection from CreateBundleModal
   - Remove `colorDotClasses` and `dotColor` variable in BundleCard
   - Replace the color dot div with `<Layers size={14} className="text-stone-400 shrink-0" />`
   - Remove color selection UI in CreateBundleModal
   - Update `onCreate` call to not pass color

3. **Add drag-to-reorder for linked documents** - Enable drag-and-drop reordering in the expanded linked documents list
   - Add `reorderLinkedDocumentsInBundle` action to store
   - Add store type definition
   - Create `DraggableLinkedDocument` component using react-dnd
   - Add GripVertical handle icon

4. **Increase thumbnail size** - Make stacked preview thumbnails larger
   - Change from `w-14` to `w-20`
   - Adjust overlap from `-space-x-4` to `-space-x-6`

5. **Implement differentiated click areas** - Individual thumbnail click opens specific document, background area click opens combined preview
   - Add `onPreviewCombined` prop to BundleCard
   - Add onClick to container div for combined preview
   - Add `e.stopPropagation()` on individual thumbnail clicks
   - Track selected bundle for combined preview state

## Files to Modify
- `/components/case-detail/file-hub/FileHubContent.tsx` - Main UI changes
- `/store/case-detail-store.ts` - Add reorder action
- `/types/case-detail.ts` - Add reorder action type (optional: remove color from DocumentBundle)
