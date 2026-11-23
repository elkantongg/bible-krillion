import type { Tier, TierKey } from './types'

/**
 * Rarity scoring.
 *
 *   share = (count + K * prior(level)) / (total + K)
 *
 * `count` = valid first-try submissions of this answer, `total` = all valid submissions
 * for the question. With no data, share == prior(level) from the curated dataset; as real
 * submissions accumulate the empirical frequency dominates (K = pseudo-submissions).
 * The share is then bucketed into fixed tiers so scores stay explainable.
 */
export const PRIOR_SHARE = [0.0008, 0.004, 0.012, 0.03, 0.07, 0.2] as const
export const K = 40

export const TIERS: Tier[] = [
  { key: 'surface', label: 'Low Cloud', points: 10, minShare: 0.12, emoji: '☁️', blurb: 'Half the room said it too.' },
  { key: 'shallows', label: 'Open Sky', points: 20, minShare: 0.05, emoji: '🕊️', blurb: 'A solid pick — plenty of company.' },
  { key: 'reef', label: 'Eagle’s Wing', points: 35, minShare: 0.02, emoji: '🦅', blurb: 'Off the beaten path.' },
  { key: 'rare', label: 'Morning Star', points: 60, minShare: 0.008, emoji: '⭐', blurb: 'Genuinely uncommon. Well studied.' },
  { key: 'deep', label: 'Above the Clouds', points: 85, minShare: 0.002, emoji: '✨', blurb: 'Hardly anyone climbs this high.' },
  { key: 'pearl', label: 'Gate of Pearl', points: 100, minShare: 0, emoji: '💎', blurb: 'Almost no one found this one.' },
]
export const MISS_TIER: Tier = { key: 'none', label: 'Grounded', points: 0, minShare: 1, emoji: '⬛', blurb: 'No wind under the wings this time.' }

export function tierByKey(k: TierKey): Tier {
  return TIERS.find((t) => t.key === k) ?? MISS_TIER
}

export function blendedShare(count: number, total: number, level: number): number {
  const lv = Math.max(0, Math.min(5, Math.round(level)))
  return (count + K * PRIOR_SHARE[lv]) / (total + K)
}

export function tierForShare(share: number): Tier {
  for (const t of TIERS) if (share >= t.minShare) return t
  return TIERS[TIERS.length - 1]
}

export function score(count: number, total: number, level: number) {
  const share = blendedShare(count, total, level)
  const tier = tierForShare(share)
  return { share, tier, points: tier.points }
}

/* ---------- altitude (internally still called depth: metres climbed) ---------- */
export const PROMPTS_PER_DIVE = 7
export const SECONDS_PER_PROMPT = 25
export const METRES_PER_POINT = 10
export const MAX_DEPTH = PROMPTS_PER_DIVE * 100 * METRES_PER_POINT // 7000 m up

export const depthFor = (points: number) => Math.min(MAX_DEPTH, Math.max(0, points * METRES_PER_POINT))

export interface Zone {
  from: number
  name: string
}
export const ZONES: Zone[] = [
  { from: 0, name: 'The Lake' },
  { from: 200, name: 'The Open Sky' },
  { from: 1200, name: 'The Clouds' },
  { from: 2400, name: 'Above the Clouds' },
  { from: 5000, name: 'The Golden City' },
]
export function zoneFor(depth: number): Zone {
  let z = ZONES[0]
  for (const zz of ZONES) if (depth >= zz.from) z = zz
  return z
}
