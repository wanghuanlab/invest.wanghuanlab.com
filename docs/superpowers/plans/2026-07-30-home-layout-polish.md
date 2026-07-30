# Homepage Layout Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 精修 Invest Lab 首页为首屏「左叙事 / 右摘要」研究台布局，贴近已确认参考图与规格。

**Architecture:** 在现有 `HomeView` 分栏上增强色标、推荐卡与最近更新节奏；可选 `cover` frontmatter 供推荐配图；不改全站壳与其他视图。

**Tech Stack:** Vue 3、Tailwind CSS v4、现有 `loadContent` API、Vitest

**Spec:** `docs/superpowers/specs/2026-07-30-home-layout-polish-design.md`

## Global Constraints

- 仅改首页相关文件；不新增无路由假导航
- 文案：标题「个人投资思考笔记」；副文案「连接利率与资产，理解周期与结构，在不确定的世界里寻找可重复的思考。」；CTA「浏览主题」；说明「静态 Markdown 研究库」
- 色板：墨蓝 `#0B1F33`、铜绿 `#1F6F5B`、纸色网格底；主题色标见规格表
- 不做厚阴影、大圆角卡片墙、紫渐变
- 提交信息英文 concise；未要求不 push

---

## File Structure

| Path | Responsibility |
|------|----------------|
| `src/content/topicColors.ts` | 六主题色映射 |
| `src/content/types.ts` | 可选 `cover?: string` |
| `src/content/parseFrontmatter.ts` / `loadContent.ts` | 解析并透传 `cover` |
| `content/stocks/six-paths-for-ordinary-investors.md` | featured + cover |
| `src/components/TopicSwatches.vue` | 首页主题色标行 |
| `src/components/HomeReadingPanel.vue` | 右栏推荐阅读 + 最近更新 |
| `src/views/HomeView.vue` | 左栏叙事 + 组装右栏 + 下方主题/列表 |
| 对应 `*.test.ts` | cover / 色映射 / 首页渲染关键文案 |

---

### Task 1: cover field + topic color map

**Files:**
- Create: `src/content/topicColors.ts`, `src/content/topicColors.test.ts`
- Modify: `src/content/types.ts`, `src/content/parseFrontmatter.ts` (boolean/string parsing already ok), `src/content/loadContent.ts`, `src/content/loadContent.test.ts`, `content/stocks/six-paths-for-ordinary-investors.md`

**Interfaces:**
- Produces: `export function topicColor(slug: string): string`
- Produces: `ArticleMeta.cover?: string`；`toMeta` 读取 `typeof data.cover === 'string'`

- [ ] **Step 1: Failing tests for topicColor and cover**

`src/content/topicColors.test.ts`：断言 `rates` → `#1F6F5B`，`stocks` → `#0B3A5C`，未知 slug 回退 `#1F6F5B`。

扩展 `loadContent.test.ts`：featured 文含 `cover: '/images/six-paths-for-ordinary-investors.png'`。

- [ ] **Step 2: Run tests — expect fail**

```bash
npm test -- src/content/topicColors.test.ts src/content/loadContent.test.ts
```

- [ ] **Step 3: Implement map + cover wiring + frontmatter on featured md**

```ts
// src/content/topicColors.ts
const COLORS: Record<string, string> = {
  rates: '#1F6F5B',
  bonds: '#8B6914',
  stocks: '#0B3A5C',
  gold: '#C4A035',
  demographics: '#6B4C9A',
  housing: '#2F6F8F',
}

export function topicColor(slug: string): string {
  return COLORS[slug] ?? '#1F6F5B'
}
```

在 `toMeta` 中：`cover` 为非空 string 时写入 meta。  
给 featured md 增加：`cover: /images/six-paths-for-ordinary-investors.png`

- [ ] **Step 4: Tests pass + commit**

```bash
npm test
git add src/content content/stocks/six-paths-for-ordinary-investors.md
git commit -m "feat: add topic color map and optional article cover"
```

---

### Task 2: TopicSwatches + HomeReadingPanel + HomeView polish

**Files:**
- Create: `src/components/TopicSwatches.vue`, `src/components/HomeReadingPanel.vue`, `src/views/HomeView.test.ts`（可选但推荐）
- Modify: `src/views/HomeView.vue`

**Interfaces:**
- Consumes: `getTopics`, `getFeaturedArticles`, `getRecentArticles`, `topicColor`, `ArticleMeta.cover`
- `TopicSwatches` props: `topics: Topic[]`
- `HomeReadingPanel` props: `featured?: ArticleMeta`, `latest: ArticleMeta[]`

- [ ] **Step 1: Implement TopicSwatches**

横向色块 + 主题名 `RouterLink`；桌面一行，移动可换行；`aria-label="研究主题色标"`。

- [ ] **Step 2: Implement HomeReadingPanel**

结构对齐规格 §3.2：推荐阅读（有 `cover` 才显示 img）+ 最近更新 3 条（色点用 `topicColor`）+ 查看全部链接。

- [ ] **Step 3: Rewrite HomeView left column + compose panels**

左栏顺序与规格一致；grid `lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]`；下方保留 TopicGrid + ArticleList。

- [ ] **Step 4: Add HomeView SSR smoke test**

断言渲染含「个人投资思考笔记」「推荐阅读」「最近更新」「静态 Markdown 研究库」。

- [ ] **Step 5: Verify + commit**

```bash
npm test
npm run build
git add src/components/TopicSwatches.vue src/components/HomeReadingPanel.vue src/views/HomeView.vue src/views/HomeView.test.ts
git commit -m "feat: polish home hero into reading-desk layout"
```

---

### Task 3: Visual QA pass

**Files:**
- Modify only if needed: `HomeView.vue` / panel components / `style.css`（首页专用类尽量 scoped）

- [ ] **Step 1: Manual check against spec §7**（dev server：分栏、色标、锚点、移动宽度）
- [ ] **Step 2: Fix spacing/contrast issues found**
- [ ] **Step 3: `npm test && npm run build` + commit if fixes**

```bash
git commit -m "fix: tune home spacing and reading panel hierarchy"
```

（若无可改则跳过 commit）

---

## Self-Review

1. Spec coverage: 左栏、右栏、色标、cover、下方两段、不做假导航均有 Task。
2. No placeholders / TBD.
3. Types: `cover` optional string；`topicColor(slug)` consistent.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-30-home-layout-polish.md`.

**Two execution options:**

1. **Subagent-Driven（推荐）** — 每 Task 子代理 + 复查  
2. **Inline Execution** — 本会话连续做完  

选哪个？
