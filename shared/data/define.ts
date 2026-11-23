import type { Answer, Question } from '../types'
import { key } from '../match'

const slug = (s: string) => key(s) || 'x'

/** references are kept at chapter level ("Ge6"), never verse level */
export const chapterRef = (ref: string) => ref.trim().replace(/:\d+.*$/, '')

function parseAnswers(id: string, block: string): Answer[] {
  const answers: Answer[] = []
  const seen = new Set<string>()
  for (const rawLine of block.split(/[\n;]/)) {
    const line = rawLine.trim()
    if (!line) continue
    // names may themselves contain ':' (e.g. "John 3:16"), so read level and ref from the right
    const m = line.match(/^(.+):([0-5]):(\d?[A-Za-z]+\d+(?::\d+)?)$/)
    if (!m) throw new Error(`[${id}] malformed line: ${line}`)
    const names = m[1].split('|').map((s) => s.trim()).filter(Boolean)
    const level = Number(m[2])
    const ref = chapterRef(m[3])
    if (!names.length || !Number.isInteger(level) || level < 0 || level > 5 || !ref || /[?]/.test(line))
      throw new Error(`[${id}] malformed line: ${line}`)
    let aid = slug(names[0])
    while (seen.has(aid)) aid += '_'
    seen.add(aid)
    answers.push({ id: aid, name: names[0], aliases: names, level, ref })
  }
  return answers
}

/** Build a question from the compact `Name|Alias:level:Ref` block format. Throws on malformed lines. */
export function q(id: string, text: string, category: string, block: string): Question {
  return { id, text, category, answers: parseAnswers(id, block) }
}

/**
 * Parse a question bank:
 *
 *   @id|Category|Question text
 *   Name|Alias:level:Ref; Name:level:Ref
 *   Name:level:Ref
 *
 * Answers are separated by `;` or new lines. level 5 = everyone says it … 0 = very obscure.
 */
export function bank(src: string): Question[] {
  const out: Question[] = []
  for (const chunk of src.split(/^@/m).slice(1)) {
    const nl = chunk.indexOf('\n')
    const head = (nl < 0 ? chunk : chunk.slice(0, nl)).trim()
    const [id, category, ...text] = head.split('|').map((s) => s.trim())
    if (!id || !category || !text.length) throw new Error(`bad question header: ${head}`)
    out.push({ id, text: text.join('|'), category, answers: parseAnswers(id, nl < 0 ? '' : chunk.slice(nl + 1)) })
  }
  return out
}
