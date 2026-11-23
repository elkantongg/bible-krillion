import * as THREE from 'three'

/**
 * "A chariot of fire, and horses of fire" (2 Kings 2:11).
 *
 * The horses are not meshes: each is a cloud of ~500 flame particles riding a galloping skeleton
 * (torso, neck, head, tail and two-jointed legs in a rotary gallop). Particles near each bone burn
 * white-gold, the outer ones orange to red, and some lick upward and flicker. The chariot — car,
 * guard, pole and two spinning spoked wheels — is drawn the same way, and embers stream from the
 * manes, tails and wheel rims. Everything shares one additive point cloud, so bloom makes it glow.
 */

const VERT = /* glsl */ `
attribute float aSize; attribute vec4 aColor; uniform float uPx; varying vec4 vColor;
void main(){
  vColor = aColor;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  // distant flames stay full-bodied: a floor so they merge into one fiery form
  gl_PointSize = clamp(aSize * uPx * 1.15 / max(-mv.z, 0.1), 2.0, 110.0);
  gl_Position = projectionMatrix * mv;
}`
const FRAG = /* glsl */ `
varying vec4 vColor;
void main(){
  float d = length(gl_PointCoord - 0.5) * 2.0;
  if (d > 1.0) discard;
  float a = pow(1.0 - d, 1.4);
  gl_FragColor = vec4(vColor.rgb * (0.55 + 0.9 * (1.0 - d)), a * vColor.a);
}`

export class FireSystem {
  readonly points: THREE.Points
  readonly uPx = { value: 400 }
  private pos: Float32Array
  private col: Float32Array
  private size: Float32Array
  private n = 0
  constructor(private max = 16000) {
    const g = new THREE.BufferGeometry()
    this.pos = new Float32Array(max * 3)
    this.col = new Float32Array(max * 4)
    this.size = new Float32Array(max)
    g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage))
    g.setAttribute('aColor', new THREE.BufferAttribute(this.col, 4).setUsage(THREE.DynamicDrawUsage))
    g.setAttribute('aSize', new THREE.BufferAttribute(this.size, 1).setUsage(THREE.DynamicDrawUsage))
    this.points = new THREE.Points(
      g,
      // normal blending keeps the flame orange against bright cloud; HDR colours still bloom
      new THREE.ShaderMaterial({ uniforms: { uPx: this.uPx }, vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false, blending: THREE.NormalBlending }),
    )
    this.points.frustumCulled = false
  }
  begin() {
    this.n = 0
  }
  add(x: number, y: number, z: number, r: number, g: number, b: number, a: number, s: number) {
    if (this.n >= this.max || a <= 0.004) return
    const i = this.n++
    this.pos[i * 3] = x
    this.pos[i * 3 + 1] = y
    this.pos[i * 3 + 2] = z
    this.col[i * 4] = r
    this.col[i * 4 + 1] = g
    this.col[i * 4 + 2] = b
    this.col[i * 4 + 3] = a
    this.size[i] = s
  }
  end() {
    const g = this.points.geometry
    g.setDrawRange(0, this.n)
    for (const k of ['position', 'aColor', 'aSize']) (g.attributes[k] as THREE.BufferAttribute).needsUpdate = true
  }
}

/* ---------------- the galloping skeleton ---------------- */

