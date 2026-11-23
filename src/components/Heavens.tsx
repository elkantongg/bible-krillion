import { useEffect, useRef } from 'react'
import { animate, motion, useMotionValue, useTransform, type MotionValue } from 'motion/react'
import { colorAt, useDepthTarget } from '../lib/sky'
import { usePath } from '../lib/router'

/**
 * The no-WebGL fallback: a flat, painted ascent. The world scrolls downward as you climb —
 * the hills and lake sink away, you climb through the clouds past a rainbow, then rise above them to the golden city.
 */

/** world scale: pixels per metre of altitude */
export const PX = 0.9
/** where the ground line sits on screen at 0 m, as a fraction of viewport height */
const GROUND = 0.72

const MARKERS: [number, string][] = [
  [130, '“mount up with wings as eagles” — Isa 40:31'],
  [330, '── the open sky'],
  [620, '“the stork in the heaven knoweth her appointed times” — Jer 8:7'],
  [950, '“the heavens declare the glory of God” — Ps 19:1'],
  [1280, '── into the clouds'],
  [1650, '“I do set my bow in the cloud” — Gen 9:13'],
  [2150, '“who maketh the clouds his chariot” — Ps 104:3'],
  [2600, '── above the clouds'],
  [3300, '“lift up your heads, O ye gates” — Ps 24:7'],
  [4200, '“a city which hath foundations” — Heb 11:10'],
  [5200, '“the holy city, new Jerusalem” — Rev 21:2'],
  [6200, '“the city was pure gold, like unto clear glass” — Rev 21:18'],
  [7000, 'the golden city — a perfect ascent ends at its gates'],
]

export function Heavens() {
  const target = useDepthTarget()
  const path = usePath()
  const depth = useMotionValue(target)

  useEffect(() => {
    const from = depth.get()
    const dist = Math.abs(target - from)
    const c = animate(depth, target, { duration: Math.min(3.4, Math.max(0.9, dist / 550)), ease: [0.55, 0, 0.2, 1] })
    return () => c.stop()
  }, [target, depth])

  // higher up on screen = higher in the sky
  const bg = useTransform(depth, (d) => `linear-gradient(180deg, ${colorAt(d + 650)} 0%, ${colorAt(d + 120)} 45%, ${colorAt(Math.max(0, d - 260))} 100%)`)
  const worldY = useTransform(depth, (d) => d * PX)
  const glory = useTransform(depth, (d) => Math.max(0, Math.min(1, (d - 5600) / 1200)))
  const vignette = useTransform(depth, (d) => Math.max(0, Math.min(1, (d - 200) / 800)))

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <motion.div className="absolute inset-0" style={{ background: bg }} />
      <Stars depth={depth} />
      <motion.div
        className="absolute inset-0"
        style={{ opacity: glory, background: 'radial-gradient(60% 45% at 50% 30%, rgba(255,236,190,0.55), rgba(255,210,140,0.12) 60%, transparent 80%)' }}
      />

      <motion.div className="absolute inset-x-0" style={{ y: worldY, top: `${GROUND * 100}vh` }}>
        <Ground />
        <Things />
        <Ruler captions={!path.startsWith('/party') && path !== '/archive'} />
      </motion.div>

      <motion.div
        className="absolute inset-0"
        style={{ opacity: vignette, background: 'radial-gradient(70% 55% at 50% 52%, rgba(46,30,14,0.5), rgba(46,30,14,0.25) 60%, rgba(46,30,14,0.1) 100%)' }}
      />
    </div>
  )
}

/** the lake and the hills of Galilee at dusk, below the starting line */
function Ground() {
  return (
    <div className="absolute inset-x-0 top-0 h-[60vh]">
      <div className="absolute left-[68%] -top-16 h-36 w-36 -translate-x-1/2 rounded-full" style={{ background: 'radial-gradient(circle, #fff1cf 0%, #ffcf8a 35%, rgba(255,190,120,0) 70%)' }} />
      <svg className="absolute inset-x-0 -top-16 h-16 w-full" viewBox="0 0 1200 60" preserveAspectRatio="none">
        <path d="M0 60 L0 38 C120 20 210 30 320 36 C430 42 520 14 660 22 C800 30 900 40 1010 30 C1090 22 1150 28 1200 32 L1200 60 Z" fill="#4a3a52" />
        <path d="M0 60 L0 46 C160 36 280 50 420 44 C560 38 700 52 860 46 C990 41 1100 50 1200 46 L1200 60 Z" fill="#2c2440" />
      </svg>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #2a2236 0%, #0e1222 60%)' }} />
      <div className="absolute left-[60%] top-0 h-full w-24 -translate-x-1/2" style={{ background: 'linear-gradient(180deg, rgba(255,190,120,0.45), transparent 70%)' }} />
      <svg viewBox="0 0 200 120" className="anim-bob absolute -top-[52px] left-[14%] w-[min(30vw,160px)]">
        <line x1="96" y1="8" x2="96" y2="82" stroke="#160e0a" strokeWidth="4" />
        <line x1="62" y1="22" x2="132" y2="16" stroke="#160e0a" strokeWidth="4" />
        <path d="M12 80 L188 80 Q 170 112 120 112 L70 112 Q 28 110 12 80 Z" fill="#2a1a12" />
      </svg>
    </div>
  )
}

