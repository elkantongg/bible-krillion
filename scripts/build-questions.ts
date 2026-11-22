/**
 * Generates Bible questions from Theographic Bible Metadata (CC BY-SA 4.0,
 * https://github.com/robertrouse/theographic-bible-metadata).
 *
 *   pnpm questions:fetch   # downloads the JSON into data/theographic/ (gitignored)
 *   pnpm questions:build   # writes shared/data/generated.json
 *
 * Every answer is a person/place the dataset tags in a real verse inside the question's scope,
 * with that verse as its reference. Commonness levels come from total verse mentions.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { people as curatedPeople } from '../shared/data/people'
import { world as curatedWorld } from '../shared/data/world'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const L = (f: string) => JSON.parse(readFileSync(resolve(root, 'data/theographic', f + '.json'), 'utf8')) as { id: string; fields: any }[]

const MIN_ANSWERS = 20
const TARGET_TOTAL = Number(process.env.TARGET ?? 520)

// ---------- load ----------
const books = L('books').sort((a, b) => a.fields.bookOrder - b.fields.bookOrder)
const bookById = new Map(books.map((b, i) => [b.id, i]))
const verses = L('verses')
const people = L('people')
const places = L('places')

const BAN_PEOPLE = new Set(['God', 'Holy Spirit', 'Lord'])
const PROPER = /^[A-Z][a-z'-]+(?: [A-Z][a-z'-]+)*(?: I{1,3})?$/
const PLACE_OK = /^[A-Z][A-Za-z-]+(?: [A-Z][a-z-]+)*$/

interface Ent {
  name: string
  aliases: Set<string>
  count: number
  kind: 'person' | 'place'
  female: boolean
  type?: string
}
const ents = new Map<string, Ent>() // key: kind:name
const personKey = new Map<string, string>() // record id -> ent key
const placeKey = new Map<string, string>()

for (const r of people) {
  const f = r.fields
  const name: string = String(f.name ?? '').trim()
  if (!PROPER.test(name) || BAN_PEOPLE.has(name)) continue
  const k = 'person:' + name
  const e = ents.get(k) ?? { name, aliases: new Set([name]), count: 0, kind: 'person' as const, female: false }
  e.count += Number(f.verseCount ?? 0)
  if (f.gender === 'Female') e.female = true
  if (/ I{1,3}$/.test(name)) e.aliases.add(name.replace(/ I{1,3}$/, ''))
  for (const a of String(f.alsoCalled ?? '').split(',')) if (PROPER.test(a.trim())) e.aliases.add(a.trim())
  ents.set(k, e)
  personKey.set(r.id, k)
}
for (const r of places) {
  const f = r.fields
  const name: string = String(f.displayTitle ?? f.kjvName ?? '').trim()
  if (!PLACE_OK.test(name)) continue
  const k = 'place:' + name
  const e = ents.get(k) ?? { name, aliases: new Set([name]), count: 0, kind: 'place' as const, female: false, type: f.featureType }
  e.count += Number(f.verseCount ?? 0)
  for (const a of [f.kjvName, f.esvName]) if (a && PLACE_OK.test(String(a))) e.aliases.add(String(a))
  ents.set(k, e)
  placeKey.set(r.id, k)
}

// per verse: book index, chapter, ref, entity keys
interface V {
  b: number
  c: number
  ref: string
  ot: boolean
  ents: string[]
  /** entity keys tagged here via a female person record (gender is per record, not per name) */
  fem: Set<string>
}
const femaleIds = new Set(people.filter((r) => r.fields.gender === 'Female').map((r) => r.id))
const vs: V[] = []
for (const r of verses) {
  const f = r.fields
  const b = bookById.get(f.book?.[0])
  if (b == null) continue
  const [osis, ch, vn] = String(f.osisRef).split('.')
  const es: string[] = []
  const fem = new Set<string>()
  const ot = books[b].fields.testament === 'Old Testament'
  for (const id of f.people ?? []) {
    const k = personKey.get(id)
    // the dataset tags some OT passages (e.g. messianic texts) with Jesus — keep answers literal
    if (!k || (ot && k === 'person:Jesus')) continue
    es.push(k)
    if (femaleIds.has(id)) fem.add(k)
  }
  for (const id of f.places ?? []) {
    const k = placeKey.get(id)
    if (k) es.push(k)
  }
  vs.push({ b, c: Number(ch), ref: `${osis}${ch}:${vn}`, ot, ents: es, fem })
}

