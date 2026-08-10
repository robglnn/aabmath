import type { Locale } from '../../content/types'
import { t } from '../i18n'
import { renderChoiceLabel, renderKatex } from '../math/renderKatex'
import type { LessonScreenData } from '../types'

export class LessonScreen {
  readonly el: HTMLElement
  private titleEl: HTMLElement
  private courseEl: HTMLElement
  private phaseEl: HTMLElement
  private katexEl: HTMLElement
  private promptTextEl: HTMLElement
  private sectionMathEl: HTMLElement
  private choicesEl: HTMLElement
  private feedbackEl: HTMLElement
  private standardsEl: HTMLElement
  private gateEl: HTMLElement
  private answerInput: HTMLInputElement
  private answerSlot: HTMLElement
  private submitBtn: HTMLButtonElement
  private exitBtn: HTMLButtonElement
  private locale: Locale = 'en'
  private onSubmit?: (answer: string) => void
  private onClose?: () => void
  private closeDisabled = false

  constructor(parent: HTMLElement) {
    this.el = document.createElement('div')
    this.el.className = 'hud-screen hud-lesson'
    this.el.hidden = true
    this.el.innerHTML = `
      <header class="hud-lesson-banner">
        <span class="hud-lesson-label"></span>
        <span class="hud-lesson-course"></span>
        <span class="hud-lesson-phase"></span>
      </header>
      <div class="hud-lesson-scene interactive">
        <div class="hud-chalkboard-mount">
          <div class="hud-chalkboard-frame">
            <div class="hud-chalkboard">
              <div class="hud-katex-area"></div>
              <p class="hud-prompt-text"></p>
              <div class="hud-section-math"></div>
            </div>
          </div>
          <p class="hud-lesson-feedback" hidden></p>
          <p class="hud-mastery-gate" hidden></p>
        </div>
        <div class="hud-lesson-controls">
          <div class="hud-choice-list" hidden></div>
          <label class="hud-answer-slot">
            <span class="hud-answer-label"></span>
            <input type="text" class="hud-answer-field" inputmode="text" autocomplete="off" spellcheck="false" />
          </label>
          <button type="button" class="hud-game-btn hud-commit"></button>
        </div>
      </div>
      <button type="button" class="hud-corner-exit hud-lesson-exit"></button>
      <footer class="hud-standards-footer"></footer>
    `
    parent.appendChild(this.el)

    this.titleEl = this.el.querySelector('.hud-lesson-label')!
    this.courseEl = this.el.querySelector('.hud-lesson-course')!
    this.phaseEl = this.el.querySelector('.hud-lesson-phase')!
    this.katexEl = this.el.querySelector('.hud-katex-area')!
    this.promptTextEl = this.el.querySelector('.hud-prompt-text')!
    this.sectionMathEl = this.el.querySelector('.hud-section-math')!
    this.choicesEl = this.el.querySelector('.hud-choice-list')!
    this.feedbackEl = this.el.querySelector('.hud-lesson-feedback')!
    this.standardsEl = this.el.querySelector('.hud-standards-footer')!
    this.gateEl = this.el.querySelector('.hud-mastery-gate')!
    this.answerInput = this.el.querySelector('.hud-answer-field')!
    this.answerSlot = this.el.querySelector('.hud-answer-slot')!
    this.submitBtn = this.el.querySelector('.hud-commit') as HTMLButtonElement
    this.exitBtn = this.el.querySelector('.hud-lesson-exit') as HTMLButtonElement

    this.submitBtn.addEventListener('click', () => {
      if (this.submitBtn.dataset.action === 'retry') {
        this.onSubmit?.('__retry__')
        return
      }
      this.onSubmit?.(this.answerInput.value.trim())
    })
    this.exitBtn.addEventListener('click', () => {
      if (this.closeDisabled) return
      this.onClose?.()
    })
    this.answerInput.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return
      if (this.submitBtn.dataset.action === 'retry') {
        this.onSubmit?.('__retry__')
        return
      }
      this.onSubmit?.(this.answerInput.value.trim())
    })
  }

  setCallbacks(onSubmit?: (answer: string) => void, onClose?: () => void): void {
    this.onSubmit = onSubmit
    this.onClose = onClose
  }

  setLocale(locale: Locale): void {
    this.locale = locale
    this.titleEl.textContent = `${t('lesson.title', locale)}:`
    this.el.querySelector('.hud-answer-label')!.textContent = t('lesson.answer', locale)
    this.exitBtn.textContent = `◀ ${t('lesson.close', locale)}`
  }

  show(data: LessonScreenData): void {
    this.el.hidden = false
    this.closeDisabled = data.closeDisabled ?? false
    this.exitBtn.disabled = this.closeDisabled
    this.exitBtn.classList.toggle('hud-disabled', this.closeDisabled)

    this.courseEl.textContent = data.lessonTitle ?? data.courseLabel
    this.phaseEl.textContent = data.phaseLabel ?? ''
    this.phaseEl.hidden = !data.phaseLabel

    this.katexEl.innerHTML = ''
    if (data.promptLatex) {
      renderKatex(this.katexEl, data.promptLatex)
      this.katexEl.hidden = false
    } else {
      this.katexEl.hidden = true
    }

    if (data.promptText) {
      this.promptTextEl.textContent = data.promptText
      this.promptTextEl.hidden = false
    } else {
      this.promptTextEl.hidden = true
    }

    this.sectionMathEl.innerHTML = ''
    if (data.sectionBodyMath?.length) {
      for (const latex of data.sectionBodyMath) {
        const row = document.createElement('div')
        renderKatex(row, latex)
        this.sectionMathEl.appendChild(row)
      }
      this.sectionMathEl.hidden = false
    } else {
      this.sectionMathEl.hidden = true
    }

    this.standardsEl.textContent = data.standardsFooter
    this.answerInput.value = ''

    const submitKey =
      data.submitLabel === 'continue'
        ? 'lesson.continue'
        : data.submitLabel === 'retry'
          ? 'lesson.retry'
          : 'lesson.submit'
    this.submitBtn.textContent = `▶ ${t(submitKey, this.locale)}`
    this.submitBtn.dataset.action = data.submitLabel === 'retry' ? 'retry' : 'submit'

    const inputMode = data.inputMode ?? 'text'
    const answersLocked = Boolean(data.gateFailed || data.gatePassed || inputMode === 'none')
    this.answerSlot.hidden = inputMode !== 'text' || answersLocked
    this.choicesEl.hidden = inputMode !== 'choices' || answersLocked
    this.choicesEl.innerHTML = ''
    if (inputMode === 'choices' && data.choices && !answersLocked) {
      data.choices.forEach((label, idx) => {
        const btn = document.createElement('button')
        btn.type = 'button'
        btn.className = 'hud-game-btn hud-choice-btn'
        renderChoiceLabel(btn, label)
        btn.addEventListener('click', () => this.onSubmit?.(String(idx)))
        this.choicesEl.appendChild(btn)
      })
    }

    if (data.feedbackText) {
      this.feedbackEl.textContent = data.feedbackText
      this.feedbackEl.hidden = false
    } else {
      this.feedbackEl.hidden = true
    }

    const pct = data.masteryPercent ?? 0
    const passed = data.gatePassed === true
    const failed = data.gateFailed === true
    if (data.showMasteryGate) {
      this.gateEl.hidden = false
      if (passed) {
        this.gateEl.textContent = t('lesson.masteryPassed', this.locale)
      } else if (failed) {
        this.gateEl.textContent = `${t('lesson.masteryGate', this.locale)} (${Math.round(pct)}%)`
      } else {
        this.gateEl.textContent = t('lesson.masteryGate', this.locale)
      }
      this.gateEl.classList.toggle('hud-gate-pass', passed)
      this.gateEl.classList.toggle('hud-gate-fail', failed)
    } else {
      this.gateEl.hidden = true
    }

    this.submitBtn.hidden =
      answersLocked && data.submitLabel === 'submit'
        ? true
        : inputMode === 'choices' && data.submitLabel === 'submit'
  }

  hide(): void {
    this.el.hidden = true
  }

  isVisible(): boolean {
    return !this.el.hidden
  }
}
