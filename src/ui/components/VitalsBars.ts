import type { Locale } from '../../content/types'
import { t } from '../i18n'
import type { HudStats } from '../types'

export class VitalsBars {
  readonly el: HTMLElement
  private healthFill: HTMLElement
  private energyFill: HTMLElement
  private trigFill: HTMLElement

  constructor(parent: HTMLElement) {
    this.el = document.createElement('div')
    this.el.className = 'hud-vitals'
    this.el.innerHTML = `
      <div class="hud-vital-row">
        <span class="hud-vital-icon hud-icon-heart" aria-hidden="true">♥</span>
        <div class="hud-vital-track"><div class="hud-vital-fill hud-fill-health"></div></div>
      </div>
      <div class="hud-vital-row">
        <span class="hud-vital-icon hud-icon-energy" aria-hidden="true">⚡</span>
        <div class="hud-vital-track"><div class="hud-vital-fill hud-fill-energy"></div></div>
      </div>
      <div class="hud-vital-row">
        <span class="hud-vital-label hud-label-trig"></span>
        <div class="hud-vital-track"><div class="hud-vital-fill hud-fill-trig"></div></div>
      </div>
    `
    parent.appendChild(this.el)
    this.healthFill = this.el.querySelector('.hud-fill-health')!
    this.energyFill = this.el.querySelector('.hud-fill-energy')!
    this.trigFill = this.el.querySelector('.hud-fill-trig')!
  }

  setLocale(locale: Locale): void {
    this.el.querySelector('.hud-label-trig')!.textContent = t('hud.trig', locale)
  }

  update(stats: HudStats): void {
    this.healthFill.style.width = `${clamp(stats.health)}%`
    this.energyFill.style.width = `${clamp(stats.energy)}%`
    this.trigFill.style.width = `${clamp(stats.trigMeter)}%`
  }

  setVisible(visible: boolean): void {
    this.el.hidden = !visible
  }
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, n))
}
