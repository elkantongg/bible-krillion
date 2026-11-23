import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { io, type Socket } from 'socket.io-client'
import type { PartyDifficulty, PartyPlayer, PartySettings, PartyState } from '../../shared/types'
import { playerToken } from '../lib/api'
import { setDepth } from '../lib/sky'
import { go } from '../lib/router'
import { sfx } from '../lib/sound'
import { load, save } from '../lib/storage'
import { AnswerBoard, Burst, DidYouMean, Ichthys, MuteButton, Spinner, TierChip, TimerRing, useShake } from '../components/ui'

let socketP: Promise<{ socket: Socket; me: string }> | null = null
function connect() {
  socketP ??= playerToken().then((token) => ({
    socket: io({ auth: { token }, transports: ['websocket', 'polling'] }),
    me: token.split('.')[0],
  }))
  return socketP
}

const CODE_RE = /^[A-Z]{4}$/
const REACTIONS = ['🙏', '🔥', '😱', '😂', '👏', '🐟', '✝️', '💡']
const TURN_SECONDS = [5, 8, 10, 15, 20, 30, 45, 60]
const ROUND_CAPS = [3, 5, 10, 15]
const DIFFS: { v: PartyDifficulty; label: string; note: string }[] = [
  { v: 'easy', label: 'Easy', note: 'well-known topics' },
  { v: 'medium', label: 'Medium', note: 'easy + medium' },
  { v: 'hard', label: 'Hard', note: 'medium + hard' },
  { v: 'mixed', label: 'Mixed', note: 'everything' },
]

function NameField({ value, onChange, autoFocus }: { value: string; onChange: (s: string) => void; autoFocus?: boolean }) {
  return (
    <label className="flex w-full flex-col gap-1.5 text-left">
      <span className="eyebrow text-white/60">your name</span>
      <input
        value={value}
        autoFocus={autoFocus}
        maxLength={16}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Barnabas"
        className="glass rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-gold/60"
      />
    </label>
  )
}

/* ---------- /party ---------- */
export function PartyHome() {
  const [name, setName] = useState(load('deep.name') ?? '')
  const [code, setCode] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  useEffect(() => setDepth(1300), [])

  const create = async () => {
    if (!name.trim()) return setErr('Pick a name first')
    save('deep.name', name.trim())
    setBusy(true)
    setErr('')
    try {
      const { socket } = await connect()
      socket.timeout(8000).emit('party:create', { name }, (e: Error | null, r?: { ok: boolean; code?: string; error?: string }) => {
        setBusy(false)
        if (e || !r) setErr('Could not reach the server — try again')
        else if (r.ok && r.code) go(`/party/${r.code}`)
        else setErr(r.error ?? 'Could not create a room')
      })
    } catch {
      setBusy(false)
      setErr('Could not reach the server')
    }
  }
  const join = () => {
    const c = code.trim().toUpperCase()
    if (!CODE_RE.test(c)) return setErr('Room codes are 4 letters')
    if (!name.trim()) return setErr('Pick a name first')
    save('deep.name', name.trim())
    go(`/party/${c}`)
  }

  return (
    <div className="relative z-10 flex min-h-[100dvh] flex-col">
      <header className="flex items-center justify-between p-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <button className="btn-ghost grid h-9 w-9 place-items-center rounded-full" aria-label="Home" onClick={() => go('/')}>
          <Ichthys size={20} />
        </button>
        <MuteButton />
      </header>
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-6 px-4 pb-10 text-center">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="anim-bob">
          <FireWheel size={150} blaze={0.35} />
        </motion.div>
        <div>
          <h1 className="text-gilded font-display text-5xl font-extrabold">Chariots</h1>
          <p className="mt-3 text-white/80">
            One prompt goes round the table, carried by a wheel of fire. Name a new answer before your clock runs out, or you fall from the chariot
            and lose a life. A question keeps going round until someone falls. Last rider standing wins.
          </p>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-gold/80">no sign-in · 2–12 riders · share a 4-letter code</p>
        </div>
        <NameField value={name} onChange={setName} />
        <button onClick={() => void create()} disabled={busy} className="btn-glow w-full rounded-full px-6 py-4 font-display text-lg font-bold uppercase tracking-wider">
          {busy ? 'Harnessing the horses…' : 'Create a room'}
        </button>
        <div className="flex w-full items-center gap-3 text-white/40">
          <span className="rule-gold flex-1" />
          <span className="eyebrow">or join</span>
          <span className="rule-gold flex-1" />
        </div>
        <form
          className="flex w-full gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            join()
          }}
        >
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4))}
            placeholder="CODE"
            aria-label="Room code"
            autoCapitalize="characters"
            className="glass w-full min-w-0 flex-1 rounded-xl px-4 py-3 text-center font-mono text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-gold/60"
          />
          <button className="btn-ghost rounded-xl px-6 font-bold uppercase">Join</button>
        </form>
        {err && <p className="text-sm text-coral">{err}</p>}
      </main>
    </div>
  )
}

