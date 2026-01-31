# From Documents 多选 + 排序弹窗

## Summary

将 Add 按钮中的 "From Documents" 子菜单从单击直接添加改为支持多选，选中后弹出排序配置弹窗（复用 CombineFromSelectionModal 的排序逻辑），确认后再批量添加到当前文档。

## 当前行为
- 点击 "From Documents" 子菜单中的某个文档 → 直接调用 `addFilesToGroup` 一次性添加
- 无多选、无排序

## 目标行为
- 点击 "From Documents" → 打开一个弹窗（而非子菜单）
- 弹窗中列出所有可选的逻辑文档（排除 unclassified 和自身）
- 支持多选 checkbox
- 选中后进入下一步：拖拽排序所选文档的顺序
- 确认后，按排序顺序将所有文件 copy 添加到当前文档组

## Steps

1. **将 "From Documents" 从 DropdownMenuSub 改为 DropdownMenuItem**
   - 点击后关闭 dropdown，打开一个新的 modal（`showAddFromDocumentsModal`）
   - 在 CategoryCard 中添加 state: `showAddFromDocumentsModal`

2. **创建 AddFromDocumentsModal 组件**
   - 复用 MergeDocumentsModal 的两步流程（选择 + 排序），但最终 action 不同
   - **Step 1**: 多选逻辑文档（checkbox list），显示文档标题、类型、页数
   - **Step 2**: 拖拽排序已选文档
   - 确认按钮调用 `addFilesToGroup(targetGroupId, orderedFileIds)`
   - 样式与现有 modal 保持一致：主题色 `#0E4268`，与 CombineFromSelectionModal 相同的紧凑布局

3. **文件修改范围**
   - `FileHubContent.tsx`:
     - CategoryCard: 添加 `showAddFromDocumentsModal` state
     - 将 "From Documents" `DropdownMenuSub` 替换为 `DropdownMenuItem`（触发弹窗）
     - 新增 `AddFromDocumentsModal` 组件（参考 MergeDocumentsModal 的选择+排序模式）
     - Modal 的 `onConfirm` 调用 `addFilesToGroup`
   - **不需要改 store** — 复用现有 `addFilesToGroup` action
