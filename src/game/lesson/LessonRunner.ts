import type { LessonItem, LessonPack, Locale } from '../../content/types'
import { flattenStandards, getSectionItemIds } from '../../content/loadContent'
import type { LessonScreenData } from '../../ui/types'
import type { PedagogyEngine } from '../../pedagogy/PedagogyEngine'
import { gradeItem, prefersConstructedResponse } from './gradeItem'
import { shuffleMcChoices, type McShuffleState } from './shuffleMcChoices'

const PHASE_ORDER: Array<'objective' | 'teach' | 'guided' | 'independent'> = [
  'objective',
  'teach',
  'guided',
  'independent',
]

function shuffleIds(ids: string[], nonce: number): string[] {
  const out = [...ids]
  let seed = (nonce + 1) * 2654435761
  for (let i = out.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) >>> 0
    const j = seed % (i + 1)
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export class LessonRunner {
  private phaseIndex = 0
  private itemIndex = 0
  private independentResults: boolean[] = []
  private awaitingContinue = false
  private gateFailed = false
  private gatePassed = false
  private lastFeedback?: string
  private lastGateMessage?: string
  private gateScorePercent = 0
  private shuffleNonce = 0
  private shuffleKey: string | null = null
  private mcShuffle: McShuffleState | null = null
  /** Independent item order — reshuffled on each gate retry. */
  private independentOrder: string[] | null = null

  constructor(
    private readonly lesson: LessonPack,
    private readonly engine: PedagogyEngine,
    private locale: Locale,
  ) {}

  getLesson(): LessonPack {
    return this.lesson
  }

  /** Item ids from the last completed/failed independent set (for SR exclusion). */
  getIndependentItemIdsUsed(): string[] {
    return this.independentOrder ?? getSectionItemIds(this.lesson, 'independent')
  }

  setLocale(locale: Locale): void {
    this.locale = locale
  }

  canClose(): boolean {
    return !this.gateFailed
  }

  getViewState(): LessonScreenData {
    const phase = this.currentPhase()
    const section = this.lesson.sections.find((s) => s.phase === phase)
    const item = this.currentItem()
    const independentIds = this.phaseItemIds('independent')
    const masteryPercent =
      independentIds.length > 0
        ? (this.independentResults.filter(Boolean).length / independentIds.length) * 100
        : 0

    const useText = item ? prefersConstructedResponse(item) : false

    const base: LessonScreenData = {
      courseLabel: 'ALGEBRA 1',
      lessonTitle: this.lesson.title[this.locale],
      phaseLabel: section?.title[this.locale],
      promptLatex: '',
      standardsFooter: flattenStandards(
        item?.standards ?? this.lesson.items[0]?.standards ?? [],
      ).join(' · ') || 'TEXAS TEKS & COMMON CORE',
      showMasteryGate: phase === 'independent' || this.gateFailed || this.gatePassed,
      masteryPercent: this.gateFailed || this.gatePassed ? this.gateScorePercent : masteryPercent,
      gatePassed: this.gatePassed,
      gateFailed: this.gateFailed,
      feedbackText: this.lastFeedback ?? this.lastGateMessage,
      closeDisabled: this.gateFailed,
      inputMode: 'none',
      submitLabel: this.gateFailed ? 'retry' : this.awaitingContinue ? 'continue' : 'submit',
    }

    if (this.gatePassed) {
      return {
        ...base,
        promptText: this.lesson.title[this.locale],
        inputMode: 'none',
        submitLabel: 'continue',
        showMasteryGate: true,
        gatePassed: true,
        gateFailed: false,
        closeDisabled: false,
      }
    }

    // Gate-fail screen: no answer affordances — only RETRY
    if (this.gateFailed) {
      return {
        ...base,
        promptText:
          this.locale === 'es'
            ? 'Dominio insuficiente. Reintenta el conjunto independiente.'
            : this.locale === 'pl'
              ? 'Niewystarczające opanowanie. Ponów zestaw samodzielny.'
              : 'Mastery not met. Retry the independent set.',
        promptLatex: '',
        inputMode: 'none',
        submitLabel: 'retry',
        showMasteryGate: true,
        gateFailed: true,
        gatePassed: false,
        feedbackText: this.lastGateMessage,
        closeDisabled: true,
      }
    }

    if (phase === 'objective' && section) {
      return {
        ...base,
        promptText: section.body[this.locale],
        sectionBodyMath: section.bodyMath,
        inputMode: 'none',
        submitLabel: 'continue',
        showMasteryGate: false,
      }
    }

    if (this.awaitingContinue) {
      return {
        ...base,
        promptLatex: item?.promptMath ?? '',
        promptText: item?.prompt[this.locale] ?? section?.body[this.locale],
        inputMode: 'none',
        submitLabel: 'continue',
        feedbackText: this.lastFeedback,
      }
    }

    if (!item) {
      return {
        ...base,
        promptText: section?.body[this.locale],
        inputMode: 'none',
        submitLabel: 'continue',
      }
    }

    const mcShuffle = useText ? null : this.getMcShuffle(item)
    return {
      ...base,
      promptLatex: item.promptMath ?? '',
      promptText: item.prompt[this.locale],
      choices: useText ? undefined : (mcShuffle?.choices[this.locale] ?? item.choices?.[this.locale]),
      inputMode: useText ? 'text' : item.choices ? 'choices' : 'text',
      // Independent: no running mastery % that leaks correctness (oracle)
      masteryPercent: phase === 'independent' ? 0 : masteryPercent,
      showMasteryGate: phase === 'independent',
    }
  }

  submitAnswer(answer: string): LessonScreenData {
    if (this.gateFailed) {
      if (answer === '__retry__') {
        this.resetIndependentPhase()
        return this.getViewState()
      }
      // Ignore stray choice / Enter submits on the fail screen
      return this.getViewState()
    }

    if (this.gatePassed) {
      return this.getViewState()
    }

    this.lastFeedback = undefined
    this.lastGateMessage = undefined

    if (this.awaitingContinue) {
      this.awaitingContinue = false
      this.advance()
      return this.getViewState()
    }

    const phase = this.currentPhase()

    if (phase === 'objective') {
      this.advance()
      return this.getViewState()
    }

    const item = this.currentItem()
    if (!item) {
      this.advance()
      return this.getViewState()
    }

    const useConstructed = prefersConstructedResponse(item)
    const correct = gradeItem(
      item,
      answer,
      this.locale,
      useConstructed ? null : this.getMcShuffle(item),
    )
    this.engine.recordAttempt(
      {
        itemId: item.id,
        correct,
        response: answer,
        ts: Date.now(),
      },
      item.knowledgePointIds,
    )

    if (phase === 'independent') {
      // No per-item Correct/Incorrect — closes the elimination-oracle channel
      this.lastFeedback = undefined
      this.independentResults.push(correct)

      if (this.isLastItemInPhase()) {
        const scored = this.engine.completeLessonIfPassed(this.lesson, this.independentResults)
        this.gateScorePercent = scored.accuracy * 100
        if (!scored.passed) {
          this.gateFailed = true
          this.gatePassed = false
          this.lastGateMessage =
            this.locale === 'es'
              ? `Independiente: ${Math.round(scored.accuracy * 100)}% (necesitas ${Math.round(this.lesson.masteryThreshold * 100)}%). Reintento con nuevo orden.`
              : this.locale === 'pl'
                ? `Zestaw: ${Math.round(scored.accuracy * 100)}% (wymagane ${Math.round(this.lesson.masteryThreshold * 100)}%). Ponów — inna kolejność.`
                : `Independent set: ${Math.round(scored.accuracy * 100)}% (need ${Math.round(this.lesson.masteryThreshold * 100)}%). Retry reshuffles the set.`
          this.independentResults = []
        } else {
          this.gatePassed = true
          this.gateFailed = false
          this.phaseIndex = PHASE_ORDER.length
        }
        return this.getViewState()
      }

      this.advance()
      return this.getViewState()
    }

    // Teach/guided may reveal worked feedback
    this.lastFeedback = correct
      ? item.feedbackCorrect[this.locale]
      : item.feedbackIncorrect[this.locale]
    this.awaitingContinue = true
    return this.getViewState()
  }

  retryIndependent(): LessonScreenData {
    return this.submitAnswer('__retry__')
  }

  private resetIndependentPhase(): void {
    this.gateFailed = false
    this.gatePassed = false
    this.independentResults = []
    this.itemIndex = 0
    this.awaitingContinue = false
    this.lastFeedback = undefined
    this.lastGateMessage = undefined
    this.phaseIndex = PHASE_ORDER.indexOf('independent')
    this.shuffleNonce += 1
    this.shuffleKey = null
    this.mcShuffle = null
    this.independentOrder = shuffleIds(getSectionItemIds(this.lesson, 'independent'), this.shuffleNonce)
  }

  private phaseItemIds(phase: 'teach' | 'guided' | 'independent'): string[] {
    const base = getSectionItemIds(this.lesson, phase)
    if (phase === 'independent') {
      if (!this.independentOrder || this.independentOrder.length !== base.length) {
        this.independentOrder = shuffleIds(base, this.shuffleNonce)
      }
      return this.independentOrder
    }
    return base
  }

  private getMcShuffle(item: LessonItem): McShuffleState | null {
    if (!item.choices || item.correctIndex === undefined) return null
    if (prefersConstructedResponse(item)) return null
    const phase = this.currentPhase()
    const key = `${phase}:${this.itemIndex}:${this.shuffleNonce}`
    if (this.shuffleKey !== key) {
      this.shuffleKey = key
      this.mcShuffle = shuffleMcChoices(item)
    }
    return this.mcShuffle
  }

  private currentPhase(): (typeof PHASE_ORDER)[number] | 'complete' {
    return PHASE_ORDER[this.phaseIndex] ?? 'complete'
  }

  private currentItem(): LessonItem | undefined {
    const phase = this.currentPhase()
    if (phase === 'objective' || phase === 'complete') return undefined
    const ids = this.phaseItemIds(phase)
    const id = ids[this.itemIndex]
    return id ? this.lesson.items.find((i) => i.id === id) : undefined
  }

  private isLastItemInPhase(): boolean {
    const phase = this.currentPhase()
    if (phase === 'objective' || phase === 'complete') return false
    const ids = this.phaseItemIds(phase)
    return ids.length > 0 && this.itemIndex >= ids.length - 1
  }

  private advance(): void {
    const phase = this.currentPhase()
    if (phase === 'complete') return

    if (phase !== 'objective') {
      const ids = this.phaseItemIds(phase)
      if (ids.length > 0 && this.itemIndex < ids.length - 1) {
        this.itemIndex += 1
        return
      }
    }

    this.itemIndex = 0
    if (this.phaseIndex < PHASE_ORDER.length - 1) {
      this.phaseIndex += 1
      if (PHASE_ORDER[this.phaseIndex] === 'independent') {
        this.independentOrder = shuffleIds(
          getSectionItemIds(this.lesson, 'independent'),
          this.shuffleNonce,
        )
      }
    }
  }
}
