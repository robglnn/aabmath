import type { Locale } from '../content/types'
import { createDefaultProgress } from '../pedagogy/PedagogyEngine'
import { LocaleSwitcher } from './components/LocaleSwitcher'
import { LessonScreen } from './components/LessonScreen'
import { MainHub } from './components/MainHub'
import { ProgressReport } from './components/ProgressReport'
import { StatusPanel } from './components/StatusPanel'
import { TouchControls } from './components/TouchControls'
import { VitalsBars } from './components/VitalsBars'
import type {
  HudCallbacks,
  HudStats,
  LessonScreenData,
  MainHubData,
  ProgressReportData,
} from './types'

export type {
  HudCallbacks,
  HudStats,
  LessonScreenData,
  MainHubData,
  ProgressReportData,
} from './types'

const DEFAULT_LESSON: LessonScreenData = {
  courseLabel: 'ALGEBRA 1',
  promptLatex: 'x + 3 = 7',
  standardsFooter: 'TEXAS TEKS 111.39 & COMMON CORE A-SSE',
}

const DEFAULT_PROGRESS: ProgressReportData = {
  masteryLines: [
    { topic: 'ALGEBRA 1', percent: 72 },
    { topic: 'GEOMETRY', percent: 85 },
  ],
  alignmentLines: [
    { label: 'TRIG: sin(θ) = 0.8', met: true },
    { label: 'TEKS 111.39', met: true },
  ],
  standardsCodes: 'TEXAS TEKS 111.39 & COMMON CORE A-SSE',
}

/**
 * DOM HUD facade — GameApp calls these show/hide APIs.
 * pointer-events only on `.interactive` children.
 */
export class HudController {
  private readonly statusPanel: StatusPanel
  private readonly vitalsBars: VitalsBars
  private readonly lessonScreen: LessonScreen
  private readonly progressReport: ProgressReport
  private readonly touchControls: TouchControls
  private readonly mainHub: MainHub
  private readonly localeSwitcher: LocaleSwitcher
  private locale: Locale = 'en'
  private stats: HudStats
  private callbacks: HudCallbacks = {}

  constructor(readonly root: HTMLElement) {
    this.stats = progressToStats(createDefaultProgress())

    this.statusPanel = new StatusPanel(root)
    this.vitalsBars = new VitalsBars(root)
    this.lessonScreen = new LessonScreen(root)
    this.progressReport = new ProgressReport(root)
    this.touchControls = new TouchControls(root)
    this.mainHub = new MainHub(root)
    this.localeSwitcher = new LocaleSwitcher(root)

    this.localeSwitcher.setOnChange((locale) => {
      this.setLocale(locale)
      this.callbacks.onLocaleChange?.(locale)
    })

    this.lessonScreen.setCallbacks(
      (answer) => this.callbacks.onLessonSubmit?.(answer),
      () => {
        this.hideLesson()
        this.callbacks.onLessonClose?.()
      },
    )

    this.mainHub.setCallbacks((moduleId) => this.callbacks.onModuleSelect?.(moduleId))

    this.setLocale('en')
    this.refreshStats()
  }

  /** Wire game-level callbacks (module select, dig, lesson, locale). */
  setCallbacks(callbacks: HudCallbacks): void {
    this.callbacks = callbacks
    if (callbacks.dig) {
      this.touchControls.setCallbacks(callbacks.dig)
    }
  }

  getLocale(): Locale {
    return this.locale
  }

  setLocale(locale: Locale): void {
    this.locale = locale
    this.statusPanel.setLocale(locale)
    this.vitalsBars.setLocale(locale)
    this.lessonScreen.setLocale(locale)
    this.progressReport.setLocale(locale)
    this.touchControls.setLocale(locale)
    this.mainHub.setLocale(locale)
    this.localeSwitcher.setLocale(locale)
  }

  updateStats(stats: Partial<HudStats>): void {
    this.stats = { ...this.stats, ...stats }
    this.refreshStats()
  }

  /** Show persistent HUD chrome (vitals + status). */
  showChrome(options?: { showProgress?: boolean }): void {
    this.statusPanel.setVisible(true)
    this.vitalsBars.setVisible(true)
    this.statusPanel.update(this.stats, options?.showProgress ?? true)
    this.vitalsBars.update(this.stats)
  }

  hideChrome(): void {
    this.statusPanel.setVisible(false)
    this.vitalsBars.setVisible(false)
  }

  // ── Lesson ──────────────────────────────────────────────

  showLesson(data?: Partial<LessonScreenData>): void {
    this.showChrome({ showProgress: false })
    this.lessonScreen.show({ ...DEFAULT_LESSON, ...data })
  }

  hideLesson(): void {
    this.lessonScreen.hide()
  }

  isLessonVisible(): boolean {
    return this.lessonScreen.isVisible()
  }

  // ── Progress Report ─────────────────────────────────────

  showProgressReport(data?: Partial<ProgressReportData>): void {
    this.showChrome()
    this.progressReport.show({ ...DEFAULT_PROGRESS, ...data })
  }

  hideProgressReport(): void {
    this.progressReport.hide()
  }

  isProgressReportVisible(): boolean {
    return this.progressReport.isVisible()
  }

  // ── Dig / Touch Controls ────────────────────────────────

  showDigControls(): void {
    this.showChrome()
    this.touchControls.show()
  }

  hideDigControls(): void {
    this.touchControls.hide()
  }

  isDigControlsVisible(): boolean {
    return this.touchControls.isVisible()
  }

  showUnlockToast(topic: string): void {
    this.touchControls.showUnlockToast(topic)
  }

  hideUnlockToast(): void {
    this.touchControls.hideUnlockToast()
  }

  // ── Main Hub ────────────────────────────────────────────

  showMainHub(data?: MainHubData): void {
    this.showChrome()
    this.mainHub.show(data)
  }

  hideMainHub(): void {
    this.mainHub.hide()
  }

  isMainHubVisible(): boolean {
    return this.mainHub.isVisible()
  }

  /** Hide all overlay screens; chrome stays per last showChrome call. */
  hideAllScreens(): void {
    this.lessonScreen.hide()
    this.progressReport.hide()
    this.touchControls.hide()
    this.mainHub.hide()
  }

  private refreshStats(): void {
    this.statusPanel.update(this.stats, true)
    this.vitalsBars.update(this.stats)
  }
}

function progressToStats(p: ReturnType<typeof createDefaultProgress>): HudStats {
  const mastered = Object.values(p.mastery).filter((m) => m.status === 'mastered').length
  const total = Object.keys(p.mastery).length || 3
  return {
    rank: p.rank,
    score: p.score,
    progressPercent: total > 0 ? (mastered / total) * 100 : 45,
    health: p.health,
    energy: p.energy,
    trigMeter: 62,
  }
}
