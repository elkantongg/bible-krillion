import { useEffect, useRef } from 'react'
import { animate, useMotionValue } from 'motion/react'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { useDepthTarget } from '../lib/sky'
import { setMusicAltitude } from '../lib/music'
import { Angel, angelAssets } from './world/angels'
import { FireChariot, FireSystem } from './world/fire'
import { usePath } from '../lib/router'

/**
 * The 3D world behind every screen. One journey, in order:
 *   the lake at dusk (a fishing boat) → the open sky (birds) → through the middle of the clouds
 *   (a bow in the cloud)
 *   → above the clouds, where only cloud lies below and the golden city — the goal — rises ahead,
 *   circled by a host of angels and chariots of fire, trumpeters at its gate and a stairway of light
 *   above it, drawing nearer the higher you climb.
 * The sky and clouds are ray-marched in one background pass (volumetric, lit by the sun);
 * everything else is regular geometry drawn over it, with bloom on top.
 * 1 world unit = 1 metre; the camera climbs to the "depth" value (metres risen).
 */

const MARKERS: [number, string][] = [
  [0, '“I will lift up mine eyes unto the hills.” — Psalm 121:1'],
  [130, '“They shall mount up with wings as eagles.” — Isaiah 40:31'],
  [330, 'the open sky'],
  [620, '“The stork in the heaven knoweth her appointed times.” — Jeremiah 8:7'],
  [950, '“The heavens declare the glory of God.” — Psalm 19:1'],
  [1280, 'into the clouds'],
  [1650, '“I do set my bow in the cloud.” — Genesis 9:13'],
  [2150, '“Who maketh the clouds his chariot.” — Psalm 104:3'],
  [2620, 'above the clouds'],
  [3300, '“Lift up your heads, O ye gates.” — Psalm 24:7'],
  [4200, '“A city which hath foundations, whose builder and maker is God.” — Hebrews 11:10'],
  [5200, '“The holy city, new Jerusalem, coming down from God out of heaven.” — Revelation 21:2'],
  [6200, '“The city was pure gold, like unto clear glass.” — Revelation 21:18'],
  [6800, '“The glory of God did lighten it.” — Revelation 21:23'],
  [7110, '“Every several gate was of one pearl.” — Revelation 21:21'],
]

/** the cloud deck you climb through; once above it, it stays just beneath you */
const CLOUD_BASE = 1300
const CLOUD_TOP = 2500
const CLOUD_THICK = CLOUD_TOP - CLOUD_BASE
/** highest camera altitude: a perfect 7,000 m plus the 110 m reading offset */
const TOP = 7110

/* ---------------- small helpers ---------------- */

const smooth = (a: number, b: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

function rng(seed: number) {
  let x = seed % 2147483647
  if (x <= 0) x += 2147483646
  return () => (x = (x * 16807) % 2147483647) / 2147483647
}

function glowTexture(inner = 'rgba(255,255,255,1)') {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, inner)
  grad.addColorStop(0.25, inner.replace(/[\d.]+\)$/, '0.55)'))
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 128)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

/** travel across the view and wrap round off-screen: x in [-span, span] */
function lane(t: number, speed: number, phase: number, span: number) {
  const raw = t * speed + phase * span * 2
  return (((raw % (span * 2)) + span * 2) % (span * 2)) - span
}

/* ---------------- tileable 3D cloud noise (Perlin–Worley), built once ---------------- */

let NOISE: Uint8Array | null = null
function cloudNoise(N: number) {
  if (NOISE) return NOISE
  const r = rng(1234)
  const idx = (x: number, y: number, z: number) => x + N * (y + N * z)
  const out = new Float32Array(N * N * N)
  // value-noise fBm, tileable
  const value = (P: number) => {
    const lat = new Float32Array(P * P * P).map(() => r())
    const L = (x: number, y: number, z: number) => lat[((x % P) + P) % P + P * ((((y % P) + P) % P) + P * (((z % P) + P) % P))]
    const f = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)
    return (x: number, y: number, z: number) => {
      const X = (x / N) * P, Y = (y / N) * P, Z = (z / N) * P
      const xi = Math.floor(X), yi = Math.floor(Y), zi = Math.floor(Z)
      const u = f(X - xi), v = f(Y - yi), w = f(Z - zi)
      const l = (a: number, b: number, t: number) => a + (b - a) * t
      return l(
        l(l(L(xi, yi, zi), L(xi + 1, yi, zi), u), l(L(xi, yi + 1, zi), L(xi + 1, yi + 1, zi), u), v),
        l(l(L(xi, yi, zi + 1), L(xi + 1, yi, zi + 1), u), l(L(xi, yi + 1, zi + 1), L(xi + 1, yi + 1, zi + 1), u), v),
        w,
      )
    }
  }
  // inverted Worley (billowy cells), tileable
  const worley = (C: number) => {
    const pts = new Float32Array(C * C * C * 3).map(() => r())
    return (x: number, y: number, z: number) => {
      const X = (x / N) * C, Y = (y / N) * C, Z = (z / N) * C
      const xi = Math.floor(X), yi = Math.floor(Y), zi = Math.floor(Z)
      let best = 9
      for (let dz = -1; dz <= 1; dz++)
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++) {
            const cx = xi + dx, cy = yi + dy, cz = zi + dz
            const k = ((((cx % C) + C) % C) + C * ((((cy % C) + C) % C) + C * (((cz % C) + C) % C))) * 3
            const px = cx + pts[k] - X, py = cy + pts[k + 1] - Y, pz = cz + pts[k + 2] - Z
            const d = px * px + py * py + pz * pz
            if (d < best) best = d
          }
      return 1 - Math.min(1, Math.sqrt(best))
    }
  }
  const v4 = value(4), v8 = value(8), v16 = value(16), v32 = value(32)
  const w4 = worley(4), w8 = worley(8)
  let lo = Infinity, hi = -Infinity
  for (let z = 0; z < N; z++)
    for (let y = 0; y < N; y++)
      for (let x = 0; x < N; x++) {
        const fbm = v4(x, y, z) * 0.5 + v8(x, y, z) * 0.25 + v16(x, y, z) * 0.15 + v32(x, y, z) * 0.1
        const wor = w4(x, y, z) * 0.65 + w8(x, y, z) * 0.35
        const n = fbm * 0.45 + wor * 0.75
        out[idx(x, y, z)] = n
        if (n < lo) lo = n
        if (n > hi) hi = n
      }
  NOISE = new Uint8Array(N * N * N)
  for (let i = 0; i < out.length; i++) NOISE[i] = Math.round(((out[i] - lo) / (hi - lo)) * 255)
  return NOISE
}

/** a soft, sunlit cumulus puff (fBm-shaped, lit from above) for the clouds that hug the castle */
function puffTexture(seed: number) {
  const S = 192
  const c = document.createElement('canvas')
  c.width = c.height = S
  const g = c.getContext('2d')!
  const img = g.createImageData(S, S)
  const r = rng(seed)
  const lat = Array.from({ length: 17 * 17 }, () => r())
  const vn = (x: number, y: number, P: number) => {
    const X = x * P, Y = y * P
    const xi = Math.floor(X), yi = Math.floor(Y)
    const u = X - xi, v = Y - yi
    const s = (t: number) => t * t * (3 - 2 * t)
    const L = (a: number, b: number) => lat[(a % 16) + 17 * (b % 16)]
    return lerp(lerp(L(xi, yi), L(xi + 1, yi), s(u)), lerp(L(xi, yi + 1), L(xi + 1, yi + 1), s(u)), s(v))
  }
  for (let y = 0; y < S; y++)
    for (let x = 0; x < S; x++) {
      const nx = x / S, ny = y / S
      const f = vn(nx, ny, 3) * 0.5 + vn(nx, ny, 6) * 0.3 + vn(nx, ny, 12) * 0.2
      // a mound: round on top, flatter underneath
      const dx = (nx - 0.5) / 0.48, dy = (ny - 0.56) / (ny < 0.56 ? 0.42 : 0.2)
      const shape = 1 - Math.sqrt(dx * dx + dy * dy)
      const a = Math.max(0, Math.min(1, (shape + (f - 0.5) * 0.9) * 2.4))
      const light = 0.78 + (1 - ny) * 0.3 + (f - 0.5) * 0.25
      const i = (x + y * S) * 4
      img.data[i] = Math.min(255, 255 * light)
      img.data[i + 1] = Math.min(255, 246 * light)
      img.data[i + 2] = Math.min(255, 236 * light)
      img.data[i + 3] = a * 235
    }
  g.putImageData(img, 0, 0)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

/* ---------------- the boat ---------------- */

/** hull of a Galilee fishing boat: pointed ends, rising sheer, rounded bilge */
function hullGeometry(len = 3.2, beam = 0.8, keel = 0.5) {
  const U = 40, V = 18
  const pos: number[] = []
  const idx: number[] = []
  for (let i = 0; i <= U; i++) {
    const u = (i / U) * 2 - 1
    const w = beam * Math.pow(Math.max(0, 1 - u * u), 0.55)
    const k = keel * (1 - Math.pow(Math.abs(u), 3))
    const g = 0.28 + 0.42 * Math.pow(Math.abs(u), 3.5)
    for (let j = 0; j <= V; j++) {
      const v = (j / V) * Math.PI - Math.PI / 2
      pos.push(u * len, g - (g + k) * Math.cos(v) * (1 - 0.15 * Math.abs(Math.sin(v))), w * Math.sin(v))
    }
  }
  for (let i = 0; i < U; i++)
    for (let j = 0; j < V; j++) {
      const a = i * (V + 1) + j, b = a + V + 1
      idx.push(a, b, a + 1, b, b + 1, a + 1)
    }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setIndex(idx)
  g.computeVertexNormals()
  return g
}

function makeBoat() {
  const boat = new THREE.Group()
  const wood = new THREE.MeshStandardMaterial({ color: '#2a1a12', roughness: 0.8, side: THREE.DoubleSide })
  const dark = new THREE.MeshStandardMaterial({ color: '#160e0a', roughness: 0.9 })
  boat.add(new THREE.Mesh(hullGeometry(), wood))
  for (const x of [-1.1, 0, 1.1]) {
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.05, 1.3), dark)
    seat.position.set(x, 0.22, 0)
    boat.add(seat)
  }
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.06, 4.2, 8), dark)
  mast.position.set(0.5, 2.3, 0)
  boat.add(mast)
  const yard = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.6, 8), dark)
  yard.rotation.z = Math.PI / 2 + 0.12
  yard.position.set(0.5, 3.6, 0)
  boat.add(yard)
  const sail = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.06, 2.3, 10), new THREE.MeshStandardMaterial({ color: '#8c7a62', roughness: 1 }))
  sail.rotation.z = Math.PI / 2 + 0.12
  sail.position.set(0.5, 3.5, 0)
  boat.add(sail)
  const ropes = new THREE.LineBasicMaterial({ color: '#1a120d', transparent: true, opacity: 0.8 })
  for (const end of [new THREE.Vector3(3.1, 0.7, 0), new THREE.Vector3(-3.1, 0.7, 0)])
    boat.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0.5, 4.35, 0), end]), ropes))
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(3, 2.2, 1.2) }))
  lamp.position.set(-2.7, 1.15, 0)
  boat.add(lamp)
  const lampLight = new THREE.PointLight('#ffb766', 5, 7, 2)
  lampLight.position.copy(lamp.position)
  boat.add(lampLight)
  return boat
}

