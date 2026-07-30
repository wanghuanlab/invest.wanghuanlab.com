import { describe, expect, it } from 'vitest'
import { getPageTitle } from './pageTitle'

describe('getPageTitle', () => {
  it.each([
    ['home', {}, 'Invest Lab'],
    ['about', {}, '关于 | Invest Lab'],
    ['not-found', {}, '页面未找到 | Invest Lab'],
    ['topic', { slug: 'gold' }, '黄金 | Invest Lab'],
    [
      'article',
      { slug: 'gold', article: 'real-yields-and-gold' },
      '实际利率视角下的黄金 | Invest Lab',
    ],
    ['topic', { slug: 'missing' }, '页面未找到 | Invest Lab'],
    ['article', { slug: 'gold', article: 'missing' }, '页面未找到 | Invest Lab'],
  ])('returns the title for %s routes', (name, params, expected) => {
    expect(getPageTitle(name, params)).toBe(expected)
  })
})
