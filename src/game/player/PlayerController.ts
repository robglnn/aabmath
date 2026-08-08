import * as THREE from 'three'
import { sampleTerrainHeight } from '../world/terrain'

function flatMat(color: number): THREE.MeshLambertMaterial {
  return new THREE.MeshLambertMaterial({ color, flatShading: true })
}

/** Low-poly blocky tactical character (PS1/PS2 read). */
export function createPlayerMesh(): THREE.Group {
  const root = new THREE.Group()
  root.name = 'player'

  const skin = flatMat(0xc49a6c)
  const suit = flatMat(0x1a1a22)
  const glove = flatMat(0x2a2a32)

  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.85, 0.38), suit)
  torso.position.y = 1.15
  root.add(torso)

  const head = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.42, 0.42), skin)
  head.position.y = 1.85
  root.add(head)

  const hair = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.12, 0.44), flatMat(0x1a1010))
  hair.position.y = 2.08
  root.add(hair)

  const makeLimb = (w: number, h: number, d: number, mat: THREE.Material, x: number, y: number): THREE.Mesh => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
    m.position.set(x, y, 0)
    return m
  }

  const armL = makeLimb(0.22, 0.65, 0.22, suit, -0.48, 1.2)
  const armR = makeLimb(0.22, 0.65, 0.22, suit, 0.48, 1.2)
  root.add(armL, armR)

  const handL = makeLimb(0.2, 0.2, 0.2, glove, -0.48, 0.82)
  const handR = makeLimb(0.2, 0.2, 0.2, glove, 0.48, 0.82)
  handL.name = 'handL'
  handR.name = 'handR'
  root.add(handL, handR)

  const legL = makeLimb(0.26, 0.7, 0.28, suit, -0.2, 0.45)
  const legR = makeLimb(0.26, 0.7, 0.28, suit, 0.2, 0.45)
  root.add(legL, legR)

  const bootL = makeLimb(0.28, 0.18, 0.34, flatMat(0x111118), -0.2, 0.09)
  const bootR = makeLimb(0.28, 0.18, 0.34, flatMat(0x111118), 0.2, 0.09)
  root.add(bootL, bootR)

  return root
}

export interface PlayerState {
  mesh: THREE.Group
  yaw: number
  speed: number
}

const MOVE_SPEED = 7
const TURN_SPEED = 10

export class PlayerController {
  readonly mesh: THREE.Group
  yaw = Math.PI
  private walkPhase = 0

  constructor(scene: THREE.Scene) {
    this.mesh = createPlayerMesh()
    this.mesh.position.set(0, 0, 6)
    scene.add(this.mesh)
    this.snapToGround()
  }

  getHandWorldPosition(side: 'left' | 'right'): THREE.Vector3 {
    const hand = this.mesh.getObjectByName(side === 'left' ? 'handL' : 'handR')
    const pos = new THREE.Vector3()
    if (hand) hand.getWorldPosition(pos)
    else {
      pos.copy(this.mesh.position)
      pos.y += 1.0
      pos.x += side === 'left' ? -0.5 : 0.5
    }
    return pos
  }

  update(
    dt: number,
    moveX: number,
    moveY: number,
    cameraYaw: number,
  ): void {
    const moving = Math.hypot(moveX, moveY) > 0.05
    if (moving) {
      const fwd = new THREE.Vector3(-Math.sin(cameraYaw), 0, -Math.cos(cameraYaw))
      const right = new THREE.Vector3(Math.cos(cameraYaw), 0, -Math.sin(cameraYaw))
      const dir = new THREE.Vector3()
        .addScaledVector(fwd, -moveY)
        .addScaledVector(right, moveX)
      if (dir.lengthSq() > 0.0001) {
        dir.normalize()
        this.mesh.position.x += dir.x * MOVE_SPEED * dt
        this.mesh.position.z += dir.z * MOVE_SPEED * dt
        this.yaw = Math.atan2(dir.x, dir.z)
      }
      this.walkPhase += dt * 9
    } else {
      this.walkPhase *= 0.9
    }

    this.mesh.rotation.y = THREE.MathUtils.lerp(
      this.mesh.rotation.y,
      this.yaw,
      1 - Math.exp(-TURN_SPEED * dt),
    )

    this.snapToGround()
    this.animateWalk()
  }

  private snapToGround(): void {
    const { x, z } = this.mesh.position
    this.mesh.position.y = sampleTerrainHeight(x, z)
  }

  private animateWalk(): void {
    const swing = Math.sin(this.walkPhase) * 0.35
    const armL = this.mesh.getObjectByName('handL')
    const armR = this.mesh.getObjectByName('handR')
    if (armL) armL.rotation.x = swing
    if (armR) armR.rotation.x = -swing
  }

  dispose(scene: THREE.Scene): void {
    scene.remove(this.mesh)
    this.mesh.traverse((c) => {
      if (c instanceof THREE.Mesh) {
        c.geometry.dispose()
        if (Array.isArray(c.material)) c.material.forEach((m) => m.dispose())
        else c.material.dispose()
      }
    })
  }
}
