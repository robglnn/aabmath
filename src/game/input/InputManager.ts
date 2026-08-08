export interface MoveInput {
  x: number
  y: number
}

export interface LookInput {
  dx: number
  dy: number
}

export interface InputManagerOptions {
  /** When false, HUD dig controls drive stick/fire via setExternal*. Default true. */
  mountTouch?: boolean
}

export class InputManager {
  private keys = new Set<string>()
  private fireHeld = false
  private firePressed = false
  private lookDelta = { dx: 0, dy: 0 }
  private moveStick = { x: 0, y: 0 }
  private pointerDown = false
  private lastPointer = { x: 0, y: 0 }
  private lookPointerId: number | null = null

  constructor(
    private canvas: HTMLCanvasElement,
    private hudRoot: HTMLElement,
    options: InputManagerOptions = {},
  ) {
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
    window.addEventListener('blur', this.onBlur)

    canvas.addEventListener('pointerdown', this.onPointerDown)
    canvas.addEventListener('pointermove', this.onPointerMove)
    canvas.addEventListener('pointerup', this.onPointerUp)
    canvas.addEventListener('pointercancel', this.onPointerUp)

    if (options.mountTouch !== false) {
      this.mountTouchControls()
    }
  }

  /** Feed HUD virtual joystick (x/y in [-1,1], y forward negative like WASD). */
  setExternalMove(x: number, y: number): void {
    this.moveStick.x = x
    this.moveStick.y = y
  }

  setExternalFire(held: boolean): void {
    if (held && !this.fireHeld) this.firePressed = true
    this.fireHeld = held
  }

  dispose(): void {
    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('keyup', this.onKeyUp)
    window.removeEventListener('blur', this.onBlur)
    this.canvas.removeEventListener('pointerdown', this.onPointerDown)
    this.canvas.removeEventListener('pointermove', this.onPointerMove)
    this.canvas.removeEventListener('pointerup', this.onPointerUp)
    this.canvas.removeEventListener('pointercancel', this.onPointerUp)
    this.joystickEl?.remove()
    this.fireBtn?.remove()
  }

  /** Call once per frame before reading input. */
  beginFrame(): void {
    this.firePressed = false
    this.lookDelta.dx = 0
    this.lookDelta.dy = 0
  }

