import { PROMPTS_PER_DIVE } from './scoring'

const DAY = 86_400_000

export function parseDate(ymd: string): number {
  const [y, m, d] = ymd.split('-').map(Number)
  return Date.UTC(y, m - 1, d)
}
export function formatDate(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10)
}

/** dive number for a calendar date string (YYYY-MM-DD); 1 = launch day */
export function diveForDate(launch: string, ymd: string): number {
  return Math.round((parseDate(ymd) - parseDate(launch)) / DAY) + 1
}
export function dateForDive(launch: string, n: number): string {
  return formatDate(parseDate(launch) + (n - 1) * DAY)
}
/** today's dive in the viewer's local calendar */
export function localDive(launch: string, now = new Date()): number {
  const ymd = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  return diveForDate(launch, ymd)
}
/** latest dive anyone on Earth can be playing (UTC+14) */
export function maxDiveAt(launch: string, nowMs: number): number {
  return diveForDate(launch, formatDate(nowMs + 14 * 3_600_000))
}

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function shuffled<T>(arr: T[], seed: number): T[] {
  const r = mulberry32(seed)
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Deterministic prompt selection: the pool is walked in seeded shuffles ("cycles") so every
 * question is used once before any repeats. Results are persisted server-side on first use,
 * so growing the pool never rewrites a dive someone already played.
 */
export function selectPrompts(n: number, pool: string[]): string[] {
  const sorted = [...pool].sort()
  const len = sorted.length
  const picked: string[] = []
  let i = (n - 1) * PROMPTS_PER_DIVE
  const cycles = new Map<number, string[]>()
  while (picked.length < Math.min(PROMPTS_PER_DIVE, len)) {
    const c = Math.floor(i / len)
    if (!cycles.has(c)) cycles.set(c, shuffled(sorted, 7919 * (c + 1) + 13))
    const id = cycles.get(c)![i % len]
    if (!picked.includes(id)) picked.push(id)
    i++
  }
  return picked
}
