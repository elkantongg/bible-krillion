import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

/**
 * Angels: robed figures of light with great feathered wings.
 *
 * Each wing is a three-joint arm (shoulder → elbow → wrist) carrying real rows of feathers —
 * coverts, secondaries and a fan of long primaries — so a beat ripples outward from the body
 * with a lag at each joint. The robe flows in the vertex shader. Built upright, facing +z;
 * `pose()` pitches the body forward into flight and turns it toward its heading.
 */

/** one feather: a cambered, pointed vane along +y */
function feather(len: number, width: number) {
  const s = new THREE.Shape()
  s.moveTo(0, 0)
  s.bezierCurveTo(width * 0.62, len * 0.16, width * 0.6, len * 0.72, width * 0.08, len)
  s.quadraticCurveTo(0, len * 1.02, -width * 0.06, len * 0.97)
  s.bezierCurveTo(-width * 0.48, len * 0.7, -width * 0.42, len * 0.18, 0, 0)
  const g = new THREE.ShapeGeometry(s, 10)
  const p = g.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i) / len
    p.setZ(i, Math.sin(y * Math.PI) * width * 0.22 + y * y * len * 0.06)
  }
  g.computeVertexNormals()
  return g
}

function put(g: THREE.BufferGeometry, x: number, y: number, z: number, rz: number, ry = 0) {
  g.applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(0, ry, rz, 'YXZ')))
  g.translate(x, y, z)
  return g
}

/** the feathers carried by each wing bone, built once and shared by every angel */
function wingGeometries() {
  // arm (shoulder → elbow, 0.55 long): tertials hanging behind, a row of coverts over them
  const arm: THREE.BufferGeometry[] = []
  for (let i = 0; i < 6; i++) {
    const x = 0.04 + i * 0.09
    arm.push(put(feather(1.05 - i * 0.02, 0.2), x, 0.02, -0.02 - i * 0.004, Math.PI - 0.05))
    arm.push(put(feather(0.5, 0.17), x + 0.03, 0.06, 0.03, Math.PI + 0.05))
  }
  // forearm (elbow → wrist, 0.75 long): secondaries fanning slightly outward, coverts over them
  const fore: THREE.BufferGeometry[] = []
  for (let i = 0; i < 10; i++) {
    const x = 0.03 + i * 0.075
    fore.push(put(feather(1.0 - i * 0.012, 0.19), x, 0.0, -0.03 - i * 0.003, Math.PI + i * 0.018))
    fore.push(put(feather(0.46, 0.16), x + 0.02, 0.05, 0.03 + (i % 2) * 0.005, Math.PI + 0.08 + i * 0.012))
  }
  for (let i = 0; i < 12; i++) fore.push(put(feather(0.22, 0.12), 0.02 + i * 0.064, 0.07, 0.05, Math.PI + 0.25))
  // hand (wrist → tip, 0.6 long): ten primaries spreading from downward to outward
  const hand: THREE.BufferGeometry[] = []
  for (let i = 0; i < 10; i++) {
    const k = i / 9
    hand.push(put(feather(1.1 + k * 0.55, 0.17 - k * 0.025), 0.05 + k * 0.52, 0.0, -0.03 - i * 0.006, Math.PI + 0.25 + k * 1.05))
    if (i < 7) hand.push(put(feather(0.4, 0.14), 0.05 + k * 0.45, 0.05, 0.03, Math.PI + 0.45 + k * 0.9))
  }
  // a smooth leading edge along each bone
  const edge = (len: number, r0: number, r1: number) => {
    const g = new THREE.CylinderGeometry(r1, r0, len, 10)
    g.rotateZ(-Math.PI / 2)
    g.translate(len / 2, 0.04, 0)
    return g
  }
  arm.push(edge(0.58, 0.06, 0.045))
  fore.push(edge(0.78, 0.045, 0.03))
  hand.push(edge(0.62, 0.03, 0.012))
  const strip = (gs: THREE.BufferGeometry[]) =>
    mergeGeometries(
      gs.map((g) => {
        const n = g.index ? g.toNonIndexed() : g
        for (const k of Object.keys(n.attributes)) if (k !== 'position' && k !== 'normal') n.deleteAttribute(k)
        return n
      }),
    )
  return { arm: strip(arm), fore: strip(fore), hand: strip(hand) }
}

