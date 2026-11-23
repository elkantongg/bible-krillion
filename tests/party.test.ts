import { describe, expect, it } from 'vitest'
import { PartyRoom, LEAD_MS, GRACE_MS, POP_PAUSE, BETWEEN_MS, partyPool, type Clock } from '../server/party'
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
  return { clock, advance, now: () => now }
}

const valid = (room: PartyRoom) => {
  const q = QUESTIONS.find((x) => x.text === room.question!.text)!
  return q.answers.find((x) => !room.used.has(x.id))!.name
}

function setup(n = 3, settings: Parameters<PartyRoom['updateSettings']>[1] = {}) {
  const t = fakeClock()
  const room = new PartyRoom('ABCD', t.clock)
  for (let i = 0; i < n; i++) room.join('p' + i, 'P' + i)
  room.updateSettings('p0', settings)
  return { room, ...t }
}
/** start the game and skip the reading time */
const begin = (room: PartyRoom, advance: (ms: number) => void) => {
  expect(room.start('p0').ok).toBe(true)
  advance(LEAD_MS)
}
const timeOut = (room: PartyRoom, advance: (ms: number) => void, now: () => number) => advance(room.turnEndsAt! - now() + GRACE_MS + 1)

describe('Big Fish party room', () => {
  it('needs the host and two players to start', () => {
    const { clock } = fakeClock()
    const room = new PartyRoom('ABCD', clock)
    room.join('a', 'A')
    expect(room.start('a').ok).toBe(false)
    room.join('b', 'B')
    expect(room.start('b').ok).toBe(false)
    expect(room.start('a').ok).toBe(true)
    expect(room.phase).toBe('turn')
  })

  it('lets only the host change settings, clamped to the allowed range', () => {
    const { room } = setup(2)
    room.updateSettings('p1', { lives: 4 })
    expect(room.settings.lives).toBe(3)
    room.updateSettings('p0', { lives: 9, turnSeconds: 8, maxRounds: 40, difficulty: 'easy', categories: ['People', 'Nope'] })
    expect(room.settings).toMatchObject({ lives: 5, turnSeconds: 8, maxRounds: 15, difficulty: 'easy', categories: ['People'] })
    expect(room.players.every((p) => p.lives === 5)).toBe(true)
    room.updateSettings('p0', { turnSeconds: 7 }) // not an offered option
    expect(room.settings.turnSeconds).toBe(8)
  })

  it('uses the chosen turn length and difficulty', () => {
    const { room, now } = setup(2, { turnSeconds: 10, difficulty: 'easy' })
    room.start('p0')
    expect(room.turnEndsAt! - now()).toBe(LEAD_MS + 10_000)
    expect(room.question!.difficulty).toBe(1)
    expect(partyPool({ difficulty: 'hard', categories: [] }).every((q) => q.difficulty! >= 2)).toBe(true)
  })

  it('only the diver whose turn it is can answer, and a correct answer passes the same question on', () => {
    const { room, advance } = setup(3)
    begin(room, advance)
    const first = room.holderId!
    const other = room.order.find((id) => id !== first)!
    const q = room.question!.id
    expect(room.answer(other, valid(room))).toEqual({ ok: false, reason: 'not-your-turn' })
    expect(room.answer(first, 'zzzz not a thing')).toMatchObject({ ok: false, reason: 'nomatch' })
    expect(room.answer(first, valid(room)).ok).toBe(true)
    expect(room.holderId).toBe(room.order[1])
    expect(room.question!.id).toBe(q)
  })

  it('rejects answers already used on this question', () => {
    const { room, advance } = setup(2)
    begin(room, advance)
    const a = valid(room)
    room.answer(room.holderId!, a)
    expect(room.answer(room.holderId!, a)).toEqual({ ok: false, reason: 'used' })
  })

  it('A answers, B times out and loses a life, C still gets the question, then the round ends (spec example)', () => {
    const { room, advance, now } = setup(3)
    begin(room, advance)
    const [a, b, c] = room.order
    const q = room.question!.id
    expect(room.answer(a, valid(room)).ok).toBe(true)
    expect(room.holderId).toBe(b)
    timeOut(room, advance, now)
    expect(room.phase).toBe('popped')
    expect(room.players.find((p) => p.id === b)!.lives).toBe(2)
    advance(POP_PAUSE)
    expect(room.phase).toBe('turn')
    expect(room.holderId).toBe(c)
    expect(room.question!.id).toBe(q) // same question goes on to C
    expect(room.answer(c, valid(room)).ok).toBe(true)
    expect(room.phase).toBe('between') // someone lost a life this round → question over
    expect(room.reveal!.survivedAll).toBe(false)
    advance(BETWEEN_MS)
    expect(room.phase).toBe('turn')
    expect(room.question!.id).not.toBe(q)
    expect(room.questionNo).toBe(2)
  })

  it('keeps the same question going round after round while everyone answers', () => {
    const { room, advance } = setup(2)
    begin(room, advance)
    const q = room.question!.id
    for (let i = 0; i < 2; i++) room.answer(room.holderId!, valid(room))
    expect(room.round).toBe(2)
    expect(room.phase).toBe('turn')
    expect(room.question!.id).toBe(q)
  })

  it('caps a question at the round limit and everyone survives it', () => {
    const { room, advance } = setup(2, { maxRounds: 2 })
    room.start('p0')
    // pick a question with plenty of answers so it can't run dry
    room.question = QUESTIONS.find((x) => x.answers.length > 20)!
    advance(LEAD_MS)
    for (let i = 0; i < 4; i++) expect(room.answer(room.holderId!, valid(room)).ok).toBe(true)
    expect(room.phase).toBe('between')
    expect(room.reveal).toMatchObject({ survivedAll: true, rounds: 2 })
    expect(room.players.every((p) => p.lives === 3)).toBe(true)
  })

  it('ends the question without penalty if every answer has been used', () => {
    const { room, advance } = setup(2)
    room.start('p0')
    room.question = [...QUESTIONS].sort((a, b) => a.answers.length - b.answers.length)[0]
    advance(LEAD_MS)
    for (let i = 0; i < room.question.answers.length; i++) room.answer(room.holderId!, valid(room))
    expect(room.phase).toBe('between')
    expect(room.reveal!.survivedAll).toBe(true)
  })

  it('rotates who starts each question', () => {
    const { room, advance, now } = setup(3)
    begin(room, advance)
    const firstStarter = room.order[0]
    timeOut(room, advance, now)
    advance(POP_PAUSE)
    while (room.phase === 'turn') room.answer(room.holderId!, valid(room))
    room.skip('p0')
    expect(room.order[0]).not.toBe(firstStarter)
  })

  it('skips eliminated divers and ends with the last diver swimming', () => {
    const { room, advance, now } = setup(2, { lives: 1 })
    begin(room, advance)
    const loser = room.holderId!
    timeOut(room, advance, now)
    expect(room.lastPop).toMatchObject({ playerId: loser, eliminated: true })
    advance(POP_PAUSE)
    expect(room.phase).toBe('over')
    expect(room.winnerId).not.toBe(loser)
    room.backToLobby('p0')
    expect(room.phase).toBe('lobby')
    expect(room.players.every((p) => p.lives === 1)).toBe(true)
  })

  it('a diver who disconnects on their turn forfeits it without losing a life', () => {
    const { room, advance } = setup(3)
    begin(room, advance)
    const holder = room.holderId!
    room.setConnected(holder, false)
    expect(room.holderId).not.toBe(holder)
    expect(room.players.find((p) => p.id === holder)!.lives).toBe(3)
  })

  it('ends the game if everyone else disconnects, and hands host on', () => {
    const { room, advance } = setup(2)
    begin(room, advance)
    room.setConnected('p0', false)
    expect(room.hostId).toBe('p1')
    expect(room.phase).toBe('over')
    expect(room.winnerId).toBe('p1')
  })

  it('gives host back to whoever returns to an abandoned room', () => {
    const { room, advance } = setup(2)
    begin(room, advance)
    room.setConnected('p0', false)
    room.setConnected('p1', false)
    room.join('p0', 'back again')
    expect(room.hostId).toBe('p0')
    room.backToLobby('p0')
    expect(room.phase).toBe('lobby')
  })

  it('seats late joiners as spectators and keeps seats on reconnect', () => {
    const { room, advance } = setup(3)
    begin(room, advance)
    room.join('late', 'Late')
    expect(room.players.find((p) => p.id === 'late')!.spectator).toBe(true)
    const someone = room.order[2]
    room.setConnected(someone, false)
    room.join(someone, 'again')
    expect(room.players.filter((p) => p.id === someone)).toHaveLength(1)
  })

  it('rejects answers during the reading time', () => {
    const { room } = setup(2)
    room.start('p0')
    expect(room.answer(room.holderId!, valid(room))).toEqual({ ok: false, reason: 'not-yet' })
  })
})
