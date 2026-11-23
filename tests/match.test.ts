import { describe, expect, it } from 'vitest'
import { matchAnswer, norm, variants, distance, suggestAnswers, stem, resolveAnswer } from '../shared/match'
import { QUESTION_BY_ID, ALL_KEYS, QUESTIONS } from '../shared/data/index'

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

describe('keyword suggestions (did you mean)', () => {
  const s = (id: string, t: string, exclude?: Set<string>) => suggestAnswers(q(id), t, { exclude }).map((a) => a.name)

  it('stems common endings', () => {
    expect(stem('walking')).toBe('walk')
    expect(stem('lepers')).toBe('leper')
  })

  it('points a single keyword at its answer', () => {
    expect(s('jesus-miracles', 'lazarus')).toEqual(['Raising Lazarus'])
    expect(s('jesus-miracles', 'wine')).toEqual(['Water into wine'])
    expect(s('jesus-miracles', 'pigs')).toEqual(['Casting out Legion'])
    expect(s('genesis-events', 'tower')).toEqual(['Tower of Babel'])
  })

  it('reads loose phrasing and ignores filler words', () => {
    expect(s('jesus-miracles', 'jesus walks on water')).toEqual(['Walking on water'])
    expect(s('ot-miracles', 'jericho walls fell')).toEqual(['Walls of Jericho'])
    expect(s('acts-events', 'pentecost holy spirit')).toEqual(['Pentecost'])
  })

  it('offers a short list when a keyword fits a few answers', () => {
    const r = s('jesus-miracles', 'feeding')
    expect(r).toContain('Feeding the five thousand')
    expect(r).toContain('Feeding the four thousand')
  })

  it('stays quiet for generic or unknown words', () => {
    expect(s('jesus-miracles', 'healing')).toEqual([])
    expect(s('jesus-miracles', 'the')).toEqual([])
    expect(s('jesus-miracles', 'zzzz')).toEqual([])
  })

  it('skips answers already used', () => {
    const lazarus = q('jesus-miracles').answers.find((a) => a.name === 'Raising Lazarus')!
    expect(s('jesus-miracles', 'lazarus', new Set([lazarus.id]))).toEqual([])
  })

  it('every suggestion is accepted when submitted', () => {
    for (const [id, t] of [['jesus-miracles', 'storm'], ['jesus-miracles', 'feeding'], ['ot-miracles', 'sea']] as const)
      for (const name of s(id, t)) expect(m(id, name)).toBe(name)
  })
})

describe('lenient answers (same meaning → accepted)', () => {
  const r = (id: string, t: string) => {
    const x = resolveAnswer(q(id), t, ALL_KEYS)
    return x.hit ? x.hit.name : x.suggestions.length ? `ask: ${x.suggestions.map((a) => a.name).join(' / ')}` : null
  }

  it('accepts loose wording that means one answer', () => {
    expect(r('jesus-miracles', 'lazarus')).toBe('Raising Lazarus')
    expect(r('jesus-miracles', 'jesus walks on water')).toBe('Walking on water')
    expect(r('jesus-miracles', 'turned water to wine')).toBe('Water into wine')
    expect(r('jesus-miracles', 'fed 5000 people')).toBe('Feeding the five thousand')
    expect(r('jesus-miracles', 'stilled the storm')).toBe('Calming the storm')
    expect(r('jesus-miracles', 'cured a blind man')).toBe('Healing the blind')
    expect(r('jesus-miracles', 'drove demons into pigs')).toBe('Casting out Legion')
    expect(r('jesus-miracles', 'raised jairus daughter')).toBe("Raising Jairus's daughter")
    expect(r('ot-miracles', 'red sea split')).toBe('Parting of the Red Sea')
    expect(r('ot-miracles', 'jericho walls fell')).toBe('Walls of Jericho')
    expect(r('acts-events', 'stephen was stoned')).toBe('Stoning of Stephen')
    expect(r('genesis-events', 'babel')).toBe('Tower of Babel')
  })

  it('asks when the words fit more than one answer', () => {
    expect(r('jesus-miracles', 'feeding')).toMatch(/^ask: .*five thousand.*four thousand|^ask: .*four thousand.*five thousand/)
  })

  it('never accepts a different person or a lone owner name', () => {
    expect(r('jesus-miracles', 'peter')).toMatch(/^ask:/)
    expect(r('jesus-miracles', 'mary')).toBe(null)
  })

  it('rarely accepts another question’s answer by accident', () => {
    let tried = 0
    let wrong = 0
    const pool = QUESTIONS.flatMap((qq) => qq.answers.map((a) => ({ qq, a })))
    let seed = 11
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647
    for (const qq of QUESTIONS.slice(0, 120)) {
      for (let i = 0; i < 20; i++) {
        const { qq: other, a } = pool[Math.floor(rnd() * pool.length)]
        if (other === qq || matchAnswer(qq, a.name, ALL_KEYS)) continue
        tried++
        if (resolveAnswer(qq, a.name, ALL_KEYS).hit) wrong++
      }
    }
    expect(wrong / tried).toBeLessThan(0.005)
  })
})
