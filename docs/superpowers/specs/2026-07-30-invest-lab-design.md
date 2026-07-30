# Invest Lab 网站设计规格

**日期：** 2026-07-30  
**仓库：** `git@github.com:wanghuanlab/invest.wanghuanlab.com.git`  
**状态：** 已确认，待实现计划

## 1. 目标与约束

### 1.1 产品定位

Invest Lab（wanghuanlab 投资研究笔记）是一个**个人向**的投资分析与分享网站：用于整理、沉淀与回顾跨资产主题的研究笔记，而非面向大众的投教门户或实时行情终端。

### 1.2 读者与成功标准

- **读者：** 站长本人（个人知识库 / 研究笔记，半公开可接受）
- **第一版成功：** 能按主题浏览与阅读笔记；新增 Markdown 即可出现在对应列表；视觉具备实验室品牌辨识度；技术栈便于后续接入采集/统计后台

### 1.3 明确不做（第一版）

- 登录、评论、全文搜索
- 真实图表与行情数据、假数据仪表盘
- CMS / 后台管理界面
- 重度 SEO 与多语言

## 2. 内容形态

- **结构：** 主题导航 + 每主题下的文章列表（多篇短文/笔记，按时间积累）
- **维护方式：** 前端仓库内静态 Markdown + 主题元数据 JSON；改文件即更新
- **主题（可扩展）：**

| slug | 中文名 |
|------|--------|
| `rates` | 利率 |
| `bonds` | 国债 |
| `stocks` | 股票 |
| `gold` | 黄金 |
| `demographics` | 人口 |
| `housing` | 房产 |

- **第一版内容量：** 每个主题 1 篇示例笔记；首页展示跨主题「最近更新」

### 2.1 内容目录约定

```
content/
  topics.json
  rates/
    <article-slug>.md
  bonds/
    ...
  stocks/
  gold/
  demographics/
  housing/
```

### 2.2 Markdown frontmatter

每篇必须包含：

- `title`（字符串）
- `date`（ISO 日期，如 `2026-07-30`）
- `summary`（一句话摘要）

可选：`tags`（字符串数组）

## 3. 信息架构与路由

| 路径 | 作用 |
|------|------|
| `/` | 首页：品牌、主题入口、最近笔记 |
| `/topics/:slug` | 主题页：简介 + 文章列表 + 数据区占位说明 |
| `/topics/:slug/:article` | 文章详情（Markdown 渲染） |
| `/about` | 关于本站 |

无效 `slug` 或缺失文章 → 简单 404 页。

## 4. 页面与组件

### 4.1 全局

- **SiteHeader：** 字标 `Invest Lab`、主题导航、About
- **SiteFooter：** 「个人研究笔记，非投资建议」+ 主题快速链接
- **主题轨道：** 顶栏下方当前主题高亮，作为实验室工位标签式签名元素

### 4.2 首页

1. 第一屏：品牌名为主；一句定位文案（利率到房产的个人宏观笔记）；进入主题的 CTA
2. 六主题入口（名称 + 一句简介；非仪表盘卡片堆）
3. 最近笔记列表（跨主题，按 `date` 降序）

### 4.3 主题页

- 主题名、简介
- 文章列表：标题、日期、摘要
- 「数据区」空槽：文案说明后续将接入采集与统计，第一版不渲染图表

### 4.4 文章页

- 标题、日期、所属主题
- Markdown 正文样式（标题、段落、引用、列表、代码块）
- 底部：返回主题；同主题上一篇 / 下一篇（按日期）

### 4.5 组件边界

- `SiteHeader` / `SiteFooter`
- `TopicGrid` / `ArticleList` / `ArticleMeta`
- `MarkdownRenderer`
- `content` 加载模块（`import.meta.glob` + frontmatter 解析）

## 5. 视觉方向

- **气质：** 实验室感 — wanghuanlab 品牌清晰、结构工具感强于杂志感
- **背景：** 浅冷灰 + 细网格/纸纹氛围；避免纯平色、紫渐变、奶油衬线默认风
- **色板：**
  - 墨蓝主色 `#0B1F33`
  - 铜绿强调 `#1F6F5B`（链接 / 焦点）
  - 暖灰正文
  - 浅冷灰背景
- **字体：**
  - 显示：Instrument Sans
  - 正文：Source Sans 3
  - 日期 / slug：IBM Plex Mono
- **动效：** 首页主题入口轻量入场；链接 hover 下划线；尊重 `prefers-reduced-motion`
- **响应式：** 桌面与移动均可完整阅读与导航

## 6. 技术架构

### 6.1 选定方案

Vite + Vue 3 + TypeScript + Vue Router + Tailwind CSS（v4）内容站。

内容在构建期通过 `import.meta.glob` 打包；无服务端渲染要求。

Markdown 渲染：`markdown-it` + frontmatter 解析（如 `gray-matter`）。

### 6.2 目录预留

- `src/api/`：占位，供后续采集/分析/统计服务客户端接入
- `content/`：唯一第一版内容源

### 6.3 后续扩展（本规格仅预留，不实现）

- 后台服务拉取宏观与市场数据、写入统计结果
- 主题页数据区替换为真实指标与图表
- 可选：搜索、RSS、更细的标签体系

### 6.4 Git

- 本地仓库已指向 `origin`：`git@github.com:wanghuanlab/invest.wanghuanlab.com.git`
- 默认分支：`main`

## 7. 验收标准

1. `npm install && npm run dev` 可本地浏览
2. 首页、六个主题页、六篇示例文、About 均可打开
3. 按约定新增 `content/<topic>/*.md` 后刷新/重建即可出现在列表与最近更新
4. 移动端布局可用；页脚免责声明可见
5. 无控制台阻塞性错误

## 8. 决策记录

| 决策 | 选择 |
|------|------|
| 读者 | 个人（A） |
| 内容形态 | 主题 + 文章列表（B） |
| 内容源 | 仓库内 Markdown/JSON（A） |
| 视觉 | 实验室感（C） |
| 技术路线 | Vite + Vue Router 内容站（方案 1） |
