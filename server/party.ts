import { QUESTIONS, ALL_KEYS, CATEGORIES } from '../shared/data/index'
import { matchAnswer } from '../shared/match'
import { score } from '../shared/scoring'
import type { PartyDifficulty, PartyFeedItem, PartyPlayer, PartySettings, PartyState, Question, TierKey } from '../shared/types'

export const MAX_PLAYERS = 12
/** reading time before the first turn of every question */
export const LEAD_MS = 3_000
/** network allowance after a turn's clock hits zero */
export const GRACE_MS = 700
/** how long the "swallowed!" moment is shown before the question moves on */
export const POP_PAUSE = 2_600
/** how long the answer board is shown between questions */
export const BETWEEN_MS = 9_000
export const LIVES = { min: 1, max: 5 }
export const TURN_SECONDS = [5, 8, 10, 15, 20, 30, 45, 60]
export const ROUNDS = { min: 1, max: 15 }
export const REACTIONS = ['🙏', '🔥', '😱', '😂', '👏', '🐟', '✝️', '💡']

export const DEFAULT_SETTINGS: PartySettings = { lives: 3, turnSeconds: 15, difficulty: 'mixed', maxRounds: 15, categories: [] }

const DIFF: Record<PartyDifficulty, number[]> = { easy: [1], medium: [1, 2], hard: [2, 3], mixed: [1, 2, 3] }

/** questions a party can use with these settings (needs enough answers to pass around) */
export function partyPool(s: Pick<PartySettings, 'difficulty' | 'categories'>): Question[] {
  const diffs = DIFF[s.difficulty] ?? DIFF.mixed
  const base = QUESTIONS.filter((q) => q.answers.length >= 4 && diffs.includes(q.difficulty ?? 2))
  const cats = s.categories.filter((c) => CATEGORIES.includes(c))
  const filtered = cats.length ? base.filter((q) => cats.includes(q.category)) : base
  return filtered.length >= 3 ? filtered : base
}

export interface Clock {
  now(): number
  setTimeout(fn: () => void, ms: number): unknown
  clearTimeout(h: unknown): void
  random(): number
}
export const realClock: Clock = {
  now: Date.now,
  setTimeout: (fn, ms) => setTimeout(fn, ms),
  clearTimeout: (h) => clearTimeout(h as NodeJS.Timeout),
  random: Math.random,
}

export type AnswerResult =
  | { ok: true; answer: string; tier: TierKey }
  | { ok: false; reason: 'not-your-turn' | 'nomatch' | 'used' | 'not-playing' | 'empty' | 'not-yet' }

/**
 * Turn-based "Big Fish":
 * - every question goes round the table in seat order; each diver must name a new answer before their clock runs out
 * - a correct answer passes the question on; running out of time costs a life and the question still passes on
 * - when the table has gone round once (a round), the question ends if anyone lost a life that round;
 *   otherwise the same question goes round again — up to `maxRounds` rounds, then everyone survives it
 * - the starting diver rotates each question; last diver with lives wins
 */
export class PartyRoom {
  hostId = ''
  phase: PartyState['phase'] = 'lobby'
  players: PartyPlayer[] = []
  settings: PartySettings = { ...DEFAULT_SETTINGS, categories: [] }
  question: Question | null = null
  used = new Set<string>()
  holderId: string | null = null
  turnStartedAt: number | null = null
  turnEndsAt: number | null = null
  round = 0
  questionNo = 0
  order: string[] = []
  turnIdx = 0
  roundLost = false
  feed: PartyFeedItem[] = []
  winnerId: string | null = null
  lastPop: PartyState['lastPop'] = null
  reveal: PartyState['reveal'] = null
  nextAt: number | null = null
  lastActive: number
  private timer: unknown = null
  private recent: string[] = []
  private feedSeq = 0
  private starterSeat = -1

  constructor(
    public code: string,
    private clock: Clock,
    private onChange: (room: PartyRoom) => void = () => {},
  ) {
    this.lastActive = clock.now()
  }

  private changed() {
    this.lastActive = this.clock.now()
    this.onChange(this)
  }

