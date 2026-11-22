import { describe, expect, it } from 'vitest'
import { CURATED, GENERATED, QUESTIONS, QUESTION_BY_ID, ALL_KEYS } from '../shared/data/index'
import { key, matchAnswer } from '../shared/match'

const REF = /^\d?[A-Za-z]+\d+(:\d+)?$/

function noCollisions(q: (typeof QUESTIONS)[number]) {
  const seen = new Map<string, string>()
  for (const a of q.answers) {
    for (const al of a.aliases) {
      const k = key(al)
      expect(seen.get(k) ?? a.id, `alias "${al}" collides in ${q.id}`).toBe(a.id)
      seen.set(k, a.id)
    }
  }
}

describe('question pool', () => {
  it('has 500+ questions and unique ids', () => {
    expect(QUESTIONS.length).toBeGreaterThanOrEqual(500)
    expect(new Set(QUESTIONS.map((q) => q.id)).size).toBe(QUESTIONS.length)
  })
})

describe('curated questions', () => {
  it.each(CURATED.map((q) => [q.id, q] as const))('%s is well-formed', (_id, q) => {
    expect(q.answers.length).toBeGreaterThanOrEqual(14)
    for (const a of q.answers) {
      expect(a.ref).toMatch(REF)
      expect(a.level).toBeGreaterThanOrEqual(0)
      expect(a.level).toBeLessThanOrEqual(5)
    }
    noCollisions(q)
    // rarity needs a spread: some obvious answers and some deep cuts
    expect(q.answers.some((a) => a.level >= 4)).toBe(true)
    expect(q.answers.some((a) => a.level <= 1)).toBe(true)
  })
})

describe('generated questions', () => {
  it('every generated question is well-formed', () => {
    expect(GENERATED.length).toBeGreaterThanOrEqual(450)
    for (const q of GENERATED) {
      expect(q.answers.length, q.id).toBeGreaterThanOrEqual(20)
      expect(q.group, q.id).toBeTruthy()
      for (const a of q.answers) {
        expect(a.ref, `${q.id}/${a.name}`).toMatch(REF)
        expect(a.level).toBeGreaterThanOrEqual(0)
        expect(a.level).toBeLessThanOrEqual(5)
      }
      noCollisions(q)
    }
  })
  it('keeps answers literal to the scope', () => {
    const gen = QUESTION_BY_ID.get('g-people-Gen')!
    expect(gen).toBeTruthy()
    expect(matchAnswer(gen, 'Abraham', ALL_KEYS)?.name).toBe('Abraham')
    expect(matchAnswer(gen, 'Methuselah', ALL_KEYS)?.name).toBe('Methuselah')
    expect(matchAnswer(gen, 'Jesus', ALL_KEYS)).toBeNull() // not literally named in Genesis
    expect(matchAnswer(gen, 'Paul', ALL_KEYS)).toBeNull()
    const women = QUESTION_BY_ID.get('g-women-Gen')!
    expect(matchAnswer(women, 'Sarah', ALL_KEYS)?.name).toBe('Sarah')
    expect(matchAnswer(women, 'Noah', ALL_KEYS)).toBeNull() // Noah the man is in Genesis; Noah the woman is not
  })
  it('uses curated familiarity as a floor', () => {
    const q = QUESTION_BY_ID.get('g-people-Gen')!
    expect(q.answers.find((a) => a.name === 'Eve')!.level).toBeGreaterThanOrEqual(5)
  })
})
