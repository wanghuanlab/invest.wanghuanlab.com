# Invest Lab V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 搭建可浏览的 Invest Lab 个人投资研究笔记站：六主题导航、Markdown 文章列表/详情、实验室视觉，并为后续数据采集后台预留 `src/api/`。

**Architecture:** Vue 3 SPA；`content/` 下 JSON + Markdown 经 `import.meta.glob('…', { query: '?raw', import: 'default' })` 构建期打包；自写 frontmatter 解析 + `markdown-it` 渲染；Vue Router 提供首页 / 主题 / 文章 / About / 404。

**Tech Stack:** Vue 3、Vite、TypeScript、Vue Router、Tailwind CSS v4、markdown-it、Vitest

**Spec:** `docs/superpowers/specs/2026-07-30-invest-lab-design.md`

## Global Constraints

- 读者：个人研究笔记；页脚必须含「个人研究笔记，非投资建议」
- 主题 slug 固定：`rates` `bonds` `stocks` `gold` `demographics` `housing`
- 内容唯一源：`content/`；frontmatter 必填 `title` `date` `summary`；可选 `tags`
- 路由：`/`、`/topics/:slug`、`/topics/:slug/:article`、`/about`；无效路由 → 404
- 视觉：墨蓝 `#0B1F33`、铜绿 `#1F6F5B`、浅冷灰底 + 细网格；字体 Instrument Sans / Source Sans 3 / IBM Plex Mono
- 不做：登录、评论、搜索、真/假图表、CMS、重度 SEO
- 仓库已有 `docs/` 与 git remote；脚手架必须在**当前仓库根目录**完成，不得覆盖 `docs/`
- 提交信息用英文 concise style；未要求时不要 push

---

## File Structure

| Path | Responsibility |
|------|----------------|
| `package.json` / `vite.config.ts` / `tsconfig*.json` / `index.html` | 工程与构建 |
| `src/main.ts` / `src/App.vue` / `src/style.css` | 入口、布局壳、设计 token |
| `src/router/index.ts` | 路由表 |
| `src/content/types.ts` | `Topic` `ArticleMeta` `Article` 类型 |
| `src/content/parseFrontmatter.ts` | 解析 Markdown frontmatter |
| `src/content/loadContent.ts` | glob 加载 topics + articles；查询 API |
| `src/content/markdown.ts` | markdown-it → HTML |
| `content/topics.json` | 主题元数据 |
| `content/<topic>/*.md` | 示例笔记（每主题 1 篇） |
| `src/components/SiteHeader.vue` | 顶栏字标 + About |
| `src/components/TopicRail.vue` | 主题轨道（签名元素） |
| `src/components/SiteFooter.vue` | 免责声明 + 主题链 |
| `src/components/TopicGrid.vue` | 首页主题入口 |
| `src/components/ArticleList.vue` | 文章列表 |
| `src/components/ArticleMeta.vue` | 标题区元信息 |
| `src/components/MarkdownRenderer.vue` | 安全渲染 HTML |
| `src/views/HomeView.vue` | 首页 |
| `src/views/TopicView.vue` | 主题页 + 数据区占位 |
| `src/views/ArticleView.vue` | 文章页 + 上下篇 |
| `src/views/AboutView.vue` | 关于 |
| `src/views/NotFoundView.vue` | 404 |
| `src/api/README.md` | 后续后台客户端占位说明 |
| `src/content/*.test.ts` | 解析与加载单元测试 |
| `README.md` | 本地运行与内容约定 |

---

### Task 1: Scaffold Vue + Vite + Tailwind + Router + Vitest

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `index.html`, `src/main.ts`, `src/App.vue`, `src/style.css`, `src/vite-env.d.ts`, `.gitignore`
- Preserve: `docs/**`

**Interfaces:**
- Produces: runnable `npm run dev` / `npm run build` / `npm test`；依赖含 `vue` `vue-router` `markdown-it` `tailwindcss` `@tailwindcss/vite` `vitest`

- [ ] **Step 1: Write `.gitignore`**

```
node_modules
dist
.DS_Store
*.local
.env
.env.*
```

- [ ] **Step 2: Create `package.json`**

