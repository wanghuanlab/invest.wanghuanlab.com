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
  const featured = data.featured === true
  const cover = typeof data.cover === 'string' ? data.cover : undefined
  return { topicSlug, slug, title, date, summary, tags, featured, cover }
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

export function getFeaturedArticles(limit = 6): ArticleMeta[] {
  return [...articles]
    .filter((article) => article.featured)
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