const at = (m: number) => -m * PX

function Dove({ className = '', color = '#f4efe6', right = false }: { className?: string; color?: string; right?: boolean }) {
  return (
    <svg viewBox="0 0 60 30" className={className} style={right ? { transform: 'scaleX(-1)' } : undefined}>
      <path d="M4 18 Q 18 14 30 16 L 22 2 Q 38 8 40 16 Q 50 14 56 18 Q 46 22 34 22 Q 18 24 4 18 Z" fill={color} />
    </svg>
  )
}

function Angel({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} style={{ filter: 'drop-shadow(0 0 14px rgba(255,232,180,0.6))' }}>
      <path d="M58 52 C 40 30, 18 22, 4 28 C 14 40, 22 56, 50 66 Z" fill="#fbf5e8" opacity="0.9" />
      <path d="M62 52 C 80 30, 102 22, 116 28 C 106 40, 98 56, 70 66 Z" fill="#fbf5e8" opacity="0.9" />
      <path d="M60 44 L 46 112 L 74 112 Z" fill="#f3ead8" />
      <circle cx="60" cy="38" r="7" fill="#f1e2c8" />
      <ellipse cx="60" cy="27" rx="9" ry="2.5" fill="none" stroke="#ffe3a0" strokeWidth="2" />
    </svg>
  )
}

function Cloud({ m, left, w, o = 0.6 }: { m: number; left: string; w: number; o?: number }) {
  return (
    <div className="absolute" style={{ top: at(m), left, width: w, height: w * 0.4, opacity: o }}>
      <div className="h-full w-full rounded-full" style={{ background: 'radial-gradient(closest-side, rgba(240,214,214,0.9), rgba(220,200,220,0))', filter: 'blur(2px)' }} />
    </div>
  )
}

function Things() {
  return (
    <>
      {/* doves and swallows near the hills */}
      <div className="absolute left-0 w-full" style={{ top: at(120), animation: 'drift 38s linear infinite' }}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ position: 'absolute', left: (i % 3) * 30, top: Math.floor(i / 3) * 18 + (i % 2) * 6 }}>
            <Dove className="w-7 opacity-80" right />
          </div>
        ))}
      </div>

      {/* the cloud deck you pass through */}
      {Array.from({ length: 26 }, (_, i) => [1200 + ((i * 137) % 1300), `${(i * 41) % 88 - 6}%`, 260 + ((i * 53) % 220)] as const).map(([m, left, w]) => (
        <Cloud key={m} m={m} left={left} w={w} o={0.85} />
      ))}
      {/* a bow in the cloud */}
      <div className="absolute left-1/2 -translate-x-1/2" style={{ top: at(1700), width: 'min(80vw, 560px)', height: 'min(40vw, 280px)' }}>
        <div className="h-full w-full rounded-t-full opacity-30" style={{ background: 'radial-gradient(farthest-side at 50% 100%, transparent 80%, #8a5cff 82%, #3aa0ff 85%, #3ad07a 88%, #ffe04a 91%, #ff8a3a 94%, #ff4a4a 97%, transparent 100%)' }} />
      </div>

      {/* eagle */}
      <div className="absolute left-0 w-full" style={{ top: at(780), animation: 'drift-rev 60s linear infinite' }}>
        <Dove className="w-20 opacity-70" color="#5a4230" />
      </div>

      {/* the sea of cloud and the golden city upon it */}
      {Array.from({ length: 14 }, (_, i) => [2500 + ((i * 97) % 300), `${(i * 37) % 92 - 8}%`, 300 + ((i * 61) % 200)] as const).map(([m, left, w]) => (
        <Cloud key={`s${m}${left}`} m={m} left={left} w={w} o={0.9} />
      ))}
      <div className="absolute left-1/2 -translate-x-1/2" style={{ top: at(7000) - 230 }}>
        <svg viewBox="0 0 240 240" className="w-[min(70vw,340px)]" style={{ filter: 'drop-shadow(0 0 26px rgba(255,220,150,0.6))' }}>
          <defs>
            <linearGradient id="roofG" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#f7cf5a" />
              <stop offset="0.5" stopColor="#e39a14" />
              <stop offset="1" stopColor="#b8780e" />
            </linearGradient>
            <linearGradient id="wallG" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#fbecc8" />
              <stop offset="1" stopColor="#dcc08a" />
            </linearGradient>
          </defs>
          {[
            [120, 70, 16, 150, 60], [90, 110, 12, 110, 44], [150, 110, 12, 110, 44], [68, 140, 10, 86, 36], [172, 140, 10, 86, 36],
            [44, 166, 9, 62, 30], [196, 166, 9, 62, 30], [104, 132, 8, 92, 34], [136, 132, 8, 92, 34],
          ].map(([x, y, r, h, sp], i) => (
            <g key={i}>
              <rect x={x - r} y={y} width={r * 2} height={240 - y} fill="url(#wallG)" />
              <path d={`M${x - r * 1.3} ${y} Q ${x - r * 0.4} ${y - sp * 0.4} ${x} ${y - sp} Q ${x + r * 0.4} ${y - sp * 0.4} ${x + r * 1.3} ${y} Z`} fill="url(#roofG)" />
              <circle cx={x} cy={y - sp - 2} r={1.6} fill="#ffd36a" />
              <rect x={x - r * 0.28} y={y + 14} width={r * 0.56} height={r * 1.1} rx={r * 0.28} fill="#ffe2a0" />
            </g>
          ))}
          <rect x="30" y="196" width="180" height="44" fill="url(#wallG)" />
          <path d="M110 240 V 214 A 10 10 0 0 1 130 214 V 240 Z" fill="#fff3dd" />
        </svg>
      </div>
    </>
  )
}

