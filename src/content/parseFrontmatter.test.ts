import { describe, expect, it } from 'vitest'
import { parseFrontmatter } from './parseFrontmatter'

describe('parseFrontmatter', () => {
  it('parses yaml-like frontmatter and body', () => {
    const raw = `---
title: Hello
date: 2026-07-30
summary: A note
featured: true
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
    expect(result.data.featured).toBe(true)
    expect(result.data.tags).toEqual(['macro'])
    expect(result.content.trim().startsWith('# Body')).toBe(true)
  })

  it('returns empty data when frontmatter missing', () => {
    const result = parseFrontmatter('# Only body\n')
    expect(result.data).toEqual({})
    expect(result.content).toContain('# Only body')
  })
})
