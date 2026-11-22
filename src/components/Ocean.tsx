import { useEffect, useRef } from 'react'
import { animate, motion, useMotionValue, useTransform, type MotionValue } from 'motion/react'
import { colorAt, useDepthTarget } from '../lib/ocean'
import { usePath } from '../lib/router'

/** world scale: pixels per metre of depth */
export const PX = 0.9
/** where the waterline sits on screen at 0 m, as a fraction of viewport height */
const SURFACE = 0.36

const MARKERS: [number, string][] = [
  [60, 'sunlight still dances here'],
  [200, '── the twilight zone begins'],
  [420, 'the last of the blue fades'],
  [700, 'jellies drift on the current'],
  [1000, '── the midnight zone · no sunlight below'],
  [1500, '“a great fish to swallow up Jonah” — Jon 1:17'],
  [2000, 'lanternfish carry their own light'],
  [2600, '“deep calls to deep” — Ps 42:7'],
  [3200, 'pressure: over 300 atmospheres'],
  [4000, '── the abyss'],
  [4700, '“he makes the deep boil like a pot” — Job 41:31'],
  [5400, 'the abyssal plain: silent, near freezing'],
  [6000, '── the hadal trench'],
  [6600, '“you cast me into the deep” — Jon 2:3'],
  [7000, 'the trench floor — a perfect dive ends here'],
]

export function Ocean() {
  const target = useDepthTarget()
  const path = usePath()
  const depth = useMotionValue(target)

  useEffect(() => {
    const from = depth.get()
    const dist = Math.abs(target - from)
    const c = animate(depth, target, {
      duration: Math.min(3.4, Math.max(0.9, dist / 550)),
      ease: [0.55, 0, 0.2, 1],
    })
    return () => c.stop()
  }, [target, depth])

  const bg = useTransform(
    depth,
    (d) => `linear-gradient(180deg, ${colorAt(d - 260)} 0%, ${colorAt(d + 120)} 55%, ${colorAt(d + 650)} 100%)`,
  )
  const worldY = useTransform(depth, (d) => -d * PX)
  const rays = useTransform(depth, (d) => Math.max(0, 1 - d / 520))
  const vignette = useTransform(depth, (d) => Math.min(0.85, 0.25 + d / 6000))

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <motion.div className="absolute inset-0" style={{ background: bg }} />
      <motion.div className="anim-rays absolute -inset-x-1/4 top-0 h-[90vh]" style={{ opacity: rays }}>
        <div
          className="h-full w-full"
          style={{
            background:
              'repeating-linear-gradient(100deg, rgba(255,255,255,0) 0 7%, rgba(220,250,255,0.13) 9%, rgba(255,255,255,0) 12% 19%, rgba(220,250,255,0.08) 21%, rgba(255,255,255,0) 24% 30%)',
            maskImage: 'linear-gradient(180deg, transparent 0%, black 38%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, black 38%, transparent 100%)',
          }}
        />
      </motion.div>

      <motion.div className="absolute inset-x-0" style={{ y: worldY, top: `${SURFACE * 100}vh` }}>
        <Sky />
        <Creatures />
        <Ruler captions={!path.startsWith('/party') && path !== '/archive'} />
      </motion.div>

      <Snow depth={depth} />
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: vignette,
          background: 'radial-gradient(120% 90% at 50% 45%, transparent 40%, rgba(0,0,0,0.85) 100%)',
        }}
      />
    </div>
  )
}

