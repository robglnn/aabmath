import type { LessonItem, Locale } from '../../content/types'
import type { McShuffleState } from './shuffleMcChoices'

/** Fold common student / TeX / unicode math into a comparable form. */
export function canonicalizeMathAnswer(s: string): string {
  let t = s.trim().toLowerCase()
  t = t.replace(/\$/g, '')
  t = t.replace(/[\u2212\u2013\u2014]/g, '-')
  t = t.replace(/≤/g, '<=').replace(/≥/g, '>=')
  t = t.replace(/≠/g, '!=')
  // TeX inequalities / relations
  t = t.replace(/\\leq?(?![a-z])/g, '<=')
  t = t.replace(/\\geq?(?![a-z])/g, '>=')
  t = t.replace(/\\ne(?![a-z])/g, '!=')
  t = t.replace(/\\neq(?![a-z])/g, '!=')
  t = t.replace(/\\lt(?![a-z])/g, '<')
  t = t.replace(/\\gt(?![a-z])/g, '>')
  // \frac{a}{b} → (a)/(b)
  for (let i = 0; i < 4; i++) {
    const next = t.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1)/($2)')
    if (next === t) break
    t = next
  }
  t = t.replace(/\\left|\\right/g, '')
  t = t.replace(/[{}]/g, '')
  t = t.replace(/\\/g, '')
  t = t.replace(/\s+/g, '')
  // (m)/(3) → m/3 so bare slash forms match TeX fractions
  for (let i = 0; i < 4; i++) {
    const next = t.replace(/\(([a-z0-9._-]+)\)/gi, '$1')
    if (next === t) break
    t = next
  }
  return t
}

function gradeNumeric(answer: string, target: number, tolerance: number): boolean {
  const cleaned = answer
    .replace(/\$/g, '')
    .replace(/[\u2212\u2013\u2014]/g, '-')
    .replace(/,/g, '')
    .trim()
  // Allow "x=5" / "x = 5" when the numeric target is authored
  const eq = cleaned.match(/^[a-z]\s*=\s*(.+)$/i)
  const raw = eq ? eq[1].trim() : cleaned
  const n = Number.parseFloat(raw)
  if (Number.isNaN(n)) return false
  return Math.abs(n - target) <= tolerance
}

function gradeLatex(answer: string, correctLatex: string): boolean {
  return canonicalizeMathAnswer(answer) === canonicalizeMathAnswer(correctLatex)
}

/** Prefer constructed response when authored; MC is fallback. */
export function prefersConstructedResponse(item: LessonItem): boolean {
  return item.acceptNumeric !== undefined || Boolean(item.correctLatex)
}

/** Grade a student response against a lesson item. */
export function gradeItem(
  item: LessonItem,
  answer: string,
  locale: Locale,
  mcShuffle?: McShuffleState | null,
): boolean {
  const hasNumeric = item.acceptNumeric !== undefined
  const hasLatex = Boolean(item.correctLatex)
  const tol = item.tolerance ?? 0

  // When both exist, accept either form (e.g. `5` or `x=5`)
  if (hasNumeric && hasLatex) {
    if (gradeNumeric(answer, item.acceptNumeric!, tol)) return true
    if (gradeLatex(answer, item.correctLatex!)) return true
  } else if (hasNumeric) {
    if (gradeNumeric(answer, item.acceptNumeric!, tol)) return true
  } else if (hasLatex) {
    if (gradeLatex(answer, item.correctLatex!)) return true
  }

  if (hasNumeric || hasLatex) return false

  if (item.choices && item.correctIndex !== undefined) {
    const correctIdx = mcShuffle?.displayCorrectIndex ?? item.correctIndex
    const choices = mcShuffle?.choices ?? item.choices
    const idx = Number.parseInt(answer, 10)
    if (!Number.isNaN(idx) && idx === correctIdx) return true
    const normalized = canonicalizeMathAnswer(answer)
    return canonicalizeMathAnswer(choices[locale][correctIdx] ?? '') === normalized
  }

  return false
}