```json
{
  "name": "invest.wanghuanlab.com",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "markdown-it": "^14.1.0",
    "vue": "^3.5.13",
    "vue-router": "^4.5.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.0.0",
    "@types/markdown-it": "^14.1.2",
    "@vitejs/plugin-vue": "^5.2.1",
    "tailwindcss": "^4.0.0",
    "typescript": "~5.7.2",
    "vite": "^6.0.0",
    "vitest": "^3.0.0",
    "vue-tsc": "^2.2.0"
  }
}
```

- [ ] **Step 3: Create Vite + TS config**

`vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
  },
})
```

`tsconfig.json`:

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

`tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "paths": { "@/*": ["./src/*"] },
    "baseUrl": "."
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"]
}
```

`tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}
```

`index.html`:

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Invest Lab</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Instrument+Sans:wght@500;600;700&family=Source+Sans+3:ital,wght@0,400;0,600;1,400&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

`src/vite-env.d.ts`:

```ts
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

declare module '*?raw' {
  const content: string
  export default content
}
```

- [ ] **Step 4: Minimal app entry**

`src/style.css`:

```css
@import 'tailwindcss';

@theme {
  --color-ink: #0b1f33;
  --color-accent: #1f6f5b;
  --color-paper: #e8eef2;
  --color-muted: #5c6b76;
  --font-display: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif;
  --font-body: 'Source Sans 3', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'IBM Plex Mono', ui-monospace, monospace;
}

html {
  @apply bg-paper text-ink antialiased;
  font-family: var(--font-body);
}

body {
  min-height: 100vh;
  background-image:
    linear-gradient(rgba(11, 31, 51, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(11, 31, 51, 0.04) 1px, transparent 1px);
  background-size: 24px 24px;
  background-color: var(--color-paper);
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

`src/App.vue`:

```vue
<template>
  <div class="min-h-screen flex flex-col">
    <main class="flex-1 px-4 py-10 max-w-3xl mx-auto w-full">
      <p class="font-display text-2xl font-semibold text-ink">Invest Lab</p>
      <p class="mt-2 text-muted">scaffold ok</p>
    </main>
  </div>
</template>
```

`src/main.ts`:

```ts
import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

createApp(App).mount('#app')
```

- [ ] **Step 5: Install and verify**

Run:

```bash
npm install
npm run build
```

Expected: install succeeds; `vite build` (via `vue-tsc -b && vite build`) exits 0 and writes `dist/`.

If `vue-tsc -b` fails due to missing project references build info, switch build script to `"build": "vue-tsc --noEmit -p tsconfig.app.json && vite build"` and re-run.

- [ ] **Step 6: Commit**

```bash
git add .gitignore package.json package-lock.json vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json index.html src
git commit -m "$(cat <<'EOF'
chore: scaffold Vue Vite Tailwind app shell

Bootstrap the Invest Lab frontend toolchain without replacing existing docs.
EOF
)"
```

---

### Task 2: Frontmatter parser + content types (TDD)

**Files:**
- Create: `src/content/types.ts`, `src/content/parseFrontmatter.ts`, `src/content/parseFrontmatter.test.ts`

**Interfaces:**
- Produces:
  - `export interface Topic { slug: string; name: string; summary: string; order: number }`
  - `export interface ArticleMeta { topicSlug: string; slug: string; title: string; date: string; summary: string; tags?: string[] }`
  - `export interface Article extends ArticleMeta { body: string }`
  - `export function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string }`

- [ ] **Step 1: Write failing test**

`src/content/parseFrontmatter.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { parseFrontmatter } from './parseFrontmatter'

describe('parseFrontmatter', () => {
  it('parses yaml-like frontmatter and body', () => {
    const raw = `---
title: Hello
date: 2026-07-30
summary: A note
tags:
  - macro
---
# Body

Paragraph.
`
    const result = parseFrontmatter(raw)
    expect(result.data.title).toBe('Hello')
    expect(result.data.date).toBe('2026-07-30')
    expect(result.data.summary).toBe('A note')
    expect(result.data.tags).toEqual(['macro'])
    expect(result.content.trim().startsWith('# Body')).toBe(true)
  })

  it('returns empty data when frontmatter missing', () => {
    const result = parseFrontmatter('# Only body\n')
    expect(result.data).toEqual({})
    expect(result.content).toContain('# Only body')
  })
})
```

- [ ] **Step 2: Run test — expect fail**

```bash
npm test -- src/content/parseFrontmatter.test.ts
```

Expected: FAIL (module not found or `parseFrontmatter` undefined)

- [ ] **Step 3: Implement parser + types**

`src/content/types.ts`:

```ts
export interface Topic {
  slug: string
  name: string
  summary: string
  order: number
}

