import type { KnowledgePoint, LessonItem, Locale } from '../../content/types'
import { flattenStandards } from '../../content/loadContent'
import type { LessonScreenData } from '../../ui/types'
import type { PedagogyEngine } from '../../pedagogy/PedagogyEngine'
import { gradeItem, prefersConstructedResponse } from './gradeItem'
import { shuffleMcChoices, type McShuffleState } from './shuffleMcChoices'

const REVIEW_PHASE: Record<Locale, string> = {
  en: 'Spaced retrieval',
  es: 'Recuperación espaciada',
  pl: 'Powtórka rozłożona',
}

const REVIEW_COMPLETE: Record<Locale, string> = {
  en: 'Retrieval checkpoint complete. Skills refreshed.',
  es: 'Punto de recuperación completo. Habilidades refrescadas.',
  pl: 'Punkt powtórki ukończony. Umiejętności odświeżone.',
}

/** Short retrieval flow (1–3 items) for due spaced-review knowledge points. */
export class ReviewRunner {
  private index = 0
  private showingFeedback = false
  private done = false
  private exitPending = false
  private lastFeedback?: string
  private shuffleKey: string | null = null
  private mcShuffle: McShuffleState | null = null

  constructor(
    private readonly items: LessonItem[],
    private readonly knowledgePoints: Map<string, KnowledgePoint>,
    private readonly engine: PedagogyEngine,
    private locale: Locale,
  ) {}

  setLocale(locale: Locale): void {
    this.locale = locale
  }

  canClose(): boolean {
    return this.done
  }

  isComplete(): boolean {
    return this.done
  }

  shouldExit(): boolean {
    return this.exitPending
  }

  getViewState(): LessonScreenData {
    if (this.done) {
      return {
        courseLabel: 'ALGEBRA 1',
        lessonTitle: REVIEW_PHASE[this.locale],
        phaseLabel: `${this.items.length}/${this.items.length}`,
        promptText: REVIEW_COMPLETE[this.locale],
        promptLatex: '',
        standardsFooter: 'SPACED RETRIEVAL',
        inputMode: 'none',
        submitLabel: 'continue',
        showMasteryGate: false,
      }
    }

    const item = this.items[this.index]
    const kpTitle = item.knowledgePointIds
      .map((id) => this.knowledgePoints.get(id)?.title[this.locale])
      .filter(Boolean)
      .join(' · ')

    if (this.showingFeedback) {
      return {
        courseLabel: 'ALGEBRA 1',
        lessonTitle: REVIEW_PHASE[this.locale],
        phaseLabel: `${this.index + 1}/${this.items.length}`,
        promptLatex: item.promptMath ?? '',
        promptText: item.prompt[this.locale],
        standardsFooter: flattenStandards(item.standards).join(' · ') || 'SPACED RETRIEVAL',
        feedbackText: this.lastFeedback,
        inputMode: 'none',
        submitLabel: 'continue',
        showMasteryGate: false,
      }
    }

    const useText = prefersConstructedResponse(item)
    const mcShuffle = useText ? null : this.getMcShuffle(item)
    return {
      courseLabel: 'ALGEBRA 1',
      lessonTitle: REVIEW_PHASE[this.locale],
      phaseLabel: kpTitle
        ? `${this.index + 1}/${this.items.length} — ${kpTitle}`
        : `${this.index + 1}/${this.items.length}`,
      promptLatex: item.promptMath ?? '',
      promptText: item.prompt[this.locale],
      choices: useText ? undefined : (mcShuffle?.choices[this.locale] ?? item.choices?.[this.locale]),
      standardsFooter: flattenStandards(item.standards).join(' · ') || 'SPACED RETRIEVAL',
      inputMode: useText ? 'text' : item.choices ? 'choices' : 'text',
      submitLabel: 'submit',
      showMasteryGate: false,
    }
  }

  submitAnswer(answer: string): LessonScreenData {
    if (this.done) {
      this.exitPending = true
      return this.getViewState()
    }

    if (this.showingFeedback) {
      this.showingFeedback = false
      this.lastFeedback = undefined
      this.index += 1
      if (this.index >= this.items.length) {
        this.done = true
      }
      return this.getViewState()
    }

    const item = this.items[this.index]
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
    for (const kpId of item.knowledgePointIds) {
      this.engine.rescheduleReview(kpId, correct)
    }

    this.lastFeedback = correct
      ? item.feedbackCorrect[this.locale]
      : item.feedbackIncorrect[this.locale]
    this.showingFeedback = true
    return this.getViewState()
  }

  private getMcShuffle(item: LessonItem): McShuffleState | null {
    if (!item.choices || item.correctIndex === undefined) return null
    if (prefersConstructedResponse(item)) return null
    const key = String(this.index)
    if (this.shuffleKey !== key) {
      this.shuffleKey = key
      this.mcShuffle = shuffleMcChoices(item)
    }
    return this.mcShuffle
  }
}
