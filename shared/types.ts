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
  /** 'curated' = hand-written */
  source?: 'curated'
  /** diversity key (the category) — a dive never uses two prompts from one group */
  group?: string
  /** 1 easy · 2 medium · 3 hard */
  difficulty?: Difficulty
}

export type Difficulty = 1 | 2 | 3

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

export interface PracticePrompt {
  id: string
  text: string
  category: string
  difficulty: number
  answerCount: number
}

export interface BoardEntry {
  id: string
  name: string
  ref: string
  tier: TierKey
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
  /** null = the diver ran out of time */
  answer: string | null
  tier: TierKey
  round: number
  ref: string | null
}

export type PartyDifficulty = 'easy' | 'medium' | 'hard' | 'mixed'

export interface PartySettings {
  /** 1–5 */
  lives: number
  /** seconds per turn */
  turnSeconds: number
  difficulty: PartyDifficulty
  /** rounds before everyone survives a question (1–15) */
  maxRounds: number
  /** empty = every category */
  categories: string[]
}

export interface PartyState {
  code: string
  hostId: string
  phase: 'lobby' | 'turn' | 'popped' | 'between' | 'over'
  players: PartyPlayer[]
  settings: PartySettings
  prompt: { text: string; category: string; difficulty: number; answerCount: number } | null
  holderId: string | null
  turnStartedAt: number | null
  turnEndsAt: number | null
  round: number
  questionNo: number
  /** turn order for the current round */
  order: string[]
  turnIdx: number
  /** someone has lost a life this round, so the question ends when the round does */
  roundLost: boolean
  serverNow: number
  feed: PartyFeedItem[]
  usedCount: number
  winnerId: string | null
  lastPop: { playerId: string; at: number; eliminated: boolean } | null
  reveal: { survivedAll: boolean; rounds: number; answers: { name: string; ref: string; found: boolean; tier: TierKey }[] } | null
  /** when the next question starts (between questions) */
  nextAt: number | null
}
