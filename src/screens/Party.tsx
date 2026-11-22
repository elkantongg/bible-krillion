import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { io, type Socket } from 'socket.io-client'
import type { PartyPlayer, PartyState } from '../../shared/types'
import { playerToken } from '../lib/api'
import { setDepth } from '../lib/ocean'
import { go } from '../lib/router'
import { sfx } from '../lib/sound'
import { load, save } from '../lib/storage'
import { HomeButton, MuteButton, Spinner, TierChip, useShake } from '../components/ui'

let socketP: Promise<{ socket: Socket; me: string }> | null = null
function connect() {
  socketP ??= playerToken().then((token) => ({
    socket: io({ auth: { token }, transports: ['websocket', 'polling'] }),
    me: token.split('.')[0],
  }))
  return socketP
}

const CODE_RE = /^[A-Z]{4}$/

function NameField({ value, onChange, autoFocus }: { value: string; onChange: (s: string) => void; autoFocus?: boolean }) {
  return (
    <label className="flex w-full flex-col gap-1.5 text-left">
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/60">your diver name</span>
      <input
        value={value}
        autoFocus={autoFocus}
        maxLength={16}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Barnabas"
        className="glass rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-glow/60"
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
  useEffect(() => setDepth(1250), [])

  const create = async () => {
    if (!name.trim()) return setErr('Pick a name first')
    save('deep.name', name.trim())
    setBusy(true)
    setErr('')
    try {
      const { socket } = await connect()
      // never leave the button spinning if the server is unreachable
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
        <HomeButton />
        <MuteButton />
      </header>
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-6 px-4 pb-10 text-center">
        <GreatFish size={150} mouth={0.4} />
        <div>
          <h1 className="font-display text-5xl font-extrabold">Big Fish</h1>
          <p className="mt-2 text-white/75">
            Name an answer, then pass the fish. Somewhere inside, a hidden clock is ticking — whoever's holding it when it runs out gets
            swallowed. Last diver swimming wins.
          </p>
        </div>
        <NameField value={name} onChange={setName} />
        <button onClick={() => void create()} disabled={busy} className="btn-glow w-full rounded-full px-6 py-4 text-lg font-bold uppercase tracking-wider">
          {busy ? 'Making waves…' : 'Create a room'}
        </button>
        <div className="flex w-full items-center gap-3 text-white/40">
          <span className="h-px flex-1 bg-white/15" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em]">or join</span>
          <span className="h-px flex-1 bg-white/15" />
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
            className="glass w-full min-w-0 flex-1 rounded-xl px-4 py-3 text-center font-mono text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-glow/60"
          />
          <button className="btn-ghost rounded-xl px-6 font-bold uppercase">Join</button>
        </form>
        {err && <p className="text-sm text-coral">{err}</p>}
      </main>
    </div>
  )
}

/* ---------- /party/:code ---------- */
export function PartyRoom({ code }: { code: string }) {
  const [name, setName] = useState(load('deep.name') ?? '')
  const [ready, setReady] = useState(!!load('deep.name'))
  const [state, setState] = useState<PartyState | null>(null)
  const [me, setMe] = useState('')
  const [err, setErr] = useState('')
  const [typing, setTyping] = useState<{ playerId: string; text: string } | null>(null)
  const socketRef = useRef<Socket | null>(null)
  const prev = useRef<PartyState | null>(null)

  useEffect(() => setDepth(1250), [])

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
      else if (state.phase === 'playing' && p.holderId && state.holderId !== p.holderId) sfx.pass()
      if (state.phase === 'over' && p.phase !== 'over') sfx.win()
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
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/60">joining room</p>
          <p className="font-mono text-5xl font-bold tracking-[0.3em] text-glow">{code}</p>
          <NameField value={name} onChange={setName} autoFocus />
          <button className="btn-glow w-full rounded-full py-4 text-lg font-bold uppercase tracking-wider">Dive in</button>
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
  return (
    <Shell code={code}>
      {state.phase === 'lobby' && <Lobby s={state} me={me} emit={emit} />}
      {(state.phase === 'playing' || state.phase === 'popped') && <Game s={state} me={me} emit={emit} typing={typing} />}
      {state.phase === 'over' && <Over s={state} me={me} emit={emit} />}
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
        <span className="font-display text-lg font-bold">
          Big Fish {code && <span className="ml-1 font-mono text-sm tracking-[0.2em] text-glow">{code}</span>}
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
        background: `radial-gradient(circle at 35% 30%, hsl(${p.hue} 90% 85%), hsl(${p.hue} 70% 58%))`,
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
        <span key={i} className={`h-1.5 w-1.5 rounded-full ${i < n ? 'bg-glow shadow-[0_0_6px_#7ef6dc]' : 'bg-white/20'}`} />
      ))}
    </span>
  )
}

