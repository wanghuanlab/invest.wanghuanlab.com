import { describe, expect, it } from 'vitest'
import { getScrollPosition } from './scrollBehavior'

describe('getScrollPosition', () => {
  it('scrolls to a route hash when present', () => {
    expect(getScrollPosition({ hash: '#topics' })).toEqual({ el: '#topics' })
  })

  it('scrolls to the top without a hash', () => {
    expect(getScrollPosition({ hash: '' })).toEqual({ top: 0 })
  })
})
