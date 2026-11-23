import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { ArchiveEntry, DiveState } from '../../shared/types'
import { depthFor } from '../../shared/scoring'
import { api } from '../lib/api'
import { setDepth } from '../lib/ocean'
import { go, link } from '../lib/router'
import { knowledgeVerseOfDay } from '../lib/verses'
import { MuteButton, useCountdownToMidnight } from '../components/ui'

const RULES = [
  'Seven Bible prompts a day — the same seven for everyone. They start gentle and get harder the deeper you go.',
  'You get 25 seconds to name one answer. Small typos are forgiven; wrong answers bounce off, so try again before the clock runs out.',
  'Rare answers score big. Obvious ones float near the surface.',
  'Every point sinks you 10 metres. A perfect 700 reaches the pearl on the trench floor at 7,000 m.',
  'After each prompt, see every answer with its chapter — tap one to read it.',
  'Free Dive is unlimited practice by topic. Big Fish is a party game for 2–12 friends.',
]

/** consecutive finished dives ending today (or yesterday, if today isn't done yet) */
function streakOf(list: ArchiveEntry[], today: number) {
  const done = new Set(list.filter((e) => e.status === 'done').map((e) => e.n))
  let n = done.has(today) ? today : today - 1
  let s = 0
  while (done.has(n)) {
    s++
    n--
  }
  return s
}