  private schedule(fn: () => void, ms: number) {
    if (this.timer) this.clock.clearTimeout(this.timer)
    this.timer = this.clock.setTimeout(() => {
      this.timer = null
      fn()
    }, Math.max(0, ms))
  }

  private get seats() {
    return this.players.filter((p) => !p.spectator)
  }
  get alive() {
    return this.seats.filter((p) => p.lives > 0)
  }
  private canPlay(id: string) {
    const p = this.players.find((x) => x.id === id)
    return !!p && !p.spectator && p.lives > 0 && p.connected
  }
  private get inGame() {
    return this.phase === 'turn' || this.phase === 'popped' || this.phase === 'between'
  }

  join(id: string, name: string): { ok: boolean; error?: string } {
    const clean = name.replace(/\s+/g, ' ').trim().slice(0, 16) || 'Pilgrim'
    const existing = this.players.find((p) => p.id === id)
    if (existing) {
      existing.connected = true
      existing.name = clean
      if (!this.players.some((p) => p.id === this.hostId && p.connected)) this.hostId = id
      this.changed()
      return { ok: true }
    }
    if (this.players.length >= MAX_PLAYERS) return { ok: false, error: 'Room is full' }
    const midGame = this.phase !== 'lobby'
    const used = new Set(this.players.map((p) => Math.round(p.hue / 30)))
    let hue = Math.floor(this.clock.random() * 12) * 30
    for (let k = 0; k < 12 && used.has(hue / 30); k++) hue = ((hue / 30 + 5) % 12) * 30
    this.players.push({ id, name: clean, lives: midGame ? 0 : this.settings.lives, connected: true, spectator: midGame, hue, answers: 0 })
    if (!this.hostId || !this.players.some((p) => p.id === this.hostId && p.connected)) this.hostId = id
    this.changed()
    return { ok: true }
  }

  setConnected(id: string, connected: boolean) {
    const p = this.players.find((x) => x.id === id)
    if (!p) return
    p.connected = connected
    if (!connected && this.hostId === id) {
      const next = this.players.find((x) => x.connected)
      if (next) this.hostId = next.id
    }
    if (!connected && this.phase === 'lobby') this.players = this.players.filter((x) => x.id !== id)
    if (this.inGame) {
      const live = this.alive.filter((x) => x.connected)
      if (live.length <= 1) return this.finish(live[0]?.id ?? null)
      // a diver who drops out mid-turn simply forfeits the turn (no life lost)
      if (!connected && this.phase === 'turn' && this.holderId === id) return this.advance()
    }
    this.changed()
  }

  leave(id: string) {
    this.setConnected(id, false)
    this.players = this.players.filter((x) => x.id !== id || this.phase !== 'lobby')
  }

  updateSettings(by: string, patch: Partial<PartySettings>) {
    if (by !== this.hostId || this.phase !== 'lobby') return
    const s = this.settings
    if (patch.lives != null && Number.isFinite(+patch.lives)) s.lives = Math.max(LIVES.min, Math.min(LIVES.max, Math.round(+patch.lives)))
    if (patch.turnSeconds != null && TURN_SECONDS.includes(+patch.turnSeconds)) s.turnSeconds = +patch.turnSeconds
    if (patch.maxRounds != null && Number.isFinite(+patch.maxRounds)) s.maxRounds = Math.max(ROUNDS.min, Math.min(ROUNDS.max, Math.round(+patch.maxRounds)))
    if (patch.difficulty && patch.difficulty in DIFF) s.difficulty = patch.difficulty
    if (Array.isArray(patch.categories)) s.categories = [...new Set(patch.categories.map(String).filter((c) => CATEGORIES.includes(c)))]
    for (const p of this.players) p.lives = s.lives
    this.changed()
  }

  /** kept for older clients */
  setLives(by: string, lives: number) {
    this.updateSettings(by, { lives })
  }

