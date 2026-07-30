# Invest Lab

Invest Lab 是一个个人宏观与跨资产研究笔记站。内容按利率、国债、股票、黄金、人口和房产六个主题组织，使用仓库内的 Markdown 文件维护。

## 本地运行

要求：Node.js 20 或更高版本。

```bash
npm install
npm run dev
```

Vite 会在终端中显示本地访问地址。

## 构建与测试

```bash
npm test
npm run build
```

构建结果输出到 `dist/`。如需本地预览构建结果，可运行 `npm run preview`。

## 新增研究笔记

1. 在对应主题目录创建 `content/<topic>/<article-slug>.md`。`<topic>` 可取 `rates`、`bonds`、`stocks`、`gold`、`demographics` 或 `housing`。
2. 在文件顶部填写 frontmatter：

```yaml
---
title: 笔记标题
date: 2026-07-30
summary: 一句话概括这篇笔记。
tags:
  - macro
  - example
---
```

3. 在 frontmatter 后使用 Markdown 编写正文，保存后刷新开发页面或重新构建。

`title`、`date` 和 `summary` 为必填字段；`date` 使用 `YYYY-MM-DD` 格式。`tags` 为可选字符串数组。文件所在目录决定所属主题，文件名决定文章 URL。

如需新增主题，请同时更新 `content/topics.json` 并创建对应的 `content/<topic>/` 目录。

## 设计规格

产品范围、内容模型、路由与视觉约定见 [`docs/superpowers/specs/2026-07-30-invest-lab-design.md`](docs/superpowers/specs/2026-07-30-invest-lab-design.md)。
