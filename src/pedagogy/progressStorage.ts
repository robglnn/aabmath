import type { Locale, MasteryStatus, PlayerProgress, SpacedReviewEntry } from '../content/types'
import { createDefaultProgress } from './PedagogyEngine'

const STORAGE_KEY = 'axiom-reach-player-progress'

const LOCALES: Locale[] = ['en', 'es', 'pl']
const MASTERY_STATUSES: MasteryStatus[] = [
  'locked',
  'introduced',
  'in_progress',
  'mastered',
  'due_review',
]

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseSpacedEntry(raw: unknown): SpacedReviewEntry | null {
  if (!isRecord(raw)) return null
  if (typeof raw.knowledgePointId !== 'string') return null
  if (typeof raw.dueAt !== 'number' || !Number.isFinite(raw.dueAt)) return null
  if (typeof raw.ease !== 'number' || !Number.isFinite(raw.ease)) return null
  if (typeof raw.intervalDays !== 'number' || !Number.isFinite(raw.intervalDays)) return null
  return {
    knowledgePointId: raw.knowledgePointId,
    dueAt: raw.dueAt,
    ease: raw.ease,
    intervalDays: raw.intervalDays,
  }
}

/** Merge persisted JSON with defaults; drop malformed fields. */
export function normalizePlayerProgress(raw: unknown): PlayerProgress {
  const defaults = createDefaultProgress()
  if (!isRecord(raw)) return defaults

  const locale = LOCALES.includes(raw.locale as Locale) ? (raw.locale as Locale) : defaults.locale

  const theta: Record<string, number> = {}
  if (isRecord(raw.theta)) {
    for (const [key, value] of Object.entries(raw.theta)) {
      if (typeof value === 'number' && Number.isFinite(value)) theta[key] = value
    }
  }

  const mastery: PlayerProgress['mastery'] = {}
  if (isRecord(raw.mastery)) {
    for (const [key, value] of Object.entries(raw.mastery)) {
      if (!isRecord(value)) continue
      if (typeof value.accuracy !== 'number' || !Number.isFinite(value.accuracy)) continue
      if (typeof value.attempts !== 'number' || !Number.isFinite(value.attempts)) continue
      const status = MASTERY_STATUSES.includes(value.status as MasteryStatus)
        ? (value.status as MasteryStatus)
        : 'in_progress'
      mastery[key] = { status, accuracy: value.accuracy, attempts: value.attempts }
    }
  }

  const spacedQueue: SpacedReviewEntry[] = []
  if (Array.isArray(raw.spacedQueue)) {
    for (const entry of raw.spacedQueue) {
      const parsed = parseSpacedEntry(entry)
      if (parsed) spacedQueue.push(parsed)
    }
  }

  const completedLessons = Array.isArray(raw.completedLessons)
    ? raw.completedLessons.filter((id): id is string => typeof id === 'string')
    : []

  return {
    locale,
    rank: typeof raw.rank === 'string' ? raw.rank : defaults.rank,
    score: typeof raw.score === 'number' && Number.isFinite(raw.score) ? raw.score : defaults.score,
    energy: typeof raw.energy === 'number' && Number.isFinite(raw.energy) ? raw.energy : defaults.energy,
    health: typeof raw.health === 'number' && Number.isFinite(raw.health) ? raw.health : defaults.health,
    theta,
    mastery,
    spacedQueue,
    completedLessons,
    primaryJurisdiction:
      typeof raw.primaryJurisdiction === 'string' ? raw.primaryJurisdiction : defaults.primaryJurisdiction,
  }
}

export function loadPlayerProgress(): PlayerProgress {
  if (typeof localStorage === 'undefined') return createDefaultProgress()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createDefaultProgress()
    return normalizePlayerProgress(JSON.parse(raw))
  } catch {
    return createDefaultProgress()
  }
}

export function savePlayerProgress(progress: PlayerProgress): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // Ignore quota / private-mode failures — play continues in-memory.
  }
}

/** Critic/dev helper: ?sr=1 forces every queued review due now. */
export function applySrDebugOverride(progress: PlayerProgress): void {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams(window.location.search)
  if (params.get('sr') !== '1') return
  const now = Date.now()
  for (const entry of progress.spacedQueue) {
    entry.dueAt = now
  }
}
