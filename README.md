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

## 部署

生产站点是 `https://invest.wanghuanlab.com/`。1Panel 目前将该域名反向代理到 Node 运行时容器 `node24-runtime` 的 Vite 服务（端口 `5173`）；`/opt/1panel/www/sites/invest.wanghuanlab.com/index` 是 1Panel 创建的站点目录，但不是当前页面的实际来源。应用的服务器工作目录为 `/opt/apps/invest.wanghuanlab.com`，并从 `codeup/main` 更新。

发布时使用仓库脚本：

```bash
npm run deploy
```

脚本会要求工作区干净，依次运行测试与生产构建、推送 `codeup/main`、通过 SSH 让服务器工作目录快进更新、重启 Node 运行时并检查 HTTPS 首页。它会在远端存在未提交改动、分支不为 `main` 或容器未运行时停止，不会覆盖服务器上的未知改动。

常用选项：

```bash
# 只运行本地测试和构建，检查发布计划
npm run deploy -- --dry-run

# 无交互发布（仅限受控环境）
DEPLOY_CONFIRM=yes npm run deploy
```

SSH 主机、端口、远端路径、容器名和健康检查地址可以通过 `DEPLOY_SSH_HOST`、`DEPLOY_SSH_PORT`、`DEPLOY_REMOTE_APP_DIR`、`DEPLOY_CONTAINER_NAME`、`DEPLOY_HEALTH_URL` 覆盖；完整参数见 `npm run deploy -- --help`。脚本不会保存 SSH 密码或私钥。

站点使用 SPA history 路由；若未来改为静态托管，需在 1Panel/Nginx 中将未命中静态文件的请求回退到 `index.html`，并相应替换本部署脚本。

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

`title`、`date` 和 `summary` 为必填字段；`date` 使用 `YYYY-MM-DD` 格式。`tags` 为可选字符串数组。

> **注**：首页默认推荐阅读固定为《适合普通投资者在股市稳定获利的策略分析》。新增笔记时请勿设置 `featured: true`，除非用户显式要求更换首页推荐文章。

如需新增主题，请同时更新 `content/topics.json` 并创建对应的 `content/<topic>/` 目录。

## 设计规格

产品范围、内容模型、路由与视觉约定见 [`docs/superpowers/specs/2026-07-30-invest-lab-design.md`](docs/superpowers/specs/2026-07-30-invest-lab-design.md)。
