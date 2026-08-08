import * as THREE from 'three'
import { sampleTerrainHeight } from './terrain'

export interface WorldSite {
  siteId: string
  mesh: THREE.Object3D
  position: THREE.Vector3
  interactRadius: number
}

function flatMat(color: number, emissive = 0): THREE.MeshLambertMaterial {
  return new THREE.MeshLambertMaterial({
    color,
    emissive: emissive || color,
    emissiveIntensity: emissive ? 0.35 : 0,
    flatShading: true,
  })
}

function placeOnGround(obj: THREE.Object3D, x: number, z: number, yOffset = 0): void {
  const y = sampleTerrainHeight(x, z) + yOffset
  obj.position.set(x, y, z)
}

/** Chalkboard lesson site — siteId: lesson_board_1 */
function createLessonBoard(): THREE.Group {
  const g = new THREE.Group()
  const frame = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.8, 0.25), flatMat(0x5a4030))
  frame.position.y = 2.2
  g.add(frame)

  const board = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.2, 0.12), flatMat(0x1a3020))
  board.position.set(0, 2.2, 0.1)
  g.add(board)

  const vineMat = flatMat(0x2d8a3a)
  for (let i = 0; i < 4; i++) {
    const vine = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.8 + i * 0.2, 0.15), vineMat)
    vine.position.set(-1.8 + i * 1.1, 1.2, 0.2)
    g.add(vine)
  }

  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.2, 0.2), flatMat(0x4a3528))
  legL.position.set(-1.6, 0.6, 0)
  const legR = legL.clone()
  legR.position.x = 1.6
  g.add(legL, legR)

  const stand = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.15, 0.15), flatMat(0x4a3528))
  stand.position.y = 0.08
  g.add(stand)

  return g
}

/** Progress pedestal — siteId: progress_pedestal */
function createProgressPedestal(): THREE.Group {
  const g = new THREE.Group()
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.8, 0.6, 6), flatMat(0x7a7568))
  base.position.y = 0.3
  g.add(base)

  const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 2.2, 6), flatMat(0x8a8578))
  pillar.position.y = 1.6
  g.add(pillar)

  const screen = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.6, 0.12), flatMat(0x1a4a8a, 0x3a8aff))
  screen.position.set(0, 2.8, 0.5)
  g.add(screen)

  const glow = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 1.8, 0.05),
    new THREE.MeshBasicMaterial({ color: 0x5eb7ff, transparent: true, opacity: 0.25 }),
  )
  glow.position.set(0, 2.8, 0.62)
  g.add(glow)

  return g
}

/** Hub plaza marker with floating glyphs — siteId: hub_plaza */
function createHubPlaza(): THREE.Group {
  const g = new THREE.Group()
  const plaza = new THREE.Mesh(new THREE.CylinderGeometry(5, 5.5, 0.15, 8), flatMat(0x6a8a70))
  plaza.position.y = 0.08
  g.add(plaza)

  const ring = new THREE.Mesh(new THREE.TorusGeometry(4.2, 0.12, 4, 12), flatMat(0x9ab0a0))
  ring.rotation.x = Math.PI / 2
  ring.position.y = 0.2
  g.add(ring)

  const glyphShapes = ['x', 'π', '∫', 'θ']
  const colors = [0xffd166, 0x5eb7ff, 0x3dff9a, 0xff8c42]
  for (let i = 0; i < glyphShapes.length; i++) {
    const glyph = new THREE.Mesh(new THREE.OctahedronGeometry(0.35, 0), flatMat(colors[i], colors[i]))
    const angle = (i / glyphShapes.length) * Math.PI * 2
    glyph.position.set(Math.cos(angle) * 2.8, 2.2 + (i % 2) * 0.4, Math.sin(angle) * 2.8)
    glyph.userData.glyphChar = glyphShapes[i]
    glyph.userData.spin = 0.4 + i * 0.15
    g.add(glyph)
  }

  return g
}

/** Dig crater — siteId: dig_crater_1 */
export function createDigCrater(): THREE.Group {
  const g = new THREE.Group()
  const rim = new THREE.Mesh(
    new THREE.RingGeometry(2.2, 3.4, 12),
    flatMat(0x5a4a38),
  )
  rim.rotation.x = -Math.PI / 2
  rim.position.y = 0.02
  g.add(rim)

  const pit = new THREE.Mesh(
    new THREE.CylinderGeometry(2.2, 1.6, 0.8, 10, 1, true),
    flatMat(0x4a3828),
  )
  pit.position.y = -0.3
  g.add(pit)

  const dirt = new THREE.Mesh(new THREE.CircleGeometry(2.0, 10), flatMat(0x6a5038))
  dirt.rotation.x = -Math.PI / 2
  dirt.position.y = -0.05
  g.add(dirt)

  return g
}

