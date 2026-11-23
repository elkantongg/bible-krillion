import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { BoardEntry, DiveState, OpenPrompt, PromptResult } from '../../shared/types'
import { depthFor, PROMPTS_PER_DIVE, TIERS, tierByKey, zoneFor } from '../../shared/scoring'
import { api, ApiError, serverNow, syncClock } from '../lib/api'
import { setDepth } from '../lib/sky'
import { sfx } from '../lib/sound'
import { link } from '../lib/router'
import { AnimatedNumber, AnswerBoard, Burst, HomeButton, MuteButton, Spinner, TIER_COLOR, TierChip, TimerRing, useCountdownToMidnight, useShake } from '../components/ui'
import { fmtRef, readUrl } from '../lib/refs'

type Phase = 'loading' | 'resume' | 'intro' | 'answering' | 'sinking' | 'result' | 'final' | 'error'

const fmtM = (v: number) => `${Math.round(v).toLocaleString()}m`

export function Dive({ n, isToday }: { n: number; isToday: boolean }) {
  const [state, setState] = useState<DiveState | null>(null)
  const [phase, setPhase] = useState<Phase>('loading')
  const [open, setOpen] = useState<OpenPrompt | null>(null)
  const [last, setLast] = useState<PromptResult | null>(null)
  const [error, setError] = useState('')
  const [miss, setMiss] = useState<{ text: string; key: number } | null>(null)
  const [value, setValue] = useState('')
  const [now, setNow] = useState(serverNow())
  const [busy, setBusy] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const expiring = useRef(false)

  // points shown on the HUD lag behind until the sinking animation lands
  const banked = (state?.results ?? []).filter((r) => phase !== 'sinking' || r.idx !== last?.idx).reduce((s, r) => s + r.points, 0)
  useEffect(() => {
    // camera sits a little above the hills so prompts read against open sky
    setDepth(depthFor(banked) + 110)
  }, [banked])

  const fail = (e: unknown) => {
    setError(e instanceof Error ? e.message : 'Something went wrong')
    setPhase('error')
  }

  const openNext = useCallback(
    async (idx: number) => {
      setBusy(true)
      try {
        const o = await api<OpenPrompt>(`/dive/${n}/open`, { idx })
        syncClock(o.serverNow)
        setOpen(o)
        setValue('')
        setMiss(null)
        expiring.current = false
        setPhase('intro')
      } catch (e) {
        if (e instanceof ApiError && e.status === 409) return void load()
        fail(e)
      } finally {
        setBusy(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [n],
  )

  const load = useCallback(async () => {
    setPhase('loading')
    try {
      const s = await api<DiveState>(`/dive/${n}`)
      setState(s)
      if (s.open) syncClock(s.open.serverNow)
      if (s.done) setPhase('final')
      else if (s.open) {
        setOpen(s.open)
        setPhase('intro')
      } else if (s.current === 0) void openNext(0)
      else setPhase('resume')
    } catch (e) {
      fail(e)
    }
  }, [n, openNext])

  useEffect(() => {
    void load()
  }, [load])

  const reveal = useCallback((r: PromptResult, s?: DiveState) => {
    setOpen(null)
    setLast(r)
    setState((prev) => {
      if (s) return s
      if (!prev) return prev
      const results = [...prev.results.filter((x) => x.idx !== r.idx), r].sort((a, b) => a.idx - b.idx)
      return { ...prev, results, current: r.idx + 1, done: results.length === PROMPTS_PER_DIVE, open: null }
    })
    setPhase('sinking')
    if (r.points) sfx.sink()
    window.setTimeout(() => {
      setPhase('result')
      if (r.points) sfx.land(r.points)
      else sfx.miss()
    }, r.points ? 1900 : 700)
  }, [])

  const expire = useCallback(async () => {
    if (!open || expiring.current) return
    expiring.current = true
    try {
      const s = await api<DiveState>(`/dive/${n}/expire`, { idx: open.idx })
      const r = s.results.find((x) => x.idx === open.idx)
      if (r) reveal(r, s)
      else void load()
    } catch (e) {
      expiring.current = false
      if (e instanceof ApiError && e.status === 409) {
        // our clock ran ahead of the server's — try again shortly
        window.setTimeout(() => void expire(), 600)
      } else fail(e)
    }
  }, [open, n, reveal, load])

  // clock
  useEffect(() => {
    if (phase !== 'intro' && phase !== 'answering') return
    let lastSec = -1
    const id = window.setInterval(() => {
      const t = serverNow()
      setNow(t)
      if (!open) return
      if (phase === 'intro' && t >= open.startsAt) {
        setPhase('answering')
        window.setTimeout(() => inputRef.current?.focus(), 30)
      }
      if (phase === 'answering') {
        const left = Math.ceil((open.deadline - t) / 1000)
        if (left <= 5 && left > 0 && left !== lastSec) sfx.tick()
        lastSec = left
        if (t >= open.deadline) void expire()
      }
    }, 100)
    return () => window.clearInterval(id)
  }, [phase, open, expire])

  async function submit() {
    if (!open || busy || phase !== 'answering') return
    const text = value.trim()
    if (!text) {
      setMiss({ text: '', key: Date.now() })
      return
    }
    setBusy(true)
    sfx.blub()
    try {
      const r = await api<
        { status: 'miss'; reason: string; remainingMs: number } | { status: 'locked'; result: PromptResult }
      >(`/dive/${n}/answer`, { idx: open.idx, text })
      if (r.status === 'miss') {
        sfx.miss()
        setMiss({ text, key: Date.now() })
        setValue('')
        inputRef.current?.focus()
      } else reveal(r.result)
    } catch (e) {
      fail(e)
    } finally {
      setBusy(false)
    }
  }

  async function next() {
    if (!state || busy) return
    if (state.current >= PROMPTS_PER_DIVE) {
      setBusy(true)
      try {
        const s = await api<DiveState>(`/dive/${n}`)
        setState(s)
        setPhase('final')
      } catch (e) {
        fail(e)
      } finally {
        setBusy(false)
      }
    } else void openNext(state.current)
  }

  useEffect(() => {
    if (phase !== 'result' && phase !== 'resume') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        void next()
      }
    }
    const t = window.setTimeout(() => window.addEventListener('keydown', onKey), 350)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('keydown', onKey)
    }
  })

  const idx = open?.idx ?? last?.idx ?? state?.current ?? 0
  const promptNo = Math.min(PROMPTS_PER_DIVE, (phase === 'result' || phase === 'sinking' ? idx : (open?.idx ?? state?.current ?? 0)) + 1)

  return (
    <div className="relative z-10 flex min-h-[100dvh] flex-col">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10" style={{ background: 'radial-gradient(80% 50% at 50% 45%, rgba(3,16,36,0.6), transparent 80%)' }} />
      <Hud n={n} depth={depthFor(banked)} score={banked} results={state?.results ?? []} promptNo={promptNo} active={phase !== 'final'} />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 pb-6 pt-2 sm:pt-6">
        <AnimatePresence mode="wait">
          {phase === 'loading' && (
            <motion.div key="load" className="flex flex-1 items-center justify-center" exit={{ opacity: 0 }}>
              <Spinner />
            </motion.div>
          )}

          {phase === 'error' && (
            <motion.div key="err" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
              <p className="font-display text-2xl">The line snapped.</p>
              <p className="text-white/70">{error}</p>
              <div className="flex gap-3">
                <button className="btn-glow rounded-full px-6 py-3 font-semibold" onClick={() => void load()}>
                  Try again
                </button>
                <a {...link('/')} className="btn-ghost rounded-full px-6 py-3">
                  Home
                </a>
              </div>
            </motion.div>
          )}

          {phase === 'resume' && state && (
            <motion.div key="resume" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-white/60">ascent #{n} · paused at prompt {state.current + 1} of 7</p>
              <p className="font-display text-3xl sm:text-4xl">Catch your breath.</p>
              <button className="btn-glow rounded-full px-8 py-4 text-lg font-bold tracking-wide" onClick={() => void next()} disabled={busy}>
                ▲ Continue ascent
              </button>
            </motion.div>
          )}

          {(phase === 'intro' || phase === 'answering') && open && (
            <PromptView
              key={`p${open.idx}`}
              open={open}
              now={now}
              phase={phase}
              value={value}
              setValue={setValue}
              submit={() => void submit()}
              busy={busy}
              miss={miss}
              inputRef={inputRef}
            />
          )}

          {(phase === 'sinking' || phase === 'result') && last && (
            <ResultView key={`r${last.idx}`} r={last} phase={phase} onNext={() => void next()} isLast={last.idx === PROMPTS_PER_DIVE - 1} busy={busy} />
          )}

          {phase === 'final' && state && <FinalView key="final" state={state} isToday={isToday} />}
        </AnimatePresence>
      </main>
    </div>
  )
}