const level = (n: number) => (n >= 400 ? 5 : n >= 120 ? 4 : n >= 40 ? 3 : n >= 12 ? 2 : n >= 4 ? 1 : 0)

type Pick = (e: Ent, female: boolean) => boolean
/** collect entity -> first ref over a verse subset */
function collect(sub: V[], pick: Pick) {
  const out = new Map<string, string>()
  for (const v of sub) for (const k of v.ents) if (!out.has(k) && pick(ents.get(k)!, v.fem.has(k))) out.set(k, v.ref)
  return out
}
const MAX_ANSWERS = 400 // whole-book prompts can be big; co-occurrence prompts cap at 300

interface GenQ {
  id: string
  text: string
  category: string
  group: string
  answers: [string, string[], number, string][]
}
const qs: GenQ[] = []
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

function add(id: string, text: string, category: string, group: string, found: Map<string, string>, max = MAX_ANSWERS) {
  if (found.size < MIN_ANSWERS || found.size > max) return
  const claimed = new Map<string, string>()
  // spelling variants of one name (e.g. "Rab-saris" / "Rabsaris") collapse to the most-mentioned entry
  const list = [...found.entries()]
    .sort((a, b) => ents.get(b[0])!.count - ents.get(a[0])!.count)
    .filter(([k]) => {
      const n = norm(ents.get(k)!.name)
      if (claimed.has(n)) return false
      claimed.set(n, k)
      return true
    })
  if (list.length < MIN_ANSWERS) return
  const answers: GenQ['answers'] = []
  for (const [k, ref] of list) {
    const e = ents.get(k)!
    const aliases = [e.name]
    for (const a of e.aliases) {
      const n = norm(a)
      if (a === e.name || (claimed.has(n) && claimed.get(n) !== k)) continue
      claimed.set(n, k)
      aliases.push(a)
    }
    answers.push([e.name, aliases.slice(1), level(e.count), ref])
  }
  qs.push({ id, text, category, group, answers })
}

const isPerson: Pick = (e) => e.kind === 'person'
const isPlace: Pick = (e) => e.kind === 'place'
const bookName = (i: number) => books[i].fields.bookName as string
const osis = (i: number) => books[i].fields.osisName as string

/** split a book into chapter ranges that each hold roughly `target` distinct entities */
function chunks(bi: number, pick: Pick, target: number) {
  const bv = vs.filter((v) => v.b === bi)
  const maxC = Math.max(...bv.map((v) => v.c))
  const ranges: [number, number][] = []
  let start = 1
  let seen = new Set<string>()
  for (let c = 1; c <= maxC; c++) {
    for (const v of bv) if (v.c === c) for (const k of v.ents) if (pick(ents.get(k)!, v.fem.has(k))) seen.add(k)
    if (seen.size >= target && c < maxC) {
      ranges.push([start, c])
      start = c + 1
      seen = new Set()
    }
  }
  if (start <= maxC) {
    if (seen.size < MIN_ANSWERS && ranges.length) ranges[ranges.length - 1][1] = maxC
    else ranges.push([start, maxC])
  }
  return ranges.length > 1 ? ranges : []
}

// ---------- generators ----------
// A/C. whole books
books.forEach((_b, i) => {
  const sub = vs.filter((v) => v.b === i)
  add(`g-people-${osis(i)}`, `Name a person mentioned in ${bookName(i)}`, 'People', osis(i), collect(sub, isPerson))
  add(`g-places-${osis(i)}`, `Name a place mentioned in ${bookName(i)}`, 'Places', osis(i), collect(sub, isPlace))
  add(`g-women-${osis(i)}`, `Name a woman mentioned in ${bookName(i)}`, 'People', osis(i), collect(sub, (e, f) => e.kind === 'person' && f))
})

