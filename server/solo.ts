import type { DB } from './db'
import { tx } from './db'
import { QUESTION_BY_ID, QUESTIONS, ALL_KEYS } from '../shared/data/index'
import { matchAnswer } from '../shared/match'
import { score, blendedShare, MISS_TIER, PROMPTS_PER_DIVE, SECONDS_PER_PROMPT } from '../shared/scoring'
import { dateForDive, maxDiveAt, selectPrompts } from '../shared/dives'
import type { DiveState, OpenPrompt, PromptResult, Question, TierKey } from '../shared/types'

export const LEAD_MS = 3000 // "the clock starts in 3…"
export const PROMPT_MS = SECONDS_PER_PROMPT * 1000
export const GRACE_MS = 1500 // network latency allowance
export const MAX_ATTEMPTS = 40
export const IP_DAILY_COUNT_LIMIT = 3

export class GameError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

interface Row {
  idx: number
  question_id: string
  opened_at: number
  locked_at: number | null
  raw: string | null
  answer_id: string | null
  points: number | null
  tier: string | null
  share: number | null
  attempts: number
}

export interface SoloOptions {
  launch: string
  now?: () => number
}

export class SoloService {
  private now: () => number
  constructor(private db: DB, private opts: SoloOptions) {
    this.now = opts.now ?? Date.now
  }

  maxDive() {
    return maxDiveAt(this.opts.launch, this.now())
  }

  checkDive(n: number) {
    if (!Number.isInteger(n) || n < 1 || n > this.maxDive()) throw new GameError(404, 'No such dive yet')
  }

  /** the 7 question ids for dive n (materialised on first use so they never change) */
  prompts(n: number): Question[] {
    let rows = this.db.prepare('SELECT question_id FROM dive_prompts WHERE dive_no = ? ORDER BY idx').all(n) as { question_id: string }[]
    if (rows.length < PROMPTS_PER_DIVE) {
      const ids = selectPrompts(n, QUESTIONS.map((q) => q.id))
      const ins = this.db.prepare('INSERT OR IGNORE INTO dive_prompts (dive_no, idx, question_id) VALUES (?, ?, ?)')
      ids.forEach((id, i) => ins.run(n, i, id))
      rows = this.db.prepare('SELECT question_id FROM dive_prompts WHERE dive_no = ? ORDER BY idx').all(n) as { question_id: string }[]
    }
    return rows.map((r) => {
      const q = QUESTION_BY_ID.get(r.question_id)
      if (!q) throw new GameError(500, `Question ${r.question_id} missing from dataset`)
      return q
    })
  }

  private rows(player: string, n: number): Row[] {
    return this.db
      .prepare('SELECT idx, question_id, opened_at, locked_at, raw, answer_id, points, tier, share, attempts FROM dive_answers WHERE player_id = ? AND dive_no = ? ORDER BY idx')
      .all(player, n) as unknown as Row[]
  }

  private stats(qid: string) {
    const total = (this.db.prepare('SELECT total FROM question_totals WHERE question_id = ?').get(qid) as { total: number } | undefined)?.total ?? 0
    const counts = new Map<string, number>()
    for (const r of this.db.prepare('SELECT answer_id, count FROM answer_counts WHERE question_id = ?').all(qid) as { answer_id: string; count: number }[])
      counts.set(r.answer_id, r.count)
    return { total, counts }
  }

  private reveal(q: Question, salt: number, mine?: string | null) {
    const { total, counts } = this.stats(q.id)
    let common = q.answers[0]
    let best = -1
    for (const a of q.answers) {
      const s = blendedShare(counts.get(a.id) ?? 0, total, a.level)
      if (s > best) {
        best = s
        common = a
      }
    }
    const deep = q.answers.filter((a) => a.id !== mine && a.level === 0 && (counts.get(a.id) ?? 0) <= Math.max(1, total * 0.002))
    const pool = deep.length ? deep : q.answers.filter((a) => a.id !== mine && a.level <= 1)
    const pearl = pool.length ? pool[salt % pool.length] : null
    return { common: common.name, pearl: pearl?.name ?? null }
  }

  private toResult(r: Row, q: Question, salt: number): PromptResult {
    const ans = r.answer_id ? q.answers.find((a) => a.id === r.answer_id) ?? null : null
    const rv = this.reveal(q, salt + r.idx, r.answer_id)
    return {
      idx: r.idx,
      questionId: q.id,
      prompt: q.text,
      raw: r.raw,
      answer: ans?.name ?? null,
      ref: ans?.ref ?? null,
      points: r.points ?? 0,
      tier: (r.tier as TierKey) ?? 'none',
      sharePct: r.share == null ? null : Math.round(r.share * 1000) / 10,
      common: rv.common,
      pearl: rv.pearl,
    }
  }

