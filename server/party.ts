import { QUESTIONS, ALL_KEYS } from '../shared/data/index'
import { matchAnswer } from '../shared/match'
import { score } from '../shared/scoring'
import type { PartyFeedItem, PartyPlayer, PartyState, Question, TierKey } from '../shared/types'

export const FUSE_MIN = 10_000
export const FUSE_MAX = 30_000
export const FUSE_FLOOR = 8_000
export const POP_PAUSE = 3_200
export const MAX_PLAYERS = 12
const PARTY_POOL = QUESTIONS.filter((q) => q.answers.length >= 30)

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
  | { ok: false; reason: 'not-your-turn' | 'nomatch' | 'used' | 'not-playing' | 'empty' }

export class PartyRoom {
  hostId = ''
  phase: PartyState['phase'] = 'lobby'
  players: PartyPlayer[] = []
  settings = { lives: 2 }
  question: Question | null = null
  used = new Set<string>()
  holderId: string | null = null
  fuseEnd = 0
  roundStartedAt: number | null = null
  feed: PartyFeedItem[] = []
  winnerId: string | null = null
  lastPop: PartyState['lastPop'] = null
  lastActive: number
  private timer: unknown = null
  private recent: string[] = []
  private feedSeq = 0

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

  get alive() {
    return this.players.filter((p) => !p.spectator && p.lives > 0)
  }

  join(id: string, name: string): { ok: boolean; error?: string } {
    const clean = name.replace(/\s+/g, ' ').trim().slice(0, 16) || 'Diver'
    const existing = this.players.find((p) => p.id === id)
    if (existing) {
      existing.connected = true
      existing.name = clean
      // the host may have left while nobody else was around to inherit the role
      if (!this.players.some((p) => p.id === this.hostId && p.connected)) this.hostId = id
      this.changed()
      return { ok: true }
    }
    if (this.players.length >= MAX_PLAYERS) return { ok: false, error: 'Room is full' }
    const midGame = this.phase !== 'lobby'
    this.players.push({
      id,
      name: clean,
      lives: midGame ? 0 : this.settings.lives,
      connected: true,
      spectator: midGame,
      hue: Math.floor(this.clock.random() * 360),
      answers: 0,
    })
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
    if (this.phase === 'playing' || this.phase === 'popped') {
      const live = this.alive.filter((x) => x.connected)
      if (live.length <= 1) this.finish(live[0]?.id ?? null)
      else if (!connected && this.holderId === id && this.phase === 'playing') this.holderId = this.nextHolder(id)
    }
    this.changed()
  }

  leave(id: string) {
    this.setConnected(id, false)
    this.players = this.players.filter((x) => x.id !== id || this.phase !== 'lobby')
  }

  setLives(by: string, lives: number) {
    if (by !== this.hostId || this.phase !== 'lobby') return
    this.settings.lives = Math.max(1, Math.min(3, Math.round(lives)))
    for (const p of this.players) p.lives = this.settings.lives
    this.changed()
  }

  start(by: string): { ok: boolean; error?: string } {
    if (by !== this.hostId) return { ok: false, error: 'Only the host can start' }
    if (this.phase !== 'lobby') return { ok: false, error: 'Already started' }
    const ready = this.players.filter((p) => p.connected)
    if (ready.length < 2) return { ok: false, error: 'Need at least 2 divers' }
    for (const p of this.players) {
      p.spectator = !p.connected
      p.lives = p.connected ? this.settings.lives : 0
      p.answers = 0
    }
    this.feed = []
    this.winnerId = null
    this.lastPop = null
    const order = this.alive
    this.newRound(order[Math.floor(this.clock.random() * order.length)].id)
    return { ok: true }
  }

  private pickQuestion(): Question {
    const pool = PARTY_POOL.filter((q) => !this.recent.includes(q.id))
    const q = pool[Math.floor(this.clock.random() * pool.length)] ?? PARTY_POOL[0]
    this.recent = [...this.recent, q.id].slice(-10)
    return q
  }

