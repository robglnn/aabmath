import type { LessonItem, Locale } from '../../content/types'
import type { McShuffleState } from './shuffleMcChoices'

function normalizeLatex(s: string): string {
  return s.replace(/\s+/g, '').toLowerCase()
}

/** Grade a student response against a lesson item. */
export function gradeItem(
  item: LessonItem,
  answer: string,
  locale: Locale,
  mcShuffle?: McShuffleState | null,
): boolean {
  if (item.choices && item.correctIndex !== undefined) {
    const correctIdx = mcShuffle?.displayCorrectIndex ?? item.correctIndex
    const choices = mcShuffle?.choices ?? item.choices
    const idx = Number.parseInt(answer, 10)
    if (!Number.isNaN(idx) && idx === correctIdx) return true
    const normalized = answer.trim().toLowerCase()
    return choices[locale][correctIdx]?.trim().toLowerCase() === normalized
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
