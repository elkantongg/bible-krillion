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
 * Walk a pool in seeded shuffles ("cycles") so every item is used once before any repeats,
 * taking `per` items for dive n. Items whose group is already in `usedGroups` are skipped.
 */
function walk(n: number, pool: string[], per: number, salt: number, groupOf?: (id: string) => string | undefined, usedGroups = new Set<string>()): string[] {
  const sorted = [...pool].sort()
  const len = sorted.length
  if (!len) return []
  const picked: string[] = []
  let i = (n - 1) * per
  const cycles = new Map<number, string[]>()
  let guard = 0
  while (picked.length < Math.min(per, len) && guard++ < len * 3) {
    const c = Math.floor(i / len)
    if (!cycles.has(c)) cycles.set(c, shuffled(sorted, 7919 * (c + 1) + salt))
    const id = cycles.get(c)![i % len]
    const g = groupOf?.(id)
    if (!picked.includes(id) && !(g && usedGroups.has(g))) {
      picked.push(id)
      if (g) usedGroups.add(g)
    }
    i++
  }
  return picked
}

/** single-pool selection (7 per dive) */
export function selectPrompts(n: number, pool: string[]): string[] {
  return walk(n, pool, PROMPTS_PER_DIVE, 13)
}

/** a daily dive: 3 easy, then 3 medium, then 1 hard — it gets harder the deeper you go */
export const DAILY_MIX: [difficulty: number, count: number][] = [
  [1, 3],
  [2, 3],
  [3, 1],
]

export interface PoolItem {
  id: string
  group?: string
  difficulty?: number
}

/**
 * Each difficulty tier is an endless stream of seeded shuffles ("cycles"). Dive k takes the next
 * items from each stream whose category hasn't been used yet in that dive. A new cycle is only
 * pulled in when a stream runs dry, so a prompt never repeats until its whole tier has been used,
 * and no dive has two prompts from one category. Blocks are built in order and cached.
 */
interface DailyStream {
  blocks: string[][]
  buffers: Map<number, string[]>
  cycles: Map<number, number>
}
const dailyStreams = new Map<string, DailyStream>()

export function selectDaily(n: number, pool: PoolItem[]): string[] {
  const sorted = [...pool].sort((a, b) => (a.id < b.id ? -1 : 1))
  const sig = sorted.map((p) => `${p.id}:${p.difficulty ?? 2}`).join(',')
  const groupOf = new Map(sorted.map((p) => [p.id, p.group ?? p.id]))
  const tiers = new Map<number, string[]>()
  for (const p of sorted) {
    const d = p.difficulty ?? 2
    if (!tiers.has(d)) tiers.set(d, [])
    tiers.get(d)!.push(p.id)
  }
  const st: DailyStream = dailyStreams.get(sig) ?? { blocks: [], buffers: new Map(), cycles: new Map() }
  dailyStreams.set(sig, st)
  while (st.blocks.length < n) {
    const block: string[] = []
    const used = new Set<string>()
    for (const [d, want] of DAILY_MIX) {
      // fall back to a neighbouring tier if a tier is empty
      const tier = tiers.get(d)?.length ? d : [...tiers.keys()].sort((a, b) => Math.abs(a - d) - Math.abs(b - d))[0]
      const ids = tiers.get(tier) ?? []
      let got = 0
      for (let pulls = 0; got < want && pulls < 3; ) {
        const buf = st.buffers.get(tier) ?? []
        st.buffers.set(tier, buf)
        for (let i = 0; i < buf.length && got < want; i++) {
          const id = buf[i]
          const g = groupOf.get(id)!
          if (used.has(g) || block.includes(id)) continue
          used.add(g)
          block.push(id)
          buf.splice(i--, 1)
          got++
        }
        if (got < want) {
          const c = st.cycles.get(tier) ?? 0
          buf.push(...shuffled(ids, 7919 * (c + 1) + 202 + tier * 31))
          st.cycles.set(tier, c + 1)
          pulls++
        }
      }
    }
    st.blocks.push(block)
  }
  return st.blocks[n - 1]
}