function Sky() {
  return (
    <>
      {/* sky sits above the waterline in world space */}
      <div
        className="absolute inset-x-0 bottom-full h-[120vh]"
        style={{ background: 'linear-gradient(180deg, #0e2a4f 0%, #3f6d9b 40%, #f6b98a 82%, #ffe1b0 100%)' }}
      >
        <div
          className="absolute left-[68%] top-[62%] h-40 w-40 -translate-x-1/2 rounded-full"
          style={{ background: 'radial-gradient(circle, #fff6d6 0%, #ffd58a 35%, rgba(255,190,120,0) 70%)' }}
        />
        <div className="absolute inset-x-0 bottom-0 h-24" style={{ background: 'linear-gradient(180deg, transparent, rgba(255,214,170,0.45))' }} />
        {/* distant hills of Galilee */}
        <svg className="absolute inset-x-0 bottom-0 h-16 w-full" viewBox="0 0 1200 60" preserveAspectRatio="none">
          <path d="M0 60 L0 38 C120 20 210 30 320 36 C430 42 520 14 660 22 C800 30 900 40 1010 30 C1090 22 1150 28 1200 32 L1200 60 Z" fill="#7a6a86" opacity="0.55" />
          <path d="M0 60 L0 46 C160 36 280 50 420 44 C560 38 700 52 860 46 C990 41 1100 50 1200 46 L1200 60 Z" fill="#5d5678" opacity="0.7" />
        </svg>
        <Boat />
      </div>
      {/* waterline */}
      <svg className="absolute inset-x-0 -top-3 h-6 w-full" viewBox="0 0 1200 24" preserveAspectRatio="none">
        <path d="M0 12 Q 50 2 100 12 T 200 12 T 300 12 T 400 12 T 500 12 T 600 12 T 700 12 T 800 12 T 900 12 T 1000 12 T 1100 12 T 1200 12 V24 H0Z" fill="rgba(160,230,245,0.55)">
          <animateTransform attributeName="transform" type="translate" values="0 0; -100 0; 0 0" dur="7s" repeatCount="indefinite" />
        </path>
      </svg>
      <div className="absolute inset-x-0 top-0 h-40" style={{ background: 'linear-gradient(180deg, rgba(200,245,255,0.35), transparent)' }} />
    </>
  )
}

function Boat() {
  return (
    <div className="anim-bob absolute bottom-[-10px] left-[14%] w-[min(34vw,190px)]">
      <svg viewBox="0 0 200 120" className="w-full drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]">
        <line x1="92" y1="10" x2="92" y2="82" stroke="#3b2a22" strokeWidth="4" />
        <path d="M95 16 Q 150 36 140 74 L95 74 Z" fill="#f4e6cf" />
        <path d="M95 16 Q 128 40 124 74" stroke="#d6c2a4" strokeWidth="2" fill="none" />
        <path d="M12 80 L188 80 Q 170 112 120 112 L70 112 Q 28 110 12 80 Z" fill="#6e4630" />
        <path d="M18 86 L182 86" stroke="#8b5d40" strokeWidth="3" />
        <path d="M24 96 L174 96" stroke="#5a3826" strokeWidth="2" />
        {/* net trailing into the water */}
        <path d="M170 84 Q 186 98 178 120" stroke="#e9dcc4" strokeWidth="1.5" fill="none" opacity="0.7" />
      </svg>
    </div>
  )
}

function Ruler({ captions }: { captions: boolean }) {
  return (
    <div className="absolute right-0 top-0 w-full">
      {Array.from({ length: 71 }, (_, i) => i * 100).map((m) => (
        <div key={m} className="absolute right-0 flex items-center" style={{ top: m * PX }}>
          {m % 500 === 0 && m > 0 && (
            <span className="mr-2 font-mono text-[10px] tracking-wider text-white/40">{m.toLocaleString()}m</span>
          )}
          <span className={`block h-px ${m % 500 === 0 ? 'w-5 bg-white/40' : 'w-2.5 bg-white/20'}`} />
        </div>
      ))}
      {captions && MARKERS.map(([m, text], i) => (
        <div
          key={m}
          className={`absolute max-w-[46vw] font-mono text-[10px] uppercase leading-snug tracking-[0.14em] text-white/30 sm:text-[11px] ${
            i % 2 ? 'left-4 sm:left-10' : 'right-12 text-right sm:right-16'
          } ${text.startsWith('──') ? '!text-white/55' : ''}`}
          style={{ top: m * PX - 6 }}
        >
          {text}
        </div>
      ))}
    </div>
  )
}

