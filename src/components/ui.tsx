import { useEffect, useMemo, useRef, useState } from 'react'
import { animate, motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { tierByKey } from '../../shared/scoring'
import type { TierKey } from '../../shared/types'
import { isMuted, setMuted } from '../lib/sound'
import { link } from '../lib/router'
import { fmtRef, readUrl } from '../lib/refs'

export const TIER_COLOR: Record<TierKey, string> = {
  surface: '#e6f4ff',
  shallows: '#8fe3ff',
  reef: '#7ef6dc',
  rare: '#ffcf70',
  deep: '#ff9f7a',
  pearl: '#f0d4ff',
  none: '#7b8aa0',
}

export function TierChip({ tier, small = false }: { tier: TierKey; small?: boolean }) {
  const t = tierByKey(tier)
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full font-mono font-bold uppercase tracking-wider ${
        small ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]'
      }`}
      style={{ color: TIER_COLOR[tier], background: `${TIER_COLOR[tier]}1f`, boxShadow: `inset 0 0 0 1px ${TIER_COLOR[tier]}40` }}
    >
      <span aria-hidden>{t.emoji}</span>
      {t.label}
    </span>
  )
}

/** the ichthys — the early Christians' fish sign, drawn in gold */
export function Ichthys({ size = 64, className = '', animated = false }: { size?: number; className?: string; animated?: boolean }) {
  return (
    <svg viewBox="0 0 120 64" width={size} height={(size * 64) / 120} className={className} aria-hidden>
      <defs>
        <linearGradient id="ichG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff2c8" />
          <stop offset=".5" stopColor="#e8c170" />
          <stop offset="1" stopColor="#b8893a" />
        </linearGradient>
      </defs>
      <motion.path
        d="M6 32 C 30 0, 76 0, 112 52 M6 32 C 30 64, 76 64, 112 12"
        fill="none"
        stroke="url(#ichG)"
        strokeWidth="6"
        strokeLinecap="round"
        initial={animated ? { pathLength: 0 } : false}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1] }}
      />
    </svg>
  )
}

/** a card that tilts in 3D toward the pointer, with a soft moving glare */
export function Tilt({ children, className = '', max = 10, as = 'div', ...rest }: { children: React.ReactNode; className?: string; max?: number; as?: 'div' | 'a' } & Record<string, unknown>) {
  const ref = useRef<HTMLElement>(null)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rx = useSpring(useTransform(my, [0, 1], [max, -max]), { stiffness: 180, damping: 18 })
  const ry = useSpring(useTransform(mx, [0, 1], [-max, max]), { stiffness: 180, damping: 18 })
  const glare = useTransform([mx, my] as never, ([x, y]: number[]) => `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,240,200,0.22), transparent 55%)`)
  const Comp = as === 'a' ? motion.a : motion.div
  return (
    <Comp
      ref={ref as never}
      {...(rest as object)}
      className={`relative preserve-3d ${className}`}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onPointerMove={(e: React.PointerEvent) => {
        const r = ref.current!.getBoundingClientRect()
        mx.set((e.clientX - r.left) / r.width)
        my.set((e.clientY - r.top) / r.height)
      }}
      onPointerLeave={() => {
        mx.set(0.5)
        my.set(0.5)
      }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
      <motion.span aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ background: glare }} />
    </Comp>
  )
}

/** a burst of golden light motes — for a landed answer */
export function Burst({ trigger, color = '#f3d48c', count = 26 }: { trigger: unknown; color?: string; count?: number }) {
  const parts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2 + Math.random() * 0.4
        const d = 70 + Math.random() * 110
        return { x: Math.cos(a) * d, y: Math.sin(a) * d - 30, s: 3 + Math.random() * 5, delay: Math.random() * 0.12 }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [trigger, count],
  )
  if (!trigger) return null
  return (
    <span aria-hidden key={String(trigger)} className="pointer-events-none absolute left-1/2 top-1/2 z-20">
      {parts.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{ width: p.s, height: p.s, background: color, boxShadow: `0 0 10px 2px ${color}` }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.3 }}
          transition={{ duration: 1.1 + Math.random() * 0.5, delay: p.delay, ease: [0.1, 0.6, 0.3, 1] }}
        />
      ))}
    </span>
  )
}

export interface BoardItem {
  name: string
  ref: string
  tier: TierKey
  found?: boolean
  mine?: boolean
}

/** every answer to a prompt, with a link to read its chapter */
export function AnswerBoard({ items, title = 'The full catch', note }: { items: BoardItem[]; title?: string; note?: string }) {
  const [all, setAll] = useState(items.length <= 24)
  const shown = all ? items : items.slice(0, 24)
  return (
    <div className="glass ornate w-full rounded-2xl p-4 text-left">
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <span className="font-display text-sm font-semibold tracking-wide text-gold">{title}</span>
        <span className="eyebrow text-white/45">{note ?? `${items.length} answers`}</span>
      </div>
      <ul className="flex flex-wrap gap-1.5">
        {shown.map((a, i) => (
          <motion.li key={a.name + i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 30) * 0.015 }}>
            <a
              href={readUrl(a.ref)}
              target="_blank"
              rel="noreferrer"
              title={`Read ${fmtRef(a.ref)}`}
              className={`group inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[13px] transition ${
                a.mine ? 'ring-2 ring-gold' : ''
              } ${a.found === false ? 'opacity-55 hover:opacity-100' : ''}`}
              style={{ background: `${TIER_COLOR[a.tier]}14`, boxShadow: `inset 0 0 0 1px ${TIER_COLOR[a.tier]}33` }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: TIER_COLOR[a.tier] }} />
              <span className="text-white/90">{a.name}</span>
              <span className="font-mono text-[10px] text-white/35 group-hover:text-gold">{fmtRef(a.ref)}</span>
            </a>
          </motion.li>
        ))}
      </ul>
      {!all && (
        <button onClick={() => setAll(true)} className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-gold/80 hover:underline">
          show all {items.length} ↓
        </button>
      )}
    </div>
  )
}

// module-level so the default is referentially stable (an inline default restarts the tween every render)
const fmtInt = (n: number) => Math.round(n).toLocaleString()

export function AnimatedNumber({ value, format = fmtInt, duration = 1.6 }: { value: number; format?: (n: number) => string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const prev = useRef(value)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const c = animate(prev.current, value, {
      duration,
      ease: [0.3, 0, 0.2, 1],
      onUpdate: (v) => {
        el.textContent = format(v)
      },
    })
    prev.current = value
    return () => c.stop()
  }, [value, duration, format])
  return <span ref={ref}>{format(value)}</span>
}

export function MuteButton() {
  const [m, setM] = useState(isMuted())
  return (
    <button
      className="btn-ghost grid h-9 w-9 place-items-center rounded-full text-sm"
      aria-label={m ? 'Unmute sounds' : 'Mute sounds'}
      onClick={() => {
        setMuted(!m)
        setM(!m)
      }}
    >
      {m ? '🔇' : '🔊'}
    </button>
  )
}

export function HomeButton() {
  return (
    <a {...link('/')} className="btn-ghost grid h-9 w-9 place-items-center rounded-full" aria-label="Home">
      <Ichthys size={20} />
    </a>
  )
}

export function Spinner({ label = 'descending…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 text-white/70" role="status">
      <div className="relative h-12 w-12">
        <span className="absolute inset-0 rounded-full border-2 border-gold/60" style={{ animation: 'pulse-ring 1.4s ease-out infinite' }} />
        <span className="absolute inset-3 rounded-full bg-gold/70 blur-[3px]" />
      </div>
      <span className="eyebrow">{label}</span>
    </div>
  )
}

export function OfflineToast() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>
    const on = () => {
      setShow(true)
      clearTimeout(t)
      t = setTimeout(() => setShow(false), 3500)
    }
    window.addEventListener('deep:offline', on)
    window.addEventListener('offline', on)
    return () => {
      window.removeEventListener('deep:offline', on)
      window.removeEventListener('offline', on)
    }
  }, [])
  if (!show) return null
  return (
    <div role="alert" className="glass fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full px-4 py-2 font-mono text-xs text-amber">
      signal lost · reconnecting…
    </div>
  )
}

export function useCountdownToMidnight() {
  const [left, setLeft] = useState('')
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
      const s = Math.max(0, Math.floor((next.getTime() - now.getTime()) / 1000))
      setLeft(`${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return left
}

