import { describe, expect, it } from 'vitest'
import { QUESTIONS, QUESTION_BY_ID, ALL_KEYS, CATEGORIES } from '../shared/data/index'
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
  it('has 400+ questions and unique ids', () => {
    expect(QUESTIONS.length).toBeGreaterThanOrEqual(400)
    expect(new Set(QUESTIONS.map((q) => q.id)).size).toBe(QUESTIONS.length)
  })
})

describe('every question', () => {
  it.each(QUESTIONS.map((q) => [q.id, q] as const))('%s is well-formed', (_id, q) => {
    // open-ended: many answers spread over the rarity tiers, from obvious to obscure
    expect(q.answers.length, 'at least 8 answers').toBeGreaterThanOrEqual(8)
    const levels = new Set(q.answers.map((a) => a.level))
    expect(levels.size, 'answers span at least 4 tiers').toBeGreaterThanOrEqual(4)
    expect(Math.max(...levels), 'has a well-known answer').toBeGreaterThanOrEqual(4)
    // general questions only: never tied to a particular chapter or passage
    if (!/^famous-(verses|chapters)$/.test(q.id)) expect(q.text, 'no chapter/verse numbers').not.toMatch(/\d/)
    expect(q.text.length).toBeGreaterThan(10)
    expect(CATEGORIES).toContain(q.category)
    expect([1, 2, 3]).toContain(q.difficulty)
    for (const a of q.answers) {
      expect(a.ref, `${q.id}/${a.name}`).toMatch(REF)
      expect(a.level).toBeGreaterThanOrEqual(0)
      expect(a.level).toBeLessThanOrEqual(5)
    }
    noCollisions(q)
  })
})

describe('the pool is broad and approachable', () => {
  it('covers people, places, events, animals, roles, food and drink', () => {
    for (const c of ['People', 'Places', 'Events', 'Animals', 'Roles', 'Food & Drink', 'Objects', 'Jesus', 'Faith', 'Women'])
      expect(QUESTIONS.filter((q) => q.category === c).length, c).toBeGreaterThanOrEqual(8)
  })
  it('keeps references at chapter level', () => {
    for (const q of QUESTIONS) for (const a of q.answers) expect(a.ref, `${q.id}/${a.name}`).not.toContain(':')
  })
  it('is mostly easy or medium', () => {
    const hard = QUESTIONS.filter((q) => q.difficulty === 3).length
    expect(hard / QUESTIONS.length).toBeLessThan(0.25)
    expect(QUESTIONS.filter((q) => q.difficulty === 1).length / QUESTIONS.length).toBeGreaterThan(0.3)
  })
  it('accepts answers that contain colons and numbers', () => {
    const q = QUESTION_BY_ID.get('famous-verses')!
    expect(matchAnswer(q, 'John 3:16', ALL_KEYS)?.name).toBe('John 3:16')
    expect(matchAnswer(QUESTION_BY_ID.get('numbers')!, 'forty', ALL_KEYS)?.name).toBe('40')
  })
})