export interface ArticleMeta {
  topicSlug: string
  slug: string
  title: string
  date: string
  summary: string
  tags?: string[]
}

export interface Article extends ArticleMeta {
  body: string
}
```

`src/content/parseFrontmatter.ts`:

```ts
function parseScalar(value: string): unknown {
  const v = value.trim()
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    return v.slice(1, -1)
  }
  return v
}

function parseSimpleYaml(block: string): Record<string, unknown> {
  const data: Record<string, unknown> = {}
  const lines = block.split(/\r?\n/)
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim() || line.trim().startsWith('#')) {
      i += 1
      continue
    }
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (!match) {
      i += 1
      continue
    }
    const key = match[1]
    const rest = match[2]
    if (rest === '' || rest === '|' || rest === '>') {
      const items: string[] = []
      i += 1
      while (i < lines.length) {
        const item = lines[i].match(/^\s+-\s+(.*)$/)
        if (!item) break
        items.push(String(parseScalar(item[1])))
        i += 1
      }
      data[key] = items
      continue
    }
    data[key] = parseScalar(rest)
    i += 1
  }
  return data
}

export function parseFrontmatter(raw: string): {
  data: Record<string, unknown>
  content: string
} {
  const normalized = raw.replace(/^\uFEFF/, '')
  if (!normalized.startsWith('---')) {
    return { data: {}, content: normalized }
  }
  const end = normalized.indexOf('\n---', 3)
  if (end === -1) {
    return { data: {}, content: normalized }
  }
  const block = normalized.slice(4, end).replace(/^\r?\n/, '')
  const content = normalized.slice(end + 4).replace(/^\r?\n/, '')
  return { data: parseSimpleYaml(block), content }
}
```

- [ ] **Step 4: Run test — expect pass**

```bash
npm test -- src/content/parseFrontmatter.test.ts
```

Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/content/types.ts src/content/parseFrontmatter.ts src/content/parseFrontmatter.test.ts
git commit -m "$(cat <<'EOF'
feat: add frontmatter parser and content types

Support title/date/summary/tags for Markdown research notes.
EOF
)"
```

---

### Task 3: topics.json, sample notes, content loader

**Files:**
- Create: `content/topics.json`, `content/rates/*.md`, `content/bonds/*.md`, `content/stocks/*.md`, `content/gold/*.md`, `content/demographics/*.md`, `content/housing/*.md`, `src/content/loadContent.ts`, `src/content/loadContent.test.ts`, `src/content/markdown.ts`

**Interfaces:**
- Consumes: `parseFrontmatter`, `Topic`, `Article`, `ArticleMeta`
- Produces:
  - `export function getTopics(): Topic[]`
  - `export function getTopic(slug: string): Topic | undefined`
  - `export function getArticlesByTopic(topicSlug: string): ArticleMeta[]`
  - `export function getArticle(topicSlug: string, articleSlug: string): Article | undefined`
  - `export function getRecentArticles(limit?: number): ArticleMeta[]`
  - `export function getAdjacentArticles(topicSlug: string, articleSlug: string): { prev?: ArticleMeta; next?: ArticleMeta }`
  - `export function renderMarkdown(md: string): string`

- [ ] **Step 1: Write `content/topics.json`**

```json
[
  {
    "slug": "rates",
    "name": "利率",
    "summary": "政策利率、曲线形态与流动性传导。",
    "order": 1
  },
  {
    "slug": "bonds",
    "name": "国债",
    "summary": "久期、供需与财政预期如何定价债券。",
    "order": 2
  },
  {
    "slug": "stocks",
    "name": "股票",
    "summary": "盈利、估值与风险偏好的交叉验证。",
    "order": 3
  },
  {
    "slug": "gold",
    "name": "黄金",
    "summary": "实际利率、美元与避险需求的三角关系。",
    "order": 4
  },
  {
    "slug": "demographics",
    "name": "人口",
    "summary": "年龄结构、储蓄与长期需求的底座。",
    "order": 5
  },
  {
    "slug": "housing",
    "name": "房产",
    "summary": "利率、人口与库存共同决定的居住资产。",
    "order": 6
  }
]
```