const SEGS = 12
/** fill `o` with SEGS segments [ax,ay,az,bx,by,bz,ra,rb] for gallop phase `ph`, horse facing +x, hooves at y≈0 */
function horsePose(ph: number, o: Float32Array) {
  const bob = Math.sin(ph * 2) * 0.07
  const nod = Math.sin(ph * 2 + 0.6) * 0.06
  let k = 0
  const seg = (ax: number, ay: number, az: number, bx: number, by: number, bz: number, ra: number, rb: number) => {
    o.set([ax, ay, az, bx, by, bz, ra, rb], k * 8)
    k++
  }
  seg(-0.74, 1.34 + bob, 0, 0.62, 1.4 + bob, 0, 0.35, 0.4) // barrel
  seg(0.52, 1.56 + bob, 0, 0.98, 2.06 + bob + nod, 0, 0.25, 0.15) // neck
  seg(0.98, 2.08 + bob + nod, 0, 1.4, 1.74 + bob + nod * 1.5, 0, 0.15, 0.09) // head
  seg(-0.86, 1.52 + bob, 0, -1.5, 1.2 + bob + Math.sin(ph * 1.3) * 0.12, Math.sin(ph * 0.7) * 0.1, 0.09, 0.03) // tail
  // a rotary gallop: hind pair, then fore pair
  const legs: [number, number, number, number][] = [
    [0.48, 1.12, 0.17, 0.5], [0.48, 1.12, -0.17, 0.62], [-0.56, 1.14, 0.17, 0.0], [-0.56, 1.14, -0.17, 0.12],
  ]
  for (const [lx, ly, lz, off] of legs) {
    const phi = ph + off * Math.PI * 2
    const fore = lx > 0
    const up = fore ? 0.12 + 0.62 * Math.sin(phi) : -0.08 + 0.55 * Math.sin(phi)
    const lo = fore ? up - 1.15 * Math.max(0, Math.sin(phi + 1.3)) : up + 0.95 * Math.max(0, Math.sin(phi + 1.0))
    const l1 = fore ? 0.55 : 0.5, l2 = fore ? 0.6 : 0.62
    const ky = ly + bob - Math.cos(up) * l1, kx = lx + Math.sin(up) * l1
    seg(lx, ly + bob, lz, kx, ky, lz, 0.1, 0.07)
    seg(kx, ky, lz, kx + Math.sin(lo) * l2, ky - Math.cos(lo) * l2, lz, 0.065, 0.05)
  }
}

interface P { seg: number; t: number; ox: number; oy: number; oz: number; seed: number; core: number }
function ball(r: () => number) {
  for (;;) {
    const x = r() * 2 - 1, y = r() * 2 - 1, z = r() * 2 - 1
    if (x * x + y * y + z * z <= 1) return [x, y, z]
  }
}
function horseParticles(r: () => number): P[] {
  const out: P[] = []
  const per = [380, 120, 70, 70, 34, 34, 34, 34, 30, 30, 30, 30]
  per.forEach((n, seg) => {
    for (let i = 0; i < n; i++) {
      const [ox, oy, oz] = ball(r)
      out.push({ seg, t: r(), ox, oy, oz, seed: r(), core: Math.hypot(ox, oy, oz) })
    }
  })
  return out
}

/** flame colour from heat (1 white-gold core … 0 dark red edge), HDR for bloom */
function flame(heat: number, out: number[]) {
  const h = Math.max(0, Math.min(1, heat))
  out[0] = 1.5 + h * 2.0
  out[1] = 0.16 + h * h * 1.45
  out[2] = 0.015 + h * h * h * 0.45
}

interface Ember { x: number; y: number; z: number; vx: number; vy: number; vz: number; life: number; max: number }

export class FireChariot {
  private horse: P[]
  private car: { x: number; y: number; z: number; seed: number }[] = []
  private wheel: { a: number; r: number; z: number; seed: number }[] = []
  private segs = [new Float32Array(SEGS * 8), new Float32Array(SEGS * 8)]
  private embers: Ember[] = []
  private head = 0
  private spawnAcc = 0
  private seedPh: number
  private c = [0, 0, 0]
  private bodies: FireBodies | null = null
  private slot = 0

