import { useEffect, useRef } from 'react'
import { animate, useMotionValue } from 'motion/react'
import * as THREE from 'three'
import { colorAt, useDepthTarget } from '../lib/ocean'
import { usePath } from '../lib/router'

/**
 * The 3D world behind every screen: a fishing boat on the Sea of Galilee at dawn, then down
 * through god-rays, fish schools, jellies and the great fish, into the bioluminescent abyss and
 * finally the trench floor where the "pearl of great price" waits. 1 world unit = 1 metre.
 */

const MARKERS: [number, string][] = [
  [0, '“Put out into deep water, and let down the nets.” — Luke 5:4'],
  [80, 'sunlight still dances here'],
  [200, 'the twilight zone begins'],
  [600, '“The light shines in the darkness.” — John 1:5'],
  [1000, 'the midnight zone · no sunlight below'],
  [1300, '“A great fish to swallow up Jonah.” — Jonah 1:17'],
  [2000, '“Your word is a lamp to my feet.” — Psalm 119:105'],
  [2600, '“Deep calls to deep.” — Psalm 42:7'],
  [3400, 'pressure: over 300 atmospheres'],
  [4000, 'the abyss'],
  [4700, '“Even the darkness is not dark to you.” — Psalm 139:12'],
  [6000, 'the hadal trench'],
  [6600, '“You will cast all our sins into the depths of the sea.” — Micah 7:19'],
  [7000, '“One pearl of great price.” — Matthew 13:46'],
]

const FLOOR = 7012

/* ---------------- helpers ---------------- */

function rgb(d: number) {
  const m = colorAt(d).match(/\d+/g)!.map(Number)
  return new THREE.Color(m[0] / 255, m[1] / 255, m[2] / 255)
}

function glowTexture(inner = 'rgba(255,255,255,1)', outer = 'rgba(255,255,255,0)') {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, inner)
  grad.addColorStop(0.25, inner.replace(/[\d.]+\)$/, '0.55)'))
  grad.addColorStop(1, outer)
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 128)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

/** an ichthys-style fish profile, head toward +x */
function fishGeometry(len = 1) {
  const s = new THREE.Shape()
  s.moveTo(0.55, 0)
  s.bezierCurveTo(0.45, 0.24, 0.05, 0.3, -0.3, 0.06)
  s.lineTo(-0.52, 0.22)
  s.lineTo(-0.46, 0)
  s.lineTo(-0.52, -0.22)
  s.lineTo(-0.3, -0.06)
  s.bezierCurveTo(0.05, -0.3, 0.45, -0.24, 0.55, 0)
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.08, bevelEnabled: true, bevelThickness: 0.07, bevelSize: 0.05, bevelSegments: 3, curveSegments: 10 })
  g.translate(0, 0, -0.04)
  g.scale(len, len, len)
  return g
}

/** a small fishing boat with a mast and yard (a quiet cross against the dawn) */
function makeBoat() {
  const boat = new THREE.Group()
  const wood = new THREE.MeshStandardMaterial({ color: '#6b4228', roughness: 0.85 })
  const dark = new THREE.MeshStandardMaterial({ color: '#3e2618', roughness: 0.9 })
  // hull: the lower half of a stretched sphere, open on top
  const hull = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#6b4228', roughness: 0.85, side: THREE.DoubleSide }))
  hull.scale.set(3.1, 0.75, 1)
  hull.position.y = 0.2
  boat.add(hull)
  void wood
  const rim = new THREE.Mesh(new THREE.TorusGeometry(1, 0.05, 6, 32), dark)
  rim.scale.set(3.1, 1, 1)
  rim.rotation.x = Math.PI / 2
  rim.position.y = 0.2
  boat.add(rim)
  for (const x of [-1.2, 0, 1.2]) {
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 1.7), dark)
    seat.position.set(x, 0.05, 0)
    boat.add(seat)
  }
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 3.6, 8), dark)
  mast.position.set(0.4, 1.9, 0)
  boat.add(mast)
  const yard = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2, 8), dark)
  yard.rotation.x = Math.PI / 2
  yard.position.set(0.4, 3.0, 0)
  boat.add(yard)
  // furled sail
  const sail = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.09, 2.0, 8),
    new THREE.MeshStandardMaterial({ color: '#efe2c4', roughness: 1 }),
  )
  sail.rotation.x = Math.PI / 2
  sail.position.set(0.4, 2.88, 0)
  boat.add(sail)
  // net draped over the side
  const net = new THREE.Mesh(
    new THREE.SphereGeometry(0.7, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: '#d9c9a3', wireframe: true, transparent: true, opacity: 0.7 }),
  )
  net.scale.set(1.3, 0.5, 0.9)
  net.position.set(-2.4, 0.1, 0.9)
  boat.add(net)
  // a lantern on the bow
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 8), new THREE.MeshBasicMaterial({ color: '#ffd27a' }))
  lamp.position.set(2.9, 0.6, 0)
  boat.add(lamp)
  const lampLight = new THREE.PointLight('#ffbf66', 6, 8, 2)
  lampLight.position.copy(lamp.position)
  boat.add(lampLight)
  boat.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) o.castShadow = false
  })
  return boat
}