- [ ] **Step 2: Add one sample Markdown per topic**

Create these files (same frontmatter shape; unique titles/dates):

`content/rates/reading-the-policy-rate.md`:

```md
---
title: 读懂政策利率的第一层
date: 2026-07-24
summary: 先分清政策利率、市场利率与贷款利率，再谈传导。
tags:
  - rates
  - framework
---

政策利率是宏观笔记里最容易「看起来懂、写起来空」的概念。

## 这一层先记住什么

- 政策利率是央行的操作锚，不等于你能借到的利率。
- 曲线形态往往比单点水平更能说明预期。
- 写笔记时先记录：**变的是哪一层利率、持续多久、影响谁的融资成本**。

> 个人研究备忘：后续把公开市场操作与常备借贷便利的关系补一张表。
```

`content/bonds/duration-and-supply.md` — `date: 2026-07-25`，标题「久期与供给：国债笔记提纲」

`content/stocks/earnings-vs-multiple.md` — `date: 2026-07-26`，标题「盈利还是估值：股票笔记入口」

`content/gold/real-yields-and-gold.md` — `date: 2026-07-27`，标题「实际利率视角下的黄金」

`content/demographics/age-structure-lens.md` — `date: 2026-07-28`，标题「年龄结构：人口主题的观察镜头」

`content/housing/rates-meet-inventory.md` — `date: 2026-07-29`，标题「利率遇上库存：房产笔记起点」

每篇正文至少含一个二级标题、一个列表、一句研究备忘；`summary` 一句话即可。

- [ ] **Step 3: Write loader tests (failing)**

`src/content/loadContent.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import {
  getAdjacentArticles,
  getArticle,
  getArticlesByTopic,
  getRecentArticles,
  getTopic,
  getTopics,
} from './loadContent'

describe('loadContent', () => {
  it('returns six topics in order', () => {
    const topics = getTopics()
    expect(topics).toHaveLength(6)
    expect(topics.map((t) => t.slug)).toEqual([
      'rates',
      'bonds',
      'stocks',
      'gold',
      'demographics',
      'housing',
    ])
  })

  it('loads article by topic and slug', () => {
    const article = getArticle('rates', 'reading-the-policy-rate')
    expect(article?.title).toContain('政策利率')
    expect(article?.body).toContain('政策利率')
  })

  it('sorts recent articles by date desc', () => {
    const recent = getRecentArticles(3)
    expect(recent).toHaveLength(3)
    expect(recent[0].date >= recent[1].date).toBe(true)
    expect(recent[1].date >= recent[2].date).toBe(true)
  })

  it('returns adjacent articles within a topic', () => {
    const list = getArticlesByTopic('rates')
    expect(list.length).toBeGreaterThanOrEqual(1)
    const adj = getAdjacentArticles('rates', list[0].slug)
    expect(adj.prev || adj.next || list.length === 1).toBeTruthy()
  })

  it('returns undefined for unknown topic', () => {
    expect(getTopic('nope')).toBeUndefined()
  })
})
```

- [ ] **Step 4: Run tests — expect fail**

```bash
npm test -- src/content/loadContent.test.ts
```

Expected: FAIL (module missing)

- [ ] **Step 5: Implement loader + markdown helper**

`src/content/markdown.ts`:

```ts
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
})

export function renderMarkdown(source: string): string {
  return md.render(source)
}
```

`src/content/loadContent.ts`:

```ts
import topicsJson from '../../content/topics.json'
import { parseFrontmatter } from './parseFrontmatter'
import type { Article, ArticleMeta, Topic } from './types'

const topicModules = import.meta.glob('../../content/*/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function pathParts(path: string): { topicSlug: string; slug: string } | null {
  const match = path.replace(/\\/g, '/').match(/content\/([^/]+)\/([^/]+)\.md$/)
  if (!match) return null
  return { topicSlug: match[1], slug: match[2] }
}

function toMeta(
  topicSlug: string,
  slug: string,
  data: Record<string, unknown>,
): ArticleMeta | null {
  const title = data.title
  const date = data.date
  const summary = data.summary
  if (
    typeof title !== 'string' ||
    typeof date !== 'string' ||
    typeof summary !== 'string'
  ) {
    return null
  }
  const tags = Array.isArray(data.tags)
    ? data.tags.filter((t): t is string => typeof t === 'string')
    : undefined
  return { topicSlug, slug, title, date, summary, tags }
}

const articles: Article[] = Object.entries(topicModules)
  .map(([path, raw]) => {
    const parts = pathParts(path)
    if (!parts) return null
    const { data, content } = parseFrontmatter(raw)
    const meta = toMeta(parts.topicSlug, parts.slug, data)
    if (!meta) return null
    return { ...meta, body: content } satisfies Article
  })
  .filter((a): a is Article => a !== null)

export function getTopics(): Topic[] {
  return [...(topicsJson as Topic[])].sort((a, b) => a.order - b.order)
}

export function getTopic(slug: string): Topic | undefined {
  return getTopics().find((t) => t.slug === slug)
}

export function getArticlesByTopic(topicSlug: string): ArticleMeta[] {
  return articles
    .filter((a) => a.topicSlug === topicSlug)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .map(({ body: _body, ...meta }) => meta)
}

export function getArticle(
  topicSlug: string,
  articleSlug: string,
): Article | undefined {
  return articles.find(
    (a) => a.topicSlug === topicSlug && a.slug === articleSlug,
  )
}

export function getRecentArticles(limit = 6): ArticleMeta[] {
  return [...articles]
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .slice(0, limit)
    .map(({ body: _body, ...meta }) => meta)
}

export function getAdjacentArticles(
  topicSlug: string,
  articleSlug: string,
): { prev?: ArticleMeta; next?: ArticleMeta } {
  const list = getArticlesByTopic(topicSlug)
  const index = list.findIndex((a) => a.slug === articleSlug)
  if (index === -1) return {}
  return {
    prev: list[index + 1],
    next: list[index - 1],
  }
}
```

Enable JSON resolve: ensure `tsconfig.app.json` has `"resolveJsonModule": true`.

Vitest must resolve `import.meta.glob` — with `eager: true` Vite/Vitest handles it when tests run through Vitest’s Vite pipeline. If tests fail to see files, add to `vite.config.ts`:

```ts
  // already using vitest via vite config; ensure root is project root
```

- [ ] **Step 6: Run tests — expect pass**

```bash
npm test
```

Expected: all content tests PASS

- [ ] **Step 7: Commit**

```bash
git add content src/content tsconfig.app.json
git commit -m "$(cat <<'EOF'
feat: load topics and markdown notes from content/

Add six sample notes and query helpers for lists, detail, and adjacency.
EOF
)"
```

---

### Task 4: Router + app shell (Header, TopicRail, Footer)

**Files:**
- Create: `src/router/index.ts`, `src/components/SiteHeader.vue`, `src/components/TopicRail.vue`, `src/components/SiteFooter.vue`, `src/views/HomeView.vue` (placeholder), `src/views/TopicView.vue` (placeholder), `src/views/ArticleView.vue` (placeholder), `src/views/AboutView.vue` (placeholder), `src/views/NotFoundView.vue`
- Modify: `src/main.ts`, `src/App.vue`

**Interfaces:**
- Consumes: `getTopics()`, route params `slug` `article`
- Produces: working navigation shell; views may be placeholders until Tasks 5–7

- [ ] **Step 1: Create router**

`src/router/index.ts`:

```ts
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import TopicView from '@/views/TopicView.vue'
import ArticleView from '@/views/ArticleView.vue'
import AboutView from '@/views/AboutView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/topics/:slug', name: 'topic', component: TopicView },
    {
      path: '/topics/:slug/:article',
      name: 'article',
      component: ArticleView,
    },
    { path: '/about', name: 'about', component: AboutView },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})
```

- [ ] **Step 2: Implement shell components**

`SiteHeader.vue`: logo text `Invest Lab` linking to `/`；右侧 `About` 链到 `/about`。字标用 `font-display`，品牌为主。

`TopicRail.vue`: `getTopics()` 渲染横向轨道；`RouterLink` 到 `/topics/:slug`；若 `route.params.slug` 匹配则铜绿下划线/底边高亮；移动端可横向滚动。

