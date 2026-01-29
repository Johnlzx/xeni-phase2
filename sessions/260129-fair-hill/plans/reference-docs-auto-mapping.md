# Reference Documents Auto-Mapping & Slot Display

## Summary
最小化改动，不改变组件结构和 props。仅两处修改：

1. **Store 数据层** — 扩展已有的 passport 自动匹配模式到其他 evidence
2. **OverviewTab 渲染层** — 把 `filter(e => e.isUploaded)` 改为渲染全部 evidence items

## 改动详情

### 改动 1: Store — `generateEnhancedChecklist()` 自动匹配
**文件:** `store/case-detail-store.ts` ~line 3907

**现状:** 只有 passport 做了自动匹配（line 3911-3914），其他 evidence 全部 `isUploaded: false`

**改法:** 在 `SECTION_REQUIRED_EVIDENCE` 定义之前，加一个 evidence-to-group 映射表，然后用一个 helper 函数自动填充 `isUploaded`/`linkedFileId`/`linkedFileName`：

```ts
// Evidence ID → Document Group ID mapping
const EVIDENCE_GROUP_MAP: Record<string, string> = {
  ev_passport: "passport",
  ev_bank_statements: "bank_statement",
  ev_employment_contract: "employment_letter",
  ev_travel_history: "travel_history",
  ev_english_cert: "education",
  ev_degree_cert: "education",
};

const autoLinkEvidence = (ev: RequiredEvidence): RequiredEvidence => {
  const groupId = EVIDENCE_GROUP_MAP[ev.id];
  if (!groupId) return ev;
  const group = state.documentGroups.find(g => g.id === groupId);
  if (!group || group.fileIds.length === 0) return ev;
  return {
    ...ev,
    isUploaded: true,
    linkedFileId: group.id,
    linkedFileName: group.title,
  };
};
```

然后在 `SECTION_REQUIRED_EVIDENCE` 的每个 section 的 evidence 数组中，对每个 item 调用 `autoLinkEvidence()`。这样 passport 的特殊处理代码也可以统一进来。

### 改动 2: OverviewTab — 显示全部 evidence（含空 slot）
**文件:** `components/case-detail/application/checklist/detail-panel/OverviewTab.tsx`

**影响位置（两处，逻辑相同）：**
- `SummaryFieldsCard` 组件 (~line 308-325) — employment section 用
- `SummarySection` 组件 (~line 554-576) — 非 employment section 用

**现状:**
```tsx
{referenceEvidence.filter((e) => e.isUploaded).length > 0 ? (
  referenceEvidence.filter((e) => e.isUploaded).map(...)
) : (
  <span>No documents uploaded</span>
)}
```

**改为:** 渲染全部 `referenceEvidence`，根据 `isUploaded` 切换样式：

```tsx
{referenceEvidence.length > 0 ? (
  referenceEvidence.map((ev) => (
    <button
      key={ev.id}
      onClick={() => ev.isUploaded ? onReferenceDocClick(ev) : onUploadClick()}
      className={cn(
        "group shrink-0 inline-flex items-center gap-2 px-2 py-1.5 rounded-lg border transition-all",
        ev.isUploaded
          ? "border-stone-200 bg-white hover:border-blue-300"
          : "border-dashed border-stone-300 bg-stone-50 hover:border-stone-400"
      )}
    >
      {ev.isUploaded ? (
        <FileText className="size-4 text-blue-500" />
      ) : (
        <Upload className="size-3.5 text-stone-400" />
      )}
      <span className={cn(
        "text-xs font-medium truncate max-w-[120px]",
        ev.isUploaded
          ? "text-stone-700 group-hover:text-blue-700"
          : "text-stone-400"
      )}>
        {ev.isUploaded ? (ev.linkedFileName || ev.name) : ev.name}
      </span>
    </button>
  ))
) : (
  <span>No documents required</span>
)}
```

## 改动范围总结

| 文件 | 改动类型 | 行数估计 |
|------|---------|---------|
| `store/case-detail-store.ts` | 加映射表 + helper，替换 passport 特殊逻辑 | ~20 行 |
| `OverviewTab.tsx` (SummaryFieldsCard) | 改渲染条件，加空 slot 样式 | ~15 行 |
| `OverviewTab.tsx` (SummarySection) | 同上 | ~15 行 |

**不改的：** 组件结构、props 接口、tab 布局、数据流、类型定义