function Hud({ n, depth, score, results, promptNo, active }: { n: number; depth: number; score: number; results: PromptResult[]; promptNo: number; active: boolean }) {
  return (
    <header className="sticky top-0 z-20 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6">
      <div className="mx-auto flex max-w-3xl items-center gap-2 sm:gap-4">
        <div className="glass glass-hud flex min-w-[88px] flex-col rounded-2xl px-3 py-1.5 sm:min-w-[120px] sm:px-4 sm:py-2">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/55">altitude</span>
          <span className="font-mono text-lg font-bold text-glow sm:text-2xl">
            <AnimatedNumber value={depth} format={fmtM} duration={2.2} />
          </span>
        </div>
        <div className="flex flex-1 flex-col items-center gap-1.5">
          <div className="flex gap-1.5">
            {Array.from({ length: PROMPTS_PER_DIVE }, (_, i) => {
              const r = results.find((x) => x.idx === i)
              const cur = active && i === promptNo - 1 && !r
              return (
                <span
                  key={i}
                  className={`h-2.5 w-2.5 rounded-full transition-all duration-500 sm:h-3 sm:w-3 ${cur ? 'scale-125 ring-2 ring-glow/70' : ''}`}
                  style={{ background: r ? TIER_COLOR[r.tier] : cur ? 'rgba(126,246,220,0.35)' : 'rgba(255,255,255,0.15)' }}
                />
              )
            })}
          </div>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/55 sm:text-[10px]">
            #{n} · {active ? `${promptNo} of 7` : 'complete'}
          </span>
        </div>
        <div className="glass glass-hud flex min-w-[72px] flex-col items-end rounded-2xl px-3 py-1.5 sm:min-w-[100px] sm:px-4 sm:py-2">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/55">score</span>
          <span className="font-mono text-lg font-bold text-amber sm:text-2xl">
            <AnimatedNumber value={score} />
          </span>
        </div>
        <div className="hidden flex-col gap-1.5 sm:flex">
          <MuteButton />
          <HomeButton />
        </div>
      </div>
    </header>
  )
}

