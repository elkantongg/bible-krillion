import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { BoardEntry, PracticePrompt, TierKey } from '../../shared/types'
import { depthFor, MAX_DEPTH, tierByKey } from '../../shared/scoring'
import { api } from '../lib/api'
import { setDepth } from '../lib/ocean'
import { sfx } from '../lib/sound'
import { load, save } from '../lib/storage'
import { fmtRef, readUrl } from '../lib/refs'
import { AnimatedNumber, AnswerBoard, Burst, HomeButton, MuteButton, Spinner, TIER_COLOR, TimerRing, useShake } from '../components/ui'

const SECONDS = 25
const TANKS = 3
const DIFFS = [
  { v: 0, label: 'Mixed' },
  { v: 1, label: 'Easy' },
  { v: 2, label: 'Medium' },
  { v: 3, label: 'Hard' },
]
const fmtM = (v: number) => `${Math.round(v).toLocaleString()}m`

type Phase = 'setup' | 'loading' | 'answering' | 'result' | 'over'
interface Landed {
  answer: string | null
  ref: string | null
  tier: TierKey
  points: number
}

export function FreeDive() {
  const [phase, setPhase] = useState<Phase>('setup')
  const [difficulty, setDifficulty] = useState(Number(load('free.diff') ?? 0))
  const [category, setCategory] = useState(load('free.cat') ?? '')
  const [cats, setCats] = useState<string[]>([])
  const [prompt, setPrompt] = useState<PracticePrompt | null>(null)
  const [deadline, setDeadline] = useState(0)
  const [now, setNow] = useState(Date.now())
  const [value, setValue] = useState('')
  const [miss, setMiss] = useState<{ key: number; text: string } | null>(null)
  const [landed, setLanded] = useState<Landed | null>(null)
  const [board, setBoard] = useState<BoardEntry[] | null>(null)
  const [score, setScore] = useState(0)
  const [tanks, setTanks] = useState(TANKS)
  const [count, setCount] = useState(0)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const seen = useRef<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const shakeRef = useShake<HTMLFormElement>(miss?.key)
  const best = Number(load('free.best') ?? 0)

  useEffect(() => {
    setDepth(Math.min(MAX_DEPTH, depthFor(score)) + 110)
  }, [score])
  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then(setCats)
      .catch(() => {})
  }, [])

  const next = useCallback(async () => {
    setPhase('loading')
    setErr('')
    try {
      const p = await api<PracticePrompt>('/practice/next', { difficulty: difficulty || undefined, category: category || undefined, exclude: seen.current })
      seen.current = [...seen.current, p.id].slice(-60)
      setPrompt(p)
      setValue('')
      setMiss(null)
      setLanded(null)
      setBoard(null)
      setDeadline(Date.now() + SECONDS * 1000)
      setPhase('answering')
      setTimeout(() => inputRef.current?.focus(), 40)
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Could not load a prompt')
      setPhase('setup')
    }
  }, [difficulty, category])

  const finishPrompt = useCallback(
    (l: Landed) => {
      setLanded(l)
      setPhase('result')
      setCount((c) => c + 1)
      if (l.points) {
        sfx.land(l.points)
        setScore((s) => s + l.points)
      } else {
        sfx.miss()
        setTanks((t) => t - 1)
      }
      if (prompt)
        api<BoardEntry[]>(`/board/${encodeURIComponent(prompt.id)}`)
          .then(setBoard)
          .catch(() => {})
    },
    [prompt],
  )

  // clock
  useEffect(() => {
    if (phase !== 'answering') return
    let lastSec = -1
    const id = setInterval(() => {
      const t = Date.now()
      setNow(t)
      const left = Math.ceil((deadline - t) / 1000)
      if (left <= 5 && left > 0 && left !== lastSec) sfx.tick()
      lastSec = left
      if (t >= deadline) finishPrompt({ answer: null, ref: null, tier: 'none', points: 0 })
    }, 100)
    return () => clearInterval(id)
  }, [phase, deadline, finishPrompt])

  useEffect(() => {
    if (phase === 'result' && tanks <= 0) {
      const t = setTimeout(() => {
        setPhase('over')
        if (score > best) save('free.best', String(score))
        sfx.win()
      }, 2200)
      return () => clearTimeout(t)
    }
  }, [phase, tanks, score, best])

  async function submit() {
    if (!prompt || busy || phase !== 'answering') return
    const text = value.trim()
    if (!text) return
    setBusy(true)
    sfx.blub()
    try {
      const r = await api<{ ok: true; answer: string; ref: string; tier: TierKey; points: number } | { ok: false; reason: string }>('/practice/answer', { id: prompt.id, text })
      if (r.ok) finishPrompt({ answer: r.answer, ref: r.ref, tier: r.tier, points: r.points })
      else {
        sfx.miss()
        setMiss({ key: Date.now(), text })
        setValue('')
        inputRef.current?.focus()
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  const restart = () => {
    setScore(0)
    setTanks(TANKS)
    setCount(0)
    void next()
  }

  useEffect(() => {
    if (phase !== 'result' || tanks <= 0) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        void next()
      }
    }
    const t = setTimeout(() => window.addEventListener('keydown', onKey), 350)
    return () => {
      clearTimeout(t)
      window.removeEventListener('keydown', onKey)
    }
  }, [phase, tanks, next])

  const left = Math.max(0, deadline - now)
  const secs = Math.ceil(left / 1000)

  return (
    <div className="relative z-10 flex min-h-[100dvh] flex-col">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10" style={{ background: 'radial-gradient(80% 50% at 50% 45%, rgba(3,16,36,0.6), transparent 80%)' }} />
      <header className="sticky top-0 z-20 px-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <div className="mx-auto flex max-w-3xl items-center gap-2">
          <HomeButton />
          <div className="glass glass-hud flex min-w-[96px] flex-col rounded-2xl px-3 py-1.5">
            <span className="eyebrow text-[9px] text-white/55">depth</span>
            <span className="font-mono text-lg font-bold text-gold">
              <AnimatedNumber value={depthFor(score)} format={fmtM} duration={2} />
            </span>
          </div>
          <div className="flex flex-1 flex-col items-center">
            <span className="font-display text-base font-bold tracking-wide">Free Dive</span>
            <span className="flex gap-1" aria-label={`${tanks} air tanks left`}>
              {Array.from({ length: TANKS }, (_, i) => (
                <motion.span key={i} animate={{ scale: i < tanks ? 1 : 0.7, opacity: i < tanks ? 1 : 0.25 }} className="text-sm">
                  🫧
                </motion.span>
              ))}
            </span>
          </div>
          <div className="glass glass-hud flex min-w-[72px] flex-col items-end rounded-2xl px-3 py-1.5">
            <span className="eyebrow text-[9px] text-white/55">score</span>
            <span className="font-mono text-lg font-bold text-amber">
              <AnimatedNumber value={score} />
            </span>
          </div>
          <MuteButton />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pb-6 pt-4">
        <AnimatePresence mode="wait">
          {phase === 'setup' && (
            <motion.section key="setup" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
              <div>
                <h1 className="text-gilded font-display text-5xl font-extrabold">Free Dive</h1>
                <p className="mx-auto mt-3 max-w-md text-white/80">
                  Unlimited prompts, as deep as you can go. Three air tanks — every prompt that runs out of time costs one. Pick a depth and a topic.
                </p>
              </div>
              <div className="glass ornate w-full max-w-md rounded-2xl p-5">
                <p className="eyebrow mb-2 text-white/60">difficulty</p>
                <div className="grid grid-cols-4 gap-2">
                  {DIFFS.map((d) => (
                    <button key={d.v} data-on={difficulty === d.v} onClick={() => (setDifficulty(d.v), save('free.diff', String(d.v)))} className="chip rounded-xl py-2 text-sm font-semibold">
                      {d.label}
                    </button>
                  ))}
                </div>
                <p className="eyebrow mb-2 mt-5 text-white/60">topic</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['', ...cats].map((c) => (
                    <button key={c || 'all'} data-on={category === c} onClick={() => (setCategory(c), save('free.cat', c))} className="chip rounded-full px-3 py-1.5 text-[13px]">
                      {c || 'Everything'}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={restart} className="btn-glow w-full max-w-sm rounded-full py-4 font-display text-lg font-bold uppercase tracking-[0.18em]">
                ▼ Dive in
              </button>
              {best > 0 && <p className="eyebrow text-white/55">your best · {best} pts · {depthFor(best).toLocaleString()}m</p>}
              {err && <p className="text-sm text-coral">{err}</p>}
            </motion.section>
          )}

          {phase === 'loading' && (
            <motion.div key="load" className="flex flex-1 items-center justify-center" exit={{ opacity: 0 }}>
              <Spinner label="finding a prompt…" />
            </motion.div>
          )}

          {phase === 'answering' && prompt && (
            <motion.section key={`p${prompt.id}`} initial={{ opacity: 0, y: 30, rotateX: 12 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} exit={{ opacity: 0, y: -30 }} className="perspective flex flex-1 flex-col">
              <div className="flex flex-1 flex-col items-center justify-center gap-4 py-6 text-center">
                <span className="eyebrow text-gold/90">
                  #{count + 1} · {prompt.category} · {['', 'easy', 'medium', 'hard'][prompt.difficulty]} · {prompt.answerCount} answers
                </span>
                <h1 className="text-shadow-glow max-w-xl text-balance font-serif text-[2.1rem] font-semibold leading-[1.08] text-ivory sm:text-[3.2rem]">{prompt.text}</h1>
              </div>
              <div className="sticky bottom-0 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
                <AnimatePresence>
                  {miss && (
                    <motion.p key={miss.key} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-2 text-center font-mono text-xs text-coral">
                      “{miss.text}” — no echo from the deep. try again
                    </motion.p>
                  )}
                </AnimatePresence>
                <motion.form
                  ref={shakeRef}
                  onSubmit={(e) => {
                    e.preventDefault()
                    void submit()
                  }}
                  className="glass glass-gold flex items-center gap-2 rounded-2xl p-2"
                >
                  <input
                    ref={inputRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    maxLength={60}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="words"
                    spellCheck={false}
                    enterKeyHint="send"
                    aria-label="Your answer"
                    placeholder="name one…"
                    className="min-w-0 flex-1 bg-transparent px-3 py-3 text-lg text-white placeholder:text-white/40 focus:outline-none sm:text-xl"
                  />
                  <TimerRing frac={left / (SECONDS * 1000)} secs={secs} size={48} urgent={secs <= 5} />
                  <button type="submit" disabled={busy} className="btn-glow rounded-xl px-5 py-3 font-bold uppercase tracking-wider">
                    Dive
                  </button>
                </motion.form>
              </div>
            </motion.section>
          )}

          {phase === 'result' && landed && prompt && (
            <motion.section key={`r${prompt.id}`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -20 }} className="relative flex flex-1 flex-col items-center justify-center gap-3 py-4 text-center">
              <Burst trigger={landed.points ? prompt.id : 0} color={TIER_COLOR[landed.tier]} />
              <p className="eyebrow text-white/55">{prompt.text}</p>
              <motion.div initial={{ rotate: -20, scale: 0.3 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 10 }} className="text-6xl" style={{ filter: `drop-shadow(0 0 24px ${TIER_COLOR[landed.tier]})` }}>
                {landed.points ? tierByKey(landed.tier).emoji : '💨'}
              </motion.div>
              <h2 className="font-display text-3xl font-extrabold" style={{ color: TIER_COLOR[landed.tier] }}>
                {landed.points ? tierByKey(landed.tier).label : 'Out of air'}
              </h2>
              {landed.answer && <p className="font-serif text-3xl font-semibold">“{landed.answer}”</p>}
              <p className="font-mono text-sm font-bold" style={{ color: TIER_COLOR[landed.tier] }}>
                {landed.points ? `+${landed.points} pts · sink ${(landed.points * 10).toLocaleString()}m` : `−1 air tank · ${tanks} left`}
              </p>
              {landed.ref && (
                <a href={readUrl(landed.ref)} target="_blank" rel="noreferrer" className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold/80 hover:underline">
                  📖 read {fmtRef(landed.ref)}
                </a>
              )}
              {board && <AnswerBoard items={board.map((b) => ({ ...b, mine: b.name === landed.answer }))} note="most said → rarest" />}
              {tanks > 0 && (
                <button onClick={() => void next()} autoFocus className="btn-glow mt-2 rounded-full px-10 py-4 text-lg font-bold uppercase tracking-[0.15em]">
                  Next ▼
                </button>
              )}
            </motion.section>
          )}

          {phase === 'over' && (
            <motion.section key="over" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
              <span className="eyebrow text-gold/80">free dive over · {count} prompts</span>
              <h1 className="text-gilded font-display text-6xl font-extrabold">{depthFor(score).toLocaleString()}m</h1>
              <p className="font-mono text-amber">{score} pts</p>
              {score > best ? <p className="font-serif text-xl italic">A new personal best!</p> : <p className="text-white/60">Your best: {best} pts</p>}
              <div className="flex gap-3">
                <button onClick={restart} className="btn-glow rounded-full px-8 py-3 font-bold uppercase tracking-wider">
                  Dive again
                </button>
                <button onClick={() => setPhase('setup')} className="btn-ghost rounded-full px-6 py-3 font-semibold">
                  Change topic
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
