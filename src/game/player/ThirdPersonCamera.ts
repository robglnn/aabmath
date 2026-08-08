import * as THREE from 'three'

const MIN_PITCH = -0.35
const MAX_PITCH = 0.55
const DIST = 5.5
const HEIGHT = 2.2
const LOOK_SENS = 0.004

export class ThirdPersonCamera {
  yaw = Math.PI
  pitch = 0.15

  constructor(readonly camera: THREE.PerspectiveCamera) {}

  applyLook(dx: number, dy: number): void {
    this.yaw -= dx * LOOK_SENS
    this.pitch -= dy * LOOK_SENS
    this.pitch = THREE.MathUtils.clamp(this.pitch, MIN_PITCH, MAX_PITCH)
  }

  follow(target: THREE.Vector3, dt: number): void {
    const offset = new THREE.Vector3(
      Math.sin(this.yaw) * Math.cos(this.pitch) * DIST,
      HEIGHT + Math.sin(this.pitch) * DIST * 0.5,
      Math.cos(this.yaw) * Math.cos(this.pitch) * DIST,
    )
    const desired = target.clone().add(offset)
    this.camera.position.lerp(desired, 1 - Math.exp(-8 * dt))
    this.camera.lookAt(target.x, target.y + 1.4, target.z)
  }
}
