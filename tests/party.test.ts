import { describe, expect, it } from 'vitest'
import { PartyRoom, FUSE_FLOOR, POP_PAUSE, type Clock } from '../server/party'
import { QUESTIONS } from '../shared/data/index'

function fakeClock() {
  let now = 1_000_000
  let timers: { at: number; fn: () => void; id: number }[] = []
  let seq = 0
  const clock: Clock = {
    now: () => now,
    setTimeout: (fn, ms) => {
      const id = ++seq
      timers.push({ at: now + ms, fn, id })
      return id
    },
    clearTimeout: (h) => {
      timers = timers.filter((t) => t.id !== h)
    },
    random: () => 0.5,
  }
  const advance = (ms: number) => {
    const end = now + ms
    for (;;) {
      timers.sort((a, b) => a.at - b.at)
      const next = timers[0]
      if (!next || next.at > end) break
      timers.shift()
      now = next.at
      next.fn()
    }
    now = end
  }
  return { clock, advance }
}

const validFor = (room: PartyRoom, skip: Set<string> = new Set()) => {
  const q = QUESTIONS.find((x) => x.text === room.question!.text)!
  const a = q.answers.find((x) => !room.used.has(x.id) && !skip.has(x.id))!
  return a.name
}

function setup(n = 3) {
  const { clock, advance } = fakeClock()
  const room = new PartyRoom('ABCD', clock)
  for (let i = 0; i < n; i++) room.join('p' + i, 'P' + i)
  return { room, advance }
}

describe('Big Fish party room', () => {
  it('needs the host and two players to start', () => {
    const { clock } = fakeClock()
    const room = new PartyRoom('ABCD', clock)
    room.join('a', 'A')
    expect(room.start('a').ok).toBe(false)
    room.join('b', 'B')
    expect(room.start('b').ok).toBe(false)
    expect(room.start('a').ok).toBe(true)
    expect(room.phase).toBe('playing')
  })

  it('only the holder can answer, and valid answers pass the fish', () => {
    const { room } = setup()
    room.start('p0')
    const holder = room.holderId!
    const other = room.players.find((p) => p.id !== holder)!.id
    expect(room.answer(other, validFor(room))).toEqual({ ok: false, reason: 'not-your-turn' })
    expect(room.answer(holder, 'zzzz not a thing')).toEqual({ ok: false, reason: 'nomatch' })
    const r = room.answer(holder, validFor(room))
    expect(r.ok).toBe(true)
    expect(room.holderId).not.toBe(holder)
  })

  it('rejects answers already used this round', () => {
    const { room } = setup(2)
    room.start('p0')
    const first = validFor(room)
    room.answer(room.holderId!, first)
    expect(room.answer(room.holderId!, first)).toEqual({ ok: false, reason: 'used' })
  })

  it('pops on whoever holds the fish when the hidden fuse runs out', () => {
    const { room, advance } = setup(2)
    room.start('p0')
    const holder = room.holderId!
    advance(room.fuseEnd - 1_000_000 + 1)
    expect(room.phase).toBe('popped')
    expect(room.lastPop?.playerId).toBe(holder)
    expect(room.players.find((p) => p.id === holder)!.lives).toBe(1)
    advance(POP_PAUSE + 1)
    expect(room.phase).toBe('playing')
  })

  it('never leaves the next player less than the floor', () => {
    const { room, advance } = setup(2)
    room.start('p0')
    const fuse = room.fuseEnd
    advance(fuse - 1_000_000 - 2000) // 2 s left
    room.answer(room.holderId!, validFor(room))
    expect(room.fuseEnd - 1_000_000 - (fuse - 1_000_000 - 2000)).toBe(FUSE_FLOOR)
  })

  it('ends with the last diver swimming', () => {
    const { room, advance } = setup(2)
    room.setLives('p0', 1)
    room.start('p0')
    const loser = room.holderId!
    advance(room.fuseEnd - 1_000_000 + 1)
    expect(room.phase).toBe('popped') // the final swallow is shown first
    expect(room.lastPop).toMatchObject({ playerId: loser, eliminated: true })
    advance(POP_PAUSE + 1)
    expect(room.phase).toBe('over')
    expect(room.winnerId).not.toBe(loser)
    room.backToLobby('p0')
    expect(room.phase).toBe('lobby')
    expect(room.players.every((p) => p.lives === 1)).toBe(true)
  })

  it('ends the game if everyone else disconnects, and hands host on', () => {
    const { room } = setup(2)
    room.start('p0')
    room.setConnected('p0', false)
    expect(room.hostId).toBe('p1')
    expect(room.phase).toBe('over')
    expect(room.winnerId).toBe('p1')
  })

  it('gives host back to whoever returns to an abandoned room', () => {
    const { room } = setup(2)
    room.start('p0')
    room.setConnected('p0', false) // game over, host → p1
    room.setConnected('p1', false) // nobody left to inherit
    room.join('p0', 'back again')
    expect(room.hostId).toBe('p0')
    room.backToLobby('p0')
    expect(room.phase).toBe('lobby')
  })

  it('seats late joiners as spectators', () => {
    const { room } = setup(2)
    room.start('p0')
    room.join('late', 'Late')
    expect(room.players.find((p) => p.id === 'late')!.spectator).toBe(true)
  })

  it('rejoining keeps your seat (reconnect)', () => {
    const { room } = setup(2)
    room.start('p0')
    room.setConnected('p1', false)
    room.join('p1', 'P1')
    expect(room.players.filter((p) => p.id === 'p1')).toHaveLength(1)
    expect(room.players.find((p) => p.id === 'p1')!.connected).toBe(true)
  })
})
