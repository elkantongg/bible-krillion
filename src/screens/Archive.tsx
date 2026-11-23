import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import type { ArchiveEntry } from '../../shared/types'
import { depthFor } from '../../shared/scoring'
import { api } from '../lib/api'
import { setDepth } from '../lib/sky'
import { link } from '../lib/router'
import { HomeButton, MuteButton, Spinner } from '../components/ui'

const fmt = (ymd: string) => new Date(ymd + 'T12:00:00Z').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' })

export function Archive({ today }: { today: number }) {
  const [list, setList] = useState<ArchiveEntry[] | null>(null)
  const [err, setErr] = useState('')
  useEffect(() => {
    setDepth(320)
    api<ArchiveEntry[]>('/archive')
      .then((l) => setList(l.filter((e) => e.n <= today)))
      .catch((e) => setErr(e.message))
  }, [today])

  const done = list?.filter((e) => e.status === 'done') ?? []
  const avg = done.length ? Math.round(done.reduce((s, e) => s + (e.score ?? 0), 0) / done.length) : 0

  return (
    <div className="relative z-10 min-h-[100dvh]">
      <header className="mx-auto flex max-w-4xl items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <HomeButton />
        <h1 className="font-display text-2xl font-bold sm:text-3xl">The Archive</h1>
        <MuteButton />
      </header>
      <main className="mx-auto max-w-4xl px-4 pb-12 pt-6">
        {list && (
          <div className="glass mb-6 grid grid-cols-3 rounded-2xl p-4 text-center">
            <Stat label="ascents" value={`${done.length}/${list.length}`} />
            <Stat label="avg score" value={String(avg)} />
            <Stat label="avg altitude" value={`${depthFor(avg).toLocaleString()}m`} />
          </div>
        )}
        {err && <p className="text-center text-coral">{err}</p>}
        {!list && !err && (
          <div className="py-20">
            <Spinner label="gathering past ascents…" />
          </div>
        )}
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {list?.map((e, i) => (
            <motion.li key={e.n} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 16) * 0.03 }}>
              <a
                {...link(`/dive/${e.n}`)}
                className={`glass btn-ghost flex h-full flex-col gap-1 rounded-2xl p-4 ${e.n === today ? 'ring-2 ring-glow/70' : ''}`}
              >
                <span className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
                  <span>#{e.n}</span>
                  {e.n === today && <span className="text-glow">today</span>}
                </span>
                <span className="font-display text-lg">{fmt(e.date)}</span>
                <span className={`font-mono text-sm ${e.status === 'done' ? 'text-amber' : e.status === 'partial' ? 'text-glow' : 'text-white/45'}`}>
                  {e.status === 'done' ? `${e.score} pts · ${depthFor(e.score ?? 0).toLocaleString()}m` : e.status === 'partial' ? 'in progress ▲' : 'not climbed'}
                </span>
              </a>
            </motion.li>
          ))}
        </ul>
      </main>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-mono text-lg font-bold text-glow sm:text-2xl">{value}</span>
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">{label}</span>
    </div>
  )
}