function PromptView({
  open,
  now,
  phase,
  value,
  setValue,
  submit,
  busy,
  miss,
  inputRef,
}: {
  open: OpenPrompt
  now: number
  phase: Phase
  value: string
  setValue: (s: string) => void
  submit: () => void
  busy: boolean
  miss: { text: string; key: number } | null
  inputRef: React.RefObject<HTMLInputElement | null>
}) {
  const total = open.deadline - open.startsAt
  const left = Math.max(0, open.deadline - Math.max(now, open.startsAt))
  const secs = Math.ceil(left / 1000)
  const frac = left / total
  const startsIn = Math.max(0, Math.ceil((open.startsAt - now) / 1000))
  const urgent = phase === 'answering' && secs <= 5
  const shakeRef = useShake<HTMLFormElement>(miss?.key)

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30, transition: { duration: 0.25 } }}
      transition={{ type: 'spring', stiffness: 120, damping: 18 }}
      className="flex flex-1 flex-col"
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-6 text-center sm:gap-6">
        <span className="eyebrow text-gold/90">
          prompt {open.idx + 1} of 7 · {open.category} · {open.idx < 3 ? 'the hills' : open.idx < 6 ? 'higher' : 'the heights'}
        </span>
        <h1 className="text-shadow-glow max-w-xl text-balance font-serif text-[2.1rem] font-semibold leading-[1.08] text-ivory sm:text-[3.4rem]">{open.text}</h1>
        <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/50">▲ rarer answers climb higher ▲</span>
      </div>

      <div className="sticky bottom-0 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full transition-[width] duration-100 ease-linear"
            style={{
              width: `${phase === 'intro' ? 100 : frac * 100}%`,
              background: urgent ? 'linear-gradient(90deg,#ff7f6e,#ffb36e)' : 'linear-gradient(90deg,#c99a45,#f3d48c)',
              boxShadow: urgent ? '0 0 16px #ff7f6e' : '0 0 14px rgba(243,212,140,0.6)',
            }}
          />
        </div>
        <AnimatePresence>
          {miss && phase === 'answering' && (
            <motion.p
              key={miss.key}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-2 text-center font-mono text-xs text-coral"
              role="status"
            >
              {miss.text ? `“${miss.text}” — that one didn’t take flight. try again` : 'type an answer first'}
            </motion.p>
          )}
        </AnimatePresence>
        <motion.form
          ref={shakeRef}
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
          className="glass flex items-center gap-2 rounded-2xl p-2"
        >
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={phase !== 'answering'}
            maxLength={60}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="words"
            spellCheck={false}
            enterKeyHint="send"
            aria-label="Your answer"
            placeholder={phase === 'intro' ? `get ready… ${startsIn}` : 'name one…'}
            className="min-w-0 flex-1 bg-transparent px-3 py-3 text-lg text-white placeholder:text-white/40 focus:outline-none sm:text-xl"
          />
          <TimerRing frac={phase === 'intro' ? 1 : frac} secs={phase === 'intro' ? 25 : secs} size={48} urgent={urgent} />
          <button type="submit" disabled={phase !== 'answering' || busy} className="btn-glow rounded-xl px-5 py-3 font-bold uppercase tracking-wider">
            Rise
          </button>
        </motion.form>
      </div>
    </motion.section>
  )
}

