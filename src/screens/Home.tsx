import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { DiveState } from '../../shared/types'
import { depthFor } from '../../shared/scoring'
import { api } from '../lib/api'
import { setDepth } from '../lib/ocean'
import { go, link } from '../lib/router'
import { MuteButton, useCountdownToMidnight } from '../components/ui'

const RULES = [
  'Seven Bible prompts a day — the same seven for everyone.',
  'You get 25 seconds to name one answer. Small typos are forgiven; wrong answers bounce off, so try again before the clock runs out.',
  'Rare answers score big. Obvious ones float near the surface.',
  'Every point sinks you 10 metres. A perfect 700 reaches the trench floor at 7,000 m.',
  'One dive per day. Missed a day? Catch up in the archive.',
]

export function Home({ today }: { today: number }) {
  const [rules, setRules] = useState(false)
  const [mine, setMine] = useState<DiveState | null>(null)
  const left = useCountdownToMidnight()

  useEffect(() => {
    setDepth(0)
    api<DiveState>(`/dive/${today}`)
      .then(setMine)
      .catch(() => {})
  }, [today])

  const started = !!mine && (mine.current > 0 || !!mine.open)
  const done = !!mine?.done

  return (
    <div className="relative z-10 flex min-h-[100dvh] flex-col">
      <div className="flex justify-end gap-2 p-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <button className="btn-ghost h-9 rounded-full px-4 font-mono text-[11px] uppercase tracking-[0.2em]" onClick={() => setRules((r) => !r)} aria-expanded={rules}>
          how to play
        </button>
        <MuteButton />
      </div>

      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.2, 0, 0, 1] }}
          className="mt-[4vh] flex flex-col items-center gap-2 sm:mt-[6vh]"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-white/80">the daily bible dive</span>
          <h1 className="font-display text-6xl font-extrabold leading-[0.9] tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,30,60,0.5)] sm:text-8xl">
            Into the
            <br />
            Deep
          </h1>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/85 sm:text-xs">7 prompts · 25 seconds each · rarer answers sink deeper</p>
        </motion.div>

        <AnimatePresence>
          {rules && (
            <motion.ol
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass mt-6 flex w-full flex-col gap-2 overflow-hidden rounded-2xl p-5 text-left text-sm leading-relaxed text-white/90"
            >
              {RULES.map((r, i) => (
                <li key={i} className="flex gap-3">
                  <span className="font-mono text-glow">{i + 1}</span>
                  <span>{r}</span>
                </li>
              ))}
              <li className="mt-2 border-t border-white/10 pt-3 text-xs text-white/60">
                500+ prompts, every answer checked against the verses that name it. People &amp; places data:{' '}
                <a className="underline" href="https://github.com/robertrouse/theographic-bible-metadata" target="_blank" rel="noreferrer">
                  Theographic Bible Metadata
                </a>{' '}
                (
                <a className="underline" href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">
                  CC BY-SA 4.0
                </a>
                ).
              </li>
            </motion.ol>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-auto flex w-full flex-col items-center gap-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-10"
        >
          {done && mine ? (
            <div className="glass flex flex-col items-center gap-1 rounded-2xl px-6 py-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/60">today's dive</span>
              <span className="font-display text-3xl font-bold text-glow">{depthFor(mine.total).toLocaleString()}m</span>
              <span className="font-mono text-xs text-amber">{mine.total} pts</span>
              <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">next dive in {left}</span>
            </div>
          ) : null}
          <button
            onClick={() => go(`/dive/${today}`)}
            className="btn-glow w-full max-w-sm rounded-full px-8 py-5 text-lg font-bold uppercase tracking-[0.2em] sm:text-xl"
          >
            {done ? 'See my dive' : started ? '▼ Continue descent ▼' : '▼ Begin descent ▼'}
          </button>
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/70">dive #{today}</span>
          <nav className="grid w-full max-w-sm grid-cols-2 gap-3">
            <a {...link('/archive')} className="btn-ghost glass flex flex-col items-center rounded-2xl px-4 py-3">
              <span className="font-semibold">Archive ⟲</span>
              <span className="text-[11px] text-white/60">past dives</span>
            </a>
            <a {...link('/party')} className="btn-ghost glass relative flex flex-col items-center rounded-2xl px-4 py-3">
              <span className="absolute -top-2 right-3 rounded-full bg-coral px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-ink">online</span>
              <span className="font-semibold">Big Fish 🐟</span>
              <span className="text-[11px] text-white/60">play with friends</span>
            </a>
          </nav>
        </motion.div>
      </main>
    </div>
  )
}
