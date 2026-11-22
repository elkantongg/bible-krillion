import type { Answer, Question } from '../types'
import { key } from '../match'

const slug = (s: string) => key(s) || 'x'

/** Build a question from the compact `Name|Alias:level:Ref` block format. Throws on malformed lines. */
export function q(id: string, text: string, category: string, block: string): Question {
  const answers: Answer[] = []
  const seen = new Set<string>()
  for (const rawLine of block.split('\n')) {
    const line = rawLine.trim()
    if (!line) continue
    const i = line.indexOf(':')
    const j = line.indexOf(':', i + 1)
    if (i < 0 || j < 0) throw new Error(`[${id}] malformed line: ${line}`)
    const names = line.slice(0, i).split('|').map((s) => s.trim()).filter(Boolean)
    const level = Number(line.slice(i + 1, j))
    const ref = line.slice(j + 1).trim()
    if (!names.length || !Number.isInteger(level) || level < 0 || level > 5 || !ref || /[?]/.test(line))
      throw new Error(`[${id}] malformed line: ${line}`)
    let aid = slug(names[0])
    while (seen.has(aid)) aid += '_'
    seen.add(aid)
    answers.push({ id: aid, name: names[0], aliases: names, level, ref })
  }
  return { id, text, category, answers }
}