// B. chapter ranges of big books
const chunkTarget = Number(process.env.CHUNK ?? 30)
books.forEach((_b, i) => {
  for (const [kind, pick, target] of [
    ['people', isPerson, chunkTarget],
    ['places', isPlace, chunkTarget],
  ] as const) {
    for (const [a, z] of chunks(i, pick, target)) {
      const sub = vs.filter((v) => v.b === i && v.c >= a && v.c <= z)
      const span = a === z ? `${a}` : `${a}–${z}`
      add(
        `g-${kind}-${osis(i)}-${a}-${z}`,
        `Name a ${kind === 'people' ? 'person' : 'place'} mentioned in ${bookName(i)} ${span}`,
        kind === 'people' ? 'People' : 'Places',
        osis(i),
        collect(sub, pick),
      )
    }
  }
})

// D/E. divisions
const DIV_LABEL: Record<string, string> = {
  Pentateuch: 'the Pentateuch (Genesis–Deuteronomy)',
  Historical: 'the historical books (Joshua–Esther)',
  'Poetry-Wisdom': 'the poetry & wisdom books (Job–Song of Songs)',
  'Major Prophets': 'the Major Prophets (Isaiah–Daniel)',
  'Minor Prophets': 'the Minor Prophets (Hosea–Malachi)',
  Gospels: 'the four Gospels',
  'Pauline Epistles': "Paul's letters",
  'General Epistles': 'the general letters (Hebrews–Jude)',
}
for (const [div, label] of Object.entries(DIV_LABEL)) {
  const sub = vs.filter((v) => books[v.b].fields.bookDiv === div)
  add(`g-div-people-${norm(div)}`, `Name a person mentioned in ${label}`, 'People', 'div', collect(sub, isPerson))
  add(`g-div-women-${norm(div)}`, `Name a woman mentioned in ${label}`, 'People', 'div', collect(sub, (e, f) => e.kind === 'person' && f))
  add(`g-div-places-${norm(div)}`, `Name a place mentioned in ${label}`, 'Places', 'div', collect(sub, isPlace))
}

// F/G. first letters (OT, NT, places)
const ot = vs.filter((v) => books[v.b].fields.testament === 'Old Testament')
const nt = vs.filter((v) => books[v.b].fields.testament !== 'Old Testament')
for (const ch of 'ABCDEFGHIJKLMNOPRSTUZ') {
  add(`g-letter-ot-${ch}`, `Name an Old Testament person whose name begins with ${ch}`, 'Word play', 'letters', collect(ot, (e) => isPerson(e) && e.name[0] === ch))
  add(`g-letter-nt-${ch}`, `Name a New Testament person whose name begins with ${ch}`, 'Word play', 'letters', collect(nt, (e) => isPerson(e) && e.name[0] === ch))
  add(`g-letter-place-${ch}`, `Name a Bible place whose name begins with ${ch}`, 'Word play', 'letters', collect(vs, (e) => isPlace(e) && e.name[0] === ch))
}

// H. name length
for (let n = 3; n <= 10; n++) {
  add(`g-len-person-${n}`, `Name a Bible person whose name has exactly ${n} letters`, 'Word play', 'length', collect(vs, (e) => isPerson(e) && /^[A-Za-z]+$/.test(e.name) && e.name.length === n))
  add(`g-len-place-${n}`, `Name a Bible place whose name has exactly ${n} letters`, 'Word play', 'length', collect(vs, (e) => isPlace(e) && /^[A-Za-z]+$/.test(e.name) && e.name.length === n))
}

// I. endings
for (const suf of ['iah', 'el', 'ah', 'ai', 'am', 'an', 'ar', 'as', 'on', 'us', 'ezer', 'ith', 'ath', 'ad', 'ab', 'ia', 'ri', 'ul']) {
  add(`g-end-${suf}`, `Name a Bible person whose name ends in “-${suf}”`, 'Word play', 'endings', collect(vs, (e) => isPerson(e) && e.name.toLowerCase().endsWith(suf) && e.name.length > suf.length + 1))
}

