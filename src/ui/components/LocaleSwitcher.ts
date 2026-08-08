import type { Locale } from '../../content/types'
import { t } from '../i18n'

const LOCALES: Locale[] = ['en', 'es', 'pl']

export class LocaleSwitcher {
  readonly el: HTMLElement
  private locale: Locale = 'en'
  private onChange?: (locale: Locale) => void

  constructor(parent: HTMLElement) {
    this.el = document.createElement('div')
    this.el.className = 'hud-locale-switcher interactive'
    this.el.innerHTML = LOCALES.map((l) => `<button type="button" class="hud-locale-btn" data-locale="${l}"></button>`).join('')
    parent.appendChild(this.el)

    for (const btn of this.el.querySelectorAll<HTMLButtonElement>('.hud-locale-btn')) {
      btn.addEventListener('click', () => {
        const next = btn.dataset.locale as Locale
        this.setLocale(next)
        this.onChange?.(next)
      })
    }
    this.setLocale('en')
  }

  setOnChange(fn: (locale: Locale) => void): void {
    this.onChange = fn
  }

  getLocale(): Locale {
    return this.locale
  }

  setLocale(locale: Locale): void {
    this.locale = locale
    for (const btn of this.el.querySelectorAll<HTMLButtonElement>('.hud-locale-btn')) {
      const l = btn.dataset.locale as Locale
      btn.textContent = t('locale.label', l)
      btn.classList.toggle('hud-locale-active', l === locale)
      btn.setAttribute('aria-pressed', String(l === locale))
    }
  }
}
