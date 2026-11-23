import { describe, expect, it } from 'vitest'
import { VERSES, verseOfDay } from '../src/lib/verses'

describe('verse of the day', () => {
  it('has no duplicate verses', () => {
    const texts = VERSES.map(([t]) => t)
    expect(new Set(texts).size).toBe(texts.length)
  })
  it('shows a different verse every day for a full cycle', () => {
    const seen = new Set<string>()
    for (let n = 1; n <= VERSES.length; n++) seen.add(verseOfDay(n)[0])
    expect(seen.size).toBe(VERSES.length)
  })
  it('never repeats on consecutive days', () => {
    for (let n = -5; n < VERSES.length * 2; n++) expect(verseOfDay(n)[0]).not.toBe(verseOfDay(n + 1)[0])
  })
})