/* ---------------- birds ---------------- */

/** a dove facing +x: tapered body, two-jointed swept wings (flapped in the shader), fanned tail */
function birdGeometry() {
  const v: number[] = []
  const tri = (a: number[], b: number[], c: number[]) => v.push(...a, ...b, ...c)
  // body: an 8-sided spindle
  const ring = (x: number, r: number) => Array.from({ length: 8 }, (_, i) => [x, Math.sin((i / 8) * Math.PI * 2) * r * 0.85, Math.cos((i / 8) * Math.PI * 2) * r])
  const rings = [ring(0.32, 0.05), ring(0.12, 0.085), ring(-0.12, 0.07), ring(-0.32, 0.03)]
  const nose = [0.5, 0.01, 0], tailP = [-0.42, 0, 0]
  for (let i = 0; i < 8; i++) {
    const j = (i + 1) % 8
    tri(nose, rings[0][i], rings[0][j])
    for (let k = 0; k < rings.length - 1; k++) {
      tri(rings[k][i], rings[k + 1][i], rings[k + 1][j])
      tri(rings[k][i], rings[k + 1][j], rings[k][j])
    }
    tri(tailP, rings[3][j], rings[3][i])
  }
  // wings: inner and outer panels, swept back, rounded tips
  for (const s of [1, -1]) {
    const a = [0.16, 0.02, 0.06 * s], b = [-0.12, 0.02, 0.06 * s]
    const c = [-0.16, 0.02, 0.42 * s], d = [0.12, 0.02, 0.4 * s]
    const e = [-0.34, 0.02, 0.86 * s], f = [-0.12, 0.02, 0.92 * s], g = [0.02, 0.02, 0.74 * s]
    tri(a, b, c); tri(a, c, d)
    tri(d, c, e); tri(d, e, f); tri(d, f, g)
  }
  // tail fan
  tri([-0.3, 0.01, 0], [-0.62, 0.01, 0.16], [-0.66, 0.01, 0])
  tri([-0.3, 0.01, 0], [-0.66, 0.01, 0], [-0.62, 0.01, -0.16])
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(v, 3))
  geo.computeVertexNormals()
  return geo
}

/* ---------------- the golden city ---------------- */

interface Parts { body: THREE.BufferGeometry[]; roof: THREE.BufferGeometry[]; trim: THREE.BufferGeometry[]; glow: THREE.BufferGeometry[]; pearl: THREE.BufferGeometry[] }

function place(g: THREE.BufferGeometry, x: number, y: number, z: number, ry = 0, rx = 0, rz = 0, s = 1) {
  const m = new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz)), new THREE.Vector3(s, s, s))
  g.applyMatrix4(m)
  return g
}

/** strip to position/normal/uv and drop the index so every part merges cleanly */
function norm(g: THREE.BufferGeometry) {
  const n = g.index ? g.toNonIndexed() : g
  for (const k of Object.keys(n.attributes)) if (k !== 'position' && k !== 'normal' && k !== 'uv') n.deleteAttribute(k)
  if (!n.attributes.uv) n.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(n.attributes.position.count * 2), 2))
  if (!n.attributes.normal) n.computeVertexNormals()
  return n
}

/** an arched window outline (w × h), opening facing +z */
function archShape(w: number, h: number) {
  const s = new THREE.Shape()
  s.moveTo(-w / 2, 0)
  s.lineTo(w / 2, 0)
  s.lineTo(w / 2, h - w / 2)
  s.absarc(0, h - w / 2, w / 2, 0, Math.PI, false)
  s.lineTo(-w / 2, 0)
  return s
}

/**
 * A fairy-tale tower: plinth, banded shaft, corbelled gallery, then a tall concave spire with a
 * ball finial and needle. Rows of glowing arched windows ring the shaft. Optional bartizans
 * (small corner turrets) hang off the gallery.
 */
function addTower(P: Parts, x: number, z: number, r: number, h: number, spire: number, opts: { bartizans?: number; windows?: number; rot?: number } = {}) {
  const body: THREE.Vector2[] = []
  const B = (rr: number, y: number) => body.push(new THREE.Vector2(Math.max(0.001, rr), y))
  B(0.001, 0); B(r * 1.16, 0); B(r * 1.16, h * 0.03); B(r * 1.06, h * 0.045); B(r * 1.02, h * 0.06)
  for (const b of [0.36, 0.64]) {
    const y = h * b, t = Math.max(0.45, r * 0.08)
    B(r, y - t * 1.4); B(r * 1.08, y - t * 0.5); B(r * 1.08, y + t * 0.5); B(r, y + t * 1.2)
  }
  B(r * 0.99, h * 0.82)
  // corbels flaring out to the gallery
  B(r * 1.03, h * 0.85); B(r * 1.12, h * 0.875); B(r * 1.17, h * 0.89); B(r * 1.17, h * 0.975); B(r * 1.21, h * 0.985); B(r * 1.21, h)
  B(0.001, h)
  P.body.push(norm(place(new THREE.LatheGeometry(body, 40), x, 0, z)))

  // spire: a short bell-cast eave, then a slender concave cone
  const roof: THREE.Vector2[] = []
  const R = (rr: number, y: number) => roof.push(new THREE.Vector2(Math.max(0.001, rr), y))
  R(r * 1.3, h - 0.2)
  R(r * 1.32, h + spire * 0.012)
  for (let k = 1; k <= 22; k++) {
    const t = k / 22
    R(r * 1.24 * Math.pow(1 - t, 1.65) + r * 0.03 * (1 - t), h + spire * (0.02 + 0.98 * t))
  }
  P.roof.push(norm(place(new THREE.LatheGeometry(roof, 40), x, 0, z)))
  // a gold band under the eave and the finial
  P.trim.push(norm(place(new THREE.TorusGeometry(r * 1.21, Math.max(0.18, r * 0.05), 8, 40), x, h, z, 0, Math.PI / 2)))
  P.trim.push(norm(place(new THREE.SphereGeometry(Math.max(0.35, r * 0.14), 16, 12), x, h + spire + r * 0.08, z)))
  P.trim.push(norm(place(new THREE.CylinderGeometry(0.04, Math.max(0.12, r * 0.05), spire * 0.22, 8), x, h + spire + r * 0.1 + spire * 0.11, z)))

  // arched windows in rows round the shaft
  const nw = opts.windows ?? Math.max(4, Math.round((Math.PI * 2 * r) / (r * 1.35)))
  const rows = h > 70 ? [0.2, 0.5, 0.74] : h > 40 ? [0.28, 0.7] : [0.55]
  const ww = Math.max(0.7, r * 0.3), wh = ww * 2.1
  rows.forEach((fy, ri) => {
    for (let i = 0; i < nw; i++) {
      const a = (i / nw) * Math.PI * 2 + (ri % 2) * (Math.PI / nw) + (opts.rot ?? 0)
      const g = new THREE.ShapeGeometry(archShape(ww, wh), 6)
      P.glow.push(norm(place(g, x + Math.sin(a) * (r * 1.005 + 0.05), h * fy, z + Math.cos(a) * (r * 1.005 + 0.05), a)))
      // a gold surround
      const frame = new THREE.ShapeGeometry(archShape(ww * 1.35, wh * 1.18), 6)
      P.trim.push(norm(place(frame, x + Math.sin(a) * r * 0.99, h * fy - wh * 0.06, z + Math.cos(a) * r * 0.99, a)))
    }
  })

  // bartizans: little turrets on corbels at the gallery
  const nb = opts.bartizans ?? 0
  for (let i = 0; i < nb; i++) {
    const a = (i / nb) * Math.PI * 2 + Math.PI / 4 + (opts.rot ?? 0)
    const br = r * 0.32, bh = h * 0.16
    const bx = x + Math.sin(a) * r * 1.12, bz = z + Math.cos(a) * r * 1.12, by = h * 0.8
    P.body.push(norm(place(new THREE.ConeGeometry(br, br * 2.2, 20), bx, by - br * 1.1, bz, 0, Math.PI)))
    P.body.push(norm(place(new THREE.CylinderGeometry(br, br, bh, 20), bx, by + bh / 2, bz)))
    const tr: THREE.Vector2[] = []
    for (let k = 0; k <= 12; k++) {
      const t = k / 12
      tr.push(new THREE.Vector2(Math.max(0.001, br * 1.25 * Math.pow(1 - t, 1.6)), by + bh + spire * 0.42 * t))
    }
    P.roof.push(norm(place(new THREE.LatheGeometry(tr, 20), bx, 0, bz)))
    P.trim.push(norm(place(new THREE.SphereGeometry(Math.max(0.2, br * 0.18), 10, 8), bx, by + bh + spire * 0.42 + 0.2, bz)))
  }
}

