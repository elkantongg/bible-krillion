import { describe, expect, it } from 'vitest'
import { QUESTIONS } from '../shared/data/index'
import { key } from '../shared/match'

describe('question dataset', () => {
  it('has a healthy pool', () => {
    expect(QUESTIONS.length).toBeGreaterThanOrEqual(25)
    expect(QUESTIONS.reduce((s, q) => s + q.answers.length, 0)).toBeGreaterThan(1000)
  })
  it.each(QUESTIONS.map((q) => [q.id, q] as const))('%s is well-formed', (_id, q) => {
    expect(q.answers.length).toBeGreaterThanOrEqual(14)
    const seen = new Map<string, string>()
    for (const a of q.answers) {
      expect(a.ref).toMatch(/^\d?[A-Za-z]+\d+(:\d+)?$/)
      expect(a.level).toBeGreaterThanOrEqual(0)
      expect(a.level).toBeLessThanOrEqual(5)
      for (const al of a.aliases) {
        const k = key(al)
        expect(seen.get(k) ?? a.id, `alias "${al}" collides in ${q.id}`).toBe(a.id)
        seen.set(k, a.id)
      }
    }
    // rarity needs a spread: some obvious answers and some deep cuts
    expect(q.answers.some((a) => a.level >= 4)).toBe(true)
    expect(q.answers.some((a) => a.level <= 1)).toBe(true)
  })
  it('has unique question ids', () => {
    expect(new Set(QUESTIONS.map((q) => q.id)).size).toBe(QUESTIONS.length)
  })
})
