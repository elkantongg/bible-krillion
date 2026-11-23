import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { ArchiveEntry, DiveState } from '../../shared/types'
import { depthFor } from '../../shared/scoring'
import { api } from '../lib/api'
import { setDepth } from '../lib/ocean'
import { go, link } from '../lib/router'
import { verseOfDay } from '../lib/verses'
import { Ichthys, MuteButton, Tilt, useCountdownToMidnight } from '../components/ui'

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
  const [verse, verseRef] = verseOfDay(today)

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

  return (
    <div className="relative z-10 flex min-h-[100dvh] flex-col">
      <div className="flex items-center justify-between gap-2 p-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="flex items-center gap-2">
          {streak > 0 && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-xs font-bold text-amber">
              🔥 {streak} day{streak === 1 ? '' : 's'}
            </motion.span>
          )}
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost h-9 rounded-full px-4 font-mono text-[11px] uppercase tracking-[0.2em]" onClick={() => setRules((r) => !r)} aria-expanded={rules}>
            how to play
          </button>
          <MuteButton />
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.2, 0, 0, 1] }}
          className="relative mt-[2vh] flex flex-col items-center gap-2 sm:mt-[4vh]"
        >
          <span aria-hidden className="absolute -inset-x-16 -inset-y-8 -z-10 rounded-[50%]" style={{ background: 'radial-gradient(closest-side, rgba(6,14,32,0.55), transparent)' }} />
          <Ichthys size={72} animated />
          <span className="eyebrow mt-1 text-ivory/85">the daily bible dive</span>
          <h1 className="text-gilded font-display text-[4.2rem] font-extrabold leading-none tracking-[0.12em] sm:text-8xl">
            BIBLIO
          </h1>
          <motion.blockquote
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 1.2 }}
            className="mt-3 max-w-md font-serif text-lg italic leading-snug text-ivory/90 sm:text-xl"
            style={{ textShadow: '0 2px 14px rgba(0,0,0,0.6)' }}
          >
            “{verse}”
            <footer className="mt-1 font-mono text-[10px] not-italic uppercase tracking-[0.25em] text-gold/90">{verseRef} · KJV</footer>
          </motion.blockquote>
        </motion.div>

        <AnimatePresence>
          {rules && (
            <motion.ol
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass ornate mt-6 flex w-full flex-col gap-2 overflow-hidden rounded-2xl p-5 text-left text-sm leading-relaxed text-white/90"
            >
              {RULES.map((r, i) => (
                <li key={i} className="flex gap-3">
                  <span className="font-display font-bold text-gold">{['I', 'II', 'III', 'IV', 'V', 'VI'][i]}</span>
                  <span>{r}</span>
                </li>
              ))}
              <li className="mt-2 border-t border-white/10 pt-3 text-xs text-white/60">
                500+ hand-written prompts about people, places, events, animals, roles, food and more — every answer checked against the chapter
                that names it.
              </li>
            </motion.ol>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9 }}
          className="mt-auto flex w-full flex-col items-center gap-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-8"
        >
          {done && mine ? (
            <div className="glass glass-gold flex items-center gap-5 rounded-2xl px-6 py-3">
              <div className="flex flex-col items-start">
                <span className="eyebrow text-white/60">today's dive</span>
                <span className="font-display text-3xl font-bold text-gold">{depthFor(mine.total).toLocaleString()}m</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-mono text-sm text-amber">{mine.total} pts</span>
                <span className="eyebrow text-white/50">next in {left}</span>
              </div>
            </div>
          ) : null}
          <button onClick={() => go(`/dive/${today}`)} className="btn-glow w-full max-w-sm whitespace-nowrap rounded-full px-6 py-5 font-display text-base font-bold uppercase tracking-[0.12em] sm:text-xl sm:tracking-[0.18em]">
            {done ? 'See my dive' : started ? '▼ Continue descent' : '▼ Begin descent'}
          </button>
          <span className="eyebrow text-white/70">dive #{today}</span>

          <nav className="perspective grid w-full max-w-md grid-cols-3 gap-3">
            <Tilt as="a" {...link('/free')} className="glass flex flex-col items-center gap-1 rounded-2xl px-2 py-4">
              <span className="text-2xl" style={{ transform: 'translateZ(30px)' }}>🌊</span>
              <span className="font-display text-sm font-bold">Free Dive</span>
              <span className="text-[11px] text-white/60">unlimited</span>
            </Tilt>
            <Tilt as="a" {...link('/party')} className="glass glass-gold flex flex-col items-center gap-1 rounded-2xl px-2 py-4">
              <span className="absolute -top-2 right-2 rounded-full bg-ruby px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-white">friends</span>
              <span className="text-2xl" style={{ transform: 'translateZ(30px)' }}>🐋</span>
              <span className="font-display text-sm font-bold">Big Fish</span>
              <span className="text-[11px] text-white/60">2–12 online</span>
            </Tilt>
            <Tilt as="a" {...link('/archive')} className="glass flex flex-col items-center gap-1 rounded-2xl px-2 py-4">
              <span className="text-2xl" style={{ transform: 'translateZ(30px)' }}>📜</span>
              <span className="font-display text-sm font-bold">Archive</span>
              <span className="text-[11px] text-white/60">past dives</span>
            </Tilt>
          </nav>
        </motion.div>
      </main>
    </div>
  )
}
