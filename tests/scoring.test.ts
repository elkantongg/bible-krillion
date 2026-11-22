import { describe, expect, it } from 'vitest'
import { blendedShare, score, depthFor, MAX_DEPTH, TIERS, zoneFor } from '../shared/scoring'
import { dateForDive, diveForDate, maxDiveAt, selectPrompts, selectMixed } from '../shared/dives'
import { CURATED, GENERATED } from '../shared/data/index'

describe('rarity scoring', () => {
  it('uses curated priors on cold start', () => {
    expect(score(0, 0, 5).points).toBe(10)
    expect(score(0, 0, 3).points).toBe(35)
    expect(score(0, 0, 1).points).toBe(85)
    expect(score(0, 0, 0).points).toBe(100)
  })
  it('rewards rarer answers monotonically', () => {
    const pts = [5, 4, 3, 2, 1, 0].map((l) => score(0, 0, l).points)
    expect(pts).toEqual([...pts].sort((a, b) => a - b))
  })
  it('shifts toward real submission frequencies as data grows', () => {
    // an answer curated as obscure that half of 1000 players give becomes common
    expect(score(500, 1000, 0).points).toBe(10)
    // an answer curated as obvious that nobody gives becomes rare
    expect(score(0, 5000, 5).points).toBeGreaterThanOrEqual(85)
    expect(blendedShare(0, 0, 3)).toBeCloseTo(0.03)
  })
  it('keeps tiers ordered and bounded', () => {
    for (let i = 1; i < TIERS.length; i++) expect(TIERS[i].points).toBeGreaterThan(TIERS[i - 1].points)
    expect(TIERS.at(-1)!.points).toBe(100)
  })
  it('maps points to depth (10 m per point, max 7000 m)', () => {
    expect(depthFor(0)).toBe(0)
    expect(depthFor(405)).toBe(4050)
    expect(depthFor(700)).toBe(MAX_DEPTH)
    expect(zoneFor(4050).name).toBe('The Abyss')
  })
})

describe('daily dives', () => {
  it('numbers days from launch', () => {
    expect(diveForDate('2026-11-23', '2026-11-23')).toBe(1)
    expect(diveForDate('2026-11-23', '2026-12-01')).toBe(9)
    expect(dateForDive('2026-11-23', 9)).toBe('2026-12-01')
  })
  it('lets the earliest timezone play the next day', () => {
    const lateUtc = Date.UTC(2026, 10, 23, 12) // noon UTC on launch day = midnight+ in UTC+12/14
    expect(maxDiveAt('2026-11-23', lateUtc)).toBe(2)
  })
  it('selects 7 distinct prompts deterministically and cycles the pool', () => {
    const pool = Array.from({ length: 30 }, (_, i) => `q${i}`)
    const a = selectPrompts(5, pool)
    expect(a).toHaveLength(7)
    expect(new Set(a).size).toBe(7)
    expect(selectPrompts(5, pool)).toEqual(a)
    const firstCycle = new Set([1, 2, 3, 4].flatMap((n) => selectPrompts(n, pool)))
    expect(firstCycle.size).toBe(28) // no repeats until the pool is used up
  })
  it('mixes 2 curated + 5 generated prompts from different groups', () => {
    const cur = new Set(CURATED.map((q) => q.id))
    const groupOf = new Map(GENERATED.map((q) => [q.id, q.group]))
    for (let n = 1; n <= 400; n++) {
      const ids = selectMixed(n, [...cur], GENERATED)
      expect(ids).toHaveLength(7)
      expect(new Set(ids).size).toBe(7)
      expect(ids.filter((id) => cur.has(id))).toHaveLength(2)
      const groups = ids.filter((id) => !cur.has(id)).map((id) => groupOf.get(id))
      expect(new Set(groups).size).toBeGreaterThanOrEqual(4)
    }
    // across one full cycle almost nothing repeats (a few leftovers roll into the next cycle)
    const days = Math.floor(GENERATED.length / 5)
    const all = Array.from({ length: days }, (_, i) => selectMixed(i + 1, [...cur], GENERATED).filter((id) => !cur.has(id))).flat()
    expect(new Set(all).size / all.length).toBeGreaterThan(0.95)
    expect(selectMixed(9, [...cur], GENERATED)).toEqual(selectMixed(9, [...cur], GENERATED))
  })
})
