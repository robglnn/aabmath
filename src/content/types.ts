/** Content & pedagogy schemas for Algebra I lesson packs. */

export type Locale = 'en' | 'es' | 'pl'

export type MasteryStatus = 'locked' | 'introduced' | 'in_progress' | 'mastered' | 'due_review'

export interface StandardsRef {
  jurisdiction: string
  codes: string[]
}

export interface KnowledgePoint {
  id: string
  title: Record<Locale, string>
  prerequisites: string[]
  encompassing?: string[]
  successCriteria: Record<Locale, string>
  misconceptions: Record<Locale, string[]>
  standards: StandardsRef[]
}

export interface LessonItem {
  id: string
  knowledgePointIds: string[]
  difficulty: number
  irt: { a?: number; b: number; c?: number }
  prompt: Record<Locale, string>
  /** KaTeX-capable strings */
  promptMath?: string
  choices?: Record<Locale, string[]>
  correctIndex?: number
  correctLatex?: string
  acceptNumeric?: number
  tolerance?: number
  feedbackCorrect: Record<Locale, string>
  feedbackIncorrect: Record<Locale, string>
  diagnosticTags?: string[]
  standards: StandardsRef[]
}

export type LessonPhase = 'objective' | 'teach' | 'guided' | 'independent' | 'retrieval'

export interface LessonSection {
  phase: LessonPhase
  title: Record<Locale, string>
  body: Record<Locale, string>
  bodyMath?: string[]
  itemIds?: string[]
}

export interface LessonPack {
  id: string
  courseId: 'algebra1'
  order: number
  title: Record<Locale, string>
  knowledgePointIds: string[]
  sections: LessonSection[]
  items: LessonItem[]
  masteryThreshold: number
  worldHook: {
    siteId: string
    unlockOnMastery: string[]
  }
}

export interface StudentAttempt {
  itemId: string
  correct: boolean
  response: string | number
  ts: number
  thetaBefore?: number
  thetaAfter?: number
}

export interface SpacedReviewEntry {
  knowledgePointId: string
  dueAt: number
  ease: number
  intervalDays: number
}

export interface PlayerProgress {
  locale: Locale
  rank: string
  score: number
  energy: number
  health: number
  theta: Record<string, number>
  mastery: Record<string, { status: MasteryStatus; accuracy: number; attempts: number }>
  spacedQueue: SpacedReviewEntry[]
  completedLessons: string[]
  primaryJurisdiction: string
}