export function buildWorldSites(scene: THREE.Scene): WorldSite[] {
  const sites: WorldSite[] = []

  const board = createLessonBoard()
  placeOnGround(board, -12, -8)
  board.rotation.y = 0.35
  scene.add(board)
  sites.push({
    siteId: 'lesson_board_1',
    mesh: board,
    position: board.position.clone(),
    interactRadius: 4,
  })

  const board2 = createLessonBoard()
  placeOnGround(board2, -6, 4)
  board2.rotation.y = -0.2
  scene.add(board2)
  sites.push({
    siteId: 'lesson_board_2',
    mesh: board2,
    position: board2.position.clone(),
    interactRadius: 4,
  })

  const board3 = createLessonBoard()
  placeOnGround(board3, 2, -14)
  board3.rotation.y = 0.6
  scene.add(board3)
  sites.push({
    siteId: 'lesson_board_3',
    mesh: board3,
    position: board3.position.clone(),
    interactRadius: 4,
  })

  const board4 = createLessonBoard()
  placeOnGround(board4, 22, 8)
  board4.rotation.y = -0.45
  scene.add(board4)
  sites.push({
    siteId: 'lesson_board_4',
    mesh: board4,
    position: board4.position.clone(),
    interactRadius: 4,
  })

  const board5 = createLessonBoard()
  placeOnGround(board5, -22, 10)
  board5.rotation.y = 0.85
  scene.add(board5)
  sites.push({
    siteId: 'lesson_board_5',
    mesh: board5,
    position: board5.position.clone(),
    interactRadius: 4,
  })

  const board6 = createLessonBoard()
  placeOnGround(board6, 6, 26)
  board6.rotation.y = -0.15
  scene.add(board6)
  sites.push({
    siteId: 'lesson_board_6',
    mesh: board6,
    position: board6.position.clone(),
    interactRadius: 4,
  })

  const board7 = createLessonBoard()
  placeOnGround(board7, 16, 20)
  board7.rotation.y = 0.4
  scene.add(board7)
  sites.push({
    siteId: 'lesson_board_7',
    mesh: board7,
    position: board7.position.clone(),
    interactRadius: 4,
  })

  const board8 = createLessonBoard()
  placeOnGround(board8, -14, 22)
  board8.rotation.y = -0.7
  scene.add(board8)
  sites.push({
    siteId: 'lesson_board_8',
    mesh: board8,
    position: board8.position.clone(),
    interactRadius: 4,
  })

  const board9 = createLessonBoard()
  placeOnGround(board9, 24, -12)
  board9.rotation.y = 1.1
  scene.add(board9)
  sites.push({
    siteId: 'lesson_board_9',
    mesh: board9,
    position: board9.position.clone(),
    interactRadius: 4,
  })

  const board10 = createLessonBoard()
  placeOnGround(board10, -26, -8)
  board10.rotation.y = 0.55
  scene.add(board10)
  sites.push({
    siteId: 'lesson_board_10',
    mesh: board10,
    position: board10.position.clone(),
    interactRadius: 4,
  })

  const board11 = createLessonBoard()
  placeOnGround(board11, 28, -4)
  board11.rotation.y = -0.95
  scene.add(board11)
  sites.push({
    siteId: 'lesson_board_11',
    mesh: board11,
    position: board11.position.clone(),
    interactRadius: 4,
  })

  const board12 = createLessonBoard()
  placeOnGround(board12, -4, 32)
  board12.rotation.y = 0.25
  scene.add(board12)
  sites.push({
    siteId: 'lesson_board_12',
    mesh: board12,
    position: board12.position.clone(),
    interactRadius: 4,
  })

  const board13 = createLessonBoard()
  placeOnGround(board13, 18, 30)
  board13.rotation.y = -0.4
  scene.add(board13)
  sites.push({
    siteId: 'lesson_board_13',
    mesh: board13,
    position: board13.position.clone(),
    interactRadius: 4,
  })

  const board14 = createLessonBoard()
  placeOnGround(board14, -30, 18)
  board14.rotation.y = 0.85
  scene.add(board14)
  sites.push({
    siteId: 'lesson_board_14',
    mesh: board14,
    position: board14.position.clone(),
    interactRadius: 4,
  })

  const board15 = createLessonBoard()
  placeOnGround(board15, 12, -26)
  board15.rotation.y = -1.2
  scene.add(board15)
  sites.push({
    siteId: 'lesson_board_15',
    mesh: board15,
    position: board15.position.clone(),
    interactRadius: 4,
  })

  const board16 = createLessonBoard()
  placeOnGround(board16, -20, -22)
  board16.rotation.y = 0.7
  scene.add(board16)
  sites.push({
    siteId: 'lesson_board_16',
    mesh: board16,
    position: board16.position.clone(),
    interactRadius: 4,
  })

  const board17 = createLessonBoard()
  placeOnGround(board17, 30, 22)
  board17.rotation.y = -0.55
  scene.add(board17)
  sites.push({
    siteId: 'lesson_board_17',
    mesh: board17,
    position: board17.position.clone(),
    interactRadius: 4,
  })

  const board18 = createLessonBoard()
  placeOnGround(board18, 4, -34)
  board18.rotation.y = 1.35
  scene.add(board18)
  sites.push({
    siteId: 'lesson_board_18',
    mesh: board18,
    position: board18.position.clone(),
    interactRadius: 4,
  })

  const pedestal = createProgressPedestal()
  placeOnGround(pedestal, 14, -6)
  pedestal.rotation.y = -0.5
  scene.add(pedestal)
  sites.push({
    siteId: 'progress_pedestal',
    mesh: pedestal,
    position: pedestal.position.clone(),
    interactRadius: 3.5,
  })

  const hub = createHubPlaza()
  placeOnGround(hub, 0, 12)
  scene.add(hub)
  sites.push({
    siteId: 'hub_plaza',
    mesh: hub,
    position: hub.position.clone(),
    interactRadius: 6,
  })

  const crater = createDigCrater()
  placeOnGround(crater, 10, 18, -0.15)
  scene.add(crater)
  sites.push({
    siteId: 'dig_crater_1',
    mesh: crater,
    position: crater.position.clone(),
    interactRadius: 4,
  })

  return sites
}

/** Animate hub glyphs — call from world update. */
export function updateHubGlyphs(hubMesh: THREE.Object3D, t: number): void {
  hubMesh.traverse((child) => {
    if (child instanceof THREE.Mesh && child.userData.spin) {
      child.rotation.y = t * child.userData.spin
      child.position.y = 2.2 + Math.sin(t * 1.5 + child.position.x) * 0.25
    }
  })
}
