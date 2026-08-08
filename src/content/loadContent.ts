import type { KnowledgePoint, LessonPack, StandardsRef } from './types'

import knowledgePointsDoc from '../../content/algebra1/knowledge-points.json'
import standardsIndexDoc from '../../content/algebra1/standards-index.json'
import lesson01 from '../../content/algebra1/lesson-01.json'
import lesson02 from '../../content/algebra1/lesson-02.json'
import lesson03 from '../../content/algebra1/lesson-03.json'

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

/** Load Algebra I L1–L3 packs (static JSON under content/algebra1/). */
export function loadAlgebra1Content(): Algebra1Content {
  const knowledgePoints = (knowledgePointsDoc as { knowledgePoints: KnowledgePoint[] }).knowledgePoints
  const lessons = [asLesson(lesson01), asLesson(lesson02), asLesson(lesson03)].sort(
    (a, b) => a.order - b.order,
  )

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
