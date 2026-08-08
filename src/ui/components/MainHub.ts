import type { Locale } from '../../content/types'
import { t, type I18nKey } from '../i18n'
import type { MainHubData, MainHubModule } from '../types'

const DEFAULT_MODULES: MainHubModule[] = [
  { id: 'algebra1', labelKey: 'hub.algebra1', playable: true },
  { id: 'algebra2', labelKey: 'hub.algebra2', playable: false },
  { id: 'trig', labelKey: 'hub.trig', playable: false },
  { id: 'geometry', labelKey: 'hub.geometry', playable: false },
]

export class MainHub {
  readonly el: HTMLElement
  private moduleList: HTMLElement
  private locale: Locale = 'en'
  private onModuleSelect?: (moduleId: string) => void

  constructor(parent: HTMLElement) {
    this.el = document.createElement('div')
    this.el.className = 'hud-screen hud-main-hub'
    this.el.hidden = true
    this.el.innerHTML = `
      <div class="hud-hub-vista">
        <div class="hud-radar-corner">
          <div class="hud-radar-stub hud-radar-hub">
            <div class="hud-radar-sweep"></div>
            <div class="hud-radar-blip"></div>
          </div>
        </div>
        <div class="hud-hub-float interactive">
          <h2 class="hud-hub-title"></h2>
          <p class="hud-hub-subtitle"></p>
          <ul class="hud-module-list"></ul>
        </div>
      </div>
    `
    parent.appendChild(this.el)

    this.moduleList = this.el.querySelector('.hud-module-list')!
  }

  setCallbacks(onModuleSelect?: (moduleId: string) => void): void {
    this.onModuleSelect = onModuleSelect
  }

  setLocale(locale: Locale): void {
    this.locale = locale
    this.el.querySelector('.hud-hub-title')!.textContent = t('hub.title', locale)
    this.el.querySelector('.hud-hub-subtitle')!.textContent = t('hub.selectModule', locale)
  }

  show(data: MainHubData = {}): void {
    this.el.hidden = false
    const modules = data.modules ?? DEFAULT_MODULES
    this.moduleList.innerHTML = ''

    for (const mod of modules) {
      const li = document.createElement('li')
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.className = `hud-module-row ${mod.playable ? 'hud-module-playable' : 'hud-module-locked'}`
      btn.textContent = t(mod.labelKey as I18nKey, this.locale)

      if (mod.playable) {
        btn.addEventListener('click', () => this.onModuleSelect?.(mod.id))
      } else {
        btn.disabled = true
      }

      li.appendChild(btn)
      this.moduleList.appendChild(li)
    }
  }

  hide(): void {
    this.el.hidden = true
  }

  isVisible(): boolean {
    return !this.el.hidden
  }
}
