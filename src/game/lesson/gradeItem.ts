import type { LessonItem, Locale } from '../../content/types'

function normalizeLatex(s: string): string {
  return s.replace(/\s+/g, '').toLowerCase()
}

/** Grade a student response against a lesson item. */
export function gradeItem(item: LessonItem, answer: string, locale: Locale): boolean {
  if (item.choices && item.correctIndex !== undefined) {
    const idx = Number.parseInt(answer, 10)
    if (!Number.isNaN(idx) && idx === item.correctIndex) return true
    const choices = item.choices[locale]
    const normalized = answer.trim().toLowerCase()
    return choices[item.correctIndex]?.trim().toLowerCase() === normalized
  }

  if (item.acceptNumeric !== undefined) {
    const n = Number.parseFloat(answer.replace(/,/g, ''))
    if (Number.isNaN(n)) return false
    const tol = item.tolerance ?? 0
    return Math.abs(n - item.acceptNumeric) <= tol
  }

  if (item.correctLatex) {
    return normalizeLatex(answer) === normalizeLatex(item.correctLatex)
  }

  return false
}
