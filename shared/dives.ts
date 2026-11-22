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

export const CURATED_PER_DIVE = 2

/**
 * Generated prompts form one endless stream of seeded shuffles ("cycles"). Dive k takes block k:
 * the first `size` items in the stream from different groups. A new cycle is only pulled in when
 * the current one can't fill a block, so a prompt never repeats until its whole cycle is used up,
 * every dive gets a full block, and no dive has two prompts from one group (e.g. one book).
 */
interface Stream {
  blocks: string[][]
  buffer: string[]
  cycle: number
}
const streams = new Map<string, Stream>()
function blocksFor(pool: string[], size: number, groupOf: (id: string) => string | undefined, upTo: number): string[][] {
  const sorted = [...pool].sort()
  const sig = `${size}:${sorted.join(',')}`
  const st = streams.get(sig) ?? { blocks: [], buffer: [], cycle: 0 }
  streams.set(sig, st)
  while (st.blocks.length < upTo) {
    const block: string[] = []
    const used = new Set<string>()
    for (let pulls = 0; block.length < size && pulls < 3; ) {
      for (let i = 0; i < st.buffer.length && block.length < size; i++) {
        const id = st.buffer[i]
        const g = groupOf(id) ?? id
        if (used.has(g) || block.includes(id)) continue
        used.add(g)
        block.push(id)
        st.buffer.splice(i--, 1)
      }
      if (block.length < size) {
        st.buffer.push(...shuffled(sorted, 7919 * (st.cycle + 1) + 202))
        st.cycle++
        pulls++
      }
    }
    st.blocks.push(block)
  }
  return st.blocks
}

/**
 * Daily mix: 2 hand-written prompts + 5 generated ones (all from different groups), in a seeded
 * order. Results are persisted server-side on first use, so growing either pool never rewrites a
 * dive someone already played.
 */
export function selectMixed(n: number, curated: string[], generated: { id: string; group?: string }[]): string[] {
  const groups = new Map(generated.map((g) => [g.id, g.group]))
  const c = walk(n, curated, CURATED_PER_DIVE, 101)
  const size = PROMPTS_PER_DIVE - c.length
  const g = generated.length ? blocksFor(generated.map((x) => x.id), size, (id) => groups.get(id), n)[n - 1] : []
  return shuffled([...c, ...g], n * 31 + 7)
}