function Fish({ className = '', color = '#0d4466' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 40 20" className={className}>
      <path d="M2 10 Q 12 0 26 6 L36 2 L33 10 L36 18 L26 14 Q 12 20 2 10 Z" fill={color} />
    </svg>
  )
}

function Creatures() {
  return (
    <>
      {/* school of fish */}
      <div className="absolute left-0 w-full" style={{ top: 90 * PX, animation: 'swim 38s linear infinite' }}>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <Fish key={i} className="absolute w-6 opacity-60" color="#0b3f5f" />
        )).map((el, i) => (
          <div key={i} style={{ position: 'absolute', left: (i % 4) * 26, top: Math.floor(i / 2) * 14 + (i % 3) * 6 }}>
            {el}
          </div>
        ))}
      </div>
      <div className="absolute left-0 w-full" style={{ top: 260 * PX, animation: 'swim-rev 52s linear infinite' }}>
        <Fish className="w-14 opacity-40" color="#0a3352" />
      </div>

      {/* jellyfish */}
      {[
        [720, '18%', 1],
        [860, '72%', 0.8],
        [1150, '40%', 0.7],
      ].map(([d, left, s]) => (
        <div key={d as number} className="anim-jelly absolute" style={{ top: (d as number) * PX, left: left as string, scale: s as number }}>
          <svg viewBox="0 0 60 90" className="w-12 drop-shadow-[0_0_14px_rgba(170,140,255,0.8)]">
            <path d="M6 30 Q 30 -6 54 30 Q 44 26 30 30 Q 16 26 6 30 Z" fill="rgba(190,170,255,0.55)" />
            {[14, 22, 30, 38, 46].map((x) => (
              <path key={x} d={`M${x} 30 q 4 14 -2 28 q -4 14 2 28`} stroke="rgba(190,170,255,0.35)" strokeWidth="1.5" fill="none" />
            ))}
          </svg>
        </div>
      ))}

      {/* the great fish */}
      <div className="absolute left-0 w-full" style={{ top: 1480 * PX, animation: 'swim 90s linear infinite' }}>
        <svg viewBox="0 0 300 120" className="w-[min(70vw,420px)] opacity-25">
          <path d="M10 60 Q 60 6 170 18 Q 230 26 250 50 L 292 22 L 280 62 L 294 100 L 248 74 Q 220 104 150 106 Q 50 106 10 60 Z" fill="#021529" />
          <circle cx="58" cy="50" r="3" fill="#7ef6dc" opacity="0.5" />
        </svg>
      </div>

      {/* lantern lights */}
      {Array.from({ length: 26 }, (_, i) => (
        <span
          key={i}
          className="anim-flicker absolute block h-1.5 w-1.5 rounded-full"
          style={{
            top: (1800 + ((i * 397) % 1500)) * PX,
            left: `${(i * 37) % 96}%`,
            background: i % 3 ? '#7ef6dc' : '#9fb6ff',
            boxShadow: `0 0 10px 3px ${i % 3 ? 'rgba(126,246,220,0.6)' : 'rgba(159,182,255,0.6)'}`,
            animationDelay: `${(i * 0.37) % 3}s`,
          }}
        />
      ))}

      {/* angler */}
      <div className="absolute left-[60%]" style={{ top: 2700 * PX }}>
        <svg viewBox="0 0 120 80" className="w-28 opacity-70">
          <path d="M40 18 Q 60 -6 84 10" stroke="#16324a" strokeWidth="2" fill="none" />
          <circle cx="86" cy="12" r="5" fill="#fff1a8" className="anim-flicker" style={{ filter: 'drop-shadow(0 0 10px #ffe07a)' }} />
          <path d="M10 46 Q 30 16 70 26 Q 100 34 104 52 Q 96 70 64 72 Q 28 74 10 46 Z" fill="#0a1b2c" />
          <path d="M60 58 L66 52 L70 60 L76 52 L80 60 L86 54" stroke="#cfe" strokeWidth="1.2" fill="none" opacity="0.6" />
        </svg>
      </div>

      {/* old anchor */}
      <div className="absolute left-[12%]" style={{ top: 4300 * PX }}>
        <svg viewBox="0 0 60 90" className="w-12 opacity-35">
          <circle cx="30" cy="10" r="6" stroke="#6b8aa3" strokeWidth="3" fill="none" />
          <path d="M30 16 V80 M14 30 H46 M6 62 Q 30 96 54 62 M6 62 L2 70 M54 62 L58 70" stroke="#6b8aa3" strokeWidth="4" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      {/* leviathan */}
      <div className="absolute left-0 w-full" style={{ top: 5150 * PX }}>
        <svg viewBox="0 0 800 160" className="w-[140vw] -translate-x-[20vw] opacity-30" preserveAspectRatio="none">
          <path d="M0 90 C 120 20 220 150 340 80 S 560 10 680 90 S 780 120 800 100" stroke="#0b2236" strokeWidth="38" fill="none" strokeLinecap="round" />
          <circle cx="772" cy="100" r="5" fill="#ff7f6e" opacity="0.8" />
        </svg>
      </div>

      {/* trench floor */}
      <div className="absolute inset-x-0" style={{ top: 7000 * PX + 24 }}>
        <svg viewBox="0 0 1200 200" preserveAspectRatio="none" className="h-[40vh] w-full">
          <path d="M0 40 Q 150 0 300 30 T 620 26 T 900 34 T 1200 20 V200 H0 Z" fill="#050b14" />
          {[180, 420, 760, 1010].map((x) => (
            <g key={x}>
              {[0, 10, 20].map((dx) => (
                <path key={dx} d={`M${x + dx} 34 q -6 -26 2 -46`} stroke="#d8d4e8" strokeWidth="3" fill="none" opacity="0.5" />
              ))}
              {[0, 10, 20].map((dx) => (
                <circle key={dx} cx={x + dx + 2} cy={-12} r="4" fill="#ff7f6e" />
              ))}
            </g>
          ))}
        </svg>
      </div>
    </>
  )
}

