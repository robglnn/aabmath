import * as THREE from 'three'
import { loadAlgebra1Content, lessonByWorldSite } from '../content/loadContent'
import { HudController } from '../ui/HudController'
import { buildProgressReportData } from './lesson/buildProgressReport'
import { LessonRunner } from './lesson/LessonRunner'
import { InputManager } from './input/InputManager'
import { PlayerController } from './player/PlayerController'
import { ThirdPersonCamera } from './player/ThirdPersonCamera'
import { DigSiteManager, PalmLaserSystem } from './laser/PalmLaser'
import { buildWorld, updateWorld, type WorldContext } from './world/WorldScene'
import { createDefaultProgress, PedagogyEngine } from '../pedagogy/PedagogyEngine'

/**
 * Composition root — wires world, player, camera, lasers, input, HUD.
 */
export class GameApp {
  readonly scene = new THREE.Scene()
  readonly camera = new THREE.PerspectiveCamera(60, 1, 0.1, 500)
  readonly renderer: THREE.WebGLRenderer
  readonly hud: HudController

  private raf = 0
  private disposed = false
  private lastT = performance.now()
  private elapsed = 0

  private readonly input: InputManager
  private readonly world: WorldContext
  private readonly player: PlayerController
  private readonly followCam: ThirdPersonCamera
  private readonly lasers: PalmLaserSystem
  private readonly digSites: DigSiteManager
  private readonly nearSites = new Set<string>()
  private readonly clockTarget = new THREE.Vector3()

  private readonly content = loadAlgebra1Content()
  private readonly progress = createDefaultProgress()
  private readonly pedagogy = new PedagogyEngine(this.progress, this.content.knowledgePointById)
  private lessonRunner: LessonRunner | null = null
  private readonly unlockedSites = new Set<string>(['lesson_board_1'])

  constructor(
    readonly canvas: HTMLCanvasElement,
    readonly hudRoot: HTMLElement,
  ) {
    this.hud = new HudController(hudRoot)
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      powerPreference: 'high-performance',
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.scene.background = new THREE.Color(0x87b7ff)
    this.camera.position.set(0, 4, 8)

    const hemi = new THREE.HemisphereLight(0xb1e1ff, 0x446633, 1.1)
    const sun = new THREE.DirectionalLight(0xfff0dd, 1.2)
    sun.position.set(40, 60, 20)
    this.scene.add(hemi, sun)

    this.world = buildWorld(this.scene)
    this.player = new PlayerController(this.scene)
    this.followCam = new ThirdPersonCamera(this.camera)
    this.lasers = new PalmLaserSystem(this.scene)

    const crater = this.world.digCraterMesh
    if (!crater) {
      throw new Error('dig_crater_1 missing from world sites')
    }
    this.digSites = new DigSiteManager(this.scene, crater, 'dig_crater_1')

    this.input = new InputManager(canvas, hudRoot, { mountTouch: false })

    this.wireHudCallbacks()
    this.wireWorldHooks()
    this.syncHudStats()
    this.onResize()
    window.addEventListener('resize', this.onResize)
  }

  start(): void {
    this.hud.showDigControls()
    this.lastT = performance.now()
    const tick = () => {
      if (this.disposed) return
      this.raf = requestAnimationFrame(tick)

      const now = performance.now()
      const dt = Math.min(0.05, (now - this.lastT) / 1000)
      this.lastT = now
      this.elapsed += dt

      this.input.beginFrame()
      const look = this.input.getLook()
      this.followCam.applyLook(look.dx, look.dy)

      const move = this.input.getMove()
      this.player.update(dt, move.x, move.y, this.followCam.yaw)

      this.clockTarget.set(
        this.player.mesh.position.x,
        this.player.mesh.position.y,
        this.player.mesh.position.z,
      )
      this.followCam.follow(this.clockTarget, dt)

      const firing = this.input.isFireHeld()
      const handL = this.player.getHandWorldPosition('left')
      const handR = this.player.getHandWorldPosition('right')
      const aimPoint = this.lasers.getAimPoint(handL, handR, this.player.yaw)
      const aimDir = this.lasers.getAimDirection(handL, handR, this.player.yaw)
      this.lasers.update(firing, handL, handR, aimPoint)

      const revealed = this.digSites.applyLaser(handL, handR, aimDir, dt, firing)
      if (revealed) {
        this.dispatchWorldHook(revealed, 'dig_revealed')
        this.hud.showUnlockToast('GEOMETRY')
      }
      this.digSites.update(this.elapsed)
      updateWorld(this.world, this.elapsed)
      this.pollSiteProximity()

      this.renderer.render(this.scene, this.camera)
    }
    tick()
  }

