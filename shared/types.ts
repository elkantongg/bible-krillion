export interface Answer {
  /** stable id, unique within its question */
  id: string
  /** canonical display name */
  name: string
  /** accepted spellings / translations (includes name) */
  aliases: string[]
  /** provisional commonness 0 (very obscure) … 5 (everyone says it) */
  level: number
  /** short scripture reference used to verify the answer */
  ref: string
}

export interface Question {
  id: string
  text: string
  category: string
  answers: Answer[]
  /** 'curated' = hand-written; 'generated' = built from Theographic data */
  source?: 'curated' | 'generated'
  /** diversity key (e.g. a book) — a dive never uses two prompts from one group */
  group?: string
}

export interface Tier {
  key: TierKey
  label: string
  points: number
  /** minimum blended share of players for this tier */
  minShare: number
  blurb: string
  emoji: string
}

export type TierKey = 'surface' | 'shallows' | 'reef' | 'rare' | 'deep' | 'pearl' | 'none'

export interface PromptResult {
  idx: number
  questionId: string
  prompt: string
  raw: string | null
  answer: string | null
  ref: string | null
  points: number
  tier: TierKey
  sharePct: number | null
  /** most common answer so far, revealed after locking */
  common: string | null
  /** an obscure valid answer, revealed after locking */
  pearl: string | null
}

export interface DiveState {
  n: number
  date: string
  total: number
  results: PromptResult[]
  /** index of the prompt currently open (or next to open); 7 when done */
  current: number
  open: OpenPrompt | null
  done: boolean
  percentile: number | null
}

export interface OpenPrompt {
  idx: number
  text: string
  category: string
  startsAt: number
  deadline: number
  serverNow: number
}

export interface ArchiveEntry {
  n: number
  date: string
  status: 'new' | 'partial' | 'done'
  score: number | null
}

/* ---------- party ---------- */

export interface PartyPlayer {
  id: string
  name: string
  lives: number
  connected: boolean
  spectator: boolean
  hue: number
  answers: number
}

export interface PartyFeedItem {
  id: number
  playerId: string
  answer: string
  tier: TierKey
}

export interface PartyState {
  code: string
  hostId: string
  phase: 'lobby' | 'playing' | 'popped' | 'over'
  players: PartyPlayer[]
  settings: { lives: number }
  prompt: { text: string; category: string } | null
  holderId: string | null
  roundStartedAt: number | null
  serverNow: number
  feed: PartyFeedItem[]
  usedCount: number
  winnerId: string | null
  lastPop: { playerId: string; at: number; eliminated: boolean } | null
}