/* ---------- /party/:code ---------- */
interface Reaction {
  id: string
  playerId: string
  emoji: string
  x: number
}

export function PartyRoom({ code }: { code: string }) {
  const [name, setName] = useState(load('deep.name') ?? '')
  const [ready, setReady] = useState(!!load('deep.name'))
  const [state, setState] = useState<PartyState | null>(null)
  const [me, setMe] = useState('')
  const [err, setErr] = useState('')
  const [typing, setTyping] = useState<{ playerId: string; text: string } | null>(null)
  const [reactions, setReactions] = useState<Reaction[]>([])
  const socketRef = useRef<Socket | null>(null)
  const prev = useRef<PartyState | null>(null)

  useEffect(() => setDepth(1300), [])

  useEffect(() => {
    if (!ready) return
    let alive = true
    let socket: Socket
    const join = () =>
      socket.emit('party:join', { code, name: load('deep.name') ?? name }, (r: { ok: boolean; error?: string }) => {
        if (!r.ok && alive) {
          setState(null)
          setErr(r.error ?? 'Could not join')
        } else setErr('')
      })
    const onReact = (r: Omit<Reaction, 'x'>) => {
      const rx = { ...r, x: 10 + Math.random() * 80 }
      setReactions((list) => [...list.slice(-20), rx])
      setTimeout(() => setReactions((list) => list.filter((x) => x.id !== rx.id)), 2600)
    }
    connect()
      .then((c) => {
        if (!alive) return
        socket = c.socket
        socketRef.current = socket
        setMe(c.me)
        socket.on('party:state', (s: PartyState) => {
          if (s.code === code) setState(s)
        })
        socket.on('party:typing', setTyping)
        socket.on('party:react', onReact)
        socket.on('connect', join)
        socket.on('connect_error', () => setErr('Could not reach the server — retrying…'))
        if (socket.connected) join()
      })
      .catch(() => setErr('Could not reach the server'))
    return () => {
      alive = false
      if (socket) {
        socket.emit('party:leave')
        socket.off('party:state')
        socket.off('party:typing')
        socket.off('party:react', onReact)
        socket.off('connect', join)
        socket.off('connect_error')
      }
    }
  }, [ready, code, name])

  // sound cues on state transitions
  useEffect(() => {
    const p = prev.current
    if (state && p) {
      if (state.lastPop && state.lastPop.at !== p.lastPop?.at) sfx.gulp()
      else if (state.phase === 'turn' && state.holderId && state.holderId !== p.holderId) sfx.pass()
      if (state.phase === 'over' && p.phase !== 'over') sfx.win()
      if (state.phase === 'between' && p.phase !== 'between') sfx.sink()
    }
    if (state?.holderId !== prev.current?.holderId) setTyping(null)
    prev.current = state
  }, [state])

  if (!ready)
    return (
      <Shell>
        <form
          className="mx-auto flex w-full max-w-sm flex-col items-center gap-5 text-center"
          onSubmit={(e) => {
            e.preventDefault()
            if (!name.trim()) return
            save('deep.name', name.trim())
            setReady(true)
          }}
        >
          <p className="eyebrow text-white/60">joining room</p>
          <p className="text-gilded font-mono text-5xl font-bold tracking-[0.3em]">{code}</p>
          <NameField value={name} onChange={setName} autoFocus />
          <button className="btn-glow w-full rounded-full py-4 text-lg font-bold uppercase tracking-wider">Climb aboard</button>
        </form>
      </Shell>
    )

  if (err && !state)
    return (
      <Shell>
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="font-display text-2xl">{err}</p>
          <button className="btn-glow rounded-full px-6 py-3 font-bold" onClick={() => go('/party')}>
            Back
          </button>
        </div>
      </Shell>
    )
  if (!state || !me)
    return (
      <Shell>
        <Spinner label="finding the room…" />
      </Shell>
    )

  const emit = (ev: string, data?: unknown, ack?: (r: never) => void) => socketRef.current?.emit(ev, data, ack)
  const inGame = state.phase === 'turn' || state.phase === 'popped' || state.phase === 'between'
  return (
    <Shell code={code}>
      {state.phase === 'lobby' && <Lobby s={state} me={me} emit={emit} />}
      {inGame && <Game s={state} me={me} emit={emit} typing={typing} />}
      {state.phase === 'over' && <Over s={state} me={me} emit={emit} />}
      {state.phase !== 'lobby' && <ReactionBar emit={emit} />}
      <div aria-hidden className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-0">
        {reactions.map((r) => {
          const who = state.players.find((p) => p.id === r.playerId)
          return (
            <span
              key={r.id}
              className="absolute bottom-24 flex flex-col items-center"
              style={{ left: `${r.x}%`, animation: 'float-up 2.5s ease-out forwards', ['--drift' as string]: `${(r.x % 7) * 6 - 18}px` }}
            >
              <span className="text-4xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">{r.emoji}</span>
              <span className="mt-0.5 rounded-full bg-black/40 px-1.5 text-[10px] font-semibold">{who?.name}</span>
            </span>
          )
        })}
      </div>
    </Shell>
  )
}