  dispose(): void {
    this.disposed = true
    cancelAnimationFrame(this.raf)
    window.removeEventListener('resize', this.onResize)
    this.input.dispose()
    this.player.dispose(this.scene)
    this.lasers.dispose(this.scene)
    this.digSites.dispose(this.scene)
    this.renderer.dispose()
  }

  openLesson(data?: Parameters<HudController['showLesson']>[0]): void {
    this.hud.hideDigControls()
    this.hud.showLesson(data)
  }

  openProgressReport(data?: Parameters<HudController['showProgressReport']>[0]): void {
    this.hud.showProgressReport(data)
  }

  openMainHub(data?: Parameters<HudController['showMainHub']>[0]): void {
    this.hud.hideDigControls()
    this.hud.showMainHub(data)
  }

  enterDigMode(): void {
    this.hud.hideAllScreens()
    this.hud.showDigControls()
  }

  private wireHudCallbacks(): void {
    this.hud.setCallbacks({
      onModuleSelect: (moduleId) => {
        if (moduleId === 'algebra1') {
          this.hud.hideMainHub()
          this.enterDigMode()
        }
      },
      onLessonSubmit: (answer) => {
        if (!this.lessonRunner) return
        const view = this.lessonRunner.submitAnswer(answer)
        this.openLesson(view)
        this.syncHudStats()
        if (view.gatePassed) {
          const lesson = this.lessonRunner.getLesson()
          for (const siteId of this.pedagogy.unlockSiteIds(lesson)) {
            this.unlockedSites.add(siteId)
            this.hud.showUnlockToast(lesson.title.en)
          }
        }
      },
      onLessonClose: () => {
        if (this.lessonRunner && !this.lessonRunner.canClose()) return
        this.lessonRunner = null
        this.enterDigMode()
      },
      onLocaleChange: (locale) => {
        this.progress.locale = locale
        if (this.lessonRunner) {
          this.lessonRunner.setLocale(locale)
          this.openLesson(this.lessonRunner.getViewState())
        }
      },
      dig: {
        onFireLaser: (held) => {
          this.input.setExternalFire(held)
        },
        onJoystick: (dx, dy) => {
          this.input.setExternalMove(dx, dy)
        },
      },
    })
  }

  private wireWorldHooks(): void {
    window.addEventListener('keydown', (e) => {
      if (e.code !== 'KeyE') return
      for (const siteId of this.nearSites) {
        if (siteId.startsWith('lesson_board')) {
          this.startLessonAtSite(siteId)
          return
        }
        if (siteId === 'progress_pedestal') {
          this.openProgressReport(buildProgressReportData(this.content, this.pedagogy))
          return
        }
        if (siteId === 'hub_plaza') {
          this.openMainHub()
          return
        }
      }
    })
  }

  private startLessonAtSite(siteId: string): void {
    if (!this.unlockedSites.has(siteId)) {
      this.hud.showUnlockToast('LOCKED')
      return
    }
    const lesson = lessonByWorldSite(this.content, siteId)
    if (!lesson) return
    this.lessonRunner = new LessonRunner(lesson, this.pedagogy, this.hud.getLocale())
    this.openLesson(this.lessonRunner.getViewState())
  }

  private syncHudStats(): void {
    const p = this.pedagogy.getProgress()
    const mastered = Object.values(p.mastery).filter((m) => m.status === 'mastered').length
    const totalKps = this.content.knowledgePoints.length
    this.hud.updateStats({
      score: p.score,
      progressPercent: totalKps > 0 ? (mastered / totalKps) * 100 : 0,
    })
  }

  private pollSiteProximity(): void {
    const px = this.player.mesh.position.x
    const pz = this.player.mesh.position.z
    for (const site of this.world.sites) {
      if (site.siteId.startsWith('lesson_board') && !this.unlockedSites.has(site.siteId)) {
        continue
      }
      const dx = site.mesh.position.x - px
      const dz = site.mesh.position.z - pz
      const near = dx * dx + dz * dz < 36
      const was = this.nearSites.has(site.siteId)
      if (near && !was) {
        this.nearSites.add(site.siteId)
        this.dispatchWorldHook(site.siteId, 'near')
      } else if (!near && was) {
        this.nearSites.delete(site.siteId)
      }
    }
  }

  private dispatchWorldHook(siteId: string, type: 'near' | 'dig_revealed'): void {
    this.hudRoot.dispatchEvent(
      new CustomEvent('axiom-world-hook', { detail: { siteId, type } }),
    )
  }

  private onResize = (): void => {
    const w = window.innerWidth
    const h = window.innerHeight
    this.camera.aspect = w / Math.max(h, 1)
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h, false)
  }
}
