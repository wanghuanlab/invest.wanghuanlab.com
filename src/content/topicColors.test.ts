import { describe, expect, it } from 'vitest'
import { topicColor } from './topicColors'

describe('topicColor', () => {
  it('returns exact hex for known topic slugs', () => {
    expect(topicColor('rates')).toBe('#1F6F5B')
    expect(topicColor('stocks')).toBe('#0B3A5C')
    expect(topicColor('bonds')).toBe('#8B6914')
    expect(topicColor('gold')).toBe('#C4A035')
    expect(topicColor('demographics')).toBe('#6B4C9A')
    expect(topicColor('housing')).toBe('#2F6F8F')
  })

  it('falls back to rates color for unknown slug', () => {
    expect(topicColor('unknown')).toBe('#1F6F5B')
  })
})
