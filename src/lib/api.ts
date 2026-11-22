import { load, save } from './storage'

let tokenPromise: Promise<string> | null = null
let clockOffset = 0
export const serverNow = () => Date.now() + clockOffset
export const syncClock = (serverMs: number) => {
  clockOffset = serverMs - Date.now()
}

export function playerToken(): Promise<string> {
  const stored = load('deep.player')
  if (stored) return Promise.resolve(stored)
  tokenPromise ??= fetch('/api/player', { method: 'POST' })
    .then((r) => {
      if (!r.ok) throw new Error('Could not create a player')
      return r.json()
    })
    .then((j: { token: string }) => {
      save('deep.player', j.token)
      return j.token
    })
    .finally(() => {
      tokenPromise = null
    })
  return tokenPromise
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

/** JSON request with player auth; retries network failures (all game writes are idempotent) */
export async function api<T>(path: string, body?: unknown, retries = 3): Promise<T> {
  const token = await playerToken()
  let lastErr: unknown
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch('/api' + path, {
        method: body === undefined ? 'GET' : 'POST',
        headers: { 'content-type': 'application/json', 'x-player': token },
        body: body === undefined ? undefined : JSON.stringify(body),
      })
      const json = await res.json().catch(() => ({}))
      if (res.status === 401) {
        localStorage.removeItem('deep.player')
        throw new ApiError(401, 'Session expired — refresh to continue')
      }
      if (!res.ok) throw new ApiError(res.status, json.error ?? 'Request failed')
      return json as T
    } catch (e) {
      if (e instanceof ApiError) throw e
      lastErr = e
      window.dispatchEvent(new CustomEvent('deep:offline', { detail: true }))
      await new Promise((r) => setTimeout(r, 400 * 2 ** attempt))
    }
  }
  throw new ApiError(0, (lastErr as Error)?.message ?? 'Network error')
}

export async function getMeta(): Promise<{ launch: string; maxDive: number; serverNow: number }> {
  const r = await fetch('/api/meta')
  if (!r.ok) throw new Error('offline')
  const j = await r.json()
  syncClock(j.serverNow)
  return j
}
