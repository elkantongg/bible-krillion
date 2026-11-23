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

// ── keyword suggestions ("did you mean …?") ────────────────────────────────

const STOP = new Set(
  ('a an the of in on at to into onto from by with and or for his her their its him them he she they it ' +
    'is was were be been who that this what when where which as up out over through about after before ' +
    'jesus christ god lord one some man men woman women time story people person someone thing things did does do got went came go goes very really just').split(' '),
)

/** crude stem: "walks"/"walking"/"walked" → "walk", "lepers" → "leper", "jairuss" → "jairus" */
export function stem(w: string): string {
  for (const suf of ['ings', 'ing', 'ies', 'ed', 'es', 's']) {
    if (w.endsWith(suf) && w.length - suf.length >= 3) return suf === 'ies' ? w.slice(0, -3) + 'y' : w.slice(0, -suf.length)
  }
  return w
}

/** words that mean the same thing in these answers, folded to one form */
const SAME: Record<string, string> = {}
for (const group of [
  'feed fed feeds feeding feeds',
  'die died dies dying dead death deaths',
  'kill killed kills killing slay slain slew slays murder murdered',
  'heal heals healed healing cure cured cures restore restored',
  'raise raised raising rise rose risen resurrect resurrected resurrection',
  'blind blinded blindness',
  'free freed release released escape escaped escapes',
  'walk walked walks walking',
  'part parted parting split divided',
  'calm calmed calming still stilled stilling',
  'cast casting drive drove driven',
  'demon demons devil devils',
  'boat ship',
  'snake serpent snakes serpents viper',
  'stone stoned stoning',
  'baptize baptized baptise baptised baptism',
  'fall fell fallen',
  'swallow swallowed swallowing',
  'fish fishes',
  'big great huge giant',
  'five 5',
  'four 4',
  'thousand 000',
]) {
  const ws = group.split(' ')
  for (const w of ws) SAME[w] = ws[0]
}

const FOLDED = new Set(Object.values(SAME))