  getMove(): MoveInput {
    let x = this.moveStick.x
    let y = this.moveStick.y

    if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) x -= 1
    if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) x += 1
    if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) y -= 1
    if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) y += 1

    const len = Math.hypot(x, y)
    if (len > 1) {
      x /= len
      y /= len
    }
    return { x, y }
  }

  getLook(): LookInput {
    return { ...this.lookDelta }
  }

  isFireHeld(): boolean {
    return this.fireHeld || this.keys.has('Space')
  }

  consumeFirePressed(): boolean {
    const v = this.firePressed || this.keys.has('Space')
    this.firePressed = false
    return v
  }

  // --- keyboard ---
  private onKeyDown = (e: KeyboardEvent): void => {
    this.keys.add(e.code)
    if (e.code === 'Space') {
      this.fireHeld = true
      this.firePressed = true
    }
  }

  private onKeyUp = (e: KeyboardEvent): void => {
    this.keys.delete(e.code)
    if (e.code === 'Space') this.fireHeld = false
  }

  private onBlur = (): void => {
    this.keys.clear()
    this.fireHeld = false
    this.moveStick.x = 0
    this.moveStick.y = 0
  }

  // --- mouse look (PC drag on canvas) ---
  private onPointerDown = (e: PointerEvent): void => {
    if (e.target !== this.canvas) return
    if (this.joystickActive) return
    this.pointerDown = true
    this.lookPointerId = e.pointerId
    this.lastPointer.x = e.clientX
    this.lastPointer.y = e.clientY
    this.canvas.setPointerCapture(e.pointerId)
  }

  private onPointerMove = (e: PointerEvent): void => {
    if (!this.pointerDown || e.pointerId !== this.lookPointerId) return
    const dx = e.clientX - this.lastPointer.x
    const dy = e.clientY - this.lastPointer.y
    this.lastPointer.x = e.clientX
    this.lastPointer.y = e.clientY
    this.lookDelta.dx += dx
    this.lookDelta.dy += dy
  }

  private onPointerUp = (e: PointerEvent): void => {
    if (e.pointerId === this.lookPointerId) {
      this.pointerDown = false
      this.lookPointerId = null
      try {
        this.canvas.releasePointerCapture(e.pointerId)
      } catch {
        /* ignore */
      }
    }
  }

  // --- touch joystick + fire button ---
  private joystickEl: HTMLDivElement | null = null
  private fireBtn: HTMLButtonElement | null = null
  private joystickActive = false
  private joystickPointerId: number | null = null
  private joystickCenter = { x: 0, y: 0 }
  private readonly JOY_RADIUS = 52

  private mountTouchControls(): void {
    const joy = document.createElement('div')
    joy.className = 'interactive touch-joystick'
    joy.innerHTML = '<div class="touch-joystick__knob"></div>'
    this.hudRoot.appendChild(joy)
    this.joystickEl = joy

    const fire = document.createElement('button')
    fire.type = 'button'
    fire.className = 'interactive touch-fire'
    fire.textContent = 'FIRE LASER'
    fire.addEventListener('pointerdown', (e) => {
      e.preventDefault()
      this.fireHeld = true
      this.firePressed = true
    })
    fire.addEventListener('pointerup', () => {
      this.fireHeld = false
    })
    fire.addEventListener('pointerleave', () => {
      this.fireHeld = false
    })
    this.hudRoot.appendChild(fire)
    this.fireBtn = fire

    joy.addEventListener('pointerdown', this.onJoystickDown)
    joy.addEventListener('pointermove', this.onJoystickMove)
    joy.addEventListener('pointerup', this.onJoystickUp)
    joy.addEventListener('pointercancel', this.onJoystickUp)
  }

  private onJoystickDown = (e: PointerEvent): void => {
    e.preventDefault()
    this.joystickActive = true
    this.joystickPointerId = e.pointerId
    const rect = this.joystickEl!.getBoundingClientRect()
    this.joystickCenter.x = rect.left + rect.width / 2
    this.joystickCenter.y = rect.top + rect.height / 2
    this.updateJoystick(e.clientX, e.clientY)
    this.joystickEl!.setPointerCapture(e.pointerId)
  }

  private onJoystickMove = (e: PointerEvent): void => {
    if (!this.joystickActive || e.pointerId !== this.joystickPointerId) return
    e.preventDefault()
    this.updateJoystick(e.clientX, e.clientY)
  }

  private onJoystickUp = (e: PointerEvent): void => {
    if (e.pointerId !== this.joystickPointerId) return
    this.joystickActive = false
    this.joystickPointerId = null
    this.moveStick.x = 0
    this.moveStick.y = 0
    const knob = this.joystickEl?.querySelector<HTMLElement>('.touch-joystick__knob')
    if (knob) {
      knob.style.transform = 'translate(-50%, -50%)'
    }
    try {
      this.joystickEl?.releasePointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
  }

  private updateJoystick(clientX: number, clientY: number): void {
    let dx = clientX - this.joystickCenter.x
    let dy = clientY - this.joystickCenter.y
    const dist = Math.hypot(dx, dy)
    if (dist > this.JOY_RADIUS) {
      dx = (dx / dist) * this.JOY_RADIUS
      dy = (dy / dist) * this.JOY_RADIUS
    }
    this.moveStick.x = dx / this.JOY_RADIUS
    this.moveStick.y = dy / this.JOY_RADIUS

    const knob = this.joystickEl?.querySelector<HTMLElement>('.touch-joystick__knob')
    if (knob) {
      knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`
    }
  }
}