  private salt(player: string) {
    let h = 0
    for (const c of player) h = (h * 31 + c.charCodeAt(0)) >>> 0
    return h
  }

  /** lock any prompt whose clock ran out (lazy expiry) */
  private sweep(player: string, n: number) {
    const now = this.now()
    this.db
      .prepare(`UPDATE dive_answers SET locked_at = ?, points = 0, tier = 'none' WHERE player_id = ? AND dive_no = ? AND locked_at IS NULL AND opened_at + ? < ?`)
      .run(now, player, n, LEAD_MS + PROMPT_MS + GRACE_MS, now)
    this.finishIfDone(player, n)
  }

  private finishIfDone(player: string, n: number) {
    const rows = this.rows(player, n)
    if (rows.length === PROMPTS_PER_DIVE && rows.every((r) => r.locked_at != null)) {
      const total = rows.reduce((s, r) => s + (r.points ?? 0), 0)
      this.db.prepare('UPDATE dives SET finished_at = COALESCE(finished_at, ?), score = ? WHERE player_id = ? AND dive_no = ?').run(this.now(), total, player, n)
    }
  }

  state(player: string, n: number): DiveState {
    this.checkDive(n)
    this.sweep(player, n)
    const qs = this.prompts(n)
    const rows = this.rows(player, n)
    const salt = this.salt(player)
    const locked = rows.filter((r) => r.locked_at != null)
    const results = locked.map((r) => this.toResult(r, qs[r.idx], salt))
    const openRow = rows.find((r) => r.locked_at == null)
    const done = locked.length === PROMPTS_PER_DIVE
    const total = results.reduce((s, r) => s + r.points, 0)
    return {
      n,
      date: dateForDive(this.opts.launch, n),
      total,
      results,
      current: locked.length,
      open: openRow ? this.openInfo(openRow, qs[openRow.idx]) : null,
      done,
      percentile: done ? this.percentile(n, total) : null,
    }
  }

  private openInfo(r: Row, q: Question): OpenPrompt {
    return {
      idx: r.idx,
      text: q.text,
      category: q.category,
      startsAt: r.opened_at + LEAD_MS,
      deadline: r.opened_at + LEAD_MS + PROMPT_MS,
      serverNow: this.now(),
    }
  }

  percentile(n: number, total: number): number | null {
    const row = this.db
      .prepare('SELECT COUNT(*) AS all_, SUM(CASE WHEN score < ? THEN 1 ELSE 0 END) AS below FROM dives WHERE dive_no = ? AND finished_at IS NOT NULL')
      .get(total, n) as { all_: number; below: number | null }
    if (!row.all_ || row.all_ < 2) return null
    return Math.round(((row.below ?? 0) / (row.all_ - 1)) * 100)
  }

  /** open the next prompt; idempotent (re-opening keeps the original clock) */
  open(player: string, n: number, idx: number): OpenPrompt {
    this.checkDive(n)
    this.sweep(player, n)
    const qs = this.prompts(n)
    return tx(this.db, () => {
      const rows = this.rows(player, n)
      const existing = rows.find((r) => r.idx === idx)
      if (existing) {
        if (existing.locked_at != null) throw new GameError(409, 'Prompt already answered')
        return this.openInfo(existing, qs[idx])
      }
      if (idx !== rows.length || idx >= PROMPTS_PER_DIVE) throw new GameError(409, 'Prompts must be played in order')
      if (rows.some((r) => r.locked_at == null)) throw new GameError(409, 'Another prompt is still open')
      const now = this.now()
      this.db.prepare('INSERT OR IGNORE INTO dives (player_id, dive_no, started_at) VALUES (?, ?, ?)').run(player, n, now)
      this.db.prepare('INSERT INTO dive_answers (player_id, dive_no, idx, question_id, opened_at) VALUES (?, ?, ?, ?, ?)').run(player, n, idx, qs[idx].id, now)
      return this.openInfo({ idx, question_id: qs[idx].id, opened_at: now } as Row, qs[idx])
    })
  }

