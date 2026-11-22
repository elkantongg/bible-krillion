import type { Question } from '../types'
import { key } from '../match'
import { people } from './people'
import { world } from './world'

export const QUESTIONS: Question[] = [...people, ...world]
export const QUESTION_BY_ID = new Map(QUESTIONS.map((q) => [q.id, q]))

/** every alias key of every question — used to stop fuzzy matching a real name into the wrong question */
export const ALL_KEYS = new Set<string>()
for (const q of QUESTIONS) for (const a of q.answers) for (const al of a.aliases) ALL_KEYS.add(key(al))