const words = (s: string) =>
  norm(s.replace(/['’]s?(?![a-z])/gi, ''))
    .replace(/\b(\d+)000\b/g, '$1 000') // 5000 → 5 000 → five thousand
    .split(' ')
    .filter((w) => w && !STOP.has(w))
    .map((w) => SAME[w] ?? w)

/** same word, same stem or same meaning (synonyms are folded in `words`) */
const sameWord = (a: string, b: string) => a === b || stem(a) === stem(b)

function wordHit(input: string, target: string): boolean {
  const a = stem(input)
  const b = stem(target)
  if (a === b) return true
  if (a.length >= 4 && b.startsWith(a)) return true // "resurrect" → "resurrection"
  if (b.length >= 4 && a.startsWith(b) && a.length - b.length <= 3) return true
  const budget = a.length >= 5 && b.length >= 5 ? (a.length >= 9 ? 2 : 1) : 0
  return budget > 0 && distance(a, b, budget) <= budget
}

interface WordIndex {
  /** per answer: the distinct content words of all its aliases, and which were possessives ("Peter's") */
  per: { answer: Answer; words: string[]; owners: string[] }[]
  /** words of the question itself — they don't point at any one answer */
  asked: Set<string>
}
const wordCache = new WeakMap<Question, WordIndex>()
function wordsFor(q: Question): WordIndex {
  let w = wordCache.get(q)
  if (w) return w
  w = {
    per: q.answers.map((a) => ({
      answer: a,
      words: [...new Set(a.aliases.flatMap(words))],
      owners: [...new Set(a.aliases.flatMap((al) => [...al.matchAll(/([A-Za-z-]+)['’]s?(?![a-z])/g)].flatMap((m) => words(m[1]))))],
    })),
    asked: new Set(words(q.text).map(stem)),
  }
  wordCache.set(q, w)
  return w
}

interface Ranked {
  answer: Answer
  score: number
  matched: number
}

const EVENTISH = /event|miracle|happen|story|parable|rescue|showdown|request|sign/i

/** answers whose words the player's keywords point at, best first (rarer words weigh more) */
function rank(q: Question, input: string, exclude?: Set<string>, strict = false): { typed: number; list: Ranked[] } {
  const hit = strict ? sameWord : wordHit
  const { per, asked } = wordsFor(q)
  const typed = [...new Set(words(input.slice(0, 80)))].filter((w) => !asked.has(stem(w))).slice(0, 8)
  if (!typed.length) return { typed: 0, list: [] }
  // how many answers each typed word points at
  const hits = typed.map((t) => per.filter((p) => p.words.some((w) => hit(t, w))).length)
  const list: Ranked[] = []
  for (const p of per) {
    if (exclude?.has(p.answer.id)) continue
    let score = 0
    let matched = 0
    let unique = false
    typed.forEach((t, i) => {
      if (p.words.some((w) => hit(t, w))) {
        score += 1 / hits[i]
        matched++
        if (hits[i] === 1) unique = true
      }
    })
    // the player must have named something specific, and either most of what they typed
    // or a word that points at this answer alone ("pentecost holy spirit" → Pentecost)
    if (!matched || score < 0.34) continue
    if (matched * 2 < typed.length && !(unique && typed.length <= 5)) continue
    list.push({ answer: p.answer, score, matched })
  }
  list.sort((a, b) => b.score - a.score || b.matched - a.matched || b.answer.level - a.answer.level)
  return { typed: typed.length, list }
}

/** the answers worth offering as "did you mean …?" — at most `max`, or none when too generic */
function shortlist(r: { list: Ranked[] }, max: number): Ranked[] {
  if (!r.list.length) return []
  const top = r.list[0].score
  const close = r.list.filter((s) => s.score >= top * 0.75)
  return close.length > max ? [] : close
}

/**
 * When `matchAnswer` finds nothing, find the answers the player was probably reaching for
 * from their keywords ("lazarus" → Raising Lazarus, "jesus walks on water" → Walking on water).
 * Words shared by many answers count for less; returns at most `max` names (best first),
 * or nothing when the keywords are too generic to point anywhere specific.
 */
export function suggestAnswers(q: Question, input: string, opts: { max?: number; exclude?: Set<string> } = {}): Answer[] {
  return shortlist(rank(q, input, opts.exclude), opts.max ?? 3).map((s) => s.answer)
}

/**
 * Lenient matching: an exact / alias / typo match, or else a keyword answer that clearly means
 * one answer and nothing else ("lazarus", "jesus walks on water", "the tower") is accepted as is.
 * When the keywords fit a few answers, `suggestions` lists them for a "did you mean …?".
 */
export function resolveAnswer(
  q: Question,
  input: string,
  knownElsewhere?: Set<string>,
  exclude?: Set<string>,
): { hit: Answer | null; suggestions: Answer[] } {
  const exact = matchAnswer(q, input, knownElsewhere)
  if (exact) return { hit: exact, suggestions: [] }
  // Accept outright only when it can't be a different answer: the words typed are words (or
  // synonyms) of exactly one answer — all of them, or at least two plus a few extra words that
  // aren't names ("jericho walls fell"). On questions about people/places, an input that is
  // itself the name of some other Bible person/place asks instead ("David" is not City of David).
  const event = EVENTISH.test(q.category) || EVENTISH.test(q.text)
  const namesOther = !event && !!knownElsewhere && variants(input.slice(0, 80)).some((v) => knownElsewhere.has(v))
  if (!namesOther) {
    const strict = rank(q, input, undefined, true)
    const best = shortlist(strict, 1)[0]
    if (best) {
      const entry = wordsFor(q).per.find((p) => p.answer === best.answer)!
      const typed = words(input.slice(0, 80))
      const extra = typed.filter((w) => !entry.words.some((t) => sameWord(w, t)))
      // a lone name that only appears as an owner ("Peter" → Healing Peter's mother-in-law) asks
      const loneOwner = best.matched === 1 && typed.some((w) => entry.owners.some((o) => sameWord(w, o)))
      const fine =
        !loneOwner &&
        (best.matched === strict.typed ||
          (best.matched * 2 >= strict.typed && extra.every((w) => FOLDED.has(w) || /(ed|ing)$/.test(w) || !knownElsewhere?.has(w))))
      if (fine) return { hit: best.answer, suggestions: [] }
    }
  }
  return { hit: null, suggestions: suggestAnswers(q, input, { exclude }) }
}
