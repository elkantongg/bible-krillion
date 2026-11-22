import { beforeEach, describe, expect, it } from 'vitest'
import { openDb } from '../server/db'
import { SoloService, LEAD_MS, PROMPT_MS, GRACE_MS, IP_DAILY_COUNT_LIMIT } from '../server/solo'
import { QUESTION_BY_ID } from '../shared/data/index'

let t = Date.UTC(2026, 10, 23, 10)
const clock = () => t
let svc: SoloService
beforeEach(() => {
  t = Date.UTC(2026, 10, 23, 10)
  svc = new SoloService(openDb(':memory:'), { launch: '2026-11-23', now: clock })
})

/** a valid answer for prompt idx of dive 1 at a given commonness */
const answerFor = (idx: number, level?: number) => {
  const q = svc.prompts(1)[idx]
  const a = level == null ? q.answers[0] : q.answers.find((x) => x.level === level) ?? q.answers[0]
  return a.name
}
const start = (p: string, idx: number) => {
  svc.open(p, 1, idx)
  t += LEAD_MS + 1000
}

describe('solo dive', () => {
  it('scores a correct obscure answer higher than a common one', () => {
    start('a', 0)
    const common = svc.answer('a', 1, 0, answerFor(0, 5), 'ip1')
    start('b', 0)
    const rare = svc.answer('b', 1, 0, answerFor(0, 0), 'ip2')
    expect(common.status).toBe('locked')
    expect(rare.status).toBe('locked')
    if (common.status === 'locked' && rare.status === 'locked') expect(rare.result.points).toBeGreaterThan(common.result.points)
  })

  it('returns a miss for wrong or empty answers without locking', () => {
    start('a', 0)
    expect(svc.answer('a', 1, 0, 'Definitely Not Biblical', 'ip').status).toBe('miss')
    expect(svc.answer('a', 1, 0, '', 'ip').status).toBe('miss')
    const ok = svc.answer('a', 1, 0, answerFor(0), 'ip')
    expect(ok.status).toBe('locked')
  })

  it('is idempotent: duplicate submissions return the locked result and do not recount', () => {
    start('a', 0)
    const first = svc.answer('a', 1, 0, answerFor(0, 0), 'ip')
    const second = svc.answer('a', 1, 0, answerFor(0, 5), 'ip')
    expect(second).toEqual(first)
  })

  it('locks a timed-out prompt at zero, server-side', () => {
    svc.open('a', 1, 0)
    t += LEAD_MS + PROMPT_MS + GRACE_MS + 1
    const r = svc.answer('a', 1, 0, answerFor(0), 'ip')
    expect(r.status).toBe('locked')
    if (r.status === 'locked') {
      expect(r.result.points).toBe(0)
      expect(r.result.tier).toBe('none')
    }
  })

  it('refuses to expire a prompt early', () => {
    svc.open('a', 1, 0)
    expect(() => svc.expire('a', 1, 0)).toThrow(/still running/)
  })

  it('keeps the original clock when a prompt is reopened (no refresh exploit)', () => {
    const o1 = svc.open('a', 1, 0)
    t += 10_000
    const o2 = svc.open('a', 1, 0)
    expect(o2.deadline).toBe(o1.deadline)
  })

  it('enforces prompt order', () => {
    expect(() => svc.open('a', 1, 2)).toThrow(/order/)
  })

  it('completes all seven prompts and reports totals', () => {
    for (let i = 0; i < 7; i++) {
      start('a', i)
      svc.answer('a', 1, i, answerFor(i, 5), 'ip')
    }
    const s = svc.state('a', 1)
    expect(s.done).toBe(true)
    expect(s.results).toHaveLength(7)
    expect(s.total).toBe(s.results.reduce((x, r) => x + r.points, 0))
    expect(s.results.every((r) => r.common && r.pearl !== undefined)).toBe(true)
  })

  it('lets a player restart where they left off', () => {
    start('a', 0)
    svc.answer('a', 1, 0, answerFor(0), 'ip')
    const s = svc.state('a', 1)
    expect(s.current).toBe(1)
    expect(s.open).toBeNull()
    expect(s.done).toBe(false)
  })

  it('does not let one IP flood the rarity statistics', () => {
    const qid = svc.prompts(1)[0].id
    for (let i = 0; i < IP_DAILY_COUNT_LIMIT + 5; i++) {
      start('p' + i, 0)
      svc.answer('p' + i, 1, 0, answerFor(0, 0), 'same-ip')
    }
    const db = (svc as unknown as { db: { prepare: (s: string) => { get: (...a: unknown[]) => unknown } } }).db
    const row = db.prepare('SELECT total FROM question_totals WHERE question_id = ?').get(qid) as { total: number }
    expect(row.total).toBe(IP_DAILY_COUNT_LIMIT)
  })

  it('rejects dives from the future', () => {
    expect(() => svc.state('a', 50)).toThrow()
  })

  it('materialises prompts so a dive never changes', () => {
    const a = svc.prompts(3).map((q) => q.id)
    expect(svc.prompts(3).map((q) => q.id)).toEqual(a)
    expect(a.every((id) => QUESTION_BY_ID.has(id))).toBe(true)
  })
})
