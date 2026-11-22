import { load, save } from './storage'

let ctx: AudioContext | null = null
let muted = load('deep.muted') === '1'
export const isMuted = () => muted
export function setMuted(m: boolean) {
  muted = m
  save('deep.muted', m ? '1' : '0')
}

function ac() {
  if (muted) return null
  try {
    ctx ??= new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

function tone(freq: number, dur: number, type: OscillatorType = 'sine', vol = 0.12, slideTo?: number, delay = 0) {
  const c = ac()
  if (!c) return
  const t = c.currentTime + delay
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = type
  o.frequency.setValueAtTime(freq, t)
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(vol, t + 0.015)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g).connect(c.destination)
  o.start(t)
  o.stop(t + dur + 0.05)
}

export const sfx = {
  blub: () => {
    tone(320, 0.12, 'sine', 0.1, 780)
    tone(520, 0.1, 'sine', 0.06, 1100, 0.07)
  },
  tick: () => tone(1200, 0.04, 'square', 0.025),
  miss: () => tone(180, 0.18, 'triangle', 0.08, 120),
  land: (points: number) => {
    const steps = points >= 85 ? [523, 659, 784, 1047] : points >= 35 ? [523, 659, 784] : [440, 523]
    steps.forEach((f, i) => tone(f, 0.28, 'sine', 0.08, undefined, i * 0.09))
  },
  sink: () => tone(260, 1.2, 'sine', 0.05, 70),
  gulp: () => {
    tone(140, 0.5, 'sawtooth', 0.09, 40)
    tone(90, 0.6, 'sine', 0.12, 35, 0.05)
  },
  pass: () => tone(660, 0.09, 'triangle', 0.06, 990),
  win: () => [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 0.35, 'triangle', 0.07, undefined, i * 0.1)),
}
