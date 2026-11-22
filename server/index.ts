import express from 'express'
import { createServer } from 'node:http'
import { createHmac, createHash, randomBytes, timingSafeEqual } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Server } from 'socket.io'
import { openDb } from './db'
import { SoloService, GameError } from './solo'
import { PartyRoom, makeCode, realClock } from './party'

// --- config (.env is optional; real env vars win) ---
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const envFile = resolve(root, '.env')
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/)
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2]
  }
}
const PORT = Number((process.env.NODE_ENV === "production" ? process.env.PORT : process.env.API_PORT) ?? process.env.API_PORT ?? 8787)
const SECRET = process.env.PLAYER_SECRET ?? 'dev-only-secret'
const LAUNCH = process.env.LAUNCH_DATE ?? '2026-11-23'
const PROD = process.env.NODE_ENV === 'production'
if (PROD && SECRET === 'dev-only-secret') console.warn('⚠ PLAYER_SECRET is not set — set it in production')

const db = openDb(resolve(root, process.env.DB_PATH ?? './data/deep.db'))
const solo = new SoloService(db, { launch: LAUNCH })

// --- anonymous player tokens: "<id>.<hmac>" ---
const sign = (id: string) => createHmac('sha256', SECRET).update(id).digest('base64url').slice(0, 32)
function verify(token: unknown): string | null {
  if (typeof token !== 'string') return null
  const [id, sig] = token.split('.')
  if (!id || !sig || id.length > 40) return null
  const a = Buffer.from(sig)
  const b = Buffer.from(sign(id))
  return a.length === b.length && timingSafeEqual(a, b) ? id : null
}
const ipHash = (ip: string) => createHash('sha256').update(SECRET + ip).digest('hex').slice(0, 20)

// --- tiny in-memory rate limiter ---
const buckets = new Map<string, { n: number; reset: number }>()
function limited(k: string, max: number, windowMs: number) {
  const now = Date.now()
  const b = buckets.get(k)
  if (!b || b.reset < now) {
    buckets.set(k, { n: 1, reset: now + windowMs })
    return false
  }
  b.n++
  return b.n > max
}
setInterval(() => {
  const now = Date.now()
  for (const [k, b] of buckets) if (b.reset < now) buckets.delete(k)
}, 60_000).unref()

const app = express()
app.set('trust proxy', 1)
app.use(express.json({ limit: '4kb' }))

app.use('/api', (req, res, next) => {
  if (limited('api:' + req.ip, 240, 60_000)) return void res.status(429).json({ error: 'Slow down a little' })
  next()
})

app.post('/api/player', (req, res) => {
  if (limited('new:' + req.ip, 30, 3_600_000)) return void res.status(429).json({ error: 'Too many new players' })
  const id = randomBytes(12).toString('base64url')
  res.json({ token: `${id}.${sign(id)}` })
})

app.get('/api/meta', (_req, res) => {
  res.json({ launch: LAUNCH, maxDive: solo.maxDive(), serverNow: Date.now() })
})

type Handler = (req: express.Request, player: string) => unknown
const authed = (fn: Handler): express.RequestHandler => (req, res) => {
  const player = verify(req.header('x-player'))
  if (!player) return void res.status(401).json({ error: 'Missing or invalid player token' })
  try {
    res.json(fn(req, player))
  } catch (e) {
    if (e instanceof GameError) return void res.status(e.status).json({ error: e.message })
    console.error(e)
    res.status(500).json({ error: 'Something went wrong below deck' })
  }
}
const num = (v: unknown) => Number.parseInt(String(v), 10)

app.get('/api/dive/:n', authed((req, p) => solo.state(p, num(req.params.n))))
app.post('/api/dive/:n/open', authed((req, p) => solo.open(p, num(req.params.n), num(req.body?.idx))))
app.post('/api/dive/:n/answer', authed((req, p) => {
  if (limited('ans:' + p, 90, 60_000)) throw new GameError(429, 'Too many answers')
  return solo.answer(p, num(req.params.n), num(req.body?.idx), String(req.body?.text ?? ''), ipHash(req.ip ?? ''))
}))
app.post('/api/dive/:n/expire', authed((req, p) => solo.expire(p, num(req.params.n), num(req.body?.idx))))
app.get('/api/archive', authed((_req, p) => solo.archive(p)))

app.use('/api', (_req, res) => void res.status(404).json({ error: 'Not found' }))