export function Home({ today }: { today: number }) {
  const [rules, setRules] = useState(false)
  const [mine, setMine] = useState<DiveState | null>(null)
  const [streak, setStreak] = useState(0)
  const left = useCountdownToMidnight()
  const [verse, verseRef] = knowledgeVerseOfDay(today)

  useEffect(() => {
    setDepth(0)
    api<DiveState>(`/dive/${today}`)
      .then(setMine)
      .catch(() => {})
    api<ArchiveEntry[]>('/archive')
      .then((l) => setStreak(streakOf(l, today)))
      .catch(() => {})
  }, [today])

  const started = !!mine && (mine.current > 0 || !!mine.open)
  const done = !!mine?.done

  const dateLabel = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="relative z-10 flex min-h-[100dvh] flex-col">
      {/* keeps the lower half legible over the bright water */}
      <div aria-hidden className="pointer-events-none fixed inset-x-0 bottom-0 -z-10 h-[55vh] bg-gradient-to-b from-transparent via-[#030812]/55 to-[#030812]/90" />

      <header className="flex items-center justify-between gap-2 px-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory/55">
          {streak > 0 ? (
            <>
              <span className="text-gold">{streak}</span>-day streak
            </>
          ) : (
            <>No. {today}</>
          )}
        </span>
        <div className="flex items-center gap-1">
          <button
            className="h-9 rounded-md px-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-ivory/70 transition hover:text-ivory"
            onClick={() => setRules((r) => !r)}
            aria-expanded={rules}
          >
            How to play
          </button>
          <MuteButton />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.2, 0, 0, 1] }}
          className="mt-[7vh] flex flex-col items-center sm:mt-[9vh]"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-ivory/55">{dateLabel}</span>
          <h1 className="mt-4 font-display text-[clamp(3.4rem,13vw,6.75rem)] font-semibold leading-[0.9] tracking-[0.06em] text-[#f1e3c2] [text-shadow:0_2px_30px_rgba(0,0,0,0.45)]">
            Biblio
          </h1>
          <div aria-hidden className="mt-5 flex items-center gap-3 text-gold/70">
            <span className="h-px w-10 bg-current" />
            <svg width="9" height="9" viewBox="0 0 10 10"><path d="M5 0 10 5 5 10 0 5Z" fill="currentColor" /></svg>
            <span className="h-px w-10 bg-current" />
          </div>
          <blockquote className="mt-5 max-w-md font-serif text-xl italic leading-snug text-ivory/85 sm:text-[1.45rem]">
            “{verse}”
            <footer className="mt-2 text-[10px] font-semibold not-italic uppercase tracking-[0.26em] text-gold/75">{verseRef} · KJV</footer>
          </blockquote>
        </motion.div>

        <AnimatePresence>
          {rules && (
            <motion.ol
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8 flex w-full max-w-lg flex-col gap-2.5 overflow-hidden rounded-xl border border-ivory/10 bg-[#050b18]/80 p-5 text-left text-sm leading-relaxed text-ivory/85 backdrop-blur-md"
            >
              {RULES.map((r, i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-5 shrink-0 font-display text-gold/80">{['I', 'II', 'III', 'IV', 'V', 'VI'][i]}</span>
                  <span>{r}</span>
                </li>
              ))}
              <li className="mt-1 border-t border-ivory/10 pt-3 text-xs text-ivory/55">
                400+ hand-written questions about people, places, events, animals, roles, food and more. Every one has many answers, each
                checked against the chapter that names it.
              </li>
            </motion.ol>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="mt-auto flex w-full max-w-md flex-col items-center pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-10"
        >
          {done && mine && (
            <p className="mb-4 flex flex-wrap items-baseline justify-center gap-x-3 text-sm text-ivory/60">
              <span>Today you reached</span>
              <span className="font-display text-2xl text-[#f1e3c2]">{depthFor(mine.total).toLocaleString()} m</span>
              <span className="text-ivory/40">·</span>
              <span>{mine.total} pts</span>
            </p>
          )}
          <button
            onClick={() => go(`/dive/${today}`)}
            className="h-14 w-full rounded-lg bg-[#ecdcb4] text-[13px] font-bold uppercase tracking-[0.2em] text-[#14100a] shadow-[0_10px_40px_-12px_rgba(236,200,140,0.6)] transition hover:-translate-y-px hover:bg-[#f4e6c3] active:translate-y-px"
          >
            {done ? 'See my dive' : started ? 'Continue today\'s dive' : 'Begin today\'s dive'}
          </button>
          <span className="mt-3 text-xs text-ivory/45">{done ? `Next dive in ${left}` : `Dive No. ${today} · 7 questions · 25 seconds each`}</span>

          <nav className="mt-8 grid w-full grid-cols-3 divide-x divide-ivory/10 border-y border-ivory/10">
            <ModeLink href="/free" title="Free Dive" sub="Practice by topic" icon={<WaveIcon />} />
            <ModeLink href="/party" title="Big Fish" sub="Play with friends" icon={<FishIcon />} />
            <ModeLink href="/archive" title="Archive" sub="Past dives" icon={<ScrollIcon />} />
          </nav>

        </motion.div>
      </main>
    </div>
  )
}

function ModeLink({ href, title, sub, icon }: { href: string; title: string; sub: string; icon: React.ReactNode }) {
  return (
    <a {...link(href)} className="group flex flex-col items-center gap-1.5 px-2 py-4 transition hover:bg-ivory/[0.04]">
      <span className="text-gold/80 transition group-hover:text-gold">{icon}</span>
      <span className="font-serif text-lg font-semibold leading-none text-ivory">{title}</span>
      <span className="text-[11px] text-ivory/50">{sub}</span>
    </a>
  )
}

const iconProps = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
const WaveIcon = () => (
  <svg {...iconProps} aria-hidden>
    <path d="M2 9c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" />
    <path d="M2 14c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" />
    <path d="M2 19c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" />
  </svg>
)
const FishIcon = () => (
  <svg {...iconProps} aria-hidden>
    <path d="M2 12c3.5-5 9-6.5 14-3.5L21 5v14l-5-3.5C11 18.5 5.5 17 2 12Z" />
    <circle cx="7" cy="11" r="0.6" fill="currentColor" />
  </svg>
)
const ScrollIcon = () => (
  <svg {...iconProps} aria-hidden>
    <path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7" />
    <path d="M6 4a2 2 0 0 0-2 2v1h4V6a2 2 0 0 0-2-2Z" />
    <path d="M7 20a2 2 0 0 1-2-2V7M10 9h6M10 12h6M10 15h4" />
  </svg>
)
