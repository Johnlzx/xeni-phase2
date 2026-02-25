# Document Management — Toast Feedback Reference

All user-facing toast notifications in the Documents module (File Hub + Overview).
Library: [Sonner](https://sonner.emilkowal.dev/) — all messages use `toast.success`.

---

## Upload

| Action | Title | Description | Source |
|--------|-------|-------------|--------|
| Demo upload (auto-classify) | Documents uploaded | `{n} pages uploaded and auto-classified.` | `FileHubContent.tsx:171` |
| Folder upload (parsed paths) | Folder uploaded | `{n} files imported and classified.` | `FileHubContent.tsx:211` |
| Drag native files onto group card | Files uploaded | `{n} page(s) added to "{group}".` | `FileHubContent.tsx:1045` |
| Click upload button on card header | Files uploaded | `{n} page(s) added to "{group}".` | `FileHubContent.tsx:1055` |

---

## Move

| Action | Title | Description | Source |
|--------|-------|-------------|--------|
| Drag page to Unclassified drop zone | Page moved to Unclassified | _(none)_ | `FileHubContent.tsx:255` |
| Right-click "Move to" in Unclassified | Page moved | `Moved to "{group}".` | `FileHubContent.tsx:632` |
| Move modal → select target group | Page moved | `Moved to "{group}".` | `FileHubContent.tsx:815` |
| Move modal → select target (duplicate path) | Page moved | `Moved to "{group}".` | `FileHubContent.tsx:912` |
| Drag page onto another group card | Page moved | `Moved to "{group}".` | `FileHubContent.tsx:1167` |

---

## Add Pages

| Action | Title | Description | Source |
|--------|-------|-------------|--------|
| Pick file from Unclassified dropdown | Page added | `Added to "{group}".` | `FileHubContent.tsx:1502` |
| "From Documents" modal → Confirm | Pages added | `{n} page(s) added to "{group}".` | `FileHubContent.tsx:1601` |

---

## Combine / Merge

| Action | Title | Description | Source |
|--------|-------|-------------|--------|
| Drag group onto another → Confirm | Documents combined | `Created "{name}" with {n} page(s).` | `FileHubContent.tsx:1643` |
| Toolbar "Combine" button → Confirm | Documents combined | `Created "{name}" with {n} page(s).` | `FileHubContent.tsx:3432` |
| Multi-select → "Combine" → Confirm | Documents combined | `Created "{name}" with {n} page(s).` | `FileHubContent.tsx:3456` |

---

## Replace

| Action | Title | Description | Source |
|--------|-------|-------------|--------|
| Card dropdown → Replace | Document replaced | `"{group}" replaced with {n} new page(s).` | `FileHubContent.tsx:1546` |

---

## Rename

| Action | Title | Description | Source |
|--------|-------|-------------|--------|
| Inline edit → save | Document renamed | `Renamed to "{newTitle}".` | `FileHubContent.tsx:1095` |
| Click reset title button | Title restored | `Reset to "{originalTitle}".` | `FileHubContent.tsx:1112` |

---

## Review

| Action | Title | Description | Source |
|--------|-------|-------------|--------|
| File Hub — card confirm button | Review confirmed | `"{group}" marked as reviewed.` | `FileHubContent.tsx:1084` |
| Overview — hover confirm button | Review confirmed | `"{group}" marked as reviewed.` | `FileUploadZone.tsx:264` |

---

## Delete

| Action | Title | Description | Source |
|--------|-------|-------------|--------|
| File Hub — confirm dialog | Document deleted | `"{group}" has been removed.` | `FileHubContent.tsx:1617` |
| Overview — hover delete → confirm dialog | Document deleted | `"{group}" has been removed.` | `FileUploadZone.tsx:297` |

---

## Summary

| Category | Count | Toast Title Pattern |
|----------|-------|---------------------|
| Upload | 4 | Documents/Folder/Files uploaded |
| Move | 5 | Page moved / Page moved to Unclassified |
| Add | 2 | Page(s) added |
| Combine | 3 | Documents combined |
| Replace | 1 | Document replaced |
| Rename | 2 | Document renamed / Title restored |
| Review | 2 | Review confirmed |
| Delete | 2 | Document deleted |
| **Total** | **21** | |

All notifications are **success** type. No error / warning / info toasts exist in the Documents module.
