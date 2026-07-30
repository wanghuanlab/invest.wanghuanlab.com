import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const readProjectFile = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8')

describe('static informational pages', () => {
  it('covers the About brief', () => {
    const source = readProjectFile('src/views/AboutView.vue')

    expect(source).toContain('个人宏观与跨资产研究笔记')
    expect(source).toContain('利率')
    expect(source).toContain('国债')
    expect(source).toContain('股票')
    expect(source).toContain('黄金')
    expect(source).toContain('人口')
    expect(source).toContain('房产')
    expect(source).toContain('采集、分析与统计')
    expect(source).toContain('不构成投资建议')
  })

  it('offers recovery links from the 404 page', () => {
    const source = readProjectFile('src/views/NotFoundView.vue')

    expect(source).toContain('返回首页')
    expect(source).toContain('浏览主题')
    expect(source).toContain('to="/#topics"')
  })

  it('keeps the API directory reserved with the exact V1 notice', () => {
    expect(readProjectFile('src/api/README.md')).toBe(
      '# API client (reserved)\n\n' +
        'Future home for HTTP clients that talk to acquisition / analytics / stats services.\n\n' +
        'V1 ships with static `content/` only. Do not add mock chart APIs here yet.\n',
    )
  })

  it('documents setup, verification, and adding notes', () => {
    const source = readProjectFile('README.md')

    for (const command of ['npm install', 'npm run dev', 'npm run build', 'npm test']) {
      expect(source).toContain(command)
    }
    expect(source).toContain('content/<topic>/<article-slug>.md')
    expect(source).toContain('title')
    expect(source).toContain('date')
    expect(source).toContain('summary')
    expect(source).toContain('tags')
    expect(source).toContain('docs/superpowers/specs/2026-07-30-invest-lab-design.md')
  })
})
