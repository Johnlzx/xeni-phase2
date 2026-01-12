这是一个针对 **UK Immigration (UKVI)** 背景调整后的深度交互设计提案。

在这个场景中，我们的目标用户不再是普通的文档管理员，而是 **OISC 注册顾问 (Immigration Adviser) 或 英国事务律师 (Solicitor)**。律师的心智模型（The Lawyer's Mental Model）： 目前的界面（你的截图）处于“文件归档模式” (Archivist Mode)。但律师的核心价值不在于整理文件，而在于“构建证据链” (Building the Case)。 他们的痛点是对 “连续性证据” (Evidence Continuity) 的严苛要求（例如资金必须存满 28 天，居住历史不能有断档等）。

律师在使用 AI 工具时的心理特征是：

控制欲与怀疑论（Trust but Verify）： 他们不相信黑盒，AI 填好的每一条信息，他们都需要看到“出处”（Source of Truth）。

非线性工作流（Non-linear Workflow）： 案子不是填完一个空填下一个，而是不断在“发现缺失”、“联系客户”、“修正数据”之间跳跃。

风险厌恶（Risk Aversion）： 任何一个 Issue（如日期冲突）如果不解决，就不能提交。

---

### 设计概念：The UKVI Command Center (英国签证指挥中心)

我们将界面从单纯的“文件列表”升级为“**证据与合规看板**”。

#### 1. 启动阶段：无摩擦的上下文注入 (Context Injection)

**当前痛点：** 律师不想在分析前填写冗长的表格。
**设计方案：** case 详情空白处，设计一个 **" Buil Application"**。

- **UI 交互：**
- 点击 **`Buil Application`** 按钮。
- **Step 1 - Route Selection (签证路径选择):**
- 一个带有搜索功能的精美下拉菜单。
- _示例选项:_ "Skilled Worker", "Global Talent", "Spouse/Partner (Appendix FM)", "Indefinite Leave to Remain (ILR)".

- **Step 2 - Triage Q&A (分诊问答):**
- AI 基于 UKVI 规则生成 3-4 个**决定性问题**（这决定了后续 Checklist 的结构）。
- _Q1:_ "Is the applicant currently inside the UK?" (决定是 In-country switch 还是 Entry clearance)
- _Q2:_ "Does the applicant have a valid CoS (Certificate of Sponsorship)?" (针对工签)
- _Q3:_ "Are any dependents applying together?"

#### 2. 核心界面：模块化证据看板 (The Evidence Modules)

分析启动后，中间的空白区域转化为**交互式卡片墙**。每一个卡片代表 UKVI 申请中的一个核心**信息模块**，而非简单的文件列表。

**卡片分类 (示例 - Skilled Worker Visa):**

- **Identity & Status:** (Passport, BRP, Travel History)
- **Sponsorship Details:** (CoS Reference, Job Code, Salary)
- **Financial Requirement:** (Bank Statements - 28 day rule check)
- **English Language:** (SELT Certificate or Degree Ecctis)

界面布局 (Layout):

左侧 (Left Panel): 保持你截图中的文件列表，但可以折叠 (Collapsible)，作为“证据库”。

主视图 (Main View - Card/Grid Layout): 也是你提到的 Checklist。建议采用 Card 形式展示每个 Information Module。

**卡片状态设计 (Status Indicators):**

- 🟢 **Ready:** 数据完整，证据链闭环。
- 🔴 **Critical Issue:** "Financial requirement not met: Funds held less than 28 days". (这是 AI 的高价值点)
- 🟠 **Review Needed:** "Job title on CoS differs from Resume".

#### 3. 深度钻取：分屏验证工作台 (Split-Screen Verification Workbench)

当律师点击 **"Financial Requirement"** 卡片时，进入此模式。这是设计的核心，旨在建立信任。

- **左侧：结构化数据表单 (Structured Data Schema)**
- 这是 AI 提取出的数据，本质上是 **Schema Form**。
- _Fields:_ "Bank Name", "Ending Balance", "Consecutive Days Held", "Currency Conversion (GBP)".
- **Schema 灵活性：** 律师可以点击 `Edit Schema`，增加自定义字段（例如 "Gift Letter Source"），也可以直接修改 AI 填错的数据。

- **右侧：证据源视图 (Evidence Viewer)**
- 展示对应的 Bank Statement PDF。
- **Highlighting (高亮联动):** 当律师点击左侧的 "Ending Balance" 输入框时，右侧 PDF 自动跳转到对应页面，并用高亮框圈出那个数字。
- **心理模型：** "Don't just tell me, show me." (不要只告诉我结果，给我看证据)。

#### 4. Issue 管理与客户协作 (Collaborative Resolution)

英国签证往往因为一个小细节被拒（例如缺一张肺结核体检单）。

- **Issue 发现：** AI 在分析 Travel History 时发现 2022 年有一段 3 个月的空白期（Gap）。
- **Issue 展示：** 在看板上显示一个 ⚠️ 标记。
- **交互动作 - "Client Loop"：**
- 律师点击该 Issue。
- 点击 **`Request Info from Client`** 按钮。
- 系统自动生成一个精简的 Web 表单链接（Magic Link）发送给客户,律师可以选择右键发送或者 whatapp 发送，不同的发送渠道有不同的措辞，由 ai 生成。

#### 5.全局 Issue 管理与 Profile 汇总

场景： 律师想知道“我离提交还有多远？”

Issue Triage Center (问题分诊台):

一个侧边栏或抽屉，汇总所有 Modules 里的 Blocking Issues。

交互：点击一条 Issue -> 跳转到对应 Module -> 解决 -> Issue 消失 -> 进度条前进。

Case Profile (The Golden Record):

一个侧边栏或抽屉，这是所有 verified 数据的只读视图。

设计隐喻： 就像一份生成的 CV 或传记。