function Ruler({ captions }: { captions: boolean }) {
  return (
    <div className="absolute right-0 top-0 w-full">
      {Array.from({ length: 71 }, (_, i) => i * 100).map((m) => (
        <div key={m} className="absolute right-0 flex items-center" style={{ top: at(m) }}>
          {m % 500 === 0 && m > 0 && <span className="mr-2 font-mono text-[10px] tracking-wider text-white/40">{m.toLocaleString()}m</span>}
          <span className={`block h-px ${m % 500 === 0 ? 'w-5 bg-white/40' : 'w-2.5 bg-white/20'}`} />
        </div>
      ))}
      {captions &&
        MARKERS.map(([m, text], i) => (
          <div
            key={m}
            className={`absolute max-w-[46vw] font-mono text-[10px] uppercase leading-snug tracking-[0.14em] text-white/35 sm:text-[11px] ${
              i % 2 ? 'left-4 sm:left-10' : 'right-12 text-right sm:right-16'
            } ${text.startsWith('──') ? '!text-white/60' : ''}`}
            style={{ top: at(m) - 6 }}
          >
            {text}
          </div>
        ))}
    </div>
  )
}

/** golden sparkles of glory that fade in above the clouds and streak downward while you climb */
function Stars({ depth }: { depth: MotionValue<number> }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current!
    const ctx = c.getContext('2d')!
    let w = 0
    let h = 0
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const resize = () => {
      w = c.clientWidth
      h = c.clientHeight
      c.width = w * dpr
      c.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)
    const ps = Array.from({ length: w < 640 ? 70 : 130 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.3 + 0.3,
      a: Math.random() * 0.6 + 0.3,
      ph: Math.random() * Math.PI * 2,
    }))
    let raf = 0
    let last = performance.now()
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const tick = (t: number) => {
      const dt = Math.min(50, t - last) / 16.7
      last = t
      const d = depth.get()
      const vel = reduce ? 0 : depth.getVelocity() * PX // px/s, positive when climbing
      ctx.clearRect(0, 0, w, h)
      const night = Math.max(0, Math.min(1, (d - 300) / 900))
      const gold = Math.max(0, Math.min(1, (d - 5500) / 1300))
      if (night > 0) {
        for (const p of ps) {
          p.y += (vel / 60) * 0.6 * (0.4 + p.r / 2) * dt
          if (p.y > h + 10) p.y = -10
          if (p.y < -10) p.y = h + 10
          ctx.globalAlpha = p.a * night * (0.7 + 0.3 * Math.sin(t / 600 + p.ph))
          ctx.fillStyle = gold > 0.3 ? '#fff0c4' : '#fff6e0'
          const stretch = Math.min(22, Math.abs(vel) / 40)
          if (stretch > 2) ctx.fillRect(p.x - p.r / 2, p.y - stretch, p.r, stretch)
          else {
            ctx.beginPath()
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [depth])
  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />
}