/** the great fish (Jonah's) — a slow whale-like silhouette */
function makeGreatFish() {
  const g = new THREE.Group()
  const skin = new THREE.MeshStandardMaterial({ color: '#163a5c', roughness: 0.55, metalness: 0.1, emissive: '#06182a' })
  const pts: THREE.Vector2[] = []
  for (let i = 0; i <= 24; i++) {
    const t = i / 24
    const u = 1 - t // head (blunt) at +x, tapering to the tail at -x
    const r = Math.pow(Math.sin(Math.PI * Math.pow(u, 0.55)), 0.7) * (0.6 + 0.4 * (1 - u)) * 3.2
    pts.push(new THREE.Vector2(Math.max(0.05, r), t * 22 - 11))
  }
  const body = new THREE.Mesh(new THREE.LatheGeometry(pts, 32), skin)
  body.rotation.z = -Math.PI / 2
  body.scale.set(1, 1, 0.8)
  g.add(body)
  const tailShape = new THREE.Shape()
  tailShape.moveTo(0, 0)
  tailShape.quadraticCurveTo(-2, 3.5, -4.5, 4.2)
  tailShape.quadraticCurveTo(-3, 1.5, -3.6, 0)
  tailShape.quadraticCurveTo(-3, -1.5, -4.5, -4.2)
  tailShape.quadraticCurveTo(-2, -3.5, 0, 0)
  const tail = new THREE.Mesh(new THREE.ExtrudeGeometry(tailShape, { depth: 0.3, bevelEnabled: true, bevelSize: 0.15, bevelThickness: 0.15, bevelSegments: 2 }), skin)
  tail.rotation.x = Math.PI / 2
  tail.name = 'tail'
  const tailPivot = new THREE.Group()
  tailPivot.position.x = -10.6
  tailPivot.add(tail)
  tailPivot.name = 'tailPivot'
  g.add(tailPivot)
  for (const side of [-1, 1]) {
    const fin = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), skin)
    fin.scale.set(2.2, 0.15, 0.7)
    fin.position.set(4, -1.4, side * 2.2)
    fin.rotation.y = side * 0.5
    fin.rotation.x = side * 0.4
    g.add(fin)
  }
  const eyeMat = new THREE.MeshBasicMaterial({ color: '#9ff3e4' })
  for (const side of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), eyeMat)
    eye.position.set(8.2, 0.3, side * 1.85)
    g.add(eye)
  }
  return g
}

function makeJelly(color: string) {
  const g = new THREE.Group()
  const mat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.9, transparent: true, opacity: 0.55, roughness: 0.2, side: THREE.DoubleSide, depthWrite: false })
  const bell = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), mat)
  g.add(bell)
  const lines: THREE.Line[] = []
  const lmat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.5 })
  for (let i = 0; i < 7; i++) {
    const geo = new THREE.BufferGeometry().setFromPoints(Array.from({ length: 14 }, (_, k) => new THREE.Vector3(0, -k * 0.35, 0)))
    const line = new THREE.Line(geo, lmat)
    const a = (i / 7) * Math.PI * 2
    line.position.set(Math.cos(a) * 0.6, 0, Math.sin(a) * 0.6)
    g.add(line)
    lines.push(line)
  }
  g.userData.lines = lines
  g.userData.bell = bell
  return g
}

