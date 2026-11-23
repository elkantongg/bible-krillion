import type { Difficulty, Question } from '../types'
import { key } from '../match'
import { people } from './people'
import { world } from './world'
import { peopleBank } from './bank-people'
import { namesBank } from './bank-names'
import { placesBank } from './bank-places'
import { eventsBank } from './bank-events'
import { natureBank } from './bank-nature'
import { thingsBank } from './bank-things'
import { moreBank } from './bank-more'
import { extraBank } from './bank-extra'
import { finalBank } from './bank-final'

/** older curated categories folded into the current set */
const CATEGORY_ALIAS: Record<string, string> = { Creation: 'Nature' }

/**
 * Difficulty = how easy it is to think of *any* answer: the familiarity of the three best-known
 * answers (+1 when there are many well-known ones). 1 = easy, 2 = medium, 3 = hard.
 */
export function difficultyOf(q: Pick<Question, 'answers'>): Difficulty {
  const levels = q.answers.map((a) => a.level).sort((a, b) => b - a)
  const t = levels.slice(0, 3).reduce((s, x) => s + x, 0) + (levels.filter((x) => x >= 4).length >= 6 ? 1 : 0)
  if (t >= 15) return 1
  if (t >= 13) return 2
  return 3
}

const finish = (q: Question, source: Question['source']): Question => {
  const category = CATEGORY_ALIAS[q.category] ?? q.category
  return { ...q, category, source, group: category, difficulty: difficultyOf(q) }
}

export const CURATED: Question[] = [
  ...[...people, ...world].map((q) => finish(q, 'curated')),
  ...[...peopleBank, ...namesBank, ...placesBank, ...eventsBank, ...natureBank, ...thingsBank, ...moreBank, ...extraBank, ...finalBank].map((q) => finish(q, 'curated')),
]

export const QUESTIONS: Question[] = CURATED
export const QUESTION_BY_ID = new Map(QUESTIONS.map((q) => [q.id, q]))
export const CATEGORIES = [...new Set(QUESTIONS.map((q) => q.category))].sort()

/** every alias key of every question — used to stop fuzzy matching a real name into the wrong question */
export const ALL_KEYS = new Set<string>()
for (const q of QUESTIONS) for (const a of q.answers) for (const al of a.aliases) ALL_KEYS.add(key(al))
