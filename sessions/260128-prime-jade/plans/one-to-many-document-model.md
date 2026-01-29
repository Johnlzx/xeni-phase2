# One-to-Many Document Model Implementation Plan

## Summary

重构文档数据模型，从当前的"所有权模型"（文件直接存储在分类组中）转变为"引用模型"（文件独立存储，通过引用关联到多个容器）。这将支持单个页面同时满足多个签证要求，无需物理复制。

## Current State Analysis

### 当前模型问题
1. **1:1 所有权模型**: 文件直接存储在 `DocumentGroup.files[]` 中
2. **物理复制**: `duplicateFileToGroup` 创建新文件副本，产生数据冗余
3. **Unclassified 是一个容器**: 未分类文件存储在特殊的 "unclassified" 组中
4. **linkedToGroups 仅用于元数据**: 不是真正的多容器关联

### 目标模型
- **引用模型**: 文件独立存储，容器只持有文件 ID 引用
- **1:N 关联**: 一个文件可以同时属于多个容器
- **Unclassified = 0 关联**: 未分类不再是容器，而是"没有任何容器关联"的状态

---

## Implementation Steps

### Step 1: Refactor Data Types

**文件**: `types/case-detail.ts`

```typescript
// 新增：文件关联记录
export interface FileContainerAssociation {
  fileId: string;
  containerId: string;
  addedAt: string; // ISO timestamp
  addedBy?: 'upload' | 'assign' | 'reuse'; // 追踪关联来源
}

// 修改 DocumentFile
export interface DocumentFile {
  id: string;
  name: string;
  size: string;
  pages?: number;
  date?: string;
  type: "pdf" | "doc";
  isNew?: boolean;
  isRemoved?: boolean; // 用于软删除整个文件
  isAnalyzed?: boolean;
  analyzedAt?: string;
  // 1:N 关联 - 替代 linkedToGroups
  containerIds: string[]; // 该文件关联的所有容器 ID
  // Folder upload metadata
  relativePath?: string;
  entityType?: DocumentEntityType;
}

// DocumentGroup 不再直接持有 files
export interface DocumentGroup {
  id: string;
  title: string;
  tag: string;
  mergedFileName?: string;
  status: "pending" | "reviewed";
  hasChanges?: boolean;
  // 移除: files: DocumentFile[];
  // 新增: 只持有文件 ID 引用
  fileIds: string[];
  isSpecial?: boolean;
  entityType?: DocumentEntityType;
  generatedName?: string;
}
```

### Step 2: Refactor Store State

**文件**: `store/case-detail-store.ts`

```typescript
interface CaseDetailState {
  // 新增：独立的文件存储
  allFiles: Map<string, DocumentFile>; // fileId -> DocumentFile

  // 修改：容器只持有引用
  documentGroups: DocumentGroup[]; // files[] 改为 fileIds[]

  // 移除 unclassified 作为特殊容器的概念
  // Unclassified 通过 selector 计算得出
}
```

### Step 3: Add New Selectors

```typescript
// 获取未分类文件（containerIds.length === 0）
export const useUnclassifiedFiles = () => {
  return useCaseDetailStore((state) => {
    return Array.from(state.allFiles.values()).filter(
      (file) => !file.isRemoved && file.containerIds.length === 0
    );
  });
};

// 获取容器的文件列表
export const useContainerFiles = (containerId: string) => {
  return useCaseDetailStore((state) => {
    const group = state.documentGroups.find(g => g.id === containerId);
    if (!group) return [];
    return group.fileIds
      .map(id => state.allFiles.get(id))
      .filter((f): f is DocumentFile => f !== undefined && !f.isRemoved);
  });
};

// 检查文件是否在多个容器中（用于 UI 显示链接图标）
export const useFileContainerCount = (fileId: string) => {
  return useCaseDetailStore((state) => {
    const file = state.allFiles.get(fileId);
    return file?.containerIds.length ?? 0;
  });
};
```

### Step 4: Refactor Core Actions

#### 4.1 Add File to Container (新增)

```typescript
// 将文件添加到容器（核心操作）
addFileToContainer: (fileId: string, containerId: string) => {
  set((state) => {
    const file = state.allFiles.get(fileId);
    const group = state.documentGroups.find(g => g.id === containerId);

    if (!file || !group) return state;

    // 幂等性检查：如果已经关联，不重复添加
    if (file.containerIds.includes(containerId)) return state;

    // 更新文件的容器关联
    const updatedFile = {
      ...file,
      containerIds: [...file.containerIds, containerId],
      isNew: true,
    };

    // 更新容器的文件引用
    const updatedGroup = {
      ...group,
      fileIds: [...group.fileIds, fileId],
      status: "pending" as const,
      hasChanges: true,
    };

    const newAllFiles = new Map(state.allFiles);
    newAllFiles.set(fileId, updatedFile);

    return {
      allFiles: newAllFiles,
      documentGroups: state.documentGroups.map(g =>
        g.id === containerId ? updatedGroup : g
      ),
    };
  });
},
```