// --- static client in production ---
const dist = resolve(root, 'dist')
if (PROD && existsSync(dist)) {
  app.use(express.static(dist, { index: false, maxAge: '1h' }))
  app.get(/^(?!\/api|\/socket\.io).*/, (_req, res) => res.sendFile(resolve(dist, 'index.html')))
}

// --- Big Fish party rooms over socket.io ---
const http = createServer(app)
const io = new Server(http, { cors: PROD ? undefined : { origin: true }, maxHttpBufferSize: 4096 })
const rooms = new Map<string, PartyRoom>()
const broadcast = (room: PartyRoom) => io.to(room.code).emit('party:state', room.snapshot())

io.use((socket, next) => {
  const id = verify(socket.handshake.auth?.token)
  if (!id) return next(new Error('unauthorized'))
  socket.data.player = id
  next()
})

io.on('connection', (socket) => {
  const player: string = socket.data.player
  let code: string | null = null

  const stillHere = (c: string) => {
    for (const s of io.sockets.adapter.rooms.get(c) ?? []) if (io.sockets.sockets.get(s)?.data.player === player) return true
    return false
  }
  const leaveCurrent = () => {
    if (!code) return
    const c = code
    socket.leave(c)
    code = null
    if (!stillHere(c)) rooms.get(c)?.setConnected(player, false)
  }
  const enter = (room: PartyRoom, name: string) => {
    if (code && code !== room.code) leaveCurrent()
    const r = room.join(player, String(name ?? ''))
    if (!r.ok) return r
    code = room.code
    socket.join(room.code)
    socket.emit('party:state', room.snapshot())
    return { ok: true, code: room.code }
  }
  const guard = () => !limited('sock:' + player, 40, 10_000)

  socket.on('party:create', (msg, ack) => {
    if (typeof ack !== 'function') return
    if (!guard()) return ack({ ok: false, error: 'Slow down a little' })
    if (limited('room:' + socket.handshake.address, 20, 3_600_000)) return ack({ ok: false, error: 'Too many rooms' })
    const c = makeCode((x) => rooms.has(x))
    const room = new PartyRoom(c, realClock, broadcast)
    rooms.set(c, room)
    ack(enter(room, msg?.name))
  })
  socket.on('party:join', (msg, ack) => {
    if (typeof ack !== 'function') return
    if (!guard()) return ack({ ok: false, error: 'Slow down a little' })
    const room = rooms.get(String(msg?.code ?? '').toUpperCase().trim())
    if (!room) return ack({ ok: false, error: 'No room with that code' })
    ack(enter(room, msg?.name))
  })
  const inRoom = () => (code ? rooms.get(code) : undefined)
  socket.on('party:start', (_m, ack) => {
    const r = inRoom()?.start(player) ?? { ok: false, error: 'Not in a room' }
    if (typeof ack === 'function') ack(r)
  })
  socket.on('party:lives', (n) => inRoom()?.setLives(player, Number(n)))
  socket.on('party:lobby', () => inRoom()?.backToLobby(player))
  socket.on('party:answer', (msg, ack) => {
    if (typeof ack !== 'function') return
    if (!guard()) return ack({ ok: false, reason: 'empty' })
    const room = inRoom()
    if (!room) return ack({ ok: false, reason: 'not-playing' })
    const r = room.answer(player, String(msg?.text ?? ''))
    if (!r.ok && r.reason !== 'not-your-turn') socket.to(room.code).emit('party:miss', { playerId: player, reason: r.reason })
    ack(r)
  })
  socket.on('party:typing', (text) => {
    const room = inRoom()
    if (!room || room.holderId !== player || limited('type:' + player, 60, 5_000)) return
    socket.to(room.code).emit('party:typing', { playerId: player, text: String(text ?? '').slice(0, 60) })
  })
  socket.on('party:leave', () => {
    const room = inRoom()
    leaveCurrent()
    room?.leave(player)
  })
  socket.on('disconnect', () => leaveCurrent())
})

setInterval(() => {
  const now = Date.now()
  for (const [c, room] of rooms) {
    const empty = !room.players.some((p) => p.connected)
    if (empty && now - room.lastActive > 10 * 60_000) {
      room.dispose()
      rooms.delete(c)
    }
  }
}, 60_000).unref()

http.listen(PORT, () => console.log(`🌊 Into the Deep API on http://localhost:${PORT}`))