/** shake an element whenever `trigger` changes (keeps the input mounted so focus survives) */
export function useShake<T extends HTMLElement>(trigger: unknown) {
  const ref = useRef<T>(null)
  useEffect(() => {
    if (!trigger || !ref.current) return
    void animate(ref.current, { x: [0, -10, 10, -6, 6, 0] }, { duration: 0.35 })
  }, [trigger])
  return ref
}

/** a circular countdown ring */
export function TimerRing({ frac, secs, size = 64, urgent = false, hideText = false }: { frac: number; secs: number; size?: number; urgent?: boolean; hideText?: boolean }) {
  const r = size / 2 - 5
  const c = 2 * Math.PI * r
  const col = urgent ? '#ff7f6e' : '#f3d48c'
  return (
    <span className="relative grid shrink-0 place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0 -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.12)" strokeWidth="4" fill={hideText ? 'none' : 'rgba(6,16,34,0.5)'} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={col}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - Math.max(0, Math.min(1, frac)))}
          style={{ transition: 'stroke-dashoffset 0.12s linear', filter: `drop-shadow(0 0 6px ${col})` }}
        />
      </svg>
      {!hideText && <span className={`relative font-mono text-lg font-bold tabular-nums ${urgent ? 'animate-pulse text-coral' : 'text-ivory'}`}>{secs}</span>}
    </span>
  )
}
