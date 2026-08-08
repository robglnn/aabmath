import * as THREE from 'three'

const DIG_RATE = 0.35
const REVEAL_THRESHOLD = 1

function makeGlyph(): THREE.Group {
  const g = new THREE.Group()
  const core = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.45, 0),
    new THREE.MeshLambertMaterial({
      color: 0xffd166,
      emissive: 0xffa020,
      emissiveIntensity: 0.6,
      flatShading: true,
    }),
  )
  g.add(core)

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.55, 0.06, 4, 8),
    new THREE.MeshBasicMaterial({ color: 0x5eb7ff, transparent: true, opacity: 0.7 }),
  )
  ring.rotation.x = Math.PI / 2
  g.add(ring)

  g.visible = false
  return g
}

export interface DigSiteState {
  siteId: string
  position: THREE.Vector3
  progress: number
  revealed: boolean
  craterMesh: THREE.Object3D
  artifact: THREE.Group
}

export class DigSiteManager {
  readonly sites: DigSiteState[] = []

  constructor(scene: THREE.Scene, craterMesh: THREE.Object3D, siteId: string) {
    const artifact = makeGlyph()
    const pos = craterMesh.position.clone()
    artifact.position.copy(pos)
    artifact.position.y += 0.3
    scene.add(artifact)

    this.sites.push({
      siteId,
      position: pos,
      progress: 0,
      revealed: false,
      craterMesh,
      artifact,
    })
  }

  /** Returns true when a site was just fully revealed. */
  applyLaser(
    originL: THREE.Vector3,
    _originR: THREE.Vector3,
    dir: THREE.Vector3,
    dt: number,
    firing: boolean,
  ): string | null {
    if (!firing) return null
    let justRevealed: string | null = null

    for (const site of this.sites) {
      if (site.revealed) continue
      const toSite = site.position.clone().sub(originL)
      const along = toSite.dot(dir)
      if (along < 0.5 || along > 18) continue
      const closest = originL.clone().add(dir.clone().multiplyScalar(along))
      const dist = closest.distanceTo(site.position)
      if (dist > 3.5) continue

      site.progress += DIG_RATE * dt
      this.pulseCrater(site, site.progress)

      if (site.progress >= REVEAL_THRESHOLD && !site.revealed) {
        site.revealed = true
        site.artifact.visible = true
        justRevealed = site.siteId
      }
    }
    return justRevealed
  }

  private pulseCrater(site: DigSiteState, progress: number): void {
    const scale = 1 - progress * 0.15
    site.craterMesh.scale.set(scale, 1, scale)
    site.artifact.position.y = site.position.y - 0.3 + progress * 0.8
  }

  update(elapsed: number): void {
    for (const site of this.sites) {
      if (!site.revealed) continue
      site.artifact.rotation.y = elapsed * 1.2
      site.artifact.position.y = site.position.y + 0.5 + Math.sin(elapsed * 2) * 0.12
    }
  }

  dispose(scene: THREE.Scene): void {
    for (const site of this.sites) {
      scene.remove(site.artifact)
      site.artifact.traverse((c) => {
        if (c instanceof THREE.Mesh) {
          c.geometry.dispose()
          if (Array.isArray(c.material)) c.material.forEach((m) => m.dispose())
          else c.material.dispose()
        }
      })
    }
  }
}

export class PalmLaserSystem {
  private beamL: THREE.Mesh
  private beamR: THREE.Mesh
  private glowL: THREE.PointLight
  private glowR: THREE.PointLight
  private readonly tmpDir = new THREE.Vector3()
  private readonly tmpTarget = new THREE.Vector3()

  constructor(scene: THREE.Scene) {
    const beamGeo = new THREE.CylinderGeometry(0.04, 0.06, 1, 5)
    beamGeo.rotateX(Math.PI / 2)
    beamGeo.translate(0, 0, 0.5)

    this.beamL = new THREE.Mesh(
      beamGeo,
      new THREE.MeshBasicMaterial({ color: 0xa8e8ff, transparent: true, opacity: 0.85 }),
    )
    this.beamR = new THREE.Mesh(
      beamGeo.clone(),
      new THREE.MeshBasicMaterial({ color: 0xffa040, transparent: true, opacity: 0.85 }),
    )
    this.beamL.visible = false
    this.beamR.visible = false
    scene.add(this.beamL, this.beamR)

    this.glowL = new THREE.PointLight(0x88ccff, 0, 8)
    this.glowR = new THREE.PointLight(0xff8833, 0, 8)
    scene.add(this.glowL, this.glowR)
  }

  update(
    firing: boolean,
    handL: THREE.Vector3,
    handR: THREE.Vector3,
    aimPoint: THREE.Vector3,
  ): void {
    if (!firing) {
      this.beamL.visible = false
      this.beamR.visible = false
      this.glowL.intensity = 0
      this.glowR.intensity = 0
      return
    }

    this.aimBeam(this.beamL, handL, aimPoint, 0xa8e8ff)
    this.aimBeam(this.beamR, handR, aimPoint, 0xffa040)
    this.glowL.position.copy(handL)
    this.glowR.position.copy(handR)
    this.glowL.intensity = 1.2
    this.glowR.intensity = 1.2
  }

  getAimDirection(handL: THREE.Vector3, handR: THREE.Vector3, playerYaw: number): THREE.Vector3 {
    const mid = handL.clone().add(handR).multiplyScalar(0.5)
    this.tmpDir.set(-Math.sin(playerYaw), -0.12, -Math.cos(playerYaw)).normalize()
    this.tmpTarget.copy(mid).add(this.tmpDir.clone().multiplyScalar(12))
    return this.tmpDir
  }

  getAimPoint(handL: THREE.Vector3, handR: THREE.Vector3, playerYaw: number): THREE.Vector3 {
    const mid = handL.clone().add(handR).multiplyScalar(0.5)
    this.tmpTarget.copy(mid).add(
      new THREE.Vector3(-Math.sin(playerYaw), -0.12, -Math.cos(playerYaw)).normalize().multiplyScalar(10),
    )
    return this.tmpTarget
  }

  private aimBeam(beam: THREE.Mesh, origin: THREE.Vector3, target: THREE.Vector3, _color: number): void {
    beam.visible = true
    const dir = target.clone().sub(origin)
    const len = dir.length()
    beam.position.copy(origin)
    beam.scale.set(1, 1, len)
    beam.lookAt(target)
    beam.rotateX(Math.PI / 2)
  }

  dispose(scene: THREE.Scene): void {
    scene.remove(this.beamL, this.beamR, this.glowL, this.glowR)
    this.beamL.geometry.dispose()
    this.beamR.geometry.dispose()
    ;(this.beamL.material as THREE.Material).dispose()
    ;(this.beamR.material as THREE.Material).dispose()
  }
}
