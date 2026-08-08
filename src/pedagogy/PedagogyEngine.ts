import type { KnowledgePoint, LessonPack, PlayerProgress, StudentAttempt } from '../content/types'
import { getIndependentItemIds } from '../content/loadContent'

const DEFAULT_MASTERY_THRESHOLD = 0.8

export interface IndependentSetResult {
  accuracy: number
  correctCount: number
  total: number
  passed: boolean
  threshold: number
}

/** Minimal but real pedagogy services for L1–L3 slice. */
export class PedagogyEngine {
  constructor(
    private progress: PlayerProgress,
    private knowledgePoints: Map<string, KnowledgePoint>,
  ) {}

  getProgress(): PlayerProgress {
    return this.progress
  }

  recordAttempt(attempt: StudentAttempt, knowledgePointIds: string[]): void {
    for (const kpId of knowledgePointIds) {
      const m = this.progress.mastery[kpId] ?? {
        status: 'in_progress' as const,
        accuracy: 0,
        attempts: 0,
      }
      const correctCount = m.accuracy * m.attempts + (attempt.correct ? 1 : 0)
      m.attempts += 1
      m.accuracy = correctCount / m.attempts
      m.status = m.accuracy >= DEFAULT_MASTERY_THRESHOLD && m.attempts >= 3 ? 'mastered' : 'in_progress'
      this.progress.mastery[kpId] = m

      // 1PL-style theta nudge
      const t = this.progress.theta[kpId] ?? 0
      this.progress.theta[kpId] = t + (attempt.correct ? 0.15 : -0.12)
    }
    if (attempt.correct) this.progress.score += 50
  }

  /** Score an independent practice set against the lesson (or default 80%) threshold. */
  scoreIndependentSet(
    results: boolean[],
    threshold: number = DEFAULT_MASTERY_THRESHOLD,
  ): IndependentSetResult {
    const total = results.length
    const correctCount = results.filter(Boolean).length
    const accuracy = total === 0 ? 0 : correctCount / total
    return {
      accuracy,
      correctCount,
      total,
      passed: total > 0 && accuracy >= threshold,
      threshold,
    }
  }

  independentAccuracy(results: boolean[]): number {
    return this.scoreIndependentSet(results).accuracy
  }

  canProceed(independentResults: boolean[], threshold = DEFAULT_MASTERY_THRESHOLD): boolean {
    return this.scoreIndependentSet(independentResults, threshold).passed
  }

  /**
   * Lesson mastery gate: independent-set accuracy ≥ lesson.masteryThreshold (default 0.8).
   * Pass the ordered boolean results for each independent item (same order as section itemIds).
   */
  lessonPassed(lesson: LessonPack, independentResults: boolean[]): boolean {
    const expected = getIndependentItemIds(lesson)
    if (expected.length === 0) return false
    if (independentResults.length !== expected.length) return false
    return this.scoreIndependentSet(independentResults, lesson.masteryThreshold).passed
  }

  /** Mark lesson complete and unlock world hooks when the independent set passes. */
  completeLessonIfPassed(lesson: LessonPack, independentResults: boolean[]): IndependentSetResult {
    const scored = this.scoreIndependentSet(independentResults, lesson.masteryThreshold)
    if (!this.lessonPassed(lesson, independentResults)) return scored

    if (!this.progress.completedLessons.includes(lesson.id)) {
      this.progress.completedLessons.push(lesson.id)
    }
    for (const kpId of lesson.knowledgePointIds) {
      const m = this.progress.mastery[kpId] ?? {
        status: 'mastered' as const,
        accuracy: scored.accuracy,
        attempts: scored.total,
      }
      m.status = 'mastered'
      m.accuracy = Math.max(m.accuracy, scored.accuracy)
      this.progress.mastery[kpId] = m
      this.enqueueReview(kpId, 1)
    }
    return scored
  }

  unlockSiteIds(lesson: LessonPack): string[] {
    return this.progress.completedLessons.includes(lesson.id) ? lesson.worldHook.unlockOnMastery : []
  }

  prerequisitesMet(knowledgePointId: string): boolean {
    const kp = this.knowledgePoints.get(knowledgePointId)
    if (!kp) return false
    return kp.prerequisites.every((pre) => this.progress.mastery[pre]?.status === 'mastered')
  }

  enqueueReview(knowledgePointId: string, days = 1): void {
    this.progress.spacedQueue.push({
      knowledgePointId,
      dueAt: Date.now() + days * 86400000,
      ease: 2.3,
      intervalDays: days,
    })
  }

  dueReviews(now = Date.now()): string[] {
    return this.progress.spacedQueue.filter((e) => e.dueAt <= now).map((e) => e.knowledgePointId)
  }
}

export function createDefaultProgress(): PlayerProgress {
  return {
    locale: 'en',
    rank: 'FRESHMAN',
    score: 1500,
    energy: 100,
    health: 100,
    theta: {},
    mastery: {},
    spacedQueue: [],
    completedLessons: [],
    primaryJurisdiction: 'TX',
  }
}