function Shell({ children, code }: { children: React.ReactNode; code?: string }) {
  return (
    <div className="relative z-10 flex min-h-[100dvh] flex-col">
      <header className="flex items-center justify-between gap-2 p-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <button className="btn-ghost grid h-9 w-9 place-items-center rounded-full" aria-label="Leave room" onClick={() => go('/party')}>
          ←
        </button>
        <span className="font-display text-lg font-bold tracking-wide">
          Chariots {code && <span className="ml-1 font-mono text-sm tracking-[0.2em] text-gold">{code}</span>}
        </span>
        <MuteButton />
      </header>
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">{children}</main>
    </div>
  )
}

function Avatar({ p, size = 40, dim = false }: { p: PartyPlayer; size?: number; dim?: boolean }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full font-display font-bold text-ink"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.45,
        background: `radial-gradient(circle at 35% 30%, hsl(${p.hue} 90% 88%), hsl(${p.hue} 65% 55%) 70%, hsl(${p.hue} 60% 35%))`,
        boxShadow: `0 6px 18px -4px hsl(${p.hue} 70% 30% / 0.8), inset 0 -3px 6px rgba(0,0,0,0.25), inset 0 2px 4px rgba(255,255,255,0.5)`,
        opacity: dim ? 0.35 : 1,
        filter: dim ? 'grayscale(1)' : undefined,
      }}
    >
      {p.name.slice(0, 1).toUpperCase()}
    </span>
  )
}

function Lives({ n, max }: { n: number; max: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`${n} lives`}>
      {Array.from({ length: max }, (_, i) => (
        <motion.span key={i} animate={{ scale: i < n ? 1 : 0.6, opacity: i < n ? 1 : 0.25 }} className="text-[10px] leading-none">
          {i < n ? '❤️' : '🤍'}
        </motion.span>
      ))}
    </span>
  )
}

type Emit = (ev: string, data?: unknown, ack?: (r: never) => void) => void