  start(by: string): { ok: boolean; error?: string } {
    if (by !== this.hostId) return { ok: false, error: 'Only the host can start' }
    if (this.phase !== 'lobby') return { ok: false, error: 'Already started' }
    const ready = this.players.filter((p) => p.connected)
    if (ready.length < 2) return { ok: false, error: 'Need at least 2 players' }
    for (const p of this.players) {
      p.spectator = !p.connected
      p.lives = p.connected ? this.settings.lives : 0
      p.answers = 0
    }
    this.winnerId = null
    this.lastPop = null
    this.questionNo = 0
    this.recent = []
    this.starterSeat = Math.floor(this.clock.random() * this.seats.length) - 1
    this.nextQuestion()
    return { ok: true }
  }

  private pickQuestion(): Question {
    const all = partyPool(this.settings)
    const pool = all.filter((q) => !this.recent.includes(q.id))
    const from = pool.length ? pool : all
    const q = from[Math.floor(this.clock.random() * from.length)] ?? QUESTIONS[0]
    this.recent = [...this.recent, q.id].slice(-Math.min(40, Math.floor(all.length / 2)))
    return q
  }

  /** seat order for a round, starting from this question's starter, skipping anyone who can't play */
  private roundOrder(): string[] {
    const seats = this.seats
    const out: string[] = []
    for (let k = 0; k < seats.length; k++) {
      const p = seats[(this.starterSeat + k + seats.length) % seats.length]
      if (p.lives > 0 && p.connected) out.push(p.id)
    }
    return out
  }

  private nextQuestion() {
    const seats = this.seats
    // rotate the starting diver to the next one still swimming
    for (let k = 1; k <= seats.length; k++) {
      const i = (this.starterSeat + k) % seats.length
      if (seats[i].lives > 0 && seats[i].connected) {
        this.starterSeat = i
        break
      }
    }
    this.questionNo++
    this.question = this.pickQuestion()
    this.used = new Set()
    this.feed = []
    this.reveal = null
    this.round = 1
    this.roundLost = false
    this.order = this.roundOrder()
    this.turnIdx = 0
    this.beginTurn(true)
  }

  private beginTurn(lead: boolean) {
    this.phase = 'turn'
    this.nextAt = null
    this.holderId = this.order[this.turnIdx] ?? null
    const now = this.clock.now()
    this.turnStartedAt = now + (lead ? LEAD_MS : 0)
    this.turnEndsAt = this.turnStartedAt + this.settings.turnSeconds * 1000
    this.schedule(() => this.timeout(), this.turnEndsAt + GRACE_MS - now)
    this.changed()
  }

  answer(by: string, text: string): AnswerResult {
    if (this.phase !== 'turn' || !this.question) return { ok: false, reason: 'not-playing' }
    if (by !== this.holderId) return { ok: false, reason: 'not-your-turn' }
    if (this.turnStartedAt && this.clock.now() < this.turnStartedAt - 250) return { ok: false, reason: 'not-yet' }
    const clean = text.replace(/\s+/g, ' ').trim().slice(0, 60)
    if (!clean) return { ok: false, reason: 'empty' }
    const hit = matchAnswer(this.question, clean, ALL_KEYS)
    if (!hit) return { ok: false, reason: 'nomatch' }
    if (this.used.has(hit.id)) return { ok: false, reason: 'used' }
    this.used.add(hit.id)
    const tier = score(0, 0, hit.level).tier.key
    const p = this.players.find((x) => x.id === by)
    if (p) p.answers++
    this.feed = [...this.feed, { id: ++this.feedSeq, playerId: by, answer: hit.name, tier, round: this.round, ref: hit.ref }].slice(-80)
    this.advance()
    return { ok: true, answer: hit.name, tier }
  }

  private timeout() {
    if (this.phase !== 'turn' || !this.holderId) return
    const victim = this.players.find((p) => p.id === this.holderId)
    if (!victim) return this.advance()
    victim.lives = Math.max(0, victim.lives - 1)
    this.roundLost = true
    this.lastPop = { playerId: victim.id, at: this.clock.now(), eliminated: victim.lives === 0 }
    this.feed = [...this.feed, { id: ++this.feedSeq, playerId: victim.id, answer: null, tier: 'none' as const, round: this.round, ref: null }].slice(-80)
    this.phase = 'popped'
    this.holderId = null
    this.changed()
    this.schedule(() => {
      if (this.phase !== 'popped') return
      const live = this.alive.filter((p) => p.connected)
      if (live.length <= 1) return this.finish(live[0]?.id ?? null)
      this.advance()
    }, POP_PAUSE)
  }

