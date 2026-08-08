import type { Locale } from '../../content/types'
import { t } from '../i18n'
import type { DigControlsCallbacks } from '../types'

export class TouchControls {
  readonly el: HTMLElement
  private toastEl: HTMLElement
  private joystickZone: HTMLElement
  private joystickKnob: HTMLElement
  private locale: Locale = 'en'
  private callbacks: DigControlsCallbacks = {}
  private pointerId: number | null = null
  private joystickCenter = { x: 0, y: 0 }
  private readonly maxRadius = 48

  constructor(parent: HTMLElement) {
    this.el = document.createElement('div')
    this.el.className = 'hud-screen hud-dig-controls'
    this.el.hidden = true
    this.el.innerHTML = `
      <div class="hud-unlock-toast" hidden></div>
      <div class="hud-dig-bottom">
        <div class="hud-joystick-zone interactive">
          <div class="hud-radar-stub">
            <div class="hud-radar-sweep"></div>
            <div class="hud-radar-blip"></div>
          </div>
          <div class="hud-joystick-knob"></div>
        </div>
        <div class="hud-dig-actions">
          <button type="button" class="hud-btn hud-btn-move interactive"></button>
          <button type="button" class="hud-btn hud-btn-laser interactive"></button>
        </div>
      </div>
    `
    parent.appendChild(this.el)

    this.toastEl = this.el.querySelector('.hud-unlock-toast')!
    this.joystickZone = this.el.querySelector('.hud-joystick-zone')!
    this.joystickKnob = this.el.querySelector('.hud-joystick-knob')!

    const moveBtn = this.el.querySelector('.hud-btn-move') as HTMLButtonElement
    const laserBtn = this.el.querySelector('.hud-btn-laser') as HTMLButtonElement

    moveBtn.addEventListener('pointerdown', () => this.callbacks.onMove?.(true))
    moveBtn.addEventListener('pointerup', () => this.callbacks.onMove?.(false))
    moveBtn.addEventListener('pointerleave', () => this.callbacks.onMove?.(false))
    laserBtn.addEventListener('pointerdown', (e) => {
      e.preventDefault()
      this.callbacks.onFireLaser?.(true)
    })
    laserBtn.addEventListener('pointerup', () => this.callbacks.onFireLaser?.(false))
    laserBtn.addEventListener('pointerleave', () => this.callbacks.onFireLaser?.(false))
    laserBtn.addEventListener('pointercancel', () => this.callbacks.onFireLaser?.(false))

    this.joystickZone.addEventListener('pointerdown', this.onJoystickDown)
    this.joystickZone.addEventListener('pointermove', this.onJoystickMove)
    this.joystickZone.addEventListener('pointerup', this.onJoystickUp)
    this.joystickZone.addEventListener('pointercancel', this.onJoystickUp)
  }

  setCallbacks(callbacks: DigControlsCallbacks): void {
    this.callbacks = callbacks
  }

  setLocale(locale: Locale): void {
    this.locale = locale
    this.el.querySelector('.hud-btn-move')!.textContent = t('dig.move', locale)
    this.el.querySelector('.hud-btn-laser')!.textContent = t('dig.fireLaser', locale)
  }

  show(): void {
    this.el.hidden = false
  }

  hide(): void {
    this.el.hidden = true
    this.resetJoystick()
    this.hideUnlockToast()
  }

  isVisible(): boolean {
    return !this.el.hidden
  }

  showUnlockToast(topic: string): void {
    this.toastEl.textContent = `${topic.toUpperCase()} ${t('dig.unlocked', this.locale)}`
    this.toastEl.hidden = false
    this.toastEl.classList.add('hud-toast-visible')
  }

  hideUnlockToast(): void {
    this.toastEl.hidden = true
    this.toastEl.classList.remove('hud-toast-visible')
  }

  private onJoystickDown = (e: PointerEvent): void => {
    if (this.pointerId !== null) return
    this.pointerId = e.pointerId
    this.joystickZone.setPointerCapture(e.pointerId)
    const rect = this.joystickZone.getBoundingClientRect()
    this.joystickCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
    this.updateJoystick(e.clientX, e.clientY)
  }

  private onJoystickMove = (e: PointerEvent): void => {
    if (e.pointerId !== this.pointerId) return
    this.updateJoystick(e.clientX, e.clientY)
  }

  private onJoystickUp = (e: PointerEvent): void => {
    if (e.pointerId !== this.pointerId) return
    this.pointerId = null
    this.resetJoystick()
    try {
      this.joystickZone.releasePointerCapture(e.pointerId)
    } catch {
      /* already released */
    }
  }

  private updateJoystick(clientX: number, clientY: number): void {
    const dx = clientX - this.joystickCenter.x
    const dy = clientY - this.joystickCenter.y
    const dist = Math.hypot(dx, dy)
    const clamped = dist > this.maxRadius ? this.maxRadius / dist : 1
    const nx = (dx * clamped) / this.maxRadius
    const ny = (dy * clamped) / this.maxRadius

    this.joystickKnob.style.transform = `translate(calc(-50% + ${nx * this.maxRadius}px), calc(-50% + ${ny * this.maxRadius}px))`
    this.callbacks.onJoystick?.(nx, ny)
  }

  private resetJoystick(): void {
    this.joystickKnob.style.transform = 'translate(-50%, -50%)'
    this.callbacks.onJoystick?.(0, 0)
  }
}