#### 4.2 Remove File from Container (新增)

```typescript
// 从容器中移除文件（只移除关联，不删除文件）
removeFileFromContainer: (fileId: string, containerId: string) => {
  set((state) => {
    const file = state.allFiles.get(fileId);
    const group = state.documentGroups.find(g => g.id === containerId);

    if (!file || !group) return state;

    // 更新文件的容器关联
    const updatedFile = {
      ...file,
      containerIds: file.containerIds.filter(id => id !== containerId),
    };

    // 更新容器的文件引用
    const updatedGroup = {
      ...group,
      fileIds: group.fileIds.filter(id => id !== fileId),
      status: "pending" as const,
      hasChanges: true,
    };

    const newAllFiles = new Map(state.allFiles);
    newAllFiles.set(fileId, updatedFile);

    return {
      allFiles: newAllFiles,
      documentGroups: state.documentGroups.map(g =>
        g.id === containerId ? updatedGroup : g
      ),
    };
  });
},
```

#### 4.3 Refactor moveFileToGroup

```typescript
// 移动文件（从一个容器移到另一个）
moveFileToContainer: (fileId: string, fromContainerId: string, toContainerId: string) => {
  // 先从源容器移除
  get().removeFileFromContainer(fileId, fromContainerId);
  // 再添加到目标容器
  get().addFileToContainer(fileId, toContainerId);
},
```

#### 4.4 Refactor duplicateFileToGroup → reuseFileInContainer

```typescript
// 复用文件（添加到新容器，保留原容器关联）
reuseFileInContainer: (fileId: string, targetContainerId: string) => {
  // 直接调用 addFileToContainer，文件会同时存在于两个容器
  get().addFileToContainer(fileId, targetContainerId);
},
```

### Step 5: Update Upload Actions

#### 5.1 Direct Upload to Container

```typescript
uploadToContainer: (containerId: string, fileCount: number) => {
  set((state) => {
    const timestamp = Date.now();
    const newFiles: DocumentFile[] = [];
    const newFileIds: string[] = [];

    for (let i = 0; i < fileCount; i++) {
      const fileId = `file_${timestamp}_${i}`;
      newFiles.push({
        id: fileId,
        name: `Document_${i + 1}.pdf`,
        size: "1.2 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
        containerIds: [containerId], // 直接关联到目标容器
      });
      newFileIds.push(fileId);
    }

    // 添加到 allFiles
    const newAllFiles = new Map(state.allFiles);
    newFiles.forEach(f => newAllFiles.set(f.id, f));

    // 更新容器
    const updatedGroups = state.documentGroups.map(g => {
      if (g.id === containerId) {
        return {
          ...g,
          fileIds: [...g.fileIds, ...newFileIds],
          status: "pending" as const,
          hasChanges: true,
        };
      }
      return g;
    });

    return {
      allFiles: newAllFiles,
      documentGroups: updatedGroups,
    };
  });
},
```

#### 5.2 Upload to Unclassified (无容器关联)

```typescript
uploadUnclassified: (fileCount: number) => {
  set((state) => {
    const timestamp = Date.now();
    const newAllFiles = new Map(state.allFiles);

    for (let i = 0; i < fileCount; i++) {
      const fileId = `file_${timestamp}_${i}`;
      newAllFiles.set(fileId, {
        id: fileId,
        name: `Document_${i + 1}.pdf`,
        size: "1.2 MB",
        pages: 1,
        date: "Just now",
        type: "pdf",
        isNew: true,
        containerIds: [], // 空数组 = 未分类
      });
    }

    return { allFiles: newAllFiles };
  });
},
```

### Step 6: Update UI Components

#### 6.1 Sidebar (Unclassified Area)

**文件**: `components/case-detail/file-hub/FileHubContent.tsx`

```typescript
// 使用新的 selector
const unclassifiedFiles = useUnclassifiedFiles();

// 从 Unclassified 移动到容器 = 添加容器关联
const handleAssignToContainer = (fileId: string, containerId: string) => {
  addFileToContainer(fileId, containerId);
  // 文件的 containerIds 从 [] 变为 [containerId]
  // 自动从 Unclassified 视图中消失
};
```

