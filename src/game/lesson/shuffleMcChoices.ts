import type { LessonItem, Locale } from '../../content/types'

const LOCALES: Locale[] = ['en', 'es', 'pl']

export interface McShuffleState {
  choices: Record<Locale, string[]>
  displayCorrectIndex: number
}

/** Fisher–Yates permutation applied identically to every locale choice array. */
export function shuffleMcChoices(item: LessonItem): McShuffleState | null {
  if (!item.choices || item.correctIndex === undefined) return null

  const n = item.choices.en.length
  if (n <= 1) return null

  const perm = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[perm[i], perm[j]] = [perm[j], perm[i]]
  }

  const choices = {} as Record<Locale, string[]>
  for (const locale of LOCALES) {
    const original = item.choices[locale]
    choices[locale] = perm.map((origIdx) => original[origIdx])
  }

  const displayCorrectIndex = perm.indexOf(item.correctIndex)
  return { choices, displayCorrectIndex }
}