/** a hall between towers: walls with window rows under a steep gold gable roof, long axis along local x */
function addHall(P: Parts, x: number, z: number, ry: number, len: number, wid: number, h: number) {
  const tmp = new THREE.Object3D()
  tmp.position.set(x, 0, z)
  tmp.rotation.y = ry
  tmp.updateMatrix()
  const put = (g: THREE.BufferGeometry, lx: number, ly: number, lz: number, rot = 0) => {
    g.applyMatrix4(new THREE.Matrix4().makeRotationY(rot))
    g.translate(lx, ly, lz)
    g.applyMatrix4(tmp.matrix)
    return norm(g)
  }
  P.body.push(put(new THREE.BoxGeometry(len, h, wid), 0, h / 2, 0))
  P.trim.push(put(new THREE.BoxGeometry(len + 0.8, 0.6, wid + 0.8), 0, h, 0))
  // steep gable roof
  const rh = wid * 0.9
  const sh = new THREE.Shape()
  sh.moveTo(-wid / 2 - 0.6, 0)
  sh.lineTo(wid / 2 + 0.6, 0)
  sh.lineTo(0, rh)
  sh.lineTo(-wid / 2 - 0.6, 0)
  const roof = new THREE.ExtrudeGeometry(sh, { depth: len + 0.6, bevelEnabled: false })
  roof.translate(0, 0, -(len + 0.6) / 2)
  P.roof.push(put(roof, 0, h, 0, Math.PI / 2))
  // window rows on both long faces
  const n = Math.max(3, Math.floor(len / 4))
  for (const side of [1, -1])
    for (let i = 0; i < n; i++) {
      const lx = -len / 2 + (len / n) * (i + 0.5)
      for (const fy of [0.3, 0.62]) {
        const g = new THREE.ShapeGeometry(archShape(1.1, 2.4), 6)
        P.glow.push(put(g, lx, h * fy, side * (wid / 2 + 0.05), side > 0 ? 0 : Math.PI))
      }
    }
}

/** a stretch of curtain wall with merlons along the top */
function addWall(P: Parts, ax: number, az: number, bx: number, bz: number, h: number) {
  const dx = bx - ax, dz = bz - az
  const len = Math.hypot(dx, dz)
  const ry = Math.atan2(-dz, dx)
  const cx = (ax + bx) / 2, cz = (az + bz) / 2
  P.body.push(norm(place(new THREE.BoxGeometry(len, h, 3.2), cx, h / 2, cz, ry)))
  P.trim.push(norm(place(new THREE.BoxGeometry(len, 0.7, 4), cx, h, cz, ry)))
  const n = Math.floor(len / 2.6)
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n - 0.5
    P.trim.push(norm(place(new THREE.BoxGeometry(1.3, 1.6, 3.6), cx + Math.cos(ry) * t * len, h + 1.15, cz - Math.sin(ry) * t * len, ry)))
  }
}

/** the whole city: a towering keep of spires, rings of towers, halls, curtain walls and a gate of pearl facing +z */
function buildCastle() {
  const P: Parts = { body: [], roof: [], trim: [], glow: [], pearl: [] }
  const r = rng(77)

  // the great keep: an octagonal hall crowned by the tallest spire
  P.body.push(norm(place(new THREE.CylinderGeometry(19, 21, 64, 8), 0, 32, -4, Math.PI / 8)))
  P.roof.push(norm(place(new THREE.ConeGeometry(22.5, 26, 8), 0, 77, -4, Math.PI / 8)))
  P.trim.push(norm(place(new THREE.CylinderGeometry(21.5, 21.5, 1.2, 8), 0, 64, -4, Math.PI / 8)))
  addTower(P, 0, -4, 9.5, 150, 92, { bartizans: 4, windows: 8 })

  // inner ring: four tall towers on the diagonals, four slimmer between
  for (let i = 0; i < 4; i++) {
    const a = Math.PI / 4 + (i * Math.PI) / 2
    addTower(P, Math.sin(a) * 25, -4 + Math.cos(a) * 21, 6.8, 112, 60, { bartizans: 2, rot: a })
    const b = (i * Math.PI) / 2
    addTower(P, Math.sin(b) * 28, -4 + Math.cos(b) * 24, 4.6, 92, 46, { rot: b })
  }

  // middle ring of towers with halls between
  const mid = 6
  for (let i = 0; i < mid; i++) {
    const a = (i / mid) * Math.PI * 2 + Math.PI / 6
    addTower(P, Math.sin(a) * 50, -4 + Math.cos(a) * 40, 6, 78, 44, { bartizans: 2, rot: a })
    const b = a + Math.PI / mid
    addHall(P, Math.sin(b) * 42, -4 + Math.cos(b) * 34, -b + Math.PI / 2, 22, 12, 40)
  }

  // a scatter of slender pinnacles to make the skyline rich
  for (let i = 0; i < 14; i++) {
    const a = r() * Math.PI * 2
    const d = 14 + r() * 50
    addTower(P, Math.sin(a) * d * 1.15, -4 + Math.cos(a) * d * 0.9, 2.2 + r() * 1.6, 52 + r() * 46, 24 + r() * 18, { windows: 4 })
  }

  // outer ring: lower towers joined by curtain walls (an ellipse, wider than deep)
  const outer = 12
  const ring: [number, number][] = []
  for (let i = 0; i < outer; i++) {
    const a = (i / outer) * Math.PI * 2
    ring.push([Math.sin(a) * 88, -4 + Math.cos(a) * 66])
  }
  ring.forEach(([x, z], i) => {
    if (i === 0) return // the gatehouse stands here
    addTower(P, x, z, 5.4, 52, 32, { bartizans: i % 2 ? 0 : 2, rot: (i / outer) * Math.PI * 2 })
  })
  for (let i = 0; i < outer; i++) {
    const [ax, az] = ring[i]
    const [bx, bz] = ring[(i + 1) % outer]
    if (i === 0) addWall(P, 14, 62, bx, bz, 26)
    else if (i === outer - 1) addWall(P, ax, az, -14, 62, 26)
    else addWall(P, ax, az, bx, bz, 26)
  }

  // the gatehouse: twin towers and a great arch of pearl, glowing within
  for (const gx of [-14, 14]) addTower(P, gx, 64, 7, 62, 38, { bartizans: 2 })
  P.body.push(norm(place(new THREE.BoxGeometry(22, 36, 10), 0, 18, 62)))
  P.trim.push(norm(place(new THREE.BoxGeometry(23, 1, 11), 0, 36, 62)))
  for (let i = 0; i < 7; i++) P.trim.push(norm(place(new THREE.BoxGeometry(1.6, 2, 11), -9.5 + i * 3.17, 37.4, 62)))
  P.glow.push(norm(place(new THREE.ShapeGeometry(archShape(10, 20), 16), 0, 0, 67.1)))
  P.pearl.push(norm(place(new THREE.TorusGeometry(5.8, 1.1, 16, 40, Math.PI), 0, 15, 67.2)))
  for (const px of [-5.8, 5.8]) P.pearl.push(norm(place(new THREE.CylinderGeometry(1.1, 1.3, 15, 16), px, 7.5, 67.2)))

  return P
}

/* ---------------- background: sky, sea and volumetric clouds ---------------- */

const BG_VERT = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`
const BG_FRAG = /* glsl */ `
precision highp float;
precision highp sampler3D;
uniform sampler3D uNoise;
uniform mat4 uInvProj; uniform mat4 uCamWorld; uniform vec3 uCamPos;
uniform float uTime;
uniform vec3 uHorizon; uniform vec3 uMid; uniform vec3 uZenith;
uniform vec3 uSunDir; uniform vec3 uSunCol; uniform float uSunI;
uniform float uBase; uniform float uTop; uniform float uCover; uniform float uRainbow; uniform float uGod; uniform float uSteps; uniform float uAbove;
varying vec2 vUv;

float ign(vec2 p){ return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715)))); }

vec3 skyCol(vec3 rd){
  float h = max(rd.y, 0.0);
  vec3 c = mix(uHorizon, uMid, smoothstep(0.0, 0.2, h));
  c = mix(c, uZenith, smoothstep(0.12, 0.95, h));
  float s = max(dot(rd, uSunDir), 0.0);
  c += uSunCol * uSunI * (pow(s, 8.0) * 0.08 + pow(s, 64.0) * 0.3);
  // soft shafts of light fanning from the sun
  vec3 r = normalize(cross(uSunDir, vec3(0.0, 1.0, 0.0)));
  vec3 u = cross(r, uSunDir);
  float ang = atan(dot(rd, r), dot(rd, u) + 1e-5);
  float streak = 0.5 + 0.5 * sin(ang * 19.0 + sin(ang * 5.0 + uTime * 0.04) * 2.4) * sin(ang * 7.0 - uTime * 0.03);
  c += uSunCol * pow(s, 3.0) * streak * uGod * 0.22;
  return c;
}

