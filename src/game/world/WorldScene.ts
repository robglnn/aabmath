import * as THREE from 'three'
import { createTerrain, createWaterHint } from './terrain'
import { buildLandscapeProps } from './props'
import { buildWorldSites, updateHubGlyphs, type WorldSite } from './WorldSites'

export interface WorldContext {
  sites: WorldSite[]
  hubMesh: THREE.Object3D | null
  digCraterMesh: THREE.Object3D | null
}

export function buildWorld(scene: THREE.Scene): WorldContext {
  createTerrain(scene)
  createWaterHint(scene)
  buildLandscapeProps(scene)

  const sites = buildWorldSites(scene)
  const hub = sites.find((s) => s.siteId === 'hub_plaza')
  const crater = sites.find((s) => s.siteId === 'dig_crater_1')

  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(180, 12, 8),
    new THREE.MeshBasicMaterial({ color: 0x87b7ff, side: THREE.BackSide }),
  )
  scene.add(sky)

  return {
    sites,
    hubMesh: hub?.mesh ?? null,
    digCraterMesh: crater?.mesh ?? null,
  }
}

export function updateWorld(ctx: WorldContext, elapsed: number): void {
  if (ctx.hubMesh) {
    updateHubGlyphs(ctx.hubMesh, elapsed)
  }
}

export type { WorldSite }
