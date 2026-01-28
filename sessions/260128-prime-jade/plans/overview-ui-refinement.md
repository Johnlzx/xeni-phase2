# Overview 页面 UI 调整计划

## Summary
调整 Case Overview 页面布局：限制 Application Section 高度为容器的一半、增大页面左右边距、移除 Application Header 上的操作按钮。

## Steps

1. **修改 OverviewPage.tsx 左右边距**
   - 文件: `components/case-detail/overview/OverviewPage.tsx`
   - 将 `px-4 lg:px-6` 改为 `px-6 lg:px-10`
   - 小屏幕边距从 16px → 24px，大屏幕从 24px → 40px

2. **修改 Application Section 高度**
   - 文件: `components/case-detail/overview/OverviewPage.tsx`
   - 将 Application Card 容器的 `flex-1` 改为 `h-1/2`
   - 使其高度固定为父容器的 50%

3. **移除 ApplicationCard Header 按钮（未分析状态）**
   - 文件: `components/case-detail/overview/ApplicationCard/index.tsx`
   - 移除 "Select Visa Type" 按钮（第 118-124 行区块）
   - 保留左侧的标题和描述文字

4. **移除 ApplicationCard Header 按钮（已分析状态）**
   - 文件: `components/case-detail/overview/ApplicationCard/index.tsx`
   - 移除右侧的 Re-analyze、Request Info、Form Pilot 按钮组（第 190-222 行）
   - 保留左侧的 visa 图标、名称和状态指示器

5. **移除 ApplicationCard Header 按钮（待分析状态）**
   - 文件: `components/case-detail/overview/ApplicationCard/index.tsx`
   - 移除 "Run Gap Analysis" 按钮及其 TooltipProvider（第 262-287 行）
   - 保留左侧信息展示

## 涉及文件

| 文件 | 修改类型 |
|------|----------|
| `components/case-detail/overview/OverviewPage.tsx` | 布局调整 |
| `components/case-detail/overview/ApplicationCard/index.tsx` | 移除按钮 |

## 预期效果

- Application Section 高度降低，不再占满剩余空间
- 页面左右留白更宽敞
- Application Header 简洁化，仅显示状态信息