/** marine snow: drifts down, streaks upward while the camera descends */
function Snow({ depth }: { depth: MotionValue<number> }) {
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
    const count = w < 640 ? 50 : 90
    const ps = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.4,
      v: Math.random() * 0.25 + 0.05,
      a: Math.random() * 0.5 + 0.2,
      glow: Math.random() < 0.12,
      ph: Math.random() * Math.PI * 2,
    }))
    let raf = 0
    let last = performance.now()
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const tick = (t: number) => {
      const dt = Math.min(50, t - last) / 16.7
      last = t
      const d = depth.get()
      const vel = reduce ? 0 : depth.getVelocity() * PX // px/s, positive when descending
      const surfaceY = h * SURFACE - d * PX
      ctx.clearRect(0, 0, w, h)
      const deep = Math.min(1, d / 2500)
      for (const p of ps) {
        p.y += (p.v - (vel / 60) * 0.9 * (0.4 + p.r / 2)) * dt
        p.x += Math.sin(t / 2400 + p.ph) * 0.12 * dt
        if (p.y < -10) p.y = h + 10
        if (p.y > h + 10) p.y = -10
        if (p.y < surfaceY + 6) continue
        const stretch = Math.min(26, Math.abs(vel) / 40)
        const alpha = p.a * (p.glow ? 0.5 + deep * 0.5 : 1 - deep * 0.45)
        ctx.globalAlpha = alpha
        ctx.fillStyle = p.glow && deep > 0.2 ? (p.r > 1.2 ? '#9fb6ff' : '#7ef6dc') : '#dff8ff'
        if (p.glow && deep > 0.2) {
          ctx.shadowBlur = 8
          ctx.shadowColor = ctx.fillStyle
        } else ctx.shadowBlur = 0
        if (stretch > 2) {
          ctx.fillRect(p.x - p.r / 2, p.y, p.r, stretch * (p.r / 1.2))
        } else {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fill()
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