vec3 seaCol(vec3 rd){
  float f = pow(1.0 - abs(rd.y), 10.0);
  vec3 c = mix(vec3(0.004, 0.012, 0.03), uMid * 0.18, f);
  // looking down through more air the higher you are: the sea hazes toward the horizon colour
  float dist = uCamPos.y / max(-rd.y, 0.002);
  c = mix(c, uHorizon * 0.55, 1.0 - exp(-dist / 14000.0));
  vec3 rr = reflect(rd, vec3(0.0, 1.0, 0.0));
  float s = max(dot(rr, uSunDir), 0.0);
  c += uSunCol * (pow(s, 400.0) * 4.0 + pow(s, 40.0) * 0.12) * uSunI;
  return c;
}

float dens(vec3 p, bool detail){
  vec3 q = p * (1.0 / 2600.0) + vec3(uTime * 0.0016, 0.0, uTime * 0.0008);
  float n = texture(uNoise, q).r;
  float h = clamp((p.y - uBase) / (uTop - uBase), 0.0, 1.0);
  // flat-ish undersides, billowing tops that rise where the noise is strong
  float shape = smoothstep(0.0, 0.1, h) * smoothstep(1.0, 0.35, h + (1.0 - n) * 0.45);
  float d = (n - (1.0 - uCover)) / uCover;
  d *= shape;
  if (detail && d > 0.0) {
    float dn = texture(uNoise, q * 5.3 + vec3(0.37, 0.1, 0.71)).r;
    d -= (1.0 - dn) * 0.28 * (1.0 - h * 0.3);
  }
  return max(d, 0.0);
}