  /** move to the next diver in this round; end the round (and maybe the question) when the table is done */
  private advance() {
    if (!this.question) return
    // nobody can be asked for an answer that doesn't exist
    if (this.used.size >= this.question.answers.length) return this.endQuestion()
    this.turnIdx++
    while (this.turnIdx < this.order.length && !this.canPlay(this.order[this.turnIdx])) this.turnIdx++
    if (this.turnIdx < this.order.length) return this.beginTurn(false)

    if (this.roundLost || this.round >= this.settings.maxRounds) return this.endQuestion()
    this.round++
    this.order = this.roundOrder()
    this.turnIdx = 0
    if (!this.order.length) return this.finish(null)
    this.beginTurn(false)
  }

  private endQuestion() {
    const q = this.question
    if (!q) return
    const found = new Set(this.used)
    this.reveal = {
      survivedAll: !this.roundLost,
      rounds: this.round,
      answers: q.answers
        .map((a) => ({ name: a.name, ref: a.ref, found: found.has(a.id), tier: score(0, 0, a.level).tier.key }))
        .sort((a, b) => Number(b.found) - Number(a.found)),
    }
    this.phase = 'between'
    this.holderId = null
    this.turnStartedAt = null
    this.turnEndsAt = null
    const live = this.alive.filter((p) => p.connected)
    this.nextAt = this.clock.now() + BETWEEN_MS
    this.changed()
    this.schedule(() => {
      if (this.phase !== 'between') return
      if (live.length <= 1 || this.alive.filter((p) => p.connected).length <= 1) return this.finish(this.alive.find((p) => p.connected)?.id ?? null)
      this.nextQuestion()
    }, BETWEEN_MS)
  }

  /** host can skip the answer board */
  skip(by: string) {
    if (by !== this.hostId || this.phase !== 'between') return
    const live = this.alive.filter((p) => p.connected)
    if (live.length <= 1) return this.finish(live[0]?.id ?? null)
    this.nextQuestion()
  }

  private finish(winner: string | null) {
    if (this.timer) this.clock.clearTimeout(this.timer)
    this.timer = null
    this.phase = 'over'
    this.winnerId = winner
    this.holderId = null
    this.nextAt = null
    this.changed()
  }

  backToLobby(by: string) {
    if (by !== this.hostId || this.phase !== 'over') return
    this.phase = 'lobby'
    this.players = this.players.filter((p) => p.connected)
    for (const p of this.players) {
      p.spectator = false
      p.lives = this.settings.lives
      p.answers = 0
    }
    this.question = null
    this.feed = []
    this.lastPop = null
    this.reveal = null
    this.changed()
  }

  dispose() {
    if (this.timer) this.clock.clearTimeout(this.timer)
  }

  snapshot(): PartyState {
    return {
      code: this.code,
      hostId: this.hostId,
      phase: this.phase,
      players: this.players.map((p) => ({ ...p })),
      settings: { ...this.settings, categories: [...this.settings.categories] },
      prompt: this.question
        ? { text: this.question.text, category: this.question.category, difficulty: this.question.difficulty ?? 2, answerCount: this.question.answers.length }
        : null,
      holderId: this.holderId,
      turnStartedAt: this.turnStartedAt,
      turnEndsAt: this.turnEndsAt,
      round: this.round,
      questionNo: this.questionNo,
      order: [...this.order],
      turnIdx: this.turnIdx,
      roundLost: this.roundLost,
      serverNow: this.clock.now(),
      feed: this.feed,
      usedCount: this.used.size,
      winnerId: this.winnerId,
      lastPop: this.lastPop,
      reveal: this.reveal,
      nextAt: this.nextAt,
    }
  }
}

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
export function makeCode(taken: (c: string) => boolean, rnd = Math.random): string {
  for (;;) {
    let c = ''
    for (let i = 0; i < 4; i++) c += CODE_CHARS[Math.floor(rnd() * CODE_CHARS.length)]
    if (!taken(c)) return c
  }
}