// J/K. chapter co-occurrence with famous, unambiguous people and places
const chapterEnts = new Map<string, Set<string>>()
const chapterFirstRef = new Map<string, Map<string, string>>()
for (const v of vs) {
  const ck = `${v.b}.${v.c}`
  const s = chapterEnts.get(ck) ?? new Set()
  const fr = chapterFirstRef.get(ck) ?? new Map()
  for (const k of v.ents) {
    s.add(k)
    if (!fr.has(k)) fr.set(k, v.ref)
  }
  chapterEnts.set(ck, s)
  chapterFirstRef.set(ck, fr)
}
const nameCounts = new Map<string, number>()
for (const r of people) nameCounts.set(r.fields.name, (nameCounts.get(r.fields.name) ?? 0) + 1)
// anchors must be names players recognise: well-mentioned, or rated familiar in the curated set
const familiar = new Map<string, number>()
for (const q of [...curatedPeople, ...curatedWorld]) for (const a of q.answers) familiar.set(a.name, Math.max(familiar.get(a.name) ?? 0, a.level))
const known = (e: Ent) => e.count >= 40 || (familiar.get(e.name) ?? 0) >= 2
const fame = (e: Ent) => e.count + (familiar.get(e.name) ?? 0) * 40
const famousPeople = [...ents.values()]
  .filter((e) => e.kind === 'person' && nameCounts.get(e.name) === 1 && known(e))
  .sort((a, b) => fame(b) - fame(a))
const famousPlaces = [...ents.values()].filter((e) => e.kind === 'place' && known(e)).sort((a, b) => fame(b) - fame(a))

const ANCHOR_LABEL: Record<string, string> = { Pontius: 'Pontius Pilate' }

function coAdd(anchor: Ent, pick: Pick, kindWord: string, cat: string) {
  const ak = `${anchor.kind}:${anchor.name}`
  const found = new Map<string, string>()
  for (const [ck, set] of chapterEnts) {
    if (!set.has(ak)) continue
    for (const k of set) if (k !== ak && !found.has(k) && pick(ents.get(k)!, false)) found.set(k, chapterFirstRef.get(ck)!.get(k)!)
  }
  const label = ANCHOR_LABEL[anchor.name] ?? anchor.name
  const verb = anchor.kind === 'person' ? `alongside ${label}` : `that mentions ${label}`
  add(`g-co-${kindWord}-${anchor.kind}-${norm(anchor.name)}`, `Name a ${kindWord} who appears in a chapter ${verb}`.replace('place who', 'place that'), cat, `co-${kindWord}`, found, 300)
}

const before = qs.length
const remaining = () => TARGET_TOTAL - qs.length
// fill toward the target with co-occurrence questions, alternating sources
let i = 0
while (remaining() > 0 && i < 400) {
  const p = famousPeople[i]
  const pl = famousPlaces[i]
  if (p) coAdd(p, isPerson, 'person', 'People')
  if (pl && remaining() > 0) coAdd(pl, isPerson, 'person', 'Places')
  if (p && remaining() > 0) coAdd(p, isPlace, 'place', 'Places')
  if (!p && !pl) break
  i++
}

// ---------- dedupe near-identical answer sets ----------
const out: GenQ[] = []
for (const q of qs) {
  const s = new Set(q.answers.map((a) => a[0]))
  const dup = out.some((o) => {
    if (Math.abs(o.answers.length - q.answers.length) > Math.max(o.answers.length, q.answers.length) * 0.15) return false
    let inter = 0
    for (const a of o.answers) if (s.has(a[0])) inter++
    return inter / (s.size + o.answers.length - inter) > 0.85
  })
  if (!dup) out.push(q)
}

writeFileSync(resolve(root, 'shared/data/generated.json'), JSON.stringify(out))
const total = out.reduce((n, q) => n + q.answers.length, 0)
const byCat: Record<string, number> = {}
for (const q of out) byCat[q.group] = (byCat[q.group] ?? 0) + 1
console.log(`questions: ${out.length} (co-occurrence added ${qs.length - before}, dropped ${qs.length - out.length} near-duplicates)`)
console.log(`answers: ${total}`, (byCat['co-person'] ?? 0) + (byCat['co-place'] ?? 0), 'co,', byCat.letters ?? 0, 'letters,', byCat.length ?? 0, 'length,', byCat.endings ?? 0, 'endings,', byCat.div ?? 0, 'divisions')