const ROW = 46

function ResultView({ r, phase, onNext, isLast, busy }: { r: PromptResult; phase: Phase; onNext: () => void; isLast: boolean; busy: boolean }) {
  const t = tierByKey(r.tier)
  const row = TIERS.findIndex((x) => x.key === r.tier)
  const accepted = r.answer && r.raw && r.answer.toLowerCase() !== r.raw.toLowerCase()

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.25 } }}
      className="flex flex-1 flex-col items-center justify-center gap-6 py-4"
    >
      {phase === 'sinking' && row >= 0 && (
        <div className="relative w-full max-w-md" style={{ height: ROW * TIERS.length + 20 }}>
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.key}
              className="absolute inset-x-0 flex items-center justify-between border-t border-dashed px-1 font-mono text-[11px] uppercase tracking-[0.15em]"
              style={{ top: i * ROW + 20, borderColor: `${TIER_COLOR[tier.key]}55`, color: TIER_COLOR[tier.key] }}
              initial={{ opacity: 0.35 }}
              animate={{ opacity: i <= row ? 1 : 0.35 }}
              transition={{ delay: 0.15 + (i / Math.max(1, row)) * 1.1 }}
            >
              <span className="pt-1">{tier.label}</span>
              <span className="pt-1">{tier.points}</span>
            </motion.div>
          ))}
          <motion.div
            className="absolute left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-1.5 font-display text-lg font-semibold"
            style={{ background: 'rgba(3,16,36,0.85)', boxShadow: `0 0 0 1px ${TIER_COLOR[r.tier]}, 0 0 30px ${TIER_COLOR[r.tier]}88`, color: '#fff' }}
            initial={{ top: -30 }}
            animate={{ top: row * ROW + 4 }}
            transition={{ duration: 1.4, ease: [0.3, 0, 0.25, 1.15] }}
          >
            “{r.answer ?? r.raw}”
          </motion.div>
        </div>
      )}

      {phase === 'result' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 160, damping: 16 }}
          className="relative flex w-full max-w-md flex-col items-center gap-3 text-center"
        >
          <Burst trigger={r.points ? r.idx + 1 : 0} color={TIER_COLOR[r.tier]} count={r.points >= 60 ? 40 : 22} />
          <motion.div
            className="text-6xl sm:text-7xl"
            initial={{ rotate: -20, scale: 0.4 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 10 }}
            style={{ filter: `drop-shadow(0 0 24px ${TIER_COLOR[r.tier]})` }}
          >
            {t.emoji}
          </motion.div>
          <h2
            className="font-display text-3xl font-extrabold tracking-wide sm:text-4xl"
            style={{ color: TIER_COLOR[r.tier], textShadow: '0 2px 16px rgba(3,16,36,0.75), 0 0 2px rgba(3,16,36,0.6)' }}
          >
            {t.label}
          </h2>
          <p className="font-serif text-3xl font-semibold text-ivory">{r.answer ? `“${r.answer}”` : '—'}</p>
          {accepted && <p className="-mt-2 font-mono text-[11px] text-white/50">you typed “{r.raw}”</p>}
          {!r.answer && r.raw && <p className="-mt-2 font-mono text-[11px] text-white/50">last guess “{r.raw}” didn’t match</p>}
          <p className="font-mono text-sm font-bold" style={{ color: TIER_COLOR[r.tier] }}>
            {r.points ? `+${r.points} pts · rise ${(r.points * 10).toLocaleString()}m` : '+0 pts'}
          </p>
          <p className="text-white/75">{r.points ? t.blurb : 'Time ran out before anything landed.'}</p>
          {r.ref && (
            <a href={readUrl(r.ref)} target="_blank" rel="noreferrer" className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold/80 hover:underline">
              📖 read {fmtRef(r.ref)}
            </a>
          )}
          <Board questionId={r.questionId} mine={r.answer} />
          <button onClick={onNext} disabled={busy} autoFocus className="btn-glow mt-4 rounded-full px-10 py-4 text-lg font-bold uppercase tracking-[0.15em]">
            {isLast ? 'See the results' : 'Ascend ▲'}
          </button>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-white/35 sm:block">or press enter</span>
        </motion.div>
      )}
    </motion.section>
  )
}

