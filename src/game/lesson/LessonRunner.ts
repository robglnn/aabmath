import type { LessonItem, LessonPack, Locale } from '../../content/types'
import { flattenStandards, getSectionItemIds } from '../../content/loadContent'
import type { LessonScreenData } from '../../ui/types'
import type { PedagogyEngine } from '../../pedagogy/PedagogyEngine'
import { gradeItem } from './gradeItem'
import { shuffleMcChoices, type McShuffleState } from './shuffleMcChoices'

const PHASE_ORDER: Array<'objective' | 'teach' | 'guided' | 'independent'> = [
  'objective',
  'teach',
  'guided',
  'independent',
]

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

  constructor(
    private readonly lesson: LessonPack,
    private readonly engine: PedagogyEngine,
    private locale: Locale,
  ) {}

  getLesson(): LessonPack {
    return this.lesson
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
    const independentIds = getSectionItemIds(this.lesson, 'independent')
    const masteryPercent =
      independentIds.length > 0
        ? (this.independentResults.filter(Boolean).length / independentIds.length) * 100
        : 0

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
      inputMode: this.awaitingContinue
        ? 'none'
        : item
          ? item.choices
            ? 'choices'
            : 'text'
          : 'none',
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

    if (!item) {
      return {
        ...base,
        promptText: section?.body[this.locale],
        inputMode: 'none',
        submitLabel: 'continue',
      }
    }

    const mcShuffle = this.getMcShuffle(item)
    return {
      ...base,
      promptLatex: item.promptMath ?? '',
      promptText: item.prompt[this.locale],
      choices: mcShuffle?.choices[this.locale] ?? item.choices?.[this.locale],
    }
  }

  submitAnswer(answer: string): LessonScreenData {
    this.lastFeedback = undefined
    this.lastGateMessage = undefined

    if (this.gateFailed && answer === '__retry__') {
      this.resetIndependentPhase()
      return this.getViewState()
    }

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

    const correct = gradeItem(item, answer, this.locale, this.getMcShuffle(item))
    this.engine.recordAttempt(
      {
        itemId: item.id,
        correct,
        response: answer,
        ts: Date.now(),
      },
      item.knowledgePointIds,
    )

    this.lastFeedback = correct
      ? item.feedbackCorrect[this.locale]
      : item.feedbackIncorrect[this.locale]

    if (phase === 'independent') {
      this.independentResults.push(correct)

      if (this.isLastItemInPhase()) {
        const scored = this.engine.completeLessonIfPassed(this.lesson, this.independentResults)
        this.gateScorePercent = scored.accuracy * 100
        if (!scored.passed) {
          this.gateFailed = true
          this.lastGateMessage = `Independent set: ${Math.round(scored.accuracy * 100)}% (need ${Math.round(this.lesson.masteryThreshold * 100)}%). Retry required.`
          this.independentResults = []
          this.itemIndex = 0
        } else {
          this.gatePassed = true
          this.phaseIndex = PHASE_ORDER.length
        }
        return this.getViewState()
      }

      this.advance()
      return this.getViewState()
    }

    this.awaitingContinue = true
    if (this.isLastItemInPhase()) {
      // After last teach/guided item, continue advances phase on next submit
    }
    return this.getViewState()
  }

  /** Signal retry after gate failure (maps to submit with retry token). */
  retryIndependent(): LessonScreenData {
    return this.submitAnswer('__retry__')
  }

  private resetIndependentPhase(): void {
    this.gateFailed = false
    this.independentResults = []
    this.itemIndex = 0
    this.awaitingContinue = false
    this.phaseIndex = PHASE_ORDER.indexOf('independent')
    this.shuffleNonce += 1
    this.shuffleKey = null
    this.mcShuffle = null
  }

  private getMcShuffle(item: LessonItem): McShuffleState | null {
    if (!item.choices || item.correctIndex === undefined) return null
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
    const ids = getSectionItemIds(this.lesson, phase)
    const id = ids[this.itemIndex]
    return id ? this.lesson.items.find((i) => i.id === id) : undefined
  }

  private isLastItemInPhase(): boolean {
    const phase = this.currentPhase()
    if (phase === 'objective' || phase === 'complete') return false
    const ids = getSectionItemIds(this.lesson, phase)
    return ids.length > 0 && this.itemIndex >= ids.length - 1
  }

  private advance(): void {
    const phase = this.currentPhase()
    if (phase === 'complete') return

    if (phase !== 'objective') {
      const ids = getSectionItemIds(this.lesson, phase)
      if (ids.length > 0 && this.itemIndex < ids.length - 1) {
        this.itemIndex += 1
        return
      }
    }

    this.itemIndex = 0
    if (this.phaseIndex < PHASE_ORDER.length - 1) {
      this.phaseIndex += 1
    }
  }
}
