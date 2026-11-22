import type { Answer, Question } from './types'

/** lowercase, strip accents/punctuation, collapse whitespace */
export function norm(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’‘`]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

/** spacing-insensitive comparison key ("Tubal-cain" == "tubal cain" == "tubalcain") */
export const key = (s: string) => norm(s).replace(/ /g, '')

const LEADING = [
  'the', 'a', 'an', 'king', 'queen', 'prophet', 'prophetess', 'saint', 'st', 'apostle',
  'high priest', 'priest', 'judge', 'mount', 'mt', 'river', 'brook', 'lake', 'pool of', 'land of',
  'book of', 'gospel of', 'gospel according to', 'letter to the', 'letter to', 'epistle to the',
  'epistle to', 'epistle of', 'parable of the', 'parable of', 'story of the', 'pharaoh',
  '1', '2', '3', 'i', 'ii', 'iii', '1st', '2nd', '3rd', 'first', 'second', 'third',
]
const TRAILING = ['river', 'brook', 'mountain', 'mount', 'tribe', 'the great', 'parable']

/** every lookup key we will try for one input, most literal first */
export function variants(input: string): string[] {
  const out = new Set<string>()
  const n = norm(input)
  if (!n) return []
  const add = (s: string) => {
    const k = s.replace(/ /g, '')
    if (!k) return
    out.add(k)
  }
  add(n)
  let cur = n
  for (let guard = 0; guard < 4; guard++) {
    let changed = false
    for (const f of LEADING) {
      if (cur.startsWith(f + ' ') && cur.length > f.length + 1) {
        cur = cur.slice(f.length + 1)
        add(cur)
        changed = true
      }
    }
    for (const f of TRAILING) {
      if (cur.endsWith(' ' + f) && cur.length > f.length + 1) {
        cur = cur.slice(0, -(f.length + 1))
        add(cur)
        changed = true
      }
    }
    if (!changed) break
  }
  // plural fallbacks (lions → lion, foxes → fox)
  for (const k of [...out]) {
    if (k.length > 4 && k.endsWith('es')) out.add(k.slice(0, -2))
    if (k.length > 3 && k.endsWith('s')) out.add(k.slice(0, -1))
  }
  return [...out]
}

/** optimal-string-alignment distance with early exit above `max` */
export function distance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i])
  for (let j = 1; j <= b.length; j++) d[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    let rowMin = Infinity
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      let v = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, d[i - 2][j - 2] + 1)
      d[i][j] = v
      if (v < rowMin) rowMin = v
    }
    if (rowMin > max) return max + 1
  }
  return d[a.length][b.length]
}

export function fuzzyBudget(len: number): number {
  if (len < 4) return 0
  if (len < 8) return 1
  return 2
}

interface Index {
  exact: Map<string, Answer>
  keys: [string, Answer][]
}
const indexCache = new WeakMap<Question, Index>()

export function indexFor(q: Question): Index {
  let idx = indexCache.get(q)
  if (idx) return idx
  const exact = new Map<string, Answer>()
  for (const a of q.answers) for (const al of a.aliases) exact.set(key(al), a)
  idx = { exact, keys: [...exact.entries()] }
  indexCache.set(q, idx)
  return idx
}

/**
 * Match free text against one question's curated answers.
 * `knownElsewhere` is the set of every alias key from every question: an input that
 * exactly names some other biblical entity is never fuzzy-matched into this question.
 */
export function matchAnswer(q: Question, input: string, knownElsewhere?: Set<string>): Answer | null {
  const raw = input.slice(0, 80)
  const vs = variants(raw)
  if (!vs.length) return null
  const idx = indexFor(q)
  for (const v of vs) {
    const hit = idx.exact.get(v)
    if (hit) return hit
  }
  if (knownElsewhere && vs.some((v) => knownElsewhere.has(v))) return null

  // fuzzy: unique closest alias within the typo budget
  let best: Answer | null = null
  let bestD = Infinity
  let tie = false
  for (const v of vs) {
    const budget = fuzzyBudget(v.length)
    if (!budget) continue
    for (const [k, a] of idx.keys) {
      if (fuzzyBudget(k.length) === 0) continue
      const d = distance(v, k, budget)
      if (d > budget) continue
      if (d < bestD) {
        bestD = d
        best = a
        tie = false
      } else if (d === bestD && best && best.id !== a.id) tie = true
    }
  }
  return best && !tie ? best : null
}
