import type { Locale } from '../content/types'

export interface HudStats {
  rank: string
  score: number
  progressPercent: number
  health: number
  energy: number
  trigMeter: number
}

export interface MasteryLine {
  topic: string
  percent: number
}

export interface StandardAlignmentLine {
  label: string
  met: boolean
}

export interface LessonScreenData {
  courseLabel: string
  lessonTitle?: string
  phaseLabel?: string
  promptLatex: string
  promptText?: string
  sectionBodyMath?: string[]
  choices?: string[]
  standardsFooter: string
  masteryPercent?: number
  showMasteryGate?: boolean
  gatePassed?: boolean
  gateFailed?: boolean
  feedbackText?: string
  closeDisabled?: boolean
  inputMode?: 'text' | 'choices' | 'none'
  submitLabel?: 'submit' | 'continue' | 'retry'
}

export interface ProgressReportData {
  masteryLines: MasteryLine[]
  alignmentLines: StandardAlignmentLine[]
  standardsCodes?: string
}

export interface MainHubModule {
  id: string
  labelKey: 'hub.algebra1' | 'hub.algebra2' | 'hub.trig' | 'hub.geometry'
  playable: boolean
}

export interface MainHubData {
  modules?: MainHubModule[]
}

export interface DigControlsCallbacks {
  onMove?: (active: boolean) => void
  onFireLaser?: (held: boolean) => void
  onJoystick?: (dx: number, dy: number) => void
}

export interface HudCallbacks {
  onModuleSelect?: (moduleId: string) => void
  onLessonSubmit?: (answer: string) => void
  onLessonClose?: () => void
  onLocaleChange?: (locale: Locale) => void
  dig?: DigControlsCallbacks
}