export interface AngelAssets {
  wing: { arm: THREE.BufferGeometry; fore: THREE.BufferGeometry; hand: THREE.BufferGeometry }
  robe: THREE.BufferGeometry
  sleeve: THREE.BufferGeometry
  head: THREE.BufferGeometry
  hair: THREE.BufferGeometry
  hand: THREE.BufferGeometry
  halo: THREE.BufferGeometry
  belt: THREE.BufferGeometry
  trumpet: THREE.BufferGeometry
  mats: { feather: THREE.Material; robe: THREE.MeshStandardMaterial; skin: THREE.Material; hair: THREE.Material; halo: THREE.Material; gold: THREE.Material; aura: THREE.SpriteMaterial }
  time: { value: number }
}

export function angelAssets(glow: THREE.Texture): AngelAssets {
  // the robe: a long gown, fitted at the chest, flaring to a full hem
  const prof: [number, number][] = [
    [0.001, 1.6], [0.1, 1.58], [0.12, 1.52], [0.25, 1.42], [0.23, 1.25], [0.19, 1.05], [0.21, 0.85], [0.27, 0.55],
    [0.35, 0.15], [0.44, -0.3], [0.54, -0.72], [0.6, -0.95], [0.57, -1.0], [0.001, -0.98],
  ]
  const robe = new THREE.LatheGeometry(prof.map(([r, y]) => new THREE.Vector2(r, y)), 96)
  {
    // deep pleats that open toward the hem, baked in so they catch light and shadow
    const p = robe.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i)
      const r = Math.hypot(x, z)
      if (r < 0.01) continue
      const a = Math.atan2(z, x)
      const w = Math.pow(Math.max(0, Math.min(1, (0.95 - y) / 1.9)), 1.3)
      const pleat = Math.sin(a * 14 + y * 0.5) * 0.6 + Math.sin(a * 6 - y * 0.8) * 0.4
      const k = 1 + (pleat * (0.012 + w * 0.07)) / r
      p.setXYZ(i, x * k, y, z * k)
    }
    robe.computeVertexNormals()
  }
  const sleeve = new THREE.CylinderGeometry(0.05, 0.1, 0.62, 14, 1, true)
  sleeve.translate(0, -0.31, 0)
  const head = new THREE.SphereGeometry(0.125, 24, 18)
  head.scale(0.92, 1.08, 1)
  // hair: a cap set back from the brow, and a fall of hair down the back to the shoulders
  const cap = new THREE.SphereGeometry(0.138, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5)
  cap.scale(1, 1.12, 1.06)
  cap.rotateX(-0.8)
  const fall = new THREE.CylinderGeometry(0.12, 0.16, 0.34, 20, 1, true, Math.PI * 0.55, Math.PI * 0.9)
  fall.translate(0, -0.12, -0.015)
  const hair = mergeGeometries([cap.toNonIndexed(), fall.toNonIndexed()])
  const handG = new THREE.SphereGeometry(0.042, 12, 10)
  const halo = new THREE.TorusGeometry(0.19, 0.014, 10, 48)
  const belt = new THREE.TorusGeometry(0.2, 0.018, 8, 40)
  belt.rotateX(Math.PI / 2)
  const bell = new THREE.LatheGeometry(
    Array.from({ length: 14 }, (_, i) => {
      const t = i / 13
      return new THREE.Vector2(0.012 + Math.pow(t, 3) * 0.12, t * 0.26)
    }),
    24,
  )
  bell.translate(0, 0.58, 0)
  const tube = new THREE.CylinderGeometry(0.011, 0.011, 0.6, 10)
  tube.translate(0, 0.3, 0)
  const trumpet = mergeGeometries([bell.toNonIndexed(), tube.toNonIndexed()].map((g) => (g.deleteAttribute('uv'), g)))

  const time = { value: 0 }
  const robeMat = new THREE.MeshStandardMaterial({ color: '#fbf7ef', roughness: 0.62, emissive: '#efe2c8', emissiveIntensity: 0.32, side: THREE.DoubleSide })
  robeMat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = time
    shader.vertexShader = 'uniform float uTime;\n' + shader.vertexShader.replace(
      '#include <begin_vertex>',
      `#include <begin_vertex>
       // the gown flows: stronger toward the hem, rippling around it
       float w = pow(clamp((0.9 - position.y) / 1.9, 0.0, 1.0), 1.8);
       #ifdef USE_INSTANCING
         mat4 wm = modelMatrix * instanceMatrix;
       #else
         mat4 wm = modelMatrix;
       #endif
       float ph = wm[3].x * 0.37 + wm[3].y * 0.11;
       float a = atan(position.z, position.x);
       transformed.x += sin(position.y * 3.5 + uTime * 2.1 + a * 3.0 + ph) * w * 0.07;
       transformed.z += cos(position.y * 3.1 + uTime * 1.8 + a * 2.0 + ph) * w * 0.09 - w * 0.12;`,
    )
  }
  return {
    wing: wingGeometries(),
    robe,
    sleeve,
    head,
    hair,
    hand: handG,
    halo,
    belt,
    trumpet,
    mats: {
      feather: new THREE.MeshStandardMaterial({ color: '#fdfaf4', roughness: 0.74, emissive: '#efe4cf', emissiveIntensity: 0.3, side: THREE.DoubleSide }),
      robe: robeMat,
      skin: new THREE.MeshStandardMaterial({ color: '#f0d8b8', roughness: 0.6, emissive: '#c8a882', emissiveIntensity: 0.18 }),
      hair: new THREE.MeshStandardMaterial({ color: '#e2c07e', roughness: 0.55, metalness: 0.2, emissive: '#a07a3a', emissiveIntensity: 0.15 }),
      halo: new THREE.MeshBasicMaterial({ color: new THREE.Color(2.6, 2.1, 1.1) }),
      gold: new THREE.MeshStandardMaterial({ color: '#ffcf55', metalness: 1, roughness: 0.2 }),
      aura: new THREE.SpriteMaterial({ map: glow, color: '#fff0d0', transparent: true, opacity: 0.22, depthWrite: false, blending: THREE.AdditiveBlending }),
    },
    time,
  }
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export type AngelKind = 'flyer' | 'hover' | 'trumpet'

