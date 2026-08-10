import type { KnowledgePoint, LessonItem, LessonPack, StandardsRef } from './types'

import knowledgePointsDoc from '../../content/algebra1/knowledge-points.json'
import standardsIndexDoc from '../../content/algebra1/standards-index.json'

const lessonModules = import.meta.glob('../../content/algebra1/lesson-*.json', {
  eager: true,
  import: 'default',
})

export interface StandardsIndex {
  version: number
  jurisdictions: string[]
  primaryDisplay: string[]
  codes: Record<
    string,
    Record<
      string,
      {
        description: Record<'en' | 'es' | 'pl', string>
        knowledgePointIds: string[]
      }
    >
  >
  lessonCoverage: Record<string, string[]>
}

export interface Algebra1Content {
  knowledgePoints: KnowledgePoint[]
  knowledgePointById: Map<string, KnowledgePoint>
  lessons: LessonPack[]
  lessonById: Map<string, LessonPack>
  standardsIndex: StandardsIndex
}

function asLesson(raw: unknown): LessonPack {
  return raw as LessonPack
}

/** Load Algebra I lesson packs (L1–L30 via glob of content/algebra1/lesson-*.json). */
export function loadAlgebra1Content(): Algebra1Content {
  const knowledgePoints = (knowledgePointsDoc as { knowledgePoints: KnowledgePoint[] }).knowledgePoints
  const lessons = Object.values(lessonModules)
    .map((raw) => asLesson(raw))
    .sort((a, b) => a.order - b.order)

  return {
    knowledgePoints,
    knowledgePointById: new Map(knowledgePoints.map((kp) => [kp.id, kp])),
    lessons,
    lessonById: new Map(lessons.map((l) => [l.id, l])),
    standardsIndex: standardsIndexDoc as StandardsIndex,
  }
}

export function getIndependentItemIds(lesson: LessonPack): string[] {
  return lesson.sections.find((s) => s.phase === 'independent')?.itemIds ?? []
}

export function getSectionItemIds(lesson: LessonPack, phase: LessonPack['sections'][number]['phase']): string[] {
  return lesson.sections.find((s) => s.phase === phase)?.itemIds ?? []
}

/** Flatten TX + CCSS (and optional others) codes for Progress Report footers. */
export function flattenStandards(refs: StandardsRef[], primary = ['TX', 'CCSS']): string[] {
  const out: string[] = []
  for (const j of primary) {
    const hit = refs.find((r) => r.jurisdiction === j || (j === 'CCSS' && r.jurisdiction === 'CCSS'))
    if (hit) out.push(...hit.codes.map((c) => `${j === 'CCSS' ? 'CC' : j}:${c}`))
  }
  return out
}

export function lessonByWorldSite(content: Algebra1Content, siteId: string): LessonPack | undefined {
  return content.lessons.find((l) => l.worldHook.siteId === siteId)
}

export interface PickReviewOptions {
  /** Skip items the student just saw (e.g. last independent set). */
  excludeItemIds?: Iterable<string>
}

/**
 * Pick up to `max` review items for due knowledge points.
 * Prefers teach/guided (and constructed-response items) over the independent
 * forms just used, so spaced retrieval is not massed repetition of the gate.
 */
export function pickReviewItems(
  content: Algebra1Content,
  knowledgePointIds: string[],
  max = 3,
  options: PickReviewOptions = {},
): LessonItem[] {
  const picked: LessonItem[] = []
  const usedItemIds = new Set<string>()
  const excluded = new Set(options.excludeItemIds ?? [])

  const rank = (item: LessonItem, independentIds: Set<string>): number => {
    let score = 0
    if (excluded.has(item.id)) score -= 100
    if (independentIds.has(item.id)) score -= 10
    if (item.acceptNumeric !== undefined || item.correctLatex) score += 20
    return score
  }

  for (const kpId of knowledgePointIds) {
    if (picked.length >= max) break

    let best: LessonItem | undefined
    let bestScore = -Infinity
    for (const lesson of content.lessons) {
      const independentIds = new Set(getSectionItemIds(lesson, 'independent'))
      const candidates = lesson.items.filter(
        (item) =>
          item.knowledgePointIds.includes(kpId) &&
          !usedItemIds.has(item.id) &&
          !excluded.has(item.id),
      )
      for (const item of candidates) {
        const score = rank(item, independentIds)
        if (score > bestScore) {
          bestScore = score
          best = item
        }
      }
    }

    if (best) {
      picked.push(best)
      usedItemIds.add(best.id)
    }
  }

  return picked
}
