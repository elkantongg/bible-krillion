/**
 * Heavenly music, generated live with Web Audio (no files, no cost).
 *
 *  - a choir: slow "aah" chords (detuned voices through vowel formants), a long cathedral reverb
 *  - a harp: plucked arpeggios from the current chord, more frequent the higher you climb
 *  - bells: soft chimes once you are above the clouds
 *  - trumpets: a short call when you break through the clouds and when you reach the gates
 * It starts on the first tap or key press (browsers block sound before that) and follows the mute button.
 */

type Ctx = AudioContext

let ctx: Ctx | null = null
let master: GainNode | null = null
let tone: BiquadFilterNode | null = null
let wet: GainNode | null = null
let dry: GainNode | null = null
let choirBus: GainNode | null = null
let verbIn: ConvolverNode | null = null
let muted = false
let altitude = 0
let lastAlt = 0
let timer: ReturnType<typeof setInterval> | null = null
let nextChord = 0
let nextHarp = 0
let nextBell = 0
let chordIdx = 0
let installed = false

const mtof = (m: number) => 440 * Math.pow(2, (m - 69) / 12)
// D major, gently moving: D(add9) – Bm7 – Gmaj7 – A(sus4)
const CHORDS = [
  [50, 57, 62, 64, 66, 69],
  [47, 54, 59, 62, 66, 69],
  [43, 55, 59, 62, 66, 71],
  [45, 57, 62, 64, 69, 74],
]
const CHORD_LEN = 9

function impulse(c: Ctx, seconds: number) {
  const len = Math.floor(c.sampleRate * seconds)
  const buf = c.createBuffer(2, len, c.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch)
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2)
  }
  return buf
}

function build() {
  const c = new AudioContext()
  ctx = c
  master = c.createGain()
  master.gain.value = 0
  tone = c.createBiquadFilter()
  tone.type = 'lowpass'
  tone.frequency.value = 1800
  const verb = c.createConvolver()
  verb.buffer = impulse(c, 4.5)
  verbIn = verb
  wet = c.createGain()
  wet.gain.value = 0.62
  dry = c.createGain()
  dry.gain.value = 0.4
  choirBus = c.createGain()
  choirBus.gain.value = 0.5
  choirBus.connect(dry)
  choirBus.connect(verb)
  verb.connect(wet)
  dry.connect(tone)
  wet.connect(tone)
  tone.connect(master)
  master.connect(c.destination)
}

/** one sung chord: each note two detuned voices shaped into an "aah" by three formant filters */
function choir(c: Ctx, at: number, notes: number[], len: number) {
  const out = c.createGain()
  out.gain.setValueAtTime(0.0001, at)
  out.gain.exponentialRampToValueAtTime(0.06, at + 3)
  out.gain.setValueAtTime(0.06, at + len - 1)
  out.gain.exponentialRampToValueAtTime(0.0001, at + len + 3.5)
  const formants = [
    [730, 6, 1],
    [1090, 8, 0.5],
    [2440, 10, 0.25],
  ]
  const mix = c.createGain()
  mix.gain.value = 1
  for (const [f, q, g] of formants) {
    const bp = c.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = f
    bp.Q.value = q
    const gg = c.createGain()
    gg.gain.value = g
    mix.connect(bp).connect(gg).connect(out)
  }
  for (const n of notes) {
    for (const det of [-7, 6]) {
      const o = c.createOscillator()
      o.type = 'sawtooth'
      o.frequency.value = mtof(n)
      o.detune.value = det
      // a slow vibrato, like breath
      const lfo = c.createOscillator()
      lfo.frequency.value = 4.6 + Math.random() * 0.8
      const lg = c.createGain()
      lg.gain.value = 3
      lfo.connect(lg).connect(o.detune)
      const vg = c.createGain()
      vg.gain.value = 0.16
      o.connect(vg).connect(mix)
      o.start(at)
      lfo.start(at)
      o.stop(at + len + 4)
      lfo.stop(at + len + 4)
    }
  }
  out.connect(choirBus!)
}

function harp(c: Ctx, at: number, midi: number, vel: number) {
  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, at)
  g.gain.exponentialRampToValueAtTime(0.09 * vel, at + 0.006)
  g.gain.exponentialRampToValueAtTime(0.0001, at + 2.6)
  const lp = c.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.setValueAtTime(5200, at)
  lp.frequency.exponentialRampToValueAtTime(900, at + 1.2)
  for (const [mult, amp, type] of [[1, 1, 'triangle'], [2, 0.35, 'sine'], [3, 0.12, 'sine']] as const) {
    const o = c.createOscillator()
    o.type = type
    o.frequency.value = mtof(midi) * mult
    const og = c.createGain()
    og.gain.value = amp
    o.connect(og).connect(lp)
    o.start(at)
    o.stop(at + 2.8)
  }
  lp.connect(g)
  g.connect(dry!)
  g.connect(verbIn!)
}

