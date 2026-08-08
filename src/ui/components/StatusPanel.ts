import type { Locale } from '../../content/types'
import { t } from '../i18n'
import type { HudStats } from '../types'

export class StatusPanel {
  readonly el: HTMLElement
  private rankEl: HTMLElement
  private scoreEl: HTMLElement
  private progressEl: HTMLElement
  private progressRow: HTMLElement

  constructor(parent: HTMLElement) {
    this.el = document.createElement('div')
    this.el.className = 'hud-status-panel'
    this.el.innerHTML = `
      <div class="hud-status-row"><span class="hud-label"></span> <span class="hud-rank"></span></div>
      <div class="hud-status-row"><span class="hud-label-score"></span> <span class="hud-score"></span></div>
      <div class="hud-status-row hud-progress-row"><span class="hud-label-progress"></span> <span class="hud-progress"></span></div>
    `
    parent.appendChild(this.el)
    this.rankEl = this.el.querySelector('.hud-rank')!
    this.scoreEl = this.el.querySelector('.hud-score')!
    this.progressEl = this.el.querySelector('.hud-progress')!
    this.progressRow = this.el.querySelector('.hud-progress-row')!
  }

  setLocale(locale: Locale): void {
    this.el.querySelector('.hud-label')!.textContent = `${t('hud.rank', locale)}:`
    this.el.querySelector('.hud-label-score')!.textContent = `${t('hud.score', locale)}:`
    this.el.querySelector('.hud-label-progress')!.textContent = `${t('hud.progress', locale)}:`
  }

  update(stats: HudStats, showProgress = true): void {
    this.rankEl.textContent = stats.rank
    this.scoreEl.textContent = String(stats.score).padStart(5, '0')
    this.progressEl.textContent = `${Math.round(stats.progressPercent)}%`
    this.progressRow.hidden = !showProgress
  }

  setVisible(visible: boolean): void {
    this.el.hidden = !visible
  }
}