void main(){
  vec2 ndc = vUv * 2.0 - 1.0;
  vec4 v = uInvProj * vec4(ndc, 1.0, 1.0);
  vec3 rd = normalize((uCamWorld * vec4(normalize(v.xyz / v.w), 0.0)).xyz);
  vec3 ro = uCamPos;

  vec3 bg;
  if (rd.y >= 0.0) bg = skyCol(rd);
  else if (uAbove > 0.5) bg = mix(uHorizon, vec3(1.0, 0.97, 0.94), 0.6);
  else bg = seaCol(rd);

  float t0 = -1.0, t1 = -1.0;
  if (ro.y < uBase) { if (rd.y > 0.0) { t0 = (uBase - ro.y) / rd.y; t1 = (uTop - ro.y) / rd.y; } }
  else if (ro.y > uTop) { if (rd.y < 0.0) { t0 = (uTop - ro.y) / rd.y; t1 = (uBase - ro.y) / rd.y; } }
  else { t0 = 0.0; t1 = rd.y > 0.0 ? (uTop - ro.y) / rd.y : (rd.y < 0.0 ? (uBase - ro.y) / rd.y : 1e5); }

  vec3 col = bg;
  float T = 1.0;
  if (t0 >= 0.0) {
    t1 = min(t1, t0 + 16000.0);
    float steps = uSteps;
    float dt = (t1 - t0) / steps;
    float t = t0 + dt * ign(gl_FragCoord.xy);
    float cosS = dot(rd, uSunDir);
    float phase = 0.55 + 0.9 * pow(max(cosS, 0.0), 10.0) + 0.2 * pow(max(cosS, 0.0), 2.0);
    vec3 acc = vec3(0.0);
    float firstHit = -1.0;
    for (int i = 0; i < 64; i++) {
      if (float(i) >= steps || T < 0.02) break;
      vec3 p = ro + rd * t;
      float d = dens(p, true);
      if (d > 0.003) {
        if (firstHit < 0.0) firstHit = t;
        float ls = dens(p + uSunDir * 80.0, false) * 0.55 + dens(p + uSunDir * 240.0, false) * 0.45;
        float beer = exp(-ls * 2.6);
        float hh = clamp((p.y - uBase) / (uTop - uBase), 0.0, 1.0);
        vec3 amb = mix(uMid * 0.28 + vec3(0.04, 0.045, 0.07), mix(uMid, vec3(1.0), 0.45), hh) * 0.7;
        vec3 lit = uSunCol * uSunI * beer * phase * (1.0 - exp(-d * 5.0)) * 1.05 + amb;
        float a = 1.0 - exp(-d * dt * 0.014);
        acc += T * a * lit;
        T *= 1.0 - a;
      }
      t += dt;
    }
    if (firstHit > 0.0) {
      // far cloud melts into the horizon haze (aerial perspective)
      float fade = smoothstep(3000.0, 15000.0, firstHit);
      float alpha = 1.0 - T;
      vec3 cloud = acc / max(alpha, 1e-4);
      cloud = mix(cloud, uHorizon * 1.05, fade * 0.7);
      col = mix(bg, cloud, alpha);
    }
  }

  // a bow in the cloud (Genesis 9:13): a 42° arc set ahead of you, with its faint secondary
  if (uRainbow > 0.001) {
    vec3 c = normalize(vec3(-uSunDir.x * 0.5, -0.32, -1.0));
    float ang = degrees(acos(clamp(dot(rd, c), -1.0, 1.0)));
    float tt = (ang - 39.5) / 3.2;
    if (tt > 0.0 && tt < 1.0) {
      vec3 bow = clamp(abs(mod((1.0 - tt) * 0.78 * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
      col += bow * smoothstep(0.0, 0.3, tt) * smoothstep(1.0, 0.7, tt) * uRainbow * 0.32;
    }
    float tt2 = (ang - 50.5) / 3.6;
    if (tt2 > 0.0 && tt2 < 1.0) {
      vec3 bow2 = clamp(abs(mod(tt2 * 0.78 * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
      col += bow2 * smoothstep(0.0, 0.3, tt2) * smoothstep(1.0, 0.7, tt2) * uRainbow * 0.08;
    }
  }

  // the sun's disc, where the sky is clear
  float s = max(dot(rd, uSunDir), 0.0);
  col += uSunCol * pow(s, 2400.0) * 24.0 * T * uSunI;
  gl_FragColor = vec4(max(col, vec3(0.0)), 1.0);
}`

/* sky by altitude (sRGB-authored): [alt, horizon, mid, zenith, sunEl, sunCol, sunI, cover, rainbow, god] */
type V3 = [number, number, number]
type Stage = [number, V3, V3, V3, number, V3, number, number, number, number]
const STAGES: Stage[] = [
  [0, [0.98, 0.6, 0.36], [0.44, 0.36, 0.48], [0.07, 0.1, 0.24], 0.035, [1.0, 0.6, 0.32], 1.1, 0.5, 0, 0.15],
  [450, [1.0, 0.72, 0.46], [0.62, 0.6, 0.74], [0.17, 0.27, 0.55], 0.06, [1.0, 0.74, 0.46], 1.5, 0.52, 0, 0.25],
  [1150, [1.0, 0.82, 0.6], [0.62, 0.7, 0.88], [0.2, 0.36, 0.7], 0.09, [1.0, 0.82, 0.58], 1.8, 0.55, 0.7, 0.3],
  [2000, [1.0, 0.86, 0.66], [0.64, 0.74, 0.92], [0.18, 0.36, 0.72], 0.11, [1.0, 0.86, 0.64], 2.0, 0.56, 1, 0.35],
  [2700, [1.0, 0.88, 0.66], [0.5, 0.68, 0.96], [0.1, 0.27, 0.66], 0.13, [1.0, 0.9, 0.7], 2.0, 0.64, 0, 0.5],
  [5000, [1.0, 0.86, 0.6], [0.52, 0.68, 0.95], [0.1, 0.26, 0.64], 0.14, [1.0, 0.88, 0.64], 2.1, 0.66, 0, 0.75],
  [TOP, [1.0, 0.84, 0.54], [0.5, 0.66, 0.94], [0.1, 0.23, 0.6], 0.15, [1.0, 0.86, 0.6], 1.9, 0.68, 0, 0.8],
]
const SUN_AZ = 0.42
function stageAt(d: number) {
  let i = 1
  while (i < STAGES.length - 1 && d > STAGES[i][0]) i++
  const a = STAGES[i - 1], b = STAGES[i]
  const k = smooth(a[0], b[0], d)
  const m3 = (x: V3, y: V3) => x.map((v, j) => lerp(v, y[j], k)) as V3
  return {
    horizon: m3(a[1], b[1]), mid: m3(a[2], b[2]), zenith: m3(a[3], b[3]), sunEl: lerp(a[4], b[4], k), sunCol: m3(a[5], b[5]),
    sunI: lerp(a[6], b[6], k), cover: lerp(a[7], b[7], k), rainbow: lerp(a[8], b[8], k), god: lerp(a[9], b[9], k),
  }
}

export default function World3D() {
  const mount = useRef<HTMLDivElement>(null)
  const caption = useRef<HTMLDivElement>(null)
  const scrim = useRef<HTMLDivElement>(null)
  const vig = useRef<HTMLDivElement>(null)
  const target = useDepthTarget()
  const path = usePath()
  const depth = useMotionValue(target)
  const showCaptions = useRef(true)
  showCaptions.current = path.startsWith('/dive') || path.startsWith('/free')

  // the climb itself: long, eased, never a jump cut
  useEffect(() => {
    const dist = Math.abs(target - depth.get())
    const c = animate(depth, target, { duration: Math.min(7, Math.max(1.4, dist / 650)), ease: [0.45, 0, 0.2, 1] })
    return () => c.stop()
  }, [target, depth])

  useEffect(() => {
    const el = mount.current!
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = Math.min(window.innerWidth, window.innerHeight) < 700
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    el.appendChild(renderer.domElement)
    renderer.domElement.style.display = 'block'

    const scene = new THREE.Scene()
    const fog = new THREE.FogExp2('#f0d0a0', 0.0004)
    scene.fog = fog
    const camera = new THREE.PerspectiveCamera(55, 1, 0.5, 20000)

    /* environment for the gold: warm horizon, blue above, bright cloud below */
    const pmrem = new THREE.PMREMGenerator(renderer)
    const envScene = new THREE.Scene()
    envScene.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(100, 48, 24),
        new THREE.ShaderMaterial({
          side: THREE.BackSide,
          vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
          fragmentShader: `varying vec3 vP; void main(){
            vec3 d = normalize(vP); float h = d.y;
            vec3 c = mix(vec3(1.5,1.05,0.5), vec3(0.18,0.36,0.85), smoothstep(0.0, 0.6, h));
            c = h < 0.0 ? mix(vec3(1.5,1.05,0.5), vec3(1.1,0.95,0.78), smoothstep(0.0, -0.25, h)) : c;
            float s = max(dot(d, normalize(vec3(0.4,0.15,-1.0))), 0.0);
            c += vec3(6.0,4.6,2.8) * pow(s, 60.0);
            gl_FragColor = vec4(c, 1.0); }`,
        }),
      ),
    )
    const envTex = pmrem.fromScene(envScene, 0.02).texture
    scene.environment = envTex

    /* lights */
    const hemi = new THREE.HemisphereLight('#c8d8ff', '#40302a', 1)
    scene.add(hemi)
    const sun = new THREE.DirectionalLight('#ffd9a0', 2.4)
    scene.add(sun, sun.target)
    // key light on the city's face from the viewer's upper left; it casts the shadows that model the towers
    const fill = new THREE.DirectionalLight('#ffe6c0', 0)
    fill.shadow.mapSize.set(small ? 1024 : 2048, small ? 1024 : 2048)
    Object.assign(fill.shadow.camera, { left: -240, right: 240, top: 340, bottom: -80, near: 10, far: 3000 })
    fill.shadow.bias = -0.0004
    fill.shadow.normalBias = 0.8
    scene.add(fill, fill.target)

    /* background pass: sky + sea + ray-marched clouds at reduced resolution */
    const NS = 64
    const noiseTex = new THREE.Data3DTexture(cloudNoise(NS), NS, NS, NS)
    noiseTex.format = THREE.RedFormat
    noiseTex.type = THREE.UnsignedByteType
    noiseTex.minFilter = noiseTex.magFilter = THREE.LinearFilter
    noiseTex.wrapS = noiseTex.wrapT = noiseTex.wrapR = THREE.RepeatWrapping
    noiseTex.unpackAlignment = 1
    noiseTex.needsUpdate = true
    const bgU = {
      uNoise: { value: noiseTex },
      uInvProj: { value: new THREE.Matrix4() },
      uCamWorld: { value: new THREE.Matrix4() },
      uCamPos: { value: new THREE.Vector3() },
      uTime: { value: 0 },
      uHorizon: { value: new THREE.Color() },
      uMid: { value: new THREE.Color() },
      uZenith: { value: new THREE.Color() },
      uSunDir: { value: new THREE.Vector3(0, 0.1, -1) },
      uSunCol: { value: new THREE.Color() },
      uSunI: { value: 1 },
      uBase: { value: CLOUD_BASE },
      uTop: { value: CLOUD_TOP },
      uCover: { value: 0.5 },
      uRainbow: { value: 0 },
      uGod: { value: 0 },
      uSteps: { value: small ? 30 : 46 },
      uAbove: { value: 0 },
    }
    const bgScene = new THREE.Scene()
    const bgCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const bgMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({ uniforms: bgU, vertexShader: BG_VERT, fragmentShader: BG_FRAG, depthTest: false, depthWrite: false }))
    bgMesh.frustumCulled = false
    bgScene.add(bgMesh)
    const BG_SCALE = small ? 0.42 : 0.55
    const bgRT = new THREE.WebGLRenderTarget(2, 2, { type: THREE.HalfFloatType, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false })
    // the finished background, drawn first behind everything in the main scene
    const bgQuad = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        uniforms: { tBg: { value: bgRT.texture } },
        vertexShader: BG_VERT,
        fragmentShader: `uniform sampler2D tBg; varying vec2 vUv; void main(){ gl_FragColor = texture2D(tBg, vUv); }`,
        depthTest: false,
        depthWrite: false,
      }),
    )
    bgQuad.frustumCulled = false
    bgQuad.renderOrder = -100
    scene.add(bgQuad)

    /* distant hills of Galilee */
    const hills = new THREE.Group()
    const hillMats: THREE.MeshBasicMaterial[] = []
    const ridge = (seed: number, x: number) =>
      Math.sin(x * 0.006 + seed) * 0.5 + Math.sin(x * 0.017 + seed * 2.3) * 0.28 + Math.sin(x * 0.047 + seed * 5.1) * 0.12 + Math.sin(x * 0.11 + seed * 7.7) * 0.05
    for (const L of [
      { z: -1400, h: 120, base: 18, color: '#4a3a52', seed: 1.3 },
      { z: -1050, h: 80, base: 8, color: '#2c2440', seed: 4.1 },
      { z: -760, h: 38, base: 2, color: '#171628', seed: 8.6 },
    ]) {
      const shape = new THREE.Shape()
      const W = 5200
      shape.moveTo(-W / 2, -10)
      for (let x = -W / 2; x <= W / 2; x += 10) shape.lineTo(x, L.base + (ridge(L.seed, x * 0.45) * 0.5 + 0.5) * L.h)
      shape.lineTo(W / 2, -10)
      const mat = new THREE.MeshBasicMaterial({ color: L.color, fog: false, transparent: true })
      hillMats.push(mat)
      const m = new THREE.Mesh(new THREE.ShapeGeometry(shape), mat)
      m.position.z = L.z
      hills.add(m)
    }
    scene.add(hills)

    /* the lake near the boat; it fades into the ray-marched sea beyond */
    const waterU = { uTime: { value: 0 }, uFade: { value: 1 } }
    const water = new THREE.Mesh(
      new THREE.PlaneGeometry(1600, 1600, 200, 200),
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: waterU,
        vertexShader: `uniform float uTime; varying vec3 vW; varying float vH;
          void main(){
            vec3 p = position;
            float h = sin(p.x*0.18 + uTime*0.9)*0.22 + sin(p.y*0.27 + uTime*1.3)*0.16 + sin((p.x+p.y)*0.6 + uTime*2.0)*0.05;
            p.z += h; vH = h;
            vec4 w = modelMatrix * vec4(p,1.0); vW = w.xyz;
            gl_Position = projectionMatrix * viewMatrix * w;
          }`,
        fragmentShader: `uniform float uTime; uniform float uFade; varying vec3 vW; varying float vH;
          void main(){
            vec3 V = normalize(cameraPosition - vW);
            float fres = pow(1.0 - max(V.y, 0.0), 4.0);
            vec3 c = mix(vec3(0.012,0.03,0.06), vec3(0.30,0.24,0.34), fres*0.8);
            float rip = sin(vW.x*0.7+uTime)*sin(vW.z*0.6-uTime*0.8) + 0.5*sin(vW.x*2.1-uTime*1.7)*sin(vW.z*1.7+uTime*1.3);
            c += vec3(0.03,0.04,0.06) * rip;
            float dist = length(cameraPosition.xz - vW.xz);
            float off = abs(vW.x - 0.42*vW.z) / (4.0 + dist*0.07);
            float path = exp(-off*off*2.0) * smoothstep(-5.0, -60.0, vW.z);
            float glint = smoothstep(0.55, 1.0, rip*0.6 + 0.4*sin(vW.x*5.3+uTime*2.6)*sin(vW.z*4.1-uTime*2.2) + vH*1.5);
            c += vec3(1.0,0.70,0.38) * path * (0.25 + 1.6*glint);
            float a = (1.0 - smoothstep(380.0, 760.0, dist)) * uFade;
            gl_FragColor = vec4(pow(max(c, vec3(0.0)), vec3(2.2)), a);
          }`,
      }),
    )
    water.rotation.x = -Math.PI / 2
    scene.add(water)

    const boat = makeBoat()
    boat.position.set(6.2, 0.2, -15)
    boat.rotation.y = 0.35
    scene.add(boat)

    /* birds: one instanced mesh; wings flap (two joints, with glides) in the vertex shader */
    const birdGeo = birdGeometry()
    const birdMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.55, metalness: 0, side: THREE.DoubleSide })
    const birdTime = { value: 0 }
    birdMat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = birdTime
      shader.vertexShader = 'uniform float uTime;\nattribute vec3 aFlap;\n' + shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
         float wz = abs(position.z);
         float id = float(gl_InstanceID);
         float glide = mix(0.25, 1.0, smoothstep(-0.2, 0.4, sin(uTime * 0.45 + id * 2.1 + aFlap.z)));
         float ph = uTime * aFlap.x + id * 1.37;
         float inner = sin(ph) * min(wz, 0.42);
         float outer = sin(ph - 0.7) * max(wz - 0.42, 0.0) * 1.5;
         transformed.y += (inner + outer) * aFlap.y * glide + (1.0 - glide) * wz * 0.12;
         transformed.z *= 1.0 - 0.08 * abs(sin(ph)) * step(0.1, wz) * glide;`,
      )
    }
    interface Flock { from: number; to: number; dy: number; r: number; speed: number; count: number; tint: string; size: number; flap: [number, number]; phase: number; aroundCity?: boolean }
    const flocks: Flock[] = [
      { from: 0, to: 700, dy: 6, r: 15, speed: 0.5, count: 26, tint: '#2a2430', size: 0.5, flap: [15, 0.55], phase: 0 }, // swallows
      { from: 0, to: 1250, dy: 10, r: 19, speed: -0.3, count: 22, tint: '#f6f1e8', size: 0.85, flap: [9, 0.5], phase: 1.1 }, // doves
      { from: 120, to: 1250, dy: -7, r: 23, speed: 0.25, count: 20, tint: '#efe9f2', size: 0.9, flap: [8.5, 0.5], phase: 2.3 }, // doves
      { from: 300, to: 1250, dy: 14, r: 30, speed: 0.14, count: 12, tint: '#ebe5da', size: 1.8, flap: [3.6, 0.4], phase: 0.6 }, // storks
      { from: 40, to: 1250, dy: 18, r: 36, speed: 0.08, count: 1, tint: '#4a3628', size: 3.4, flap: [1.3, 0.18], phase: 0.2 }, // eagle
      { from: 2550, to: 9000, dy: 0, r: 150, speed: 0.07, count: 22, tint: '#fffaf0', size: 2.6, flap: [7, 0.5], phase: 0.4, aroundCity: true }, // doves round the city
      { from: 2550, to: 9000, dy: 0, r: 210, speed: -0.05, count: 16, tint: '#fff4e0', size: 2.8, flap: [6.5, 0.5], phase: 2.0, aroundCity: true },
    ]
    const totalBirds = flocks.reduce((s, f) => s + f.count, 0)
    const flapArr = new Float32Array(totalBirds * 3)
    {
      let k = 0
      for (const f of flocks)
        for (let i = 0; i < f.count; i++, k++) {
          flapArr[k * 3] = f.flap[0] * (0.88 + Math.random() * 0.24)
          flapArr[k * 3 + 1] = f.flap[1]
          flapArr[k * 3 + 2] = Math.random() * 6.28
        }
    }
    birdGeo.setAttribute('aFlap', new THREE.InstancedBufferAttribute(flapArr, 3))
    const birds = new THREE.InstancedMesh(birdGeo, birdMat, totalBirds)
    birds.frustumCulled = false
    {
      const col = new THREE.Color()
      let k = 0
      for (const f of flocks)
        for (let i = 0; i < f.count; i++, k++) birds.setColorAt(k, col.set(f.tint))
    }
    scene.add(birds)
    const dummy = new THREE.Object3D()
    const birdOffsets = Array.from({ length: totalBirds }, () => [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5, Math.random()])

    /* the golden city */
    const P = buildCastle()
    const goldRoof = new THREE.MeshPhysicalMaterial({ color: '#e39a14', metalness: 1, roughness: 0.26, clearcoat: 0.35, clearcoatRoughness: 0.25, side: THREE.DoubleSide })
    const goldBody = new THREE.MeshStandardMaterial({ color: '#e9cf98', metalness: 0.45, roughness: 0.48, side: THREE.DoubleSide })
    const goldTrim = new THREE.MeshStandardMaterial({ color: '#f7bd2e', metalness: 1, roughness: 0.22 })
    const windowGlow = new THREE.MeshBasicMaterial({ color: new THREE.Color(2.2, 1.55, 0.75), side: THREE.DoubleSide })
    const pearl = new THREE.MeshPhysicalMaterial({ color: '#fff8f0', roughness: 0.12, metalness: 0, clearcoat: 1, iridescence: 1, iridescenceIOR: 1.6, sheen: 0.5, emissive: '#fff0dc', emissiveIntensity: 0.25 })
    const city = new THREE.Group()
    for (const [geos, mat, shadow] of [[P.body, goldBody, true], [P.roof, goldRoof, true], [P.trim, goldTrim, true], [P.glow, windowGlow, false], [P.pearl, pearl, true]] as const) {
      const m = new THREE.Mesh(mergeGeometries(geos as THREE.BufferGeometry[]), mat)
      m.castShadow = shadow
      m.receiveShadow = shadow
      city.add(m)
    }
    // pennants streaming from the five highest spires
    const flagGeo = new THREE.PlaneGeometry(18, 3.4, 18, 2)
    {
      const p = flagGeo.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i) + 9
        p.setX(i, x)
        p.setY(i, p.getY(i) * (1 - (x / 18) * 0.85))
      }
    }
    const flagTime = { value: 0 }
    const flagMat = new THREE.MeshStandardMaterial({ color: '#fff4dc', roughness: 0.6, side: THREE.DoubleSide, emissive: '#ffe6b0', emissiveIntensity: 0.25 })
    flagMat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = flagTime
      shader.vertexShader = 'uniform float uTime;\n' + shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
         float w = position.x / 18.0;
         float ph = modelMatrix[3].x * 0.21 + modelMatrix[3].z * 0.13;
         transformed.z += sin(position.x * 0.38 - uTime * 4.2 + ph) * w * 1.8;
         transformed.y += sin(position.x * 0.27 - uTime * 3.1 + ph) * w * 0.7 - w * 1.2;`,
      )
    }
    const flagSpots: [number, number, number][] = [[0, 150 + 92, -4]]
    for (let i = 0; i < 4; i++) {
      const a = Math.PI / 4 + (i * Math.PI) / 2
      flagSpots.push([Math.sin(a) * 25, 112 + 60, -4 + Math.cos(a) * 21])
    }
    for (const [x, y, z] of flagSpots) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 22, 6), goldTrim)
      pole.position.set(x, y + 14, z)
      city.add(pole)
      const flag = new THREE.Mesh(flagGeo, flagMat)
      flag.position.set(x, y + 22, z)
      flag.rotation.y = -0.6
      city.add(flag)
    }
    // the gate's light spilling out
    const gateLight = new THREE.PointLight('#ffe2a8', 400, 90, 1.6)
    gateLight.position.set(0, 10, 76)
    city.add(gateLight)
    // soft cloud piled about the city's foot, so it rests in the clouds rather than on them
    const puffMats = [11, 23, 37].map((s) => new THREE.SpriteMaterial({ map: puffTexture(s), transparent: true, depthWrite: false, fog: true }))
    const puffs = new THREE.Group()
    {
      const r = rng(5)
      for (let i = 0; i < 90; i++) {
        let a = r() * Math.PI * 2
        if (Math.abs(Math.atan2(Math.sin(a), Math.cos(a))) < 0.55) a += Math.PI * 0.6 // keep the gate clear
        const rad = 70 + r() * 170
        const s = new THREE.Sprite(puffMats[i % 3])
        s.position.set(Math.sin(a) * rad * 1.25, -14 + r() * 10, -4 + Math.cos(a) * rad * 0.85)
        const w = 45 + r() * 70
        s.scale.set(w, w * 0.45, 1)
        s.userData.base = s.position.clone()
        s.userData.ph = r() * 6.28
        puffs.add(s)
      }
    }
    city.add(puffs)
    // glints of light drifting about the city
    const GLINTS = 260
    const glintGeo = new THREE.BufferGeometry()
    const glintPos = new Float32Array(GLINTS * 3)
    const glintCol = new Float32Array(GLINTS * 3)
    const glintSeed = new Float32Array(GLINTS)
    {
      const r = rng(9)
      for (let i = 0; i < GLINTS; i++) {
        const a = r() * Math.PI * 2, rad = 20 + r() * 160
        glintPos.set([Math.sin(a) * rad, 10 + r() * 230, -4 + Math.cos(a) * rad * 0.8], i * 3)
        glintSeed[i] = r() * 100
      }
    }
    glintGeo.setAttribute('position', new THREE.BufferAttribute(glintPos, 3))
    glintGeo.setAttribute('color', new THREE.BufferAttribute(glintCol, 3))
    const glints = new THREE.Points(glintGeo, new THREE.PointsMaterial({ size: 2.4, map: glowTexture(), vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
    city.add(glints)
    city.scale.setScalar(1.25)
    scene.add(city)

    /* a stairway of light rising from the keep into the sky, angels going up and down it (Genesis 28:12) */
    const beamMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      uniforms: { uTime: { value: 0 }, uFade: { value: 0 } },
      vertexShader: `varying vec2 vUv; varying vec3 vN; varying vec3 vV;
        void main(){ vUv = uv; vec4 mv = modelViewMatrix * vec4(position,1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `uniform float uTime; uniform float uFade; varying vec2 vUv; varying vec3 vN; varying vec3 vV;
        void main(){
          float face = pow(abs(dot(normalize(vN), normalize(vV))), 2.5);
          float fall = smoothstep(0.0, 0.08, vUv.y) * (1.0 - smoothstep(0.55, 1.0, vUv.y));
          float shimmer = 0.75 + 0.25 * sin(vUv.y * 40.0 - uTime * 2.0 + vUv.x * 12.0);
          gl_FragColor = vec4(vec3(1.0, 0.86, 0.55) * 1.4, face * fall * shimmer * 0.32 * uFade);
        }`,
    })
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(34, 16, 1100, 40, 1, true), beamMat)
    beam.frustumCulled = false
    scene.add(beam)

    /* the heavenly host */
    const A = angelAssets(glowTexture())
    const mk = (kind: 'flyer' | 'hover' | 'trumpet', sc: number, seed: number) => {
      const a = new Angel(A, kind, seed)
      a.group.scale.setScalar(sc)
      a.group.visible = false
      scene.add(a.group)
      return a
    }
    // above the clouds: the host circling the city, trumpeters at the gate, angels on the stairway, and some passing close
    const host = Array.from({ length: 14 }, (_, i) => ({
      a: mk('flyer', 12 + (i % 3) * 2, 0.1 + i * 0.061),
      r: 170 + (i % 5) * 38,
      h: 60 + ((i * 53) % 270),
      w: (i % 2 ? -1 : 1) * (0.032 + (i % 4) * 0.006),
      a0: (i / 14) * Math.PI * 2,
    }))
    const trumpeters = [-1, 1].map((side, i) => ({ a: mk('trumpet', 13, 0.4 + i * 0.3), side }))
    const stair = Array.from({ length: 5 }, (_, i) => ({ a: mk('hover', 9, 0.15 + i * 0.17), x: i % 2 ? 11 : -11, dir: i % 2 ? -1 : 1, off: i * 85 }))
    const nearAbove = [
      { a: mk('flyer', 3.2, 0.92), z: -85, dy: 8, speed: 9, ph: 0.2, span: 140 },
      { a: mk('flyer', 4.0, 0.58), z: -140, dy: 34, speed: -8, ph: 0.65, span: 180 },
    ]
    const allAngels = [...host.map((h) => h.a), ...trumpeters.map((x) => x.a), ...stair.map((x) => x.a), ...nearAbove.map((f) => f.a)]

    /* chariots of fire: three circling the city, one passing close — only once the city is in sight */
    const fire = new FireSystem(16000)
    scene.add(fire.points)
    const cityChariots = [0.31, 0.57, 0.83].map((sd, i) => ({ c: new FireChariot(sd), r: 230 + i * 55, h: 50 + i * 80, w: (i % 2 ? -1 : 1) * (0.07 - i * 0.012), a0: i * 2.1 }))
    const nearChariot = new FireChariot(0.69)

    /* post: bloom for sunlight, gold and windows */
    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.3, 0.45, 1.5)
    composer.addPass(bloom)
    composer.addPass(new OutputPass())

    /* sizing + pointer parallax */
    const resize = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      renderer.setSize(w, h, false)
      renderer.domElement.style.width = '100%'
      renderer.domElement.style.height = '100%'
      composer.setPixelRatio(renderer.getPixelRatio())
      composer.setSize(w, h)
      bgRT.setSize(Math.max(2, Math.round(w * BG_SCALE)), Math.max(2, Math.round(h * BG_SCALE)))
      camera.aspect = w / h
      camera.fov = w < h ? 66 : 55
      camera.updateProjectionMatrix()
      fire.uPx.value = renderer.getDrawingBufferSize(new THREE.Vector2()).y / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2))
    }
    resize()
    window.addEventListener('resize', resize)
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
    const onMove = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2
    }
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return
      pointer.tx = Math.max(-1, Math.min(1, e.gamma / 30))
      pointer.ty = Math.max(-1, Math.min(1, (e.beta - 45) / 30))
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('deviceorientation', onTilt)

    /* loop */
    const timer = new THREE.Timer()
    let raf = 0
    let lastCaption = ''
    let pitch = 0
    const look = new THREE.Vector3()
    const tmp = new THREE.Color()
    const white = new THREE.Color(1, 0.94, 0.86)
    const sunDir = new THREE.Vector3()
    const cityPos = new THREE.Vector3()
    const up80 = new THREE.Vector3(0, 80, 0)
    const fillOff = new THREE.Vector3(-900, 1100, 1300)
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (document.hidden) return
      timer.update(now)
      const dt = Math.min(0.05, timer.getDelta())
      const t = reduce ? 0 : timer.getElapsed()
      const d = depth.get()
      const vel = reduce ? 0 : depth.getVelocity()
      const S = stageAt(d)

      // where we are in the journey
      const camY = 2.4 + d
      const top = Math.max(CLOUD_TOP, camY - 150)
      const base = top - CLOUD_THICK
      const inCloud = smooth(base - 80, base + 160, camY) * (1 - smooth(top - 160, top + 60, camY))
      const above = smooth(CLOUD_TOP + 10, CLOUD_TOP + 500, camY) // 0 below the deck, 1 once clear above it
      const approach = smooth(CLOUD_TOP, TOP, camY) // how near the city has come

      // camera: beside the boat at 0 m, rising; a slow drift and the pointer's parallax
      pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 2.5)
      pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 2.5)
      const k = Math.min(1, d / 40)
      camera.position.set(pointer.x * 2.4 + Math.sin(t * 0.13) * 1.2, camY - pointer.y * 0.9 + Math.sin(t * 0.37) * 0.25, 10 + 6 * k + Math.cos(t * 0.11) * 0.8)
      // look down at the boat, up toward the clouds while climbing, level in them, gently down to the city above
      const wantPitch = lerp(lerp(-0.09, 0.07, k) * (1 - inCloud), lerp(-0.1, -0.04, approach), above) + Math.max(-0.05, Math.min(0.05, vel * 0.00005))
      pitch += (wantPitch - pitch) * Math.min(1, dt * 2)
      look.set(camera.position.x * 0.4, camY + Math.tan(pitch) * 100, camera.position.z - 100)
      camera.lookAt(look)
      camera.rotateZ(Math.sin(t * 0.21) * 0.008)
      camera.updateMatrixWorld()

      // sun + sky + clouds
      sunDir.set(Math.sin(SUN_AZ) * Math.cos(S.sunEl), Math.sin(S.sunEl), -Math.cos(SUN_AZ) * Math.cos(S.sunEl)).normalize()
      bgU.uTime.value = t
      bgU.uInvProj.value.copy(camera.projectionMatrixInverse)
      bgU.uCamWorld.value.copy(camera.matrixWorld)
      bgU.uCamPos.value.copy(camera.position)
      bgU.uHorizon.value.setRGB(...S.horizon, THREE.SRGBColorSpace)
      bgU.uMid.value.setRGB(...S.mid, THREE.SRGBColorSpace)
      bgU.uZenith.value.setRGB(...S.zenith, THREE.SRGBColorSpace)
      bgU.uSunDir.value.copy(sunDir)
      bgU.uSunCol.value.setRGB(...S.sunCol, THREE.SRGBColorSpace)
      bgU.uSunI.value = S.sunI
      bgU.uBase.value = base
      bgU.uTop.value = top
      bgU.uCover.value = lerp(S.cover, 0.7, above) // a closed sea of cloud once you are above it
      bgU.uRainbow.value = S.rainbow * (0.55 + 0.45 * inCloud)
      bgU.uGod.value = S.god
      bgU.uAbove.value = camY > top ? 1 : 0

      fog.color.setRGB(...S.horizon, THREE.SRGBColorSpace).lerp(white, inCloud * 0.8)
      // thick haze as you break through, clearing as you climb: the city emerges out of the light;
      // inside the cloud a white mist that figures appear out of
      fog.density = (camY > CLOUD_TOP ? lerp(0.0016, 0.00012, smooth(CLOUD_TOP, CLOUD_TOP + 2200, camY)) : 0.0005) + inCloud * 0.009

      // lights follow the sun; the city casts its own shadows
      hemi.color.setRGB(...S.mid, THREE.SRGBColorSpace)
      hemi.groundColor.copy(tmp.setRGB(0.12, 0.1, 0.12).lerp(white, smooth(1000, 2600, d)))
      hemi.intensity = lerp(0.9, 0.85, smooth(0, 2600, d))
      sun.color.setRGB(...S.sunCol, THREE.SRGBColorSpace)
      sun.intensity = 1.6 * S.sunI
      scene.environmentIntensity = lerp(0.12, 1, smooth(200, 2700, d))
      renderer.toneMappingExposure = lerp(1.0, 0.78, smooth(300, 2400, d)) - inCloud * 0.08
      bloom.strength = lerp(0.28, 0.4, above)

      // the ground falls away below the deck
      const ground = 1 - smooth(150, 600, d)
      hills.visible = ground > 0
      hillMats.forEach((m) => (m.opacity = ground))
      waterU.uTime.value = t
      waterU.uFade.value = 1 - smooth(120, 700, d)
      water.visible = d < 720
      boat.visible = d < 260
      boat.position.y = 0.2 + Math.sin(t * 1.1) * 0.1
      boat.position.x = Math.min(6.2, 6.5 * camera.aspect)
      boat.rotation.z = Math.sin(t * 0.9) * 0.04
      boat.rotation.x = Math.sin(t * 0.7) * 0.03

      // the city: far off and hazed when you first rise above the deck, drawing nearer the higher you climb
      city.visible = camY > CLOUD_TOP + 5
      if (city.visible) {
        const dist = lerp(2600, 385, Math.pow(approach, 0.85))
        cityPos.set(0, top - 22, camera.position.z - dist)
        city.position.copy(cityPos)
        city.rotation.y = Math.sin(t * 0.02) * 0.04
        sun.position.copy(cityPos).addScaledVector(sunDir, 1400)
        sun.target.position.copy(cityPos).add(up80)
        fill.castShadow = true
        fill.position.copy(cityPos).add(fillOff)
        fill.target.position.copy(cityPos).add(up80)
        fill.intensity = 2.6
        sun.intensity = 1.1 * S.sunI
        flagTime.value = t
        gateLight.intensity = 380 + Math.sin(t * 1.3) * 40
        for (const s of puffs.children) {
          const b = s.userData.base as THREE.Vector3
          s.position.set(b.x + Math.sin(t * 0.05 + s.userData.ph) * 6, b.y + Math.sin(t * 0.11 + s.userData.ph) * 1.5, b.z)
        }
        const gc = glintGeo.attributes.color as THREE.BufferAttribute
        for (let i = 0; i < GLINTS; i++) {
          const tw = Math.max(0, Math.sin(t * 1.6 + glintSeed[i])) ** 3
          gc.setXYZ(i, 1.6 * tw, 1.25 * tw, 0.6 * tw)
        }
        gc.needsUpdate = true
      } else {
        fill.castShadow = false
        sun.position.copy(camera.position).addScaledVector(sunDir, 500)
        sun.target.position.copy(camera.position)
        fill.intensity = 0
      }

      // birds: each flock fades in and out at the edges of its band; inside the cloud there are none
      birdTime.value = t
      let bk = 0
      for (const f of flocks) {
        const env = smooth(f.from - 1, f.from + 120, d) * (1 - smooth(f.to - 150, f.to, d)) * (f.aroundCity ? (city.visible ? 1 : 0) : 1 - inCloud)
        for (let i = 0; i < f.count; i++, bk++) {
          // (never scale an instance to ~0: its lighting normal would turn to NaN, which bloom smears across the screen)
          if (env <= 0.12) {
            dummy.position.set(0, -99999, 0)
            dummy.scale.setScalar(1)
            dummy.updateMatrix()
            birds.setMatrixAt(bk, dummy.matrix)
            continue
          }
          const o = birdOffsets[bk]
          const a = t * f.speed + f.phase + o[3] * (f.count > 1 ? 1.1 : 0)
          const rr = f.r + o[0] * f.r * 0.35
          let x: number, y: number, z: number
          if (f.aroundCity) {
            x = cityPos.x + Math.cos(a) * rr * 1.25
            z = cityPos.z + Math.sin(a) * rr * 0.8
            y = cityPos.y + 90 + o[1] * 120 + Math.sin(t * 0.6 + o[3] * 10) * 4
          } else {
            x = Math.cos(a) * rr
            z = Math.sin(a) * rr * 0.55 - 24
            y = Math.max(1.5, camY + f.dy + o[1] * 5 + Math.sin(t * 0.7 + o[3] * 10) * 0.8)
          }
          dummy.position.set(x, y, z)
          const dir = f.speed > 0 ? 1 : -1
          dummy.rotation.set(dir * 0.28, -a - (Math.PI / 2) * dir, Math.sin(t * 0.9 + o[2] * 5) * 0.05)
          dummy.scale.setScalar(f.size * (0.82 + o[3] * 0.4) * env)
          dummy.rotation.z += (1 - env) * 0.6 // fading birds bank away as they shrink
          dummy.updateMatrix()
          birds.setMatrixAt(bk, dummy.matrix)
        }
      }
      birds.instanceMatrix.needsUpdate = true

      // ---- the heavenly host ----
      A.time.value = t
      for (const a of allAngels) a.group.visible = false
      if (city.visible) {
        const S1 = 1.25
        for (const h of host) {
          const ang = h.a0 + t * h.w
          const dirx = -Math.sin(ang) * Math.sign(h.w), dirz = Math.cos(ang) * 0.75 * Math.sign(h.w)
          h.a.group.visible = true
          h.a.group.position.set(cityPos.x + Math.cos(ang) * h.r * 1.2, cityPos.y + h.h * S1 + Math.sin(t * 0.5 + h.a0 * 3) * 6, cityPos.z + Math.sin(ang) * h.r * 0.75)
          h.a.pose(t, 1.1, Math.atan2(dirx, dirz), 0.8, -0.22 * Math.sign(h.w))
        }
        for (const tr of trumpeters) {
          tr.a.group.visible = true
          tr.a.group.position.set(cityPos.x + tr.side * 62 * S1, cityPos.y + 46 * S1 + Math.sin(t * 0.7 + tr.side) * 2, cityPos.z + 112 * S1)
          tr.a.pose(t, 0.06, -tr.side * 0.3, 0.42)
        }
        for (const st of stair) {
          const y = (((st.off + t * 10 * st.dir) % 520) + 520) % 520
          st.a.group.visible = true
          st.a.group.position.set(cityPos.x + st.x * S1, cityPos.y + (300 + y) * S1, cityPos.z - 4 * S1 + 6)
          st.a.pose(t, 0.18, 0.2 * st.dir, 0.6)
        }
        for (const f of nearAbove) {
          f.a.group.visible = true
          f.a.group.position.set(lane(t, f.speed, f.ph, f.span), camY + f.dy + Math.sin(t * 0.4 + f.ph * 9) * 3, f.z)
          f.a.pose(t, 1.12, f.speed > 0 ? Math.PI / 2 : -Math.PI / 2, 0.85, Math.sin(t * 0.3 + f.ph * 7) * 0.12)
        }
        beam.visible = true
        beam.position.set(cityPos.x, cityPos.y + (242 * S1) + 550, cityPos.z - 4 * S1)
        beamMat.uniforms.uTime.value = t
        beamMat.uniforms.uFade.value = smooth(CLOUD_TOP + 300, CLOUD_TOP + 2000, camY)
      } else beam.visible = false

      // ---- chariots of fire ----
      fire.begin()
      if (city.visible) {
        const cA = smooth(CLOUD_TOP + 100, CLOUD_TOP + 900, camY)
        for (const cc of cityChariots) {
          const ang = cc.a0 + t * cc.w
          const sg = Math.sign(cc.w)
          const dx = -Math.sin(ang) * 1.2 * sg, dz = Math.cos(ang) * 0.75 * sg
          cc.c.update(fire, t, dt, cityPos.x + Math.cos(ang) * cc.r * 1.2, cityPos.y + cc.h, cityPos.z + Math.sin(ang) * cc.r * 0.75, Math.atan2(-dz, dx), 11, cA, Math.abs(cc.w) * cc.r)
        }
        const x = lane(t, -34, 0.6, 520)
        nearChariot.update(fire, t, dt, x, camY + 36 + Math.sin(t * 0.45) * 4, camera.position.z - 165, Math.PI, 4.2, cA, 34)
      }
      fire.end()
      setMusicAltitude(d)

      // keep ivory text readable as the sky brightens (strongest inside the white of the cloud)
      const lum = (S.mid[0] * 0.3 + S.mid[1] * 0.59 + S.mid[2] * 0.11) * (1 - inCloud) + inCloud
      const bright = Math.max(0, Math.min(1, (lum - 0.45) / 0.4))
      if (scrim.current) scrim.current.style.opacity = String(bright)
      if (vig.current) vig.current.style.opacity = String(1 - bright * 0.85)

      // altitude captions (DOM, no React re-render)
      if (caption.current) {
        let best: [number, string] | null = null
        for (const m of MARKERS) if (Math.abs(m[0] - d) < 140 && (!best || Math.abs(m[0] - d) < Math.abs(best[0] - d))) best = m
        const text = showCaptions.current && best && Math.abs(vel) < 400 ? best[1] : ''
        if (text !== lastCaption) {
          lastCaption = text
          caption.current.style.opacity = '0'
          window.setTimeout(() => {
            if (!caption.current) return
            caption.current.textContent = text
            caption.current.style.opacity = text ? '1' : '0'
          }, 350)
        }
      }

      // background first (low-res), then the scene with bloom
      renderer.setRenderTarget(bgRT)
      renderer.render(bgScene, bgCam)
      renderer.setRenderTarget(null)
      composer.render(dt)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('deviceorientation', onTilt)
      for (const s of [scene, bgScene, envScene])
        s.traverse((o) => {
          const m = o as THREE.Mesh
          m.geometry?.dispose?.()
          const mat = m.material as THREE.Material | THREE.Material[] | undefined
          if (Array.isArray(mat)) mat.forEach((x) => x.dispose())
          else mat?.dispose?.()
        })
      noiseTex.dispose()
      bgRT.dispose()
      envTex.dispose()
      pmrem.dispose()
      composer.dispose()
      renderer.dispose()
      el.removeChild(renderer.domElement)
    }
  }, [depth])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#0a1424]">
      <div ref={mount} className="absolute inset-0" />
      <div ref={vig} className="absolute inset-0" style={{ background: 'radial-gradient(120% 90% at 50% 40%, transparent 55%, rgba(6,6,16,0.55) 100%)' }} />
      {/* in the bright heights: a warm shade behind the reading area so ivory text stays legible, the light left at the edges */}
      <div
        ref={scrim}
        className="absolute inset-0"
        style={{
          opacity: 0,
          background:
            'radial-gradient(50% 32% at 50% 50%, rgba(14,18,36,0.36), rgba(14,18,36,0.14) 60%, rgba(14,18,36,0) 100%), linear-gradient(180deg, rgba(14,18,36,0.2), rgba(14,18,36,0) 14%, rgba(14,18,36,0) 82%, rgba(14,18,36,0.24))',
        }}
      />
      <div
        ref={caption}
        className="absolute left-1/2 top-[calc(env(safe-area-inset-top)+5.5rem)] w-[min(92vw,640px)] -translate-x-1/2 text-center font-serif text-[13px] italic text-ivory/85 transition-opacity duration-700 sm:top-28 sm:text-[15px]"
        style={{ opacity: 0, textShadow: '0 1px 3px rgba(40,24,8,0.8), 0 2px 14px rgba(40,24,8,0.6)' }}
      />
    </div>
  )
}