  constructor(seed: number) {
    let x = Math.floor(seed * 1e6) + 1
    const r = () => (x = (x * 16807) % 2147483647) / 2147483647
    this.seedPh = r() * 10
    this.horse = horseParticles(r)
    // the car: a curved front guard, floor and low sides
    for (let i = 0; i < 170; i++) {
      const u = r(), v = r()
      if (i < 80) {
        const a = -Math.PI / 2 + u * Math.PI
        this.car.push({ x: 0.15 + Math.cos(a) * 0.55, y: 0.78 + v * 0.75, z: Math.sin(a) * 0.62, seed: r() })
      } else if (i < 120) this.car.push({ x: -0.45 + u * 0.7, y: 0.78, z: (v - 0.5) * 1.2, seed: r() })
      else this.car.push({ x: -0.45 + u * 0.6, y: 0.78 + v * 0.45, z: i % 2 ? 0.62 : -0.62, seed: r() })
    }
    for (let i = 0; i < 30; i++) this.car.push({ x: 0.7 + (i / 30) * 1.8, y: 0.95 + (i / 30) * 0.35, z: 0, seed: r() })
    for (const z of [0.86, -0.86]) {
      for (let i = 0; i < 64; i++) this.wheel.push({ a: (i / 64) * Math.PI * 2, r: 0.72, z, seed: r() })
      for (let s = 0; s < 8; s++) for (let j = 1; j <= 6; j++) this.wheel.push({ a: (s / 8) * Math.PI * 2, r: (j / 7) * 0.72, z, seed: r() })
    }
    for (let i = 0; i < 260; i++) this.embers.push({ x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, life: 0, max: 1 })
  }

  /** @internal used by FireBodies to lay out this chariot's static particles */
  layout() {
    return { horse: this.horse, car: this.car, wheel: this.wheel }
  }
  /** @internal */
  bind(bodies: FireBodies, slot: number) {
    this.bodies = bodies
    this.slot = slot
  }

  /** draw into `fire`. The rig faces +x locally; `yaw` turns it (atan2(-dz, dx) of the heading); `alpha` fades it */
  update(fire: FireSystem, t: number, dt: number, px: number, py: number, pz: number, yaw: number, S: number, alpha: number, speed: number) {
    if (alpha <= 0.01) return
    const cy = Math.cos(yaw), sy = Math.sin(yaw)
    const W = (x: number, y: number, z: number, o: number[]) => {
      o[0] = px + S * (x * cy + z * sy)
      o[1] = py + S * y
      o[2] = pz + S * (-x * sy + z * cy)
    }
    const w = [0, 0, 0]
    const c = this.c
    const ph = t * 8.5 + this.seedPh

    // two horses abreast, ahead of the car; the car, pole and wheels — drawn on the GPU by FireBodies
    // (the same per-particle maths, run in its vertex shader); only the skeleton is posed here
    for (let hi = 0; hi < 2; hi++) horsePose(ph + hi * 0.9, this.segs[hi])
    const spin = -t * (speed / (0.72 * S)) * 0.9
    this.bodies?.set(this.slot, px, py, pz, S, cy, sy, alpha, spin, this.segs)

    // embers streaming behind from manes, tails and rims
    this.spawnAcc += dt * 240
    while (this.spawnAcc > 1) {
      this.spawnAcc--
      const e = this.embers[this.head]
      this.head = (this.head + 1) % this.embers.length
      const which = Math.random()
      let lx: number, ly: number, lz: number
      if (which < 0.35) {
        const sg = this.segs[which < 0.17 ? 0 : 1]
        const u = Math.random()
        lx = 3.15 + sg[8] + (sg[11] - sg[8]) * u
        ly = sg[9] + (sg[12] - sg[9]) * u + 0.2
        lz = which < 0.17 ? 0.56 : -0.56
      } else if (which < 0.6) {
        const sg = this.segs[which < 0.48 ? 0 : 1]
        lx = 3.15 + sg[27]
        ly = sg[28]
        lz = which < 0.48 ? 0.56 : -0.56
      } else {
        const a = Math.random() * Math.PI * 2
        lx = -0.1 + Math.cos(a) * 0.72
        ly = 0.72 + Math.sin(a) * 0.72
        lz = Math.random() < 0.5 ? 0.86 : -0.86
      }
      W(lx, ly, lz, w)
      e.x = w[0]; e.y = w[1]; e.z = w[2]
      const back = speed * (0.15 + Math.random() * 0.2)
      e.vx = -cy * back + (Math.random() - 0.5) * S * 0.6
      e.vy = S * (0.5 + Math.random() * 0.9)
      e.vz = sy * back + (Math.random() - 0.5) * S * 0.6
      e.max = 0.5 + Math.random() * 0.9
      e.life = e.max
    }
    for (const e of this.embers) {
      if (e.life <= 0) continue
      e.life -= dt
      e.x += e.vx * dt
      e.y += e.vy * dt
      e.z += e.vz * dt
      e.vy *= 0.985
      const k = Math.max(0, e.life / e.max)
      flame(k * 0.9, c)
      fire.add(e.x, e.y, e.z, c[0], c[1], c[2], alpha * k * 0.7, S * 0.14 * (0.4 + k))
    }
  }
}