function bell(c: Ctx, at: number, midi: number) {
  for (const [mult, amp, dec] of [[1, 0.05, 4.5], [2.76, 0.02, 2.5], [5.4, 0.012, 1.4], [8.9, 0.006, 0.8]]) {
    const o = c.createOscillator()
    o.type = 'sine'
    o.frequency.value = mtof(midi) * mult
    const g = c.createGain()
    g.gain.setValueAtTime(0.0001, at)
    g.gain.exponentialRampToValueAtTime(amp, at + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, at + dec)
    o.connect(g).connect(choirBus!)
    o.start(at)
    o.stop(at + dec + 0.1)
  }
}

/** a short call of trumpets: D – A – D – F♯ – A, rising, brassy but soft, deep in the reverb */
function fanfare(c: Ctx, at: number) {
  const notes = [62, 69, 74, 78, 81]
  notes.forEach((n, i) => {
    const t0 = at + i * 0.32
    const len = i === notes.length - 1 ? 2.4 : 0.42
    const lp = c.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.setValueAtTime(700, t0)
    lp.frequency.linearRampToValueAtTime(2600, t0 + 0.08)
    lp.frequency.exponentialRampToValueAtTime(1200, t0 + len)
    const g = c.createGain()
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(0.07, t0 + 0.05)
    g.gain.setValueAtTime(0.06, t0 + len - 0.1)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + len + 0.6)
    for (const det of [-5, 4]) {
      const o = c.createOscillator()
      o.type = 'sawtooth'
      o.frequency.value = mtof(n)
      o.detune.value = det
      o.connect(lp)
      o.start(t0)
      o.stop(t0 + len + 0.8)
    }
    lp.connect(g).connect(choirBus!)
  })
}

function tick() {
  const c = ctx
  if (!c || !master) return
  const now = c.currentTime
  const ahead = now + 0.3
  const h = Math.max(0, Math.min(1, altitude / 7000))
  // brighter and fuller the higher you climb
  tone!.frequency.setTargetAtTime(1500 + h * 4200, now, 1.5)
  choirBus!.gain.setTargetAtTime(0.45 + h * 0.55, now, 2)

  if (nextChord < ahead) {
    if (nextChord < now) nextChord = now + 0.05
    choir(c, nextChord, CHORDS[chordIdx % CHORDS.length], CHORD_LEN)
    nextChord += CHORD_LEN
    chordIdx++
  }
  if (nextHarp < ahead) {
    if (nextHarp < now) nextHarp = now + 0.05
    const ch = CHORDS[(chordIdx + CHORDS.length - 1) % CHORDS.length]
    const n = ch[Math.floor(Math.random() * ch.length)] + 12 * (1 + Math.floor(Math.random() * 2))
    harp(c, nextHarp, n, 0.6 + Math.random() * 0.4)
    nextHarp += lerp(1.9, 0.38, h) * (0.7 + Math.random() * 0.6)
  }
  if (altitude > 2500 && nextBell < ahead) {
    if (nextBell < now) nextBell = now + 0.05
    const ch = CHORDS[(chordIdx + CHORDS.length - 1) % CHORDS.length]
    bell(c, nextBell, ch[Math.floor(Math.random() * ch.length)] + 24)
    nextBell += lerp(6, 2.5, h) + Math.random() * 2
  }
  // trumpets as you break through the clouds, and again at the gates
  if (lastAlt < 2550 && altitude >= 2550) fanfare(c, now + 0.1)
  if (lastAlt < 6900 && altitude >= 6900) fanfare(c, now + 0.1)
  lastAlt = altitude
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

function start() {
  if (muted) return
  if (!ctx) build()
  const c = ctx!
  if (c.state === 'suspended') void c.resume()
  master!.gain.cancelScheduledValues(c.currentTime)
  master!.gain.setTargetAtTime(0.5, c.currentTime, 1.6)
  if (!timer) timer = setInterval(tick, 100)
}

function stop() {
  if (!ctx || !master) return
  master.gain.cancelScheduledValues(ctx.currentTime)
  master.gain.setTargetAtTime(0, ctx.currentTime, 0.4)
  if (timer) clearInterval(timer)
  timer = null
  nextChord = nextHarp = nextBell = 0
}

/** call once: music begins on the first user gesture */
export function installMusic(isMutedNow: boolean) {
  muted = isMutedNow
  if (installed) return
  installed = true
  const go = () => {
    window.removeEventListener('pointerdown', go)
    window.removeEventListener('keydown', go)
    start()
  }
  window.addEventListener('pointerdown', go)
  window.addEventListener('keydown', go)
}

export function setMusicMuted(m: boolean) {
  muted = m
  if (m) stop()
  else start()
}

/** the camera's current altitude in metres; drives brightness, harp density, bells and fanfares */
export function setMusicAltitude(m: number) {
  altitude = m
}
