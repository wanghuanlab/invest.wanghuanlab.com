import { getArticle, getTopic } from '@/content/loadContent'

const NOT_FOUND_TITLE = '页面未找到 | Invest Lab'

export function getPageTitle(
  name: unknown,
  params: Readonly<Record<string, unknown>>,
): string {
  if (name === 'home') return 'Invest Lab'
  if (name === 'about') return '关于 | Invest Lab'
  if (name === 'topic') {
    const topic = getTopic(String(params.slug ?? ''))
    return topic ? `${topic.name} | Invest Lab` : NOT_FOUND_TITLE
  }
  if (name === 'article') {
    const article = getArticle(
      String(params.slug ?? ''),
      String(params.article ?? ''),
    )
    return article ? `${article.title} | Invest Lab` : NOT_FOUND_TITLE
  }
  return NOT_FOUND_TITLE
}