/* ---------------- the flame bodies, on the GPU ---------------- */

const BODY_VERT = /* glsl */ `
uniform sampler2D uSegs; uniform vec4 uP[NC]; uniform vec4 uQ[NC]; uniform float uTime; uniform float uPx;
attribute vec4 aInfo; attribute vec4 aA; attribute vec2 aB;
varying vec4 vColor;
vec3 flame(float heat){ float h = clamp(heat, 0.0, 1.0); return vec3(1.5 + h * 2.0, 0.16 + h * h * 1.45, 0.015 + h * h * h * 0.45); }
void main(){
  int ci = int(aInfo.y + 0.5);
  vec4 P = uP[ci]; vec4 Q = uQ[ci];
  float S = P.w, seed = aB.x, alpha, size, heat;
  vec3 l;
  int kind = int(aInfo.x + 0.5);
  if (kind == 0) {
    // a horse particle riding its bone
    int row = ci * 2 + int(aInfo.z + 0.5), seg = int(aInfo.w + 0.5);
    vec4 sa = texelFetch(uSegs, ivec2(seg * 2, row), 0), sb = texelFetch(uSegs, ivec2(seg * 2 + 1, row), 0);
    float t = aA.x, core = aB.y;
    float ra = sa.w + (sb.w - sa.w) * t;
    float x = sa.x + (sb.x - sa.x) * t + aA.y * ra;
    float y = sa.y + (sb.y - sa.y) * t + aA.z * ra;
    float z = sa.z + (sb.z - sa.z) * t + aA.w * ra * 0.85;
    float lick = seed < 0.45 ? fract(uTime * (1.4 + seed) + seed * 7.0) : 0.0;
    y += lick * 0.42 * (0.4 + core);
    x -= lick * 0.25;
    float fl = 0.7 + 0.3 * sin(uTime * 13.0 + seed * 50.0);
    heat = (1.0 - core) * 0.85 + 0.15 - lick * 0.6;
    l = vec3(3.15 + x * 0.95, y * 0.95, (aInfo.z > 0.5 ? -0.56 : 0.56) + z * 0.95);
    alpha = Q.z * (0.78 - lick * 0.5) * fl;
    size = S * (0.2 - lick * 0.08) * (0.8 + seed * 0.5);
  } else if (kind == 1) {
    // the car and pole
    float lick = fract(uTime * 1.6 + seed * 9.0);
    heat = 0.55 - lick * 0.5 + seed * 0.3;
    l = vec3(aA.x - lick * 0.2, aA.y + lick * 0.3, aA.z);
    alpha = Q.z * 0.5 * (1.0 - lick * 0.6);
    size = S * 0.17;
  } else {
    // spinning wheels
    float a = aA.x + Q.w, r = aA.y;
    bool rim = r > 0.7;
    heat = rim ? 0.8 : 0.5;
    l = vec3(-0.1 + cos(a) * r, 0.72 + sin(a) * r, aA.z);
    alpha = Q.z * (rim ? 0.7 : 0.45);
    size = S * (rim ? 0.16 : 0.11);
  }
  vec3 w = vec3(P.x + S * (l.x * Q.x + l.z * Q.y), P.y + S * l.y, P.z + S * (-l.x * Q.y + l.z * Q.x));
  vColor = vec4(flame(heat), alpha);
  vec4 mv = modelViewMatrix * vec4(w, 1.0);
  gl_PointSize = clamp(size * uPx * 1.15 / max(-mv.z, 0.1), 2.0, 110.0);
  gl_Position = projectionMatrix * mv;
  // a chariot not drawn this frame, or a flame too faint to see
  if (Q.z <= 0.01 || alpha <= 0.004) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 0.0; }
}`