`SiteFooter.vue`: 文案固定包含「个人研究笔记，非投资建议」；下列主题快速链接。

Placeholder views：各文件渲染主题名/路径参数即可，例如 HomeView 显示 `Home`。

- [ ] **Step 3: Wire App + main**

`App.vue` 结构：

```vue
<template>
  <div class="min-h-screen flex flex-col">
    <SiteHeader />
    <TopicRail />
    <main class="flex-1 w-full max-w-3xl mx-auto px-4 py-8">
      <RouterView />
    </main>
    <SiteFooter />
  </div>
</template>
```

`main.ts`：`app.use(router)`.

- [ ] **Step 4: Manual verify**

```bash
npm run dev
```

Open `/`、`/about`、`/topics/rates`、任意坏路径 → 404 占位可见；轨道可点。

- [ ] **Step 5: Commit**

```bash
git add src/router src/components src/views src/App.vue src/main.ts
git commit -m "$(cat <<'EOF'
feat: add router and lab shell navigation

Introduce header, topic rail, footer, and route placeholders.
EOF
)"
```

---

### Task 5: Home page (hero + TopicGrid + recent list)

**Files:**
- Create: `src/components/TopicGrid.vue`, `src/components/ArticleList.vue`
- Modify: `src/views/HomeView.vue`

**Interfaces:**
- Consumes: `getTopics()`, `getRecentArticles()`, `ArticleMeta`, `Topic`
- Produces: Home matching spec §4.2

- [ ] **Step 1: Implement `TopicGrid.vue`**

Props: `topics: Topic[]`。每项：`RouterLink` 到主题；展示 `name` + `summary`；**不要**做成多阴影卡片墙——用分割线/网格线即可。入场：`@starting-style` 或简单 CSS `@keyframes fade-up`，包在 `@media (prefers-reduced-motion: no-preference)`。

- [ ] **Step 2: Implement `ArticleList.vue`**

Props: `articles: ArticleMeta[]`；可选 `showTopic?: boolean`。每项链接 `/topics/${topicSlug}/${slug}`；展示 title、date（`font-mono`）、summary；若 `showTopic` 显示主题名（用 `getTopic`）。

- [ ] **Step 3: Implement `HomeView.vue`**

第一屏（viewport 内尽量只保留）：

- 品牌：`Invest Lab`（可小于 header 重复强调，或用副标题强化实验室定位）
- 一句：`利率到房产的个人宏观笔记`
- CTA：`浏览主题` → 锚点 `#topics` 或滚动到 TopicGrid

其下：`id="topics"` + TopicGrid；再下「最近更新」+ `ArticleList`（`showTopic` true，`getRecentArticles(6)`）。

- [ ] **Step 4: Verify in browser**

```bash
npm run dev
```

首页可见六主题与六篇最近笔记；点击进入主题/文章路由（文章页仍可能占位）。

- [ ] **Step 5: Commit**

```bash
git add src/components/TopicGrid.vue src/components/ArticleList.vue src/views/HomeView.vue
git commit -m "$(cat <<'EOF'
feat: build home hero, topic grid, and recent notes

Surface the six research themes and latest Markdown notes on the landing page.
EOF
)"
```

---

### Task 6: Topic page + data slot

**Files:**
- Modify: `src/views/TopicView.vue`

**Interfaces:**
- Consumes: `getTopic(slug)`, `getArticlesByTopic(slug)`, `ArticleList`
- Produces: topic intro, article list, data placeholder copy (no charts)

- [ ] **Step 1: Implement TopicView**

- 从 `route.params.slug` 取主题；不存在 → `router.replace` 到 not-found 或直接渲染 `NotFoundView` 逻辑（推荐：`if (!topic) return` 后显示站内 404 片段并 `onMounted` 可保持 404 路由，或 `throw` 前导航到 `/404`——**采用**：未知 slug 时渲染与 `NotFoundView` 相同文案，并设置文档标题）
- 展示 `name`、`summary`
- `ArticleList` 列出该主题文章
- 数据区空槽文案示例：`数据区预留：后续将接入采集与统计服务，用于展示该主题的关键指标。第一版不提供图表。`

- [ ] **Step 2: Verify**

打开 `/topics/gold`、`/topics/nope`：前者有 1 篇列表 + 占位；后者为 404 体验。

- [ ] **Step 3: Commit**