export class Angel {
  group = new THREE.Group()
  private body = new THREE.Group()
  private wings: { shoulder: THREE.Group; elbow: THREE.Group; wrist: THREE.Group; side: number }[] = []
  private arms: { shoulder: THREE.Group; side: number }[] = []
  private seed: number
  readonly kind: AngelKind

  constructor(A: AngelAssets, kind: AngelKind, seed = Math.random()) {
    this.kind = kind
    this.seed = seed
    const M = A.mats
    this.group.add(this.body)
    const mesh = (g: THREE.BufferGeometry, m: THREE.Material, parent: THREE.Object3D = this.body) => {
      const o = new THREE.Mesh(g, m)
      parent.add(o)
      return o
    }
    mesh(A.robe, M.robe)
    mesh(A.belt, M.gold).position.y = 1.02
    mesh(A.head, M.skin).position.set(0, 1.74, 0.01)
    const hair = mesh(A.hair, M.hair)
    hair.position.set(0, 1.76, -0.025)
    const halo = mesh(A.halo, M.halo)
    halo.position.set(0, 1.92, -0.06)
    halo.rotation.x = Math.PI / 2 - 0.45
    const aura = new THREE.Sprite(M.aura)
    aura.scale.setScalar(5.5)
    aura.position.set(0, 1.0, -0.4)
    this.body.add(aura)

    // arms in flowing sleeves
    for (const side of [1, -1]) {
      const sh = new THREE.Group()
      sh.position.set(0.22 * side, 1.4, 0.02)
      mesh(A.sleeve, M.robe, sh)
      mesh(A.hand, M.skin, sh).position.y = -0.64
      this.body.add(sh)
      this.arms.push({ shoulder: sh, side })
    }
    if (kind === 'trumpet') {
      const tr = mesh(A.trumpet, M.gold)
      tr.position.set(0.02, 1.7, 0.12)
      tr.rotation.x = Math.PI / 2 - 0.55
    }

    // the wings: shoulder → elbow → wrist, each bone carrying its feathers; the left one mirrored
    for (const side of [1, -1]) {
      // mirror on a parent, so both wings rotate as true mirror images
      const mirror = new THREE.Group()
      mirror.scale.x = side
      this.body.add(mirror)
      const shoulder = new THREE.Group()
      shoulder.position.set(0.1, 1.4, -0.16)
      const elbow = new THREE.Group()
      elbow.position.x = 0.55
      const wrist = new THREE.Group()
      wrist.position.x = 0.75
      mesh(A.wing.arm, M.feather, shoulder)
      mesh(A.wing.fore, M.feather, elbow)
      mesh(A.wing.hand, M.feather, wrist)
      elbow.add(wrist)
      shoulder.add(elbow)
      mirror.add(shoulder)
      this.wings.push({ shoulder, elbow, wrist, side })
    }
  }

