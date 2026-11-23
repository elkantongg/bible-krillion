import { useSyncExternalStore } from 'react'

/** global camera altitude target (metres climbed; named "depth" for history) shared by every screen so route changes glide */
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
  // the air around you as you climb: dusk over the hills, a sunrise in the clouds, then ever brighter gold
  [0, [58, 44, 60]],
  [350, [196, 140, 124]],
  [1000, [248, 226, 196]],
  [2500, [246, 236, 216]],
  [4000, [252, 234, 196]],
  [5500, [255, 228, 176]],
  [7000, [255, 232, 180]],
  [9000, [255, 234, 186]],
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
