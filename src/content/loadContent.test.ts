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
