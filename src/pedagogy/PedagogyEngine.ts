import type { KnowledgePoint, LessonPack, PlayerProgress, SpacedReviewEntry, StudentAttempt } from '../content/types'
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
    const expected = getIndependentItemIds(lesson)
    const scored = this.scoreIndependentSet(independentResults, lesson.masteryThreshold)
    // Never treat a partial result vector as a pass (softlock / stray submit guard)
    if (independentResults.length !== expected.length || expected.length === 0) {
      return {
        accuracy: 0,
        correctCount: scored.correctCount,
        total: expected.length,
        passed: false,
        threshold: lesson.masteryThreshold,
      }
    }
    if (!scored.passed) return scored

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
      this.enqueueReviewOnMastery(kpId)
    }
    return scored
  }

  unlockSiteIds(lesson: LessonPack): string[] {
    return this.progress.completedLessons.includes(lesson.id) ? lesson.worldHook.unlockOnMastery : []
  }

  /** Base lesson board plus unlockOnMastery targets from completed lessons. */
  unlockedSiteIds(lessons: LessonPack[]): Set<string> {
    const unlocked = new Set<string>(['lesson_board_1'])
    for (const lesson of lessons) {
      if (!this.progress.completedLessons.includes(lesson.id)) continue
      for (const siteId of lesson.worldHook.unlockOnMastery) {
        unlocked.add(siteId)
      }
    }
    return unlocked
  }

  prerequisitesMet(knowledgePointId: string): boolean {
    const kp = this.knowledgePoints.get(knowledgePointId)
    if (!kp) return false
    return kp.prerequisites.every((pre) => this.progress.mastery[pre]?.status === 'mastered')
  }

  /**
   * First enqueue after lesson mastery. Due soon enough for same-session review
   * at the pedestal / later dig exit, but not the instant the board closes —
   * so retrieval is not identical to the independent set just graded.
   */
  enqueueReviewOnMastery(knowledgePointId: string, now = Date.now()): void {
    const FIRST_INTERVAL_MS = 10 * 60 * 1000
    this.progress.spacedQueue.push({
      knowledgePointId,
      dueAt: now + FIRST_INTERVAL_MS,
      ease: 2.3,
      intervalDays: 0,
    })
  }

  /** Manual / dev enqueue with a day-based interval (not used on first mastery). */
  enqueueReview(knowledgePointId: string, days = 1, now = Date.now()): void {
    this.progress.spacedQueue.push({
      knowledgePointId,
      dueAt: now + days * 86400000,
      ease: 2.3,
      intervalDays: days,
    })
  }

  dueReviews(now = Date.now()): string[] {
    return this.progress.spacedQueue.filter((e) => e.dueAt <= now).map((e) => e.knowledgePointId)
  }

  /** Reschedule a due review entry after a retrieval attempt. */
  rescheduleReview(knowledgePointId: string, correct: boolean, now = Date.now()): void {
    const entry = this.findDueReviewEntry(knowledgePointId, now)
    if (!entry) return

    if (correct) {
      entry.intervalDays = Math.max(1, Math.round(entry.intervalDays * entry.ease))
      entry.ease = Math.min(entry.ease + 0.1, 2.8)
    } else {
      entry.intervalDays = 1
      entry.ease = Math.max(1.3, entry.ease - 0.2)
      const mastery = this.progress.mastery[knowledgePointId]
      if (mastery) mastery.status = 'due_review'
    }
    entry.dueAt = now + entry.intervalDays * 86400000
  }

  private findDueReviewEntry(knowledgePointId: string, now: number): SpacedReviewEntry | undefined {
    return this.progress.spacedQueue.find(
      (entry) => entry.knowledgePointId === knowledgePointId && entry.dueAt <= now,
    )
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