/* ---------------- component ---------------- */

export default function World3D() {
  const mount = useRef<HTMLDivElement>(null)
  const caption = useRef<HTMLDivElement>(null)
  const target = useDepthTarget()
  const path = usePath()
  const depth = useMotionValue(target)
  const showCaptions = useRef(true)
  showCaptions.current = path.startsWith('/dive') || path.startsWith('/free')

  useEffect(() => {
    const from = depth.get()
    const dist = Math.abs(target - from)
    const c = animate(depth, target, { duration: Math.min(3.6, Math.max(1, dist / 500)), ease: [0.55, 0, 0.2, 1] })
    return () => c.stop()
  }, [target, depth])

  useEffect(() => {
    const el = mount.current!
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = Math.min(window.innerWidth, window.innerHeight) < 700
    const renderer = new THREE.WebGLRenderer({ antialias: !small, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    el.appendChild(renderer.domElement)
    renderer.domElement.style.display = 'block'

    const scene = new THREE.Scene()
    const fog = new THREE.FogExp2('#0a3a5a', 0.02)
    scene.fog = fog
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 1500)

    /* lights */
    const hemi = new THREE.HemisphereLight('#bfe8ff', '#06233a', 1.4)
    scene.add(hemi)
    const sunLight = new THREE.DirectionalLight('#ffd9a0', 2.4)
    sunLight.position.set(-30, 40, -60)
    scene.add(sunLight)
    const lamp = new THREE.PointLight('#ffcf7a', 0, 30, 1.6) // "a lamp to my feet" — brightens in the dark
    scene.add(lamp)

    /* sky (only visible above the water) */
    const sky = new THREE.Mesh(
      new THREE.SphereGeometry(900, 32, 16),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {},
        vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: `varying vec3 vP;
          void main(){
            float h = vP.y;
            vec3 zenith = vec3(0.07,0.12,0.30);
            vec3 mid = vec3(0.42,0.45,0.70);
            vec3 horizon = vec3(1.0,0.72,0.48);
            vec3 c = mix(horizon, mid, smoothstep(0.0,0.18,h));
            c = mix(c, zenith, smoothstep(0.18,0.75,h));
            // sun glow
            vec3 sunDir = normalize(vec3(-0.35,0.06,-1.0));
            float s = max(dot(normalize(vP), sunDir), 0.0);
            c += vec3(1.0,0.78,0.45) * pow(s, 24.0) * 1.2 + vec3(1.0,0.6,0.35) * pow(s,4.0) * 0.35;
            if (h < 0.0) c = mix(vec3(0.05,0.18,0.28), horizon*0.6, smoothstep(-0.2,0.0,h));
            gl_FragColor = vec4(c,1.0);
          }`,
      }),
    )
    scene.add(sky)
    const sun = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture('rgba(255,236,190,1)'), color: '#fff2cf', transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending }))
    sun.position.set(-210, 36, -600)
    sun.scale.set(150, 150, 1)
    scene.add(sun)

    /* distant hills of Galilee */
    const hills = new THREE.Group()
    const hillMat = new THREE.MeshBasicMaterial({ color: '#5c4f72', fog: false })
    const hillMat2 = new THREE.MeshBasicMaterial({ color: '#433c5c', fog: false })
    for (let i = 0; i < 14; i++) {
      const h = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), i % 2 ? hillMat : hillMat2)
      const a = -1.9 + (i / 13) * 2.4
      h.position.set(Math.sin(a) * 420, -2, -Math.cos(a) * 420)
      h.scale.set(60 + (i * 37) % 50, 18 + (i * 13) % 22, 40)
      hills.add(h)
    }
    scene.add(hills)

    /* water surface */
    const waterUniforms = { uTime: { value: 0 } }
    const water = new THREE.Mesh(
      new THREE.PlaneGeometry(1400, 1400, 160, 160),
      new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        transparent: true,
        uniforms: waterUniforms,
        vertexShader: `uniform float uTime; varying vec3 vW; varying float vH;
          void main(){
            vec3 p = position;
            float h = sin(p.x*0.18 + uTime*0.9)*0.22 + sin(p.y*0.27 + uTime*1.3)*0.16 + sin((p.x+p.y)*0.6 + uTime*2.0)*0.05;
            p.z += h; vH = h;
            vec4 w = modelMatrix * vec4(p,1.0); vW = w.xyz;
            gl_Position = projectionMatrix * viewMatrix * w;
          }`,
        fragmentShader: `uniform float uTime; varying vec3 vW; varying float vH;
          void main(){
            vec3 V = normalize(cameraPosition - vW);
            if (gl_FrontFacing) {
              // from above: dawn-lit water with a golden path toward the sun
              float fres = pow(1.0 - max(V.y, 0.0), 3.0);
              vec3 deep = vec3(0.04,0.20,0.34);
              vec3 sky = vec3(0.85,0.62,0.55);
              vec3 c = mix(deep, sky, fres*0.55);
              c += vec3(0.05,0.08,0.1) * sin(vW.x*0.7+uTime)*sin(vW.z*0.6-uTime*0.8);
              float path = exp(-pow((vW.x + 0.35*(-vW.z))*0.03, 2.0)) * smoothstep(0.0, -400.0, vW.z);
              c += vec3(1.0,0.75,0.4) * path * (0.4 + 0.6*smoothstep(0.1,0.3,vH)) * 0.9;
              float dist = length(cameraPosition.xz - vW.xz);
              c = mix(c, vec3(0.98,0.70,0.50), smoothstep(150.0, 650.0, dist));
              gl_FragColor = vec4(c, 0.96);
            } else {
              // from below: a bright, rippling ceiling of light
              float r = sin(vW.x*0.35 + uTime*1.2)*sin(vW.z*0.3 - uTime*0.9);
              vec3 c = mix(vec3(0.45,0.82,0.92), vec3(0.85,0.98,1.0), 0.5 + 0.5*r);
              float dist = length(cameraPosition.xz - vW.xz);
              gl_FragColor = vec4(c, mix(0.9, 0.0, smoothstep(60.0, 220.0, dist)));
            }
          }`,
      }),
    )
    water.rotation.x = -Math.PI / 2
    scene.add(water)

    /* the boat */
    const boat = makeBoat()
    boat.position.set(6, 0.42, -14)
    boat.rotation.y = 0.5
    boat.scale.setScalar(1.05)
    scene.add(boat)

    /* god rays */
    const rayMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      uniforms: { uTime: { value: 0 }, uFade: { value: 1 }, uColor: { value: new THREE.Color('#d8f6ff') } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `uniform float uTime; uniform float uFade; uniform vec3 uColor; varying vec2 vUv;
        void main(){
          float edge = smoothstep(0.0,0.5,vUv.x) * smoothstep(1.0,0.5,vUv.x);
          float fall = pow(vUv.y, 1.6);
          float flick = 0.75 + 0.25*sin(uTime*0.7 + vUv.x*6.0);
          gl_FragColor = vec4(uColor, edge * fall * flick * 0.16 * uFade);
        }`,
    })
    const rays = new THREE.Group()
    for (let i = 0; i < 12; i++) {
      const w = 6 + (i % 4) * 4
      const ray = new THREE.Mesh(new THREE.PlaneGeometry(w, 260), rayMat)
      ray.position.set(-50 + i * 9 + Math.sin(i) * 6, -130, -30 - (i % 5) * 14)
      ray.rotation.z = 0.25 + Math.sin(i * 2.1) * 0.08
      ray.rotation.y = Math.sin(i) * 0.6
      ray.userData.phase = i
      rays.add(ray)
    }
    scene.add(rays)

    /* a single golden shaft that follows you into the dark ("the light shines in the darkness") */
    const hopeMat = rayMat.clone()
    hopeMat.uniforms = { uTime: { value: 0 }, uFade: { value: 0 }, uColor: { value: new THREE.Color('#ffd58a') } }
    const hope = new THREE.Mesh(new THREE.PlaneGeometry(10, 220), hopeMat)
    scene.add(hope)

    /* marine snow + bioluminescence (wraps around the camera) */
    const SNOW = small ? 900 : 1800
    const snowGeo = new THREE.BufferGeometry()
    const snowPos = new Float32Array(SNOW * 3)
    const snowCol = new Float32Array(SNOW * 3)
    const BOX = 70
    for (let i = 0; i < SNOW; i++) {
      snowPos[i * 3] = (Math.random() - 0.5) * BOX
      snowPos[i * 3 + 1] = (Math.random() - 0.5) * BOX
      snowPos[i * 3 + 2] = (Math.random() - 0.5) * BOX
    }
    snowGeo.setAttribute('position', new THREE.BufferAttribute(snowPos, 3))
    snowGeo.setAttribute('color', new THREE.BufferAttribute(snowCol, 3))
    const snow = new THREE.Points(
      snowGeo,
      new THREE.PointsMaterial({ size: 0.22, map: glowTexture(), vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true }),
    )
    scene.add(snow)
    const glowSeed = Array.from({ length: SNOW }, () => Math.random())

    /* fish schools */
    const fishGeo = fishGeometry(1)
    const fishMat = new THREE.MeshStandardMaterial({ color: '#cfe8f2', roughness: 0.35, metalness: 0.55, emissive: '#000000' })
    const fishTime = { value: 0 }
    fishMat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = fishTime
      shader.vertexShader = 'uniform float uTime;\n' + shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
         float tailW = smoothstep(0.25, -0.55, position.x);
         transformed.z += sin(uTime * 9.0 + float(gl_InstanceID) * 1.7) * tailW * 0.22;`,
      )
    }
    interface School { y: number; r: number; speed: number; count: number; tint: string; glow: number; size: number; phase: number }
    const schools: School[] = [
      { y: -18, r: 16, speed: 0.22, count: 38, tint: '#e6f6ff', glow: 0, size: 0.9, phase: 0 },
      { y: -70, r: 22, speed: -0.16, count: 30, tint: '#9fd6ff', glow: 0, size: 1.2, phase: 1 },
      { y: -150, r: 18, speed: 0.2, count: 26, tint: '#7fc4e8', glow: 0, size: 1, phase: 2 },
      { y: -330, r: 26, speed: -0.12, count: 24, tint: '#6fb0d8', glow: 0.1, size: 1.4, phase: 3 },
      { y: -2100, r: 20, speed: 0.14, count: 30, tint: '#7ef6dc', glow: 1, size: 0.7, phase: 4 },
      { y: -3300, r: 24, speed: -0.1, count: 22, tint: '#9fb6ff', glow: 1, size: 0.8, phase: 5 },
    ]
    const totalFish = schools.reduce((s, x) => s + x.count, 0)
    const fish = new THREE.InstancedMesh(fishGeo, fishMat, totalFish)
    fish.frustumCulled = false
    const fishColor = new THREE.Color()
    {
      let k = 0
      for (const sc of schools)
        for (let i = 0; i < sc.count; i++, k++) {
          fishColor.set(sc.tint)
          if (sc.glow) fishColor.multiplyScalar(2.2)
          fish.setColorAt(k, fishColor)
        }
    }
    scene.add(fish)
    const dummy = new THREE.Object3D()
    const fishOffsets = Array.from({ length: totalFish }, () => [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5, Math.random()])

    /* jellies */
    const jellies = [
      [740, 8, -26, '#b9a6ff'],
      [860, -12, -34, '#ff9fd8'],
      [1080, 5, -22, '#a6e9ff'],
      [1500, -9, -30, '#c8b0ff'],
      [2400, 10, -28, '#7ef6dc'],
    ].map(([d, x, z, c]) => {
      const j = makeJelly(c as string)
      j.position.set(x as number, -(d as number), z as number)
      j.scale.setScalar(1.6)
      j.userData.base = j.position.clone()
      scene.add(j)
      return j
    })

    /* the great fish */
    const great = makeGreatFish()
    great.position.set(0, -1300, -45)
    scene.add(great)
    const tailPivot = great.getObjectByName('tailPivot')!

    /* angler lights + lanterns in the deep */
    const lanterns = new THREE.Group()
    const lanternMat = new THREE.SpriteMaterial({ map: glowTexture('rgba(255,232,150,1)'), color: '#ffe28a', transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
    for (let i = 0; i < 40; i++) {
      const s = new THREE.Sprite(lanternMat)
      s.position.set(((i * 53) % 80) - 40, -(1800 + ((i * 397) % 4800)), -15 - ((i * 29) % 40))
      s.scale.setScalar(1.2 + (i % 3) * 0.6)
      s.userData.phase = i
      lanterns.add(s)
    }
    scene.add(lanterns)

    /* trench floor + the pearl of great price */
    const floorGeo = new THREE.PlaneGeometry(400, 400, 80, 80)
    {
      const p = floorGeo.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i)
        const y = p.getY(i)
        p.setZ(i, Math.sin(x * 0.08) * 2 + Math.cos(y * 0.11) * 2 + Math.sin((x + y) * 0.3) * 0.5 + (Math.abs(x) > 60 ? (Math.abs(x) - 60) * 0.25 : 0))
      }
      floorGeo.computeVertexNormals()
    }
    const floor = new THREE.Mesh(floorGeo, new THREE.MeshStandardMaterial({ color: '#1a2236', roughness: 1 }))
    floor.rotation.x = -Math.PI / 2
    floor.position.set(0, -FLOOR, -20)
    scene.add(floor)
    const shellMat = new THREE.MeshStandardMaterial({ color: '#e8d6c8', roughness: 0.4, metalness: 0.2, side: THREE.DoubleSide })
    const shell = new THREE.Group()
    const lower = new THREE.Mesh(new THREE.SphereGeometry(1.6, 24, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), shellMat)
    lower.scale.set(1, 0.45, 1)
    const upper = new THREE.Mesh(new THREE.SphereGeometry(1.6, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), shellMat)
    upper.scale.set(1, 0.45, 1)
    upper.position.set(0, 0, -1.1)
    upper.rotation.x = -1.0
    shell.add(lower, upper)
    const pearl = new THREE.Mesh(
      new THREE.SphereGeometry(0.55, 32, 16),
      new THREE.MeshPhysicalMaterial({ color: '#fff8f0', roughness: 0.12, metalness: 0, clearcoat: 1, iridescence: 1, iridescenceIOR: 1.6, emissive: '#fff1d6', emissiveIntensity: 1.1 }),
    )
    pearl.position.y = 0.45
    pearl.scale.setScalar(1.2)
    shell.add(pearl)
    const pearlLight = new THREE.PointLight('#fff1d6', 30, 25, 1.5)
    pearlLight.position.y = 1.5
    shell.add(pearlLight)
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture('rgba(255,244,220,1)'), color: '#fff3dd', transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
    halo.scale.setScalar(9)
    halo.position.y = 0.4
    shell.add(halo)
    shell.position.set(0, -FLOOR + 2.4, -12)
    shell.scale.setScalar(1.4)
    scene.add(shell)

    /* sizing + pointer parallax */
    const resize = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      renderer.setSize(w, h, false)
      renderer.domElement.style.width = '100%'
      renderer.domElement.style.height = '100%'
      camera.aspect = w / h
      camera.fov = w < h ? 68 : 55
      camera.updateProjectionMatrix()
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
    const clock = new THREE.Clock()
    let raf = 0
    let lastCaption = ''
    const look = new THREE.Vector3()
    const tmpColor = new THREE.Color()
    const frame = () => {
      raf = requestAnimationFrame(frame)
      if (document.hidden) return
      const dt = Math.min(0.05, clock.getDelta())
      const t = reduce ? 0 : clock.elapsedTime
      const d = depth.get()
      const vel = reduce ? 0 : depth.getVelocity()
      waterUniforms.uTime.value = t
      fishTime.value = t
      rayMat.uniforms.uTime.value = t
      hopeMat.uniforms.uTime.value = t

      // camera: above the boat at 0 m, sinking with depth
      pointer.x += (pointer.tx - pointer.x) * 0.04
      pointer.y += (pointer.ty - pointer.y) * 0.04
      const above = Math.max(0, 1 - d / 18) // 1 at the surface, 0 once under
      const camY = above > 0 ? 2.4 * above - d * (1 - above) : -d
      camera.position.set(
        pointer.x * 2.2 + Math.sin(t * 0.21) * 0.6,
        camY - pointer.y * 0.8 + Math.sin(t * 0.5) * 0.15,
        10 + 6 * (1 - above) + Math.cos(t * 0.17) * 0.5,
      )
      const floorPull = Math.max(0, Math.min(1, (d - 6700) / 300)) * 5
      look.set(0, camY - (above > 0 ? 0.9 : 2) - floorPull - vel * 0.004, -10)
      camera.lookAt(look)
      camera.rotation.z += Math.sin(t * 0.3) * 0.006

      // fog + background follow the depth colour
      const under = d > 0.5 || camera.position.y < 0
      const c = rgb(d)
      if (under) {
        fog.color.copy(c)
        fog.density = 0.008 + Math.min(0.012, d / 400000)
        renderer.setClearColor(c)
        sky.visible = false
        sun.visible = false
        hills.visible = false
      } else {
        fog.color.set('#e9b08a')
        fog.density = 0.0025
        sky.visible = true
        sun.visible = true
        hills.visible = true
      }
      water.visible = d < 260
      hemi.intensity = Math.max(0.15, 1.5 - d / 900)
      hemi.color.copy(tmpColor.set('#bfe8ff').lerp(c, Math.min(1, d / 600)))
      sunLight.intensity = Math.max(0, 2.6 - d / 250)
      lamp.position.copy(camera.position).add(new THREE.Vector3(0, -1, -4))
      lamp.intensity = Math.min(1, Math.max(0, (d - 700) / 1500)) * 18

      // rays near the surface; the golden shaft deeper down
      rays.visible = d < 700
      rayMat.uniforms.uFade.value = Math.max(0, 1 - d / 650)
      rays.children.forEach((r) => {
        r.rotation.z = 0.25 + Math.sin(t * 0.15 + r.userData.phase) * 0.06
      })
      hope.position.set(camera.position.x + 8, camera.position.y + 40, -26)
      hope.rotation.z = 0.12 + Math.sin(t * 0.2) * 0.03
      hopeMat.uniforms.uFade.value = Math.min(1, Math.max(0, (d - 500) / 900)) * (d > 6950 ? 2 : 1.3)

      // boat bobbing
      boat.visible = d < 120
      boat.position.y = 0.42 + Math.sin(t * 1.1) * 0.12
      boat.rotation.z = Math.sin(t * 0.9) * 0.04
      boat.rotation.x = Math.sin(t * 0.7) * 0.03

      // snow: wraps around the camera, streaks upward as you sink
      const pos = snowGeo.attributes.position as THREE.BufferAttribute
      const col = snowGeo.attributes.color as THREE.BufferAttribute
      const deep = Math.min(1, d / 2500)
      const rise = vel * dt * 0.9
      for (let i = 0; i < SNOW; i++) {
        let y = pos.getY(i) + rise * (0.6 + glowSeed[i]) - dt * 0.25
        if (y > BOX / 2) y -= BOX
        if (y < -BOX / 2) y += BOX
        pos.setY(i, y)
        pos.setX(i, pos.getX(i) + Math.sin(t * 0.3 + i) * dt * 0.08)
        const glow = glowSeed[i] < 0.12 && deep > 0.2
        if (glow) {
          const flick = 0.6 + 0.4 * Math.sin(t * 2 + i)
          if (i % 3) col.setXYZ(i, 0.5 * flick, 0.97 * flick, 0.86 * flick)
          else col.setXYZ(i, 0.62 * flick, 0.71 * flick, 1.0 * flick)
        } else {
          const a = (1 - deep * 0.55) * 0.7
          col.setXYZ(i, 0.87 * a, 0.97 * a, 1.0 * a)
        }
      }
      pos.needsUpdate = true
      col.needsUpdate = true
      snow.position.set(camera.position.x, camera.position.y, camera.position.z - 10)
      snow.visible = d > 1

      // fish
      let k = 0
      for (const sc of schools) {
        const near = Math.abs(-sc.y - d) < 260
        for (let i = 0; i < sc.count; i++, k++) {
          if (!near) {
            dummy.position.set(0, -99999, 0)
            dummy.scale.setScalar(0.0001)
            dummy.updateMatrix()
            fish.setMatrixAt(k, dummy.matrix)
            continue
          }
          const o = fishOffsets[k]
          const a = t * sc.speed + sc.phase + o[3] * 0.9
          const rr = sc.r + o[0] * 6
          const x = Math.cos(a) * rr
          const z = Math.sin(a) * rr * 0.55 - 22
          const y = sc.y + o[1] * 5 + Math.sin(t * 0.8 + o[3] * 10) * 0.6
          dummy.position.set(x, y, z)
          // face along the direction of travel
          const dir = sc.speed > 0 ? 1 : -1
          dummy.rotation.set(0, -a - (Math.PI / 2) * dir, Math.sin(t + o[2] * 5) * 0.08)
          dummy.scale.setScalar(sc.size * (0.8 + o[3] * 0.5))
          dummy.updateMatrix()
          fish.setMatrixAt(k, dummy.matrix)
        }
      }
      fish.instanceMatrix.needsUpdate = true
      fishMat.emissive.setRGB(deep * 0.35, deep * 0.95, deep * 0.85)

      // jellies pulse
      for (const j of jellies) {
        const near = Math.abs(j.position.y + d) < 200
        j.visible = near
        if (!near) continue
        const ph = t * 1.4 + j.userData.base.x
        j.position.y = j.userData.base.y + Math.sin(ph * 0.5) * 2
        j.userData.bell.scale.set(1 + Math.sin(ph) * 0.08, 0.8 - Math.sin(ph) * 0.12, 1 + Math.sin(ph) * 0.08)
        for (const line of j.userData.lines as THREE.Line[]) {
          const p = line.geometry.attributes.position as THREE.BufferAttribute
          for (let v = 0; v < p.count; v++) p.setX(v, Math.sin(ph - v * 0.5) * v * 0.04)
          p.needsUpdate = true
        }
      }

      // the great fish glides past
      great.visible = Math.abs(d - 1300) < 320
      if (great.visible) {
        const gx = Math.sin(t * 0.06) * 34
        great.position.set(gx, -1296 + Math.sin(t * 0.3) * 3, -42)
        great.rotation.y = Math.cos(t * 0.06) > 0 ? 0 : Math.PI
        great.rotation.z = Math.sin(t * 0.25) * 0.05
        tailPivot.rotation.y = Math.sin(t * 1.2) * 0.35
      }

      // lanterns flicker
      lanterns.visible = d > 1500
      if (lanterns.visible) lanterns.children.forEach((s) => ((s as THREE.Sprite).material.opacity = 0.55 + 0.45 * Math.sin(t * 1.7 + s.userData.phase)))

      // the pearl
      shell.visible = d > 6300
      if (shell.visible) {
        upper.rotation.x = -1.35 - Math.sin(t * 0.6) * 0.08
        pearlLight.intensity = 25 + Math.sin(t * 1.3) * 6
        halo.material.opacity = 0.7 + Math.sin(t * 1.3) * 0.2
      }

      // depth captions (DOM, no React re-render)
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

      renderer.render(scene, camera)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('deviceorientation', onTilt)
      scene.traverse((o) => {
        const m = o as THREE.Mesh
        m.geometry?.dispose?.()
        const mat = m.material as THREE.Material | THREE.Material[] | undefined
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose())
        else mat?.dispose?.()
      })
      renderer.dispose()
      el.removeChild(renderer.domElement)
    }
  }, [depth])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#06213d]">
      <div ref={mount} className="absolute inset-0" />
      {/* soft vignette + grain for a painted, cinematic feel */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(120% 90% at 50% 40%, transparent 55%, rgba(2,6,16,0.55) 100%)' }} />
      <div
        ref={caption}
        className="absolute left-1/2 top-[calc(env(safe-area-inset-top)+5.5rem)] w-[min(92vw,640px)] -translate-x-1/2 text-center font-serif text-[13px] italic text-white/50 transition-opacity duration-700 sm:top-28 sm:text-[15px]"
        style={{ opacity: 0, textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}
      />
    </div>
  )
}
