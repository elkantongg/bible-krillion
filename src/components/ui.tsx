import { useEffect, useRef, useState } from 'react'
import { animate } from 'motion/react'
import { tierByKey } from '../../shared/scoring'
import type { TierKey } from '../../shared/types'
import { isMuted, setMuted } from '../lib/sound'
import { link } from '../lib/router'

export const TIER_COLOR: Record<TierKey, string> = {
  surface: '#d6f3ff',
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

export function AnimatedNumber({ value, format = (n: number) => Math.round(n).toLocaleString(), duration = 1.6 }: { value: number; format?: (n: number) => string; duration?: number }) {
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
    <a {...link('/')} className="btn-ghost grid h-9 w-9 place-items-center rounded-full text-sm" aria-label="Home">
      ⌂
    </a>
  )
}

export function Spinner({ label = 'descending…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 text-white/70" role="status">
      <div className="relative h-10 w-10">
        <span className="absolute inset-0 rounded-full border-2 border-glow/60" style={{ animation: 'pulse-ring 1.4s ease-out infinite' }} />
        <span className="absolute inset-2 rounded-full bg-glow/70 blur-[2px]" />
      </div>
      <span className="font-mono text-xs uppercase tracking-[0.2em]">{label}</span>
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
