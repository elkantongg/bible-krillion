import { useSyncExternalStore } from 'react'

/** global camera depth target (metres) shared by every screen so route changes glide */
let target = 0
const subs = new Set<() => void>()
export function setDepth(m: number) {
  if (m === target) return
  target = m
  subs.forEach((f) => f())
}
export const useDepthTarget = () =>
  useSyncExternalStore(
    (cb) => {
      subs.add(cb)
      return () => subs.delete(cb)
    },
    () => target,
  )

const STOPS: [number, [number, number, number]][] = [
  // dusk-lit water: continues the cover's evening palette instead of daytime cyan
  [0, [38, 78, 104]],
  [150, [26, 62, 92]],
  [500, [16, 44, 74]],
  [1000, [10, 30, 56]],
  [2500, [6, 18, 38]],
  [4500, [3, 10, 24]],
  [7000, [1, 4, 10]],
  [9000, [0, 2, 6]],
]
export function colorAt(d: number): string {
  if (d <= STOPS[0][0]) return `rgb(${STOPS[0][1].join(',')})`
  for (let i = 1; i < STOPS.length; i++) {
    const [d1, c1] = STOPS[i]
    const [d0, c0] = STOPS[i - 1]
    if (d <= d1) {
      const t = (d - d0) / (d1 - d0)
      const c = c0.map((v, k) => Math.round(v + (c1[k] - v) * t))
      return `rgb(${c.join(',')})`
    }
  }
  return `rgb(${STOPS[STOPS.length - 1][1].join(',')})`
}
