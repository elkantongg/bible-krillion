import type { Answer, Question } from '../types'
import { key } from '../match'
import { people } from './people'
import { world } from './world'
import generatedJson from './generated.json'

type GenRow = { id: string; text: string; category: string; group: string; answers: [string, string[], number, string][] }

export const CURATED: Question[] = [...people, ...world].map((q) => ({ ...q, source: 'curated' as const, group: 'curated' }))

/**
 * Familiarity floor: a name the curated set rates as well-known (e.g. Noah, Eve) stays well-known
 * in generated prompts even if the dataset tags it in few verses.
 */
const curatedLevel = new Map<string, number>()
for (const q of CURATED) for (const a of q.answers) for (const al of a.aliases) curatedLevel.set(key(al), Math.max(curatedLevel.get(key(al)) ?? 0, a.level))

export const GENERATED: Question[] = (generatedJson as GenRow[]).map((g) => {
  const seen = new Set<string>()
  const answers: Answer[] = g.answers.map(([name, aliases, level, ref]) => {
    let id = key(name) || 'x'
    while (seen.has(id)) id += '_'
    seen.add(id)
    return { id, name, aliases: [name, ...aliases], level: Math.max(level, curatedLevel.get(key(name)) ?? 0), ref }
  })
  return { id: g.id, text: g.text, category: g.category, answers, source: 'generated' as const, group: g.group }
})

export const QUESTIONS: Question[] = [...CURATED, ...GENERATED]
export const QUESTION_BY_ID = new Map(QUESTIONS.map((q) => [q.id, q]))

/** every alias key of every question — used to stop fuzzy matching a real name into the wrong question */
export const ALL_KEYS = new Set<string>()
for (const q of QUESTIONS) for (const a of q.answers) for (const al of a.aliases) ALL_KEYS.add(key(al))
