import * as THREE from 'three'

const WORLD_SIZE = 200
const SEGMENTS = 48

/** Deterministic height field for PS1-style faceted terrain. */
export function sampleTerrainHeight(x: number, z: number): number {
  const s1 = Math.sin(x * 0.07) * Math.cos(z * 0.05) * 1.2
  const s2 = Math.sin(x * 0.15 + 1.3) * Math.sin(z * 0.12) * 0.5
  const s3 = Math.sin((x + z) * 0.04) * 0.35
  const ridge = Math.max(0, Math.sin(x * 0.02 - 8) * 2.5 - 1.8)
  return s1 + s2 + s3 + ridge * 0.4
}

export function createTerrain(scene: THREE.Scene): THREE.Mesh {
  const geo = new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE, SEGMENTS, SEGMENTS)
  geo.rotateX(-Math.PI / 2)

  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const z = pos.getZ(i)
    pos.setY(i, sampleTerrainHeight(x, z))
  }
  pos.needsUpdate = true
  geo.computeVertexNormals()

  const mat = new THREE.MeshLambertMaterial({
    color: 0x3d9f4a,
    flatShading: true,
  })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.receiveShadow = true
  scene.add(mesh)
  return mesh
}

/** River / lake depression hint along negative X band. */
export function createWaterHint(scene: THREE.Scene): THREE.Mesh {
  const geo = new THREE.PlaneGeometry(28, 70, 6, 14)
  geo.rotateX(-Math.PI / 2)
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i) - 42
    const z = pos.getZ(i) + 8
    pos.setX(i, x)
    pos.setZ(i, z)
    pos.setY(i, sampleTerrainHeight(x, z) - 0.55)
  }
  pos.needsUpdate = true
  geo.computeVertexNormals()

  const mat = new THREE.MeshLambertMaterial({
    color: 0x2a7fd4,
    flatShading: true,
    transparent: true,
    opacity: 0.82,
  })
  const water = new THREE.Mesh(geo, mat)
  scene.add(water)
  return water
}

export { WORLD_SIZE }