  private newRound(holder: string) {
    this.phase = 'playing'
    this.question = this.pickQuestion()
    this.used = new Set()
    this.feed = []
    this.holderId = holder
    const now = this.clock.now()
    this.roundStartedAt = now
    this.fuseEnd = now + FUSE_MIN + Math.floor(this.clock.random() * (FUSE_MAX - FUSE_MIN))
    this.arm()
    this.changed()
  }

  private arm() {
    if (this.timer) this.clock.clearTimeout(this.timer)
    this.timer = this.clock.setTimeout(() => this.pop(), Math.max(0, this.fuseEnd - this.clock.now()))
  }

  private nextHolder(from: string): string {
    const order = this.players.filter((p) => !p.spectator && (p.lives > 0 || p.id === from))
    const i = order.findIndex((p) => p.id === from)
    for (let k = 1; k <= order.length; k++) {
      const c = order[(i + k) % order.length]
      if (c.lives > 0 && c.connected && c.id !== from) return c.id
    }
    return from
  }

  answer(by: string, text: string): AnswerResult {
    if (this.phase !== 'playing' || !this.question) return { ok: false, reason: 'not-playing' }
    if (by !== this.holderId) return { ok: false, reason: 'not-your-turn' }
    const clean = text.replace(/\s+/g, ' ').trim().slice(0, 60)
    if (!clean) return { ok: false, reason: 'empty' }
    const hit = matchAnswer(this.question, clean, ALL_KEYS)
    if (!hit) return { ok: false, reason: 'nomatch' }
    if (this.used.has(hit.id)) return { ok: false, reason: 'used' }
    this.used.add(hit.id)
    const tier = score(0, 0, hit.level).tier.key
    const p = this.players.find((x) => x.id === by)
    if (p) p.answers++
    this.feed = [...this.feed, { id: ++this.feedSeq, playerId: by, answer: hit.name, tier }].slice(-30)

    // pass the fish: the hidden fuse keeps burning, but never below the floor
    this.holderId = this.nextHolder(by)
    const now = this.clock.now()
    if (this.fuseEnd - now < FUSE_FLOOR) {
      this.fuseEnd = now + FUSE_FLOOR
      this.arm()
    }
    if (this.used.size >= this.question.answers.length - 2) {
      // category exhausted — fresh prompt, same fuse
      this.question = this.pickQuestion()
      this.used = new Set()
    }
    this.changed()
    return { ok: true, answer: hit.name, tier }
  }

  private pop() {
    this.timer = null
    if (this.phase !== 'playing' || !this.holderId) return
    const victim = this.players.find((p) => p.id === this.holderId)
    if (!victim) return
    victim.lives = Math.max(0, victim.lives - 1)
    this.lastPop = { playerId: victim.id, at: this.clock.now(), eliminated: victim.lives === 0 }
    // always show the swallow — even the final one — before moving on
    this.phase = 'popped'
    this.changed()
    const nextFrom = victim.id
    this.timer = this.clock.setTimeout(() => {
      this.timer = null
      if (this.phase !== 'popped') return
      const live = this.alive.filter((p) => p.connected)
      if (live.length <= 1) return this.finish(live[0]?.id ?? null)
      const starter = victim.lives > 0 && victim.connected ? victim.id : this.nextHolder(nextFrom)
      this.newRound(starter)
    }, POP_PAUSE)
  }

  private finish(winner: string | null) {
    if (this.timer) this.clock.clearTimeout(this.timer)
    this.timer = null
    this.phase = 'over'
    this.winnerId = winner
    this.holderId = null
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
      settings: { ...this.settings },
      prompt: this.question ? { text: this.question.text, category: this.question.category } : null,
      holderId: this.holderId,
      roundStartedAt: this.roundStartedAt,
      serverNow: this.clock.now(),
      feed: this.feed,
      usedCount: this.used.size,
      winnerId: this.winnerId,
      lastPop: this.lastPop,
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