#### 6.2 Category Card

```typescript
// 使用容器的文件列表
const containerFiles = useContainerFiles(group.id);

// 显示文件是否在多个容器中
{file.containerIds.length > 1 && (
  <Badge>Linked to {file.containerIds.length} containers</Badge>
)}
```

#### 6.3 Add "Reuse from Existing" Interaction

在 CategoryReviewModal 或 CategoryCard 中添加：

```typescript
// 从其他容器复用文件
const handleReuseFromContainer = (fileId: string) => {
  reuseFileInContainer(fileId, currentContainerId);
  // 文件现在同时存在于原容器和当前容器
};
```

### Step 7: Data Migration

需要迁移现有数据结构：

```typescript
// 迁移函数：从旧模型转换到新模型
const migrateToReferenceModel = (oldState: OldCaseDetailState): NewCaseDetailState => {
  const allFiles = new Map<string, DocumentFile>();
  const updatedGroups: DocumentGroup[] = [];

  for (const group of oldState.documentGroups) {
    const fileIds: string[] = [];

    for (const file of group.files) {
      // 如果文件已存在（被复制过），合并 containerIds
      const existingFile = allFiles.get(file.id);
      if (existingFile) {
        existingFile.containerIds.push(group.id);
      } else {
        allFiles.set(file.id, {
          ...file,
          containerIds: group.id === 'unclassified' ? [] : [group.id],
        });
      }
      fileIds.push(file.id);
    }

    updatedGroups.push({
      ...group,
      files: undefined, // 移除旧字段
      fileIds,
    });
  }

  return { allFiles, documentGroups: updatedGroups };
};
```

---

## UI Interaction Changes

### Scenario A: Direct Upload to Container

```
用户点击 "Financial Evidence" 卡片上的 "Add" 按钮
  ↓
打开文件选择器，选择 "Bank_Stmt.pdf"
  ↓
系统上传并分割文件
  ↓
所有页面创建为 DocumentFile，containerIds = ["financial_evidence"]
  ↓
页面立即出现在 "Financial Evidence" 容器中
```

### Scenario B: Assign from Unclassified (Move)

```
Page A 当前在 Unclassified 区域 (containerIds = [])
  ↓
用户拖拽 Page A 到 "Identity" 容器
  ↓
调用 addFileToContainer("pageA", "identity")
  ↓
Page A 的 containerIds 变为 ["identity"]
  ↓
Page A 出现在 "Identity" 容器
Page A 从 Unclassified 消失（因为 containerIds.length > 0）
```

### Scenario C: Reuse from Existing Container (Copy/Reference)

```
Page B 当前在 "Financial Evidence" (containerIds = ["financial"])
  ↓
用户在 "Address Evidence" 容器中选择 "Add from existing"
  ↓
弹出选择器，用户选择 Page B
  ↓
调用 reuseFileInContainer("pageB", "address")
  ↓
Page B 的 containerIds 变为 ["financial", "address"]
  ↓
Page B 同时出现在两个容器中
没有创建物理副本，只是添加了引用
```

### Scenario D: Remove from One Container

```
Page B 在两个容器中 (containerIds = ["financial", "address"])
  ↓
用户在 "Financial Evidence" 中删除 Page B
  ↓
调用 removeFileFromContainer("pageB", "financial")
  ↓
Page B 的 containerIds 变为 ["address"]
  ↓
Page B 从 "Financial Evidence" 消失
Page B 仍然在 "Address Evidence" 中
文件本身没有被删除
```

---

## Files to Modify

| File | Changes |
|------|---------|
| `types/case-detail.ts` | 修改 DocumentFile, DocumentGroup 类型定义 |
| `store/case-detail-store.ts` | 重构 state 结构，添加新 actions，修改现有 actions |
| `components/case-detail/file-hub/FileHubContent.tsx` | 更新 Sidebar, CategoryCard 使用新的 selectors |
| `components/case-detail/shared/CategoryReviewModal.tsx` | 添加 "Reuse from existing" 功能 |

---

## Testing Checklist

- [ ] 上传文件到特定容器，文件正确关联
- [ ] 从 Unclassified 移动文件到容器，文件从 Unclassified 消失
- [ ] 复用文件到新容器，文件同时出现在两个容器
- [ ] 从一个容器移除文件，另一个容器不受影响
- [ ] 幂等性：重复添加同一文件到同一容器不产生重复
- [ ] 迁移：旧数据正确迁移到新模型