```bash
git add src/views/TopicView.vue
git commit -m "$(cat <<'EOF'
feat: add topic page with article list and data slot

Reserve a non-chart placeholder for future acquisition/stats APIs.
EOF
)"
```

---

### Task 7: Article page + MarkdownRenderer

**Files:**
- Create: `src/components/ArticleMeta.vue`, `src/components/MarkdownRenderer.vue`
- Modify: `src/views/ArticleView.vue`, `src/style.css`（文章排版类）

**Interfaces:**
- Consumes: `getArticle`, `getAdjacentArticles`, `getTopic`, `renderMarkdown`
- Produces: full article reading view with prev/next

- [ ] **Step 1: ArticleMeta + MarkdownRenderer**

`ArticleMeta.vue` props: `title`, `date`, `topicName`, `topicSlug`。

`MarkdownRenderer.vue` props: `source: string`；`computed` HTML via `renderMarkdown`；模板 `<div class="prose-invest" v-html="html" />`（`html: false` 已关 raw HTML）。

在 `style.css` 增加 `.prose-invest`：`h2`/`p`/`ul`/`blockquote`/`code`/`pre` 间距与铜绿链接色。

- [ ] **Step 2: ArticleView**

- 加载文章；缺失 → 404 体验
- Meta + Markdown body
- 底：返回主题；`prev`/`next` 链接（按 `getAdjacentArticles`：列表已按日期降序，`next` 更新、`prev` 更旧）

- [ ] **Step 3: Verify all six articles**

手工打开每个示例文；检查列表、引用、代码样式；上下篇在仅一篇时隐藏对应方向。

- [ ] **Step 4: Commit**

```bash
git add src/components/ArticleMeta.vue src/components/MarkdownRenderer.vue src/views/ArticleView.vue src/style.css
git commit -m "$(cat <<'EOF'
feat: render Markdown articles with adjacent navigation

Complete the note reading path for each research topic.
EOF
)"
```

---

### Task 8: About, 404 polish, api placeholder, README

**Files:**
- Modify: `src/views/AboutView.vue`, `src/views/NotFoundView.vue`
- Create: `src/api/README.md`, `README.md`

**Interfaces:**
- Produces: About copy aligned with spec；`src/api/` 占位；根 README 运行说明

- [ ] **Step 1: AboutView**

说明：个人宏观/跨资产研究笔记；主题范围六项；后续计划接入采集分析统计；非投资建议。

- [ ] **Step 2: NotFoundView**

简洁「未找到」+ 回首页 / 浏览主题链接。

- [ ] **Step 3: `src/api/README.md`**

```md
# API client (reserved)

Future home for HTTP clients that talk to acquisition / analytics / stats services.

V1 ships with static `content/` only. Do not add mock chart APIs here yet.
```

- [ ] **Step 4: Root `README.md`**

含：项目简介、`npm install` / `npm run dev` / `npm run build` / `npm test`、如何新增主题文章（路径 + frontmatter 字段）、链接到设计规格路径。

- [ ] **Step 5: Final verification**

```bash
npm test
npm run build
npm run dev
```

对照规格验收：首页、六主题、六文、About、页脚声明、移动宽度下导航可用。

- [ ] **Step 6: Commit**

```bash
git add src/views/AboutView.vue src/views/NotFoundView.vue src/api/README.md README.md
git commit -m "$(cat <<'EOF'
docs: add About, API placeholder, and project README

Document local workflow and reserve the future stats client folder.
EOF
)"
```

---

## Self-Review

1. **Spec coverage:** IA/routes、六主题、Markdown 内容模型、壳组件、首页/主题/文章/About/404、视觉 token、数据区占位、`src/api/`、验收命令均有对应 Task。
2. **Placeholders:** 无 TBD；示例文在 Task 3 列出必写文件与一篇全文模板。
3. **Type consistency:** `Topic` / `ArticleMeta` / `Article` 与 loader 函数签名在 Task 2–3 固定，后续 Task 只消费这些名字。

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-30-invest-lab-v1.md`.

**Two execution options:**

1. **Subagent-Driven（推荐）** — 每个 Task 派一个新子代理，Task 间复查，迭代快  
2. **Inline Execution** — 本会话按 executing-plans 批量执行，设检查点  

选哪种？