type Emit = (ev: string, data?: unknown, ack?: (r: never) => void) => void

function Lobby({ s, me, emit }: { s: PartyState; me: string; emit: Emit }) {
  const isHost = s.hostId === me
  const [copied, setCopied] = useState(false)
  const [err, setErr] = useState('')
  const url = `${location.origin}/party/${s.code}`
  const players = s.players.filter((p) => p.connected)
  const invite = async () => {
    try {
      if (navigator.share && matchMedia('(pointer: coarse)').matches) await navigator.share({ title: 'Big Fish', text: `Join my Big Fish room: ${s.code}`, url })
      else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {
      /* cancelled */
    }
  }
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex w-full max-w-md flex-col items-center gap-6 text-center">
      <div className="flex flex-col items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/60">room code</span>
        <div className="flex gap-2">
          {s.code.split('').map((c, i) => (
            <span key={i} className="glass grid h-16 w-14 place-items-center rounded-xl font-mono text-4xl font-bold text-glow sm:h-20 sm:w-16 sm:text-5xl">
              {c}
            </span>
          ))}
        </div>
        <button onClick={() => void invite()} className="btn-ghost mt-2 rounded-full px-5 py-2 text-sm font-semibold">
          {copied ? 'Link copied!' : '🔗 Copy invite link'}
        </button>
      </div>

      <div className="glass w-full rounded-2xl p-4">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/60">divers ({players.length}/12)</p>
        <ul className="flex flex-wrap justify-center gap-3">
          <AnimatePresence>
            {players.map((p) => (
              <motion.li key={p.id} layout initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex w-16 flex-col items-center gap-1">
                <Avatar p={p} size={44} />
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

      <div className="flex items-center gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/60">lives</span>
        {[1, 2, 3].map((n) => (
          <button
            key={n}
            disabled={!isHost}
            onClick={() => emit('party:lives', n)}
            className={`h-9 w-9 rounded-full font-mono font-bold transition ${s.settings.lives === n ? 'bg-glow text-ink' : 'btn-ghost text-white/70'}`}
          >
            {n}
          </button>
        ))}
      </div>

      {isHost ? (
        <button
          disabled={players.length < 2}
          onClick={() => emit('party:start', null, ((r: { ok: boolean; error?: string }) => !r.ok && setErr(r.error ?? '')) as never)}
          className="btn-glow w-full rounded-full py-4 text-lg font-bold uppercase tracking-wider"
        >
          {players.length < 2 ? 'Waiting for divers…' : 'Start the game'}
        </button>
      ) : (
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/60">waiting for the host to start…</p>
      )}
      {err && <p className="text-sm text-coral">{err}</p>}
    </motion.div>
  )
}

function GreatFish({ size, mouth, angle = 0, wobble = 0 }: { size: number; mouth: number; angle?: number; wobble?: number }) {
  const m = Math.max(0, Math.min(1, mouth))
  return (
    <motion.div style={{ width: size, height: size * 0.7 }} animate={{ rotate: angle }} transition={{ type: 'spring', stiffness: 90, damping: 14 }}>
      <svg
        viewBox="0 0 200 140"
        className="h-full w-full overflow-visible"
        style={{ scale: Math.abs(((angle % 360) + 540) % 360 - 180) > 90 ? '1 -1' : '1 1', transition: 'scale 0.3s', animation: wobble ? `bob ${Math.max(0.35, 2.2 - wobble * 1.8)}s ease-in-out infinite` : undefined, filter: `drop-shadow(0 0 ${12 + m * 24}px rgba(255,127,110,${0.2 + m * 0.5}))` }}
      >
        <defs>
          <radialGradient id="fishBody" cx="0.45" cy="0.35" r="0.8">
            <stop offset="0" stopColor="#7fd6e8" />
            <stop offset="0.55" stopColor="#2a7fa6" />
            <stop offset="1" stopColor="#0d3b5c" />
          </radialGradient>
        </defs>
        {/* tail */}
        <path d="M20 70 L-18 36 Q -8 70 -18 104 Z" fill="#1c6488" />
        {/* body with an opening jaw on the right */}
        <path
          d={`M18 70 Q 30 14 110 16 Q 168 20 ${186 - m * 8} ${62 - m * 26} L 140 ${70} L ${186 - m * 8} ${78 + m * 26} Q 168 122 110 124 Q 30 126 18 70 Z`}
          fill="url(#fishBody)"
        />
        <path d="M70 30 Q 96 6 122 22" fill="#1c6488" />
        <path d="M60 96 Q 80 122 100 110" fill="#1c6488" />
        {/* belly stripes */}
        <path d="M60 104 Q 100 116 140 100" stroke="#a9e7f2" strokeWidth="3" fill="none" opacity="0.35" />
        {/* eye */}
        <circle cx="128" cy="44" r="11" fill="#f3fbff" />
        <circle cx={131 + m * 2} cy="44" r={5 + m * 2} fill="#031024" />
        <circle cx="133" cy="41" r="2" fill="#fff" />
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
  const [miss, setMiss] = useState<{ key: number; msg: string } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const shakeRef = useShake<HTMLFormElement>(miss?.key)
  const myTurn = s.phase === 'playing' && s.holderId === me
  const seats = s.players.filter((p) => !p.spectator)
  const holder = s.players.find((p) => p.id === s.holderId)
  const victim = s.lastPop ? s.players.find((p) => p.id === s.lastPop!.playerId) : null
  const elapsed = s.roundStartedAt ? Math.max(0, now - s.roundStartedAt) : 0
  const swell = Math.min(1, elapsed / 30000)
  const [w, setW] = useState(() => Math.min(window.innerWidth - 32, 620))
  useEffect(() => {
    const r = () => setW(Math.min(window.innerWidth - 32, 620))
    window.addEventListener('resize', r)
    return () => window.removeEventListener('resize', r)
  }, [])
  const h = Math.max(260, Math.min(380, w * 0.68))
  const rx = w / 2 - 34
  const ry = h / 2 - 36
  const holderIdx = seats.findIndex((p) => p.id === s.holderId)
  const angleOf = (i: number) => (i / seats.length) * Math.PI * 2 - Math.PI / 2
  const fishAngle = holderIdx >= 0 ? (Math.atan2(Math.sin(angleOf(holderIdx)) * ry, Math.cos(angleOf(holderIdx)) * rx) * 180) / Math.PI : 0

  useEffect(() => {
    if (myTurn) {
      setValue('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [myTurn, s.holderId])

  const submit = () => {
    const text = value.trim()
    if (!text || !myTurn) return
    emit('party:answer', { text }, ((r: { ok: boolean; reason?: string }) => {
      if (r.ok) {
        setValue('')
        emit('party:typing', '')
      } else {
        sfx.miss()
        setMiss({ key: Date.now(), msg: r.reason === 'used' ? `“${text}” was already said!` : `“${text}” doesn't fit — try another` })
        setValue('')
      }
    }) as never)
  }

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-3">
      <div className="text-center">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-glow/80">{s.prompt?.category}</span>
        <h2 className="text-shadow-glow text-balance font-display text-2xl font-semibold leading-tight sm:text-4xl">{s.prompt?.text}</h2>
      </div>

      <div className="relative" style={{ width: w, height: h }}>
        {seats.map((p, i) => {
          const a = angleOf(i)
          const x = w / 2 + Math.cos(a) * rx
          const y = h / 2 + Math.sin(a) * ry
          const isHolder = p.id === s.holderId
          const out = p.lives <= 0
          return (
            <motion.div
              key={p.id}
              className="absolute flex w-20 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5"
              style={{ left: x, top: y }}
              animate={{ scale: isHolder ? 1.15 : 1 }}
            >
              <span className={`rounded-full p-0.5 ${isHolder ? 'ring-2 ring-coral shadow-[0_0_20px_#ff7f6e]' : ''}`}>
                <Avatar p={p} size={w < 420 ? 34 : 42} dim={out || !p.connected} />
              </span>
              <span className={`max-w-full truncate text-[11px] font-semibold ${p.id === me ? 'text-glow' : ''}`}>{p.name}</span>
              {out ? <span className="text-[10px] text-white/45">swallowed</span> : <Lives n={p.lives} max={s.settings.lives} />}
            </motion.div>
          )
        })}

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div animate={{ scale: s.phase === 'popped' ? 1.7 : 1 + swell * 0.45 }} transition={{ type: 'spring', stiffness: 120, damping: 10 }}>
            <GreatFish size={w < 420 ? 96 : 130} mouth={s.phase === 'popped' ? 1 : 0.1 + swell * 0.6} angle={fishAngle} wobble={swell} />
          </motion.div>
        </div>

        <AnimatePresence>
          {s.phase === 'popped' && victim && (
            <motion.div
              key={s.lastPop?.at}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 text-center"
            >
              <span className="font-display text-6xl font-extrabold text-coral drop-shadow-[0_0_30px_#ff7f6e] sm:text-7xl">GULP!</span>
              <span className="glass rounded-full px-4 py-1.5 font-semibold">
                {victim.id === me ? 'You were' : `${victim.name} was`} swallowed
                {s.lastPop?.eliminated ? ' — out!' : ` · ${victim.lives} left`}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex min-h-7 flex-wrap justify-center gap-1.5">
        <AnimatePresence initial={false}>
          {s.feed.slice(-5).map((f) => (
            <motion.span key={f.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-1 text-sm">
              <span className="text-white/85">{f.answer}</span>
              <TierChip tier={f.tier} small />
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      <div className="sticky bottom-0 mt-auto w-full max-w-xl pb-1">
        {!myTurn && s.phase === 'playing' && holder && (
          <p className="mb-2 text-center text-white/75">
            <span className="font-semibold">{holder.name}</span> has the fish
            {typing?.playerId === holder.id && typing.text ? <span className="font-mono text-glow"> · {typing.text}▌</span> : '…'}
          </p>
        )}
        {myTurn && <p className="mb-2 text-center font-mono text-xs uppercase tracking-[0.2em] text-coral">your turn — name one & pass it!</p>}
        <AnimatePresence>
          {miss && myTurn && (
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
          className={`glass flex gap-2 rounded-2xl p-2 transition ${myTurn ? 'ring-2 ring-coral/70' : 'opacity-60'}`}
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
            placeholder={myTurn ? 'name one…' : 'wait for the fish…'}
            className="min-w-0 flex-1 bg-transparent px-3 py-3 text-lg focus:outline-none"
          />
          <button disabled={!myTurn} className="btn-glow rounded-xl px-5 font-bold uppercase tracking-wider">
            Pass
          </button>
        </motion.form>
      </div>
    </div>
  )
}

function Over({ s, me, emit }: { s: PartyState; me: string; emit: Emit }) {
  const winner = s.players.find((p) => p.id === s.winnerId)
  const ranked = [...s.players].filter((p) => !p.spectator).sort((a, b) => b.lives - a.lives || b.answers - a.answers)
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex w-full max-w-md flex-col items-center gap-5 text-center">
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/60">last diver swimming</span>
      {winner ? (
        <>
          <motion.div initial={{ y: 30, rotate: -10 }} animate={{ y: 0, rotate: 0 }} transition={{ type: 'spring' }}>
            <Avatar p={winner} size={96} />
          </motion.div>
          <h2 className="font-display text-5xl font-extrabold text-amber">{winner.id === me ? 'You win!' : `${winner.name} wins!`}</h2>
        </>
      ) : (
        <h2 className="font-display text-4xl font-extrabold">Everyone was swallowed</h2>
      )}
      <ol className="glass w-full rounded-2xl p-3 text-left">
        {ranked.map((p, i) => (
          <li key={p.id} className="flex items-center gap-3 px-2 py-1.5">
            <span className="w-5 font-mono text-white/50">{i + 1}</span>
            <Avatar p={p} size={30} />
            <span className="flex-1 truncate">{p.name}</span>
            <span className="font-mono text-xs text-white/60">{p.answers} {p.answers === 1 ? 'answer' : 'answers'}</span>
          </li>
        ))}
      </ol>
      {s.hostId === me ? (
        <button onClick={() => emit('party:lobby')} className="btn-glow w-full rounded-full py-4 text-lg font-bold uppercase tracking-wider">
          Play again
        </button>
      ) : (
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/60">waiting for the host…</p>
      )}
      <button onClick={() => go('/')} className="font-mono text-xs uppercase tracking-[0.2em] text-white/50 hover:underline">
        back to the surface
      </button>
    </motion.div>
  )
}
