import type { Locale } from '../../content/types'
import { t } from '../i18n'
import type { ProgressReportData } from '../types'

export class ProgressReport {
  readonly el: HTMLElement
  private masteryList: HTMLElement
  private alignmentList: HTMLElement
  private standardsEl: HTMLElement
  private locale: Locale = 'en'

  constructor(parent: HTMLElement) {
    this.el = document.createElement('div')
    this.el.className = 'hud-screen hud-progress-report'
    this.el.hidden = true
    this.el.innerHTML = `
      <div class="hud-pedestal-scene">
        <div class="hud-pedestal-glow" aria-hidden="true"></div>
        <div class="hud-hologram interactive">
          <h2 class="hud-hologram-title"></h2>
          <ul class="hud-mastery-list"></ul>
          <h3 class="hud-alignment-heading"></h3>
          <ul class="hud-alignment-list"></ul>
          <p class="hud-report-standards"></p>
        </div>
      </div>
      <button type="button" class="hud-corner-exit hud-report-exit"></button>
    `
    parent.appendChild(this.el)

    this.masteryList = this.el.querySelector('.hud-mastery-list')!
    this.alignmentList = this.el.querySelector('.hud-alignment-list')!
    this.standardsEl = this.el.querySelector('.hud-report-standards')!

    this.el.querySelector('.hud-report-exit')!.addEventListener('click', () => {
      this.hide()
    })
  }

  setLocale(locale: Locale): void {
    this.locale = locale
    this.el.querySelector('.hud-hologram-title')!.textContent = t('progress.title', locale)
    this.el.querySelector('.hud-alignment-heading')!.textContent = t('progress.standardAlignment', locale)
    this.el.querySelector('.hud-report-exit')!.textContent = `◀ ${t('lesson.close', locale)}`
  }

  show(data: ProgressReportData): void {
    this.el.hidden = false
    this.masteryList.innerHTML = ''
    for (const line of data.masteryLines) {
      const li = document.createElement('li')
      li.className = 'hud-mastery-line'
      const met = line.percent >= 80
      li.innerHTML = `<span class="hud-mastery-topic">${line.topic}:</span> <span class="hud-mastery-pct ${met ? 'hud-met' : ''}">${Math.round(line.percent)}% ${t('progress.mastery', this.locale)}</span>`
      this.masteryList.appendChild(li)
    }

    this.alignmentList.innerHTML = ''
    for (const line of data.alignmentLines) {
      const li = document.createElement('li')
      li.className = 'hud-alignment-line'
      const status = line.met ? t('progress.alignmentMet', this.locale) : t('progress.alignmentPending', this.locale)
      li.innerHTML = `<span class="hud-alignment-label">${line.label}</span> <span class="hud-alignment-status ${line.met ? 'hud-met' : ''}">${status}</span>`
      this.alignmentList.appendChild(li)
    }

    if (data.standardsCodes) {
      this.standardsEl.textContent = data.standardsCodes
      this.standardsEl.hidden = false
    } else {
      this.standardsEl.hidden = true
    }
  }

  hide(): void {
    this.el.hidden = true
  }

  isVisible(): boolean {
    return !this.el.hidden
  }
}