function FinalView({ state, isToday }: { state: DiveState; isToday: boolean }) {
  const depth = depthFor(state.total)
  const zone = zoneFor(depth)
  const left = useCountdownToMidnight()
  const [copied, setCopied] = useState(false)
  const played = useRef(false)
  useEffect(() => {
    if (!played.current) sfx.win()
    played.current = true
  }, [])

  const share = async () => {
    const grid = Array.from({ length: PROMPTS_PER_DIVE }, (_, i) => tierByKey(state.results.find((r) => r.idx === i)?.tier ?? 'none').emoji).join('')
    const text = `BIBLIO · Ascent #${state.n}\n${grid}\n${state.total} pts · ${depth.toLocaleString()}m · ${zone.name}\n${location.origin}`
    try {
      if (navigator.share && matchMedia('(pointer: coarse)').matches) await navigator.share({ text })
      else {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      /* cancelled */
    }
  }

  return (
    <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-6 py-4 text-center">
      <div className="flex flex-col items-center gap-1">
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-glow/80">ascent #{state.n} complete</span>
        <h1 className="text-gilded font-display text-6xl font-extrabold sm:text-7xl">
          <AnimatedNumber value={depth} format={fmtM} duration={2} />
        </h1>
        <p className="font-serif text-2xl italic text-ivory/90">{zone.name}</p>
        <p className="font-mono text-sm text-amber">{state.total} / 700 pts</p>
        {!!state.percentile && <p className="text-sm text-white/70">Higher than {state.percentile}% of climbers on this ascent</p>}
      </div>

      <div className="flex gap-1.5 text-2xl sm:text-3xl" aria-label="Your seven results">
        {Array.from({ length: PROMPTS_PER_DIVE }, (_, i) => {
          const r = state.results.find((x) => x.idx === i)
          return (
            <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + i * 0.08, type: 'spring' }}>
              {tierByKey(r?.tier ?? 'none').emoji}
            </motion.span>
          )
        })}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <button onClick={() => void share()} className="btn-glow rounded-full px-7 py-3 font-bold uppercase tracking-wider">
          {copied ? 'Copied!' : 'Share result'}
        </button>
        <a {...link('/archive')} className="btn-ghost rounded-full px-6 py-3 font-semibold">
          Archive ⟲
        </a>
        <a {...link('/party')} className="btn-ghost rounded-full px-6 py-3 font-semibold">
          Chariots 🔥
        </a>
      </div>
      {isToday && <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">next ascent in {left}</p>}

      <ol className="flex w-full flex-col gap-2.5 text-left">
        {state.results.map((r) => (
          <li key={r.idx} className="glass rounded-2xl px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm text-white/65">{r.prompt}</p>
              <span className="font-mono text-sm font-bold" style={{ color: TIER_COLOR[r.tier] }}>
                +{r.points}
              </span>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <span className="font-serif text-xl font-semibold">{r.answer ?? '—'}</span>
              <TierChip tier={r.tier} small />
            </div>
            <p className="mt-1.5 font-mono text-[11px] text-white/45">
              most said: {r.common ?? '—'}
              {r.pearl && <> · a rare find: {r.pearl}</>}
            </p>
            <details className="mt-2">
              <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.2em] text-gold/80">every answer ↓</summary>
              <div className="mt-2">
                <Board questionId={r.questionId} mine={r.answer} bare />
              </div>
            </details>
          </li>
        ))}
      </ol>
      <a {...link('/')} className="font-mono text-xs uppercase tracking-[0.2em] text-white/50 underline-offset-4 hover:underline">
        back to the hills
      </a>
    </motion.section>
  )
}

/** fetches and shows every answer to a finished prompt */
function Board({ questionId, mine, bare = false }: { questionId: string; mine: string | null; bare?: boolean }) {
  const [items, setItems] = useState<BoardEntry[] | null>(null)
  useEffect(() => {
    let live = true
    api<BoardEntry[]>(`/board/${encodeURIComponent(questionId)}`)
      .then((b) => live && setItems(b))
      .catch(() => {})
    return () => {
      live = false
    }
  }, [questionId])
  if (!items) return null
  const board = <AnswerBoard items={items.map((a) => ({ ...a, mine: a.name === mine }))} title={bare ? 'Every answer' : 'The full catch'} note="most said → rarest" />
  return bare ? board : <div className="mt-3 w-full">{board}</div>
}