function Lobby({ s, me, emit }: { s: PartyState; me: string; emit: Emit }) {
  const isHost = s.hostId === me
  const [copied, setCopied] = useState(false)
  const [err, setErr] = useState('')
  const [cats, setCats] = useState<string[]>([])
  const url = `${location.origin}/party/${s.code}`
  const players = s.players.filter((p) => p.connected)
  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then(setCats)
      .catch(() => {})
  }, [])
  const set = (patch: Partial<PartySettings>) => isHost && emit('party:settings', patch)
  const invite = async () => {
    try {
      if (navigator.share && matchMedia('(pointer: coarse)').matches) await navigator.share({ title: 'Chariots', text: `Join my Chariots room: ${s.code}`, url })
      else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      /* cancelled */
    }
  }
  const st = s.settings
  const toggleCat = (c: string) => set({ categories: st.categories.includes(c) ? st.categories.filter((x) => x !== c) : [...st.categories, c] })

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex w-full max-w-xl flex-col items-center gap-5 py-4 text-center">
      <div className="flex flex-col items-center gap-2">
        <span className="eyebrow text-white/60">room code</span>
        <div className="perspective flex gap-2">
          {s.code.split('').map((c, i) => (
            <motion.span
              key={i}
              initial={{ rotateX: -90, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1 }}
              transition={{ delay: i * 0.08, type: 'spring' }}
              className="glass glass-gold grid h-16 w-14 place-items-center rounded-xl font-display text-4xl font-bold text-gold sm:h-20 sm:w-16 sm:text-5xl"
            >
              {c}
            </motion.span>
          ))}
        </div>
        <button onClick={() => void invite()} className="btn-ghost mt-1 rounded-full px-5 py-2 text-sm font-semibold">
          {copied ? 'Link copied!' : '🔗 Copy invite link'}
        </button>
      </div>

      <div className="glass ornate w-full rounded-2xl p-4">
        <p className="eyebrow mb-3 text-white/60">riders ({players.length}/12)</p>
        <ul className="flex flex-wrap justify-center gap-3">
          <AnimatePresence>
            {players.map((p) => (
              <motion.li key={p.id} layout initial={{ scale: 0, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0 }} className="flex w-16 flex-col items-center gap-1">
                <Avatar p={p} size={46} />
                <span className="w-full truncate text-xs">
                  {p.id === s.hostId && '👑 '}
                  {p.name}
                  {p.id === me && ' (you)'}
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>

      <div className="glass w-full rounded-2xl p-4 text-left">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-display text-sm font-bold tracking-wide text-gold">Game settings</span>
          {!isHost && <span className="eyebrow text-white/45">host decides</span>}
        </div>
        <Setting label="lives">
          {[1, 2, 3, 4, 5].map((n) => (
            <Chip key={n} on={st.lives === n} disabled={!isHost} onClick={() => set({ lives: n })}>
              ❤️ {n}
            </Chip>
          ))}
        </Setting>
        <Setting label="seconds per turn">
          {TURN_SECONDS.map((n) => (
            <Chip key={n} on={st.turnSeconds === n} disabled={!isHost} onClick={() => set({ turnSeconds: n })}>
              {n}s
            </Chip>
          ))}
        </Setting>
        <Setting label="difficulty">
          {DIFFS.map((d) => (
            <Chip key={d.v} on={st.difficulty === d.v} disabled={!isHost} onClick={() => set({ difficulty: d.v })} title={d.note}>
              {d.label}
            </Chip>
          ))}
        </Setting>
        <Setting label="max rounds per question">
          {ROUND_CAPS.map((n) => (
            <Chip key={n} on={st.maxRounds === n} disabled={!isHost} onClick={() => set({ maxRounds: n })}>
              {n}
            </Chip>
          ))}
        </Setting>
        <Setting label={`topics · ${st.categories.length ? st.categories.length + ' chosen' : 'everything'}`}>
          <Chip on={!st.categories.length} disabled={!isHost} onClick={() => set({ categories: [] })}>
            Everything
          </Chip>
          {cats.map((c) => (
            <Chip key={c} on={st.categories.includes(c)} disabled={!isHost} onClick={() => toggleCat(c)}>
              {c}
            </Chip>
          ))}
        </Setting>
      </div>

      <div className="w-full text-left text-[13px] leading-relaxed text-white/70">
        <p>
          <b className="text-gold">How a question plays:</b> it passes round the table in order. Name a new answer before your {st.turnSeconds}s run out — or
          lose a life, and it still passes on. If anyone lost a life when the table finishes a round, it's a new question. If everyone answered, the
          same question goes round again (up to {st.maxRounds} rounds, then everyone survives).
        </p>
      </div>

      {isHost ? (
        <button
          disabled={players.length < 2}
          onClick={() => emit('party:start', null, ((r: { ok: boolean; error?: string }) => !r.ok && setErr(r.error ?? '')) as never)}
          className="btn-glow w-full rounded-full py-4 font-display text-lg font-bold uppercase tracking-wider"
        >
          {players.length < 2 ? 'Waiting for riders…' : 'Start the game'}
        </button>
      ) : (
        <p className="eyebrow text-white/60">waiting for the host to start…</p>
      )}
      {err && <p className="text-sm text-coral">{err}</p>}
    </motion.div>
  )
}

function Setting({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3 last:mb-0">
      <p className="eyebrow mb-1.5 text-white/55">{label}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}
function Chip({ on, disabled, onClick, children, title }: { on: boolean; disabled?: boolean; onClick: () => void; children: React.ReactNode; title?: string }) {
  return (
    <button data-on={on} disabled={disabled} onClick={onClick} title={title} className="chip rounded-full px-3 py-1.5 text-[13px] font-semibold disabled:opacity-80">
      {children}
    </button>
  )
}

/** a wheel of fire (Elijah's chariot): points at whoever holds the question and blazes as their clock runs down */
function FireWheel({ size, blaze, angle = 0, wobble = 0 }: { size: number; blaze: number; angle?: number; wobble?: number }) {
  const m = Math.max(0, Math.min(1, blaze))
  const flames = Array.from({ length: 12 }, (_, i) => (i / 12) * Math.PI * 2)
  return (
    <motion.div style={{ width: size, height: size }} animate={{ rotate: angle }} transition={{ type: 'spring', stiffness: 90, damping: 14 }}>
      <svg
        viewBox="-100 -100 200 200"
        className="h-full w-full overflow-visible"
        style={{
          animation: wobble ? `bob ${Math.max(0.35, 2.2 - wobble * 1.8)}s ease-in-out infinite` : undefined,
          filter: `drop-shadow(0 0 ${10 + m * 26}px rgba(255,150,70,${0.25 + m * 0.5})) drop-shadow(0 10px 12px rgba(0,0,0,0.4))`,
        }}
      >
        <defs>
          <radialGradient id="wheelFire" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0.55" stopColor="#ffd27a" stopOpacity="0" />
            <stop offset="0.78" stopColor="#ff9a3c" stopOpacity={0.35 + m * 0.4} />
            <stop offset="1" stopColor="#ff5a1f" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle r="98" fill="url(#wheelFire)" />
        {/* flames licking outward from the rim, taller as time runs out */}
        {flames.map((a, i) => {
          const r0 = 62
          const r1 = 74 + m * 22 + (i % 2) * 6
          const w = 0.16
          const p = (r: number, t: number) => `${Math.cos(t) * r} ${Math.sin(t) * r}`
          return (
            <path
              key={i}
              d={`M${p(r0, a - w)} Q${p(r1 * 0.92, a - w * 0.4)} ${p(r1, a + 0.05)} Q${p(r1 * 0.86, a + w * 0.3)} ${p(r0, a + w)} Z`}
              fill={i % 2 ? '#ffb24a' : '#ff7a2e'}
              opacity={0.55 + m * 0.4}
            />
          )
        })}
        <g style={{ transformOrigin: '0 0', animation: `spin-slow ${Math.max(1.2, 10 - m * 8)}s linear infinite` }}>
          <circle r="62" fill="none" stroke="#e8c170" strokeWidth="9" />
          <circle r="62" fill="none" stroke="#fff2c8" strokeWidth="2" opacity="0.6" />
          {Array.from({ length: 8 }, (_, i) => (
            <line key={i} x1="0" y1="0" x2={Math.cos((i / 8) * Math.PI * 2) * 58} y2={Math.sin((i / 8) * Math.PI * 2) * 58} stroke="#d9ad5c" strokeWidth="4" strokeLinecap="round" />
          ))}
          <circle r="13" fill="#f3d48c" stroke="#b8893a" strokeWidth="3" />
        </g>
        {/* the pointer toward the holder */}
        <path d="M70 -9 L94 0 L70 9 Z" fill="#fff2c8" />
      </svg>
    </motion.div>
  )
}

function useServerClock(serverNow: number) {
  const offset = useMemo(() => serverNow - Date.now(), [serverNow])
  const [now, setNow] = useState(Date.now() + offset)
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now() + offset), 100)
    return () => clearInterval(id)
  }, [offset])
  return now
}

