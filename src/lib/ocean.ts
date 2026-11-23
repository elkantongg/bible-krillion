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
  [0, [44, 146, 190]],
  [150, [22, 102, 152]],
  [500, [13, 66, 114]],
  [1000, [10, 47, 87]],
  [2500, [7, 28, 56]],
  [4500, [4, 15, 34]],
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
