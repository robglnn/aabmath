import * as THREE from 'three'
import { sampleTerrainHeight } from './terrain'

function flatMat(color: number): THREE.MeshLambertMaterial {
  return new THREE.MeshLambertMaterial({ color, flatShading: true })
}

function placeOnGround(obj: THREE.Object3D, x: number, z: number, yOffset = 0): void {
  obj.position.set(x, sampleTerrainHeight(x, z) + yOffset, z)
}

function createPine(): THREE.Group {
  const g = new THREE.Group()
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 1.6, 5), flatMat(0x5a3d22))
  trunk.position.y = 0.8
  g.add(trunk)

  const layers = [
    { r: 1.1, h: 1.4, y: 1.8, c: 0x1f6b32 },
    { r: 0.85, h: 1.1, y: 2.6, c: 0x26803c },
    { r: 0.55, h: 0.9, y: 3.2, c: 0x2f9645 },
  ]
  for (const L of layers) {
    const cone = new THREE.Mesh(new THREE.ConeGeometry(L.r, L.h, 6), flatMat(L.c))
    cone.position.y = L.y
    g.add(cone)
  }
  return g
}

function scatterPines(scene: THREE.Scene): void {
  const spots: [number, number, number][] = [
    [-18, -22, 1.1], [-8, -30, 0.95], [6, -26, 1.05], [20, -18, 1.0],
    [-24, -8, 1.15], [14, -10, 0.9], [28, -28, 1.0], [-30, 14, 1.05],
    [22, 16, 0.95], [-12, 24, 1.0], [8, 30, 1.1], [32, 8, 0.9],
    [-20, 32, 1.0], [36, -8, 0.85],
  ]
  for (const [x, z, s] of spots) {
    const pine = createPine()
    pine.scale.setScalar(s)
    placeOnGround(pine, x, z)
    pine.rotation.y = (x * 0.17 + z * 0.11) % (Math.PI * 2)
    scene.add(pine)
  }
}

function createMountain(x: number, z: number, scale: number, color: number): THREE.Mesh {
  const geo = new THREE.ConeGeometry(14 * scale, 22 * scale, 5)
  const mesh = new THREE.Mesh(geo, flatMat(color))
  placeOnGround(mesh, x, z, -1.5 * scale)
  mesh.rotation.y = (x * 0.03) % (Math.PI * 2)
  return mesh
}

function addMountains(scene: THREE.Scene): void {
  const peaks: [number, number, number, number][] = [
    [-55, -55, 1.4, 0x6a7a8a], [-30, -62, 1.1, 0x7a8a9a], [10, -68, 1.6, 0x5a6a7a],
    [45, -58, 1.2, 0x708090], [68, -40, 1.0, 0x8090a0], [-65, -30, 0.9, 0x8898a8],
  ]
  for (const [x, z, s, c] of peaks) {
    scene.add(createMountain(x, z, s, c))
  }
}

function createRuinBlock(w: number, h: number, d: number, color: number): THREE.Mesh {
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), flatMat(color))
}

function addRuins(scene: THREE.Scene): void {
  const ruinRoot = new THREE.Group()
  const stone = 0x8a8578
  const moss = 0x6a7560

  const base = createRuinBlock(5, 1.2, 4, moss)
  base.position.set(0, 0.6, 0)
  ruinRoot.add(base)

  const pillarL = createRuinBlock(0.9, 3.2, 0.9, stone)
  pillarL.position.set(-1.6, 2.2, 0.8)
  ruinRoot.add(pillarL)

  const pillarR = createRuinBlock(0.9, 2.0, 0.9, stone)
  pillarR.position.set(1.4, 1.6, -0.6)
  pillarR.rotation.z = 0.12
  ruinRoot.add(pillarR)

  const arch = createRuinBlock(4.2, 0.7, 0.8, stone)
  arch.position.set(0, 3.5, 0.2)
  ruinRoot.add(arch)

  const rubble = createRuinBlock(1.2, 0.5, 1.0, moss)
  rubble.position.set(2.2, 0.25, 1.2)
  rubble.rotation.y = 0.4
  ruinRoot.add(rubble)

  placeOnGround(ruinRoot, 18, 22)
  scene.add(ruinRoot)

  const hubRuin = ruinRoot.clone()
  hubRuin.position.set(0, 0, 0)
  placeOnGround(hubRuin, -6, 14)
  hubRuin.scale.setScalar(1.3)
  scene.add(hubRuin)
}

function addGrassTufts(scene: THREE.Scene): void {
  const mat = flatMat(0x4cb85a)
  for (let i = 0; i < 80; i++) {
    const x = (Math.sin(i * 2.17) * 0.5 + 0.5) * 70 - 35
    const z = (Math.cos(i * 1.83) * 0.5 + 0.5) * 70 - 35
    if (Math.hypot(x + 42, z - 8) < 18) continue
    const tuft = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.35, 4), mat)
    tuft.scale.setScalar(0.8 + (i % 5) * 0.1)
    placeOnGround(tuft, x, z, 0.05)
    scene.add(tuft)
  }
}

export function buildLandscapeProps(scene: THREE.Scene): void {
  scatterPines(scene)
  addMountains(scene)
  addRuins(scene)
  addGrassTufts(scene)
}
