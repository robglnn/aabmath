import './style.css'
import { GameApp } from './game/GameApp'

const canvas = document.querySelector<HTMLCanvasElement>('#game-canvas')
const hudRoot = document.querySelector<HTMLDivElement>('#hud-root')

if (!canvas || !hudRoot) {
  throw new Error('Missing #game-canvas or #hud-root')
}

const app = new GameApp(canvas, hudRoot)
app.start()

// HMR-friendly
if (import.meta.hot) {
  import.meta.hot.dispose(() => app.dispose())
}