function Game({ s, me, emit, typing }: { s: PartyState; me: string; emit: Emit; typing: { playerId: string; text: string } | null }) {
  const now = useServerClock(s.serverNow)
  const [value, setValue] = useState('')
  const [miss, setMiss] = useState<{ key: number; msg: string; text?: string; suggestions?: string[] } | null>(null)
  const [landed, setLanded] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const shakeRef = useShake<HTMLFormElement>(miss?.suggestions?.length ? null : miss?.key)
  const myTurn = s.phase === 'turn' && s.holderId === me
  const seats = s.players.filter((p) => !p.spectator)
  const holder = s.players.find((p) => p.id === s.holderId)
  const victim = s.lastPop ? s.players.find((p) => p.id === s.lastPop!.playerId) : null
  const reading = s.turnStartedAt != null && now < s.turnStartedAt
  const total = s.settings.turnSeconds * 1000
  const leftMs = s.turnEndsAt ? Math.max(0, s.turnEndsAt - Math.max(now, s.turnStartedAt ?? now)) : 0
  const frac = reading ? 1 : leftMs / total
  const secs = Math.ceil(leftMs / 1000)
  const urgent = !reading && secs <= 3
  const [w, setW] = useState(() => Math.min(window.innerWidth - 32, 640))
  useEffect(() => {
    const r = () => setW(Math.min(window.innerWidth - 32, 640))
    window.addEventListener('resize', r)
    return () => window.removeEventListener('resize', r)
  }, [])
  const h = Math.max(240, Math.min(340, w * 0.6))
  const rx = w / 2 - 38
  const ry = h / 2 - 40
  const holderIdx = seats.findIndex((p) => p.id === s.holderId)
  const angleOf = (i: number) => (i / seats.length) * Math.PI * 2 + Math.PI / 2
  const wheelAngle = holderIdx >= 0 ? (Math.atan2(Math.sin(angleOf(holderIdx)) * ry, Math.cos(angleOf(holderIdx)) * rx) * 180) / Math.PI : 0
  const thisRound = new Map(s.feed.filter((f) => f.round === s.round).map((f) => [f.playerId, f]))

  useEffect(() => {
    if (myTurn) {
      setValue('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [myTurn, s.holderId])
  useEffect(() => {
    if (myTurn && !reading && secs <= 5 && secs > 0) sfx.tick()
  }, [secs, myTurn, reading])

  const submit = (pick?: string) => {
    const text = (pick ?? value).trim()
    if (!text || !myTurn) return
    emit('party:answer', { text }, ((r: { ok: boolean; reason?: string; suggestions?: string[] }) => {
      if (r.ok) {
        setValue('')
        setLanded(Date.now())
        sfx.land(35)
        emit('party:typing', '')
      } else {
        if (!r.suggestions?.length) sfx.miss()
        setMiss({
          key: Date.now(),
          text,
          suggestions: r.suggestions,
          msg: r.reason === 'used' ? `“${text}” was already said!` : r.reason === 'not-yet' ? 'wait for the clock to start…' : `“${text}” doesn't fit — try another`,
        })
        setValue('')
      }
    }) as never)
  }

  if (s.phase === 'between' && s.reveal) return <Between s={s} me={me} emit={emit} now={now} />

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="glass rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em]">question {s.questionNo}</span>
        <span className={`glass rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] ${s.roundLost ? 'text-coral' : 'text-gold'}`}>
          round {s.round}/{s.settings.maxRounds}
          {s.roundLost ? ' · last lap' : ''}
        </span>
        <span className="glass rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-white/70">
          {s.usedCount}/{s.prompt?.answerCount} named
        </span>
      </div>
      <motion.div key={s.prompt?.text} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <span className="eyebrow text-gold/80">{s.prompt?.category}</span>
        <h2 className="text-shadow-glow text-balance font-serif text-[1.8rem] font-semibold leading-tight text-ivory sm:text-[2.6rem]">{s.prompt?.text}</h2>
      </motion.div>

      {/* the table, seen in perspective */}
      <div className="relative" style={{ width: w, height: h }}>
        <div className="absolute inset-0" style={{ perspective: 700 }}>
          <div
            className="absolute left-1/2 top-1/2 rounded-[50%]"
            style={{
              width: rx * 2 + 30,
              height: ry * 2 + 30,
              transform: 'translate(-50%,-50%) rotateX(38deg)',
              background: 'radial-gradient(ellipse at 50% 40%, rgba(243,212,140,0.18), rgba(6,16,34,0.35) 60%, transparent 72%)',
              boxShadow: 'inset 0 0 0 1px rgba(232,193,112,0.35), 0 30px 60px -30px rgba(0,0,0,0.7)',
            }}
          />
        </div>
        {seats.map((p, i) => {
          const a = angleOf(i)
          const x = w / 2 + Math.cos(a) * rx
          const y = h / 2 + Math.sin(a) * ry
          const isHolder = p.id === s.holderId
          const out = p.lives <= 0
          const done = thisRound.get(p.id)
          const depthScale = 0.85 + ((Math.sin(a) + 1) / 2) * 0.25 // nearer seats look bigger
          return (
            <motion.div
              key={p.id}
              className="absolute flex w-20 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5"
              style={{ left: x, top: y, zIndex: Math.round(y) }}
              animate={{ scale: (isHolder ? 1.2 : 1) * depthScale, y: isHolder ? -8 : 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 16 }}
            >
              <span className="relative">
                {isHolder && (
                  <span className="absolute -inset-2">
                    <TimerRing frac={frac} secs={0} size={(w < 420 ? 36 : 44) + 16} urgent={urgent} hideText />
                  </span>
                )}
                <Avatar p={p} size={w < 420 ? 36 : 44} dim={out || !p.connected} />
                {done && (
                  <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full text-[11px]" style={{ background: done.answer ? '#7ef6dc' : '#ff7f6e', color: '#071225' }}>
                    {done.answer ? '✓' : '✕'}
                  </span>
                )}
              </span>
              <span className={`max-w-full truncate text-[11px] font-semibold ${p.id === me ? 'text-gold' : ''}`}>{p.name}</span>
              {out ? <span className="text-[10px] text-white/45">fallen</span> : <Lives n={p.lives} max={s.settings.lives} />}
            </motion.div>
          )
        })}

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ zIndex: Math.round(h / 2) }}>
          <motion.div animate={{ scale: s.phase === 'popped' ? 1.7 : 1 + (1 - frac) * 0.35 }} transition={{ type: 'spring', stiffness: 120, damping: 10 }}>
            <FireWheel size={w < 420 ? 92 : 124} blaze={s.phase === 'popped' ? 1 : 0.1 + (1 - frac) * 0.7} angle={wheelAngle} wobble={reading ? 0 : 1 - frac} />
          </motion.div>
        </div>

        <AnimatePresence>
          {s.phase === 'popped' && victim && (
            <motion.div key={s.lastPop?.at} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[999] flex flex-col items-center justify-center gap-1 text-center">
              <span className="font-display text-6xl font-extrabold text-coral drop-shadow-[0_0_30px_#ff7f6e] sm:text-7xl">FALLEN!</span>
              <span className="glass rounded-full px-4 py-1.5 font-semibold">
                {victim.id === me ? 'You' : `${victim.name}`} fell from the chariot
                {s.lastPop?.eliminated ? ' — out!' : ` · ${victim.lives} ${victim.lives === 1 ? 'life' : 'lives'} left`}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex min-h-7 flex-wrap justify-center gap-1.5">
        <AnimatePresence initial={false}>
          {s.feed
            .filter((f) => f.answer)
            .slice(-8)
            .map((f) => (
              <motion.span key={f.id} layout initial={{ opacity: 0, y: 10, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1 text-sm">
                <span className="text-white/85">{f.answer}</span>
                <TierChip tier={f.tier} small />
              </motion.span>
            ))}
        </AnimatePresence>
      </div>

      <div className="relative sticky bottom-0 mt-auto w-full max-w-xl pb-14">
        <Burst trigger={landed} />
        {!myTurn && s.phase === 'turn' && holder && (
          <p className="mb-2 text-center text-white/80">
            {reading ? (
              <>
                read the prompt… <span className="font-semibold text-gold">{holder.name}</span> goes first
              </>
            ) : (
              <>
                <span className="font-semibold">{holder.name}</span> is answering · {secs}s
                {typing?.playerId === holder.id && typing.text ? <span className="font-mono text-gold"> · {typing.text}▌</span> : '…'}
              </>
            )}
          </p>
        )}
        {myTurn && <p className="mb-2 text-center font-mono text-xs uppercase tracking-[0.2em] text-gold">{reading ? 'you are first — get ready…' : 'your turn — name one!'}</p>}
        <AnimatePresence>
          {miss && myTurn && miss.suggestions?.length ? (
            <motion.div key={miss.key} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DidYouMean text={miss.text ?? ''} options={miss.suggestions} pick={submit} />
            </motion.div>
          ) : miss && myTurn && (
            <motion.p key={miss.key} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mb-2 text-center font-mono text-xs text-coral">
              {miss.msg}
            </motion.p>
          )}
        </AnimatePresence>
        <motion.form
          ref={shakeRef}
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
          className={`glass flex items-center gap-2 rounded-2xl p-2 transition ${myTurn ? 'glass-gold ring-2 ring-gold/70' : 'opacity-60'}`}
        >
          <input
            ref={inputRef}
            value={value}
            disabled={!myTurn}
            maxLength={60}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="send"
            aria-label="Your answer"
            onChange={(e) => {
              setValue(e.target.value)
              emit('party:typing', e.target.value)
            }}
            placeholder={myTurn ? 'name one…' : 'wait for your turn…'}
            className="min-w-0 flex-1 bg-transparent px-3 py-3 text-lg focus:outline-none"
          />
          {myTurn && <TimerRing frac={frac} secs={reading ? s.settings.turnSeconds : secs} size={46} urgent={urgent} />}
          <button disabled={!myTurn} className="btn-glow rounded-xl px-5 py-3 font-bold uppercase tracking-wider">
            Pass
          </button>
        </motion.form>
      </div>
    </div>
  )
}

function Between({ s, me, emit, now }: { s: PartyState; me: string; emit: Emit; now: number }) {
  const r = s.reveal!
  const victim = s.lastPop ? s.players.find((p) => p.id === s.lastPop!.playerId) : null
  const left = s.nextAt ? Math.max(0, Math.ceil((s.nextAt - now) / 1000)) : 0
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex w-full max-w-xl flex-col items-center gap-4 py-4 text-center">
      <span className="eyebrow text-gold/80">question {s.questionNo} · {r.rounds} round{r.rounds === 1 ? '' : 's'}</span>
      <h2 className="font-serif text-2xl font-semibold text-ivory sm:text-3xl">{s.prompt?.text}</h2>
      {r.survivedAll ? (
        <p className="font-display text-xl text-gold">🙌 Everyone survived {r.rounds} rounds!</p>
      ) : (
        victim && <p className="font-display text-xl text-coral">🔥 {victim.id === me ? 'You' : victim.name} lost a life</p>
      )}
      <AnswerBoard items={r.answers.map((a) => ({ name: a.name, ref: a.ref, tier: a.tier, found: a.found }))} title="Every answer" note={`${r.answers.filter((a) => a.found).length} named · tap to read`} />
      <div className="flex items-center gap-3">
        <span className="eyebrow text-white/60">next question in {left}s</span>
        {s.hostId === me && (
          <button onClick={() => emit('party:skip')} className="btn-glow rounded-full px-5 py-2 text-sm font-bold uppercase tracking-wider">
            Next now ▶
          </button>
        )}
      </div>
    </motion.div>
  )
}

function ReactionBar({ emit }: { emit: Emit }) {
  return (
    <div className="glass fixed inset-x-0 bottom-[max(0.5rem,env(safe-area-inset-bottom))] z-30 mx-auto flex w-fit gap-0.5 rounded-full px-2 py-1">
      {REACTIONS.map((e) => (
        <motion.button key={e} whileTap={{ scale: 1.5 }} whileHover={{ y: -3 }} onClick={() => emit('party:react', e)} className="grid h-9 w-9 place-items-center rounded-full text-xl hover:bg-white/10" aria-label={`React ${e}`}>
          {e}
        </motion.button>
      ))}
    </div>
  )
}

function Over({ s, me, emit }: { s: PartyState; me: string; emit: Emit }) {
  const winner = s.players.find((p) => p.id === s.winnerId)
  const ranked = [...s.players].filter((p) => !p.spectator).sort((a, b) => b.lives - a.lives || b.answers - a.answers)
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative flex w-full max-w-md flex-col items-center gap-5 pb-14 text-center">
      <Burst trigger={s.winnerId ?? 'x'} count={48} />
      <span className="eyebrow text-white/60">last rider standing</span>
      {winner ? (
        <>
          <motion.div initial={{ y: 30, rotate: -10 }} animate={{ y: 0, rotate: 0 }} transition={{ type: 'spring' }} className="relative">
            <span className="anim-halo absolute -inset-4 rounded-full" style={{ background: 'radial-gradient(circle, rgba(243,212,140,0.5), transparent 70%)' }} />
            <Avatar p={winner} size={96} />
          </motion.div>
          <h2 className="text-gilded font-display text-5xl font-extrabold">{winner.id === me ? 'You win!' : `${winner.name} wins!`}</h2>
          <p className="font-serif text-lg italic text-ivory/80">“Well done, good and faithful servant.” — Matthew 25:21</p>
        </>
      ) : (
        <h2 className="font-display text-4xl font-extrabold">Everyone fell</h2>
      )}
      <ol className="glass ornate w-full rounded-2xl p-3 text-left">
        {ranked.map((p, i) => (
          <li key={p.id} className="flex items-center gap-3 px-2 py-1.5">
            <span className="w-5 font-display font-bold text-gold">{i + 1}</span>
            <Avatar p={p} size={30} />
            <span className="flex-1 truncate">{p.name}</span>
            <span className="font-mono text-xs text-white/60">
              {p.answers} {p.answers === 1 ? 'answer' : 'answers'}
            </span>
          </li>
        ))}
      </ol>
      {s.hostId === me ? (
        <button onClick={() => emit('party:lobby')} className="btn-glow w-full rounded-full py-4 text-lg font-bold uppercase tracking-wider">
          Play again
        </button>
      ) : (
        <p className="eyebrow text-white/60">waiting for the host…</p>
      )}
      <button onClick={() => go('/')} className="eyebrow text-white/50 hover:underline">
        back to the hills
      </button>
    </motion.div>
  )
}
