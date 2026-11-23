import { lazy, Suspense, useEffect, useState } from 'react'
import { localDive } from '../shared/dives'
import { getMeta } from './lib/api'
import { go, usePath } from './lib/router'
import { Heavens } from './components/Heavens'
import { OfflineToast, Spinner } from './components/ui'
import { installMusic } from './lib/music'
import { isMuted } from './lib/sound'
import { Home } from './screens/Home'
import { Dive } from './screens/Dive'
import { Archive } from './screens/Archive'
import { FreeDive } from './screens/FreeDive'
import { PartyHome, PartyRoom } from './screens/Party'

const World3D = lazy(() => import('./components/World3D'))

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}
const WEBGL = typeof document !== 'undefined' && hasWebGL()

export function App() {
  const path = usePath()
  const [today, setToday] = useState<number | null>(null)
  const [down, setDown] = useState(false)

  useEffect(() => installMusic(isMuted()), [])

  useEffect(() => {
    let stop = false
    const fetchMeta = () =>
      getMeta()
        .then((m) => {
          if (stop) return
          setDown(false)
          setToday(Math.max(1, Math.min(localDive(m.launch), m.maxDive)))
        })
        .catch(() => {
          if (stop) return
          setDown(true)
          setTimeout(fetchMeta, 3000)
        })
    fetchMeta()
    return () => {
      stop = true
    }
  }, [])

  let page: React.ReactNode
  const dive = path.match(/^\/dive\/(\d+)\/?$/)
  const room = path.match(/^\/party\/([A-Za-z]{4})\/?$/)
  if (room) page = <PartyRoom code={room[1].toUpperCase()} />
  else if (path === '/party' || path === '/party/') page = <PartyHome />
  else if (path === '/free' || path === '/free/') page = <FreeDive />
  else if (today == null)
    page = (
      <div className="relative z-10 grid min-h-[100dvh] place-items-center">
        <Spinner label={down ? 'searching for signal…' : 'ascending…'} />
      </div>
    )
  else if (dive) {
    const n = Number(dive[1])
    if (n < 1 || n > today) {
      go(`/dive/${today}`, true)
      page = null
    } else page = <Dive key={n} n={n} isToday={n === today} />
  } else if (path === '/archive') page = <Archive today={today} />
  else page = <Home today={today} />

  return (
    <>
      {WEBGL ? (
        <Suspense fallback={<div className="fixed inset-0" style={{ background: 'linear-gradient(180deg,#03081a 0%,#14204a 40%,#5a4258 56%,#0a0f1e 58%,#030812 100%)' }} />}>
          <World3D />
        </Suspense>
      ) : (
        <Heavens />
      )}
      {page}
      <OfflineToast />
    </>
  )
}