  answer(player: string, n: number, idx: number, text: string, ipHash: string) {
    this.checkDive(n)
    const qs = this.prompts(n)
    const q = qs[idx]
    if (!q) throw new GameError(400, 'Bad prompt index')
    const clean = String(text ?? '').replace(/\s+/g, ' ').trim().slice(0, 60)

    return tx(this.db, () => {
      const row = this.db
        .prepare('SELECT idx, question_id, opened_at, locked_at, raw, answer_id, points, tier, share, attempts FROM dive_answers WHERE player_id = ? AND dive_no = ? AND idx = ?')
        .get(player, n, idx) as Row | undefined
      if (!row) throw new GameError(409, 'Prompt not opened')
      const salt = this.salt(player)
      // duplicate / retried submission → return the locked result unchanged
      if (row.locked_at != null) return { status: 'locked' as const, result: this.toResult(row, q, salt) }

      const now = this.now()
      const deadline = row.opened_at + LEAD_MS + PROMPT_MS
      if (now > deadline + GRACE_MS) {
        this.db.prepare(`UPDATE dive_answers SET locked_at = ?, points = 0, tier = 'none' WHERE player_id = ? AND dive_no = ? AND idx = ?`).run(now, player, n, idx)
        this.finishIfDone(player, n)
        return { status: 'locked' as const, result: this.toResult({ ...row, locked_at: now, points: 0, tier: 'none' }, q, salt) }
      }
      if (!clean) return { status: 'miss' as const, reason: 'empty', remainingMs: deadline - now }
      if (row.attempts >= MAX_ATTEMPTS) return { status: 'miss' as const, reason: 'limit', remainingMs: deadline - now }

      const hit = matchAnswer(q, clean, ALL_KEYS)
      if (!hit) {
        this.db.prepare('UPDATE dive_answers SET attempts = attempts + 1, raw = ? WHERE player_id = ? AND dive_no = ? AND idx = ?').run(clean, player, n, idx)
        return { status: 'miss' as const, reason: 'nomatch', remainingMs: deadline - now }
      }

      const { total, counts } = this.stats(q.id)
      const s = score(counts.get(hit.id) ?? 0, total, hit.level)
      const recent = this.db
        .prepare('SELECT COUNT(*) AS c FROM dive_answers WHERE ip_hash = ? AND question_id = ? AND counted = 1 AND locked_at > ?')
        .get(ipHash, q.id, now - 86_400_000) as { c: number }
      const counted = recent.c < IP_DAILY_COUNT_LIMIT ? 1 : 0
      if (counted) {
        this.db.prepare('INSERT INTO answer_counts (question_id, answer_id, count) VALUES (?, ?, 1) ON CONFLICT(question_id, answer_id) DO UPDATE SET count = count + 1').run(q.id, hit.id)
        this.db.prepare('INSERT INTO question_totals (question_id, total) VALUES (?, 1) ON CONFLICT(question_id) DO UPDATE SET total = total + 1').run(q.id)
      }
      this.db
        .prepare('UPDATE dive_answers SET locked_at = ?, raw = ?, answer_id = ?, points = ?, tier = ?, share = ?, ip_hash = ?, counted = ? WHERE player_id = ? AND dive_no = ? AND idx = ?')
        .run(now, clean, hit.id, s.points, s.tier.key, s.share, ipHash, counted, player, n, idx)
      this.finishIfDone(player, n)
      const locked: Row = { ...row, locked_at: now, raw: clean, answer_id: hit.id, points: s.points, tier: s.tier.key, share: s.share }
      return { status: 'locked' as const, result: this.toResult(locked, q, salt) }
    })
  }

  /** client says the clock ran out; lock as a miss if it really did */
  expire(player: string, n: number, idx: number) {
    this.checkDive(n)
    const row = this.db.prepare('SELECT opened_at, locked_at FROM dive_answers WHERE player_id = ? AND dive_no = ? AND idx = ?').get(player, n, idx) as
      | { opened_at: number; locked_at: number | null }
      | undefined
    if (!row) throw new GameError(409, 'Prompt not opened')
    const now = this.now()
    if (row.locked_at == null) {
      if (now < row.opened_at + LEAD_MS + PROMPT_MS - 500) throw new GameError(409, 'Clock still running')
      this.db.prepare(`UPDATE dive_answers SET locked_at = ?, points = 0, tier = 'none' WHERE player_id = ? AND dive_no = ? AND idx = ? AND locked_at IS NULL`).run(now, player, n, idx)
      this.finishIfDone(player, n)
    }
    return this.state(player, n)
  }

  archive(player: string) {
    const max = this.maxDive()
    const rows = this.db.prepare('SELECT dive_no, finished_at, score FROM dives WHERE player_id = ?').all(player) as {
      dive_no: number
      finished_at: number | null
      score: number
    }[]
    const by = new Map(rows.map((r) => [r.dive_no, r]))
    const list = []
    for (let n = max; n >= 1; n--) {
      const r = by.get(n)
      list.push({
        n,
        date: dateForDive(this.opts.launch, n),
        status: r ? (r.finished_at ? 'done' : 'partial') : 'new',
        score: r?.finished_at ? r.score : null,
      })
    }
    return list
  }
}

export const MISS = MISS_TIER