/**
 * The horses, car and wheels of every chariot as one static point cloud whose motion is computed
 * in the vertex shader — the same maths FireChariot used to run per particle on the CPU each frame.
 * Per frame only the skeletons (12 bones × 2 horses) and each chariot's placement are uploaded.
 * Embers (randomly spawned, simulated) stay on the CPU in FireSystem.
 */
export class FireBodies {
  readonly points: THREE.Points
  private segTex: THREE.DataTexture
  private segData: Float32Array
  private uP: THREE.Vector4[]
  private uQ: THREE.Vector4[]
  readonly uTime = { value: 0 }

  constructor(chariots: FireChariot[], uPx: { value: number }) {
    const NC = chariots.length
    const info: number[] = [], A: number[] = [], B: number[] = []
    chariots.forEach((ch, ci) => {
      ch.bind(this, ci)
      const { horse, car, wheel } = ch.layout()
      for (let hi = 0; hi < 2; hi++)
        for (const p of horse) {
          info.push(0, ci, hi, p.seg)
          A.push(p.t, p.ox, p.oy, p.oz)
          B.push(p.seed, p.core)
        }
      for (const q of car) {
        info.push(1, ci, 0, 0)
        A.push(q.x, q.y, q.z, 0)
        B.push(q.seed, 0)
      }
      for (const q of wheel) {
        info.push(2, ci, 0, 0)
        A.push(q.a, q.r, q.z, 0)
        B.push(q.seed, 0)
      }
    })
    const n = info.length / 4
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3))
    g.setAttribute('aInfo', new THREE.BufferAttribute(new Float32Array(info), 4))
    g.setAttribute('aA', new THREE.BufferAttribute(new Float32Array(A), 4))
    g.setAttribute('aB', new THREE.BufferAttribute(new Float32Array(B), 2))
    // per horse: 12 bones as two texels each (a.xyz + radius, b.xyz + radius)
    this.segData = new Float32Array(SEGS * 2 * NC * 2 * 4)
    this.segTex = new THREE.DataTexture(this.segData, SEGS * 2, NC * 2, THREE.RGBAFormat, THREE.FloatType)
    this.segTex.minFilter = this.segTex.magFilter = THREE.NearestFilter
    this.segTex.needsUpdate = true
    this.uP = Array.from({ length: NC }, () => new THREE.Vector4())
    this.uQ = Array.from({ length: NC }, () => new THREE.Vector4())
    this.points = new THREE.Points(
      g,
      new THREE.ShaderMaterial({
        defines: { NC },
        uniforms: { uSegs: { value: this.segTex }, uP: { value: this.uP }, uQ: { value: this.uQ }, uTime: this.uTime, uPx },
        vertexShader: BODY_VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending,
      }),
    )
    this.points.frustumCulled = false
  }

  /** start of frame: every chariot hidden until its update() places it */
  begin(t: number) {
    this.uTime.value = t
    for (const q of this.uQ) q.z = 0
  }

  /** @internal called by FireChariot.update */
  set(slot: number, px: number, py: number, pz: number, S: number, cy: number, sy: number, alpha: number, spin: number, segs: Float32Array[]) {
    this.uP[slot].set(px, py, pz, S)
    this.uQ[slot].set(cy, sy, alpha, spin)
    for (let hi = 0; hi < 2; hi++) {
      const sg = segs[hi]
      const row = (slot * 2 + hi) * SEGS * 2 * 4
      for (let k = 0; k < SEGS; k++) {
        const o = k * 8, d = row + k * 8
        this.segData[d] = sg[o]; this.segData[d + 1] = sg[o + 1]; this.segData[d + 2] = sg[o + 2]; this.segData[d + 3] = sg[o + 6]
        this.segData[d + 4] = sg[o + 3]; this.segData[d + 5] = sg[o + 4]; this.segData[d + 6] = sg[o + 5]; this.segData[d + 7] = sg[o + 7]
      }
    }
  }

  end() {
    this.points.visible = this.uQ.some((q) => q.z > 0.01)
    if (this.points.visible) this.segTex.needsUpdate = true
  }

  dispose() {
    this.segTex.dispose()
  }
}
