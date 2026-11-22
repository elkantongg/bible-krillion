import { describe, expect, it } from 'vitest'
import { matchAnswer, norm, variants, distance } from '../shared/match'
import { QUESTION_BY_ID, ALL_KEYS } from '../shared/data/index'

const q = (id: string) => QUESTION_BY_ID.get(id)!
const m = (id: string, s: string) => matchAnswer(q(id), s, ALL_KEYS)?.name ?? null

describe('normalisation', () => {
  it('strips case, accents, punctuation and spacing', () => {
    expect(norm('  Tubal-Cain! ')).toBe('tubal cain')
    expect(norm('Éve')).toBe('eve')
    expect(variants('King David')).toContain('david')
    expect(variants('the Book of Ruth')).toContain('ruth')
    expect(variants('lions')).toContain('lion')
  })
  it('computes edit distance with transpositions', () => {
    expect(distance('hezekaih', 'hezekiah', 2)).toBe(1)
    expect(distance('abc', 'xyz', 1)).toBeGreaterThan(1)
  })
})

describe('answer validation', () => {
  it('accepts common answers', () => {
    expect(m('kings', 'David')).toBe('David')
    expect(m('animals', 'lion')).toBe('Lion')
  })
  it('accepts obscure answers', () => {
    expect(m('kings', 'Zimri')).toBe('Zimri')
    expect(m('genealogy', 'Shealtiel')).toBe('Shealtiel')
  })
  it('accepts alternate spellings and translations', () => {
    expect(m('kings', 'Jeconiah')).toBe('Jehoiachin')
    expect(m('kings', 'Ahasuerus')).toBe('Xerxes')
    expect(m('prophets', 'Elias')).toBe('Elijah')
    expect(m('books', '1 Corinthians')).toBe('Corinthians')
    expect(m('books', 'First Samuel')).toBe('Samuel')
  })
  it('forgives small typos', () => {
    expect(m('kings', 'Hezekaih')).toBe('Hezekiah')
    expect(m('food', 'Bred')).toBe('Bread')
    expect(m('genealogy', 'Zerubabel')).toBe('Zerubbabel')
  })
  it('handles titles and articles', () => {
    expect(m('kings', 'King Solomon')).toBe('Solomon')
    expect(m('parables', 'The parable of the prodigal son')).toBe('Prodigal Son')
    expect(m('mountains', 'Mount Sinai')).toBe('Sinai')
  })
  it('rejects wrong, empty and off-question answers', () => {
    expect(m('kings', 'Bob')).toBeNull()
    expect(m('kings', '')).toBeNull()
    expect(m('kings', '   ')).toBeNull()
    expect(m('women-ot', 'Mary Magdalene')).toBeNull()
    // a real biblical name that belongs to another question is never fuzzed in
    expect(m('kings', 'Jonah')).toBeNull()
    expect(m('kings', 'Moses')).toBeNull()
  })
  it('does not invent answers from near-misses between two candidates', () => {
    // equidistant to several aliases → ambiguous → rejected rather than guessed
    expect(m('kings', 'Joxx')).toBeNull()
  })
})
