import type { Algebra1Content } from '../../content/loadContent'
import { flattenStandards } from '../../content/loadContent'
import type { Locale } from '../../content/types'
import type { PedagogyEngine } from '../../pedagogy/PedagogyEngine'
import type { ProgressReportData } from '../../ui/types'

export function buildProgressReportData(
  content: Algebra1Content,
  engine: PedagogyEngine,
  locale?: Locale,
): ProgressReportData {
  const progress = engine.getProgress()
  const loc: Locale = locale ?? progress.locale ?? 'en'

  const masteryLines = content.lessons.map((lesson) => {
    const kpIds = lesson.knowledgePointIds
    const accuracies = kpIds.map((id) => (progress.mastery[id]?.accuracy ?? 0) * 100)
    const percent =
      accuracies.length > 0
        ? accuracies.reduce((sum, v) => sum + v, 0) / accuracies.length
        : progress.completedLessons.includes(lesson.id)
          ? 100
          : 0
    return {
      topic: lesson.title[loc].toUpperCase(),
      percent,
    }
  })

  const alignmentLines = content.lessons.map((lesson) => {
    const codes = flattenStandards(
      lesson.items.flatMap((i) => i.standards).slice(0, 1),
    )
    return {
      label: `${lesson.id.toUpperCase()}: ${codes[0] ?? 'TEKS'}`,
      met: progress.completedLessons.includes(lesson.id),
    }
  })

  const allCodes = new Set<string>()
  for (const lesson of content.lessons) {
    for (const item of lesson.items.slice(0, 2)) {
      flattenStandards(item.standards).forEach((c) => allCodes.add(c))
    }
  }

  return {
    masteryLines,
    alignmentLines,
    standardsCodes: [...allCodes].slice(0, 6).join(' · ') || 'TEXAS TEKS & COMMON CORE',
  }
}