  /**
   * place and animate. `lean` pitches the body forward (0 upright … ~1.2 in full flight),
   * `yaw` turns it to face its heading, `beat` is the wingbeat rate (Hz-ish), `bank` rolls it into a turn.
   */
  pose(t: number, lean: number, yaw: number, beat = 0.9, bank = 0) {
    const s = this.seed * 10
    this.group.rotation.set(lean, yaw, bank, 'YXZ')
    // gliding stretches between beats for flyers; hoverers keep a slow, steady beat
    const glide = this.kind === 'flyer' ? 0.35 + 0.65 * Math.max(0, Math.sin(t * 0.33 + s)) : 1
    const ph = t * beat * Math.PI * 2 + s
    for (const w of this.wings) {
      const f = Math.sin(ph)
      const amp = (this.kind === 'trumpet' ? 0.22 : 0.55) * glide
      w.shoulder.rotation.set(0, 0.28 + amp * f, 0.42 + 0.1 * Math.sin(ph - 0.4) * glide, 'YXZ')
      w.elbow.rotation.set(0, amp * 0.55 * Math.sin(ph - 0.6), -0.16 - 0.08 * Math.max(0, f) * glide, 'YXZ')
      w.wrist.rotation.set(0, amp * 0.7 * Math.sin(ph - 1.15), -0.34 - 0.18 * Math.max(0, -Math.sin(ph - 1.15)) * glide, 'YXZ')
    }
    // the body answers each beat with a gentle lift
    this.body.position.y = Math.sin(ph - 0.8) * 0.07 * glide
    for (const a of this.arms) {
      if (this.kind === 'trumpet') {
        a.shoulder.rotation.set(-1.35 - (a.side > 0 ? 0.15 : 0), 0, a.side * -0.35)
      } else if (this.kind === 'flyer') {
        // reaching ahead in flight; gathered forward when nearly upright
        const reach = Math.min(1, lean / 1.0)
        a.shoulder.rotation.set(lerp(-0.7, -2.5, reach) + Math.sin(ph * 0.5) * 0.05, 0, a.side * lerp(0.35, 0.28, reach))
      } else {
        a.shoulder.rotation.set(-0.45 + Math.sin(t * 0.7 + s + a.side) * 0.08, 0, a.side * 0.42)
      }
    }
  }
}

/**
 * Draws the whole host with one instanced draw per body part instead of one per part per angel
 * (~370 draw calls → ~13 above the clouds). Each Angel keeps its own bone hierarchy and pose;
 * only its meshes are hidden, and their world matrices are copied into the instances every frame.
 * Mirrored (left-wing) parts get their own batch under a mirrored parent, so face winding — and
 * with it double-sided lighting — is exactly what the individual meshes had.
 */
const MIRROR = new THREE.Matrix4().makeScale(-1, 1, 1)
export class AngelBatch {
  readonly group = new THREE.Group()
  private slots: { mesh: THREE.InstancedMesh; flip: boolean; parts: { part: THREE.Mesh; angel: Angel }[] }[] = []
  private m = new THREE.Matrix4()

  constructor(private angels: Angel[]) {
    const byKey = new Map<string, { geo: THREE.BufferGeometry; mat: THREE.Material; flip: boolean; parts: { part: THREE.Mesh; angel: Angel }[] }>()
    for (const angel of angels) {
      angel.group.updateMatrixWorld(true)
      angel.group.traverse((o) => {
        const part = o as THREE.Mesh
        if (!part.isMesh) return
        const mat = part.material as THREE.Material
        const flip = part.matrixWorld.determinant() < 0
        const key = `${part.geometry.uuid}|${mat.uuid}|${flip}`
        if (!byKey.has(key)) byKey.set(key, { geo: part.geometry, mat, flip, parts: [] })
        byKey.get(key)!.parts.push({ part, angel })
        part.visible = false // drawn by the batch from now on
      })
    }
    for (const { geo, mat, flip, parts } of byKey.values()) {
      const mesh = new THREE.InstancedMesh(geo, mat, parts.length)
      mesh.frustumCulled = false // instances roam the whole sky; per-frame bounds aren't worth it
      if (flip) mesh.scale.x = -1
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
      mesh.visible = false
      this.group.add(mesh)
      this.slots.push({ mesh, flip, parts })
    }
  }

  /** call after posing; only angels whose group is visible are drawn */
  update() {
    for (const a of this.angels) if (a.group.visible) a.group.updateMatrixWorld(true)
    for (const s of this.slots) {
      let n = 0
      for (const { part, angel } of s.parts) {
        if (!angel.group.visible) continue
        s.mesh.setMatrixAt(n++, s.flip ? this.m.multiplyMatrices(MIRROR, part.matrixWorld) : part.matrixWorld)
      }
      s.mesh.count = n
      s.mesh.visible = n > 0
      s.mesh.instanceMatrix.needsUpdate = true
    }
  }
}
