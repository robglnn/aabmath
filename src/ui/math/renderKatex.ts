import katex from 'katex'

/** Render KaTeX into a target element; returns whether render succeeded. */
export function renderKatex(target: HTMLElement, latex: string, displayMode = true): boolean {
  try {
    katex.render(latex, target, {
      displayMode,
      throwOnError: false,
      trust: false,
    })
    return true
  } catch {
    target.textContent = latex
    return false
  }
}
